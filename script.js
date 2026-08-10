document.addEventListener("DOMContentLoaded", () => {
    
    // UI Elements
    const mainProductGrid = document.getElementById("mainProductGrid");
    const drawerProductList = document.getElementById("drawerProductList");

    const productListDrawer = document.getElementById("productListDrawer");
    const checkoutDrawer = document.getElementById("checkoutDrawer");

    const openProductListBtn = document.getElementById("openProductListBtn");
    const heroCatalogBtn = document.getElementById("heroCatalogBtn");
    const closeProductListBtn = document.getElementById("closeProductListBtn");
    const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");

    const orderForm = document.getElementById("orderForm");

    // Initialize Products Render
    renderMainProducts();
    renderDrawerProducts();

    // Event Listeners for Open/Close Drawers
    openProductListBtn.addEventListener("click", () => openDrawer(productListDrawer));
    heroCatalogBtn.addEventListener("click", () => openDrawer(productListDrawer));

    closeProductListBtn.addEventListener("click", () => closeDrawer(productListDrawer));
    closeCheckoutBtn.addEventListener("click", () => closeDrawer(checkoutDrawer));

    // Close slide on clicking outside
    [productListDrawer, checkoutDrawer].forEach(drawer => {
        drawer.addEventListener("click", (e) => {
            if (e.target === drawer) closeDrawer(drawer);
        });
    });

    // RENDER MAIN HOMEPAGE PRODUCTS
    function renderMainProducts() {
        mainProductGrid.innerHTML = productsData.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <span class="cat">${product.category}</span>
                <h3>${product.name}</h3>
                <div class="price">₹${product.price}.00</div>
                <button class="btn btn-primary buy-now-btn" onclick="initiateCheckout('${product.id}')">
                    <i class="fa-solid fa-cart-shopping"></i> Buy Now
                </button>
            </div>
        `).join('');
    }

    // RENDER DRAWER (PRODUCT LIST SLIDE) PRODUCTS
    function renderDrawerProducts() {
        drawerProductList.innerHTML = productsData.map(product => `
            <div class="drawer-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="drawer-item-details">
                    <h4>${product.name}</h4>
                    <span>₹${product.price}.00</span>
                </div>
                <button class="btn btn-primary" onclick="initiateCheckout('${product.id}')">
                    Buy
                </button>
            </div>
        `).join('');
    }

    // DRAWER CONTROL FUNCTIONS
    function openDrawer(drawerElement) {
        drawerElement.classList.add("active");
    }

    function closeDrawer(drawerElement) {
        drawerElement.classList.remove("active");
    }

    // TRIGGER CHECKOUT SLIDE FOR A SPECIFIC PRODUCT
    window.initiateCheckout = function(productId) {
        const selectedProduct = productsData.find(p => p.id === productId);

        if (!selectedProduct) return;

        // Fill details in checkout slide
        document.getElementById("checkoutTitle").innerText = selectedProduct.name;
        document.getElementById("checkoutPrice").innerText = `₹${selectedProduct.price}.00`;
        document.getElementById("checkoutImg").src = selectedProduct.image;
        document.getElementById("subtotalPrice").innerText = `₹${selectedProduct.price}.00`;
        document.getElementById("finalPrice").innerText = `₹${selectedProduct.price}.00`;

        // If product list slide is open, close it
        closeDrawer(productListDrawer);

        // Open checkout slide
        openDrawer(checkoutDrawer);
    };

    // FORM SUBMISSION & ORDER CONFIRMATION
    orderForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const customerName = document.getElementById("fullName").value;
        const productName = document.getElementById("checkoutTitle").innerText;

        // Reset & Close
        orderForm.reset();
        closeDrawer(checkoutDrawer);

        // Show Toast Notification
        showToast(`Thank you ${customerName}! Your order for ${productName} is placed.`);
    });

    // TOAST NOTIFICATION FUNCTION
    function showToast(msg) {
        const toast = document.getElementById("toast");
        document.getElementById("toastMessage").innerText = msg;
        
        toast.classList.add("active");

        setTimeout(() => {
            toast.classList.remove("active");
        }, 4000);
    }
});
