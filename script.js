
document.addEventListener("DOMContentLoaded", () => {
  const proxyURL = "https://blue-paper-c9f3.brskraddy2.workers.dev/";
  const players = [
    { name: "Shohei Ohtani", id: "ohtani" },
    { name: "Aaron Judge", id: "judge" },
    { name: "Mookie Betts", id: "betts" },
    { name: "Ronald Acuña Jr.", id: "acuna" },
    { name: "Corey Seager", id: "seager" },
    { name: "CJ Abrams", id: "abrams" },
    { name: "Pete Alonso", id: "alonso" }
  ];

  const container = document.getElementById("cardContainer");
  const searchInput = document.getElementById("search");
  const alertInput = document.getElementById("alertThreshold");
  const lastUpdated = document.getElementById("lastUpdated");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const priceHistoryEl = document.getElementById("priceHistory");
  const closeModal = document.getElementById("closeModal");

  let cardElements = [];
  const priceHistories = {};

  function createCard(player) {
    const div = document.createElement("div");
    div.className = "card";
    div.dataset.name = player.name.toLowerCase();
    div.innerHTML = \`
      <img src="https://images.showzone.io/cards/live_series/\${player.id}.png"
           onerror="this.onerror=null;this.src='https://mlb-cards.vercel.app/card/\${player.id}.png';"
      />
      <h3>\${player.name}</h3>
      <p class="prices">
        Buy Now: <span class="buy">-</span><br />
        Sell Now: <span class="sell">-</span>
      </p>
    \`;
    div.addEventListener("click", () => showPriceHistory(player.name));
    container.appendChild(div);
    return div;
  }

  function updatePrices(listings) {
    cardElements.forEach(({ player, el }) => {
      const match = listings.find(l =>
        l.name.toLowerCase().includes(player.name.toLowerCase())
      );
      const buy = match ? match.best_buy_price : 0;
      const sell = match ? match.best_sell_price : 0;

      el.querySelector(".buy").textContent = buy;
      el.querySelector(".sell").textContent = sell;

      // Save history
      if (!priceHistories[player.name]) priceHistories[player.name] = [];
      priceHistories[player.name].unshift(buy);
      if (priceHistories[player.name].length > 10) {
        priceHistories[player.name] = priceHistories[player.name].slice(0, 10);
      }

      const threshold = parseFloat(alertInput.value);
      el.classList.remove("under-alert", "over-alert");
      if (!isNaN(threshold)) {
        if (buy <= threshold) {
          el.classList.add("under-alert");
        } else {
          el.classList.add("over-alert");
        }
      }
    });

    lastUpdated.textContent = new Date().toLocaleTimeString();
  }

  async function fetchData() {
    try {
      const res = await fetch(proxyURL);
      const data = await res.json();
      updatePrices(data.listings || []);
    } catch (e) {
      console.error("Fetch failed", e);
    }
  }

  function handleSearch() {
    const q = searchInput.value.toLowerCase();
    cardElements.forEach(({ player, el }) => {
      el.style.display = player.name.toLowerCase().includes(q) ? "" : "none";
    });
  }

  function showPriceHistory(playerName) {
    const prices = priceHistories[playerName] || [];
    modalTitle.textContent = \`\${playerName} - Price History\`;
    priceHistoryEl.innerHTML = prices.map(p => \`<li>\$ \${p}</li>\`).join("");
    modal.style.display = "block";
  }

  closeModal.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = e => {
    if (e.target === modal) modal.style.display = "none";
  };

  const savedThreshold = localStorage.getItem("alertThreshold");
  if (savedThreshold) alertInput.value = savedThreshold;

  alertInput.addEventListener("input", () => {
    localStorage.setItem("alertThreshold", alertInput.value);
  });

  searchInput.addEventListener("input", handleSearch);

  players.forEach(player => {
    const card = createCard(player);
    cardElements.push({ player, el: card });
  });

  fetchData();
  setInterval(fetchData, 2000);
});
