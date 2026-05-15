let bestVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function loadBestVoice(): void {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return;

  voicesLoaded = true;

  // Preferred voices: British first (matches Chinese textbook RP), then American
  const preferred = [
    'Daniel',           // macOS en-GB — excellent quality
    'Serena',           // macOS en-GB
    'Google UK English',
    'Microsoft Hazel',  // Windows en-GB
    'Samantha',         // macOS en-US
    'Alex',             // macOS en-US
    'Google US English',
    'Microsoft David',
    'Microsoft Zira',
  ];
  for (const name of preferred) {
    const match = voices.find(v => v.name === name);
    if (match) { bestVoice = match; return; }
  }

  // Fallback: any en-GB voice
  const enGB = voices.find(v => v.lang === 'en-GB');
  if (enGB) { bestVoice = enGB; return; }

  // Fallback: any en-US voice
  const enUS = voices.find(v => v.lang === 'en-US');
  if (enUS) { bestVoice = enUS; return; }

  // Last resort: any English voice
  bestVoice = voices.find(v => v.lang.startsWith('en')) ?? null;
}

export function speakWord(word: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  if (!voicesLoaded) {
    loadBestVoice();
    if (!voicesLoaded) {
      window.speechSynthesis.addEventListener('voiceschanged', loadBestVoice, { once: true });
    }
  }

  const utterance = new SpeechSynthesisUtterance(word);
  // Use the voice's native lang if available, otherwise fall back to en-GB
  utterance.lang = bestVoice?.lang ?? 'en-GB';
  utterance.rate = 0.9;
  if (bestVoice) utterance.voice = bestVoice;
  utterance.onerror = () => {};
  window.speechSynthesis.speak(utterance);
}
