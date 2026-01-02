import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '../../hooks/useGSAP';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * TextMarquee - Infinite scrolling text band (Awwwards-style)
 * 
 * @param {string} text - Text to repeat
 * @param {string} direction - 'left' or 'right'
 * @param {number} speed - Animation duration in seconds
 * @param {boolean} pauseOnHover - Pause animation on hover
 * @param {string} className - Additional classes for styling
 */
const TextMarquee = ({
    text = "PHYSICS • REIMAGINED •",
    direction = 'left',
    speed = 20,
    pauseOnHover = true,
    className = "",
    textClassName = ""
}) => {
    const containerRef = useRef(null);
    const track1Ref = useRef(null);
    const track2Ref = useRef(null);
    const animationRef = useRef(null);

    useIsomorphicLayoutEffect(() => {
        if (!containerRef.current || !track1Ref.current || !track2Ref.current) return;

        const ctx = gsap.context(() => {
            const tracks = [track1Ref.current, track2Ref.current];
            const distance = track1Ref.current.offsetWidth;

            // Set initial positions
            gsap.set(tracks[0], { x: direction === 'left' ? 0 : -distance });
            gsap.set(tracks[1], { x: direction === 'left' ? distance : 0 });

            // Create infinite animation
            animationRef.current = gsap.to(tracks, {
                x: direction === 'left' ? `-=${distance}` : `+=${distance}`,
                duration: speed,
                ease: 'none',
                repeat: -1,
                modifiers: {
                    x: gsap.utils.unitize(x => {
                        const val = parseFloat(x);
                        if (direction === 'left') {
                            return val < -distance ? val + distance * 2 : val;
                        } else {
                            return val > 0 ? val - distance * 2 : val;
                        }
                    })
                }
            });

            // Speed up on scroll
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                onUpdate: (self) => {
                    const velocity = Math.abs(self.getVelocity());
                    const speedMultiplier = 1 + Math.min(velocity / 1000, 3);
                    if (animationRef.current) {
                        animationRef.current.timeScale(speedMultiplier);
                    }
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, [direction, speed, text]);

    // Pause on hover
    const handleMouseEnter = () => {
        if (pauseOnHover && animationRef.current) {
            gsap.to(animationRef.current, { timeScale: 0, duration: 0.5 });
        }
    };

    const handleMouseLeave = () => {
        if (pauseOnHover && animationRef.current) {
            gsap.to(animationRef.current, { timeScale: 1, duration: 0.5 });
        }
    };

    // Repeat text enough times to fill screen
    const repeatedText = Array(10).fill(text).join(' ');

    return (
        <div
            ref={containerRef}
            className={`overflow-hidden whitespace-nowrap ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex">
                <div
                    ref={track1Ref}
                    className={`flex-shrink-0 ${textClassName}`}
                >
                    {repeatedText}
                </div>
                <div
                    ref={track2Ref}
                    className={`flex-shrink-0 ${textClassName}`}
                >
                    {repeatedText}
                </div>
            </div>
        </div>
    );
};

export default TextMarquee;
