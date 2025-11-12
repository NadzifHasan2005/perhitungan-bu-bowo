// Ambil elemen HTML
const input = document.getElementById('userInput');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const historyList = document.getElementById('historyList');

// Ambil data awal dari localStorage
let historyData = JSON.parse(localStorage.getItem('inputHistory')) || [];

// Fungsi untuk menampilkan semua riwayat
function showHistory() {
  historyList.innerHTML = '';
  historyData.forEach((text, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${index + 1}. ${text}</span>
      <button onclick="deleteHistory(${index})">Hapus</button>
    `;
    historyList.appendChild(li);
  });
}

// Simpan input ke riwayat
saveBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (text !== '') {
    historyData.push(text);
    localStorage.setItem('inputHistory', JSON.stringify(historyData));
    input.value = '';
    showHistory();
  }
});

// Hapus salah satu riwayat
function deleteHistory(index) {
  if (confirm(`Hapus riwayat "${historyData[index]}"?`)) {
    historyData.splice(index, 1);
    localStorage.setItem('inputHistory', JSON.stringify(historyData));
    showHistory();
  }
}

// Hapus semua riwayat
clearBtn.addEventListener('click', () => {
  if (confirm('Yakin ingin menghapus semua riwayat?')) {
    historyData = [];
    localStorage.removeItem('inputHistory');
    showHistory();
  }
});

// Tampilkan riwayat saat halaman dibuka
showHistory();
