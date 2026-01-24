const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

// Create backdrop overlay
const backdrop = document.createElement('div');
backdrop.className = 'menu-backdrop';
backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 998;
`;
document.body.appendChild(backdrop);

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    
    // Toggle backdrop
    if (navLinks.classList.contains("active")) {
        backdrop.style.opacity = '1';
        backdrop.style.visibility = 'visible';
    } else {
        backdrop.style.opacity = '0';
        backdrop.style.visibility = 'hidden';
    }
});

// Close menu when clicking backdrop
backdrop.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    backdrop.style.opacity = '0';
    backdrop.style.visibility = 'hidden';
});

// Close menu when clicking a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        backdrop.style.opacity = '0';
        backdrop.style.visibility = 'hidden';
    });
});

// DArk - light mode

const darkmodeButton = document.getElementById("darkmodeButton");
const body = document.body;

const enableDarkMode = () => {
    body.classList.add("dark-mode");
}

const disableDarkMode = () => {
    body.classList.remove("dark-mode");
}

darkmodeButton.addEventListener("change", () => {
    if (darkmodeButton.checked) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// Multiple type

const typed = new Typed('.multiple', {
    strings:['Front-End Developer', 'Back-End Developer', 'UI-UX Designer', 'Guitarist'],
    typeSpeed:100,
    backSpeed:100,
    backDelay:1000,
    loop:true
});

// Scroll-Synced Profile Image Transition Animation
let floatingImage = null;

function initScrollSyncedProfileAnimation() {
    const homeImg = document.querySelector('.home .right .profile img');
    const aboutImg = document.querySelector('.about .about-image img');
    
    if (!homeImg || !aboutImg) return;
    
    // Create a persistent floating image that stays in the DOM
    function createFloatingImage() {
        const homeImgRect = homeImg.getBoundingClientRect();
        
        const floating = homeImg.cloneNode(true);
        floating.classList.add('profile-floating');
        floating.style.position = 'fixed';
        floating.style.zIndex = '500';
        floating.style.pointerEvents = 'none';
        floating.style.margin = '0';
        floating.style.transition = 'none'; // Disable all transitions
        
        // Set exact size from home image (keep it constant - no size changes)
        const size = homeImgRect.width;
        floating.style.width = size + 'px';
        floating.style.height = size + 'px';
        floating.style.minWidth = size + 'px';
        floating.style.minHeight = size + 'px';
        floating.style.maxWidth = size + 'px';
        floating.style.maxHeight = size + 'px';
        floating.style.top = '0';
        floating.style.left = '0';
        
        // Maintain circular shape
        floating.style.borderRadius = '50%';
        floating.style.objectFit = 'cover';
        floating.style.objectPosition = 'top';
        
        // Start hidden but keep in GPU memory
        floating.style.opacity = '0.001';
        floating.style.visibility = 'hidden';
        
        document.body.appendChild(floating);
        return floating;
    }
    
    // Calculate scroll progress between home and about sections
    function getScrollProgress() {
        const homeSection = document.querySelector('.home');
        const aboutSection = document.querySelector('.about');
        
        const homeSectionBottom = homeSection.offsetTop + homeSection.offsetHeight;
        const aboutSectionTop = aboutSection.offsetTop;
        const aboutSectionMiddle = aboutSectionTop + (aboutSection.offsetHeight / 3);
        
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        const startPoint = homeSectionBottom - 200;
        const endPoint = aboutSectionMiddle;
        const totalDistance = endPoint - startPoint;
        
        if (scrollPosition <= startPoint) return 0;
        if (scrollPosition >= endPoint) return 1;
        
        return (scrollPosition - startPoint) / totalDistance;
    }
    
    // Interpolate position between two points
    function lerp(start, end, progress) {
        return start + (end - start) * progress;
    }
    
    // Easing function for smoother animation
    function easeInOutCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
    
    // Update floating image position based on scroll
    function updateFloatingImage() {
        const progress = getScrollProgress();
        const easedProgress = easeInOutCubic(progress);
        
        if (progress > 0 && progress < 1) {
            // Animation in progress - show floating image, hide originals
            homeImg.style.transition = 'none';
            homeImg.style.opacity = '0';
            aboutImg.style.transition = 'none';
            aboutImg.style.opacity = '0';
            floatingImage.style.visibility = 'visible';
            floatingImage.style.opacity = '1';
            
            // Get current image positions
            const homeRect = homeImg.getBoundingClientRect();
            const aboutRect = aboutImg.getBoundingClientRect();
            
            // Calculate translate values
            const startX = homeRect.left;
            const startY = homeRect.top;
            const endX = aboutRect.left;
            const endY = aboutRect.top;
            
            const currentX = lerp(startX, endX, easedProgress);
            const currentY = lerp(startY, endY, easedProgress);
            
            // Use transform for GPU-accelerated smooth animation
            floatingImage.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            
        } else {
            // Outside animation range - hide floating, show appropriate original
            floatingImage.style.opacity = '0.001';
            floatingImage.style.visibility = 'hidden';
            
            if (progress >= 1) {
                // In about section
                aboutImg.style.transition = '';
                aboutImg.style.opacity = '1';
                homeImg.style.transition = 'none';
                homeImg.style.opacity = '0';
            } else {
                // In home section
                homeImg.style.transition = '';
                homeImg.style.opacity = '1';
                aboutImg.style.transition = 'none';
                aboutImg.style.opacity = '0';
            }
        }
    }
    
    // Create the floating image once on initialization
    floatingImage = createFloatingImage();
    
    // Add scroll listener with throttling for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateFloatingImage();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial check
    updateFloatingImage();
}

// Initialize animation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollSyncedProfileAnimation);
} else {
    initScrollSyncedProfileAnimation();
}

// Skills Progress Bar Animation
function initSkillsAnimation() {
    const skillsSection = document.querySelector('.skills');
    const skillBars = document.querySelectorAll('.skill-progress');
    
    if (!skillsSection || skillBars.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate when entering viewport
                animateSkills();
            } else {
                // Reset when leaving viewport
                resetSkills();
            }
        });
    }, {
        threshold: 0.3
    });
    
    observer.observe(skillsSection);
    
    function animateSkills() {
        skillBars.forEach((bar, index) => {
            const progress = bar.getAttribute('data-progress');
            
            // Stagger the animations
            setTimeout(() => {
                bar.style.setProperty('--progress-width', progress + '%');
                bar.classList.add('animate');
            }, index * 100);
        });
    }
    
    function resetSkills() {
        skillBars.forEach((bar) => {
            bar.style.setProperty('--progress-width', '0%');
            bar.classList.remove('animate');
        });
    }
}

// Initialize skills animation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkillsAnimation);
} else {
    initSkillsAnimation();
}

// Navbar Scroll Effect
function initNavbarScrollEffect() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Active Section Highlighting
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function updateActiveLink() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop - 150) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial check
}

// Initialize navbar enhancements
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initNavbarScrollEffect();
        initActiveNavLinks();
    });
} else {
    initNavbarScrollEffect();
    initActiveNavLinks();
}

// Smooth Scroll with Navbar Offset
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;
            
            // Calculate offset for fixed navbar
            const navbarHeight = 100; // Adjust based on navbar height + gap
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Initialize smooth scroll
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
    initSmoothScroll();
}

// Contact Form Handling with EmailJS
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Initialize EmailJS with your public key
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init('4d9Jd2_CS3hI1SRrO');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get submit button
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Send email using EmailJS
        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs
        emailjs.sendForm('service_zfttm5e', 'template_zn6ft5m', contactForm)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Success message
                submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';
                submitBtn.style.borderColor = '#28a745';
                
                // Reset form
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.disabled = false;
                }, 3000);
                
            }, function(error) {
                console.log('FAILED...', error);
                
                // Error message
                submitBtn.innerHTML = '<span>Failed to Send</span><i class="fas fa-times"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #dc3545, #e84855)';
                submitBtn.style.borderColor = '#dc3545';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
    });
}

// Initialize contact form
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}