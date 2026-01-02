import { useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Use useLayoutEffect on client, useEffect during SSR
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Main GSAP hook with automatic cleanup
 * @param {Function} callback - Animation callback receiving gsap context
 * @param {Array} deps - Dependency array
 */
export const useGSAP = (callback, deps = []) => {
    const ref = useRef(null);

    useIsomorphicLayoutEffect(() => {
        const ctx = gsap.context(() => {
            callback(gsap, ref.current);
        }, ref);

        return () => ctx.revert();
    }, deps);

    return ref;
};

/**
 * ScrollTrigger animation hook
 * @param {Object} options - ScrollTrigger options
 */
export const useScrollTrigger = (options = {}) => {
    const triggerRef = useRef(null);
    const animationRef = useRef(null);

    useIsomorphicLayoutEffect(() => {
        if (!triggerRef.current) return;

        const defaults = {
            trigger: triggerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            ...options,
        };

        animationRef.current = ScrollTrigger.create(defaults);

        return () => {
            if (animationRef.current) {
                animationRef.current.kill();
            }
        };
    }, []);

    return triggerRef;
};

/**
 * Parallax effect hook
 * @param {number} speed - Parallax speed multiplier (-1 to 1)
 */
export const useParallax = (speed = 0.5) => {
    const ref = useRef(null);

    useIsomorphicLayoutEffect(() => {
        if (!ref.current) return;

        const animation = gsap.to(ref.current, {
            yPercent: speed * 100,
            ease: 'none',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
        });

        return () => {
            animation.scrollTrigger?.kill();
            animation.kill();
        };
    }, [speed]);

    return ref;
};

/**
 * Stagger animation hook for lists/grids
 * @param {string} selector - Child elements selector
 * @param {Object} options - Animation options
 */
export const useStagger = (selector = '.stagger-item', options = {}) => {
    const containerRef = useRef(null);

    useIsomorphicLayoutEffect(() => {
        if (!containerRef.current) return;

        const elements = containerRef.current.querySelectorAll(selector);
        if (!elements.length) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                elements,
                {
                    opacity: 0,
                    y: 50,
                    ...options.from,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                    ...options.to,
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [selector]);

    return containerRef;
};

/**
 * Text split animation hook
 * @param {Object} options - Animation options
 */
export const useSplitText = (options = {}) => {
    const textRef = useRef(null);

    useIsomorphicLayoutEffect(() => {
        if (!textRef.current) return;

        const text = textRef.current;
        const originalText = text.textContent;
        const chars = originalText.split('');

        text.innerHTML = chars
            .map((char) => `<span class="gsap-char" style="display:inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
            .join('');

        const charElements = text.querySelectorAll('.gsap-char');

        const ctx = gsap.context(() => {
            gsap.fromTo(
                charElements,
                {
                    opacity: 0,
                    y: 50,
                    rotateX: -90,
                },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.8,
                    stagger: 0.02,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: text,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                    ...options,
                }
            );
        }, text);

        return () => {
            ctx.revert();
            text.textContent = originalText;
        };
    }, []);

    return textRef;
};

/**
 * Counter animation hook
 * @param {number} endValue - Target number
 * @param {Object} options - Animation options
 */
export const useCounter = (endValue, options = {}) => {
    const counterRef = useRef(null);
    const valueRef = useRef({ value: 0 });

    useIsomorphicLayoutEffect(() => {
        if (!counterRef.current) return;

        const ctx = gsap.context(() => {
            gsap.to(valueRef.current, {
                value: endValue,
                duration: options.duration || 2,
                ease: options.ease || 'power2.out',
                scrollTrigger: {
                    trigger: counterRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
                onUpdate: () => {
                    if (counterRef.current) {
                        const val = valueRef.current.value;
                        counterRef.current.textContent = options.formatter
                            ? options.formatter(val)
                            : Math.round(val);
                    }
                },
            });
        }, counterRef);

        return () => ctx.revert();
    }, [endValue]);

    return counterRef;
};

/**
 * Timeline animation hook
 * @param {Function} buildTimeline - Function that builds and returns the timeline
 * @param {Array} deps - Dependencies
 */
export const useTimeline = (buildTimeline, deps = []) => {
    const ref = useRef(null);
    const timelineRef = useRef(null);

    useIsomorphicLayoutEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            timelineRef.current = buildTimeline(gsap, ref.current);
        }, ref);

        return () => ctx.revert();
    }, deps);

    return { ref, timeline: timelineRef };
};

// Export gsap and ScrollTrigger for direct use
export { gsap, ScrollTrigger };
