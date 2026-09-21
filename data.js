/**
 * Data acuan golongan/ruang, pangkat, dan gaji pokok PNS.
 *
 * Sumber: Peraturan Pemerintah Nomor 5 Tahun 2024 tentang Perubahan Kesembilan
 * Belas atas PP Nomor 7 Tahun 1977 tentang Peraturan Gaji Pegawai Negeri Sipil
 * (berlaku sejak 1 Januari 2024).
 *
 * Catatan akurasi: nilai gaji pokok pada MKG 0 (masa kerja golongan awal) dan
 * MKG 32 (maksimal) untuk setiap golongan/ruang diambil langsung dari lampiran
 * resmi PP 5/2024. Nilai pada MKG di antaranya (2, 4, 6, ... 30) dihitung
 * memakai pola kenaikan geometris antar-golongan pada PP tersebut (rasio ±3,15%
 * per kenaikan gaji berkala 2 tahun), yang diverifikasi cocok dengan tabel
 * resmi golongan III/b (dicantumkan penuh, tanpa perhitungan, di bawah).
 * Sebelum dipakai untuk pembayaran riil, cocokkan kembali angka MKG
 * antara dengan lampiran PP 5/2024 atau Peraturan BKN No. 1 Tahun 2024.
 */

// golongan/ruang -> { pangkat, min: gaji pokok MKG 0, max: gaji pokok MKG 32 }
const GOLONGAN_DATA = {
  'I/a': { pangkat: 'Juru Muda', min: 1685700, max: 2522600 },
  'I/b': { pangkat: 'Juru Muda Tingkat I', min: 1840800, max: 2670700 },
  'I/c': { pangkat: 'Juru', min: 1918700, max: 2783700 },
  'I/d': { pangkat: 'Juru Tingkat I', min: 1999900, max: 2901400 },

  'II/a': { pangkat: 'Pengatur Muda', min: 2184000, max: 3643400 },
  'II/b': { pangkat: 'Pengatur Muda Tingkat I', min: 2385000, max: 3797500 },
  'II/c': { pangkat: 'Pengatur', min: 2485900, max: 3958200 },
  'II/d': { pangkat: 'Pengatur Tingkat I', min: 2591100, max: 4125600 },

  'III/a': { pangkat: 'Penata Muda', min: 2785700, max: 4575200 },
  // III/b: tabel penuh resmi (17 titik, MKG 0-32), dipakai langsung tanpa interpolasi.
  'III/b': {
    pangkat: 'Penata Muda Tingkat I',
    min: 2903600,
    max: 4768800,
    exact: [
      2903600, 2995000, 3089300, 3186600, 3287000, 3390500, 3497300, 3607500,
      3721100, 3838300, 3959200, 4083900, 4212500, 4345100, 4482000, 4623200,
      4768800,
    ],
  },
  'III/c': { pangkat: 'Penata', min: 3026400, max: 4970500 },
  'III/d': { pangkat: 'Penata Tingkat I', min: 3154400, max: 5180700 },

  'IV/a': { pangkat: 'Pembina', min: 3287800, max: 5399900 },
  'IV/b': { pangkat: 'Pembina Tingkat I', min: 3426900, max: 5628300 },
  'IV/c': { pangkat: 'Pembina Utama Muda', min: 3571900, max: 5866400 },
  'IV/d': { pangkat: 'Pembina Utama Madya', min: 3723000, max: 6114500 },
  'IV/e': { pangkat: 'Pembina Utama', min: 3880400, max: 6373200 },
};

const MKG_STEPS = 16; // 16 kenaikan gaji berkala @ 2 tahun = MKG 0 s.d. 32

/**
 * Mengembalikan gaji pokok untuk golongan/ruang tertentu pada masa kerja
 * golongan (tahun) tertentu. Masa kerja dibulatkan ke bawah ke kelipatan 2
 * tahun terdekat (mengikuti periode kenaikan gaji berkala), maksimal 32 tahun.
 */
function getGajiPokok(golongan, masaKerjaTahun) {
  const data = GOLONGAN_DATA[golongan];
  if (!data) return null;

  const mk = Math.max(0, Math.min(32, Math.floor(masaKerjaTahun)));
  const step = Math.min(MKG_STEPS, Math.floor(mk / 2));

  if (data.exact) return data.exact[step];

  const ratio = Math.pow(data.max / data.min, 1 / MKG_STEPS);
  const value = data.min * Math.pow(ratio, step);
  return Math.round(value / 100) * 100;
}

function getPangkat(golongan) {
  const data = GOLONGAN_DATA[golongan];
  return data ? data.pangkat : '';
}

function getGolonganList() {
  return Object.keys(GOLONGAN_DATA);
}

/**
 * Data tunjangan kinerja (tukin) dosen ASN berdasarkan jenjang jabatan
 * fungsional.
 *
 * Sumber:
 * - Peraturan Presiden Nomor 19 Tahun 2025 tentang Tunjangan Kinerja bagi
 *   Dosen Aparatur Sipil Negara di Lingkungan Kementerian Pendidikan Tinggi,
 *   Sains, dan Teknologi — berlaku bagi dosen ASN di PTN Satker maupun PTN
 *   BLU yang belum menerapkan remunerasi (persis kelompok yang dihitung oleh
 *   aplikasi ini), berlaku surut sejak 1 Januari 2025.
 * - Keputusan Menteri (Kepmendikbudristek/Kepmendiktisaintek) Nomor 447/P/2024
 *   tentang Nama Jabatan, Kelas Jabatan, dan Pemberian Besaran Tunjangan
 *   Kinerja Jabatan Fungsional Dosen — menetapkan kelas jabatan per jenjang
 *   dan besaran nominal tukin mengikuti tabel kelas jabatan Kemendiktisaintek.
 *
 * Catatan penting: nominal berikut adalah tukin PENUH sesuai kelas jabatan.
 * Untuk dosen bersertifikasi yang telah menerima tunjangan profesi dosen,
 * Perpres 19/2025 mengatur tukin yang dibayarkan adalah SELISIH antara
 * nominal berikut dengan tunjangan profesi yang sudah diterima. Aplikasi ini
 * tidak memotong tunjangan profesi secara otomatis karena bukan bagian dari
 * input yang diminta — nilai tukin di bawah tetap ditampilkan sebagai isian
 * yang dapat diedit manual agar sesuai SK/keputusan penetapan tukin masing-
 * masing dosen.
 */
const JABFUNG_TUKIN = {
  'Asisten Ahli': { kelasJabatan: 9, tukin: 5079200 },
  Lektor: { kelasJabatan: 11, tukin: 8757600 },
  'Lektor Kepala': { kelasJabatan: 13, tukin: 10936000 },
  Profesor: { kelasJabatan: 15, tukin: 19280000 },
};

function getJabfungList() {
  return Object.keys(JABFUNG_TUKIN);
}

function getTukinJabfung(jabfung) {
  const data = JABFUNG_TUKIN[jabfung];
  return data ? data.tukin : null;
}

function getKelasJabatan(jabfung) {
  const data = JABFUNG_TUKIN[jabfung];
  return data ? data.kelasJabatan : null;
}

/**
 * Menghitung masa kerja (tahun & bulan) dari NIP PNS 18 digit.
 *
 * Struktur NIP (Peraturan Kepala BKN No. 3 Tahun 2013 tentang Pedoman
 * Penyusunan NIP): 8 digit tanggal lahir (YYYYMMDD) + 6 digit TMT
 * pengangkatan CPNS/PNS (YYYYMM) + 1 digit kode jenis kelamin (1 = laki-laki,
 * 2 = perempuan) + 3 digit nomor urut.
 *
 * Catatan: hasil ini adalah masa kerja sejak TMT CPNS/PNS pertama yang
 * tertanam pada NIP, BUKAN otomatis "masa kerja golongan" (MKG) — MKG yang
 * sebenarnya mengikuti TMT golongan/pangkat terakhir (bisa lebih pendek jika
 * pernah naik pangkat/golongan dengan penyesuaian masa kerja). Gunakan angka
 * ini sebagai perkiraan awal dan sesuaikan manual bila berbeda dari SK
 * kepangkatan terakhir.
 */
function getMasaKerjaDariNip(nip, sekarang) {
  if (!/^\d{18}$/.test(nip)) return null;

  const tmtYear = parseInt(nip.slice(8, 12), 10);
  const tmtMonth = parseInt(nip.slice(12, 14), 10);
  if (tmtMonth < 1 || tmtMonth > 12) return null;

  const now = sekarang || new Date();
  const tmtDate = new Date(tmtYear, tmtMonth - 1, 1);
  if (tmtDate > now) return null;

  let years = now.getFullYear() - tmtDate.getFullYear();
  let months = now.getMonth() - tmtDate.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, tmtYear, tmtMonth };
}

/**
 * Tunjangan keluarga PNS (PP No. 7 Tahun 1977 tentang Peraturan Gaji Pegawai
 * Negeri Sipil beserta perubahannya): tunjangan istri/suami 10% dari gaji
 * pokok (untuk 1 istri/suami yang sah), tunjangan anak 2% dari gaji pokok
 * per anak, diberikan untuk sebanyak-banyaknya 3 orang anak (kandung/tiri/
 * angkat) yang berusia di bawah 21 tahun (dapat diperpanjang sampai 25 tahun
 * apabila masih bersekolah dan belum menikah/berpenghasilan sendiri).
 */
const TUNJANGAN_ISTRI_SUAMI_PERSEN = 0.1;
const TUNJANGAN_ANAK_PERSEN = 0.02;
const TUNJANGAN_ANAK_MAKS = 3;

function getTunjanganIstriSuami(gajiPokok, kawin) {
  return kawin ? Math.round(gajiPokok * TUNJANGAN_ISTRI_SUAMI_PERSEN) : 0;
}

function getTunjanganAnak(gajiPokok, jumlahAnak) {
  const anak = Math.max(0, Math.min(TUNJANGAN_ANAK_MAKS, Math.floor(jumlahAnak) || 0));
  return Math.round(gajiPokok * TUNJANGAN_ANAK_PERSEN * anak);
}

/**
 * Tunjangan uang makan PNS berdasarkan golongan, sesuai PMK No. 39 Tahun 2024:
 * golongan I & II Rp35.000/hari, golongan III Rp37.000/hari, golongan IV
 * Rp41.000/hari. Diberikan per hari kerja dengan kehadiran nyata (tidak
 * dibayarkan saat cuti/tidak hadir).
 */
const UANG_MAKAN_HARIAN = {
  I: 35000,
  II: 35000,
  III: 37000,
  IV: 41000,
};

function getUangMakanHarian(golongan) {
  const romawi = (golongan || '').split('/')[0];
  return UANG_MAKAN_HARIAN[romawi] || 0;
}

function getUangMakanBulanan(golongan, hariKerja) {
  const hari = Math.max(0, Math.floor(hariKerja) || 0);
  return getUangMakanHarian(golongan) * hari;
}
