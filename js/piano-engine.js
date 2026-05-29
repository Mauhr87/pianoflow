/**
 * PianoFlow — Piano Engine
 *
 * Extraído de pviewerns y modularizado:
 *   - buildPiano(container)          dibuja el teclado en el DOM
 *   - highlightNotes(notes)          ilumina teclas según mano (treble/bass/both)
 *   - clearHL()                      limpia todas las teclas
 *   - keyEl(midi)                    devuelve el DOM element de una tecla
 *
 * El teclado cubre A0 (MIDI 21) hasta C8 (MIDI 108) — 88 teclas.
 * El contenedor padre debe permitir scroll horizontal para mobile.
 */

const PianoEngine = {

  // Dimensiones de tecla (px). Se recalculan según viewport en init().
  WW: 20, WH: 130,   // tecla blanca: width, height
  BW: 13, BH: 82,    // tecla negra:  width, height

  MIDI_MIN: 21,      // A0
  MIDI_MAX: 108,     // C8

  NOTE_NAMES: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
  BLACK_SET:  new Set([1,3,6,8,10]),

  // Tabla de teclas: [{ midi, name, isBlack, wi, lwi }]
  // wi  = índice de tecla blanca (solo se llena para blancas)
  // lwi = índice de la tecla blanca a la izquierda (para posicionar negras)
  pianoKeys: [],
  midi2key:  {},   // midi → entry de pianoKeys
  wCount: 0,       // número total de teclas blancas

  // Cache de highlights activos para limpieza eficiente.
  // Map(midi → clase actual: 'hl-treble' | 'hl-bass' | 'hl-both' | 'hl-correct')
  activeHL: new Map(),

  container: null,

  // ── Inicialización ───────────────────────────────────────────────

  init(containerEl) {
    this.container = containerEl;
    this._adaptToViewport();
    this._buildKeyTable();
    this._render();
    return this;
  },

  _adaptToViewport() {
    // Detección simple: < 760px viewport → teclas pequeñas
    const isPhone = window.matchMedia('(max-width: 760px)').matches;
    if (isPhone) {
      this.WW = 15; this.WH = 96;
      this.BW = 10; this.BH = 60;
    } else {
      this.WW = 20; this.WH = 130;
      this.BW = 13; this.BH = 82;
    }
  },

  _buildKeyTable() {
    this.pianoKeys = [];
    this.midi2key  = {};
    let wi = 0, lwi = -1;

    for (let midi = this.MIDI_MIN; midi <= this.MIDI_MAX; midi++) {
      const n = ((midi % 12) + 12) % 12;
      const isBlack = this.BLACK_SET.has(n);
      const oct = Math.floor(midi / 12) - 1;
      const name = this.NOTE_NAMES[n] + oct;

      const entry = { midi, name, isBlack };
      if (!isBlack) {
        entry.wi  = wi;
        entry.lwi = wi;
        lwi = wi;
        wi++;
      } else {
        entry.lwi = lwi;
      }
      this.pianoKeys.push(entry);
      this.midi2key[midi] = entry;
    }
    this.wCount = wi;
  },

  _render() {
    const wrap = this.container;
    if (!wrap) return;
    wrap.innerHTML = '';
    wrap.style.cssText =
      `position:relative;width:${this.wCount * this.WW}px;height:${this.WH}px;` +
      `margin:0 auto;`;

    this.pianoKeys.forEach(k => {
      const el = document.createElement('div');
      el.id = 'pk' + k.midi;
      el.dataset.midi = k.midi;

      if (!k.isBlack) {
        el.className = 'key-w';
        el.style.cssText = `width:${this.WW}px;height:${this.WH}px;display:inline-block;`;
        // Etiqueta C debajo (para orientarse en el teclado)
        const n = ((k.midi % 12) + 12) % 12;
        if (n === 0) {
          const lbl = document.createElement('span');
          lbl.className = 'c-label';
          lbl.textContent = k.name;
          el.appendChild(lbl);
        }
      } else {
        el.className = 'key-b';
        const left = (k.lwi + 1) * this.WW - this.BW / 2;
        el.style.cssText =
          `width:${this.BW}px;height:${this.BH}px;` +
          `position:absolute;left:${left}px;top:0;`;
      }
      wrap.appendChild(el);
    });
  },

  // ── API pública ─────────────────────────────────────────────────

  keyEl(midi) {
    return document.getElementById('pk' + midi);
  },

  // Limpia todas las teclas iluminadas.
  clearHL() {
    this.activeHL.forEach((_, midi) => {
      const el = this.keyEl(midi);
      if (!el) return;
      el.classList.remove('hl-treble', 'hl-bass', 'hl-both', 'hl-correct', 'retrigger');
    });
    this.activeHL.clear();
  },

  // Ilumina la lista de notas. notes = [{ midi, staff: 'treble'|'bass' }, ...]
  // Si una misma midi aparece en ambas staves, queda 'both'.
  highlightNotes(notes) {
    if (!notes || !notes.length) { this.clearHL(); return; }

    // Resolver staff combinado por nota.
    const want = new Map();   // midi → 'treble' | 'bass' | 'both'
    notes.forEach(n => {
      const prev = want.get(n.midi);
      if (!prev)                          want.set(n.midi, n.staff);
      else if (prev !== n.staff)          want.set(n.midi, 'both');
    });

    // Quitar las que ya no van.
    this.activeHL.forEach((cls, midi) => {
      if (!want.has(midi)) {
        const el = this.keyEl(midi);
        if (el) el.classList.remove(cls, 'retrigger');
        this.activeHL.delete(midi);
      }
    });

    // Aplicar o actualizar las nuevas.
    want.forEach((staff, midi) => {
      const cls = staff === 'treble' ? 'hl-treble'
                : staff === 'bass'   ? 'hl-bass'
                                     : 'hl-both';
      const el = this.keyEl(midi);
      if (!el) return;
      const prev = this.activeHL.get(midi);
      if (prev === cls) {
        // mismo color — efecto "retrigger" sutil
        el.classList.add('retrigger');
        setTimeout(() => el.classList.remove('retrigger'), 110);
      } else {
        if (prev) el.classList.remove(prev);
        el.classList.add(cls);
        this.activeHL.set(midi, cls);
      }
    });
  },

  // Marca una tecla como "correcta" en modo follow.
  markCorrect(midi) {
    const el = this.keyEl(midi);
    if (!el) return;
    el.classList.add('hl-correct');
  },

  clearCorrect(midi) {
    const el = this.keyEl(midi);
    if (!el) return;
    el.classList.remove('hl-correct');
  },

  // ── Procesamiento de steps ──────────────────────────────────────
  //
  // computeSteps(measure) — agrupa notas simultáneas por beat.
  //
  // measure = { treble: [{midi,beat,duration}, ...], bass: [...] }
  // return  = [{ beat, notes: [{midi, staff, duration}, ...] }, ...] ordenado por beat
  computeSteps(measure, clefFilter = 'both') {
    const map = new Map();
    const add = (n, staff) => {
      const key = Math.round(n.beat * 100000);
      if (!map.has(key)) map.set(key, { beat: n.beat, notes: [] });
      map.get(key).notes.push({ ...n, staff });
    };

    if (clefFilter !== 'bass')   (measure.treble || []).forEach(n => add(n, 'treble'));
    if (clefFilter !== 'treble') (measure.bass   || []).forEach(n => add(n, 'bass'));

    return [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, v]) => v);
  },

  // Scroll horizontal para llevar al usuario a la zona donde tocan las
  // notas actuales (útil en mobile cuando el teclado es ancho).
  scrollToMidi(midi, smooth = true) {
    if (!this.container || !this.container.parentElement) return;
    const el = this.keyEl(midi);
    if (!el) return;
    const scroller = this.container.parentElement;   // .piano-scroll
    const target = el.offsetLeft - scroller.clientWidth / 2 + el.offsetWidth / 2;
    scroller.scrollTo({ left: Math.max(0, target), behavior: smooth ? 'smooth' : 'auto' });
  },
};
