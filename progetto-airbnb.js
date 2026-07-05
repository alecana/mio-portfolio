window.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    // --- SMOOTH SCROLL ---
    const lenis = new Lenis({ lerp: 0.07 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);

    // --- CURSORE ---
    const cursor = document.querySelector('.cursor');
    if (cursor && window.matchMedia('(pointer: fine)').matches) {
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        window.addEventListener('mousemove', e => {
            gsap.to(cursor, { duration: 0.15, x: e.clientX, y: e.clientY });
        });
        document.querySelectorAll('a, button, .goal-chip').forEach(el => {
            el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 2.2, ease: 'power2.out' }));
            el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, ease: 'power2.out' }));
        });
    }

    // --- TRANSIZIONE IN ENTRATA / USCITA ---
    const overlay = document.querySelector('.page-transition-overlay');
    setTimeout(() => { if (overlay) overlay.classList.remove('is-active'); }, 100);

    document.querySelectorAll('a[href^="index.html"]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const destination = event.currentTarget.href;
            overlay.classList.add('is-active');
            setTimeout(() => { window.location.href = destination; }, 800);
        });
    });

    // --- HERO: titolo che sale riga per riga ---
    const heroTl = gsap.timeline({ delay: 0.5 });
    heroTl
        .to('.a-hero-title .line span', { y: 0, duration: 0.9, stagger: 0.12, ease: 'power4.out' })
        .to('.a-hero-sub', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
        .to('.a-hero-note', { opacity: 1, duration: 0.6 }, '-=0.2')
        .fromTo('.sticker-1', { scale: 0.6 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' }, '-=0.6')
        .fromTo('.sticker-2', { scale: 0.6 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' }, '-=0.45');

    // Stickers fluttuanti (movimento morbido, niente rotazione)
    gsap.to('.sticker-1', { y: -10, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 });
    gsap.to('.sticker-2', { y: 10, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.3 });

    // --- HEADER: si nasconde scendendo, riappare salendo ---
    const projectHeader = document.querySelector('.project-header');
    let lastScrollY = 0;
    lenis.on('scroll', ({ scroll }) => {
        if (Math.abs(scroll - lastScrollY) < 10) return;
        gsap.to(projectHeader, { yPercent: (scroll > lastScrollY && scroll > 150) ? -130 : 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
        lastScrollY = scroll;
    });

    // --- REVEAL GENERICO DELLE SEZIONI ---
    gsap.utils.toArray('.a-section .a-container > *:not(.bars):not(.goal-chips):not(.outro-box):not(.disclaimer-box)').forEach(el => {
        gsap.from(el, {
            y: 45, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' }
        });
    });

    // --- DISCLAIMER ---
    gsap.from('.disclaimer-box', {
        y: 24, autoAlpha: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.disclaimer-box', start: 'top 85%' }
    });

    // --- GOAL CHIPS: comparsa morbida a raffica ---
    gsap.from('.goal-chip', {
        y: 16, autoAlpha: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: '.goal-chips', start: 'top 85%' }
    });

    // --- GAME: reveal degli elementi ---
    gsap.utils.toArray('.a-game .a-kicker, .a-game .a-heading, .a-game > .a-container > .a-text, .game-progress').forEach(el => {
        gsap.from(el, {
            y: 45, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' }
        });
    });
    gsap.from('.target-card', {
        scale: 0.85, autoAlpha: 0, stagger: 0.12, duration: 0.55, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.target-cards', start: 'top 82%' }
    });

    // --- BARRE CTR ---
    gsap.utils.toArray('.bar-fill').forEach(bar => {
        gsap.to(bar, {
            width: bar.dataset.w + '%',
            duration: 1.4, ease: 'power3.out',
            scrollTrigger: { trigger: '.bars', start: 'top 78%' }
        });
    });

    // --- WIGGLE al passaggio del mouse ---
    document.querySelectorAll('[data-wiggle]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.fromTo(el, { rotation: -1.5 }, { rotation: 1.5, duration: 0.1, repeat: 3, yoyo: true, clearProps: 'rotation' });
        });
    });

    // --- OUTRO BOX ---
    gsap.from('.outro-box', {
        scale: 0.85, autoAlpha: 0, duration: 0.9, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.outro-box', start: 'top 80%' }
    });

    /* ==================================================================
       GAME: SCEGLI IL TUO TARGET — 3 funnel × 4 livelli
       ================================================================== */

    const FUNNELS = {
        coppie: {
            title: 'Secret Escapes',
            dest: 'Phuket · Cappadocia · Budapest · Girona · Cinque Terre',
            steps: [
                { tag: 'LIVELLO 1 · AWARENESS', title: 'Hook', desc: 'Il post che ferma lo scroll: una meta romantica che non è Parigi, con un prezzo che sembra un errore di battitura. Obiettivo: farsi notare da chi sta già sognando la fuga a due.' },
                { tag: 'LIVELLO 2 · LEAD GENERATION', title: 'Guida gratuita', desc: '"5 fughe romantiche sotto i 100€ a notte": una guida scaricabile in cambio dell\'email. La coppia ottiene idee vere, io ottengo un lead profilato.' },
                { tag: 'LIVELLO 3 · CONSIDERATION', title: 'Remarketing', desc: 'Chi ha scaricato la guida rivede la meta che aveva guardato più a lungo, con recensioni e disponibilità reali. La FOMO inizia a lavorare: "quella casa a Girona ha solo 2 date libere".' },
                { tag: 'LIVELLO 4 · CONVERSION', title: 'Offerta -15%', desc: 'L\'ultimo passo: sconto del 15% a tempo limitato sulla prima prenotazione. Il countdown fa il resto, e la fuga romantica passa da salvata nei preferiti a prenotata.' }
            ]
        },
        amici: {
            title: 'Unexplored Vibes',
            dest: 'Ksamil · Gili Air · Durazzo · Tirana · Lanzarote',
            steps: [
                { tag: 'LIVELLO 1 · AWARENESS', title: 'Hook', desc: 'Il post pensato per essere taggato: "Ksamil costa meno della vostra serata in centro". Il gruppo di amici si convince a colpi di menzioni nei commenti.' },
                { tag: 'LIVELLO 2 · LEAD GENERATION', title: 'Guida gratuita', desc: '"Il viaggio con gli amici sotto i 40€ a notte": guida scaricabile con mete, casa condivisa e budget a persona. Chi la scarica entra nel funnel.' },
                { tag: 'LIVELLO 3 · CONSIDERATION', title: 'Remarketing', desc: 'Il retargeting mostra case per 6-8 persone nelle mete della guida, col prezzo diviso a testa. Quando il totale a persona è meno di una cena fuori, la chat di gruppo si accende.' },
                { tag: 'LIVELLO 4 · CONVERSION', title: 'Offerta -15%', desc: 'Sconto -15% valido per pochi giorni: l\'argomento definitivo per chi nel gruppo tentenna. Uno prenota per tutti, gli altri pagano la loro parte.' }
            ]
        },
        famiglie: {
            title: 'Family Discovery',
            dest: 'Tenerife · Algarve · Alghero · Slovenia · Bretagna',
            steps: [
                { tag: 'LIVELLO 1 · AWARENESS', title: 'Hook', desc: 'Il post rassicurante: mete nascoste ma a misura di bambino, con casa intera, cucina e spazio per tutti. Parla ai genitori che pianificano con mesi di anticipo.' },
                { tag: 'LIVELLO 2 · LEAD GENERATION', title: 'Guida gratuita', desc: '"Vacanze in famiglia senza sorprese": guida con mete tranquille, servizi e costi chiari. Il lead magnet perfetto per chi non prenota mai d\'impulso.' },
                { tag: 'LIVELLO 3 · CONSIDERATION', title: 'Remarketing', desc: 'Il remarketing punta sulle recensioni di altre famiglie e sulla cancellazione flessibile: le due cose che un genitore controlla prima di tutto il resto.' },
                { tag: 'LIVELLO 4 · CONVERSION', title: 'Offerta -15%', desc: 'Lo sconto -15% arriva quando la fiducia è già costruita. Per una settimana in famiglia il risparmio è concreto, e la prenotazione parte con largo anticipo.' }
            ]
        }
    };

    const STEP_IMG = ['hook', 'guida', 'remarketing', 'offerta'];

    const panel = document.getElementById('funnel-panel');
    const panelTitle = document.getElementById('funnel-title');
    const panelDest = document.getElementById('funnel-dest');
    const stepButtons = Array.from(document.querySelectorAll('.funnel-step'));
    const igImg = document.getElementById('ig-img');
    const stepTag = document.getElementById('funnel-step-tag');
    const stepTitle = document.getElementById('funnel-step-title');
    const stepDesc = document.getElementById('funnel-step-desc');
    const nextBtn = document.getElementById('funnel-next');
    const trophyBox = document.getElementById('trophy-box');
    const progressCount = document.getElementById('progress-count');
    const progressFill = document.getElementById('progress-fill');
    const targetCards = Array.from(document.querySelectorAll('.target-card'));

    let currentKey = null;
    let currentStep = 0;
    const seenSteps = { coppie: new Set(), amici: new Set(), famiglie: new Set() };
    const completed = new Set();

    function renderStep(animate = true) {
        const data = FUNNELS[currentKey];
        const step = data.steps[currentStep];
        seenSteps[currentKey].add(currentStep);

        stepButtons.forEach((btn, i) => {
            btn.classList.toggle('is-current', i === currentStep);
            btn.classList.toggle('is-seen', seenSteps[currentKey].has(i));
        });

        igImg.src = 'images/airbnb/' + STEP_IMG[currentStep] + '-' + currentKey + '.jpg';
        stepTag.textContent = step.tag;
        stepTitle.textContent = step.title;
        stepDesc.textContent = step.desc;

        const isLast = currentStep === FUNNELS[currentKey].steps.length - 1;
        nextBtn.textContent = isLast ? (completed.has(currentKey) ? 'Funnel completato ✓' : 'Completa il funnel ✓') : 'Avanti →';

        if (animate) {
            gsap.fromTo('.ig-post', { scale: 0.96, autoAlpha: 0.4 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
            gsap.fromTo('.funnel-text > *', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.4, ease: 'power2.out' });
        }
    }

    function updateProgress() {
        progressCount.textContent = completed.size;
        progressFill.style.width = (completed.size / 3 * 100) + '%';
    }

    function completeFunnel(key) {
        if (completed.has(key)) return;
        completed.add(key);
        const card = targetCards.find(c => c.dataset.targetKey === key);
        card.classList.add('is-done');
        updateProgress();

        if (completed.size === 3) {
            trophyBox.hidden = false;
            gsap.fromTo(trophyBox, { scale: 0.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.6)' });
            gsap.fromTo('.trophy-emoji', { scale: 0.5 }, { scale: 1, duration: 0.6, ease: 'back.out(2.5)', delay: 0.2 });
            lenis.scrollTo(trophyBox, { offset: -140 });
        }
        ScrollTrigger.refresh();
    }

    function openFunnel(key) {
        currentKey = key;
        currentStep = 0;
        panel.hidden = false;
        panelTitle.textContent = FUNNELS[key].title;
        panelDest.textContent = FUNNELS[key].dest;
        targetCards.forEach(c => c.classList.toggle('is-active', c.dataset.targetKey === key));
        renderStep(false);
        gsap.fromTo(panel, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' });
        ScrollTrigger.refresh();
        lenis.scrollTo(panel, { offset: -110 });
    }

    targetCards.forEach(card => {
        card.addEventListener('click', () => openFunnel(card.dataset.targetKey));
    });

    stepButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!currentKey) return;
            currentStep = parseInt(btn.dataset.step, 10);
            renderStep();
        });
    });

    nextBtn.addEventListener('click', () => {
        if (!currentKey) return;
        const isLast = currentStep === FUNNELS[currentKey].steps.length - 1;
        if (isLast) {
            completeFunnel(currentKey);
            nextBtn.textContent = 'Funnel completato ✓';
            if (completed.size < 3) {
                // Riporta alle card per scegliere il prossimo target
                targetCards.forEach(c => c.classList.remove('is-active'));
                lenis.scrollTo('.target-cards', { offset: -120 });
            }
        } else {
            currentStep += 1;
            renderStep();
        }
    });
});
