import React, { useRef, useEffect } from 'react';

export const PremiumStarfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    const numStars = 200;
    const mouse: { x: number | null, y: number | null } = { x: null, y: null };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Star {
      x: number;
      y: number;
      origX: number;
      origY: number;
      size: number;
      baseSize: number;
      speed: number;
      twinkle: number;

      constructor(x: number, y: number, size: number, speed: number) {
        this.x = x;
        this.y = y;
        this.origX = x;
        this.origY = y;
        this.size = size;
        this.baseSize = size;
        this.speed = speed;
        this.twinkle = Math.random() * 0.05 + 0.01;
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }

      update() {
        // Twinkle effect
        this.size = this.baseSize + Math.sin(Date.now() * this.twinkle) * 0.5;

        // Scatter away from mouse
        if (mouse.x !== null && mouse.y !== null) {
          let dx = this.x - mouse.x;
          let dy = this.y - mouse.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const angle = Math.atan2(dy, dx);
            const force = (100 - dist) / 5;
            this.x += Math.cos(angle) * force;
            this.y += Math.sin(angle) * force;
          } else {
            // Parallax effect
            this.x += (this.origX - this.x) * 0.02 + (mouse.x - window.innerWidth / 2) * this.speed * 0.0005;
            this.y += (this.origY - this.y) * 0.02 + (mouse.y - window.innerHeight / 2) * this.speed * 0.0005;
          }
        }
        
        this.draw();
      }
    }

    const init = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let size = Math.random() * 2 + 1;
        let speed = Math.random() * 2;
        stars.push(new Star(x, y, size, speed));
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => star.update());
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    
    resizeCanvas();
    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return <canvas ref={canvasRef} id="starfield" style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, background: 'black' }} />;
};
