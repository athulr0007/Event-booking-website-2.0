import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import defaultImage from "../assets/default-event.jpg";

/* ── Stat pill ── */
function Pill({ icon, text, green }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: green ? "rgba(0,200,80,0.08)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${green ? "rgba(0,200,80,0.22)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 6, padding: "6px 12px",
      fontSize: 13, color: green ? "#00c853" : "rgba(255,255,255,0.6)",
      fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
      whiteSpace: "nowrap",
    }}>
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

/* ── Delete confirm modal ── */
function DeleteModal({ onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
      onClick={onCancel}
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
          maxWidth: 400, width: "100%",
          fontFamily: "'DM Sans', sans-serif",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg, transparent, #ff4444, transparent)",
        }} />

        <div style={{ fontSize: 32, marginBottom: 16 }}>🗑️</div>
        <h3 style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 28,
          color: "#fff", margin: "0 0 10px", letterSpacing: 1,
        }}>Delete Event</h3>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, margin: "0 0 28px" }}>
          This action is permanent and cannot be undone. All bookings for this event will also be affected.
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "12px 0",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 9, color: "rgba(255,255,255,0.6)",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          >Cancel</button>

          <button onClick={onConfirm} style={{
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
          >Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    API.get(`/events/${id}`).then(res => setEvent(res.data));
    if (isAdmin) API.get(`/bookings/event/${id}`).then(res => setBookings(res.data));
  }, [id, isAdmin]);

  /* countdown */
  useEffect(() => {
    if (!event?.bookingCloseAt) return;
    const tick = () => {
      const diff = new Date(event.bookingCloseAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Booking Closed"); return; }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (days >= 1) setTimeLeft(`${days}d ${hours}h`);
      else setTimeLeft(`${hours}h ${mins}m ${secs}s`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [event]);

  const bookingClosed = event && new Date(event.bookingCloseAt) <= new Date();

  const handlePayment = async () => {
    setErrorMsg("");
    if (!quantity || quantity < 1) { setErrorMsg("Select at least one ticket"); return; }
    if (quantity > event.availableSeats) { setErrorMsg("Not enough seats available"); return; }
    try {
      setLoading(true);
      localStorage.setItem("pendingBooking", JSON.stringify({ eventId: event._id, quantity }));
      const res = await API.post("/payment/checkout", { eventId: event._id, quantity });
      window.location.href = res.data.url;
    } catch { setErrorMsg("Payment initiation failed"); setLoading(false); }
  };

  const deleteEvent = async () => {
    await API.delete(`/events/${id}`);
    navigate("/events");
  };

  if (!event) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#020b06",
    }}>
      <div style={{
        width: 36, height: 36, border: "3px solid rgba(0,200,80,0.2)",
        borderTopColor: "#00c853", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : event.date;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#020b06",
        fontFamily: "'DM Sans', sans-serif", paddingBottom: 80,
      }}>

        {/* ── HERO IMAGE ── */}
        <div style={{ position: "relative", width: "100%", height: "clamp(240px, 45vw, 480px)", overflow: "hidden" }}>
          <motion.img
            initial={{ scale: 1.06 }} animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            src={imgError ? defaultImage : (event.thumbnail || defaultImage)}
            onError={() => setImgError(true)}
            alt={event.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, #020b06 0%, rgba(2,11,6,0.6) 45%, transparent 100%)",
          }} />

          {/* Back button */}
          <button
            onClick={() => navigate("/events")}
            style={{
              position: "absolute", top: 20, left: 20,
              background: "rgba(7,15,9,0.8)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)", borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              fontWeight: 500, padding: "8px 16px",
              cursor: "pointer", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
          >← Events</button>

          {/* Category badge */}
          {event.category && (
            <div style={{
              position: "absolute", top: 20, right: 20,
              background: "rgba(0,200,80,0.15)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,200,80,0.3)",
              color: "#00c853", fontSize: 10, fontWeight: 700,
              letterSpacing: "2.5px", textTransform: "uppercase",
              padding: "5px 12px", borderRadius: 4,
              fontFamily: "'DM Sans', sans-serif",
            }}>{event.category}</div>
          )}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          padding: "0 24px",
          marginTop: -60, position: "relative", zIndex: 2,
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) 340px",
            gap: 32, alignItems: "start",
          }}
            className="event-grid"
          >

            {/* ── LEFT: details ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(36px, 5vw, 60px)",
                color: "#fff", lineHeight: 0.95,
                letterSpacing: 1, margin: "0 0 20px",
              }}>{event.name}</h1>

              {/* Meta pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                <Pill icon="🗓" text={formattedDate} />
                <Pill icon="🕐" text={event.time} />
                <Pill icon="📍" text={event.location} />
                <Pill icon="🎟" text={`${event.availableSeats} seats left`} green={event.availableSeats > 0} />
              </div>

              {/* Description */}
              {event.description && (
                <div style={{ marginBottom: 32 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
                    marginBottom: 12,
                  }}>About this event</div>
                  <p style={{
                    color: "rgba(255,255,255,0.55)", fontSize: 15,
                    lineHeight: 1.8, margin: 0, fontWeight: 300,
                  }}>{event.description}</p>
                </div>
              )}

              {/* Admin actions */}
              {isAdmin && (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
                  <button
                    onClick={() => navigate(`/create-event?id=${id}`)}
                    style={{
                      background: "rgba(0,200,80,0.08)",
                      border: "1px solid rgba(0,200,80,0.25)",
                      color: "#00c853", borderRadius: 9,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12, fontWeight: 700,
                      letterSpacing: "1.5px", textTransform: "uppercase",
                      padding: "11px 24px", cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,200,80,0.14)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(0,200,80,0.08)"}
                  >✏️ Edit Event</button>

                  <button
                    onClick={() => setOpenDelete(true)}
                    style={{
                      background: "rgba(255,50,50,0.08)",
                      border: "1px solid rgba(255,50,50,0.25)",
                      color: "#ff6b6b", borderRadius: 9,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12, fontWeight: 700,
                      letterSpacing: "1.5px", textTransform: "uppercase",
                      padding: "11px 24px", cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,50,50,0.16)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,50,50,0.08)"}
                  >🗑️ Delete Event</button>
                </div>
              )}

              {/* Admin bookings list */}
              {isAdmin && bookings.length > 0 && (
                <div style={{
                  background: "#070f09",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 14, overflow: "hidden",
                }}>
                  <div style={{
                    padding: "20px 24px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 22, letterSpacing: 1, color: "#fff",
                    }}>Bookings</div>
                    <div style={{
                      background: "rgba(0,200,80,0.1)",
                      border: "1px solid rgba(0,200,80,0.2)",
                      color: "#00c853", fontSize: 12, fontWeight: 700,
                      padding: "3px 10px", borderRadius: 4,
                    }}>{bookings.length}</div>
                  </div>
                  {bookings.map((b, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 24px",
                      borderBottom: i < bookings.length - 1
                        ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <div>
                        <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>
                          {b.user.name}
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 2 }}>
                          {b.user.email}
                        </div>
                      </div>
                      <div style={{
                        background: "rgba(0,200,80,0.08)",
                        border: "1px solid rgba(0,200,80,0.18)",
                        color: "#00c853", fontSize: 12, fontWeight: 600,
                        padding: "4px 12px", borderRadius: 5,
                        whiteSpace: "nowrap",
                      }}>
                        {b.quantity} ticket{b.quantity > 1 ? "s" : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isAdmin && bookings.length === 0 && (
                <div style={{
                  background: "#070f09",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 14, padding: "28px 24px",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.25)", fontSize: 14,
                }}>No bookings yet for this event</div>
              )}
            </motion.div>

            {/* ── RIGHT: booking card ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
              style={{ position: "sticky", top: 80 }}
            >
              <div style={{
                background: "#070f09",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, overflow: "hidden",
              }}>
                {/* top accent */}
                <div style={{
                  height: 3,
                  background: bookingClosed
                    ? "linear-gradient(90deg, transparent, #ff4444, transparent)"
                    : "linear-gradient(90deg, transparent, #00c853, #00e676, #00c853, transparent)",
                }} />

                <div style={{ padding: "28px 28px 24px" }}>

                  {/* Price */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
                      textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
                      marginBottom: 6,
                    }}>Price per ticket</div>
                    <div style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 44, color: "#fff", lineHeight: 1, letterSpacing: 1,
                    }}>
                      {event.price === 0
                        ? <span style={{ color: "#00c853" }}>FREE</span>
                        : <>₹<span style={{ color: "#00c853" }}>{event.price}</span></>
                      }
                    </div>
                  </div>

                  {/* Countdown */}
                  {event.bookingCloseAt && (
                    <div style={{
                      background: bookingClosed
                        ? "rgba(255,50,50,0.07)"
                        : "rgba(0,200,80,0.05)",
                      border: `1px solid ${bookingClosed ? "rgba(255,50,50,0.2)" : "rgba(0,200,80,0.18)"}`,
                      borderRadius: 9, padding: "14px 16px",
                      marginBottom: 20,
                    }}>
                      <div style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: bookingClosed ? "rgba(255,100,100,0.6)" : "rgba(255,255,255,0.3)",
                        marginBottom: 5,
                      }}>
                        {bookingClosed ? "Status" : "Closes in"}
                      </div>
                      <div style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: 26, letterSpacing: 1,
                        color: bookingClosed ? "#ff6b6b" : "#00c853",
                        lineHeight: 1,
                      }}>{timeLeft}</div>
                    </div>
                  )}

                  {/* Error */}
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: "rgba(255,50,50,0.08)",
                        border: "1px solid rgba(255,50,50,0.25)",
                        color: "#ff7070", fontSize: 13,
                        padding: "10px 14px", borderRadius: 8,
                        marginBottom: 16, textAlign: "center",
                      }}
                    >{errorMsg}</motion.div>
                  )}

                  {/* Ticket quantity + pay — user only */}
                  {!isAdmin && (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
                          textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
                          marginBottom: 8,
                        }}>Number of tickets</div>

                        {/* Quantity stepper */}
                        <div style={{
                          display: "flex", alignItems: "center",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 9, overflow: "hidden",
                        }}>
                          <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            style={{
                              width: 44, height: 48, background: "none", border: "none",
                              color: "rgba(255,255,255,0.5)", fontSize: 20,
                              cursor: "pointer", transition: "all 0.15s",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                          >−</button>

                          <div style={{
                            flex: 1, textAlign: "center",
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: 26, color: "#fff", letterSpacing: 1,
                            userSelect: "none",
                          }}>{quantity}</div>

                          <button
                            onClick={() => setQuantity(q => Math.min(event.availableSeats, q + 1))}
                            style={{
                              width: 44, height: 48, background: "none", border: "none",
                              color: "rgba(255,255,255,0.5)", fontSize: 20,
                              cursor: "pointer", transition: "all 0.15s",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                          >+</button>
                        </div>
                      </div>

                      {/* Total */}
                      {event.price > 0 && (
                        <div style={{
                          display: "flex", justifyContent: "space-between",
                          alignItems: "center", marginBottom: 18,
                          padding: "10px 0",
                          borderTop: "1px solid rgba(255,255,255,0.05)",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}>
                          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                            Total ({quantity} × ₹{event.price})
                          </span>
                          <span style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: 24, color: "#fff", letterSpacing: 1,
                          }}>₹{quantity * event.price}</span>
                        </div>
                      )}

                      {/* Pay button */}
                      <motion.button
                        onClick={handlePayment}
                        disabled={loading || bookingClosed || event.availableSeats === 0}
                        whileHover={(!loading && !bookingClosed && event.availableSeats > 0) ? { y: -1, boxShadow: "0 10px 36px rgba(0,200,80,.3)", backgroundColor: "#00e060" } : {}}
                        whileTap={(!loading && !bookingClosed) ? { y: 0 } : {}}
                        style={{
                          width: "100%", padding: "15px 0",
                          background: (bookingClosed || event.availableSeats === 0)
                            ? "rgba(255,255,255,0.06)"
                            : "#00c853",
                          color: (bookingClosed || event.availableSeats === 0)
                            ? "rgba(255,255,255,0.25)"
                            : "#000",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 12, fontWeight: 700,
                          letterSpacing: "2px", textTransform: "uppercase",
                          border: "none", borderRadius: 9,
                          cursor: (loading || bookingClosed || event.availableSeats === 0)
                            ? "not-allowed" : "pointer",
                          transition: "all 0.2s",
                          display: "flex", alignItems: "center",
                          justifyContent: "center", gap: 8,
                        }}
                      >
                        {loading ? (
                          <>
                            <div style={{
                              width: 16, height: 16,
                              border: "2px solid rgba(0,0,0,0.3)",
                              borderTopColor: "#000",
                              borderRadius: "50%",
                              animation: "spin 0.7s linear infinite",
                            }} />
                            Processing…
                          </>
                        ) : bookingClosed ? "Booking Closed"
                          : event.availableSeats === 0 ? "Sold Out"
                          : `Pay & Book ${quantity} Ticket${quantity > 1 ? "s" : ""}`
                        }
                      </motion.button>
                    </>
                  )}

                  {/* Seats indicator */}
                  {event.availableSeats > 0 && event.availableSeats <= 20 && !bookingClosed && (
                    <div style={{
                      marginTop: 14, textAlign: "center",
                      fontSize: 12, color: "#f59e0b", fontWeight: 500,
                    }}>
                      ⚡ Only {event.availableSeats} seats remaining
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── DELETE MODAL ── */}
      <AnimatePresence>
        {openDelete && (
          <DeleteModal
            onConfirm={deleteEvent}
            onCancel={() => setOpenDelete(false)}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .event-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}