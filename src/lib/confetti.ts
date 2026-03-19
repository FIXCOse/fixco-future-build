import confetti from "canvas-confetti";

/**
 * Multi-burst confetti celebration effect.
 * Mobile-optimized with dedicated canvas for z-index control.
 */
export function fireConfetti() {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:2147483647;pointer-events:none;';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const myConfetti = confetti.create(canvas, { resize: true });
  const isMobile = window.innerWidth < 768;
  const defaults = { ticks: 300, gravity: 0.6, scalar: isMobile ? 1.0 : 1.2, startVelocity: isMobile ? 25 : 45 };
  const count = isMobile ? 0.6 : 1;

  myConfetti({ ...defaults, particleCount: Math.round(150 * count), spread: 100, origin: { y: 0.6 }, colors: ['#16a34a', '#22c55e', '#fbbf24', '#f59e0b', '#3b82f6'] });
  setTimeout(() => myConfetti({ ...defaults, particleCount: Math.round(100 * count), angle: 60, spread: 55, origin: { x: 0 }, colors: ['#16a34a', '#22c55e', '#fbbf24'] }), 400);
  setTimeout(() => myConfetti({ ...defaults, particleCount: Math.round(100 * count), angle: 120, spread: 55, origin: { x: 1 }, colors: ['#3b82f6', '#8b5cf6', '#f59e0b'] }), 700);
  setTimeout(() => myConfetti({ ...defaults, particleCount: Math.round(80 * count), spread: 120, origin: { y: 0.5 }, colors: ['#16a34a', '#fbbf24', '#8b5cf6'] }), 1000);
  setTimeout(() => myConfetti({ ...defaults, particleCount: Math.round(60 * count), spread: 160, origin: { y: 0.7 }, colors: ['#22c55e', '#f59e0b', '#8b5cf6'] }), 1500);
  setTimeout(() => { canvas.remove(); }, 5000);
}
