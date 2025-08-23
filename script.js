document.addEventListener('DOMContentLoaded', () => {
    
    // SETUP DI BASE
    const lenis = new Lenis({ lerp: 0.07 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    gsap.registerPlugin(ScrollTrigger);

    // LOGICA UI GENERALE
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isActive = header.classList.toggle('nav-active');
            isActive ? lenis.stop() : lenis.start();
        });
    }
    
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.querySelector('.cursor');
        const projectMenuItems = document.querySelectorAll('.project-menu li');

        document.addEventListener('mousemove', e => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        
        // MODIFICATO: Semplificato il selettore per includere gli span
        const generalTriggers = document.querySelectorAll('a, button, span.highlight-keyword, .close-viewer, .menu-toggle');
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

    // ANIMAZIONE PROCESSO TESTUALE (NUOVA LOGICA)
const processSteps = gsap.utils.toArray(".process-step");
if (processSteps.length > 0) {
    processSteps.forEach((step, index) => {
        ScrollTrigger.create({
            trigger: step,
            start: "top center", // Si attiva quando il centro del testo tocca il centro dello schermo
            end: "bottom center", // Si disattiva quando il fondo del testo supera il centro
            onEnter: () => {
                // Rimuove 'is-active' da tutti gli step
                processSteps.forEach(s => s.classList.remove('is-active'));
                // Aggiunge 'is-active' solo allo step corrente
                step.classList.add('is-active');
            },
            onEnterBack: () => {
                // Stessa logica quando si scorre all'indietro
                processSteps.forEach(s => s.classList.remove('is-active'));
                step.classList.add('is-active');
            }
        });
    });
}

    gsap.from("#skills, #contact, footer", { y: 50, autoAlpha: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#skills", start: "top 85%" } });

    // LOGICA MODALE PROGETTI
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
                lenis.stop();
                document.body.style.overflow = 'hidden';
                const cursor = document.querySelector('.cursor');
                if (cursor) cursor.classList.add('cursor-hidden');

                currentProjectIndex = targetIndex;
                projectCards.forEach(card => card.classList.remove('visible'));
                projectCards[currentProjectIndex].classList.add('visible');
                updateModalNav(currentProjectIndex);
                projectViewer.classList.add('visible');
            }
        };

        const closeProject = () => {
            projectViewer.classList.remove('visible');
            document.body.style.overflow = '';
            lenis.start();
            const cursor = document.querySelector('.cursor');
            if (cursor) cursor.classList.remove('cursor-hidden');
        };

        projectMenuItemsList.forEach(item => item.addEventListener('click', () => openProject(item.dataset.target)));
        closeViewerBtn.addEventListener('click', closeProject);
        projectViewer.addEventListener('click', (e) => { if (e.target.classList.contains('project-viewer')) closeProject(); });

        if(modalNavNext && modalNavPrev) {
            modalNavNext.addEventListener('click', () => switchProject((currentProjectIndex + 1) % projectCards.length));
            modalNavPrev.addEventListener('click', () => switchProject((currentProjectIndex - 1 + projectCards.length) % projectCards.length));
        }
    }
});
