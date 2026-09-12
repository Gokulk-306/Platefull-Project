const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

const restaurants = [
  { id: 1, name: "Spice Route", category: "Indian", rating: 4.7, time: "25–30 min", price: "₹250 for two", emoji: "🍛", color: "saffron", offer: "50% OFF up to ₹100", dish: "Butter chicken, biryani & more" },
  { id: 2, name: "Pizza Borough", category: "Pizza", rating: 4.5, time: "30–35 min", price: "₹350 for two", emoji: "🍕", color: "tomato", offer: "FREE garlic bread", dish: "Wood-fired pizzas & sides" },
  { id: 3, name: "Green Bowl Co.", category: "Healthy", rating: 4.8, time: "20–25 min", price: "₹300 for two", emoji: "🥗", color: "leaf", offer: "20% OFF", dish: "Fresh bowls, wraps & juices" },
  { id: 4, name: "Wok This Way", category: "Chinese", rating: 4.4, time: "25–30 min", price: "₹280 for two", emoji: "🍜", color: "plum", offer: "₹125 OFF above ₹499", dish: "Noodles, dimsums & Asian bowls" },
  { id: 5, name: "Burger District", category: "Burgers", rating: 4.6, time: "20–25 min", price: "₹300 for two", emoji: "🍔", color: "cheese", offer: "Buy 1, get fries", dish: "Smash burgers & loaded fries" },
  { id: 6, name: "Dosa Diaries", category: "South Indian", rating: 4.7, time: "20–30 min", price: "₹220 for two", emoji: "🥞", color: "coconut", offer: "FREE filter coffee", dish: "Crisp dosas and comforting meals" }
];

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/restaurants", (req, res) => {
  const term = (req.query.search || "").toLowerCase();
  const category = req.query.category || "All";
  const matches = restaurants.filter((restaurant) =>
    (category === "All" || restaurant.category === category) &&
    `${restaurant.name} ${restaurant.category} ${restaurant.dish}`.toLowerCase().includes(term)
  );
  res.json(matches);
});

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Plateful is serving at http://localhost:${PORT}`);
  });
}

module.exports = app;
