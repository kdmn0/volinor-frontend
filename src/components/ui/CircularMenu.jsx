/**
 * CircularMenu.jsx
 * Ekranın sol tarafında yer alan dairesel tasarımlı seçim menüsüdür.
 * 3D model üzerindeki parçaların (Modelleme, Simülasyon vb.) seçilmesini 
 * ve bu seçimlerin global state'e (store) gönderilmesini sağlar.
 */
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export const CircularMenu = ({ isNavOpen, setIsNavOpen, menuItems, selectedPart, setSelectedPart }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // İlk yüklemede çalıştır
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startAngle = -25;
  const endAngle = 25;
  const radius = 400;
  const circleSize = 800;
  const leftOffset = -550;

  return (
    <>
      {/* Masaüstü Dairesel Menü Arka Plan Çizgisi */}
      {!isMobile && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-opacity duration-500 ${isNavOpen ? "opacity-20" : "opacity-100"}`}
          style={{ left: `${leftOffset}px`, width: `${circleSize}px`, height: `${circleSize}px` }}>
          <div className="w-full h-full rounded-full border-[1px] border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)]" />
        </div>
      )}

      {/* Menü Elemanları */}
      <AnimatePresence>
        {!isNavOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={isMobile 
              ? "absolute left-6 top-1/2 -translate-y-1/2 z-20 pointer-events-auto flex flex-col gap-8" 
              : "absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none"}
            style={isMobile 
              ? {} 
              : { left: `${leftOffset}px`, width: `${circleSize}px`, height: `${circleSize}px` }}>
            
            {/* Mobilde Menü Öğelerini Bağlayan İnce Timeline Çizgisi */}
            {isMobile && (
              <div className="absolute left-[22px] top-4 bottom-4 w-[1px] bg-white/10 z-0" />
            )}

            {menuItems.map((item, index) => {
              const isSelected = selectedPart === item.id;

              if (isMobile) {
                // MOBİL TASARIM (Timeline / Stepper Görünümü)
                return (
                  <div
                    key={item.id}
                    className="relative flex items-center cursor-pointer group min-h-[44px] z-10"
                    onClick={() => setSelectedPart(isSelected ? null : item.id)}>
                    
                    {/* Düğüm (Node) */}
                    <div className="relative flex items-center justify-center min-w-[44px] min-h-[44px]">
                      {/* Seçili Düğümdeki Parlak Dikey Çizgi */}
                      <div
                        className={`absolute w-[2px] h-14 bg-gradient-to-b from-transparent via-[#00e5ff] to-transparent transition-opacity duration-300 ${isSelected ? "opacity-100 shadow-[0_0_10px_#00e5ff]" : "opacity-0"}`}
                      />
                      {/* Dış Halka */}
                      <div
                        className={`w-10 h-10 rounded-full border-[1px] transition-all duration-300 bg-[#020813] ${isSelected ? "border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.3)] scale-110" : "border-white/20 group-hover:border-white/50 scale-90"}`}
                      />
                      {/* İç Nokta */}
                      <div
                        className={`absolute rounded-full transition-all duration-300 ${isSelected ? "w-3 h-3 bg-white shadow-[0_0_15px_#00e5ff,0_0_30px_#00e5ff]" : "w-1.5 h-1.5 bg-white/60 group-hover:bg-white/90 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"}`}
                      />
                    </div>

                    {/* Metinler (Sağ Tarafta) */}
                    <div className="flex flex-col items-start ml-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-semibold tracking-[0.15em] transition-all duration-300 ${isSelected ? "text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" : "text-white/70 group-hover:text-white"}`}>
                        {item.label}
                      </div>
                      <div
                        className={`text-[9px] font-medium tracking-[0.1em] mt-1 transition-all duration-300 ${isSelected ? "text-white/70" : "text-white/40 group-hover:text-white/60"}`}>
                        {item.subLabel}
                      </div>
                    </div>
                  </div>
                );
              }

              // MASAÜSTÜ TASARIM (Dairesel)
              const totalItems = menuItems.length;
              const angleDeg = startAngle + (endAngle - startAngle) * (index / (totalItems - 1));
              const angleRad = (angleDeg * Math.PI) / 180;
              const centerOffset = circleSize / 2;
              const x = centerOffset + radius * Math.cos(angleRad);
              const y = centerOffset + radius * Math.sin(angleRad);

              return (
                <div
                  key={item.id}
                  className="absolute flex items-center pointer-events-auto cursor-pointer group min-h-[44px]"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: "translate(-100%, -50%)",
                  }}
                  onClick={() => setSelectedPart(isSelected ? null : item.id)}>
                  
                  {/* Masaüstü Sol Aktif Çizgi */}
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-20">
                    <div 
                      className={`w-[3px] rounded-full transition-all duration-300 ${isSelected ? "h-20 bg-[#00e5ff] shadow-[0_0_15px_#00e5ff]" : "h-0 bg-[#00e5ff]/50 group-hover:h-12 group-hover:bg-[#00e5ff] group-hover:shadow-[0_0_10px_#00e5ff]"}`}
                    />
                  </div>

                  <div className="flex flex-col items-start mr-4 w-32 whitespace-nowrap">
                    <div className={`text-sm font-semibold tracking-[0.15em] transition-all duration-300 ${isSelected ? "text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" : "text-white/70 group-hover:text-white"}`}>
                      {item.label}
                    </div>
                    <div className={`text-[9px] font-medium tracking-[0.1em] mt-1 transition-all duration-300 ${isSelected ? "text-white/70" : "text-white/40 group-hover:text-white/60"}`}>
                      {item.subLabel}
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center translate-x-1/2 min-w-[44px] min-h-[44px]">
                    <div className={`absolute w-[2px] h-16 bg-gradient-to-b from-transparent via-[#00e5ff] to-transparent transition-opacity duration-300 ${isSelected ? "opacity-100 shadow-[0_0_10px_#00e5ff]" : "opacity-0"}`} />
                    <div className={`w-10 h-10 rounded-full border-[1px] transition-all duration-300 bg-[#020813] ${isSelected ? "border-[#00e5ff] bg-[#00e5ff]/10 shadow-[0_0_15px_rgba(0,229,255,0.3)] scale-110" : "border-white/20 group-hover:border-white/50 group-hover:bg-white/5 scale-90"}`} />
                    <div className={`absolute rounded-full transition-all duration-300 ${isSelected ? "w-3 h-3 bg-white shadow-[0_0_15px_#00e5ff,0_0_30px_#00e5ff]" : "w-1.5 h-1.5 bg-white/60 group-hover:bg-white/90 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]"}`} />
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menü Açma/Kapama Butonu */}
      <div
        className="absolute z-50 pointer-events-auto cursor-pointer flex flex-col justify-center items-center gap-[6px] group w-12 h-12 min-w-[44px] min-h-[44px]"
        style={
          isMobile
            ? { right: "1rem", top: "1rem" }
            : { left: "250px", top: "50%", transform: "translate(-50%, -50%)" }
        }
        onClick={() => setIsNavOpen(!isNavOpen)}>
        <div className={`w-6 h-[1px] bg-white transition-all duration-300 origin-center ${isNavOpen ? "rotate-45 translate-y-[7px]" : "group-hover:w-8 group-hover:bg-white"}`} />
        <div className={`w-6 h-[1px] bg-white transition-all duration-300 ${isNavOpen ? "opacity-0" : "group-hover:w-5 group-hover:bg-white"}`} />
        <div className={`w-6 h-[1px] bg-white transition-all duration-300 origin-center ${isNavOpen ? "-rotate-45 -translate-y-[7px]" : "group-hover:w-8 group-hover:bg-white"}`} />

        <div className={`absolute right-full mr-2 whitespace-nowrap text-[10px] font-medium tracking-[0.3em] transition-all duration-300 ${isNavOpen ? "text-white/0 -translate-x-2" : "text-white/50 group-hover:text-white translate-x-0"}`}>
          MENÜ
        </div>
      </div>
    </>
  );
};
