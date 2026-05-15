import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useGameStore } from './store/useGameStore';
import AppShell from './components/layout/AppShell';
import TowerScreen from './components/tower/TowerScreen';
import HatcheryScreen from './components/hatchery/HatcheryScreen';
import CollectionScreen from './components/collection/CollectionScreen';
import ShareModal from './components/share/ShareModal';
import ToastContainer from './components/ui/Toast';

export default function App() {
  const [showShare, setShowShare] = useState(false);
  const checkDailyBonus = useGameStore(s => s.checkDailyBonus);

  useEffect(() => {
    checkDailyBonus();
  }, []);

  return (
    <HashRouter>
      <AppShell onShare={() => setShowShare(true)}>
        <Routes>
          <Route path="/" element={<TowerScreen />} />
          <Route path="/hatchery" element={<HatcheryScreen />} />
          <Route path="/collection" element={<CollectionScreen />} />
        </Routes>
      </AppShell>
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
      <ToastContainer />
    </HashRouter>
  );
}
