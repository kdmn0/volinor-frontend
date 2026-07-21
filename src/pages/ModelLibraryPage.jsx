import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import { useConfigStore } from "../store/useConfigStore";
import { useTranslation } from "react-i18next";

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}`;

const ArrowLeftIcon = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const SearchIcon = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const UserIcon = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export const ModelLibraryPage = () => {
  const { t } = useTranslation();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isLoggedIn = useConfigStore((s) => s.isLoggedIn);
  const setIsLoggedIn = useConfigStore((s) => s.setIsLoggedIn);
  const userEmail = useConfigStore((s) => s.userEmail);
  const setUserEmail = useConfigStore((s) => s.setUserEmail);

  useEffect(() => {
    axios.get(`${API}/api/models/`)
      .then((res) => setModels(res.data))
      .catch(() => setModels([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = models.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setUserEmail("");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_email");
      setIsLoggingOut(false);
    }, 1500);
  };

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-[#0a0a0a] text-white font-sans selection:bg-[#ffb800]/30 selection:text-[#ffb800] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-4 bg-[#111] border border-white/10 p-8 rounded-2xl shadow-2xl"
            >
              <div className="w-12 h-12 border-4 border-white/10 border-t-[#ffb800] rounded-full animate-spin" />
              <p className="text-white/80 font-medium tracking-wide">Çıkış yapılıyor...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#ffb800]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 px-6">
        <div className="max-w-[1600px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" state={{ activePage: "model-kutuphanesi" }} className="flex items-center gap-2 text-sm font-medium tracking-widest text-white/50 hover:text-[#ffb800] transition-colors group">
              <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform" />
              ANA SAYFA
            </Link>
            <h1 className="sr-only">MODEL KÜTÜPHANESİ</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block w-64 lg:w-80">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/40">
                <SearchIcon />
              </div>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 focus:border-[#ffb800]/50 rounded-lg py-2 pl-10 pr-4 text-sm text-white/90 placeholder-white/40 outline-none transition-all shadow-inner"
                placeholder="Model ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {!isLoggedIn ? (
              <Link to="/auth" className="px-5 py-2 text-sm font-bold tracking-wider text-[#ffb800] border border-[#ffb800]/30 rounded bg-[#ffb800]/5 hover:bg-[#ffb800]/10 transition-colors">
                GİRİŞ YAP
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#ffb800]/50 transition-all overflow-hidden"
                >
                  <UserIcon className="w-5 h-5 text-white/60 hover:text-[#ffb800]" />
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                     <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-[#111]/95 backdrop-blur border border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-xs text-white/50 mb-1">Giriş yapıldı</p>
                        <p className="text-sm font-medium text-white/90 truncate">{userEmail || 'Kullanıcı'}</p>
                      </div>
                      <div className="p-2">
                        <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded transition-colors">
                          Çıkış Yap
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="md:hidden p-4 relative z-10 border-b border-white/10 bg-[#0a0a0a]/50 backdrop-blur">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/40">
            <SearchIcon />
          </div>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 focus:border-[#ffb800]/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white/90 placeholder-white/40 outline-none transition-all"
            placeholder="Model ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <main className="relative z-10 max-w-[1600px] mx-auto p-4 lg:p-8">
        
        {/* Added Title for visual consistency with Volinor Theme */}
        <div className="mb-8 md:mb-12 mt-4 md:mt-6">
          <h1 className="text-3xl md:text-5xl font-display font-light tracking-[0.25em] md:tracking-[0.3em] uppercase drop-shadow-md">
            <span className="text-white">MODEL </span><span className="text-[#ffb800]">KÜTÜPHANESİ</span>
          </h1>
          <p className="text-white/40 text-[10px] md:text-xs tracking-[0.35em] mt-2 font-medium">
            3D MODELLER VE SİMÜLASYONLAR
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-4 border-white/10 border-t-[#ffb800] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 mb-4">
              <SearchIcon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-display font-bold tracking-widest text-white/80">MODEL BULUNAMADI</h2>
            <p className="text-white/50 mt-2 font-light">Arama kriterlerinize uygun model bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filtered.map((model) => (
              <Link
                to={`/model-kutuphanesi/${model.id}`}
                key={model.id}
                className="group flex flex-col bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#ffb800]/50 hover:shadow-[0_0_30px_rgba(255,184,0,0.1)] transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black/50">
                  {model.images[0] ? (
                    <img
                      src={model.images[0]}
                      alt={model.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent opacity-80" />
                </div>
                <div className="p-5 flex flex-col flex-1 bg-[#0a0a0a]/50 border-t border-white/5">
                  <h3 className="text-lg font-display font-bold tracking-wide text-white/90 group-hover:text-[#ffb800] transition-colors line-clamp-1">
                    {model.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ModelLibraryPage;
