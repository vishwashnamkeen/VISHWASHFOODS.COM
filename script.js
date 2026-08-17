// Products Database Mapping Image files from your directory
const products = [
    { id: 1, name: "Aloo Bhujiya", price: 120, img: "aloo-bhujiya.png" },
    { id: 2, name: "Black Pepper Banana Chips", price: 150, img: "blackpepar-banana-chips.png" },
    { id: 3, name: "Fast Banana Chips", price: 140, img: "fast-banana-chips.png" },
    { id: 4, name: "Gujarati Namkeen", price: 110, img: "gujarati-namkeen.png" },
    { id: 5, name: "Jeera Puri", price: 90, img: "jeera-puri.png" },
    { id: 6, name: "Mitha Namkeen", price: 100, img: "mithanamkeen.png" },
    { id: 7, name: "Pani Puri Banana Chips", price: 160, img: "panipuribananachips.png" },
    { id: 8, name: "Peri Peri Banana Chips", price: 160, img: "periperibananachips.png" }
];

// App State Management
let cart = [];
let wishlist = [];

// DOM Content Loaded - Page Init
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCounts();
});

// Render All Products Dynamically
function renderProducts() {
    const container = document.getElementById('products-list');
    if (!container) return;

    container.innerHTML = '';
    products.forEach(product => {
        const isWishlisted = wishlist.includes(product.id);
        
        container.innerHTML += `
            <div class="product-card">
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id})" aria-label="Add to Wishlist">
                    <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
                <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200?text=Vishwash+Foods'">
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">₹${product.price}</div>
                    <div class="btn-group">
                        <button class="btn-action btn-add-cart" onclick="addToCart(${product.id})">Add Cart</button>
                        <button class="btn-action btn-buy-now" onclick="buyNow(${product.id})">Buy Now</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Cart Logic
function addToCart(id) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.qty++;
    } else {
        const prod = products.find(p => p.id === id);
        cart.push({ ...prod, qty: 1 });
    }
    updateCounts();
    alert("Item Cart mein add ho gaya!");
}

function updateQuantity(id, change) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(p => p.id !== id);
        }
    }
    updateCounts();
    renderCartItems();
}

function buyNow(id) {
    const item = cart.find(p => p.id === id);
    if (!item) {
        const prod = products.find(p => p.id === id);
        cart.push({ ...prod, qty: 1 });
    }
    updateCounts();
    openCartModal();
}

// Wishlist Logic
function toggleWishlist(id) {
    const index = wishlist.indexOf(id);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(id);
    }
    updateCounts();
    renderProducts();
}

// Badge Counts Update
function updateCounts() {
    const cartCountElem = document.getElementById('cart-count');
    const wishlistCountElem = document.getElementById('wishlist-count');
    
    if (cartCountElem) {
        cartCountElem.innerText = cart.reduce((acc, item) => acc + item.qty, 0);
    }
    if (wishlistCountElem) {
        wishlistCountElem.innerText = wishlist.length;
    }
}

// Modal Open/Close Controls
function openCartModal() {
    renderCartItems();
    document.getElementById('payment-box').style.display = 'none'; // Reset QR Box
    document.getElementById('cart-modal').style.display = 'flex';
}

function openWishlistModal() {
    renderWishlistItems();
    document.getElementById('wishlist-modal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Render Items Inside Cart Modal
function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalElem = document.getElementById('cart-total');
    if (!container || !totalElem) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:15px;">Aapka Cart khali hai.</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            container.innerHTML += `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>₹${item.price} x ${item.qty}</small>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <button style="padding:2px 8px; border:none; background:#ddd; cursor:pointer; border-radius:3px;" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button style="padding:2px 8px; border:none; background:#ddd; cursor:pointer; border-radius:3px;" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <strong style="margin-left:10px;">₹${itemTotal}</strong>
                    </div>
                </div>
            `;
        });
    }
    totalElem.innerText = total;
}

// Render Items Inside Wishlist Modal
function renderWishlistItems() {
    const container = document.getElementById('wishlist-items-container');
    if (!container) return;

    container.innerHTML = '';
    if (wishlist.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:15px;">Aapki Wishlist khali hai.</p>';
    } else {
        wishlist.forEach(id => {
            const prod = products.find(p => p.id === id);
            container.innerHTML += `
                <div class="cart-item">
                    <div><strong>${prod.name}</strong> - ₹${prod.price}</div>
                    <button class="btn-action btn-add-cart" style="padding:4px 10px; font-size:0.8rem;" onclick="addToCart(${prod.id}); toggleWishlist(${prod.id}); renderWishlistItems();">Move to Cart</button>
                </div>
            `;
        });
    }
}

// Bill Generation & Auto UPI QR Code Generator
function generateBillAndQR() {
    const total = document.getElementById('cart-total').innerText;
    
    if (parseInt(total) === 0) {
        alert("Pehle cart mein koi product add karein!");
        return;
    }

    // Aapka UPI ID
    const upiId = "vishwashfoods@upi";
    const payeeName = "Vishwash Foods";
    
    // Dynamic UPI String for Instant Auto Payment
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${total}&cu=INR`;
    
    // Automatic QR Code Generation using API
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiString)}`;
    
    const qrImg = document.getElementById('qr-code-img');
    const paymentBox = document.getElementById('payment-box');
    
    if (qrImg && paymentBox) {
        qrImg.src = qrApiUrl;
        paymentBox.style.display = 'block';
        paymentBox.scrollIntoView({ behavior: 'smooth' });
    }
}

// Submit Customer Review
function addReview() {
    const nameInput = document.getElementById('review-name');
    const textInput = document.getElementById('review-text');

    if (!nameInput || !textInput) return;

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (name && text) {
        const list = document.getElementById('reviews-list');
        if (list) {
            list.innerHTML += `
                <div class="review-card">
                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <p>"${text}"</p>
                    <small><strong>- ${name}</strong></small>
                </div>
            `;
        }
        nameInput.value = '';
        textInput.value = '';
        alert("Aapka review submit ho gaya hai!");
    } else {
        alert("Kripya apna naam aur review dono bharein.");
    }
}

// Close Modal when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cart-modal');
    const wishlistModal = document.getElementById('wishlist-modal');
    if (event.target === cartModal) closeModal('cart-modal');
    if (event.target === wishlistModal) closeModal('wishlist-modal');
};
