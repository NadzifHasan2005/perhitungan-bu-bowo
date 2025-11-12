import { useState, useEffect } from 'react';

function Body() {
  const [tanggal, setTanggal] = useState('');
  const [uang, setUang] = useState('');
  const [jumlahBerat, setJumlahBerat] = useState('');
  const [hargaKg, setHargaKg] = useState('');

  // Ambil data dari localStorage SEBELUM render pertama
  const [historyData, setHistoryData] = useState(() => {
    return JSON.parse(localStorage.getItem('inputHistory')) || [];
  });

  // Update localStorage setiap kali history berubah
  useEffect(() => {
    localStorage.setItem('inputHistory', JSON.stringify(historyData));
  }, [historyData]);

  const handleHitung = (e) => {
    e.preventDefault();
    const totalHarga = uang - jumlahBerat * hargaKg;
    if (!isNaN(totalHarga)) {
      const record = {
        tanggal: tanggal || new Date().toISOString().split('T')[0], // gunakan tanggal hari ini jika kosong
        uang,
        jumlahBerat,
        hargaKg,
        totalHarga,
      };
      setHistoryData([...historyData, record]);
    }
  };

  const hapusSemua = (e) => {
    e.preventDefault();
    if (window.confirm('Yakin ingin hapus semua riwayat?')) {
      setHistoryData([]);
      localStorage.removeItem('inputHistory');
    }
  };

  const hapusSatu = (index) => {
    if (window.confirm(`Hapus riwayat tanggal ${historyData[index].tanggal}?`)) {
      const newHistory = historyData.filter((_, i) => i !== index);
      setHistoryData(newHistory);
    }
  };

  // 🧩 FITUR BACKUP ke file JSON
  const backupHistory = () => {
    const blob = new Blob([JSON.stringify(historyData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'history_backup.json';
    link.click();
  };

  // 🧩 FITUR RESTORE dari file JSON
  const restoreHistory = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          setHistoryData(importedData);
          alert('✅ Riwayat berhasil dipulihkan!');
        } else {
          alert('⚠️ File tidak valid!');
        }
      } catch {
        alert('⚠️ Gagal membaca file!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <main>
      <p>Tolong input uang dan sebagainya</p>
      <form onSubmit={handleHitung}>
        <label htmlFor="tanggal">Tanggal&nbsp;:</label>
        <input
          type="date"
          id="tanggal"
          name="tanggal"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
        />
        <br />

        <label htmlFor="uang">Uang&nbsp;:</label>
        <input
          type="number"
          id="uang"
          name="uang"
          value={uang}
          onChange={(e) => setUang(e.target.value)}
        />
        <br />

        <label htmlFor="jumlah_berat">Jumlah Berat&nbsp;:</label>
        <input
          type="number"
          id="jumlah_berat"
          name="jumlah_berat"
          value={jumlahBerat}
          onChange={(e) => setJumlahBerat(e.target.value)}
        />
        <br />

        <label htmlFor="harga_kg">Harga per KG&nbsp;:</label>
        <input
          type="number"
          id="harga_kg"
          name="harga_kg"
          value={hargaKg}
          onChange={(e) => setHargaKg(e.target.value)}
        />
        <br />

        <button id="hitung">Hitung</button>
        <button id="hapus_riwayat" onClick={hapusSemua}>
          Hapus semua riwayat
        </button>
      </form>

      <br />
      <p>History</p>
      <ul id="historyList">
        {historyData.map((item, index) => (
          <li key={index}>
            <strong>{index + 1}. [{item.tanggal}]</strong>{' '}
            Uang: {item.uang}, Jumlah Berat: {item.jumlahBerat}, Harga per KG: {item.hargaKg},{' '}
            <strong>Sisa uang: {item.totalHarga}</strong>{' '}
            <button onClick={() => hapusSatu(index)}>Hapus</button>
          </li>
        ))}
      </ul>

      <br />
      <h3>Backup & Restore</h3>
      <button onClick={backupHistory}>💾 Backup ke File</button>
      <br />
      <input type="file" accept="application/json" onChange={restoreHistory} />
    </main>
  );
}

export default Body;
