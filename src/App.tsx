import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useGameStore } from './store/useGameStore';
import AppShell from './components/layout/AppShell';
import TowerScreen from './components/tower/TowerScreen';
import HatcheryScreen from './components/hatchery/HatcheryScreen';
import CollectionScreen from './components/collection/CollectionScreen';
import ToastContainer from './components/ui/Toast';
import WeChatGuide from './components/ui/WeChatGuide';

export default function App() {
  const checkDailyBonus = useGameStore(s => s.checkDailyBonus);

  useEffect(() => {
    checkDailyBonus();
  }, []);

  // iOS Safari requires speechSynthesis to be primed from a direct user gesture.
  useEffect(() => {
    const prime = () => {
      document.removeEventListener('click', prime, true);
      if (!window.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance('a');
      u.volume = 0;
      u.rate = 2;
      speechSynthesis.speak(u);
    };
    document.addEventListener('click', prime, true);
    return () => document.removeEventListener('click', prime, true);
  }, []);

  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<TowerScreen />} />
          <Route path="/hatchery" element={<HatcheryScreen />} />
          <Route path="/collection" element={<CollectionScreen />} />
        </Routes>
      </AppShell>
      <ToastContainer />
      <WeChatGuide />
    </HashRouter>
  );
}
