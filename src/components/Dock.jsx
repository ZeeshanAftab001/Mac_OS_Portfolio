import { dockApps } from '#constants';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import React, { useRef } from 'react';
import { Tooltip } from 'react-tooltip';

function Dock() {
    const docRef = useRef(null);

    useGSAP(() => {
        const dock = docRef.current;
        if (!dock) return;
        
        const icons = Array.from(dock.querySelectorAll('.dock-icon'));
        const MAX_SCALE = 1.6;
        const BASE_SCALE = 1;
        const MAGNETIC_RADIUS = 150;
        const SMOOTHING = 0.3;
        let lastMouseX = 0;
        let animatedValues = icons.map(() => ({ current: BASE_SCALE, target: BASE_SCALE }));
        
        // Create a smoother animation using lerp (linear interpolation)
        const lerp = (start, end, factor) => {
            return start * (1 - factor) + end * factor;
        };
        
        const animateIcon = (mouseX) => {
            const { left, width } = dock.getBoundingClientRect();
            const dockCenter = left + width / 2;
            
            icons.forEach((icon, index) => {
                const { left: iconLeft, width: iconWidth } = icon.getBoundingClientRect();
                const iconCenter = iconLeft + iconWidth / 2;
                
                // Calculate distance from mouse to icon center
                const distance = Math.abs(mouseX + left - iconCenter);
                
                // Magnetic effect: icons pull toward mouse with stronger effect
                const magneticStrength = Math.max(0, 1 - distance / MAGNETIC_RADIUS);
                
                // Add wave effect based on position
                const waveOffset = Math.sin((iconCenter - dockCenter) * 0.01 + Date.now() * 0.001) * 0.1;
                
                // Calculate target scale with multiple effects
                let targetScale = BASE_SCALE;
                
                if (magneticStrength > 0) {
                    // Magnetic effect
                    targetScale += magneticStrength * (MAX_SCALE - BASE_SCALE);
                    
                    // Add slight rotation based on mouse position
                    const rotation = (mouseX - iconCenter) * 0.002 * magneticStrength;
                    gsap.to(icon, {
                        rotation: rotation,
                        duration: 0.3,
                        ease: "back.out(1.2)"
                    });
                    
                    // Add subtle Y movement for "bouncing" effect
                    const yOffset = Math.sin(magneticStrength * Math.PI) * -5;
                    gsap.to(icon, {
                        y: yOffset,
                        duration: 0.2,
                        ease: "elastic.out(0.5, 0.3)"
                    });
                    
                    // Add glow effect
                    icon.style.filter = `drop-shadow(0 0 ${magneticStrength * 10}px rgba(255, 255, 255, ${magneticStrength * 0.3}))`;
                } else {
                    // Reset effects when not hovering
                    gsap.to(icon, {
                        rotation: 0,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    icon.style.filter = 'none';
                }
                
                // Add wave effect to target scale
                targetScale += magneticStrength * waveOffset;
                
                // Smooth the animation
                animatedValues[index].target = targetScale;
                animatedValues[index].current = lerp(
                    animatedValues[index].current,
                    animatedValues[index].target,
                    SMOOTHING
                );
                
                // Apply animation
                gsap.to(icon, {
                    scale: animatedValues[index].current,
                    duration: 0.1,
                    ease: "power1.out",
                    overwrite: true
                });
            });
        };
        
        // Throttle mousemove for better performance
        let rafId = null;
        const handleMouseMove = (e) => {
            if (rafId) return;
            
            rafId = requestAnimationFrame(() => {
                const { left } = dock.getBoundingClientRect();
                const mouseX = e.clientX - left;
                
                // Add inertia based on mouse velocity
                const velocity = mouseX - lastMouseX;
                lastMouseX = mouseX;
                
                // Slightly adjust mouse position based on velocity for anticipation
                const adjustedMouseX = mouseX + velocity * 0.2;
                
                animateIcon(adjustedMouseX);
                rafId = null;
            });
        };

        const resetIcons = () => {
            icons.forEach((icon, index) => {
                gsap.to(icon, {
                    scale: BASE_SCALE,
                    rotation: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)",
                    overwrite: true
                });
                
                gsap.to(icon, {
                    filter: 'none',
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                animatedValues[index] = { current: BASE_SCALE, target: BASE_SCALE };
            });
        };

        // Add event listeners
        dock.addEventListener('mousemove', handleMouseMove);
        dock.addEventListener('mouseleave', resetIcons);
        
        // Animation loop for continuous wave effect when idle
        let waveAnimationId = null;
        const waveAnimation = () => {
            if (!dock.matches(':hover')) {
                const { left, width } = dock.getBoundingClientRect();
                const dockCenter = left + width / 2;
                const time = Date.now() * 0.001;
                
                icons.forEach((icon, index) => {
                    const { left: iconLeft, width: iconWidth } = icon.getBoundingClientRect();
                    const iconCenter = iconLeft + iconWidth / 2;
                    const distanceFromCenter = (iconCenter - dockCenter) / width;
                    
                    // Subtty breathing animation for idle state
                    const idleScale = BASE_SCALE + Math.sin(time * 0.5 + distanceFromCenter * 3) * 0.02;
                    
                    gsap.to(icon, {
                        scale: idleScale,
                        duration: 2,
                        ease: "sine.inOut"
                    });
                });
            }
            waveAnimationId = requestAnimationFrame(waveAnimation);
        };
        
        waveAnimation();
        
        // Cleanup
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            if (waveAnimationId) cancelAnimationFrame(waveAnimationId);
            
            dock.removeEventListener('mousemove', handleMouseMove);
            dock.removeEventListener('mouseleave', resetIcons);
            
            icons.forEach(icon => {
                gsap.killTweensOf(icon);
            });
        };
    }, []);

    const toggleApp = ({ id, canOpen }) => {
        if (!canOpen) return;
        
        // Add click animation
        const button = docRef.current?.querySelector(`[aria-label="${dockApps.find(app => app.id === id)?.name}"]`);
        if (button) {
            gsap.to(button, {
                scale: 0.9,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut",
                onComplete: () => {
                    // Your app opening logic here
                    console.log(`Opening app: ${id}`);
                }
            });
        }
    };
    
    return (
        <section id='dock'>
            <div ref={docRef} className="dock-container">
                {dockApps.map(({ id, name, icon, canOpen }) => (
                    <div key={id} className="relative flex justify-center items-center dock-app">
                        <button
                            type='button'
                            className='dock-icon will-change-transform cursor-pointer'
                            aria-label={name}
                            data-tooltip-id="dock-tooltip"
                            data-tooltip-content={name}
                            data-tooltip-delay-show={150}
                            disabled={!canOpen}
                            onClick={() => toggleApp({ id, canOpen })}
                        >
                            <img 
                                src={`/images/${icon}`}
                                loading='lazy'
                                alt={name} 
                                className={`w-full h-full object-contain transition-all duration-200 ${
                                    canOpen ? 'hover:brightness-110' : 'opacity-60 grayscale'
                                }`}
                            />
                        </button>
                    </div>
                ))}
                <Tooltip id="dock-tooltip" place="top" effect="solid" />
            </div>
        </section>
    );
}

export default Dock;