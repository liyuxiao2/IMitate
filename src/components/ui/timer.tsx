import { useEffect, useState } from "react";

interface CountdownTimerProps {
  seconds: number;
  onTimeout: () => void;
}

export default function CountdownTimer({ seconds, onTimeout }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeout(); // Only call once!
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]); // ❗ Problem: This was likely causing repeated calls

  // ❌ BAD: don't use [timeLeft] above if you're updating time inside!
  // ✅ Instead, separate useEffect to only run once:
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // ← run only once

  // Trigger timeout when hitting zero
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeout(); // ✅ call timeout only once
    }
  }, [timeLeft, onTimeout]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      className={`text-center text-sm font-mono mb-4 ${
        timeLeft === 0 ? "text-red-600" : "text-gray-600"
      }`}
    >
      Time Left: {formatTime(timeLeft)}
    </div>
  );
}
