import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '../../hooks/useGSAP';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * HorizontalScroll - Container that scrolls horizontally when scrolling vertically
 * 
 * This is the famous pinned horizontal scroll effect used by top agencies.
 * Content is pinned while user scrolls, moving horizontally.
 */
const HorizontalScroll = ({
    children,
    className = "",
    speed = 1,
    showProgress = false
}) => {
    const containerRef = useRef(null);
    const wrapperRef = useRef(null);
    const progressRef = useRef(null);

    useIsomorphicLayoutEffect(() => {
        if (!containerRef.current || !wrapperRef.current) return;

        const container = containerRef.current;
        const wrapper = wrapperRef.current;

        // Calculate how much to scroll
        const scrollWidth = wrapper.scrollWidth - container.offsetWidth;

        const ctx = gsap.context(() => {
            // Horizontal scroll animation
            const scrollTween = gsap.to(wrapper, {
                x: -scrollWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: () => `+=${scrollWidth * speed}`,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        if (progressRef.current) {
                            gsap.set(progressRef.current, { scaleX: self.progress });
                        }
                    }
                }
            });

            // Animate children as they come into view
            const items = wrapper.querySelectorAll('.h-scroll-item');
            items.forEach((item, i) => {
                gsap.fromTo(item,
                    { opacity: 0.3, scale: 0.9 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        scrollTrigger: {
                            trigger: item,
                            containerAnimation: scrollTween,
                            start: 'left 80%',
                            end: 'left 30%',
                            scrub: true
                        }
                    }
                );
            });

        }, containerRef);

        return () => ctx.revert();
    }, [speed, children]);

    return (
        <section ref={containerRef} className={`relative overflow-hidden ${className}`}>
            {/* Progress bar */}
            {showProgress && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-50">
                    <div
                        ref={progressRef}
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 origin-left"
                        style={{ transform: 'scaleX(0)' }}
                    />
                </div>
            )}

            <div
                ref={wrapperRef}
                className="flex h-full"
                style={{ width: 'max-content' }}
            >
                {children}
            </div>
        </section>
    );
};

/**
 * HorizontalScrollItem - Individual item within horizontal scroll
 */
export const HorizontalScrollItem = ({ children, className = "" }) => (
    <div className={`h-scroll-item flex-shrink-0 ${className}`}>
        {children}
    </div>
);

export default HorizontalScroll;
