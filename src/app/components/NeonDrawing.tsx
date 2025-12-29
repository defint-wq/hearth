import { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';

export function NeonDrawing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const animationRef = useRef<number>(0);
  const pulseRef = useRef<number>(0);
  const sparkleRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        setContext(ctx);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Generate heart path points
  const getHeartPath = (centerX: number, centerY: number, size: number) => {
    const points: { x: number; y: number }[] = [];
    const steps = 200;

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const x = size * 16 * Math.pow(Math.sin(t), 3);
      const y = -size * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      points.push({
        x: centerX + x,
        y: centerY + y
      });
    }

    return points;
  };

  // Draw neon line with multiple glow layers
  const drawNeonLine = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    intensity: number = 1
  ) => {
    // Mega outer glow
    ctx.shadowBlur = 50 * intensity;
    ctx.shadowColor = '#ff0080';
    ctx.strokeStyle = 'rgba(255, 0, 128, 0.4)';
    ctx.lineWidth = 20 * intensity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Large outer glow
    ctx.shadowBlur = 40 * intensity;
    ctx.shadowColor = '#ff0080';
    ctx.strokeStyle = 'rgba(255, 0, 128, 0.6)';
    ctx.lineWidth = 16 * intensity;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Outer glow
    ctx.shadowBlur = 30 * intensity;
    ctx.shadowColor = '#ff1493';
    ctx.strokeStyle = '#ff0080';
    ctx.lineWidth = 12 * intensity;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Middle glow
    ctx.shadowBlur = 20 * intensity;
    ctx.shadowColor = '#ff33aa';
    ctx.strokeStyle = '#ff33aa';
    ctx.lineWidth = 8 * intensity;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Inner bright core
    ctx.shadowBlur = 15 * intensity;
    ctx.shadowColor = '#ff66cc';
    ctx.strokeStyle = '#ff99dd';
    ctx.lineWidth = 5 * intensity;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Brightest center
    ctx.shadowBlur = 10 * intensity;
    ctx.shadowColor = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2 * intensity;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Ultra bright core
    ctx.shadowBlur = 5 * intensity;
    ctx.shadowColor = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1 * intensity;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  // Draw sparkles
  const drawSparkles = (ctx: CanvasRenderingContext2D, heartPoints: { x: number; y: number }[], time: number) => {
    const sparkleCount = 15;
    
    for (let i = 0; i < sparkleCount; i++) {
      const pointIndex = Math.floor((i / sparkleCount) * heartPoints.length);
      const point = heartPoints[pointIndex];
      
      const sparklePhase = (time + i * 200) / 1000;
      const sparkleSize = 2 + Math.sin(sparklePhase) * 1.5;
      const sparkleOpacity = 0.5 + Math.sin(sparklePhase) * 0.5;
      
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffffff';
      ctx.fillStyle = `rgba(255, 255, 255, ${sparkleOpacity})`;
      
      ctx.beginPath();
      ctx.arc(point.x, point.y, sparkleSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw sparkle rays
      for (let j = 0; j < 4; j++) {
        const angle = (j * Math.PI / 2) + sparklePhase;
        const rayLength = 8 + Math.sin(sparklePhase) * 4;
        const x2 = point.x + Math.cos(angle) * rayLength;
        const y2 = point.y + Math.sin(angle) * rayLength;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${sparkleOpacity * 0.6})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  };

  // Animate drawing the heart
  useEffect(() => {
    if (!context || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const size = Math.min(rect.width, rect.height) / 40;

    const heartPoints = getHeartPath(centerX, centerY, size);
    let currentPoint = 0;

    const animate = () => {
      if (currentPoint < heartPoints.length - 1) {
        const p1 = heartPoints[currentPoint];
        const p2 = heartPoints[currentPoint + 1];
        
        drawNeonLine(context, p1.x, p1.y, p2.x, p2.y, 1.2);
        
        currentPoint++;
        setProgress((currentPoint / heartPoints.length) * 100);
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
        startPulseAnimation(heartPoints);
      }
    };

    // Clear and start animation
    context.clearRect(0, 0, canvas.width, canvas.height);
    currentPoint = 0;
    setProgress(0);
    setIsComplete(false);
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (pulseRef.current) {
        cancelAnimationFrame(pulseRef.current);
      }
      if (sparkleRef.current) {
        cancelAnimationFrame(sparkleRef.current);
      }
    };
  }, [context]);

  // Pulsing animation after completion
  const startPulseAnimation = (heartPoints: { x: number; y: number }[]) => {
    if (!context || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const startTime = Date.now();

    const pulse = () => {
      const elapsed = Date.now() - startTime;
      const intensity = 1 + Math.sin(elapsed / 500) * 0.4; // Pulsing between 0.6 and 1.4
      
      // Clear and redraw with pulsing intensity
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the heart with pulsing glow
      for (let i = 0; i < heartPoints.length - 1; i++) {
        const p1 = heartPoints[i];
        const p2 = heartPoints[i + 1];
        drawNeonLine(context, p1.x, p1.y, p2.x, p2.y, intensity);
      }
      
      // Draw sparkles
      drawSparkles(context, heartPoints, elapsed);
      
      pulseRef.current = requestAnimationFrame(pulse);
    };

    pulse();
  };

  const redrawHeart = () => {
    if (!context || !canvasRef.current) return;
    
    if (pulseRef.current) {
      cancelAnimationFrame(pulseRef.current);
    }
    if (sparkleRef.current) {
      cancelAnimationFrame(sparkleRef.current);
    }
    
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset and restart animation by triggering useEffect
    setContext(null);
    setTimeout(() => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        setContext(ctx);
      }
    }, 10);
  };

  return (
    <div className="flex flex-col items-center justify-center size-full gap-6 p-8 h-svh">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl text-white neon-title text-center">
          Хайртай шүү миний хөөрхөн хайраа
        </h1>
        <p className="text-pink-300 text-lg glow-text">Гомдоосонд уучлаарай😔🥺🥺 </p>
        {/* {isComplete && (
          <p className="text-pink-300 text-lg pulse-text">💖 Дууслаа! 💖</p>
        )} */}
      </div>

      <div className="relative w-screen max-w-4xl aspect-[4/3] bg-black rounded-4xl border-2 border-pink-500/50 shadow-[0_0_50px_rgba(255,0,128,0.6)] canvas-glow">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-2xl"
        />
      </div>

      <Button
        onClick={redrawHeart}
        className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-lg px-8 py-6 shadow-[0_0_30px_rgba(255,0,128,0.6)] transition-all hover:shadow-[0_0_50px_rgba(255,0,128,0.9)] hover:scale-105 rounded-2xl"
      >
        ✨ Дахин зурах ✨
      </Button>

      <style>{`
        .neon-title {
          animation: neon-title-flicker 2s ease-in-out infinite;
        }

        @keyframes neon-title-flicker {
          0%, 100% {
            text-shadow: 
              0 0 10px rgba(255, 0, 128, 1),
              0 0 20px rgba(255, 0, 128, 0.8),
              0 0 30px rgba(255, 0, 128, 0.6),
              0 0 40px rgba(255, 0, 128, 0.4),
              0 0 50px rgba(255, 0, 128, 0.2);
          }
          50% {
            text-shadow: 
              0 0 20px rgba(255, 0, 128, 1),
              0 0 30px rgba(255, 0, 128, 1),
              0 0 40px rgba(255, 0, 128, 0.8),
              0 0 60px rgba(255, 0, 128, 0.6),
              0 0 80px rgba(255, 0, 128, 0.4);
          }
        }

        .glow-text {
          text-shadow: 
            0 0 10px rgba(255, 102, 204, 0.8),
            0 0 20px rgba(255, 102, 204, 0.4);
        }

        .pulse-text {
          animation: pulse-scale 1.5s ease-in-out infinite;
          text-shadow: 
            0 0 15px rgba(255, 102, 204, 1),
            0 0 25px rgba(255, 102, 204, 0.6);
        }

        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .canvas-glow {
          animation: canvas-pulse 3s ease-in-out infinite;
        }

        @keyframes canvas-pulse {
          0%, 100% {
            box-shadow: 
              0 0 30px rgba(255, 0, 128, 0.4),
              0 0 50px rgba(255, 0, 128, 0.3),
              inset 0 0 30px rgba(255, 0, 128, 0.1);
          }
          50% {
            box-shadow: 
              0 0 50px rgba(255, 0, 128, 0.6),
              0 0 80px rgba(255, 0, 128, 0.4),
              inset 0 0 40px rgba(255, 0, 128, 0.15);
          }
        }
      `}</style>
    </div>
  );
}