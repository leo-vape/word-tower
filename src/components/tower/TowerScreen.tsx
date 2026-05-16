import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getCreature } from '../../data/creatures';
import { STORY_SEEN_KEY, PROFILE_KEY } from '../../utils/constants';
import TowerStartScreen from './TowerStartScreen';
import TowerGame from './TowerGame';
import OnboardingOverlay from './OnboardingOverlay';
import StoryIntro from './StoryIntro';
import ProfileSetup from './ProfileSetup';

const ONBOARDING_KEY = 'word_tower_onboarded';

export default function TowerScreen() {
  const [playing, setPlaying] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const activeCreatureIds = useGameStore(s => s.activeCreatureIds);

  useEffect(() => {
    if (!localStorage.getItem(STORY_SEEN_KEY)) {
      setShowStory(true);
      return;
    }
    if (!localStorage.getItem(PROFILE_KEY)) {
      setShowProfile(true);
      return;
    }
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setShowOnboarding(true);
    }
  }, []);

  const handleStoryComplete = useCallback(() => {
    localStorage.setItem(STORY_SEEN_KEY, '1');
    setShowStory(false);
    setShowProfile(true);
  }, []);

  const handleProfileComplete = useCallback(() => {
    localStorage.setItem(PROFILE_KEY, '1');
    setShowProfile(false);
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setShowOnboarding(true);
    }
  }, []);

  const dismissOnboarding = () => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      localStorage.setItem(ONBOARDING_KEY, '1');
    }
    setShowOnboarding(false);
  };

  const activeCreatures = activeCreatureIds
    .map(id => getCreature(id))
    .filter(c => c != null);

  if (showStory) {
    return <StoryIntro onComplete={handleStoryComplete} />;
  }

  if (showProfile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

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
