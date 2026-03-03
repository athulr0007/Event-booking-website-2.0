import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import defaultImage from "../assets/default-event.jpg";

/* ── Cancel modal ── */
function CancelModal({ booking, onConfirm, onClose }) {
  const [qty, setQty] = useState(1);
  const [focused, setFocused] = useState(false);
  const max = booking.quantity;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "#070f09",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: "36px 32px",
          maxWidth: 420, width: "100%",
          fontFamily: "'DM Sans', sans-serif",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg, transparent, #ff4444, transparent)",
        }} />

        <div style={{ fontSize: 30, marginBottom: 14 }}>🎟</div>
        <h3 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28, color: "#fff", margin: "0 0 8px", letterSpacing: 1,
        }}>Cancel Tickets</h3>
        <p style={{
          color: "rgba(255,255,255,0.4)", fontSize: 14,
          lineHeight: 1.7, margin: "0 0 10px",
        }}>
          You have <strong style={{ color: "#fff" }}>{max}</strong> ticket{max > 1 ? "s" : ""} for{" "}
          <strong style={{ color: "#fff" }}>{booking.event.name}</strong>.
          How many do you want to cancel?
        </p>

        {/* Stepper */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
            marginBottom: 10,
          }}>Tickets to cancel</div>
          <div style={{
            display: "flex", alignItems: "center",
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${focused ? "rgba(0,200,80,0.4)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 9, overflow: "hidden",
            transition: "border 0.2s",
          }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
              width: 44, height: 48, background: "none", border: "none",
              color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
            >−</button>
            <div style={{
              flex: 1, textAlign: "center",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28, color: "#fff", letterSpacing: 1,
              userSelect: "none",
            }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>{qty}</div>
            <button onClick={() => setQty(q => Math.min(max, q + 1))} style={{
              width: 44, height: 48, background: "none", border: "none",
              color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
            >+</button>
          </div>
          <div style={{
            fontSize: 11, color: "rgba(255,255,255,0.2)",
            marginTop: 7, textAlign: "center",
          }}>
            {qty === max ? "All tickets will be cancelled" : `${max - qty} ticket${max - qty > 1 ? "s" : ""} will remain`}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px 0",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 9, color: "rgba(255,255,255,0.6)",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          >Back</button>
          <button onClick={() => onConfirm(qty)} style={{
            flex: 1, padding: "12px 0",
            background: "rgba(255,50,50,0.12)",
            border: "1px solid rgba(255,50,50,0.3)",
            borderRadius: 9, color: "#ff6b6b",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
            letterSpacing: "1px", textTransform: "uppercase",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,50,50,0.22)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,50,50,0.12)"}
          >Confirm Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── History drawer ── */
function HistoryDrawer({ bookings, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.6)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          position: "absolute", top: 0, right: 0,
          width: "min(420px, 92vw)", height: "100%",
          background: "#070f09",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexDirection: "column",
          fontFamily: "'DM Sans', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div style={{
          padding: "24px 24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 26, letterSpacing: 1, color: "#fff",
            }}>Booking History</div>
            <div style={{
              fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2,
            }}>{bookings.length} past event{bookings.length !== 1 ? "s" : ""}</div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none",
            color: "rgba(255,255,255,0.4)", fontSize: 18,
            cursor: "pointer", padding: "4px 8px", lineHeight: 1,
          }}>✕</button>
        </div>

        {/* list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
          {bookings.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "48px 24px",
              color: "rgba(255,255,255,0.2)", fontSize: 14,
            }}>No past bookings</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bookings.map(b => (
                <HistoryItem key={b._id} booking={b} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function HistoryItem({ booking: b }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: 12, overflow: "hidden",
    }}>
      <img
        src={imgError ? defaultImage : (b.event.thumbnail || defaultImage)}
        onError={() => setImgError(true)}
        alt={b.event.name}
        style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }}
      />
      <div style={{ padding: "12px 14px" }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)",
          marginBottom: 5,
        }}>{b.event.name}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            {b.event.date} · {b.event.time}
          </div>
          <div style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 4, padding: "2px 8px",
            fontSize: 11, fontWeight: 700,
            color: "rgba(255,255,255,0.35)",
          }}>
            {b.quantity} ticket{b.quantity > 1 ? "s" : ""}
          </div>
        </div>
        <div style={{
          display: "inline-block", marginTop: 8,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 3, padding: "2px 8px",
          fontSize: 10, fontWeight: 700,
          letterSpacing: "2px", textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
        }}>Completed</div>
      </div>
    </div>
  );
}

/* ── Upcoming booking card ── */
function BookingCard({ booking: b, onCancel }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const formattedDate = b.event.date
    ? new Date(b.event.date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : b.event.date;

  const daysUntil = Math.ceil(
    (new Date(b.event.date).getTime() - Date.now()) / 86400000
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#070f09",
        border: `1px solid ${hovered ? "rgba(0,200,80,0.22)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 14, overflow: "hidden",
        transition: "all 0.25s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,200,80,0.06)"
          : "0 4px 16px rgba(0,0,0,0.2)",
      }}
    >
      {/* thumbnail */}
      <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
        <motion.img
          src={imgError ? defaultImage : (b.event.thumbnail || defaultImage)}
          onError={() => setImgError(true)}
          alt={b.event.name}
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(7,15,9,0.85) 0%, transparent 55%)",
        }} />

        {/* days until badge */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: daysUntil <= 3
            ? "rgba(245,158,11,0.2)" : "rgba(0,200,80,0.13)",
          backdropFilter: "blur(6px)",
          border: `1px solid ${daysUntil <= 3 ? "rgba(245,158,11,0.4)" : "rgba(0,200,80,0.28)"}`,
          color: daysUntil <= 3 ? "#f59e0b" : "#00c853",
          fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
          padding: "4px 10px", borderRadius: 4,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {daysUntil === 0 ? "Today!" : daysUntil === 1 ? "Tomorrow" : `${daysUntil}d away`}
        </div>

        {/* tickets badge bottom-left */}
        <div style={{
          position: "absolute", bottom: 12, left: 14,
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ fontSize: 13 }}>🎟</span>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 18, color: "#fff", letterSpacing: 1,
          }}>{b.quantity} ticket{b.quantity > 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "16px 18px 20px" }}>
        <h3 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, fontWeight: 700, color: "#fff",
          margin: "0 0 10px", lineHeight: 1.3,
        }}>{b.event.name}</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 12 }}>🗓</span>
            <span style={{
              fontSize: 12, color: "rgba(255,255,255,0.45)",
              fontFamily: "'DM Sans', sans-serif",
            }}>{formattedDate} · {b.event.time}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 12 }}>📍</span>
            <span style={{
              fontSize: 12, color: "rgba(255,255,255,0.45)",
              fontFamily: "'DM Sans', sans-serif",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{b.event.location}</span>
          </div>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 14 }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(0,200,80,0.08)",
            border: "1px solid rgba(0,200,80,0.18)",
            borderRadius: 3, padding: "3px 10px",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "2px", textTransform: "uppercase",
            color: "#00c853", fontFamily: "'DM Sans', sans-serif",
          }}>Upcoming</div>

          <button
            onClick={() => onCancel(b)}
            style={{
              background: "rgba(255,50,50,0.07)",
              border: "1px solid rgba(255,50,50,0.2)",
              borderRadius: 7, color: "rgba(255,100,100,0.7)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, fontWeight: 700,
              letterSpacing: "1.5px", textTransform: "uppercase",
              padding: "6px 14px", cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,50,50,0.14)";
              e.currentTarget.style.color = "#ff6b6b";
              e.currentTarget.style.borderColor = "rgba(255,50,50,0.35)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,50,50,0.07)";
              e.currentTarget.style.color = "rgba(255,100,100,0.7)";
              e.currentTarget.style.borderColor = "rgba(255,50,50,0.2)";
            }}
          >Cancel</button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Bookings() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [openHistory, setOpenHistory] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);

  /* ── confirm booking after payment ── */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success");

    if (!success) { loadBookings(); return; }

    const pending = JSON.parse(localStorage.getItem("pendingBooking"));
    if (!pending || pending.confirmed) { loadBookings(); return; }

    pending.confirmed = true;
    localStorage.setItem("pendingBooking", JSON.stringify(pending));

    API.post(`/bookings/${pending.eventId}`, { quantity: pending.quantity })
      .then(() => {
        localStorage.removeItem("pendingBooking");
        window.history.replaceState({}, document.title, "/bookings");
        loadBookings();
      })
      .catch(() => {
        localStorage.removeItem("pendingBooking");
        loadBookings();
      });
  }, [location.search]);

  const loadBookings = () => {
    API.get("/bookings/my")
      .then(res => setBookings(res.data))
      .catch(() => {});
  };

  const today = new Date().setHours(0, 0, 0, 0);

  const { upcoming, history } = useMemo(() => {
    const upcoming = [], history = [];
    bookings.forEach(b => {
      if (!b.event) return;
      new Date(b.event.date).getTime() >= today
        ? upcoming.push(b) : history.push(b);
    });
    return { upcoming, history };
  }, [bookings, today]);

  const confirmCancel = async (qty) => {
    try {
      await API.delete(`/bookings/${cancelTarget._id}`, { data: { quantity: qty } });
      setCancelTarget(null);
      loadBookings();
    } catch { /* silent */ }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#020b06",
        fontFamily: "'DM Sans', sans-serif",
        padding: "40px 24px 80px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "flex", alignItems: "flex-start",
              justifyContent: "space-between", flexWrap: "wrap",
              gap: 16, marginBottom: 36,
            }}
          >
            <div>
              <div style={{
                display: "inline-block",
                background: "rgba(0,200,80,0.1)",
                border: "1px solid rgba(0,200,80,0.25)",
                color: "#00c853", fontSize: 10, fontWeight: 700,
                letterSpacing: "3px", textTransform: "uppercase",
                padding: "5px 14px", borderRadius: 2, marginBottom: 14,
              }}>My Bookings</div>
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(36px, 5vw, 52px)",
                color: "#fff", margin: "0 0 6px", letterSpacing: 1, lineHeight: 1,
              }}>Upcoming Events</h1>
              <p style={{
                color: "rgba(255,255,255,0.35)", fontSize: 14,
                fontWeight: 300, margin: 0,
              }}>
                {upcoming.length} upcoming · {history.length} past
              </p>
            </div>

            {/* History button */}
            <button
              onClick={() => setOpenHistory(true)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 9, color: "rgba(255,255,255,0.5)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, fontWeight: 600,
                letterSpacing: "1.5px", textTransform: "uppercase",
                padding: "10px 20px", cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              🕐 History
              {history.length > 0 && (
                <span style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "1px 7px",
                  fontSize: 10, fontWeight: 700,
                  color: "rgba(255,255,255,0.6)",
                }}>{history.length}</span>
              )}
            </button>
          </motion.div>

          {/* ── Upcoming grid ── */}
          <AnimatePresence mode="popLayout">
            {upcoming.length > 0 ? (
              <motion.div layout style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 24,
              }}>
                {upcoming.map(b => (
                  <BookingCard
                    key={b._id} booking={b}
                    onCancel={b => setCancelTarget(b)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  textAlign: "center", padding: "80px 24px",
                  background: "#070f09",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 16,
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎟</div>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 28, color: "rgba(255,255,255,0.2)",
                  letterSpacing: 1, marginBottom: 8,
                }}>No upcoming bookings</div>
                <p style={{
                  color: "rgba(255,255,255,0.2)", fontSize: 14,
                  fontWeight: 300,
                }}>Browse events and grab your tickets!</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* ── History drawer ── */}
      <AnimatePresence>
        {openHistory && (
          <HistoryDrawer
            bookings={history}
            onClose={() => setOpenHistory(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Cancel modal ── */}
      <AnimatePresence>
        {cancelTarget && (
          <CancelModal
            booking={cancelTarget}
            onConfirm={confirmCancel}
            onClose={() => setCancelTarget(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}