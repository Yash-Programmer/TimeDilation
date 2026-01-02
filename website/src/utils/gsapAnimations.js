import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
gsap.registerPlugin(ScrollTrigger);

// ============================================
// EASING PRESETS
// ============================================
export const easings = {
    // Primary easings
    smooth: 'power4.out',
    smoothIn: 'power4.in',
    smoothInOut: 'power4.inOut',

    // Elastic/bouncy
    elastic: 'elastic.out(1, 0.3)',
    bounce: 'bounce.out',
    back: 'back.out(1.7)',

    // Subtle
    sine: 'sine.inOut',
    expo: 'expo.out',

    // Custom bezier curves
    apple: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
};

// ============================================
// DURATION PRESETS
// ============================================
export const durations = {
    instant: 0.15,
    fast: 0.3,
    normal: 0.6,
    slow: 0.9,
    dramatic: 1.2,
    cinematic: 1.8,
};

// ============================================
// STAGGER PRESETS
// ============================================
export const staggers = {
    fast: 0.03,
    normal: 0.08,
    slow: 0.12,
    grid: {
        amount: 0.5,
        from: 'start',
        grid: 'auto',
    },
    center: {
        amount: 0.5,
        from: 'center',
    },
    edges: {
        amount: 0.5,
        from: 'edges',
    },
    random: {
        amount: 0.5,
        from: 'random',
    },
};

// ============================================
// ANIMATION PRESETS
// ============================================

/**
 * Fade animations
 */
export const fadeIn = {
    from: { opacity: 0 },
    to: { opacity: 1, duration: durations.normal, ease: easings.smooth },
};

export const fadeInUp = {
    from: { opacity: 0, y: 60 },
    to: { opacity: 1, y: 0, duration: durations.normal, ease: easings.smooth },
};

export const fadeInDown = {
    from: { opacity: 0, y: -60 },
    to: { opacity: 1, y: 0, duration: durations.normal, ease: easings.smooth },
};

export const fadeInLeft = {
    from: { opacity: 0, x: -60 },
    to: { opacity: 1, x: 0, duration: durations.normal, ease: easings.smooth },
};

export const fadeInRight = {
    from: { opacity: 0, x: 60 },
    to: { opacity: 1, x: 0, duration: durations.normal, ease: easings.smooth },
};

/**
 * Scale animations
 */
export const scaleIn = {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1, duration: durations.normal, ease: easings.back },
};

export const scaleInBounce = {
    from: { opacity: 0, scale: 0 },
    to: { opacity: 1, scale: 1, duration: durations.slow, ease: easings.elastic },
};

/**
 * 3D animations
 */
export const flipInX = {
    from: { opacity: 0, rotateX: -90 },
    to: { opacity: 1, rotateX: 0, duration: durations.slow, ease: easings.smooth },
};

export const flipInY = {
    from: { opacity: 0, rotateY: -90 },
    to: { opacity: 1, rotateY: 0, duration: durations.slow, ease: easings.smooth },
};

// ============================================
// SCROLL TRIGGER PRESETS
// ============================================
export const scrollTriggerPresets = {
    fadeIn: {
        start: 'top 85%',
        end: 'top 50%',
        toggleActions: 'play none none none',
    },
    scrub: {
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
    },
    pin: {
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1,
    },
    parallax: {
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
    },
};

// ============================================
// ANIMATION FUNCTIONS
// ============================================

/**
 * Animate elements with fade-in-up effect
 */
export const animateFadeInUp = (elements, options = {}) => {
    return gsap.fromTo(
        elements,
        { opacity: 0, y: options.y || 60 },
        {
            opacity: 1,
            y: 0,
            duration: options.duration || durations.normal,
            stagger: options.stagger || staggers.normal,
            ease: options.ease || easings.smooth,
            delay: options.delay || 0,
            scrollTrigger: options.scrollTrigger || {
                trigger: elements[0] || elements,
                ...scrollTriggerPresets.fadeIn,
            },
        }
    );
};

/**
 * Animate text with character split
 */
export const animateSplitText = (element, options = {}) => {
    if (!element) return null;

    const text = element.textContent;
    const chars = text.split('');

    element.innerHTML = chars
        .map(char => `<span class="gsap-char" style="display:inline-block;transform-origin:center bottom">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('');

    const charElements = element.querySelectorAll('.gsap-char');

    return gsap.fromTo(
        charElements,
        {
            opacity: 0,
            y: options.y || 100,
            rotateX: options.rotateX || -90,
        },
        {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: options.duration || durations.normal,
            stagger: options.stagger || 0.02,
            ease: options.ease || easings.smooth,
            delay: options.delay || 0,
            scrollTrigger: options.scrollTrigger,
        }
    );
};

/**
 * Animate word by word
 */
export const animateSplitWords = (element, options = {}) => {
    if (!element) return null;

    const text = element.textContent;
    const words = text.split(' ');

    element.innerHTML = words
        .map(word => `<span class="gsap-word" style="display:inline-block;margin-right:0.25em">${word}</span>`)
        .join('');

    const wordElements = element.querySelectorAll('.gsap-word');

    return gsap.fromTo(
        wordElements,
        {
            opacity: 0,
            y: options.y || 40,
        },
        {
            opacity: 1,
            y: 0,
            duration: options.duration || durations.normal,
            stagger: options.stagger || 0.05,
            ease: options.ease || easings.smooth,
            delay: options.delay || 0,
            scrollTrigger: options.scrollTrigger,
        }
    );
};

/**
 * Animate a counter from 0 to target
 */
export const animateCounter = (element, endValue, options = {}) => {
    const obj = { value: options.startValue || 0 };

    return gsap.to(obj, {
        value: endValue,
        duration: options.duration || durations.cinematic,
        ease: options.ease || easings.smooth,
        delay: options.delay || 0,
        scrollTrigger: options.scrollTrigger,
        onUpdate: () => {
            if (element) {
                const formatted = options.formatter
                    ? options.formatter(obj.value)
                    : Math.round(obj.value);
                element.textContent = formatted;
            }
        },
    });
};

/**
 * Create a parallax effect
 */
export const createParallax = (element, options = {}) => {
    return gsap.to(element, {
        yPercent: options.yPercent || -30,
        ease: 'none',
        scrollTrigger: {
            trigger: options.trigger || element,
            ...scrollTriggerPresets.parallax,
        },
    });
};

/**
 * Create a stagger animation for grid items
 */
export const animateGrid = (container, itemSelector, options = {}) => {
    const items = container.querySelectorAll(itemSelector);

    return gsap.fromTo(
        items,
        {
            opacity: 0,
            y: options.y || 80,
            scale: options.scale || 0.9,
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: options.duration || durations.normal,
            stagger: options.stagger || {
                amount: 0.8,
                from: 'start',
                grid: 'auto',
            },
            ease: options.ease || easings.smooth,
            scrollTrigger: {
                trigger: container,
                start: 'top 85%',
                toggleActions: 'play none none none',
                ...options.scrollTrigger,
            },
        }
    );
};

/**
 * Create a reveal animation (clip-path based)
 */
export const animateReveal = (element, options = {}) => {
    const direction = options.direction || 'up';
    const clipPaths = {
        up: { from: 'inset(100% 0 0 0)', to: 'inset(0% 0 0 0)' },
        down: { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0% 0)' },
        left: { from: 'inset(0 100% 0 0)', to: 'inset(0 0% 0 0)' },
        right: { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0%)' },
    };

    return gsap.fromTo(
        element,
        { clipPath: clipPaths[direction].from },
        {
            clipPath: clipPaths[direction].to,
            duration: options.duration || durations.slow,
            ease: options.ease || easings.smooth,
            scrollTrigger: options.scrollTrigger,
        }
    );
};

/**
 * Magnetic hover effect
 */
export const createMagneticEffect = (element, options = {}) => {
    const strength = options.strength || 0.3;

    const handleMouseMove = (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(element, {
            x: x * strength,
            y: y * strength,
            duration: durations.fast,
            ease: easings.smooth,
        });
    };

    const handleMouseLeave = () => {
        gsap.to(element, {
            x: 0,
            y: 0,
            duration: durations.normal,
            ease: easings.elastic,
        });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
    };
};

/**
 * Create typewriter effect
 */
export const animateTypewriter = (element, options = {}) => {
    const text = element.textContent;
    element.textContent = '';

    const tl = gsap.timeline({
        scrollTrigger: options.scrollTrigger,
    });

    text.split('').forEach((char, i) => {
        tl.to(element, {
            duration: options.speed || 0.05,
            onComplete: () => {
                element.textContent += char;
            },
        }, i * (options.speed || 0.05));
    });

    return tl;
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Kill all ScrollTriggers (for cleanup)
 */
export const killAllScrollTriggers = () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

/**
 * Refresh all ScrollTriggers (after DOM changes)
 */
export const refreshScrollTriggers = () => {
    ScrollTrigger.refresh();
};

/**
 * Create a batch animation for many elements
 */
export const createBatch = (selector, options = {}) => {
    return ScrollTrigger.batch(selector, {
        onEnter: (elements) => {
            gsap.fromTo(
                elements,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: durations.normal,
                    stagger: staggers.fast,
                    ease: easings.smooth,
                    overwrite: true,
                }
            );
        },
        start: 'top 85%',
        ...options,
    });
};

export { gsap, ScrollTrigger };
