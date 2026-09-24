import React, { useEffect, useRef } from 'react';

interface HeartParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  wobbleSpeed: number;
  wobbleDistance: number;
  angle: number;
  rotationSpeed: number;
  opacity: number;
  hue: number;
  depth: number; // 0.5 to 1.5 for 3D scale and speed variation
  pulseOffset: number;
}

export const FloatingHeartsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initial pool of 3D floating hearts
    const heartCount = Math.min(32, Math.max(16, Math.floor(width / 35)));
    const hearts: HeartParticle[] = [];

    const createHeart = (initialRandomY = false): HeartParticle => {
      const depth = 0.5 + Math.random() * 0.9;
      return {
        x: Math.random() * width,
        y: initialRandomY ? Math.random() * height : height + 30 + Math.random() * 80,
        size: (14 + Math.random() * 22) * depth,
        speedY: (0.7 + Math.random() * 1.3) * depth,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobbleDistance: 25 + Math.random() * 35,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.35 + Math.random() * 0.45,
        hue: 335 + Math.random() * 25, // deep blush to rose pink
        depth,
        pulseOffset: Math.random() * 100,
      };
    };

    for (let i = 0; i < heartCount; i++) {
      hearts.push(createHeart(true));
    }

    // Click burst extra hearts
    const burstHearts: HeartParticle[] = [];

    const handleClick = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      for (let i = 0; i < 6; i++) {
        burstHearts.push({
          x: clientX + (Math.random() - 0.5) * 40,
          y: clientY + (Math.random() - 0.5) * 40,
          size: 12 + Math.random() * 16,
          speedY: 2.2 + Math.random() * 2,
          wobbleSpeed: 0.04,
          wobbleDistance: 20,
          angle: (Math.random() - 0.5) * 0.5,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          opacity: 0.9,
          hue: 330 + Math.random() * 30,
          depth: 1.1,
          pulseOffset: 0,
        });
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleClick, { passive: true });

    // Draw heart path
    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      opacity: number,
      hue: number,
      depth: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.scale(size / 30, size / 30);

      // 3D-styled glowing radial shading
      const grad = context.createRadialGradient(-4, -6, 2, 0, 0, 24);
      grad.addColorStop(0, `hsla(${hue}, 100%, 82%, ${opacity})`);
      grad.addColorStop(0.5, `hsla(${hue}, 90%, 65%, ${opacity * 0.9})`);
      grad.addColorStop(1, `hsla(${hue - 15}, 85%, 50%, ${opacity * 0.8})`);

      context.fillStyle = grad;
      context.shadowColor = `hsla(${hue}, 95%, 65%, ${0.6 * depth})`;
      context.shadowBlur = 12 * depth;

      context.beginPath();
      context.moveTo(0, 8);
      // Left curve
      context.bezierCurveTo(-14, -10, -26, 4, 0, 26);
      // Right curve
      context.bezierCurveTo(26, 4, 14, -10, 0, 8);
      context.closePath();
      context.fill();

      // 3D specular highlight on left lobe
      context.beginPath();
      context.ellipse(-6, 3, 5, 2.5, -Math.PI / 4, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 255, 255, ${0.45 * opacity})`;
      context.shadowBlur = 0;
      context.fill();

      context.restore();
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Render floating hearts
      for (let i = 0; i < hearts.length; i++) {
        const h = hearts[i];
        h.y -= h.speedY;
        h.angle += h.wobbleSpeed;
        const currentX = h.x + Math.sin(h.angle) * h.wobbleDistance * 0.4;
        const rotation = Math.sin(h.angle) * 0.2;

        drawHeart(ctx, currentX, h.y, h.size, rotation, h.opacity, h.hue, h.depth);

        // Reset if moved out of view
        if (h.y < -50) {
          hearts[i] = createHeart(false);
        }
      }

      // Render burst hearts
      for (let i = burstHearts.length - 1; i >= 0; i--) {
        const bh = burstHearts[i];
        bh.y -= bh.speedY;
        bh.opacity -= 0.012;
        bh.angle += 0.05;
        const currentX = bh.x + Math.sin(bh.angle) * 10;

        if (bh.opacity <= 0) {
          burstHearts.splice(i, 1);
        } else {
          drawHeart(ctx, currentX, bh.y, bh.size, bh.angle, bh.opacity, bh.hue, 1.2);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="floating-hearts-canvas"
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.92 }}
    />
  );
};
