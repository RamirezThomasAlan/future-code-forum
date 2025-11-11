// Loader
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 3000);
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// Particles Background
function createParticles() {
    const container = document.getElementById('particlesContainer');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 3 + 1;
        
        // Random animation
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        // Random movement direction
        const tx = Math.random() * 100 - 50;
        const ty = Math.random() * 100 - 50;
        
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.animation = `float ${duration}s ${delay}s infinite linear`;
        
        container.appendChild(particle);
    }
}

createParticles();

// Scroll Animations
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.counter-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Testimonials Slider
let currentTestimonial = 0;
const testimonialsContainer = document.getElementById('testimonialsContainer');
const testimonialCount = document.querySelectorAll('.testimonial').length;

function showTestimonial(index) {
    testimonialsContainer.style.transform = `translateX(-${index * 100}%)`;
}

document.getElementById('nextTestimonial').addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % testimonialCount;
    showTestimonial(currentTestimonial);
});

document.getElementById('prevTestimonial').addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + testimonialCount) % testimonialCount;
    showTestimonial(currentTestimonial);
});

// Auto slide testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonialCount;
    showTestimonial(currentTestimonial);
}, 5000);

// Gallery Interactions
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

let currentImageIndex = 0;
const galleryImages = Array.from(galleryItems).map(item => item.querySelector('.gallery-img').src);

galleryItems.forEach((item, index) => {
    const img = item.querySelector('.gallery-img');
    const favoriteBtn = item.querySelector('.favorite-btn');
    const shareBtn = item.querySelector('.share-btn');
    
    // Open modal on image click
    img.addEventListener('click', () => {
        currentImageIndex = index;
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modal.classList.add('active');
    });
    
    // Favorite functionality
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        favoriteBtn.style.color = favoriteBtn.style.color === 'red' ? '' : 'red';
        
        // Save to localStorage
        const favorites = JSON.parse(localStorage.getItem('galleryFavorites') || '[]');
        const imgSrc = img.src;
        
        if (favorites.includes(imgSrc)) {
            const index = favorites.indexOf(imgSrc);
            favorites.splice(index, 1);
        } else {
            favorites.push(imgSrc);
        }
        
        localStorage.setItem('galleryFavorites', JSON.stringify(favorites));
        showNotification('Favoritos actualizados');
    });
    
    // Share functionality
    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (navigator.share) {
            navigator.share({
                title: 'FutureCode Forum 2025',
                text: 'Mira esta imagen de FutureCode Forum',
                url: window.location.href,
            })
            .then(() => showNotification('¡Contenido compartido!'))
            .catch(error => console.log('Error sharing:', error));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
                .then(() => showNotification('Enlace copiado al portapapeles'))
                .catch(err => console.error('Error copying to clipboard:', err));
        }
    });
});