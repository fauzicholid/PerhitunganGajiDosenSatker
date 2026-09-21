(function () {
  const golonganSelect = document.getElementById('golongan');
  const pangkatInput = document.getElementById('pangkat');
  const tukinInput = document.getElementById('tukin');
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

  function digitsOnly(str) {
    return (str || '').replace(/\D/g, '');
  }

  tukinInput.addEventListener('input', () => {
    const digits = digitsOnly(tukinInput.value);
    tukinInput.value = digits ? Number(digits).toLocaleString('id-ID') : '';
  });

  golonganSelect.addEventListener('change', updatePangkat);

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

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const nip = document.getElementById('nip').value.trim();
    const masaKerja = Number(document.getElementById('masaKerja').value);
    const golongan = golonganSelect.value;
    const pangkat = getPangkat(golongan);
    const tukin = Number(digitsOnly(tukinInput.value)) || 0;

    if (!form.reportValidity()) return;

    const gajiPokok = getGajiPokok(golongan, masaKerja);
    const total = gajiPokok + tukin;

    document.getElementById('rNama').textContent = nama;
    document.getElementById('rNip').textContent = nip;
    document.getElementById('rGolongan').textContent = golongan;
    document.getElementById('rPangkat').textContent = pangkat;
    document.getElementById('rMasaKerja').textContent = `${masaKerja} tahun`;
    document.getElementById('rGajiPokok').textContent = rupiah(gajiPokok);
    document.getElementById('rTukin').textContent = rupiah(tukin);
    document.getElementById('rTotal').textContent = rupiah(total);

    resultCard.hidden = false;
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  form.addEventListener('reset', () => {
    resultCard.hidden = true;
    setTimeout(updatePangkat, 0);
  });

  populateGolongan();
  buildRefTable();
})();
