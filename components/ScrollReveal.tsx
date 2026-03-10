import React, { useEffect, useRef, useMemo, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  // Store trigger IDs for targeted cleanup (avoid killing unrelated triggers)
  const triggerIdsRef = useRef<string[]>([]);

  // PERF: Memoize split text with GPU-acceleration hints
  // Use two-layer approach for blur: blurred layer underneath, clear layer on top
  // Animate opacity of clear layer (GPU-composited) instead of filter: blur (causes repaints)
  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      
      // PERF: Two-layer blur technique - animate opacity (GPU) instead of blur (CPU)
      if (enableBlur) {
        return (
          <span 
            className="inline-block word relative" 
            key={index}
            // PERF: will-change hints for composite layer promotion
            style={{ willChange: 'opacity, transform' }}
          >
            {/* Background blurred layer (static blur, no animation needed) */}
            <span 
              className="word-blur absolute inset-0"
              style={{ 
                filter: `blur(${blurStrength}px)`,
                // PERF: Force GPU layer for the static blurred element
                transform: 'translateZ(0)',
                willChange: 'opacity'
              }}
              aria-hidden="true"
            >
              {word}
            </span>
            {/* Foreground clear layer (animate opacity only - GPU accelerated) */}
            <span 
              className="word-clear relative"
              style={{ 
                // PERF: Force GPU layer
                transform: 'translateZ(0)',
                willChange: 'opacity'
              }}
            >
              {word}
            </span>
          </span>
        );
      }
      
      return (
        <span 
          className="inline-block word" 
          key={index}
          style={{ willChange: 'opacity, transform' }}
        >
          {word}
        </span>
      );
    });
  }, [children, enableBlur, blurStrength]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
    const triggers: string[] = [];

    // PERF: Container rotation animation - use transform only (GPU accelerated)
    const rotationTrigger = gsap.fromTo(
      el,
      { 
        transformOrigin: '0% 50%', 
        rotate: baseRotation,
        // PERF: Force GPU acceleration
        force3D: true
      },
      {
        ease: 'none',
        rotate: 0,
        force3D: true,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true,
          // PERF: Reduce ScrollTrigger overhead
          fastScrollEnd: true,
          preventOverlaps: true
        }
      }
    );
    if (rotationTrigger.scrollTrigger?.vars.id) {
      triggers.push(rotationTrigger.scrollTrigger.vars.id);
    }

    if (enableBlur) {
      // PERF: Two-layer blur technique
      // Animate clear layer opacity (from 0 to 1) while blur layer fades out
      const clearElements = el.querySelectorAll<HTMLElement>('.word-clear');
      const blurElements = el.querySelectorAll<HTMLElement>('.word-blur');

      // Clear layer: start hidden, fade in
      gsap.set(clearElements, { opacity: 0 });
      // Blur layer: start visible
      gsap.set(blurElements, { opacity: 1 });

      // PERF: Animate opacity only (GPU composite operation)
      const clearTrigger = gsap.to(clearElements, {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true,
          fastScrollEnd: true
        }
      });

      // PERF: Fade out blur layer simultaneously (opacity only)
      const blurTrigger = gsap.to(blurElements, {
        ease: 'none',
        opacity: 0,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true,
          fastScrollEnd: true
        }
      });

      if (clearTrigger.scrollTrigger?.vars.id) triggers.push(clearTrigger.scrollTrigger.vars.id);
      if (blurTrigger.scrollTrigger?.vars.id) triggers.push(blurTrigger.scrollTrigger.vars.id);

    } else {
      // Non-blur mode: simple opacity animation
      const wordElements = el.querySelectorAll<HTMLElement>('.word');

      gsap.set(wordElements, { opacity: baseOpacity });

      const opacityTrigger = gsap.to(wordElements, {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true,
          fastScrollEnd: true
        }
      });

      if (opacityTrigger.scrollTrigger?.vars.id) triggers.push(opacityTrigger.scrollTrigger.vars.id);
    }

    triggerIdsRef.current = triggers;

    // PERF: Clean up only our specific triggers, not all ScrollTriggers globally
    return () => {
      triggerIdsRef.current.forEach(id => {
        const trigger = ScrollTrigger.getById(id);
        if (trigger) trigger.kill();
      });
      // Kill all tweens on this element to prevent memory leaks
      gsap.killTweensOf(el);
      gsap.killTweensOf(el.querySelectorAll('.word, .word-clear, .word-blur'));
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 
      ref={containerRef} 
      className={`my-5 ${containerClassName}`}
      // PERF: Force GPU layer for container
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
    >
      <p className={`text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;
