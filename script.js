// ========================================
// DIVYANSH MEENA PORTFOLIO — PROFESSIONAL SCRIPT
// ========================================

'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

function throttle(fn, wait) {
    let last = 0;
    return (...args) => {
        const now = Date.now();
        if (now - last >= wait) { last = now; fn(...args); }
    };
}

/* 1. PRELOADER */
window.addEventListener('load', () => {
    const preloader = $('#preloader');
    const bar = $('#preloader-bar');
    const percent = $('#preloader-percent');
    if (!preloader) return;
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 14 + 6;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            bar.style.width = '100%';
            percent.textContent = '100%';
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.remove(), 700);
            }, 350);
            return;
        }
        bar.style.width = progress + '%';
        percent.textContent = Math.floor(progress) + '%';
    }, 70);
});

/* 2. CUSTOM CURSOR */
(function initCursor() {
    if (isTouchDevice || prefersReducedMotion) return;
    const dot = $('#cursor-dot');
    const outline = $('#cursor-outline');
    if (!dot || !outline) return;
    let mx = 0, my = 0, ox = 0, oy = 0;
    window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
    });
    function loop() {
        ox += (mx - ox) * 0.14;
        oy += (my - oy) * 0.14;
        outline.style.left = ox + 'px';
        outline.style.top = oy + 'px';
        requestAnimationFrame(loop);
    }
    loop();
    const hoverTargets = 'a, button, .magnetic-btn, input, textarea, .social-btn, .project-link';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
    });
})();

/* 3. MAGNETIC BUTTONS */
(function initMagnetic() {
    if (isTouchDevice) return;
    $$('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            btn.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.25}px, ${(e.clientY - rect.top - rect.height / 2) * 0.25}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
})();

/* 4. 3D TILT CARDS */
(function initTilt() {
    if (isTouchDevice) return;
    $$('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            card.style.transform = `perspective(1000px) rotateX(${(y - cy) / 12}deg) rotateY(${(cx - x) / 12}deg) scale3d(1.02,1.02,1.02)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
})();

/* 5. TEXT SCRAMBLE */
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const len = Math.max(oldText.length, newText.length);
        const promise = new Promise(r => this.resolve = r);
        this.queue = [];
        for (let i = 0; i < len; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 35);
            const end = start + Math.floor(Math.random() * 35);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) { complete++; output += to; }
            else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span style="color:var(--accent-secondary)">${char}</span>`;
            } else { output += from; }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) this.resolve();
        else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }
    }
}

(function initScramble() {
    $$('.scramble-text').forEach(el => {
        const fx = new TextScramble(el);
        const original = el.dataset.value;
        const next = () => fx.setText(original).then(() => setTimeout(next, 4000));
        setTimeout(next, 1000);
        el.addEventListener('mouseenter', () => fx.setText(original));
    });
})();

/* 6. MOBILE MENU */
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = $('#mobile-menu');
    const navLinks = $('.nav-links');
    if (!mobileMenu || !navLinks) return;
    function toggleMenu(show) {
        mobileMenu.classList.toggle('active', show);
        navLinks.classList.toggle('active', show);
        mobileMenu.setAttribute('aria-expanded', show);
    }
    mobileMenu.addEventListener('click', () => toggleMenu(!navLinks.classList.contains('active')));
    $$('.nav-links a').forEach(link => link.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileMenu.contains(e.target)) toggleMenu(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) toggleMenu(false);
    });
});

/* 7. THEME TOGGLE */
(function initTheme() {
    const toggle = $('#theme-toggle');
    const body = document.body;
    if (!toggle) return;
    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    setTheme(localStorage.getItem('theme') || 'dark');
    toggle.addEventListener('click', () => setTheme(body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
})();

/* 8. HEADER SCROLL */
document.addEventListener('DOMContentLoaded', () => {
    const header = $('.header');
    if (!header) return;
    window.addEventListener('scroll', throttle(() => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, 100), { passive: true });
});

/* 9. SMOOTH SCROLL */
document.addEventListener('DOMContentLoaded', () => {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = $(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = 80;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.pageYOffset - offset,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    });
});

/* 10. ACTIVE NAV LINK */
document.addEventListener('DOMContentLoaded', () => {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-links a');
    if (!sections.length || !navLinks.length) return;
    window.addEventListener('scroll', throttle(() => {
        let current = '';
        sections.forEach(sec => { if (window.pageYOffset >= sec.offsetTop - 250) current = sec.id; });
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
    }, 100), { passive: true });
});

/* 11. SCROLL REVEAL */
document.addEventListener('DOMContentLoaded', () => {
    if (prefersReducedMotion) { $$('.reveal').forEach(el => el.classList.add('active')); return; }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => entry.target.classList.add('active'), delay);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    $$('.reveal').forEach(el => observer.observe(el));
});

/* 12. HERO TYPING */
document.addEventListener('DOMContentLoaded', () => {
    const el = $('.typing-text');
    if (!el) return;
    const words = ['Full-Stack Developer', 'ML Enthusiast', 'Problem Solver', 'CS Undergrad'];
    let wi = 0, li = 0, deleting = false;
    function type() {
        const word = words[wi % words.length];
        el.textContent = deleting ? word.substring(0, li - 1) : word.substring(0, li + 1);
        if (deleting) li--; else li++;
        let delay = deleting ? 35 : 90;
        if (!deleting && li === word.length) { delay = 2000; deleting = true; }
        else if (deleting && li === 0) { deleting = false; wi++; delay = 500; }
        setTimeout(type, delay);
    }
    setTimeout(type, 1000);
});

/* 13. NUMBER COUNTERS */
function animateCounters() {
    $$('.stat-number[data-target]').forEach(counter => {
        const target = +counter.dataset.target;
        const duration = 1400;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else counter.textContent = target;
        }
        requestAnimationFrame(update);
    });
}

/* 14. SKILL BARS */
function animateSkills() {
    $$('.skill-progress[data-width]').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
}

/* 15. SCROLL OBSERVERS */
document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = $('.about-section');
    const skillsSection = $('.skills-section');
    function makeObserver(callback) {
        return new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => { if (entry.isIntersecting) { callback(); obs.unobserve(entry.target); } });
        }, { threshold: 0.25 });
    }
    if (aboutSection) makeObserver(animateCounters).observe(aboutSection);
    if (skillsSection) makeObserver(animateSkills).observe(skillsSection);
});

/* 16. CONTACT FORM — mailto + copy message + gmail fallback */
document.addEventListener('DOMContentLoaded', () => {
    const form = $('#contact-form');
    const copyMsgBtn = $('#copy-msg-btn');
    if (!form) return;

    // Helper to build formatted message
    function buildMessage(name, email, message) {
        return `Hi Divyansh,

You have a new message from your portfolio website.

Name: ${name}
Email: ${email}

Message:
${message}

---
Sent via Portfolio Contact Form`;
    }

    // Main submit: try mailto
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        const original = btn.innerHTML;
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();

        if (!name || !email || !message) {
            showToast('Please fill in all fields.', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        btn.innerHTML = '<span>Opening...</span> <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(buildMessage(name, email, message));
        const mailtoLink = `mailto:divyanshmeena5285@gmail.com?subject=${subject}&body=${body}`;

        // Attempt mailto
        window.location.href = mailtoLink;

        setTimeout(() => {
            showToast('If email app did not open, use the buttons below.', 'success');
            btn.innerHTML = original;
            btn.disabled = false;
        }, 600);
    });

    // Copy full message to clipboard
    if (copyMsgBtn) {
        copyMsgBtn.addEventListener('click', () => {
            const name = form.querySelector('#name').value.trim();
            const email = form.querySelector('#email').value.trim();
            const message = form.querySelector('#message').value.trim();

            if (!name || !email || !message) {
                showToast('Please fill the form first, then click Copy.', 'error');
                return;
            }

            const fullText = buildMessage(name, email, message);
            const toCopy = `To: divyanshmeena5285@gmail.com
Subject: Portfolio Contact from ${name}

${fullText}`;

            function onCopy() {
                copyMsgBtn.classList.add('copied');
                showToast('Full message copied! Paste it in Gmail/Outlook.', 'success');
                setTimeout(() => copyMsgBtn.classList.remove('copied'), 2500);
            }

            if (navigator.clipboard) {
                navigator.clipboard.writeText(toCopy).then(onCopy).catch(() => {
                    const ta = document.createElement('textarea');
                    ta.value = toCopy;
                    ta.style.cssText = 'position:fixed;opacity:0;left:-9999px;';
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                    onCopy();
                });
            } else {
                const ta = document.createElement('textarea');
                ta.value = toCopy;
                ta.style.cssText = 'position:fixed;opacity:0;left:-9999px;';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                onCopy();
            }
        });
    }
});

/* 16b. COPY EMAIL TO CLIPBOARD */
document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = $('#copy-email');
    const emailText = $('#email-text');
    if (!copyBtn || !emailText) return;

    copyBtn.addEventListener('click', async () => {
        const email = emailText.textContent.trim();
        try {
            await navigator.clipboard.writeText(email);
            copyBtn.classList.add('copied');
            copyBtn.title = 'Copied!';
            showToast('Email copied to clipboard!', 'success');
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.title = 'Copy email';
            }, 2000);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = email;
            ta.style.cssText = 'position:fixed;opacity:0;left:-9999px;';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            copyBtn.classList.add('copied');
            showToast('Email copied to clipboard!', 'success');
            setTimeout(() => copyBtn.classList.remove('copied'), 2000);
        }
    });
});

/* 17. TOAST */
function showToast(message, type = 'success') {
    const container = $('#toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); }, 4000);
}

/* 18. PARTICLES */
(function initParticles() {
    const canvas = $('#particle-canvas');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const ACCENT = '16, 185, 129';
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', throttle(resize, 200));
    window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 1.2;
            this.speedY = (Math.random() - 0.5) * 1.2;
            this.opacity = Math.random() * 0.4 + 0.2;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
            if (mouse.x != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    const force = (140 - dist) / 140;
                    this.x -= (dx / dist) * force * 2;
                    this.y -= (dy / dist) * force * 2;
                }
            }
        }
        draw() {
            ctx.fillStyle = `rgba(${ACCENT}, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    const count = window.innerWidth < 768 ? 50 : 120;
    for (let i = 0; i < count; i++) particles.push(new Particle());
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    ctx.strokeStyle = `rgba(${ACCENT}, ${0.12 * (1 - dist / 110)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

/* 19. ORBS */
(function initOrbs() {
    if (isTouchDevice || prefersReducedMotion) return;
    const orb1 = $('.orb-1');
    const orb2 = $('.orb-2');
    const orb3 = $('.orb-3');
    if (!orb1 && !orb2 && !orb3) return;
    window.addEventListener('mousemove', throttle((e) => {
        if (orb1) orb1.style.transform = `translate(${e.clientX * 0.02}px, ${e.clientY * 0.02}px)`;
        if (orb2) orb2.style.transform = `translate(${-e.clientX * 0.015}px, ${-e.clientY * 0.015}px)`;
        if (orb3) orb3.style.transform = `translate(${e.clientX * 0.01}px, ${-e.clientY * 0.01}px)`;
    }, 16));
})();

/* 20. SCROLL INDICATOR */
document.addEventListener('DOMContentLoaded', () => {
    const indicator = $('.scroll-indicator');
    if (!indicator) return;
    window.addEventListener('scroll', throttle(() => {
        indicator.style.opacity = window.scrollY > 80 ? '0' : '0.6';
        indicator.style.pointerEvents = window.scrollY > 80 ? 'none' : 'auto';
    }, 100), { passive: true });
});

/* 21. HERO PARALLAX */
document.addEventListener('DOMContentLoaded', () => {
    const hero = $('.hero-content');
    if (!hero || prefersReducedMotion) return;
    window.addEventListener('scroll', throttle(() => {
        const sy = window.scrollY;
        if (sy < window.innerHeight) {
            hero.style.transform = `translateY(${sy * 0.35}px)`;
            hero.style.opacity = Math.max(0.2, 1 - sy / 550);
        }
    }, 16), { passive: true });
});

/* 22. PROGRESS BAR */
(function initProgress() {
    const bar = $('#progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = (scrollTop / height) * 100 + '%';
    }, 50), { passive: true });
})();

/* 23. BACK TO TOP */
(function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', throttle(() => {
        btn.classList.toggle('visible', window.scrollY > 500);
    }, 100), { passive: true });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
})();

/* 24. DYNAMIC YEAR */
(function initYear() {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

