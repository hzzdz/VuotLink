const CONFIG = window.GETKEY_CONFIG || {};
const API = CONFIG.api || "https://getkey-api.2mcnfmhghn.workers.dev";

const $ = id => document.getElementById(id);

const openModal = id => $(id).classList.add("open");
const closeModal = id => $(id).classList.remove("open");

$("getKeyBtn").onclick = () => openModal("keyModal");
$("groupBtn").onclick = () => openModal("groupModal");
$("adminBtn").onclick = () => openModal("adminModal");

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => closeModal(btn.dataset.close));
});

document.querySelectorAll(".overlay").forEach(overlay => {
  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.classList.remove("open");
  });
});

document.querySelectorAll(".choice[data-type]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const type = btn.dataset.type;
    closeModal("keyModal");
    if (type === "free") {
      window.location.href = `${API}/api/start?type=free`;
    } else {
      showToast("KEY VIP đã chọn");
      // Có thể nối API VIP riêng sau.
    }
  });
});

function setLink(id, value) {
  const el = $(id);
  if (el && value && value !== "#") el.href = value;
}

// Chỉ sửa các link này trong config.js
setLink("telegramGroup", CONFIG.telegramGroup);
setLink("discordGroup", CONFIG.discordGroup);
setLink("telegramAdmin", CONFIG.telegramAdmin);
setLink("discordAdmin", CONFIG.discordAdmin);

function showToast(text) {
  const t = $("toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// Nếu URL có token, thử nhận key.
(async function claimKey() {
  const token = new URLSearchParams(location.search).get("token");
  if (!token) return;

  try {
    const r = await fetch(`${API}/api/claim?token=${encodeURIComponent(token)}`);
    const data = await r.json();

    if (!r.ok) throw new Error(data.error || "Không thể nhận key.");

    const key = data.key || "";
    document.querySelector(".key-subtitle b").textContent = key;
    document.querySelector(".key-subtitle").style.letterSpacing = "1px";
    showToast("Nhận key thành công");
  } catch (e) {
    showToast(e.message);
  }
})();