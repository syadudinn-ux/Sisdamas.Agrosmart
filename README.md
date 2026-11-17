# SISDAMAS AGROSMART

Sistem Pengelolaan Pangan Komunitas — aplikasi web berbasis React, TypeScript, Vite, dan Tailwind CSS untuk memantau kebun sayur, peternakan ayam petelur, stok pangan siap salur, distribusi gratis, barter sampah organik, data masyarakat pemegang kartu program, serta laporan ekspor CSV.

## Fitur Utama

- **Dashboard Program**: Ringkasan stok sayuran, stok telur, tanaman aktif, anggota terdaftar, progres budidaya, dan log aktivitas.
- **Kebun Sayur**: Pencatatan tanggal tanam, estimasi panen, pembaruan progres, dan pencatatan hasil panen ke stok pangan.
- **Peternakan Ayam Petelur**: Pemantauan populasi ayam serta riwayat produksi telur harian.
- **Stok Pangan**: Manajemen stok sayuran per komoditas dan stok telur siap distribusi/barter.
- **Distribusi & Barter**: Pencatatan distribusi gratis (anak-anak, ibu hamil, lansia) dan barter sampah organik (masyarakat umum dengan kartu aktif).
- **Data Masyarakat**: Direktori anggota, nomor kartu program unik, kategori penerima manfaat, dan aktivasi status kartu.
- **Laporan**: Rekapitulasi program, unduh CSV transaksi, serta pengaturan data contoh/reset data lokal (`localStorage`).

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

## Cara Hosting ke Vercel melalui GitHub

1. **Push proyek ke repositori GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit SISDAMAS AGROSMART"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
2. **Deploy di Vercel**:
   - Buka [vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
   - Klik **Add New... → Project**, lalu pilih repositori GitHub yang baru saja dibuat.
   - Vercel akan otomatis membaca konfigurasi dari `vercel.json` (`Framework: Vite`, `Build Command: npm run build`, `Output Directory: dist`).
   - Tidak ada *environment variable* khusus yang wajib diisi karena seluruh data berjalan di browser (`localStorage`).
   - Klik **Deploy** dan tunggu hingga URL `*.vercel.app` aktif.
