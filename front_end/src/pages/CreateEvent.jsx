import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";

const CATEGORY_OPTIONS = [
  "Technology","Music","Business","Design","Workshop",
  "Conference","Meetup","Sports","Education","Other"
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22,1,0.36,1], delay } },
});

/* ── Reusable field components — defined OUTSIDE to prevent remount ── */
function Field({ label, name, type = "text", value, onChange, placeholder, min, required, inputProps = {} }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: "block", fontSize: 10, fontWeight: 600,
        letterSpacing: "2.5px", textTransform: "uppercase",
        color: focused ? "#00c853" : "rgba(255,255,255,0.3)",
        marginBottom: 8, transition: "color 0.2s",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}{required && <span style={{ color: "#00c853", marginLeft: 3 }}>*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} min={min} {...inputProps}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          background: focused ? "rgba(0,200,80,0.025)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? "rgba(0,200,80,0.45)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 9, color: "#fff",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          padding: "12px 16px", outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(0,200,80,0.07)" : "none",
          transition: "all 0.25s",
        }}
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange, rows = 3, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: "block", fontSize: 10, fontWeight: 600,
        letterSpacing: "2.5px", textTransform: "uppercase",
        color: focused ? "#00c853" : "rgba(255,255,255,0.3)",
        marginBottom: 8, transition: "color 0.2s",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}{required && <span style={{ color: "#00c853", marginLeft: 3 }}>*</span>}
      </label>
      <textarea
        name={name} value={value} onChange={onChange} rows={rows}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box", resize: "vertical",
          background: focused ? "rgba(0,200,80,0.025)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? "rgba(0,200,80,0.45)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 9, color: "#fff",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          padding: "12px 16px", outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(0,200,80,0.07)" : "none",
          transition: "all 0.25s",
        }}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: "block", fontSize: 10, fontWeight: 600,
        letterSpacing: "2.5px", textTransform: "uppercase",
        color: focused ? "#00c853" : "rgba(255,255,255,0.3)",
        marginBottom: 8, transition: "color 0.2s",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}{required && <span style={{ color: "#00c853", marginLeft: 3 }}>*</span>}
      </label>
      <select
        name={name} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          background: focused ? "rgba(0,200,80,0.025)" : "#0d1a11",
          border: `1px solid ${focused ? "rgba(0,200,80,0.45)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 9, color: value ? "#fff" : "rgba(255,255,255,0.3)",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          padding: "12px 16px", outline: "none", cursor: "pointer",
          boxShadow: focused ? "0 0 0 3px rgba(0,200,80,0.07)" : "none",
          transition: "all 0.25s", appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
        }}
      >
        <option value="" disabled>Select {label}</option>
        {options.map(o => (
          <option key={o} value={o} style={{ background: "#0d1a11", color: "#fff" }}>{o}</option>
        ))}
      </select>
    </div>
  );
}

/* ── Section divider ── */
function Section({ title, icon }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      margin: "28px 0 20px",
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "2.5px",
        textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
        fontFamily: "'DM Sans', sans-serif",
      }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const eventId = params.get("id");
  const isEdit = Boolean(eventId);
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    if (!isAdmin) navigate("/events", { replace: true });
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const today = new Date().toISOString().split("T")[0];
  const nowDateTime = new Date().toISOString().slice(0, 16);

  const [form, setForm] = useState({
    name: "", date: "", bookingCloseAt: "", location: "",
    category: "", description: "", availableSeats: "", price: "", thumbnail: ""
  });
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");
  const [customCategory, setCustomCategory] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    API.get(`/events/${eventId}`).then((res) => {
      const e = res.data;
      const [h, m] = e.time.split(":");
      let h12 = Number(h), p = "AM";
      if (h12 >= 12) { p = "PM"; if (h12 > 12) h12 -= 12; }
      if (h12 === 0) h12 = 12;
      setHour(String(h12)); setMinute(m); setPeriod(p);
      const isCustom = e.category && !CATEGORY_OPTIONS.includes(e.category);
      setForm({
        name: e.name, date: e.date,
        bookingCloseAt: e.bookingCloseAt.slice(0, 16),
        location: e.location, category: isCustom ? "Other" : e.category,
        description: e.description, availableSeats: e.availableSeats,
        price: e.price, thumbnail: e.thumbnail || ""
      });
      if (isCustom) setCustomCategory(e.category);
      if (e.thumbnail) setPreview(e.thumbnail);
    });
  }, [isEdit, eventId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setPreview(reader.result); setForm(f => ({ ...f, thumbnail: reader.result })); };
    reader.readAsDataURL(file);
  };

  const to24Hour = () => {
    let h = Number(hour);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${minute}`;
  };

  const submitEvent = async () => {
    setError("");
    if (!form.name || !form.date || !form.bookingCloseAt || !form.location) {
      setError("Please fill all required fields"); return;
    }
    if (form.category === "Other" && !customCategory.trim()) {
      setError("Please specify a category"); return;
    }
    const time24 = to24Hour();
    const eventDateTime = new Date(`${form.date}T${time24}`);
    const bookingClose = new Date(form.bookingCloseAt);
    if (bookingClose <= new Date()) { setError("Booking close must be in the future"); return; }
    if (bookingClose >= eventDateTime) { setError("Booking close must be before event time"); return; }
    try {
      setLoading(true);
      const payload = {
        ...form, time: time24,
        category: form.category === "Other" ? customCategory : form.category,
        availableSeats: Number(form.availableSeats),
        price: Number(form.price)
      };
      isEdit ? await API.put(`/events/${eventId}`, payload) : await API.post("/events", payload);
      navigate("/events");
    } catch { setError("Failed to save event. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.17); }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(0.4); cursor: pointer;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,200,80,0.2); border-radius: 2px; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#020b06",
        fontFamily: "'DM Sans', sans-serif",
        padding: "40px 16px 80px",
        display: "flex", justifyContent: "center",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", maxWidth: 620 }}
        >
          {/* ── Header ── */}
          <div style={{ marginBottom: 32 }}>
            <button
              onClick={() => navigate("/events")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.3)", fontSize: 13,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                display: "flex", alignItems: "center", gap: 6,
                marginBottom: 24, padding: 0, transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#00c853"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
            >
              ← Back to Events
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 34, height: 34, background: "#00c853", borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>🎟</div>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 22,
                letterSpacing: 3, color: "#fff",
              }}>CROWD</span>
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{
                display: "inline-block",
                background: "rgba(0,200,80,0.12)", border: "1px solid rgba(0,200,80,0.28)",
                color: "#00c853", fontSize: 10, letterSpacing: 3,
                textTransform: "uppercase", padding: "5px 14px",
                borderRadius: 2, marginBottom: 14, fontWeight: 600,
              }}>
                {isEdit ? "Edit Event" : "New Event"}
              </div>
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 42,
                color: "#fff", letterSpacing: 1, lineHeight: 1,
              }}>
                {isEdit ? "Update event" : "Create event"}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, fontWeight: 300, marginTop: 8 }}>
                {isEdit ? "Modify the details below and save your changes." : "Fill in the details to publish a new event."}
              </p>
            </div>
          </div>

          {/* ── Card ── */}
          <div style={{
            background: "#070f09",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: "36px 40px",
            position: "relative", overflow: "hidden",
          }}>
            {/* top green accent */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: "linear-gradient(90deg, #00c853, #00e676, #00c853)",
            }} />
            {/* ambient glow */}
            <div style={{
              position: "absolute", top: -120, right: -80, width: 300, height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(0,200,80,.06) 0%,transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "rgba(255,50,50,.08)", border: "1px solid rgba(255,50,50,.25)",
                  color: "#ff7070", fontSize: 13, padding: "12px 16px",
                  borderRadius: 8, marginBottom: 24, textAlign: "center",
                }}
              >{error}</motion.div>
            )}

            {/* ── BASIC INFO ── */}
            <Section title="Basic Info" icon="📋" />

            <Field label="Event Name" name="name" value={form.name}
              onChange={handleChange} placeholder="e.g. Web Summit 2025" required />

            <SelectField label="Category" name="category" value={form.category}
              onChange={handleChange} options={CATEGORY_OPTIONS} required />

            {form.category === "Other" && (
              <Field label="Custom Category" name="customCategory"
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                placeholder="e.g. Hackathon" required />
            )}

            <TextArea label="Description" name="description" value={form.description}
              onChange={handleChange} rows={3} />

            {/* ── DATE & TIME ── */}
            <Section title="Date & Time" icon="🗓" />

            <Field label="Event Date" name="date" type="date" value={form.date}
              onChange={handleChange} min={today} required />

            {/* 12-hour time picker */}
            <div style={{ marginBottom: 18 }}>
              <label style={{
                display: "block", fontSize: 10, fontWeight: 600,
                letterSpacing: "2.5px", textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)", marginBottom: 8,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Event Time <span style={{ color: "#00c853" }}>*</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {/* Hour */}
                <div>
                  <input
                    type="number" min={1} max={12} value={hour}
                    onChange={e => setHour(e.target.value)}
                    placeholder="12"
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9,
                      color: "#fff", fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14, padding: "12px 16px", outline: "none",
                      textAlign: "center", boxSizing: "border-box",
                    }}
                  />
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 5, letterSpacing: 1 }}>HOUR</div>
                </div>
                {/* Minute */}
                <div>
                  <input
                    type="number" min={0} max={59} value={minute}
                    onChange={e => setMinute(e.target.value.padStart(2, "0"))}
                    placeholder="00"
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9,
                      color: "#fff", fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14, padding: "12px 16px", outline: "none",
                      textAlign: "center", boxSizing: "border-box",
                    }}
                  />
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 5, letterSpacing: 1 }}>MIN</div>
                </div>
                {/* AM/PM toggle */}
                <div>
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 9, overflow: "hidden", height: 44,
                  }}>
                    {["AM", "PM"].map(p => (
                      <button key={p} onClick={() => setPeriod(p)} style={{
                        border: "none", cursor: "pointer",
                        background: period === p ? "#00c853" : "rgba(255,255,255,0.03)",
                        color: period === p ? "#000" : "rgba(255,255,255,0.4)",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12, fontWeight: 700, transition: "all 0.2s",
                      }}>{p}</button>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 5, letterSpacing: 1 }}>PERIOD</div>
                </div>
              </div>
            </div>

            <Field label="Booking Closes At" name="bookingCloseAt"
              type="datetime-local" value={form.bookingCloseAt}
              onChange={handleChange} min={nowDateTime} required />

            {/* ── LOCATION & LOGISTICS ── */}
            <Section title="Location & Logistics" icon="📍" />

            <Field label="Location" name="location" value={form.location}
              onChange={handleChange} placeholder="e.g. Bangalore, India" required />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
              <div>
                <label style={{
                  display: "block", fontSize: 10, fontWeight: 600,
                  letterSpacing: "2.5px", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)", marginBottom: 8,
                  fontFamily: "'DM Sans', sans-serif",
                }}>Available Seats</label>
                <input
                  type="number" name="availableSeats" value={form.availableSeats}
                  onChange={handleChange} placeholder="e.g. 200" min={1}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9,
                    color: "#fff", fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14, padding: "12px 16px", outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: "block", fontSize: 10, fontWeight: 600,
                  letterSpacing: "2.5px", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)", marginBottom: 8,
                  fontFamily: "'DM Sans', sans-serif",
                }}>Price (₹)</label>
                <input
                  type="number" name="price" value={form.price}
                  onChange={handleChange} placeholder="0 for free" min={0}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9,
                    color: "#fff", fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14, padding: "12px 16px", outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* ── THUMBNAIL ── */}
            <Section title="Thumbnail" icon="🖼" />

            <label style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              border: `2px dashed ${preview ? "rgba(0,200,80,0.3)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 12, padding: "28px 20px",
              cursor: "pointer", transition: "all 0.2s",
              background: preview ? "rgba(0,200,80,0.03)" : "transparent",
              marginBottom: 18,
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,200,80,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = preview ? "rgba(0,200,80,0.3)" : "rgba(255,255,255,0.08)"}
            >
              <input type="file" accept="image/*" onChange={handleImageUpload}
                style={{ display: "none" }} />
              {preview ? (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <img src={preview} alt="Preview" style={{
                    width: "100%", maxHeight: 200,
                    objectFit: "cover", borderRadius: 8, marginBottom: 10,
                  }} />
                  <span style={{ fontSize: 12, color: "#00c853", fontWeight: 500 }}>
                    Click to change image
                  </span>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>📸</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
                    Click to upload thumbnail
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>
                    PNG, JPG, WEBP — recommended 16:9
                  </div>
                </>
              )}
            </label>

            {/* ── SUBMIT ── */}
            <motion.button
              onClick={submitEvent} disabled={loading}
              whileHover={!loading ? { y: -1, boxShadow: "0 10px 36px rgba(0,200,80,.3)", backgroundColor: "#00e060" } : {}}
              whileTap={!loading ? { y: 0 } : {}}
              style={{
                width: "100%", padding: "15px 0",
                background: "#00c853", color: "#000",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700,
                letterSpacing: "2.5px", textTransform: "uppercase",
                border: "none", borderRadius: 9,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1, transition: "all 0.2s",
                marginTop: 8,
              }}
            >
              {loading ? "Saving…" : isEdit ? "Update Event" : "Publish Event"}
            </motion.button>

          </div>
        </motion.div>
      </div>
    </>
  );
}