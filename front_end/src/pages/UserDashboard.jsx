import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../api";

/* ── Stat card ── */
function StatCard({ icon, label, value, delay }) {
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
        boxShadow: hovered
          ? "0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,200,80,0.08)"
          : "none",
      }}
    >
      {/* top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, #00c853, transparent)",
        opacity: hovered ? 0.8 : 0.3, transition: "opacity 0.25s",
      }} />

      {/* ambient glow */}
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 120, height: 120, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,200,80,0.08) 0%, transparent 70%)",
        opacity: hovered ? 1 : 0, transition: "opacity 0.25s",
        pointerEvents: "none",
      }} />

      {/* icon box */}
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: hovered ? "rgba(0,200,80,0.15)" : "rgba(0,200,80,0.08)",
        border: `1px solid ${hovered ? "rgba(0,200,80,0.35)" : "rgba(0,200,80,0.15)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, marginBottom: 20, transition: "all 0.25s",
      }}>{icon}</div>

      {/* label */}
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
        textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
        fontFamily: "'DM Sans', sans-serif", marginBottom: 8,
      }}>{label}</div>

      {/* value */}
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 44, color: "#fff", letterSpacing: 1, lineHeight: 1,
      }}>{value}</div>
    </motion.div>
  );
}

/* ── Action card ── */
function ActionCard({ icon, title, desc, onClick, primary, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: primary
          ? hovered ? "rgba(0,200,80,0.12)" : "rgba(0,200,80,0.07)"
          : "#070f09",
        border: `1px solid ${
          primary
            ? hovered ? "rgba(0,200,80,0.45)" : "rgba(0,200,80,0.22)"
            : hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"
        }`,
        borderRadius: 14, padding: "28px",
        cursor: "pointer", position: "relative", overflow: "hidden",
        transition: "all 0.25s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? primary
            ? "0 20px 48px rgba(0,200,80,0.15)"
            : "0 16px 40px rgba(0,0,0,0.3)"
          : "none",
      }}
    >
      {/* top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: primary
          ? "linear-gradient(90deg, transparent, #00c853, #00e676, #00c853, transparent)"
          : "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        opacity: hovered ? 1 : 0.4, transition: "opacity 0.25s",
      }} />

      <div style={{ fontSize: 28, marginBottom: 16 }}>{icon}</div>

      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 26, letterSpacing: 1, lineHeight: 1,
        color: primary ? "#00c853" : "#fff",
        marginBottom: 8,
      }}>{title}</div>

      <p style={{
        color: "rgba(255,255,255,0.4)", fontSize: 14,
        fontWeight: 300, lineHeight: 1.6,
        margin: "0 0 24px",
        fontFamily: "'DM Sans', sans-serif",
      }}>{desc}</p>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: hovered ? 10 : 6,
        fontSize: 11, fontWeight: 700,
        letterSpacing: "2px", textTransform: "uppercase",
        color: primary
          ? hovered ? "#00e676" : "#00c853"
          : hovered ? "#fff" : "rgba(255,255,255,0.4)",
        fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.2s",
      }}>
        Open <span style={{ fontSize: 14 }}>→</span>
      </div>
    </motion.div>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ upcoming: 0, tickets: 0, past: 0 });
  const [loaded, setLoaded] = useState(false);

  const userName = localStorage.getItem("name") || "there";

  useEffect(() => {
    API.get("/bookings/my")
      .then(res => {
        const today = new Date().setHours(0, 0, 0, 0);
        let upcoming = 0, past = 0, tickets = 0;
        res.data.forEach(b => {
          if (!b.event) return;
          tickets += b.quantity;
          new Date(b.event.date).getTime() >= today ? upcoming++ : past++;
        });
        setStats({ upcoming, tickets, past });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
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
            style={{ marginBottom: 40 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(0,200,80,0.1)",
              border: "1px solid rgba(0,200,80,0.25)",
              color: "#00c853", fontSize: 10, fontWeight: 700,
              letterSpacing: "3px", textTransform: "uppercase",
              padding: "5px 14px", borderRadius: 2, marginBottom: 16,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#00c853", display: "inline-block",
                animation: "blink 1.5s ease infinite",
              }} />
              My Dashboard
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 5vw, 60px)",
              color: "#fff", margin: "0 0 8px",
              letterSpacing: 1, lineHeight: 1,
            }}>
              Welcome back,{" "}
              <span style={{ color: "#00c853" }}>{userName}</span>
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.35)", fontSize: 14,
              fontWeight: 300, margin: 0,
            }}>Your activity overview and quick actions</p>
          </motion.div>

          {/* ── Stat cards ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18, marginBottom: 40,
          }}>
            <StatCard icon="🗓" label="Upcoming Events" value={loaded ? stats.upcoming : "—"} delay={0.1} />
            <StatCard icon="🎟" label="Tickets Booked"  value={loaded ? stats.tickets : "—"}  delay={0.2} />
            <StatCard icon="✅" label="Past Events"     value={loaded ? stats.past : "—"}     delay={0.3} />
          </div>

          {/* ── Quick actions label ── */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
              fontFamily: "'DM Sans', sans-serif",
            }}>Quick Actions</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
          </div>

          {/* ── Action cards ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18, marginBottom: 40,
          }}>
            <ActionCard
              icon="🔍" title="Browse Events"
              desc="Discover and book upcoming events near you"
              onClick={() => navigate("/events")}
              primary delay={0.4}
            />
            <ActionCard
              icon="📋" title="My Bookings"
              desc="View your upcoming and past event bookings"
              onClick={() => navigate("/bookings")}
              delay={0.45}
            />
            <ActionCard
              icon="👤" title="Profile"
              desc="Manage your account details and preferences"
              onClick={() => navigate("/profile")}
              delay={0.5}
            />
          </div>

          {/* ── Motivational strip ── */}
          {loaded && stats.upcoming === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              style={{
                background: "rgba(0,200,80,0.04)",
                border: "1px solid rgba(0,200,80,0.12)",
                borderRadius: 12, padding: "22px 28px",
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap", gap: 16,
              }}
            >
              <div>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 20, color: "#fff", letterSpacing: 1, marginBottom: 4,
                }}>No upcoming events yet</div>
                <p style={{
                  color: "rgba(255,255,255,0.35)", fontSize: 13,
                  fontWeight: 300, margin: 0, lineHeight: 1.5,
                }}>Explore what's happening and grab your tickets before they sell out.</p>
              </div>
              <button
                onClick={() => navigate("/events")}
                style={{
                  background: "#00c853", color: "#000",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: "2px", textTransform: "uppercase",
                  padding: "11px 24px", borderRadius: 8,
                  border: "none", cursor: "pointer",
                  whiteSpace: "nowrap", transition: "all 0.2s",
                  flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#00e060"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#00c853"; e.currentTarget.style.transform = "translateY(0)"; }}
              >Browse Events →</button>
            </motion.div>
          )}

        </div>
      </div>
    </>
  );
}