"use client";

import { useEffect, useState } from "react";

// Live wall clock — used in the contact page top bar. `suppressHydrationWarning`
// prevents a server/client mismatch on the very first render (server renders
// a placeholder, client takes over with the real time on mount).

function formatTime(d: Date) {
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function Clock() {
  const [time, setTime] = useState<string>("--:--:--");

  useEffect(() => {
    setTime(formatTime(new Date()));
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono-ui" suppressHydrationWarning>
      {time}
    </span>
  );
}
