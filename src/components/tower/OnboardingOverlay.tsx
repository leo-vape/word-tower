import { useState } from 'react';
import Button from '../ui/Button';

interface OnboardingOverlayProps {
  onDismiss: () => void;
}

const STEPS = [
  {
    title: '看中文，选英文',
    emoji: '🎯',
    desc: (
      <div className="space-y-3">
        <p className="text-gray-300">屏幕顶部显示<strong className="text-white">中文意思</strong></p>
        <div className="bg-bg rounded-xl p-3 text-center">
          <span className="text-2xl font-bold text-white">苹果</span>
          <span className="text-xs text-gray-500 ml-2">(5个字母)</span>
        </div>
        <p className="text-gray-300">多个<strong className="text-cyan-400">英文单词</strong>从上方落下</p>
        <div className="flex justify-center gap-3">
          {['apple', 'apply', 'apart', 'happy'].map((w, i) => (
            <div key={w} className={`px-3 py-2 rounded-lg border-2 text-sm font-bold
              ${i === 0 ? 'border-green-400 bg-green-500/20 text-green-300' : 'border-cyan-400/40 bg-cyan-500/10 text-white'}`}>
              {w}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: '点击正确的单词',
    emoji: '👆',
    desc: (
      <div className="space-y-3">
        <p className="text-gray-300">点击<strong className="text-green-400">正确的英文单词</strong></p>
        <div className="bg-bg rounded-xl p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-400 font-bold text-lg">✓ apple</span>
            <span className="text-energy">+2💎</span>
          </div>
          <p className="text-xs text-gray-500">得分 + 能量石 + 塔升高 + 连击累计</p>
        </div>
        <p className="text-gray-300 text-sm">连续答对触发<strong className="text-accent">连击加成</strong>，获得更多能量!</p>
      </div>
    ),
  },
  {
    title: '避开错误，别让词掉落',
    emoji: '⚠️',
    desc: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg rounded-xl p-3 text-center">
            <div className="text-red-400 font-bold text-lg">✗ 点错</div>
            <div className="text-xs text-gray-500 mt-1">扣一条命 ❤️</div>
          </div>
          <div className="bg-bg rounded-xl p-3 text-center">
            <div className="text-yellow-400 font-bold text-lg">↓ 掉落</div>
            <div className="text-xs text-gray-500 mt-1">正确词触底也扣命</div>
          </div>
        </div>
        <p className="text-gray-300 text-sm">生命用完游戏结束。爬塔赚的<strong className="text-energy">能量石💎</strong>可以<strong className="text-primary">孵蛋</strong>获得精灵!</p>
        <p className="text-gray-500 text-xs">精灵出战会给你各种加成buff，让下次爬塔更强</p>
      </div>
    ),
  },
];

export default function OnboardingOverlay({ onDismiss }: OnboardingOverlayProps) {
  const [step, setStep] = useState(0);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur animate-fade-in">
      <div className="bg-surface rounded-2xl w-[90vw] max-w-sm shadow-2xl animate-scale-in">
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 pt-4 pb-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="px-5 py-3">
          <div className="text-4xl mb-2 text-center">{STEPS[step].emoji}</div>
          <h3 className="text-xl font-bold text-white text-center mb-4">
            {STEPS[step].title}
          </h3>
          {STEPS[step].desc}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          {step < STEPS.length - 1 ? (
            <>
              <Button variant="ghost" size="sm" onClick={onDismiss} className="flex-1">
                跳过
              </Button>
              <Button variant="primary" size="sm" onClick={() => setStep(s => s + 1)} className="flex-1">
                下一步
              </Button>
            </>
          ) : (
            <Button variant="primary" size="lg" onClick={onDismiss} className="w-full">
              开始爬塔！
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
