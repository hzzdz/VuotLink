const CFG=window.GETKEY_CONFIG||{};
const API=CFG.api||"";
async function loadKeyCount(){

  try{

    const res=await fetch(`${API}/api/stats`);

    const data=await res.json();

    if(data.success){

      document.getElementById("keyCount").textContent=data.count;

    }

  }catch{

    document.getElementById("keyCount").textContent="---";

  }

}

loadKeyCount();
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

const DEVICE_ID_KEY = "getkey_device_id_v1";
function newDeviceId(){
  return globalThis.crypto?.randomUUID?.() ||
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{
      const r=Math.random()*16|0;
      return (c==="x"?r:(r&3|8)).toString(16);
    });
}
function getDeviceId(){
  try{
    let id=localStorage.getItem(DEVICE_ID_KEY);
    if(!id){
      id=newDeviceId();
      localStorage.setItem(DEVICE_ID_KEY,id);
    }
    return id;
  }catch{
    return newDeviceId();
  }
}

/* Luồng Free: backend sẽ trả redirectUrl nếu endpoint đã được cấu hình. */
document.querySelectorAll("[data-type]").forEach(btn=>{
  btn.addEventListener("click",async()=>{
    const type=btn.dataset.type;
    closeModal("keyModal");

    if(!API){
      toast("Chưa cấu hình API.");
      return;
    }

    try{
      toast("Đang tạo link...");      const deviceId=getDeviceId();
      const res=await fetch(

  `${API}/api/start?type=${encodeURIComponent(type)}&cid=${encodeURIComponent(deviceId)}`

);
      const data=await res.json();

      if(!res.ok||!data.redirectUrl)
        throw new Error(data.error||"Không tạo được link.");

      window.location.assign(data.redirectUrl);
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

document.getElementById("generatedKey").textContent=data.key;

openModal("keyResultModal");

history.replaceState({}, document.title, window.location.pathname);
  }catch(err){
    toast(err.message||"Không thể nhận key.");
  }
})();
$("copyKey").onclick=async()=>{

  const key=$("generatedKey").textContent;

  if(!key || key==="---") return;

  try{

    await navigator.clipboard.writeText(key);

    toast("Đã sao chép key.");

  }catch{

    toast("Không thể sao chép key.");

  }
};
const backupBtn = document.getElementById("backupGetKey");

if (backupBtn) {

  backupBtn.addEventListener("click", () => {

    if (CFG.backupGetKey) {

      window.location.href = CFG.backupGetKey;

    } else {

      toast("Chưa cấu hình web dự phòng.");

    }

  });

}
const menuKey = document.getElementById("menuKey");

if (menuKey) {

  menuKey.addEventListener("click", (e) => {

    e.preventDefault();

    if (CFG.menuKey) {

      window.location.href = CFG.menuKey;

    } else {

      toast("Chưa cấu hình link Menu.");

    }

  });

}



const resetDeviceButton = document.createElement("button");
resetDeviceButton.type = "button";
resetDeviceButton.className = "modal-close";
resetDeviceButton.textContent = "ĐẶT LẠI THIẾT BỊ";
resetDeviceButton.addEventListener("click", () => {
  if (!window.confirm("Đặt lại ID trên trình duyệt này? Lần nhận key tiếp theo có thể được tính như thiết bị mới.")) return;
  try { localStorage.removeItem(DEVICE_ID_KEY); }
  catch { toast("Trình duyệt không cho đặt lại thiết bị."); return; }
  closeModal("keyModal");
  toast("Đã đặt lại thiết bị. Hãy thử lấy key lại.");
});
const keyModalContent = $("keyModal")?.querySelector(".modal");
if (keyModalContent) keyModalContent.appendChild(resetDeviceButton);
