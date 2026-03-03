import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";
import { useNav } from "../PageTransition";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } },
});

/* ── Field component OUTSIDE the parent ── */
function Field({ id, label, type = "text", placeholder, value, onChange, onKeyDown, focused, onFocus, onBlur }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "block", fontSize: 10, fontWeight: 600,
        letterSpacing: "2.5px", textTransform: "uppercase",
        color: focused ? "#00c853" : "rgba(255,255,255,0.28)",
        marginBottom: 9, transition: "color 0.2s",
        fontFamily: "'DM Sans', sans-serif",
      }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          width: "100%",
          border: `1px solid ${focused ? "rgba(0,200,80,0.45)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 9, color: "#fff",
          fontFamily: "'DM Sans', sans-serif", fontSize: 15,
          padding: "14px 18px", outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(0,200,80,0.07)" : "none",
          background: focused ? "rgba(0,200,80,0.025)" : "rgba(255,255,255,0.03)",
          transition: "border 0.25s, box-shadow 0.25s, background 0.25s",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { go } = useNav();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const register = async () => {
    if (!/^[A-Za-z ]+$/.test(name)) {
      setError("Name should contain only letters"); return;
    }
    try {
      setLoading(true); setError("");
      await API.post("/auth/register", { name, email, password });
      go("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.17); }
        body { margin: 0; }
        @media(min-width:900px) { .auth-left-panel { display: block !important; } }
      `}</style>

      <div style={{
        minHeight: "100vh", display: "flex",
        fontFamily: "'DM Sans', sans-serif", background: "#020b06",
      }}>

        {/* ── LEFT PANEL ── */}
        <div className="auth-left-panel"
          style={{ flex: 1, position: "relative", overflow: "hidden", display: "none" }}>
          <motion.div
            initial={{ scale: 1 }} animate={{ scale: 1.06 }}
            transition={{ duration: 10, ease: "linear" }}
            style={{
              position: "absolute", inset: 0,
              backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80')",
              backgroundSize: "cover", backgroundPosition: "center",
              filter: "brightness(0.28) saturate(0.5)",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(150deg,rgba(0,200,80,.14) 0%,transparent 55%,rgba(0,0,0,.7) 100%)",
          }} />
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            style={{ position: "absolute", bottom: 64, left: 56, right: 48 }}
          >
            <div style={{
              display: "inline-block", background: "rgba(0,200,80,.14)",
              border: "1px solid rgba(0,200,80,.32)", color: "#00c853",
              fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
              padding: "6px 14px", borderRadius: 2, marginBottom: 24, fontWeight: 500,
            }}>Join the crowd</div>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(52px, 5.5vw, 80px)", lineHeight: 0.92,
              color: "#fff", letterSpacing: 1, marginBottom: 22,
            }}>
              Your next<br />great event<br />
              awaits <span style={{ color: "#00c853" }}>you.</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,.42)", fontSize: 14, lineHeight: 1.8, maxWidth: 310, fontWeight: 300 }}>
              Create your free account and start discovering events, booking tickets, and building memories.
            </p>
            <div style={{ display: "flex", gap: 6, marginTop: 42 }}>
              {[48, 24, 14].map((w, i) => (
                <span key={i} style={{
                  display: "block", height: 3, width: w, borderRadius: 2,
                  background: i === 0 ? "#00c853" : "rgba(255,255,255,.15)",
                }} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          style={{
            width: "100%", maxWidth: 520,
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "48px 48px", position: "relative",
            background: "#070f09",
            borderLeft: "1px solid rgba(255,255,255,.05)",
          }}
        >
          <div style={{
            position: "absolute", top: -180, right: -80, width: 380, height: 380,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(0,200,80,.07) 0%,transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Logo */}
          <motion.div {...fadeUp(0.3)}
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <div style={{
              width: 34, height: 34, background: "#00c853", borderRadius: 7,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>🎟</div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 3, color: "#fff" }}>
              CROWD
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div {...fadeUp(0.4)}>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 50,
              letterSpacing: 1, color: "#fff", lineHeight: 1, marginBottom: 8,
            }}>
              Create account
            </h2>
            <p style={{ color: "rgba(255,255,255,.36)", fontSize: 14, fontWeight: 300, marginBottom: 36 }}>
              Join thousands of event-goers today
            </p>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{
                background: "rgba(255,50,50,.08)", border: "1px solid rgba(255,50,50,.25)",
                color: "#ff7070", fontSize: 13, padding: "12px 16px",
                borderRadius: 8, marginBottom: 22, textAlign: "center",
              }}
            >{error}</motion.div>
          )}

          {/* Fields */}
          <motion.div {...fadeUp(0.5)}>
            <Field
              id="name" label="Full name" placeholder="Jane Smith"
              value={name} onChange={e => setName(e.target.value)}
              focused={focused === "name"}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused("")}
            />
            <Field
              id="email" label="Email address" type="email"
              placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)}
              focused={focused === "email"}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
            />
            <Field
              id="pass" label="Password" type="password"
              placeholder="Min. 8 characters" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && register()}
              focused={focused === "pass"}
              onFocus={() => setFocused("pass")}
              onBlur={() => setFocused("")}
            />
          </motion.div>

          {/* CTA */}
          <motion.button
            {...fadeUp(0.62)}
            onClick={register} disabled={loading}
            whileHover={!loading ? { y: -1, boxShadow: "0 10px 36px rgba(0,200,80,.3)", backgroundColor: "#00e060" } : {}}
            whileTap={!loading ? { y: 0 } : {}}
            style={{
              width: "100%", padding: 15, background: "#00c853", color: "#000",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
              letterSpacing: "2.5px", textTransform: "uppercase",
              border: "none", borderRadius: 9,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 8, opacity: loading ? 0.55 : 1, transition: "all 0.2s",
            }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </motion.button>

          {/* Terms */}
          <motion.p {...fadeUp(0.68)} style={{
            color: "rgba(255,255,255,.2)", fontSize: 11,
            textAlign: "center", marginTop: 16, lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            By registering you agree to our{" "}
            <a href="#" style={{ color: "rgba(0,200,83,.5)", textDecoration: "none" }}>Terms of Service</a>
            {" "}and{" "}
            <a href="#" style={{ color: "rgba(0,200,83,.5)", textDecoration: "none" }}>Privacy Policy</a>
          </motion.p>

          {/* Footer */}
          <motion.div {...fadeUp(0.74)} style={{
            marginTop: 28, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 7,
            color: "rgba(255,255,255,.3)", fontSize: 14,
          }}>
            <span>Already have an account?</span>
            <button
              onClick={() => go("/login")}
              style={{
                color: "#00c853", background: "none", border: "none",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                cursor: "pointer", padding: 0,
                textDecoration: "underline", textUnderlineOffset: 3,
              }}
            >Sign in</button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}