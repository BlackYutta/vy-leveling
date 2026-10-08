# DEVELOPMENT.md — Aturan Pengembangan LifeOS
> Versi: 1.0 | Dibuat: 2026-02-12
> ⚠️ BERKAS INI HARUS TETAP ADA SETELAH COMPACTION — berkas ini mengatur seluruh pengembangan LifeOS.

## Aturan Utama

### 1. Jangan Merusak Produksi
- **Branch `master` = produksi.** Kode yang di-deploy dan digunakan pengguna.
- **Branch `develop` = pekerjaan aktif.** Semua fitur baru masuk ke sini terlebih dahulu.
- **Branch fitur** (`feature/xyz`) dibuat dari `develop` dan digabungkan kembali ke `develop`.
- **Gabungkan `develop` → `master` hanya pada pencapaian besar**, setelah pengujian.

### 2. Migrasi Basis Data Sangat Penting
- **JANGAN PERNAH** mengubah tabel produksi langsung melalui dasbor Supabase.
- **SEMUA perubahan skema** harus melalui berkas migrasi bernomor.
- **Migrasi hanya boleh menambahkan:**
  - ✅ TAMBAHKAN kolom (dengan nilai bawaan agar baris lama tetap valid)
  - ✅ TAMBAHKAN tabel
  - ✅ TAMBAHKAN indeks dan kebijakan RLS
  - ❌ JANGAN PERNAH mengganti nama kolom (kueri yang ada akan rusak)
  - ❌ JANGAN PERNAH menghapus kolom atau tabel (data akan hilang)
  - ❌ JANGAN PERNAH mengubah tipe kolom (data yang ada bisa rusak)
- **Jika kolom harus diubah:** tambahkan kolom baru → migrasikan data → hentikan penggunaan kolom lama (3 langkah)
- Berkas migrasi: `sql/migrations/NNN_description.sql` (NNN = nomor urut)
- Setiap migrasi memiliki skrip pembatalan yang sesuai: `sql/rollbacks/NNN_description.sql`

### 3. Feature Flag
- Fitur baru harus dikendalikan oleh flag di `src/lib/feature-flags.ts`
- Nilai bawaan: NONAKTIF di produksi, AKTIF di pengembangan
- Aktifkan setelah fitur diuji dan siap
- Pengguna lama tidak boleh melihat fitur yang belum selesai

### 4. Jangan Sampai Ada Data Hilang
- Setiap deployment harus mempertahankan seluruh data pengguna yang ada
- Uji migrasi menggunakan salinan data produksi sebelum menerapkannya
- Supabase RLS (Row Level Security) harus tetap AKTIF — pengguna hanya boleh melihat datanya sendiri
- Jangan pernah menggunakan `DELETE FROM` atau `TRUNCATE` dalam migrasi

### 5. Proses Deployment
```bash
# Dari lifeos-app/
# 1. Buat build
npm run build

# 2. Deploy ke AWS (ke kedua jalur!)
scp -i ~/.ssh/your-key.pem -r dist/* YOUR_USER@YOUR_SERVER_IP:/tmp/lifeos-deploy/
ssh -i ~/.ssh/your-key.pem YOUR_USER@YOUR_SERVER_IP '
  sudo cp -r /tmp/lifeos-deploy/* /your/deploy/path/
  sudo cp -r /tmp/lifeos-deploy/* /your/deploy/path/
  rm -rf /tmp/lifeos-deploy
'

# 3. Verifikasi
curl -s -o /dev/null -w "%{http_code}" https://app.runlifeos.com
```

### 6. Alur Kerja Git
```
master ──────────────────────── (production, tagged releases)
  │
  └── develop ───────────────── (integration branch)
        │
        ├── feature/onboarding   (feature work)
        ├── feature/ai-chat
        └── fix/schedule-bug
```

**Pesan commit:** Gunakan format konvensional:
- `feat:` fitur baru
- `fix:` perbaikan bug
- `schema:` migrasi basis data
- `deploy:` perubahan terkait deployment
- `docs:` dokumentasi

**Tag:** `v0.4.0`, `v0.5.0`, dan seterusnya pada setiap pencapaian besar di `master`.

## Kondisi Saat Ini (per 2026-02-12)

### Repositori
| Repo | Branch | Purpose |
|------|--------|---------|
| `lifeos-app` | master/develop | Aplikasi web (Vite + React + TS + Supabase) |
| `lifeos` | master | Aplikasi seluler (Expo + React Native + Supabase) |
| `lifeos-website` | master | Halaman utama (HTML statis) |

### Infrastruktur
- **Supabase:** proyek `YOUR_PROJECT_REF` (produksi)
- **AWS Lightsail:** YOUR_SERVER_IP (hosting web)
- **Domain:** runlifeos.com, lifeos.com.au, app.runlifeos.com
- **Pengguna produksi:** 4 akun
- **Tabel:** 11 aktif

### Dua Jalur Deployment (PENTING)
Aplikasi web disajikan dari DUA jalur di AWS:
- `/your/deploy/path/`
- `/your/deploy/path/`
**WAJIB deploy ke KEDUANYA**, jika tidak pengguna dapat menerima kode lama.

## Catatan Migrasi
| # | Tanggal | Keterangan | Diterapkan |
|---|------|-------------|---------|
| 001 | 2026-02-10 | Skema awal (23 tabel) | ✅ |
| 002 | TBD | (migrasi berikutnya ditambahkan di sini) | |

## Daftar Periksa Sebelum Deployment
- [ ] Semua pengujian lulus secara lokal
- [ ] Migrasi diuji pada staging/salinan data
- [ ] Branch `develop` bersih, tanpa commit pekerjaan sementara
- [ ] Build berhasil (`npm run build`)
- [ ] Deploy ke KEDUA jalur AWS
- [ ] Pastikan aplikasi terbuka di app.runlifeos.com
- [ ] Pastikan data pengguna yang ada tetap utuh
- [ ] Buat tag rilis di master (`git tag v0.X.0`)
- [ ] Perbarui catatan migrasi ini

## Pembatalan Darurat
Jika deployment menimbulkan masalah:
1. `git checkout master` (versi terakhir yang diketahui berfungsi)
2. `npm run build && deploy`
3. Jika migrasi basis data bermasalah: jalankan skrip SQL pembatalan yang sesuai
4. Segera beri tahu tim
