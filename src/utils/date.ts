/**
 * Utilitas tanggal bersama — LifeOS
 *
 * Sumber tunggal untuk pemformatan dan manipulasi tanggal.
 * Menggantikan lebih dari 18 implementasi terpisah di berbagai halaman.
 */

const DAYS_SHORT = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/**
 * Uraikan string tanggal dengan cara yang aman untuk Safari.
 * Safari menolak `new Date('2026-02-21 10:00')`; gunakan format ISO dengan pemisah T.
 * Fungsi ini menormalkan tanggal-waktu yang dipisahkan spasi menjadi format ISO.
 */
export function safeDateParse(dateStr: string): Date {
  if (!dateStr) return new Date();
  // Ganti pemisah spasi dengan T agar sesuai ISO (persyaratan Safari).
  const normalised = dateStr.replace(/^(\d{4}-\d{2}-\d{2})\s+(\d)/, '$1T$2');
  return new Date(normalised);
}

/**
 * Pembungkus penyimpanan yang aman untuk menangani mode privat Safari,
 * yang dapat melempar galat saat setItem/removeItem dipanggil.
 */
export function safeStorage(op: 'get', key: string): string | null;
export function safeStorage(op: 'set', key: string, value: string): void;
export function safeStorage(op: 'remove', key: string): void;
export function safeStorage(op: 'get' | 'set' | 'remove', key: string, value?: string): string | null | void {
  try {
    switch (op) {
      case 'get': return localStorage.getItem(key);
      case 'set': localStorage.setItem(key, value!); return;
      case 'remove': localStorage.removeItem(key); return;
    }
  } catch {
    // Mode privat Safari dapat melempar galat saat menulis ke penyimpanan.
    if (op === 'get') return null;
  }
}

/**
 * Format objek Date menjadi string lokal YYYY-MM-DD (tanpa pergeseran zona waktu).
 */
export function localDateStr(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Format tanggal untuk ditampilkan: "Hari Ini", "Kemarin", "Besok", atau "RAB, 14 Feb".
 */
export function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00'); // Gunakan tengah hari untuk menghindari pergeseran zona waktu.
  const now = new Date();
  const todayIso = localDateStr(now);
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  const tom = new Date(now); tom.setDate(now.getDate() + 1);
  if (iso === todayIso) return 'Hari Ini';
  if (iso === localDateStr(yest)) return 'Kemarin';
  if (iso === localDateStr(tom)) return 'Besok';
  return `${DAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/**
 * Ambil HH:MM dari string tanggal-waktu ISO.
 */
export function formatTime(isoDatetime: string): string {
  if (!isoDatetime) return '--:--';
  const timePart = isoDatetime.split('T')[1];
  return timePart ? timePart.substring(0, 5) : '--:--';
}

/**
 * Format tanggal menjadi keterangan waktu relatif singkat.
 */
export function formatRelative(isoDatetime: string): string {
  const target = new Date(isoDatetime);
  const now = new Date();
  const diffMs = now.getTime() - target.getTime();
  const absDiff = Math.abs(diffMs);
  const isPast = diffMs > 0;

  if (absDiff < 60_000) return 'baru saja';

  const mins = Math.floor(absDiff / 60_000);
  if (mins < 60) return isPast ? `${mins} menit lalu` : `dalam ${mins} menit`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return isPast ? `${hours} jam lalu` : `dalam ${hours} jam`;

  const days = Math.floor(hours / 24);
  if (days < 7) return isPast ? `${days} hari lalu` : `dalam ${days} hari`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return isPast ? `${weeks} minggu lalu` : `dalam ${weeks} minggu`;

  const months = Math.floor(days / 30);
  return isPast ? `${months} bulan lalu` : `dalam ${months} bulan`;
}

/**
 * Format durasi dalam menit menjadi teks yang mudah dibaca.
 */
export function formatDuration(minutes: number): string {
  if (minutes < 1) return '0 menit';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} menit`;
  if (m === 0) return `${h} jam`;
  return `${h} jam ${m} menit`;
}

/**
 * Ambil nama singkat hari dari objek Date: "SEN", "SEL", dan seterusnya.
 */
export function getDayName(d: Date): string {
  return DAYS_SHORT[d.getDay()];
}

/**
 * Get the Monday-to-Sunday week range for a given date.
 * Returns array of { day, date, fullDate, isToday }.
 */
export function getWeekRange(referenceDate: Date = new Date()): {
  day: string;
  date: number;
  fullDate: string;
  isToday: boolean;
  isPast: boolean;
}[] {
  const now = new Date();
  const todayStr = now.toDateString();
  const dow = referenceDate.getDay();
  const mon = new Date(referenceDate);
  mon.setDate(referenceDate.getDate() - ((dow + 6) % 7));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    const isToday = d.toDateString() === todayStr;
    return {
      day: DAYS_SHORT[d.getDay()],
      date: d.getDate(),
      fullDate: localDateStr(d),
      isToday,
      isPast: !isToday && d < now,
    };
  });
}

/**
 * Get the first day of the current month as YYYY-MM-DD.
 */
export function startOfMonth(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * Get the start of the ISO week (Monday) for a given date.
 */
export function startOfWeek(d: Date = new Date()): Date {
  const result = new Date(d);
  const day = result.getDay();
  const diff = day === 0 ? 6 : day - 1;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Days from now to a date string. Positive = future, negative = past.
 */
export function daysFromNow(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86_400_000);
}

/**
 * Format tanggal untuk tampilan singkat berbahasa Indonesia, misalnya "14 Feb".
 */
export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

/**
 * Get the greeting based on time of day.
 */
export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Masih terjaga';
  if (h < 12) return 'Selamat pagi';
  if (h < 17) return 'Selamat siang';
  if (h < 21) return 'Selamat sore';
  return 'Masih terjaga';
}

/**
 * Check if an hour is nighttime (for moon/sun icon logic).
 */
export function isNightTime(): boolean {
  const h = new Date().getHours();
  return h < 6 || h >= 21;
}

export function isMorning(): boolean {
  const h = new Date().getHours();
  return h >= 6 && h < 12;
}

/**
 * Generate a UUID using the native crypto API with fallback for older browsers.
 * Compatible with Safari 15.4+, older browsers get timestamp-based UUID.
 */
export function genId(): string {
  // Check if crypto.randomUUID is available (Safari 15.4+, Chrome 92+, Firefox 95+)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers (polyfill)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Format a number as AUD currency: "$1,234.56"
 */
export function fmtCurrency(n: number): string {
  const abs = Math.abs(n);
  return `$${abs.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format a number as short currency: "$1.2k", "$1.5M"
 */
export function fmtCurrencyShort(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

/**
 * Today as YYYY-MM-DD string (alias for localDateStr with no args).
 */
export function todayStr(): string {
  return localDateStr();
}

/**
 * Current month as YYYY-MM string.
 */
export function thisMonth(): string {
  return new Date().toISOString().slice(0, 7);
}
