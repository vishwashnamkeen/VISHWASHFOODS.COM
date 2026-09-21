const ADMIN_PHONE = '918460183525';
const poolPhotos = [
    '1523275335684-37898b6baf30', '1505740420928-5e560c06d30e', '1546868871-7041f2a55e12',
    '1583394838336-acd977736f90', '1572569511254-d8f925fe2cbb', '1511707171634-5f897ff02aa9',
    '1526170375885-4d8ecf77b99f', '1542291026-7eec264c27ff', '1359586543673-9ec078b30d31',
    '1550745165-9bc0b252726f', '1507679799987-c73779587ccf', '1591047139829-d91aecb6caea',
    '1522335789203-aabd1fc54bc9', '1533575747076-0db72165de50', '1503602642458-232111445657'
];

const rawTemplates = [
    { name: 'Pro Wireless Earbuds', category: 'Audio', price: 999 },
    { name: 'AMOLED Smart Watch', category: 'Wearables', price: 1999 },
    { name: 'Genuine Leather Wallet', category: 'Accessories', price: 499 },
    { name: 'Fast Power Bank 10000mAh', category: 'Power', price: 1299 },
    { name: 'Polarized UV Sunglasses', category: 'Accessories', price: 699 },
    { name: 'RGB Gaming Mouse', category: 'Gaming', price: 899 },
    { name: 'Neckband Bass Edition', category: 'Audio', price: 799 },
    { name: 'Type-C Braided Cable 2M', category: 'Accessories', price: 299 },
    { name: 'Portable Bluetooth Speaker', category: 'Audio', price: 1499 },
    { name: 'Mechanical RGB Keyboard', category: 'Gaming', price: 2499 },
    { name: 'Wireless Charging Pad 15W', category: 'Power', price: 999 },
    { name: 'Smart Digital Weight Scale', category: 'Home', price: 1199 },
    { name: 'USB-C Multiport 6-in-1 Hub', category: 'Accessories', price: 1599 },
    { name: 'LED Touch Desk Lamp', category: 'Home', price: 899 },
    { name: 'Anti-Theft Travel Backpack', category: 'Accessories', price: 1899 },
    { name: 'Mini Portable Travel Iron', category: 'Home', price: 1299 },
    { name: 'Insulated Stainless Steel Flask', category: 'Home', price: 699 },
    { name: 'Car Dashboard Mobile Holder', category: 'Accessories', price: 399 },
    { name: 'Ring Light with Tripod', category: 'Home', price: 1399 },
    { name: 'Electric Precision Hair Trimmer', category: 'Wearables', price: 999 },
    { name: 'Active Noise Canceling Pods', category: 'Audio', price: 2199 },
    { name: 'Fitness Smart Ring', category: 'Wearables', price: 2999 },
    { name: 'GaN Ultra Fast Charger 65W', category: 'Power', price: 1799 },
    { name: 'Gaming Headset 7.1 Surround', category: 'Gaming', price: 1699 },
    { name: 'Smart Wi-Fi Bulb Duo', category: 'Home', price: 799 }
];

let products = rawTemplates.map((item, idx) => {
    const sig = poolPhotos[idx % poolPhotos.length];
    const sec = poolPhotos[(idx + 4) % poolPhotos.length];
    const primaryImg = `https://images.unsplash.com/photo-${sig}?w=400&auto=format&fit=crop&q=80`;
    return {
        id: idx + 1,
        name: `${item.name}`,
        category: item.category,
        originalPrice: item.price,
        price: Math.round(item.price * 0.9),
        seller: 'Vishwash Official',
        image: primaryImg,
        gallery: [primaryImg, primaryImg, `https://images.unsplash.com/photo-${sec}?w=500&auto=format&fit=crop&q=80`],
        reviews: [
            { user: 'Rahul K.', rating: 5, comment: 'Bohot accha product hai!' },
            { user: 'Sneha P.', rating: 4, comment: '10% discount ke sath mast.' }
        ]
    };
});

let cart = [];
let wishlist = [];
let orders = JSON.parse(localStorage.getItem('vishwash_orders_spacious')) || [];
let searchQuery = '';
let selectedCategory = 'All';
let userGPSString = 'Not Shared';

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    updateWishlistUI();
    updateOrdersUI();
    setupSearch();
});

function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast-slide bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 pointer-events-auto`;
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-blue-400"></i><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2500);
}

function switchTab(tabName) {
    ['shop', 'wishlist', 'orders'].forEach(t => {
        const el = document.getElementById(`view-${t}`);
        if(el) el.classList.add('hidden');
    });
    const target = document.getElementById(`view-${tabName}`);
    if(target) target.classList.remove('hidden');
    
    if(tabName === 'shop') renderProducts();
    if(tabName === 'wishlist') renderWishlist();
    if(tabName === 'orders') updateOrdersUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupSearch() {
    const input = document.getElementById('search-input');
    if(input) {
        input.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderProducts();
        });
    }
}

function filterCategory(cat) {
    selectedCategory = cat;
    document.querySelectorAll('.cat-chip').forEach(btn => {
        btn.className = 'cat-chip whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold bg-white border border-slate-200 text-slate-700 transition hover-anim';
    });
    const activeBtn = document.getElementById(`cat-btn-${cat}`);
    if(activeBtn) {
        activeBtn.className = 'cat-chip whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold bg-blue-600 text-white shadow-xs transition hover-anim';
    }
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    const countEl = document.getElementById('product-count');
    if(!grid) return;

    const filtered = products.filter(p => {
        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.category.toLowerCase().includes(searchQuery);
        return matchesCat && matchesSearch;
    });
    if(countEl) countEl.innerText = `${filtered.length} products found`;

    grid.innerHTML = filtered.map(p => {
        const isWished = wishlist.includes(p.id);
        return `
            <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between p-2.5 sm:p-3.5 gap-2">
                <div class="relative overflow-hidden aspect-square bg-slate-50 rounded-xl cursor-pointer" onclick="openProductDetail(${p.id})">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover rounded-xl hover:scale-105 transition-transform duration-500">
                    <span class="absolute top-1.5 left-1.5 bg-emerald-600/90 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">10% OFF</span>
                    <button onclick="event.stopPropagation(); toggleWishlist(${p.id})" class="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-xs shadow transition hover-icon-anim ${isWished ? 'text-red-500 bg-red-50' : 'text-slate-400'}">
                        <i class="fa-${isWished ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                </div>
                <div class="flex-1 flex flex-col justify-between" onclick="openProductDetail(${p.id})">
                    <div>
                        <span class="text-[9px] font-bold text-blue-600 uppercase">${p.category}</span>
                        <h3 class="font-bold text-slate-800 text-[11px] sm:text-xs line-clamp-1 mb-1">${p.name}</h3>
                        <div class="flex items-center gap-1.5">
                            <span class="text-xs sm:text-sm font-extrabold text-slate-900">₹${p.price}</span>
                            <span class="text-[9px] text-slate-400 line-through">₹${p.originalPrice}</span>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-1.5 pt-1">
                    <button onclick="addToCart(${p.id})" class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-[10px] transition hover-anim flex items-center justify-center gap-1">
                        <i class="fa-solid fa-bag-shopping text-blue-600"></i> Cart
                    </button>
                    <button onclick="buyNowDirect(${p.id})" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-[10px] transition hover-anim flex items-center justify-center gap-1 shadow-xs">
                        <i class="fa-solid fa-bolt"></i> RED BUY
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function toggleWishlist(id) {
    const idx = wishlist.indexOf(id);
    if(idx > -1) { wishlist.splice(idx, 1); showToast("Wishlist se हटाया गया"); }
    else { wishlist.push(id); showToast("Wishlist me जोड़ा गया!"); }
    updateWishlistUI();
    const shopView = document.getElementById('view-shop');
    if(shopView && !shopView.classList.contains('hidden')) renderProducts();
}

function updateWishlistUI() {
    const badge = document.getElementById('wishlist-badge');
    if(badge) badge.innerText = wishlist.length;
}

function renderWishlist() {
    const grid = document.getElementById('wishlist-grid');
    if(!grid) return;
    const wishedProds = products.filter(p => wishlist.includes(p.id));
    if(wishedProds.length === 0) { 
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400 text-xs">Aapki wishlist khaali hai.</div>`; 
        return; 
    }
    grid.innerHTML = wishedProds.map(p => `
        <div class="bg-white rounded-2xl border p-2 text-xs flex flex-col justify-between">
            <div>
                <img src="${p.image}" class="w-full aspect-square object-cover rounded-xl mb-1.5 cursor-pointer" onclick="openProductDetail(${p.id})">
                <h4 class="font-bold text-[11px] line-clamp-1">${p.name}</h4>
                <p class="font-extrabold text-xs mt-1">₹${p.price}</p>
            </div>
            <button onclick="addToCart(${p.id})" class="w-full bg-blue-600 text-white font-bold py-1.5 rounded-xl text-[10px] mt-2 hover-anim">Move to Cart</button>
        </div>
    `).join('');
}

function addToCart(id) {
    const prod = products.find(p => p.id === id);
    if(!prod) return;
    const found = cart.find(c => c.id === id);
    if(found) found.qty += 1;
    else cart.push({ ...prod, qty: 1 });
    updateCartUI();
    showToast(`${prod.name.split(' (')[0]} Cart me joda gaya!`);
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    if(badge) badge.innerText = totalCount;

    const container = document.getElementById('cart-items-container');
    const grandTotalEl = document.getElementById('cart-grand-total');
    if(!container) return;

    if(cart.length === 0) {
        container.innerHTML = `<div class="text-center py-10 text-slate-400 text-xs">Cart khaali hai.</div>`;
        if(grandTotalEl) grandTotalEl.innerText = '₹0';
        return;
    }
    let grandTotal = 0;
    container.innerHTML = cart.map(item => {
        const sub = item.price * item.qty;
        grandTotal += sub;
        return `
            <div class="py-2.5 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    <img src="${item.image}" class="w-10 h-10 rounded-xl object-cover">
                    <div>
                        <h4 class="font-bold text-xs text-slate-800 line-clamp-1">${item.name}</h4>
                        <p class="text-[11px] font-extrabold text-blue-600">₹${item.price} x ${item.qty}</p>
                    </div>
                </div>
                <div class="flex items-center gap-1">
                    <button onclick="changeQty(${item.id}, -1)" class="w-6 h-6 rounded-lg bg-slate-100 font-bold">-</button>
                    <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
                    <button onclick="changeQty(${item.id}, 1)" class="w-6 h-6 rounded-lg bg-slate-100 font-bold">+</button>
                </div>
            </div>
        `;
    }).join('');
    if(grandTotalEl) grandTotalEl.innerText = `₹${grandTotal}`;
}

function changeQty(id, delta) {
    const found = cart.find(c => c.id === id);
    if(!found) return;
    found.qty += delta;
    if(found.qty <= 0) cart = cart.filter(c => c.id !== id);
    updateCartUI();
}

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const panel = document.getElementById('cart-panel');
    const backdrop = document.getElementById('cart-backdrop');
    if(!drawer || !panel || !backdrop) return;

    if(drawer.classList.contains('invisible')) {
        drawer.classList.remove('invisible');
        setTimeout(() => { backdrop.style.opacity = '1'; panel.classList.remove('translate-x-full'); }, 10);
    } else {
        backdrop.style.opacity = '0'; 
        panel.classList.add('translate-x-full');
        setTimeout(() => drawer.classList.add('invisible'), 300);
    }
}

function buyNowDirect(id) {
    const p = products.find(x => x.id === id);
    if(!p) return;
    cart = [{ ...p, qty: 1 }];
    updateCartUI();
    openCheckoutModal();
}

function openProductDetail(id) {
    const p = products.find(prod => prod.id === id);
    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('pd-content');
    const backdrop = document.getElementById('pd-backdrop');
    const panel = document.getElementById('pd-panel');
    if(!p || !modal || !content) return;

    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
                <img id="main-prod-img" src="${p.gallery[0]}" class="w-full aspect-square rounded-2xl object-cover mb-2">
                <div class="grid grid-cols-3 gap-2">
                    ${p.gallery.map(img => `<img src="${img}" onclick="document.getElementById('main-prod-img').src='${img}'" class="w-full aspect-square rounded-xl object-cover cursor-pointer border hover:border-blue-500">`).join('')}
                </div>
            </div>
            <div class="flex flex-col justify-between space-y-3">
                <div>
                    <span class="text-[10px] font-bold text-blue-600 uppercase">${p.category}</span>
                    <h2 class="text-base sm:text-lg font-extrabold text-slate-900 mt-1 mb-1.5">${p.name}</h2>
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-xl font-extrabold text-slate-900">₹${p.price}</span>
                        <span class="text-xs text-slate-400 line-through">₹${p.originalPrice}</span>
                        <span class="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">10% OFF</span>
                    </div>
                    <div class="bg-slate-50 p-3 rounded-2xl border space-y-1.5 mb-3">
                        <h4 class="font-bold text-slate-700">Customer Reviews ⭐ 4.6/5</h4>
                        ${p.reviews.map(r => `<div class="bg-white p-2 rounded-xl border text-[10px]"><b>${r.user}:</b>${r.comment}</div>`).join('')}
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="addToCart(${p.id}); closeProductDetail();" class="bg-slate-900 text-white font-bold py-3 rounded-2xl hover-anim flex items-center justify-center gap-1.5"><i class="fa-solid fa-bag-shopping"></i> Add Cart</button>
                    <button onclick="buyNowDirect(${p.id}); closeProductDetail();" class="bg-red-600 text-white font-bold py-3 rounded-2xl hover-anim flex items-center justify-center gap-1.5"><i class="fa-solid fa-bolt"></i> RED BUY</button>
                </div>
            </div>
        </div>
    `;
    modal.classList.remove('invisible');
    setTimeout(() => { 
        if(backdrop) backdrop.style.opacity = '1'; 
        if(panel) { panel.style.transform = 'scale(1)'; panel.style.opacity = '1'; }
    }, 10);
}

function closeProductDetail() {
    const modal = document.getElementById('product-detail-modal');
    if(modal) modal.classList.add('invisible');
}

function openCheckoutModal() {
    if(cart.length === 0) { showToast("Cart khaali hai!"); return; }
    const drawer = document.getElementById('cart-drawer');
    if(drawer && !drawer.classList.contains('invisible')) toggleCart();
    const modal = document.getElementById('checkout-modal');
    if(modal) modal.classList.remove('invisible');
}

function closeCheckoutModal() { 
    const modal = document.getElementById('checkout-modal');
    if(modal) modal.classList.add('invisible'); 
}

function fetchUserLocation() {
    const status = document.getElementById('geo-status');
    if(status) status.innerText = "Location detect ho rahi hai...";
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            userGPSString = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
            if(status) status.innerText = `GPS Locked: ${userGPSString}`;
        }, () => { if(status) status.innerText = "GPS permission deni hogi."; });
    } else { if(status) status.innerText = "GPS not supported."; }
}

function verifyPincodeAndBuy(e) {
    e.preventDefault();
    const nameEl = document.getElementById('cust-name');
    const phoneEl = document.getElementById('cust-phone');
    const pincodeEl = document.getElementById('cust-pincode');
    const addressEl = document.getElementById('cust-address');
    if(!nameEl || !phoneEl || !pincodeEl || !addressEl) return;

    const name = nameEl.value;
    const phone = phoneEl.value;
    const pincode = pincodeEl.value;
    const address = addressEl.value;
    if(!/^[0-9]{6}$/.test(pincode)) { showToast("Sahi 6-digit Pincode dalein!"); return; }

    const grandTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const orderObj = {
        id: 'VS-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString('hi-IN'),
        name, phone, pincode, address, gps: userGPSString,
        items: [...cart], total: grandTotal
    };

    orders.unshift(orderObj);
    localStorage.setItem('vishwash_orders_spacious', JSON.stringify(orders));
    cart = [];
    updateCartUI();
    updateOrdersUI();
    closeCheckoutModal();

    let msg = `*New Order - Vishwash Store*\nOrder ID: ${orderObj.id}\nNaam: ${name}\nPhone: ${phone}\nPincode: ${pincode}\nAddress: ${address}\nGPS: ${userGPSString}\n\n*Items (10% OFF):*\n`;
    orderObj.items.forEach(i => { msg += `- ${i.name} x ${i.qty} = ₹${i.price * i.qty}\n`; });
    msg += `\n*Total Payable: ₹${grandTotal} (COD)*`;
    window.open(`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
    
    const celebModal = document.getElementById('celebration-modal');
    if(celebModal) celebModal.classList.remove('invisible');
}

function updateOrdersUI() {
    const badge = document.getElementById('orders-badge');
    if(badge) badge.innerText = orders.length;
    const list = document.getElementById('orders-list');
    if(!list) return;
    if(orders.length === 0) { 
        list.innerHTML = `<div class="text-center py-10 text-slate-400 text-xs">Abhi tak koi order nahi hai.</div>`; 
        return; 
    }
    list.innerHTML = orders.map(o => `
        <div class="bg-white border rounded-2xl p-3 text-xs shadow-xs flex justify-between">
            <div>
                <div class="font-extrabold text-slate-900">${o.id}</div>
                <p class="text-slate-500 text-[10px]">${o.date} | Pincode: ${o.pincode}</p>
            </div>
            <div class="text-right font-extrabold">₹${o.total}</div>
        </div>
    `).join('');
}

function handleCameraSearch(e) {
    if(!e.target.files[0]) return;
    const matched = products[Math.floor(Math.random() * products.length)];
    const resultEl = document.getElementById('camera-match-result');
    if(resultEl) {
        resultEl.innerHTML = `
            <img src="${matched.image}" class="w-16 h-16 object-cover mx-auto rounded-xl mb-1.5">
            <div class="font-bold text-xs">${matched.name}</div>
            <div class="font-extrabold text-blue-600 mb-2">₹${matched.price}</div>
            <button onclick="buyNowDirect(${matched.id}); document.getElementById('camera-match-modal').classList.add('invisible');" class="bg-red-600 text-white px-3 py-1.5 rounded-xl font-bold text-[10px]">RED BUY MATCHED</button>
        `;
    }
    const matchModal = document.getElementById('camera-match-modal');
    if(matchModal) matchModal.classList.remove('invisible');
    showToast('Camera scan complete!');
}

function startVoiceSearch() {
    if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SpeechRecognition();
        rec.lang = 'hi-IN';
        rec.onresult = (event) => {
            const txt = event.results[0][0].transcript;
            const searchInput = document.getElementById('search-input');
            if(searchInput) searchInput.value = txt;
            searchQuery = txt.toLowerCase();
            renderProducts();
            showToast(`Voice Search: ${txt}`);
        };
        rec.start();
    } else { showToast('Text search active'); }
}

function openSellerModal() { 
    const modal = document.getElementById('seller-modal');
    if(modal) modal.classList.remove('invisible'); 
}

function closeSellerModal() { 
    const modal = document.getElementById('seller-modal');
    if(modal) modal.classList.add('invisible'); 
}

function handleSellerAddProduct(e) {
    e.preventDefault();
    const sNameEl = document.getElementById('seller-name-input');
    const sStoreEl = document.getElementById('seller-store-input');
    const pTitleEl = document.getElementById('sp-name');
    const pCatEl = document.getElementById('sp-category');
    const origPriceEl = document.getElementById('sp-price');
    const customImgEl = document.getElementById('sp-image');
    if(!sNameEl || !pTitleEl || !origPriceEl) return;

    const sName = sNameEl.value;
    const sStore = sStoreEl ? sStoreEl.value : 'Store';
    const pTitle = pTitleEl.value;
    const pCat = pCatEl ? pCatEl.value : 'Accessories';
    const origPrice = Number(origPriceEl.value);
    const customImg = customImgEl ? customImgEl.value.trim() : '';

    products.unshift({
        id: products.length + 1,
        name: `${pTitle} (${sStore})`,
        category: pCat,
        originalPrice: origPrice,
        price: Math.round(origPrice * 0.9),
        seller: `${sName}`,
        image: customImg || products[0].image,
        gallery: [customImg || products[0].image],
        reviews: [{user:'Verified Seller', rating:5, comment:'New live item'}]
    });
    closeSellerModal();
    renderProducts();
    showToast('Seller product live 10% OFF!');
}
