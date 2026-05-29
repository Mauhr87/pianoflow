/**
 * PianoFlow — Pattern Library
 *
 * Cada patrón es una receta de compás (4/4) compuesta por slots.
 * Un slot indica qué se toca con cada mano y cuánto dura:
 *
 *   { lh: <recipe>, rh: <recipe>, dur: <beats> }
 *
 * El "recipe" es una etiqueta que session-generator resuelve a notas MIDI
 * concretas usando el ChordLibrary:
 *
 *   'root'      → chord.rootBass
 *   'fifth'     → chord.altBass (quinta o tercera, según acorde)
 *   'root+12'   → chord.rootBass + 12  (octava arriba — para octavas_lh)
 *   'triad'     → chord.rhTriad  (las 3-4 notas de RH simultáneas)
 *   't0'..'t9'  → chord.tones[N]  (nota individual, índice en tones)
 *
 * Si un slot no menciona `lh` o `rh`, no se toca nada en esa mano
 * (las notas previas continúan sonando hasta el siguiente ataque o el
 * final del compás).
 *
 * `dur` se expresa en pulsos de negra: 1 = negra, 0.5 = corchea.
 */

const PatternLibrary = {

  // ── Bloque — el más simple. Calentamiento. ─────────────────────────
  bloque: {
    label: 'Bloque',
    icon: '⏹',
    desc: 'Acorde completo a tiempos 1 y 3. Calentamiento ideal.',
    sequence: [
      { lh: 'root',  rh: 'triad', dur: 1 },
      {                          dur: 1 },
      { lh: 'fifth', rh: 'triad', dur: 1 },
      {                          dur: 1 },
    ],
  },

  // ── Vals balada (4/4 con sensación 1-2-3) ──────────────────────────
  vals_balada: {
    label: 'Vals balada',
    icon: '🎶',
    desc: 'Bajo + dos respiraciones de acorde. Aire ternario sobre 4/4.',
    sequence: [
      { lh: 'root',  dur: 1 },
      { rh: 'triad', dur: 1 },
      { lh: 'fifth', rh: 'triad', dur: 1 },
      { rh: 'triad', dur: 1 },
    ],
  },

  // ── Alberti — figura clásica de LH ─────────────────────────────────
  alberti: {
    label: 'Alberti',
    icon: '🌀',
    desc: 'LH alterna grave-agudo-medio-agudo en corcheas. RH sostiene acorde.',
    sequence: [
      { lh: 't0', rh: 'triad', dur: 0.5 },
      { lh: 't2',              dur: 0.5 },
      { lh: 't1',              dur: 0.5 },
      { lh: 't2',              dur: 0.5 },
      { lh: 't0',              dur: 0.5 },
      { lh: 't2',              dur: 0.5 },
      { lh: 't1',              dur: 0.5 },
      { lh: 't2',              dur: 0.5 },
    ],
  },

  // ── Arpegio amplio ascendente — abre la posición ──────────────────
  arpegio_amplio: {
    label: 'Arpegio amplio',
    icon: '↗',
    desc: 'Sube por las notas del acorde abriendo posición. Sensación luminosa.',
    sequence: [
      { lh: 'root',  rh: 't3', dur: 0.5 },
      {              rh: 't4', dur: 0.5 },
      {              rh: 't5', dur: 0.5 },
      {              rh: 't6', dur: 0.5 },
      { lh: 'fifth', rh: 't7', dur: 0.5 },
      {              rh: 't6', dur: 0.5 },
      {              rh: 't5', dur: 0.5 },
      {              rh: 't4', dur: 0.5 },
    ],
  },

  // ── Arpegio balada — estilo Coldplay / Yiruma / worship ───────────
  arpegio_balada: {
    label: 'Arpegio balada',
    icon: '🌊',
    desc: 'Estilo Coldplay / worship: 1-3-5-8 repetido. LH sostiene el bajo.',
    sequence: [
      { lh: 'root',  rh: 't3', dur: 0.5 },   // raíz (octava)
      {              rh: 't4', dur: 0.5 },   // tercera
      {              rh: 't5', dur: 0.5 },   // quinta
      {              rh: 't6', dur: 0.5 },   // octava arriba
      { lh: 'fifth', rh: 't3', dur: 0.5 },
      {              rh: 't4', dur: 0.5 },
      {              rh: 't5', dur: 0.5 },
      {              rh: 't6', dur: 0.5 },
    ],
  },

  // ── Octavas LH — pulso firme tipo pop ──────────────────────────────
  octavas_lh: {
    label: 'Octavas LH',
    icon: '🎹',
    desc: 'LH alterna grave y octava arriba. RH acorde en contratiempos.',
    sequence: [
      { lh: 'root',     dur: 0.5 },
      { rh: 'triad',    dur: 0.5 },
      { lh: 'root+12',  dur: 0.5 },
      { rh: 'triad',    dur: 0.5 },
      { lh: 'root',     dur: 0.5 },
      { rh: 'triad',    dur: 0.5 },
      { lh: 'fifth',    dur: 0.5 },
      { rh: 'triad',    dur: 0.5 },
    ],
  },

  // ── Ostinato hebreo — figura repetitiva LH, sabor frigio ──────────
  ostinato_hebreo: {
    label: 'Ostinato hebreo',
    icon: '🕎',
    desc: 'Figura LH grave-medio repetida. RH sostiene armonía con tensión frigia.',
    sequence: [
      { lh: 't0', rh: 'triad', dur: 0.5 },
      { lh: 't1',              dur: 0.5 },
      { lh: 't0',              dur: 0.5 },
      { lh: 't1',              dur: 0.5 },
      { lh: 't0',              dur: 0.5 },
      { lh: 't1',              dur: 0.5 },
      { lh: 't0',              dur: 0.5 },
      { lh: 't1',              dur: 0.5 },
    ],
  },

};

// ── Catálogo por estilo: qué patrones se ofrecen por defecto ──────

PatternLibrary.byStyle = {
  worship: ['arpegio_balada', 'bloque', 'arpegio_amplio', 'vals_balada'],
  pop:     ['bloque', 'octavas_lh', 'arpegio_balada', 'alberti'],
  hebrew:  ['ostinato_hebreo', 'bloque', 'arpegio_amplio', 'alberti'],
};

PatternLibrary.list = function () {
  return Object.keys(this).filter(k =>
    typeof this[k] === 'object' && this[k].sequence
  );
};

PatternLibrary.get = function (key) {
  const p = this[key];
  return (p && p.sequence) ? p : null;
};

// Versión simplificada (bloque) — usada en sección Preparación
// independientemente del patrón elegido. El alumno entra suave.
PatternLibrary.simplifiedSequence = function () {
  return this.bloque.sequence;
};
