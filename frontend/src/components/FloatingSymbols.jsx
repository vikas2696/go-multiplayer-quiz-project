import React from "react";
import { motion } from "framer-motion";
import { FlaskConical, Atom, Rocket, Microscope, Brain, Telescope } from "lucide-react";

const icons = [FlaskConical, Atom, Rocket, Microscope, Brain, Telescope];

const generateFloatingIcon = (Icon, index) => {
  const size = 24 + Math.floor(Math.random() * 20); // random size between 24-44
  const top = Math.random() * 90; // random top position %
  const left = Math.random() * 90; // random left position %
  const duration = 20 + Math.random() * 10; // random float speed

  return (
    <motion.div
      key={index}
      initial={{ y: 0 }}
      animate={{ y: [0, -20, 0] }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        top: `${top}%`,
        left: `${left}%`,
        zIndex: 0,
        opacity: 0.5,
      }}
    >
      <Icon size={size} color="#ffffff44" />
    </motion.div>
  );
};

const FloatingSymbols = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        background: "radial-gradient(ellipse at bottom, #0d1b2a 0%, #000 100%)",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {Array.from({ length: 25 }).map((_, i) => {
        const Icon = icons[i % icons.length];
        return generateFloatingIcon(Icon, i);
      })}
    </div>
  );
};

export default FloatingSymbols;
