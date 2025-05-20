/* -------- CONFIG -------- */
const views = ['front', 'side', 'back']; // ordre des fichiers SVG
let currentViewIndex = 0;

/* format : { zone, price, sessions } */
const SESSIONS_NB = 6;  // même nombre pour toutes les zones
// Les prix sont stockés dans le HTML via data-price (flexible)

/* -------- REFERENCES DOM -------- */
const bodyImg = document.getElementById('body-img');
const prevBtn  = document.getElementById('prev-view');
const nextBtn  = document.getElementById('next-view');
const zones    = document.querySelectorAll('.zone');
const cartBody = document.querySelector('#cart-table tbody');
const totalEl  = document.getElementById('total-price');
const clearBtn = document.getElementById('clear-cart');

/* -------- HELPERS -------- */
const formatPrice = p => Number(p).toFixed(2);

/* -------- ROTATION -------- */
function updateView(){
  const view = views[currentViewIndex];                 // front | side | back
  bodyImg.src = `assets/${view}.svg`;                   // <-- on utilise désormais des SVG

  // afficher / masquer les zones suivant data-view
  zones.forEach(z=>{
    const req = z.dataset.view;                         // ex. "front", "back", "front,side"
    if(!req || req.split(',').includes(view)){
      z.style.display = 'block';
    }else{
      z.style.display = 'none';
      z.classList.remove('selected');                   // supprime le highlight s’il restait
    }
  });
}


prevBtn.addEventListener('click', () => {
  currentViewIndex = (currentViewIndex - 1 + views.length) % views.length;
  updateView();
});
nextBtn.addEventListener('click', () => {
  currentViewIndex = (currentViewIndex + 1) % views.length;
  updateView();
});

/* -------- PANIER -------- */
function addToCart(zoneName, price) {
  // éviter les doublons
  if ([...cartBody.children].some(row => row.dataset.zone === zoneName)) return;

  const row = document.createElement('tr');
  row.dataset.zone = zoneName;
  row.innerHTML = `
    <td>${zoneName}</td>
    <td>${formatPrice(price)}</td>
    <td>${SESSIONS_NB}</td>
    <td><button class="remove-btn" aria-label="Supprimer">🗑️</button></td>
  `;
  // bouton suppression
  row.querySelector('.remove-btn').addEventListener('click', () => {
    row.remove();
    calcTotal();
    deselectZone(zoneName);
  });

  cartBody.appendChild(row);
  calcTotal();
}

function calcTotal() {
  let total = 0;
  cartBody.querySelectorAll('tr').forEach(r => {
    total += parseFloat(r.children[1].textContent);
  });
  totalEl.textContent = formatPrice(total);
}

function clearCart() {
  cartBody.innerHTML = '';
  totalEl.textContent = '0';
  zones.forEach(z => z.classList.remove('selected'));
}

/* -------- INTERACTION ZONES -------- */
function deselectZone(zoneName){
  zones.forEach(z => {
    if (z.dataset.zone === zoneName) z.classList.remove('selected');
  })
}
zones.forEach(z => {
  z.addEventListener('click', () => {
    const zoneName = z.dataset.zone;
    const price    = z.dataset.price;
    z.classList.add('selected');
    addToCart(zoneName, price);
  });
});

/* -------- INIT -------- */
updateView();
clearBtn.addEventListener('click', clearCart);
