/* =====================================================
   VISHWASH FOODS
   Professional E-Commerce Website
   Founder: NIKHIL VAISHNAV
   Mobile: 8460183525
   SCRIPT.JS — PART 1/10
===================================================== */

"use strict";


/* =====================================================
   COMPANY INFORMATION
===================================================== */

const COMPANY = {

    name: "VISHWASH FOODS",

    founder: "NIKHIL VAISHNAV",

    mobile: "8460183525",

    whatsapp: "918460183525",

    brand: "VISHWASH FOODS"

};



/* =====================================================
   WEBSITE STATE
===================================================== */

const AppState = {

    cart: [],

    wishlist: [],

    currentProduct: null,

    currentQuantity: 1,

    currentSlide: 0,

    searchResults: [],

    searchText: "",

    promoDiscount: 0,

    shipping: 0,

    isCartOpen: false,

    isWishlistOpen: false,

    isBuyNowOpen: false,

    isSearchOpen: false

};



/* =====================================================
   LOCAL STORAGE KEYS
===================================================== */

const STORAGE_KEYS = {

    cart: "vishwash_foods_cart",

    wishlist: "vishwash_foods_wishlist",

    promo: "vishwash_foods_promo",

    cookie: "vishwash_foods_cookie"

};



/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeWebsite();

    }
);



/* =====================================================
   INITIALIZE WEBSITE
===================================================== */

function initializeWebsite() {

    loadSavedData();

    setupGlobalEvents();

    updateCartUI();

    updateWishlistUI();

    updateCartCount();

    updateWishlistCount();

    setupMobileMenu();

    setupSearch();

    setupHeroSlider();

    setupScrollEffects();

    setupBackToTop();

    setupAnnouncement();

    setupCookieNotice();

    setupNewsletter();

    setupContactForm();

    setupProductButtons();

    setupDrawerEvents();

    console.log(
        COMPANY.name +
        " website initialized successfully."
    );

}



/* =====================================================
   LOAD SAVED DATA
===================================================== */

function loadSavedData() {

    try {

        const savedCart =
            localStorage.getItem(
                STORAGE_KEYS.cart
            );

        const savedWishlist =
            localStorage.getItem(
                STORAGE_KEYS.wishlist
            );

        const savedPromo =
            localStorage.getItem(
                STORAGE_KEYS.promo
            );


        if (savedCart) {

            AppState.cart =
                JSON.parse(savedCart);

        }


        if (savedWishlist) {

            AppState.wishlist =
                JSON.parse(savedWishlist);

        }


        if (savedPromo) {

            AppState.promoDiscount =
                Number(savedPromo) || 0;

        }

    }

    catch (error) {

        console.warn(
            "Saved data could not be loaded.",
            error
        );

        AppState.cart = [];

        AppState.wishlist = [];

    }

}



/* =====================================================
   SAVE CART
===================================================== */

function saveCart() {

    localStorage.setItem(

        STORAGE_KEYS.cart,

        JSON.stringify(
            AppState.cart
        )

    );

}



/* =====================================================
   SAVE WISHLIST
===================================================== */

function saveWishlist() {

    localStorage.setItem(

        STORAGE_KEYS.wishlist,

        JSON.stringify(
            AppState.wishlist
        )

    );

}



/* =====================================================
   GLOBAL EVENTS
===================================================== */

function setupGlobalEvents() {

    document.addEventListener(
        "click",
        function (event) {

            const target =
                event.target.closest(
                    "[data-action]"
                );


            if (!target) {

                return;

            }


            const action =
                target.dataset.action;


            switch (action) {

                case "open-cart":

                    openCart();

                    break;


                case "close-cart":

                    closeCart();

                    break;


                case "open-wishlist":

                    openWishlist();

                    break;


                case "close-wishlist":

                    closeWishlist();

                    break;


                case "open-buy":

                    openBuyNow();

                    break;


                case "close-buy":

                    closeBuyNow();

                    break;


                case "open-search":

                    openSearch();

                    break;


                case "close-search":

                    closeSearch();

                    break;


                case "back-top":

                    window.scrollTo({

                        top: 0,

                        behavior: "smooth"

                    });

                    break;

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeCart();

                closeWishlist();

                closeBuyNow();

                closeSearch();

                closeQuickView();

            }

        }
    );

}



/* =====================================================
   MOBILE MENU
===================================================== */

function setupMobileMenu() {

    const menuToggle =
        document.querySelector(
            ".menu-toggle"
        );

    const mobileMenu =
        document.querySelector(
            ".mobile-menu"
        );


    if (!menuToggle || !mobileMenu) {

        return;

    }


    menuToggle.addEventListener(
        "click",
        function () {

            mobileMenu.classList.toggle(
                "active"
            );

            menuToggle.classList.toggle(
                "active"
            );

        }
    );


    const menuLinks =
        mobileMenu.querySelectorAll(
            "a"
        );


    menuLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    mobileMenu.classList.remove(
                        "active"
                    );

                    menuToggle.classList.remove(
                        "active"
                    );

                }
            );

        }
    );

}



/* =====================================================
   SEARCH SETUP
===================================================== */

function setupSearch() {

    const input =
        document.querySelector(
            ".search-input"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "input",
        function () {

            AppState.searchText =
                this.value.trim()
                    .toLowerCase();

            performSearch(
                AppState.searchText
            );

        }
    );

}



/* =====================================================
   OPEN SEARCH
===================================================== */

function openSearch() {

    const overlay =
        document.querySelector(
            ".search-overlay"
        );


    if (!overlay) {

        return;

    }


    overlay.classList.add(
        "active"
    );

    AppState.isSearchOpen = true;


    const input =
        overlay.querySelector(
            ".search-input"
        );


    if (input) {

        setTimeout(
            function () {

                input.focus();

            },
            200
        );

    }

}



/* =====================================================
   CLOSE SEARCH
===================================================== */

function closeSearch() {

    const overlay =
        document.querySelector(
            ".search-overlay"
        );


    if (!overlay) {

        return;

    }


    overlay.classList.remove(
        "active"
    );

    AppState.isSearchOpen = false;

}



/* =====================================================
   SEARCH PRODUCT
===================================================== */

function performSearch(
    searchText
) {

    const results =
        document.querySelector(
            ".search-results"
        );


    if (!results) {

        return;

    }


    if (!searchText) {

        results.innerHTML = "";

        return;

    }


    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    const matches = [];


    productCards.forEach(
        function (card) {

            const nameElement =
                card.querySelector(
                    "h3"
                );


            if (!nameElement) {

                return;

            }


            const name =
                nameElement.textContent
                    .trim();


            if (
                name
                    .toLowerCase()
                    .includes(searchText)
            ) {

                matches.push({

                    name: name,

                    image:
                        card.querySelector(
                            "img"
                        )?.src || "",

                    card: card

                });

            }

        }
    );


    AppState.searchResults =
        matches;


    renderSearchResults(
        matches
    );

}



/* =====================================================
   PART 1 END
===================================================== */
/* =====================================================
   VISHWASH FOODS
   SCRIPT.JS — PART 2/10
===================================================== */


/* =====================================================
   SEARCH RESULTS
===================================================== */

function renderSearchResults(matches) {

    const results =
        document.querySelector(".search-results");

    if (!results) {
        return;
    }


    if (!matches.length) {

        results.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-search"></i>
                </div>

                <h3>Product Not Found</h3>

                <p>
                    Sorry, "${escapeHTML(AppState.searchText)}"
                    ke liye koi product nahi mila.
                </p>
            </div>
        `;

        return;
    }


    results.innerHTML = matches.map(function(product) {

        return `
            <div class="search-result-item">

                <div class="search-result-image">
                    <img
                        src="${product.image}"
                        alt="${escapeHTML(product.name)}"
                    >
                </div>

                <div class="search-result-info">
                    <h4>
                        ${escapeHTML(product.name)}
                    </h4>

                    <span>
                        Product available
                    </span>
                </div>

                <button
                    type="button"
                    class="search-result-button"
                    onclick="scrollToProduct(this)"
                >
                    <i class="fas fa-arrow-right"></i>
                </button>

            </div>
        `;

    }).join("");

}



/* =====================================================
   SCROLL TO PRODUCT
===================================================== */

function scrollToProduct(button) {

    const item =
        button.closest(
            ".search-result-item"
        );

    if (!item) {
        return;
    }


    const name =
        item.querySelector(
            ".search-result-info h4"
        )?.textContent.trim();


    if (!name) {
        return;
    }


    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    let found = false;


    cards.forEach(function(card) {

        const title =
            card.querySelector("h3");


        if (
            title &&
            title.textContent.trim()
                .toLowerCase() ===
            name.toLowerCase()
        ) {

            card.scrollIntoView({

                behavior: "smooth",

                block: "center"

            });


            card.classList.add(
                "search-highlight"
            );


            setTimeout(function() {

                card.classList.remove(
                    "search-highlight"
                );

            }, 2000);


            found = true;

        }

    });


    if (found) {
        closeSearch();
    }

}



/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(product) {

    if (!product) {
        return;
    }


    const existing =
        AppState.cart.find(function(item) {

            return String(item.id) ===
                String(product.id);

        });


    if (existing) {

        existing.quantity +=
            product.quantity || 1;

    }

    else {

        AppState.cart.push({

            id: product.id,

            name: product.name,

            price: Number(product.price) || 0,

            image: product.image || "",

            quantity:
                product.quantity || 1

        });

    }


    saveCart();

    updateCartUI();

    updateCartCount();

    showToast(
        product.name +
        " cart mein add ho gaya ❤️"
    );

}



/* =====================================================
   REMOVE FROM CART
===================================================== */

function removeFromCart(productId) {

    AppState.cart =
        AppState.cart.filter(function(item) {

            return String(item.id) !==
                String(productId);

        });


    saveCart();

    updateCartUI();

    updateCartCount();

}



/* =====================================================
   CHANGE CART QUANTITY
===================================================== */

function changeCartQuantity(
    productId,
    change
) {

    const item =
        AppState.cart.find(function(product) {

            return String(product.id) ===
                String(productId);

        });


    if (!item) {
        return;
    }


    item.quantity +=
        Number(change);


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }


    if (item.quantity > 99) {

        item.quantity = 99;

    }


    saveCart();

    updateCartUI();

    updateCartCount();

}



/* =====================================================
   CART TOTAL
===================================================== */

function getCartSubtotal() {

    return AppState.cart.reduce(
        function(total, item) {

            return total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                );

        },
        0
    );

}



function getDiscountAmount() {

    const subtotal =
        getCartSubtotal();


    if (
        !AppState.promoDiscount ||
        AppState.promoDiscount <= 0
    ) {

        return 0;

    }


    return Math.min(
        subtotal,
        AppState.promoDiscount
    );

}



function getShippingAmount() {

    const subtotal =
        getCartSubtotal();


    if (subtotal <= 0) {
        return 0;
    }


    /*
       Free shipping above ₹499
    */

    if (subtotal >= 499) {
        return 0;
    }


    return 40;

}



function getCartGrandTotal() {

    const subtotal =
        getCartSubtotal();


    const discount =
        getDiscountAmount();


    const shipping =
        getShippingAmount();


    return Math.max(
        0,
        subtotal -
        discount +
        shipping
    );

}



/* =====================================================
   UPDATE CART COUNT
===================================================== */

function updateCartCount() {

    const count =
        AppState.cart.reduce(
            function(total, item) {

                return total +
                    Number(item.quantity);

            },
            0
        );


    const counters =
        document.querySelectorAll(
            ".cart-count, [data-cart-count]"
        );


    counters.forEach(function(counter) {

        counter.textContent =
            count;


        if (count > 0) {

            counter.classList.add(
                "has-items"
            );

        }

        else {

            counter.classList.remove(
                "has-items"
            );

        }

    });

}



/* =====================================================
   UPDATE CART UI
===================================================== */

function updateCartUI() {

    const containers =
        document.querySelectorAll(
            ".cart-items, #cartItems"
        );


    containers.forEach(function(container) {

        if (!AppState.cart.length) {

            container.innerHTML = `
                <div class="empty-state">

                    <div class="empty-state-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>

                    <h3>Your Cart is Empty</h3>

                    <p>
                        Apne favourite VISHWASH FOODS
                        products cart mein add karein.
                    </p>

                    <button
                        type="button"
                        class="empty-state-button"
                        onclick="closeCart()"
                    >
                        Continue Shopping
                    </button>

                </div>
            `;

            return;

        }


        container.innerHTML =
            AppState.cart.map(function(item) {

                return `
                    <div
                        class="cart-item"
                        data-cart-id="${escapeHTML(String(item.id))}"
                    >

                        <div class="cart-item-image">

                            <img
                                src="${item.image}"
                                alt="${escapeHTML(item.name)}"
                            >

                        </div>


                        <div class="cart-item-info">

                            <h4>
                                ${escapeHTML(item.name)}
                            </h4>

                            <div class="cart-item-price">
                                ₹${formatMoney(item.price)}
                            </div>


                            <div class="cart-item-actions">

                                <div class="quantity-control">

                                    <button
                                        type="button"
                                        onclick="changeCartQuantity(
                                            '${escapeJS(String(item.id))}',
                                            -1
                                        )"
                                    >
                                        −
                                    </button>

                                    <span>
                                        ${item.quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onclick="changeCartQuantity(
                                            '${escapeJS(String(item.id))}',
                                            1
                                        )"
                                    >
                                        +
                                    </button>

                                </div>


                                <button
                                    type="button"
                                    class="cart-remove"
                                    onclick="removeFromCart(
                                        '${escapeJS(String(item.id))}'
                                    )"
                                >
                                    <i class="fas fa-trash"></i>
                                    Remove
                                </button>

                            </div>

                        </div>

                    </div>
                `;

            }).join("");

    });


    updateCartSummary();

}



/* =====================================================
   CART SUMMARY
===================================================== */

function updateCartSummary() {

    const subtotal =
        getCartSubtotal();


    const discount =
        getDiscountAmount();


    const shipping =
        getShippingAmount();


    const grandTotal =
        getCartGrandTotal();


    setText(
        ".cart-subtotal",
        "₹" + formatMoney(subtotal)
    );


    setText(
        ".cart-discount",
        "-₹" + formatMoney(discount)
    );


    setText(
        ".cart-shipping",
        shipping === 0
            ? "FREE"
            : "₹" + formatMoney(shipping)
    );


    setText(
        ".cart-total-price",
        "₹" + formatMoney(grandTotal)
    );


    setText(
        "[data-cart-total]",
        "₹" + formatMoney(grandTotal)
    );


    setText(
        ".sticky-cart-total",
        "₹" + formatMoney(grandTotal)
    );

}



/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    const drawer =
        document.querySelector(
            ".cart-drawer"
        );


    if (!drawer) {
        return;
    }


    drawer.classList.add(
        "active"
    );


    document.body.classList.add(
        "drawer-open"
    );


    AppState.isCartOpen = true;

}



/* =====================================================
   CLOSE CART
===================================================== */

function closeCart() {

    const drawer =
        document.querySelector(
            ".cart-drawer"
        );


    if (!drawer) {
        return;
    }


    drawer.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "drawer-open"
    );


    AppState.isCartOpen = false;

}



/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}



/* =====================================================
   ESCAPE JAVASCRIPT
===================================================== */

function escapeJS(value) {

    return String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'")
        .replaceAll('"', '\\"')
        .replaceAll("\n", "\\n")
        .replaceAll("\r", "\\r");

}



/* =====================================================
   FORMAT MONEY
===================================================== */

function formatMoney(value) {

    const number =
        Number(value) || 0;


    return number.toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

}



/* =====================================================
   SET TEXT
===================================================== */

function setText(
    selector,
    value
) {

    document
        .querySelectorAll(selector)
        .forEach(function(element) {

            element.textContent =
                value;

        });

}



/* =====================================================
   PART 2 END
===================================================== */
/* =====================================================
   VISHWASH FOODS
   SCRIPT.JS — PART 3/10
===================================================== */


/* =====================================================
   WISHLIST COUNT
===================================================== */

function updateWishlistCount() {

    const count =
        AppState.wishlist.length;

    const counters =
        document.querySelectorAll(
            ".wishlist-count, [data-wishlist-count]"
        );

    counters.forEach(function(counter) {

        counter.textContent = count;

        if (count > 0) {

            counter.classList.add(
                "has-items"
            );

        } else {

            counter.classList.remove(
                "has-items"
            );

        }

    });

}



/* =====================================================
   ADD TO WISHLIST
===================================================== */

function addToWishlist(product) {

    if (!product) {
        return;
    }


    const exists =
        AppState.wishlist.some(function(item) {

            return String(item.id) ===
                String(product.id);

        });


    if (exists) {

        showToast(
            "Ye product wishlist mein already hai ❤️"
        );

        return;

    }


    AppState.wishlist.push({

        id: product.id,

        name: product.name,

        price: Number(product.price) || 0,

        image: product.image || ""

    });


    saveWishlist();

    updateWishlistUI();

    updateWishlistCount();

    updateWishlistButtons();

    showToast(
        product.name +
        " wishlist mein add ho gaya ❤️"
    );

}



/* =====================================================
   REMOVE FROM WISHLIST
===================================================== */

function removeFromWishlist(productId) {

    AppState.wishlist =
        AppState.wishlist.filter(
            function(item) {

                return String(item.id) !==
                    String(productId);

            }
        );


    saveWishlist();

    updateWishlistUI();

    updateWishlistCount();

    updateWishlistButtons();

}



/* =====================================================
   CHECK WISHLIST
===================================================== */

function isInWishlist(productId) {

    return AppState.wishlist.some(
        function(item) {

            return String(item.id) ===
                String(productId);

        }
    );

}



/* =====================================================
   UPDATE WISHLIST BUTTONS
===================================================== */

function updateWishlistButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-wishlist-id]"
        );


    buttons.forEach(function(button) {

        const id =
            button.dataset.wishlistId;


        if (
            isInWishlist(id)
        ) {

            button.classList.add(
                "active"
            );

            button.setAttribute(
                "aria-label",
                "Remove from wishlist"
            );


            const icon =
                button.querySelector("i");


            if (icon) {

                icon.classList.remove(
                    "far"
                );

                icon.classList.add(
                    "fas"
                );

            }

        } else {

            button.classList.remove(
                "active"
            );

            button.setAttribute(
                "aria-label",
                "Add to wishlist"
            );


            const icon =
                button.querySelector("i");


            if (icon) {

                icon.classList.remove(
                    "fas"
                );

                icon.classList.add(
                    "far"
                );

            }

        }

    });

}



/* =====================================================
   UPDATE WISHLIST UI
===================================================== */

function updateWishlistUI() {

    const containers =
        document.querySelectorAll(
            ".wishlist-items, #wishlistItems"
        );


    containers.forEach(function(container) {

        if (!AppState.wishlist.length) {

            container.innerHTML = `

                <div class="empty-state">

                    <div class="empty-state-icon">

                        <i class="far fa-heart"></i>

                    </div>

                    <h3>
                        Your Wishlist is Empty
                    </h3>

                    <p>
                        Apne favourite products ko
                        wishlist mein save karein.
                    </p>

                    <button
                        type="button"
                        class="empty-state-button"
                        onclick="closeWishlist()"
                    >
                        Continue Shopping
                    </button>

                </div>

            `;

            return;

        }


        container.innerHTML =
            AppState.wishlist.map(
                function(item) {

                    return `

                        <div
                            class="wishlist-item"
                            data-wishlist-item-id="${escapeHTML(
                                String(item.id)
                            )}"
                        >

                            <div
                                class="wishlist-item-image"
                            >

                                <img
                                    src="${item.image}"
                                    alt="${escapeHTML(
                                        item.name
                                    )}"
                                >

                            </div>


                            <div
                                class="wishlist-item-info"
                            >

                                <h4>
                                    ${escapeHTML(
                                        item.name
                                    )}
                                </h4>

                                <strong>
                                    ₹${formatMoney(
                                        item.price
                                    )}
                                </strong>

                            </div>


                            <div
                                class="wishlist-actions"
                            >

                                <button
                                    type="button"
                                    class="wishlist-cart-button"
                                    title="Add to Cart"
                                    onclick="wishlistToCart(
                                        '${escapeJS(
                                            String(item.id)
                                        )}'
                                    )"
                                >

                                    <i
                                        class="fas fa-shopping-cart"
                                    ></i>

                                </button>


                                <button
                                    type="button"
                                    class="wishlist-remove-button"
                                    title="Remove"
                                    onclick="removeFromWishlist(
                                        '${escapeJS(
                                            String(item.id)
                                        )}'
                                    )"
                                >

                                    <i
                                        class="fas fa-trash"
                                    ></i>

                                </button>

                            </div>

                        </div>

                    `;

                }
            ).join("");

    });


    updateWishlistButtons();

}



/* =====================================================
   WISHLIST TO CART
===================================================== */

function wishlistToCart(productId) {

    const product =
        AppState.wishlist.find(
            function(item) {

                return String(item.id) ===
                    String(productId);

            }
        );


    if (!product) {
        return;
    }


    addToCart({

        id: product.id,

        name: product.name,

        price: product.price,

        image: product.image,

        quantity: 1

    });


    showToast(
        product.name +
        " cart mein add ho gaya."
    );

}



/* =====================================================
   OPEN WISHLIST
===================================================== */

function openWishlist() {

    const drawer =
        document.querySelector(
            ".wishlist-drawer"
        );


    if (!drawer) {
        return;
    }


    drawer.classList.add(
        "active"
    );


    document.body.classList.add(
        "drawer-open"
    );


    AppState.isWishlistOpen =
        true;

}



/* =====================================================
   CLOSE WISHLIST
===================================================== */

function closeWishlist() {

    const drawer =
        document.querySelector(
            ".wishlist-drawer"
        );


    if (!drawer) {
        return;
    }


    drawer.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "drawer-open"
    );


    AppState.isWishlistOpen =
        false;

}



/* =====================================================
   BUY NOW
===================================================== */

function openBuyNow(product) {

    if (product) {

        AppState.currentProduct =
            product;

        AppState.currentQuantity =
            1;

    }


    const drawer =
        document.querySelector(
            ".buy-now-drawer"
        );


    if (!drawer) {

        /*
          Agar Buy Now drawer HTML mein nahi hai,
          to pehle product ko cart mein add karke
          checkout open kar sakte hain.
        */

        if (
            AppState.currentProduct
        ) {

            addToCart({

                id:
                    AppState.currentProduct.id,

                name:
                    AppState.currentProduct.name,

                price:
                    AppState.currentProduct.price,

                image:
                    AppState.currentProduct.image,

                quantity:
                    AppState.currentQuantity

            });

            openCart();

        }

        return;

    }


    renderBuyNow();


    drawer.classList.add(
        "active"
    );


    document.body.classList.add(
        "drawer-open"
    );


    AppState.isBuyNowOpen =
        true;

}



/* =====================================================
   CLOSE BUY NOW
===================================================== */

function closeBuyNow() {

    const drawer =
        document.querySelector(
            ".buy-now-drawer"
        );


    if (!drawer) {
        return;
    }


    drawer.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "drawer-open"
    );


    AppState.isBuyNowOpen =
        false;

}



/* =====================================================
   RENDER BUY NOW
===================================================== */

function renderBuyNow() {

    const product =
        AppState.currentProduct;


    if (!product) {
        return;
    }


    const drawer =
        document.querySelector(
            ".buy-now-drawer"
        );


    if (!drawer) {
        return;
    }


    const image =
        drawer.querySelector(
            ".buy-now-image img"
        );


    const name =
        drawer.querySelector(
            ".buy-now-product-name"
        );


    const price =
        drawer.querySelector(
            ".buy-now-product-price"
        );


    const quantity =
        drawer.querySelector(
            ".buy-now-quantity"
        );


    const total =
        drawer.querySelector(
            ".buy-now-total"
        );


    if (image) {

        image.src =
            product.image || "";

        image.alt =
            product.name || "";

    }


    if (name) {

        name.textContent =
            product.name || "";

    }


    if (price) {

        price.textContent =
            "₹" +
            formatMoney(
                product.price
            );

    }


    if (quantity) {

        quantity.textContent =
            AppState.currentQuantity;

    }


    if (total) {

        total.textContent =
            "₹" +
            formatMoney(
                Number(product.price) *
                AppState.currentQuantity
            );

    }

}



/* =====================================================
   BUY NOW QUANTITY
===================================================== */

function changeBuyNowQuantity(
    change
) {

    if (
        !AppState.currentProduct
    ) {

        return;

    }


    AppState.currentQuantity +=
        Number(change);


    if (
        AppState.currentQuantity < 1
    ) {

        AppState.currentQuantity = 1;

    }


    if (
        AppState.currentQuantity > 99
    ) {

        AppState.currentQuantity = 99;

    }


    renderBuyNow();

}



/* =====================================================
   CONFIRM BUY NOW
===================================================== */

function confirmBuyNow() {

    const product =
        AppState.currentProduct;


    if (!product) {

        showToast(
            "Please product select karein."
        );

        return;

    }


    addToCart({

        id:
            product.id,

        name:
            product.name,

        price:
            product.price,

        image:
            product.image,

        quantity:
            AppState.currentQuantity

    });


    closeBuyNow();

    openCart();

}



/* =====================================================
   PART 3 END
===================================================== */
/* =====================================================
   VISHWASH FOODS
   SCRIPT.JS — PART 4/10
===================================================== */


/* =====================================================
   PRODUCT BUTTONS SETUP
===================================================== */

function setupProductButtons() {

    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    productCards.forEach(
        function(card, index) {

            /*
             * Product information automatically
             * HTML card se read hogi.
             */

            const product =
                getProductFromCard(
                    card,
                    index
                );


            /*
             * Add To Cart buttons
             */

            const cartButtons =
                card.querySelectorAll(
                    ".add-to-cart, [data-action='add-cart']"
                );


            cartButtons.forEach(
                function(button) {

                    button.addEventListener(
                        "click",
                        function(event) {

                            event.preventDefault();

                            addToCart({

                                ...product,

                                quantity: 1

                            });

                        }
                    );

                }
            );


            /*
             * Wishlist buttons
             */

            const wishlistButtons =
                card.querySelectorAll(
                    ".wishlist-button, [data-wishlist]"
                );


            wishlistButtons.forEach(
                function(button) {

                    button.dataset.wishlistId =
                        product.id;


                    button.addEventListener(
                        "click",
                        function(event) {

                            event.preventDefault();

                            toggleWishlist(
                                product
                            );

                        }
                    );

                }
            );


            /*
             * Buy Now buttons
             */

            const buyButtons =
                card.querySelectorAll(
                    ".buy-now, [data-buy-now]"
                );


            buyButtons.forEach(
                function(button) {

                    button.addEventListener(
                        "click",
                        function(event) {

                            event.preventDefault();

                            openBuyNow(
                                product
                            );

                        }
                    );

                }
            );


            /*
             * Quick View buttons
             */

            const quickButtons =
                card.querySelectorAll(
                    ".quick-view-button, [data-quick-view]"
                );


            quickButtons.forEach(
                function(button) {

                    button.addEventListener(
                        "click",
                        function(event) {

                            event.preventDefault();

                            openQuickView(
                                product
                            );

                        }
                    );

                }
            );

        }
    );


    updateWishlistButtons();

}



/* =====================================================
   GET PRODUCT FROM CARD
===================================================== */

function getProductFromCard(
    card,
    index
) {

    const id =
        card.dataset.productId ||
        card.dataset.id ||
        "product-" + (index + 1);


    const nameElement =
        card.querySelector(
            ".product-name, h3, h2"
        );


    const priceElement =
        card.querySelector(
            ".product-price, .price-current, [data-price]"
        );


    const imageElement =
        card.querySelector(
            ".product-image img, img"
        );


    const categoryElement =
        card.querySelector(
            ".product-category, [data-category]"
        );


    let price = 0;


    if (priceElement) {

        const rawPrice =
            priceElement.textContent
                .replace(/[^\d.]/g, "");


        price =
            parseFloat(rawPrice) || 0;

    }


    return {

        id: id,

        name:
            nameElement
                ? nameElement.textContent.trim()
                : "VISHWASH FOODS Product",

        price: price,

        image:
            imageElement
                ? imageElement.src
                : "",

        category:
            categoryElement
                ? categoryElement.textContent.trim()
                : "Namkeen"

    };

}



/* =====================================================
   TOGGLE WISHLIST
===================================================== */

function toggleWishlist(
    product
) {

    if (!product) {
        return;
    }


    if (
        isInWishlist(product.id)
    ) {

        removeFromWishlist(
            product.id
        );


        showToast(
            product.name +
            " wishlist se remove ho gaya."
        );

    }

    else {

        addToWishlist(
            product
        );

    }

}



/* =====================================================
   QUICK VIEW
===================================================== */

function openQuickView(
    product
) {

    if (!product) {
        return;
    }


    AppState.currentProduct =
        product;


    const modal =
        document.querySelector(
            ".quick-view-modal"
        );


    if (!modal) {

        /*
         * Agar quick-view HTML mein nahi hai,
         * Buy Now open hoga.
         */

        openBuyNow(product);

        return;

    }


    const image =
        modal.querySelector(
            ".quick-view-image img"
        );


    const category =
        modal.querySelector(
            ".quick-view-category"
        );


    const title =
        modal.querySelector(
            ".quick-view-info h2"
        );


    const description =
        modal.querySelector(
            ".quick-view-description"
        );


    const price =
        modal.querySelector(
            ".quick-view-price"
        );


    const wishlistButton =
        modal.querySelector(
            ".quick-view-wishlist"
        );


    if (image) {

        image.src =
            product.image || "";

        image.alt =
            product.name || "";

    }


    if (category) {

        category.textContent =
            product.category ||
            "VISHWASH FOODS";

    }


    if (title) {

        title.textContent =
            product.name || "";

    }


    if (description) {

        description.textContent =
            "Premium quality VISHWASH FOODS " +
            "namkeen, carefully prepared for " +
            "great taste and freshness.";

    }


    if (price) {

        price.textContent =
            "₹" +
            formatMoney(
                product.price
            );

    }


    if (wishlistButton) {

        wishlistButton.dataset.wishlistId =
            product.id;


        if (
            isInWishlist(product.id)
        ) {

            wishlistButton.classList.add(
                "active"
            );

        }

        else {

            wishlistButton.classList.remove(
                "active"
            );

        }

    }


    modal.classList.add(
        "active"
    );


    document.body.classList.add(
        "modal-open"
    );

}



/* =====================================================
   CLOSE QUICK VIEW
===================================================== */

function closeQuickView() {

    const modal =
        document.querySelector(
            ".quick-view-modal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );

}



/* =====================================================
   QUICK VIEW ADD TO CART
===================================================== */

function quickViewAddToCart() {

    if (
        !AppState.currentProduct
    ) {

        return;

    }


    addToCart({

        id:
            AppState.currentProduct.id,

        name:
            AppState.currentProduct.name,

        price:
            AppState.currentProduct.price,

        image:
            AppState.currentProduct.image,

        quantity: 1

    });


    closeQuickView();

}



/* =====================================================
   QUICK VIEW WISHLIST
===================================================== */

function quickViewToggleWishlist() {

    if (
        !AppState.currentProduct
    ) {

        return;

    }


    toggleWishlist(
        AppState.currentProduct
    );


    const button =
        document.querySelector(
            ".quick-view-wishlist"
        );


    if (button) {

        button.classList.toggle(
            "active",
            isInWishlist(
                AppState.currentProduct.id
            )
        );

    }

}



/* =====================================================
   DRAWER EVENTS
===================================================== */

function setupDrawerEvents() {

    /*
     * Overlay click
     */

    document.addEventListener(
        "click",
        function(event) {

            const overlay =
                event.target.closest(
                    ".drawer-overlay"
                );


            if (!overlay) {
                return;
            }


            closeCart();

            closeWishlist();

            closeBuyNow();

        }
    );


    /*
     * Quick view background click
     */

    const quickModal =
        document.querySelector(
            ".quick-view-modal"
        );


    if (quickModal) {

        quickModal.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    quickModal
                ) {

                    closeQuickView();

                }

            }
        );

    }

}



/* =====================================================
   HERO SLIDER
===================================================== */

function setupHeroSlider() {

    const slides =
        document.querySelectorAll(
            ".hero-slide"
        );


    if (!slides.length) {
        return;
    }


    const dots =
        document.querySelectorAll(
            ".slider-dot"
        );


    const previous =
        document.querySelector(
            ".slider-prev"
        );


    const next =
        document.querySelector(
            ".slider-next"
        );


    AppState.currentSlide = 0;


    showSlide(
        AppState.currentSlide
    );


    if (next) {

        next.addEventListener(
            "click",
            function() {

                nextSlide();

            }
        );

    }


    if (previous) {

        previous.addEventListener(
            "click",
            function() {

                previousSlide();

            }
        );

    }


    dots.forEach(
        function(dot, index) {

            dot.addEventListener(
                "click",
                function() {

                    AppState.currentSlide =
                        index;

                    showSlide(
                        AppState.currentSlide
                    );

                }
            );

        }
    );


    /*
     * Automatic slider
     */

    setInterval(
        function() {

            nextSlide();

        },
        5000
    );

}



/* =====================================================
   SHOW SLIDE
===================================================== */

function showSlide(
    index
) {

    const slides =
        document.querySelectorAll(
            ".hero-slide"
        );


    const dots =
        document.querySelectorAll(
            ".slider-dot"
        );


    if (!slides.length) {
        return;
    }


    if (index >= slides.length) {

        AppState.currentSlide = 0;

    }


    if (index < 0) {

        AppState.currentSlide =
            slides.length - 1;

    }


    slides.forEach(
        function(slide, slideIndex) {

            slide.classList.toggle(
                "active",
                slideIndex ===
                AppState.currentSlide
            );

        }
    );


    dots.forEach(
        function(dot, dotIndex) {

            dot.classList.toggle(
                "active",
                dotIndex ===
                AppState.currentSlide
            );

        }
    );

}



/* =====================================================
   NEXT SLIDE
===================================================== */

function nextSlide() {

    const slides =
        document.querySelectorAll(
            ".hero-slide"
        );


    if (!slides.length) {
        return;
    }


    AppState.currentSlide++;


    if (
        AppState.currentSlide >=
        slides.length
    ) {

        AppState.currentSlide = 0;

    }


    showSlide(
        AppState.currentSlide
    );

}



/* =====================================================
   PREVIOUS SLIDE
===================================================== */

function previousSlide() {

    const slides =
        document.querySelectorAll(
            ".hero-slide"
        );


    if (!slides.length) {
        return;
    }


    AppState.currentSlide--;


    if (
        AppState.currentSlide < 0
    ) {

        AppState.currentSlide =
            slides.length - 1;

    }


    showSlide(
        AppState.currentSlide
    );

}



/* =====================================================
   SCROLL EFFECTS
===================================================== */

function setupScrollEffects() {

    const header =
        document.querySelector(
            ".site-header"
        );


    const backTop =
        document.querySelector(
            ".back-to-top"
        );


    window.addEventListener(
        "scroll",
        function() {

            const scrollY =
                window.scrollY;


            if (header) {

                header.classList.toggle(
                    "scrolled",
                    scrollY > 50
                );

            }


            if (backTop) {

                backTop.classList.toggle(
                    "show",
                    scrollY > 500
                );

            }

        },
        {
            passive: true
        }
    );

}



/* =====================================================
   BACK TO TOP
===================================================== */

function setupBackToTop() {

    const button =
        document.querySelector(
            ".back-to-top"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function() {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}



/* =====================================================
   PART 4 END
===================================================== */
/* =====================================================
   VISHWASH FOODS
   SCRIPT.JS — PART 5/10
===================================================== */


/* =====================================================
   ANNOUNCEMENT BAR
===================================================== */

function setupAnnouncement() {

    const closeButton =
        document.querySelector(
            ".announcement-close"
        );


    const bar =
        document.querySelector(
            ".announcement-bar"
        );


    if (!closeButton || !bar) {
        return;
    }


    closeButton.addEventListener(
        "click",
        function() {

            bar.style.display =
                "none";

        }
    );

}



/* =====================================================
   COOKIE NOTICE
===================================================== */

function setupCookieNotice() {

    const notice =
        document.querySelector(
            ".cookie-notice"
        );


    if (!notice) {
        return;
    }


    const accepted =
        localStorage.getItem(
            STORAGE_KEYS.cookie
        );


    if (!accepted) {

        setTimeout(
            function() {

                notice.classList.add(
                    "show"
                );

            },
            1200
        );

    }


    const acceptButton =
        notice.querySelector(
            ".cookie-accept"
        );


    const declineButton =
        notice.querySelector(
            ".cookie-decline"
        );


    if (acceptButton) {

        acceptButton.addEventListener(
            "click",
            function() {

                localStorage.setItem(
                    STORAGE_KEYS.cookie,
                    "accepted"
                );

                notice.classList.remove(
                    "show"
                );

            }
        );

    }


    if (declineButton) {

        declineButton.addEventListener(
            "click",
            function() {

                localStorage.setItem(
                    STORAGE_KEYS.cookie,
                    "declined"
                );

                notice.classList.remove(
                    "show"
                );

            }
        );

    }

}



/* =====================================================
   NEWSLETTER
===================================================== */

function setupNewsletter() {

    const forms =
        document.querySelectorAll(
            ".newsletter-form"
        );


    forms.forEach(function(form) {

        form.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const input =
                    form.querySelector(
                        "input[type='email']"
                    );


                if (!input) {
                    return;
                }


                const email =
                    input.value.trim();


                if (!isValidEmail(email)) {

                    showToast(
                        "Please valid email enter karein."
                    );

                    input.focus();

                    return;

                }


                showToast(
                    "Thank you! VISHWASH FOODS updates ke liye subscribed."
                );


                form.reset();

            }
        );

    });

}



/* =====================================================
   CONTACT FORM
===================================================== */

function setupContactForm() {

    const forms =
        document.querySelectorAll(
            ".contact-form"
        );


    forms.forEach(function(form) {

        form.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const name =
                    form.querySelector(
                        "[name='name']"
                    );


                const phone =
                    form.querySelector(
                        "[name='phone']"
                    );


                const email =
                    form.querySelector(
                        "[name='email']"
                    );


                const message =
                    form.querySelector(
                        "[name='message']"
                    );


                if (
                    name &&
                    name.value.trim() === ""
                ) {

                    showToast(
                        "Please apna name enter karein."
                    );

                    name.focus();

                    return;

                }


                if (
                    phone &&
                    !isValidIndianPhone(
                        phone.value
                    )
                ) {

                    showToast(
                        "Please valid mobile number enter karein."
                    );

                    phone.focus();

                    return;

                }


                if (
                    email &&
                    email.value.trim() !== "" &&
                    !isValidEmail(
                        email.value
                    )
                ) {

                    showToast(
                        "Please valid email enter karein."
                    );

                    email.focus();

                    return;

                }


                /*
                 * WhatsApp message
                 */

                let text =
                    "Hello VISHWASH FOODS,%0A%0A";


                if (name) {

                    text +=
                        "Name: " +
                        encodeURIComponent(
                            name.value.trim()
                        ) +
                        "%0A";

                }


                if (phone) {

                    text +=
                        "Mobile: " +
                        encodeURIComponent(
                            phone.value.trim()
                        ) +
                        "%0A";

                }


                if (email) {

                    text +=
                        "Email: " +
                        encodeURIComponent(
                            email.value.trim()
                        ) +
                        "%0A";

                }


                if (message) {

                    text +=
                        "Message: " +
                        encodeURIComponent(
                            message.value.trim()
                        ) +
                        "%0A";

                }


                text +=
                    "%0AThank you.";


                const whatsappURL =
                    "https://wa.me/" +
                    COMPANY.whatsapp +
                    "?text=" +
                    text;


                window.open(
                    whatsappURL,
                    "_blank"
                );


                form.reset();


                showToast(
                    "WhatsApp open ho raha hai..."
                );

            }
        );

    });

}



/* =====================================================
   EMAIL VALIDATION
===================================================== */

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            String(email).trim()
        );

}



/* =====================================================
   INDIAN PHONE VALIDATION
===================================================== */

function isValidIndianPhone(
    phone
) {

    const clean =
        String(phone)
            .replace(/\D/g, "");


    return /^[6-9]\d{9}$/.test(
        clean
    );

}



/* =====================================================
   PROMO CODE SETUP
===================================================== */

function setupPromoCode() {

    const buttons =
        document.querySelectorAll(
            ".promo-box button"
        );


    buttons.forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const box =
                    button.closest(
                        ".promo-box"
                    );


                if (!box) {
                    return;
                }


                const input =
                    box.querySelector(
                        "input"
                    );


                if (!input) {
                    return;
                }


                const code =
                    input.value
                        .trim()
                        .toUpperCase();


                applyPromoCode(
                    code
                );

            }
        );

    });

}



/* =====================================================
   APPLY PROMO CODE
===================================================== */

function applyPromoCode(
    code
) {

    /*
     * Demo premium offers.
     *
     * Aap baad mein apne real
     * coupon codes yahan change
     * kar sakte ho.
     */

    const coupons = {

        "VISHWASH10": 10,

        "WELCOME10": 10,

        "NAMKEEN20": 20,

        "FOODS50": 50

    };


    if (!code) {

        showToast(
            "Please coupon code enter karein."
        );

        return;

    }


    if (
        Object.prototype.hasOwnProperty.call(
            coupons,
            code
        )
    ) {

        AppState.promoDiscount =
            coupons[code];


        localStorage.setItem(
            STORAGE_KEYS.promo,
            String(
                AppState.promoDiscount
            )
        );


        updateCartSummary();


        showToast(
            "Coupon apply ho gaya 🎉 ₹" +
            formatMoney(
                AppState.promoDiscount
            ) +
            " discount."
        );

    }

    else {

        AppState.promoDiscount = 0;

        localStorage.removeItem(
            STORAGE_KEYS.promo
        );


        updateCartSummary();


        showToast(
            "Invalid coupon code."
        );

    }

}



/* =====================================================
   INITIALIZE PROMO
===================================================== */

setTimeout(
    function() {

        setupPromoCode();

    },
    100
);



/* =====================================================
   TOAST NOTIFICATION
===================================================== */

function showToast(
    message,
    type = "success"
) {

    let container =
        document.querySelector(
            ".toast-container"
        );


    /*
     * Agar HTML mein toast container
     * nahi hai to automatically bana denge.
     */

    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.className =
            "toast-container";


        document.body.appendChild(
            container
        );

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast toast-" +
        type;


    let icon =
        "fa-check-circle";


    if (type === "error") {

        icon =
            "fa-exclamation-circle";

    }


    if (type === "warning") {

        icon =
            "fa-exclamation-triangle";

    }


    toast.innerHTML = `

        <div class="toast-icon">

            <i class="fas ${icon}"></i>

        </div>

        <div class="toast-message">

            ${escapeHTML(message)}

        </div>

        <button
            type="button"
            class="toast-close"
            aria-label="Close"
        >

            <i class="fas fa-times"></i>

        </button>

    `;


    container.appendChild(
        toast
    );


    requestAnimationFrame(
        function() {

            toast.classList.add(
                "show"
            );

        }
    );


    const close =
        toast.querySelector(
            ".toast-close"
        );


    if (close) {

        close.addEventListener(
            "click",
            function() {

                removeToast(
                    toast
                );

            }
        );

    }


    setTimeout(
        function() {

            removeToast(
                toast
            );

        },
        3500
    );

}



/* =====================================================
   REMOVE TOAST
===================================================== */

function removeToast(
    toast
) {

    if (!toast) {
        return;
    }


    toast.classList.remove(
        "show"
    );


    setTimeout(
        function() {

            if (
                toast.parentNode
            ) {

                toast.parentNode.removeChild(
                    toast
                );

            }

        },
        300
    );

}



/* =====================================================
   PRODUCT FILTER
===================================================== */

function setupProductFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    if (!buttons.length) {
        return;
    }


    buttons.forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                buttons.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                const filter =
                    button.dataset.filter ||
                    button.textContent
                        .trim()
                        .toLowerCase();


                cards.forEach(
                    function(card) {

                        const category =
                            card.dataset.category ||
                            card.querySelector(
                                ".product-category"
                            )?.textContent ||
                            "";


                        const normalized =
                            category
                                .trim()
                                .toLowerCase();


                        if (
                            filter === "all" ||
                            filter === "*" ||
                            normalized === filter
                        ) {

                            card.style.display =
                                "";

                        }

                        else {

                            card.style.display =
                                "none";

                        }

                    }
                );

            }
        );

    });

}



/* =====================================================
   PRODUCT SORT
===================================================== */

function setupProductSort() {

    const select =
        document.querySelector(
            ".sort-select"
        );


    if (!select) {
        return;
    }


    select.addEventListener(
        "change",
        function() {

            const value =
                this.value;


            const grid =
                document.querySelector(
                    ".products-grid"
                );


            if (!grid) {
                return;
            }


            const cards =
                Array.from(
                    grid.querySelectorAll(
                        ".product-card"
                    )
                );


            cards.sort(
                function(a, b) {

                    const priceA =
                        getCardPrice(a);


                    const priceB =
                        getCardPrice(b);


                    if (
                        value ===
                        "price-low"
                    ) {

                        return priceA -
                            priceB;

                    }


                    if (
                        value ===
                        "price-high"
                    ) {

                        return priceB -
                            priceA;

                    }


                    return 0;

                }
            );


            cards.forEach(
                function(card) {

                    grid.appendChild(
                        card
                    );

                }
            );

        }
    );

}



/* =====================================================
   GET CARD PRICE
===================================================== */

function getCardPrice(
    card
) {

    const element =
        card.querySelector(
            ".product-price, .price-current, [data-price]"
        );


    if (!element) {
        return 0;
    }


    return parseFloat(
        element.textContent
            .replace(/[^\d.]/g, "")
    ) || 0;

}



/* =====================================================
   SETUP FILTER + SORT
===================================================== */

setTimeout(
    function() {

        setupProductFilters();

        setupProductSort();

    },
    150
);



/* =====================================================
   PART 5 END
===================================================== */
/* =====================================================
   VISHWASH FOODS
   SCRIPT.JS — PART 6/10
===================================================== */


/* =====================================================
   CHECKOUT SYSTEM
===================================================== */

function openCheckout() {

    if (!AppState.cart.length) {

        showToast(
            "Aapka cart empty hai.",
            "warning"
        );

        return;

    }


    const checkout =
        document.querySelector(
            ".checkout-section"
        );


    if (checkout) {

        checkout.classList.add(
            "active"
        );


        checkout.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;

    }


    openWhatsAppCheckout();

}



/* =====================================================
   WHATSAPP CHECKOUT
===================================================== */

function openWhatsAppCheckout() {

    if (!AppState.cart.length) {

        showToast(
            "Pehle product cart mein add karein.",
            "warning"
        );

        return;

    }


    let message =
        "🛍️ *VISHWASH FOODS ORDER*%0A";

    message +=
        "━━━━━━━━━━━━━━━━%0A";


    message +=
        "👤 *Customer Order*%0A%0A";


    AppState.cart.forEach(
        function(item, index) {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            message +=
                `${index + 1}. ` +
                `${encodeURIComponent(item.name)}` +
                "%0A";

            message +=
                `Qty: ${item.quantity}` +
                "%0A";

            message +=
                `Price: ₹${formatMoney(item.price)}` +
                "%0A";

            message +=
                `Total: ₹${formatMoney(itemTotal)}` +
                "%0A%0A";

        }
    );


    message +=
        "━━━━━━━━━━━━━━━━%0A";


    message +=
        "Subtotal: ₹" +
        formatMoney(
            getCartSubtotal()
        ) +
        "%0A";


    if (
        getDiscountAmount() > 0
    ) {

        message +=
            "Discount: -₹" +
            formatMoney(
                getDiscountAmount()
            ) +
            "%0A";

    }


    message +=
        "Shipping: " +
        (
            getShippingAmount() === 0
                ? "FREE"
                : "₹" +
                  formatMoney(
                      getShippingAmount()
                  )
        ) +
        "%0A";


    message +=
        "💰 *Grand Total: ₹" +
        formatMoney(
            getCartGrandTotal()
        ) +
        "*%0A%0A";


    message +=
        "📞 VISHWASH FOODS%0A";

    message +=
        "Founder: NIKHIL VAISHNAV%0A";

    message +=
        "Mobile: 8460183525";


    const url =
        "https://wa.me/" +
        COMPANY.whatsapp +
        "?text=" +
        message;


    window.open(
        url,
        "_blank"
    );


    showToast(
        "WhatsApp order ready ho raha hai..."
    );

}



/* =====================================================
   UPI PAYMENT
===================================================== */

function openUPIPayment() {

    const total =
        getCartGrandTotal();


    if (total <= 0) {

        showToast(
            "Payment ke liye cart mein product add karein.",
            "warning"
        );

        return;

    }


    /*
     * YAHAN APNA ACTUAL UPI ID LAGANA HAI.
     *
     * Example:
     * vishwashfoods@upi
     *
     * Abhi placeholder hai.
     */

    const upiId =
        "YOURUPIID@upi";


    const merchantName =
        "VISHWASH FOODS";


    const upiURL =
        "upi://pay" +
        "?pa=" +
        encodeURIComponent(
            upiId
        ) +
        "&pn=" +
        encodeURIComponent(
            merchantName
        ) +
        "&am=" +
        encodeURIComponent(
            total.toFixed(2)
        ) +
        "&cu=INR";


    window.location.href =
        upiURL;

}



/* =====================================================
   CHECKOUT FORM
===================================================== */

function setupCheckoutForm() {

    const forms =
        document.querySelectorAll(
            ".checkout-form"
        );


    forms.forEach(
        function(form) {

            form.addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();


                    if (
                        !AppState.cart.length
                    ) {

                        showToast(
                            "Cart empty hai.",
                            "warning"
                        );

                        return;

                    }


                    const name =
                        form.querySelector(
                            "[name='customerName']"
                        );


                    const phone =
                        form.querySelector(
                            "[name='customerPhone']"
                        );


                    const address =
                        form.querySelector(
                            "[name='address']"
                        );


                    if (
                        !name ||
                        !name.value.trim()
                    ) {

                        showToast(
                            "Please customer name enter karein.",
                            "warning"
                        );

                        name?.focus();

                        return;

                    }


                    if (
                        !phone ||
                        !isValidIndianPhone(
                            phone.value
                        )
                    ) {

                        showToast(
                            "Please valid 10 digit mobile number enter karein.",
                            "warning"
                        );

                        phone?.focus();

                        return;

                    }


                    if (
                        !address ||
                        !address.value.trim()
                    ) {

                        showToast(
                            "Please delivery address enter karein.",
                            "warning"
                        );

                        address?.focus();

                        return;

                    }


                    sendOrderToWhatsApp(
                        form
                    );

                }
            );

        }
    );

}



/* =====================================================
   SEND COMPLETE ORDER
===================================================== */

function sendOrderToWhatsApp(
    form
) {

    const name =
        form.querySelector(
            "[name='customerName']"
        )?.value.trim() || "";


    const phone =
        form.querySelector(
            "[name='customerPhone']"
        )?.value.trim() || "";


    const address =
        form.querySelector(
            "[name='address']"
        )?.value.trim() || "";


    const city =
        form.querySelector(
            "[name='city']"
        )?.value.trim() || "";


    const pincode =
        form.querySelector(
            "[name='pincode']"
        )?.value.trim() || "";


    const payment =
        form.querySelector(
            "[name='payment']"
        )?.value || "COD";


    let message =
        "🛒 *NEW ORDER — VISHWASH FOODS*%0A";

    message +=
        "━━━━━━━━━━━━━━━━%0A%0A";


    message +=
        "👤 Customer: " +
        encodeURIComponent(
            name
        ) +
        "%0A";


    message +=
        "📱 Mobile: " +
        encodeURIComponent(
            phone
        ) +
        "%0A";


    message +=
        "🏠 Address: " +
        encodeURIComponent(
            address
        ) +
        "%0A";


    if (city) {

        message +=
            "📍 City: " +
            encodeURIComponent(
                city
            ) +
            "%0A";

    }


    if (pincode) {

        message +=
            "📮 Pincode: " +
            encodeURIComponent(
                pincode
            ) +
            "%0A";

    }


    message +=
        "💳 Payment: " +
        encodeURIComponent(
            payment
        ) +
        "%0A%0A";


    message +=
        "*PRODUCTS*%0A";


    AppState.cart.forEach(
        function(item, index) {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            message +=
                `${index + 1}. ` +
                encodeURIComponent(
                    item.name
                ) +
                "%0A";


            message +=
                `Qty: ${item.quantity} × ₹${formatMoney(item.price)}` +
                "%0A";


            message +=
                `Amount: ₹${formatMoney(itemTotal)}` +
                "%0A%0A";

        }
    );


    message +=
        "━━━━━━━━━━━━━━━━%0A";


    message +=
        "Subtotal: ₹" +
        formatMoney(
            getCartSubtotal()
        ) +
        "%0A";


    message +=
        "Discount: ₹" +
        formatMoney(
            getDiscountAmount()
        ) +
        "%0A";


    message +=
        "Shipping: " +
        (
            getShippingAmount() === 0
                ? "FREE"
                : "₹" +
                  formatMoney(
                      getShippingAmount()
                  )
        ) +
        "%0A";


    message +=
        "💰 *TOTAL: ₹" +
        formatMoney(
            getCartGrandTotal()
        ) +
        "*%0A%0A";


    message +=
        "━━━━━━━━━━━━━━━━%0A";

    message +=
        "VISHWASH FOODS%0A";

    message +=
        "Founder: NIKHIL VAISHNAV%0A";

    message +=
        "Mobile: 8460183525";


    const url =
        "https://wa.me/" +
        COMPANY.whatsapp +
        "?text=" +
        message;


    window.open(
        url,
        "_blank"
    );


    showToast(
        "Order WhatsApp par bhejne ke liye ready hai."
    );

}



/* =====================================================
   PAYMENT METHOD CHANGE
===================================================== */

function setupPaymentMethods() {

    const methods =
        document.querySelectorAll(
            "input[name='payment']"
        );


    methods.forEach(
        function(input) {

            input.addEventListener(
                "change",
                function() {

                    const upiBox =
                        document.querySelector(
                            ".upi-payment-box"
                        );


                    if (!upiBox) {
                        return;
                    }


                    if (
                        this.value
                            .toLowerCase()
                            .includes("upi")
                    ) {

                        upiBox.classList.add(
                            "active"
                        );

                    }

                    else {

                        upiBox.classList.remove(
                            "active"
                        );

                    }

                }
            );

        }
    );

}



/* =====================================================
   PINCODE VALIDATION
===================================================== */

function setupPincodeValidation() {

    const inputs =
        document.querySelectorAll(
            "[name='pincode']"
        );


    inputs.forEach(
        function(input) {

            input.addEventListener(
                "input",
                function() {

                    this.value =
                        this.value
                            .replace(/\D/g, "")
                            .slice(0, 6);

                }
            );

        }
    );

}



/* =====================================================
   PHONE INPUT FORMAT
===================================================== */

function setupPhoneInputs() {

    const inputs =
        document.querySelectorAll(
            "[name='phone'], [name='customerPhone']"
        );


    inputs.forEach(
        function(input) {

            input.addEventListener(
                "input",
                function() {

                    this.value =
                        this.value
                            .replace(/\D/g, "")
                            .slice(0, 10);

                }
            );

        }
    );

}



/* =====================================================
   CHECKOUT INITIALIZE
===================================================== */

setTimeout(
    function() {

        setupCheckoutForm();

        setupPaymentMethods();

        setupPincodeValidation();

        setupPhoneInputs();

    },
    200
);



/* =====================================================
   CART CHECKOUT BUTTONS
===================================================== */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-checkout]"
            );


        if (!button) {
            return;
        }


        event.preventDefault();


        const method =
            button.dataset.checkout;


        if (
            method === "whatsapp"
        ) {

            openWhatsAppCheckout();

        }

        else if (
            method === "upi"
        ) {

            openUPIPayment();

        }

        else {

            openCheckout();

        }

    }
);



/* =====================================================
   ORDER SUCCESS
===================================================== */

function showOrderSuccess() {

    const modal =
        document.querySelector(
            ".success-modal"
        );


    if (!modal) {

        showToast(
            "Thank you! Aapka order receive ho gaya. ❤️"
        );

        return;

    }


    modal.classList.add(
        "active"
    );


    document.body.classList.add(
        "modal-open"
    );

}



/* =====================================================
   CLOSE SUCCESS
===================================================== */

function closeOrderSuccess() {

    const modal =
        document.querySelector(
            ".success-modal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );

}



/* =====================================================
   PART 6 END
===================================================== */
/* =====================================================
   VISHWASH FOODS
   SCRIPT.JS — PART 7/10
===================================================== */


/* =====================================================
   MOBILE BOTTOM NAVIGATION
===================================================== */

function setupMobileBottomNav() {

    const nav =
        document.querySelector(
            ".mobile-bottom-nav"
        );

    if (!nav) {
        return;
    }


    const links =
        nav.querySelectorAll(
            "a, button"
        );


    links.forEach(function(link) {

        link.addEventListener(
            "click",
            function() {

                links.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                link.classList.add(
                    "active"
                );

            }
        );

    });

}



/* =====================================================
   FLOATING WHATSAPP
===================================================== */

function setupWhatsAppButton() {

    const buttons =
        document.querySelectorAll(
            ".whatsapp-float, [data-whatsapp]"
        );


    buttons.forEach(function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                const text =
                    button.dataset.whatsappText ||
                    "Hello VISHWASH FOODS, mujhe products ke baare mein information chahiye.";

                const url =
                    "https://wa.me/" +
                    COMPANY.whatsapp +
                    "?text=" +
                    encodeURIComponent(
                        text
                    );

                window.open(
                    url,
                    "_blank"
                );

            }
        );

    });

}



/* =====================================================
   CALL BUTTON
===================================================== */

function setupCallButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-call], .call-button"
        );


    buttons.forEach(function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                window.location.href =
                    "tel:" +
                    COMPANY.mobile;

            }
        );

    });

}



/* =====================================================
   FOUNDER INFORMATION
===================================================== */

function setupFounderInformation() {

    const names =
        document.querySelectorAll(
            "[data-founder-name]"
        );


    names.forEach(function(element) {

        element.textContent =
            COMPANY.founder;

    });


    const companyNames =
        document.querySelectorAll(
            "[data-company-name]"
        );


    companyNames.forEach(function(element) {

        element.textContent =
            COMPANY.name;

    });


    const mobiles =
        document.querySelectorAll(
            "[data-company-mobile]"
        );


    mobiles.forEach(function(element) {

        element.textContent =
            COMPANY.mobile;

    });


    const mobileLinks =
        document.querySelectorAll(
            "[data-company-mobile-link]"
        );


    mobileLinks.forEach(function(element) {

        element.href =
            "tel:" +
            COMPANY.mobile;

    });

}



/* =====================================================
   FOOTER YEAR
===================================================== */

function setupFooterYear() {

    const year =
        new Date().getFullYear();


    const elements =
        document.querySelectorAll(
            ".current-year, [data-year]"
        );


    elements.forEach(function(element) {

        element.textContent =
            year;

    });

}



/* =====================================================
   FOUNDER IMAGE FALLBACK
===================================================== */

function setupFounderImage() {

    const images =
        document.querySelectorAll(
            ".founder-image img, [data-founder-image]"
        );


    images.forEach(function(image) {

        image.addEventListener(
            "error",
            function() {

                /*
                 * Agar founder image load nahi hoti
                 * to broken image ke bajay clean
                 * placeholder show hoga.
                 */

                image.style.display =
                    "none";


                const parent =
                    image.parentElement;


                if (
                    parent &&
                    !parent.querySelector(
                        ".founder-placeholder"
                    )
                ) {

                    const placeholder =
                        document.createElement(
                            "div"
                        );


                    placeholder.className =
                        "founder-placeholder";


                    placeholder.innerHTML = `

                        <span>
                            NV
                        </span>

                        <strong>
                            ${escapeHTML(
                                COMPANY.founder
                            )}
                        </strong>

                    `;


                    parent.appendChild(
                        placeholder
                    );

                }

            }
        );

    });

}



/* =====================================================
   NEWSLETTER EMAIL MEMORY
===================================================== */

function rememberNewsletterEmail() {

    const forms =
        document.querySelectorAll(
            ".newsletter-form"
        );


    forms.forEach(function(form) {

        const input =
            form.querySelector(
                "input[type='email']"
            );


        if (!input) {
            return;
        }


        const saved =
            localStorage.getItem(
                "vishwash_newsletter_email"
            );


        if (saved) {

            input.value =
                saved;

        }


        form.addEventListener(
            "submit",
            function() {

                if (
                    isValidEmail(
                        input.value
                    )
                ) {

                    localStorage.setItem(
                        "vishwash_newsletter_email",
                        input.value.trim()
                    );

                }

            }
        );

    });

}



/* =====================================================
   SCROLL REVEAL
===================================================== */

function setupScrollReveal() {

    const elements =
        document.querySelectorAll(
            ".reveal, .fade-up, .scroll-reveal"
        );


    if (!elements.length) {
        return;
    }


    /*
     * Browser IntersectionObserver
     * se smooth animation.
     */

    const observer =
        new IntersectionObserver(
            function(entries) {

                entries.forEach(
                    function(entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        function(element) {

            observer.observe(
                element
            );

        }
    );

}



/* =====================================================
   COUNTER ANIMATION
===================================================== */

function setupCounters() {

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );


    if (!counters.length) {
        return;
    }


    const observer =
        new IntersectionObserver(
            function(entries) {

                entries.forEach(
                    function(entry) {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        const counter =
                            entry.target;


                        const target =
                            Number(
                                counter.dataset.counter
                            ) || 0;


                        animateCounter(
                            counter,
                            target
                        );


                        observer.unobserve(
                            counter
                        );

                    }
                );

            },
            {
                threshold: 0.5
            }
        );


    counters.forEach(
        function(counter) {

            observer.observe(
                counter
            );

        }
    );

}



/* =====================================================
   ANIMATE COUNTER
===================================================== */

function animateCounter(
    element,
    target
) {

    const duration =
        1500;


    const startTime =
        performance.now();


    function update(
        currentTime
    ) {

        const progress =
            Math.min(
                (
                    currentTime -
                    startTime
                ) / duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const current =
            Math.floor(
                eased * target
            );


        element.textContent =
            current.toLocaleString(
                "en-IN"
            );


        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        }

        else {

            element.textContent =
                target.toLocaleString(
                    "en-IN"
                );

        }

    }


    requestAnimationFrame(
        update
    );

}



/* =====================================================
   IMAGE LAZY LOADING
===================================================== */

function setupLazyImages() {

    const images =
        document.querySelectorAll(
            "img[data-src]"
        );


    if (!images.length) {
        return;
    }


    const observer =
        new IntersectionObserver(
            function(entries) {

                entries.forEach(
                    function(entry) {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        const image =
                            entry.target;


                        const source =
                            image.dataset.src;


                        if (source) {

                            image.src =
                                source;

                        }


                        image.classList.add(
                            "loaded"
                        );


                        observer.unobserve(
                            image
                        );

                    }
                );

            },
            {
                rootMargin:
                    "100px"
            }
        );


    images.forEach(
        function(image) {

            observer.observe(
                image
            );

        }
    );

}



/* =====================================================
   IMAGE ERROR HANDLING
===================================================== */

function setupImageErrors() {

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach(function(image) {

        image.addEventListener(
            "error",
            function() {

                /*
                 * Already handled images ko
                 * dobara replace nahi karna.
                 */

                if (
                    image.dataset.errorHandled
                ) {

                    return;

                }


                image.dataset.errorHandled =
                    "true";


                image.classList.add(
                    "image-error"
                );

            }
        );

    });

}



/* =====================================================
   PRODUCT IMAGE ZOOM
===================================================== */

function setupProductImageZoom() {

    const images =
        document.querySelectorAll(
            ".product-image img"
        );


    images.forEach(function(image) {

        image.addEventListener(
            "click",
            function() {

                const src =
                    image.currentSrc ||
                    image.src;


                if (!src) {
                    return;
                }


                openImageViewer(
                    src,
                    image.alt
                );

            }
        );

    });

}



/* =====================================================
   IMAGE VIEWER
===================================================== */

function openImageViewer(
    source,
    altText
) {

    let viewer =
        document.querySelector(
            ".image-viewer"
        );


    if (!viewer) {

        viewer =
            document.createElement(
                "div"
            );


        viewer.className =
            "image-viewer";


        viewer.innerHTML = `

            <button
                type="button"
                class="image-viewer-close"
                aria-label="Close"
            >

                <i class="fas fa-times"></i>

            </button>

            <div class="image-viewer-content">

                <img
                    src=""
                    alt=""
                >

            </div>

        `;


        document.body.appendChild(
            viewer
        );


        viewer.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    viewer ||
                    event.target.closest(
                        ".image-viewer-close"
                    )
                ) {

                    closeImageViewer();

                }

            }
        );

    }


    const image =
        viewer.querySelector(
            "img"
        );


    if (image) {

        image.src =
            source;

        image.alt =
            altText || "";

    }


    viewer.classList.add(
        "active"
    );


    document.body.classList.add(
        "modal-open"
    );

}



/* =====================================================
   CLOSE IMAGE VIEWER
===================================================== */

function closeImageViewer() {

    const viewer =
        document.querySelector(
            ".image-viewer"
        );


    if (!viewer) {
        return;
    }


    viewer.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );

}



/* =====================================================
   DRAG PREVENTION
===================================================== */

function preventImageDrag() {

    document.addEventListener(
        "dragstart",
        function(event) {

            if (
                event.target.tagName ===
                "IMG"
            ) {

                event.preventDefault();

            }

        }
    );

}



/* =====================================================
   MOBILE SWIPE HERO
===================================================== */

function setupHeroSwipe() {

    const slider =
        document.querySelector(
            ".hero-slider"
        );


    if (!slider) {
        return;
    }


    let startX = 0;

    let endX = 0;


    slider.addEventListener(
        "touchstart",
        function(event) {

            startX =
                event.changedTouches[0].screenX;

        },
        {
            passive: true
        }
    );


    slider.addEventListener(
        "touchend",
        function(event) {

            endX =
                event.changedTouches[0].screenX;


            const difference =
                endX - startX;


            if (
                Math.abs(difference) <
                50
            ) {

                return;

            }


            if (difference < 0) {

                nextSlide();

            }

            else {

                previousSlide();

            }

        },
        {
            passive: true
        }
    );

}



/* =====================================================
   INITIALIZE PART 7 FEATURES
===================================================== */

setTimeout(
    function() {

        setupMobileBottomNav();

        setupWhatsAppButton();

        setupCallButtons();

        setupFounderInformation();

        setupFooterYear();

        setupFounderImage();

        rememberNewsletterEmail();

        setupScrollReveal();

        setupCounters();

        setupLazyImages();

        setupImageErrors();

        setupProductImageZoom();

        preventImageDrag();

        setupHeroSwipe();

    },
    250
);



/* =====================================================
   PART 7 END
===================================================== */
/* =====================================================
   VISHWASH FOODS
   SCRIPT.JS — PART 8/10
===================================================== */


/* =====================================================
   FAQ ACCORDION
===================================================== */

function setupFAQ() {

    const items =
        document.querySelectorAll(
            ".faq-item"
        );


    items.forEach(function(item) {

        const question =
            item.querySelector(
                ".faq-question"
            );


        if (!question) {
            return;
        }


        question.addEventListener(
            "click",
            function() {

                const isActive =
                    item.classList.contains(
                        "active"
                    );


                items.forEach(
                    function(otherItem) {

                        otherItem.classList.remove(
                            "active"
                        );

                    }
                );


                if (!isActive) {

                    item.classList.add(
                        "active"
                    );

                }

            }
        );

    });

}



/* =====================================================
   CATEGORY NAVIGATION
===================================================== */

function setupCategoryNavigation() {

    const links =
        document.querySelectorAll(
            "[data-category-link]"
        );


    links.forEach(function(link) {

        link.addEventListener(
            "click",
            function(event) {

                const target =
                    link.dataset.categoryLink;


                if (!target) {
                    return;
                }


                const section =
                    document.querySelector(
                        target
                    );


                if (!section) {
                    return;
                }


                event.preventDefault();


                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });


                /*
                 * Mobile menu close
                 */

                const menu =
                    document.querySelector(
                        ".mobile-menu"
                    );


                if (menu) {

                    menu.classList.remove(
                        "active"
                    );

                }

            }
        );

    });

}



/* =====================================================
   SMOOTH INTERNAL LINKS
===================================================== */

function setupSmoothLinks() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(function(link) {

        link.addEventListener(
            "click",
            function(event) {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !href ||
                    href === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        href
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                const header =
                    document.querySelector(
                        ".site-header"
                    );


                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;


                const position =
                    target.getBoundingClientRect()
                        .top +
                    window.scrollY -
                    headerHeight -
                    10;


                window.scrollTo({

                    top:
                        Math.max(
                            position,
                            0
                        ),

                    behavior:
                        "smooth"

                });

            }
        );

    });

}



/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

function setupActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    const navLinks =
        document.querySelectorAll(
            ".main-nav a[href^='#'], " +
            ".mobile-menu a[href^='#']"
        );


    if (
        !sections.length ||
        !navLinks.length
    ) {

        return;

    }


    const observer =
        new IntersectionObserver(
            function(entries) {

                entries.forEach(
                    function(entry) {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        const id =
                            entry.target.id;


                        navLinks.forEach(
                            function(link) {

                                const href =
                                    link.getAttribute(
                                        "href"
                                    );


                                link.classList.toggle(
                                    "active",
                                    href ===
                                    "#" + id
                                );

                            }
                        );

                    }
                );

            },
            {
                rootMargin:
                    "-30% 0px -60% 0px"
            }
        );


    sections.forEach(
        function(section) {

            observer.observe(
                section
            );

        }
    );

}



/* =====================================================
   PRODUCT QUANTITY SELECTOR
===================================================== */

function setupQuantitySelectors() {

    const controls =
        document.querySelectorAll(
            ".product-quantity"
        );


    controls.forEach(function(control) {

        const minus =
            control.querySelector(
                ".quantity-minus"
            );


        const plus =
            control.querySelector(
                ".quantity-plus"
            );


        const input =
            control.querySelector(
                "input"
            );


        if (!input) {
            return;
        }


        if (minus) {

            minus.addEventListener(
                "click",
                function() {

                    let value =
                        parseInt(
                            input.value,
                            10
                        ) || 1;


                    value--;


                    if (value < 1) {

                        value = 1;

                    }


                    input.value =
                        value;


                    input.dispatchEvent(
                        new Event(
                            "change",
                            {
                                bubbles: true
                            }
                        )
                    );

                }
            );

        }


        if (plus) {

            plus.addEventListener(
                "click",
                function() {

                    let value =
                        parseInt(
                            input.value,
                            10
                        ) || 1;


                    value++;


                    if (value > 99) {

                        value = 99;

                    }


                    input.value =
                        value;


                    input.dispatchEvent(
                        new Event(
                            "change",
                            {
                                bubbles: true
                            }
                        )
                    );

                }
            );

        }


        input.addEventListener(
            "input",
            function() {

                let value =
                    this.value
                        .replace(/\D/g, "");


                if (!value) {

                    value = "1";

                }


                value =
                    Math.min(
                        99,
                        Math.max(
                            1,
                            parseInt(
                                value,
                                10
                            )
                        )
                    );


                this.value =
                    value;

            }
        );

    });

}



/* =====================================================
   PRODUCT CARD HOVER EFFECT
===================================================== */

function setupProductHover() {

    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    cards.forEach(function(card) {

        card.addEventListener(
            "mouseenter",
            function() {

                card.classList.add(
                    "is-hovered"
                );

            }
        );


        card.addEventListener(
            "mouseleave",
            function() {

                card.classList.remove(
                    "is-hovered"
                );

            }
        );

    });

}



/* =====================================================
   RECENTLY VIEWED PRODUCTS
===================================================== */

const RECENT_KEY =
    "vishwash_foods_recent_products";


function saveRecentlyViewed(
    product
) {

    if (!product) {
        return;
    }


    let recent = [];


    try {

        recent =
            JSON.parse(
                localStorage.getItem(
                    RECENT_KEY
                )
            ) || [];

    }

    catch (error) {

        recent = [];

    }


    recent =
        recent.filter(
            function(item) {

                return String(item.id) !==
                    String(product.id);

            }
        );


    recent.unshift({

        id: product.id,

        name: product.name,

        price: product.price,

        image: product.image

    });


    recent =
        recent.slice(
            0,
            8
        );


    localStorage.setItem(
        RECENT_KEY,
        JSON.stringify(recent)
    );

}



/* =====================================================
   LOAD RECENTLY VIEWED
===================================================== */

function loadRecentlyViewed() {

    const container =
        document.querySelector(
            ".recently-viewed-products"
        );


    if (!container) {
        return;
    }


    let recent = [];


    try {

        recent =
            JSON.parse(
                localStorage.getItem(
                    RECENT_KEY
                )
            ) || [];

    }

    catch (error) {

        recent = [];

    }


    if (!recent.length) {

        container.innerHTML =
            "";

        return;

    }


    container.innerHTML =
        recent.map(
            function(product) {

                return `

                    <article
                        class="recent-product"
                    >

                        <div
                            class="recent-product-image"
                        >

                            <img
                                src="${product.image}"
                                alt="${escapeHTML(
                                    product.name
                                )}"
                            >

                        </div>


                        <div
                            class="recent-product-info"
                        >

                            <h4>
                                ${escapeHTML(
                                    product.name
                                )}
                            </h4>

                            <strong>
                                ₹${formatMoney(
                                    product.price
                                )}
                            </strong>

                        </div>

                    </article>

                `;

            }
        ).join("");

}



/* =====================================================
   TRACK PRODUCT VIEW
===================================================== */

function trackProductView(
    product
) {

    saveRecentlyViewed(
        product
    );

    loadRecentlyViewed();

}



/* =====================================================
   SHARE PRODUCT
===================================================== */

function shareProduct(
    product
) {

    if (!product) {
        return;
    }


    const shareData = {

        title:
            product.name +
            " | VISHWASH FOODS",

        text:
            "Check out " +
            product.name +
            " from VISHWASH FOODS.",

        url:
            window.location.href

    };


    if (
        navigator.share
    ) {

        navigator.share(
            shareData
        )
        .catch(
            function() {}
        );

        return;

    }


    copyToClipboard(
        window.location.href
    );


    showToast(
        "Product link copy ho gaya."
    );

}



/* =====================================================
   COPY TO CLIPBOARD
===================================================== */

function copyToClipboard(
    text
) {

    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard.writeText(
            text
        );

        return;

    }


    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";


    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );

    }

    catch (error) {

        console.warn(
            "Copy failed."
        );

    }


    document.body.removeChild(
        textarea
    );

}



/* =====================================================
   SHARE BUTTONS
===================================================== */

function setupShareButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-share]"
        );


    buttons.forEach(function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                const card =
                    button.closest(
                        ".product-card"
                    );


                if (!card) {

                    copyToClipboard(
                        window.location.href
                    );

                    showToast(
                        "Website link copy ho gaya."
                    );

                    return;

                }


                const product =
                    getProductFromCard(
                        card,
                        0
                    );


                shareProduct(
                    product
                );

            }
        );

    });

}



/* =====================================================
   FAVORITE HEART ANIMATION
===================================================== */

function heartAnimation(
    button
) {

    if (!button) {
        return;
    }


    button.classList.remove(
        "heart-pop"
    );


    void button.offsetWidth;


    button.classList.add(
        "heart-pop"
    );


    setTimeout(
        function() {

            button.classList.remove(
                "heart-pop"
            );

        },
        500
    );

}



/* =====================================================
   WISHLIST CLICK ANIMATION
===================================================== */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".wishlist-button, [data-wishlist]"
            );


        if (!button) {
            return;
        }


        heartAnimation(
            button
        );

    }
);



/* =====================================================
   PRODUCT VIEW TRACKING
===================================================== */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".quick-view-button, [data-quick-view]"
            );


        if (!button) {
            return;
        }


        const card =
            button.closest(
                ".product-card"
            );


        if (!card) {
            return;
        }


        const product =
            getProductFromCard(
                card,
                0
            );


        trackProductView(
            product
        );

    }
);



/* =====================================================
   INITIALIZE PART 8
===================================================== */

setTimeout(
    function() {

        setupFAQ();

        setupCategoryNavigation();

        setupSmoothLinks();

        setupActiveNavigation();

        setupQuantitySelectors();

        setupProductHover();

        loadRecentlyViewed();

        setupShareButtons();

    },
    300
);



/* =====================================================
   PART 8 END
===================================================== */
/* =====================================================
   VISHWASH FOODS
   SCRIPT.JS — PART 9/10
===================================================== */


/* =====================================================
   MOBILE MENU
===================================================== */

function setupMobileMenu() {

    const menu =
        document.querySelector(".mobile-menu");

    const openButton =
        document.querySelector(
            ".mobile-menu-toggle, .menu-toggle"
        );

    const closeButton =
        document.querySelector(
            ".mobile-menu-close"
        );

    if (!menu) return;


    function openMenu() {

        menu.classList.add("active");

        document.body.classList.add(
            "menu-open"
        );

    }


    function closeMenu() {

        menu.classList.remove("active");

        document.body.classList.remove(
            "menu-open"
        );

    }


    if (openButton) {

        openButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                openMenu();

            }
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                closeMenu();

            }
        );

    }


    menu.querySelectorAll("a").forEach(
        function(link) {

            link.addEventListener(
                "click",
                function() {

                    closeMenu();

                }
            );

        }
    );


    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape"
            ) {

                closeMenu();

            }

        }
    );

}



/* =====================================================
   SEARCH OVERLAY
===================================================== */

function setupSearchOverlay() {

    const searchButtons =
        document.querySelectorAll(
            ".search-toggle, [data-search-open]"
        );


    const searchBox =
        document.querySelector(
            ".search-overlay"
        );


    const closeButton =
        document.querySelector(
            ".search-close"
        );


    if (!searchBox) return;


    searchButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    searchBox.classList.add(
                        "active"
                    );


                    const input =
                        searchBox.querySelector(
                            "input"
                        );


                    if (input) {

                        setTimeout(
                            function() {

                                input.focus();

                            },
                            100
                        );

                    }

                }
            );

        }
    );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function() {

                searchBox.classList.remove(
                    "active"
                );

            }
        );

    }


    searchBox.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                searchBox
            ) {

                searchBox.classList.remove(
                    "active"
                );

            }

        }
    );

}



/* =====================================================
   SEARCH PRODUCTS
===================================================== */

function setupProductSearch() {

    const inputs =
        document.querySelectorAll(
            ".product-search-input, " +
            ".search-overlay input, " +
            "[data-product-search]"
        );


    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    if (!inputs.length) return;


    inputs.forEach(
        function(input) {

            input.addEventListener(
                "input",
                function() {

                    const keyword =
                        this.value
                            .trim()
                            .toLowerCase();


                    cards.forEach(
                        function(card) {

                            const product =
                                getProductFromCard(
                                    card,
                                    0
                                );


                            const text =
                                (
                                    product.name +
                                    " " +
                                    product.category
                                )
                                .toLowerCase();


                            if (
                                !keyword ||
                                text.includes(
                                    keyword
                                )
                            ) {

                                card.style.display =
                                    "";

                            }

                            else {

                                card.style.display =
                                    "none";

                            }

                        }
                    );


                    updateSearchResultCount(
                        keyword
                    );

                }
            );

        }
    );

}



/* =====================================================
   SEARCH RESULT COUNT
===================================================== */

function updateSearchResultCount(
    keyword
) {

    const result =
        document.querySelector(
            ".search-result-count"
        );


    if (!result) return;


    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    let count = 0;


    cards.forEach(
        function(card) {

            if (
                card.style.display !==
                "none"
            ) {

                count++;

            }

        }
    );


    if (!keyword) {

        result.textContent =
            "";

        return;

    }


    result.textContent =
        count +
        " product" +
        (
            count !== 1
                ? "s"
                : ""
        ) +
        " found";

}



/* =====================================================
   LOGIN / ACCOUNT SLIDE
===================================================== */

function setupAccountPanel() {

    const buttons =
        document.querySelectorAll(
            ".account-button, [data-account-open]"
        );


    const panel =
        document.querySelector(
            ".account-panel"
        );


    const close =
        document.querySelector(
            ".account-close"
        );


    if (!panel) return;


    buttons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    panel.classList.add(
                        "active"
                    );

                    document.body.classList.add(
                        "panel-open"
                    );

                }
            );

        }
    );


    if (close) {

        close.addEventListener(
            "click",
            function() {

                panel.classList.remove(
                    "active"
                );

                document.body.classList.remove(
                    "panel-open"
                );

            }
        );

    }

}



/* =====================================================
   MOBILE RESPONSIVE CHECK
===================================================== */

function setupResponsiveUI() {

    function updateUI() {

        const isMobile =
            window.innerWidth <= 768;


        document.body.classList.toggle(
            "is-mobile",
            isMobile
        );


        document.body.classList.toggle(
            "is-desktop",
            !isMobile
        );

    }


    updateUI();


    window.addEventListener(
        "resize",
        updateUI
    );

}



/* =====================================================
   ONLINE / OFFLINE STATUS
===================================================== */

function setupConnectionStatus() {

    function updateStatus() {

        document.body.classList.toggle(
            "offline",
            !navigator.onLine
        );


        if (!navigator.onLine) {

            showToast(
                "Internet connection nahi hai.",
                "warning"
            );

        }

    }


    window.addEventListener(
        "online",
        function() {

            document.body.classList.remove(
                "offline"
            );


            showToast(
                "Internet connection wapas aa gaya."
            );

        }
    );


    window.addEventListener(
        "offline",
        updateStatus
    );


    updateStatus();

}



/* =====================================================
   DOUBLE CLICK PROTECTION
===================================================== */

function preventDoubleSubmit() {

    document.addEventListener(
        "submit",
        function(event) {

            const form =
                event.target;


            if (
                form.dataset.processing ===
                "true"
            ) {

                event.preventDefault();

                return;

            }


            form.dataset.processing =
                "true";


            setTimeout(
                function() {

                    form.dataset.processing =
                        "false";

                },
                2000
            );

        },
        true
    );

}



/* =====================================================
   BUTTON LOADING EFFECT
===================================================== */

function setupButtonLoading() {

    document.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    "[data-loading]"
                );


            if (!button) return;


            if (
                button.dataset.loadingActive ===
                "true"
            ) {

                return;

            }


            button.dataset.loadingActive =
                "true";


            const original =
                button.innerHTML;


            button.dataset.originalHTML =
                original;


            button.innerHTML = `

                <span class="button-loader"></span>

                <span>
                    Please wait...
                </span>

            `;


            setTimeout(
                function() {

                    button.innerHTML =
                        original;


                    button.dataset.loadingActive =
                        "false";

                },
                1500
            );

        }
    );

}



/* =====================================================
   MODAL CLOSE BY ESCAPE
===================================================== */

function setupGlobalEscape() {

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            closeQuickView();

            closeImageViewer();

            closeOrderSuccess();


            const search =
                document.querySelector(
                    ".search-overlay"
                );


            if (search) {

                search.classList.remove(
                    "active"
                );

            }


            const account =
                document.querySelector(
                    ".account-panel"
                );


            if (account) {

                account.classList.remove(
                    "active"
                );

            }

        }
    );

}



/* =====================================================
   BODY MODAL LOCK
===================================================== */

function updateBodyLock() {

    const activeElements =
        document.querySelectorAll(
            ".active.modal, " +
            ".quick-view-modal.active, " +
            ".image-viewer.active, " +
            ".success-modal.active"
        );


    if (activeElements.length) {

        document.body.classList.add(
            "modal-open"
        );

    }

}



/* =====================================================
   ACCESSIBILITY
===================================================== */

function setupAccessibility() {

    const buttons =
        document.querySelectorAll(
            "button"
        );


    buttons.forEach(
        function(button) {

            if (
                !button.getAttribute(
                    "aria-label"
                ) &&
                !button.textContent.trim()
            ) {

                button.setAttribute(
                    "aria-label",
                    "VISHWASH FOODS button"
                );

            }

        }
    );


    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach(
        function(image) {

            if (
                !image.getAttribute(
                    "alt"
                )
            ) {

                image.setAttribute(
                    "alt",
                    "VISHWASH FOODS"
                );

            }

        }
    );

}



/* =====================================================
   PERFORMANCE OPTIMIZATION
===================================================== */

function setupPerformance() {

    /*
     * Passive touch listeners
     */

    document.addEventListener(
        "touchstart",
        function() {},
        {
            passive: true
        }
    );


    /*
     * Remove transition while resizing
     */

    let resizeTimer;


    window.addEventListener(
        "resize",
        function() {

            document.body.classList.add(
                "resizing"
            );


            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function() {

                        document.body.classList.remove(
                            "resizing"
                        );

                    },
                    200
                );

        }
    );

}



/* =====================================================
   WEBSITE LOADED MESSAGE
===================================================== */

function websiteReady() {

    document.body.classList.add(
        "website-ready"
    );


    const loader =
        document.querySelector(
            ".page-loader"
        );


    if (loader) {

        setTimeout(
            function() {

                loader.classList.add(
                    "hide"
                );

            },
            300
        );

    }

}



/* =====================================================
   FINAL INITIALIZATION
===================================================== */

function initializePart9() {

    setupMobileMenu();

    setupSearchOverlay();

    setupProductSearch();

    setupAccountPanel();

    setupResponsiveUI();

    setupConnectionStatus();

    preventDoubleSubmit();

    setupButtonLoading();

    setupGlobalEscape();

    updateBodyLock();

    setupAccessibility();

    setupPerformance();

    websiteReady();

}


/* =====================================================
   START PART 9
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializePart9
    );

}

else {

    initializePart9();

}


/* =====================================================
   PART 9 END
===================================================== */
/* =====================================================
   VISHWASH FOODS
   SCRIPT.JS — PART 10/10
   FINAL INITIALIZATION + SECURITY + UTILITIES
===================================================== */


/* =====================================================
   COMPANY INFORMATION
===================================================== */

window.VISHWASH_FOODS = {

    company:
        "VISHWASH FOODS",

    founder:
        "NIKHIL VAISHNAV",

    mobile:
        "8460183525",

    whatsapp:
        "918460183525"

};



/* =====================================================
   GLOBAL COMPANY DATA UPDATE
===================================================== */

if (typeof COMPANY !== "undefined") {

    COMPANY.name =
        "VISHWASH FOODS";

    COMPANY.founder =
        "NIKHIL VAISHNAV";

    COMPANY.mobile =
        "8460183525";

    COMPANY.whatsapp =
        "918460183525";

}



/* =====================================================
   CURRENT DATE
===================================================== */

function getCurrentDate() {

    const date =
        new Date();


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}



/* =====================================================
   ORDER ID GENERATOR
===================================================== */

function generateOrderID() {

    const random =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    return (
        "VF-" +
        Date.now().toString().slice(-6) +
        "-" +
        random
    );

}



/* =====================================================
   SAVE LAST ORDER
===================================================== */

function saveLastOrder(
    order
) {

    if (!order) {
        return;
    }


    try {

        localStorage.setItem(
            "vishwash_last_order",
            JSON.stringify(
                order
            )
        );

    }

    catch (error) {

        console.warn(
            "Order save failed."
        );

    }

}



/* =====================================================
   GET LAST ORDER
===================================================== */

function getLastOrder() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "vishwash_last_order"
            )
        );

    }

    catch (error) {

        return null;

    }

}



/* =====================================================
   CLEAR LAST ORDER
===================================================== */

function clearLastOrder() {

    localStorage.removeItem(
        "vishwash_last_order"
    );

}



/* =====================================================
   ORDER SUMMARY
===================================================== */

function createOrderSummary() {

    const order = {

        id:
            generateOrderID(),

        date:
            getCurrentDate(),

        company:
            "VISHWASH FOODS",

        founder:
            "NIKHIL VAISHNAV",

        mobile:
            "8460183525",

        items:
            AppState.cart.map(
                function(item) {

                    return {

                        id:
                            item.id,

                        name:
                            item.name,

                        price:
                            Number(
                                item.price
                            ),

                        quantity:
                            Number(
                                item.quantity
                            ),

                        total:
                            Number(
                                item.price
                            ) *
                            Number(
                                item.quantity
                            )

                    };

                }
            ),

        subtotal:
            getCartSubtotal(),

        discount:
            getDiscountAmount(),

        shipping:
            getShippingAmount(),

        total:
            getCartGrandTotal()

    };


    saveLastOrder(
        order
    );


    return order;

}



/* =====================================================
   ORDER NUMBER DISPLAY
===================================================== */

function displayOrderNumber() {

    const order =
        getLastOrder();


    if (!order) {
        return;
    }


    const elements =
        document.querySelectorAll(
            "[data-order-id]"
        );


    elements.forEach(
        function(element) {

            element.textContent =
                order.id;

        }
    );

}



/* =====================================================
   PRINT ORDER
===================================================== */

function printOrder() {

    const order =
        getLastOrder();


    if (!order) {

        showToast(
            "Koi previous order available nahi hai.",
            "warning"
        );

        return;

    }


    window.print();

}



/* =====================================================
   PRINT BUTTON
===================================================== */

function setupPrintButton() {

    const buttons =
        document.querySelectorAll(
            "[data-print-order]"
        );


    buttons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    printOrder();

                }
            );

        }
    );

}



/* =====================================================
   TERMS CHECKBOX
===================================================== */

function setupTermsCheckbox() {

    const forms =
        document.querySelectorAll(
            ".checkout-form"
        );


    forms.forEach(
        function(form) {

            const checkbox =
                form.querySelector(
                    "[name='terms'], " +
                    "#terms"
                );


            if (!checkbox) {
                return;
            }


            form.addEventListener(
                "submit",
                function(event) {

                    if (
                        !checkbox.checked
                    ) {

                        event.preventDefault();


                        showToast(
                            "Please Terms & Conditions accept karein.",
                            "warning"
                        );


                        checkbox.focus();

                    }

                }
            );

        }
    );

}



/* =====================================================
   ADDRESS AUTO SAVE
===================================================== */

function setupAddressMemory() {

    const fields = [

        "customerName",

        "customerPhone",

        "address",

        "city",

        "pincode"

    ];


    fields.forEach(
        function(fieldName) {

            const inputs =
                document.querySelectorAll(
                    "[name='" +
                    fieldName +
                    "']"
                );


            inputs.forEach(
                function(input) {

                    const key =
                        "vishwash_" +
                        fieldName;


                    const saved =
                        localStorage.getItem(
                            key
                        );


                    if (saved) {

                        input.value =
                            saved;

                    }


                    input.addEventListener(
                        "change",
                        function() {

                            localStorage.setItem(
                                key,
                                input.value.trim()
                            );

                        }
                    );

                }
            );

        }
    );

}



/* =====================================================
   CLEAR SAVED ADDRESS
===================================================== */

function clearSavedAddress() {

    const fields = [

        "customerName",

        "customerPhone",

        "address",

        "city",

        "pincode"

    ];


    fields.forEach(
        function(field) {

            localStorage.removeItem(
                "vishwash_" +
                field
            );

        }
    );


    showToast(
        "Saved address clear ho gaya."
    );

}



/* =====================================================
   CLEAR ADDRESS BUTTON
===================================================== */

function setupClearAddress() {

    const buttons =
        document.querySelectorAll(
            "[data-clear-address]"
        );


    buttons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    clearSavedAddress();

                }
            );

        }
    );

}



/* =====================================================
   PRODUCT PRICE PROTECTION
===================================================== */

function normalizeProductPrices() {

    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    cards.forEach(
        function(card) {

            const price =
                getCardPrice(
                    card
                );


            if (price < 0) {

                const priceElement =
                    card.querySelector(
                        ".product-price, .price-current"
                    );


                if (priceElement) {

                    priceElement.textContent =
                        "₹0";

                }

            }

        }
    );

}



/* =====================================================
   EMPTY CART MESSAGE
===================================================== */

function showEmptyCartMessage() {

    const containers =
        document.querySelectorAll(
            ".cart-empty"
        );


    containers.forEach(
        function(container) {

            if (
                AppState.cart.length === 0
            ) {

                container.classList.add(
                    "show"
                );

            }

            else {

                container.classList.remove(
                    "show"
                );

            }

        }
    );

}



/* =====================================================
   UPDATE ALL COUNTERS
===================================================== */

function updateAllCounters() {

    const cartCount =
        typeof getCartItemCount ===
        "function"
            ? getCartItemCount()
            : 0;


    const wishlistCount =
        typeof getWishlistCount ===
        "function"
            ? getWishlistCount()
            : 0;


    document
        .querySelectorAll(
            ".cart-count, [data-cart-count]"
        )
        .forEach(
            function(element) {

                element.textContent =
                    cartCount;

                element.classList.toggle(
                    "has-items",
                    cartCount > 0
                );

            }
        );


    document
        .querySelectorAll(
            ".wishlist-count, [data-wishlist-count]"
        )
        .forEach(
            function(element) {

                element.textContent =
                    wishlistCount;

                element.classList.toggle(
                    "has-items",
                    wishlistCount > 0
                );

            }
        );

}



/* =====================================================
   WATCH CART CHANGES
===================================================== */

function startCartWatcher() {

    let previous =
        JSON.stringify(
            AppState.cart
        );


    setInterval(
        function() {

            const current =
                JSON.stringify(
                    AppState.cart
                );


            if (
                current !== previous
            ) {

                previous =
                    current;


                updateAllCounters();

                showEmptyCartMessage();

            }

        },
        500
    );

}



/* =====================================================
   AUTO UPDATE WISHLIST
===================================================== */

function startWishlistWatcher() {

    setInterval(
        function() {

            updateWishlistButtons();

            updateAllCounters();

        },
        1000
    );

}



/* =====================================================
   PREVENT RIGHT CLICK ON PRODUCT IMAGES
===================================================== */

function setupImageProtection() {

    document.addEventListener(
        "contextmenu",
        function(event) {

            if (
                event.target.closest(
                    ".product-image"
                )
            ) {

                event.preventDefault();

            }

        }
    );

}



/* =====================================================
   PAGE VISIBILITY
===================================================== */

function setupPageVisibility() {

    document.addEventListener(
        "visibilitychange",
        function() {

            if (
                document.hidden
            ) {

                document.title =
                    "VISHWASH FOODS";

            }

            else {

                document.title =
                    "VISHWASH FOODS | Premium Namkeen";

            }

        }
    );

}



/* =====================================================
   UPDATE DOCUMENT TITLE
===================================================== */

function setupDocumentTitle() {

    const originalTitle =
        "VISHWASH FOODS | Premium Namkeen";


    document.title =
        originalTitle;

}



/* =====================================================
   CONSOLE BRAND MESSAGE
===================================================== */

function brandConsoleMessage() {

    console.log(
        "%cVISHWASH FOODS",
        "font-size:24px;font-weight:bold;"
    );


    console.log(
        "Founder: NIKHIL VAISHNAV"
    );


    console.log(
        "Mobile: 8460183525"
    );


    console.log(
        "Premium Namkeen & Snacks"
    );

}



/* =====================================================
   FINAL WEBSITE INITIALIZATION
===================================================== */

function initializeVishwashFoods() {

    setupPrintButton();

    setupTermsCheckbox();

    setupAddressMemory();

    setupClearAddress();

    normalizeProductPrices();

    showEmptyCartMessage();

    updateAllCounters();

    startCartWatcher();

    startWishlistWatcher();

    setupImageProtection();

    setupPageVisibility();

    setupDocumentTitle();

    displayOrderNumber();

    brandConsoleMessage();

}



/* =====================================================
   START FINAL SYSTEM
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function() {

            initializeVishwashFoods();

        }
    );

}

else {

    initializeVishwashFoods();

}



/* =====================================================
   FINAL COMPANY GLOBAL
===================================================== */

window.VISHWASH = {

    company:
        "VISHWASH FOODS",

    founder:
        "NIKHIL VAISHNAV",

    mobile:
        "8460183525",

    whatsapp:
        "918460183525",

    version:
        "1.0.0"

};



/* =====================================================
   FINAL MESSAGE
===================================================== */

console.log(
    "VISHWASH FOODS website system loaded successfully."
);


/* =====================================================
   SCRIPT.JS — ALL 10 PARTS COMPLETE
===================================================== */
