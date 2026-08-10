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
                     /* =========================================================
   VISHWASH FOODS - SCRIPT.JS
   PART 2
   Header + Mobile Menu + Scroll + Navigation
========================================================= */


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMobileMenu() {

    const menu =
        document.getElementById("mobileMenu");

    if (!menu) return;

    menu.classList.toggle("active");

}


function closeMobileMenu() {

    const menu =
        document.getElementById("mobileMenu");

    if (!menu) return;

    menu.classList.remove("active");

}


/* =========================================================
   CLOSE MENU WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const menu =
            document.getElementById("mobileMenu");

        const menuButton =
            document.querySelector(".mobile-menu-btn");


        if (!menu) return;


        if (
            menu.classList.contains("active") &&
            !menu.contains(event.target) &&
            !menuButton?.contains(event.target)
        ) {

            menu.classList.remove("active");

        }

    }
);


/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

function handleHeaderScroll() {

    const header =
        document.getElementById("mainHeader");

    if (!header) return;


    if (window.scrollY > 20) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

}


window.addEventListener(
    "scroll",
    handleHeaderScroll,
    { passive: true }
);


/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

function goToSection(sectionId) {

    const section =
        document.getElementById(sectionId);

    if (!section) return;


    closeMobileMenu();


    const header =
        document.getElementById("mainHeader");

    const headerHeight =
        header
            ? header.offsetHeight
            : 0;


    const position =
        section.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight;


    window.scrollTo({

        top: position,

        behavior: "smooth"

    });

}


/* =========================================================
   NAVIGATION LINKS
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const link =
            event.target.closest(
                'a[href^="#"]'
            );

        if (!link) return;


        const href =
            link.getAttribute("href");


        if (
            !href ||
            href === "#" ||
            href.length < 2
        ) {

            return;

        }


        const sectionId =
            href.substring(1);


        const section =
            document.getElementById(
                sectionId
            );


        if (!section) return;


        event.preventDefault();


        goToSection(
            sectionId
        );

    }
);


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function updateActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    const links =
        document.querySelectorAll(
            ".nav-link"
        );


    if (!sections.length) return;


    let currentSection = "";


    sections.forEach(section => {

        const top =
            section.offsetTop - 180;


        const bottom =
            top + section.offsetHeight;


        if (
            window.scrollY >= top &&
            window.scrollY < bottom
        ) {

            currentSection =
                section.id;

        }

    });


    links.forEach(link => {

        link.classList.remove(
            "active"
        );


        const href =
            link.getAttribute("href");


        if (
            href ===
            "#" + currentSection
        ) {

            link.classList.add(
                "active"
            );

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);


/* =========================================================
   SEARCH BOX
========================================================= */

function focusSearch() {

    const search =
        document.getElementById(
            "searchInput"
        );


    if (!search) {

        /*
         * अगर searchInput अभी मौजूद नहीं है,
         * तो products section तक ले जाएगा।
         */

        goToSection("products");

        return;

    }


    search.focus();

}


document.addEventListener(
    "keydown",
    function(event) {

        /*
         * "/" दबाने पर Search
         */

        if (
            event.key === "/" &&
            document.activeElement.tagName !==
            "INPUT" &&
            document.activeElement.tagName !==
            "TEXTAREA"
        ) {

            event.preventDefault();

            focusSearch();

        }

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeMobileMenu();

        }

    }
);


/* =========================================================
   HEADER CART / WISHLIST COUNT
========================================================= */

function refreshHeaderCounts() {

    /*
     * ये functions Part 1 के
     * main script में होंगे।
     */

    if (
        typeof updateCartCount ===
        "function"
    ) {

        updateCartCount();

    }


    if (
        typeof updateWishlistCount ===
        "function"
    ) {

        updateWishlistCount();

    }

}


/* =========================================================
   HEADER BUTTONS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        handleHeaderScroll();

        updateActiveNavigation();

        refreshHeaderCounts();

    }
);


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    function() {

        /*
         * Desktop पर mobile menu
         * accidentally खुला न रहे।
         */

        if (window.innerWidth > 768) {

            closeMobileMenu();

        }

    }
);


/* =========================================================
   PART 2 COMPLETE
========================================================= */
   /* =========================================================
   VISHWASH FOODS - SCRIPT.JS
   PART 3
   Product Search + Category Filter + Product Cards
========================================================= */


/* =========================================================
   SEARCH PRODUCTS
========================================================= */

function searchProducts(query) {

    query = String(query)
        .trim()
        .toLowerCase();


    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    cards.forEach(card => {

        const text =
            card.textContent.toLowerCase();


        const match =
            !query ||
            text.includes(query);


        card.style.display =
            match ? "" : "none";

    });


    updateNoProductsMessage();

}


/* =========================================================
   SEARCH INPUT
========================================================= */

function handleProductSearch(input) {

    if (!input) return;

    searchProducts(
        input.value
    );

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function filterProducts(category) {

    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    category =
        String(category)
            .trim()
            .toLowerCase();


    cards.forEach(card => {

        const cardCategory =
            String(
                card.dataset.category || ""
            ).toLowerCase();


        const show =
            category === "all" ||
            category === "" ||
            cardCategory === category;


        card.style.display =
            show ? "" : "none";

    });


    updateCategoryButtons(
        category
    );


    updateNoProductsMessage();

}


/* =========================================================
   CATEGORY BUTTON ACTIVE STATE
========================================================= */

function updateCategoryButtons(category) {

    document
        .querySelectorAll(
            ".vf-category-btn"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );


            const buttonCategory =
                String(
                    button.dataset.category || ""
                ).toLowerCase();


            if (
                buttonCategory === category
            ) {

                button.classList.add(
                    "active"
                );

            }

        });

}


/* =========================================================
   NO PRODUCT MESSAGE
========================================================= */

function updateNoProductsMessage() {

    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    if (!cards.length) return;


    let visible = 0;


    cards.forEach(card => {

        if (
            card.style.display !==
            "none"
        ) {

            visible++;

        }

    });


    let message =
        document.getElementById(
            "noProductsMessage"
        );


    if (!message) {

        message =
            document.createElement(
                "div"
            );

        message.id =
            "noProductsMessage";

        message.style.cssText = `
            width:100%;
            text-align:center;
            padding:45px 20px;
            color:#6b7280;
            font-weight:700;
            grid-column:1/-1;
        `;

        message.innerHTML = `
            <div style="font-size:45px;">
                😔
            </div>

            <h3>
                No products found
            </h3>

            <p>
                Try another search or category.
            </p>
        `;


        const grid =
            document.querySelector(
                ".products-grid"
            );


        if (grid) {

            grid.appendChild(
                message
            );

        }

    }


    message.style.display =
        visible === 0
            ? "block"
            : "none";

}


/* =========================================================
   PRODUCT CARD CONNECTION
========================================================= */

function connectProductCards() {

    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    cards.forEach(
        (card, index) => {

            let id =
                Number(
                    card.dataset.productId
                );


            /*
             * अगर product ID HTML में
             * नहीं है तो automatic ID
             */

            if (!id) {

                id =
                    index + 1;

                card.dataset.productId =
                    id;

            }


            /* =========================
               LIKE BUTTON
            ========================= */

            const likeButton =
                card.querySelector(
                    ".like-btn"
                );


            if (likeButton) {

                likeButton.dataset.productId =
                    id;


                likeButton.onclick =
                    function(event) {

                        event.preventDefault();

                        event.stopPropagation();


                        if (
                            typeof toggleWishlist ===
                            "function"
                        ) {

                            toggleWishlist(id);

                        }

                    };

            }


            /* =========================
               BUY BUTTON
            ========================= */

            const buyButton =
                card.querySelector(
                    ".buy-btn"
                );


            if (buyButton) {

                buyButton.onclick =
                    function(event) {

                        event.preventDefault();

                        event.stopPropagation();


                        if (
                            typeof buyNow ===
                            "function"
                        ) {

                            buyNow(id);

                        }

                    };

            }


            /* =========================
               CART BUTTON
            ========================= */

            const cartButton =
                card.querySelector(
                    ".cart-btn"
                );


            if (cartButton) {

                cartButton.onclick =
                    function(event) {

                        event.preventDefault();

                        event.stopPropagation();


                        if (
                            typeof addToCart ===
                            "function"
                        ) {

                            addToCart(id);

                        }

                    };

            }


            /* =========================
               PRODUCT CARD CLICK
            ========================= */

            card.addEventListener(
                "click",
                function(event) {

                    /*
                     * Button पर click होने पर
                     * card open नहीं होगा।
                     */

                    if (
                        event.target.closest(
                            "button"
                        )
                    ) {

                        return;

                    }


                    if (
                        typeof buyNow ===
                        "function"
                    ) {

                        buyNow(id);

                    }

                }
            );

        }
    );


    /*
     * Wishlist state refresh
     */

    if (
        typeof updateLikeButtons ===
        "function"
    ) {

        updateLikeButtons();

    }

}


/* =========================================================
   PRODUCT CARD HOVER EFFECT
========================================================= */

function setupProductHover() {

    document
        .querySelectorAll(
            ".product-card"
        )
        .forEach(card => {

            card.addEventListener(
                "mouseenter",
                function() {

                    card.classList.add(
                        "product-hover"
                    );

                }
            );


            card.addEventListener(
                "mouseleave",
                function() {

                    card.classList.remove(
                        "product-hover"
                    );

                }
            );

        });

}


/* =========================================================
   SEARCH WITH DEBOUNCE
========================================================= */

let searchTimer = null;


function delayedSearch(value) {

    clearTimeout(
        searchTimer
    );


    searchTimer =
        setTimeout(
            function() {

                searchProducts(
                    value
                );

            },
            180
        );

}


/* =========================================================
   SEARCH INPUT AUTO CONNECT
========================================================= */

function connectSearchInput() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) return;


    input.addEventListener(
        "input",
        function() {

            delayedSearch(
                this.value
            );

        }
    );


    /*
     * Enter दबाने पर search
     */

    input.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                searchProducts(
                    this.value
                );

            }

        }
    );

}


/* =========================================================
   CLEAR SEARCH
========================================================= */

function clearProductSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (input) {

        input.value = "";

    }


    searchProducts("");

}


/* =========================================================
   SORT PRODUCTS
========================================================= */

function sortProducts(type) {

    const grid =
        document.querySelector(
            ".products-grid"
        );


    if (!grid) return;


    const cards =
        Array.from(
            grid.querySelectorAll(
                ".product-card"
            )
        );


    cards.sort(
        function(a, b) {

            const priceA =
                Number(
                    a.dataset.price ||
                    0
                );


            const priceB =
                Number(
                    b.dataset.price ||
                    0
                );


            if (
                type ===
                "low-high"
            ) {

                return priceA -
                    priceB;

            }


            if (
                type ===
                "high-low"
            ) {

                return priceB -
                    priceA;

            }


            return 0;

        }
    );


    cards.forEach(card => {

        grid.appendChild(
            card
        );

    });

}


/* =========================================================
   SCROLL TO PRODUCTS
========================================================= */

function goToProducts() {

    const section =
        document.getElementById(
            "products"
        );


    if (!section) return;


    const header =
        document.getElementById(
            "mainHeader"
        );


    const offset =
        header
            ? header.offsetHeight
            : 0;


    window.scrollTo({

        top:
            section.offsetTop -
            offset -
            10,

        behavior:
            "smooth"

    });

}


/* =========================================================
   INITIALIZE PART 3
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        connectProductCards();

        setupProductHover();

        connectSearchInput();

        updateNoProductsMessage();

    }
);


/* =========================================================
   PART 3 COMPLETE
========================================================= */
   /* =========================================================
   VISHWASH FOODS - SCRIPT.JS
   PART 4
   Product Detail + Buy Now + Quantity
========================================================= */


/* =========================================================
   CURRENT PRODUCT
========================================================= */

let selectedProduct = null;
let selectedQuantity = 1;


/* =========================================================
   GET PRODUCT
========================================================= */

function getProductById(id) {

    id = Number(id);

    if (
        typeof products === "undefined" ||
        !Array.isArray(products)
    ) {
        return null;
    }

    return products.find(
        product =>
            Number(product.id) === id
    );

}


/* =========================================================
   OPEN PRODUCT DETAIL
========================================================= */

function openProductDetail(id) {

    const product =
        getProductById(id);

    if (!product) {

        showToast(
            "Product not found"
        );

        return;

    }


    selectedProduct =
        product;

    selectedQuantity = 1;


    /* =========================
       PRODUCT INFORMATION
    ========================= */

    setProductDetailText(
        "detailFood",
        product.image || "🍌"
    );


    setProductDetailText(
        "detailCategory",
        product.category || "Snacks"
    );


    setProductDetailText(
        "detailTitle",
        product.name
    );


    setProductDetailText(
        "detailPrice",
        money(product.price)
    );


    setProductDetailText(
        "detailMrp",
        money(product.mrp)
    );


    setProductDetailText(
        "detailRating",
        `⭐ ${product.rating || 4.8} • ${product.reviews || 0}+ Reviews`
    );


    setProductDetailText(
        "detailDescription",
        product.description ||
        "Delicious premium quality snack from Vishwash Foods."
    );


    updateProductQuantityUI();


    /* =========================
       OPEN SLIDE
    ========================= */

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


    /* =========================
       CLOSE OTHER SLIDES
    ========================= */

    closeOtherPanels(
        "productDetailOverlay"
    );

}


/* =========================================================
   BUY NOW
========================================================= */

function buyNow(id) {

    openProductDetail(id);

}


/* =========================================================
   PRODUCT DETAIL TEXT
========================================================= */

function setProductDetailText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) return;


    element.textContent =
        value;

}


/* =========================================================
   PRODUCT QUANTITY +
========================================================= */

function increaseProductQuantity() {

    if (!selectedProduct)
        return;


    if (
        selectedQuantity >= 20
    ) {

        showToast(
            "Maximum 20 quantity allowed"
        );

        return;

    }


    selectedQuantity++;

    updateProductQuantityUI();

}


/* =========================================================
   PRODUCT QUANTITY -
========================================================= */

function decreaseProductQuantity() {

    if (!selectedProduct)
        return;


    if (
        selectedQuantity <= 1
    ) {

        return;

    }


    selectedQuantity--;

    updateProductQuantityUI();

}


/* =========================================================
   SET PRODUCT QUANTITY
========================================================= */

function setProductQuantity(
    quantity
) {

    quantity =
        Number(quantity);


    if (
        !Number.isFinite(quantity)
    ) {

        quantity = 1;

    }


    quantity =
        Math.max(
            1,
            Math.min(
                20,
                Math.floor(quantity)
            )
        );


    selectedQuantity =
        quantity;


    updateProductQuantityUI();

}


/* =========================================================
   UPDATE PRODUCT QUANTITY UI
========================================================= */

function updateProductQuantityUI() {

    if (!selectedProduct)
        return;


    const quantity =
        selectedQuantity;


    const total =
        Number(
            selectedProduct.price
        ) * quantity;


    const quantityElements =
        document.querySelectorAll(
            "#buyQuantity, .buy-quantity"
        );


    quantityElements.forEach(
        element => {

            element.textContent =
                quantity;

        }
    );


    const totalElements =
        document.querySelectorAll(
            "#buyTotal, .buy-total"
        );


    totalElements.forEach(
        element => {

            element.textContent =
                money(total);

        }
    );


    const quantityInput =
        document.getElementById(
            "productQuantityInput"
        );


    if (quantityInput) {

        quantityInput.value =
            quantity;

    }

}


/* =========================================================
   ADD CURRENT PRODUCT TO CART
========================================================= */

function addCurrentProductToCart() {

    if (!selectedProduct) {

        showToast(
            "Please select a product"
        );

        return;

    }


    addToCart(
        selectedProduct.id,
        selectedQuantity
    );


    closeProductDetail();

}


/* =========================================================
   BUY CURRENT PRODUCT
========================================================= */

function buyCurrentProduct() {

    if (!selectedProduct) {

        showToast(
            "Please select a product"
        );

        return;

    }


    /*
     * पहले cart में add
     */

    addToCart(
        selectedProduct.id,
        selectedQuantity
    );


    /*
     * Product detail बंद
     */

    closeProductDetail();


    /*
     * थोड़ी देर बाद checkout
     */

    setTimeout(
        function() {

            if (
                typeof openCheckout ===
                "function"
            ) {

                openCheckout();

            }

        },
        250
    );

}


/* =========================================================
   CLOSE PRODUCT DETAIL
========================================================= */

function closeProductDetail(
    event
) {

    /*
     * Overlay के बाहर click
     */

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


    document.body.style.overflow =
        "";

}


/* =========================================================
   PRODUCT IMAGE CLICK
========================================================= */

function productImageClick(id) {

    openProductDetail(id);

}


/* =========================================================
   PRODUCT DETAIL ADD WISHLIST
========================================================= */

function wishlistCurrentProduct() {

    if (!selectedProduct)
        return;


    if (
        typeof toggleWishlist ===
        "function"
    ) {

        toggleWishlist(
            selectedProduct.id
        );

    }

}


/* =========================================================
   CLOSE OTHER PANELS
========================================================= */

function closeOtherPanels(
    exceptId
) {

    const panels = [

        "cartOverlay",

        "wishlistOverlay",

        "checkoutOverlay"

    ];


    panels.forEach(
        id => {

            if (id === exceptId)
                return;


            const panel =
                document.getElementById(id);


            if (panel) {

                panel.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   PRODUCT DETAIL ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        const overlay =
            document.getElementById(
                "productDetailOverlay"
            );


        if (
            overlay &&
            overlay.classList.contains(
                "active"
            )
        ) {

            closeProductDetail();

        }

    }
);


/* =========================================================
   PRODUCT DETAIL BUTTON AUTO CONNECT
========================================================= */

function connectProductDetailButtons() {

    const increase =
        document.querySelector(
            ".quantity-plus"
        );


    const decrease =
        document.querySelector(
            ".quantity-minus"
        );


    const addCart =
        document.querySelector(
            ".detail-add-cart"
        );


    const buy =
        document.querySelector(
            ".detail-buy-btn"
        );


    const wishlist =
        document.querySelector(
            ".detail-wishlist-btn"
        );


    if (increase) {

        increase.onclick =
            increaseProductQuantity;

    }


    if (decrease) {

        decrease.onclick =
            decreaseProductQuantity;

    }


    if (addCart) {

        addCart.onclick =
            addCurrentProductToCart;

    }


    if (buy) {

        buy.onclick =
            buyCurrentProduct;

    }


    if (wishlist) {

        wishlist.onclick =
            wishlistCurrentProduct;

    }

}


/* =========================================================
   PRODUCT CARD → DETAIL
========================================================= */

function connectDetailCards() {

    document
        .querySelectorAll(
            ".product-card"
        )
        .forEach(
            card => {

                const id =
                    Number(
                        card.dataset.productId
                    );


                if (!id) return;


                /*
                 * Image click
                 */

                const image =
                    card.querySelector(
                        ".product-image"
                    );


                if (image) {

                    image.style.cursor =
                        "pointer";


                    image.addEventListener(
                        "click",
                        function(event) {

                            event.preventDefault();

                            event.stopPropagation();

                            openProductDetail(
                                id
                            );

                        }
                    );

                }

            }
        );

}


/* =========================================================
   INITIALIZE PART 4
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        connectProductDetailButtons();

        connectDetailCards();

    }
);


/* =========================================================
   PART 4 COMPLETE
========================================================= */
   /* =========================================================
   VISHWASH FOODS - SCRIPT.JS
   PART 5
   CART SLIDE + CART MANAGEMENT
========================================================= */


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

    closeOtherPanels("cartOverlay");


    renderCart();

    updateCartSummary();


    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if (!overlay) {

        showToast(
            "Cart panel not found"
        );

        return;

    }


    overlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart(event) {

    /*
     * अगर overlay के अंदर किसी
     * button पर click हुआ है तो close
     * नहीं करना।
     */

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


    document.body.style.overflow =
        "";

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    const container =
        document.getElementById(
            "cartContent"
        );


    if (!container) return;


    if (
        typeof cart ===
        "undefined"
    ) {

        return;

    }


    /* =========================
       EMPTY CART
    ========================= */

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add your favourite
                    Vishwash Foods snacks.
                </p>

                <button
                    type="button"
                    onclick="
                        closeCart();
                        goToProducts();
                    "
                    class="primary-btn"
                >
                    Start Shopping →
                </button>

            </div>

        `;


        updateCartSummary();

        return;

    }


    /* =========================
       CART ITEMS
    ========================= */

    container.innerHTML =

        cart.map(
            item => {

                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                return `

                    <div
                        class="cart-item"
                        data-cart-id="${item.id}"
                    >

                        <!-- PRODUCT IMAGE -->

                        <div class="cart-item-image">

                            ${
                                item.image ||
                                "🍌"
                            }

                        </div>


                        <!-- PRODUCT INFO -->

                        <div class="cart-item-details">

                            <h4>
                                ${escapeHTML(
                                    item.name
                                )}
                            </h4>

                            <span class="cart-category">
                                ${escapeHTML(
                                    item.category ||
                                    "Snacks"
                                )}
                            </span>


                            <div class="cart-price">

                                ${money(
                                    item.price
                                )}

                            </div>


                            <!-- QUANTITY -->

                            <div
                                class="cart-quantity"
                            >

                                <button
                                    type="button"
                                    onclick="
                                        changeCartQuantity(
                                            ${item.id},
                                            -1
                                        )
                                    "
                                >
                                    −
                                </button>


                                <span>
                                    ${item.quantity}
                                </span>


                                <button
                                    type="button"
                                    onclick="
                                        changeCartQuantity(
                                            ${item.id},
                                            1
                                        )
                                    "
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <!-- RIGHT SIDE -->

                        <div
                            class="cart-item-right"
                        >

                            <strong>
                                ${money(
                                    itemTotal
                                )}
                            </strong>


                            <button
                                type="button"
                                class="cart-remove-btn"
                                onclick="
                                    removeFromCart(
                                        ${item.id}
                                    )
                                "
                                aria-label="Remove product"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");


    updateCartSummary();

}


/* =========================================================
   CHANGE CART QUANTITY
========================================================= */

function changeCartQuantity(
    id,
    change
) {

    const item =
        cart.find(
            product =>
                Number(product.id) ===
                Number(id)
        );


    if (!item) return;


    change =
        Number(change) || 0;


    item.quantity +=
        change;


    /* =========================
       REMOVE WHEN ZERO
    ========================= */

    if (
        item.quantity <= 0
    ) {

        removeFromCart(id);

        return;

    }


    /* =========================
       MAXIMUM QUANTITY
    ========================= */

    if (
        item.quantity > 20
    ) {

        item.quantity = 20;

        showToast(
            "Maximum 20 quantity allowed"
        );

    }


    saveCart();


    renderCart();

    updateCartCount();

    updateCartSummary();

}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(id) {

    const item =
        cart.find(
            product =>
                Number(product.id) ===
                Number(id)
        );


    if (!item) return;


    cart =
        cart.filter(
            product =>
                Number(product.id) !==
                Number(id)
        );


    saveCart();


    renderCart();

    updateCartCount();

    updateCartSummary();


    showToast(
        `${item.name} removed from cart`
    );

}


/* =========================================================
   CART QUANTITY
========================================================= */

function getCartQuantity() {

    if (
        typeof cart ===
        "undefined"
    ) {

        return 0;

    }


    return cart.reduce(
        (
            total,
            item
        ) => {

            return (
                total +
                Number(
                    item.quantity
                )
            );

        },
        0
    );

}


/* =========================================================
   CART SUBTOTAL
========================================================= */

function getSubtotal() {

    if (
        typeof cart ===
        "undefined"
    ) {

        return 0;

    }


    return cart.reduce(
        (
            total,
            item
        ) => {

            return (
                total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                )
            );

        },
        0
    );

}


/* =========================================================
   DELIVERY CHARGE
========================================================= */

function getDeliveryCharge() {

    const subtotal =
        getSubtotal();


    if (
        subtotal <= 0
    ) {

        return 0;

    }


    /*
     * ₹499 या उससे ज्यादा
     * पर FREE DELIVERY
     */

    if (
        subtotal >= 499
    ) {

        return 0;

    }


    return 40;

}


/* =========================================================
   GRAND TOTAL
========================================================= */

function getGrandTotal() {

    return (
        getSubtotal() +
        getDeliveryCharge()
    );

}


/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateCartCount() {

    const count =
        getCartQuantity();


    document
        .querySelectorAll(
            "#cartCount, .cart-count"
        )
        .forEach(
            element => {

                element.textContent =
                    count;


                element.classList.toggle(
                    "hidden",
                    count === 0
                );

            }
        );

}


/* =========================================================
   UPDATE CART SUMMARY
========================================================= */

function updateCartSummary() {

    const subtotal =
        getSubtotal();


    const delivery =
        getDeliveryCharge();


    const total =
        getGrandTotal();


    /* =========================
       SUBTOTAL
    ========================= */

    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            money(subtotal);

    }


    /* =========================
       DELIVERY
    ========================= */

    const deliveryElement =
        document.getElementById(
            "cartDelivery"
        );


    if (deliveryElement) {

        deliveryElement.textContent =
            delivery === 0
                ? "FREE"
                : money(delivery);

    }


    /* =========================
       TOTAL
    ========================= */

    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (totalElement) {

        totalElement.textContent =
            money(total);

    }


    /* =========================
       FREE DELIVERY MESSAGE
    ========================= */

    const freeMessage =
        document.getElementById(
            "freeDeliveryMessage"
        );


    if (freeMessage) {

        if (
            subtotal >= 499
        ) {

            freeMessage.textContent =
                "🎉 Free delivery unlocked!";

        } else if (
            subtotal > 0
        ) {

            freeMessage.textContent =
                `🛍️ Shop ${money(
                    499 - subtotal
                )} more for FREE delivery.`;

        } else {

            freeMessage.textContent =
                "🛍️ Free delivery on orders above ₹499";

        }

    }


    /* =========================
       CHECKOUT BUTTON
    ========================= */

    const checkoutButton =
        document.getElementById(
            "cartCheckoutButton"
        );


    if (checkoutButton) {

        checkoutButton.disabled =
            cart.length === 0;

    }

}


/* =========================================================
   CLEAR COMPLETE CART
========================================================= */

function clearCart() {

    if (
        typeof cart ===
        "undefined" ||
        cart.length === 0
    ) {

        return;

    }


    const confirmClear =
        window.confirm(
            "Are you sure you want to remove all products from cart?"
        );


    if (!confirmClear)
        return;


    cart = [];


    saveCart();


    renderCart();

    updateCartCount();

    updateCartSummary();


    showToast(
        "Cart cleared"
    );

}


/* =========================================================
   CART CHECKOUT BUTTON
========================================================= */

function checkoutFromCart() {

    if (
        typeof cart ===
        "undefined" ||
        cart.length === 0
    ) {

        showToast(
            "Your cart is empty 🛒"
        );

        return;

    }


    if (
        typeof openCheckout ===
        "function"
    ) {

        openCheckout();

    } else {

        showToast(
            "Checkout is loading..."
        );

    }

}


/* =========================================================
   CONTINUE SHOPPING
========================================================= */

function continueShopping() {

    closeCart();

    goToProducts();

}


/* =========================================================
   CART OVERLAY CLICK
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const overlay =
            document.getElementById(
                "cartOverlay"
            );


        if (
            overlay &&
            event.target ===
            overlay
        ) {

            closeCart();

        }

    }
);


/* =========================================================
   CART KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        const overlay =
            document.getElementById(
                "cartOverlay"
            );


        if (
            overlay &&
            overlay.classList.contains(
                "active"
            )
        ) {

            closeCart();

        }

    }
);


/* =========================================================
   INITIALIZE CART
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        updateCartSummary();

    }
);


/* =========================================================
   PART 5 COMPLETE
========================================================= */
   /* =========================================================
   VISHWASH FOODS - SCRIPT.JS
   PART 6
   WISHLIST + LIKE SYSTEM
========================================================= */


/* =========================================================
   WISHLIST DATA
========================================================= */

function getWishlistItems() {

    if (
        typeof wishlist === "undefined"
    ) {

        return [];

    }

    return wishlist;

}


/* =========================================================
   CHECK WISHLIST
========================================================= */

function isProductInWishlist(id) {

    return getWishlistItems().some(
        item =>
            Number(item.id) ===
            Number(id)
    );

}


/* =========================================================
   TOGGLE WISHLIST
========================================================= */

function toggleWishlist(id) {

    const product =
        getProductById(id);


    if (!product) {

        showToast(
            "Product not found"
        );

        return;

    }


    const exists =
        isProductInWishlist(id);


    if (exists) {

        wishlist =
            wishlist.filter(
                item =>
                    Number(item.id) !==
                    Number(id)
            );


        showToast(
            "Removed from wishlist ❤️"
        );


    } else {

        wishlist.push({

            id: product.id,

            name: product.name,

            category:
                product.category,

            price:
                product.price,

            mrp:
                product.mrp,

            image:
                product.image

        });


        showToast(
            "Added to wishlist ❤️"
        );

    }


    saveWishlist();

    updateWishlistUI();

    updateAllLikeButtons();

}


/* =========================================================
   SAVE WISHLIST
========================================================= */

function saveWishlist() {

    try {

        localStorage.setItem(
            STORAGE.wishlist,
            JSON.stringify(
                wishlist
            )
        );

    } catch (error) {

        console.error(
            "Wishlist save error:",
            error
        );

    }

}


/* =========================================================
   WISHLIST COUNT
========================================================= */

function updateWishlistCount() {

    const count =
        getWishlistItems().length;


    document
        .querySelectorAll(
            "#wishlistCount, .wishlist-count"
        )
        .forEach(
            element => {

                element.textContent =
                    count;


                element.classList.toggle(
                    "hidden",
                    count === 0
                );

            }
        );

}


/* =========================================================
   UPDATE LIKE BUTTONS
========================================================= */

function updateAllLikeButtons() {

    document
        .querySelectorAll(
            ".like-btn"
        )
        .forEach(
            button => {

                const id =
                    Number(
                        button.dataset.productId
                    );


                if (
                    isProductInWishlist(id)
                ) {

                    button.classList.add(
                        "liked"
                    );

                    button.setAttribute(
                        "aria-pressed",
                        "true"
                    );

                    button.innerHTML =
                        "♥";

                } else {

                    button.classList.remove(
                        "liked"
                    );

                    button.setAttribute(
                        "aria-pressed",
                        "false"
                    );

                    button.innerHTML =
                        "♡";

                }

            }
        );

}


/* =========================================================
   OPEN WISHLIST
========================================================= */

function openWishlist() {

    closeOtherPanels(
        "wishlistOverlay"
    );


    renderWishlist();

    updateWishlistCount();


    const overlay =
        document.getElementById(
            "wishlistOverlay"
        );


    if (!overlay) {

        showToast(
            "Wishlist panel not found"
        );

        return;

    }


    overlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE WISHLIST
========================================================= */

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


    document.body.style.overflow =
        "";

}


/* =========================================================
   RENDER WISHLIST
========================================================= */

function renderWishlist() {

    const container =
        document.getElementById(
            "wishlistContent"
        );


    if (!container) return;


    const items =
        getWishlistItems();


    /* =========================
       EMPTY WISHLIST
    ========================= */

    if (
        items.length === 0
    ) {

        container.innerHTML = `

            <div
                class="empty-wishlist"
            >

                <div
                    class="empty-wishlist-icon"
                >
                    ♡
                </div>

                <h3>
                    Your Wishlist is Empty
                </h3>

                <p>
                    Save your favourite
                    Vishwash Foods products here.
                </p>

                <button
                    type="button"
                    class="primary-btn"
                    onclick="
                        closeWishlist();
                        goToProducts();
                    "
                >
                    Explore Products →
                </button>

            </div>

        `;


        return;

    }


    /* =========================
       WISHLIST ITEMS
    ========================= */

    container.innerHTML =

        items.map(
            item => `

                <div
                    class="wishlist-item"
                    data-wishlist-id="${item.id}"
                >

                    <!-- IMAGE -->

                    <div
                        class="wishlist-image"
                    >

                        ${
                            item.image ||
                            "🍌"
                        }

                    </div>


                    <!-- DETAILS -->

                    <div
                        class="wishlist-details"
                    >

                        <span
                            class="wishlist-category"
                        >
                            ${escapeHTML(
                                item.category ||
                                "Snacks"
                            )}
                        </span>


                        <h4>
                            ${escapeHTML(
                                item.name
                            )}
                        </h4>


                        <strong
                            class="wishlist-price"
                        >
                            ${money(
                                item.price
                            )}
                        </strong>


                        <!-- ACTIONS -->

                        <div
                            class="wishlist-actions"
                        >

                            <button
                                type="button"
                                onclick="
                                    addWishlistToCart(
                                        ${item.id}
                                    )
                                "
                            >
                                🛒 Add to Cart
                            </button>


                            <button
                                type="button"
                                onclick="
                                    buyNow(
                                        ${item.id}
                                    )
                                "
                            >
                                Buy Now
                            </button>


                            <button
                                type="button"
                                class="wishlist-remove"
                                onclick="
                                    removeFromWishlist(
                                        ${item.id}
                                    )
                                "
                                aria-label="Remove wishlist item"
                            >
                                ×
                            </button>

                        </div>

                    </div>

                </div>

            `
        ).join("");

}


/* =========================================================
   ADD WISHLIST PRODUCT TO CART
========================================================= */

function addWishlistToCart(id) {

    const product =
        getProductById(id);


    if (!product) return;


    addToCart(
        id,
        1
    );


    showToast(
        `${product.name} added to cart 🛒`
    );

}


/* =========================================================
   REMOVE FROM WISHLIST
========================================================= */

function removeFromWishlist(id) {

    const product =
        getProductById(id);


    wishlist =
        wishlist.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );


    saveWishlist();

    renderWishlist();

    updateWishlistCount();

    updateAllLikeButtons();


    if (product) {

        showToast(
            `${product.name} removed`
        );

    }

}


/* =========================================================
   CLEAR WISHLIST
========================================================= */

function clearWishlist() {

    if (
        wishlist.length === 0
    ) {

        return;

    }


    const confirmClear =
        window.confirm(
            "Remove all products from wishlist?"
        );


    if (!confirmClear)
        return;


    wishlist = [];


    saveWishlist();

    renderWishlist();

    updateWishlistCount();

    updateAllLikeButtons();


    showToast(
        "Wishlist cleared"
    );

}


/* =========================================================
   MOVE ALL WISHLIST TO CART
========================================================= */

function addAllWishlistToCart() {

    const items =
        getWishlistItems();


    if (
        items.length === 0
    ) {

        showToast(
            "Wishlist is empty"
        );

        return;

    }


    items.forEach(
        item => {

            addToCart(
                item.id,
                1
            );

        }
    );


    showToast(
        "All wishlist products added to cart 🛒"
    );

}


/* =========================================================
   WISHLIST OVERLAY CLICK
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const overlay =
            document.getElementById(
                "wishlistOverlay"
            );


        if (
            overlay &&
            event.target ===
            overlay
        ) {

            closeWishlist();

        }

    }
);


/* =========================================================
   WISHLIST ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        const overlay =
            document.getElementById(
                "wishlistOverlay"
            );


        if (
            overlay &&
            overlay.classList.contains(
                "active"
            )
        ) {

            closeWishlist();

        }

    }
);


/* =========================================================
   LIKE BUTTON AUTO CONNECTION
========================================================= */

function connectWishlistButtons() {

    document
        .querySelectorAll(
            ".product-card"
        )
        .forEach(
            card => {

                const id =
                    Number(
                        card.dataset.productId
                    );


                if (!id) return;


                const button =
                    card.querySelector(
                        ".like-btn"
                    );


                if (!button)
                    return;


                button.dataset.productId =
                    id;


                button.onclick =
                    function(event) {

                        event.preventDefault();

                        event.stopPropagation();


                        toggleWishlist(
                            id
                        );

                    };

            }
        );


    updateAllLikeButtons();

}


/* =========================================================
   WISHLIST PRODUCT DETAIL BUTTON
========================================================= */

function updateDetailWishlistButton() {

    const button =
        document.querySelector(
            ".detail-wishlist-btn"
        );


    if (
        !button ||
        !selectedProduct
    ) {

        return;

    }


    if (
        isProductInWishlist(
            selectedProduct.id
        )
    ) {

        button.classList.add(
            "liked"
        );

        button.innerHTML =
            "♥ Saved";

    } else {

        button.classList.remove(
            "liked"
        );

        button.innerHTML =
            "♡ Wishlist";

    }

}


/* =========================================================
   INITIALIZE WISHLIST
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateWishlistCount();

        connectWishlistButtons();

        renderWishlist();

    }
);


/* =========================================================
   PART 6 COMPLETE
========================================================= */
   /* =========================================================
   VISHWASH FOODS - SCRIPT.JS
   PART 7
   CUSTOMER DETAILS + CHECKOUT
========================================================= */


/* =========================================================
   CUSTOMER DATA
========================================================= */

let customerDetails = {

    name: "",

    phone: "",

    email: "",

    address: "",

    city: "",

    state: "",

    pincode: "",

    landmark: ""

};


/* =========================================================
   LOAD CUSTOMER DETAILS
========================================================= */

function loadCustomerDetails() {

    try {

        const saved =
            localStorage.getItem(
                "vishwash_customer"
            );


        if (saved) {

            customerDetails =
                {
                    ...customerDetails,
                    ...JSON.parse(saved)
                };

        }

    } catch (error) {

        console.error(
            "Customer data error:",
            error
        );

    }

}


/* =========================================================
   SAVE CUSTOMER DETAILS
========================================================= */

function saveCustomerDetails() {

    try {

        localStorage.setItem(
            "vishwash_customer",
            JSON.stringify(
                customerDetails
            )
        );

    } catch (error) {

        console.error(
            "Customer save error:",
            error
        );

    }

}


/* =========================================================
   OPEN CHECKOUT
========================================================= */

function openCheckout() {

    if (
        typeof cart === "undefined" ||
        cart.length === 0
    ) {

        showToast(
            "Your cart is empty 🛒"
        );

        return;

    }


    loadCustomerDetails();


    closeOtherPanels(
        "checkoutOverlay"
    );


    renderCheckout();


    const overlay =
        document.getElementById(
            "checkoutOverlay"
        );


    if (!overlay) {

        showToast(
            "Checkout panel not found"
        );

        return;

    }


    overlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE CHECKOUT
========================================================= */

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


    document.body.style.overflow =
        "";

}


/* =========================================================
   RENDER CHECKOUT
========================================================= */

function renderCheckout() {

    /* =========================
       CUSTOMER INPUTS
    ========================= */

    setInputValue(
        "customerName",
        customerDetails.name
    );


    setInputValue(
        "customerPhone",
        customerDetails.phone
    );


    setInputValue(
        "customerEmail",
        customerDetails.email
    );


    setInputValue(
        "customerAddress",
        customerDetails.address
    );


    setInputValue(
        "customerCity",
        customerDetails.city
    );


    setInputValue(
        "customerState",
        customerDetails.state
    );


    setInputValue(
        "customerPincode",
        customerDetails.pincode
    );


    setInputValue(
        "customerLandmark",
        customerDetails.landmark
    );


    /* =========================
       ORDER SUMMARY
    ========================= */

    renderCheckoutProducts();


    updateCheckoutTotals();

}


/* =========================================================
   SET INPUT VALUE
========================================================= */

function setInputValue(
    id,
    value
) {

    const input =
        document.getElementById(id);


    if (!input) return;


    input.value =
        value || "";

}


/* =========================================================
   GET CUSTOMER FORM
========================================================= */

function getCustomerFormData() {

    return {

        name:
            getInputValue(
                "customerName"
            ),

        phone:
            getInputValue(
                "customerPhone"
            ),

        email:
            getInputValue(
                "customerEmail"
            ),

        address:
            getInputValue(
                "customerAddress"
            ),

        city:
            getInputValue(
                "customerCity"
            ),

        state:
            getInputValue(
                "customerState"
            ),

        pincode:
            getInputValue(
                "customerPincode"
            ),

        landmark:
            getInputValue(
                "customerLandmark"
            )

    };

}


/* =========================================================
   GET INPUT VALUE
========================================================= */

function getInputValue(id) {

    const input =
        document.getElementById(id);


    if (!input) {

        return "";

    }


    return input.value
        .trim();

}


/* =========================================================
   VALIDATE CUSTOMER DETAILS
========================================================= */

function validateCustomerDetails() {

    const data =
        getCustomerFormData();


    /* =========================
       NAME
    ========================= */

    if (
        data.name.length < 2
    ) {

        showToast(
            "Please enter your full name"
        );

        focusInput(
            "customerName"
        );

        return false;

    }


    /* =========================
       PHONE
    ========================= */

    const phone =
        data.phone.replace(
            /\D/g,
            ""
        );


    if (
        phone.length !== 10
    ) {

        showToast(
            "Please enter a valid 10-digit mobile number"
        );

        focusInput(
            "customerPhone"
        );

        return false;

    }


    /* =========================
       EMAIL
    ========================= */

    if (
        data.email &&
        !isValidEmail(
            data.email
        )
    ) {

        showToast(
            "Please enter a valid email"
        );

        focusInput(
            "customerEmail"
        );

        return false;

    }


    /* =========================
       ADDRESS
    ========================= */

    if (
        data.address.length < 8
    ) {

        showToast(
            "Please enter your complete address"
        );

        focusInput(
            "customerAddress"
        );

        return false;

    }


    /* =========================
       CITY
    ========================= */

    if (
        data.city.length < 2
    ) {

        showToast(
            "Please enter your city"
        );

        focusInput(
            "customerCity"
        );

        return false;

    }


    /* =========================
       STATE
    ========================= */

    if (
        data.state.length < 2
    ) {

        showToast(
            "Please enter your state"
        );

        focusInput(
            "customerState"
        );

        return false;

    }


    /* =========================
       PINCODE
    ========================= */

    if (
        !/^[1-9][0-9]{5}$/.test(
            data.pincode
        )
    ) {

        showToast(
            "Please enter a valid 6-digit pincode"
        );

        focusInput(
            "customerPincode"
        );

        return false;

    }


    return true;

}


/* =========================================================
   FOCUS INPUT
========================================================= */

function focusInput(id) {

    const input =
        document.getElementById(id);


    if (input) {

        input.focus();

        input.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   SAVE CUSTOMER FROM CHECKOUT
========================================================= */

function saveCustomerFromCheckout() {

    const data =
        getCustomerFormData();


    customerDetails =
        data;


    saveCustomerDetails();

}


/* =========================================================
   CHECKOUT PRODUCTS
========================================================= */

function renderCheckoutProducts() {

    const container =
        document.getElementById(
            "checkoutProducts"
        );


    if (!container) return;


    if (
        !cart ||
        cart.length === 0
    ) {

        container.innerHTML = `

            <div class="checkout-empty">
                🛒 Your cart is empty
            </div>

        `;

        return;

    }


    container.innerHTML =

        cart.map(
            item => {

                const total =
                    Number(item.price) *
                    Number(item.quantity);


                return `

                    <div
                        class="checkout-product"
                    >

                        <div
                            class="checkout-product-image"
                        >
                            ${
                                item.image ||
                                "🍌"
                            }
                        </div>


                        <div
                            class="checkout-product-info"
                        >

                            <strong>
                                ${escapeHTML(
                                    item.name
                                )}
                            </strong>

                            <span>
                                Qty:
                                ${item.quantity}
                            </span>

                        </div>


                        <strong>
                            ${money(total)}
                        </strong>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   CHECKOUT TOTALS
========================================================= */

function updateCheckoutTotals() {

    const subtotal =
        getSubtotal();


    const delivery =
        getDeliveryCharge();


    const total =
        getGrandTotal();


    const subtotalElement =
        document.getElementById(
            "checkoutSubtotal"
        );


    const deliveryElement =
        document.getElementById(
            "checkoutDelivery"
        );


    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            money(subtotal);

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            delivery === 0
                ? "FREE"
                : money(delivery);

    }


    if (totalElement) {

        totalElement.textContent =
            money(total);

    }

}


/* =========================================================
   PLACE ORDER VALIDATION
========================================================= */

function placeOrder() {

    if (
        !cart ||
        cart.length === 0
    ) {

        showToast(
            "Your cart is empty"
        );

        return;

    }


    if (
        !validateCustomerDetails()
    ) {

        return;

    }


    saveCustomerFromCheckout();


    /*
     * अभी payment/order system
     * Part 8 में जोड़ा जाएगा।
     */

    if (
        typeof showOrderConfirmation ===
        "function"
    ) {

        showOrderConfirmation();

    } else {

        showToast(
            "Customer details saved successfully ✓"
        );

    }

}


/* =========================================================
   FORMAT PHONE
========================================================= */

function formatCustomerPhone(input) {

    if (!input) return;


    let value =
        input.value.replace(
            /\D/g,
            ""
        );


    value =
        value.substring(
            0,
            10
        );


    input.value =
        value;

}


/* =========================================================
   FORMAT PINCODE
========================================================= */

function formatPincode(input) {

    if (!input) return;


    let value =
        input.value.replace(
            /\D/g,
            ""
        );


    value =
        value.substring(
            0,
            6
        );


    input.value =
        value;

}


/* =========================================================
   CUSTOMER INPUT EVENTS
========================================================= */

function connectCustomerInputs() {

    const phone =
        document.getElementById(
            "customerPhone"
        );


    const pincode =
        document.getElementById(
            "customerPincode"
        );


    if (phone) {

        phone.addEventListener(
            "input",
            function() {

                formatCustomerPhone(
                    this
                );

            }
        );

    }


    if (pincode) {

        pincode.addEventListener(
            "input",
            function() {

                formatPincode(
                    this
                );

            }
        );

    }

}


/* =========================================================
   CHECKOUT OVERLAY CLICK
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const overlay =
            document.getElementById(
                "checkoutOverlay"
            );


        if (
            overlay &&
            event.target ===
            overlay
        ) {

            closeCheckout();

        }

    }
);


/* =========================================================
   CHECKOUT ESC
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        const overlay =
            document.getElementById(
                "checkoutOverlay"
            );


        if (
            overlay &&
            overlay.classList.contains(
                "active"
            )
        ) {

            closeCheckout();

        }

    }
);


/* =========================================================
   INITIALIZE CUSTOMER SYSTEM
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadCustomerDetails();

        connectCustomerInputs();

    }
);


/* =========================================================
   PART 7 COMPLETE
========================================================= */
   /* =========================================================
   VISHWASH FOODS - SCRIPT.JS
   PART 8
   PAYMENT + ORDER CONFIRMATION
========================================================= */


/* =========================================================
   PAYMENT SETTINGS
========================================================= */

const PAYMENT_CONFIG = {

    method: "UPI",

    /*
     * यहां अपनी असली UPI ID डालना।
     * Example:
     * vishwashfoods@upi
     */

    upiId: "YOUR-UPI-ID@upi",

    merchantName: "Vishwash Foods"

};


/* =========================================================
   CURRENT ORDER
========================================================= */

let currentOrder = null;


/* =========================================================
   CREATE ORDER ID
========================================================= */

function generateOrderId() {

    const now =
        new Date();


    const date =
        now.getFullYear()
        .toString()
        .slice(-2)
        +
        String(
            now.getMonth() + 1
        ).padStart(2, "0")
        +
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return (
        "VF" +
        date +
        random
    );

}


/* =========================================================
   CREATE ORDER OBJECT
========================================================= */

function createOrder() {

    const customer =
        getCustomerFormData();


    const orderItems =
        cart.map(
            item => ({

                id:
                    item.id,

                name:
                    item.name,

                price:
                    Number(item.price),

                quantity:
                    Number(item.quantity),

                total:
                    Number(item.price) *
                    Number(item.quantity)

            })
        );


    return {

        orderId:
            generateOrderId(),

        date:
            new Date().toISOString(),

        customer:
            customer,

        items:
            orderItems,

        subtotal:
            getSubtotal(),

        delivery:
            getDeliveryCharge(),

        total:
            getGrandTotal(),

        paymentMethod:
            "UPI",

        paymentStatus:
            "Pending",

        orderStatus:
            "Pending"

    };

}


/* =========================================================
   SHOW PAYMENT SLIDE
========================================================= */

function showPaymentPage() {

    if (
        !currentOrder
    ) {

        currentOrder =
            createOrder();

    }


    const overlay =
        document.getElementById(
            "paymentOverlay"
        );


    if (!overlay) {

        showToast(
            "Payment page not found"
        );

        return;

    }


    updatePaymentDetails();


    overlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    closeOtherPanels(
        "paymentOverlay"
    );

}


/* =========================================================
   CLOSE PAYMENT
========================================================= */

function closePayment(event) {

    if (
        event &&
        event.target &&
        event.target.id !==
        "paymentOverlay"
    ) {

        return;

    }


    const overlay =
        document.getElementById(
            "paymentOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    document.body.style.overflow =
        "";

}


/* =========================================================
   UPDATE PAYMENT DETAILS
========================================================= */

function updatePaymentDetails() {

    if (!currentOrder)
        return;


    setText(
        "paymentOrderId",
        currentOrder.orderId
    );


    setText(
        "paymentAmount",
        money(
            currentOrder.total
        )
    );


    setText(
        "paymentUpiId",
        PAYMENT_CONFIG.upiId
    );


    setText(
        "paymentMerchantName",
        PAYMENT_CONFIG.merchantName
    );

}


/* =========================================================
   START PAYMENT
========================================================= */

function startPayment() {

    if (
        !currentOrder
    ) {

        currentOrder =
            createOrder();

    }


    const amount =
        Number(
            currentOrder.total
        ).toFixed(2);


    const upiId =
        PAYMENT_CONFIG.upiId;


    /*
     * अगर UPI ID अभी change नहीं की है
     */

    if (
        !upiId ||
        upiId.includes(
            "YOUR-UPI-ID"
        )
    ) {

        showToast(
            "Please add your real UPI ID in PAYMENT_CONFIG"
        );

        return;

    }


    const upiUrl =
        "upi://pay?" +
        "pa=" +
        encodeURIComponent(
            upiId
        ) +
        "&pn=" +
        encodeURIComponent(
            PAYMENT_CONFIG.merchantName
        ) +
        "&am=" +
        encodeURIComponent(
            amount
        ) +
        "&cu=INR" +
        "&tn=" +
        encodeURIComponent(
            "Order " +
            currentOrder.orderId
        );


    /*
     * Mobile में UPI app open करने की कोशिश
     */

    window.location.href =
        upiUrl;

}


/* =========================================================
   PAYMENT DONE BUTTON
========================================================= */

function paymentCompleted() {

    if (
        !currentOrder
    ) {

        showToast(
            "Order not found"
        );

        return;

    }


    currentOrder.paymentStatus =
        "Payment Submitted";


    currentOrder.orderStatus =
        "Order Received";


    saveOrder(
        currentOrder
    );


    closePayment();


    showOrderConfirmation();

}


/* =========================================================
   PAYMENT NOT DONE
========================================================= */

function paymentNotCompleted() {

    showToast(
        "Please complete the UPI payment first"
    );

}


/* =========================================================
   SAVE ORDER
========================================================= */

function saveOrder(order) {

    try {

        const oldOrders =
            JSON.parse(
                localStorage.getItem(
                    "vishwash_orders"
                )
            ) || [];


        oldOrders.unshift(
            order
        );


        /*
         * सिर्फ latest 20 orders रखें
         */

        const orders =
            oldOrders.slice(
                0,
                20
            );


        localStorage.setItem(
            "vishwash_orders",
            JSON.stringify(
                orders
            )
        );

    } catch (error) {

        console.error(
            "Order save error:",
            error
        );

    }

}


/* =========================================================
   SHOW ORDER CONFIRMATION
========================================================= */

function showOrderConfirmation() {

    const overlay =
        document.getElementById(
            "orderSuccessOverlay"
        );


    if (!overlay) {

        showToast(
            "Order placed successfully 🎉"
        );

        return;

    }


    updateOrderSuccessDetails();


    overlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    /*
     * Cart clear
     */

    cart = [];


    saveCart();

    updateCartCount();

    updateCartSummary();


    renderCart();

}


/* =========================================================
   UPDATE SUCCESS DETAILS
========================================================= */

function updateOrderSuccessDetails() {

    if (
        !currentOrder
    )
        return;


    setText(
        "successOrderId",
        currentOrder.orderId
    );


    setText(
        "successCustomerName",
        currentOrder.customer.name
    );


    setText(
        "successOrderTotal",
        money(
            currentOrder.total
        )
    );


    setText(
        "successPaymentMethod",
        currentOrder.paymentMethod
    );

}


/* =========================================================
   CLOSE SUCCESS
========================================================= */

function closeOrderSuccess() {

    const overlay =
        document.getElementById(
            "orderSuccessOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    document.body.style.overflow =
        "";

}


/* =========================================================
   WHATSAPP ORDER MESSAGE
========================================================= */

function createWhatsAppOrderMessage() {

    if (
        !currentOrder
    ) {

        return "";

    }


    let message =
        "🛍️ *VISHWASH FOODS ORDER*%0A%0A";


    message +=
        "*Order ID:* " +
        currentOrder.orderId +
        "%0A";


    message +=
        "*Customer:* " +
        currentOrder.customer.name +
        "%0A";


    message +=
        "*Mobile:* " +
        currentOrder.customer.phone +
        "%0A%0A";


    message +=
        "*Products:*%0A";


    currentOrder.items.forEach(
        item => {

            message +=
                "• " +
                item.name +
                " x " +
                item.quantity +
                " = " +
                money(
                    item.total
                ) +
                "%0A";

        }
    );


    message +=
        "%0A*Subtotal:* " +
        money(
            currentOrder.subtotal
        );


    message +=
        "%0A*Delivery:* " +
        (
            currentOrder.delivery === 0
                ? "FREE"
                : money(
                    currentOrder.delivery
                )
        );


    message +=
        "%0A*Total:* " +
        money(
            currentOrder.total
        );


    message +=
        "%0A%0A*Address:*%0A" +
        currentOrder.customer.address +
        "%2C " +
        currentOrder.customer.city +
        "%2C " +
        currentOrder.customer.state +
        " - " +
        currentOrder.customer.pincode;


    return message;

}


/* =========================================================
   SEND ORDER TO WHATSAPP
========================================================= */

function sendOrderToWhatsApp() {

    if (
        !currentOrder
    ) {

        showToast(
            "Order information not found"
        );

        return;

    }


    /*
     * यहां अपना WhatsApp नंबर डालना।
     *
     * India example:
     * 919876543210
     */

    const businessNumber =
        "91XXXXXXXXXX";


    if (
        businessNumber.includes(
            "X"
        )
    ) {

        showToast(
            "Please add your WhatsApp business number"
        );

        return;

    }


    const message =
        createWhatsAppOrderMessage();


    const url =
        "https://wa.me/" +
        businessNumber +
        "?text=" +
        message;


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   COPY ORDER ID
========================================================= */

function copyOrderId() {

    if (
        !currentOrder
    )
        return;


    const id =
        currentOrder.orderId;


    if (
        navigator.clipboard
    ) {

        navigator.clipboard
            .writeText(id)
            .then(
                function() {

                    showToast(
                        "Order ID copied ✓"
                    );

                }
            )
            .catch(
                function() {

                    showToast(
                        "Copy failed"
                    );

                }
            );

    }

}


/* =========================================================
   GENERIC SET TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element)
        return;


    element.textContent =
        value ?? "";

}


/* =========================================================
   PAYMENT OVERLAY CLICK
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const overlay =
            document.getElementById(
                "paymentOverlay"
            );


        if (
            overlay &&
            event.target ===
            overlay
        ) {

            closePayment();

        }

    }
);


/* =========================================================
   SUCCESS OVERLAY CLICK
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const overlay =
            document.getElementById(
                "orderSuccessOverlay"
            );


        if (
            overlay &&
            event.target ===
            overlay
        ) {

            closeOrderSuccess();

        }

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        closePayment();

        closeOrderSuccess();

    }
);


/* =========================================================
   INITIALIZE PAYMENT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadCustomerDetails();

    }
);


/* =========================================================
   PART 8 COMPLETE
========================================================= */
   /* =========================================================
   VISHWASH FOODS - SCRIPT.JS
   PART 9
   ORDER HISTORY + CUSTOMER PROFILE
========================================================= */


/* =========================================================
   ORDER HISTORY
========================================================= */

function getOrderHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "vishwash_orders"
            )
        ) || [];

    } catch (error) {

        console.error(
            "Order history error:",
            error
        );

        return [];

    }

}


/* =========================================================
   OPEN ORDER HISTORY
========================================================= */

function openOrderHistory() {

    closeOtherPanels(
        "ordersOverlay"
    );


    renderOrderHistory();


    const overlay =
        document.getElementById(
            "ordersOverlay"
        );


    if (!overlay) {

        showToast(
            "Orders panel not found"
        );

        return;

    }


    overlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE ORDER HISTORY
========================================================= */

function closeOrderHistory(event) {

    if (
        event &&
        event.target &&
        event.target.id !==
        "ordersOverlay"
    ) {

        return;

    }


    const overlay =
        document.getElementById(
            "ordersOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    document.body.style.overflow =
        "";

}


/* =========================================================
   RENDER ORDER HISTORY
========================================================= */

function renderOrderHistory() {

    const container =
        document.getElementById(
            "ordersContent"
        );


    if (!container) return;


    const orders =
        getOrderHistory();


    if (
        orders.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-orders">

                <div
                    class="empty-orders-icon"
                >
                    📦
                </div>

                <h3>
                    No Orders Yet
                </h3>

                <p>
                    Your orders will appear here.
                </p>

                <button
                    type="button"
                    class="primary-btn"
                    onclick="
                        closeOrderHistory();
                        goToProducts();
                    "
                >
                    Start Shopping →
                </button>

            </div>

        `;

        return;

    }


    container.innerHTML =

        orders.map(
            order => {

                const date =
                    formatOrderDate(
                        order.date
                    );


                const statusClass =
                    getStatusClass(
                        order.orderStatus
                    );


                return `

                    <div
                        class="order-card"
                    >

                        <!-- HEADER -->

                        <div
                            class="order-card-header"
                        >

                            <div>

                                <span>
                                    Order ID
                                </span>

                                <strong>
                                    ${escapeHTML(
                                        order.orderId
                                    )}
                                </strong>

                            </div>


                            <span
                                class="order-status ${statusClass}"
                            >
                                ${escapeHTML(
                                    order.orderStatus ||
                                    "Pending"
                                )}
                            </span>

                        </div>


                        <!-- DATE -->

                        <div
                            class="order-date"
                        >
                            📅 ${date}
                        </div>


                        <!-- PRODUCTS -->

                        <div
                            class="order-products"
                        >

                            ${order.items
                                .map(
                                    item => `

                                        <div
                                            class="order-product-row"
                                        >

                                            <span>
                                                ${escapeHTML(
                                                    item.name
                                                )}
                                                ×
                                                ${item.quantity}
                                            </span>

                                            <strong>
                                                ${money(
                                                    item.total
                                                )}
                                            </strong>

                                        </div>

                                    `
                                )
                                .join("")
                            }

                        </div>


                        <!-- TOTAL -->

                        <div
                            class="order-total-row"
                        >

                            <span>
                                Total
                            </span>

                            <strong>
                                ${money(
                                    order.total
                                )}
                            </strong>

                        </div>


                        <!-- ACTIONS -->

                        <div
                            class="order-actions"
                        >

                            <button
                                type="button"
                                onclick="
                                    reorderItems(
                                        '${escapeAttribute(
                                            order.orderId
                                        )}'
                                    )
                                "
                            >
                                🔄 Re-order
                            </button>


                            <button
                                type="button"
                                onclick="
                                    viewOrderDetails(
                                        '${escapeAttribute(
                                            order.orderId
                                        )}'
                                    )
                                "
                            >
                                👁️ View Details
                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   FORMAT ORDER DATE
========================================================= */

function formatOrderDate(
    dateString
) {

    if (!dateString) {

        return "Date unavailable";

    }


    const date =
        new Date(
            dateString
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Date unavailable";

    }


    return date.toLocaleString(
        "en-IN",
        {

            day: "2-digit",

            month: "short",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit"

        }
    );

}


/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(
    status
) {

    status =
        String(
            status || ""
        ).toLowerCase();


    if (
        status.includes(
            "delivered"
        )
    ) {

        return "status-delivered";

    }


    if (
        status.includes(
            "cancel"
        )
    ) {

        return "status-cancelled";

    }


    if (
        status.includes(
            "received"
        )
    ) {

        return "status-received";

    }


    return "status-pending";

}


/* =========================================================
   FIND ORDER
========================================================= */

function findOrder(
    orderId
) {

    const orders =
        getOrderHistory();


    return orders.find(
        order =>
            String(
                order.orderId
            ) ===
            String(
                orderId
            )
    );

}


/* =========================================================
   VIEW ORDER DETAILS
========================================================= */

function viewOrderDetails(
    orderId
) {

    const order =
        findOrder(
            orderId
        );


    if (!order) {

        showToast(
            "Order not found"
        );

        return;

    }


    const items =
        order.items
            .map(
                item =>
                    `${item.name} × ${item.quantity}`
            )
            .join("\n");


    const message =

        "Order ID: " +
        order.orderId +

        "\n\nProducts:\n" +

        items +

        "\n\nTotal: " +
        money(
            order.total
        ) +

        "\n\nPayment: " +
        order.paymentMethod +

        "\nStatus: " +
        order.orderStatus;


    alert(
        message
    );

}


/* =========================================================
   RE-ORDER
========================================================= */

function reorderItems(
    orderId
) {

    const order =
        findOrder(
            orderId
        );


    if (!order) {

        showToast(
            "Order not found"
        );

        return;

    }


    let added =
        0;


    order.items.forEach(
        item => {

            const product =
                getProductById(
                    item.id
                );


            if (!product)
                return;


            addToCart(
                product.id,
                item.quantity
            );


            added++;

        }
    );


    if (
        added > 0
    ) {

        showToast(
            `${added} product(s) added to cart 🛒`
        );


        setTimeout(
            function() {

                openCart();

            },
            300
        );

    } else {

        showToast(
            "Products are currently unavailable"
        );

    }

}


/* =========================================================
   CUSTOMER PROFILE
========================================================= */

function openCustomerProfile() {

    closeOtherPanels(
        "profileOverlay"
    );


    loadCustomerDetails();


    fillProfileForm();


    const overlay =
        document.getElementById(
            "profileOverlay"
        );


    if (!overlay) {

        showToast(
            "Profile panel not found"
        );

        return;

    }


    overlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE PROFILE
========================================================= */

function closeCustomerProfile(
    event
) {

    if (
        event &&
        event.target &&
        event.target.id !==
        "profileOverlay"
    ) {

        return;

    }


    const overlay =
        document.getElementById(
            "profileOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    document.body.style.overflow =
        "";

}


/* =========================================================
   FILL PROFILE FORM
========================================================= */

function fillProfileForm() {

    setInputValue(
        "profileName",
        customerDetails.name
    );


    setInputValue(
        "profilePhone",
        customerDetails.phone
    );


    setInputValue(
        "profileEmail",
        customerDetails.email
    );


    setInputValue(
        "profileAddress",
        customerDetails.address
    );


    setInputValue(
        "profileCity",
        customerDetails.city
    );


    setInputValue(
        "profileState",
        customerDetails.state
    );


    setInputValue(
        "profilePincode",
        customerDetails.pincode
    );


    setInputValue(
        "profileLandmark",
        customerDetails.landmark
    );

}


/* =========================================================
   SAVE PROFILE
========================================================= */

function saveCustomerProfile() {

    const data = {

        name:
            getInputValue(
                "profileName"
            ),

        phone:
            getInputValue(
                "profilePhone"
            ),

        email:
            getInputValue(
                "profileEmail"
            ),

        address:
            getInputValue(
                "profileAddress"
            ),

        city:
            getInputValue(
                "profileCity"
            ),

        state:
            getInputValue(
                "profileState"
            ),

        pincode:
            getInputValue(
                "profilePincode"
            ),

        landmark:
            getInputValue(
                "profileLandmark"
            )

    };


    if (
        data.name.length < 2
    ) {

        showToast(
            "Enter your name"
        );

        return;

    }


    if (
        data.phone.replace(
            /\D/g,
            ""
        ).length !== 10
    ) {

        showToast(
            "Enter valid mobile number"
        );

        return;

    }


    if (
        data.pincode &&
        !/^[1-9][0-9]{5}$/.test(
            data.pincode
        )
    ) {

        showToast(
            "Enter valid pincode"
        );

        return;

    }


    customerDetails =
        data;


    saveCustomerDetails();


    showToast(
        "Profile saved successfully ✓"
    );


    setTimeout(
        function() {

            closeCustomerProfile();

        },
        500
    );

}


/* =========================================================
   DELETE SAVED CUSTOMER DATA
========================================================= */

function clearCustomerProfile() {

    const confirmDelete =
        window.confirm(
            "Delete your saved customer details?"
        );


    if (!confirmDelete)
        return;


    customerDetails = {

        name: "",

        phone: "",

        email: "",

        address: "",

        city: "",

        state: "",

        pincode: "",

        landmark: ""

    };


    localStorage.removeItem(
        "vishwash_customer"
    );


    fillProfileForm();


    showToast(
        "Saved details deleted"
    );

}


/* =========================================================
   ORDERS OVERLAY CLICK
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const overlay =
            document.getElementById(
                "ordersOverlay"
            );


        if (
            overlay &&
            event.target ===
            overlay
        ) {

            closeOrderHistory();

        }

    }
);


/* =========================================================
   PROFILE OVERLAY CLICK
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const overlay =
            document.getElementById(
                "profileOverlay"
            );


        if (
            overlay &&
            event.target ===
            overlay
        ) {

            closeCustomerProfile();

        }

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        closeOrderHistory();

        closeCustomerProfile();

    }
);


/* =========================================================
   INITIALIZE PART 9
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadCustomerDetails();

    }
);


/* =========================================================
   PART 9 COMPLETE
========================================================= */
   /* =========================================================
   VISHWASH FOODS - SCRIPT.JS
   PART 10 - FINAL
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

if (
    typeof STORAGE === "undefined"
) {

    window.STORAGE = {

        cart:
            "vishwash_cart",

        wishlist:
            "vishwash_wishlist",

        customer:
            "vishwash_customer",

        orders:
            "vishwash_orders"

    };

}


/* =========================================================
   CART INITIALIZATION
========================================================= */

if (
    typeof cart === "undefined"
) {

    try {

        window.cart =
            JSON.parse(
                localStorage.getItem(
                    STORAGE.cart
                )
            ) || [];

    } catch {

        window.cart = [];

    }

}


/* =========================================================
   WISHLIST INITIALIZATION
========================================================= */

if (
    typeof wishlist === "undefined"
) {

    try {

        window.wishlist =
            JSON.parse(
                localStorage.getItem(
                    STORAGE.wishlist
                )
            ) || [];

    } catch {

        window.wishlist = [];

    }

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    try {

        localStorage.setItem(
            STORAGE.cart,
            JSON.stringify(
                cart
            )
        );

    } catch (error) {

        console.error(
            "Cart save error:",
            error
        );

    }

}


/* =========================================================
   MONEY FORMAT
========================================================= */

function money(value) {

    value =
        Number(value) || 0;


    return new Intl.NumberFormat(
        "en-IN",
        {

            style: "currency",

            currency: "INR",

            maximumFractionDigits: 0

        }
    ).format(value);

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* =========================================================
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(value) {

    return String(
        value ?? ""
    )
    .replace(
        /'/g,
        "\\'"
    )
    .replace(
        /"/g,
        "&quot;"
    );

}


/* =========================================================
   TOAST NOTIFICATION
========================================================= */

function showToast(
    message,
    duration = 2500
) {

    let toast =
        document.getElementById(
            "vfToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "vfToast";

        toast.innerHTML = `
            <span class="vf-toast-icon">
                ✓
            </span>

            <span class="vf-toast-message">
            </span>
        `;


        toast.style.cssText = `
            position:fixed;
            left:50%;
            bottom:25px;
            transform:translate(-50%,120px);
            background:#111827;
            color:#fff;
            padding:13px 20px;
            border-radius:50px;
            display:flex;
            align-items:center;
            gap:10px;
            z-index:99999;
            font-size:14px;
            font-weight:600;
            box-shadow:0 10px 30px rgba(0,0,0,.20);
            opacity:0;
            transition:.3s ease;
            max-width:90%;
        `;


        document.body.appendChild(
            toast
        );

    }


    const text =
        toast.querySelector(
            ".vf-toast-message"
        );


    if (text) {

        text.textContent =
            message;

    }


    toast.style.opacity =
        "1";

    toast.style.transform =
        "translate(-50%,0)";


    clearTimeout(
        window.vfToastTimer
    );


    window.vfToastTimer =
        setTimeout(
            function() {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translate(-50%,120px)";

            },
            duration
        );

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(
    id,
    quantity = 1
) {

    const product =
        getProductById(id);


    if (!product) {

        showToast(
            "Product not found"
        );

        return;

    }


    quantity =
        Number(quantity) || 1;


    quantity =
        Math.max(
            1,
            Math.min(
                20,
                Math.floor(quantity)
            )
        );


    const existing =
        cart.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (existing) {

        existing.quantity +=
            quantity;


        if (
            existing.quantity > 20
        ) {

            existing.quantity = 20;

        }

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            category:
                product.category,

            price:
                Number(product.price),

            mrp:
                Number(product.mrp || product.price),

            image:
                product.image,

            quantity:
                quantity

        });

    }


    saveCart();

    updateCartCount();

    updateCartSummary();


    showToast(
        `${product.name} added to cart 🛒`
    );

}


/* =========================================================
   HEADER CART BUTTON
========================================================= */

function connectHeaderButtons() {

    document
        .querySelectorAll(
            "[data-action='cart'], .open-cart-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        openCart();

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-action='wishlist'], .open-wishlist-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        openWishlist();

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-action='orders'], .open-orders-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        openOrderHistory();

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-action='profile'], .open-profile-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        openCustomerProfile();

                    }
                );

            }
        );

}


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMobileMenu() {

    const menu =
        document.getElementById(
            "mobileMenu"
        );


    const button =
        document.getElementById(
            "mobileMenuButton"
        );


    if (!menu) return;


    menu.classList.toggle(
        "active"
    );


    if (button) {

        button.classList.toggle(
            "active"
        );

    }

}


/* =========================================================
   CLOSE MOBILE MENU
========================================================= */

function closeMobileMenu() {

    const menu =
        document.getElementById(
            "mobileMenu"
        );


    const button =
        document.getElementById(
            "mobileMenuButton"
        );


    if (menu) {

        menu.classList.remove(
            "active"
        );

    }


    if (button) {

        button.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   MOBILE MENU CONNECT
========================================================= */

function connectMobileMenu() {

    const button =
        document.getElementById(
            "mobileMenuButton"
        );


    if (button) {

        button.addEventListener(
            "click",
            toggleMobileMenu
        );

    }


    document
        .querySelectorAll(
            "#mobileMenu a"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    closeMobileMenu
                );

            }
        );

}


/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

function setupHeaderScroll() {

    const header =
        document.getElementById(
            "mainHeader"
        );


    if (!header) return;


    function updateHeader() {

        if (
            window.scrollY > 20
        ) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );


    updateHeader();

}


/* =========================================================
   BACK TO TOP
========================================================= */

function setupBackToTop() {

    let button =
        document.getElementById(
            "backToTop"
        );


    if (!button) {

        button =
            document.createElement(
                "button"
            );

        button.id =
            "backToTop";

        button.type =
            "button";

        button.innerHTML =
            "↑";

        button.setAttribute(
            "aria-label",
            "Back to top"
        );


        button.style.cssText = `
            position:fixed;
            right:20px;
            bottom:20px;
            width:45px;
            height:45px;
            border:0;
            border-radius:50%;
            background:#111827;
            color:#fff;
            font-size:22px;
            cursor:pointer;
            z-index:9990;
            opacity:0;
            visibility:hidden;
            transition:.3s ease;
        `;


        document.body.appendChild(
            button
        );

    }


    window.addEventListener(
        "scroll",
        function() {

            if (
                window.scrollY > 400
            ) {

                button.style.opacity =
                    "1";

                button.style.visibility =
                    "visible";

            } else {

                button.style.opacity =
                    "0";

                button.style.visibility =
                    "hidden";

            }

        },
        {
            passive: true
        }
    );


    button.addEventListener(
        "click",
        function() {

            window.scrollTo({

                top: 0,

                behavior:
                    "smooth"

            });

        }
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    document
        .querySelectorAll(
            "[data-scroll]"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();


                        const target =
                            document.getElementById(
                                this.dataset.scroll
                            );


                        if (!target)
                            return;


                        target.scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "start"

                        });


                        closeMobileMenu();

                    }
                );

            }
        );

}


/* =========================================================
   IMAGE LAZY LOADING
========================================================= */

function setupLazyImages() {

    document
        .querySelectorAll(
            "img"
        )
        .forEach(
            image => {

                image.loading =
                    "lazy";

                image.decoding =
                    "async";

            }
        );

}


/* =========================================================
   BUTTON LOADING
========================================================= */

function setButtonLoading(
    button,
    loading
) {

    if (!button)
        return;


    if (loading) {

        button.dataset.oldText =
            button.innerHTML;

        button.innerHTML =
            "⏳ Please wait...";

        button.disabled =
            true;

    } else {

        button.innerHTML =
            button.dataset.oldText ||
            "Continue";

        button.disabled =
            false;

    }

}


/* =========================================================
   CLOSE ALL SLIDES
========================================================= */

function closeAllSlides() {

    document
        .querySelectorAll(
            ".overlay.active, .slide.active, .drawer.active"
        )
        .forEach(
            panel => {

                panel.classList.remove(
                    "active"
                );

            }
        );


    document.body.style.overflow =
        "";

}


/* =========================================================
   GLOBAL OVERLAY CLOSE
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const target =
            event.target;


        if (
            !target.classList.contains(
                "overlay-close"
            )
        ) {

            return;

        }


        const panel =
            target.closest(
                ".overlay"
            );


        if (panel) {

            panel.classList.remove(
                "active"
            );

            document.body.style.overflow =
                "";

        }

    }
);


/* =========================================================
   CHECKOUT → PAYMENT
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "#placeOrderButton, .place-order-btn"
            );


        if (!button)
            return;


        event.preventDefault();


        placeOrder();


    }
);


/* =========================================================
   CART → CHECKOUT
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "#cartCheckoutButton"
            );


        if (!button)
            return;


        event.preventDefault();


        checkoutFromCart();

    }
);


/* =========================================================
   PAYMENT BUTTON
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".pay-now-btn"
            );


        if (!button)
            return;


        event.preventDefault();


        startPayment();

    }
);


/* =========================================================
   PAYMENT COMPLETED
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".payment-completed-btn"
            );


        if (!button)
            return;


        event.preventDefault();


        paymentCompleted();

    }
);


/* =========================================================
   WHATSAPP BUTTON
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".whatsapp-order-btn"
            );


        if (!button)
            return;


        event.preventDefault();


        sendOrderToWhatsApp();

    }
);


/* =========================================================
   CLOSE BUTTONS
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-close]"
            );


        if (!button)
            return;


        const id =
            button.dataset.close;


        const panel =
            document.getElementById(
                id
            );


        if (panel) {

            panel.classList.remove(
                "active"
            );

            document.body.style.overflow =
                "";

        }

    }
);


/* =========================================================
   DOUBLE CLICK PROTECTION
========================================================= */

function preventDoubleClick() {

    document
        .querySelectorAll(
            ".buy-btn, .detail-buy-btn, .place-order-btn, .pay-now-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        if (
                            this.dataset.clicked ===
                            "true"
                        ) {

                            return;

                        }


                        this.dataset.clicked =
                            "true";


                        setTimeout(
                            () => {

                                this.dataset.clicked =
                                    "false";

                            },
                            1200
                        );

                    }
                );

            }
        );

}


/* =========================================================
   CONNECTION CHECK
========================================================= */

function websiteReadyCheck() {

    const checks = {

        products:
            typeof products !==
            "
                     
