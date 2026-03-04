import { useEffect, useRef } from 'react';
import './hero.css'
import Git from '../../assets/git.png';

export const Hero = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const box = canvas.parentElement;
        
        const getActiveColor = () => {
            const color = getComputedStyle(document.documentElement)
                .getPropertyValue('--active-link')
                .trim();
            return color;
        };

        const hexToRgba = (hex, alpha) => {
            hex = hex.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        const particles = [];
        const maxParticles = 35;
        const maxDistance = 150;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = 5;
                this.opacity = 0;
                this.fadeIn = true;
                this.fadeSpeed = 0.02;
                this.lifetime = Math.random() * 3000 + 2000; 
                this.age = 0;
            }

            update(deltaTime) {
                this.age += deltaTime;

                if (this.fadeIn) {
                    this.opacity += this.fadeSpeed;
                    if (this.opacity >= 1) {
                        this.opacity = 1;
                        this.fadeIn = false;
                    }
                }

                if (this.age > this.lifetime * 0.7) {
                    this.opacity -= this.fadeSpeed * 0.5;
                }

                return this.age < this.lifetime && this.opacity > 0;
            }

            draw() {
                const activeColor = getActiveColor();
                ctx.fillStyle = hexToRgba(activeColor, this.opacity);
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        let lastTime = Date.now();
        let spawnTimer = 0;
        const spawnInterval = 300;
        let animationId;

        const resizeCanvas = () => {
            const rect = box.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        
        resizeCanvas();

        function animate() {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            spawnTimer += deltaTime;
            if (spawnTimer > spawnInterval && particles.length < maxParticles) {
                particles.push(new Particle());
                spawnTimer = 0;
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const isAlive = particles[i].update(deltaTime);
                if (!isAlive) {
                    particles.splice(i, 1);
                } else {
                    particles[i].draw();
                }
            }

            const activeColor = getActiveColor();
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const avgOpacity = (particles[i].opacity + particles[j].opacity) / 2;
                        const opacity = (1 - (distance / maxDistance)) * avgOpacity;
                        ctx.strokeStyle = hexToRgba(activeColor, opacity * 0.8);
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            resizeCanvas();
        };
        
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="hero">
            <div className="container">
                <div className="hero-cont">
                    <div className="left">
                        <div className="enso">
                            <div className="circle"></div>
                            <p>ENTERPRISE SOLUTIONS</p>
                        </div>
                        <h1>Architecting the <span>Core</span> of Digital Intelligence</h1>
                        <div className="line"></div>
                        <p>We build specialized software solutions for complex enterprise challenges. No templates, just rigorous engineering designed for scale.</p>
                        <div className="btns">
                            <div className="start-btn">
                                <button>Start a Project</button>
                            </div>
                            <div className="view-case">
                                <button>View Case Studies</button>
                            </div>
                        </div>
                    </div>
                    <div className="line-center"></div>
                    <div className="right">
                        <div className="box" id='box'>
                            <canvas ref={canvasRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>
                <div className="trustby">
                    <h3>Trust by</h3>
                    <div className="icons">
                        <img src={Git} alt="Git" />
                        <img src={Git} alt="Git" />
                        <img src={Git} alt="Git" />
                        <img src={Git} alt="Git" />
                    </div>
                </div>
        </div>
    );
}