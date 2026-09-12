const grid = document.querySelector("#restaurantGrid");
const search = document.querySelector("#searchInput");
const count = document.querySelector("#resultCount");
const cartPanel = document.querySelector("#cartPanel");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cartItems");
let selectedCategory = "All";
let bag = [];

async function loadRestaurants() {
  const params = new URLSearchParams({ category: selectedCategory, search: search.value });
  const response = await fetch(`/api/restaurants?${params}`);
  const restaurants = await response.json();
  count.textContent = `${restaurants.length} places`;
  grid.innerHTML = restaurants.length ? restaurants.map((r, index) => `
    <article class="restaurant-card" style="animation-delay:${index * 70}ms">
      <div class="food-art ${r.color}"><span>${r.emoji}</span><div class="offer-pill">${r.offer}</div><button class="heart" aria-label="Save ${r.name}">♡</button></div>
      <div class="card-body"><div class="title-row"><h3>${r.name}</h3><span class="rating">★ ${r.rating}</span></div><p>${r.dish}</p><div class="meta"><span>${r.time}</span><i></i><span>${r.price}</span></div><button class="add" data-id="${r.id}" data-name="${r.name}">Add to bag <span>＋</span></button></div>
    </article>`).join("") : `<p class="no-results">No restaurants match that search. Try something else!</p>`;
  document.querySelectorAll(".add").forEach(button => button.addEventListener("click", addToBag));
}

function addToBag(event) {
  bag.push({ name: event.currentTarget.dataset.name, price: 249 });
  renderBag();
  cartPanel.classList.add("open"); overlay.classList.add("show");
}
function renderBag() {
  document.querySelector("#cartCount").textContent = bag.length;
  document.querySelector("#total").textContent = `₹${bag.reduce((sum, item) => sum + item.price, 0)}`;
  cartItems.innerHTML = bag.length ? bag.map((item, i) => `<div class="cart-item"><span>🍽️</span><div><b>${item.name}</b><small>One delicious pick</small></div><button data-index="${i}" class="remove">×</button></div>`).join("") : `<p class="empty">Your bag is waiting for something delicious.</p>`;
  document.querySelectorAll(".remove").forEach(button => button.addEventListener("click", e => { bag.splice(e.currentTarget.dataset.index, 1); renderBag(); }));
}
function closeBag() { cartPanel.classList.remove("open"); overlay.classList.remove("show"); }

document.querySelectorAll(".category").forEach(button => button.addEventListener("click", () => {
  document.querySelector(".category.active").classList.remove("active"); button.classList.add("active"); selectedCategory = button.dataset.category; loadRestaurants();
}));
search.addEventListener("input", loadRestaurants);
document.querySelector("#cartButton").addEventListener("click", () => { cartPanel.classList.add("open"); overlay.classList.add("show"); });
document.querySelector("#closeCart").addEventListener("click", closeBag); overlay.addEventListener("click", closeBag);
loadRestaurants();
