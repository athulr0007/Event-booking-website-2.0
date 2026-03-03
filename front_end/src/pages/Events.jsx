import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import defaultImage from "../assets/default-event.jpg";

/* ── outside component to prevent remount ── */
function SearchBar({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", flex: "1 1 260px", minWidth: 200 }}>
      <span style={{
        position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
        fontSize: 14, pointerEvents: "none",
        color: focused ? "#00c853" : "rgba(255,255,255,0.25)",
        transition: "color 0.2s",
      }}>🔍</span>
      <input
        type="text"
        placeholder="Search by name or location…"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          background: focused ? "rgba(0,200,80,0.025)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? "rgba(0,200,80,0.4)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 9, color: "#fff",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          padding: "11px 16px 11px 40px", outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(0,200,80,0.07)" : "none",
          transition: "all 0.25s",
        }}
      />
    </div>
  );
}

function SortSelect({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  const opts = [
    { value: "date",      label: "Date" },
    { value: "name",      label: "Name" },
    { value: "location",  label: "Location" },
    { value: "priceLow",  label: "Price ↑" },
    { value: "priceHigh", label: "Price ↓" },
  ];
  return (
    <div style={{ position: "relative", flex: "0 0 160px" }}>
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          background: focused ? "rgba(0,200,80,0.025)" : "#0d1a11",
          border: `1px solid ${focused ? "rgba(0,200,80,0.4)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 9, color: "#fff",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          padding: "11px 36px 11px 14px", outline: "none", cursor: "pointer",
          boxShadow: focused ? "0 0 0 3px rgba(0,200,80,0.07)" : "none",
          transition: "all 0.25s", appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
          backgroundSize: "12px",
        }}
      >
        {opts.map(o => (
          <option key={o.value} value={o.value}
            style={{ background: "#0d1a11", color: "#fff" }}>
            Sort: {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function EventCard({ event, navigate, now }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const diffMs = new Date(event.bookingCloseAt).getTime() - now;
  const closed = diffMs <= 0;

  const timeLeft = (() => {
    if (closed) return "Closed";
    const days = Math.floor(diffMs / 86400000);
    const hours = Math.floor((diffMs % 86400000) / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    if (days >= 1) return `${days}d ${hours}h`;
    return `${hours}h ${mins}m`;
  })();

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : event.date;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#070f09",
        border: `1px solid ${hovered ? "rgba(0,200,80,0.22)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 14, overflow: "hidden",
        transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,200,80,0.08)" : "0 4px 16px rgba(0,0,0,0.2)",
        cursor: "pointer", display: "flex", flexDirection: "column",
      }}
      onClick={() => navigate(`/events/${event._id}`)}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", height: 180, overflow: "hidden", flexShrink: 0 }}>
        <motion.img
          src={imgError ? defaultImage : (event.thumbnail || defaultImage)}
          onError={() => setImgError(true)}
          alt={event.name}
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(7,15,9,0.85) 0%, transparent 55%)",
        }} />

        {/* category badge */}
        {event.category && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "rgba(7,15,9,0.75)", backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 600,
            letterSpacing: "2px", textTransform: "uppercase",
            padding: "4px 10px", borderRadius: 4,
            fontFamily: "'DM Sans', sans-serif",
          }}>{event.category}</div>
        )}

        {/* countdown badge */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: closed ? "rgba(255,50,50,0.15)" : "rgba(0,200,80,0.13)",
          backdropFilter: "blur(6px)",
          border: `1px solid ${closed ? "rgba(255,50,50,0.3)" : "rgba(0,200,80,0.28)"}`,
          color: closed ? "#ff7070" : "#00c853",
          fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
          padding: "4px 10px", borderRadius: 4,
          fontFamily: "'DM Sans', sans-serif",
        }}>{timeLeft}</div>

        {/* price — bottom left over gradient */}
        <div style={{
          position: "absolute", bottom: 12, left: 14,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 26, color: "#fff", letterSpacing: 1,
        }}>
          {event.price === 0
            ? <span style={{ color: "#00c853" }}>FREE</span>
            : <>₹<span style={{ color: "#00c853" }}>{event.price}</span></>
          }
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16, fontWeight: 700, color: "#fff",
          margin: "0 0 10px", lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{event.name}</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 12 }}>🗓</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
              {formattedDate} · {event.time}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 12 }}>📍</span>
            <span style={{
              fontSize: 12, color: "rgba(255,255,255,0.45)",
              fontFamily: "'DM Sans', sans-serif",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{event.location}</span>
          </div>
        </div>

        {/* Footer row */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          marginTop: 16, paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 11 }}>🎟</span>
            <span style={{
              fontSize: 12, fontWeight: 500,
              color: event.availableSeats <= 10 ? "#f59e0b" : "rgba(255,255,255,0.4)",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {event.availableSeats === 0
                ? "Sold out"
                : `${event.availableSeats} left`}
            </span>
          </div>

          <div style={{
            background: "rgba(0,200,80,0.08)",
            border: "1px solid rgba(0,200,80,0.2)",
            color: "#00c853", fontSize: 11, fontWeight: 700,
            letterSpacing: "1.5px", textTransform: "uppercase",
            padding: "5px 14px", borderRadius: 6,
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s",
            ...(hovered ? {
              background: "rgba(0,200,80,0.15)",
              boxShadow: "0 0 12px rgba(0,200,80,0.2)",
            } : {}),
          }}>View →</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Events() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    API.get("/events")
      .then(res => { setEvents(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const visibleEvents = useMemo(() => {
    let list = [...events];
    if (!isAdmin) list = list.filter(e => new Date(e.bookingCloseAt).getTime() > now);
    if (search) list = list.filter(e =>
      `${e.name} ${e.location}`.toLowerCase().includes(search.toLowerCase())
    );
    switch (sortBy) {
      case "name":     list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "location": list.sort((a, b) => a.location.localeCompare(b.location)); break;
      case "priceLow":  list.sort((a, b) => a.price - b.price); break;
      case "priceHigh": list.sort((a, b) => b.price - a.price); break;
      default: list.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return list;
  }, [events, search, sortBy, now, isAdmin]);

  if (loading) return (
  <div style={{
    minHeight: "100vh",
    width: "100%",
    background: "#020b06",        // ← fills entire screen
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}>
    <div style={{
      width: 36, height: 36,
      border: "3px solid rgba(0,200,80,0.15)",
      borderTopColor: "#00c853",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        body { margin: 0; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#020b06",
        fontFamily: "'DM Sans', sans-serif",
        padding: "40px 24px 80px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: "inline-block",
              background: "rgba(0,200,80,0.1)",
              border: "1px solid rgba(0,200,80,0.25)",
              color: "#00c853", fontSize: 10, fontWeight: 700,
              letterSpacing: "3px", textTransform: "uppercase",
              padding: "5px 14px", borderRadius: 2, marginBottom: 14,
            }}>
              {isAdmin ? "All Events" : "Upcoming Events"}
            </div>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              color: "#fff", margin: 0, letterSpacing: 1, lineHeight: 1,
            }}>Discover Events</h1>
            <p style={{
              color: "rgba(255,255,255,0.35)", fontSize: 14,
              fontWeight: 300, marginTop: 8, marginBottom: 0,
            }}>
              {visibleEvents.length} event{visibleEvents.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {/* ── Filter bar ── */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 12,
            marginBottom: 36, alignItems: "center",
          }}>
            <SearchBar value={search} onChange={e => setSearch(e.target.value)} />
            <SortSelect value={sortBy} onChange={e => setSortBy(e.target.value)} />

            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12, fontWeight: 500,
                  padding: "10px 16px", borderRadius: 9,
                  cursor: "pointer", transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >✕ Clear</button>
            )}
          </div>

          {/* ── Grid ── */}
          <AnimatePresence mode="popLayout">
            {visibleEvents.length > 0 ? (
              <motion.div
                layout
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 24,
                }}
              >
                {visibleEvents.map(event => (
                  <EventCard
                    key={event._id}
                    event={event}
                    navigate={navigate}
                    now={now}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  textAlign: "center", paddingTop: 80, paddingBottom: 80,
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎟</div>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 28, color: "rgba(255,255,255,0.25)",
                  letterSpacing: 1, marginBottom: 8,
                }}>No events found</div>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 14, fontWeight: 300 }}>
                  {search ? `No results for "${search}"` : "Check back soon for upcoming events"}
                </p>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    style={{
                      marginTop: 20, background: "rgba(0,200,80,0.08)",
                      border: "1px solid rgba(0,200,80,0.2)",
                      color: "#00c853", fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12, fontWeight: 700, letterSpacing: "1.5px",
                      textTransform: "uppercase", padding: "10px 24px",
                      borderRadius: 8, cursor: "pointer",
                    }}
                  >Clear search</button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}