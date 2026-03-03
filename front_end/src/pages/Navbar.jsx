import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function NavBtn({ label, path, navigate, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => { navigate(path); onClick?.(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none", border: "none", borderRadius: 0,
        borderBottom: `2px solid ${active ? "#00c853" : "transparent"}`,
        color: active ? "#fff" : hovered ? "#fff" : "rgba(255,255,255,0.45)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, fontWeight: active ? 600 : 400,
        letterSpacing: "0.3px", padding: "4px 0",
        cursor: "pointer", transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >{label}</button>
  );
}

function MobileNavBtn({ label, path, navigate, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => { navigate(path); onClick?.(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center",
        width: "100%",
        background: active ? "rgba(0,200,80,0.06)" : hovered ? "rgba(255,255,255,0.03)" : "none",
        border: "none",
        borderLeft: `3px solid ${active ? "#00c853" : "transparent"}`,
        color: active ? "#fff" : hovered ? "#fff" : "rgba(255,255,255,0.5)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14, fontWeight: active ? 600 : 400,
        padding: "13px 20px", cursor: "pointer",
        transition: "all 0.2s", textAlign: "left",
      }}
    >{label}</button>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => { localStorage.clear(); window.location.href = "/"; };
  const is = (path) => location.pathname === path;
  const close = () => setMenuOpen(false);

  const links = isAdmin ? [
    { label: "Dashboard",    path: "/admin/dashboard" },
    { label: "Events",       path: "/events" },
    { label: "Create Event", path: "/create-event" },
    { label: "Users",        path: "/admin/users" },
  ] : [
    { label: "Dashboard",   path: "/dashboard" },
    { label: "Events",      path: "/events" },
    { label: "My Bookings", path: "/bookings" },
    { label: "Profile",     path: "/profile" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .desktop-only { display: flex !important; }
        .mobile-only  { display: none  !important; }

        @media (max-width: 768px) {
          .desktop-only { display: none  !important; }
          .mobile-only  { display: flex  !important; }
        }

        .mobile-drawer {
          position: fixed; inset: 0; z-index: 999;
          pointer-events: none;
        }
        .mobile-drawer.open { pointer-events: all; }

        .drawer-backdrop {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.6);
          opacity: 0; transition: opacity 0.3s ease;
        }
        .mobile-drawer.open .drawer-backdrop { opacity: 1; }

        .drawer-panel {
          position: absolute; top: 0; right: 0;
          width: 280px; height: 100%;
          background: #070f09;
          border-left: 1px solid rgba(255,255,255,0.06);
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
          display: flex; flex-direction: column; overflow-y: auto;
        }
        .mobile-drawer.open .drawer-panel { transform: translateX(0); }

        .nav-logout-btn:hover {
          background: rgba(255,50,50,0.08) !important;
          border-color: rgba(255,50,50,0.3) !important;
          color: #ff7070 !important;
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 1000,
        width: "100%", background: "#070f09",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* green top accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, #00c853 30%, #00e676 50%, #00c853 70%, transparent)",
          opacity: 0.5,
        }} />

        {/*
          ── 3-ZONE LAYOUT ──
          Zone 1 (left):   Logo — fixed width, never grows
          Zone 2 (center): Nav links — centered absolutely in the bar
          Zone 3 (right):  Actions — fixed width, mirrors Zone 1
        */}
        <div style={{
          position: "relative",
          display: "flex", alignItems: "center",
          height: 60,
          maxWidth: 1280, margin: "0 auto",
          padding: "0 32px",
        }}>

          {/* ── ZONE 1: Logo (left) ── */}
          <div
            onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/dashboard")}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              cursor: "pointer", flexShrink: 0, zIndex: 1,
            }}
          >
            <div style={{
              width: 30, height: 30, background: "#00c853", borderRadius: 7,
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 14, flexShrink: 0,
            }}>🎟</div>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 21, letterSpacing: "3px", color: "#fff",
              userSelect: "none",
            }}>CROWD</span>
          </div>

          {/* ── ZONE 2: Nav links (true center) — desktop only ── */}
          <div
            className="desktop-only"
            style={{
              position: "absolute",
              left: "50%", transform: "translateX(-50%)",
              alignItems: "center", gap: 32,
            }}
          >
            {links.map(l => (
              <NavBtn key={l.path} label={l.label} path={l.path}
                navigate={navigate} active={is(l.path)} />
            ))}
          </div>

          {/* ── ZONE 3: Actions (right) — desktop only ── */}
          <div
            className="desktop-only"
            style={{
              marginLeft: "auto",
              alignItems: "center", gap: 12, flexShrink: 0, zIndex: 1,
            }}
          >
            {/* Admin badge */}
            {isAdmin && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(0,200,80,0.08)",
                border: "1px solid rgba(0,200,80,0.2)",
                borderRadius: 4, padding: "4px 11px",
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: "#00c853", flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "2px",
                  textTransform: "uppercase", color: "#00c853",
                  fontFamily: "'DM Sans', sans-serif",
                }}>Admin</span>
              </div>
            )}

            {/* Logout */}
            <button
              className="nav-logout-btn"
              onClick={logout}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11, fontWeight: 700,
                letterSpacing: "2px", textTransform: "uppercase",
                padding: "7px 20px", borderRadius: 7,
                cursor: "pointer", transition: "all 0.2s",
              }}
            >Logout</button>
          </div>

          {/* ── Hamburger — mobile only ── */}
          <button
            className="mobile-only"
            onClick={() => setMenuOpen(o => !o)}
            style={{
              marginLeft: "auto", zIndex: 1,
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 7, padding: "7px 9px",
              cursor: "pointer", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 5,
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: 20, height: 2,
                background: menuOpen
                  ? (i === 1 ? "transparent" : "#00c853")
                  : "rgba(255,255,255,0.6)",
                borderRadius: 2, transition: "all 0.25s",
                transform: menuOpen
                  ? (i === 0 ? "rotate(45deg) translate(5px, 5px)"
                    : i === 2 ? "rotate(-45deg) translate(5px, -5px)"
                    : "none")
                  : "none",
              }} />
            ))}
          </button>

        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div className={`mobile-drawer${menuOpen ? " open" : ""}`}>
        <div className="drawer-backdrop" onClick={close} />
        <div className="drawer-panel">

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 20px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{
                width: 26, height: 26, background: "#00c853", borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
              }}>🎟</div>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 18, letterSpacing: 3, color: "#fff",
              }}>CROWD</span>
            </div>
            <button onClick={close} style={{
              background: "none", border: "none",
              color: "rgba(255,255,255,0.4)",
              fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1,
            }}>✕</button>
          </div>

          {isAdmin && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(0,200,80,0.06)",
              borderBottom: "1px solid rgba(0,200,80,0.1)",
              padding: "10px 20px",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00c853", flexShrink: 0 }} />
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "2px",
                textTransform: "uppercase", color: "#00c853",
                fontFamily: "'DM Sans', sans-serif",
              }}>Admin Panel</span>
            </div>
          )}

          <div style={{ flex: 1, paddingTop: 8 }}>
            {links.map(l => (
              <MobileNavBtn key={l.path} label={l.label} path={l.path}
                navigate={navigate} active={is(l.path)} onClick={close} />
            ))}
          </div>

          <div style={{ padding: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={logout}
              style={{
                width: "100%", padding: "12px 0",
                background: "rgba(255,50,50,0.08)",
                border: "1px solid rgba(255,50,50,0.2)",
                borderRadius: 9, color: "#ff7070",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, fontWeight: 700,
                letterSpacing: "2px", textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,50,50,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,50,50,0.08)"}
            >Logout</button>
          </div>

        </div>
      </div>
    </>
  );
}