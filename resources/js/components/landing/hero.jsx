import { register } from '@/routes';
import { Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function HeroSection() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let windLines = [];

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class WindLine {
            constructor() {
                this.reset();
            }

            reset() {
                this.startX = -100;
                this.y = Math.random() * canvas.height;
                this.length = Math.random() * 150 + 100;
                this.speed = Math.random() * 3 + 2;
                this.amplitude = Math.random() * 30 + 15;
                this.frequency = Math.random() * 0.015 + 0.01;
                this.opacity = Math.random() * 0.25 + 0.1;
                this.thickness = Math.random() * 2 + 1;
                this.offset = Math.random() * Math.PI * 2;
            }

            update() {
                this.startX += this.speed;
                this.offset += 0.02;

                if (this.startX > canvas.width + 100) {
                    this.reset();
                }
            }

            draw() {
                ctx.strokeStyle = `rgba(14, 165, 233, ${this.opacity})`;
                ctx.lineWidth = this.thickness;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                ctx.beginPath();

                for (let i = 0; i < this.length; i++) {
                    const x = this.startX + i;
                    const wave =
                        Math.sin(i * this.frequency + this.offset) *
                        this.amplitude;
                    const y = this.y + wave;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                ctx.stroke();

                const gradient = ctx.createLinearGradient(
                    this.startX,
                    this.y,
                    this.startX + this.length,
                    this.y,
                );
                gradient.addColorStop(0, `rgba(14, 165, 233, 0)`);
                gradient.addColorStop(
                    0.5,
                    `rgba(14, 165, 233, ${this.opacity})`,
                );
                gradient.addColorStop(1, `rgba(14, 165, 233, 0)`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = this.thickness;

                ctx.beginPath();
                for (let i = 0; i < this.length; i++) {
                    const x = this.startX + i;
                    const wave =
                        Math.sin(i * this.frequency + this.offset) *
                        this.amplitude;
                    const y = this.y + wave;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }
        }

        for (let i = 0; i < 25; i++) {
            windLines.push(new WindLine());
            windLines[i].startX = Math.random() * canvas.width;
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            windLines.forEach((line) => {
                line.update();
                line.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section className="w-full relative mx-auto flex  flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-b from-sky-50 to-white px-6 py-24 text-center">
            <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 h-full w-full"
                style={{ opacity: 0.5 }}
            />

            <div className="relative z-10">
                <h2 className="max-w-3xl text-4xl leading-tight font-bold text-[#0A1A2F] sm:text-5xl dark:text-white">
                    Send <span className="text-sky-600">Fast</span>,{' '}
                    <span className="text-teal-500">Reliable</span> &
                    <br /> Personalized Bulk SMS with Ease.
                </h2>
            </div>

            <p className="relative z-10 max-w-xl text-gray-600 dark:text-gray-400">
                Windsms helps businesses communicate with millions of customers
                in seconds — schedule campaigns, personalize messages, and track
                delivery analytics effortlessly.
            </p>

            <div className="relative z-10 mt-4 flex gap-4">
                <Link
                    href={register()}
                    className="rounded-lg bg-sky-600 px-6 py-3 text-white shadow-md transition hover:bg-sky-700"
                >
                    Get Started Free
                </Link>
                <Link
                    href="#features"
                    className="rounded-lg border border-sky-500 px-6 py-3 text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-900/30"
                >
                    Explore Features
                </Link>
            </div>

            <img
                src="/dashboard.png"
                alt="SMS Dashboard Preview"
                className="relative z-10 mt-10 w-full max-w-5xl rounded-2xl shadow-lg"
            />
        </section>
    );
}
