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
- NIP (18 digit) — masa kerja terisi otomatis dari TMT yang tertanam pada NIP
- Masa Kerja Golongan (tahun) — dapat disesuaikan manual
- Golongan/Ruang (I/a s.d. IV/e) — Pangkat terisi otomatis
- Jabatan Fungsional (Asisten Ahli/Lektor/Lektor Kepala/Profesor) — Tukin acuan terisi otomatis
- Tunjangan Kinerja (Tukin) — terisi otomatis sesuai jabatan fungsional, dapat diedit manual
  mengikuti SK penetapan tukin masing-masing dosen
- Status Kawin & Jumlah Anak Tanggungan — untuk tunjangan istri/suami dan anak
- Hari Kerja Hadir per bulan — untuk uang makan

## Perhitungan

```
Total Gaji = Gaji Pokok (golongan + masa kerja)
           + Tukin (jabatan fungsional)
           + Tunjangan Jabatan Fungsional (nominal tetap per jenjang)
           + Tunjangan Kehormatan Profesor (2x gaji pokok, khusus Guru Besar)
           + Tunjangan Istri/Suami (10% gaji pokok, jika kawin)
           + Tunjangan Anak (2% gaji pokok x jumlah anak, maks. 3 anak)
           + Uang Makan (tarif harian golongan x hari kerja hadir)
```

Tidak termasuk remunerasi BLU, tunjangan satker, maupun potongan (pajak, iuran, dsb).

## Sumber data masa kerja dari NIP

Struktur NIP 18 digit (Peraturan Kepala BKN No. 3 Tahun 2013): 8 digit tanggal lahir + 6 digit
TMT CPNS/PNS (YYYYMM) + 1 digit jenis kelamin + 3 digit nomor urut. Masa kerja dihitung dari
selisih TMT tersebut dengan tanggal hari ini. Ini adalah TMT CPNS/PNS **pertama**, bukan
otomatis TMT golongan/pangkat terakhir — sesuaikan manual bila pegawai pernah mengalami
penyesuaian masa kerja saat kenaikan pangkat.

## Sumber data tunjangan keluarga & uang makan

- **Tunjangan keluarga** — PP No. 7 Tahun 1977 tentang Peraturan Gaji PNS beserta perubahannya:
  istri/suami 10% dari gaji pokok (1 pasangan yang sah), anak 2% dari gaji pokok per anak
  (maksimal 3 anak kandung/tiri/angkat, usia di bawah 21 tahun atau 25 tahun jika masih
  bersekolah, belum menikah, dan tidak berpenghasilan sendiri).
- **Uang makan** — PMK No. 39 Tahun 2024: golongan I & II Rp35.000/hari, golongan III
  Rp37.000/hari, golongan IV Rp41.000/hari. Dibayarkan per hari kerja dengan kehadiran nyata.

## Sumber data gaji pokok

Tabel gaji pokok mengacu pada **PP No. 5 Tahun 2024** (perubahan ke-19 atas
PP No. 7 Tahun 1977 tentang Gaji PNS). Nilai pada MKG (Masa Kerja Golongan) 0
dan 32 diambil dari lampiran resmi. Nilai pada MKG di antaranya (2–30) dihitung
dengan pola kenaikan berkala antar-golongan pada PP tersebut (kecuali golongan
III/b yang datanya penuh dari sumber resmi, dipakai sebagai acuan validasi
pola perhitungan). Detail dan disclaimer lengkap ada di komentar berkas
`data.js` — **cocokkan kembali dengan lampiran resmi PP sebelum dipakai untuk
pembayaran riil**, karena peraturan dapat direvisi.

## Sumber data tukin jabatan fungsional dosen

Besaran tukin per jenjang jabatan fungsional mengacu pada:

- **Perpres No. 19 Tahun 2025** tentang Tunjangan Kinerja Dosen ASN — berlaku bagi dosen
  ASN di PTN Satker maupun PTN BLU yang belum menerapkan remunerasi (persis kelompok yang
  dihitung aplikasi ini), berlaku surut sejak 1 Januari 2025.
- **Kepmendiktisaintek No. 447/P/2024** tentang kelas jabatan dan besaran tukin jabatan
  fungsional dosen (Asisten Ahli = kelas 9, Lektor = kelas 11, Lektor Kepala = kelas 13,
  Profesor = kelas 15).

Nilai yang ditampilkan adalah tukin penuh sesuai kelas jabatan. Untuk dosen bersertifikasi
yang sudah menerima tunjangan profesi dosen, Perpres 19/2025 mengatur tukin yang dibayarkan
adalah **selisih** antara nominal tersebut dengan tunjangan profesi yang sudah diterima —
aplikasi ini tidak memotong tunjangan profesi secara otomatis, sesuaikan nominal tukin secara
manual bila berlaku.

## Sumber data tunjangan jabatan fungsional & tunjangan kehormatan profesor

Komponen ini **berbeda dari tukin** di atas dan tetap dibayarkan berdampingan dengannya:

- **Tunjangan Jabatan Fungsional Dosen** — nominal tetap per jenjang sesuai **Perpres No. 65
  Tahun 2007**: Asisten Ahli Rp375.000, Lektor Rp700.000, Lektor Kepala Rp900.000, Profesor
  Rp1.350.000. Nominal ini belum mengalami penyesuaian signifikan sejak diterbitkan.
- **Tunjangan Kehormatan Profesor** — sesuai **PP No. 41 Tahun 2009** tentang Tunjangan Profesi
  Guru dan Dosen, Tunjangan Khusus Guru dan Dosen, serta Tunjangan Kehormatan Profesor: sebesar
  2x gaji pokok, khusus untuk jenjang jabatan fungsional Profesor/Guru Besar.
