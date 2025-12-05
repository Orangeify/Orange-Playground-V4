// games.js
async function loadCards() {
  try {
    const response = await fetch("./assets/json/games.json");
    const data = await response.json();

    const container = document.querySelector(".square-grid");
    container.innerHTML = "";

    data.cards.forEach(card => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "square-card";

      // Create image element
      const img = document.createElement("img");
      img.src = card.image;
      img.alt = card.title;
      img.className = "square-image";

      const title = document.createElement("h3");
      title.textContent = card.title;

      if (card.link) {
        cardDiv.addEventListener("click", () => {
          window.location.href = card.link;
        });
        cardDiv.style.cursor = "pointer";
      }

      cardDiv.appendChild(img);
      cardDiv.appendChild(title);
      container.appendChild(cardDiv);
    });
  } catch (error) {
    console.error("Error loading cards:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadCards);