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
        document.querySelectorAll('a, button, .tag, .team-card, .goal-card, .format-card').forEach(el => {
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
        .to('.l-hero-title .line span', { y: 0, duration: 0.9, stagger: 0.12, ease: 'power4.out' })
        .to('.l-hero-sub', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
        .to('.l-hero-note', { opacity: 1, duration: 0.6 }, '-=0.2')
        .fromTo('.sticker-1', { scale: 0, rotation: -60 }, { scale: 1, opacity: 1, rotation: -8, duration: 0.7, ease: 'back.out(2.5)' }, '-=0.6')
        .fromTo('.sticker-2', { scale: 0, rotation: 60 }, { scale: 1, opacity: 1, rotation: 7, duration: 0.7, ease: 'back.out(2.5)' }, '-=0.5');

    // Stickers fluttuanti
    gsap.to('.sticker-1', { y: -14, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 });
    gsap.to('.sticker-2', { y: 12, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.3 });

    // --- HEADER: si nasconde scendendo, riappare salendo ---
    const projectHeader = document.querySelector('.project-header');
    let lastScrollY = 0;
    lenis.on('scroll', ({ scroll }) => {
        if (Math.abs(scroll - lastScrollY) < 10) return;
        gsap.to(projectHeader, { yPercent: (scroll > lastScrollY && scroll > 150) ? -130 : 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
        lastScrollY = scroll;
    });

    // --- REVEAL GENERICO DELLE SEZIONI ---
    gsap.utils.toArray('.l-section .l-container > *:not(.bars):not(.chat-mock):not(.goal-cards):not(.outro-box):not(.disclaimer-box):not(.kpi-strip)').forEach(el => {
        gsap.from(el, {
            y: 45, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' }
        });
    });

    // --- DISCLAIMER: entra con un timbro ---
    gsap.from('.disclaimer-box', {
        scale: 0.7, autoAlpha: 0, rotation: 6, duration: 0.7, ease: 'back.out(2)',
        scrollTrigger: { trigger: '.disclaimer-box', start: 'top 85%' }
    });

    // --- TAGS: pop elastico ---
    gsap.from('.tag', {
        scale: 0, autoAlpha: 0, stagger: 0.1, duration: 0.6, ease: 'back.out(2.5)',
        scrollTrigger: { trigger: '.tag-cloud', start: 'top 85%' }
    });

    // --- ANTI: timbri stampati uno a uno (sezione pinnata) ---
    const antiTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.l-anti',
            start: 'top top',
            end: '+=2500',
            pin: true,
            scrub: 0.6,
        }
    });
    ['.stamp-a', '.stamp-b', '.stamp-c'].forEach(sel => {
        antiTl.fromTo(sel,
            { scale: 3.5, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 1, ease: 'power4.in' }
        ).to({}, { duration: 0.5 }); // pausa tra un timbro e l'altro
    });
    antiTl
        .to('.stamp', { autoAlpha: 0.12, duration: 0.8 })
        .fromTo('.stamp-final',
            { scale: 0.4, autoAlpha: 0, rotation: -8 },
            { scale: 1, autoAlpha: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
        )
        .to({}, { duration: 0.8 });

    // --- CHAT WHATSAPP: i messaggi arrivano ---
    gsap.utils.toArray('.chat-bubble').forEach((bubble, i) => {
        const fromLeft = bubble.classList.contains('left');
        gsap.fromTo(bubble,
            { x: fromLeft ? -40 : 40, y: 20, autoAlpha: 0, scale: 0.85 },
            {
                x: 0, y: 0, autoAlpha: 1, scale: 1,
                duration: 0.55, ease: 'back.out(2)', delay: i * 0.18,
                scrollTrigger: { trigger: '.chat-mock', start: 'top 75%' }
            }
        );
    });

    // --- BARRE COMPETITOR ---
    gsap.utils.toArray('.bar-fill').forEach(bar => {
        gsap.to(bar, {
            width: bar.dataset.w + '%',
            duration: 1.4, ease: 'power3.out',
            scrollTrigger: { trigger: '.bars', start: 'top 78%' }
        });
    });
    // La barra di Lundini "trema" un po', poverina
    gsap.to('.bar-row.is-lundini .bar-fill', {
        x: 3, duration: 0.08, yoyo: true, repeat: 7, delay: 1.5,
        scrollTrigger: { trigger: '.bars', start: 'top 78%' }
    });

    // --- PROBLEM: titolo enorme che si ingrandisce con lo scroll ---
    gsap.fromTo('.problem-title',
        { scale: 0.6, autoAlpha: 0 },
        {
            scale: 1, autoAlpha: 1, ease: 'power2.out',
            scrollTrigger: { trigger: '.l-problem', start: 'top 75%', end: 'top 15%', scrub: 0.8 }
        }
    );
    gsap.from('.problem-text, .sad-face', {
        y: 40, autoAlpha: 0, stagger: 0.2, duration: 0.8,
        scrollTrigger: { trigger: '.problem-text', start: 'top 85%' }
    });
    gsap.to('.sad-face', { rotation: 90, y: -8, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // --- GOAL CARDS: pop in scala, nessuno spostamento verticale
    // (se il tween viene interrotto a metà le card restano comunque allineate) ---
    gsap.from('.goal-card', {
        scale: 0.9, autoAlpha: 0, stagger: 0.12, duration: 0.55, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.goal-cards', start: 'top 82%' }
    });
    gsap.from('.kpi-strip', {
        scale: 0.85, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.8)',
        scrollTrigger: { trigger: '.kpi-strip', start: 'top 88%' }
    });

    // --- FORMATS: scroll orizzontale (solo desktop) ---
    const formatsTrack = document.querySelector('.formats-track');
    if (formatsTrack && window.innerWidth > 900) {
        const scrollAmount = formatsTrack.scrollWidth - window.innerWidth + 64;
        gsap.to(formatsTrack, {
            x: -scrollAmount,
            ease: 'none',
            scrollTrigger: {
                trigger: '.l-formats',
                start: 'top top',
                end: () => '+=' + scrollAmount,
                pin: true,
                scrub: 0.8,
                invalidateOnRefresh: true,
            }
        });
    } else {
        gsap.utils.toArray('.format-card').forEach(card => {
            gsap.from(card, {
                y: 60, autoAlpha: 0, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 88%' }
            });
        });
    }

    // --- WIGGLE al passaggio del mouse sulle card marcate ---
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
});
