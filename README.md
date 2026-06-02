# Canteen Express 🍔🍹

Welcome to **Canteen Express**, a premium, visually stunning Single Page Application (SPA) designed to revolutionize the campus canteen ordering experience. 

Featuring a gorgeous **obsidian dark theme**, glowing **glassmorphic cards**, robust cart math, and a **live preparation tracking timeline**, this application is designed for absolute visual excellence and seamless usability.

---

## 📂 Project Architecture

The project is clean and modularly split into separate frontend and backend directories:

```
My_Canteen/
├── frontend/
│   ├── index.html        # Main HTML layout, SEO meta tags, & drawers
│   ├── style.css         # Glassmorphic styles, custom keyframes, & grids
│   └── app.js            # Asynchronous fetch and client fallback engines
├── backend/
│   ├── server.js         # Native Node.js HTTP API server (zero dependencies)
│   ├── menu.json         # Canteen menu database
│   └── package.json      # Node configuration
└── README.md             # Project documentation (this file)
```

---

## 🌟 Key Features

*   **Premium Visuals**: Curated obsidian palette, dynamic HSL glow accents, micro-animations, and full mobile-first responsiveness.
*   **Dual-Mode Resilient Client**: The frontend attempts to sync with the backend database. If the server is offline or Node.js is not present on the host environment, it **automatically boots into a high-fidelity client local fallback mode** so all features remain 100% functional!
*   **Wok-to-Plate Category Filters**: Instant switches for **All Specialties**, **Fast Food** (🍔), **Beverages** (🍹), **Main Course** (🍛), and **Desserts** (🍰) with exact counters.
*   **Intelligent Search & Dietary Switches**: Instantly filter menu cards by keyword, or isolate **Vegetarian** or **Spicy** culinary creations.
*   **Interactive Shopping Cart**: Adjust quantities, remove items, add custom cooking instructions for the chef, and toggle between **Dine-In** and **Takeaway**.
*   **Promo Coupon Engine**: Apply codes like `BITE10` (10% off) or `SUPER20` (20% off) to get real-time price deductions.
*   **Digital Receipt & Live Prep Tracker**: Checkout generates a full-meta digital invoice and kicks off a **simulated 3-step live preparation progress bar** (`Placed` ➔ `Preparing` ➔ `Ready for Pickup`).

---

## 🚀 Setup & Launch Guide

### Mode A: Standalone Client (No Downloads/Node.js Required)
Perfect for instant testing on any device.
1. Navigate to the `frontend/` folder.
2. Double-click **`index.html`** to open it in your browser.
3. The app will detect the server is offline and automatically run in local mode with the full interactive experience.

### Mode B: Full-Stack Client-Server API Mode
For a connected full-stack experience using Node.js.
1. Navigate to the `backend/` folder in your terminal.
2. Run the server using:
   ```bash
   node server.js
   ```
3. Open or refresh **`frontend/index.html`** in your browser.
4. You will observe the top status dot turn green and read **"Kitchen Server Connected"**, processing all checkout transactions through the native HTTP API!

---

## 🛠️ Built With

*   **Frontend**: HTML5, Vanilla CSS3 (Custom variables, glassmorphic filters), Vanilla ES6 JavaScript (Fetch API, local fallbacks, Lucide icons).
*   **Backend**: Pure Native Node.js HTTP & FS modules (**Zero external npm package dependencies**).
