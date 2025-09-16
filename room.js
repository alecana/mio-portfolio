window.addEventListener('DOMContentLoaded', () => {

    // --- LOGICA CURSORE ---
    const cursor = document.querySelector('.cursor');
    if (cursor && window.matchMedia('(pointer: fine)').matches) {
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        window.addEventListener('mousemove', e => {
            gsap.to(cursor, { duration: 0.2, x: e.clientX, y: e.clientY });
        });
        const generalTriggers = document.querySelectorAll('a, button');
        generalTriggers.forEach(el => {
            el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 2.4, ease: "power2.out" }));
            el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, ease: "power2.out" }));
        });
    }

    // --- LOGICA TRANSIZIONI PAGINA ---
    const overlay = document.querySelector('.page-transition-overlay');
    setTimeout(() => {
        if(overlay) overlay.classList.remove('is-active');
    }, 100);

    const backButtons = document.querySelectorAll('a[href="index.html"]');
    backButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const destination = event.currentTarget.href;
            const roomContainer = document.querySelector('.room-container');
            
            gsap.to(roomContainer, {
                x: '100%',
                duration: 0.8,
                ease: 'power3.in',
                onComplete: () => { window.location.href = destination; }
            });
        });
    });

    // --- NUOVO: LOGICA MARQUEE CON GSAP ---
    const marqueeWrapper = document.querySelector(".marquee-wrapper");
    if (marqueeWrapper) {
        const items = gsap.utils.toArray(".marquee-item");
        const totalHeight = items.reduce((acc, item) => acc + item.offsetHeight, 0);

        // Duplica gli elementi per creare un loop infinito
        items.forEach(item => {
            marqueeWrapper.appendChild(item.cloneNode(true));
        });

        // Animazione con GSAP
        gsap.to(marqueeWrapper, {
            y: -totalHeight,
            duration: 20, // Aumenta o diminuisci per cambiare velocità
            ease: "none",
            repeat: -1,
        });
    }


    // --- LOGICA CAROSELLO ---
    const textPanel = document.querySelector('.room-text-panel');
    const slides = document.querySelectorAll('.text-slide');
    const paginationContainer = document.querySelector('.slide-pagination');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const totalSlides = slides.length;

    let currentSlideIndex = 0;
    let isScrolling = false;

    const createPagination = () => {
        paginationContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.dataset.index = i;
            paginationContainer.appendChild(dot);
        }
    };
    createPagination();
    const dots = document.querySelectorAll('.slide-pagination button');

    const goToSlide = (index) => {
        if (index < 0 || index >= totalSlides) return;
        const previousSlideIndex = currentSlideIndex;
        currentSlideIndex = index;

        textPanel.style.backgroundColor = slides[currentSlideIndex].dataset.color;
        
        slides[previousSlideIndex].classList.add('exiting');
        slides[previousSlideIndex].classList.remove('active');
        slides[currentSlideIndex].classList.remove('exiting');
        slides[currentSlideIndex].classList.add('active');
        setTimeout(() => {
            slides[previousSlideIndex].classList.remove('exiting');
        }, 1000);

        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlideIndex].classList.add('active');
        scrollIndicator.classList.toggle('hidden', currentSlideIndex === totalSlides - 1);
    };

    const handleDesktopScroll = (event) => {
        if (isScrolling) return;
        let newIndex = currentSlideIndex;
        if (event.deltaY > 0) newIndex++;
        else newIndex--;

        if (newIndex >= 0 && newIndex < totalSlides && newIndex !== currentSlideIndex) {
            isScrolling = true;
            goToSlide(newIndex);
            setTimeout(() => { isScrolling = false; }, 1200);
        }
    };

    const setupEventListeners = () => {
        if (window.innerWidth > 900) {
            window.addEventListener('wheel', handleDesktopScroll);
        }
    };

    paginationContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const index = parseInt(event.target.dataset.index, 10);
            goToSlide(index);
        }
    });

    window.addEventListener('resize', setupEventListeners);
    setupEventListeners();
    goToSlide(0);
});