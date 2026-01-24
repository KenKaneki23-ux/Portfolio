const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
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
        
        // Set exact size from home image (keep it square and circular)
        const size = homeImgRect.width;
        floating.style.width = size + 'px';
        floating.style.height = size + 'px';
        floating.style.top = '0';
        floating.style.left = '0';
        
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