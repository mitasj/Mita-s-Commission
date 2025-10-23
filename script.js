// === ELEMENT UTAMA ===
const title = document.getElementById("title");
const themeLink = document.getElementById("theme-style");
const emoji = document.getElementById("emoji");
const logoutBtn = document.getElementById("logoutBtn");
const addBtn = document.getElementById("addArtworkBtn");
const gallery = document.getElementById("gallery");

const pages = {
  tokoku: document.getElementById("tokokuPage"),
  price: document.getElementById("pricePage"),
  commission: document.getElementById("commissionPage"),
  akun: document.getElementById("akunPage")
};

const menuBtns = {
  tokoku: document.getElementById("tokokuBtn"),
  price: document.getElementById("priceBtn"),
  commission: document.getElementById("commissionBtn"),
  akun: document.getElementById("akunBtn")
};

// === POPUP PASSWORD ADMIN ===
const passwordPopup = document.getElementById("passwordPopup");
const adminPassword = document.getElementById("adminPassword");
const loginBtn = document.getElementById("loginBtn");

const downloadPopup = document.getElementById("downloadPopup");
const downloadPassword = document.getElementById("downloadPassword");
const confirmDownloadBtn = document.getElementById("confirmDownloadBtn");
const cancelDownloadBtn = document.getElementById("cancelDownloadBtn");

// === DATA ===
let clickCount = 0;
let isAdmin = false;
let artworks = JSON.parse(localStorage.getItem("artworks")) || [];
let currentDownload = null;
let downloadCodes = {};

// === FUNGSI GANTI HALAMAN ===
function showPage(page) {
  Object.values(pages).forEach(p => p.classList.add("hidden"));
  pages[page].classList.remove("hidden");
}

// === MODE ADMIN ===
function switchToAdmin() {
  emoji.textContent = "😄";
  emoji.classList.add("show");

  setTimeout(() => {
    emoji.textContent = "😎";
    emoji.style.filter = "drop-shadow(0 0 10px #00f2ff)";
    themeLink.href = "admin.css";
    logoutBtn.classList.remove("hidden");
    addBtn.classList.remove("hidden");
    isAdmin = true;
  }, 800);

  setTimeout(() => {
    emoji.classList.remove("show");
  }, 2500);
}

// === MODE PEMBELI ===
function switchToBuyer() {
  emoji.textContent = "😎";
  emoji.classList.add("show");

  setTimeout(() => {
    emoji.textContent = "😄";
    emoji.style.filter = "none";
    themeLink.href = "style.css";
    logoutBtn.classList.add("hidden");
    addBtn.classList.add("hidden");
    isAdmin = false;
  }, 800);

  setTimeout(() => {
    emoji.classList.remove("show");
  }, 2500);
}

// === LOGIN ADMIN ===
title.addEventListener("click", () => {
  clickCount++;
  if (clickCount === 3) {
    passwordPopup.classList.remove("hidden");
    clickCount = 0;
  }
});

loginBtn.addEventListener("click", () => {
  if (adminPassword.value === "Mita_sj17") {
    passwordPopup.classList.add("hidden");
    adminPassword.value = "";
    switchToAdmin();
  } else {
    emoji.textContent = "😜";
    emoji.classList.add("show");
    setTimeout(() => emoji.classList.remove("show"), 1500);
  }
});

// === LOGOUT ADMIN ===
logoutBtn.addEventListener("click", () => {
  switchToBuyer();
});

// === MENU NAVIGASI ===
Object.entries(menuBtns).forEach(([key, btn]) => {
  btn.addEventListener("click", () => showPage(key));
});

// === TAMBAH KARYA ===
addBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgData = reader.result;
        const id = Date.now();
        artworks.push({ id, img: imgData });
        localStorage.setItem("artworks", JSON.stringify(artworks));
        renderGallery();
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
});

// === RENDER GALERI ===
function renderGallery() {
  gallery.innerHTML = "";
  artworks.forEach((art) => {
    const img = document.createElement("img");
    img.src = art.img;

    // Tekan 3-5 detik → popup sandi
    let pressTimer;
    img.addEventListener("mousedown", () => {
      pressTimer = setTimeout(() => {
        currentDownload = art.id;
        downloadPopup.classList.remove("hidden");
      }, 3000);
    });
    img.addEventListener("mouseup", () => clearTimeout(pressTimer));
    img.addEventListener("mouseleave", () => clearTimeout(pressTimer));

    gallery.appendChild(img);
  });
}
renderGallery();

// === DOWNLOAD DENGAN SANDI ===
confirmDownloadBtn.addEventListener("click", () => {
  const entered = downloadPassword.value;
  const validCode = downloadCodes[currentDownload];
  if (entered === validCode) {
    const art = artworks.find(a => a.id === currentDownload);
    const link = document.createElement("a");
    link.href = art.img;
    link.download = "MitaCommission_" + currentDownload + ".png";
    link.click();
    downloadPopup.classList.add("hidden");
    downloadPassword.value = "";
  } else {
    alert("Sandi salah!");
  }
});

// === TUTUP POPUP DOWNLOAD ===
cancelDownloadBtn.addEventListener("click", () => {
  downloadPopup.classList.add("hidden");
});

// === GENERATOR SANDI ACAK ===
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// === BUAT SANDI BARU SETIAP 10 MENIT ===
function refreshCodes() {
  artworks.forEach(a => {
    const code = generateCode();
    downloadCodes[a.id] = code;
  });
}
refreshCodes();
setInterval(refreshCodes, 10 * 60 * 1000); // setiap 10 menit// === REFRESH GALERI ===
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
