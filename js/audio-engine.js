/**
 * PianoFlow — Audio Engine
 *
 * Carga samples de piano del banco FluidR3_GM (gleitz) y los reproduce
 * vía WebAudio. El AudioContext se crea perezosamente en el primer
 * gesto del usuario (requerido por navegadores).
 *
 * API:
 *   AudioEngine.ensureCtx()           — abre AudioContext (idempotente)
 *   AudioEngine.loadInstrument(name)  — carga soundfont. async.
 *   AudioEngine.playNote(midi, durSec, velocity=0.8, whenSec=now)
 *   AudioEngine.stopAll()
 *   AudioEngine.setMuted(bool)
 *   AudioEngine.now()                 — currentTime del context (sec)
 */

const AudioEngine = {

  ctx: null,
  master: null,
  muted: false,

  // Soundfont actualmente cargado: { name, buffers: { 'C4': AudioBuffer, ... } }
  instrument: null,
  loadingPromise: null,

  // Catálogo de samples
  presets: {
    classic: {
      label:   'Clásico',
      desc:    'Acoustic Grand Piano',
      script:  'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3.js',
      fontKey: 'acoustic_grand_piano',
    },
    bright: {
      label:   'Eléctrico',
      desc:    'Electric Grand Piano',
      script:  'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/electric_grand_piano-mp3.js',
      fontKey: 'electric_grand_piano',
    },
    soft: {
      label:   'Suave (Rhodes)',
      desc:    'Electric Piano 1',
      script:  'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/electric_piano_1-mp3.js',
      fontKey: 'electric_piano_1',
    },
  },

  // Nodos vivos para envelope/release.
  liveNodes: new Set(),

  // ── Lifecycle ───────────────────────────────────────────────────

  ensureCtx() {
    if (this.ctx) return this.ctx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  },

  now() { return this.ctx ? this.ctx.currentTime : 0; },

  setMuted(flag) {
    this.muted = !!flag;
    if (this.master) this.master.gain.value = flag ? 0 : 0.9;
  },

  // ── Carga de soundfont ──────────────────────────────────────────

  async loadInstrument(presetKey = 'classic') {
    const preset = this.presets[presetKey];
    if (!preset) throw new Error('Preset desconocido: ' + presetKey);

    // Si ya está cargado el mismo preset, no hacer nada.
    if (this.instrument && this.instrument.name === presetKey) return this.instrument;

    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      this.ensureCtx();

      // 1) Cargar el script si no está ya en MIDI.Soundfont
      if (!window.MIDI?.Soundfont?.[preset.fontKey]) {
        await this._loadScript(preset.script);
      }
      const font = window.MIDI?.Soundfont?.[preset.fontKey];
      if (!font) throw new Error('Soundfont no se cargó: ' + preset.fontKey);

      // 2) Decodificar todas las muestras base64 → AudioBuffer
      const buffers = await this._decodeAllSamples(font);

      this.instrument = { name: presetKey, buffers };
      return this.instrument;
    })();

    try {
      const inst = await this.loadingPromise;
      this.loadingPromise = null;
      return inst;
    } catch (e) {
      this.loadingPromise = null;
      throw e;
    }
  },

  _loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error('No se pudo cargar ' + src));
      document.head.appendChild(s);
    });
  },

  async _decodeAllSamples(font) {
    const buffers = {};
    const entries = Object.entries(font);
    // Decodificar en paralelo, pero limitar para no saturar.
    const CONCURRENCY = 6;
    let i = 0;
    const workers = Array.from({ length: CONCURRENCY }, async () => {
      while (i < entries.length) {
        const idx = i++;
        const [name, dataUrl] = entries[idx];
        try {
          const ab = await this._dataUrlToAudioBuffer(dataUrl);
          buffers[name] = ab;
        } catch (e) {
          // saltarse muestras corruptas
        }
      }
    });
    await Promise.all(workers);
    return buffers;
  },

  async _dataUrlToAudioBuffer(dataUrl) {
    const comma = dataUrl.indexOf(',');
    const b64 = dataUrl.slice(comma + 1);
    const bin = atob(b64);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return await this.ctx.decodeAudioData(buf.buffer);
  },

  // ── Playback ────────────────────────────────────────────────────

  // Toca una nota MIDI por durSec segundos, programada para arrancar
  // en whenSec (tiempo absoluto del AudioContext).
  playNote(midi, durSec = 0.8, velocity = 0.8, whenSec = null) {
    if (!this.instrument) return;
    this.ensureCtx();
    const t0 = whenSec ?? this.now();

    // Encontrar la muestra más cercana (los soundfonts no traen todas las
    // notas — usualmente vienen cada 3 semitonos). Resampleamos por playbackRate.
    const sampleName = this._nearestSample(midi);
    if (!sampleName) return;
    const buf = this.instrument.buffers[sampleName];
    if (!buf) return;

    const sampleMidi = this._sampleNameToMidi(sampleName);
    const rate = Math.pow(2, (midi - sampleMidi) / 12);

    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;

    const gain = this.ctx.createGain();
    const vol = Math.max(0.05, Math.min(1, velocity));
    // Envelope corto: ataque casi instantáneo, decay/release suave.
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.005);
    gain.gain.setTargetAtTime(0.0001, t0 + durSec, 0.18);

    src.connect(gain).connect(this.master);
    src.start(t0);
    src.stop(t0 + durSec + 0.8);

    this.liveNodes.add(src);
    src.onended = () => this.liveNodes.delete(src);
  },

  stopAll() {
    this.liveNodes.forEach(node => {
      try { node.stop(); } catch (e) {}
    });
    this.liveNodes.clear();
  },

  // ── Utilidades de samples ──────────────────────────────────────

  _sampleNameToMidi(name) {
    // 'C4' → 60, 'F#3' → 54, 'Db5' → 73
    const m = name.match(/^([A-G])(b|#)?(-?\d+)$/);
    if (!m) return 60;
    const STEP = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 };
    let pc = STEP[m[1]];
    if (m[2] === '#') pc++;
    if (m[2] === 'b') pc--;
    const oct = parseInt(m[3], 10);
    return 12 * (oct + 1) + pc;
  },

  _nearestSample(midi) {
    if (!this.instrument) return null;
    const names = Object.keys(this.instrument.buffers);
    if (!names.length) return null;
    let best = names[0];
    let bestDiff = Infinity;
    names.forEach(n => {
      const d = Math.abs(this._sampleNameToMidi(n) - midi);
      if (d < bestDiff) { bestDiff = d; best = n; }
    });
    return best;
  },
};
