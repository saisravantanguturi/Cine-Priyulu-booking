// Helper function to create sparkle effects
function createSparkles(x: number, y: number) {
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    document.body.appendChild(sparkle);
    // Position sparkle at the center of the target
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    const angle = (Math.PI * 2 * i) / 8;
    const distance = 30 + Math.random() * 20;

    gsap.to(sparkle, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: 0,
      scale: 0.5,
      duration: 0.6,
      ease: "power1.out",
      onComplete: () => sparkle.remove()
    });
  }
}

// Main animation function
export function animateSeatSelection(seatElement: HTMLElement, cartIconId: string) {
    if (!seatElement || typeof gsap === 'undefined') return;

    // 1. Bounce animation on the seat wrapper
    gsap.fromTo(seatElement, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" });

    // 2. Glow pulse
    const glow = document.createElement("div");
    glow.className = "glow";
    seatElement.prepend(glow);
    gsap.fromTo(glow, { scale: 0, opacity: 1 }, { scale: 2, opacity: 0, duration: 0.6, onComplete: () => glow.remove() });

    // 3. Fly to cart
    const cartIcon = document.getElementById(cartIconId);
    if (!cartIcon) {
        console.warn(`Cart icon with id #${cartIconId} not found.`);
        return;
    }
    
    const seatIconElement = seatElement.querySelector('svg');
    if (!seatIconElement) return;

    const seatIconRect = seatIconElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    
    const clone = seatIconElement.cloneNode(true) as SVGSVGElement;
    
    document.body.appendChild(clone);
    clone.style.position = "fixed";
    clone.style.left = `${seatIconRect.left}px`;
    clone.style.top = `${seatIconRect.top}px`;
    clone.style.width = `${seatIconRect.width}px`;
    clone.style.height = `${seatIconRect.height}px`;
    clone.style.color = 'rgb(59 130 246)'; // Tailwind's blue-500
    clone.style.zIndex = "9999";
    
    gsap.to(clone, {
      left: cartRect.left + (cartRect.width / 2) - (seatIconRect.width / 2),
      top: cartRect.top + (cartRect.height / 2) - (seatIconRect.height / 2),
      scale: 0.5,
      duration: 0.8,
      ease: "power1.inOut",
      onComplete: () => {
        // 4. Sparkle Burst
        createSparkles(cartRect.left + (cartRect.width / 2), cartRect.top + (cartRect.height / 2));
        clone.remove();
        gsap.fromTo(cartIcon, {scale: 1.4}, {scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)'});
      }
    });
}
