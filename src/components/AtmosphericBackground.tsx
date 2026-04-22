import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function AtmosphericBackground() {
  const [orbs, setOrbs] = useState<{ id: number, x: number, y: number, size: number, color: string }[]>([]);

  useEffect(() => {
    const colors = ["#D4AF37", "#AEC6CF", "#7B68EE", "#F0F8FF"];
    setOrbs(Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 200 + Math.random() * 400,
      color: colors[i % colors.length]
    })));
  }, []);

  return (
    <div className="atmospheric-bg">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="glow-orb"
          initial={{ x: `${orb.x}%`, y: `${orb.y}%` }}
          animate={{
            x: [`${orb.x}%`, `${(orb.x + 20) % 100}%`, `${orb.x}%`],
            y: [`${orb.y}%`, `${(orb.y + 15) % 100}%`, `${orb.y}%`],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: orb.size,
            height: orb.size,
            backgroundColor: orb.color,
            left: "-10%",
            top: "-10%",
          }}
        />
      ))}
    </div>
  );
}
