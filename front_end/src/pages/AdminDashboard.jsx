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
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,200,80,0.08)" : "none",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      {/* top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, #00c853, transparent)",
        opacity: hovered ? 0.8 : 0.35,
        transition: "opacity 0.25s",
      }} />

      {/* ambient glow */}
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 120, height: 120, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,200,80,0.08) 0%, transparent 70%)",
        opacity: hovered ? 1 : 0, transition: "opacity 0.25s",
        pointerEvents: "none",
      }} />

      {/* icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: hovered ? "rgba(0,200,80,0.15)" : "rgba(0,200,80,0.08)",
        border: `1px solid ${hovered ? "rgba(0,200,80,0.35)" : "rgba(0,200,80,0.15)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, marginBottom: 20,
        transition: "all 0.25s",
      }}>{icon}</div>

      {/* label */}
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.3)",
        fontFamily: "'DM Sans', sans-serif",
        marginBottom: 8,
      }}>{label}</div>

      {/* value */}
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 42, color: "#fff", letterSpacing: 1, lineHeight: 1,
      }}>{value}</div>
    </motion.div>
  );
}

/* ── Action card ── */
function ActionCard({ title, desc, icon, onClick, primary, delay }) {
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
          ? (hovered ? "rgba(0,200,80,0.12)" : "rgba(0,200,80,0.07)")
          : "#070f09",
        border: `1px solid ${
          primary
            ? (hovered ? "rgba(0,200,80,0.45)" : "rgba(0,200,80,0.22)")
            : (hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)")
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
          : "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        opacity: hovered ? 1 : 0.4, transition: "opacity 0.25s",
      }} />

      {/* icon */}
      <div style={{ fontSize: 28, marginBottom: 16 }}>{icon}</div>

      {/* title */}
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 26, letterSpacing: 1,
        color: primary ? "#00c853" : "#fff",
        marginBottom: 8, lineHeight: 1,
      }}>{title}</div>

      {/* desc */}
      <p style={{
        color: "rgba(255,255,255,0.4)", fontSize: 14,
        fontWeight: 300, lineHeight: 1.6,
        margin: "0 0 24px",
        fontFamily: "'DM Sans', sans-serif",
      }}>{desc}</p>

      {/* CTA */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 11, fontWeight: 700,
        letterSpacing: "2px", textTransform: "uppercase",
        color: primary ? "#00c853" : "rgba(255,255,255,0.4)",
        fontFamily: "'DM Sans', sans-serif",
        transition: "gap 0.2s, color 0.2s",
        ...(hovered ? { gap: 10, color: primary ? "#00e676" : "#fff" } : {}),
      }}>
        Open <span style={{ fontSize: 14 }}>→</span>
      </div>
    </motion.div>
  );
}

/* ── Recent activity row ── */
function ActivityDot({ color }) {
  return (
    <span style={{
      display: "inline-block", width: 7, height: 7,
      borderRadius: "50%", background: color, flexShrink: 0,
    }} />
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ events: 0, tickets: 0, users: 0, revenue: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      API.get("/admin/dashboard-stats"),
      API.get("/admin/revenue"),
    ])
      .then(([statsRes, revenueRes]) => {
        setStats({
          events:  statsRes.data.totalEvents,
          users:   statsRes.data.totalUsers,
          tickets: revenueRes.data.totalTickets,
          revenue: revenueRes.data.totalRevenue,
        });
        setLoaded(true);
      })
      .catch(err => { console.error("Dashboard stats error:", err); setLoaded(true); });
  }, []);

  const adminName = "Admin"; // swap with localStorage.getItem("name") if stored

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
                background: "#00c853",
                animation: "blink 1.5s ease infinite",
                display: "inline-block",
              }} />
              Admin Panel
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 5vw, 60px)",
              color: "#fff", margin: "0 0 8px",
              letterSpacing: 1, lineHeight: 1,
            }}>
              Welcome back, <span style={{ color: "#00c853" }}>{adminName}</span>
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.35)", fontSize: 14,
              fontWeight: 300, margin: 0,
            }}>Platform overview and quick actions</p>
          </motion.div>

          {/* ── Stat cards ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18, marginBottom: 40,
          }}>
            <StatCard icon="🎪" label="Total Events"   value={loaded ? stats.events : "—"}  delay={0.1} />
            <StatCard icon="🎟" label="Tickets Sold"   value={loaded ? stats.tickets : "—"} delay={0.2} />
            <StatCard icon="👥" label="Total Users"    value={loaded ? stats.users : "—"}   delay={0.3} />
            <StatCard
              icon="₹"
              label="Total Revenue"
              value={loaded ? `₹${Number(stats.revenue).toLocaleString("en-IN")}` : "—"}
              delay={0.4}
            />
          </div>

          {/* ── Section label ── */}
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
              icon="📋" title="Manage Events"
              desc="View, update, and control all events on the platform"
              onClick={() => navigate("/events")}
              delay={0.45}
            />
            <ActionCard
              icon="✨" title="Create Event"
              desc="Publish a new event and start selling tickets"
              primary onClick={() => navigate("/create-event")}
              delay={0.5}
            />
            <ActionCard
              icon="👥" title="User Analytics"
              desc="Track attendance, engagement, and booking trends"
              onClick={() => navigate("/admin/users")}
              delay={0.55}
            />
            <ActionCard
              icon="📈" title="Revenue"
              desc="View ticket sales, revenue breakdown, and financials"
              onClick={() => navigate("/admin/revenue")}
              delay={0.6}
            />
          </div>

          {/* ── Platform health strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            style={{
              background: "#070f09",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12, padding: "18px 24px",
              display: "flex", alignItems: "center",
              flexWrap: "wrap", gap: 24,
            }}
          >
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
              fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
            }}>Platform Status</div>

            {[
              { label: "API",      color: "#00c853" },
              { label: "Database", color: "#00c853" },
              { label: "Payments", color: "#00c853" },
              { label: "Email",    color: "#00c853" },
            ].map(s => (
              <div key={s.label} style={{
                display: "flex", alignItems: "center", gap: 7,
              }}>
                <ActivityDot color={s.color} />
                <span style={{
                  fontSize: 12, color: "rgba(255,255,255,0.45)",
                  fontFamily: "'DM Sans', sans-serif",
                }}>{s.label}</span>
                <span style={{
                  fontSize: 10, color: s.color,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                }}>Operational</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media (max-width: 640px) {
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}