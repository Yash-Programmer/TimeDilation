import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { gsap } from '../../hooks/useGSAP';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * MagneticButton - Button with magnetic cursor attraction effect
 * 
 * Like top agency websites, the button follows the cursor within a radius
 * and snaps back elastically when cursor leaves.
 */
const MagneticButton = ({
    children,
    className = "",
    strength = 0.4,
    radius = 100,
    as: Component = 'button',
    ...props
}) => {
    const buttonRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useIsomorphicLayoutEffect(() => {
        if (!buttonRef.current) return;

        const button = buttonRef.current;
        const buttonRect = button.getBoundingClientRect();

        const handleMouseMove = (e) => {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distX = e.clientX - centerX;
            const distY = e.clientY - centerY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            if (distance < radius) {
                setIsHovered(true);
                gsap.to(button, {
                    x: distX * strength,
                    y: distY * strength,
                    scale: 1.05, // More subtle scale
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else if (isHovered) {
                setIsHovered(false);
                gsap.to(button, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.3)'
                });
            }
        };

        const handleMouseLeave = () => {
            setIsHovered(false);
            gsap.to(button, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)'
            });
        };

        // Listen on document for wider radius
        document.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            button.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength, radius, isHovered]);

    return (
        <Component
            ref={buttonRef}
            className={`magnetic-button ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
};

export default MagneticButton;
