/* ===========================
   script.js — All logic
   - admin password: "mita123"
   - replace WA number below: YOUR_NUMBER_HERE
   =========================== */

/* === CONFIG / LINKS === */
const LINKS = {
  wa: "https://wa.me/YOUR_NUMBER_HERE?text=" + encodeURIComponent("Halo, saya ingin beli jasa mu"),
  ig: "https://instagram.com/",
  tiktok: "https://tiktok.com/",
  youtube: "https://youtube.com/"
};

/* === STORAGE KEYS === */
const KEY = {
  profile: "mc_profile_v1",
  welcome: "mc_welcome_v1",
  prices: "mc_prices_v1",
  artworks: "mc_artworks_v1",
  codes: "mc_codes_v1" // optional, but codes we'll keep in storage too
};

/* === ELEMENTS === */
const themeStyle = document.getElementById("theme-style");
const siteTitle = document.getElementById("siteTitle");
const profileCircle = document.getElementById("profileCircle");
const logoutBtn = document.getElementById("logoutBtn");
const emoji = document.getElementById("emoji");

const btnTokoku = document.getElementById("btnTokoku");
const btnPrices = document.getElementById("btnPrices");
const btnCommission = document.getElementById("btnCommission");
const btnAkun = document.getElementById("btnAkun");

const pages = {
  home: document.getElementById("homeSection"),
  tokoku: document.getElementById("tokokuPage"),
  prices: document.getElementById("pricesPage"),
  commission: document.getElementById("commissionPage"),
  akun: document.getElementById("akunPage")
};

const waLink = document.getElementById("waLink");
const pricesViewer = document.getElementById("pricesViewer");
const galleryEl = document.getElementById("gallery");
const addArtworkBtn = document.getElementById("addArtworkBtn");
const commissionControls = document.getElementById("commissionControls");

const adminPassPopup = document.getElementById("adminPassPopup");
const adminPassInput = document.getElementById("adminPassInput");
const adminPassOk = document.getElementById("adminPassOk");
const adminPassCancel = document.getElementById("adminPassCancel");

const downloadPopup = document.getElementById("downloadPopup");
const downloadInput = document.getElementById("downloadInput");
const downloadConfirm = document.getElementById("downloadConfirm");
const downloadCancel = document.getElementById("downloadCancel");

const adminPanel = document.getElementById("adminPanel");
const uploadProfileInput = document.getElementById("uploadProfileInput");
const uploadWelcomeInput = document.getElementById("uploadWelcomeInput");
const galleryUploadInput = document.getElementById("galleryUploadInput");
const adminGalleryList = document.getElementById("adminGalleryList");

const priceTitleInput = document.getElementById("priceTitleInput");
const priceDescInput = document.getElementById("priceDescInput");
const priceImageInput = document.getElementById("priceImageInput");
const priceAddBtn = document.getElementById("priceAddBtn");
const pricesAdminList = document.getElementById("pricesAdminList");

const openIGBtn = document.getElementById("openIGBtn");
const openTTBtn = document.getElementById("openTTBtn");
const openYTBtn = document.getElementById("openYTBtn");
const btnAdminPanelClose = document.getElementById("closeAdminPanel");
const btnLogoutAdmin = document.getElementById("logoutAdminBtn");

/* === STATE === */
let isAdmin = false;
let clickCount = 0;
let clickTimer = null;
let currentDownloadId = null;

/* load data from storage */
let prices = JSON.parse(localStorage.getItem(KEY.prices) || "[]");
let artworks = JSON.parse(localStorage.getItem(KEY.artworks) || "[]");
let codes = JSON.parse(localStorage.getItem(KEY.codes) || "{}");

/* ========== UTIL =========== */
function saveAll(){
  localStorage.setItem(KEY.prices, JSON.stringify(prices));
  localStorage.setItem(KEY.artworks, JSON.stringify(artworks));
  localStorage.setItem(KEY.codes, JSON.stringify(codes));
}
function setPage(pageKey){
  Object.values(pages).forEach(p=>p.classList.add("hidden"));
  pages[pageKey].classList.remove("hidden");
}
function randomCode(len=6){
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghjkmnpqrstuvwxyz";
  let s = "";
  for(let i=0;i<len;i++) s += chars.charAt(Math.floor(Math.random()*chars.length));
  return s;
}
function nowMs(){return Date.now();}

/* ========== THEME / MODE SWITCH =========== */
function toAdminMode(){
  isAdmin = true;
  // emoji animation: 😄 -> 😎 with shine
  showEmojiSequence("😄","😎", { changeTheme: "admin.css", shine: true, duration:2000 });
  logoutBtn.style.display = "inline-block";
  commissionControls.classList.remove("hidden");
  addArtworkBtn.style.display = "block";
  adminPanel.classList.remove("hidden");
  // render admin lists
  renderPricesAdmin();
  renderAdminGallery();
}
function toBuyerMode(){
  isAdmin = false;
  showEmojiSequence("😎","😄", { changeTheme: "style.css", shine:false, duration:1200 });
  logoutBtn.style.display = "none";
  commissionControls.classList.add("hidden");
  addArtworkBtn.style.display = "none";
  adminPanel.classList.add("hidden");
}

/* ========== EMOJI ANIMATIONS =========== */
function showEmojiSequence(fromEmoji, toEmoji, opts = {}){
  const { changeTheme=null, shine=false, duration=2000 } = opts;
  emoji.textContent = fromEmoji;
  emoji.classList.add("show");
  // after 600ms swap to toEmoji + sparkle effect
  setTimeout(()=>{
    // optional change theme
    if(changeTheme) {
      // fade transition: use CSS transition on body background; swap theme file after small delay for smoothness
      document.body.style.opacity = 0.98;
      setTimeout(()=> {
        document.getElementById("theme-style").href = changeTheme;
        document.body.style.opacity = 1;
      }, 120);
    }
    emoji.textContent = toEmoji;
    if(shine){
      // quick CSS "kilau" using filter
      emoji.style.filter = "drop-shadow(0 0 12px rgba(255,255,255,0.9)) brightness(1.2)";
    } else {
      emoji.style.filter = "none";
    }
  }, 600);
  // hide after duration
  setTimeout(()=> {
    emoji.classList.remove("show");
    emoji.style.filter = "none";
  }, duration);
}

/* ========== SITE TITLE triple click handler (open admin password popup) =========== */
siteTitle.addEventListener("click", ()=>{
  clickCount++;
  if(clickTimer) clearTimeout(clickTimer);
  clickTimer = setTimeout(()=>{ clickCount = 0; }, 800);
  if(clickCount >= 3){
    clickCount = 0;
    // show admin password popup
    adminPassPopup.classList.remove("hidden");
    adminPassInput.focus();
  }
});

/* admin password confirm/cancel */
adminPassOk.addEventListener("click", ()=>{
  const val = adminPassInput.value || "";
  adminPassInput.value = "";
  adminPassPopup.classList.add("hidden");
  if(val === "mita123"){
    toAdminMode();
    adminPanel.classList.remove("hidden");
    setPage("home");
  } else {
    // not admin
    alert("Kamu bukan admin dari web ini.");
    // small emoji fail
    emoji.textContent = "😜";
    emoji.classList.add("show");
    setTimeout(()=> emoji.classList.remove("show"),1200);
  }
});
adminPassCancel.addEventListener("click", ()=>{
  adminPassInput.value = "";
  adminPassPopup.classList.add("hidden");
});

/* logout admin */
btnLogoutAdmin.addEventListener("click", ()=>{
  adminPanel.classList.add("hidden");
  toBuyerMode();
  saveAll();
});

/* header logout btn */
logoutBtn.addEventListener("click", ()=>{
  // logout quick (also close admin panel)
  adminPanel.classList.add("hidden");
  toBuyerMode();
  saveAll();
});

/* ========== NAVIGATION BUTTONS =========== */
btnTokoku.addEventListener("click", ()=>{
  setPage("tokoku");
  // update wa link (user must replace number in script)
  waLink.href = LINKS.wa;
});
btnPrices.addEventListener("click", ()=> setPage("prices"));
btnCommission.addEventListener("click", ()=> setPage("commission"));
btnAkun.addEventListener("click", ()=> setPage("akun"));

openIGBtn.addEventListener("click", ()=> window.open(LINKS.ig, "_blank"));
openTTBtn.addEventListener("click", ()=> window.open(LINKS.tiktok, "_blank"));
openYTBtn.addEventListener("click", ()=> window.open(LINKS.youtube, "_blank"));

/* ========== PRICES: render viewer & admin editor =========== */
function renderPricesViewer(){
  pricesViewer.innerHTML = "";
  if(prices.length === 0){
    pricesViewer.innerHTML = "<div class='note'>Belum ada daftar harga. Tunggu admin menambahkan.</div>";
    return;
  }
  prices.forEach(p=>{
    const box = document.createElement("div");
    box.className = "price-card";
    box.style = "background:rgba(255,255,255,0.85);padding:10px;border-radius:10px;margin-bottom:8px";
    box.innerHTML = `<strong>${escapeHtml(p.title||"")}</strong><div style="color:#444;margin-top:6px">${escapeHtml(p.desc||"")}</div>`;
    if(p.img) box.innerHTML += `<div style="margin-top:6px"><img src="${p.img}" style="max-width:140px;border-radius:8px"></div>`;
    pricesViewer.appendChild(box);
  });
}
function renderPricesAdmin(){
  pricesAdminList.innerHTML = "";
  if(prices.length===0) pricesAdminList.innerHTML = "<div class='note'>Belum ada item</div>";
  prices.forEach((p, idx) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<div style="flex:1"><strong>${escapeHtml(p.title||"")}</strong><div style="font-size:13px;color:#666">${escapeHtml(p.desc||"")}</div></div>
      <div style="display:flex;gap:6px">
        <button data-i="${idx}" class="btn edit-price">Edit</button>
        <button data-i="${idx}" class="btn danger del-price">Hapus</button>
      </div>`;
    pricesAdminList.appendChild(row);
  });
  // attach handlers
  [...pricesAdminList.querySelectorAll(".del-price")].forEach(b=>{
    b.addEventListener("click",(e)=>{
      const i = +e.target.dataset.i;
      if(!confirm("Hapus item ini?")) return;
      prices.splice(i,1); saveAll(); renderPricesAdmin(); renderPricesViewer();
    });
  });
  [...pricesAdminList.querySelectorAll(".edit-price")].forEach(b=>{
    b.addEventListener("click",(e)=>{
      const i = +e.target.dataset.i;
      const newTitle = prompt("Judul:", prices[i].title || "");
      if(newTitle === null) return;
      const newDesc = prompt("Deskripsi:", prices[i].desc || "");
      if(newDesc === null) return;
      prices[i].title = newTitle; prices[i].desc = newDesc;
      saveAll(); renderPricesAdmin(); renderPricesViewer();
    });
  });
}
/* add price admin */
priceAddBtn.addEventListener("click", ()=>{
  const title = priceTitleInput.value.trim();
  const desc = priceDescInput.value.trim();
  if(!title){ alert("Isi judul"); return; }
  // image (optional)
  const f = priceImageInput.files[0];
  if(f){
    const r = new FileReader();
    r.onload = () => {
      prices.unshift({title, desc, img: r.result});
      priceTitleInput.value=""; priceDescInput.value=""; priceImageInput.value="";
      saveAll(); renderPricesAdmin(); renderPricesViewer();
    };
    r.readAsDataURL(f);
  } else {
    prices.unshift({title, desc});
    priceTitleInput.value=""; priceDescInput.value="";
    saveAll(); renderPricesAdmin(); renderPricesViewer();
  }
});

/* ========== PROFILE & WELCOME UPLOAD (admin only) =========== */
uploadProfileInput.addEventListener("change", async (e)=>{
  if(!isAdmin) return alert("Login admin dulu");
  const f = e.target.files[0]; if(!f) return;
  const d = await readFileAsDataURL(f);
  localStorage.setItem(KEY.profile, d);
  applyProfileImage();
});
uploadWelcomeInput.addEventListener("change", async (e)=>{
  if(!isAdmin) return alert("Login admin dulu");
  const f = e.target.files[0]; if(!f) return;
  const d = await readFileAsDataURL(f);
  localStorage.setItem(KEY.welcome, d);
  applyWelcomeImage();
});
function applyProfileImage(){
  const src = localStorage.getItem(KEY.profile);
  if(src){ profileCircle.style.backgroundImage = `url(${src})`; profileCircle.style.backgroundSize = "cover"; profileCircle.textContent=""; }
}
function applyWelcomeImage(){
  const src = localStorage.getItem(KEY.welcome);
  const wb = document.getElementById("welcomeBox");
  if(src){ wb.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:12px">`; }
}

/* ========== GALLERY: render, admin upload, press-hold download =========== */
function renderGallery(){
  galleryEl.innerHTML = "";
  if(artworks.length===0){
    galleryEl.innerHTML = "<div class='note'>Belum ada karya.</div>";
    return;
  }
  artworks.forEach(a=>{
    const wrapper = document.createElement("div");
    wrapper.className = "gallery-item";
    wrapper.style = "position:relative";
    const img = document.createElement("img");
    img.src = a.img;
    img.alt = a.title || "";
    img.style.borderRadius = "10px";
    // when buyer: press & hold 3s to request download
    let pressTimer = null;
    const startPress = (evt) => {
      if(isAdmin) return; // admin clicks shouldn't trigger download flow
      evt.preventDefault && evt.preventDefault();
      pressTimer = setTimeout(()=>{
        // open download popup and set current id
        currentDownloadId = a.id;
        downloadPopup.classList.remove("hidden");
      }, 3000);
    };
    const cancelPress = ()=> { if(pressTimer) clearTimeout(pressTimer); pressTimer = null; };
    img.addEventListener("mousedown", startPress);
    img.addEventListener("touchstart", startPress);
    img.addEventListener("mouseup", cancelPress);
    img.addEventListener("mouseleave", cancelPress);
    img.addEventListener("touchend", cancelPress);
    wrapper.appendChild(img);

    // if admin: show controls (title, code, copy, reset, delete)
    if(isAdmin){
      const info = document.createElement("div");
      info.style = "margin-top:6px;display:flex;gap:8px;align-items:center;justify-content:space-between";
      const left = document.createElement("div");
      left.innerHTML = `<input type="text" class="art-title" placeholder="Judul (klik untuk isi)" value="${escapeHtml(a.title||"")}">`;
      left.style.flex="1";
      const right = document.createElement("div");
      right.style.display="flex"; right.style.gap="6px";
      const codeSpan = document.createElement("div");
      codeSpan.textContent = (codes[a.id] && codes[a.id].code) ? codes[a.id].code : "-";
      codeSpan.style.fontWeight = "700";
      codeSpan.style.marginRight = "6px";
      const copyBtn = document.createElement("button");
      copyBtn.className = "btn small";
      copyBtn.textContent = "Salin Kode";
      copyBtn.onclick = ()=> {
        if(!codes[a.id] || !codes[a.id].code) return alert("Belum ada kode. Buat kode dulu.");
        navigator.clipboard.writeText(codes[a.id].code).then(()=> alert("Kode disalin"));
      };
      const genBtn = document.createElement("button");
      genBtn.className = "btn small";
      genBtn.textContent = "Buat Sandi (10m)";
      genBtn.onclick = ()=> {
        const code = randomCode(6);
        const expiry = nowMs() + 10*60*1000;
        codes[a.id] = { code, expiry };
        saveAll(); renderAdminGallery(); renderGallery(); alert("Sandi dibuat: " + code + "\nSandi berlaku 10 menit.");
      };
      const resetBtn = document.createElement("button");
      resetBtn.className = "btn small";
      resetBtn.textContent = "Reset Sandi";
      resetBtn.onclick = ()=> {
        delete codes[a.id];
        saveAll(); renderAdminGallery(); renderGallery(); alert("Sandi direset.");
      };
      const delBtn = document.createElement("button");
      delBtn.className = "btn danger";
      delBtn.textContent = "Hapus";
      delBtn.onclick = ()=> {
        if(!confirm("Hapus karya ini?")) return;
        artworks = artworks.filter(x=>x.id !== a.id); delete codes[a.id]; saveAll(); renderAdminGallery(); renderGallery(); renderPricesAdmin(); renderPricesViewer();
      };

      right.appendChild(codeSpan);
      right.appendChild(copyBtn);
      right.appendChild(genBtn);
      right.appendChild(resetBtn);
      right.appendChild(delBtn);

      info.appendChild(left);
      info.appendChild(right);
      wrapper.appendChild(info);

      // title edit handler
      left.querySelector(".art-title").addEventListener("change", (e)=>{
        a.title = e.target.value;
        saveAll();
      });
    }

    galleryEl.appendChild(wrapper);
  });
}

/* admin gallery list (compact) */
function renderAdminGallery(){
  adminGalleryList.innerHTML = "";
  if(artworks.length===0) adminGalleryList.innerHTML = "<div class='note'>Belum ada karya</div>";
  artworks.forEach(a=>{
    const el = document.createElement("div");
    el.className = "item";
    const title = a.title || "(tanpa judul)";
    const codeText = (codes[a.id] && codes[a.id].code) ? codes[a.id].code : "-";
    el.innerHTML = `<div style="display:flex;gap:10px;align-items:center">
                      <img src="${a.img}" style="width:72px;height:72px;object-fit:cover;border-radius:8px">
                      <div style="flex:1"><strong>${escapeHtml(title)}</strong><div style="font-size:12px;color:#666">Kode: ${escapeHtml(codeText)}</div></div>
                    </div>
                    <div style="display:flex;gap:6px">
                      <button class="btn small copy-code" data-id="${a.id}">Salin</button>
                      <button class="btn small gen-code" data-id="${a.id}">Buat Kode</button>
                      <button class="btn danger del-art" data-id="${a.id}">Hapus</button>
                    </div>`;
    adminGalleryList.appendChild(el);
  });

  [...adminGalleryList.querySelectorAll(".copy-code")].forEach(b=>{
    b.addEventListener("click",(e)=>{
      const id = e.target.dataset.id;
      if(!codes[id] || !codes[id].code) return alert("Belum ada kode");
      navigator.clipboard.writeText(codes[id].code).then(()=> alert("Kode disalin"));
    });
  });
  [...adminGalleryList.querySelectorAll(".gen-code")].forEach(b=>{
    b.addEventListener("click",(e)=>{
      const id = e.target.dataset.id;
      const code = randomCode(6);
      const expiry = nowMs() + 10*60*1000;
      codes[id] = { code, expiry };
      saveAll(); renderAdminGallery(); renderGallery(); alert("Sandi dibuat: " + code + "\nSandi berlaku 10 menit.");
    });
  });
  [...adminGalleryList.querySelectorAll(".del-art")].forEach(b=>{
    b.addEventListener("click",(e)=>{
      const id = e.target.dataset.id;
      if(!confirm("Hapus karya?")) return;
      artworks = artworks.filter(x=>x.id !== id); delete codes[id]; saveAll(); renderAdminGallery(); renderGallery();
    });
  });
}

/* ========== DOWNLOAD flow (buyer) =========== */
downloadConfirm.addEventListener("click", ()=>{
  const entered = downloadInput.value.trim();
  downloadInput.value = "";
  downloadPopup.classList.add("hidden");
  if(!currentDownloadId) return;
  const record = codes[currentDownloadId];
  if(record && record.code === entered && nowMs() <= record.expiry){
    // find artwork and download
    const art = artworks.find(a=>a.id === currentDownloadId);
    if(!art) return alert("File tidak ditemukan.");
    const a = document.createElement("a");
    a.href = art.img;
    a.download = (art.title || "MitaCommission") + "_" + currentDownloadId + ".png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } else {
    // wrong or expired
    emoji.textContent = "😜";
    emoji.classList.add("show");
    setTimeout(()=> emoji.classList.remove("show"), 1400);
    if(record && nowMs() > record.expiry) alert("Sandi sudah kedaluwarsa. Minta admin buat sandi baru.");
    else alert("Sandi salah.");
  }
});
downloadCancel.addEventListener("click", ()=> {
  downloadInput.value = "";
  downloadPopup.classList.add("hidden");
});

/* ========== ARTWORK UPLOAD (admin) =========== */
galleryUploadInput.addEventListener("change", async (e)=>{
  if(!isAdmin) return alert("Login admin dulu");
  const files = Array.from(e.target.files || []);
  for(const f of files){
    const d = await readFileAsDataURL(f);
    const id = String(Date.now()) + Math.random().toString(36).slice(2,6);
    artworks.unshift({ id, img: d, title: f.name });
    // create initial code null
  }
  saveAll(); renderAdminGallery(); renderGallery(); e.target.value = "";
});
/* quick add button on commission page */
addArtworkBtn.addEventListener("click", ()=> {
  if(!isAdmin) return alert("Login admin dahulu");
  galleryUploadInput.click();
});

/* ========== CODES auto-refresh (10 minutes) =========== */
function refreshCodesPeriodically(){
  // for artwork that already has a code, refresh to new random every interval
  Object.keys(codes).forEach(id => {
    // if code exists and expired -> delete
    if(codes[id] && codes[id].expiry && nowMs() > codes[id].expiry){
      delete codes[id];
    }
  });
  // keep saved
  saveAll();
}
// set refresh to assign new random codes? we only auto-rotate existing by regenerating every 10m if needed
setInterval(()=> {
  // regenerate codes for those with expiry soon or none? We'll regenerate all existing codes to be safe
  Object.keys(codes).forEach(id => {
    const code = randomCode(6);
    codes[id] = { code, expiry: nowMs() + 10*60*1000 };
  });
  saveAll();
  renderAdminGallery();
  renderGallery();
}, 10*60*1000);

/* initial refresh to ensure codes object is consistent */
refreshCodesPeriodically();

/* ========== PRICES and other admin handlers =========== */
renderPricesViewer();
renderPricesAdmin();
renderGallery();
renderAdminGallery();
applyProfileImage();
applyWelcomeImage();

/* misc admin panel open/close */
document.getElementById("closeAdminPanel").addEventListener("click", ()=> adminPanel.classList.add("hidden"));
document.getElementById("btnAdminPanelOpen")?.addEventListener("click", ()=> adminPanel.classList.remove("hidden")); // optional

/* open admin panel from header profile (if admin) */
profileCircle.addEventListener("click", ()=>{
  if(isAdmin) adminPanel.classList.toggle("hidden");
  else {
    // do nothing for buyer; or show message that admin needed
  }
});

/* gallery press-and-hold to trigger download popup: handled in renderGallery by setting currentDownloadId */

/* click Tokoku opens WhatsApp (replace number first) */
document.getElementById("waLink").href = LINKS.wa;
btnTokoku.addEventListener("click", ()=> {
  window.open(LINKS.wa, "_blank");
});

/* Helper: read file as data URL */
function readFileAsDataURL(file){
  return new Promise((res,rej)=>{
    const r = new FileReader();
    r.onload = ()=> res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

/* helper escape HTML */
function escapeHtml(s){
  if(!s) return "";
  return s.replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]);
}

/* click outside to close popups (optional polish) */
document.addEventListener("click", (e)=>{
  if(!adminPassPopup.classList.contains("hidden") && e.target === adminPassPopup) adminPassPopup.classList.add("hidden");
  if(!downloadPopup.classList.contains("hidden") && e.target === downloadPopup) { downloadPopup.classList.add("hidden"); downloadInput.value=""; }
});

/* simple keyboard shortcut: Esc to close modals */
document.addEventListener("keydown", (e)=> {
  if(e.key === "Escape"){
    adminPassPopup.classList.add("hidden");
    downloadPopup.classList.add("hidden");
    adminPanel.classList.add("hidden");
  }
});

/* optional: when switching to pages ensure smooth transition */
Object.values(pages).forEach(p => {
  p.addEventListener("transitionend", ()=>{ /* placeholder */ });
});

/* ========== INITIAL UI SETUP =========== */
/* show home by default */
setPage("home");
/* show/hide elements according to isAdmin state */
if(isAdmin) toAdminMode(); else toBuyerMode();});

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
