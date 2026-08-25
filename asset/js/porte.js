   
        // =========================================================
        // ÉLÉMENTS DU DOM
        // =========================================================
        const doorsOverlay = document.getElementById('doors-overlay');

      
        // =========================================================
        // ANIMATION DES PORTES D'EMBARQUEMENT
        // =========================================================
        function animateDoors() {
            const tl = gsap.timeline();

            tl.to('.door.left', {
                x: '-100%',
                duration: 1.3,
                ease: 'power4.inOut'
            }, 0)
                .to('.door.right', {
                    x: '100%',
                    duration: 1.3,
                    ease: 'power4.inOut'
                }, 0)
                .to(doorsOverlay, {
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, 1.0)
                .set(doorsOverlay, { display: 'none' });
        }

        // =========================================================
        // ÉVÉNEMENTS
        // =========================================================
        document.querySelectorAll('.btn-cockpit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Mise à jour des attributs ARIA
                document.querySelectorAll('.btn-cockpit').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });

                e.target.classList.add('active');
                e.target.setAttribute('aria-selected', 'true');

                updateBoard(e.target.dataset.board);
            });
        });

        // =========================================================
        // INITIALISATION
        // =========================================================
        document.addEventListener('DOMContentLoaded', () => {
            updateBoard('departs');
        });

        window.addEventListener('load', () => {
            // Petit délai pour que tout soit bien rendu
            setTimeout(animateDoors, 300);
        });