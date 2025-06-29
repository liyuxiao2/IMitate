import { useEffect, useState, useCallback } from "react";

interface CountdownTimerProps {
  seconds: number;
  onTimeout: () => void;
  onTick?: (timeLeft: number) => void;
}

export default function CountdownTimer({
  seconds,
  onTimeout,
  onTick,
}: CountdownTimerProps) {
  const [localTime, setLocalTime] = useState(seconds);

  // Memoize the onTimeout callback to prevent unnecessary re-renders
  const memoizedOnTimeout = useCallback(onTimeout, [onTimeout]);

   useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime((prev) => {
        const newTime = prev - 1;

        if (newTime <= 0) {
          clearInterval(timer);
          onTimeout(); // ✅ Only call after state update
          return 0;
        }

        // Notify parent (safe, async)
        if (onTick) {
          onTick(newTime);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up on unmount
  }, [onTick]);

  // Trigger timeout when hitting zero
  useEffect(() => {
    if (localTime === 0) {
      memoizedOnTimeout();
    }
  }, [localTime, memoizedOnTimeout]);

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
        localTime === 0 ? "text-red-600" : "text-gray-600"
      }`}
    >
      Time Left: {formatTime(Math.max(0, localTime))}
    </div>
  );
}
