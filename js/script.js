/* ----------------------------------------
   Chargement après le DOM
-----------------------------------------*/
document.addEventListener('DOMContentLoaded',()=>{

/* ===== Mode DEBUG (#debug) ===== */
if(location.hash==='#debug'){document.body.classList.add('debug')}

/* ===== Constantes ===== */
const views=['front','side','back'];
let currentView=0;
const SESSIONS_NB=6;                       // même nombre partout

/* ===== Éléments DOM ===== */
const bodyImg = document.getElementById('body-img');
const prevBtn = document.getElementById('prev-view');
const nextBtn = document.getElementById('next-view');
const zones   = document.querySelectorAll('.zone');
const cartBody= document.querySelector('#cart-table tbody');
const totalEl = document.getElementById('total-price');
const clearBtn= document.getElementById('clear-cart');

/* ===== Fonctions ===== */
const formatPrice=p=>Number(p).toFixed(2);

/* --- rotation --- */
function updateView(){
  const view=views[currentView];
  bodyImg.src=`assets/${view}.svg`;
  zones.forEach(z=>{
    const req=z.dataset.view;              // ex "front", "back", "front,side"
    if(!req || req.split(',').includes(view)){
      z.style.display='block';
    }else{
      z.style.display='none';
      z.classList.remove('selected');
    }
  });
}
prevBtn.onclick=()=>{currentView=(currentView-1+views.length)%views.length;updateView()}
nextBtn.onclick=()=>{currentView=(currentView+1)%views.length;updateView()}

/* --- panier --- */
function calcTotal(){
  let tot=0;
  cartBody.querySelectorAll('tr').forEach(r=>{
    tot+=parseFloat(r.children[1].textContent);
  });
  totalEl.textContent=formatPrice(tot);
}
function addToCart(zone,price){
  if([...cartBody.children].some(r=>r.dataset.zone===zone))return;  // déjà présent
  const row=document.createElement('tr');
  row.dataset.zone=zone;
  row.innerHTML=`
    <td>${zone}</td>
    <td>${formatPrice(price)}</td>
    <td>${SESSIONS_NB}</td>
    <td><button class="remove-btn" aria-label="Supprimer">🗑️</button></td>`;
  row.querySelector('.remove-btn').onclick=()=>{
    row.remove(); zones.forEach(z=>{if(z.dataset.zone===zone)z.classList.remove('selected')});
    calcTotal();
  };
  cartBody.appendChild(row);
  calcTotal();
}
function clearCart(){
  cartBody.innerHTML=''; totalEl.textContent='0';
  zones.forEach(z=>z.classList.remove('selected'));
}
clearBtn.onclick=clearCart;

/* --- clic sur zone --- */
zones.forEach(z=>{
  z.onclick=()=>{
    z.classList.add('selected');
    addToCart(z.dataset.zone,z.dataset.price);
  };
});

/* --- helper coordonnées debug --- */
if(document.body.classList.contains('debug')){
  const wrap=document.getElementById('viewer-wrapper');
  wrap.addEventListener('click',e=>{
    const r=wrap.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width*100).toFixed(1);
    const y=((e.clientY-r.top )/r.height*100).toFixed(1);
    console.log(`top:${y}%; left:${x}%`);
  });
}

/* init */
updateView();
});
