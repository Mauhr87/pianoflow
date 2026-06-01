/**
 * PianoFlow — Practice Library  (v2: currículum por ejercicios)
 *
 * Organización: modo → técnica → ejercicio.
 *
 *   - modes      → eje principal (6 módulos, alineados a /curriculum).
 *   - techniques → tabs dentro del módulo.
 *   - exercises  → CADA ejercicio del currículum es 1 ítem del manifest,
 *                  agrupado por nivel (básico / intermedio / avanzado).
 *
 * Las 5 secciones de cada ejercicio (Preparación, Construcción, Desafío,
 * Aplicación, Cierre) NO son ítems: son la subdivisión interna de UN solo
 * ejercicio, generada por SessionGenerator.
 *
 * Cada ejercicio guarda los datos del currículum (acordes/progresión,
 * compases, explicación, nivel). El generador fiel al currículum es un
 * paso posterior; por ahora estos datos quedan disponibles para él.
 *
 * id de cada ítem:  `${mode}-${technique}-e${n}`
 *   ej: "chords-triads-e1"
 *
 * Niveles (Opción C — tonalidad atada al nivel):
 *   básico       → Do mayor / La menor   (0 alteraciones)
 *   intermedio   → Sol mayor / Mi menor  (1 sostenido)
 *   avanzado     → Re mayor / Si menor   (2 sostenidos)
 */

const PracticeLibrary = {

  // ── Modos (6 módulos del currículum) ────────────────────────────────

  modes: {

    // ── MÓDULO 1 — ACORDES ───────────────────────────────────────────
    chords: {
      label: 'Acordes',
      icon:  '🎹',
      desc:  'Armonía: construir y enlazar acordes dentro de canciones reales.',
      techniques: {

        // TÉCNICA 1 — TRIADAS
        triads: {
          label: 'Triadas', icon: '⏹',
          desc: 'Reconocer, construir y usar triadas mayores y menores.',
          pattern: 'bloque',
          exercises: [
            { n: 1,  level: 'basic', title: 'Triadas Mayores Básicas', chords: ['C','F','G'], bars: 8, explain: 'Las triadas mayores son la base de la armonía moderna.' },
            { n: 2,  level: 'basic', title: 'Triadas Menores Básicas', chords: ['Am','Dm','Em'], bars: 8, explain: 'Las triadas menores aportan un color más introspectivo que las mayores.' },
            { n: 3,  level: 'basic', title: 'Mayor y Menor', chords: ['C','Am','F','Dm'], bars: 8, explain: 'Escucha cómo cambia la emoción entre acordes mayores y menores.' },
            { n: 4,  level: 'basic', title: 'I–IV', chords: ['C','F'], bars: 8, explain: 'El movimiento entre tónica y subdominante aparece en miles de canciones.' },
            { n: 5,  level: 'basic', title: 'I–V', chords: ['C','G'], bars: 8, explain: 'La dominante genera tensión que busca volver a la tónica.' },
            { n: 6,  level: 'intermediate', title: 'I–V–vi–IV', chords: ['C','G','Am','F'], bars: 12, explain: 'Esta progresión aparece en innumerables canciones modernas.' },
            { n: 7,  level: 'intermediate', title: 'vi–IV–I–V', chords: ['Am','F','C','G'], bars: 12, explain: 'Comenzar en el relativo menor cambia el color emocional.' },
            { n: 8,  level: 'intermediate', title: 'I–IV–V', chords: ['C','F','G'], bars: 12, explain: 'Esta progresión es la base de gran parte de la música popular.' },
            { n: 9,  level: 'intermediate', title: 'Cambios más rápidos', chords: ['C','G','Am','F'], bars: 12, fastChanges: true, explain: 'El objetivo es reconocer los acordes con rapidez.' },
            { n: 10, level: 'intermediate', title: 'Tonalidad de G', chords: ['G','C','D','Em'], bars: 12, explain: 'Aprender nuevas tonalidades desarrolla flexibilidad.' },
            { n: 11, level: 'advanced', title: 'Tonalidad de D', chords: ['D','G','A','Bm'], bars: 16, explain: 'Las progresiones mantienen la misma lógica aunque cambie la tonalidad.' },
            { n: 12, level: 'advanced', title: 'Tonalidad de A', chords: ['A','D','E','F#m'], bars: 16, explain: 'Los mismos patrones aparecen en todas las tonalidades.' },
            { n: 13, level: 'advanced', title: 'Progresión Extendida', chords: ['C','G','Am','Em','F','C','Dm','G'], bars: 16, explain: 'Las canciones reales suelen durar más que una progresión de cuatro acordes.' },
            { n: 14, level: 'advanced', title: 'Cambio de Tonalidad', chords: ['C','F','G','C','G','C','D','G'], bars: 16, keyChange: true, explain: 'Algunas canciones cambian de tonalidad para generar interés.' },
            { n: 15, level: 'advanced', title: 'Dominio de Triadas', chords: ['C','Am','F','G','G','Em','C','D'], bars: 16, explain: 'Este ejercicio resume las habilidades desarrolladas en el nivel de triadas.' },
          ],
        },

        // TÉCNICA 2 — INVERSIONES
        inversions: {
          label: 'Inversiones', icon: '🔁',
          desc: 'Un mismo acorde en varias posiciones para reducir movimiento.',
          pattern: 'bloque',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primera Inversión', chords: ['C'], inv: 1, bars: 8, explain: 'La primera inversión coloca la tercera del acorde como nota más grave.' },
            { n: 2,  level: 'basic', title: 'Segunda Inversión', chords: ['C'], inv: 2, bars: 8, explain: 'La segunda inversión coloca la quinta del acorde como nota más grave.' },
            { n: 3,  level: 'basic', title: 'Comparación Visual', chords: ['C','G'], bars: 8, explain: 'El acorde sigue siendo el mismo aunque cambie la posición de las notas.' },
            { n: 4,  level: 'basic', title: 'Inversiones en C Mayor', chords: ['C','F','G','C'], bars: 8, useInversions: true, explain: 'Las inversiones permiten tocar la misma progresión de distintas maneras.' },
            { n: 5,  level: 'basic', title: 'Inversiones en G Mayor', chords: ['G','C','D','G'], bars: 8, useInversions: true, explain: 'Las inversiones funcionan igual en cualquier tonalidad.' },
            { n: 6,  level: 'intermediate', title: 'Inversión Más Cercana', chords: ['C','G','Am','F'], bars: 12, useInversions: true, explain: 'Algunas inversiones hacen que los cambios de acorde resulten más cómodos.' },
            { n: 7,  level: 'intermediate', title: 'I–V–vi–IV con Inversiones', chords: ['C','G','Am','F'], bars: 12, useInversions: true, explain: 'Las inversiones permiten tocar progresiones populares con menos movimiento.' },
            { n: 8,  level: 'intermediate', title: 'vi–IV–I–V con Inversiones', chords: ['Am','F','C','G'], bars: 12, useInversions: true, explain: 'Una misma progresión puede sentirse diferente según la inversión utilizada.' },
            { n: 9,  level: 'intermediate', title: 'Tonalidad de D', chords: ['D','G','A','Bm'], bars: 12, useInversions: true, explain: 'Las inversiones deben dominarse en cualquier tonalidad.' },
            { n: 10, level: 'intermediate', title: 'Tonalidad de A', chords: ['A','D','E','F#m'], bars: 12, useInversions: true, explain: 'Cada tonalidad presenta nuevas formas visuales sobre el teclado.' },
            { n: 11, level: 'advanced', title: 'Progresión de 6 Acordes', chords: ['C','G','Am','F','Dm','G'], bars: 16, useInversions: true, explain: 'Las inversiones ayudan a navegar progresiones más largas.' },
            { n: 12, level: 'advanced', title: 'Progresión de 8 Acordes', chords: ['C','G','Am','Em','F','C','Dm','G'], bars: 16, useInversions: true, explain: 'Las progresiones extensas requieren conocer bien las inversiones.' },
            { n: 13, level: 'advanced', title: 'Cambio de Tonalidad', chords: ['C','F','G','C','G','C','D','G'], bars: 16, useInversions: true, keyChange: true, explain: 'Las inversiones siguen siendo útiles aunque cambie la tonalidad.' },
            { n: 14, level: 'advanced', title: 'Mezcla Libre de Inversiones', chords: ['C','F','G','Am','F','G'], bars: 16, useInversions: true, explain: 'El objetivo es reconocer cualquier inversión sin detenerse a calcularla.' },
            { n: 15, level: 'advanced', title: 'Dominio de Inversiones', chords: ['C','Am','F','G','G','Em','C','D'], bars: 16, useInversions: true, explain: 'Este ejercicio resume todas las habilidades desarrolladas en la técnica de inversiones.' },
          ],
        },

        // TÉCNICA 3 — SÉPTIMAS
        sevenths: {
          label: 'Séptimas', icon: '🎷',
          desc: 'Maj7, m7 y dominante 7: sonoridades de pop, worship y balada.',
          pattern: 'bloque',
          exercises: [
            { n: 1,  level: 'basic', title: 'Maj7 Básico', chords: ['Cmaj7','Fmaj7','Gmaj7'], bars: 8, explain: 'Los acordes Maj7 tienen un sonido suave, amplio y moderno.' },
            { n: 2,  level: 'basic', title: 'm7 Básico', chords: ['Am7','Dm7','Em7'], bars: 8, explain: 'Los acordes m7 añaden profundidad al color menor.' },
            { n: 3,  level: 'basic', title: 'Dominante 7 Básico', chords: ['G7','D7','A7'], bars: 8, explain: 'Los acordes dominantes generan una sensación natural de resolución.' },
            { n: 4,  level: 'basic', title: 'Maj7 vs Triada', chords: ['C','Cmaj7','F','Fmaj7'], bars: 8, explain: 'La séptima añade color sin cambiar la función principal del acorde.' },
            { n: 5,  level: 'basic', title: 'm7 vs Triada', chords: ['Am','Am7','Dm','Dm7'], bars: 8, explain: 'Las séptimas suelen hacer que el acorde suene más rico y expresivo.' },
            { n: 6,  level: 'intermediate', title: 'Progresión con Maj7', chords: ['Cmaj7','Fmaj7','G','Cmaj7'], bars: 12, explain: 'Los Maj7 son muy comunes en baladas y piano moderno.' },
            { n: 7,  level: 'intermediate', title: 'Progresión con m7', chords: ['Am7','Dm7','G','C'], bars: 12, explain: 'Los m7 aportan continuidad y suavidad armónica.' },
            { n: 8,  level: 'intermediate', title: 'Dominantes en Contexto', chords: ['C','G7','C','F'], bars: 12, explain: 'El acorde dominante crea una sensación de llegada muy fuerte.' },
            { n: 9,  level: 'intermediate', title: 'Mezcla de Séptimas', chords: ['Cmaj7','Am7','D7','G'], bars: 12, explain: 'Cada tipo de séptima aporta un color diferente.' },
            { n: 10, level: 'intermediate', title: 'Tonalidad de G', chords: ['Gmaj7','Em7','Cmaj7','D7'], bars: 12, explain: 'Las séptimas deben dominarse en distintas tonalidades.' },
            { n: 11, level: 'advanced', title: 'Tonalidad de D', chords: ['Dmaj7','Bm7','Gmaj7','A7'], bars: 16, explain: 'Los mismos principios funcionan en cualquier tonalidad.' },
            { n: 12, level: 'advanced', title: 'Progresión Extendida', chords: ['Cmaj7','Am7','Dm7','G7','Em7','Fmaj7'], bars: 16, explain: 'Las séptimas son especialmente útiles en progresiones extensas.' },
            { n: 13, level: 'advanced', title: 'Dos Tonalidades', chords: ['Cmaj7','Fmaj7','G7','C','Gmaj7','Em7','D7','G'], bars: 16, keyChange: true, explain: 'Las séptimas mantienen su función aunque cambie la tonalidad.' },
            { n: 14, level: 'advanced', title: 'Inversiones + Séptimas', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 16, useInversions: true, explain: 'Las séptimas también pueden utilizar inversiones.' },
            { n: 15, level: 'advanced', title: 'Dominio de Séptimas', chords: ['Cmaj7','Am7','Dm7','G7','Gmaj7','Em7','A7','D'], bars: 16, useInversions: true, explain: 'Este ejercicio resume todas las habilidades desarrolladas en la técnica de séptimas.' },
          ],
        },

        // TÉCNICA 4 — EXTENSIONES BÁSICAS
        extensions: {
          label: 'Extensiones', icon: '✨',
          desc: 'Add9, Sus2 y Sus4: versiones más expresivas de acordes conocidos.',
          pattern: 'bloque',
          exercises: [
            { n: 1,  level: 'basic', title: 'Introducción al Add9', chords: ['Cadd9','Gadd9','Dadd9'], bars: 8, explain: 'El Add9 añade amplitud y modernidad sin cambiar la función principal del acorde.' },
            { n: 2,  level: 'basic', title: 'Triada vs Add9', chords: ['C','Cadd9','G','Gadd9'], bars: 8, explain: 'Escucha cómo la novena añade color y espacio al acorde.' },
            { n: 3,  level: 'basic', title: 'Introducción al Sus2', chords: ['Csus2','Dsus2','Gsus2'], bars: 8, explain: 'Los acordes Sus2 sustituyen la tercera por la segunda y generan una sensación abierta.' },
            { n: 4,  level: 'basic', title: 'Introducción al Sus4', chords: ['Csus4','Dsus4','Gsus4'], bars: 8, explain: 'Los acordes Sus4 sustituyen la tercera por la cuarta creando una sensación de espera.' },
            { n: 5,  level: 'basic', title: 'Sus2 vs Sus4', chords: ['Csus2','Csus4','Gsus2','Gsus4'], bars: 8, explain: 'Ambos acordes suspenden la tercera, pero generan colores distintos.' },
            { n: 6,  level: 'intermediate', title: 'Add9 en Progresiones', chords: ['Cadd9','Gadd9','Am','F'], bars: 12, explain: 'El Add9 aparece constantemente en piano moderno.' },
            { n: 7,  level: 'intermediate', title: 'Sus2 en Progresiones', chords: ['Csus2','Gsus2','Am','F'], bars: 12, explain: 'Los acordes suspendidos aportan movimiento sin cambiar la armonía principal.' },
            { n: 8,  level: 'intermediate', title: 'Sus4 en Progresiones', chords: ['Csus4','Gsus4','Am','F'], bars: 12, explain: 'Los Sus4 suelen utilizarse para generar tensión antes de resolver.' },
            { n: 9,  level: 'intermediate', title: 'Mezcla de Extensiones', chords: ['Cadd9','Gsus2','Dsus4','Am'], bars: 12, explain: 'Cada extensión aporta un color diferente a la progresión.' },
            { n: 10, level: 'intermediate', title: 'Tonalidad de G', chords: ['Gadd9','Csus2','Dsus4','Em'], bars: 12, explain: 'Las extensiones deben utilizarse en distintas tonalidades.' },
            { n: 11, level: 'advanced', title: 'Tonalidad de D', chords: ['Dadd9','Gsus2','Asus4','Bm'], bars: 16, explain: 'Las extensiones enriquecen cualquier tonalidad.' },
            { n: 12, level: 'advanced', title: 'Extensiones + Séptimas', chords: ['Cmaj7','Am7','Cadd9','Gsus2','Dsus4'], bars: 16, explain: 'Las extensiones funcionan muy bien junto a los acordes de séptima.' },
            { n: 13, level: 'advanced', title: 'Progresión Extendida', chords: ['Cadd9','Gsus2','Am7','Fmaj7','Dsus4','G','Em','C'], bars: 16, explain: 'Las extensiones permiten mantener el interés armónico durante progresiones largas.' },
            { n: 14, level: 'advanced', title: 'Dos Tonalidades', chords: ['Cadd9','Fmaj7','Gsus4','C','Gadd9','Csus2','D','Em'], bars: 16, keyChange: true, explain: 'Las extensiones conservan su función aunque cambie la tonalidad.' },
            { n: 15, level: 'advanced', title: 'Dominio de Extensiones', chords: ['Cadd9','Gsus2','Am7','Fmaj7','Dsus4','Cmaj7','G','C'], bars: 16, useInversions: true, explain: 'Este ejercicio resume todas las habilidades desarrolladas en la técnica de extensiones básicas.' },
          ],
        },

        // TÉCNICA 5 — APLICACIÓN MUSICAL
        application: {
          label: 'Aplicación Musical', icon: '🎶',
          desc: 'Usar todo lo aprendido dentro de mini canciones que se sienten reales.',
          pattern: 'bloque',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primer Paso', song: 'Primer Paso', chords: ['C','F','G','C'], bars: 8, explain: 'Esta pieza utiliza únicamente triadas en posición básica.' },
            { n: 2,  level: 'basic', title: 'Camino Abierto', song: 'Camino Abierto', chords: ['C','Am','F','G'], bars: 8, explain: 'Las canciones suelen combinar acordes mayores y menores.' },
            { n: 3,  level: 'basic', title: 'Horizonte', song: 'Horizonte', chords: ['C','G','Am','F'], bars: 8, explain: 'Muchas canciones modernas utilizan progresiones similares.' },
            { n: 4,  level: 'basic', title: 'Nuevo Comienzo', song: 'Nuevo Comienzo', chords: ['C','G','F','C'], bars: 8, explain: 'Repetir progresiones es una característica común de la música popular.' },
            { n: 5,  level: 'basic', title: 'Mini Canción Completa', song: 'Mini Canción', chords: ['C','G','Am','F','C'], bars: 8, explain: 'Esta pieza resume las habilidades básicas del módulo.' },
            { n: 6,  level: 'intermediate', title: 'Movimiento Suave', song: 'Movimiento Suave', chords: ['C','G','Am','F'], bars: 12, useInversions: true, explain: 'Las inversiones permiten que la progresión fluya mejor.' },
            { n: 7,  level: 'intermediate', title: 'Noche Serena', song: 'Noche Serena', chords: ['Am','F','C','G'], bars: 12, useInversions: true, explain: 'Las inversiones reducen movimientos innecesarios.' },
            { n: 8,  level: 'intermediate', title: 'Sendero', song: 'Sendero', chords: ['C','G','Am','F','Dm','G'], bars: 12, useInversions: true, explain: 'Una misma progresión puede sentirse diferente según las inversiones utilizadas.' },
            { n: 9,  level: 'intermediate', title: 'Viaje', song: 'Viaje', chords: ['C','G','Am','Em','F','C'], bars: 12, explain: 'Las progresiones largas exigen reconocer acordes rápidamente.' },
            { n: 10, level: 'intermediate', title: 'Mini Canción Intermedia', song: 'Mini Canción Intermedia', chords: ['C','G','Am','F','C','G','C'], bars: 12, useInversions: true, explain: 'Esta pieza resume las habilidades del nivel intermedio.' },
            { n: 11, level: 'advanced', title: 'Color Nuevo', song: 'Color Nuevo', chords: ['Cmaj7','Am7','F','G'], bars: 16, explain: 'Las séptimas añaden profundidad y sofisticación.' },
            { n: 12, level: 'advanced', title: 'Balada Moderna', song: 'Balada Moderna', chords: ['Cmaj7','Am7','Dm7','G7'], bars: 16, explain: 'Las séptimas son fundamentales en muchas baladas modernas.' },
            { n: 13, level: 'advanced', title: 'Sonido Contemporáneo', song: 'Sonido Contemporáneo', chords: ['Cadd9','Gsus4','Am7','Fmaj7'], bars: 16, explain: 'Las extensiones aportan un sonido moderno y expresivo.' },
            { n: 14, level: 'advanced', title: 'Piano Moderno', song: 'Piano Moderno', chords: ['Cmaj7','Am7','Fmaj7','Gsus4','Dm7','G'], bars: 20, useInversions: true, explain: 'Esta pieza utiliza el vocabulario armónico completo del módulo.' },
            { n: 15, level: 'advanced', title: 'Proyecto Final', song: 'Proyecto Final', chords: ['Cmaj7','Am7','F','G','Cadd9','Em7','Dm7','G'], bars: 20, useInversions: true, keyChange: true, explain: 'Esta pieza integra todas las habilidades desarrolladas durante el módulo de acordes.' },
          ],
        },

      },
    },

    // ── MÓDULO 2 — ACOMPAÑAMIENTO (currículum por codificar) ──────────
    accompaniment: {
      label: 'Acompañamiento',
      icon:  '🎵',
      desc:  'Patrones de mano izquierda: bloque, vals, balada, octavas y bajos.',
      pending: true,
      techniques: {},
    },

    // ── MÓDULO 3 — ARPEGIOS (currículum por codificar) ────────────────
    arpeggios: {
      label: 'Arpegios',
      icon:  '🌊',
      desc:  'Mano derecha: figuras desplegadas del acorde.',
      pending: true,
      techniques: {},
    },

    // ── MÓDULO 4 — MELÓDICO / ESCALAS (currículum por codificar) ──────
    melodic: {
      label: 'Melódico / Escalas',
      icon:  '📈',
      desc:  'Escalas, frases y patrones melódicos aplicados a la música.',
      pending: true,
      techniques: {},
    },

    // ── MÓDULO 5 — COORDINACIÓN DE MANOS (carpeta vacía) ──────────────
    coordination: {
      label: 'Coordinación de manos',
      icon:  '🤝',
      desc:  'Independencia y diálogo entre las dos manos.',
      comingSoon: true,
      techniques: {},
    },

    // ── MÓDULO 6 — VOICINGS (carpeta vacía) ───────────────────────────
    voicings: {
      label: 'Voicings',
      icon:  '🎼',
      desc:  'Disposiciones modernas y voice leading.',
      comingSoon: true,
      techniques: {},
    },

  },

  // ── Estilos (referencia interna; el generador usa bpm/descripción) ──
  // Ya NO son eje de navegación. Sólo "Aplicación Musical" podrá tener
  // variantes por estilo en el futuro.

  styles: {
    worship: { label: 'Worship',      icon: '🙏', bpm: 75, description: 'Aire contemplativo, dejar respirar.' },
    pop:     { label: 'Pop / Balada', icon: '✨', bpm: 90, description: 'Pulso firme y melódico.' },
    hebrew:  { label: 'Hebreo',       icon: '🕎', bpm: 85, description: 'Tensión frigia, expresión modal.' },
  },

  defaultStyle: 'worship',

  // ── Niveles + tonalidad (Opción C) ──────────────────────────────────

  difficulties: {
    basic:        { label: 'Básico',     tonic: 'C', mode: 'major', rel: 'Am', sharps: 0, bpmFactor: 0.85, repeats: 4, description: 'Do mayor / La menor. Más lento, más repeticiones.' },
    intermediate: { label: 'Intermedio', tonic: 'G', mode: 'major', rel: 'Em', sharps: 1, bpmFactor: 1.00, repeats: 2, description: 'Sol mayor / Mi menor. Tempo base.' },
    advanced:     { label: 'Avanzado',   tonic: 'D', mode: 'major', rel: 'Bm', sharps: 2, bpmFactor: 1.10, repeats: 1, description: 'Re mayor / Si menor. Tempo elevado.' },
  },

  levelOrder: ['basic', 'intermediate', 'advanced'],

  // ── Estructura de la sesión (5 secciones) ───────────────────────────

  sections: [
    { key: 'prep',        label: 'Preparación',  bars: 4, note: 'Presentar la habilidad con mínimas variables.',           simplified: true },
    { key: 'build',       label: 'Construcción', bars: 6, note: 'Practicar la habilidad con una progresión sencilla.',     simplified: true },
    { key: 'challenge',   label: 'Desafío',      bars: 6, note: 'Integrar la habilidad en un contexto musical completo.',  simplified: false },
    { key: 'application', label: 'Aplicación',   bars: 6, note: 'Mostrar la habilidad dentro de una mini canción.',        simplified: false },
    { key: 'close',       label: 'Cierre',       bars: 2, note: 'Resolución y consolidación, sin material nuevo.',         simplified: true },
  ],

  // ── Utilidades ──────────────────────────────────────────────────────

  getMode(key)       { return this.modes[key] || null; },
  getStyle(key)      { return this.styles[key] || null; },
  getDifficulty(k)   { return this.difficulties[k] || null; },

  getTechnique(modeKey, techKey) {
    const m = this.modes[modeKey];
    return (m && m.techniques[techKey]) || null;
  },

  list(group) {
    return Object.entries(this[group] || {}).map(([key, value]) => ({ key, ...value }));
  },

  // ¿El modo tiene contenido jugable?
  modeReady(modeKey) {
    const m = this.modes[modeKey];
    if (!m) return false;
    return Object.values(m.techniques).some(t => (t.exercises || []).length);
  },

  // ── Manifest: un ítem por ejercicio ────────────────────────────────

  manifest: [],

  buildManifest() {
    const out = [];
    const style = this.styles[this.defaultStyle];

    Object.entries(this.modes).forEach(([modeKey, mode]) => {
      Object.entries(mode.techniques).forEach(([techKey, tech]) => {
        (tech.exercises || []).forEach(ex => {
          const diff = this.difficulties[ex.level];
          if (!diff) return;
          const bpm = Math.round(style.bpm * diff.bpmFactor);
          out.push({
            id:         `${modeKey}-${techKey}-e${ex.n}`,
            mode:       modeKey,
            technique:  techKey,
            n:          ex.n,
            level:      ex.level,
            difficulty: ex.level,          // nivel == difficulty (Opción C)
            style:      this.defaultStyle, // estilo interno por defecto
            pattern:    tech.pattern || 'bloque',
            title:      ex.title,
            song:       ex.song || null,
            chords:     ex.chords || [],
            bars:       ex.bars || diff.repeats * 4,
            explain:    ex.explain || '',
            meta:       { inv: ex.inv || 0, useInversions: !!ex.useInversions, fastChanges: !!ex.fastChanges, keyChange: !!ex.keyChange },
            icon:       mode.icon,
            techIcon:   tech.icon,
            bpm,
          });
        });
      });
    });

    this.manifest = out;
    return out;
  },

  // ── Helpers para la UI ────────────────────────────────────────────

  forMode(modeKey) {
    if (!this.manifest.length) this.buildManifest();
    return this.manifest.filter(p => p.mode === modeKey);
  },

  forTechnique(modeKey, techKey) {
    return this.forMode(modeKey).filter(p => p.technique === techKey);
  },

  byId(id) {
    if (!this.manifest.length) this.buildManifest();
    return this.manifest.find(p => p.id === id) || null;
  },

  countFor(modeKey) {
    return this.forMode(modeKey).length;
  },

  techniqueCount(modeKey) {
    const m = this.modes[modeKey];
    return m ? Object.keys(m.techniques).length : 0;
  },
};
