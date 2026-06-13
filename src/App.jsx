/**
 * App.jsx
 * Projenin ana giriş bileşenidir (Root Component).
 * Yükleme ekranı, UI (Kullanıcı Arayüzü) ve 3D sahneyi (Experience) bir araya getirerek
 * ana sayfa düzenini oluşturur.
 */
import { Experience } from './canvas/Experience';
import { ConfigPanel } from './components/ui/ConfigPanel';
import { LoadingScreen } from './components/ui/LoadingScreen';

function App() {
  return (
    <div className="w-full h-screen overflow-hidden bg-transparent font-sans selection:bg-white selection:text-black">
      <LoadingScreen />
      <ConfigPanel />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="pointer-events-auto w-full h-full">
          <Experience />
        </div>
      </div>
    </div>
  );
}

export default App;
