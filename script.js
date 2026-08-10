/* =========================================================
   VISHWASH FOODS
   COMPLETE script.js
   Cart + Wishlist + Buy Now + Checkout + Customer Details
========================================================= */

"use strict";

/* =========================================================
   PRODUCT DATA
========================================================= */

const products = [
    {
        id: 1,
        name: "Classic Banana Wafers",
        category: "Banana Wafers",
        price: 40,
        mrp: 45,
        image: "🍌",
        rating: 4.9,
        reviews: 120,
        description:
            "Crispy premium banana wafers made with carefully selected bananas."
    },

    {
        id: 2,
        name: "Masala Banana Wafers",
        category: "Spicy Wafers",
        price: 40,
        mrp: 45,
        image: "🌶️",
        rating: 4.8,
        reviews: 95,
        description:
            "Crispy banana wafers with a delicious spicy masala flavour."
    },

    {
        id: 3,
        name: "Black Pepper Wafers",
        category: "Premium Wafers",
        price: 40,
        mrp: 45,
        image: "🫑",
        rating: 4.8,
        reviews: 75,
        description:
            "Premium banana wafers with a tasty black pepper flavour."
    },

    {
        id: 4,
        name: "Panipuri Flavour Wafers",
        category: "Special Flavour",
        price: 40,
        mrp: 45,
        image: "🥔",
        rating: 4.7,
        reviews: 65,
        description:
            "A unique panipuri-inspired flavour for snack lovers."
    }
];


/* =========================================================
   STORAGE
========================================================= */

const STORAGE = {
    cart: "vishwash_cart",
    wishlist: "vishwash_wishlist",
    customer: "vishwash_customer",
    orders: "vishwash_orders"
};


function loadData(key, fallback = []) {

    try {

        return JSON.parse(
            localStorage.getItem(key)
        ) || fallback;

    } catch {

        return fallback;

    }

}


let cart = loadData(STORAGE.cart);
let wishlist = loadData(STORAGE.wishlist);
let customer = loadData(STORAGE.customer, {});

let currentProduct = null;
let currentQuantity = 1;
let selectedAddressType = "Home";


/* =========================================================
   SAVE DATA
========================================================= */

function saveCart() {

    localStorage.setItem(
        STORAGE.cart,
        JSON.stringify(cart)
    );

}


function saveWishlist() {

    localStorage.setItem(
        STORAGE.wishlist,
        JSON.stringify(wishlist)
    );

}


function saveCustomer() {

    localStorage.setItem(
        STORAGE.customer,
        JSON.stringify(customer)
    );

}


/* =========================================================
   PRODUCT HELPERS
========================================================= */

function getProduct(id) {

    return products.find(
        product => Number(product.id) === Number(id)
    );

}


function money(amount) {

    return "₹" + Number(amount).toLocaleString("en-IN");

}


/* =========================================================
   CART
========================================================= */

function addToCart(id, quantity = 1) {

    const product = getProduct(id);

    if (!product) return;


    quantity = Number(quantity) || 1;


    const existing = cart.find(
        item => Number(item.id) === Number(id)
    );


    if (existing) {

        existing.quantity += quantity;

    } else {

        cart.push({

            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            mrp: product.mrp,
            image: product.image,
            quantity: quantity

        });

    }


    saveCart();

    updateCartUI();

    showToast(
        product.name + " added to cart 🛒"
    );

}


function removeFromCart(id) {

    cart = cart.filter(
        item => Number(item.id) !== Number(id)
    );

    saveCart();

    updateCartUI();

}


function changeCartQuantity(id, change) {

    const item = cart.find(
        product => Number(product.id) === Number(id)
    );

    if (!item) return;


    item.quantity += Number(change);


    if (item.quantity <= 0) {

        removeFromCart(id);

        return;

    }


    if (item.quantity > 20) {

        item.quantity = 20;

        showToast(
            "Maximum 20 quantity allowed"
        );

    }


    saveCart();

    updateCartUI();

}


function getCartQuantity() {

    return cart.reduce(
        (total, item) =>
            total + Number(item.quantity),
        0
    );

}


function getSubtotal() {

    return cart.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            Number(item.quantity),
        0
    );

}


function getDeliveryCharge() {

    const subtotal = getSubtotal();

    if (subtotal <= 0) return 0;

    return subtotal >= 499 ? 0 : 40;

}


function getGrandTotal() {

    return (
        getSubtotal() +
        getDeliveryCharge()
    );

}


/* =========================================================
   CART UI
========================================================= */

function updateCartCount() {

    const count = getCartQuantity();


    document.querySelectorAll(
        "#cartCount, .cart-count"
    ).forEach(element => {

        element.textContent = count;

        element.classList.toggle(
            "hidden",
            count === 0
        );

    });

}


function renderCart() {

    const container =
        document.getElementById(
            "cartContent"
        );


    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <div style="font-size:50px;">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add your favourite snacks to cart.</p>
            </div>
        `;

        updateCartSummary();

        return;

    }


    container.innerHTML =
        cart.map(item => `

            <div class="cart-item">

                <div class="cart-item-image">
                    ${item.image}
                </div>

                <div class="cart-item-details">

                    <h4>
                        ${escapeHTML(item.name)}
                    </h4>

                    <p>
                        ${money(item.price)}
                    </p>

                    <div class="cart-item-controls">

                        <button
                            type="button"
                            onclick="changeCartQuantity(${item.id}, -1)">
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            onclick="changeCartQuantity(${item.id}, 1)">
                            +
                        </button>

                    </div>

                </div>

                <button
                    type="button"
                    class="cart-remove"
                    onclick="removeFromCart(${item.id})">

                    🗑️

                </button>

            </div>

        `).join("");


    updateCartSummary();

}


function updateCartSummary() {

    const subtotal = getSubtotal();
    const delivery = getDeliveryCharge();
    const total = getGrandTotal();


    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );

    const deliveryElement =
        document.getElementById(
            "cartDelivery"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (subtotalElement)
        subtotalElement.textContent =
            money(subtotal);


    if (deliveryElement)
        deliveryElement.textContent =
            delivery === 0
                ? "FREE"
                : money(delivery);


    if (totalElement)
        totalElement.textContent =
            money(total);


    const freeMessage =
        document.getElementById(
            "freeDeliveryMessage"
        );


    if (freeMessage) {

        if (subtotal >= 499) {

            freeMessage.textContent =
                "🎉 Free delivery unlocked!";

        } else {

            freeMessage.textContent =
                `🛍️ Shop ${money(499 - subtotal)} more for FREE delivery.`;

        }

    }

}


function updateCartUI() {

    updateCartCount();

    renderCart();

}


/* =========================================================
   OPEN / CLOSE CART
========================================================= */

function openCart() {

    renderCart();

    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (overlay) {

        overlay.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";

    }

}


function closeCart(event) {

    if (
        event &&
        event.target &&
        event.target.id !==
        "cartOverlay"
    ) {

        return;

    }


    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    document.body.style.overflow = "";

}


/* =========================================================
   WISHLIST
========================================================= */

function isWishlisted(id) {

    return wishlist.some(
        item => Number(item.id) === Number(id)
    );

}


function toggleWishlist(id) {

    const product = getProduct(id);

    if (!product) return;


    const exists =
        isWishlisted(id);


    if (exists) {

        wishlist =
            wishlist.filter(
                item =>
                    Number(item.id) !==
                    Number(id)
            );

        showToast(
            "Removed from wishlist"
        );

    } else {

        wishlist.push({

            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            mrp: product.mrp,
            image: product.image

        });

        showToast(
            "Added to wishlist ❤️"
        );

    }


    saveWishlist();

    updateWishlistUI();

}


function updateWishlistCount() {

    const count =
        wishlist.length;


    document.querySelectorAll(
        "#wishlistCount, .wishlist-count"
    ).forEach(element => {

        element.textContent = count;

        element.classList.toggle(
            "hidden",
            count === 0
        );

    });

}


function updateLikeButtons() {

    document.querySelectorAll(
        ".like-btn"
    ).forEach(button => {

        const id =
            Number(
                button.dataset.productId
            );


        if (isWishlisted(id)) {

            button.classList.add(
                "liked"
            );

            button.innerHTML = "♥";

        } else {

            button.classList.remove(
                "liked"
            );

            button.innerHTML = "♡";

        }

    });

}


function renderWishlist() {

    const container =
        document.getElementById(
            "wishlistContent"
        );


    if (!container) return;


    if (wishlist.length === 0) {

        container.innerHTML = `

            <div class="empty-wishlist">

                <div style="font-size:50px;">
                    ❤️
                </div>

                <h3>
                    Your wishlist is empty
                </h3>

                <p>
                    Like products to save them here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        wishlist.map(item => `

            <div class="wishlist-item">

                <div class="wishlist-item-image">
                    ${item.image}
                </div>

                <div class="wishlist-item-details">

                    <h4>
                        ${escapeHTML(item.name)}
                    </h4>

                    <p>
                        ${money(item.price)}
                    </p>

                    <div
                        style="
                        display:flex;
                        gap:7px;
                        margin-top:8px;
                        "
                    >

                        <button
                            type="button"
                            onclick="addToCart(${item.id})">

                            🛒 Cart

                        </button>

                        <button
                            type="button"
                            onclick="buyNow(${item.id})">

                            Buy Now

                        </button>

                        <button
                            type="button"
                            onclick="toggleWishlist(${item.id})">

                            ×

                        </button>

                    </div>

                </div>

            </div>

        `).join("");

}


function updateWishlistUI() {

    updateWishlistCount();

    updateLikeButtons();

    renderWishlist();

}


function openWishlist() {

    renderWishlist();

    updateWishlistCount();


    const overlay =
        document.getElementById(
            "wishlistOverlay"
        );


    if (overlay) {

        overlay.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";

    }

}


function closeWishlist(event) {

    if (
        event &&
        event.target &&
        event.target.id !==
        "wishlistOverlay"
    ) {

        return;

    }


    const overlay =
        document.getElementById(
            "wishlistOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    document.body.style.overflow = "";

}


/* =========================================================
   PRODUCT DETAIL
========================================================= */

function buyNow(id) {

    const product = getProduct(id);

    if (!product) return;


    currentProduct = product;

    currentQuantity = 1;


    setText(
        "detailFood",
        product.image
    );

    setText(
        "detailCategory",
        product.category
    );

    setText(
        "detailTitle",
        product.name
    );

    setText(
        "detailPrice",
        money(product.price)
    );

    setText(
        "detailMrp",
        money(product.mrp)
    );

    setText(
        "detailRating",
        `⭐ ${product.rating} • ${product.reviews}+ Reviews`
    );

    setText(
        "detailDescription",
        product.description
    );

    setText(
        "buyQuantity",
        currentQuantity
    );

    setText(
        "buyTotal",
        money(
            product.price *
            currentQuantity
        )
    );


    const overlay =
        document.getElementById(
            "productDetailOverlay"
        );


    if (overlay) {

        overlay.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";

    }

}


function openBuyNow(id) {

    buyNow(id);

}


function closeProductDetail(event) {

    if (
        event &&
        event.target &&
        event.target.id !==
        "productDetailOverlay"
    ) {

        return;

    }


    const overlay =
        document.getElementById(
            "productDetailOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    document.body.style.overflow = "";

}


function changeBuyQuantity(change) {

    if (!currentProduct) return;


    currentQuantity += Number(change);


    if (currentQuantity < 1)
        currentQuantity = 1;


    if (currentQuantity > 20)
        currentQuantity = 20;


    setText(
        "buyQuantity",
        currentQuantity
    );


    setText(
        "buyTotal",
        money(
            currentProduct.price *
            currentQuantity
        )
    );

}


function addCurrentProductToCart() {

    if (!currentProduct) return;


    addToCart(
        currentProduct.id,
        currentQuantity
    );


    closeProductDetail();

}


function buyCurrentProduct() {

    if (!currentProduct) return;


    addToCart(
        currentProduct.id,
        currentQuantity
    );


    closeProductDetail();


    setTimeout(
        openCheckout,
        250
    );

}


/* =========================================================
   CHECKOUT
========================================================= */

function openCheckout() {

    if (cart.length === 0) {

        showToast(
            "Your cart is empty 🛒"
        );

        return;

    }


    renderCheckout();

    loadCustomerDetails();


    const overlay =
        document.getElementById(
            "checkoutOverlay"
        );


    if (overlay) {

        overlay.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";

    }

}


function closeCheckout(event) {

    if (
        event &&
        event.target &&
        event.target.id !==
        "checkoutOverlay"
    ) {

        return;

    }


    const overlay =
        document.getElementById(
            "checkoutOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    document.body.style.overflow = "";

}


function renderCheckout() {

    const container =
        document.getElementById(
            "checkoutOrderItems"
        );


    if (!container) return;


    container.innerHTML =
        cart.map(item => `

            <div class="checkout-order-item">

                <div class="checkout-order-image">
                    ${item.image}
                </div>

                <div class="checkout-order-info">

                    <div class="checkout-order-name">
                        ${escapeHTML(item.name)}
                    </div>

                    <div class="checkout-order-qty">
                        Qty: ${item.quantity}
                    </div>

                </div>

                <strong>
                    ${money(
                        item.price *
                        item.quantity
                    )}
                </strong>

            </div>

        `).join("");


    setText(
        "checkoutSubtotal",
        money(getSubtotal())
    );


    setText(
        "checkoutDelivery",
        getDeliveryCharge() === 0
            ? "FREE"
            : money(getDeliveryCharge())
    );


    setText(
        "checkoutTotal",
        money(getGrandTotal())
    );

}


/* =========================================================
   ADDRESS TYPE
========================================================= */

function selectAddressType(button, type) {

    selectedAddressType =
        type;


    document
        .querySelectorAll(
            ".address-type button"
        )
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });


    if (button) {

        button.classList.add(
            "active"
        );

    }

}


/* =========================================================
   CUSTOMER DETAILS
========================================================= */

function getInput(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value.trim()
        : "";

}


function getCustomerDetails() {

    return {

        name:
            getInput("customerName"),

        mobile:
            getInput("customerMobile"),

        email:
            getInput("
                     
