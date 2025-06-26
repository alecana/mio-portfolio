document.addEventListener('DOMContentLoaded', () => {

    const lenis = new Lenis({ lerp: 0.07 });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- LOGICA ANIMAZIONE LOGO 3D ---
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

    // --- LOGICA ESISTENTE ---
    const cursor = document.querySelector('.cursor');
    const projectViewer = document.querySelector('.project-viewer');
    const closeViewerBtn = document.querySelector('.close-viewer');
    const projectMenuItems = document.querySelectorAll('.project-menu li');
    const nextProjectButton = document.getElementById('viewer-next-button');

    // Cursore
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    const generalTriggers = document.querySelectorAll('a, button, .highlight-keyword');
    generalTriggers.forEach(el => {
        if (!el.closest('.project-menu')) {
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

    // Modale Progetti
    const updateNextButton = (currentProjectId) => {
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
            
            updateNextButton(targetId);
            nextProjectButton.classList.add('visible');

            projectViewer.classList.add('visible');
            lenis.stop();
        }
    };
    
    const closeProject = () => {
        projectViewer.classList.remove('visible');
        nextProjectButton.classList.remove('visible');
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

    // Animazione allo scroll (per le altre sezioni)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});