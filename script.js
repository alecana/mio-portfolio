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

// --- SCRIPT PER PAGINA "CREATIVITY" ---
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. EFFETTO TESTO MAGNETICO NELL'HERO ---
    const heroSection = document.querySelector('#idea-factory-hero');
    const magneticTitle = document.querySelector('#magnetic-title');

    if (heroSection && magneticTitle) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const moveX = (x - rect.width / 2) * 0.08;
            const moveY = (y - rect.height / 2) * 0.08;

            gsap.to(magneticTitle, {
                duration: 0.7,
                x: moveX,
                y: moveY,
                ease: 'power3.out'
            });
        });
        
        heroSection.addEventListener('mouseleave', () => {
            gsap.to(magneticTitle, {
                duration: 0.7,
                x: 0,
                y: 0,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    }


    // --- 2. SHOWCASE DINAMICO DEI LAVORI ---
    const workLinks = document.querySelectorAll('.work-list a');
    const previewImage = document.getElementById('work-preview-image');

    if (workLinks.length > 0 && previewImage) {
        
        // Imposta il primo link come attivo di default
        workLinks[0].classList.add('is-active');

        workLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                // Rimuovi la classe attiva da tutti i link
                workLinks.forEach(l => l.classList.remove('is-active'));
                // Aggiungila solo a quello su cui sei passato
                link.classList.add('is-active');

                const imagePath = link.dataset.image;

                // Cambia l'immagine con un effetto di dissolvenza
                gsap.to(previewImage, { 
                    opacity: 0, 
                    duration: 0.2, 
                    onComplete: () => {
                        previewImage.src = imagePath;
                        gsap.to(previewImage, { opacity: 1, duration: 0.2 });
                    }
                });
            });
        });
    }

});


// --- SCRIPT PER PAGINA "CREATIVITY" - VERSIONE CON ASPECT RATIO DINAMICO ---
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. EFFETTO TESTO MAGNETICO NELL'HERO ---
    const heroSection = document.querySelector('#idea-factory-hero');
    const magneticTitle = document.querySelector('#magnetic-title');

    if (heroSection && magneticTitle) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const moveX = (x - rect.width / 2) * 0.08;
            const moveY = (y - rect.height / 2) * 0.08;

            gsap.to(magneticTitle, { duration: 0.7, x: moveX, y: moveY, ease: 'power3.out' });
        });
        
        heroSection.addEventListener('mouseleave', () => {
            gsap.to(magneticTitle, { duration: 0.7, x: 0, y: 0, ease: 'elastic.out(1, 0.3)' });
        });
    }

    // --- 2. SHOWCASE DINAMICO CON ASPECT RATIO VARIABILE ---
    const workLinks = document.querySelectorAll('.work-list a');
    const previewViewer = document.querySelector('.work-preview-viewer'); // Selezioniamo il contenitore
    const previewImage = document.getElementById('work-preview-image');

    if (workLinks.length > 0 && previewViewer && previewImage) {
        
        workLinks[0].classList.add('is-active');

        workLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                workLinks.forEach(l => l.classList.remove('is-active'));
                link.classList.add('is-active');

                // --- LOGICA AGGIORNATA ---
                const imagePath = link.dataset.image;
                // Legge il data-ratio. Se non c'è, usa il valore di default '2 / 3'.
                const newRatio = link.dataset.ratio || '2 / 3'; 

                // Applica il nuovo aspect-ratio al contenitore con una transizione
                gsap.to(previewViewer, {
                    aspectRatio: newRatio,
                    duration: 0.4, // Durata dell'animazione di ridimensionamento
                    ease: 'power2.inOut'
                });

                if (previewImage.src.endsWith(imagePath)) return; 

                gsap.to(previewImage, { 
                    opacity: 0, 
                    duration: 0.2, 
                    onComplete: () => {
                        previewImage.src = imagePath;
                        gsap.to(previewImage, { opacity: 1, duration: 0.2 });
                    }
                });
            });
        });
    }
});

// --- SCRIPT PER PAGINA "CREATIVITY" - VERSIONE CON CAROSELLO AUTOMATICO ---
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. EFFETTO TESTO MAGNETICO NELL'HERO ---
    const heroSection = document.querySelector('#idea-factory-hero');
    const magneticTitle = document.querySelector('#magnetic-title');

    if (heroSection && magneticTitle) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const moveX = (x - rect.width / 2) * 0.08;
            const moveY = (y - rect.height / 2) * 0.08;

            gsap.to(magneticTitle, { duration: 0.7, x: moveX, y: moveY, ease: 'power3.out' });
        });
        
        heroSection.addEventListener('mouseleave', () => {
            gsap.to(magneticTitle, { duration: 0.7, x: 0, y: 0, ease: 'elastic.out(1, 0.3)' });
        });
    }

    // --- 2. SHOWCASE DINAMICO CON CAROSELLO AUTOMATICO ---
    const workLinks = document.querySelectorAll('.work-list a');
    const singleImageViewer = document.getElementById('single-image-viewer');
    const singlePreviewImage = document.getElementById('work-preview-image');
    const carouselViewer = document.getElementById('carousel-viewer');
    
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    let carouselInterval = null; // Variabile per tenere traccia dell'intervallo

function startCarousel() {
    // Pulisce qualsiasi intervallo precedente per evitare accelerazioni
    clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        slides.forEach((slide, i) => {
            slide.classList.toggle('is-active', i === currentSlide);
        });
    }, 1500); // Cambia immagine ogni 1.5 secondi
}

    // Funzione per fermare il carosello
    function stopCarousel() {
        clearInterval(carouselInterval);
    }

    // Logica per cambiare visualizzatore
    if (workLinks.length > 0) {
        workLinks[0].classList.add('is-active');

        workLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                workLinks.forEach(l => l.classList.remove('is-active'));
                link.classList.add('is-active');

                const viewerType = link.dataset.viewer;

                if (viewerType === 'carousel') {
                    singleImageViewer.style.display = 'none';
                    carouselViewer.style.display = 'block';
                    startCarousel();
                } else {
                    carouselViewer.style.display = 'none';
                    singleImageViewer.style.display = 'block';
                    stopCarousel(); // FONDAMENTALE: ferma il carosello quando non è attivo
                    
                    const imagePath = link.dataset.image;
                    if (singlePreviewImage.src.endsWith(imagePath)) return; 

                    gsap.to(singlePreviewImage, { opacity: 0, duration: 0.2, onComplete: () => {
                        singlePreviewImage.src = imagePath;
                        gsap.to(singlePreviewImage, { opacity: 1, duration: 0.2 });
                    }});
                }
            });
        });
    }
});