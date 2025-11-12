import { useState, useEffect } from 'react';
import './Body.css'; // <--- Tambahkan ini untuk memuat CSS

function Body() {
  const [tanggal, setTanggal] = useState('');
  const [uang, setUang] = useState('');
  const [jumlahBerat, setJumlahBerat] = useState('');
  const [hargaKg, setHargaKg] = useState('');

  const [historyData, setHistoryData] = useState(() => {
    return JSON.parse(localStorage.getItem('inputHistory')) || [];
  });

  useEffect(() => {
    localStorage.setItem('inputHistory', JSON.stringify(historyData));
  }, [historyData]);

  const handleHitung = (e) => {
    e.preventDefault();
    const totalHarga = uang - jumlahBerat * hargaKg;
    if (!isNaN(totalHarga)) {
      const record = {
        tanggal: tanggal || new Date().toISOString().split('T')[0],
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

  const backupHistory = () => {
    const blob = new Blob([JSON.stringify(historyData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'history_backup.json';
    link.click();
  };

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
    <main className="container">
      <h2>💰 Kalkulator & Riwayat Perhitungan</h2>

      <form className="form-card" onSubmit={handleHitung}>
        <div className="form-group">
          <label htmlFor="tanggal">Tanggal</label>
          <input
            type="date"
            id="tanggal"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="uang">Uang</label>
          <input
            type="number"
            id="uang"
            value={uang}
            onChange={(e) => setUang(e.target.value)}
            placeholder="Masukkan uang"
          />
        </div>

        <div className="form-group">
          <label htmlFor="jumlah_berat">Jumlah Berat</label>
          <input
            type="number"
            id="jumlah_berat"
            value={jumlahBerat}
            onChange={(e) => setJumlahBerat(e.target.value)}
            placeholder="Masukkan berat (kg)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="harga_kg">Harga per KG</label>
          <input
            type="number"
            id="harga_kg"
            value={hargaKg}
            onChange={(e) => setHargaKg(e.target.value)}
            placeholder="Masukkan harga/kg"
          />
        </div>

        <div className="btn-group">
          <button id="hitung" className="btn hitung">Hitung</button>
          <button id="hapus_riwayat" className="btn hapus" onClick={hapusSemua}>
            Hapus Semua
          </button>
        </div>
      </form>

      <section className="history-section">
        <h3>🧾 History</h3>
        <ul id="historyList">
          {historyData.map((item, index) => (
            <li key={index} className="history-item">
              <p><strong>{index + 1}. [{item.tanggal}]</strong></p>
              <p>Uang: {item.uang} | Berat: {item.jumlahBerat} kg | Harga/kg: {item.hargaKg}</p>
              <p><strong>Sisa Uang: {item.totalHarga}</strong></p>
              <button className="btn kecil" onClick={() => hapusSatu(index)}>Hapus</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="backup-section">
        <h3>📦 Backup & Restore</h3>
        <div className="btn-group">
          <button onClick={backupHistory} className="btn backup">💾 Backup</button>
          <input type="file" accept="application/json" onChange={restoreHistory} className="file-input" />
        </div>
      </section>
    </main>
  );
}

export default Body;
