window.GETKEY_CONFIG = {
  api: "https://getkey-api.2mcnfmhghn.workers.dev",

  // Thay ảnh logo sau:
  logo: "",

  // Thay 4 link dưới bằng link thật:
  telegramGroup: "#",
  discordGroup: "#",
  telegramAdmin: "#",
  discordAdmin: "#"
};

document.addEventListener("DOMContentLoaded", () => {
  if (window.GETKEY_CONFIG.logo) {
    const img = document.getElementById("logoImage");
    const placeholder = document.getElementById("imagePlaceholder");
    img.src = window.GETKEY_CONFIG.logo;
    img.style.display = "block";
    placeholder.style.display = "none";
  }
});