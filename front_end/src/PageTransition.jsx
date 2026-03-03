import { motion, AnimatePresence } from "framer-motion";
import { createContext, useContext, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ── Curtain context — lets any component call go('/path') ──
export const TransitionCtx = createContext({ go: () => {} });
export const useNav = () => useContext(TransitionCtx);

// ── 8-strip green wipe curtain ──
const STRIPS = 8;

export function WipeCurtain({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", pointerEvents: "none",
        }}>
          {[...Array(STRIPS)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{
                scaleY: 1,
                transition: {
                  duration: 0.42,
                  ease: [0.76, 0, 0.24, 1],
                  delay: i * 0.035,
                }
              }}
              exit={{
                scaleY: 0,
                transition: {
                  duration: 0.38,
                  ease: [0.76, 0, 0.24, 1],
                  delay: (STRIPS - 1 - i) * 0.03,
                }
              }}
              style={{
                flex: 1,
                background: "#00c853",
                transformOrigin: isVisible ? "bottom" : "top",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// ── Hook: curtain-aware navigation ──
export function useTransitionNavigate() {
  const navigate = useNavigate();
  const [curtain, setCurtain] = useState(false);
  const timer = useRef();

  const go = useCallback((to) => {
    setCurtain(true);
    clearTimeout(timer.current);
    // wait for curtain to fully cover (~480ms), then swap route
    timer.current = setTimeout(() => {
      navigate(to);
      setTimeout(() => setCurtain(false), 80);
    }, 480);
  }, [navigate]);

  return { go, curtain };
}

// ── Page motion variants ──
export const publicVariants = {
  initial:  { opacity: 0, y: 24 },
  animate:  { opacity: 1, y: 0,  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 } },
  exit:     { opacity: 0, y: -16, transition: { duration: 0.28, ease: [0.76, 0, 0.24, 1] } },
};

export const appVariants = {
  initial:  { opacity: 0, y: 10 },
  animate:  { opacity: 1, y: 0,  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.04 } },
  exit:     { opacity: 0,        transition: { duration: 0.18 } },
};