# Perhitungan Gaji Dosen BLU Satker

Aplikasi web statis (HTML/CSS/JS, tanpa perlu build atau server) untuk menghitung
gaji dosen BLU **tanpa remunerasi dan tanpa tunjangan satker** — hanya gaji pokok
sesuai golongan/pangkat PNS ditambah tunjangan kinerja (tukin).

## Cara menjalankan

Buka `index.html` langsung di browser, atau jalankan server statis sederhana:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Input

- Nama
- NIP (18 digit)
- Masa Kerja Golongan (tahun)
- Golongan/Ruang (I/a s.d. IV/e) — Pangkat terisi otomatis
- Tunjangan Kinerja (Tukin) — diisi manual sesuai SK/kelas jabatan

## Perhitungan

```
Total Gaji = Gaji Pokok (golongan + masa kerja) + Tukin
```

Tidak termasuk remunerasi BLU, tunjangan satker, tunjangan keluarga/pangan,
maupun potongan (pajak, iuran, dsb).

## Sumber data gaji pokok

Tabel gaji pokok mengacu pada **PP No. 5 Tahun 2024** (perubahan ke-19 atas
PP No. 7 Tahun 1977 tentang Gaji PNS). Nilai pada MKG (Masa Kerja Golongan) 0
dan 32 diambil dari lampiran resmi. Nilai pada MKG di antaranya (2–30) dihitung
dengan pola kenaikan berkala antar-golongan pada PP tersebut (kecuali golongan
III/b yang datanya penuh dari sumber resmi, dipakai sebagai acuan validasi
pola perhitungan). Detail dan disclaimer lengkap ada di komentar berkas
`data.js` — **cocokkan kembali dengan lampiran resmi PP sebelum dipakai untuk
pembayaran riil**, karena peraturan dapat direvisi.
