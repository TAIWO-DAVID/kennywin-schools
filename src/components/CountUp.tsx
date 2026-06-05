// src/components/CountUp.tsx
import React from "react";
import { useCountUp } from "@/hooks/use-countUp";

interface CountUpProps {
  end: number;
  duration?: number;
  className?: string;
  suffix?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ end, duration = 2000, className, suffix ="" }) => {
  const { count, elementRef } = useCountUp(end, duration);

  return (
    <div ref={elementRef} className={`${className || ""}`}>
      {count.toLocaleString()}
      {end > 100 ? "+" : end === 95 ? "%" : ""}
      {suffix}
    </div>
  );
};
