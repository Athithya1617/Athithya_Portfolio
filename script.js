// Antigravity Particle Cursor Logic
const canvas = document.getElementById('cursor-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: 0, y: 0 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Spawn particles on move
    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
    }
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 12 + 10; // Larger for text
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = (Math.random() - 0.5) * 3;
        this.color = this.getRandomColor();
        this.char = this.getRandomChar();
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    }

    getRandomColor() {
        const colors = ['#4000ffff', '#7e0087ff', '#FFFFFF', '#fefefeff', '#550195ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getRandomChar() {
        const chars = ['0', '1', '{', '}', '</>', ';', '[', ']', '++', '=>'];
        return chars[Math.floor(Math.random() * chars.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
        if (this.size > 5) this.size -= 0.1;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.font = `${this.size}px monospace`;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;

        // Digital Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        ctx.fillText(this.char, 0, 0);
        ctx.restore();
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animateParticles);
}

animateParticles();

// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            // Trigger first batch of reveals
            handleReveal();
        }, 1500); // 1.5s delay for the "wow" effect
    }
});

// Scroll Reveal Logic (AOS)
const revealElements = document.querySelectorAll('.reveal');

const handleReveal = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', handleReveal);

// Navigation functionality
const navToggle = document.getElementById('nav-toggle');
const menuLinks = document.querySelectorAll('.menu_link');
const topNav = document.querySelector('.top_nav');

// Close mobile menu when a link is clicked
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navToggle) navToggle.checked = false;
    });
});

// Sticky Header effect on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        topNav.classList.add('nav_scrolled');
    } else {
        topNav.classList.remove('nav_scrolled');
    }
});

// Active link highlighting on scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    menuLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Contact Form handling with FormSubmit
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const response = await fetch("https://formsubmit.co/ajax/athithya1617@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: json
            });

            if (response.ok) {
                formStatus.style.display = 'block';
                formStatus.textContent = "🚀 Message Sent! I'll be in touch shortly.";
                formStatus.className = "form_status success";
                contactForm.reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            formStatus.style.display = 'block';
            formStatus.textContent = "⚠️ Oops! Something went wrong. Please try again.";
            formStatus.className = "form_status error";
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;

            // Auto-hide status message after 5 seconds
            setTimeout(() => {
                formStatus.style.opacity = '0';
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.style.opacity = '1';
                }, 500);
            }, 5000);
        }
    });
}
