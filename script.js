// Products Dataset (Aapki image ke exact filenames ke saath)
const products = [
  { id: 1, name: "Aloo Bhujiya", price: 120, originalPrice: 150, img: "aloo bhujiya.png" },
            { id: 2, name: "Black Pepper Banana Chips", price: 140, originalPrice: 180, img: "black pepar banana chips.png" },
            { id: 3, name: "Fast Banana Chips", price: 130, originalPrice: 160, img: "fast banana chips.png" },
            { id: 4, name: "Gujarati Namkeen", price: 110, originalPrice: 140, img: "gujarati namkeen.png" },
            { id: 5, name: "Jeera Puri", price: 90, originalPrice: 120, img: "jeera puri.png" },
            { id: 6, name: "Mitha Namkeen", price: 100, originalPrice: 130, img: "mitha namkeen.png" },
            { id: 7, name: "Panipuri Banana Chips", price: 150, originalPrice: 190, img: "panipuri banana chips.png" },
            { id: 8, name: "Peri Peri Banana Chips", price: 150, originalPrice: 200, img: "peri peri banana chips.png" }
        ];


// Global State Variables
let cart = [];
let wishlist = [];
let orderHistory = [];
let currentTotal = 0;

// 1. Render All Products
function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="wishlist-icon ${wishlist.includes(p.id) ? 'active' : ''}" onclick="toggleWishlist(${p.id})">
        <i class="fa-solid fa-heart"></i>
      </div>
      <img src="${p.img}" alt="${p.name}" class="product-img" onerror="this.src='https://via.placeholder.com/200?text=${encodeURIComponent(p.name)}'">
      <div class="product-info">
        <div class="product-title">${p.name}</div>
        <div class="product-price">₹${p.price}</div>
        <div class="card-actions">
          <button class="btn btn-cart" onclick="addToCart(${p.id})">
            <i class="fa-solid fa-cart-plus"></i> Cart
          </button>
          <button class="btn btn-buy" onclick="directBuy(${p.id})">
            Buy
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// 2. Toggle Side Drawers (Cart, Wishlist, Order History)
function toggleDrawer(id) {
  const drawer = document.getElementById(id);
  if (drawer) {
    drawer.classList.toggle('open');
  }
}

// 3. Wishlist Management
function toggleWishlist(id) {
  const index = wishlist.indexOf(id);
  if (index === -1) {
    wishlist.push(id);
  } else {
    wishlist.splice(index, 1);
  }
  updateWishlistUI();
  renderProducts();
}

function updateWishlistUI() {
  const countBadge = document.getElementById('wishlistCount');
  if (countBadge) countBadge.innerText = wishlist.length;

  const content = document.getElementById('wishlistContent');
  if (!content) return;

  if (wishlist.length === 0) {
    content.innerHTML = '<p style="text-align:center; padding:20px;">Wishlist khali hai</p>';
    return;
  }

  const items = products.filter(p => wishlist.includes(p.id));
  content.innerHTML = items.map(p => `
    <div class="wishlist-item">
      <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/50'">
      <div style="flex:1;">
        <div><strong>${p.name}</strong></div>
        <div style="color:var(--primary-red)">₹${p.price}</div>
      </div>
      <button class="btn btn-cart" style="padding:5px 8px;" onclick="addToCart(${p.id})">
        <i class="fa-solid fa-cart-plus"></i>
      </button>
    </div>
  `).join('');
}

// 4. Cart Management & Total Calculation
function addToCart(id) {
  const item = cart.find(c => c.id === id);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartBadge = document.getElementById('cartCount');
  if (cartBadge) cartBadge.innerText = count;

  const content = document.getElementById('cartContent');
  const cartTotalDisplay = document.getElementById('cartTotal');
  if (!content) return;

  if (cart.length === 0) {
    content.innerHTML = '<p style="text-align:center; padding:20px;">Cart khali hai</p>';
    if (cartTotalDisplay) cartTotalDisplay.innerText = '₹0';
    currentTotal = 0;
    return;
  }

  let total = 0;
  content.innerHTML = cart.map(item => {
    const p = products.find(prod => prod.id === item.id);
    const itemTotal = p.price * item.qty;
    total += itemTotal;
    return `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/50'">
        <div style="flex:1;">
          <div><strong>${p.name}</strong></div>
          <div>₹${p.price} x ${item.qty}</div>
        </div>
        <div><strong>₹${itemTotal}</strong></div>
      </div>
    `;
  }).join('');

  currentTotal = total;
  if (cartTotalDisplay) cartTotalDisplay.innerText = `₹${total}`;
}

// 5. Direct Buy Option
function directBuy(id) {
  cart = [{ id, qty: 1 }];
  updateCartUI();
  openCheckout();
}

// 6. Dynamic UPI QR Code Generation & Checkout Modal
function openCheckout() {
  if (cart.length === 0) {
    alert('Apki cart khali hai!');
    return;
  }

  const qrTotalDisplay = document.getElementById('qrTotal');
  if (qrTotalDisplay) qrTotalDisplay.innerText = `₹${currentTotal}`;
  
  // Apka UPI Details Setup
  const upiId = "vishwashfoods@upi"; // Yahan apna UPI ID replace karein
  const name = "Vishwash Foods";
  const upiURL = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${currentTotal}&cu=INR`;
  
  // Dynamic QR Code Generation API
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiURL)}`;
  const qrImage = document.getElementById('qrImage');
  if (qrImage) qrImage.src = qrApi;

  const paymentModal = document.getElementById('paymentModal');
  if (paymentModal) paymentModal.classList.add('active');
}

function closeModal() {
  const paymentModal = document.getElementById('paymentModal');
  if (paymentModal) paymentModal.classList.remove('active');
}

// 7. Order Confirmation & Print Bill Invoice
function confirmOrder() {
  const orderId = 'VF' + Math.floor(100000 + Math.random() * 900000);
  const orderDate = new Date().toLocaleString();
  
  const orderData = {
    id: orderId,
    date: orderDate,
    total: currentTotal,
    items: [...cart]
  };

  orderHistory.push(orderData);
  updateHistoryUI();

  // Print Invoice Preparation
  const invDate = document.getElementById('invDate');
  const invId = document.getElementById('invId');
  const invTotal = document.getElementById('invTotal');
  const invItems = document.getElementById('invItems');

  if (invDate) invDate.innerText = orderDate;
  if (invId) invId.innerText = orderId;
  if (invTotal) invTotal.innerText = `₹${currentTotal}`;
  
  if (invItems) {
    invItems.innerHTML = cart.map(item => {
      const p = products.find(prod => prod.id === item.id);
      return `<p>${p.name} x ${item.qty} - ₹${p.price * item.qty}</p>`;
    }).join('');
  }

  closeModal();
  cart = [];
  updateCartUI();
  toggleDrawer('cartDrawer');

  // Open Browser Print Dialog for Invoice Receipt
  setTimeout(() => {
    window.print();
  }, 500);
}

// 8. Order History Management
function updateHistoryUI() {
    const content = document.getElementById('historyContent');
    if (!content) return;

    if (orderHistory.length === 0) {
        content.innerHTML = '<p style="text-align:center; padding:20px;">Koi purana order nahi hai.</p>';
        return;
    }

    content.innerHTML = orderHistory.map(o => `
        <div style="background: var(--accent-yellow-light); padding:12px; margin-bottom:10px; border-radius:8px; border:1px solid #ddd;">
            <small style="color:#666;">${o.date}</small>
            <div><strong>Order #${o.id}</strong></div>
            <div style="font-size:13px; color:#444; margin: 4px 0;">Items: ${o.items || 'Items detail missing'}</div>
            <div style="color: var(--primary-red); font-weight:bold;">Total: ₹${o.total}</div>
        </div>
    `).join('');
}

// Initial Load on Document Ready
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateWishlistUI();
  updateCartUI();
  updateHistoryUI();
});
https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    // Existing invoice update
    const invDate = document.getElementById('invDate');
    const invId = document.getElementById('invId');
    const invTotal = document.getElementById('invTotal');
    const invItems = document.getElementById('invItems');

    if (invDate) invDate.innerText = orderDate;
    if (invId) invId.innerText = orderId;
    if (invTotal) invTotal.innerText = `₹${currentTotal}`;

    if (invItems) {
        invItems.innerHTML = cart.map(item => {
            const p = products.find(prod => prod.id === item.id);
            return `<p>${p.name} x ${item.qty} - ₹${p.price * item.qty}</p>`;
        }).join('');
    }

    closeModal();

    cart = [];
    updateCartUI();
    toggleDrawer('cartDrawer');

    setTimeout(() => {
        window.print();
    }, 500);
}
