/* ==========================================================================
   NATIVE NODE.JS HTTP SERVER - CANTEEN EXPRESS API
   ========================================================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const menuPath = path.join(__dirname, 'menu.json');

// In-Memory Order Storage log
const orders = [];
const usersList = [];

// Static Constants
const GST_TAX_RATE = 0.05; // 5%
const PLATFORM_FEE = 15.00;
const VALID_COUPONS = {
  "BITE10": 0.10,
  "SUPER20": 0.20
};

// Helper: Read menu database
function readMenuDB() {
  try {
    const rawData = fs.readFileSync(menuPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading menu.json database:", error);
    return [];
  }
}

// Create native server instance
const server = http.createServer((req, res) => {
  // Set headers natively for CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log(`[${new Date().toISOString()}] Native HTTP request: ${req.method} to ${req.url}`);

  // Handle preflight CORS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Route 1: GET /api/menu
  if (req.method === 'GET' && req.url === '/api/menu') {
    const menu = readMenuDB();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(menu));
    return;
  }

  // Route 2: POST /api/orders
  if (req.method === 'POST' && req.url === '/api/orders') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { cartItems, couponCode, diningOption, chefInstructions } = payload;

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Cart is empty. Cannot process checkout." }));
          return;
        }

        const menu = readMenuDB();
        let subtotal = 0;
        const processedItems = [];

        // Match prices and item data securely
        for (const cartEntry of cartItems) {
          const dbItem = menu.find(item => item.id === cartEntry.item.id);
          if (!dbItem) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `Dish ID ${cartEntry.item.id} not found.` }));
            return;
          }

          const qty = parseInt(cartEntry.quantity);
          if (isNaN(qty) || qty <= 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Invalid item quantity." }));
            return;
          }

          const itemCost = dbItem.price * qty;
          subtotal += itemCost;

          processedItems.push({
            item: {
              id: dbItem.id,
              name: dbItem.name,
              price: dbItem.price,
              img: dbItem.img
            },
            quantity: qty,
            lineTotal: itemCost
          });
        }

        // Coupon application math
        let discountAmount = 0;
        let appliedCoupon = null;

        if (couponCode) {
          const upperCoupon = couponCode.trim().toUpperCase();
          if (VALID_COUPONS.hasOwnProperty(upperCoupon)) {
            appliedCoupon = upperCoupon;
            discountAmount = subtotal * VALID_COUPONS[upperCoupon];
          }
        }

        // Total calculations
        const taxedBase = subtotal - discountAmount;
        const taxes = taxedBase * GST_TAX_RATE;
        const grandTotal = taxedBase + taxes + PLATFORM_FEE;

        // Invoice receipt metadata
        const orderId = "CEX-" + Math.floor(100000 + Math.random() * 900000);
        const newOrder = {
          orderId,
          timestamp: new Date().toISOString(),
          items: processedItems,
          pricing: {
            subtotal,
            discountAmount,
            appliedCoupon,
            taxes,
            platformFee: PLATFORM_FEE,
            grandTotal
          },
          diningOption: diningOption || 'dine-in',
          chefInstructions: chefInstructions || ''
        };

        orders.push(newOrder);
        console.log(`[Order Placed] Invoice ${orderId} logged successfully. Grand Total: ₹${grandTotal.toFixed(2)}`);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newOrder));
      } catch (err) {
        console.error("Order processing error:", err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Malformed payload or invalid request body data." }));
      }
    });
    return;
  }

  // Route 3: POST /api/auth/register - User Registration
  if (req.method === 'POST' && req.url === '/api/auth/register') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { name, email, password } = JSON.parse(body);
        if (!name || !email || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "All registration fields (name, email, password) are required." }));
          return;
        }
        const exists = usersList.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Email is already registered. Try logging in." }));
          return;
        }
        const newUser = { name, email, password };
        usersList.push(newUser);
        console.log(`[Auth Register] Registered new user account: ${name} (${email})`);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ name: newUser.name, email: newUser.email }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Malformed payload." }));
      }
    });
    return;
  }

  // Route 4: POST /api/auth/login - User Sign In Authentication
  if (req.method === 'POST' && req.url === '/api/auth/login') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        const matchedUser = usersList.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (matchedUser) {
          console.log(`[Auth Login] User signed in successfully: ${matchedUser.name} (${matchedUser.email})`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ name: matchedUser.name, email: matchedUser.email }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Incorrect email or password." }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Malformed payload." }));
      }
    });
    return;
  }

  // Not Found fall-through
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: "Resource not found on Canteen Server." }));
});

// Start Server listener
server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` CANTEEN EXPRESS NATIVE SERVER ACTIVE ON PORT ${PORT}`);
  console.log(` Access API locally at http://localhost:${PORT}/api/menu`);
  console.log(` No node_modules or external packages required!`);
  console.log(`==================================================`);
});
