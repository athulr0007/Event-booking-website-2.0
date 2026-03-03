import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";

/* ── Stat card ── */
function StatCard({ label, value, icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      style={{
        background: "#070f09",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12, padding: "22px 24px",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, #00c853, transparent)",
        opacity: 0.5,
      }} />
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 36, color: "#fff", letterSpacing: 1, lineHeight: 1,
        marginBottom: 4,
      }}>{value}</div>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
        textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
        fontFamily: "'DM Sans', sans-serif",
      }}>{label}</div>
    </motion.div>
  );
}

/* ── Table row with expandable bookings ── */
function UserRow({ user, bookings, index }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const tickets = bookings.reduce((s, b) => s + b.quantity, 0);
  const initials = user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <tr
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "rgba(0,200,80,0.04)" : "transparent",
          cursor: "pointer", transition: "background 0.2s",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* index */}
        <td style={{ padding: "14px 16px", width: 40 }}>
          <span style={{
            fontSize: 11, color: "rgba(255,255,255,0.2)",
            fontFamily: "'DM Sans', sans-serif",
          }}>{index + 1}</span>
        </td>

        {/* avatar + name */}
        <td style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #00c853, #00e676)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              fontWeight: 700, color: "#000",
            }}>{initials}</div>
            <div>
              <div style={{
                fontSize: 14, fontWeight: 600, color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
              }}>{user.name}</div>
              <div style={{
                fontSize: 11, color: "rgba(255,255,255,0.35)",
                fontFamily: "'DM Sans', sans-serif", marginTop: 1,
              }}>{user.email}</div>
            </div>
          </div>
        </td>

        {/* events */}
        <td style={{ padding: "14px 16px" }}>
          <span style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 5, padding: "3px 10px",
            fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)",
            fontFamily: "'DM Sans', sans-serif",
          }}>{bookings.length}</span>
        </td>

        {/* tickets */}
        <td style={{ padding: "14px 16px" }}>
          <span style={{
            background: "rgba(0,200,80,0.08)",
            border: "1px solid rgba(0,200,80,0.2)",
            borderRadius: 5, padding: "3px 10px",
            fontSize: 13, fontWeight: 700, color: "#00c853",
            fontFamily: "'DM Sans', sans-serif",
          }}>{tickets}</span>
        </td>

        {/* expand chevron */}
        <td style={{ padding: "14px 16px", width: 40, textAlign: "right" }}>
          <span style={{
            display: "inline-block",
            color: "rgba(255,255,255,0.25)", fontSize: 12,
            transition: "transform 0.25s, color 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            ...(hovered ? { color: "#00c853" } : {}),
          }}>▼</span>
        </td>
      </tr>

      {/* expanded bookings */}
      <AnimatePresence>
        {open && (
          <tr>
            <td colSpan={5} style={{ padding: 0, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div style={{
                  background: "rgba(0,200,80,0.025)",
                  borderTop: "1px solid rgba(0,200,80,0.08)",
                  padding: "16px 20px 20px 68px",
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
                    marginBottom: 12, fontFamily: "'DM Sans', sans-serif",
                  }}>Booked Events</div>

                  {bookings.length === 0 ? (
                    <div style={{
                      fontSize: 13, color: "rgba(255,255,255,0.2)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>No bookings yet</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 480 }}>
                      {bookings.map((b, i) => (
                        <div key={i} style={{
                          display: "flex", alignItems: "center",
                          justifyContent: "space-between", gap: 16,
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRadius: 8, padding: "10px 14px",
                        }}>
                          <div style={{
                            fontSize: 13, color: "rgba(255,255,255,0.65)",
                            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                          }}>{b.event.name}</div>
                          <div style={{
                            background: "rgba(0,200,80,0.1)",
                            border: "1px solid rgba(0,200,80,0.2)",
                            borderRadius: 4, padding: "3px 10px",
                            fontSize: 11, fontWeight: 700, color: "#00c853",
                            fontFamily: "'DM Sans', sans-serif",
                            whiteSpace: "nowrap", flexShrink: 0,
                          }}>
                            {b.quantity} ticket{b.quantity > 1 ? "s" : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Card view ── */
function UserCard({ user, bookings }) {
  const tickets = bookings.reduce((s, b) => s + b.quantity, 0);
  const initials = user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#070f09",
        border: `1px solid ${hovered ? "rgba(0,200,80,0.2)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 14, overflow: "hidden",
        transition: "all 0.25s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.35)" : "none",
      }}
    >
      <div style={{ padding: "24px 24px 0" }}>
        {/* avatar + info */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #00c853, #00e676)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif", fontSize: 16,
            fontWeight: 700, color: "#000",
          }}>{initials}</div>
          <div>
            <div style={{
              fontSize: 15, fontWeight: 700, color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
            }}>{user.name}</div>
            <div style={{
              fontSize: 12, color: "rgba(255,255,255,0.35)",
              fontFamily: "'DM Sans', sans-serif", marginTop: 2,
            }}>{user.email}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 5, padding: "3px 9px",
              fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)",
              fontFamily: "'DM Sans', sans-serif",
            }}>{bookings.length} events</div>
            <div style={{
              background: "rgba(0,200,80,0.08)",
              border: "1px solid rgba(0,200,80,0.2)",
              borderRadius: 5, padding: "3px 9px",
              fontSize: 11, fontWeight: 700, color: "#00c853",
              fontFamily: "'DM Sans', sans-serif",
            }}>{tickets} 🎟</div>
          </div>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 16 }} />
      </div>

      {/* bookings */}
      <div style={{ padding: "0 24px 24px" }}>
        {bookings.length === 0 ? (
          <div style={{
            fontSize: 13, color: "rgba(255,255,255,0.2)",
            fontFamily: "'DM Sans', sans-serif", textAlign: "center",
            padding: "12px 0",
          }}>No bookings yet</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {bookings.map((b, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: 12,
              }}>
                <div style={{
                  fontSize: 13, color: "rgba(255,255,255,0.55)",
                  fontFamily: "'DM Sans', sans-serif",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{b.event.name}</div>
                <div style={{
                  background: "rgba(0,200,80,0.08)",
                  border: "1px solid rgba(0,200,80,0.18)",
                  borderRadius: 4, padding: "2px 8px",
                  fontSize: 11, fontWeight: 700, color: "#00c853",
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>×{b.quantity}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [tableMode, setTableMode] = useState(true);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    Promise.all([API.get("/admin/users"), API.get("/admin/bookings-summary")])
      .then(([usersRes, summaryRes]) => {
        setUsers(usersRes.data);
        setSummary(summaryRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalTickets = users.reduce((sum, u) =>
    sum + (summary[u._id] || []).reduce((s, b) => s + b.quantity, 0), 0
  );
  const totalBookings = users.reduce((sum, u) =>
    sum + (summary[u._id] || []).length, 0
  );

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        .users-table { width: 100%; border-collapse: collapse; }
        .users-table thead tr {
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .users-table thead th {
          padding: 12px 16px;
          text-align: left;
          font-size: 10px; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          font-family: 'DM Sans', sans-serif;
        }
        @media (max-width: 640px) {
          .users-table thead th:nth-child(3),
          .users-table tbody td:nth-child(3) { display: none; }
        }
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
            }}>User Analytics</h1>
            <p style={{
              color: "rgba(255,255,255,0.35)", fontSize: 14,
              fontWeight: 300, margin: 0,
            }}>Attendance and engagement overview</p>
          </motion.div>

          {/* ── Stat cards ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16, marginBottom: 36,
          }}>
            <StatCard icon="👥" label="Total Users"    value={users.length}   delay={0.1} />
            <StatCard icon="📋" label="Total Bookings" value={totalBookings}   delay={0.2} />
            <StatCard icon="🎟" label="Tickets Sold"   value={totalTickets}    delay={0.3} />
            <StatCard icon="📊" label="Avg per User"
              value={users.length ? (totalTickets / users.length).toFixed(1) : 0}
              delay={0.4} />
          </div>

          {/* ── Controls ── */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap", gap: 12, marginBottom: 24,
          }}>
            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 340 }}>
              <span style={{
                position: "absolute", left: 13, top: "50%",
                transform: "translateY(-50%)", fontSize: 13,
                color: searchFocused ? "#00c853" : "rgba(255,255,255,0.25)",
                transition: "color 0.2s", pointerEvents: "none",
              }}>🔍</span>
              <input
                type="text" placeholder="Search users…"
                value={search} onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: "100%",
                  background: searchFocused ? "rgba(0,200,80,0.025)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${searchFocused ? "rgba(0,200,80,0.4)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 9, color: "#fff",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  padding: "10px 14px 10px 38px", outline: "none",
                  boxShadow: searchFocused ? "0 0 0 3px rgba(0,200,80,0.07)" : "none",
                  transition: "all 0.25s", boxSizing: "border-box",
                }}
              />
            </div>

            {/* View toggle */}
            <div style={{
              display: "flex",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 9, overflow: "hidden",
            }}>
              {[
                { label: "⊞ Table", value: true },
                { label: "⊟ Cards", value: false },
              ].map(opt => (
                <button
                  key={String(opt.value)}
                  onClick={() => setTableMode(opt.value)}
                  style={{
                    padding: "9px 18px",
                    background: tableMode === opt.value ? "#00c853" : "transparent",
                    border: "none", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12, fontWeight: 700,
                    color: tableMode === opt.value ? "#000" : "rgba(255,255,255,0.4)",
                    transition: "all 0.2s",
                  }}
                >{opt.label}</button>
              ))}
            </div>
          </div>

          {/* ── Count ── */}
          <div style={{
            fontSize: 12, color: "rgba(255,255,255,0.25)",
            fontFamily: "'DM Sans', sans-serif", marginBottom: 16,
          }}>
            {filtered.length} user{filtered.length !== 1 ? "s" : ""}
            {search && ` matching "${search}"`}
          </div>

          {/* ── TABLE VIEW ── */}
          {tableMode && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "#070f09",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, overflow: "hidden",
              }}
            >
              {/* top accent */}
              <div style={{
                height: 3,
                background: "linear-gradient(90deg, transparent, #00c853, #00e676, #00c853, transparent)",
              }} />

              <table className="users-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>User</th>
                    <th>Events</th>
                    <th>Tickets</th>
                    <th style={{ width: 40 }} />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, i) => (
                    <UserRow
                      key={user._id}
                      user={user}
                      bookings={summary[user._id] || []}
                      index={i}
                    />
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div style={{
                  padding: "48px 24px", textAlign: "center",
                  color: "rgba(255,255,255,0.2)", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                }}>No users found{search && ` for "${search}"`}</div>
              )}
            </motion.div>
          )}

          {/* ── CARD VIEW ── */}
          {!tableMode && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 20,
              }}
            >
              {filtered.map(user => (
                <UserCard
                  key={user._id}
                  user={user}
                  bookings={summary[user._id] || []}
                />
              ))}
              {filtered.length === 0 && (
                <div style={{
                  gridColumn: "1/-1", padding: "48px 24px",
                  textAlign: "center", color: "rgba(255,255,255,0.2)",
                  fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                }}>No users found{search && ` for "${search}"`}</div>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </>
  );
}