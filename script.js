// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Hero Slider Logic
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        dots[i].classList.remove('active');
    });
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// Auto Slide every 5 seconds
setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

// Interactive Wishlist Counter
let wishlistCount = 0;
function toggleWishlist(button) {
    const icon = button.querySelector('i');
    button.classList.toggle('active');
    
    if (button.classList.contains('active')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        wishlistCount++;
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        wishlistCount--;
    }
    document.getElementById('wishlist-count').innerText = wishlistCount;
}

// Add to Cart Counter
let cartCount = 0;
function addToCart() {
    cartCount++;
    document.getElementById('cart-count').innerText = cartCount;
    alert("Item added to cart successfully!");
}

// Buy Now Direct Checkout Prompt
function buyNow() {
    alert("Redirecting to Secure Checkout...");
}
