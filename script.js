// Product Data matching Repository Image Filenames
const products = [
    {
        id: 1,
        name: "Black Pepper Banana Wafers",
        price: 120,
        oldPrice: 150,
        img: "BLACKPEPPERBANANAWAFERS.png",
        rating: "★★★★★ (4.9)"
    },
    {
        id: 2,
        name: "Pani Puri Flavour Banana Wafers",
        price: 130,
        oldPrice: 160,
        img: "PANIPURIFLAVOURBANANAWEFERS.png",
        rating: "★★★★★ (5.0)"
    },
    {
        id: 3,
        name: "Salted Banana Wafers",
        price: 110,
        oldPrice: 140,
        img: "SALTEDBANANAWEFERS.png",
        rating: "★★★★☆ (4.8)"
    },
    {
        id: 4,
        name: "Spicy Banana Wafers",
        price: 125,
        oldPrice: 155,
        img: "SPICYBANANAWAFERS.png",
        rating: "★★★★★ (4.9)"
    }
];

let cart = [];
let wishlist = [];

// DOM Element Selectors
const productList = document.getElementById('product-list');
const cartBtn = document.getElementById('cart-btn');
const wishlistBtn = document.getElementById('wishlist-btn');
const overlay = document.getElementById('overlay');
const cartDrawer = document.getElementById('cart-drawer');
const wishlistDrawer = document.getElementById('wishlist-drawer');
const checkoutModal = document.getElementById('checkout-modal');
const successModal = document.getElementById('success-modal');
const checkoutBtn = document.getElementById('checkout-btn');
const reviewForm = document.getElementById('review-form');
const checkoutForm = document.getElementById('checkout-form');
const copyUpiBtn = document.getElementById('copy-upi-btn');
const closeBtns = document.querySelectorAll('.close-btn');

// Initialize Website Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    
    // Header Drawer Toggle Buttons
    cartBtn.addEventListener('click', () => openDrawer('cart'));
    wishlistBtn.addEventListener('click', () => openDrawer('wishlist'));
    
    // Overlay & Close Buttons Listener
    overlay.addEventListener('click', closeAllDrawers);
    closeBtns.forEach(btn => btn.addEventListener('click', closeAllDrawers));

    // Checkout Trigger
    checkoutBtn.addEventListener('click', openCheckout);

    // Form Handlers
    reviewForm.addEventListener('submit', handleReviewSubmit);
    checkoutForm.addEventListener('submit', processUPIOrder);

    // Copy UPI ID
    copyUpiBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('8460183525@upi');
        alert('UPI ID (8460183525@upi) copied to clipboard!');
    });
});

// Render Product Cards
function renderProducts() {
    productList.innerHTML = products.map(p => `
        <div class="product-card">
            <button class="wishlist-btn ${wishlist.includes(p.id) ? 'active' : ''}" onclick="toggleWishlist(${p.id})">
                <i class="fa-solid fa-heart"></i>
            </button>
            <div class="product-img-box">
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="rating">${p.rating}</div>
                <div class="product-meta">
                    <div class="price">₹${p.price} <span>₹${p.oldPrice}</span></div>
                    <button class="add-cart-btn" onclick="addToCart(${p.id})">
                        <i class="fa-solid fa-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add/Remove Wishlist Function
window.toggleWishlist = function(id) {
    if(wishlist.includes(id)) {
        wishlist = wishlist.filter(itemId => itemId !== id);
    } else {
        wishlist.push(id);
    }
    updateBadges();
    renderProducts();
    renderWishlist();
};

// Add To Cart Function
window.addToCart = function(id) {
    const existing = cart.find(item => item.id === id);
    if(existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, qty: 1 });
    }
    updateBadges();
    renderCart();
    openDrawer('cart');
};

// Update Item Quantity in Cart (+ / -)
window.updateQty = function(id, change) {
    const item = cart.find(i => i.id === id);
    if(item) {
        item.qty += change;
        if(item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    updateBadges();
    renderCart();
};

// Update Navbar Badges Count
function updateBadges() {
    const totalQty = cart.reduce((acc, i) => acc + i.qty, 0);
    document.getElementById('cart-count').innerText = totalQty;
    document.getElementById('wishlist-count').innerText = wishlist.length;
}

// Render Cart Drawer Items
function renderCart() {
    const container = document.getElementById('cart-items');
    if(cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888; margin-top:40px;">Your cart is empty.</p>';
        document.getElementById('cart-total').innerText = '₹0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const prod = products.find(p => p.id === item.id);
        const subtotal = prod.price * item.qty;
        total += subtotal;
        return `
            <div class="drawer-item">
                <img src="${prod.img}" alt="${prod.name}">
                <div class="item-details">
                    <div class="item-name">${prod.name}</div>
                    <div class="item-price">₹${prod.price} × ${item.qty} = ₹${subtotal}</div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateQty(${prod.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${prod.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('cart-total').innerText = '₹' + total;
}

// Render Wishlist Drawer Items
function renderWishlist() {
    const container = document.getElementById('wishlist-items');
    if(wishlist.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888; margin-top:40px;">No items in wishlist.</p>';
        return;
    }

    container.innerHTML = wishlist.map(id => {
        const prod = products.find(p => p.id === id);
        return `
            <div class="drawer-item">
                <img src="${prod.img}" alt="${prod.name}">
                <div class="item-details">
                    <div class="item-name">${prod.name}</div>
                    <div class="item-price">₹${prod.price}</div>
                    <button class="add-cart-btn" style="margin-top:8px; padding: 5px 12px; font-size:12px;" onclick="addToCart(${prod.id})">Move to Cart</button>
                </div>
            </div>
        `;
    }).join('');
}

// Drawers & Overlays Handling
function openDrawer(type) {
    closeAllDrawers();
    overlay.classList.add('active');
    if(type === 'cart') {
        renderCart();
        cartDrawer.classList.add('active');
    } else if(type === 'wishlist') {
        renderWishlist();
        wishlistDrawer.classList.add('active');
    }
}

function closeAllDrawers() {
    overlay.classList.remove('active');
    cartDrawer.classList.remove('active');
    wishlistDrawer.classList.remove('active');
    checkoutModal.classList.remove('active');
    successModal.classList.remove('active');
}

// Open Checkout Modal & Generate Dynamic UPI QR Code
function openCheckout() {
    if(cart.length === 0) {
        alert('Your cart is empty! Add products first.');
        return;
    }
    closeAllDrawers();
    
    const total = cart.reduce((acc, item) => {
        const p = products.find(prod => prod.id === item.id);
        return acc + (p.price * item.qty);
    }, 0);

    document.getElementById('checkout-payable-amount').innerText = '₹' + total;
    
    // Dynamic UPI Link & QR Generation
    const upiId = "8460183525@upi";
    const name = encodeURIComponent("Vishwash Foods");
    const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${total}&cu=INR`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
    
    document.getElementById('upi-qr-img').src = qrApiUrl;
    
    overlay.classList.add('active');
    checkoutModal.classList.add('active');
}

// Process Order & Send Details on WhatsApp
function processUPIOrder(e) {
    e.preventDefault();
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;

    const total = cart.reduce((acc, item) => {
        const p = products.find(prod => prod.id === item.id);
        return acc + (p.price * item.qty);
    }, 0);

    let orderText = `*New Order - VISHWASH FOODS*%0A`;
    orderText += `*Name:* ${name}%0A`;
    orderText += `*Phone:* ${phone}%0A`;
    orderText += `*Address:* ${address}%0A%0A`;
    orderText += `*Items Ordered:*%0A`;
    cart.forEach(item => {
        const p = products.find(prod => prod.id === item.id);
        orderText += `- ${p.name} (${item.qty} packet) = ₹${p.price * item.qty}%0A`;
    });
    orderText += `%0A*Total Amount Paid/Payable:* ₹${total}%0A`;
    orderText += `*Payment Method:* UPI (8460183525@upi)`;

    const waUrl = `https://wa.me/918460183525?text=${orderText}`;
    document.getElementById('whatsapp-btn').href = waUrl;

    // Clear Cart
    cart = [];
    updateBadges();
    
    checkoutModal.classList.remove('active');
    successModal.classList.add('active');
}

// Add Review Dynamic Submit
function handleReviewSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('review-name').value;
    const ratingVal = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-comment').value;

    const stars = '★'.repeat(ratingVal) + '☆'.repeat(5 - ratingVal);
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2) || 'U';

    const newReviewHtml = `
        <div class="review-card">
            <i class="fa-solid fa-quote-right quote"></i>
            <p class="review-text">"${comment}"</p>
            <div class="reviewer-info">
                <div class="reviewer-avatar">${initials}</div>
                <div>
                    <div class="reviewer-name">${name}</div>
                    <div class="reviewer-stars">${stars}</div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('reviews-container').insertAdjacentHTML('afterbegin', newReviewHtml);
    reviewForm.reset();
    alert('Thank you! Your review has been published.');
}
