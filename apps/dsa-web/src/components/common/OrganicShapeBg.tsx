import { useEffect, useRef } from 'react';

interface OrganicShapeBgProps {
  colors?: string[];
  className?: string;
}

const DEFAULT_COLORS = ['#E6CADB', '#8e061a', '#84332a', '#571a00', '#59081b', '#E6CADB'];

/**
 * Canvas-based organic shape background.
 * Draws morphing blobs in dark red/pink tones, matching the 如意金股 brand.
 */
export const OrganicShapeBg: React.FC<OrganicShapeBgProps> = ({
  colors = DEFAULT_COLORS,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    function drawBlob(
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      fill: string,
      alpha: number,
      angle: number
    ) {
      c.save();
      c.translate(cx, cy);
      c.rotate(angle);
      c.globalAlpha = alpha;
      const grad = c.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry) * 1.1);
      grad.addColorStop(0, fill);
      grad.addColorStop(1, 'transparent');
      c.fillStyle = grad;
      c.beginPath();
      c.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const blobs = colors.map((color) => ({
      baseX: canvas.width * (0.15 + Math.random() * 0.7),
      baseY: canvas.height * (0.15 + Math.random() * 0.7),
      rx: canvas.width * (0.12 + Math.random() * 0.18),
      ry: canvas.height * (0.10 + Math.random() * 0.18),
      color,
      alpha: 0.25 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      speed: 0.0003 + Math.random() * 0.0008,
      amp: 15 + Math.random() * 40,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(10, 5, 5, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const b of blobs) {
        const t = performance.now() * b.speed + b.phase;
        const x = b.baseX + Math.sin(t * 1.3) * b.amp;
        const y = b.baseY + Math.cos(t * 0.9) * b.amp;
        const rx = b.rx + Math.sin(t * 2.1) * b.amp * 0.3;
        const ry = b.ry + Math.cos(t * 1.7) * b.amp * 0.3;
        const angle = Math.sin(t * 0.5) * 0.5;

        ctx.filter = 'blur(60px)';
        drawBlob(ctx, x, y, rx, ry, b.color, b.alpha, angle);
        ctx.filter = 'none';
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? 'fixed inset-0 z-0 pointer-events-none'}
      style={{ background: '#0a0505' }}
    />
  );
};

export default OrganicShapeBg;