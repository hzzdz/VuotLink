const CFG=window.GETKEY_CONFIG||{};
const API=CFG.api||"";
const $=id=>document.getElementById(id);

function openModal(id){
  const el=$(id);
  if(!el)return;
  el.classList.add("open");
  el.setAttribute("aria-hidden","false");
}
function closeModal(id){
  const el=$(id);
  if(!el)return;
  el.classList.remove("open");
  el.setAttribute("aria-hidden","true");
}
function toast(text){
  const el=$("toast");
  el.textContent=text;
  el.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast=setTimeout(()=>el.classList.remove("show"),2200);
}

$("getKey").onclick=()=>openModal("keyModal");
$("contactAdmin").onclick=()=>openModal("adminModal");
$("joinGroup").onclick=()=>openModal("groupModal");

document.querySelectorAll("[data-close]").forEach(btn=>{
  btn.addEventListener("click",()=>closeModal(btn.dataset.close));
});

document.querySelectorAll(".modal-overlay").forEach(bg=>{
  bg.addEventListener("click",e=>{
    if(e.target===bg)closeModal(bg.id);
  });
});

document.addEventListener("keydown",e=>{
  if(e.key==="Escape")
    document.querySelectorAll(".modal-overlay.open").forEach(x=>closeModal(x.id));
});

function setLink(id,url){
  const el=$(id);
  if(el&&url&&url!=="#"){
    el.href=url;
    el.target="_blank";
    el.rel="noopener";
  }
}
setLink("telegramAdmin",CFG.telegramAdmin);
setLink("discordAdmin",CFG.discordAdmin);
setLink("telegramGroup",CFG.telegramGroup);
setLink("discordGroup",CFG.discordGroup);

if(CFG.logo){
  $("logo").src=CFG.logo;
  $("logoBox").classList.add("has-image");
}

/* Luồng Free: backend sẽ trả redirectUrl nếu endpoint đã được cấu hình. */
document.querySelectorAll("[data-type]").forEach(btn=>{
  btn.addEventListener("click",async()=>{
    const type=btn.dataset.type;
    closeModal("keyModal");

    if(type==="vip"){
      toast("KEY VIP đã được chọn.");
      return;
    }

    if(!API){
      toast("Chưa cấu hình API.");
      return;
    }

    try{
      toast("Đang tạo link...");
      const res=await fetch(`${API}/api/start?type=free`);
      const data=await res.json();

      if(!res.ok||!data.redirectUrl)
        throw new Error(data.error||"Không tạo được link.");

      location.href=data.redirectUrl;
    }catch(err){
      toast(err.message||"Có lỗi xảy ra.");
    }
  });
});

/* Khi quay lại với token, nhận key từ Worker. */
(async()=>{
  const token=new URLSearchParams(location.search).get("token");
  if(!token||!API)return;

  try{
    const res=await fetch(`${API}/api/claim?token=${encodeURIComponent(token)}`);
    const data=await res.json();

    if(!res.ok||!data.key)
      throw new Error(data.error||"Không thể nhận key.");

    document.querySelector(".subtitle b").textContent=data.key;
    toast("Nhận key thành công.");
  }catch(err){
    toast(err.message||"Không thể nhận key.");
  }
})();