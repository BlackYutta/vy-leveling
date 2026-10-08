import { createClient } from '@supabase/supabase-js';

declare const __IS_TAURI__: boolean;
declare const __IS_ELECTRON__: boolean;
const _IS_TAURI = typeof __IS_TAURI__ !== 'undefined' && __IS_TAURI__;
const _IS_ELECTRON = typeof __IS_ELECTRON__ !== 'undefined' && __IS_ELECTRON__;
const _IS_LOCAL_API = import.meta.env.VITE_USE_LOCAL_API === 'true' ||
  Boolean(import.meta.env.VITE_API_BASE_URL);

// In Tauri mode, the Supabase cloud client is never used (data-access routes to
// tauri-api.ts). Use a dummy URL and disable all background network activity to
// prevent "Connection refused" errors from autoRefreshToken hitting localhost:8080.
// In Electron mode, we NEED the real Supabase client for Google OAuth token exchange.
const _NOOP_MODE = _IS_TAURI && !_IS_ELECTRON;
const SUPABASE_URL = _NOOP_MODE ? 'https://noop.invalid' : (import.meta.env.VITE_SUPABASE_URL || '');
const SUPABASE_ANON_KEY = _NOOP_MODE ? 'noop' : (import.meta.env.VITE_SUPABASE_ANON_KEY || '');

type SupabaseClient = ReturnType<typeof createClient>;
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    if (!_NOOP_MODE && !_IS_ELECTRON && _IS_LOCAL_API) {
      throw new Error(
        '[supabase] Supabase Cloud is disabled in Local API mode. Use the unified data-access adapter instead.'
      );
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error(
        '[supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required when using Supabase Cloud.'
      );
    }

    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: !_IS_TAURI,
        persistSession: !_IS_TAURI,
        detectSessionInUrl: !_IS_TAURI,
        // Keep session alive — refresh before expiry
        flowType: 'pkce',
      },
    });
  }
  return _client;
}

// data-access imports every adapter, so defer cloud-client construction until
// a cloud operation actually uses it. Local API mode needs no Supabase keys.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const client = getClient();
    const value = Reflect.get(client, property, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

// ═══════════════════════════════════════════════════════════
// Request Deduplication
// If the same query is already in-flight, return the existing promise
// ═══════════════════════════════════════════════════════════

const _inflight = new Map<string, { promise: Promise<unknown>; timestamp: number }>();
const DEDUP_TTL = 2000; // 2s — same query within 2s returns cached promise

/**
 * Deduplicated fetch — prevents identical Supabase queries from firing simultaneously.
 * Usage: const data = await dedup('tasks-list', () => supabase.from('tasks').select('*'));
 */
export function dedup<T>(key: string, queryFn: () => Promise<T>): Promise<T> {
  const existing = _inflight.get(key);
  if (existing && Date.now() - existing.timestamp < DEDUP_TTL) {
    return existing.promise as Promise<T>;
  }

  const promise = queryFn().finally(() => {
    // Clean up after resolution + TTL
    setTimeout(() => _inflight.delete(key), DEDUP_TTL);
  });

  _inflight.set(key, { promise, timestamp: Date.now() });
  return promise;
}
