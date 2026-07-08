import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

/* ────────────────────────────────────────────
   Animasyonlu Sayaç (Counter-up)
   ──────────────────────────────────────────── */
const AnimatedNumber = ({
  target,
  duration = 2,
  delay = 0,
  suffix = "",
  decimals = 0,
}) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now) => {
        const elapsed = (now - start) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setValue(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return (
    <>
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value)}
      {suffix}
    </>
  );
};

/* ────────────────────────────────────────────
   Mini Thumbnail Grid (Hedef Tespiti paneli)
   ──────────────────────────────────────────── */
const ThumbnailGrid = () => (
  <div className="mb-3">
    <div
      className="relative w-full aspect-video rounded-md overflow-hidden border border-white/10"
      style={{ background: "linear-gradient(135deg, #111 0%, #1a1a2e 100%)" }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 45">
        {/* Detection bounding box */}
        <rect
          x="18"
          y="8"
          width="44"
          height="30"
          fill="none"
          stroke="#ffb800"
          strokeWidth="1"
          opacity="0.7"
          strokeDasharray="3 2"
        />
        {/* Corner brackets */}
        <path
          d="M18,14 L18,8 L24,8"
          stroke="#ffb800"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M62,14 L62,8 L56,8"
          stroke="#ffb800"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M18,32 L18,38 L24,38"
          stroke="#ffb800"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M62,32 L62,38 L56,38"
          stroke="#ffb800"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Target crosshair */}
        <line
          x1="40"
          y1="16"
          x2="40"
          y2="20"
          stroke="#ffb800"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <line
          x1="40"
          y1="26"
          x2="40"
          y2="30"
          stroke="#ffb800"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <line
          x1="34"
          y1="23"
          x2="38"
          y2="23"
          stroke="#ffb800"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <line
          x1="42"
          y1="23"
          x2="46"
          y2="23"
          stroke="#ffb800"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <circle cx="40" cy="23" r="1.5" fill="#ffb800" opacity="0.9" />
      </svg>
      <div className="absolute bottom-1 left-1.5 text-[7px] text-[#ffb800] font-mono tracking-wider opacity-80">
        TGT-1
      </div>
    </div>
  </div>
);

/* ────────────────────────────────────────────
   Rota Grafiği (Uçuş Rotası paneli)
   ──────────────────────────────────────────── */
const RouteGraph = () => (
  <svg
    viewBox="0 0 200 80"
    className="w-full h-auto mb-3"
    style={{ filter: "drop-shadow(0 0 6px rgba(255,184,0,0.3))" }}>
    {/* Grid lines */}
    {[0, 1, 2, 3].map((i) => (
      <line
        key={i}
        x1="10"
        y1={15 + i * 18}
        x2="190"
        y2={15 + i * 18}
        stroke="white"
        strokeWidth="0.3"
        opacity="0.08"
      />
    ))}

    {/* Route path */}
    <motion.path
      d="M15,60 Q40,55 55,35 T95,25 Q115,22 130,40 Q145,55 160,30 L185,28"
      fill="none"
      stroke="url(#routeGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 2.2, duration: 2, ease: "easeInOut" }}
    />

    {/* Gradient definition */}
    <defs>
      <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffb800" stopOpacity="0.4" />
        <stop offset="50%" stopColor="#ffb800" stopOpacity="1" />
        <stop offset="100%" stopColor="#00ccff" stopOpacity="0.8" />
      </linearGradient>
    </defs>

    {/* Waypoints */}
    {[
      { x: 15, y: 60 },
      { x: 55, y: 35 },
      { x: 95, y: 25 },
      { x: 130, y: 40 },
      { x: 160, y: 30 },
      { x: 185, y: 28 },
    ].map((pt, i) => (
      <g key={i}>
        <motion.circle
          cx={pt.x}
          cy={pt.y}
          r="4"
          fill="none"
          stroke={i === 0 ? "#ffb800" : i === 5 ? "#00ccff" : "#ffb800"}
          strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.2 + i * 0.3 }}
        />
        <motion.circle
          cx={pt.x}
          cy={pt.y}
          r="2"
          fill={i === 0 ? "#ffb800" : i === 5 ? "#00ccff" : "#fff"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.4 + i * 0.3 }}
        />
      </g>
    ))}
  </svg>
);

/* ────────────────────────────────────────────
   Risk Grafiği (dalga/sinüs)
   ──────────────────────────────────────────── */
const RiskGraph = () => (
  <svg
    viewBox="0 0 200 70"
    className="w-full h-auto mb-2"
    style={{ filter: "drop-shadow(0 0 8px rgba(255,0,68,0.25))" }}>
    {/* Background fill */}
    <defs>
      <linearGradient id="riskFill" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ff0044" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#ff0044" stopOpacity="0.02" />
      </linearGradient>
    </defs>

    {/* Grid */}
    {[0, 1, 2].map((i) => (
      <line
        key={i}
        x1="5"
        y1={15 + i * 20}
        x2="195"
        y2={15 + i * 20}
        stroke="white"
        strokeWidth="0.3"
        opacity="0.06"
      />
    ))}

    {/* Filled area */}
    <motion.path
      d="M5,55 Q25,50 40,30 Q55,10 70,25 Q85,40 100,20 Q115,5 130,30 Q145,50 160,35 Q175,20 195,28 L195,65 L5,65 Z"
      fill="url(#riskFill)"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 1 }}
    />

    {/* Line */}
    <motion.path
      d="M5,55 Q25,50 40,30 Q55,10 70,25 Q85,40 100,20 Q115,5 130,30 Q145,50 160,35 Q175,20 195,28"
      fill="none"
      stroke="#ff4466"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 2.5, duration: 1.8, ease: "easeInOut" }}
    />
  </svg>
);

/* ────────────────────────────────────────────
   Panel wrapper (glassmorphism)
   ──────────────────────────────────────────── */
const HUDPanel = ({
  children,
  className = "",
  delay = 0,
  fromX = 0,
  fromY = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, x: fromX, y: fromY }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    transition={{ delay, duration: 0.7, ease: "easeOut" }}
    className={`relative bg-[#1c1c1e]/[0.8] border border-white/[0.08] rounded-2xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] pointer-events-auto ${className}`}>
    {/* Sağ Üst Köşe Gri Vurgu */}
    <div className="absolute -top-[1px] -right-[1px] w-8 h-8 border-t-[2px] border-r-[2px] border-gray-400/70 rounded-tr-2xl pointer-events-none" />

    {/* Sol Alt Köşe Gri Vurgu */}
    <div className="absolute -bottom-[1px] -left-[1px] w-8 h-8 border-b-[2px] border-l-[2px] border-gray-400/70 rounded-bl-2xl pointer-events-none" />

    {children}
  </motion.div>
);

/* ────────────────────────────────────────────
   Panel başlık
   ──────────────────────────────────────────── */
const PanelTitle = ({ title, subtitle, color = "#ffb800" }) => (
  <div className="mb-3">
    <h3
      className="font-display font-bold text-[13px] tracking-[0.18em] uppercase"
      style={{ color }}>
      {title}
    </h3>
    <p className="text-white/40 text-[10px] tracking-[0.1em] mt-0.5 font-medium uppercase">
      {subtitle}
    </p>
  </div>
);

/* ════════════════════════════════════════════
   ANA OVERLAY BİLEŞENİ
   ════════════════════════════════════════════ */
export const AIOverlay = ({ onClose }) => {
  const { t } = useTranslation();

  const objectives = [
    {
      icon: "⬡",
      label: t("ai.objective_1"),
      priority: t("ai.priority_high"),
      color: "#ff4466",
    },
    {
      icon: "◎",
      label: t("ai.objective_2"),
      priority: t("ai.priority_high"),
      color: "#ff4466",
    },
    {
      icon: "○",
      label: t("ai.objective_4"),
      priority: t("ai.priority_low"),
      color: "#00ffaa",
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden font-sans">
      {/* Arka plan App.jsx tarafına taşındı (3D modelin arkasında kalması için) */}

      {/* ── Tam Ekran SVG Taktiksel Overlay ── */}
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 1.0 }}
        className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-[1]"
        preserveAspectRatio="none"
        viewBox="0 0 1920 1080">
        <defs>
          {/* Rota gradient */}
          <linearGradient id="aiRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffb800" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#ffb800" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00ccff" stopOpacity="0.7" />
          </linearGradient>
          {/* Waypoint glow */}
          <radialGradient id="wpGlow">
            <stop offset="0%" stopColor="#ffb800" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffb800" stopOpacity="0" />
          </radialGradient>
          {/* Hedef kırmızı glow */}
          <radialGradient id="targetGlow">
            <stop offset="0%" stopColor="#ff0044" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff0044" stopOpacity="0" />
          </radialGradient>
          {/* Scan circle animation */}
          <style>{`
            @keyframes scan-pulse {
              0% { r: 8; opacity: 0.6; }
              100% { r: 28; opacity: 0; }
            }
            @keyframes scan-pulse-lg {
              0% { r: 12; opacity: 0.4; }
              100% { r: 45; opacity: 0; }
            }
            .scan-ring { animation: scan-pulse 2.5s ease-out infinite; }
            .scan-ring-lg { animation: scan-pulse-lg 3s ease-out infinite; }
            .scan-ring-delay { animation: scan-pulse 2.5s ease-out 1s infinite; }
          `}</style>
        </defs>

        {/* ── Taktiksel grid çizgileri ── */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`hg${i}`}
            x1="300"
            y1={300 + i * 120}
            x2="1620"
            y2={300 + i * 120}
            stroke="#ffb800"
            strokeWidth="0.4"
            opacity="0.06"
          />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={`vg${i}`}
            x1={400 + i * 220}
            y1="250"
            x2={400 + i * 220}
            y2="850"
            stroke="#ffb800"
            strokeWidth="0.4"
            opacity="0.06"
          />
        ))}

        {/* ── Ana uçuş rotası (tam ekran çapraz çizgi) ── */}
        <motion.path
          d="M380,300 Q480,340 560,400 Q640,460 720,480 Q820,505 900,540 Q1000,580 1080,560 Q1180,535 1260,600 Q1340,660 1440,640 L1540,670"
          fill="none"
          stroke="url(#aiRouteGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 2.5, ease: "easeInOut" }}
        />
        {/* Rota gölge çizgisi */}
        <motion.path
          d="M380,300 Q480,340 560,400 Q640,460 720,480 Q820,505 900,540 Q1000,580 1080,560 Q1180,535 1260,600 Q1340,660 1440,640 L1540,670"
          fill="none"
          stroke="#ffb800"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.06"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 2.5, ease: "easeInOut" }}
        />

        {/* ── Waypoint noktaları (rota üzerinde) ── */}
        {[
          { x: 380, y: 300, label: "WP-1", type: "start" },
          { x: 560, y: 400, label: "WP-2", type: "wp" },
          { x: 720, y: 480, label: "WP-3", type: "wp" },
          { x: 900, y: 540, label: "WP-4", type: "target" },
          { x: 1080, y: 560, label: "WP-5", type: "wp" },
          { x: 1260, y: 600, label: "WP-6", type: "wp" },
          { x: 1540, y: 670, label: "WP-7", type: "end" },
        ].map((wp, i) => (
          <motion.g
            key={`wp-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8 + i * 0.25 }}>
            {/* Glow halo */}
            <circle
              cx={wp.x}
              cy={wp.y}
              r="20"
              fill={wp.type === "target" ? "url(#targetGlow)" : "url(#wpGlow)"}
            />

            {/* Scan pulse ring */}
            {(wp.type === "start" ||
              wp.type === "target" ||
              wp.type === "end") && (
              <>
                <circle
                  cx={wp.x}
                  cy={wp.y}
                  className={
                    wp.type === "target" ? "scan-ring-lg" : "scan-ring"
                  }
                  fill="none"
                  stroke={wp.type === "target" ? "#ff0044" : "#ffb800"}
                  strokeWidth="1"
                />
                <circle
                  cx={wp.x}
                  cy={wp.y}
                  className="scan-ring-delay"
                  fill="none"
                  stroke={wp.type === "target" ? "#ff0044" : "#ffb800"}
                  strokeWidth="0.6"
                />
              </>
            )}

            {/* Dış halka */}
            <circle
              cx={wp.x}
              cy={wp.y}
              r={
                wp.type === "target"
                  ? 12
                  : wp.type === "start" || wp.type === "end"
                    ? 10
                    : 7
              }
              fill="none"
              stroke={
                wp.type === "target"
                  ? "#ff0044"
                  : wp.type === "end"
                    ? "#00ccff"
                    : "#ffb800"
              }
              strokeWidth={wp.type === "target" ? 1.5 : 1}
              opacity="0.7"
            />

            {/* İç nokta */}
            <circle
              cx={wp.x}
              cy={wp.y}
              r={wp.type === "target" ? 4 : 3}
              fill={
                wp.type === "target"
                  ? "#ff0044"
                  : wp.type === "end"
                    ? "#00ccff"
                    : "#fff"
              }
              opacity="0.9"
            />

            {/* Hedef crosshair (sadece target) */}
            {wp.type === "target" && (
              <>
                <line
                  x1={wp.x - 20}
                  y1={wp.y}
                  x2={wp.x - 8}
                  y2={wp.y}
                  stroke="#ff0044"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <line
                  x1={wp.x + 8}
                  y1={wp.y}
                  x2={wp.x + 20}
                  y2={wp.y}
                  stroke="#ff0044"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <line
                  x1={wp.x}
                  y1={wp.y - 20}
                  x2={wp.x}
                  y2={wp.y - 8}
                  stroke="#ff0044"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <line
                  x1={wp.x}
                  y1={wp.y + 8}
                  x2={wp.x}
                  y2={wp.y + 20}
                  stroke="#ff0044"
                  strokeWidth="1"
                  opacity="0.6"
                />
              </>
            )}

            {/* Etiket */}
            <text
              x={wp.x}
              y={wp.y - (wp.type === "target" ? 22 : 16)}
              textAnchor="middle"
              fill={wp.type === "target" ? "#ff4466" : "#ffb800"}
              fontSize="10"
              fontFamily="monospace"
              letterSpacing="2"
              opacity="0.8">
              {wp.label}
            </text>
          </motion.g>
        ))}

        {/* ── Panellerden merkeze bağlantı çizgileri ── */}
        {/* Sol üst panel → WP-1 */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}>
          <line
            x1="490"
            y1="340"
            x2="500"
            y2="340"
            stroke="#ffb800"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <line
            x1="500"
            y1="340"
            x2="380"
            y2="300"
            stroke="#ffb800"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="4 3"
          />
          <circle cx="490" cy="340" r="2.5" fill="#ffb800" opacity="0.5" />
        </motion.g>

        {/* Sağ üst panel → WP-5 */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 0.6 }}>
          <line
            x1="1360"
            y1="280"
            x2="1350"
            y2="280"
            stroke="#ffb800"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <line
            x1="1350"
            y1="280"
            x2="1080"
            y2="560"
            stroke="#ffb800"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="4 3"
          />
          <circle cx="1360" cy="280" r="2.5" fill="#ffb800" opacity="0.5" />
        </motion.g>

        {/* Sol alt panel → WP-3 */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.6 }}>
          <line
            x1="430"
            y1="750"
            x2="440"
            y2="750"
            stroke="#ffb800"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <line
            x1="440"
            y1="750"
            x2="720"
            y2="480"
            stroke="#ffb800"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="4 3"
          />
          <circle cx="430" cy="750" r="2.5" fill="#ffb800" opacity="0.5" />
        </motion.g>

        {/* Sağ alt panel → WP-6 */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.6 }}>
          <line
            x1="1340"
            y1="780"
            x2="1330"
            y2="780"
            stroke="#ffb800"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <line
            x1="1330"
            y1="780"
            x2="1260"
            y2="600"
            stroke="#ffb800"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="4 3"
          />
          <circle cx="1340" cy="780" r="2.5" fill="#ffb800" opacity="0.5" />
        </motion.g>

        {/* ── Ekstra taktiksel detaylar ── */}
        {/* Tarama alanı dairesi (merkez) */}
        <circle
          cx="900"
          cy="540"
          r="120"
          fill="none"
          stroke="#ffb800"
          strokeWidth="0.5"
          opacity="0.12"
          strokeDasharray="8 6"
        />
        <circle
          cx="900"
          cy="540"
          r="200"
          fill="none"
          stroke="#ffb800"
          strokeWidth="0.3"
          opacity="0.07"
          strokeDasharray="12 8"
        />

        {/* Küçük taktiksel noktalar (ekstra POI'ler) */}
        {[
          { x: 650, y: 550 },
          { x: 800, y: 380 },
          { x: 1150, y: 350 },
          { x: 1000, y: 520 },
          { x: 480, y: 600 },
        ].map((pt, i) => (
          <motion.g
            key={`poi-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2.5 + i * 0.15 }}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r="3"
              fill="none"
              stroke="#ffb800"
              strokeWidth="0.6"
            />
            <circle cx={pt.x} cy={pt.y} r="1" fill="#ffb800" />
          </motion.g>
        ))}
      </motion.svg>

      {/* ══════════════════════════════════════
         4 HUD PANELİ
         ══════════════════════════════════════ */}

      {/* ── SOL TARAF MENÜLERİ ── */}
      <div className="absolute top-[3%] bottom-[20%] left-[4%] md:left-[5%] w-[230px] z-[2] hidden md:flex flex-col justify-between pointer-events-none">
        
        {/* 1. Hedef Tespiti */}
        <div className="pointer-events-auto">
          <HUDPanel delay={1.5} fromX={-30}>
            <PanelTitle
              title={t("ai.target_detection")}
              subtitle={t("ai.image_analysis")}
            />
            <ThumbnailGrid />
          </HUDPanel>
        </div>

        {/* 2. Görev Hedefleri */}
        <div className="pointer-events-auto">
          <HUDPanel delay={1.6} fromX={-30}>
            <PanelTitle
              title={t("ai.mission_objectives")}
              subtitle={t("ai.ai_prioritization")}
            />
            <div className="flex flex-col gap-2.5">
              {objectives.map((obj, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2 + i * 0.15 }}
                  className="flex items-center gap-3">
                  <span
                    className="text-[14px] opacity-60"
                    style={{ color: obj.color }}>
                    {obj.icon}
                  </span>
                  <span className="text-white/80 text-[11px] font-medium tracking-wider flex-1">
                    {obj.label}
                  </span>
                  <span
                    className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border"
                    style={{
                      color: obj.color,
                      borderColor: `${obj.color}40`,
                      backgroundColor: `${obj.color}10`,
                    }}>
                    {obj.priority}
                  </span>
                </motion.div>
              ))}
            </div>
          </HUDPanel>
        </div>

        {/* 3. Uçuş Rotası */}
        <div className="pointer-events-auto">
          <HUDPanel delay={1.7} fromX={-30}>
            <PanelTitle
              title={t("ai.route_planning")}
              subtitle={t("ai.optimal_route")}
            />
            <RouteGraph />
          </HUDPanel>
        </div>

      </div>

      {/* ── SAĞ ORTA: Ozvia ── */}
      <div className="absolute top-1/2 -translate-y-1/2 right-[4%] md:right-[5%] w-[240px] z-[2] hidden md:block">
        <HUDPanel delay={1.8} fromY={20}>
          <PanelTitle
            title="YAPAY ZEKA"
            color="#ffffff"
          />
          <div className="flex flex-col gap-6 mt-3">
            <p className="text-white/60 text-[12px] leading-relaxed">
              Otonom sistemler ve akıllı platformlar için yapay zeka tabanlı algoritmalar geliştiriyoruz. Görüntü işleme, karar destek ve otonom kontrol gibi alanlarda yenilikçi çözümler üretiyoruz. Modern işletme ve kurumlar için geliştirdiğimiz YZ asistanı Ozvia ile destek sağlıyoruz.
            </p>
            <a
              href="https://ozviai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 w-full rounded-md border border-[#ffb800]/40 bg-black/40 hover:bg-[#ffb800]/10 text-[#ffb800] transition-all text-[12px] font-medium tracking-wider"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Ozvia'yı Dene
            </a>
          </div>
        </HUDPanel>
      </div>

      {/* ══════════════════════════════════════
         MOBİL GÖRÜNÜM (Basitleştirilmiş)
         ══════════════════════════════════════ */}
      <div className="md:hidden absolute inset-x-4 top-20 bottom-20 z-[2] pointer-events-auto overflow-y-auto flex flex-col gap-4">
        {/* Mobil başlık */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center">
          <h2 className="font-display font-bold text-[13px] tracking-[0.2em] text-[#ffb800]">
            AI DESTEKLİ GÖREV PLANLAMA
          </h2>
          <p className="text-white/30 text-[8px] tracking-[0.1em] mt-1">
            OTONOM MİSYON KONTROL SİSTEMİ
          </p>
        </motion.div>

        {/* Mobil kartlar */}
        <HUDPanel delay={1.2} fromY={15}>
          <PanelTitle title="HEDEF TESPİTİ" subtitle="AI GÖRÜNTÜ ANALİZİ" />
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-[10px]">OLASILIK:</span>
            <span className="text-[#ffb800] text-[13px] font-bold font-mono">
              %92
            </span>
          </div>
        </HUDPanel>

        <HUDPanel delay={1.4} fromY={15}>
          <PanelTitle title="GÖREV HEDEFLERİ" subtitle="AI ÖNCELİKLENDİRME" />
          <div className="flex flex-col gap-2">
            {objectives.map((obj, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[12px]" style={{ color: obj.color }}>
                  {obj.icon}
                </span>
                <span className="text-white/80 text-[11px] flex-1">
                  {obj.label}
                </span>
                <span
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded-full border"
                  style={{ color: obj.color, borderColor: `${obj.color}40` }}>
                  {obj.priority}
                </span>
              </div>
            ))}
          </div>
        </HUDPanel>

        <HUDPanel delay={1.6} fromY={15}>
          <PanelTitle title="UÇUŞ ROTASI" subtitle="ROTA HESAPLAMA" />
        </HUDPanel>

        <HUDPanel delay={1.8} fromY={15}>
          <PanelTitle
            title="YAPAY ZEKA"
            color="#ffffff"
          />
          <div className="flex flex-col gap-4 mt-2">
            <p className="text-white/60 text-[10px] leading-[1.6]">
              Otonom sistemler ve akıllı platformlar için yapay zeka tabanlı algoritmalar geliştiriyoruz. Görüntü işleme, karar destek ve otonom kontrol gibi alanlarda yenilikçi çözümler üretiyoruz. Modern işletme ve kurumlar için geliştirdiğimiz YZ asistanı Ozvia ile destek sağlıyoruz.
            </p>
            <a
              href="https://ozviai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 w-full rounded-md border border-[#ffb800]/40 bg-black/40 hover:bg-[#ffb800]/10 text-[#ffb800] transition-all text-[11px] font-medium tracking-wider"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Ozvia'yı Dene
            </a>
          </div>
        </HUDPanel>
      </div>

      {/* ── ANASAYFA Butonu ── */}
      {onClose && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto z-[3]">
          <button
            onClick={onClose}
            className="flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 font-display font-semibold tracking-widest text-xs border-white/20 text-white/80 bg-black/40 backdrop-blur-md hover:bg-white/10 hover:text-white hover:border-white/40">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            ANASAYFA
          </button>
        </motion.div>
      )}
    </div>
  );
};
