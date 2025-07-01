document.addEventListener('DOMContentLoaded', () => {

    const lenis = new Lenis({ lerp: 0.07 });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    // --- Logica Menu Hamburger ---
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('header nav');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isNavActive = header.classList.toggle('nav-active');
            if (isNavActive) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });

        document.querySelectorAll('header nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (header.classList.contains('nav-active')) {
                    header.classList.remove('nav-active');
                    lenis.start();
                }
            });
        });
    }

    // --- Effetti solo per Desktop ---
    if (!isTouchDevice) {
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            document.addEventListener('mousemove', e => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
            const generalTriggers = document.querySelectorAll('a, button, .highlight-keyword, .close-viewer');
            generalTriggers.forEach(el => {
                if (!el.closest('.project-menu li')) {
                    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-invert-grow'));
                    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-invert-grow'));
                }
            });
            const projectMenuItems = document.querySelectorAll('.project-menu li');
            projectMenuItems.forEach(item => {
                const hoverColor = item.dataset.hoverColor;
                item.addEventListener('mouseenter', () => {
                    if (hoverColor) {
                        cursor.classList.add('cursor-grow');
                        cursor.style.backgroundColor = hoverColor;
                    }
                });
                item.addEventListener('mouseleave', () => {
                    cursor.classList.remove('cursor-grow');
                    cursor.style.backgroundColor = '';
                });
            });
        }
        const heroSection = document.getElementById('hero');
        const heroLogo3D = document.querySelector('.hero-logo-3d');
        if (heroSection && heroLogo3D) {
            heroSection.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { offsetWidth, offsetHeight } = heroSection;
                const xPos = (clientX / offsetWidth - 0.5) * 25;
                const yPos = (clientY / offsetHeight - 0.5) * -25;
                heroLogo3D.style.transform = `rotateY(${xPos}deg) rotateX(${yPos}deg)`;
            });
            heroSection.addEventListener('mouseleave', () => {
                heroLogo3D.style.transform = 'rotateY(0deg) rotateX(0deg)';
            });
        }
    }

    // --- ANIMAZIONI CON GSAP ---
    gsap.registerPlugin(ScrollTrigger);

    // Transizione Sfondo Body
    ScrollTrigger.create({
        trigger: "#projects",
        start: "bottom bottom",
        onEnter: () => gsap.to('main', { backgroundColor: '#1a1a1a', duration: 0.5, ease: 'none' }),
        onLeaveBack: () => gsap.to('main', { backgroundColor: '#f5f5f5', duration: 0.5, ease: 'none' })
    });
     ScrollTrigger.create({
        trigger: "#process-map",
        start: "bottom top",
        onEnter: () => gsap.to('main', { backgroundColor: '#f5f5f5', duration: 0.5, ease: 'none' }),
        onLeaveBack: () => gsap.to('main', { backgroundColor: '#1a1a1a', duration: 0.5, ease: 'none' }),
    });


    // --- NUOVA ANIMAZIONE "LOCKED CAMERA" PER IL PROCESSO ---
    const processSection = document.querySelector("#process-map");
    if (processSection && !isTouchDevice) {
        const stopsWrapper = processSection.querySelector(".stops-wrapper");
        const track = processSection.querySelector(".svg-track");

        ScrollTrigger.create({
            trigger: processSection,
            start: "top top",
            end: "bottom bottom",
            pin: track
        });

        const stops = gsap.utils.toArray(".process-stop");
        stops.forEach((stop, index) => {
            gsap.fromTo(stop, 
                { opacity: 0.2, scale: 0.95 }, 
                {
                    opacity: 1,
                    scale: 1,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: stop,
                        start: "center center+=50",
                        end: "center center-=50",
                        scrub: true,
                        toggleClass: "is-active",
                    }
                }
            );
        });

        const endOfLine = processSection.querySelector(".end-of-line");
        if(endOfLine) {
            ScrollTrigger.create({
                trigger: stopsWrapper,
                start: "bottom 95%",
                onEnter: () => gsap.to(endOfLine, { opacity: 1, duration: 1 }),
                onLeaveBack: () => gsap.to(endOfLine, { opacity: 0, duration: 1 }),
            });
        }
    }

    // --- ANIMAZIONI STANDARD PER LE ALTRE SEZIONI ---
    const fadeUpElements = gsap.utils.toArray("#hero .hero-new-content, #about .container, #projects .container, #skills .container, #contact .container, footer .container");
    fadeUpElements.forEach(el => {
        gsap.from(el, { 
            y: 50, 
            autoAlpha: 0, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });
    
    const aboutImageTl = gsap.timeline({ scrollTrigger: { trigger: ".about-image-container", start: "top 75%", toggleActions: "play none none none" } });
    aboutImageTl.to(".about-image-wrapper img", { clipPath: "circle(75% at 50% 50%)", duration: 1.2, ease: "power3.inOut" })
              .fromTo(".about-image-wrapper img", { scale: 1.2 }, { scale: 1, duration: 1.2, ease: "power3.inOut" }, "<")
              .from(".about-image-wrapper", { scale: 0.8, opacity: 0, duration: 1, ease: "power3.out" }, "-=1");


    // --- Logica Modale Progetti ---
    const projectViewer = document.querySelector('.project-viewer');
    const closeViewerBtn = document.querySelector('.close-viewer');
    const projectMenuItems = document.querySelectorAll('.project-menu li');
    const nextProjectButton = document.getElementById('viewer-next-button');

    const updateNextButton = (currentProjectId) => {
        if (!nextProjectButton) return;
        const projectCards = Array.from(document.querySelectorAll('.project-card-content'));
        const currentProjectIndex = projectCards.findIndex(card => `#${card.id}` === currentProjectId);
        if (currentProjectIndex === -1) return;
        const nextProjectIndex = (currentProjectIndex + 1) % projectCards.length;
        const nextProjectCard = projectCards[nextProjectIndex];
        const nextProjectMenuItem = document.querySelector(`.project-menu li[data-target="#${nextProjectCard.id}"]`);
        if (!nextProjectMenuItem) return;
        const nextImageSrc = nextProjectMenuItem.querySelector('.project-preview img').src;
        nextProjectButton.dataset.nextTarget = `#${nextProjectCard.id}`;
        nextProjectButton.querySelector('.next-project-preview').style.backgroundImage = `url(${nextImageSrc})`;
    };
    
    const openProject = (targetId) => {
        const targetProject = document.querySelector(targetId);
        if (targetProject) {
            document.querySelectorAll('.project-card-content.visible').forEach(p => p.classList.remove('visible'));
            targetProject.classList.add('visible');
            projectViewer.classList.add('visible');
            lenis.stop();
            updateNextButton(targetId);
            if (nextProjectButton && window.innerWidth > 1200) {
                 nextProjectButton.classList.add('visible');
            }
        }
    };
    
    const closeProject = () => {
        projectViewer.classList.remove('visible');
        if (nextProjectButton) {
            nextProjectButton.classList.remove('visible');
        }
        document.querySelectorAll('.project-card-content.visible').forEach(p => p.classList.remove('visible'));
        lenis.start();
    };

    projectMenuItems.forEach(item => {
        item.addEventListener('click', () => openProject(item.dataset.target));
    });
    closeViewerBtn.addEventListener('click', closeProject);
    projectViewer.addEventListener('click', (e) => {
        if (e.target === projectViewer) closeProject();
    });

    if (nextProjectButton) {
        nextProjectButton.addEventListener('click', (e) => {
            e.preventDefault();
            const nextTargetId = e.currentTarget.dataset.nextTarget;
            const currentVisible = document.querySelector('.project-card-content.visible');
            const nextVisible = document.querySelector(nextTargetId);
            if(currentVisible && nextVisible) {
                currentVisible.classList.remove('visible');
                nextVisible.classList.add('visible');
                updateNextButton(nextTargetId);
            }
        });
    }
});