document.addEventListener("DOMContentLoaded", () => {
    // 1. Live Time Update
    const timeDisplay = document.getElementById('time-display');
    const updateTime = () => {
        const now = new Date();
        timeDisplay.innerText = now.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', hour12: false
        });
    };
    if (timeDisplay) {
        updateTime();
        setInterval(updateTime, 10000);
    }

    // 2. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".font-display", {
        y: 40, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.1, stagger: 0.2
    });

    gsap.from("p:not(#time-display)", {
        y: 20, opacity: 0, duration: 1, ease: "power2.out", delay: 0.4, stagger: 0.1
    });

    gsap.from("nav", {
        y: 50, opacity: 0, duration: 0.8, ease: "back.out(1.7)", delay: 0.8
    });

    // 3. Scroll Animate
    const sectionElements = gsap.utils.toArray('.section-animate');
    sectionElements.forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el, start: "top 85%", toggleActions: "play none none reverse"
            },
            y: 40, opacity: 0, duration: 0.8, ease: "power2.out"
        });
    });

    // 4. Localized cursor-grid spot: show grid only around cursor
    const heroSection = document.getElementById('hero-section');
    const heroGridSpot = document.getElementById('hero-grid-spot');

    if (heroSection && heroGridSpot) {
        let inactivityTimer;

        const scheduleFadeOut = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                heroGridSpot.style.opacity = '0';
            }, 2000);
        };

        const updateSpot = (event) => {
            const rect = heroSection.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const gradient = `radial-gradient(circle 180px at ${x}px ${y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0) 100%)`;

            heroGridSpot.style.webkitMaskImage = gradient;
            heroGridSpot.style.maskImage = gradient;
            heroGridSpot.style.opacity = '1';
            scheduleFadeOut();
        };

        heroSection.addEventListener('mousemove', updateSpot);
        heroSection.addEventListener('mouseenter', updateSpot);
        heroSection.addEventListener('mouseleave', () => {
            clearTimeout(inactivityTimer);
            heroGridSpot.style.opacity = '0';
        });
    }

    // 5. Skills marquee behavior
    const skillsMarquee = document.querySelector('[data-skills-marquee]');
    const skillItems = document.querySelectorAll('[data-skill-item]');

    if (skillsMarquee && skillItems.length) {
        skillsMarquee.addEventListener('mouseenter', () => {
            skillsMarquee.classList.add('is-paused');
        });

        skillsMarquee.addEventListener('mouseleave', () => {
            skillsMarquee.classList.remove('is-paused');
        });
    }

    // 6. Mobile logo fade after hero section
    const siteLogo = document.querySelector('.site-logo');
    if (heroSection && siteLogo && window.matchMedia('(max-width: 640px)').matches) {
        let lastScrollY = window.scrollY;
        let isLogoHidden = false;
        let rafId = null;

        const updateLogoVisibility = () => {
            const currentScrollY = window.scrollY;
            const scrollingDown = currentScrollY > lastScrollY;
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            const heroIsBehindViewport = heroBottom <= window.innerHeight * 0.62;
            const shouldHide = scrollingDown && heroIsBehindViewport;

            if (shouldHide !== isLogoHidden) {
                isLogoHidden = shouldHide;
                siteLogo.classList.toggle('is-hidden-mobile', isLogoHidden);
            }

            lastScrollY = currentScrollY;
            rafId = null;
        };

        const scheduleLogoUpdate = () => {
            if (rafId !== null) return;
            rafId = window.requestAnimationFrame(updateLogoVisibility);
        };

        updateLogoVisibility();
        window.addEventListener('scroll', scheduleLogoUpdate, { passive: true });
        window.addEventListener('resize', scheduleLogoUpdate);
    }

    // 7. Confetti shower on name click
    const nameHover = document.querySelector('.name-hover');
    let confettiLayer = document.getElementById('confetti-layer');

    const confettiPalette = ['#ccff00', '#000000', '#6b7280', '#f2f0e4'];
    const confettiShapes = ['circle', 'rectangle', 'spiral'];

    const buildSpiralDataUri = (color) => {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                <path d="M36 14.5c-4.2-6.1-12.3-7.6-18.4-3.4-6 4.2-7.5 12.4-3.4 18.4 3.5 5.2 10.3 6.6 15.6 3.9 4.7-2.4 6.4-8.7 3.2-12.9-2.5-3.3-7.6-3.8-10.9-1.2-2.5 2-2.9 5.7-1 8.2 1.5 2 4.6 2.3 6.6 0.8" stroke="${color}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    };

    const ensureConfettiLayer = () => {
        if (!confettiLayer) {
            confettiLayer = document.createElement('div');
            confettiLayer.id = 'confetti-layer';
            document.body.appendChild(confettiLayer);
        }
        return confettiLayer;
    };

    const spawnConfettiPiece = () => {
        const layer = ensureConfettiLayer();
        const piece = document.createElement('span');
        const shape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
        const size = 11 + Math.random() * 12;
        const startX = Math.random() * window.innerWidth;
        const driftX = (Math.random() - 0.5) * 220;
        const driftY = window.innerHeight * (1.02 + Math.random() * 0.08);
        const spinX = 720 + Math.random() * 1440;
        const spinY = 540 + Math.random() * 1080;
        const spinZ = 360 + Math.random() * 1260;
        const color = confettiPalette[Math.floor(Math.random() * confettiPalette.length)];

        piece.className = 'confetti-piece';
        piece.classList.add(`is-${shape}`);
        piece.style.left = `${startX}px`;
        piece.style.color = color;
        if (shape === 'circle') {
            piece.style.width = `${size}px`;
            piece.style.height = `${size}px`;
            piece.style.backgroundColor = color;
        } else if (shape === 'rectangle') {
            piece.style.width = `${size * 1.25}px`;
            piece.style.height = `${Math.max(8, size * 0.58)}px`;
            piece.style.backgroundColor = color;
        } else {
            piece.style.width = `${size * 1.35}px`;
            piece.style.height = `${size * 1.35}px`;
            piece.style.backgroundImage = buildSpiralDataUri(color);
        }
        piece.style.opacity = '0.98';
        piece.style.transform = `translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;

        layer.appendChild(piece);

        const animation = piece.animate([
            {
                transform: 'translate3d(0, -14vh, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
                opacity: 0,
                offset: 0
            },
            {
                transform: `translate3d(${driftX * 0.25}px, 18vh, 0) rotateX(${spinX * 0.33}deg) rotateY(${spinY * 0.33}deg) rotateZ(${spinZ * 0.25}deg)`,
                opacity: 1,
                offset: 0.12
            },
            {
                transform: `translate3d(${driftX * 0.65}px, ${driftY * 0.55}px, 0) rotateX(${spinX * 0.72}deg) rotateY(${spinY * 0.72}deg) rotateZ(${spinZ * 0.63}deg)`,
                opacity: 0.55,
                offset: 0.48
            },
            {
                transform: `translate3d(${driftX}px, ${driftY}px, 0) rotateX(${spinX}deg) rotateY(${spinY}deg) rotateZ(${spinZ}deg)`,
                opacity: 0,
                offset: 1
            }
        ], {
            duration: 2900,
            easing: 'cubic-bezier(.14,.74,.2,1)',
            fill: 'forwards'
        });

        animation.onfinish = () => piece.remove();
    };

    const launchConfetti = () => {
        if (!nameHover) return;

        ensureConfettiLayer();

        const totalDuration = 2000;
        const burstEvery = 24;
        const burstCount = Math.ceil(totalDuration / burstEvery);

        for (let index = 0; index < burstCount; index += 1) {
            setTimeout(() => {
                const piecesThisBurst = 4 + Math.floor(Math.random() * 5);
                for (let pieceIndex = 0; pieceIndex < piecesThisBurst; pieceIndex += 1) {
                    spawnConfettiPiece();
                }
            }, index * burstEvery);
        }

        setTimeout(() => {
            if (confettiLayer) {
                confettiLayer.replaceChildren();
            }
        }, totalDuration + 3500);
    };

    if (nameHover) {
        nameHover.addEventListener('click', launchConfetti);
    }
});
