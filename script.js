// Function for Smooth Scrolling to Products Section
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to Direct Order via WhatsApp
function orderOnWhatsApp(productName) {
    // Apna WhatsApp phone number yahan likhein (Country Code 91 ke saath)
    const phoneNumber = "919876543210"; 
    
    // Custom message text
    const message = `Hello Vishwash Foods! I would like to order: ${productName}. Please share details.`;
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
}

// Smooth scroll for Header navigation links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
