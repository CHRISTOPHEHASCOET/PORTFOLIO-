   
        // // =========================================================
        // // ÉLÉMENTS DU DOM
        // // =========================================================
        // const doorsOverlay = document.getElementById('doors-overlay');

      
        // // =========================================================
        // // ANIMATION DES PORTES D'EMBARQUEMENT
        // // =========================================================
        // function animateDoors() {
        //     const tl = gsap.timeline();

        //     tl.to('.door.left', {
        //         x: '-100%',
        //         duration: 1.3,
        //         ease: 'power4.inOut'
        //     }, 0)
        //         .to('.door.right', {
        //             x: '100%',
        //             duration: 1.3,
        //             ease: 'power4.inOut'
        //         }, 0)
        //         .to(doorsOverlay, {
        //             opacity: 0,
        //             duration: 0.6,
        //             ease: 'power2.out'
        //         }, 1.0)
        //         .set(doorsOverlay, { display: 'none' });
        // }

        // // =========================================================
        // // ÉVÉNEMENTS
        // // =========================================================
        // document.querySelectorAll('.btn-cockpit').forEach(btn => {
        //     btn.addEventListener('click', (e) => {
        //         // Mise à jour des attributs ARIA
        //         document.querySelectorAll('.btn-cockpit').forEach(b => {
        //             b.classList.remove('active');
        //             b.setAttribute('aria-selected', 'false');
        //         });

        //         e.target.classList.add('active');
        //         e.target.setAttribute('aria-selected', 'true');

        //         updateBoard(e.target.dataset.board);
        //     });
        // });

        // // =========================================================
        // // INITIALISATION
        // // =========================================================
        // document.addEventListener('DOMContentLoaded', () => {
        //     updateBoard('departs');
        // });

        // window.addEventListener('load', () => {
        //     // Petit délai pour que tout soit bien rendu
        //     setTimeout(animateDoors, 300);
        // });


        // =========================================================
// PORTE D'EMBARQUEMENT — INTRO TERMINAL
// =========================================================

(() => {
    "use strict";

    let animationStarted = false;

    // =========================================================
    // UTILITAIRES
    // =========================================================

    function hideDoorsImmediately(overlay) {
        if (!overlay) return;

        overlay.style.opacity = "0";
        overlay.style.visibility = "hidden";
        overlay.style.display = "none";
    }

    // =========================================================
    // ANIMATION DES PORTES
    // =========================================================

    function animateDoors() {
        if (animationStarted) return;

        const overlay = document.getElementById("doors-overlay");

        if (!overlay) return;

        animationStarted = true;

        const leftDoor = overlay.querySelector(".door.left");
        const rightDoor = overlay.querySelector(".door.right");

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Fallback : pas de GSAP ou animations réduites.
        if (
            prefersReducedMotion ||
            typeof window.gsap === "undefined" ||
            !leftDoor ||
            !rightDoor
        ) {
            hideDoorsImmediately(overlay);
            return;
        }

        // Sécurité : l'overlay reste décoratif.
        overlay.style.pointerEvents = "none";

        const timeline = gsap.timeline({
            defaults: {
                overwrite: "auto"
            },
            onComplete: () => {
                overlay.style.display = "none";
            }
        });

        timeline
            .to(leftDoor, {
                xPercent: -100,
                duration: 1.3,
                ease: "power4.inOut"
            }, 0)

            .to(rightDoor, {
                xPercent: 100,
                duration: 1.3,
                ease: "power4.inOut"
            }, 0)

            // Le fondu commence avant la fin de l'ouverture :
            // cela évite une fermeture visuelle brutale.
            .to(overlay, {
                autoAlpha: 0,
                duration: 0.55,
                ease: "power2.out"
            }, 1.0)

            .set(overlay, {
                display: "none"
            });
    }

    // =========================================================
    // INITIALISATION
    // =========================================================

    function initDoorIntro() {
        const overlay = document.getElementById("doors-overlay");

        if (!overlay) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Ne pas laisser l'overlay visible inutilement
        // pour les personnes ayant réduit les animations.
        if (prefersReducedMotion) {
            hideDoorsImmediately(overlay);
            return;
        }

        // Un léger délai donne le temps au Terminal de se rendre.
        window.setTimeout(animateDoors, 250);
    }

    // Si les ressources sont déjà chargées, on démarre directement.
    if (document.readyState === "complete") {
        initDoorIntro();
    } else {
        window.addEventListener("load", initDoorIntro, { once: true });
    }
})();