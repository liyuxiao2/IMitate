import { useEffect, useState, useCallback } from "react";

interface CountdownTimerProps {
  seconds: number;
  onTimeout: () => void;
}

export default function CountdownTimer({
  seconds,
  onTimeout,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  // Memoize the onTimeout callback to prevent unnecessary re-renders
  const memoizedOnTimeout = useCallback(onTimeout, [onTimeout]);

  // Single timer effect that runs once
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
  }, []);

  // Trigger timeout when hitting zero
  useEffect(() => {
    if (timeLeft === 0) {
      memoizedOnTimeout();
    }
  }, [timeLeft, memoizedOnTimeout]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      className={`bg-stone-100 w-full py-4 px-6 rounded-md text-center text-sm font-mono mb-4 shadow-sm ${
        timeLeft === 0 ? "text-red-600" : "text-gray-600"
      }`}
    >
      Time Left: {formatTime(timeLeft)}
    </div>
  );
}
