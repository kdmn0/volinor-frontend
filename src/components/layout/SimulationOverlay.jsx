import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export const SimulationOverlay = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden font-sans">
      {/* SVG Connecting Lines to Center */}
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
        style={{ filter: "drop-shadow(0px 0px 4px rgba(255, 184, 0, 0.6))" }}>
        {/* AERODİNAMİK Lines */}
        <line x1="35%" y1="18%" x2="37%" y2="18%" stroke="#ffb800" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="37%" y1="18%" x2="45%" y2="43%" stroke="#ffb800" strokeWidth="1.5" strokeOpacity="0.6" />
        <circle cx="45%" cy="43%" r="3" fill="#ffb800" />
        <circle cx="35%" cy="18%" r="3" fill="#ffb800" />

        {/* YAPISAL ANALİZ Lines */}
        <line x1="31%" y1="58%" x2="33%" y2="58%" stroke="#ffb800" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="33%" y1="58%" x2="40%" y2="68%" stroke="#ffb800" strokeWidth="1.5" strokeOpacity="0.6" />
        <circle cx="40%" cy="68%" r="3" fill="#ffb800" />
        <circle cx="31%" cy="58%" r="3" fill="#ffb800" />

        {/* TERMAL ANALİZ Lines */}
        <line x1="61%" y1="38%" x2="59%" y2="38%" stroke="#ffb800" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="59%" y1="38%" x2="56%" y2="27%" stroke="#ffb800" strokeWidth="1.5" strokeOpacity="0.6" />
        <circle cx="56%" cy="27%" r="3" fill="#ffb800" />
        <circle cx="61%" cy="38%" r="3" fill="#ffb800" />

        {/* MODAL ANALİZ Lines */}
        <line x1="59%" y1="83%" x2="57%" y2="83%" stroke="#ffb800" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="57%" y1="83%" x2="55%" y2="73%" stroke="#ffb800" strokeWidth="1.5" strokeOpacity="0.6" />
        <circle cx="55%" cy="73%" r="3" fill="#ffb800" />
        <circle cx="59%" cy="83%" r="3" fill="#ffb800" />
      </motion.svg>

      {/* Floating Labels */}
      {/* Top Left: Aerodinamik */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        className="hidden md:flex absolute top-[15%] left-[18%] md:left-[20%] max-w-[280px] items-center gap-5 pointer-events-auto">
        <div className="w-[60px] h-[60px] md:w-[68px] md:h-[68px] border border-white/10 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-md shrink-0 flex items-center justify-center shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffb800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <h3 className="text-white font-display font-bold text-[14px] md:text-[15px] tracking-wider uppercase">
            AERODİNAMİK
          </h3>
          <p className="text-white opacity-90 text-[11px] md:text-[12px] leading-relaxed mt-1.5">
            Hava akışı, sürükleme<br />kaldırma analizi
          </p>
        </div>
      </motion.div>

      {/* Bottom Left: Yapısal Analiz */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6 }}
        className="hidden md:flex absolute top-[53%] md:top-[55%] left-[12%] md:left-[14%] max-w-[280px] items-center gap-5 pointer-events-auto">
        <div className="w-[60px] h-[60px] md:w-[68px] md:h-[68px] border border-white/10 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-md shrink-0 flex items-center justify-center shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffb800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l8 14H4z" />
            <circle cx="12" cy="3" r="1.5" fill="#ffb800" />
            <circle cx="4" cy="17" r="1.5" fill="#ffb800" />
            <circle cx="20" cy="17" r="1.5" fill="#ffb800" />
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <h3 className="text-white font-display font-bold text-[14px] md:text-[15px] tracking-wider uppercase">
            YAPISAL ANALİZ
          </h3>
          <p className="text-white opacity-90 text-[11px] md:text-[12px] leading-relaxed mt-1.5">
            Gerilme, deformasyon<br />ve dayanım analizi
          </p>
        </div>
      </motion.div>

      {/* Top Right: Termal Analiz */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.7 }}
        className="hidden md:flex absolute top-[35%] right-[20%] md:right-[24%] max-w-[280px] items-center gap-5 pointer-events-auto">
        <div className="flex flex-col text-left">
          <h3 className="text-white font-display font-bold text-[14px] md:text-[15px] tracking-wider uppercase">
            TERMAL ANALİZ
          </h3>
          <p className="text-white opacity-90 text-[11px] md:text-[12px] leading-relaxed mt-1.5">
            Isı dağılımı ve<br />sıcaklık analizi
          </p>
        </div>
        <div className="w-[60px] h-[60px] md:w-[68px] md:h-[68px] border border-white/10 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-md shrink-0 flex items-center justify-center shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffb800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
            <path d="M12 7v5" />
          </svg>
        </div>
      </motion.div>

      {/* Bottom Right: Modal Analiz */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8 }}
        className="hidden md:flex absolute top-[80%] right-[22%] md:right-[26%] max-w-[280px] items-center gap-5 pointer-events-auto">
        <div className="flex flex-col text-left">
          <h3 className="text-white font-display font-bold text-[14px] md:text-[15px] tracking-wider uppercase">
            MODAL ANALİZ
          </h3>
          <p className="text-white opacity-90 text-[11px] md:text-[12px] leading-relaxed mt-1.5">
            Titreşim frekansları<br />ve modal davranış
          </p>
        </div>
        <div className="w-[60px] h-[60px] md:w-[68px] md:h-[68px] border border-white/10 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-md shrink-0 flex items-center justify-center shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffb800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
      </motion.div>

      {/* Right Side Info Cards */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.9 }}
        className="absolute top-1/2 -translate-y-1/2 right-6 hidden lg:flex flex-col gap-5 pointer-events-auto w-[260px]">
        {/* Simülasyon Card */}
        <div className="bg-[#050505]/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl">
          <h2 className="font-display text-base font-semibold text-white mb-3 tracking-[0.15em] uppercase">
            SİMÜLASYON
          </h2>
          <p className="text-gray-400 text-xs leading-[1.6]">
            Gerçeğe en yakın koşulları yansıtan senaryo tabanlı test altyapımız
            ile, tasarım performansını, üretim öncesinde test ediyoruz. Bu
            sayede riskleri erken aşamada tespit ediyor, geliştirme süreçlerini
            hızlandırıp maliyeti optimize sağlıyoruz.
          </p>
        </div>

        {/* Çalışma Alanlarımız Card */}
        <div className="bg-[#050505]/60 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-2xl">
          <h2 className="font-display text-xs font-semibold text-white mb-5 tracking-[0.1em] uppercase text-center opacity-90">
            ÇALIŞMA ALANLARIMIZ
          </h2>
          <div className="flex justify-between px-1">
            {/* Hava */}
            <div className="flex flex-col items-center gap-3">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffb800"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2 .5-3.5 2L14.5 9.5l-8.2-1.8c-1.5-.3-2.8.2-3.8 1.4-.4.4-.3 1 .1 1.4L6 14l-2.5 4.5c-.2.4-.1.9.2 1.2.3.3.8.4 1.2.2L9.5 17l3.5 3.5c.4.4 1 .5 1.4.1 1.2-1 1.7-2.3 1.4-3.8z" />
              </svg>
              <span className="text-[10px] text-gray-300 font-medium tracking-widest">
                HAVA
              </span>
            </div>
            {/* Kara */}
            <div className="flex flex-col items-center gap-3">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffb800"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M4 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
                <path d="M3 11h18v4H3z" />
                <circle cx="7" cy="16" r="2" />
                <circle cx="17" cy="16" r="2" />
              </svg>
              <span className="text-[10px] text-gray-300 font-medium tracking-widest">
                KARA
              </span>
            </div>
            {/* Deniz */}
            <div className="flex flex-col items-center gap-3">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffb800"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="5" r="3" />
                <line x1="12" y1="8" x2="12" y2="22" />
                <line x1="5" y1="12" x2="19" y2="12" />
                <path d="M5 12v3a7 7 0 0 0 14 0v-3" />
              </svg>
              <span className="text-[10px] text-gray-300 font-medium tracking-widest">
                DENİZ
              </span>
            </div>
            {/* Uzay */}
            <div className="flex flex-col items-center gap-3">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffb800"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
              <span className="text-[10px] text-gray-300 font-medium tracking-widest">
                UZAY
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ANASAYFA Butonu */}
      {onClose && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
          <button
            onClick={onClose}
            className="flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 font-display font-semibold tracking-widest text-xs border-white/20 text-white/80 bg-black/40 backdrop-blur-md hover:bg-white/10 hover:text-white hover:border-white/40">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
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
