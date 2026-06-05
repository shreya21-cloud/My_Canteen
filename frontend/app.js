/* ==========================================================================
   CLIENT LOGIC - CANTEEN EXPRESS (RESILIENT HYBRID STATE)
   ========================================================================== */

// 1. Backend Server API Configuration
const API_BASE = "http://localhost:5000/api";

// 2. High-fidelity Offline Database Fallback
const LOCAL_FALLBACK_MENU = [
  {
    id: "f1",
    name: "Double Crunch Burger",
    category: "fast-food",
    price: 160,
    desc: "Crispy golden double patty layered with signature spicy chipotle spread and liquid cheddar cheese.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    veg: false,
    rating: 4.9,
    chefSpecial: true,
    popular: true
  },
  {
    id: "f2",
    name: "Cheesy Margherita Pizza",
    category: "fast-food",
    price: 220,
    desc: "Hand-stretched sourdough base, bubbling gourmet mozzarella, premium tomato reduction, and fresh garden basil.",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
    veg: true,
    rating: 4.7,
    chefSpecial: false,
    popular: true
  },
  {
    id: "f3",
    name: "Spicy Sriracha Fries",
    category: "fast-food",
    price: 90,
    desc: "Skin-on premium potatoes tossed in hot sriracha seasoning and fresh herbs. Served with garlic dip.",
    img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60",
    veg: true,
    rating: 4.5,
    chefSpecial: false,
    popular: false
  },
  {
    id: "b1",
    name: "Mocha Frappe",
    category: "beverages",
    price: 120,
    desc: "Premium double espresso shot blended with rich dark chocolate, fresh milk, and smooth whipped cream.",
    img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60",
    veg: true,
    rating: 4.8,
    chefSpecial: true,
    popular: true
  },
  {
    id: "b2",
    name: "Sunset Mocktail",
    category: "beverages",
    price: 95,
    desc: "A beautiful layered, sparkling peach & strawberry cold infusion with a squeeze of fresh Key lime.",
    img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60",
    veg: true,
    rating: 4.6,
    chefSpecial: false,
    popular: false
  },
  {
    id: "b3",
    name: "Spiced Masala Chai",
    category: "beverages",
    price: 45,
    desc: "Traditional slow-brewed Indian milk tea infused with crushed cardamom, cinnamon, cloves, and ginger.",
    img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60",
    veg: true,
    rating: 4.9,
    chefSpecial: false,
    popular: true
  },
  {
    id: "m1",
    name: "Alfredo Cream Pasta",
    category: "main-course",
    price: 180,
    desc: "Penne pasta enveloped in a rich, buttery garlic parmesan cream sauce. Served with herbs and crusty garlic toast.",
    img: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=60",
    veg: true,
    rating: 4.7,
    chefSpecial: false,
    popular: false
  },
  {
    id: "m2",
    name: "Spicy Schezwan Noodles",
    category: "main-course",
    price: 140,
    desc: "Fiery wok-tossed hand-pulled noodles with crisp bell peppers, spring onions, and premium spices.",
    img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60",
    veg: true,
    rating: 4.6,
    chefSpecial: false,
    popular: false
  },
  {
    id: "m3",
    name: "Butter Chicken Rice Bowl",
    category: "main-course",
    price: 240,
    desc: "Classic creamy, tomato-based boneless butter chicken served over fragrant steamed Basmati rice.",
    img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60",
    veg: false,
    rating: 4.8,
    chefSpecial: true,
    popular: true
  },
  {
    id: "d1",
    name: "Chocolate Lava Waffle",
    category: "desserts",
    price: 150,
    desc: "Warm golden Belgian waffle topped with absolute fudge chocolate sauce, cookie crumbles, and vanilla gelato scoop.",
    img: "https://images.unsplash.com/photo-1562376502-6f769499c886?w=500&auto=format&fit=crop&q=60",
    veg: true,
    rating: 4.9,
    chefSpecial: true,
    popular: true
  },
  {
    id: "d2",
    name: "Blueberry Cheesecake Slice",
    category: "desserts",
    price: 170,
    desc: "Smooth baked New York cream cheese filling on a crunchy graham crust, topped with a tart blueberry compote glaze.",
    img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60",
    veg: true,
    rating: 4.8,
    chefSpecial: false,
    popular: true
  }
];

// App Variables
let FOOD_MENU = [];
let isOfflineMode = false;

let currentCategory = "all";
let searchFilter = "";
let isVegOnly = false;
let isSpicyOnly = false;
let currentSort = "default";

let cart = [];
let appliedCoupon = null;
let currentDiningOption = "dine-in";

let currentUser = null;
let authActionCallback = null;

// Constants sync
const COUPONS = {
  "BITE10": 0.10,
  "SUPER20": 0.20
};
const GST_TAX_RATE = 0.05;
const PLATFORM_FEE = 15.00;

// Categories list
const CATEGORIES = [
  { id: "all", name: "All Specialties", icon: "💎", desc: "Our complete kitchen catalog loaded with rich culinary wonders." },
  { id: "fast-food", name: "Fast Food", icon: "🍔", desc: "Sizzling burgers, classic cheesy pizzas, and crispy hot bites." },
  { id: "beverages", name: "Beverages", icon: "🍹", desc: "Freshly cold-blended frappes, iced mocktails, and steaming hot tea." },
  { id: "main-course", name: "Main Course", icon: "🍛", desc: "Gourmet creamy pastas, spicy fried noodles, and flavorful rice bowls." },
  { id: "desserts", name: "Desserts", icon: "🍰", desc: "Fudge waffles, blueberry cheesecake slices, and ice creams." }
];

// 3. DOM Elements Selectors
const categoryTabsContainer = document.getElementById("category-tabs");
const foodCardsContainer = document.getElementById("food-cards-container");
const selectedCategoryTitle = document.getElementById("selected-category-title");
const selectedCategoryDesc = document.getElementById("selected-category-desc");
const searchInput = document.getElementById("menu-search");
const mobileSearchInput = document.getElementById("mobile-menu-search");
const sortSelect = document.getElementById("sort-select");
const vegFilterCheckbox = document.getElementById("filter-veg");
const spicyFilterCheckbox = document.getElementById("filter-spicy");
const clearFiltersBtn = document.getElementById("btn-clear-filters");
const emptyStateEl = document.getElementById("empty-state");

// Cart Drawer Selectors
const cartDrawer = document.getElementById("cart-drawer");
const btnCartToggle = document.getElementById("btn-cart-toggle");
const btnCloseCart = document.getElementById("btn-close-cart");
const cartDrawerOverlay = document.getElementById("cart-drawer-overlay");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartEmptyVisual = document.getElementById("cart-empty-visual");
const cartSummarySection = document.getElementById("cart-summary-section");
const cartCounterBadge = document.getElementById("cart-counter");
const cartNavTotalLabel = document.getElementById("cart-nav-total");

// Cart Summary Selectors
const inputCoupon = document.getElementById("coupon-code");
const btnApplyCoupon = document.getElementById("btn-apply-coupon");
const couponFeedbackMsg = document.getElementById("coupon-msg");
const summarySubtotal = document.getElementById("summary-subtotal");
const discountRow = document.getElementById("discount-row");
const discountPercentLabel = document.getElementById("discount-percent");
const summaryDiscount = document.getElementById("summary-discount");
const summaryTaxes = document.getElementById("summary-taxes");
const summaryTotal = document.getElementById("summary-total");
const diningOptionBtns = document.querySelectorAll(".dining-option-toggles button");
const kitchenInstructionsInput = document.getElementById("kitchen-instructions");
const btnPlaceOrder = document.getElementById("btn-place-order");

// Receipt Modal Selectors
const receiptModal = document.getElementById("receipt-modal");
const btnCloseReceipt = document.getElementById("btn-close-receipt");
const receiptOrderId = document.getElementById("receipt-order-id");
const receiptDatetime = document.getElementById("receipt-datetime");
const receiptTypeBadge = document.getElementById("receipt-type-badge");
const receiptChefNoteContainer = document.getElementById("receipt-chef-note-container");
const receiptChefNote = document.getElementById("receipt-chef-note");
const receiptItemsList = document.getElementById("receipt-items-list");
const receiptSubtotal = document.getElementById("receipt-subtotal");
const receiptDiscountRow = document.getElementById("receipt-discount-row");
const receiptDiscount = document.getElementById("receipt-discount");
const receiptTaxesFees = document.getElementById("receipt-taxes-fees");
const receiptTotal = document.getElementById("receipt-total");

// Tracker Steps
const stepPlaced = document.getElementById("step-placed");
const stepPrep = document.getElementById("step-prep");
const stepReady = document.getElementById("step-ready");

// Authentication DOM selectors
const authModal = document.getElementById("auth-modal");
const btnAuthModalOpen = document.getElementById("btn-auth-modal-open");
const btnCloseAuth = document.getElementById("btn-close-auth");
const tabSignIn = document.getElementById("tab-sign-in");
const tabSignUp = document.getElementById("tab-sign-up");
const formSignIn = document.getElementById("form-sign-in");
const formSignUp = document.getElementById("form-sign-up");
const signinEmail = document.getElementById("signin-email");
const signinPassword = document.getElementById("signin-password");
const signinError = document.getElementById("signin-error");
const signupName = document.getElementById("signup-name");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupError = document.getElementById("signup-error");

// User Header DOM selectors
const userProfileMenu = document.getElementById("user-profile-menu");
const userHeaderName = document.getElementById("user-header-name");
const userAvatarLetter = document.getElementById("user-avatar-letter");
const dropdownFullName = document.getElementById("dropdown-full-name");
const dropdownEmailText = document.getElementById("dropdown-email-text");
const btnSignOut = document.getElementById("btn-sign-out");
const btnUserAvatar = document.getElementById("btn-user-avatar");
const userDropdownList = document.getElementById("user-dropdown-list");

// 4. Initializer function
document.addEventListener("DOMContentLoaded", () => {
  // Setup real-time header clock
  startLiveClock();
  
  // Bind all event listeners
  registerEventListeners();

  // Load menu data
  fetchMenuData();

  // Restore user session if persisted
  restoreUserSession();
  
  // Refresh Lucide Icons initially
  lucide.createIcons();
});

// Restore user session from localStorage
function restoreUserSession() {
  const savedUser = localStorage.getItem("canteen_user");
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      updateUserHeaderUI();
    } catch (e) {
      console.error("Session restore failed", e);
      localStorage.removeItem("canteen_user");
    }
  }
}

// Update header when user signs in or signs out
function updateUserHeaderUI() {
  if (currentUser) {
    btnAuthModalOpen.classList.add("hidden");
    userProfileMenu.classList.remove("hidden");
    userHeaderName.textContent = currentUser.name.split(" ")[0]; // First name
    userAvatarLetter.textContent = currentUser.name.charAt(0).toUpperCase();
    dropdownFullName.textContent = currentUser.name;
    dropdownEmailText.textContent = currentUser.email;
  } else {
    btnAuthModalOpen.classList.remove("hidden");
    userProfileMenu.classList.add("hidden");
    userDropdownList.classList.add("hidden");
  }
}

// Switching tab triggers
window.switchAuthTab = function(tab) {
  if (tab === 'sign-in') {
    tabSignIn.classList.add("active");
    tabSignUp.classList.remove("active");
    formSignIn.classList.remove("hidden");
    formSignUp.classList.add("hidden");
    signinError.classList.add("hidden");
  } else {
    tabSignIn.classList.remove("active");
    tabSignUp.classList.add("active");
    formSignIn.classList.add("hidden");
    formSignUp.classList.remove("hidden");
    signupError.classList.add("hidden");
  }
}

// 5. Asynchronous Fetch API Request with robust Local Fallback
async function fetchMenuData() {
  try {
    // Attempt connecting to the server with a short timeout threshold
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${API_BASE}/menu`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("Could not retrieve menu database.");
    
    FOOD_MENU = await res.json();
    isOfflineMode = false;
    console.log("Successfully connected to Canteen Server API! Loaded items count:", FOOD_MENU.length);
    
    // Update live status badge indicator in UI to highlight connection
    document.querySelector(".status-indicator").className = "status-indicator online";
    document.querySelector(".info-item span:not(.status-indicator)").textContent = "Kitchen Server Connected";
  } catch (error) {
    console.warn("Express Server offline. Activating client-side resilient local database engine.", error);
    
    FOOD_MENU = LOCAL_FALLBACK_MENU;
    isOfflineMode = true;
    
    // Smoothly update UI status
    const statusDot = document.querySelector(".status-indicator");
    if (statusDot) {
      statusDot.style.backgroundColor = "var(--accent-secondary)";
      statusDot.style.boxShadow = "0 0 10px var(--accent-secondary)";
      statusDot.style.animation = "none";
    }
    const infoText = document.querySelector(".info-item span:not(.status-indicator)");
    if (infoText) infoText.textContent = "Kitchen Live (Local Cache)";
  } finally {
    // Populate UI tabs & cards
    renderCategoryTabs();
    renderFoodCards();
  }
}

// 6. Clock Engine
function startLiveClock() {
  const clockLabel = document.getElementById("live-time");
  function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    clockLabel.textContent = `${hours}:${minutes} ${ampm}`;
  }
  updateTime();
  setInterval(updateTime, 30000);
}

// 7. UI Category Sidebar Rendering
function renderCategoryTabs() {
  categoryTabsContainer.innerHTML = CATEGORIES.map(cat => {
    const count = cat.id === "all" ? FOOD_MENU.length : FOOD_MENU.filter(f => f.category === cat.id).length;
    
    return `
      <button class="category-btn ${cat.id === currentCategory ? 'active' : ''}" data-cat-id="${cat.id}">
        <div class="cat-btn-content">
          <span class="icon-box">${cat.icon}</span>
          <span class="cat-name">${cat.name}</span>
        </div>
        <span class="cat-badge">${count}</span>
      </button>
    `;
  }).join("");

  const catBtns = categoryTabsContainer.querySelectorAll(".category-btn");
  catBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.catId;
      
      const selected = CATEGORIES.find(c => c.id === currentCategory);
      selectedCategoryTitle.textContent = selected.name;
      selectedCategoryDesc.textContent = selected.desc;

      catBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      renderFoodCards();
    });
  });
}

// 8. Grid Foods Render Engine
function renderFoodCards() {
  let filtered = FOOD_MENU.filter(item => {
    const matchesCategory = currentCategory === "all" || item.category === currentCategory;
    const cleanSearch = searchFilter.toLowerCase().trim();
    const matchesSearch = item.name.toLowerCase().includes(cleanSearch) || 
                          item.desc.toLowerCase().includes(cleanSearch);
    const matchesVeg = !isVegOnly || item.veg === true;
    const matchesSpicy = !isSpicyOnly || item.desc.toLowerCase().includes("spicy") || item.desc.toLowerCase().includes("fiery") || item.desc.toLowerCase().includes("sriracha");
    
    return matchesCategory && matchesSearch && matchesVeg && matchesSpicy;
  });

  if (currentSort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === "popular") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (filtered.length === 0) {
    foodCardsContainer.classList.add("hidden");
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
    foodCardsContainer.classList.remove("hidden");

    foodCardsContainer.innerHTML = filtered.map(item => {
      let tagsHTML = "";
      if (item.veg) {
        tagsHTML += `<span class="tag-badge veg">Veg</span>`;
      } else {
        tagsHTML += `<span class="tag-badge nonveg">Non-Veg</span>`;
      }
      
      if (item.chefSpecial) {
        tagsHTML += `<span class="tag-badge chef">Chef Special</span>`;
      }
      
      if (item.popular) {
        tagsHTML += `<span class="tag-badge popular">Popular</span>`;
      }

      return `
        <article class="food-card" data-food-id="${item.id}">
          <div class="card-media-wrapper">
            <img class="food-card-img" src="${item.img}" alt="${item.name}" loading="lazy">
            <div class="badge-tag-container">
              ${tagsHTML}
            </div>
            <div class="rating-overlay">
              <i data-lucide="star"></i>
              <span>${item.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div class="card-content-body">
            <h3 class="food-card-title">${item.name}</h3>
            <p class="food-card-desc">${item.desc}</p>
            
            <div class="card-footer-action">
              <div class="price-tag">
                <span>₹</span>${item.price.toFixed(2)}
              </div>
              <button class="btn-add-to-cart" onclick="addToCart('${item.id}')">
                <i data-lucide="plus"></i> Add to Cart
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    lucide.createIcons();
  }
}

// 9. Event Registers
function registerEventListeners() {
  searchInput.addEventListener("input", (e) => {
    searchFilter = e.target.value;
    mobileSearchInput.value = e.target.value;
    renderFoodCards();
  });

  mobileSearchInput.addEventListener("input", (e) => {
    searchFilter = e.target.value;
    searchInput.value = e.target.value;
    renderFoodCards();
  });

  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderFoodCards();
  });

  vegFilterCheckbox.addEventListener("change", (e) => {
    isVegOnly = e.target.checked;
    renderFoodCards();
  });

  spicyFilterCheckbox.addEventListener("change", (e) => {
    isSpicyOnly = e.target.checked;
    renderFoodCards();
  });

  clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    mobileSearchInput.value = "";
    searchFilter = "";
    vegFilterCheckbox.checked = false;
    isVegOnly = false;
    spicyFilterCheckbox.checked = false;
    isSpicyOnly = false;
    sortSelect.value = "default";
    currentSort = "default";
    currentCategory = "all";
    
    renderCategoryTabs();
    renderFoodCards();
  });

  btnCartToggle.addEventListener("click", () => {
    cartDrawer.classList.add("active");
  });

  btnCloseCart.addEventListener("click", () => {
    cartDrawer.classList.remove("active");
  });

  cartDrawerOverlay.addEventListener("click", () => {
    cartDrawer.classList.remove("active");
  });

  btnApplyCoupon.addEventListener("click", () => {
    const code = inputCoupon.value.trim().toUpperCase();
    if (!code) {
      showCouponFeedback("Please enter a code.", "error");
      return;
    }

    if (COUPONS.hasOwnProperty(code)) {
      appliedCoupon = { code: code, rate: COUPONS[code] };
      showCouponFeedback(`Applied! ${appliedCoupon.rate * 100}% discount saved.`, "success");
      updateCartSummary();
    } else {
      showCouponFeedback("Invalid Coupon Code. Try BITE10 or SUPER20.", "error");
      appliedCoupon = null;
      updateCartSummary();
    }
  });

  diningOptionBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      diningOptionBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentDiningOption = btn.dataset.option;
    });
  });

  btnPlaceOrder.addEventListener("click", () => {
    if (cart.length === 0) return;
    
    postOrderCheckout();
  });

  btnCloseReceipt.addEventListener("click", () => {
    receiptModal.classList.add("hidden");
    stepPlaced.className = "tracker-step";
    stepPrep.className = "tracker-step";
    stepReady.className = "tracker-step";
  });

  // Auth modal actions
  btnAuthModalOpen.addEventListener("click", () => {
    authModal.classList.remove("hidden");
    switchAuthTab('sign-in');
  });

  btnCloseAuth.addEventListener("click", () => {
    authModal.classList.add("hidden");
    authActionCallback = null; // Clear callbacks
  });

  tabSignIn.addEventListener("click", () => switchAuthTab('sign-in'));
  tabSignUp.addEventListener("click", () => switchAuthTab('tab-sign-up'));

  // Toggle user profile dropdown
  btnUserAvatar.addEventListener("click", (e) => {
    e.stopPropagation();
    userDropdownList.classList.toggle("hidden");
  });

  // Close dropdown clicking outside
  document.addEventListener("click", () => {
    userDropdownList.classList.add("hidden");
  });

  // Sign out click
  btnSignOut.addEventListener("click", () => {
    currentUser = null;
    localStorage.removeItem("canteen_user");
    updateUserHeaderUI();
    cart = [];
    updateCartDrawerUI();
  });

  // Sign In submit
  formSignIn.addEventListener("submit", async (e) => {
    e.preventDefault();
    signinError.classList.add("hidden");
    const email = signinEmail.value.trim();
    const password = signinPassword.value.trim();

    // Mode A: Server-Side Auth if online
    if (!isOfflineMode) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          const user = await res.json();
          currentUser = user;
          localStorage.setItem("canteen_user", JSON.stringify(user));
          updateUserHeaderUI();
          authModal.classList.add("hidden");
          formSignIn.reset();
          if (authActionCallback) {
            const cb = authActionCallback;
            authActionCallback = null;
            cb();
          }
          return;
        }
      } catch (err) {
        console.warn("Server auth failed, trying local fallback", err);
      }
    }

    // Mode B: Local Simulation Auth (offline)
    const localUsers = JSON.parse(localStorage.getItem("canteen_users") || "[]");
    const matchedUser = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    // Add default account fallback for testing
    if (matchedUser || (email.toLowerCase() === "user@campus.com" && password === "123456")) {
      const user = matchedUser || { name: "Campus Student", email: email };
      currentUser = user;
      localStorage.setItem("canteen_user", JSON.stringify(user));
      updateUserHeaderUI();
      authModal.classList.add("hidden");
      formSignIn.reset();
      if (authActionCallback) {
        const cb = authActionCallback;
        authActionCallback = null;
        cb();
      }
    } else {
      signinError.classList.remove("hidden");
    }
  });

  // Sign Up submit
  formSignUp.addEventListener("submit", async (e) => {
    e.preventDefault();
    signupError.classList.add("hidden");
    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value.trim();

    // Mode A: Server-Side Register if online
    if (!isOfflineMode) {
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });
        if (res.ok) {
          const user = await res.json();
          currentUser = user;
          localStorage.setItem("canteen_user", JSON.stringify(user));
          updateUserHeaderUI();
          authModal.classList.add("hidden");
          formSignUp.reset();
          if (authActionCallback) {
            const cb = authActionCallback;
            authActionCallback = null;
            cb();
          }
          return;
        } else {
          const errData = await res.json();
          if (errData.error) {
            signupError.textContent = errData.error;
            signupError.classList.remove("hidden");
            return;
          }
        }
      } catch (err) {
        console.warn("Server register failed, trying local fallback", err);
      }
    }

    // Mode B: Local Simulation Register (offline)
    const localUsers = JSON.parse(localStorage.getItem("canteen_users") || "[]");
    const exists = localUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (exists || email.toLowerCase() === "user@campus.com") {
      signupError.textContent = "Email is already registered. Please log in.";
      signupError.classList.remove("hidden");
    } else {
      const newUser = { name, email, password };
      localUsers.push(newUser);
      localStorage.setItem("canteen_users", JSON.stringify(localUsers));
      
      // Auto login
      currentUser = { name, email };
      localStorage.setItem("canteen_user", JSON.stringify(currentUser));
      updateUserHeaderUI();
      authModal.classList.add("hidden");
      formSignUp.reset();
      if (authActionCallback) {
        const cb = authActionCallback;
        authActionCallback = null;
        cb();
      }
    }
  });
}

function showCouponFeedback(text, type) {
  couponFeedbackMsg.className = `coupon-feedback ${type}`;
  couponFeedbackMsg.textContent = text;
}

// 10. Core Shopping Cart Engine
window.addToCart = function(id) {
  const item = FOOD_MENU.find(f => f.id === id);
  if (!item) return;

  const cartIndex = cart.findIndex(c => c.item.id === id);

  if (cartIndex > -1) {
    cart[cartIndex].quantity += 1;
  } else {
    cart.push({
      item: item,
      quantity: 1
    });
  }

  btnCartToggle.style.transform = "scale(1.15)";
  setTimeout(() => {
    btnCartToggle.style.transform = "scale(1)";
  }, 150);

  updateCartDrawerUI();
};

window.updateQuantity = function(id, delta) {
  const cartIndex = cart.findIndex(c => c.item.id === id);
  if (cartIndex === -1) return;

  cart[cartIndex].quantity += delta;

  if (cart[cartIndex].quantity <= 0) {
    cart.splice(cartIndex, 1);
  }

  updateCartDrawerUI();
};

window.removeFromCart = function(id) {
  const cartIndex = cart.findIndex(c => c.item.id === id);
  if (cartIndex > -1) {
    cart.splice(cartIndex, 1);
  }
  updateCartDrawerUI();
};

function updateCartDrawerUI() {
  const totalItemsCount = cart.reduce((sum, current) => sum + current.quantity, 0);
  cartCounterBadge.textContent = totalItemsCount;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "";
    cartEmptyVisual.classList.remove("hidden");
    cartSummarySection.classList.add("hidden");
    cartNavTotalLabel.textContent = "₹0.00";
    appliedCoupon = null;
    inputCoupon.value = "";
    couponFeedbackMsg.textContent = "";
  } else {
    cartEmptyVisual.classList.add("hidden");
    cartSummarySection.classList.remove("hidden");

    cartItemsContainer.innerHTML = cart.map(c => `
      <div class="cart-item">
        <img class="cart-item-img" src="${c.item.img}" alt="${c.item.name}">
        <div class="cart-item-info">
          <div class="cart-item-adjuster">
            <span class="cart-item-name">${c.item.name}</span>
            <button class="btn-remove-item" onclick="removeFromCart('${c.item.id}')" aria-label="Remove item">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
          <div class="cart-item-adjuster">
            <span class="cart-item-price">₹${(c.item.price * c.quantity).toFixed(2)}</span>
            <div class="quantity-controls">
              <button onclick="updateQuantity('${c.item.id}', -1)" aria-label="Decrease quantity">-</button>
              <span class="qty-display">${c.quantity}</span>
              <button onclick="updateQuantity('${c.item.id}', 1)" aria-label="Increase quantity">+</button>
            </div>
          </div>
        </div>
      </div>
    `).join("");

    lucide.createIcons();
    updateCartSummary();
  }
}

function updateCartSummary() {
  const subtotal = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
  let discount = 0;

  if (appliedCoupon) {
    discount = subtotal * appliedCoupon.rate;
    discountRow.classList.remove("hidden");
    discountPercentLabel.textContent = `${appliedCoupon.rate * 100}%`;
    summaryDiscount.textContent = `-₹${discount.toFixed(2)}`;
  } else {
    discountRow.classList.add("hidden");
  }

  const taxedBase = subtotal - discount;
  const taxes = taxedBase * GST_TAX_RATE;
  const grandTotal = taxedBase + taxes + PLATFORM_FEE;

  summarySubtotal.textContent = `₹${subtotal.toFixed(2)}`;
  summaryTaxes.textContent = `₹${taxes.toFixed(2)}`;
  summaryTotal.textContent = `₹${grandTotal.toFixed(2)}`;
  cartNavTotalLabel.textContent = `₹${grandTotal.toFixed(2)}`;
}

// 11. Dual Mode Order checkout submission
async function postOrderCheckout() {
  // Check if user is authenticated
  if (!currentUser) {
    // Intercept checkout and open sign-in modal
    authActionCallback = () => { postOrderCheckout(); };
    authModal.classList.remove("hidden");
    switchAuthTab('sign-in');
    
    // Customize prompt title to guide guest user
    const signInTitle = document.querySelector("#form-sign-in .auth-header-desc h3");
    const signInDesc = document.querySelector("#form-sign-in .auth-header-desc p");
    if (signInTitle) signInTitle.textContent = "Sign In Required";
    if (signInDesc) signInDesc.textContent = "Please sign in or create an account to finalize your checkout order.";
    return;
  }
  
  // Restore standard text just in case
  const signInTitle = document.querySelector("#form-sign-in .auth-header-desc h3");
  const signInDesc = document.querySelector("#form-sign-in .auth-header-desc p");
  if (signInTitle) signInTitle.textContent = "Welcome Back!";
  if (signInDesc) signInDesc.textContent = "Sign in to your account to place your canteen orders.";

  const instructionsVal = kitchenInstructionsInput.value.trim();
  const checkoutPayload = {
    cartItems: cart,
    couponCode: appliedCoupon ? appliedCoupon.code : null,
    diningOption: currentDiningOption,
    chefInstructions: instructionsVal
  };

  btnPlaceOrder.disabled = true;
  btnPlaceOrder.innerHTML = `<span>Processing Securely...</span>`;

  // Mode A: Server-Side processing if online
  if (!isOfflineMode) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutPayload)
      });

      if (!res.ok) {
        const errDetails = await res.json();
        throw new Error(errDetails.error || "Order placement failed.");
      }

      const orderReceipt = await res.json();
      renderOrderReceipt(orderReceipt);
      return;
    } catch (error) {
      console.warn("Direct checkout call failed. Reverting to local transaction engine...", error);
    }
  }

  // Mode B: Client-side local transaction simulation (offline mode)
  setTimeout(() => {
    const subtotal = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
    const discount = appliedCoupon ? subtotal * appliedCoupon.rate : 0;
    const taxes = (subtotal - discount) * GST_TAX_RATE;
    const grandTotal = (subtotal - discount) + taxes + PLATFORM_FEE;

    const localReceipt = {
      orderId: "CEX-L" + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      items: cart.map(c => ({
        item: { id: c.item.id, name: c.item.name, price: c.item.price, img: c.item.img },
        quantity: c.quantity,
        lineTotal: c.item.price * c.quantity
      })),
      pricing: {
        subtotal,
        discountAmount: discount,
        appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
        taxes,
        platformFee: PLATFORM_FEE,
        grandTotal
      },
      diningOption: currentDiningOption,
      chefInstructions: instructionsVal
    };

    renderOrderReceipt(localReceipt);
  }, 1000);
}

// Render Order Receipt
function renderOrderReceipt(receipt) {
  receiptOrderId.textContent = `#${receipt.orderId}`;
  
  const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  receiptDatetime.textContent = new Date(receipt.timestamp).toLocaleDateString("en-US", options);

  receiptTypeBadge.textContent = receipt.diningOption === "dine-in" ? "Dine-In" : "Takeaway";
  
  if (receipt.chefInstructions) {
    receiptChefNoteContainer.classList.remove("hidden");
    receiptChefNote.textContent = `"${receipt.chefInstructions}"`;
  } else {
    receiptChefNoteContainer.classList.add("hidden");
  }

  receiptItemsList.innerHTML = receipt.items.map(entry => `
    <div class="receipt-item-row">
      <div class="r-item-left">
        <span class="r-qty">${entry.quantity}x</span>
        <span class="r-name">${entry.item.name}</span>
      </div>
      <span class="r-price">₹${entry.lineTotal.toFixed(2)}</span>
    </div>
  `).join("");

  receiptSubtotal.textContent = `₹${receipt.pricing.subtotal.toFixed(2)}`;
  
  if (receipt.pricing.discountAmount > 0) {
    receiptDiscountRow.classList.remove("hidden");
    receiptDiscount.textContent = `-₹${receipt.pricing.discountAmount.toFixed(2)}`;
  } else {
    receiptDiscountRow.classList.add("hidden");
  }

  const taxesFeesTotal = receipt.pricing.taxes + receipt.pricing.platformFee;
  receiptTaxesFees.textContent = `₹${taxesFeesTotal.toFixed(2)}`;
  receiptTotal.textContent = `₹${receipt.pricing.grandTotal.toFixed(2)}`;

  receiptModal.classList.remove("hidden");
  cartDrawer.classList.remove("active");

  // Reset local state
  cart = [];
  kitchenInstructionsInput.value = "";
  appliedCoupon = null;
  inputCoupon.value = "";
  couponFeedbackMsg.textContent = "";
  updateCartDrawerUI();

  // Reset button state
  btnPlaceOrder.disabled = false;
  btnPlaceOrder.innerHTML = `<span>Secure Order Checkout</span><i data-lucide="arrow-right"></i>`;
  lucide.createIcons();

  // Run progress timeline
  runLivePreparationTracker();
}

function runLivePreparationTracker() {
  stepPlaced.className = "tracker-step active";
  
  setTimeout(() => {
    stepPlaced.className = "tracker-step completed";
    stepPrep.className = "tracker-step active";
  }, 4000);

  setTimeout(() => {
    stepPrep.className = "tracker-step completed";
    stepReady.className = "tracker-step active";
  }, 9000);
}
