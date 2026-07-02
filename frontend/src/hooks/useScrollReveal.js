import { useState, useEffect, useRef } from 'react';

export const useScrollReveal = (options = {}) => {
  const threshold = options.threshold ?? 0.15;
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    // Check for reduced motion — show immediately, skip observer entirely
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsRevealed(true);
      return;
    }

    // Apply will-change only while waiting to animate
    currentRef.style.willChange = 'transform, opacity';

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsRevealed(true);
        // Remove will-change after animation completes — leaving it on permanently
        // causes the browser to reserve compositor layers indefinitely
        const cleanup = () => {
          if (currentRef) currentRef.style.willChange = 'auto';
        };
        // Wait for transition to finish (600ms max) before cleaning up
        setTimeout(cleanup, 700);
        observer.unobserve(entry.target);
      }
    }, { threshold });

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
      // Clean up will-change if component unmounts before animation fires
      if (currentRef) currentRef.style.willChange = 'auto';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold]);

  return { ref, isRevealed };
};
