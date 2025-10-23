// Ambil elemen penting
const title = document.getElementById('title');
const passwordPopup = document.getElementById('passwordPopup');
const loginBtn = document.getElementById('loginBtn');
const adminPasswordInput = document.getElementById('adminPassword');
const emoji = document.getElementById('emoji');
const logoutBtn = document.getElementById('logoutBtn');
const themeLink = document.getElementById('theme-style');
const gallery = document.getElementById('gallery');

let clickCount = 0;
let isAdmin = false;
let galleryData = [];
let randomCodes = {};
let codeTimers = {};

// === FUNGSI EMOJI ANIMASI ===
function showEmoji(face, transformColor = false, callback = null) {
  emoji.textContent = face;
  emoji.classList.add('show');

  // Kalau harus ganti tema bersamaan
  if (transformColor) {
    setTimeout(() => {
      themeLink.setAttribute('href', 'admin.css');
    }, 500);
  }

  // Hapus setelah 5 detik
  setTimeout(() => {
    emoji.classList.remove('show');
    if (callback) callback();
  }, 5000);
}

// === MODE PEMBELI ===
function setToUserMode() {
  isAdmin = false;
  logoutBtn.style.display = 'none';
  themeLink.setAttribute('href', 'style.css');
  showEmoji('😎');
  setTimeout(() => showEmoji('😄', false, null), 600);
}

// === MODE ADMIN ===
function setToAdminMode() {
  isAdmin = true;
  logoutBtn.style.display = 'block';
  showEmoji('😄', true, () => showEmoji('😎'));
}

// === BUKA POPUP PASSWORD ===
title.addEventListener('click', () => {
  clickCount++;
  if (clickCount === 3) {
    passwordPopup.classList.remove('hidden');
    clickCount = 0;
  }
  setTimeout(() => (clickCount = 0), 800);
});

// === LOGIN ADMIN ===
loginBtn.addEventListener('click', () => {
  const pass = adminPasswordInput.value;
  if (pass === 'Mita_sj17') {
    passwordPopup.classList.add('hidden');
    adminPasswordInput.value = '';
    setToAdminMode();
  } else {
    passwordPopup.classList.add('hidden');
    adminPasswordInput.value = '';
    showEmoji('😜');
  }
});

// === LOGOUT ===
logoutBtn.addEventListener('click', () => {
  themeLink.setAttribute('href', 'style.css');
  showEmoji('😎', false, () => showEmoji('😄'));
  logoutBtn.style.display = 'none';
  isAdmin = false;
});

// === BUAT KODE RANDOM ===
function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// === TAMBAH GAMBAR (ADMIN) ===
function addImage(url) {
  const id = Date.now().toString();
  const code = generateRandomCode();
  galleryData.push({ id, url });
  randomCodes[id] = code;
  refreshGallery();
  startCodeTimer(id);
}

// === TIMER UBAH SANDI 10 MENIT ===
function startCodeTimer(id) {
  if (codeTimers[id]) clearInterval(codeTimers[id]);
  codeTimers[id] = setInterval(() => {
    randomCodes[id] = generateRandomCode();
    refreshGallery();
  }, 10 * 60 * 1000);
}

// === REFRESH GALERI ===
function refreshGallery() {
  gallery.innerHTML = '';
  galleryData.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = item.url;

    div.appendChild(img);

    if (isAdmin) {
      const codeText = document.createElement('p');
      codeText.textContent = `Kode: ${randomCodes[item.id]}`;
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Salin Kode';
      copyBtn.className = 'copy-btn';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(randomCodes[item.id]);
        alert('Kode disalin!');
      };
      div.appendChild(codeText);
      div.appendChild(copyBtn);
    } else {
      const input = document.createElement('input');
      input.placeholder = 'Masukkan sandi download';
      const dlBtn = document.createElement('button');
      dlBtn.textContent = 'Download';
      dlBtn.className = 'copy-btn';
      dlBtn.onclick = () => {
        if (input.value === randomCodes[item.id]) {
          alert('Download dimulai!');
        } else {
          alert('Sandi salah!');
        }
      };
      div.appendChild(input);
      div.appendChild(dlBtn);
    }
    gallery.appendChild(div);
  });
}

// === CONTOH GAMBAR AWAL ===
addImage('https://placehold.co/300x200?text=Karya+1');
addImage('https://placehold.co/300x200?text=Karya+2');
addImage('https://placehold.co/300x200?text=Karya+3');

// === TOKOKU, PRICE LIST, AKUN ===
document.getElementById('tokokuBtn').addEventListener('click', () => {
  window.open('https://wa.me/YOUR_NUMBER_HERE', '_blank');
});

document.getElementById('priceBtn').addEventListener('click', () => {
  alert('Daftar harga akan kamu isi nanti ✨');
});

document.getElementById('commissionBtn').addEventListener('click', () => {
  alert('Halaman Commission Done aktif ✨');
});

document.getElementById('akunBtn').addEventListener('click', () => {
  const pilih = prompt('Mau ke akun mana? (IG / TikTok / YouTube)');
  if (!pilih) return;
  const pilihLower = pilih.toLowerCase();
  if (pilihLower.includes('ig')) window.open('https://instagram.com/', '_blank');
  else if (pilihLower.includes('tik')) window.open('https://tiktok.com/', '_blank');
  else if (pilihLower.includes('you')) window.open('https://youtube.com/', '_blank');
  else alert('Pilihan tidak dikenali 😅');
});
