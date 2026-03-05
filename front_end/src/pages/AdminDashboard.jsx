import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../api";

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
        borderRadius: 14, padding: "clamp(16px, 3vw, 28px)",
        position: "relative", overflow: "hidden",
        transition: "all 0.25s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,200,80,0.08)" : "none",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, #00c853, transparent)",
        opacity: hovered ? 0.8 : 0.35, transition: "opacity 0.25s",
      }} />
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 120, height: 120, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,200,80,0.08) 0%, transparent 70%)",
        opacity: hovered ? 1 : 0, transition: "opacity 0.25s",
        pointerEvents: "none",
      }} />
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: hovered ? "rgba(0,200,80,0.15)" : "rgba(0,200,80,0.08)",
        border: `1px solid ${hovered ? "rgba(0,200,80,0.35)" : "rgba(0,200,80,0.15)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, marginBottom: 16, transition: "all 0.25s",
      }}>{icon}</div>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
        textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
        fontFamily: "'DM Sans', sans-serif", marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(28px, 5vw, 42px)",
        color: "#fff", letterSpacing: 1, lineHeight: 1,
      }}>{value}</div>
    </motion.div>
  );
}

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
          ? hovered ? "rgba(0,200,80,0.12)" : "rgba(0,200,80,0.07)"
          : "#070f09",
        border: `1px solid ${
          primary
            ? hovered ? "rgba(0,200,80,0.45)" : "rgba(0,200,80,0.22)"
            : hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"
        }`,
        borderRadius: 14, padding: "22px",
        cursor: "pointer", position: "relative", overflow: "hidden",
        transition: "all 0.25s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? primary ? "0 20px 48px rgba(0,200,80,0.15)" : "0 16px 40px rgba(0,0,0,0.3)"
          : "none",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: primary
          ? "linear-gradient(90deg, transparent, #00c853, #00e676, #00c853, transparent)"
          : "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        opacity: hovered ? 1 : 0.4, transition: "opacity 0.25s",
      }} />
      <div style={{ fontSize: 24, marginBottom: 12 }}>{icon}</div>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 22, letterSpacing: 1, lineHeight: 1,
        color: primary ? "#00c853" : "#fff", marginBottom: 6,
      }}>{title}</div>
      <p style={{
        color: "rgba(255,255,255,0.4)", fontSize: 13,
        fontWeight: 300, lineHeight: 1.6, margin: "0 0 18px",
        fontFamily: "'DM Sans', sans-serif",
      }}>{desc}</p>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: hovered ? 10 : 6,
        fontSize: 11, fontWeight: 700,
        letterSpacing: "2px", textTransform: "uppercase",
        color: primary
          ? hovered ? "#00e676" : "#00c853"
          : hovered ? "#fff" : "rgba(255,255,255,0.4)",
        fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
      }}>
        Open <span style={{ fontSize: 14 }}>→</span>
      </div>
    </motion.div>
  );
}

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
  const adminName = localStorage.getItem("name") || "Admin";

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin   { to { transform: rotate(360deg); } }

        .ad-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
          margin-bottom: 40px;
        }
        .ad-action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 18px;
          margin-bottom: 40px;
        }
        .ad-status-strip {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        @media (max-width: 520px) {
          .ad-stat-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 24px;
          }
          .ad-action-grid {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 24px;
          }
          .ad-status-strip {
            gap: 14px;
          }
        }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#020b06",
        fontFamily: "'DM Sans', sans-serif",
        padding: "clamp(24px, 4vw, 40px) clamp(16px, 4vw, 24px) 80px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: "clamp(24px, 4vw, 40px)" }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(0,200,80,0.1)",
              border: "1px solid rgba(0,200,80,0.25)",
              color: "#00c853", fontSize: 10, fontWeight: 700,
              letterSpacing: "3px", textTransform: "uppercase",
              padding: "5px 14px", borderRadius: 2, marginBottom: 14,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#00c853", display: "inline-block",
                animation: "blink 1.5s ease infinite",
              }} />
              Admin Panel
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(32px, 7vw, 60px)",
              color: "#fff", margin: "0 0 8px",
              letterSpacing: 1, lineHeight: 1,
            }}>
              Welcome back,{" "}
              <span style={{ color: "#00c853" }}>{adminName}</span>
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "clamp(13px, 3vw, 14px)",
              fontWeight: 300, margin: 0,
            }}>Platform overview and quick actions</p>
          </motion.div>

          {/* ── Stat cards ── */}
          <div className="ad-stat-grid">
            <StatCard icon="🎪" label="Total Events"  value={loaded ? stats.events : "—"}  delay={0.1} />
            <StatCard icon="🎟" label="Tickets Sold"  value={loaded ? stats.tickets : "—"} delay={0.2} />
            <StatCard icon="👥" label="Total Users"   value={loaded ? stats.users : "—"}   delay={0.3} />
            <StatCard
              icon="₹" label="Total Revenue"
              value={loaded ? `₹${Number(stats.revenue).toLocaleString("en-IN")}` : "—"}
              delay={0.4}
            />
          </div>

          {/* ── Section label ── */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
              fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
            }}>Quick Actions</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
          </div>

          {/* ── Action cards ── */}
          <div className="ad-action-grid">
            <ActionCard
              icon="📋" title="Manage Events"
              desc="View, update, and control all events"
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

          {/* ── Platform status strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            style={{
              background: "#070f09",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12,
              padding: "clamp(14px, 3vw, 18px) clamp(16px, 3vw, 24px)",
            }}
          >
            <div className="ad-status-strip">
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
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
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
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}