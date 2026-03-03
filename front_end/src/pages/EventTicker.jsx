export default function EventTicker({ events }) {
  if (!events || !events.length) return null;

  const items = [...events, ...events, ...events];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        .ticker-track {
          animation: ticker 40s linear infinite;
          display: flex;
          align-items: center;
          width: max-content;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div style={{
        position: "fixed",
        bottom: 0, left: 0,
        width: "100%",
        height: 42,
        background: "#070f09",
        borderTop: "1px solid rgba(0,200,83,0.15)",
        overflow: "hidden",
        zIndex: 1200,
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Left fade */}
        <div style={{
          position: "absolute", left: 0, top: 0,
          width: 100, height: "100%", zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(to right, #070f09 40%, transparent)",
        }} />

        {/* LIVE badge — pinned left */}
        <div style={{
          position: "absolute", left: 20, top: "50%",
          transform: "translateY(-50%)",
          zIndex: 3,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#00c853",
            boxShadow: "0 0 6px #00c853",
            animation: "blink 1.5s ease infinite",
            display: "inline-block",
          }} />
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase", color: "#00c853",
          }}>Live</span>
        </div>

        {/* Right fade */}
        <div style={{
          position: "absolute", right: 0, top: 0,
          width: 100, height: "100%", zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(to left, #070f09 40%, transparent)",
        }} />

        {/* Scrolling track */}
        <div className="ticker-track" style={{ height: "100%" }}>
          {items.map((e, i) => (
            <div key={i} style={{
              display: "inline-flex", alignItems: "center",
              gap: 10, padding: "0 32px", height: "100%",
              borderRight: "1px solid rgba(255,255,255,0.04)",
              flexShrink: 0,
            }}>
              {/* Category dot */}
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#00c853", flexShrink: 0, opacity: 0.7,
              }} />

              {/* Event name */}
              <span style={{
                fontSize: 12, fontWeight: 500,
                color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.3px",
                whiteSpace: "nowrap",
              }}>
                {e.name}
              </span>

              {/* Date badge — only if date exists */}
              {e.date && (
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  color: "#00c853",
                  background: "rgba(0,200,83,0.08)",
                  border: "1px solid rgba(0,200,83,0.18)",
                  padding: "2px 8px", borderRadius: 2,
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                }}>
                  {new Date(e.date).toLocaleDateString("en-US", {
                    month: "short", day: "numeric"
                  })}
                </span>
              )}
            </div>
          ))}
        </div>

        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.3; }
          }
        `}</style>
      </div>
    </>
  );
}