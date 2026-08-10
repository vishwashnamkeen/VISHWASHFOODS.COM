// State Variables
let cart = [];
let wishlist = [];

// Toast Notification Function
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.innerText = message;
        toast.classList.remove('translate-y-20', 'opacity-0');
        
        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 2500);
    }
}

// 1. CART FUNCTIONS
function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    showToast(`${name} added to cart!`);
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cartCount) cartCount.innerText = cart.length;
    
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-center text-gray-400 py-8">Your cart is empty!</p>`;
        if (cartTotal) cartTotal.innerText = '₹0';
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                    <p class="font-bold text-sm text-gray-800">${item.name}</p>
                    <p class="text-xs text-amber-600 font-semibold">₹${item.price}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-600 text-sm p-1">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    if (cartTotal) cartTotal.innerText = '₹' + total;
}

function removeFromCart(index) {
    const removedItem = cart[index].name;
    cart.splice(index, 1);
    updateCartUI();
    showToast(`${removedItem} removed from cart`);
}

// 2. WISHLIST FUNCTIONS
function addToWishlist(name) {
    if (!wishlist.includes(name)) {
        wishlist.push(name);
        updateWishlistUI();
        showToast(`${name} added to wishlist!`);
    } else {
        showToast(`${name} is already in your wishlist!`);
    }
}

function updateWishlistUI() {
    const wishlistCount = document.getElementById('wishlist-count');
    const wishlistContainer = document.getElementById('wishlist-items');

    if (wishlistCount) wishlistCount.innerText = wishlist.length;
    if (!wishlistContainer) return;

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `<p class="text-center text-gray-400 py-8">No favorite items saved yet.</p>`;
        return;
    }

    wishlistContainer.innerHTML = wishlist.map((item, index) => `
        <div class="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
            <p class="font-bold text-sm text-gray-800">${item}</p>
            <button onclick="removeFromWishlist(${index})" class="text-red-400 hover:text-red-600 text-sm p-1">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    updateWishlistUI();
    showToast("Item removed from wishlist");
}

// 3. BUY NOW & CHECKOUT (WhatsApp Integration)
const FOUNDER_PHONE = "918560193525"; // Nikhil Vaishnav's Mobile Number

function buyNow(productName) {
    const text = encodeURIComponent(`Hello Nikhil Vaishnav sir,\nI would like to buy: *${productName}* from VISHWAS website.`);
    window.open(`https://wa.me/${FOUNDER_PHONE}?text=${text}`, '_blank');
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const itemsList = cart.map((item, index) => `${index + 1}. ${item.name} - ₹${item.price}`).join('\n');
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    
    const message = `Hello Nikhil Vaishnav sir,\nI want to place an order on *VISHWAS*:\n\n*Items Ordered:*\n${itemsList}\n\n*Total Amount:* ₹${totalAmount}\n\nPlease confirm my order.`;
    
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/${FOUNDER_PHONE}?text=${text}`, '_blank');
}

// 4. MODAL TOGGLES
function toggleCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) cartModal.classList.toggle('hidden');
}

function toggleWishlistModal() {
    const wishlistModal = document.getElementById('wishlist-modal');
    if (wishlistModal) wishlistModal.classList.toggle('hidden');
}
