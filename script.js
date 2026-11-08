// ==========================================================================
// NORTH STAR BAKERY - SCRIPT.JS (TOUCHSTONE 4)
// ==========================================================================

// RUBRIC REQUIREMENT: Two Arrays/Objects managing application state and data
const bakeryCatalog = [
  {
    id: "country-sourdough",
    name: "Signature Country Sourdough",
    category: "breads",
    price: "$8.50",
    description: "Classic wild yeast sourdough with crisp crust & open airy crumb."
  },
  {
    id: "seeded-multigrain",
    name: "Seeded Multigrain Loaf",
    category: "breads",
    price: "$9.00",
    description: "Packed with toasted flax, sesame, and sunflower seeds."
  },
  {
    id: "french-baguette",
    name: "Rustic French Baguette",
    category: "breads",
    price: "$4.50",
    description: "Light, airy crumb with a delicate golden crisp crust."
  },
  {
    id: "olive-focaccia",
    name: "Rosemary Olive Focaccia",
    category: "breads",
    price: "$7.00",
    description: "Rich with extra virgin olive oil, sea salt, and fresh rosemary."
  },
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    category: "pastries",
    price: "$4.00",
    description: "Multi-layered, ultra-flaky traditional butter croissant."
  },
  {
    id: "pain-au-chocolat",
    name: "Pain au Chocolat",
    category: "pastries",
    price: "$4.75",
    description: "Flaky pastry dough filled with rich bittersweet dark chocolate."
  },
  {
    id: "cardamom-buns",
    name: "Morning Cardamom Buns",
    category: "pastries",
    price: "$4.25",
    description: "Sweet twisted dough infused with crushed cardamom and pearl sugar."
  },
  {
    id: "fruit-galette",
    name: "Seasonal Fruit Galette",
    category: "pastries",
    price: "$5.25",
    description: "Flaky butter pastry folded around fresh local seasonal fruit."
  },
  {
    id: "layer-cakes",
    name: "Classic Layer Cakes (6\" or 8\")",
    category: "cakes",
    price: "$38.00 - $58.00",
    description: "Vanilla bean, chocolate espresso, or lemon curd layered sponge."
  },
  {
    id: "fruit-tarts",
    name: "Rustic Fruit Tarts",
    category: "cakes",
    price: "$32.00",
    description: "Shortcrust pastry filled with diplomat cream and seasonal berries."
  },
  {
    id: "pastry-platter",
    name: "Pastry Platter",
    category: "cakes",
    price: "$45.00",
    description: "Assorted mini croissants, scones, and danishes (serves 10-12)."
  }
];

let savedFavorites = [];

// ==========================================================================
// SECTION A: CLIENT-SIDE STORAGE & FAVORITES MANAGEMENT
// ==========================================================================
function loadSavedFavorites() {
  const stored = localStorage.getItem("nsb_user_favorites");
  if (stored) {
    try {
      savedFavorites = JSON.parse(stored);
    } catch (e) {
      savedFavorites = [];
    }
  }
}

function toggleFavorite(itemId) {
  const item = bakeryCatalog.find(prod => prod.id === itemId);
  if (!item) return;

  const index = savedFavorites.indexOf(itemId);
  if (index === -1) {
    savedFavorites.push(itemId);
    localStorage.setItem("nsb_last_selected_item", item.name);
  } else {
    savedFavorites.splice(index, 1);
  }

  localStorage.setItem("nsb_user_favorites", JSON.stringify(savedFavorites));
  const activeBtn = document.querySelector(".filter-btn.active");
  const currentCategory = activeBtn ? activeBtn.getAttribute("data-category") : "all";
  renderMenuCatalog(currentCategory);
}

// ==========================================================================
// SECTION B: INTERACTIVE FEATURE - DYNAMIC CATALOG FILTERING (products.html)
// ==========================================================================
function renderMenuCatalog(category = "all") {
  const container = document.getElementById("catalog-display");
  if (!container) return;

  container.innerHTML = "";

  const filteredItems = category === "all"
    ? bakeryCatalog
    : bakeryCatalog.filter(prod => prod.category === category);

  filteredItems.forEach(item => {
    const isFav = savedFavorites.includes(item.id);

    const card = document.createElement("article");
    card.className = "catalog-card";
    card.innerHTML = `
      <div class="catalog-card-header">
        <h3>${item.name}</h3>
        <span class="catalog-price">${item.price}</span>
      </div>
      <p class="catalog-desc">${item.description}</p>
      <div class="catalog-card-actions">
        <button type="button" class="btn-fav ${isFav ? 'is-active' : ''}" onclick="toggleFavorite('${item.id}')">
          ${isFav ? "★ Saved to Favorites" : "☆ Add to Favorites"}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function setupCategoryFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  if (buttons.length === 0) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderMenuCatalog(btn.getAttribute("data-category"));
    });
  });
}

// ==========================================================================
// SECTION C: FORM VALIDATION & PRE-FILLING (contact.html)
// ==========================================================================
function prefillPreOrderField() {
  const itemDetailsField = document.getElementById("item-details");
  const lastSelected = localStorage.getItem("nsb_last_selected_item");

  if (itemDetailsField && lastSelected && itemDetailsField.value.trim() === "") {
    itemDetailsField.value = `Inquiring about pre-order for: ${lastSelected} (Qty: 1)`;
  }
}

function showFieldError(inputId, errorMsg) {
  const errorElem = document.getElementById(`${inputId}-error`);
  const inputElem = document.getElementById(inputId);

  if (errorElem) {
    errorElem.textContent = errorMsg;
    errorElem.style.display = errorMsg ? "block" : "none";
  }
  if (inputElem) {
    if (errorMsg) {
      inputElem.classList.add("input-invalid");
    } else {
      inputElem.classList.remove("input-invalid");
    }
  }
}

function validatePreOrderForm(event) {
  event.preventDefault();
  let formIsValid = true;

  const fullName = document.getElementById("full-name");
  const emailAddr = document.getElementById("email-address");
  const requestType = document.getElementById("request-type");
  const itemDetails = document.getElementById("item-details");

  // Check 1: Required Name Field
  if (!fullName.value.trim()) {
    showFieldError("full-name", "Please enter your full name.");
    formIsValid = false;
  } else {
    showFieldError("full-name", "");
  }

  // Check 2: Email Format Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailAddr.value.trim()) {
    showFieldError("email-address", "Email address is required.");
    formIsValid = false;
  } else if (!emailRegex.test(emailAddr.value.trim())) {
    showFieldError("email-address", "Please enter a valid email format (e.g., name@example.com).");
    formIsValid = false;
  } else {
    showFieldError("email-address", "");
  }

  // Check 3: Required Request Type Selection
  if (!requestType.value) {
    showFieldError("request-type", "Please select a request type from the list.");
    formIsValid = false;
  } else {
    showFieldError("request-type", "");
  }

  // Check 4: Minimum Character Length on Order Details
  if (!itemDetails.value.trim()) {
    showFieldError("item-details", "Item details and quantities cannot be empty.");
    formIsValid = false;
  } else if (itemDetails.value.trim().length < 10) {
    showFieldError("item-details", "Please provide at least 10 characters describing your order.");
    formIsValid = false;
  } else {
    showFieldError("item-details", "");
  }

  // Successful submission handler
  if (formIsValid) {
    const feedbackBanner = document.getElementById("form-feedback-success");
    if (feedbackBanner) {
      feedbackBanner.textContent = "Thank you! Your pre-order request has been validated and received.";
      feedbackBanner.style.display = "block";
    }
    const formElement = event.target;
    formElement.reset();
  }
}

// ==========================================================================
// INITIALIZATION ON DOM LOAD
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadSavedFavorites();
  setupCategoryFilters();
  renderMenuCatalog("all");

  prefillPreOrderField();
  const preOrderForm = document.querySelector('form[action="#"]');
  if (preOrderForm) {
    preOrderForm.setAttribute("novalidate", "true");
    preOrderForm.addEventListener("submit", validatePreOrderForm);
  }
});
