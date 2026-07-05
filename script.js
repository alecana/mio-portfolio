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

    // --- SEZIONE FEEDBACK GAMIFICATA ---
    const feedbackData = [
        { img: 'images/feedback/paolo-denadai.jpg', nome: 'Paolo', full: 'Paolo de Nadai', ruolo: 'Founder & President, WeRoad', quote: 'La proattività con cui hai affrontato questi mesi ha aiutato a tenere alto il ritmo di lavoro e la cultura aziendale del guardare sempre tutti avanti e alla crescita.' },
        { img: 'images/feedback/margherita-galluzzo.jpg', nome: 'Margherita', full: 'Margherita Galluzzo', ruolo: 'Brand Marketing Director, WeRoad', quote: 'Sei stato un grande valore aggiunto nel team, hai portato aria fresca, idee nuove, skill nuove. Ti sei presentato con un video fighissimo quando sei arrivato, ma le altre cose super che hai fatto in azienda non hanno avuto la stessa visibilità.' },
        { img: 'images/feedback/lorenzo-sala.jpg', nome: 'Lorenzo', full: 'Lorenzo Sala', ruolo: 'Creative Ops Associate Manager, WeRoad', quote: "Hai dimostrato fin da subito un talento e una tenacia pazzeschi, portando valore aggiunto sia sul piano umano che su quello professionale. Hai un'energia e una voglia di fare che fanno la differenza." },
        { img: 'images/feedback/carlotta-calegari.jpg', nome: 'Carlotta', full: 'Carlotta Calegari', ruolo: 'Content Associate Manager, WeRoad', quote: 'È un vero team player: non si limita a eseguire, ma cerca sempre di andare oltre e di capire come migliorare i processi. È diretto, non si perde in banalità, e si percepisce quanto tenga alla qualità del proprio lavoro.' },
        { img: 'images/feedback/edoardo-nardi.jpg', nome: 'Edoardo', full: 'Edoardo Nardi', ruolo: 'Martech Specialist, WeRoad', quote: 'Ale è un vulcano di idee, sempre con la voglia di imparare e sperimentare. I progetti che ha seguito hanno un taglio business chiaro e sono tra le cose più croccanti sul fronte dello sviluppo AI dentro una realtà strutturata come WeRoad.' },
        { img: 'images/feedback/eugenio-guidi.jpg', nome: 'Eugenio', full: 'Eugenio Guidi', ruolo: 'PM Creative Ops, WeRoad', quote: 'Il lavoro di Alessandro è stato molto prezioso: grazie alle sue capacità è riuscito ad implementare processi creativi, aiutando il team marketing ad alzare la qualità dei contenuti e velocizzare i ritmi di produzione.' },
        { img: 'images/feedback/sara-angioni.jpg', nome: 'Sara', full: 'Sara Angioni', ruolo: 'Content Marketing Operations Lead, WeRoad', quote: 'Sei stato una risorsa preziosa per tutto il team, per le tue capacità di metterti in gioco a prescindere dal grado di difficoltà, ma anche per le tue soft skill. Il saperti relazionare ed essere proattivo senza mai prevaricare sono qualità preziose.' },
        { img: 'images/feedback/leonardo-caputi.jpg', nome: 'Leonardo', full: 'Leonardo Caputi', ruolo: 'UGC Assistant, WeRoad', quote: 'La freschezza, la creatività, le grandi competenze umane e tecniche hanno portato un enorme beneficio a WeRoad. Hai dimostrato grande autonomia, affidabilità e capacità di gestire molte attività contemporaneamente: non possiamo fare a meno di te!' },
        { img: 'images/feedback/cecilia-silvi.jpg', nome: 'Cecilia', full: 'Cecilia Silvi', ruolo: 'Talent Acquisition & Onboarding Lead, WeRoad', quote: 'Ale si è fatto notare subito e, con le sue calamite, ha fatto capire che in WeRoad avrebbe giocato un ruolo fondamentale e che valeva la pena averlo in squadra, anche se in quel momento non stavamo neppure assumendo.' },
        { img: 'images/feedback/martina-paradiso.jpg', nome: 'Martina', full: 'Martina Paradiso', ruolo: 'Creative Ops Specialist, WeRoad', quote: 'Lavorare con te mi ha dato la spinta per provare cose nuove. Sentirti dire ai meeting "No raga, fidatevi, questa cosa funziona" portando sul tavolo progetti già completi e non idee campate in aria, fa capire la stoffa che hai.' },
        { img: 'images/feedback/anna-harvey.jpg', nome: 'Anna', full: 'Anna Harvey', ruolo: 'Creative Copywriter, WeRoad', quote: 'Ale è una spugna. No, non è un insulto. Assorbe le informazioni senza sforzo, impara continuamente, è sempre aggiornato sugli ultimi strumenti e piattaforme. Continua ad essere una spugna, Ale!' },
        { img: 'images/feedback/giuliano-guarini.jpg', nome: 'Giuliano', full: 'Giuliano Guarini', ruolo: 'Founder, Caffè Design', quote: 'Grande Ale! Sei davvero un pazzo :) Bravo, continua così, non perdere lo spirito che è determinante per la tua carriera! Sempre abbomba. Daje!!' },
    ];

    const feedbackStage = document.querySelector('.feedback-stage');
    if (feedbackStage) {
        const avatarsWrap = feedbackStage.querySelector('.feedback-avatars');
        const bubble = feedbackStage.querySelector('.feedback-bubble');
        const placeholder = bubble.querySelector('.bubble-placeholder');
        const content = bubble.querySelector('.bubble-content');
        const diceBtn = feedbackStage.querySelector('.feedback-dice');
        const progressFill = feedbackStage.querySelector('.progress-fill');
        const progressLabel = feedbackStage.querySelector('.progress-label');
        const read = new Set();
        let activeIndex = -1;

        feedbackData.forEach((p, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'feedback-avatar';
            btn.dataset.index = i;
            btn.setAttribute('aria-label', `Leggi il feedback di ${p.full}`);
            btn.innerHTML = `<span class="avatar-badge">?</span><img src="${p.img}" alt="${p.full}" loading="lazy"><span class="avatar-name">${p.nome}</span>`;
            avatarsWrap.appendChild(btn);

            // fluttuazione continua, ognuno col suo ritmo
            gsap.to(btn, { y: gsap.utils.random(-7, 7), duration: gsap.utils.random(1.8, 3), yoyo: true, repeat: -1, ease: 'sine.inOut', delay: gsap.utils.random(0, 1.5) });

            if (cursor && window.matchMedia('(pointer: fine)').matches) {
                btn.addEventListener('mouseenter', () => {
                    gsap.to(cursor, {
                        width: 100, height: 100, scale: 1,
                        backgroundImage: `url('${p.img}')`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        borderRadius: '50%',
                        mixBlendMode: 'normal',
                        backgroundColor: 'transparent',
                        boxShadow: '0 0 0 3px var(--hero-bg-color)',
                        ease: 'power3.out'
                    });
                });
                btn.addEventListener('mouseleave', () => {
                    gsap.to(cursor, {
                        width: 25, height: 25,
                        backgroundImage: 'none',
                        boxShadow: 'none',
                        backgroundColor: 'white',
                        mixBlendMode: 'difference',
                        ease: 'power3.out'
                    });
                });
            }

            btn.addEventListener('click', () => selectPerson(i));
        });

        const avatarBtns = Array.from(avatarsWrap.children);

        const launchConfetti = () => {
            const colors = ['#FFD700', '#1a1a1a', '#e54791', '#5cb670', '#ff385c'];
            const rect = bubble.getBoundingClientRect();
            for (let i = 0; i < 40; i++) {
                const dot = document.createElement('div');
                dot.className = 'confetti-dot';
                dot.style.backgroundColor = colors[i % colors.length];
                document.body.appendChild(dot);
                gsap.set(dot, { x: rect.left + rect.width / 2, y: rect.top });
                gsap.to(dot, {
                    x: `+=${gsap.utils.random(-260, 260)}`,
                    y: `+=${gsap.utils.random(-300, 60)}`,
                    rotation: gsap.utils.random(-360, 360),
                    opacity: 0,
                    duration: gsap.utils.random(0.9, 1.6),
                    ease: 'power2.out',
                    onComplete: () => dot.remove()
                });
            }
        };

        const updateProgress = () => {
            const done = read.size, total = feedbackData.length;
            gsap.to(progressFill, { width: (done / total * 100) + '%', duration: 0.5, ease: 'power2.out' });
            progressLabel.textContent = done === total ? `${done}/${total} 🏆 tutti interrogati!` : `${done}/${total} interrogati`;
        };

        const selectPerson = (i) => {
            if (i === activeIndex) return;
            activeIndex = i;
            const p = feedbackData[i];
            const firstRead = !read.has(i);
            read.add(i);

            avatarBtns.forEach((b, j) => {
                b.classList.toggle('is-active', j === i);
                if (read.has(j)) {
                    b.classList.add('is-read');
                    b.querySelector('.avatar-badge').textContent = '✓';
                }
            });
            updateProgress();

            // il prescelto saltella
            const btn = avatarBtns[i];
            gsap.fromTo(btn.querySelector('img'), { scale: 1 }, { scale: 1.18, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' });

            const showNew = () => {
                placeholder.style.display = 'none';
                content.hidden = false;
                content.querySelector('blockquote').textContent = `«${p.quote}»`;
                const img = content.querySelector('img');
                img.src = p.img; img.alt = p.full;
                content.querySelector('strong').textContent = p.full;
                content.querySelector('em').textContent = p.ruolo;
                gsap.fromTo(content, { autoAlpha: 0, y: 18, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)' });
                if (firstRead && read.size === feedbackData.length) launchConfetti();
            };

            gsap.killTweensOf(content);
            if (content.hidden) { showNew(); }
            else { gsap.to(content, { autoAlpha: 0, y: -14, duration: 0.18, ease: 'power2.in', onComplete: showNew }); }
        };

        diceBtn.addEventListener('click', () => {
            const unread = feedbackData.map((_, i) => i).filter(i => !read.has(i) && i !== activeIndex);
            const pool = unread.length ? unread : feedbackData.map((_, i) => i).filter(i => i !== activeIndex);
            selectPerson(pool[Math.floor(Math.random() * pool.length)]);
            gsap.fromTo(diceBtn, { rotation: -6 }, { rotation: 6, duration: 0.09, repeat: 3, yoyo: true, clearProps: 'rotation' });
        });

        // reveal della sezione: gli avatar spuntano a raffica
        gsap.from(avatarBtns, { scale: 0, autoAlpha: 0, stagger: 0.05, duration: 0.55, ease: 'back.out(2.2)', scrollTrigger: { trigger: '#feedback', start: 'top 70%' } });
        gsap.from('#feedback h2, #feedback .feedback-intro, .feedback-bubble, .feedback-footer', { y: 40, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '#feedback', start: 'top 75%' } });
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
        // Solo i progetti che aprono il modale (quelli con data-href hanno una pagina dedicata)
        const projectData = Array.from(projectMenuItemsList).filter(li => li.dataset.target).map(li => ({
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

        projectMenuItemsList.forEach(item => item.addEventListener('click', () => {
            // I progetti con data-href navigano alla loro pagina dedicata con transizione
            if (item.dataset.href) {
                if (pageOverlay) pageOverlay.classList.add('is-active');
                setTimeout(() => { window.location.href = item.dataset.href; }, 800);
                return;
            }
            openProject(item.dataset.target);
        }));
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