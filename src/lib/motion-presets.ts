import { Variants } from "framer-motion";

export const springConfig = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  mass: 1,
};

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { ...springConfig, duration: 0.6 } 
  },
};

export const revealUpStaggered: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { ...springConfig, duration: 0.6, staggerChildren: 0.1 } 
  },
};

export const hoverSoft = {
  scale: 1.02,
  transition: { ...springConfig, stiffness: 400 },
};

export const pressSoft = {
  scale: 0.97,
  transition: { ...springConfig, stiffness: 400 },
};

export const glassFocus = {
  boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
};
