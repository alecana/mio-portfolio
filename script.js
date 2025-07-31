document.addEventListener('DOMContentLoaded', () => {
    
    // SETUP DI BASE
    const lenis = new Lenis({ lerp: 0.07 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    gsap.registerPlugin(ScrollTrigger);

    // LOGICA UI GENERALE
    const cursor = document.querySelector('.cursor');
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isActive = header.classList.toggle('nav-active');
            isActive ? lenis.stop() : lenis.start();
        });
    }
    
    if (window.matchMedia('(pointer: fine)').matches) {
        const projectMenuItems = document.querySelectorAll('.project-menu li');

        document.addEventListener('mousemove', e => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        
        const generalTriggers = document.querySelectorAll('a, button, .highlight-keyword, .close-viewer, .menu-toggle');
        generalTriggers.forEach(el => {
            if (!el.closest('.project-menu li')) {
                el.addEventListener('mouseenter', () => cursor.classList.add('cursor-invert-grow'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-invert-grow'));
            }
        });
        
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

    // ANIMAZIONI GSAP
    gsap.from("#about .about-grid > *", { y: 50, opacity: 0, stagger: 0.2, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#about", start: "top 70%" } });
    gsap.from("#projects .container > *", { y: 50, autoAlpha: 0, stagger: 0.2, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#projects", start: "top 70%" } });

    const processSteps = gsap.utils.toArray(".process-step");
    if (processSteps.length > 0) {
        processSteps.forEach(step => {
            ScrollTrigger.create({
                trigger: step,
                start: "center center",
                end: "bottom 40%", 
                toggleClass: "is-active",
            });
        });
    }

    gsap.from("#skills, #contact, footer", { y: 50, autoAlpha: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#skills", start: "top 85%" } });

    // --- LOGICA MODALE PROGETTI (CORRETTA E STABILE) ---
    const projectViewer = document.querySelector('.project-viewer');
    const closeViewerBtn = document.querySelector('.close-viewer');
    const projectMenuItemsList = document.querySelectorAll('.project-menu li');
    const modalNavPrev = document.querySelector('.modal-nav.prev');
    const modalNavNext = document.querySelector('.modal-nav.next');
    
    if (projectViewer) {
        let currentProjectIndex = 0;
        const projectCards = Array.from(document.querySelectorAll('.project-card-content'));
        const projectData = Array.from(projectMenuItemsList).map(li => ({
            id: li.dataset.target,
            image: li.querySelector('img') ? li.querySelector('img').src : ''
        }));

        const updateModalNav = (index) => {
            if (!modalNavPrev || !modalNavNext) return;
            const prevIndex = (index - 1 + projectCards.length) % projectCards.length;
            const nextIndex = (index + 1) % projectCards.length;
            modalNavPrev.querySelector('.nav-preview-orb').style.backgroundImage = `url(${projectData[prevIndex].image})`;
            modalNavNext.querySelector('.nav-preview-orb').style.backgroundImage = `url(${projectData[nextIndex].image})`;
        };

        const switchProject = (newIndex) => {
            projectCards[currentProjectIndex].classList.remove('visible');
            currentProjectIndex = newIndex;
            projectCards[currentProjectIndex].classList.add('visible');
            updateModalNav(currentProjectIndex);
        };
        
        const openProject = (targetId) => {
            const targetIndex = projectCards.findIndex(card => `#${card.id}` === targetId);
            if (targetIndex !== -1) {
                // Ferma lo scroll e nasconde il cursore
                lenis.stop();
                if (cursor) cursor.classList.add('cursor-hidden');
                document.body.style.overflow = 'hidden';

                currentProjectIndex = targetIndex;
                projectCards.forEach(card => card.classList.remove('visible'));
                projectCards[currentProjectIndex].classList.add('visible');
                updateModalNav(currentProjectIndex);
                projectViewer.classList.add('visible');
            }
        };

        const closeProject = () => {
            projectViewer.classList.remove('visible');
            
            // RESET COMPLETO DEL CURSORE
            if (cursor) {
                cursor.classList.remove('cursor-hidden', 'cursor-grow', 'cursor-invert-grow');
                cursor.style.backgroundColor = '';
                cursor.style.borderColor = '';
                cursor.style.width = '';
                cursor.style.height = '';
            }
            
            // Rimuovi tutte le card visibili
            projectCards.forEach(card => card.classList.remove('visible'));
            
            // Fa ripartire lo scroll
            document.body.style.overflow = '';
            lenis.start();
            
            // Forza un refresh dello stato del cursore dopo un breve delay
            setTimeout(() => {
                if (cursor) {
                    // Reset completo degli stili inline
                    cursor.style.cssText = cursor.style.cssText.replace(/width:[^;]*;?/g, '')
                                                               .replace(/height:[^;]*;?/g, '')
                                                               .replace(/background-color:[^;]*;?/g, '')
                                                               .replace(/border-color:[^;]*;?/g, '');
                }
            }, 50);
        };

        projectMenuItemsList.forEach(item => item.addEventListener('click', () => openProject(item.dataset.target)));
        closeViewerBtn.addEventListener('click', closeProject);
        projectViewer.addEventListener('click', (e) => { if (e.target.classList.contains('project-viewer')) closeProject(); });

        if(modalNavNext && modalNavPrev) {
            modalNavNext.addEventListener('click', () => switchProject((currentProjectIndex + 1) % projectCards.length));
            modalNavPrev.addEventListener('click', () => switchProject((currentProjectIndex - 1 + projectCards.length) % projectCards.length));
        }

        // Gestione tastiera
        document.addEventListener('keydown', (e) => {
            if (projectViewer.classList.contains('visible')) {
                if (e.key === 'Escape') closeProject();
                else if (e.key === 'ArrowRight') switchProject((currentProjectIndex + 1) % projectCards.length);
                else if (e.key === 'ArrowLeft') switchProject((currentProjectIndex - 1 + projectCards.length) % projectCards.length);
            }
        });
    }
});