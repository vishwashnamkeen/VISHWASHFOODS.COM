/**
 * ============================================================================
 * VISHWASH FOODS (vishwashfoods.com) - Enterprise E-Commerce Script
 * Core Features:
 * - Cart Management (Add, Remove, Quantity Change)
 * - Dynamic Wishlist Drawer & State Management
 * - Dedicated Checkout & Buy Now Drawer
 * - Persistent LocalStorage Order History & Tracking
 * - Toast Notifications & Responsive UI Modals
 * ============================================================================
 */

(function () {
    'use strict';

    // ==========================================
    // 1. CONFIGURATION & STATE MANAGEMENT
    // ==========================================
    const CONFIG = {
        currency: '₹',
        defaultMRP: 80,
        merchantPhone: '8460183525',
        domain: 'vishwashfoods.com',
        storageKeys: {
            cart: 'vf_cart_data_v1',
            wishlist: 'vf_wishlist_data_v1',
            orders: 'vf_order_history_v1'
        }
    };

    // Global Application State
    const AppState = {
        products: [
            { id: 'prod_1', name: 'Black Pepper Banana Wafer', price: 80, image: 'BLACK-PEPPER-BANANA-WAFER.jpg', desc: 'Crispy banana wafers seasoned with pure black pepper.' },
            { id: 'prod_2', name: 'Panipuri Flavour Banana Wafer', price: 80, image: 'PANIPURI-FLAVOUR-BANANA-WAFERS.jpg', desc: 'Tangy and spicy panipuri spiced banana chips.' },
            { id: 'prod_3', name: 'Salted Banana Wafers', price: 80, image: 'SALTED-BANANA-WEFERS.JPG', desc: 'Classic salted crunchy banana wafers.' },
            { id: 'prod_4', name: 'Spicy Banana Wafers', price: 80, image: 'SPICY-BANANA-WAFERS.JPG', desc: 'Fiery red chilli banana chips for spice lovers.' }
        ],
        cart: [],
        wishlist: [],
        orderHistory: [],
        quantities: {}
    };

    // ==========================================
    // 2. HELPER FUNCTIONS & STORAGE UTILS
    // ==========================================
    const Utils = {
        saveToStorage(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                console.error("Storage Save Error:", e);
            }
        },
        loadFromStorage(key, fallback = []) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : fallback;
            } catch (e) {
                console.error("Storage Load Error:", e);
                return fallback;
            }
        },
        formatPrice(amount) {
            return `${CONFIG.currency}${amount.toFixed(2)}`;
        },
        showToast(message, type = 'info') {
            let toastContainer = document.getElementById('vf-toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.id = 'vf-toast-container';
                document.body.appendChild(toastContainer);
            }

            const toast = document.createElement('div');
            toast.className = `vf-toast vf-toast-${type}`;
            toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${message}</span>`;
            
            toastContainer.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('vf-toast-show');
            }, 10);

            setTimeout(() => {
                toast.classList.remove('vf-toast-show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    };

    // ==========================================
    // 3. DYNAMIC UI INJECTION (SLIDE DRAWERS & STYLES)
    // ==========================================
    function injectStylesAndDrawers() {
        // Inject Dynamic CSS for Drawers & UI
        const style = document.createElement('style');
        style.textContent = `
            /* Toast Container */
            #vf-toast-container {
                position: fixed;
                bottom: 25px;
                right: 25px;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .vf-toast {
                background: #1f2937;
                color: #ffffff;
                padding: 12px 20px;
                border-radius: 8px;
                font-family: 'Poppins', sans-serif;
                font-size: 0.9rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 10px;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                border-left: 4px solid #f59e0b;
            }
            .vf-toast.vf-toast-show {
                opacity: 1;
                transform: translateY(0);
            }

            /* Drawers / Side Panels */
            .vf-drawer-overlay {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(3px);
                z-index: 9990;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            .vf-drawer-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            .vf-drawer {
                position: fixed;
                top: 0; right: -450px;
                width: 100%; max-width: 420px;
                height: 100%;
                background: #ffffff;
                z-index: 9995;
                box-shadow: -5px 0 25px rgba(0,0,0,0.15);
                transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                display: flex;
                flex-direction: column;
                font-family: 'Poppins', sans-serif;
            }
            .vf-drawer.active { right: 0; }
            .vf-drawer-header {
                padding: 20px;
                background: #fef3c7;
                border-bottom: 1px solid #fcd34d;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .vf-drawer-header h3 {
                margin: 0; font-size: 1.25rem; color: #78350f; font-weight: 600;
                display: flex; align-items: center; gap: 10px;
            }
            .vf-drawer-close {
                background: transparent; border: none; font-size: 1.5rem;
                cursor: pointer; color: #78350f;
            }
            .vf-drawer-body {
                flex: 1; overflow-y: auto; padding: 20px;
            }
            .vf-drawer-footer {
                padding: 20px; border-top: 1px solid #e5e7eb; background: #f9fafb;
            }

            /* Quantity Box UI */
            .vf-qty-control {
                display: inline-flex;
                align-items: center;
                border: 1px solid #d1d5db;
                border-radius: 20px;
                overflow: hidden;
                margin: 10px 0;
            }
            .vf-qty-btn {
                background: #f3f4f6; border: none; width: 32px; height: 32px;
                font-weight: bold; cursor: pointer; color: #374151; transition: background 0.2s;
            }
            .vf-qty-btn:hover { background: #e5e7eb; }
            .vf-qty-val {
                width: 38px; text-align: center; font-weight: 600; font-size: 0.95rem;
            }

            /* Product Wishlist Icon Styling */
            .vf-wishlist-btn-card {
                position: absolute;
                top: 12px; right: 12px;
                background: white; border: none;
                width: 36px; height: 36px; border-radius: 50%;
                box-shadow: 0 4px 10px rgba(0,0,0,0.12);
                cursor: pointer; color: #9ca3af;
                transition: all 0.2s; z-index: 10;
            }
            .vf-wishlist-btn-card.active { color: #ef4444; }

            /* Drawer List Items */
            .vf-item-row {
                display: flex; gap: 12px; margin-bottom: 15px; padding-bottom: 15px;
                border-bottom: 1px solid #f3f4f6; align-items: center;
            }
            .vf-item-img { width: 65px; height: 65px; object-fit: cover; border-radius: 8px; }
            .vf-item-details { flex: 1; }
            .vf-item-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 4px; color: #111827; }
            .vf-item-price { color: #d97706; font-weight: 700; font-size: 0.9rem; }
            .vf-btn-sm {
                padding: 6px 12px; font-size: 0.8rem; border-radius: 15px; border: none;
                cursor: pointer; background: #d97706; color: white; font-weight: 500;
            }

            /* Checkout Form Inputs */
            .vf-form-group { margin-bottom: 12px; text-align: left; }
            .vf-form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; color: #374151; }
            .vf-form-input {
                width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;
                font-family: inherit; font-size: 0.9rem;
            }

            /* Header Action Badges */
            .vf-header-actions {
                display: flex; gap: 15px; align-items: center;
            }
            .vf-icon-badge {
                position: relative; cursor: pointer; font-size: 1.3rem;
            }
            .vf-count-tag {
                position: absolute; top: -6px; right: -8px; background: #ef4444;
                color: white; font-size: 0.7rem; font-weight: bold; padding: 2px 5px;
                border-radius: 50%;
            }
        `;
        document.head.appendChild(style);

        // Inject Overlay & Drawers HTML
        const drawerHTML = `
            <div class="vf-drawer-overlay" id="vfOverlay" onclick="VishwashApp.closeAllDrawers()"></div>

            <!-- WISHLIST DRAWER -->
            <aside class="vf-drawer" id="wishlistDrawer">
                <div class="vf-drawer-header">
                    <h3><i class="fa-solid fa-heart" style="color:#ef4444;"></i> My Wishlist</h3>
                    <button class="vf-drawer-close" onclick="VishwashApp.closeAllDrawers()">&times;</button>
                </div>
                <div class="vf-drawer-body" id="wishlistBody">
                    <!-- Wishlist items will render here dynamically -->
                </div>
                <div class="vf-drawer-footer">
                    <button class="btn" style="width:100%;" onclick="VishwashApp.moveAllWishlistToCart()">Move All To Cart</button>
                </div>
            </aside>

            <!-- BUY NOW / CHECKOUT DRAWER -->
            <aside class="vf-drawer" id="checkoutDrawer">
                <div class="vf-drawer-header">
                    <h3><i class="fa-solid fa-bag-shopping" style="color:#d97706;"></i> Instant Checkout</h3>
                    <button class="vf-drawer-close" onclick="VishwashApp.closeAllDrawers()">&times;</button>
                </div>
                <div class="vf-drawer-body">
                    <div id="checkoutSummary" style="background:#fffbeb; padding:12px; border-radius:8px; margin-bottom:15px; border:1px solid #fef3c7;">
                        <!-- Checkout Items Summary -->
                    </div>
                    <form id="checkoutForm" onsubmit="VishwashApp.processCheckout(event)">
                        <div class="vf-form-group">
                            <label>Full Name *</label>
                            <input type="text" id="custName" class="vf-form-input" required placeholder="e.g. Rahul Sharma">
                        </div>
                        <div class="vf-form-group">
                            <label>Mobile Number *</label>
                            <input type="tel" id="custPhone" class="vf-form-input" required placeholder="10 Digit Mobile Number" pattern="[0-9]{10}">
                        </div>
                        <div class="vf-form-group">
                            <label>Delivery Address *</label>
                            <textarea id="custAddress" class="vf-form-input" rows="3" required placeholder="House No, Area, City, Pincode"></textarea>
                        </div>
                        <div style="margin-top:15px; font-weight:bold; font-size:1.1rem; text-align:right;">
                            Total Amount: <span id="checkoutTotal" style="color:#d97706;">₹0</span>
                        </div>
                        <button type="submit" class="btn" style="width:100%; margin-top:15px; background:#25d366;">
                            <i class="fa-brands fa-whatsapp"></i> Confirm & Order via WhatsApp
                        </button>
                    </form>
                </div>
            </aside>

            <!-- ORDER HISTORY DRAWER -->
            <aside class="vf-drawer" id="ordersDrawer">
                <div class="vf-drawer-header">
                    <h3><i class="fa-solid fa-clock-rotate-left" style="color:#2563eb;"></i> Order History</h3>
                    <button class="vf-drawer-close" onclick="VishwashApp.closeAllDrawers()">&times;</button>
                </div>
                <div class="vf-drawer-body" id="ordersBody">
                    <!-- Order History rendered dynamically -->
                </div>
            </aside>
        `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = drawerHTML;
        document.body.appendChild(wrapper);
    }

    // ==========================================
    // 4. MAIN CONTROLLER & APPLICATION LOGIC
    // ==========================================
    const VishwashApp = {

        init() {
            // Load persistent storage
            AppState.cart = Utils.loadFromStorage(CONFIG.storageKeys.cart, []);
            AppState.wishlist = Utils.loadFromStorage(CONFIG.storageKeys.wishlist, []);
            AppState.orderHistory = Utils.loadFromStorage(CONFIG.storageKeys.orders, []);

            // Setup default quantities
            AppState.products.forEach(p => { AppState.quantities[p.id] = 1; });

            // Render Injectables & Features
            injectStylesAndDrawers();
            this.enhanceNavbar();
            this.renderProducts();
            this.updateBadgeCounts();

            console.log("Vishwash Foods Core Engine Initialized.");
        },

        // Top Navigation Enhancement
        enhanceNavbar() {
            const nav = document.querySelector('.navbar');
            if (!nav) return;

            // Ensure Header Action Buttons (Wishlist, Order History, Cart)
            let actionContainer = nav.querySelector('.vf-header-actions');
            if (!actionContainer) {
                actionContainer = document.createElement('div');
                actionContainer.className = 'vf-header-actions';

                // Find existing cart icon if present
                const oldCart = nav.querySelector('.cart-icon');
                if (oldCart) oldCart.remove();

                actionContainer.innerHTML = `
                    <div class="vf-icon-badge" onclick="VishwashApp.openDrawer('ordersDrawer')" title="Order History">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                    </div>
                    <div class="vf-icon-badge" onclick="VishwashApp.openDrawer('wishlistDrawer')" title="Wishlist">
                        <i class="fa-solid fa-heart" style="color:#ef4444;"></i>
                        <span class="vf-count-tag" id="wishlist-count">0</span>
                    </div>
                    <div class="vf-icon-badge" onclick="openCart()" title="Cart">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <span class="vf-count-tag" id="cart-count">0</span>
                    </div>
                `;
                nav.appendChild(actionContainer);
            }
        },

        // Render Product Cards Grid
        renderProducts() {
            const grid = document.querySelector('.product-grid');
            if (!grid) return;

            grid.innerHTML = ''; // Re-render clean cards

            AppState.products.forEach(prod => {
                const isWishlisted = AppState.wishlist.some(w => w.id === prod.id);
                const qty = AppState.quantities[prod.id] || 1;

                const card = document.createElement('div');
                card.className = 'product-card';
                card.style.position = 'relative';

                card.innerHTML = `
                    <button class="vf-wishlist-btn-card ${isWishlisted ? 'active' : ''}" 
                            onclick="VishwashApp.toggleWishlist('${prod.id}')" title="Add to Wishlist">
                        <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                    
                    <img src="${prod.image}" alt="${prod.name}" class="product-img" onerror="this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(prod.name)}'">
                    
                    <div class="product-info">
                        <h3 class="product-title">${prod.name}</h3>
                        <div class="price-tag">${Utils.formatPrice(prod.price)} MRP</div>
                        
                        <!-- Quantity Control Button -->
                        <div class="vf-qty-control">
                            <button class="vf-qty-btn" onclick="VishwashApp.changeQty('${prod.id}', -1)">-</button>
                            <span class="vf-qty-val" id="qty-${prod.id}">${qty}</span>
                            <button class="vf-qty-btn" onclick="VishwashApp.changeQty('${prod.id}', 1)">+</button>
                        </div>
                    </div>

                    <div class="card-actions">
                        <button class="btn btn-outline" onclick="VishwashApp.addToCartWithQty('${prod.id}')">Add to Cart</button>
                        <button class="btn" onclick="VishwashApp.triggerBuyNow('${prod.id}')">Buy Now</button>
                    </div>
                `;
                grid.appendChild(card);
            });
        },

        // Quantity Selector Change
        changeQty(productId, delta) {
            let current = AppState.quantities[productId] || 1;
            current += delta;
            if (current < 1) current = 1;
            AppState.quantities[productId] = current;

            const qtyEl = document.getElementById(`qty-${productId}`);
            if (qtyEl) qtyEl.innerText = current;
        },

        // Add to Cart with selected quantity
        addToCartWithQty(productId) {
            const product = AppState.products.find(p => p.id === productId);
            if (!product) return;

            const qty = AppState.quantities[productId] || 1;
            
            // Check if item already in cart
            const existingIndex = AppState.cart.findIndex(c => c.id === productId);
            if (existingIndex > -1) {
                AppState.cart[existingIndex].qty += qty;
            } else {
                AppState.cart.push({ ...product, qty: qty });
            }

            Utils.saveToStorage(CONFIG.storageKeys.cart, AppState.cart);
            this.updateBadgeCounts();
            this.syncCartModal();
            Utils.showToast(`${qty} x ${product.name} added to Cart!`);
        },

        // Wishlist Toggle Function
        toggleWishlist(productId) {
            const index = AppState.wishlist.findIndex(w => w.id === productId);
            const product = AppState.products.find(p => p.id === productId);

            if (index > -1) {
                AppState.wishlist.splice(index, 1);
                Utils.showToast(`${product.name} removed from Wishlist.`);
            } else {
