/**
 * PianoFlow — Chord Library
 *
 * Cada acorde define cuatro cosas:
 *
 *   rootBass : MIDI del bajo principal (típicamente C2–B2)
 *   altBass  : MIDI del bajo alternado (la quinta o tercera, para Travis y vals)
 *   rhTriad  : voicing cerrado de RH en octava 4 (3 o 4 notas)
 *   tones    : todas las notas del acorde repartidas en 2–3 octavas, ordenadas
 *              ascendente. Las patrones piden indices de este array para
 *              construir arpegios amplios o cascadas.
 *
 * Octavas MIDI:
 *   C2=36, C3=48, C4=60 (do central), C5=72, C6=84
 */

const ChordLibrary = {

  // ── Familia: Abierto Do (C/F/G/Am/Dm/Em) ────────────────────────────

  'C':  { label: 'C',  name: 'Do mayor',
    rootBass: 36, altBass: 43,
    rhTriad: [60, 64, 67],
    tones:   [48, 52, 55, 60, 64, 67, 72, 76, 79] },

  'F':  { label: 'F',  name: 'Fa mayor',
    rootBass: 41, altBass: 48,
    rhTriad: [60, 65, 69],
    tones:   [53, 57, 60, 65, 69, 72, 77, 81] },

  'G':  { label: 'G',  name: 'Sol mayor',
    rootBass: 43, altBass: 50,
    rhTriad: [59, 62, 67],
    tones:   [55, 59, 62, 67, 71, 74, 79] },

  'Am': { label: 'Am', name: 'La menor',
    rootBass: 45, altBass: 52,
    rhTriad: [57, 60, 64],
    tones:   [45, 52, 57, 60, 64, 69, 72, 76, 81] },

  'Dm': { label: 'Dm', name: 'Re menor',
    rootBass: 38, altBass: 45,
    rhTriad: [62, 65, 69],
    tones:   [50, 53, 57, 62, 65, 69, 74, 77, 81] },

  'Em': { label: 'Em', name: 'Mi menor',
    rootBass: 40, altBass: 47,
    rhTriad: [64, 67, 71],
    tones:   [52, 55, 59, 64, 67, 71, 76, 79, 83] },

  // ── Familia: Abierto Sol (G/D/A/Em/Bm) ──────────────────────────────

  'D':  { label: 'D',  name: 'Re mayor',
    rootBass: 38, altBass: 45,
    rhTriad: [62, 66, 69],
    tones:   [50, 54, 57, 62, 66, 69, 74, 78, 81] },

  'A':  { label: 'A',  name: 'La mayor',
    rootBass: 45, altBass: 52,
    rhTriad: [57, 61, 64],
    tones:   [45, 52, 57, 61, 64, 69, 73, 76, 81] },

  'Bm': { label: 'Bm', name: 'Si menor',
    rootBass: 47, altBass: 54,
    rhTriad: [59, 62, 66],
    tones:   [47, 54, 59, 62, 66, 71, 74, 78, 83] },

  // ── Familia: Worship moderno ────────────────────────────────────────

  'Csus2': { label: 'Csus2', name: 'Do sus2',
    rootBass: 36, altBass: 43,
    rhTriad: [60, 62, 67],
    tones:   [48, 50, 55, 60, 62, 67, 72, 74, 79] },

  'Cadd9': { label: 'Cadd9', name: 'Do add9',
    rootBass: 36, altBass: 43,
    rhTriad: [60, 64, 67, 74],
    tones:   [48, 50, 52, 55, 60, 62, 64, 67, 72, 74, 76, 79] },

  'Gsus4': { label: 'Gsus4', name: 'Sol sus4',
    rootBass: 43, altBass: 50,
    rhTriad: [55, 60, 62],
    tones:   [43, 50, 55, 60, 62, 67, 72, 74, 79] },

  'Em7':   { label: 'Em7', name: 'Mi menor 7',
    rootBass: 40, altBass: 47,
    rhTriad: [64, 67, 71, 74],
    tones:   [40, 47, 52, 55, 59, 62, 64, 67, 71, 74, 76, 79, 83] },

  'Dsus2': { label: 'Dsus2', name: 'Re sus2',
    rootBass: 38, altBass: 45,
    rhTriad: [62, 64, 69],
    tones:   [38, 45, 50, 52, 57, 62, 64, 69, 74, 76, 81] },

  'F/C':   { label: 'F/C', name: 'Fa con bajo Do',
    rootBass: 36, altBass: 41,
    rhTriad: [65, 69, 72],
    tones:   [36, 41, 48, 53, 57, 60, 65, 69, 72] },

  // ── Familia: Hebreo / menor ────────────────────────────────────────

  // E mayor (dominante en frigia sobre Am) — tensión hacia Am
  'E':   { label: 'E', name: 'Mi mayor (dominante)',
    rootBass: 40, altBass: 47,
    rhTriad: [64, 68, 71],
    tones:   [40, 47, 52, 56, 59, 64, 68, 71, 76, 80, 83] },

  'Am7': { label: 'Am7', name: 'La menor 7',
    rootBass: 45, altBass: 52,
    rhTriad: [57, 60, 64, 67],
    tones:   [45, 52, 57, 60, 64, 67, 69, 72, 76, 79, 81] },

  // ── Familia: Séptimas pop ──────────────────────────────────────────

  'Cmaj7': { label: 'Cmaj7', name: 'Do mayor 7',
    rootBass: 36, altBass: 43,
    rhTriad: [60, 64, 67, 71],
    tones:   [48, 52, 55, 59, 60, 64, 67, 71, 72, 76, 79] },

  'Dm7':   { label: 'Dm7', name: 'Re menor 7',
    rootBass: 38, altBass: 45,
    rhTriad: [62, 65, 69, 72],
    tones:   [50, 53, 57, 60, 62, 65, 69, 72, 74, 77, 81] },

  'G7':    { label: 'G7', name: 'Sol 7',
    rootBass: 43, altBass: 50,
    rhTriad: [55, 59, 62, 65],
    tones:   [43, 50, 55, 59, 62, 65, 67, 71, 74, 77, 79] },

  'Fmaj7': { label: 'Fmaj7', name: 'Fa mayor 7',
    rootBass: 41, altBass: 48,
    rhTriad: [60, 64, 65, 69],
    tones:   [41, 48, 53, 57, 60, 64, 65, 69, 72, 76, 77, 81] },

};

// ── Utilidades ──────────────────────────────────────────────────────

ChordLibrary.get = function (label) {
  return this[label] || null;
};

// Devuelve los nombres de las notas del acorde para mostrar en panel.
ChordLibrary.spelling = function (label) {
  const c = this.get(label);
  if (!c) return [];
  const names = new Set();
  c.rhTriad.forEach(midi => names.add(noteLetter(midi)));
  return [...names];
};

// MIDI → letra (sin octava)
function noteLetter(midi) {
  const NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  return NAMES[((midi % 12) + 12) % 12];
}

// MIDI → nombre con octava (C4, A#3, etc.) — útil para debug
function noteFullName(midi) {
  const oct = Math.floor(midi / 12) - 1;
  return noteLetter(midi) + oct;
}

// Exponer helpers globalmente (sin contaminar mucho)
window.PianoNotes = { letter: noteLetter, full: noteFullName };
