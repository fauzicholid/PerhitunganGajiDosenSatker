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
