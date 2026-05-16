import { useEffect, useState, useRef, useCallback } from 'react';
import type { Creature } from '../../types/creature';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useGameStore } from '../../store/useGameStore';
import { useGameSound } from '../../hooks/useGameSound';
import { showToast } from '../ui/Toast';
import { speakWord } from '../../utils/speech';
import WordField from './WordField';
import GameHUD from './GameHUD';
import GameField from './GameField';
import TowerDisplay from './TowerDisplay';
import BossOverlay from './BossOverlay';
import ComboIndicator from './ComboIndicator';
import GameOverModal from './GameOverModal';

interface TowerGameProps {
  activeCreatures: Creature[];
  onPlayAgain: () => void;
}

interface ScorePopupData {
  id: string;
  x: number;
  y: number;
  score: number;
  combo: number;
}

export default function TowerGame({ activeCreatures, onPlayAgain }: TowerGameProps) {
  const completeWord = useGameStore(s => s.completeWord);
  const addEnergy = useGameStore(s => s.addEnergy);
  const recordGameOver = useGameStore(s => s.recordGameOver);
  const addEgg = useGameStore(s => s.addEgg);

  const {
    view,
    events,
    fieldRef,
    handleStart,
    handleStop,
    handleWordTap,
    clearEvents,
  } = useGameLoop(activeCreatures);

  const { playCorrect, playWrong, playCombo, playBossDefeat, playBossStart } = useGameSound();

  const [comboTrigger, setComboTrigger] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [scorePopups, setScorePopups] = useState<ScorePopupData[]>([]);
  const [shake, setShake] = useState(false);
  const [bossActive, setBossActive] = useState(false);
  const [bossChinese, setBossChinese] = useState('');
  const bossDefeatRef = useRef(false);

  // Battle animation state
  const [battleAnim, setBattleAnim] = useState<'idle' | 'attacking' | 'hit' | 'celebrating' | 'boss_alert'>('idle');

  // Dialogue state
  const [dialogueTrigger, setDialogueTrigger] = useState(0);
  const [dialogueContext, setDialogueContext] = useState<'normal' | 'combo' | 'wrong' | 'boss'>('normal');

  // Hit effect state
  const [hitEffectTrigger, setHitEffectTrigger] = useState(0);
  const [lastTappedPos, setLastTappedPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const startRef = useRef(handleStart);
  const stopRef = useRef(handleStop);
  const lastWordRef = useRef<{ zh: string; en: string }>({ zh: '', en: '' });
  const popupIdRef = useRef(0);
  const wordCountRef = useRef(0);
  startRef.current = handleStart;
  stopRef.current = handleStop;

  lastWordRef.current = {
    zh: view.targetChinese,
    en: view.fallingWords.find(w => w.isCorrect)?.word ?? '',
  };

  const addScorePopup = useCallback((x: number, y: number, score: number, combo: number) => {
    const id = `sp_${popupIdRef.current++}`;
    setScorePopups(prev => [...prev.slice(-5), { id, x, y, score, combo }]);
    setTimeout(() => {
      setScorePopups(prev => prev.filter(p => p.id !== id));
    }, 1100);
  }, []);

  useEffect(() => {
    const tid = setTimeout(() => startRef.current(), 50);
    return () => {
      clearTimeout(tid);
      stopRef.current();
    };
  }, []);

  // Override handleWordTap to track position, battle anim, and speak
  const onWordTap = useCallback((wordId: string) => {
    const wordView = view.fallingWords.find(w => w.id === wordId);
    if (wordView) {
      setLastTappedPos({ x: wordView.x, y: wordView.y });
      // Call speakWord here (in user gesture context) for Chrome autoplay policy
      if (wordView.isCorrect) {
        speakWord(wordView.word);
      }
    }
    handleWordTap(wordId);
  }, [view.fallingWords, handleWordTap]);

  // Process events
  useEffect(() => {
    if (events.length === 0) return;

    for (const event of events) {
      switch (event.type) {
        case 'word_correct': {
          completeWord(event.word, event.combo);
          addEnergy(event.energy);
          setComboTrigger(c => c + 1);
          addScorePopup(40 + Math.random() * 40, 35 + Math.random() * 25, event.energy, event.combo);
          playCorrect();
          useGameStore.getState().recordWordResult(event.word, true);
          if (event.combo >= 3) playCombo(event.combo);

          // Battle anim + dialogue
          setBattleAnim('attacking');
          setTimeout(() => setBattleAnim('idle'), 350);
          setHitEffectTrigger(h => h + 1);

          wordCountRef.current++;
          if (wordCountRef.current % 6 === 0) {
            setDialogueContext('normal');
            setDialogueTrigger(t => t + 1);
          }
          if (event.combo === 5) {
            setDialogueContext('combo');
            setDialogueTrigger(t => t + 1);
          }
          break;
        }
        case 'word_wrong': {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          playWrong();
          useGameStore.getState().recordWordResult(event.correctWord, false);

          setBattleAnim('hit');
          setTimeout(() => setBattleAnim('idle'), 450);
          setHitEffectTrigger(h => h + 1);

          setDialogueContext('wrong');
          setDialogueTrigger(t => t + 1);
          break;
        }
        case 'word_missed':
          playWrong();
          useGameStore.getState().recordWordResult(event.word, false);
          break;
        case 'boss_start': {
          setBossActive(true);
          setBossChinese(event.chinese);
          showToast('👹 BOSS 来了！全力迎战！');
          playBossStart();

          setBattleAnim('boss_alert');
          setDialogueContext('boss');
          setDialogueTrigger(t => t + 1);
          break;
        }
        case 'boss_defeated': {
          setBossActive(false);
          bossDefeatRef.current = true;
          addEnergy(event.energy);
          completeWord(event.word, 99);
          addEgg(event.eggRarity);
          const rarityNames: Record<string, string> = {
            rare: '稀有🥚', epic: '史诗🥚', legendary: '传说🥚'
          };
          showToast(`💥 BOSS 击败！获得${rarityNames[event.eggRarity]}！`);
          addScorePopup(50, 40, event.energy, 99);
          playBossDefeat();

          setBattleAnim('celebrating');
          setTimeout(() => setBattleAnim('idle'), 700);
          setHitEffectTrigger(h => h + 1);
          setTimeout(() => { bossDefeatRef.current = false; }, 900);
          break;
        }
        case 'game_over': {
          recordGameOver({
            wordsSpelled: [],
            totalEnergyEarned: event.result.totalEnergy,
            maxCombo: event.result.maxCombo,
            heightReached: event.result.height,
            duration: view.elapsedMs,
            date: new Date().toISOString(),
          });
          setShowGameOver(true);
          break;
        }
        case 'egg_drop': {
          addEgg(event.rarity);
          const rarityNames: Record<string, string> = {
            rare: '稀有🥚', epic: '史诗🥚', legendary: '传说🥚'
          };
          showToast(`🥚 获得${rarityNames[event.rarity]}！`);
          break;
        }
        case 'difficulty_up':
          showToast(`⚡ 难度提升至 Lv.${event.level}`);
          break;
      }
    }
    clearEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, clearEvents]);

  if (view.phase === 'idle') {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        准备中...
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <GameHUD
        height={view.currentHeight}
        energy={view.energyEarnedThisSession}
        combo={view.combo}
        lives={view.livesRemaining}
        level={view.difficultyLevel}
        elapsedMs={view.elapsedMs}
        activeCreatures={activeCreatures}
      />

      <GameField combo={view.combo} shake={shake || bossActive} scorePopups={scorePopups}>
        <WordField
          words={view.fallingWords}
          feedback={view.feedback}
          correctWordId={view.correctWordId}
          onWordTap={onWordTap}
          fieldRef={fieldRef}
          chinese={view.targetChinese}
          letterCount={view.targetLetterCount}
          roundTrigger={view.roundTrigger}
          phonetic={view.targetPhonetic}
          creatures={activeCreatures}
          battleAnim={battleAnim}
          combo={view.combo}
          dialogueTrigger={dialogueTrigger}
          dialogueContext={dialogueContext}
          hitEffectTrigger={hitEffectTrigger}
          lastTappedPos={lastTappedPos}
        />
        <TowerDisplay height={view.currentHeight} />
        <BossOverlay
          active={bossActive}
          defeated={bossDefeatRef.current}
          chinese={bossChinese}
        />
        <ComboIndicator combo={view.combo} trigger={comboTrigger} />
      </GameField>

      {showGameOver && (
        <GameOverModal
          height={view.currentHeight}
          energy={view.energyEarnedThisSession}
          maxCombo={view.maxCombo}
          wordsCompleted={view.wordsCompleted}
          elapsedMs={view.elapsedMs}
          lastChinese={lastWordRef.current.zh}
          lastWord={lastWordRef.current.en}
          onPlayAgain={onPlayAgain}
        />
      )}
    </div>
  );
}
