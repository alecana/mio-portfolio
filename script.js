document.addEventListener('DOMContentLoaded', () => {
    
    // SETUP DI BASE
    const lenis = new Lenis({
        lerp: 0.07,
        wrapper: window,
        content: document.documentElement
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    gsap.registerPlugin(ScrollTrigger);

    // --- LOGICA CURSORE UNIFICATA CON GSAP ---
    const cursor = document.querySelector('.cursor');
    if (cursor && window.matchMedia('(pointer: fine)').matches) {
        
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        window.addEventListener('mousemove', e => {
            gsap.to(cursor, { duration: 0.1, x: e.clientX, y: e.clientY });
        });

        // Trigger generici per link e bottoni
        const generalTriggers = document.querySelectorAll('a, button, .highlight-keyword, .close-viewer, .menu-toggle');
        generalTriggers.forEach(el => {
            el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 2.4, ease: "power2.out" }));
            el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, ease: "power2.out" }));
        });
        
        // Trigger per i progetti con colore
        const projectMenuItems = document.querySelectorAll('.project-menu li');
        projectMenuItems.forEach(item => {
            const hoverColor = item.dataset.hoverColor;
            item.addEventListener('mouseenter', () => {
                if (hoverColor) {
                    gsap.to(cursor, { 
                        scale: 2.4, 
                        backgroundColor: hoverColor,
                        mixBlendMode: 'normal',
                        ease: "power2.out"
                    });
                }
            });
            item.addEventListener('mouseleave', () => {
                gsap.to(cursor, { 
                    scale: 1, 
                    backgroundColor: 'white',
                    mixBlendMode: 'difference',
                    ease: "power2.out"
                });
            });
        });

        // Trigger per la foto del profilo (mano)
        const profileArea = document.querySelector('.profile-photo-area');
        if (profileArea) {
            profileArea.addEventListener('mouseenter', () => {
                gsap.to(cursor, {
                    width: 150, height: 150,
                    backgroundImage: `url('images/mano.png')`,
                    backgroundSize: 'contain',
                    mixBlendMode: 'normal',
                    backgroundColor: 'transparent',
                    ease: 'power3.out'
                });
            });
            profileArea.addEventListener('mouseleave', () => {
                gsap.to(cursor, {
                    width: 25, height: 25,
                    backgroundImage: 'none',
                    backgroundColor: 'white',
                    mixBlendMode: 'difference',
                    ease: 'power3.out'
                });
            });
        }
    }

   // --- LOGICA CLICK FOTO PROFILO E TRANSIZIONE (CON NUOVA ANIMAZIONE "RIPPLE") ---
const profileArea = document.querySelector('.profile-photo-area');
const pageOverlay = document.querySelector('.page-transition-overlay');

if (profileArea && pageOverlay) {
    const knockSound = new Audio('audio/knock.mp3');
    let isAudioUnlocked = false;

    const unlockAudio = () => {
        knockSound.play().then(() => {
            knockSound.pause();
            knockSound.currentTime = 0;
            isAudioUnlocked = true;
            document.body.removeEventListener('click', unlockAudio);
        }).catch(() => {});
    };
    document.body.addEventListener('click', unlockAudio, { once: true });
    
    profileArea.addEventListener('click', (event) => {
        event.preventDefault(); 
        if (pageOverlay.classList.contains('is-active')) return;

        // **NUOVA ANIMAZIONE "RIPPLE"**
        if (cursor) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            document.body.appendChild(ripple);
            
            // Posiziona il ripple dove si trova il cursore
            gsap.set(ripple, {
                x: cursor.getBoundingClientRect().left + cursor.offsetWidth / 2,
                y: cursor.getBoundingClientRect().top + cursor.offsetHeight / 2,
            });

            // Anima il ripple e il cursore
            gsap.timeline()
                .to(cursor, { scale: 1.2, duration: 0.2, ease: 'power2.out' })
                .to(ripple, { scale: 1, opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => ripple.remove() }, "-=0.1")
                .to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' }, "-=0.4");
        }

        if(isAudioUnlocked) {
            knockSound.currentTime = 0;
            knockSound.play();
        }
        
        pageOverlay.classList.add('is-active');
        setTimeout(() => {
            window.location.href = 'room.html';
        }, 800);
    });
}


    // GESTIONE MENU MOBILE
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isActive = header.classList.toggle('nav-active');
            isActive ? lenis.stop() : lenis.start();
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
    // --- LOGICA MODALE PROGETTI ---
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
            
            if (cursor) {
                cursor.classList.remove('cursor-hidden', 'cursor-grow', 'cursor-invert-grow', 'cursor-hand');
                cursor.style.backgroundColor = '';
                cursor.style.borderColor = '';
                cursor.style.width = '';
                cursor.style.height = '';
            }
            
            projectCards.forEach(card => card.classList.remove('visible'));
            document.body.style.overflow = '';
            lenis.start();
            
            setTimeout(() => {
                if (cursor) {
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

        document.addEventListener('keydown', (e) => {
            if (projectViewer.classList.contains('visible')) {
                if (e.key === 'Escape') closeProject();
                else if (e.key === 'ArrowRight') switchProject((currentProjectIndex + 1) % projectCards.length);
                else if (e.key === 'ArrowLeft') switchProject((currentProjectIndex - 1 + projectCards.length) % projectCards.length);
            }
        });
    }

// --- NUOVO: LOGICA PER COPIARE L'EMAIL (CON NUOVO STILE E DURATA) ---
const emailButtons = document.querySelectorAll('#contact-email-btn, #projects-email-btn');

if (emailButtons.length > 0) {
    const emailToCopy = 'aledrai98@gmail.com';
    const successFlash = document.querySelector('.success-flash');

    emailButtons.forEach(button => {
        const originalText = button.textContent;
        const originalStyles = {
            backgroundColor: gsap.getProperty(button, "backgroundColor"),
            color: gsap.getProperty(button, "color")
        };

        let isAnimating = false; // Flag per prevenire doppi click

        button.addEventListener('click', (event) => {
            event.preventDefault();
            if (isAnimating) return; // Se l'animazione è in corso, non fare nulla
            isAnimating = true;

            navigator.clipboard.writeText(emailToCopy).then(() => {
                
                button.textContent = 'Email Copiata!';

                // Animazione di feedback
                const tl = gsap.timeline({
                    onComplete: () => {
                        // Resetta dopo 5 secondi
                        setTimeout(() => {
                            gsap.to(button, {
                                backgroundColor: originalStyles.backgroundColor,
                                color: originalStyles.color,
                                duration: 0.5,
                                onComplete: () => {
                                    button.textContent = originalText;
                                    isAnimating = false; // Rendi di nuovo cliccabile
                                }
                            });
                        }, 5000); // 5 secondi di attesa
                    }
                });

                tl.to(successFlash, { opacity: 0.8, duration: 0.15 })
                  .to(button, { 
                      backgroundColor: '#1a1a1a', // Sfondo nero
                      color: '#ffffff', // Scritta bianca
                      duration: 0.15 
                  }, "<")
                  .to(successFlash, { opacity: 0, duration: 0.3 })
                  .to(button, { y: -10, duration: 0.1, ease: 'power2.out' }, "-=0.4")
                  .to(button, { y: 0, duration: 0.3, ease: 'bounce.out' }, "-=0.3");

            }).catch(err => {
                console.error('Errore nel copiare l\'email: ', err);
                isAnimating = false; // Resetta in caso di errore
            });
        });
    });
}
});