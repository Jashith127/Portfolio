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

    // 4. Localized cursor-grid spot: show grid only around cursor, fade after inactivity
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
});
