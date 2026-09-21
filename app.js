(function () {
  const golonganSelect = document.getElementById('golongan');
  const pangkatInput = document.getElementById('pangkat');
  const jabfungSelect = document.getElementById('jabfung');
  const tukinInput = document.getElementById('tukin');
  const nipInput = document.getElementById('nip');
  const masaKerjaInput = document.getElementById('masaKerja');
  const nipHint = document.getElementById('nipHint');
  const form = document.getElementById('gajiForm');
  const resultCard = document.getElementById('resultCard');

  const rupiah = (value) =>
    'Rp ' + Math.round(value).toLocaleString('id-ID');

  function populateGolongan() {
    getGolonganList().forEach((golongan) => {
      const option = document.createElement('option');
      option.value = golongan;
      option.textContent = `${golongan} — ${getPangkat(golongan)}`;
      golonganSelect.appendChild(option);
    });
    updatePangkat();
  }

  function updatePangkat() {
    pangkatInput.value = getPangkat(golonganSelect.value);
  }

  function populateJabfung() {
    getJabfungList().forEach((jabfung) => {
      const option = document.createElement('option');
      option.value = jabfung;
      option.textContent = `${jabfung} (Kelas Jabatan ${getKelasJabatan(jabfung)})`;
      jabfungSelect.appendChild(option);
    });
    applyTukinAcuan();
  }

  function digitsOnly(str) {
    return (str || '').replace(/\D/g, '');
  }

  function applyTukinAcuan() {
    const tukin = getTukinJabfung(jabfungSelect.value);
    tukinInput.value = tukin ? tukin.toLocaleString('id-ID') : '';
  }

  tukinInput.addEventListener('input', () => {
    const digits = digitsOnly(tukinInput.value);
    tukinInput.value = digits ? Number(digits).toLocaleString('id-ID') : '';
  });

  golonganSelect.addEventListener('change', updatePangkat);
  jabfungSelect.addEventListener('change', applyTukinAcuan);

  function applyMasaKerjaDariNip() {
    const nip = nipInput.value.trim();
    const hasil = getMasaKerjaDariNip(nip);
    if (!hasil) {
      nipHint.textContent =
        'Masa kerja akan otomatis dihitung dari TMT pada digit ke-9–14 NIP.';
      return;
    }
    masaKerjaInput.value = hasil.years;
    nipHint.textContent = `Terisi otomatis: TMT ${String(hasil.tmtMonth).padStart(2, '0')}/${hasil.tmtYear} → masa kerja ${hasil.years} tahun ${hasil.months} bulan.`;
  }

  nipInput.addEventListener('input', applyMasaKerjaDariNip);

  function buildRefTable() {
    const table = document.getElementById('refTable');
    const golonganList = getGolonganList();
    const steps = Array.from({ length: MKG_STEPS + 1 }, (_, i) => i * 2);

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    headRow.appendChild(document.createElement('th')).textContent = 'Golongan/Ruang';
    steps.forEach((mk) => {
      const th = document.createElement('th');
      th.textContent = 'MKG ' + mk;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);

    const tbody = document.createElement('tbody');
    golonganList.forEach((golongan) => {
      const row = document.createElement('tr');
      const th = document.createElement('td');
      th.textContent = golongan;
      row.appendChild(th);
      steps.forEach((mk) => {
        const td = document.createElement('td');
        td.textContent = getGajiPokok(golongan, mk).toLocaleString('id-ID');
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
  }

  function buildRefTukinTable() {
    const table = document.getElementById('refTukinTable');

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    ['Jabatan Fungsional', 'Kelas Jabatan', 'Tukin (Rp)'].forEach((label) => {
      const th = document.createElement('th');
      th.textContent = label;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);

    const tbody = document.createElement('tbody');
    getJabfungList().forEach((jabfung) => {
      const row = document.createElement('tr');
      const tdJabfung = document.createElement('td');
      tdJabfung.textContent = jabfung;
      const tdKelas = document.createElement('td');
      tdKelas.textContent = getKelasJabatan(jabfung);
      const tdTukin = document.createElement('td');
      tdTukin.textContent = getTukinJabfung(jabfung).toLocaleString('id-ID');
      row.append(tdJabfung, tdKelas, tdTukin);
      tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
  }

  function buildRefUangMakanTable() {
    const table = document.getElementById('refUangMakanTable');

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    ['Golongan', 'Uang Makan / Hari'].forEach((label) => {
      const th = document.createElement('th');
      th.textContent = label;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);

    const tbody = document.createElement('tbody');
    ['I', 'II', 'III', 'IV'].forEach((golongan) => {
      const row = document.createElement('tr');
      const tdGol = document.createElement('td');
      tdGol.textContent = golongan;
      const tdRate = document.createElement('td');
      tdRate.textContent = rupiah(getUangMakanHarian(golongan));
      row.append(tdGol, tdRate);
      tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const nip = nipInput.value.trim();
    const masaKerja = Number(masaKerjaInput.value);
    const golongan = golonganSelect.value;
    const pangkat = getPangkat(golongan);
    const tukin = Number(digitsOnly(tukinInput.value)) || 0;
    const kawin = document.getElementById('statusKawin').value === 'kawin';
    const jumlahAnak = Number(document.getElementById('jumlahAnak').value) || 0;
    const hariKerja = Number(document.getElementById('hariKerja').value) || 0;

    if (!form.reportValidity()) return;

    const gajiPokok = getGajiPokok(golongan, masaKerja);
    const tunjKeluarga = getTunjanganIstriSuami(gajiPokok, kawin);
    const tunjAnak = getTunjanganAnak(gajiPokok, jumlahAnak);
    const uangMakan = getUangMakanBulanan(golongan, hariKerja);
    const total = gajiPokok + tukin + tunjKeluarga + tunjAnak + uangMakan;

    document.getElementById('rNama').textContent = nama;
    document.getElementById('rNip').textContent = nip;
    document.getElementById('rGolongan').textContent = golongan;
    document.getElementById('rPangkat').textContent = pangkat;
    document.getElementById('rMasaKerja').textContent = `${masaKerja} tahun`;
    document.getElementById('rJabfung').textContent = jabfungSelect.value;
    document.getElementById('rKelasJabatan').textContent = getKelasJabatan(jabfungSelect.value);
    document.getElementById('rGajiPokok').textContent = rupiah(gajiPokok);
    document.getElementById('rTukin').textContent = rupiah(tukin);
    document.getElementById('rTunjKeluarga').textContent = rupiah(tunjKeluarga);
    document.getElementById('rTunjAnak').textContent = rupiah(tunjAnak);
    document.getElementById('rUangMakan').textContent = rupiah(uangMakan);
    document.getElementById('rTotal').textContent = rupiah(total);

    resultCard.hidden = false;
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  form.addEventListener('reset', () => {
    resultCard.hidden = true;
    setTimeout(() => {
      updatePangkat();
      applyTukinAcuan();
    }, 0);
  });

  populateGolongan();
  populateJabfung();
  buildRefTable();
  buildRefTukinTable();
  buildRefUangMakanTable();
})();
