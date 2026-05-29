/**
 * PianoFlow — Practice Library  (Fase 1: mode-first + biblioteca)
 *
 * Organización nueva: modo × técnica × estilo × dificultad
 *
 *   - modes        → eje principal de navegación (5 modos). Cada modo
 *                    agrupa techniques (equivalente a los "goals" de DrumFlow).
 *   - techniques   → cada técnica × estilo × nivel = 1 ítem del manifest.
 *   - styles       → eje ortogonal (worship / pop / hebrew).
 *   - difficulties → nivel + tonalidad atada (Opción C): la tonalidad NO es
 *                    un selector aparte, viene determinada por el nivel.
 *
 * Cada técnica apunta a un `pattern` de PatternLibrary. Las técnicas cuyo
 * patrón dedicado aún no existe llevan `pending:true` y caen en 'bloque'
 * como patrón provisional (se completarán en la Fase 4 — generador).
 *
 * El id de cada ítem del manifest es:  `${mode}-${technique}-${style}-${difficulty}`
 * ej: "chords-block-worship-basic"
 */

const PracticeLibrary = {

  // ── Modos (eje principal / home) ─────────────────────────────────────

  modes: {

    chords: {
      label: 'Acordes',
      icon:  '🎹',
      desc:  'Armonía y acompañamiento: construir y enlazar acordes.',
      techniques: {
        block:       { label: 'Bloque',      icon: '⏹',  desc: 'Acorde completo a tiempos. Calentamiento ideal.',        pattern: 'bloque' },
        waltz:       { label: 'Vals / Balada', icon: '🎶', desc: 'Bajo + respiraciones de acorde. Aire ternario sobre 4/4.', pattern: 'vals_balada' },
        octaves:     { label: 'Octavas',     icon: '🎹', desc: 'LH alterna grave y octava; RH acorde en contratiempos.',  pattern: 'octavas_lh' },
        syncopation: { label: 'Síncopa',     icon: '🔀', desc: 'Acordes anticipados, acentos fuera del pulso.',           pattern: 'bloque', pending: true },
        inversions:  { label: 'Inversiones', icon: '🔁', desc: 'Cambios por voz más cercana usando inversiones.',         pattern: 'bloque', pending: true },
      },
    },

    arpeggios: {
      label: 'Arpegios',
      icon:  '🌊',
      desc:  'Mano derecha: figuras desplegadas del acorde.',
      techniques: {
        alberti:    { label: 'Alberti',          icon: '🌀', desc: 'Figura clásica grave-agudo-medio-agudo en corcheas.',     pattern: 'alberti' },
        wide:       { label: 'Amplio',           icon: '↗',  desc: 'Sube por las notas del acorde abriendo posición.',         pattern: 'arpegio_amplio' },
        ballad:     { label: 'Balada arpegiada', icon: '🌊', desc: 'Estilo Coldplay / worship: 1-3-5-8 repetido.',             pattern: 'arpegio_balada' },
        tenths:     { label: 'Décimas',          icon: '🎼', desc: 'Apertura LH a décimas bajo el arpegio.',                   pattern: 'arpegio_amplio', pending: true },
        crosshands: { label: 'Cruzados',         icon: '✋', desc: 'Manos cruzadas sobre el arpegio.',                         pattern: 'alberti', pending: true },
      },
    },

    melodic: {
      label: 'Melódico / Escalas',
      icon:  '🎵',
      desc:  'Escalas, modos y frases para soltar la mano.',
      techniques: {
        majorscale:  { label: 'Escala mayor',     icon: '📈', desc: 'Escala mayor del nivel, ambas manos.',          pattern: 'bloque', pending: true },
        minorscale:  { label: 'Escala menor',     icon: '📉', desc: 'Escala menor relativa, ambas manos.',           pattern: 'bloque', pending: true },
        modes:       { label: 'Modos',            icon: '🌀', desc: 'Modos griegos sobre la tónica del nivel.',      pattern: 'bloque', pending: true },
        pentablues:  { label: 'Pentatónica / Blues', icon: '🎷', desc: 'Pentatónica y escala de blues.',             pattern: 'bloque', pending: true },
        hanon:       { label: 'Hanon',            icon: '💪', desc: 'Ejercicios Hanon para independencia y fuerza.', pattern: 'bloque', pending: true },
        phrases:     { label: 'Frases',           icon: '🗣', desc: 'Frases melódicas cortas sobre la armonía.',     pattern: 'bloque', pending: true },
      },
    },

    coordination: {
      label: 'Coordinación de manos',
      icon:  '🤝',
      desc:  'Independencia y diálogo entre las dos manos.',
      techniques: {
        independence: { label: 'Independencia',  icon: '🤲', desc: 'Ostinato en LH mientras RH varía.',           pattern: 'ostinato_hebreo' },
        crosssync:    { label: 'Síncopa entre manos', icon: '🔀', desc: 'Acentos cruzados, una mano anticipa a la otra.', pattern: 'octavas_lh', pending: true },
        polyrhythm:   { label: 'Polirritmia 2-vs-3', icon: '🌀', desc: 'Dos contra tres entre las manos.',          pattern: 'bloque', pending: true },
      },
    },

    sightreading: {
      label: 'Lectura a primera vista',
      icon:  '👁',
      desc:  'Piezas progresivas con seguimiento nota a nota.',
      techniques: {
        progressive: { label: 'Piezas progresivas', icon: '📖', desc: 'Piezas que suben de dificultad gradualmente.', pattern: 'bloque', pending: true },
        follow:      { label: 'Modo follow',         icon: '👁', desc: 'Seguimiento del playhead nota a nota.',         pattern: 'bloque', pending: true },
      },
    },

  },

  // ── Estilos (eje ortogonal) ─────────────────────────────────────────

  styles: {
    worship: { label: 'Worship',      icon: '🙏', bpm: 75, description: 'Aire contemplativo, dejar respirar.' },
    pop:     { label: 'Pop / Balada', icon: '✨', bpm: 90, description: 'Pulso firme y melódico.' },
    hebrew:  { label: 'Hebreo',       icon: '🕎', bpm: 85, description: 'Tensión frigia, expresión modal.' },
  },

  // ── Dificultades + tonalidad (Opción C) ─────────────────────────────
  //
  // Un único camino lineal. La tonalidad sale del nivel; el generador
  // usará `tonic`/`sharps` para transponer (Fase 4).
  //   básico       → Do mayor / La menor   (0 alteraciones)
  //   intermedio   → Sol mayor / Mi menor  (1 sostenido)
  //   avanzado     → Re mayor / Si menor   (2 sostenidos)

  difficulties: {
    basic:        { label: 'Básico',     tonic: 'C', mode: 'major', rel: 'Am', sharps: 0, bpmFactor: 0.85, repeats: 4, description: 'Do mayor / La menor. Más lento, más repeticiones.' },
    intermediate: { label: 'Intermedio', tonic: 'G', mode: 'major', rel: 'Em', sharps: 1, bpmFactor: 1.00, repeats: 2, description: 'Sol mayor / Mi menor. Tempo base.' },
    advanced:     { label: 'Avanzado',   tonic: 'D', mode: 'major', rel: 'Bm', sharps: 2, bpmFactor: 1.10, repeats: 1, description: 'Re mayor / Si menor. Tempo elevado.' },
  },

  // ── Estructura de la sesión (5 secciones) ───────────────────────────

  sections: [
    { key: 'prep',        label: 'Preparación',  bars: 4, note: 'Calentamiento sobre 1-2 acordes con patrón simple.', simplified: true },
    { key: 'build',       label: 'Construcción', bars: 6, note: 'Progresión completa, patrón aún simplificado.',       simplified: true },
    { key: 'challenge',   label: 'Desafío',      bars: 6, note: 'Patrón completo. Es el corazón de la práctica.',      simplified: false },
    { key: 'application', label: 'Aplicación',   bars: 6, note: 'Mismo patrón con cambios más fluidos.',               simplified: false },
    { key: 'close',       label: 'Cierre',       bars: 2, note: 'Resolución armónica. Respira y cierra.',              simplified: true },
  ],

  // ── Utilidades ──────────────────────────────────────────────────────

  getMode(key)       { return this.modes[key] || null; },
  getStyle(key)      { return this.styles[key] || null; },
  getDifficulty(k)   { return this.difficulties[k] || null; },

  // Técnica concreta dentro de un modo
  getTechnique(modeKey, techKey) {
    const m = this.modes[modeKey];
    return (m && m.techniques[techKey]) || null;
  },

  // Lista [{ key, ...value }] de un grupo de primer nivel (styles, difficulties)
  list(group) {
    return Object.entries(this[group] || {}).map(([key, value]) => ({ key, ...value }));
  },

  // ── Manifest: catálogo plano de prácticas pre-armadas ─────────────
  //
  // Producto cartesiano modes → techniques → styles → difficulties.
  // Cada ítem es una "pista" lista para reproducir.
  //
  // Estructura por ítem:
  //   { id, mode, technique, style, difficulty,
  //     pattern, pending, title, subtitle, icon, styleIcon, techIcon, bpm }

  manifest: [],

  buildManifest() {
    const out = [];
    Object.entries(this.modes).forEach(([modeKey, mode]) => {
      Object.entries(mode.techniques).forEach(([techKey, tech]) => {
        // Una técnica puede restringir estilos vía tech.styles (opcional).
        const styleKeys = tech.styles || Object.keys(this.styles);
        styleKeys.forEach(styleKey => {
          const style = this.styles[styleKey];
          if (!style) return;
          Object.entries(this.difficulties).forEach(([diffKey, diff]) => {
            const bpm = Math.round(style.bpm * diff.bpmFactor);
            out.push({
              id:         `${modeKey}-${techKey}-${styleKey}-${diffKey}`,
              mode:       modeKey,
              technique:  techKey,
              style:      styleKey,
              difficulty: diffKey,
              pattern:    tech.pattern || 'bloque',
              pending:    !!tech.pending,
              title:      `${tech.label} · ${diff.label}`,
              subtitle:   `${style.label} · ${bpm} BPM`,
              icon:       mode.icon,
              styleIcon:  style.icon,
              techIcon:   tech.icon,
              bpm,
            });
          });
        });
      });
    });
    this.manifest = out;
    return out;
  },

  // ── Helpers para la UI ────────────────────────────────────────────

  // Todos los ítems de un modo (submanifest)
  forMode(modeKey) {
    if (!this.manifest.length) this.buildManifest();
    return this.manifest.filter(p => p.mode === modeKey);
  },

  // Un ítem por su id
  byId(id) {
    if (!this.manifest.length) this.buildManifest();
    return this.manifest.find(p => p.id === id) || null;
  },

  // Total de prácticas en un modo
  countFor(modeKey) {
    return this.forMode(modeKey).length;
  },
};
