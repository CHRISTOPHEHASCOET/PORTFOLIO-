// bording-gate.js

(() => {
    "use strict";

    const root = document.querySelector("[data-boarding-gate]");

    if (!root) {
        return;
    }

    const passes = Array.from(root.querySelectorAll("[data-flight-pass]"));

    if (!passes.length) {
        return;
    }

    const live = root.querySelector("[data-boarding-live]");
    const status = root.querySelector("[data-boarding-status]");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasGsap = typeof window.gsap !== "undefined";
    const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

    function setLiveMessage(message) {
        if (live) {
            live.textContent = message;
        }

        if (status) {
            status.textContent = message;
        }
    }

    function getPassName(pass) {
        return pass.dataset.flightName || "Mission";
    }

    function getPassCode(pass) {
        return pass.dataset.flightCode || "VOL";
    }

    function activatePass(pass) {
        if (!pass) {
            return;
        }

        pass.classList.add("is-boarding-active");

        const name = getPassName(pass);
        const code = getPassCode(pass);

        setLiveMessage(`Vol ${code} sélectionné. Plan de vol ${name} disponible.`);
    }

    function deactivatePass(pass) {
        if (!pass) {
            return;
        }

        const openedPlan = pass.querySelector("[data-flight-plan][open]");

        if (openedPlan) {
            return;
        }

        pass.classList.remove("is-boarding-active");
    }

    function bindPassInteractions() {
        passes.forEach((pass) => {
            pass.addEventListener("pointerenter", () => {
                activatePass(pass);
            });

            pass.addEventListener("pointerleave", () => {
                deactivatePass(pass);
            });

            pass.addEventListener("focusin", () => {
                activatePass(pass);
            });

            pass.addEventListener("focusout", () => {
                window.setTimeout(() => {
                    if (!pass.contains(document.activeElement)) {
                        deactivatePass(pass);
                    }
                }, 0);
            });
        });
    }

    function bindFlightPlans() {
        root.addEventListener(
            "toggle",
            (event) => {
                const plan = event.target;

                if (!(plan instanceof HTMLDetailsElement)) {
                    return;
                }

                if (!plan.matches("[data-flight-plan]")) {
                    return;
                }

                const pass = plan.closest("[data-flight-pass]");

                if (!pass) {
                    return;
                }

                if (plan.open) {
                    passes.forEach((otherPass) => {
                        if (otherPass === pass) {
                            return;
                        }

                        const otherPlan = otherPass.querySelector("[data-flight-plan][open]");

                        if (otherPlan) {
                            otherPlan.open = false;
                        }

                        otherPass.classList.remove("is-boarding-active");
                    });

                    activatePass(pass);

                    const name = getPassName(pass);
                    const code = getPassCode(pass);

                    setLiveMessage(`Plan de vol ${code} ouvert. Inspection documentaire de ${name} en cours.`);
                } else {
                    deactivatePass(pass);

                    const code = getPassCode(pass);

                    setLiveMessage(`Vol ${code} fermé. Les accès directs restent disponibles.`);
                }
            },
            true
        );
    }

    function revealWithoutGsap() {
        passes.forEach((pass) => {
            pass.style.clipPath = "inset(0 0 0 0)";
            pass.style.opacity = "1";
            pass.style.visibility = "visible";
        });
    }

    function initGsapReveal() {
        if (prefersReducedMotion || !hasGsap || !hasScrollTrigger) {
            revealWithoutGsap();
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        passes.forEach((pass) => {
            const revealItems = pass.querySelectorAll(
                ".flight-pass__identity, .flight-pass__visual, .flight-pass__brief, .flight-pass__footer, .flight-pass__ticket, .flight-pass__barcode-box, .flight-pass__actions"
            );

            gsap.set(pass, {
                clipPath: "inset(0 0 100% 0)",
                autoAlpha: 1
            });

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: pass,
                    start: "top 82%",
                    once: true
                }
            });

            timeline.to(pass, {
                clipPath: "inset(0 0 0% 0)",
                duration: 0.9,
                ease: "power3.out"
            });

            if (revealItems.length) {
                timeline.fromTo(
                    revealItems,
                    {
                        y: 16,
                        autoAlpha: 0
                    },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.45,
                        stagger: 0.05,
                        ease: "power2.out"
                    },
                    "-=0.45"
                );
            }
        });
    }

    function init() {
        bindPassInteractions();
        bindFlightPlans();
        initGsapReveal();

        setLiveMessage("Sélectionnez un billet pour initialiser l’inspection.");

        console.info(`[BOARDING GATE] ${passes.length} vols disponibles.`);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();