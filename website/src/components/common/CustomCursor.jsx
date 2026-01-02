import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../../hooks/useGSAP';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const [isPointer, setIsPointer] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Hide default cursor
        document.body.style.cursor = 'none';

        const onMouseMove = (e) => {
            if (!isVisible) setIsVisible(true);

            // Main dot follows instantly
            gsap.to(cursorRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0,
                ease: 'none'
            });

            // Follower with lag
            gsap.to(followerRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: 'power2.out'
            });
        };

        const onMouseDown = () => {
            gsap.to([cursorRef.current, followerRef.current], {
                scale: 0.8,
                duration: 0.1,
                ease: 'power2.out'
            });
        };

        const onMouseUp = () => {
            gsap.to([cursorRef.current, followerRef.current], {
                scale: isPointer ? 1.5 : 1,
                duration: 0.1,
                ease: 'back.out(1.7)'
            });
        };

        // Check for hoverable elements
        const onMouseOver = (e) => {
            const target = e.target;
            const isLink = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.classList.contains('cursor-hover');

            setIsPointer(!!isLink);

            if (isLink) {
                gsap.to(followerRef.current, {
                    scale: 2.5,
                    backgroundColor: 'rgba(0, 0, 0, 0.05)', // Subtle gray tint
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
                gsap.to(cursorRef.current, {
                    scale: 0,
                    duration: 0.3
                });
            } else {
                gsap.to(followerRef.current, {
                    scale: 1,
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(0, 0, 0, 0.3)', // Lighter border
                    duration: 0.3,
                    ease: 'power2.out'
                });
                gsap.to(cursorRef.current, {
                    scale: 1,
                    duration: 0.3
                });
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mouseover', onMouseOver);

        return () => {
            document.body.style.cursor = 'auto';
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mouseover', onMouseOver);
        };
    }, [isPointer, isVisible]);

    // Don't render on mobile/touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2.5 h-2.5 bg-black rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
                style={{ opacity: isVisible ? 1 : 0 }}
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-10 h-10 border border-black/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
                style={{ opacity: isVisible ? 1 : 0 }}
            />
        </>
    );
};

export default CustomCursor;
