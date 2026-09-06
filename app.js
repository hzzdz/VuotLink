const CFG=window.GETKEY_CONFIG||{};
const API=CFG.api||"https://getkey-api.2mcnfmhghn.workers.dev";
const $=id=>document.getElementById(id);

function openModal(id){$(id).classList.add("open")}
function closeModal(id){$(id).classList.remove("open")}
function toast(text){
 const t=$("toast");t.textContent=text;t.classList.add("show");
 clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2200);
}

$("getKey").onclick=()=>openModal("keyModal");
$("contactAdmin").onclick=()=>openModal("adminModal");
$("joinGroup").onclick=()=>openModal("groupModal");

document.querySelectorAll("[data-close]").forEach(el=>{
 el.addEventListener("click",()=>closeModal(el.dataset.close));
});
document.querySelectorAll(".modal-overlay").forEach(el=>{
 el.addEventListener("click",e=>{if(e.target===el)el.classList.remove("open")});
});

document.querySelectorAll("[data-type]").forEach(btn=>{
 btn.addEventListener("click",async()=>{
  const type=btn.dataset.type;
  closeModal("keyModal");
  if(type==="vip"){toast("KEY VIP đã được chọn.");return;}
  try{
   toast("Đang tạo link...");
   const r=await fetch(`${API}/api/start?type=free`);
   const d=await r.json();
   if(!r.ok||!d.redirectUrl)throw Error(d.error||"Không tạo được link.");
   location.href=d.redirectUrl;
  }catch(e){toast(e.message||"Có lỗi xảy ra.");}
 });
});

function setLink(id,url){
 if(url&&url!=="#")$(id).href=url;
}
setLink("telegramAdmin",CFG.telegramAdmin);
setLink("discordAdmin",CFG.discordAdmin);
setLink("telegramGroup",CFG.telegramGroup);
setLink("discordGroup",CFG.discordGroup);

if(CFG.logo){
 $("logo").src=CFG.logo;
 $("logoWrap").classList.add("has-image");
}

(async()=>{
 const token=new URLSearchParams(location.search).get("token");
 if(!token)return;
 try{
  const r=await fetch(`${API}/api/claim?token=${encodeURIComponent(token)}`);
  const d=await r.json();
  if(!r.ok||!d.key)throw Error(d.error||"Không thể nhận key.");
  document.querySelector(".subtitle span:nth-child(2)").textContent=d.key;
  toast("Nhận key thành công.");
 }catch(e){toast(e.message||"Không thể nhận key.");}
})();