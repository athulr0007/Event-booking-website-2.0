import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api";

function StatTile({ icon, label, value, prefix, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#070f09",
        border: `1px solid ${hovered ? "rgba(0,200,80,0.25)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 14, padding: "28px 28px 24px",
        position: "relative", overflow: "hidden",
        transition: "all 0.25s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,200,80,0.06)" : "none",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, #00c853, transparent)",
        opacity: hovered ? 0.8 : 0.3, transition: "opacity 0.25s",
      }} />
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 120, height: 120, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,200,80,0.07) 0%, transparent 70%)",
        opacity: hovered ? 1 : 0, transition: "opacity 0.25s",
        pointerEvents: "none",
      }} />

      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: hovered ? "rgba(0,200,80,0.15)" : "rgba(0,200,80,0.08)",
        border: `1px solid ${hovered ? "rgba(0,200,80,0.35)" : "rgba(0,200,80,0.15)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, marginBottom: 20, transition: "all 0.25s",
      }}>{icon}</div>

      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
        textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
        fontFamily: "'DM Sans', sans-serif", marginBottom: 8,
      }}>{label}</div>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 42, color: "#fff", letterSpacing: 1, lineHeight: 1,
      }}>
        {prefix && <span style={{ color: "#00c853", fontSize: 28 }}>{prefix}</span>}
        {value}
      </div>
    </motion.div>
  );
}

function EventRow({ event, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(0,200,80,0.03)" : "transparent",
        transition: "background 0.2s",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <td style={{ padding: "14px 20px", width: 36 }}>
        <span style={{
          fontSize: 11, color: "rgba(255,255,255,0.2)",
          fontFamily: "'DM Sans', sans-serif",
        }}>{index + 1}</span>
      </td>
      <td style={{ padding: "14px 16px" }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
        }}>{event.name}</div>
        {event.date && (
          <div style={{
            fontSize: 11, color: "rgba(255,255,255,0.3)",
            fontFamily: "'DM Sans', sans-serif", marginTop: 2,
          }}>
            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        )}
      </td>
      <td style={{ padding: "14px 16px" }}>
        <span style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 5, padding: "3px 10px",
          fontSize: 13, fontWeight: 600,
          color: "rgba(255,255,255,0.55)",
          fontFamily: "'DM Sans', sans-serif",
        }}>{event.ticketsSold ?? "—"}</span>
      </td>
      <td style={{ padding: "14px 20px", textAlign: "right" }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 20, color: "#00c853", letterSpacing: 1,
        }}>
          ₹{Number(event.revenue ?? 0).toLocaleString("en-IN")}
        </span>
      </td>
    </tr>
  );
}

export default function AdminRevenue() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/admin/revenue").then(res => setStats(res.data));
  }, []);

  if (!stats) return (
    <div style={{
      minHeight: "80vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#020b06",
    }}>
      <div style={{
        width: 36, height: 36,
        border: "3px solid rgba(0,200,80,0.15)",
        borderTopColor: "#00c853", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const perTicket = stats.totalTickets > 0
    ? Math.round(stats.totalRevenue / stats.totalTickets)
    : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
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
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 36 }}
          >
            <div style={{
              display: "inline-block",
              background: "rgba(0,200,80,0.1)",
              border: "1px solid rgba(0,200,80,0.25)",
              color: "#00c853", fontSize: 10, fontWeight: 700,
              letterSpacing: "3px", textTransform: "uppercase",
              padding: "5px 14px", borderRadius: 2, marginBottom: 14,
            }}>Admin Panel</div>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(36px, 5vw, 52px)",
              color: "#fff", margin: "0 0 8px", letterSpacing: 1, lineHeight: 1,
            }}>Revenue Analytics</h1>
            <p style={{
              color: "rgba(255,255,255,0.35)", fontSize: 14,
              fontWeight: 300, margin: 0,
            }}>Ticket sales, revenue breakdown, and financials</p>
          </motion.div>

          {/* ── Stat tiles ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 18, marginBottom: 40,
          }}>
            <StatTile icon="💰" label="Total Revenue"  prefix="₹" value={Number(stats.totalRevenue).toLocaleString("en-IN")} delay={0.1} />
            <StatTile icon="🎟" label="Tickets Sold"   value={stats.totalTickets}  delay={0.2} />
            <StatTile icon="🎪" label="Total Events"   value={stats.totalEvents}   delay={0.3} />
            <StatTile icon="📊" label="Avg per Ticket" prefix="₹" value={perTicket.toLocaleString("en-IN")} delay={0.4} />
          </div>

          {/* ── Per-event breakdown ── */}
          {stats.byEvent && stats.byEvent.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "2.5px",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
                  fontFamily: "'DM Sans', sans-serif",
                }}>Breakdown by Event</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              </div>

              <div style={{
                background: "#070f09",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, overflow: "hidden",
              }}>
                <div style={{
                  height: 3,
                  background: "linear-gradient(90deg, transparent, #00c853, #00e676, #00c853, transparent)",
                }} />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <th style={{
                        padding: "12px 20px", textAlign: "left", width: 36,
                        fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
                        textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>#</th>
                      <th style={{
                        padding: "12px 16px", textAlign: "left",
                        fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
                        textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>Event</th>
                      <th style={{
                        padding: "12px 16px", textAlign: "left",
                        fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
                        textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>Tickets</th>
                      <th style={{
                        padding: "12px 20px", textAlign: "right",
                        fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
                        textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.byEvent.map((e, i) => (
                      <EventRow key={e._id || i} event={e} index={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </>
  );
}