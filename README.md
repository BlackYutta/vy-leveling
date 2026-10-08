<p align="center">
  <img src="public/icon-512.png" alt="LifeOS" width="120" />
</p>

<h1 align="center">LifeOS</h1>

<p align="center">
  <strong>Hidup adalah permainanmu. Naik level di dunia nyata.</strong>
</p>

<p align="center">
  <a href="https://app.runlifeos.com">Gunakan LifeOS Gratis</a> ·
  <a href="https://runlifeos.com">Situs Web</a> ·
  <a href="#menjalankan-sendiri">Jalankan Sendiri</a> ·
  <a href="#kontribusi">Berkontribusi</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.19.20-blue" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="Kontribusi PR diterima" />
  <img src="https://img.shields.io/badge/platform-PWA-orange" alt="PWA" />
</p>

---

LifeOS adalah sistem operasi pribadi sumber terbuka yang mengubah tujuan, kebiasaan, keuangan, kesehatan, dan jadwal harian Anda menjadi RPG yang hidup. Dibangun sebagai aplikasi web progresif (PWA) — dapat dipasang di perangkat apa pun, berfungsi luring, dan menyinkronkan data saat terhubung.

**514 komponen. Lebih dari 126.000 baris TypeScript. Satu aplikasi untuk mengelola hidup Anda.**

<br />

## Mengapa LifeOS?

Sebagian besar aplikasi produktivitas menyelesaikan satu masalah. LifeOS menghubungkan semuanya:

- **Tujuan** diuraikan menjadi tugas yang muncul di **jadwal**
- **Kebiasaan** menghasilkan XP untuk **karakter** yang naik level di **dunia** yang terus berkembang
- **Keuangan** dipantau bersama **kesehatan** agar Anda melihat gambaran utuh
- **Pendamping AI** memahami semuanya dan memberi arahan sesuai konteks
- **Jurnal** mencatat refleksi yang menjadi bahan **tinjauan mingguan**

Ini bukan sekadar daftar tugas. Ini adalah sistem yang menopang kehidupan Anda.

<br />

## Tangkapan Layar

<p align="center">
  <img src=".github/screenshots/mobile-dashboard.jpg" alt="Dashboard" width="300" />
  &nbsp;&nbsp;&nbsp;
  <img src=".github/screenshots/mobile-ai-chat.jpg" alt="AI Companion" width="300" />
</p>

<br />

## Fitur

### **Pusat Kendali**
Dasbor yang benar-benar berguna. Ringkasan pagi, jadwal hari ini, rangkaian kebiasaan, ikhtisar keuangan, dan progres tujuan — semuanya terlihat sekilas. Tata letak dapat disesuaikan sepenuhnya.

### **Mesin Tujuan**
Sistem tujuan bertingkat: Sasaran → Epik → Tujuan → Tugas. AI menguraikan rencana besar menjadi langkah-langkah terjadwal dan dapat dilakukan dalam rentang waktu yang realistis.

### **Jadwal Cerdas**
Perpaduan kalender dan pengelola tugas. Acara, tugas, dan kebiasaan dalam satu linimasa. Seret untuk menjadwalkan ulang, deteksi konflik, serta notifikasi tautan langsung yang menunjukkan hal yang perlu diperhatikan.

### **Pelacakan Kebiasaan**
Kebiasaan dengan rangkaian konsistensi dan hadiah XP. Taman kebiasaan tempat tanaman tumbuh saat Anda konsisten dan layu saat rangkaian terputus. Frekuensi, pengingat, dan analitik dapat disesuaikan.

### **Dasbor Keuangan**
Pantau pemasukan, pengeluaran, anggaran, dan kekayaan bersih. Rincian visual berdasarkan kategori, pemisahan keuangan bisnis dan pribadi, serta impor CSV untuk rekening koran.

### **Kesehatan dan Kebugaran**
Catat suasana hati, energi, tidur, stres, dan olahraga. Pemeriksaan terpandu serta hubungan antara metrik kesehatan dan pola produktivitas Anda.

### **Dunia LifeOS** *(Mesin RPG)*
Kehidupan nyata Anda ditampilkan sebagai dunia fantasi. Kelas, perlengkapan, dan statistik karakter berasal dari kebiasaan serta pencapaian nyata. Dilengkapi pendamping NPC, papan misi, musik prosedural, dan cuaca dinamis yang mencerminkan keadaan emosi Anda.

### **Junction** *(Praktik Spiritual)*
Pendamping spiritual lintas tradisi. Praktik harian, tradisi kebijaksanaan, teks suci, dan refleksi terpandu dari Kristen, Islam, Buddha, Hindu, Sikh, Tewahedo, dan tradisi lainnya.

### **Pendamping AI**
Obrolan AI yang memahami tujuan, jadwal, kebiasaan, dan riwayat Anda. Rencanakan sasaran, dapatkan arahan, uraikan proyek, buat rencana makan, dan optimalkan pekan Anda melalui percakapan alami.

### **Jurnal dan Tinjauan**
Jurnal harian dengan penanda suasana hati. Tinjauan mingguan untuk menemukan pola, merayakan pencapaian, dan menyusun ulang prioritas. Dilengkapi panduan refleksi.

### **Sosial dan Multipemain**
Guild, kemitraan, papan peringkat komunitas, dan tantangan bersama. Saling menjaga komitmen melalui kompetisi yang sehat.

### **Dapat Digunakan di Mana Saja**
Aplikasi Web Progresif — pasang di iOS, Android, Mac, Windows, atau Linux. Mengutamakan mode luring dengan IndexedDB dan menyinkronkan data di latar belakang saat terhubung. Tidak perlu toko aplikasi.

<br />

## Teknologi

| Layer | Technology |
|-------|-----------|
| Antarmuka | React 19 + TypeScript + Vite |
| Gaya | CSS (tanpa framework — dibuat khusus) |
| Status aplikasi | Zustand (9 store) |
| Backend | Supabase (Postgres + Auth + RLS) |
| Luring | IndexedDB dengan mesin sinkronisasi bertingkat |
| AI | OpenRouter (multi-model, melalui proksi server) |
| Deploy | Hasil build statis → CDN atau server apa pun |
| Autentikasi | Supabase Auth (Google OAuth + email) |

<br />

## Mulai Cepat

### Gunakan versi yang di-host (disarankan)

**[app.runlifeos.com](https://app.runlifeos.com)** — free, always up to date, no setup required.

Berfungsi di perangkat apa pun yang memiliki peramban. Pasang sebagai PWA untuk pengalaman seperti aplikasi native.

<br />

### Menjalankan Sendiri

Ingin menjalankan instans sendiri? LifeOS sepenuhnya bersifat sumber terbuka.

#### Prasyarat

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- An [OpenRouter](https://openrouter.ai) API key (for AI features)

#### Penyiapan

```bash
# Klon repositori
git clone https://github.com/lifeos-app/lifeos.git
cd lifeos

# Pasang dependensi
npm install

# Konfigurasikan lingkungan
cp .env.example .env
# Isi .env dengan URL Supabase, kunci anon, dan URL dasar API

# Jalankan server pengembangan
npm run dev
```

#### Variabel Lingkungan

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=https://your-server.com    # LLM proxy endpoint
```

#### Penyiapan Basis Data

Aplikasi menggunakan Supabase dengan Row Level Security. Berkas migrasi tersedia di `supabase/migrations/`. Siapkan skema dasar di proyek Supabase Anda — lihat [dokumentasi Supabase](https://supabase.com/docs) untuk memulai.

> **Catatan:** Berkas migrasi menangani perubahan bertahap. Jika membutuhkan bantuan untuk menyiapkan skema lengkap, [buat issue](https://github.com/lifeos-app/lifeos/issues) atau kunjungi diskusi komunitas.

#### Build Produksi

```bash
npm run build
# Deploy folder `dist/` ke layanan hosting statis apa pun
```

<br />

## Struktur Proyek

```
src/
├── components/     # 200+ React components
├── pages/          # 24 page-level views
├── stores/         # Zustand state management (9 stores)
├── lib/            # Core engines (sync, habits, finance, AI, gamification)
├── hooks/          # Custom React hooks
├── utils/          # Shared utilities
└── types/          # TypeScript definitions

public/
├── images/         # NPC artwork, custom illustrations
└── junction/       # Spiritual tradition assets
```

<br />

## Kontribusi

LifeOS dikembangkan oleh tim kecil dan menerima kontribusi dari siapa pun.

### Kontribusi yang cocok untuk pemula
- **Dokumentasi skema** — Bantu mendokumentasikan skema basis data lengkap untuk pengguna yang menjalankan sendiri
- **Perbaikan bug** — Lihat [issue terbuka](https://github.com/lifeos-app/lifeos/issues)
- **Integrasi baru** — Sistem plugin mendukung sumber data khusus
- **Terjemahan** — Bantu membuat LifeOS dapat digunakan dalam lebih banyak bahasa
- **UX seluler** — Penyempurnaan PWA untuk berbagai kondisi di iOS/Android

### Cara berkontribusi

1. Fork repositori
2. Buat branch fitur (`git checkout -b feature/your-feature`)
3. Buat perubahan
4. Ajukan PR dengan deskripsi yang jelas

<br />

## Peta Jalan

- [ ] Desktop app (Tauri)
- [ ] Telegram bot integration
- [ ] Plugin marketplace
- [ ] Shared goals & family accounts
- [ ] Wearable data import (Apple Health, Google Fit)
- [ ] Public API

<br />

## Lisensi

MIT — gunakan, fork, dan kembangkan.

<br />

---

<p align="center">
  <strong>Dibuat di Melbourne, Australia — bersama <a href="https://claude.ai/code">Claude Code</a></strong>
  <br />
  <a href="https://teddyscleaning.com.au">Teddy's Cleaning Systems</a> · <a href="https://app.runlifeos.com">Coba LifeOS</a>
</p>
