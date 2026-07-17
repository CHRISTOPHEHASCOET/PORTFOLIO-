document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const passes = document.querySelectorAll('.flight-pass');

  passes.forEach((pass) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pass,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });

    tl.to(pass, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1,
      ease: "power3.out"
    });

    const reveals = pass.querySelectorAll('.gs-reveal');
    tl.fromTo(reveals,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" },
      "-=0.5"
    );

    const barcodeContainer = pass.querySelector('.flight-pass__barcode-box');
    const scanner = pass.querySelector('.flight-pass__scanner');

    const scanAnim = gsap.to(scanner, {
      y: 60,
      duration: 1,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      paused: true
    });

    pass.addEventListener("mouseenter", () => {
      gsap.to(barcodeContainer, { opacity: 1, duration: 0.3 });
      gsap.to(scanner, { opacity: 1, duration: 0.2 });
      scanAnim.play();
    });

    pass.addEventListener("mouseleave", () => {
      gsap.to(barcodeContainer, { opacity: 0.4, duration: 0.3 });
      gsap.to(scanner, { opacity: 0, duration: 0.2 });
      scanAnim.pause(0);
    });
  });
});