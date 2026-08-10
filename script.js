// ==========================================
// VISHWASH FOODS - Script.js (All Buttons & Animations)
// ==========================================

let cart = [];
let wishlist = [];
const PHONE_NUMBER = "918560193525"; // Founder: Nikhil Vaishnav

// 1. TOAST NOTIFICATION WITH ANIMATION
function showToast(text) {
    let toast = document.getElementById('toast');
    
    // Agar Toast HTML me nahi hai to dynamically create karega
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #4ade80;"></i> <span>${text}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// 2. ADD TO CART FUNCTION
function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    showToast(`${name} Cart me add ho gaya!`);
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    if (badge) badge.innerText = cart.length;

    const container = document.getElementById('cartItemsList');
    const totalElement = document.getElementById('cartTotal');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #94a3b8; margin-top: 40px;">Aapka Cart khali hai!</p>`;
        if (totalElement) totalElement.innerText = '₹0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="cart-item" style="animation: fadeIn 0.3s ease;">
                <div>
                    <strong>${item.name}</strong><br>
                    <small style="color:var(--primary, #d97706); font-weight:700;">₹${item.price}</small>
                </div>
                <i class="fa-solid fa-trash" style="color:#ef4444; cursor:pointer;" onclick="removeFromCart(${index})"></i>
            </div>
        `;
    }).join('');

    if (totalElement) totalElement.innerText = '₹' + total;
}

function removeFromCart(index) {
    const removedItem = cart[index].name;
    cart.splice(index, 1);
    updateCartUI();
    showToast(`${removedItem} hata diya gaya`);
}

// 3. TOGGLE WISHLIST FUNCTION
function toggleWishlist(name, btnElement) {
    const index = wishlist.indexOf(name);
    
    if (index === -1) {
        wishlist.push(name);
        if (btnElement) btnElement.classList.add('active');
        showToast(`${name} Wishlist me save ho gaya!`);
    } else {
        wishlist.splice(index, 1);
        if (btnElement) btnElement.classList.remove('active');
        showToast(`Wishlist se hata diya gaya`);
    }
    updateWishlistUI();
}

function updateWishlistUI() {
    const badge = document.getElementById('wishlist-badge');
    if (badge) badge.innerText = wishlist.length;

    const container = document.getElementById('wishlistItemsList');
    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #94a3b8; margin-top: 40px;">Wishlist me koi item nahi hai.</p>`;
        return;
    }

    container.innerHTML = wishlist.map((item) => `
        <div class="cart-item" style="animation: fadeIn 0.3s ease;">
            <strong>${item}</strong>
            <i class="fa-solid fa-heart" style="color:#ef4444;"></i>
        </div>
    `).join('');
}

// 4. BUY NOW (SINGLE ITEM WHATSAPP ORDER)
function buyNow(productName) {
    const message = encodeURIComponent(`Hello Nikhil Vaishnav sir,\nI want to buy *${productName}* directly from VISHWASH FOODS website.`);
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
}

// 5. CHECKOUT ALL CART ITEMS VIA WHATSAPP
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('Aapka cart khali hai!');
        return;
    }

    let itemsStr = cart.map((item, i) => `${i + 1}. ${item.name} - ₹${item.price}`).join('\n');
    let total = cart.reduce((sum, item) => sum + item.price, 0);

    const message = encodeURIComponent(`Hello Nikhil Vaishnav sir,\nI want to place an order from VISHWASH FOODS:\n\n*Items:*\n${itemsStr}\n\n*Total Amount:* ₹${total}`);
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
}

// 6. MODAL DRAWER CONTROLS (OPEN / CLOSE WITH ANIMATION)
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Outside Click to Close Modals
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.style.display = 'none';
    }
};
