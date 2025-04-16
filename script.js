
document.addEventListener("DOMContentLoaded", () => {
  const cardsToWatch = [
    { name: "Pete Alonso", id: "alonso", image: "" },
    { name: "CJ Abrams", id: "abrams", image: "" },
    { name: "Josh Naylor", id: "naylor", image: "" },
    { name: "Oneil Cruz", id: "cruz", image: "" },
    { name: "Jack Leiter", id: "leiter", image: "" },
    { name: "Corbin Carroll", id: "carroll", image: "" },
    { name: "Colton Cowser", id: "cowser", image: "" },
    { name: "Riley Greene", id: "greene", image: "" },
    { name: "Jack Flaherty", id: "flaherty", image: "" },
    { name: "Matt Chapman", id: "chapman", image: "" },
    { name: "Anthony Rendon", id: "rendon", image: "" }
  ];

  let notified = {};

  const normalize = (str) =>
    str.toLowerCase().replace(/[^a-z0-9]/g, "");

  const fetchCardPrices = async () => {
    const search = normalize(document.getElementById("searchInput").value);
    const alertPrice = parseFloat(document.getElementById("globalAlert").value);
    const container = document.getElementById("cards");
    container.innerHTML = "<p>Loading...</p>";

    try {
      const res = await fetch("https://blue-paper-c9f3.brskraddy2.workers.dev/");
      const data = await res.json();
      const allListings = data.listings;
      container.innerHTML = "";

      cardsToWatch.forEach(player => {
        const searchName = normalize(player.name);
        if (!searchName.includes(search)) return;

        const match = allListings.find(item => normalize(item.name).includes(searchName));
        if (match) {
          const card = document.createElement("div");
          card.className = "card";
          const isHigh = match.best_buy_price > alertPrice;
          const priceClass = isHigh ? "price-high" : "price-low";

          const image = player.image || "https://via.placeholder.com/250x350?text=Card+Image";

          card.innerHTML = \`
            <img src="\${image}" alt="\${player.name}">
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

      const timestamp = new Date().toLocaleTimeString();
      const updateMsg = document.createElement("p");
      updateMsg.style.color = "#888";
      updateMsg.style.textAlign = "center";
      updateMsg.textContent = `Last updated: ${timestamp}`;
      container.appendChild(updateMsg);

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
