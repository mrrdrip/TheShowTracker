
const cardsToWatch = [
  "Pete Alonso",
  "CJ Abrams",
  "Josh Naylor",
  "Oneil Cruz",
  "Jack Leiter"
];

async function fetchCardPrices() {
  const res = await fetch("https://mlb25.theshow.com/apis/listings.json?type=mlb_card&page=1");
  const data = await res.json();
  const allListings = data.listings;

  const search = document.getElementById("searchInput").value.toLowerCase();
  const alertPrice = parseFloat(document.getElementById("priceAlert").value);
  const container = document.getElementById("cards");
  container.innerHTML = "";

  cardsToWatch.forEach(name => {
    if (!name.toLowerCase().includes(search)) return;

    const match = allListings.find(item => item.name.toLowerCase().includes(name.toLowerCase()));
    if (match) {
      const div = document.createElement("div");
      div.className = "card";

      const isHigh = match.best_buy_price >= alertPrice;
      div.style.borderLeft = isHigh ? "5px solid #e53935" : "5px solid #4caf50";

      div.innerHTML = \`
        <strong>\${match.name}</strong><br>
        Buy Now: \${match.best_buy_price} | Sell Now: \${match.best_sell_price}
      \`;
      container.appendChild(div);
    }
  });
}

document.getElementById("searchInput").addEventListener("input", fetchCardPrices);
document.getElementById("priceAlert").addEventListener("input", fetchCardPrices);

fetchCardPrices();
setInterval(fetchCardPrices, 60000); // refresh every 60 sec
