// Âm thanh & giọng đọc tiếng Việt (Web Speech + Web Audio API)

let audioCtx: AudioContext | null = null
function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioCtx = new AC()
    }
    if (audioCtx.state === 'suspended') void audioCtx.resume()
    return audioCtx
  } catch {
    return null
  }
}

let soundOn = true
let voiceOn = true
export function setSoundOn(v: boolean) {
  soundOn = v
}
export function setVoiceOn(v: boolean) {
  voiceOn = v
  if (!v) stopSpeak()
}
export function isSoundOn() {
  return soundOn
}
export function isVoiceOn() {
  return voiceOn
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.18) {
  const c = ctx()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  osc.connect(g)
  g.connect(c.destination)
  const t = c.currentTime + start
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

export function playTap() {
  if (!soundOn) return
  tone(440, 0, 0.09, 'triangle', 0.12)
}

export function playCorrect() {
  if (!soundOn) return
  // hợp âm vui: đô - mi - son - đô cao
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.2, 'sine', 0.16))
}

export function playWrong() {
  if (!soundOn) return
  tone(220, 0, 0.18, 'sawtooth', 0.1)
  tone(180, 0.12, 0.22, 'sawtooth', 0.1)
}

export function playStar() {
  if (!soundOn) return
  ;[880, 1174, 1568].forEach((f, i) => tone(f, i * 0.07, 0.18, 'triangle', 0.14))
}

export function playCelebrate() {
  if (!soundOn) return
  const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 1046.5]
  notes.forEach((f, i) => tone(f, i * 0.08, 0.25, 'sine', 0.15))
  ;[1046.5, 1318.5].forEach((f, i) => tone(f, 0.6 + i * 0.1, 0.4, 'triangle', 0.13))
}

// ---------- Giọng đọc tiếng Việt ----------
let viVoice: SpeechSynthesisVoice | null = null
function pickVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const voices = window.speechSynthesis.getVoices()
  viVoice =
    voices.find((v) => v.lang?.toLowerCase().startsWith('vi')) ??
    voices.find((v) => /vietnam/i.test(v.name)) ??
    null
}
if (typeof window !== 'undefined' && window.speechSynthesis) {
  pickVoice()
  window.speechSynthesis.onvoiceschanged = pickVoice
}

export function speak(text: string) {
  if (!voiceOn || typeof window === 'undefined' || !window.speechSynthesis) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'vi-VN'
    if (viVoice) u.voice = viVoice
    u.rate = 0.92
    u.pitch = 1.12
    window.speechSynthesis.speak(u)
  } catch {
    /* ignore */
  }
}

export function stopSpeak() {
  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
}

// Mở khoá audio sau tương tác đầu tiên (bắt buộc trên iOS)
export function unlockAudio() {
  ctx()
  if (typeof window !== 'undefined' && window.speechSynthesis && viVoice === null) pickVoice()
}
