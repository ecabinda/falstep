import React from "react";

export function MarqueeTicker({
  items = [
    "FALSE STEP® CORE ARCHIVE",
    "LIMITED RUN // 150 PIECES",
    "320 GSM HEAVYWEIGHT COMBED COTTON",
    "MILLED IN PORTO, PORTUGAL",
    "COLD PIGMENT GARMENT WASH",
    "FEROZ SAVAGE & DIAMOND DIET",
    "WORLDWIDE TRACKED EXPRESS",
  ],
  speed = "35s",
  reverse = false,
  className = "",
}) {
  const content = items.map((item, idx) => (
    <span key={idx} className="inline-flex items-center mx-6 gap-6">
      <span className="font-['Anton'] text-lg uppercase tracking-widest">{item}</span>
      <span className="w-2 h-2 rounded-full bg-current opacity-40 inline-block" />
    </span>
  ));

  return (
    <div
      className={`relative w-full overflow-hidden whitespace-nowrap py-3 select-none ${className}`}
    >
      <div
        className="inline-block animate-marquee will-change-transform"
        style={{
          animationDuration: speed,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {content}
        {content}
      </div>
      <div
        className="inline-block animate-marquee will-change-transform"
        style={{
          animationDuration: speed,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {content}
        {content}
      </div>
    </div>
  );
}
