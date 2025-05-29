"use client";

import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

interface ConfettiProps {
  active?: boolean;
  duration?: number;
  pieces?: number;
  colors?: string[];
}

export function Confetti({
  active = true,
  duration = 8000,
  pieces = 500,
  colors = ["#8d2c2c", "#ad4c4c", "#5e4743", "#3e2723", "#b25f5f"],
}: ConfettiProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(active);

  useEffect(() => {
    // Set window size for confetti
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    // Hide confetti after specified duration
    if (active) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), duration);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateWindowSize);
      };
    } else {
      setShowConfetti(false);
    }

    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, [active, duration]);

  if (!showConfetti) return null;

  return (
    <ReactConfetti
      width={windowSize.width}
      height={windowSize.height}
      recycle={false}
      numberOfPieces={pieces}
      tweenDuration={10000}
      colors={colors}
    />
  );
}
