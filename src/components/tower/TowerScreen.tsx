import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getCreature } from '../../data/creatures';
import TowerStartScreen from './TowerStartScreen';
import TowerGame from './TowerGame';
import OnboardingOverlay from './OnboardingOverlay';

const ONBOARDING_KEY = 'word_tower_onboarded';

export default function TowerScreen() {
  const [playing, setPlaying] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const activeCreatureIds = useGameStore(s => s.activeCreatureIds);

  useEffect(() => {
    const onboarded = localStorage.getItem(ONBOARDING_KEY);
    if (!onboarded) {
      setShowOnboarding(true);
    }
  }, []);

  const dismissOnboarding = () => {
    // Only persist dismissal if it was auto-shown (first visit)
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      localStorage.setItem(ONBOARDING_KEY, '1');
    }
    setShowOnboarding(false);
  };

  const activeCreatures = activeCreatureIds
    .map(id => getCreature(id))
    .filter(c => c != null);

  if (playing) {
    return (
      <TowerGame
        activeCreatures={activeCreatures}
        onPlayAgain={() => setPlaying(false)}
      />
    );
  }

  return (
    <>
      {showOnboarding && <OnboardingOverlay onDismiss={dismissOnboarding} />}
      <TowerStartScreen
        onStart={() => setPlaying(true)}
        onShowHelp={() => setShowOnboarding(true)}
      />
    </>
  );
}
