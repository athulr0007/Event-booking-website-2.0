const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://crowd-seven.vercel.app",
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
console.log("REGISTERING USER ROUTES");
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
