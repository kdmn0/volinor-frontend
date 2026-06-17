import { motion, AnimatePresence } from "motion/react";

const CrosshairIcon = () => (
  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="5" stroke="#00e5ff" strokeWidth="1" opacity="0.8" />
    <line x1="14" y1="2" x2="14" y2="8" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
    <line x1="14" y1="20" x2="14" y2="26" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
    <line x1="2" y1="14" x2="8" y2="14" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
    <line x1="20" y1="14" x2="26" y2="14" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
    <circle cx="14" cy="14" r="1.5" fill="#00e5ff" />
  </svg>
);

export const AnalysisOverlay = ({ visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="analysis-overlay"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            border: "1px solid rgba(0, 229, 255, 0.15)",
            borderRadius: "12px",
            padding: "14px 16px 12px",
            marginBottom: "10px",
            background: "rgba(0, 229, 255, 0.04)",
          }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <CrosshairIcon />
            <div>
              <div
                className="font-display font-semibold tracking-[0.18em]"
                style={{ fontSize: "11px", color: "#00e5ff" }}>
                SİSTEM ANALİZE HAZIRLANIYOR
              </div>
              <div
                className="font-sans"
                style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: "2px", letterSpacing: "0.05em" }}>
                STRUCTURAL ANALYSIS MODULE — STANDBY
              </div>
            </div>
          </div>

          {/* Description */}
          <p
            className="font-sans"
            style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: "12px" }}>
            Yeni nesil yapısal model ve analiz verileri bekleniyor. Exploded view modu hazır olduğunda otomatik aktive edilecektir.
          </p>

          {/* Scan line */}
          <div style={{ position: "relative", height: "1px", background: "rgba(0,229,255,0.08)", borderRadius: "1px", overflow: "hidden" }}>
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
              style={{
                position: "absolute",
                inset: 0,
                width: "40%",
                background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.5), transparent)",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
