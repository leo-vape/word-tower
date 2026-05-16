let bestVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function loadBestVoice(): void {
  const allVoices = window.speechSynthesis.getVoices();
  if (allVoices.length === 0) return;

  voicesLoaded = true;
  window.speechSynthesis.removeEventListener('voiceschanged', loadBestVoice);

  const localVoices = allVoices.filter(v => v.localService);

  const preferred = [
    'Daniel', 'Serena', 'Samantha', 'Alex',
    'Microsoft Hazel', 'Microsoft David', 'Microsoft Zira',
  ];
  for (const name of preferred) {
    const match = localVoices.find(v => v.name === name);
    if (match) { bestVoice = match; return; }
  }

  bestVoice = localVoices.find(v => v.lang === 'en-GB')
    ?? localVoices.find(v => v.lang === 'en-US')
    ?? localVoices.find(v => v.lang.startsWith('en'))
    ?? null;
}

export function speakWord(word: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;

  if (!voicesLoaded) {
    loadBestVoice();
    if (!voicesLoaded) {
      synth.addEventListener('voiceschanged', loadBestVoice, { once: true });
    }
  }

  if (synth.speaking || synth.pending) return;

  const utterance = new SpeechSynthesisUtterance(word);
  if (bestVoice) {
    utterance.voice = bestVoice;
    utterance.lang = bestVoice.lang;
  } else {
    utterance.lang = 'en-US';
  }
  utterance.rate = 0.9;
  utterance.volume = 1;
  utterance.onerror = () => {};
  utterance.onend = () => {};

  synth.speak(utterance);
}
