import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const bgImage = "/landing.jpg";
import API from "../api";
import EventTicker from "./EventTicker";

/* ── tiny fade-up helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function Landing() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/events", { replace: true });
  }, [navigate]);

  useEffect(() => {
    API.get("/events").then(r => setEvents(r.data)).catch(() => {});
  }, []);

  return (
    <div style={{ width: "100%", minHeight: "100vh", overflowX: "hidden", background: "#020b06" }}>

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
          display: "flex", alignItems: "center",
          padding: "24px 48px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => navigate("/")}>
          <div style={{
            width: 32, height: 32, background: "#00c853", borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
          }}>🎟</div>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 20,
            letterSpacing: 3, color: "#fff",
          }}>CROWD</span>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => navigate("/login")} style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
            padding: "9px 22px", borderRadius: 8, cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.11)"}
            onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.06)"}
          >Sign In</button>

          <button onClick={() => navigate("/register")} style={{
            background: "#00c853", border: "none", color: "#000",
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
            letterSpacing: "2px", textTransform: "uppercase",
            padding: "10px 24px", borderRadius: 8, cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.background = "#00e060"; e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 8px 28px rgba(0,200,80,0.35)"; }}
            onMouseLeave={e => { e.target.style.background = "#00c853"; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
          >Book Ticket</button>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <div style={{
        minHeight: "100vh", width: "100%", position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center",
      }}>
        {/* Background image */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.06 }}
          transition={{ duration: 10, ease: "linear" }}
          style={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover", backgroundPosition: "center",
            filter: "brightness(0.3) saturate(0.55)",
          }}
        />

        {/* Gradient overlays */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to top, rgba(2,11,6,0.95) 0%, transparent 50%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(150deg, rgba(0,200,80,0.1) 0%, transparent 55%)",
        }} />

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 2, padding: "0 24px", maxWidth: 820 }}>
          <motion.div {...fadeUp(0.35)} style={{
            display: "inline-block",
            background: "rgba(0,200,80,0.12)",
            border: "1px solid rgba(0,200,80,0.28)",
            color: "#00c853",
            fontSize: 10, letterSpacing: 4, textTransform: "uppercase",
            padding: "6px 18px", borderRadius: 2,
            marginBottom: 28,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          }}>
            Live Event Platform
          </motion.div>

          <motion.h1 {...fadeUp(0.5)} style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(62px, 9vw, 120px)",
            lineHeight: 0.9, color: "#fff",
            letterSpacing: 1, margin: "0 0 24px",
          }}>
            Event ticketing<br />
            <span style={{ color: "#00c853" }}>made simple</span>
          </motion.h1>

          <motion.p {...fadeUp(0.65)} style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16, fontWeight: 300, lineHeight: 1.7,
            margin: "0 0 44px",
          }}>
            Discover events and book tickets in seconds
          </motion.p>

          <motion.div {...fadeUp(0.78)} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/register")} style={{
              background: "#00c853", color: "#000",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
              letterSpacing: "2.5px", textTransform: "uppercase",
              padding: "16px 44px", border: "none", borderRadius: 9,
              cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.background = "#00e060"; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px rgba(0,200,80,0.4)"; }}
              onMouseLeave={e => { e.target.style.background = "#00c853"; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
            >Book Ticket</button>

            <button onClick={() => navigate("/login")} style={{
              background: "transparent", color: "rgba(255,255,255,0.7)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400,
              padding: "16px 36px",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: 9,
              cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.35)"; e.target.style.color = "#fff"; }}
              onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.color = "rgba(255,255,255,0.7)"; }}
            >Sign In</button>
          </motion.div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1 }}
        style={{
          position: "absolute", bottom: 56, left: 0, right: 0,
          display: "flex", justifyContent: "center", gap: 72, zIndex: 3,
          flexWrap: "wrap", padding: "0 24px",
        }}
      >
        {[["12K+", "Events Listed"], ["98%", "Satisfaction"], ["3M+", "Tickets Sold"]].map(([num, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 34,
              color: "#fff", letterSpacing: 1,
            }}>
              <span style={{ color: "#00c853" }}>{num[0]}</span>{num.slice(1)}
            </div>
            <div style={{
              color: "rgba(255,255,255,0.35)", fontSize: 10,
              letterSpacing: "2.5px", textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginTop: 2,
            }}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── EVENT TICKER ── */}
      <EventTicker events={events} />

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>
    </div>
  );
}