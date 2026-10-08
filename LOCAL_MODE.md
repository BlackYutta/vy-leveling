# Mode Lokal LifeOS

> Jalankan LifeOS sepenuhnya secara lokal menggunakan Flask API, tanpa Supabase.

## Ringkasan

LifeOS awalnya dibangun menggunakan Supabase (PostgreSQL + Auth + Realtime). Lapisan adapter ini mengganti Supabase dengan Flask API lokal agar aplikasi dapat beroperasi secara luring.

Sebanyak **152 berkas** merujuk ke Supabase di seluruh basis kode. Migrasi ini menggunakan adapter pengganti yang meniru antarmuka kueri berantai Supabase.

## Arsitektur

```
Sebelum: React App → Supabase JS Client → Supabase Cloud (PostgreSQL)
Sesudah: React App → Local API Adapter → Flask API (localhost:8080) → SQLite/PostgreSQL
```

### Berkas yang Dibuat

| Berkas | Kegunaan |
|------|---------|
| `src/lib/local-api.ts` | Adapter pengganti untuk `src/lib/supabase.ts` |
| `scripts/localize.sh` | Skrip pencarian dan penggantian (dapat dibatalkan dengan berkas `.bak`) |
| `.env.local` | Konfigurasi lingkungan untuk mode lokal |
| `LOCAL_MODE.md` | Dokumentasi ini |

## Cara Kerja Adapter

### Pembuat Kueri (berantai dan kompatibel dengan Supabase)

Adapter ini meniru pembuat kueri PostgREST milik Supabase. Semua rantai bersifat **lazy** — permintaan baru dijalankan ketika di-`await`:

```typescript
// Contoh berikut bekerja seperti pada Supabase:
const { data, error } = await supabase.from('tasks').select('*').eq('status', 'active');
const { data, error } = await supabase.from('tasks').insert({ title: 'New' }).select().single();
const { data, error } = await supabase.from('tasks').update({ done: true }).eq('id', '123');
const { data, error } = await supabase.from('tasks').delete().eq('id', '123');
const { data, error } = await supabase.from('tasks').upsert(data, { onConflict: 'id' });
const { data, error } = await supabase.rpc('get_table_columns', { table_names: ['tasks'] });
```

### Metode filter yang didukung

`.eq()` `.neq()` `.gt()` `.gte()` `.lt()` `.lte()` `.like()` `.ilike()` `.is()` `.not()` `.in()` `.contains()` `.or()` `.filter()`

### Modifier yang didukung

`.order()` `.limit()` `.range()` `.single()` `.maybeSingle()` `.select('columns')`

### Autentikasi (autentikasi lokal sederhana)

```typescript
await supabase.auth.signUp({ email, password });
await supabase.auth.signInWithPassword({ email, password });
await supabase.auth.signOut();
await supabase.auth.getUser();
await supabase.auth.getSession();
supabase.auth.onAuthStateChange((event, session) => { ... });
```

Penyedia OAuth **tidak didukung** dalam mode lokal; adapter akan mengembalikan pesan kesalahan yang menjelaskan hal tersebut.

### Format respons

Semua respons mengikuti struktur Supabase:
```typescript
{ data: T | null, error: { message, details, hint, code } | null, status: number }
```

## Langkah Migrasi

### Langkah 1: Siapkan lingkungan
```bash
cp .env.local .env  # or merge into existing .env
```

### Langkah 2: Jalankan simulasi skrip migrasi
```bash
bash scripts/localize.sh
# Menampilkan perubahan yang akan dilakukan tanpa mengubah berkas
```

### Langkah 3: Terapkan migrasi
```bash
bash scripts/localize.sh --apply
# Membuat cadangan .bak dan mengganti import
```

### Langkah 4: Perbaikan manual yang diperlukan

Berkas berikut memerlukan penanganan manual:

#### `src/lib/systems/adapters/tcs.ts`
Memiliki `createClient()` sendiri untuk instans Supabase terpisah (data bisnis TCS). Pilihannya:
- Buat endpoint Flask API kedua untuk TCS
- Gabungkan tabel TCS ke Local API utama
- Tetap gunakan Supabase untuk TCS saat aplikasi utama berjalan secara lokal

#### `src/stores/useUserStore.ts`
Memuat penguraian kunci autentikasi khusus Supabase (`sb-${ref}-auth-token`). Adapter lokal menggunakan `local_auth_session` di localStorage. Pola listener status autentikasi tetap dipertahankan.

#### `src/lib/feature-gates.ts` dan `src/lib/local-db.ts`
Merujuk `VITE_SUPABASE_URL` untuk mengambil referensi proyek. Mode lokal tidak memerlukan URL atau kunci Supabase; client Supabase dibuat hanya saat fitur cloud digunakan.

### Langkah 5: Batalkan jika diperlukan
```bash
bash scripts/localize.sh --revert
# Restores all .bak files to their originals
```

## Persyaratan Flask API

Flask API lokal di `localhost:8080` harus menyediakan endpoint berikut:

### Endpoint data (per tabel)
```
GET    /api/{table}?select=...&column=op.value&order=...&limit=...
POST   /api/{table}                  → Insert row(s)
PATCH  /api/{table}?column=eq.value  → Update matching rows
PUT    /api/{table}?on_conflict=col  → Upsert
DELETE /api/{table}?column=eq.value  → Delete matching rows
```

### Format parameter kueri (gaya PostgREST)
```
?select=id,title,status          → Column selection
?status=eq.active                → Filter: column = value
?created_at=gte.2024-01-01      → Filter: column >= value
?id=in.(1,2,3)                  → Filter: column IN (values)
?order=created_at.desc          → Ordering
?limit=10&offset=20             → Pagination
?single=true                    → Return single object (not array)
```

### Endpoint RPC
```
POST /api/rpc/{function_name}    → body: { param1: val1, ... }
```

### Endpoint autentikasi
```
POST /api/auth/signup             → { email, password }
POST /api/auth/login              → { email, password }
POST /api/auth/logout             → (dengan header Authorization)
POST /api/auth/refresh            → { refresh_token }
GET  /api/auth/user               → (dengan header Authorization)
POST /api/auth/reset-password     → { email }
```

### Tabel yang digunakan LifeOS

Berdasarkan analisis basis kode, Flask API memerlukan tabel berikut:

| Tabel | Digunakan oleh |
|-------|---------|
| `tasks` | Tujuan, tugas, jadwal |
| `habits` | Pelacakan kebiasaan |
| `habit_logs` | Catatan penyelesaian kebiasaan |
| `goals` | Pelacakan tujuan |
| `health_metrics` | Data kesehatan/kebugaran |
| `schedule_events` | Kalender/jadwal |
| `event_completions` | Pelacakan penyelesaian acara |
| `journal_entries` | Jurnal |
| `income` | Keuangan — pemasukan |
| `expenses` | Keuangan — pengeluaran |
| `transactions` | Keuangan — transaksi |
| `unified_events` | Catatan acara lintas fitur |
| `user_profiles` | Preferensi/pengaturan pengguna |
| `ai_insights` | Wawasan yang dibuat AI |
| `rpg_characters` | RPG/gamifikasi |
| `ui_preferences` | Penyimpanan status antarmuka |

## Yang Belum Dimigrasikan

1. **Langganan realtime** — Kanal WebSocket realtime Supabase. Local API menggunakan polling sebagai gantinya.
2. **Row-Level Security (RLS)** — Flask API perlu menerapkan middleware autentikasinya sendiri.
3. **Penyimpanan (unggahan berkas)** — Jika digunakan, diperlukan solusi penyimpanan berkas lokal terpisah.
4. **Edge Functions** — Setiap Supabase Edge Function memerlukan padanan route Flask.

## Catatan Pengembangan

- Adapter otomatis menyertakan `Authorization: Bearer <token>` dari localStorage
- Helper `dedup()` tetap digunakan untuk mencegah permintaan duplikat
- Mode Local API tidak memerlukan `VITE_SUPABASE_URL` maupun `VITE_SUPABASE_ANON_KEY`
- Semua rantai kueri mengimplementasikan `PromiseLike` (thenable) agar dapat digunakan dengan `await`
