// Product Data matched with GitHub uploaded images
const products = [
    { 
        id: 1, 
        title: "Black Pepper Banana Wafers", 
        price: 120, 
        oldPrice: 150, 
        discount: "20% OFF", 
        image: "BLACK PEPPER BANANA WAFERS.JPG.png" 
    },
    { 
        id: 2, 
        title: "Panipuri Flavour Banana Wafers", 
        price: 130, 
        oldPrice: 160, 
        discount: "18% OFF", 
        image: "PANIPURI FLAVOUR BANANA WEFERS.JPG.png" 
    },
    { 
        id: 3, 
        title: "Salted Banana Wafers", 
        price: 110, 
        oldPrice: 140, 
        discount: "21% OFF", 
        image: "SALTED BANANA WEFERS.JPG.png" 
    },
    { 
        id: 4, 
        title: "Spicy Banana Wafers", 
        price: 125, 
        oldPrice: 150, 
        discount: "16% OFF", 
        image: "SPICY BANANA WAFERS.JPG.png" 
    }
];

// App State
let wishlist = [];
let cart = [];
let orderHistory = [];
let selectedBuyProduct = null;

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
});

// Render Product Cards
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = products.map(prod => `
        <div class="product-card">
            <button class="wishlist-icon-btn" onclick="toggleWishlist(${prod.id})">
                <i class="${wishlist.includes(prod.id) ? 'fa-solid' : 'fa-regular'} fa-heart" style="color: ${wishlist.includes(prod.id) ? '#e65100' : '#212121'}"></i>
            </button>
            <img src="${prod.image}" alt="${prod.title}" class="product-img" onerror="this.src='https://via.placeholder.com/300x200?text=Vishwash+Foods'">
            <div class="product-info">
                <h3 class="product-title">${prod.title}</h3>
                <div class="price-tag">
                    <span class="current-price">₹${prod.price}</span>
                    <span class="old-price">₹${prod.oldPrice}</span>
                    <span class="offer-badge">${prod.discount}</span>
                </div>
                <div class="btn-group">
                    <button class="btn-secondary" onclick="addToCart(${prod.id})">Cart</button>
                    <button class="btn-primary" onclick="openBuySlide(${prod.id})">Buy Now</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Wishlist Logic
function toggleWishlist(id) {
    wishlist = wishlist.includes(id) ? wishlist.filter(item => item !== id) : [...wishlist, id];
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) wishlistCount.innerText = wishlist.length;
    renderProducts();
}

// Add to Cart
function addToCart(id) {
    const prod = products.find(p => p.id === id);
    cart.push(prod);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = cart.length;
    alert(`${prod.title} Added to Cart!`);
}

// Open Buy Slide Drawer
function openBuySlide(id) {
    selectedBuyProduct = products.find(p => p.id === id);
    const summary = document.getElementById('checkout-summary');
    if (summary) {
        summary.innerHTML = `
            <div style="display: flex; gap: 10px; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <img src="${selectedBuyProduct.image}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/50'">
                <div>
                    <h4 style="font-size: 0.9rem;">${selectedBuyProduct.title}</h4>
                    <p style="color: var(--primary, #e65100); font-weight: bold; font-size: 0.9rem;">Price: ₹${selectedBuyProduct.price}</p>
                </div>
            </div>
        `;
    }
    const drawer = document.getElementById('checkout-drawer');
    if (drawer) drawer.classList.add('open');
}

// Event Listeners
function setupEventListeners() {
    // Close Drawer
    const closeDrawerBtn = document.getElementById('close-drawer');
    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', () => {
            document.getElementById('checkout-drawer').classList.remove('open');
        });
    }

    // Pincode Check
    const checkPincodeBtn = document.getElementById('check-pincode-btn');
    if (checkPincodeBtn) {
        checkPincodeBtn.addEventListener('click', () => {
            const pin = document.getElementById('pincode-input').value.trim();
            const msg = document.getElementById('pincode-msg');
            if (pin.length === 6 && !isNaN(pin)) {
                msg.className = "msg-text success";
                msg.innerText = "✓ Delivery Available!";
            } else {
                msg.className = "msg-text error";
                msg.innerText = "✕ Invalid Pincode.";
            }
        });
    }

    // Submit Order
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const orderData = {
                id: 'ORD' + Math.floor(100000 + Math.random() * 900000),
                product: selectedBuyProduct ? selectedBuyProduct.title : "Wafer Pack",
                amount: selectedBuyProduct ? selectedBuyProduct.price : 0,
                date: new Date().toLocaleDateString()
            };
            orderHistory.push(orderData);
            alert(`🎉 Order Placed Successfully!\nOrder ID: ${orderData.id}`);
            orderForm.reset();
            document.getElementById('checkout-drawer').classList.remove('open');
        });
    }

    // Orders Modal
    const ordersBtn = document.getElementById('orders-btn');
    if (ordersBtn) {
        ordersBtn.addEventListener('click', () => {
            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = orderHistory.length === 0 ? "<h3>My Orders</h3><p style='margin-top:10px;'>No orders placed yet.</p>" : `
                <h3>My Orders</h3>
                ${orderHistory.map(o => `<div style="border-bottom:1px solid #eee; padding: 8px 0; font-size:0.85rem;">
                    <strong>ID:</strong> ${o.id} | <strong>Product:</strong> ${o.product} | <strong>Amount:</strong> ₹${o.amount}
                </div>`).join('')}
            `;
            document.getElementById('modal-overlay').style.display = 'flex';
        });
    }

    // Close Modal
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('modal-overlay').style.display = 'none';
        });
    }
}
