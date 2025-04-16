
document.addEventListener("DOMContentLoaded", () => {
  const cardsToWatch = [
    { name: "Pete Alonso", id: "alonso", image: "https://images.mlbcards.io/alonso.png" },
    { name: "CJ Abrams", id: "abrams", image: "https://images.mlbcards.io/abrams.png" },
    { name: "Josh Naylor", id: "naylor", image: "https://images.mlbcards.io/naylor.png" },
    { name: "Oneil Cruz", id: "cruz", image: "https://images.mlbcards.io/cruz.png" },
    { name: "Jack Leiter", id: "leiter", image: "https://images.mlbcards.io/leiter.png" },
    { name: "Corbin Carroll", id: "carroll", image: "https://images.mlbcards.io/carroll.png" },
    { name: "Colton Cowser", id: "cowser", image: "https://images.mlbcards.io/cowser.png" },
    { name: "Riley Greene", id: "greene", image: "https://images.mlbcards.io/greene.png" },
    { name: "Jack Flaherty", id: "flaherty", image: "https://images.mlbcards.io/flaherty.png" },
    { name: "Matt Chapman", id: "chapman", image: "https://images.mlbcards.io/chapman.png" },
    { name: "Anthony Rendon", id: "rendon", image: "https://images.mlbcards.io/rendon.png" }
  ];

  let notified = {};

  const fetchCardPrices = async () => {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const alertPrice = parseFloat(document.getElementById("globalAlert").value);
    const container = document.getElementById("cards");
    container.innerHTML = "<p>Loading...</p>";

    try {
      const res = await fetch("https://mlb25.theshow.com/apis/listings.json?type=mlb_card&page=1");
      const data = await res.json();
      const allListings = data.listings;
      container.innerHTML = "";

      cardsToWatch.forEach(player => {
        if (!player.name.toLowerCase().includes(search)) return;

        const match = allListings.find(item => item.name.toLowerCase().includes(player.name.toLowerCase()));
        if (match) {
          const card = document.createElement("div");
          card.className = "card";
          const isHigh = match.best_buy_price > alertPrice;
          const priceClass = isHigh ? "price-high" : "price-low";

          card.innerHTML = \`
            <img src="\${player.image}" alt="\${player.name}">
            <h2>\${match.name}</h2>
            <p class="\${priceClass}">Buy Now: \${match.best_buy_price}</p>
            <p>Sell Now: \${match.best_sell_price}</p>
          \`;
          container.appendChild(card);

          if (!isHigh && Notification.permission === "granted" && !notified[player.id]) {
            new Notification(\`\${player.name} dropped to \${match.best_buy_price}!\`);
            notified[player.id] = true;
          }

          if (isHigh) {
            notified[player.id] = false;
          }
        }
      });
    } catch (error) {
      container.innerHTML = "<p style='color: red;'>Failed to load card data. Please try again later.</p>";
      console.error("Error fetching card data:", error);
    }
  };

  document.getElementById("searchInput").addEventListener("input", fetchCardPrices);
  document.getElementById("globalAlert").addEventListener("input", fetchCardPrices);

  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  fetchCardPrices();
  setInterval(fetchCardPrices, 60000);
});
