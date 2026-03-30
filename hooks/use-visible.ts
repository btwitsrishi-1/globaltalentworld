"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns true when the element is within the viewport (with margin).
 * Used to pause/resume expensive rendering (WebGL, shaders) when off-screen.
 */
export function useVisible(margin = "200px") {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: margin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, visible };
}
