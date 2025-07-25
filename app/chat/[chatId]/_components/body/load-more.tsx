"use client";
import { useEffect, useRef } from "react";

interface LoadMoreProps {
  onIntersect: () => void;
}

export const LoadMore = ({ onIntersect }: LoadMoreProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [onIntersect]);

  return <div ref={ref} />;
};