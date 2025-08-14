import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
    onComplete: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const confettiCount = 100;
        const confetti: ConfettiPiece[] = [];

        canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;

        const colors = ["#fde047", "#f97316", "#38bdf8", "#4ade80"];

        class ConfettiPiece {
            x: number;
            y: number;
            w: number;
            h: number;
            color: string;
            speed: number;
            angle: number;
            tilt: number;
            tiltAngle: number;
            tiltAngleSpeed: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height - canvas.height;
                this.w = Math.random() * 8 + 5;
                this.h = Math.random() * 8 + 5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.speed = Math.random() * 2 + 2;
                this.angle = Math.random() * Math.PI * 2;
                this.tilt = Math.random() * 10;
                this.tiltAngle = 0;
                this.tiltAngleSpeed = Math.random() * 0.1 + 0.05;
            }

            draw() {
                ctx!.beginPath();
                ctx!.lineWidth = this.w;
                ctx!.strokeStyle = this.color;
                ctx!.moveTo(this.x + this.tilt + (this.w / 2), this.y);
                ctx!.lineTo(this.x + this.tilt, this.y + this.tilt + this.h);
                ctx!.stroke();
            }

            update() {
                this.y += this.speed;
                this.tiltAngle += this.tiltAngleSpeed;
                this.tilt = Math.sin(this.tiltAngle) * 12;
                this.draw();
            }
        }
        
        for (let i = 0; i < confettiCount; i++) {
            confetti.push(new ConfettiPiece());
        }

        let startTime = Date.now();
        const duration = 4000; // 4 seconds

        const animate = () => {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime > duration) {
                onComplete();
                return;
            }
            ctx!.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < confetti.length; i++) {
                confetti[i].update();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };

    }, [onComplete]);

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, pointerEvents: 'none' }} />;
};
