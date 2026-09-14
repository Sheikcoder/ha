/* ============================================================
   HA AUDIO ENGINE — Web Audio API, no external files required.

   - Sound effects: racket hit, court bounce, UI tick (synthesised)
   - Ambience: soft stadium air
   - Music: generated ambient theme (slow chords + plucked arpeggio)
     → if /audio/theme.mp3 exists in public/, it is used instead.

   Everything is OFF until the visitor turns sound on (browsers block
   autoplay, and it is more respectful). The choice is remembered.
   ============================================================ */

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ha-sound'
const MUSIC_FILE = '/audio/theme.mp3'

const listeners = new Set()

class AudioEngine {
  constructor() {
    this.ctx = null
    this.enabled = false
    this.ready = false
    this.master = null
    this.sfx = null
    this.musicBus = null
    this.ambienceBus = null
    this.musicTimer = null
    this.musicStep = 0
    this.nextNoteTime = 0
    this.fileMusic = null
    this.noiseBuffer = null
    try {
      this.preferred = window.localStorage.getItem(STORAGE_KEY) === 'on'
    } catch {
      this.preferred = false
    }
  }

  /* ---- subscription for React components ---- */
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }
  emit() {
    listeners.forEach(fn => fn(this.enabled))
  }

  /* ---- lifecycle ---- */
  init() {
    if (this.ready) return true
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return false
    this.ctx = new Ctx()
    const ctx = this.ctx

    this.master = ctx.createGain()
    this.master.gain.value = 0
    this.master.connect(ctx.destination)

    // gentle limiter so overlapping hits never clip
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -14
    comp.knee.value = 20
    comp.ratio.value = 6
    comp.attack.value = 0.003
    comp.release.value = 0.2
    comp.connect(this.master)
    this.bus = comp

    this.sfx = ctx.createGain(); this.sfx.gain.value = 0.9; this.sfx.connect(this.bus)
    this.musicBus = ctx.createGain(); this.musicBus.gain.value = 0.32; this.musicBus.connect(this.bus)
    this.ambienceBus = ctx.createGain(); this.ambienceBus.gain.value = 0.16; this.ambienceBus.connect(this.bus)

    // reusable noise
    const len = ctx.sampleRate * 1.5
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0
    for (let i = 0; i < len; i++) {
      // pink-ish noise (Paul Kellet approximation)
      const white = Math.random() * 2 - 1
      b0 = 0.99765 * b0 + white * 0.099046
      b1 = 0.963 * b1 + white * 0.2965164
      b2 = 0.57 * b2 + white * 1.0526913
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.2
    }
    this.noiseBuffer = buf

    this.ready = true
    return true
  }

  async setEnabled(on) {
    if (on && !this.init()) return
    this.enabled = on
    try { window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off') } catch { /* ignore */ }

    if (!this.ready) { this.emit(); return }
    const ctx = this.ctx
    if (on) {
      if (ctx.state === 'suspended') { try { await ctx.resume() } catch { /* ignore */ } }
      this.master.gain.cancelScheduledValues(ctx.currentTime)
      this.master.gain.setTargetAtTime(1, ctx.currentTime, 0.4)
      this.startAmbience()
      this.startMusic()
    } else {
      this.master.gain.cancelScheduledValues(ctx.currentTime)
      this.master.gain.setTargetAtTime(0, ctx.currentTime, 0.25)
      setTimeout(() => { if (!this.enabled) { this.stopMusic(); this.stopAmbience() } }, 700)
    }
    this.emit()
  }

  toggle() { return this.setEnabled(!this.enabled) }

  /* ---- helpers ---- */
  panner(pan = 0) {
    const ctx = this.ctx
    if (ctx.createStereoPanner) {
      const p = ctx.createStereoPanner()
      p.pan.value = Math.max(-1, Math.min(1, pan))
      return p
    }
    return ctx.createGain()
  }

  /* ---- SOUND EFFECTS ---- */

  /** Racket striking the ball. pan -1..1, level 0..1 */
  hit(pan = 0, level = 1) {
    if (!this.enabled || !this.ready) return
    const ctx = this.ctx, t = ctx.currentTime
    const out = this.panner(pan); out.connect(this.sfx)

    // "pock" body
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(210, t)
    osc.frequency.exponentialRampToValueAtTime(95, t + 0.07)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.9 * level, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13)
    osc.connect(g); g.connect(out)
    osc.start(t); osc.stop(t + 0.15)

    // string snap (noise burst)
    const n = ctx.createBufferSource(); n.buffer = this.noiseBuffer
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 0.8
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(0.0001, t)
    ng.gain.exponentialRampToValueAtTime(0.55 * level, t + 0.002)
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
    n.connect(bp); bp.connect(ng); ng.connect(out)
    n.start(t); n.stop(t + 0.08)
  }

  /** Ball bouncing on the court */
  bounce(pan = 0, level = 1) {
    if (!this.enabled || !this.ready) return
    const ctx = this.ctx, t = ctx.currentTime
    const out = this.panner(pan); out.connect(this.sfx)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, t)
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.09)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.5 * level, t + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)
    osc.connect(g); g.connect(out)
    osc.start(t); osc.stop(t + 0.18)

    const n = ctx.createBufferSource(); n.buffer = this.noiseBuffer
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(0.0001, t)
    ng.gain.exponentialRampToValueAtTime(0.25 * level, t + 0.003)
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.07)
    n.connect(lp); lp.connect(ng); ng.connect(out)
    n.start(t); n.stop(t + 0.1)
  }

  /** Small interface tick (buttons, theme switch) */
  tick() {
    if (!this.enabled || !this.ready) return
    const ctx = this.ctx, t = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1320, t)
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.05)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.003)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07)
    osc.connect(g); g.connect(this.sfx)
    osc.start(t); osc.stop(t + 0.08)
  }

  /** Soft whoosh for page transitions */
  whoosh() {
    if (!this.enabled || !this.ready) return
    const ctx = this.ctx, t = ctx.currentTime
    const n = ctx.createBufferSource(); n.buffer = this.noiseBuffer
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2
    bp.frequency.setValueAtTime(300, t)
    bp.frequency.exponentialRampToValueAtTime(2400, t + 0.35)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.12)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
    n.connect(bp); bp.connect(g); g.connect(this.sfx)
    n.start(t); n.stop(t + 0.55)
  }

  /* ---- AMBIENCE (stadium air) ---- */
  startAmbience() {
    if (this.ambience) return
    const ctx = this.ctx
    const src = ctx.createBufferSource(); src.buffer = this.noiseBuffer; src.loop = true
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420
    const g = ctx.createGain(); g.gain.value = 0.6
    // slow swell so it breathes like a crowd
    const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.07
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.25
    lfo.connect(lfoGain); lfoGain.connect(g.gain)
    src.connect(lp); lp.connect(g); g.connect(this.ambienceBus)
    src.start(); lfo.start()
    this.ambience = { src, lfo }
  }
  stopAmbience() {
    if (!this.ambience) return
    try { this.ambience.src.stop(); this.ambience.lfo.stop() } catch { /* ignore */ }
    this.ambience = null
  }

  /* ---- MUSIC ---- */
  async startMusic() {
    if (this.musicTimer || this.fileMusic) return
    // Prefer a real track if the client has provided one
    if (this.fileChecked === undefined) {
      this.fileChecked = false
      try {
        const res = await fetch(MUSIC_FILE, { method: 'HEAD' })
        const type = res.headers.get('content-type') || ''
        this.fileChecked = res.ok && type.startsWith('audio')
      } catch { this.fileChecked = false }
    }
    if (!this.enabled) return
    if (this.fileChecked) {
      const el = new Audio(MUSIC_FILE)
      el.loop = true
      el.crossOrigin = 'anonymous'
      const node = this.ctx.createMediaElementSource(el)
      node.connect(this.musicBus)
      el.play().catch(() => {})
      this.fileMusic = { el, node }
      return
    }
    this.startGeneratedMusic()
  }

  stopMusic() {
    if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null }
    if (this.pad) { try { this.pad.forEach(o => o.stop()) } catch { /* ignore */ } this.pad = null }
    if (this.fileMusic) { this.fileMusic.el.pause(); this.fileMusic = null }
  }

  /* Generated theme: 72 bpm, A minor, four slow chords with a plucked arpeggio */
  startGeneratedMusic() {
    const ctx = this.ctx
    const bpm = 72
    const beat = 60 / bpm
    // chord progression (Hz): Am9 → Fmaj7 → Cmaj7 → G6, two bars each
    const chords = [
      [220.00, 261.63, 329.63, 493.88],   // A C E B
      [174.61, 220.00, 261.63, 329.63],   // F A C E
      [130.81, 196.00, 261.63, 329.63],   // C G C E
      [196.00, 246.94, 293.66, 329.63]    // G B D E
    ]
    const arps = [
      [440, 523.25, 659.25, 987.77, 659.25, 523.25, 440, 659.25],
      [349.23, 440, 523.25, 659.25, 523.25, 440, 349.23, 523.25],
      [392, 523.25, 659.25, 783.99, 659.25, 523.25, 392, 659.25],
      [392, 493.88, 587.33, 659.25, 587.33, 493.88, 392, 587.33]
    ]

    // shared delay for the plucks (gives the "stadium" space)
    const delay = ctx.createDelay(1.0); delay.delayTime.value = beat * 0.75
    const fb = ctx.createGain(); fb.gain.value = 0.32
    const dlp = ctx.createBiquadFilter(); dlp.type = 'lowpass'; dlp.frequency.value = 2200
    delay.connect(dlp); dlp.connect(fb); fb.connect(delay)
    const wet = ctx.createGain(); wet.gain.value = 0.35
    delay.connect(wet); wet.connect(this.musicBus)
    this.delayIn = delay

    // pad: 3 detuned saws per chord note, low-passed and slowly swept
    const padLp = ctx.createBiquadFilter(); padLp.type = 'lowpass'; padLp.frequency.value = 700; padLp.Q.value = 0.7
    const padLfo = ctx.createOscillator(); padLfo.frequency.value = 0.05
    const padLfoG = ctx.createGain(); padLfoG.gain.value = 260
    padLfo.connect(padLfoG); padLfoG.connect(padLp.frequency); padLfo.start()
    const padGain = ctx.createGain(); padGain.gain.value = 0.11
    padLp.connect(padGain); padGain.connect(this.musicBus)
    this.padLp = padLp

    this.pad = [padLfo]
    this.padVoices = []
    for (let v = 0; v < 4; v++) {
      const voice = []
      for (let d = -1; d <= 1; d++) {
        const o = ctx.createOscillator(); o.type = 'sawtooth'
        o.detune.value = d * 7
        const g = ctx.createGain(); g.gain.value = 0
        o.connect(g); g.connect(padLp)
        o.start()
        voice.push({ o, g })
        this.pad.push(o)
      }
      this.padVoices.push(voice)
    }

    // sub bass
    const sub = ctx.createOscillator(); sub.type = 'sine'
    const subG = ctx.createGain(); subG.gain.value = 0.16
    sub.connect(subG); subG.connect(this.musicBus); sub.start()
    this.pad.push(sub)
    this.sub = sub

    this.musicStep = 0
    this.nextNoteTime = ctx.currentTime + 0.1
    const stepsPerChord = 16 // 8th notes across two bars
    const stepDur = beat / 2

    const schedule = () => {
      while (this.nextNoteTime < ctx.currentTime + 0.35) {
        const step = this.musicStep
        const chordIdx = Math.floor(step / stepsPerChord) % chords.length
        const inChord = step % stepsPerChord
        const t = this.nextNoteTime

        if (inChord === 0) {
          // move pad + bass to the new chord with a slow crossfade
          chords[chordIdx].forEach((freq, vi) => {
            this.padVoices[vi].forEach(({ o, g }) => {
              o.frequency.setTargetAtTime(freq, t, 0.4)
              g.gain.cancelScheduledValues(t)
              g.gain.setTargetAtTime(0, t, 0.6)
              g.gain.setTargetAtTime(1, t + 0.5, 1.2)
            })
          })
          this.sub.frequency.setTargetAtTime(chords[chordIdx][0] / 2, t, 0.3)
        }

        // plucked arpeggio, lighter on off-beats
        const arp = arps[chordIdx]
        const note = arp[inChord % arp.length]
        const accent = inChord % 4 === 0 ? 1 : 0.6
        if (inChord % 2 === 0 || Math.random() < 0.35) this.pluck(note, t, accent)

        this.nextNoteTime += stepDur
        this.musicStep += 1
      }
    }
    schedule()
    this.musicTimer = setInterval(schedule, 120)
  }

  pluck(freq, t, level = 1) {
    const ctx = this.ctx
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = freq
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = freq * 2
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.16 * level, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
    const g2 = ctx.createGain(); g2.gain.value = 0.25
    o.connect(g); o2.connect(g2); g2.connect(g)
    g.connect(this.musicBus); g.connect(this.delayIn)
    o.start(t); o2.start(t); o.stop(t + 1); o2.stop(t + 1)
  }
}

export const audio = new AudioEngine()

/* Convenience for React */
export function useSound() {
  const [enabled, setEnabled] = useState(audio.enabled)
  useEffect(() => audio.subscribe(setEnabled), [])
  return { enabled, toggle: () => audio.toggle(), setEnabled: (v) => audio.setEnabled(v), preferred: audio.preferred }
}
