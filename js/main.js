/**
 * GitHub 个人主页 - 主脚本
 */

(function () {
    'use strict';

    // ================================
    // DOM 元素
    // ================================
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('themeToggle');
    const backToTop = document.getElementById('backToTop');
    const loader = document.querySelector('.loader');
    const sections = document.querySelectorAll('section[id]');
    const typingElement = document.querySelector('.typing-text');
    const statNumbers = document.querySelectorAll('.stat-number');
    const contactForm = document.getElementById('contactForm');

    // ================================
    // 初始化
    // ================================
    function init() {
        // 主题
        initTheme();

        // 粒子背景
        initParticles();

        // 打字机效果
        if (typingElement) {
            initTypingEffect();
        }

        // 滚动动画观察器
        initScrollObserver();

        // 数字动画观察器
        initNumberObserver();

        // 事件监听
        bindEvents();

        // 隐藏加载器
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    }

    // ================================
    // 主题切换
    // ================================
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
        } else if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ================================
    // 粒子背景
    // ================================
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        let isActive = true;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
                ctx.fill();
            }
        }

        // 根据屏幕大小调整粒子数量
        const particleCount = window.innerWidth < 768 ? 25 : 50;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            const maxDistance = 120;
            const maxConnections = 3;

            for (let i = 0; i < particles.length; i++) {
                let connections = 0;
                for (let j = i + 1; j < particles.length; j++) {
                    if (connections >= maxConnections) break;

                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                        connections++;
                    }
                }
            }
        }

        function animate() {
            if (!isActive) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawConnections();
            animationId = requestAnimationFrame(animate);
        }

        animate();

        // 页面不可见时暂停动画
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isActive = false;
                cancelAnimationFrame(animationId);
            } else {
                isActive = true;
                animate();
            }
        });
    }

    // ================================
    // 打字机效果
    // ================================
    function initTypingEffect() {
        const texts = JSON.parse(typingElement.dataset.texts || '[]');
        if (!texts.length) return;

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseDuration = 2000;

        function type() {
            const currentText = texts[textIndex];

            if (isPaused) {
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                    type();
                }, pauseDuration);
                return;
            }

            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let nextDelay = isDeleting ? deleteSpeed : typeSpeed;

            if (!isDeleting && charIndex === currentText.length) {
                isPaused = true;
                nextDelay = pauseDuration;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                nextDelay = 500;
            }

            setTimeout(type, nextDelay);
        }

        setTimeout(type, 1000);
    }

    // ================================
    // 滚动动画观察器
    // ================================
    function initScrollObserver() {
        const fadeElements = document.querySelectorAll(
            '.about-card, .skill-category, .project-card, .stat-card, .chart-card, .contact-item'
        );

        fadeElements.forEach(el => {
            el.classList.add('fade-in');
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        fadeElements.forEach(el => observer.observe(el));
    }

    // ================================
    // 数字动画观察器
    // ================================
    function initNumberObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNumber(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statNumbers.forEach(el => observer.observe(el));
    }

    function animateNumber(element) {
        const target = parseInt(element.dataset.target, 10);
        if (isNaN(target)) return;

        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // easeOutQuart
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(startValue + (target - startValue) * eased);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ================================
    // 事件绑定
    // ================================
    function bindEvents() {
        // 滚动处理
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            scrollTimeout = requestAnimationFrame(() => {
                handleScroll();
                scrollTimeout = null;
            });
        });

        // 主题切换
        themeToggle.addEventListener('click', toggleTheme);

        // 移动端菜单
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);

        // 导航链接点击
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                scrollToSection(targetId);
                closeMobileMenu();
            });
        });

        // 回到顶部
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // 项目卡片图片区域点击跳转（整个图标区域都可点击）
        document.querySelectorAll('.project-card').forEach(card => {
            const projectLink = card.querySelector('.project-link');
            const projectImage = card.querySelector('.project-image');
            if (projectLink && projectImage) {
                projectImage.addEventListener('click', (e) => {
                    // 如果点击的是 project-link 本身或其子元素，让默认链接行为处理
                    if (e.target.closest('.project-link')) {
                        return;
                    }
                    window.open(projectLink.href, '_blank');
                });
                projectImage.style.cursor = 'pointer';
            }
        });

        // 联系表单
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        // 点击导航栏外部关闭移动端菜单
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    function handleScroll() {
        const scrollY = window.scrollY;

        // 导航栏样式
        navbar.classList.toggle('scrolled', scrollY > 50);

        // 回到顶部按钮
        backToTop.classList.toggle('visible', scrollY > 500);

        // 导航高亮
        updateActiveNav();
    }

    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    function scrollToSection(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;

        const offset = navbar.offsetHeight + 20;
        const top = target.offsetTop - offset;

        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }

    function toggleMobileMenu() {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // 模拟发送
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> 发送成功！';
            btn.style.background = 'linear-gradient(135deg, #34d399, #10b981)';
            contactForm.reset();

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        }, 1500);
    }

    // ================================
    // 启动
    // ================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
