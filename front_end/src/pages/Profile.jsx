import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api";

function Field({ label, name, value, onChange, disabled, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "block", fontSize: 10, fontWeight: 700,
        letterSpacing: "2.5px", textTransform: "uppercase",
        color: disabled ? "rgba(255,255,255,0.15)" : focused ? "#00c853" : "rgba(255,255,255,0.3)",
        marginBottom: 8, transition: "color 0.2s",
        fontFamily: "'DM Sans', sans-serif",
      }}>{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          background: disabled
            ? "rgba(255,255,255,0.02)"
            : focused ? "rgba(0,200,80,0.025)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${
            disabled ? "rgba(255,255,255,0.04)"
            : focused ? "rgba(0,200,80,0.45)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 9, color: disabled ? "rgba(255,255,255,0.2)" : "#fff",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          padding: "13px 16px", outline: "none",
          boxShadow: focused && !disabled ? "0 0 0 3px rgba(0,200,80,0.07)" : "none",
          transition: "all 0.25s", cursor: disabled ? "not-allowed" : "text",
        }}
      />
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/user/me")
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    try {
      setError(""); setSaving(true);
      await API.put("/user/me", user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally { setSaving(false); }
  };

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  if (loading) return (
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

  if (!user) return (
    <div style={{
      minHeight: "80vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#020b06", fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          Failed to load profile
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        input::placeholder { color: rgba(255,255,255,0.15); }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#020b06",
        fontFamily: "'DM Sans', sans-serif",
        padding: "40px 24px 80px",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>

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
            }}>Account</div>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(36px, 5vw, 52px)",
              color: "#fff", margin: "0 0 8px", letterSpacing: 1, lineHeight: 1,
            }}>Your Profile</h1>
            <p style={{
              color: "rgba(255,255,255,0.35)", fontSize: 14,
              fontWeight: 300, margin: 0,
            }}>Manage your personal information</p>
          </motion.div>

          {/* ── Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              background: "#070f09",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, overflow: "hidden",
              position: "relative",
            }}
          >
            {/* top accent */}
            <div style={{
              height: 3,
              background: "linear-gradient(90deg, transparent, #00c853, #00e676, #00c853, transparent)",
            }} />

            {/* ambient glow */}
            <div style={{
              position: "absolute", top: -100, right: -60,
              width: 280, height: 280, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,200,80,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{ padding: "36px 40px 40px" }}>

              {/* ── Avatar section ── */}
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", marginBottom: 36,
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "linear-gradient(135deg, #00c853, #00e676)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 30, color: "#000", letterSpacing: 2,
                  marginBottom: 14,
                  boxShadow: "0 0 0 4px rgba(0,200,80,0.15), 0 8px 24px rgba(0,200,80,0.2)",
                }}>{initials}</div>

                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 24, color: "#fff", letterSpacing: 1, marginBottom: 4,
                }}>{user.name}</div>

                <div style={{
                  fontSize: 13, color: "rgba(255,255,255,0.35)",
                  fontFamily: "'DM Sans', sans-serif",
                }}>{user.email}</div>

                <div style={{
                  marginTop: 12,
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "rgba(0,200,80,0.08)",
                  border: "1px solid rgba(0,200,80,0.2)",
                  borderRadius: 4, padding: "3px 12px",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00c853" }} />
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "2px",
                    textTransform: "uppercase", color: "#00c853",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Active Account</span>
                </div>
              </div>

              {/* divider */}
              <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 28 }} />

              {/* section label */}
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
                textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
                marginBottom: 20, fontFamily: "'DM Sans', sans-serif",
              }}>Personal Information</div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "rgba(255,50,50,.08)", border: "1px solid rgba(255,50,50,.25)",
                    color: "#ff7070", fontSize: 13, padding: "12px 16px",
                    borderRadius: 8, marginBottom: 20, textAlign: "center",
                  }}
                >{error}</motion.div>
              )}

              {/* Fields */}
              <Field label="Full Name"  name="name"     value={user.name || ""}     onChange={handleChange} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Phone"    name="phone"    value={user.phone || ""}    onChange={handleChange} />
                <Field label="Location" name="location" value={user.location || ""} onChange={handleChange} />
              </div>
              <Field label="Email (cannot be changed)" name="email" value={user.email || ""} disabled />

              {/* Save */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
                <motion.button
                  onClick={saveProfile}
                  disabled={saving}
                  whileHover={!saving ? { y: -1, boxShadow: "0 10px 30px rgba(0,200,80,.25)", backgroundColor: "#00e060" } : {}}
                  whileTap={!saving ? { y: 0 } : {}}
                  style={{
                    padding: "13px 36px",
                    background: saved ? "rgba(0,200,80,0.15)" : "#00c853",
                    border: saved ? "1px solid rgba(0,200,80,0.4)" : "none",
                    color: saved ? "#00c853" : "#000",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
                    letterSpacing: "2px", textTransform: "uppercase",
                    borderRadius: 9, cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.6 : 1, transition: "all 0.25s",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  {saving ? (
                    <>
                      <div style={{
                        width: 14, height: 14,
                        border: "2px solid rgba(0,0,0,0.3)",
                        borderTopColor: "#000", borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }} />
                      Saving…
                    </>
                  ) : saved ? "✓ Saved!" : "Save Changes"}
                </motion.button>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}