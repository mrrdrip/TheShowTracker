
const placeholderImage = "https://via.placeholder.com/250x350?text=Card+Image";

const players = [
  { name: "Shohei Ohtani", buy: 100000, sell: 90000, image: placeholderImage },
  { name: "Aaron Judge", buy: 80000, sell: 75000, image: placeholderImage },
  { name: "Mookie Betts", buy: 60000, sell: 55000, image: placeholderImage },
  { name: "Ronald Acuña Jr.", buy: 70000, sell: 68000, image: placeholderImage },
  { name: "Corey Seager", buy: 5000, sell: 4500, image: placeholderImage },
  { name: "Random Player", buy: 1000, sell: 800, image: placeholderImage }
];

const container = document.querySelector(".card-container");
container.innerHTML = players.map(player => `
  <div class="card">
    <img src="${player.image}" alt="${player.name}" />
    <h3>${player.name}</h3>
    <p class="prices">
      Buy Now: <span class="buy">${player.buy}</span><br />
      Sell Now: <span class="sell">${player.sell}</span>
    </p>
  </div>
`).join("");

document.getElementById("lastUpdated").textContent = new Date().toLocaleString();

const cards = document.querySelectorAll(".card");
const searchInput = document.getElementById("search");
const alertInput = document.getElementById("alertThreshold");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  cards.forEach((card, index) => {
    const playerName = players[index].name.toLowerCase();
    card.style.display = playerName.includes(query) ? "" : "none";
  });
});

alertInput.addEventListener("input", () => {
  const val = parseFloat(alertInput.value);
  const threshold = (!isNaN(val) && val > 0) ? val : null;
  cards.forEach((card, index) => {
    card.classList.remove("under-alert", "over-alert");
    if (threshold !== null) {
      const buyPrice = players[index].buy;
      if (buyPrice <= threshold) {
        card.classList.add("under-alert");
      } else {
        card.classList.add("over-alert");
      }
    }
  });
});
