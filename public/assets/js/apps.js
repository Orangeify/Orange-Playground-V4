// apps.js
function filterCards() {
  const search = document.getElementById("app-search");
  const query = search ? search.value.trim().toLowerCase() : "";

  document.querySelectorAll(".square-card").forEach(card => {
    const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
    card.hidden = !title.includes(query);
  });
}

async function loadCards() {
  try {
    const response = await fetch("./assets/json/apps.json");
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

      if (card.url) {
        cardDiv.addEventListener("click", () => {
          window.location.href = `/assessments/blooket-sg.html?title=${encodeURIComponent(card.title)}&url=${encodeURIComponent(card.url)}`;
        });
        cardDiv.style.cursor = "pointer";
      }

      cardDiv.appendChild(img);
      cardDiv.appendChild(title);
      container.appendChild(cardDiv);
    });
    filterCards();
  } catch (error) {
    console.error("Error loading cards:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadCards);

document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("app-search");
  if (search) {
    search.addEventListener("input", filterCards);
  }
});