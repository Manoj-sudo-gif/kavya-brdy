import confetti from 'canvas-confetti';

// Confetti burst for Level 1 and 2
export function triggerLevelUnlockConfetti() {
  const count = 120;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Pinkish & rose & warm gold palette
  const colors = ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#fbbf24', '#fbcfe8'];

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors,
  });
  fire(0.2, {
    spread: 60,
    colors,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors,
  });
}

// Multi-color grand firework confetti + Heart explosion across the screen for Level 3
export function triggerGrandFireworksConfetti() {
  const duration = 4.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 70, zIndex: 99999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // Shoot bursts from left and right repeatedly
  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Left cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#ff1493', '#ff69b4', '#ffb6c1', '#ffd700', '#ff4081', '#ffffff'],
    });

    // Right cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#e11d48', '#f43f5e', '#fb7185', '#f59e0b', '#ec4899', '#fbcfe8'],
    });
  }, 250);

  // Center romantic heart burst
  setTimeout(() => {
    confetti({
      particleCount: 160,
      spread: 140,
      origin: { y: 0.6 },
      colors: ['#ff1493', '#fb7185', '#e11d48', '#ffd700', '#f43f5e'],
      scalar: 1.4,
      shapes: ['star', 'circle'],
      zIndex: 99999,
    });
  }, 400);

  setTimeout(() => {
    confetti({
      particleCount: 180,
      spread: 160,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#fda4af', '#f59e0b', '#fb7185', '#ffffff'],
      scalar: 1.2,
      zIndex: 99999,
    });
  }, 1200);
}
