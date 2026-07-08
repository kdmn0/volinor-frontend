/**
 * ConfigPanel.jsx
 * Ana kullanıcı arayüzü (UI) kapsayıcısıdır. Ekranda görünen tüm düğmeleri, menüleri
 * ve bilgi panellerini (SidebarMenu, CircularMenu, PageModal) bir araya getirerek
 * son kullanıcıya sunar.
 */
import { motion, AnimatePresence } from "motion/react";
import { useConfigStore } from "../../store/useConfigStore";
import { PART_OPTIONS } from "../../data/parts";
import { useState, useMemo } from "react";
import { SidebarMenu } from "./SidebarMenu";
import { CircularMenu } from "./CircularMenu";
import { PageModal } from "../modals/PageModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnalysisOverlay } from "../feedback/AnalysisOverlay";
import { useTranslation } from "react-i18next";
import { SimulationOverlay } from "./SimulationOverlay";

export const ConfigPanel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const selectedPart = useConfigStore((state) => state.selectedPart);
  const setSelectedPart = useConfigStore((state) => state.setSelectedPart);
  const activePage = useConfigStore((state) => state.activePage);
  const setActivePage = useConfigStore((state) => state.setActivePage);
  const selectedModel = useConfigStore((state) => state.selectedModel);
  const showUI = useConfigStore((state) => state.showUI);

  const isAnalysisMode = selectedPart === "subtitle1" && searchParams.get("mode") === "analiz";

  const toggleAnalysisMode = () => {
    if (isAnalysisMode) {
      setSearchParams({});
    } else {
      setSearchParams({ mode: "analiz" });
    }
  };

  const partData = selectedPart ? PART_OPTIONS[selectedPart] : null;

  const menuItems = useMemo(() => {
    return selectedModel === "bee"
      ? [
          { id: "subtitle1", url: "/modelleme", label: t("menu.modeling"), subLabel: t("menu.modeling_sub") },
          { id: "subtitle2", url: "/simulasyon", label: t("menu.simulation"), subLabel: t("menu.simulation_sub") },
          { id: "subtitle3", url: "/ileri-malzeme", label: t("menu.advanced_materials"), subLabel: t("menu.advanced_materials_sub") },
          { id: "subtitle4", url: "/yapay-zeka", label: t("menu.ai"), subLabel: t("menu.ai_sub") },
        ]
      : [
          { id: "subtitle5", url: "/", label: "5", subLabel: "" },
          { id: "subtitle6", url: "/", label: "6", subLabel: "" },
          { id: "subtitle7", url: "/", label: "7", subLabel: "" },
          { id: "subtitle8", url: "/", label: "8", subLabel: "" },
        ];
  }, [selectedModel, t]);

  return (
    <AnimatePresence>
      {showUI && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none z-10">
          {/* Dairesel Seçim Menüsü */}
          {selectedPart !== "subtitle2" && (
            <CircularMenu
              isNavOpen={isNavOpen}
              setIsNavOpen={(val) => {
                setIsNavOpen(val);
                if (!val) {
                  navigate("/");
                  setActivePage(null);
                }
              }}
              menuItems={menuItems}
              selectedPart={selectedPart}
              setSelectedPart={setSelectedPart}
            />
          )}

          {/* Sol Açılır Menü */}
          <SidebarMenu
            isNavOpen={isNavOpen}
            activePage={activePage}
            setActivePage={setActivePage}
          />

          {/* Sağ Seçili Eleman Bilgi Paneli */}
          <AnimatePresence>
            {selectedPart && partData && selectedPart !== "subtitle2" && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bottom-6 left-4 right-4 md:top-1/2 md:bottom-auto md:right-6 md:left-auto md:-translate-y-1/2 md:w-72 bg-[#050505]/30 backdrop-blur-md border border-white/10 rounded-xl p-5 md:p-6 pointer-events-auto z-20">
                <h2 className="font-display text-lg md:text-xl font-semibold text-white mb-2 tracking-[0.2em] uppercase">
                  {t(partData.nameKey)}
                </h2>
                <p className="text-gray-400 text-sm mb-2 md:mb-4 max-h-32 md:max-h-none overflow-y-auto md:overflow-visible pr-1">
                  {t(partData.descKey)}
                </p>
                {selectedPart === "subtitle3" && (
                  <div className="w-full mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#ffb800] text-[10px] font-bold tracking-widest">DAYANIKLILIK</span>
                      <span className="text-white text-xs">Yüksek</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-full bg-gradient-to-r from-[#ffb800]/50 to-[#ffb800]"
                      />
                    </div>
                  </div>
                )}

                {/* Ozvia Butonu (subtitle4'te gösterilir) */}
                {selectedPart === "subtitle4" && (
                  <a 
                    href="https://ozviai.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-2 flex items-center justify-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 pointer-events-auto font-display font-semibold tracking-[0.18em] text-xs min-h-[44px] border-amber-400/35 text-amber-300/90 bg-amber-400/5 hover:border-amber-400/60 hover:text-amber-200 hover:bg-amber-400/8 hover:shadow-[0_0_16px_rgba(251,191,36,0.1)] text-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-75">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    {t("menu.try_ozvia")}
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Simülasyon Özel Arayüzü */}
          <AnimatePresence>
            {selectedPart === "subtitle2" && (
              <SimulationOverlay onClose={() => {
                setSelectedPart(null);
                setActivePage(null);
                navigate("/");
              }} />
            )}
          </AnimatePresence>

          {/* Logo */}
          <div className="absolute top-4 left-4 md:top-8 md:right-12 md:left-auto pointer-events-auto z-30 select-none flex flex-col items-start md:items-center">
            <img
              src="/logo_yazı.png"
              alt="Volinor Logo"
              onClick={() => {
                navigate("/");
                setIsNavOpen(false); // Eğer menü açıksa kapatarak dönmesi için
              }}
              className="h-10 md:h-16 w-auto shrink-0 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer hover:opacity-80 transition-opacity"
            />
          </div>

          {/* Analiz modu yer tutucu kartı */}
          <AnalysisOverlay visible={isAnalysisMode} />

          {/* Tam Ekran Bilgi ve Form Modalı */}
          <PageModal
            activePage={activePage}
            setActivePage={setActivePage}
            setIsNavOpen={setIsNavOpen}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
