/* JOY SPARK CRACKERS – Diwali Dhamaka Sale 2026 | Vanilla JS */
'use strict';

// ---------- Data ----------
const U = id => `https://images.unsplash.com/photo-${id}?w=500&h=625&fit=crop&q=80`;
const PRODUCTS = [
  { id: 1, name: 'Color Sparklers (Pack of 10)',    cat: 'sparkler', tags: ['sparkler'],         price: 199,  off: 30, rating: 5, emoji: '✨', img: U('1498931299472-f7a63a5a1cfa') },
  { id: 2, name: 'Flower Pots Deluxe (Box of 10)',  cat: 'chakra',   tags: ['chakra'],           price: 349,  off: 30, rating: 4, emoji: '🎆', img: U('1481162854517-d9e353af153d') },
  { id: 3, name: 'Ground Chakra Spinner (Box of 10)', cat: 'chakra', tags: ['chakra'],           price: 149,  off: 30, rating: 4, emoji: '🌀', img: U('1467810563316-b5476525c0f9') },
  { id: 4, name: '7 Shot Sky Rocket',               cat: 'rocket',   tags: ['rocket'],           price: 299,  off: 40, rating: 5, emoji: '🚀', img: U('1514525253161-7a46d19cd819') },
  { id: 5, name: 'Family Diwali Gift Box (Large)',  cat: 'gift',     tags: ['gift'],             price: 1499, off: 40, rating: 5, emoji: '🎁', img: U('1512909006721-3d6018887383') },
  { id: 6, name: "Kids' Safe Crackers Pack",        cat: 'gift',     tags: ['gift', 'kids'],     price: 499,  off: 50, rating: 5, emoji: '🧒', img: U('1503944583220-79d8926ad5e2') },
  { id: 7, name: 'Multi-Colour Fountain Set',       cat: 'sparkler', tags: ['sparkler'],         price: 599,  off: 35, rating: 4, emoji: '⛲', img: U('1498931299472-f7a63a5a1cfa') },
  { id: 8, name: 'Mega Combo Pack (60+ items)',     cat: 'gift',     tags: ['gift'],             price: 2499, off: 60, rating: 5, emoji: '🎇', img: U('1512909006721-3d6018887383') }
];
const COMBO = [1, 4, 6]; // "Frequently Bought Together" product ids
const sale = p => Math.round(p.price * (100 - p.off) / 100);
const rupee = n => '₹' + n.toLocaleString('en-IN');
const find = id => PRODUCTS.find(p => p.id === id);

// ---------- Helpers ----------
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

let cart = load('joy_cart', []);   // [{id, qty}]
let wish = load('joy_wish', []);   // [id]
let filter = 'all', query = '';

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200);
}

// ---------- Age gate (18+) ----------
const age = $('#age');
if (!load('joy_age', false)) { age.hidden = false; $('#ageYes').focus(); }
$('#ageYes').addEventListener('click', () => { save('joy_age', true); age.hidden = true; });
$('#ageNo').addEventListener('click', () =>
  $('#ageMsg').textContent = 'Sorry, crackers can only be sold to buyers aged 18 or older.');

// ---------- Products ----------
function renderProducts() {
  const list = PRODUCTS.filter(p =>
    (filter === 'all' || p.tags.includes(filter)) && p.name.toLowerCase().includes(query));
  $('#productGrid').innerHTML = list.map(p => `
    <article class="card">
      <div class="pimg">
        <span class="off">${p.off}% OFF</span>
        <button class="wish" data-wish="${p.id}" aria-label="Toggle wishlist for ${p.name}" aria-pressed="${wish.includes(p.id)}">
          <i class="fa-${wish.includes(p.id) ? 'solid' : 'regular'} fa-heart" style="${wish.includes(p.id) ? 'color:#d6223c' : ''}"></i></button>
        <span aria-hidden="true">${p.emoji}</span>
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.remove()">
      </div>
      <div class="pbody">
        <h3>${p.name}</h3>
        <div class="pst" aria-label="${p.rating} out of 5 stars">${'★'.repeat(p.rating)}${'☆'.repeat(5 - p.rating)}</div>
        <div class="price"><b>${rupee(sale(p))}</b><s>${rupee(p.price)}</s></div>
        <button class="add" data-add="${p.id}">Add to Cart</button>
      </div>
    </article>`).join('');
  $('#noResults').hidden = list.length > 0;
}

function setFilter(f) {
  filter = f;
  $$('.chip').forEach(c => c.classList.toggle('active', c.dataset.filter === f));
  renderProducts();
}

$('#productGrid').addEventListener('click', e => {
  const add = e.target.closest('[data-add]'), w = e.target.closest('[data-wish]');
  if (add) addToCart(+add.dataset.add);
  if (w) {
    const id = +w.dataset.wish;
    wish = wish.includes(id) ? wish.filter(x => x !== id) : [...wish, id];
    save('joy_wish', wish); renderProducts();
    toast(wish.includes(id) ? 'Added to wishlist' : 'Removed from wishlist');
  }
});

// Category cards, offer cards and filter chips all share data-filter
$$('[data-filter]').forEach(el => el.addEventListener('click', () => {
  setFilter(el.dataset.filter);
  if (el.tagName === 'BUTTON' && !el.classList.contains('chip')) $('#products').scrollIntoView({ behavior: 'smooth' });
}));
$$('#menu a[data-cat]').forEach(a => a.addEventListener('click', () => setFilter(a.dataset.cat)));

// ---------- Frequently bought together ----------
$('#comboRow').innerHTML = COMBO.map(find)
  .map(p => `<span>${p.emoji} ${p.name} · ${rupee(sale(p))}</span>`).join('<i class="fa-solid fa-plus"></i>');
$('#addCombo').addEventListener('click', () => { COMBO.forEach(id => addToCart(id, true)); toast('3 items added to cart'); });

// ---------- Search ----------
$('#searchBtn').addEventListener('click', () => {
  const bar = $('#searchBar'); bar.classList.toggle('open');
  if (bar.classList.contains('open')) $('#searchInput').focus();
});
$('#searchInput').addEventListener('input', e => {
  query = e.target.value.trim().toLowerCase();
  renderProducts();
  if (query) $('#products').scrollIntoView({ behavior: 'smooth' });
});

// ---------- Cart ----------
function addToCart(id, silent) {
  const item = cart.find(i => i.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  updateCart(); if (!silent) toast('Added to cart');
}
function changeQty(id, d) {
  const item = cart.find(i => i.id === id); if (!item) return;
  item.qty += d;
  if (item.qty < 1) cart = cart.filter(i => i.id !== id);
  updateCart();
}
function updateCart() {
  save('joy_cart', cart);
  $('#cartCount').textContent = cart.reduce((s, i) => s + i.qty, 0);
  $('#cartTotal').textContent = rupee(cart.reduce((s, i) => s + sale(find(i.id)) * i.qty, 0));
  $('#cartItems').innerHTML = cart.length ? cart.map(i => {
    const p = find(i.id);
    return `<div class="ci"><div class="th" aria-hidden="true">${p.emoji}</div>
      <div><h4>${p.name}</h4><b>${rupee(sale(p))}</b>
        <div class="qty"><button data-q="${p.id}" data-d="-1" aria-label="Decrease quantity">−</button>
        <span>${i.qty}</span><button data-q="${p.id}" data-d="1" aria-label="Increase quantity">+</button></div></div>
      <button class="rm" data-rm="${p.id}" aria-label="Remove ${p.name}"><i class="fa-solid fa-trash"></i></button></div>`;
  }).join('') : '<p class="empty">Your cart is empty. Add some crackers to get started.</p>';
}
$('#cartItems').addEventListener('click', e => {
  const q = e.target.closest('[data-q]'), r = e.target.closest('[data-rm]');
  if (q) changeQty(+q.dataset.q, +q.dataset.d);
  if (r) { cart = cart.filter(i => i.id !== +r.dataset.rm); updateCart(); }
});
function toggleCart(open) {
  $('#drawer').classList.toggle('open', open);
  $('#overlay').classList.toggle('show', open);
  $('#drawer').setAttribute('aria-hidden', !open);
}
$('#cartBtn').addEventListener('click', () => toggleCart(true));
$('#closeCart').addEventListener('click', () => toggleCart(false));
$('#overlay').addEventListener('click', () => toggleCart(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleCart(false); });
$('#checkout').addEventListener('click', () =>
  toast(cart.length ? 'Demo store: checkout is not enabled.' : 'Your cart is empty.'));

// ---------- Mobile menu ----------
const menu = $('#menu'), burger = $('#burger');
burger.addEventListener('click', () => burger.setAttribute('aria-expanded', menu.classList.toggle('open')));
$$('#menu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

// ---------- Countdown (8 Nov 2026) ----------
const target = new Date('2026-11-08T23:59:59').getTime();
function tick() {
  const diff = target - Date.now();
  if (diff <= 0) {
    $('#timer').hidden = true;
    $('#saleMsg').textContent = 'The Dhamaka Sale has ended. Subscribe below to hear about our next offer!';
    return clearInterval(tick.id);
  }
  const pad = n => String(n).padStart(2, '0');
  $('#d').textContent = pad(Math.floor(diff / 864e5));
  $('#h').textContent = pad(Math.floor(diff / 36e5) % 24);
  $('#m').textContent = pad(Math.floor(diff / 6e4) % 60);
  $('#s').textContent = pad(Math.floor(diff / 1e3) % 60);
}
tick(); tick.id = setInterval(tick, 1000);

// ---------- Newsletter ----------
$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#email').value.trim()), msg = $('#newsMsg');
  msg.className = ok ? 'ok' : 'err';
  msg.textContent = ok ? 'Thank you for subscribing! Watch your inbox for Diwali offers.'
                       : 'Please enter a valid email address, like name@example.com.';
  if (ok) e.target.reset();
});

// ---------- Back to top ----------
const topBtn = $('#toTop');
window.addEventListener('scroll', () => topBtn.classList.toggle('show', scrollY > 500), { passive: true });
topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Init ----------
renderProducts();
updateCart();