import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Landing        from "./pages/Landing";
import Login          from "./pages/login";
import Register       from "./pages/Register";
import Events         from "./pages/Events";
import EventDetails   from "./pages/EventDetails";
import Bookings       from "./pages/Bookings";
import Profile        from "./pages/Profile";
import Navbar         from "./pages/Navbar";
import CreateEvent    from "./pages/CreateEvent";
import AdminUsers     from "./pages/AdminUsers";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard  from "./pages/UserDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel  from "./pages/PaymentCancel";
import AdminRevenue   from "./pages/AdminRevenue";
import ProtectedRoute from "./ProtectedRoute";

import {
  WipeCurtain,
  useTransitionNavigate,
  TransitionCtx,
  publicVariants,
  appVariants,
} from "./PageTransition";

const PUBLIC_PATHS = ["/", "/login", "/register"];

// Wraps each route's content in a motion.div with the right variant
function PageWrapper({ children, path }) {
  const isPublic = PUBLIC_PATHS.includes(path);
  return (
    <motion.div
      variants={isPublic ? publicVariants : appVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: "100vh" }}
    >
      {children}
    </motion.div>
  );
}

/* ── Routes wrapper ── */
function AnimatedRoutes({ setIsLoggedIn }) {
  const location = useLocation();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const { go, curtain } = useTransitionNavigate();

  return (
    <TransitionCtx.Provider value={{ go }}>

      {/* Green wipe curtain — sits above everything */}
      <WipeCurtain isVisible={curtain} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* ── PUBLIC ── */}
          <Route path="/" element={
            <PageWrapper path="/"><Landing /></PageWrapper>
          }/>
          <Route path="/login" element={
            <PageWrapper path="/login">
              <Login setIsLoggedIn={setIsLoggedIn} />
            </PageWrapper>
          }/>
          <Route path="/register" element={
            <PageWrapper path="/register"><Register /></PageWrapper>
          }/>

          {/* ── USER ── */}
          <Route path="/events" element={
            <ProtectedRoute>
              <PageWrapper path="/events"><Events /></PageWrapper>
            </ProtectedRoute>
          }/>
          <Route path="/events/:id" element={
            <ProtectedRoute>
              <PageWrapper path="/events/:id"><EventDetails /></PageWrapper>
            </ProtectedRoute>
          }/>
          <Route path="/bookings" element={
            <ProtectedRoute>
              <PageWrapper path="/bookings">
                {!isAdmin ? <Bookings /> : <Navigate to="/events" />}
              </PageWrapper>
            </ProtectedRoute>
          }/>
          <Route path="/profile" element={
            <ProtectedRoute>
              <PageWrapper path="/profile">
                {!isAdmin ? <Profile /> : <Navigate to="/events" />}
              </PageWrapper>
            </ProtectedRoute>
          }/>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <PageWrapper path="/dashboard"><UserDashboard /></PageWrapper>
            </ProtectedRoute>
          }/>

          {/* ── ADMIN ── */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <PageWrapper path="/admin/dashboard">
                {isAdmin ? <AdminDashboard /> : <Navigate to="/events" />}
              </PageWrapper>
            </ProtectedRoute>
          }/>
          <Route path="/admin/revenue" element={
            <ProtectedRoute>
              <PageWrapper path="/admin/revenue"><AdminRevenue /></PageWrapper>
            </ProtectedRoute>
          }/>
          <Route path="/create-event" element={
            <ProtectedRoute>
              <PageWrapper path="/create-event">
                {isAdmin ? <CreateEvent /> : <Navigate to="/events" />}
              </PageWrapper>
            </ProtectedRoute>
          }/>
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <PageWrapper path="/admin/users">
                {isAdmin ? <AdminUsers /> : <Navigate to="/events" />}
              </PageWrapper>
            </ProtectedRoute>
          }/>

          {/* ── PAYMENTS ── */}
          <Route path="/payment-success" element={<PaymentSuccess />}/>
          <Route path="/payment-cancel"  element={<PaymentCancel />}/>

          {/* ── FALLBACK ── */}
          <Route path="*" element={<Navigate to="/" replace />}/>

        </Routes>
      </AnimatePresence>
    </TransitionCtx.Provider>
  );
}

/* ── App root ── */
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <BrowserRouter>
      {isLoggedIn && <Navbar />}
      <AnimatedRoutes setIsLoggedIn={setIsLoggedIn} />
    </BrowserRouter>
  );
}