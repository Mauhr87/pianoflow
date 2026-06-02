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

function makeVoicingExercises(rows) {
  return rows.map(row => ({
    n: row[0],
    level: row[1],
    title: row[2],
    chords: row[3],
    bars: row[4],
    voicingPattern: row[5],
    voicingTexture: row[6],
    voicingResource: row[7],
    voicingColor: row[8] || '',
    explain: row[9],
    useInversions: /inversion|minimo|superior|abierto|moderno|profesional|dominio/i.test(row[5] + ' ' + row[7]),
  }));
}

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
            { n: 9,  level: 'intermediate', title: 'Cambios más rápidos', chords: ['G','D','Em','C'], bars: 12, fastChanges: true, explain: 'Practicas cambios de acorde más frecuentes sin perder la función de la progresión.' },
            { n: 10, level: 'intermediate', title: 'Tonalidad de G', chords: ['G','C','D','Em'], bars: 12, explain: 'Aprender nuevas tonalidades desarrolla flexibilidad.' },
            { n: 11, level: 'advanced', title: 'Tonalidad de D', chords: ['D','G','A','Bm'], bars: 16, explain: 'Las progresiones mantienen la misma lógica aunque cambie la tonalidad.' },
            { n: 12, level: 'advanced', title: 'Tonalidad de A', chords: ['A','D','E','F#m'], bars: 16, explain: 'Los mismos patrones aparecen en todas las tonalidades.' },
            { n: 13, level: 'advanced', title: 'Progresión Extendida', chords: ['C','G','Am','Em','F','C','Dm','G'], bars: 16, explain: 'Las canciones reales suelen durar más que una progresión de cuatro acordes.' },
            { n: 14, level: 'advanced', title: 'Cambio de Tonalidad', chords: ['C','F','G','C','G','C','D','G'], bars: 16, keyChange: true, explain: 'Algunas canciones cambian de tonalidad para generar interés.' },
            { n: 15, level: 'advanced', title: 'Triadas en Dos Tonalidades', chords: ['C','G','Am','F','D','A','Bm','G'], bars: 16, explain: 'Integras triadas mayores y menores en dos regiones tonales con sensación de pieza breve.' },
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
            { n: 11, level: 'advanced', title: 'Progresión de 6 Acordes', chords: ['D','A','Bm','G','Em','A'], bars: 16, useInversions: true, explain: 'Usas inversiones para recorrer una progresión larga sin saltar por todo el teclado.' },
            { n: 12, level: 'advanced', title: 'Progresión de 8 Acordes', chords: ['G','D','Em','C','D','A','Bm','G'], bars: 16, useInversions: true, explain: 'Mantienes orientación visual cuando la progresión cambia de zona tonal.' },
            { n: 13, level: 'advanced', title: 'Cambio de Tonalidad', chords: ['C','F','G','C','G','C','D','G'], bars: 16, useInversions: true, keyChange: true, explain: 'Las inversiones siguen siendo útiles aunque cambie la tonalidad.' },
            { n: 14, level: 'advanced', title: 'Mezcla Libre de Inversiones', chords: ['C','F','G','Am','F','G'], bars: 16, useInversions: true, explain: 'El objetivo es reconocer cualquier inversión sin detenerse a calcularla.' },
            { n: 15, level: 'advanced', title: 'Inversiones en Dos Tonalidades', chords: ['C','G','Am','F','D','A','Bm','G'], bars: 16, useInversions: true, explain: 'Conectas acordes de dos tonalidades usando inversiones para que la mano avance con poco movimiento.' },
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
            { n: 15, level: 'advanced', title: 'Séptimas en Dos Tonalidades', chords: ['Cmaj7','Am7','Dm7','G7','Gmaj7','Em7','Cmaj7','D7'], bars: 16, useInversions: true, explain: 'Combinas Maj7, m7 y dominante 7 en una progresión larga con cambios de color claros.' },
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
            { n: 15, level: 'advanced', title: 'Extensiones en Contexto', chords: ['Cadd9','Gsus2','Am7','Fmaj7','Dsus4','Cmaj7','G','C'], bars: 16, useInversions: true, explain: 'Usas add9, sus y séptimas para colorear una progresión sin perder su dirección armónica.' },
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
            { n: 3,  level: 'basic', title: 'Horizonte', song: 'Horizonte', chords: ['G','D','Em','C'], bars: 8, explain: 'Muchas canciones modernas usan la misma lógica armónica en distintas tonalidades.' },
            { n: 4,  level: 'basic', title: 'Nuevo Comienzo', song: 'Nuevo Comienzo', chords: ['C','G','F','C'], bars: 8, explain: 'Repetir progresiones es una característica común de la música popular.' },
            { n: 5,  level: 'basic', title: 'Mini Canción Completa', song: 'Mini Canción', chords: ['C','F','Am','G','C'], bars: 8, explain: 'Integra triadas mayores y menores en una forma breve con llegada clara a la tónica.' },
            { n: 6,  level: 'intermediate', title: 'Movimiento Suave', song: 'Movimiento Suave', chords: ['G','D','Em','C'], bars: 12, useInversions: true, explain: 'Las inversiones permiten que una progresión pop fluya con menos saltos entre acordes.' },
            { n: 7,  level: 'intermediate', title: 'Noche Serena', song: 'Noche Serena', chords: ['Am','F','C','G'], bars: 12, useInversions: true, explain: 'Las inversiones reducen movimientos innecesarios.' },
            { n: 8,  level: 'intermediate', title: 'Sendero', song: 'Sendero', chords: ['C','G','Am','F','Dm','G'], bars: 12, useInversions: true, explain: 'Una misma progresión puede sentirse diferente según las inversiones utilizadas.' },
            { n: 9,  level: 'intermediate', title: 'Viaje', song: 'Viaje', chords: ['C','G','Am','Em','F','C'], bars: 12, explain: 'Las progresiones largas exigen reconocer acordes rápidamente.' },
            { n: 10, level: 'intermediate', title: 'Mini Canción Intermedia', song: 'Mini Canción Intermedia', chords: ['G','D','Em','C','Am','D','G'], bars: 12, useInversions: true, explain: 'Integra triadas e inversiones en una mini canción con preparación, desarrollo y cierre.' },
            { n: 11, level: 'advanced', title: 'Color Nuevo', song: 'Color Nuevo', chords: ['Cmaj7','Am7','F','G'], bars: 16, explain: 'Las séptimas añaden profundidad y sofisticación.' },
            { n: 12, level: 'advanced', title: 'Balada Moderna', song: 'Balada Moderna', chords: ['Cmaj7','Am7','Dm7','G7'], bars: 16, explain: 'Las séptimas son fundamentales en muchas baladas modernas.' },
            { n: 13, level: 'advanced', title: 'Sonido Contemporáneo', song: 'Sonido Contemporáneo', chords: ['Cadd9','Gsus4','Am7','Fmaj7'], bars: 16, explain: 'Las extensiones aportan un sonido moderno y expresivo.' },
            { n: 14, level: 'advanced', title: 'Piano Moderno', song: 'Piano Moderno', chords: ['Cmaj7','Am7','Fmaj7','Gsus4','Dm7','G'], bars: 20, useInversions: true, explain: 'Esta pieza utiliza el vocabulario armónico completo del módulo.' },
            { n: 15, level: 'advanced', title: 'Proyecto Final', song: 'Proyecto Final', chords: ['Cmaj7','Am7','F','G','Dadd9','Bm7','Em7','A7'], bars: 20, useInversions: true, keyChange: true, explain: 'Integra triadas, inversiones, séptimas y extensiones en dos zonas tonales con forma de canción.' },
          ],
        },

      },
    },

    // ── MÓDULO 2 — ACOMPAÑAMIENTO ───────────────────────────────────
    accompaniment: {
      label: 'Acompañamiento',
      icon:  '🎵',
      desc:  'Patrones de mano izquierda: bloque, vals, balada, octavas y bajos.',
      techniques: {
        block: {
          label: 'Bloque', icon: '⏹',
          desc: 'Sostener canciones con fundamental en la mano izquierda y acordes completos en la derecha.',
          pattern: 'bloque',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primer Acompañamiento', chords: ['C','G','Am','F'], bars: 8, explain: 'Este es el formato más básico de acompañamiento.' },
            { n: 2,  level: 'basic', title: 'Mantener el Pulso', chords: ['G','D','Em','C'], bars: 8, explain: 'El acompañamiento debe sostener la canción sin distraer.' },
            { n: 3,  level: 'basic', title: 'Mayor y Menor', chords: ['C','Am','F','Dm'], bars: 8, explain: 'Los acordes mayores y menores crean distintas emociones.' },
            { n: 4,  level: 'basic', title: 'Dos Compases por Acorde', chords: ['C','G','Am','F'], bars: 8, holdChanges: true, explain: 'No todas las canciones cambian de acorde constantemente.' },
            { n: 5,  level: 'basic', title: 'Mini Canción Básica', chords: ['C','F','Am','G','C'], bars: 8, explain: 'Este ejercicio se acerca más a una canción real.' },
            { n: 6,  level: 'intermediate', title: 'Introducción de Inversiones', chords: ['C','G','Am','F'], bars: 12, useInversions: true, explain: 'Las inversiones permiten tocar progresiones con mayor comodidad.' },
            { n: 7,  level: 'intermediate', title: 'Fluidez Armónica', chords: ['G','D','Em','C'], bars: 12, useInversions: true, explain: 'Las inversiones ayudan a que el acompañamiento fluya.' },
            { n: 8,  level: 'intermediate', title: 'Tonalidad de D', chords: ['D','G','A','Bm'], bars: 12, useInversions: true, explain: 'El acompañamiento debe funcionar en cualquier tonalidad.' },
            { n: 9,  level: 'intermediate', title: 'Tonalidad de A', chords: ['A','D','E','F#m'], bars: 12, useInversions: true, explain: 'Cada tonalidad desarrolla nuevas referencias visuales.' },
            { n: 10, level: 'intermediate', title: 'Mini Canción Intermedia', chords: ['G','D','Em','C','Am','D','G'], bars: 12, useInversions: true, explain: 'Las inversiones permiten que la armonía se sienta más natural.' },
            { n: 11, level: 'advanced', title: 'Introducción de Séptimas', chords: ['Cmaj7','Am7','Dm7','G7'], bars: 16, useInversions: true, explain: 'Las séptimas enriquecen el sonido del acompañamiento.' },
            { n: 12, level: 'advanced', title: 'Sonido Contemporáneo', chords: ['Cadd9','Gsus2','Dsus4','Am'], bars: 16, useInversions: true, explain: 'Las extensiones aportan un sonido más moderno.' },
            { n: 13, level: 'advanced', title: 'Mezcla Completa', chords: ['Cmaj7','Am7','F','G','Cadd9','Dsus4'], bars: 16, useInversions: true, explain: 'Un buen acompañamiento utiliza diferentes recursos armónicos.' },
            { n: 14, level: 'advanced', title: 'Progresión Extendida', chords: ['D','A','Bm','G','Em','A','D'], bars: 16, useInversions: true, explain: 'Las canciones reales suelen contener progresiones más extensas.' },
            { n: 15, level: 'advanced', title: 'Acompañamiento en Bloque Completo', chords: ['Cmaj7','Am7','F','G','Dadd9','Bm7','Em7','A7'], bars: 16, useInversions: true, keyChange: true, explain: 'Integras triadas, inversiones, séptimas y extensiones dentro de un acompañamiento estable.' },
          ],
        },
        ternary: {
          label: 'Vals y Patrones Básicos', icon: '🎶',
          desc: 'Acompañamientos ternarios: bajo, acorde y respiración rítmica.',
          pattern: 'vals_balada',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primer Vals', chords: ['C','G','Am','F'], bars: 8, meter: '3/4', groove: 'waltz', explain: 'El vals enfatiza el primer tiempo del compás.' },
            { n: 2,  level: 'basic', title: 'Vals en C', chords: ['C','G','Am','F'], bars: 8, meter: '3/4', groove: 'waltz', explain: 'El objetivo es mantener un pulso constante.' },
            { n: 3,  level: 'basic', title: 'Vals en G', chords: ['G','D','Em','C'], bars: 8, meter: '3/4', groove: 'waltz', explain: 'El patrón permanece igual aunque cambie la tonalidad.' },
            { n: 4,  level: 'basic', title: 'Acordes Largos', chords: ['C','F','Am','G'], bars: 8, meter: '3/4', groove: 'waltz', holdChanges: true, explain: 'No todas las canciones cambian de acorde cada compás.' },
            { n: 5,  level: 'basic', title: 'Mini Vals', chords: ['C','G','Am','F','C'], bars: 8, meter: '3/4', groove: 'waltz', explain: 'Este ejercicio transforma el patrón en música.' },
            { n: 6,  level: 'intermediate', title: 'Introducción de la Quinta', chords: ['C','G','Am','F'], bars: 12, meter: '3/4', groove: 'waltz', useFifth: true, explain: 'La quinta fortalece el acompañamiento.' },
            { n: 7,  level: 'intermediate', title: 'Quinta en Movimiento', chords: ['G','D','Em','C'], bars: 12, meter: '3/4', groove: 'waltz', useFifth: true, explain: 'Las quintas ayudan a llenar el espacio sin complicar el patrón.' },
            { n: 8,  level: 'intermediate', title: 'Vals con Inversiones', chords: ['C','G','Am','F'], bars: 12, meter: '3/4', groove: 'waltz', useFifth: true, useInversions: true, explain: 'Las inversiones permiten cambios más cómodos.' },
            { n: 9,  level: 'intermediate', title: 'Sonido Más Rico', chords: ['Cmaj7','Am7','Fmaj7','G'], bars: 12, meter: '3/4', groove: 'waltz', useFifth: true, explain: 'Las séptimas enriquecen el acompañamiento.' },
            { n: 10, level: 'intermediate', title: 'Mini Canción Intermedia', chords: ['Gmaj7','Em7','C','D'], bars: 12, meter: '3/4', groove: 'waltz', useFifth: true, useInversions: true, explain: 'Este ejercicio combina acompañamiento y armonía moderna.' },
            { n: 11, level: 'advanced', title: 'Introducción al 6/8', chords: ['C','G','Am','F'], bars: 16, meter: '6/8', groove: 'sixEight', useFifth: true, explain: 'El 6/8 comparte movimiento ternario pero tiene una sensación distinta.' },
            { n: 12, level: 'advanced', title: 'Balada en 6/8', chords: ['Cadd9','G','Am','F'], bars: 16, meter: '6/8', groove: 'sixEight', useFifth: true, useInversions: true, explain: 'Muchas baladas modernas utilizan sensación de 6/8.' },
            { n: 13, level: 'advanced', title: 'Worship Ternario', chords: ['Dadd9','Asus4','Bm','Gsus2'], bars: 16, meter: '6/8', groove: 'sixEight', useFifth: true, useInversions: true, explain: 'Las extensiones aportan un sonido más contemporáneo.' },
            { n: 14, level: 'advanced', title: 'Cambio de Patrones', chords: ['Cmaj7','Am7','F','G','Dadd9','A'], bars: 16, meter: '3/4', groove: 'mixedTernary', useFifth: true, useInversions: true, explain: 'Un buen acompañante puede variar el patrón sin perder el pulso.' },
            { n: 15, level: 'advanced', title: 'Vals y Patrones Completos', chords: ['Cadd9','G','Am7','Fmaj7','Dsus4','G','C'], bars: 16, meter: '6/8', groove: 'mixedTernary', useFifth: true, useInversions: true, explain: 'Integras vals, 6/8, quintas, inversiones y colores modernos en dos secciones.' },
          ],
        },
        ballad: {
          label: 'Balada y Movimiento Suave', icon: '🕯',
          desc: 'Espacio, duración, pedal y pulsos suaves sin arpegiar.',
          pattern: 'bloque',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primeras Respiraciones', chords: ['C','G','Am','F'], bars: 8, groove: 'space', pedal: 'No utilizado', explain: 'Aprende a dejar que los acordes respiren.' },
            { n: 2,  level: 'basic', title: 'Espacio Musical', chords: ['C','F','Am','G'], bars: 8, groove: 'space', pedal: 'Opcional', explain: 'El silencio también forma parte de la música.' },
            { n: 3,  level: 'basic', title: 'Worship Básico', chords: ['G','D','Em','C'], bars: 8, groove: 'sustain', pedal: 'Opcional', explain: 'Los acordes sostenidos crean una sensación de amplitud.' },
            { n: 4,  level: 'basic', title: 'Balada Básica', chords: ['C','G','Am','F'], bars: 8, groove: 'softPulse', pedal: 'Opcional', explain: 'No necesitas muchas notas para acompañar bien.' },
            { n: 5,  level: 'basic', title: 'Mini Balada', chords: ['C','F','Am','G','C'], bars: 8, groove: 'space', pedal: 'Opcional', explain: 'Esta pieza utiliza espacio y duración para generar interés.' },
            { n: 6,  level: 'intermediate', title: 'Pulso Suave', chords: ['C','G','Am','F'], bars: 12, groove: 'softPulse', pedal: 'Recomendado', useInversions: true, explain: 'El movimiento puede surgir del ritmo y no de más notas.' },
            { n: 7,  level: 'intermediate', title: 'Balada Pop', chords: ['G','D','Em','C'], bars: 12, groove: 'popPulse', pedal: 'Recomendado', useInversions: true, explain: 'Las baladas modernas utilizan movimiento discreto y constante.' },
            { n: 8,  level: 'intermediate', title: 'Movimiento Controlado', chords: ['C','Am','F','G'], bars: 12, groove: 'gentleVariation', pedal: 'Recomendado', useInversions: true, explain: 'Pequeñas variaciones pueden transformar el acompañamiento.' },
            { n: 9,  level: 'intermediate', title: 'Dinámica', chords: ['Am','F','C','G'], bars: 12, groove: 'dynamic', pedal: 'Recomendado', useInversions: true, explain: 'La dinámica también forma parte del acompañamiento.' },
            { n: 10, level: 'intermediate', title: 'Mini Canción Intermedia', chords: ['G','D','Em','C','Am','D','G'], bars: 12, groove: 'dynamic', pedal: 'Recomendado', useInversions: true, explain: 'Esta pieza integra los recursos aprendidos hasta ahora.' },
            { n: 11, level: 'advanced', title: 'Pads de Piano', chords: ['Cmaj7','Am7','Fmaj7','G'], bars: 16, groove: 'pad', pedal: 'Esencial', useInversions: true, explain: 'Los pads de piano crean profundidad y espacio.' },
            { n: 12, level: 'advanced', title: 'Worship Moderno', chords: ['Cadd9','Gsus4','Am7','Fmaj7'], bars: 16, groove: 'pad', pedal: 'Esencial', useInversions: true, explain: 'Las extensiones y el pedal generan un sonido moderno.' },
            { n: 13, level: 'advanced', title: 'Balada Cinemática', chords: ['Dadd9','Bm7','Gmaj7','A7'], bars: 16, groove: 'cinematic', pedal: 'Esencial', useInversions: true, explain: 'El acompañamiento puede contar una historia sin melodía.' },
            { n: 14, level: 'advanced', title: 'Mezcla Worship + Pop', chords: ['Cmaj7','Am7','F','G','Dadd9','A'], bars: 16, groove: 'mixedBallad', pedal: 'Esencial', useInversions: true, explain: 'Un buen acompañante puede cambiar de enfoque según el momento.' },
            { n: 15, level: 'advanced', title: 'Balada y Movimiento Completo', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Em7','A7'], bars: 16, groove: 'mixedBallad', pedal: 'Esencial', useInversions: true, explain: 'Integras espacio, movimiento, dinámica y pedal en una balada completa.' },
          ],
        },
        leftHand: {
          label: 'Octavas y Bajo Alternado', icon: '🎹',
          desc: 'Recursos de mano izquierda para energía, presencia y movimiento.',
          pattern: 'octavas_lh',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primeras Octavas', chords: ['C','G','Am','F'], bars: 8, groove: 'octaves', useCase: 'Cuando necesitas dar más fuerza al acompañamiento.', explain: 'Las octavas hacen que la mano izquierda tenga más presencia.' },
            { n: 2,  level: 'basic', title: 'Octavas en C', chords: ['C','G','Am','F'], bars: 8, groove: 'octaves', useCase: 'Cuando una progresión simple necesita más peso.', explain: 'Las octavas pueden transformar una progresión simple.' },
            { n: 3,  level: 'basic', title: 'Octavas en G', chords: ['G','D','Em','C'], bars: 8, groove: 'octaves', useCase: 'Cuando quieres sostener energía en otra tonalidad.', explain: 'Las octavas deben sentirse naturales en cualquier tonalidad.' },
            { n: 4,  level: 'basic', title: 'Octavas + Inversiones', chords: ['C','G','Am','F'], bars: 8, groove: 'octaves', useInversions: true, useCase: 'Cuando la izquierda pesa más y la derecha debe moverse menos.', explain: 'Las inversiones ayudan a equilibrar el peso de las octavas.' },
            { n: 5,  level: 'basic', title: 'Mini Canción con Octavas', chords: ['C','F','Am','G','C'], bars: 8, groove: 'octaves', useCase: 'Cuando una mini pieza necesita una base fuerte.', explain: 'Este ejercicio utiliza octavas como recurso principal.' },
            { n: 6,  level: 'intermediate', title: 'Introducción a Fundamental + Quinta', chords: ['C','G','Am','F'], bars: 12, groove: 'fifths', useCase: 'Cuando deseas más movimiento sin aumentar la complejidad.', explain: 'La quinta aporta estabilidad y amplitud.' },
            { n: 7,  level: 'intermediate', title: 'Quinta sobre Progresiones', chords: ['G','D','Em','C'], bars: 12, groove: 'fifths', useCase: 'Cuando quieres llenar el bajo sin usar octavas constantes.', explain: 'Este patrón aparece constantemente en música moderna.' },
            { n: 8,  level: 'intermediate', title: 'Introducción al Bajo Alternado', chords: ['C','G','Am','F'], bars: 12, groove: 'alternatingBass', useCase: 'Cuando necesitas movimiento continuo en la mano izquierda.', explain: 'El bajo alternado genera movimiento continuo.' },
            { n: 9,  level: 'intermediate', title: 'Bajo Alternado sobre Progresiones', chords: ['D','A','Bm','G'], bars: 12, groove: 'alternatingBass', useCase: 'Cuando la progresión necesita empuje sin una línea de bajo compleja.', explain: 'El desafío es mantener estabilidad durante los cambios armónicos.' },
            { n: 10, level: 'intermediate', title: 'Mini Canción Intermedia', chords: ['C','G','Am','F','Dm','G','C'], bars: 12, groove: 'mixedLeft', useInversions: true, useCase: 'Cuando quieres cambiar la energía por secciones.', explain: 'Cada recurso aporta una energía diferente al acompañamiento.' },
            { n: 11, level: 'advanced', title: 'Elegir la Herramienta Correcta', chords: ['D','A','Bm','G','Em','A'], bars: 16, groove: 'mixedLeft', useInversions: true, useCase: 'Cuando cada sección pide una energía distinta.', explain: 'Cada técnica tiene un propósito musical diferente.' },
            { n: 12, level: 'advanced', title: 'Worship con Octavas', chords: ['Dadd9','Asus4','Bm7','Gsus2'], bars: 16, groove: 'octaves', useInversions: true, useCase: 'Cuando el worship necesita amplitud y base firme.', explain: 'Las octavas son muy comunes en worship contemporáneo.' },
            { n: 13, level: 'advanced', title: 'Piano Instrumental', chords: ['Cmaj7','Am7','Fmaj7','G','Dadd9','A'], bars: 16, groove: 'fifths', useInversions: true, useCase: 'Cuando buscas llenar el espacio sin tocar más acordes.', explain: 'Las octavas ayudan a llenar el espacio sin tocar más acordes.' },
            { n: 14, level: 'advanced', title: 'Cambio de Técnicas', chords: ['C','G','Am','F','D','A','Bm','G'], bars: 16, groove: 'mixedLeft', useInversions: true, useCase: 'Cuando una canción cambia de intensidad entre secciones.', explain: 'Un buen acompañante adapta la mano izquierda al momento musical.' },
            { n: 15, level: 'advanced', title: 'Octavas y Bajo Alternado Completo', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Em7','A7'], bars: 16, groove: 'mixedLeft', useInversions: true, useCase: 'Cuando deseas que la mano izquierda aporte energía y movimiento.', explain: 'Integras octavas, quinta, bajo alternado y colores armónicos en una pieza estable.' },
          ],
        },
        application: {
          label: 'Aplicación Musical', icon: '🎵',
          desc: 'Mini canciones de acompañamiento inspiradas en estilos reales.',
          pattern: 'bloque',
          exercises: [
            { n: 1,  level: 'basic', title: 'Worship Básico', song: 'Worship Básico', chords: ['C','G','Am','F'], bars: 8, groove: 'space', pedal: 'Opcional', explain: 'El worship suele priorizar espacio y estabilidad.' },
            { n: 2,  level: 'basic', title: 'Pop Básico', song: 'Pop Básico', chords: ['G','D','Em','C'], bars: 8, groove: 'blockPulse', explain: 'El pop busca claridad y consistencia.' },
            { n: 3,  level: 'basic', title: 'Balada Básica', song: 'Balada Básica', chords: ['C','F','Am','G'], bars: 8, groove: 'space', pedal: 'Opcional', explain: 'Las baladas utilizan espacio para reforzar la emoción.' },
            { n: 4,  level: 'basic', title: 'Piano Instrumental Básico', song: 'Piano Instrumental Básico', chords: ['C','Am','F','G','C'], bars: 8, groove: 'sustain', explain: 'El piano instrumental puede sostenerse únicamente con armonía.' },
            { n: 5,  level: 'basic', title: 'Hebreo Básico', song: 'Hebreo Básico', chords: ['Am','G','F','E'], bars: 8, meter: '3/4', groove: 'waltz', explain: 'Mucha música hebrea utiliza sensación de movimiento continuo.' },
            { n: 6,  level: 'intermediate', title: 'Worship Intermedio', song: 'Worship Intermedio', chords: ['Cadd9','G','Am7','F'], bars: 12, groove: 'softPulse', pedal: 'Recomendado', useInversions: true, explain: 'El worship moderno alterna estabilidad y movimiento.' },
            { n: 7,  level: 'intermediate', title: 'Pop Intermedio', song: 'Pop Intermedio', chords: ['G','D','Em','C','Am','D'], bars: 12, groove: 'popPulse', useInversions: true, explain: 'El pop moderno suele utilizar pulsos suaves y repetitivos.' },
            { n: 8,  level: 'intermediate', title: 'Balada Intermedia', song: 'Balada Intermedia', chords: ['Cmaj7','Am7','F','G'], bars: 12, groove: 'dynamic', pedal: 'Recomendado', useInversions: true, explain: 'La dinámica es una herramienta fundamental de las baladas.' },
            { n: 9,  level: 'intermediate', title: 'Piano Instrumental Intermedio', song: 'Piano Instrumental Intermedio', chords: ['Dmaj7','Bm7','Gmaj7','A7'], bars: 12, groove: 'pad', useInversions: true, explain: 'Las séptimas ayudan a enriquecer la armonía.' },
            { n: 10, level: 'intermediate', title: 'Hebreo Intermedio', song: 'Hebreo Intermedio', chords: ['Am','G','F','E','Dm','E'], bars: 12, meter: '6/8', groove: 'sixEight', useFifth: true, explain: 'El movimiento ternario aporta energía sin perder fluidez.' },
            { n: 11, level: 'advanced', title: 'Rock Suave', song: 'Rock Suave', chords: ['D','A','Bm','G'], bars: 16, groove: 'octaves', useCase: 'Cuando quieres energía controlada sin agresividad.', explain: 'El rock suave necesita una base sólida sin agresividad.' },
            { n: 12, level: 'advanced', title: 'Rock Suave + Pop', song: 'Rock Suave + Pop', chords: ['G','D','Em','C','D','A','Bm','G'], bars: 16, groove: 'alternatingBass', useInversions: true, explain: 'La energía puede surgir del acompañamiento sin aumentar la velocidad.' },
            { n: 13, level: 'advanced', title: 'Worship + Balada', song: 'Worship + Balada', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A'], bars: 20, groove: 'mixedBallad', pedal: 'Esencial', useInversions: true, explain: 'Esta pieza combina dos enfoques muy comunes del piano moderno.' },
            { n: 14, level: 'advanced', title: 'Piano Instrumental + Hebreo', song: 'Piano Instrumental + Hebreo', chords: ['Am','G','F','E','Dadd9','A','Bm7','G'], bars: 20, meter: '6/8', groove: 'mixedTernary', useInversions: true, pedal: 'Recomendado', explain: 'Los estilos pueden mezclarse para crear nuevos colores.' },
            { n: 15, level: 'advanced', title: 'Proyecto Final de Acompañamiento', song: 'Proyecto Final', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Em7','A7'], bars: 20, groove: 'moduleFinal', pedal: 'Esencial', useInversions: true, keyChange: true, explain: 'Integra todas las habilidades del módulo dentro de una mini canción completa.' },
          ],
        },
      },
    },

    // ── MÓDULO 3 — ARPEGIOS ──────────────────────────────────────────
    arpeggios: {
      label: 'Arpegios',
      icon:  '🌊',
      desc:  'Convertir acordes en movimiento nota por nota.',
      techniques: {
        basic: {
          label: 'Arpegios Básicos', icon: '↗',
          desc: 'Desplegar acordes con la forma 1-3-5-8-5-3-1, primero en la derecha y luego con base en la izquierda.',
          pattern: 'arpegio_basico',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primer Arpegio', chords: ['C'], bars: 8, explain: 'Un arpegio divide el acorde en notas individuales.' },
            { n: 2,  level: 'basic', title: 'Tres Acordes Mayores', chords: ['C','F','G'], bars: 8, explain: 'La misma forma puede moverse entre acordes mayores.' },
            { n: 3,  level: 'basic', title: 'Acordes Menores', chords: ['Am','Dm','Em'], bars: 8, explain: 'Los arpegios menores conservan el color del acorde menor.' },
            { n: 4,  level: 'basic', title: 'Mayor y Menor', chords: ['C','Am','F','Dm'], bars: 8, explain: 'Escucha cómo cambia el color del arpegio entre mayor y menor.' },
            { n: 5,  level: 'basic', title: 'Primera Mini Pieza', chords: ['C','G','Am','F'], bars: 8, explain: 'La forma básica puede sostener una progresión completa.' },
            { n: 6,  level: 'intermediate', title: 'Primera Inversión', chords: ['C','F','G','Am'], bars: 12, inv: 1, explain: 'La primera inversión cambia el punto de partida sin perder la identidad del acorde.' },
            { n: 7,  level: 'intermediate', title: 'Segunda Inversión', chords: ['C','F','G','Am'], bars: 12, inv: 2, explain: 'La segunda inversión te obliga a escuchar el acorde desde otra posición.' },
            { n: 8,  level: 'intermediate', title: 'Mezcla de Inversiones', chords: ['C','G','Am','F'], bars: 12, useInversions: true, explain: 'Alternar inversiones ayuda a conectar arpegios sin saltos grandes.' },
            { n: 9,  level: 'intermediate', title: 'Fluidez entre Acordes', chords: ['C','G','Am','F'], bars: 12, useInversions: true, explain: 'El objetivo es que los arpegios se enlacen como una sola línea.' },
            { n: 10, level: 'intermediate', title: 'Mini Pieza Intermedia', chords: ['G','D','Em','C','Am','D','G'], bars: 12, useInversions: true, explain: 'Integras arpegios e inversiones dentro de una mini pieza.' },
            { n: 11, level: 'advanced', title: 'Ambas Manos', chords: ['C','G','Am','F'], bars: 16, bothHands: true, explain: 'La izquierda sostiene la fundamental mientras la derecha arpegia.' },
            { n: 12, level: 'advanced', title: 'Ambas Manos en Movimiento', chords: ['D','A','Bm','G'], bars: 16, bothHands: true, useInversions: true, explain: 'Ambas manos cambian con la progresión sin perder continuidad.' },
            { n: 13, level: 'advanced', title: 'Séptimas en Arpegios', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 16, bothHands: true, useInversions: true, explain: 'Las séptimas añaden color cuando el acorde se despliega nota por nota.' },
            { n: 14, level: 'advanced', title: 'Extensiones Básicas', chords: ['Cadd9','G','Am7','Fmaj7'], bars: 16, bothHands: true, useInversions: true, explain: 'Add9 y séptimas abren el sonido sin cambiar la función principal.' },
            { n: 15, level: 'advanced', title: 'Dominio de Arpegios Básicos', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Em7','A7'], bars: 16, bothHands: true, useInversions: true, keyChange: true, explain: 'Integras arpegios, inversiones, séptimas y add9 en dos zonas tonales.' },
          ],
        },
        accompaniment: {
          label: 'Arpegios de Acompañamiento', icon: '🎵',
          desc: 'Usar arpegios para sostener progresiones con base armónica en la mano izquierda.',
          pattern: 'arpegio_acomp',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primer Acompañamiento Arpegiado', chords: ['C','G','Am','F'], bars: 8, bothHands: true, pedal: 'No utilizado', explain: 'El arpegio ahora cumple una función de acompañamiento.' },
            { n: 2,  level: 'basic', title: 'Flujo Constante', chords: ['G','D','Em','C'], bars: 8, bothHands: true, pedal: 'No utilizado', explain: 'El movimiento continuo es una de las fortalezas del arpegio.' },
            { n: 3,  level: 'basic', title: 'Mayor y Menor', chords: ['C','Am','F','Dm'], bars: 8, bothHands: true, pedal: 'No utilizado', explain: 'El arpegio refleja el carácter del acorde.' },
            { n: 4,  level: 'basic', title: 'Arpegio Largo', chords: ['C','G','Am','F'], bars: 8, bothHands: true, holdChanges: true, pedal: 'No utilizado', explain: 'Los arpegios pueden sostener armonías durante largos períodos.' },
            { n: 5,  level: 'basic', title: 'Mini Pieza Básica', chords: ['C','F','Am','G','C'], bars: 8, bothHands: true, pedal: 'No utilizado', explain: 'Este ejercicio transforma el arpegio en acompañamiento real.' },
            { n: 6,  level: 'intermediate', title: 'Fundamental + Quinta', chords: ['C','G','Am','F'], bars: 12, bothHands: true, useFifth: true, pedal: 'Opcional', explain: 'La quinta aporta mayor amplitud al acompañamiento.' },
            { n: 7,  level: 'intermediate', title: 'Arpegios con Inversiones', chords: ['C','G','Am','F'], bars: 12, bothHands: true, useInversions: true, pedal: 'Opcional', explain: 'Las inversiones ayudan a mantener la fluidez.' },
            { n: 8,  level: 'intermediate', title: 'Progresión Extendida', chords: ['C','G','Am','F','Dm','G'], bars: 12, bothHands: true, useInversions: true, useFifth: true, pedal: 'Opcional', explain: 'El arpegio permite recorrer progresiones extensas con naturalidad.' },
            { n: 9,  level: 'intermediate', title: 'Movimiento Suave', chords: ['C','F','Am','G'], bars: 12, bothHands: true, holdChanges: true, arpeggioPattern: 'expanded', pedal: 'Opcional', explain: 'Los arpegios también pueden generar calma y espacio.' },
            { n: 10, level: 'intermediate', title: 'Mini Pieza Intermedia', chords: ['G','D','Em','C','Am','D','G'], bars: 12, bothHands: true, useInversions: true, useFifth: true, pedal: 'Opcional', explain: 'Las inversiones hacen que el acompañamiento sea más natural.' },
            { n: 11, level: 'advanced', title: 'Séptimas Arpegiadas', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 16, bothHands: true, useInversions: true, useFifth: true, pedal: 'Recomendado', explain: 'Las séptimas producen arpegios más ricos y expresivos.' },
            { n: 12, level: 'advanced', title: 'Add9 Arpegiado', chords: ['Cadd9','G','Am7','Fmaj7'], bars: 16, bothHands: true, useInversions: true, useFifth: true, pedal: 'Recomendado', explain: 'Las extensiones aportan amplitud y modernidad.' },
            { n: 13, level: 'advanced', title: 'Textura Worship', chords: ['Dadd9','Asus4','Bm7','Gsus2'], bars: 16, bothHands: true, useInversions: true, useFifth: true, arpeggioPattern: 'modern', pedal: 'Recomendado', explain: 'Los arpegios son muy utilizados en worship moderno.' },
            { n: 14, level: 'advanced', title: 'Textura Cinemática', chords: ['Cmaj7','Am7','Fmaj7','G','Dadd9','A'], bars: 16, bothHands: true, useInversions: true, useFifth: true, holdChanges: true, arpeggioPattern: 'open', pedal: 'Recomendado', explain: 'Los arpegios pueden sostener una pieza completa sin melodía.' },
            { n: 15, level: 'advanced', title: 'Dominio de Arpegios de Acompañamiento', chords: ['Cadd9','Gsus2','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], bars: 16, bothHands: true, useInversions: true, useFifth: true, arpeggioPattern: 'mixedAccompaniment', pedal: 'Recomendado', keyChange: true, explain: 'Este ejercicio resume todas las habilidades desarrolladas en Arpegios de Acompañamiento.' },
          ],
        },
        fluid: {
          label: 'Arpegios Fluidos', icon: '〰',
          desc: 'Conectar arpegios con movimiento mínimo y sensación continua.',
          pattern: 'arpegio_fluido',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primer Flujo', chords: ['C','G'], bars: 8, arpeggioPattern: 'expanded', pedal: 'Opcional', explain: 'El objetivo es evitar interrupciones entre acordes.' },
            { n: 2,  level: 'basic', title: 'Flujo sobre Progresión', chords: ['C','G','Am','F'], bars: 8, arpeggioPattern: 'expanded', pedal: 'Opcional', explain: 'Cada acorde debe sentirse conectado con el siguiente.' },
            { n: 3,  level: 'basic', title: 'Reducir Saltos', chords: ['C','G','Am','F'], bars: 8, useInversions: true, arpeggioPattern: 'expanded', pedal: 'Opcional', explain: 'Menos movimiento suele producir más fluidez.' },
            { n: 4,  level: 'basic', title: 'Movimiento Constante', chords: ['Am','F','C','G'], bars: 8, useInversions: true, arpeggioPattern: 'expanded', pedal: 'Opcional', explain: 'La sensación debe ser de continuidad.' },
            { n: 5,  level: 'basic', title: 'Mini Pieza Fluida', chords: ['C','F','Am','G','C'], bars: 8, useInversions: true, arpeggioPattern: 'expanded', pedal: 'Opcional', explain: 'Los cambios de acorde deben sentirse naturales.' },
            { n: 6,  level: 'intermediate', title: 'Introducción de Inversiones Cercanas', chords: ['C','G','Am','F'], bars: 12, useInversions: true, bothHands: true, arpeggioPattern: 'expanded', pedal: 'Recomendado', explain: 'Las inversiones ayudan a mantener la mano cerca del siguiente acorde.' },
            { n: 7,  level: 'intermediate', title: 'Movimiento Mínimo', chords: ['C','G','Am','F'], bars: 12, useInversions: true, bothHands: true, arpeggioPattern: 'expanded', pedal: 'Recomendado', explain: 'El camino más corto suele producir mayor fluidez.' },
            { n: 8,  level: 'intermediate', title: 'Fluidez en Tonalidad de G', chords: ['G','D','Em','C'], bars: 12, useInversions: true, bothHands: true, arpeggioPattern: 'expanded', pedal: 'Recomendado', explain: 'La fluidez debe mantenerse en cualquier tonalidad.' },
            { n: 9,  level: 'intermediate', title: 'Fluidez con Séptimas', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 12, useInversions: true, bothHands: true, arpeggioPattern: 'expanded', pedal: 'Recomendado', explain: 'Las séptimas pueden integrarse sin romper el flujo.' },
            { n: 10, level: 'intermediate', title: 'Mini Pieza Intermedia', chords: ['G','D','Em','C','Am','D','G'], bars: 12, useInversions: true, bothHands: true, arpeggioPattern: 'expanded', pedal: 'Recomendado', explain: 'El acompañamiento debe sentirse como una sola corriente musical.' },
            { n: 11, level: 'advanced', title: 'Flujo Extendido', chords: ['D','A','Bm','G','Em','A','D'], bars: 16, useInversions: true, bothHands: true, useFifth: true, arpeggioPattern: 'expanded', pedal: 'Esencial', explain: 'El desafío es mantener la fluidez durante largos períodos.' },
            { n: 12, level: 'advanced', title: 'Add9 y Fluidez', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A'], bars: 16, useInversions: true, bothHands: true, useFifth: true, arpeggioPattern: 'expanded', pedal: 'Esencial', explain: 'Las extensiones modernas se benefician enormemente de la continuidad.' },
            { n: 13, level: 'advanced', title: 'Textura Worship Fluida', chords: ['Dadd9','Asus4','Bm7','Gsus2'], bars: 16, useInversions: true, bothHands: true, useFifth: true, arpeggioPattern: 'modern', pedal: 'Esencial', explain: 'El worship moderno utiliza frecuentemente arpegios fluidos.' },
            { n: 14, level: 'advanced', title: 'Textura Cinemática Fluida', chords: ['Cmaj7','Am7','Fmaj7','G','Dadd9','A'], bars: 16, useInversions: true, bothHands: true, useFifth: true, holdChanges: true, arpeggioPattern: 'open', pedal: 'Esencial', explain: 'Una textura continua puede sostener una pieza completa.' },
            { n: 15, level: 'advanced', title: 'Dominio de Arpegios Fluidos', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], bars: 16, useInversions: true, bothHands: true, useFifth: true, arpeggioPattern: 'mixedFluid', pedal: 'Esencial', keyChange: true, explain: 'Este ejercicio resume todas las habilidades desarrolladas en Arpegios Fluidos.' },
          ],
        },
        patterns: {
          label: 'Patrones de Arpegio', icon: '◇',
          desc: 'Cambiar la sensación musical variando la forma de recorrer el acorde.',
          pattern: 'patrones_arpegio',
          exercises: [
            { n: 1,  level: 'basic', title: 'Patrón Base', chords: ['C','G','Am','F'], bars: 8, bothHands: true, arpeggioPattern: 'base4', patternFeel: 'Abierto y estable.', useWhen: 'Cuando deseas acompañamiento fluido y sencillo.', pedal: 'Opcional', explain: 'Este es el patrón base de muchos acompañamientos modernos.' },
            { n: 2,  level: 'basic', title: 'Patrón Base sobre Progresiones', chords: ['G','D','Em','C'], bars: 8, bothHands: true, arpeggioPattern: 'base4', patternFeel: 'Continuidad.', pedal: 'Opcional', explain: 'El patrón debe sentirse natural durante toda la progresión.' },
            { n: 3,  level: 'basic', title: 'Patrón Rebote', chords: ['C','G','Am','F'], bars: 8, bothHands: true, arpeggioPattern: 'bounce', patternFeel: 'Movimiento y pulso.', useWhen: 'Cuando deseas más actividad sin tocar más notas.', pedal: 'Opcional', explain: 'Este patrón genera sensación de avance constante.' },
            { n: 4,  level: 'basic', title: 'Comparación de Patrones', chords: ['C','G','Am','F'], bars: 8, bothHands: true, arpeggioPattern: 'baseBounce', patternFeel: 'Cada patrón cambia el carácter del acompañamiento.', pedal: 'Opcional', explain: 'Los mismos acordes pueden sonar muy diferentes.' },
            { n: 5,  level: 'basic', title: 'Mini Pieza Básica', chords: ['C','F','Am','G','C'], bars: 8, bothHands: true, arpeggioPattern: 'baseBounce', patternFeel: 'Variedad.', pedal: 'Opcional', explain: 'Los cambios de patrón generan interés sin cambiar los acordes.' },
            { n: 6,  level: 'intermediate', title: 'Patrón Expandido', chords: ['C','G','Am','F'], bars: 12, bothHands: true, arpeggioPattern: 'expanded', patternFeel: 'Fluidez.', useWhen: 'Cuando deseas acompañamiento más continuo.', pedal: 'Recomendado', explain: 'El patrón expandido genera una textura más completa.' },
            { n: 7,  level: 'intermediate', title: 'Patrón Expandido sobre Progresiones', chords: ['G','D','Em','C'], bars: 12, bothHands: true, useInversions: true, arpeggioPattern: 'expanded', pedal: 'Recomendado', explain: 'Los patrones largos exigen mayor control del flujo.' },
            { n: 8,  level: 'intermediate', title: 'Patrón Moderno', chords: ['Cadd9','G','Am','F'], bars: 12, bothHands: true, useInversions: true, arpeggioPattern: 'modern', patternFeel: 'Grande y moderno.', useWhen: 'Worship, baladas modernas y piano instrumental.', pedal: 'Recomendado', explain: 'Este patrón es muy utilizado en piano contemporáneo.' },
            { n: 9,  level: 'intermediate', title: 'Patrón Moderno Abierto', chords: ['Cadd9','G','Am7','Fmaj7'], bars: 12, bothHands: true, useInversions: true, arpeggioPattern: 'open', patternFeel: 'Espacio.', useWhen: 'Momentos abiertos o contemplativos.', pedal: 'Recomendado', explain: 'Los saltos amplían la sensación sonora.' },
            { n: 10, level: 'intermediate', title: 'Mini Pieza Intermedia', chords: ['G','D','Em','C','Am','D','G'], bars: 12, bothHands: true, useInversions: true, arpeggioPattern: 'mixedIntermediate', pedal: 'Recomendado', explain: 'Cada sección puede beneficiarse de una textura diferente.' },
            { n: 11, level: 'advanced', title: 'Introducción al Alberti', chords: ['C','G','Am','F'], bars: 16, bothHands: true, arpeggioPattern: 'alberti', patternFeel: 'Elegante y continuo.', useWhen: 'Baladas, himnos y acompañamiento tradicional.', pedal: 'Recomendado', explain: 'El Alberti es uno de los patrones más importantes del piano.' },
            { n: 12, level: 'advanced', title: 'Alberti sobre Progresiones', chords: ['D','A','Bm','G'], bars: 16, bothHands: true, useInversions: true, arpeggioPattern: 'alberti', pedal: 'Recomendado', explain: 'El patrón Alberti puede sostener una canción completa.' },
            { n: 13, level: 'advanced', title: 'Alberti Fluido', chords: ['C','G','Am','F','D','A','Bm','G'], bars: 16, bothHands: true, useInversions: true, arpeggioPattern: 'alberti', pedal: 'Recomendado', explain: 'Las inversiones ayudan a que Alberti fluya naturalmente.' },
            { n: 14, level: 'advanced', title: 'Combinación de Patrones', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A'], bars: 16, bothHands: true, useInversions: true, arpeggioPattern: 'mixedPatterns', patternFeel: 'Adaptabilidad.', pedal: 'Recomendado', explain: 'Cada sección puede beneficiarse de un patrón distinto.' },
            { n: 15, level: 'advanced', title: 'Dominio de Patrones de Arpegio', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], bars: 16, bothHands: true, useInversions: true, arpeggioPattern: 'modulePatterns', patternFeel: 'Control total de la textura.', useWhen: 'Cuando deseas adaptar el acompañamiento a cada momento musical.', pedal: 'Recomendado', keyChange: true, explain: 'Este ejercicio resume todas las habilidades desarrolladas en Patrones de Arpegio.' },
          ],
        },
        application: {
          label: 'Aplicación Musical', icon: '🎶',
          desc: 'Mini canciones que eligen patrones de arpegio según el estilo.',
          pattern: 'arpegio_aplicacion',
          exercises: [
            { n: 1,  level: 'basic', title: 'Worship Básico', song: 'Worship Básico', chords: ['C','G','Am','F'], bars: 8, bothHands: true, arpeggioPattern: 'base4', pedal: 'Esencial', explain: 'El worship utiliza movimiento constante y atmósfera.' },
            { n: 2,  level: 'basic', title: 'Pop Básico', song: 'Pop Básico', chords: ['G','D','Em','C'], bars: 8, bothHands: true, arpeggioPattern: 'base4', pedal: 'Opcional', explain: 'Los arpegios pueden sostener una canción pop sin complicarla.' },
            { n: 3,  level: 'basic', title: 'Balada Básica', song: 'Balada Básica', chords: ['C','F','Am','G'], bars: 8, bothHands: true, arpeggioPattern: 'expanded', pedal: 'Recomendado', explain: 'Los arpegios ayudan a llenar espacio sin sobrecargar la música.' },
            { n: 4,  level: 'basic', title: 'Piano Instrumental Básico', song: 'Piano Instrumental Básico', chords: ['C','Am','F','G','C'], bars: 8, bothHands: true, arpeggioPattern: 'expanded', pedal: 'Recomendado', explain: 'Una textura arpegiada puede sostener una pieza instrumental completa.' },
            { n: 5,  level: 'basic', title: 'Hebreo Básico', song: 'Hebreo Básico', chords: ['Am','G','F','E'], bars: 8, bothHands: true, arpeggioPattern: 'bounce', pedal: 'Opcional', explain: 'Mucha música hebrea utiliza movimiento continuo y energía ligera.' },
            { n: 6,  level: 'intermediate', title: 'Worship Intermedio', song: 'Worship Intermedio', chords: ['Cadd9','Gsus2','Am','Fsus2'], bars: 12, bothHands: true, useInversions: true, arpeggioPattern: 'modern', pedal: 'Esencial', explain: 'Las extensiones modernas son parte fundamental del sonido worship.' },
            { n: 7,  level: 'intermediate', title: 'Pop Intermedio', song: 'Pop Intermedio', chords: ['G','D','Em','C','Am','D'], bars: 12, bothHands: true, useInversions: true, arpeggioPattern: 'expanded', pedal: 'Opcional', explain: 'El pop moderno utiliza arpegios para generar movimiento discreto.' },
            { n: 8,  level: 'intermediate', title: 'Balada Intermedia', song: 'Balada Intermedia', chords: ['Cmaj7','Am7','F','G'], bars: 12, bothHands: true, useInversions: true, arpeggioPattern: 'expanded', pedal: 'Recomendado', explain: 'Las inversiones ayudan a mantener continuidad entre acordes.' },
            { n: 9,  level: 'intermediate', title: 'Piano Instrumental Intermedio', song: 'Piano Instrumental Intermedio', chords: ['Dadd9','Bm7','Gmaj7','A7'], bars: 12, bothHands: true, useInversions: true, arpeggioPattern: 'open', pedal: 'Esencial', explain: 'Los patrones abiertos generan sensación de espacio.' },
            { n: 10, level: 'intermediate', title: 'Hebreo Intermedio', song: 'Hebreo Intermedio', chords: ['Am','G','F','E','Dm','E'], bars: 12, bothHands: true, useInversions: true, arpeggioPattern: 'bounce', pedal: 'Opcional', explain: 'El movimiento constante aporta impulso sin perder musicalidad.' },
            { n: 11, level: 'advanced', title: 'Rock Suave', song: 'Rock Suave', chords: ['D','A','Bm','G'], bars: 16, bothHands: true, useFifth: true, arpeggioPattern: 'bounce', pedal: 'Opcional', explain: 'El rock suave suele utilizar movimiento más marcado.' },
            { n: 12, level: 'advanced', title: 'Rock Suave + Pop', song: 'Rock Suave + Pop', chords: ['G','D','Em','C','D','A','Bm','G'], bars: 16, bothHands: true, useInversions: true, useFifth: true, arpeggioPattern: 'modern', pedal: 'Opcional', explain: 'Los estilos pueden compartir recursos similares.' },
            { n: 13, level: 'advanced', title: 'Worship + Balada', song: 'Worship + Balada', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A'], bars: 20, bothHands: true, useInversions: true, useFifth: true, arpeggioPattern: 'open', pedal: 'Esencial', explain: 'Esta combinación es muy común en piano contemporáneo.' },
            { n: 14, level: 'advanced', title: 'Piano Instrumental + Hebreo', song: 'Piano Instrumental + Hebreo', chords: ['Am','G','F','E','Dadd9','A','Bm7','G'], bars: 20, bothHands: true, useInversions: true, useFifth: true, arpeggioPattern: 'alberti', pedal: 'Recomendado', explain: 'Alberti puede funcionar sorprendentemente bien fuera del contexto clásico.' },
            { n: 15, level: 'advanced', title: 'Proyecto Final de Arpegios', song: 'Proyecto Final de Arpegios', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], bars: 20, bothHands: true, useInversions: true, useFifth: true, arpeggioPattern: 'moduleFinalArpeggios', pedal: 'Esencial', keyChange: true, explain: 'Esta pieza resume todas las habilidades desarrolladas durante el módulo de Arpegios.' },
          ],
        },
      },
    },

    // ── MÓDULO 4 — MELÓDICO / ESCALAS ────────────────────────────────
    melodic: {
      label: 'Melódico / Escalas',
      icon:  '📈',
      desc:  'Escalas, frases y patrones melódicos aplicados a la música.',
      techniques: {
        fundamentals: {
          label: 'Escalas Fundamentales', icon: '📈',
          desc: 'Aprender escalas mayores, menores naturales y pentatónicas como vocabulario musical.',
          pattern: 'escala_fundamental',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primera Escala Mayor', scaleRoot: 'C', scaleKind: 'major', bars: 8, hands: 'RH', explain: 'Esta escala será la base de gran parte de la música occidental.' },
            { n: 2,  level: 'basic', title: 'C Mayor con Ritmo', scaleRoot: 'C', scaleKind: 'major', bars: 8, rhythmic: true, hands: 'RH', explain: 'Una escala comienza a convertirse en música cuando aparece el ritmo.' },
            { n: 3,  level: 'basic', title: 'Primera Escala Menor', scaleRoot: 'A', scaleKind: 'minor', bars: 8, hands: 'RH', explain: 'A Menor comparte notas con C Mayor pero produce una sensación diferente.' },
            { n: 4,  level: 'basic', title: 'Mayor vs Menor', scaleRoot: 'C', scaleKind: 'compareMajorMinor', compareRoot: 'A', bars: 8, hands: 'RH', explain: 'Las mismas notas pueden generar emociones distintas.' },
            { n: 5,  level: 'basic', title: 'Mini Pieza Fundamental', scaleRoot: 'C', scaleKind: 'majorMinorPiece', compareRoot: 'A', bars: 8, hands: 'RH', explain: 'Las escalas ya empiezan a utilizarse dentro de música real.' },
            { n: 6,  level: 'intermediate', title: 'Escala de G Mayor', scaleRoot: 'G', scaleKind: 'major', bars: 12, sharps: 1, hands: 'RH', explain: 'Ahora comenzamos a salir de las teclas completamente blancas.' },
            { n: 7,  level: 'intermediate', title: 'Escala de E Menor', scaleRoot: 'E', scaleKind: 'minor', bars: 12, sharps: 1, hands: 'RH', explain: 'Las relaciones entre mayor y menor ayudan a comprender las tonalidades.' },
            { n: 8,  level: 'intermediate', title: 'Primera Pentatónica Mayor', scaleRoot: 'C', scaleKind: 'majorPentatonic', bars: 12, hands: 'RH', explain: 'La pentatónica conserva las notas más estables de la escala.' },
            { n: 9,  level: 'intermediate', title: 'Primera Pentatónica Menor', scaleRoot: 'A', scaleKind: 'minorPentatonic', bars: 12, hands: 'RH', explain: 'La pentatónica menor es una de las herramientas más utilizadas en la música moderna.' },
            { n: 10, level: 'intermediate', title: 'Comparando Escalas y Pentatónicas', scaleRoot: 'C', scaleKind: 'compareScalePentatonic', bars: 12, hands: 'RH', explain: 'Menos notas no significa menos musicalidad.' },
            { n: 11, level: 'advanced', title: 'Escala de D Mayor', scaleRoot: 'D', scaleKind: 'major', bars: 16, sharps: 2, hands: 'RH', explain: 'Cada nueva tonalidad amplía el mapa mental del teclado.' },
            { n: 12, level: 'advanced', title: 'Escala de B Menor', scaleRoot: 'B', scaleKind: 'minor', bars: 16, sharps: 2, hands: 'RH', explain: 'Mayor y menor siguen apareciendo en pares relacionados.' },
            { n: 13, level: 'advanced', title: 'Pentatónica Mayor de G', scaleRoot: 'G', scaleKind: 'majorPentatonic', bars: 16, sharps: 1, hands: 'RH', explain: 'La lógica pentatónica se mantiene independientemente de la tonalidad.' },
            { n: 14, level: 'advanced', title: 'Pentatónica Menor de E', scaleRoot: 'E', scaleKind: 'minorPentatonic', bars: 16, sharps: 1, hands: 'RH', explain: 'Las pentatónicas facilitan la creación de frases musicales naturales.' },
            { n: 15, level: 'advanced', title: 'Dominio de Escalas Fundamentales', scaleRoot: 'C', scaleKind: 'fundamentalsFinal', bars: 16, sharps: 0, hands: 'RH', explain: 'Este ejercicio resume todo el vocabulario fundamental desarrollado en esta técnica.' },
          ],
        },
        phrases: {
          label: 'Frases Escalares', icon: '🎵',
          desc: 'Transformar escalas en pequeñas ideas musicales con ritmo, dirección y cierre.',
          pattern: 'frase_escalar',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primera Frase', scaleRoot: 'C', scaleKind: 'major', scalePhrase: 'simple', melodicResource: 'Frase de 3 a 4 notas', bars: 8, hands: 'RH', explain: 'Una frase es una pequeña idea musical.' },
            { n: 2,  level: 'basic', title: 'Frases Ascendentes', scaleRoot: 'C', scaleKind: 'major', scalePhrase: 'ascendingPhrase', melodicResource: 'Frases ascendentes', bars: 8, hands: 'RH', explain: 'Las frases ascendentes suelen generar impulso.' },
            { n: 3,  level: 'basic', title: 'Frases Descendentes', scaleRoot: 'C', scaleKind: 'major', scalePhrase: 'descendingPhrase', melodicResource: 'Frases descendentes', bars: 8, hands: 'RH', explain: 'Las frases descendentes suelen generar cierre.' },
            { n: 4,  level: 'basic', title: 'Primeras Frases Menores', scaleRoot: 'A', scaleKind: 'minor', scalePhrase: 'minorPhrase', melodicResource: 'Frases menores', bars: 8, hands: 'RH', explain: 'Las frases cambian de carácter según la escala.' },
            { n: 5,  level: 'basic', title: 'Mini Melodía Básica', scaleRoot: 'C', scaleKind: 'majorMinorPiece', compareRoot: 'A', scalePhrase: 'miniMelody', melodicResource: 'Dos frases relacionadas', bars: 8, hands: 'RH', explain: 'Las melodías se construyen uniendo frases.' },
            { n: 6,  level: 'intermediate', title: 'Pregunta y Respuesta', scaleRoot: 'C', scaleKind: 'major', scalePhrase: 'questionAnswer', melodicResource: 'Pregunta y respuesta', bars: 12, hands: 'RH', pedal: 'No utilizado', explain: 'Muchas melodías funcionan como una conversación.' },
            { n: 7,  level: 'intermediate', title: 'Frases sobre Acordes', scaleRoot: 'C', scaleKind: 'major', chords: ['C','G','Am','F'], melodicLH: true, scalePhrase: 'harmonyPhrase', melodicResource: 'Frases sobre acordes', bars: 12, hands: 'RH+LH', explain: 'Las frases suelen apoyarse en la armonía.' },
            { n: 8,  level: 'intermediate', title: 'Frases en G Mayor', scaleRoot: 'G', scaleKind: 'major', sharps: 1, scalePhrase: 'variedRhythm', melodicResource: 'Frases con ritmos variados', bars: 12, hands: 'RH', explain: 'Las mismas ideas pueden trasladarse a nuevas tonalidades.' },
            { n: 9,  level: 'intermediate', title: 'Frases en E Menor', scaleRoot: 'E', scaleKind: 'minor', sharps: 1, chords: ['Em','C','G','D'], melodicLH: true, scalePhrase: 'minorPhrase', melodicResource: 'Frases menores con armonía', bars: 12, hands: 'RH+LH', explain: 'Cada escala aporta un carácter distinto.' },
            { n: 10, level: 'intermediate', title: 'Mini Melodía Intermedia', scaleRoot: 'G', scaleKind: 'major', sharps: 1, chords: ['G','D','Em','C'], melodicLH: true, scalePhrase: 'questionAnswer', melodicResource: 'Melodía con contraste', bars: 12, hands: 'RH+LH', explain: 'Una buena melodía combina dirección y contraste.' },
            { n: 11, level: 'advanced', title: 'Frases Pentatónicas Mayores', scaleRoot: 'G', scaleKind: 'majorPentatonic', sharps: 1, chords: ['G','D','Em','C'], melodicLH: true, scalePhrase: 'pentatonicOpen', melodicResource: 'Frases pentatónicas mayores', bars: 16, hands: 'RH+LH', explain: 'La pentatónica facilita la construcción de frases musicales.' },
            { n: 12, level: 'advanced', title: 'Frases Pentatónicas Menores', scaleRoot: 'E', scaleKind: 'minorPentatonic', sharps: 1, chords: ['Em','C','G','D'], melodicLH: true, scalePhrase: 'pentatonicMinor', melodicResource: 'Frases pentatónicas menores', bars: 16, hands: 'RH+LH', explain: 'La pentatónica menor es extremadamente versátil.' },
            { n: 13, level: 'advanced', title: 'Frases sobre Progresiones', scaleRoot: 'D', scaleKind: 'major', sharps: 2, chords: ['D','A','Bm','G'], melodicLH: true, scalePhrase: 'harmonyPhrase', melodicResource: 'Frases sobre progresiones', bars: 16, hands: 'RH+LH', explain: 'La melodía debe convivir con los cambios armónicos.' },
            { n: 14, level: 'advanced', title: 'Mini Melodía Extendida', scaleRoot: 'D', scaleKind: 'major', sharps: 2, chords: ['D','A','Bm','G','Em','A'], melodicLH: true, scalePhrase: 'extendedMelody', melodicResource: 'Frases conectadas', bars: 16, hands: 'RH+LH', explain: 'Las melodías más largas se construyen a partir de frases pequeñas.' },
            { n: 15, level: 'advanced', title: 'Dominio de Frases Escalares', scaleRoot: 'C', scaleKind: 'melodicPhrasesFinal', chords: ['C','G','Am','F','D','A','Bm','G'], melodicLH: true, scalePhrase: 'finalPhrases', melodicResource: 'Melodía completa', bars: 16, hands: 'RH+LH', explain: 'Este ejercicio resume todas las habilidades desarrolladas en Frases Escalares.' },
          ],
        },
        patterns: {
          label: 'Patrones de Escala', icon: '🔁',
          desc: 'Usar patrones escalares para ganar fluidez y convertirlos en frases musicales.',
          pattern: 'patron_escala',
          exercises: [
            { n: 1,  level: 'basic', title: 'Grupos de Tres', scaleRoot: 'C', scaleKind: 'major', scalePattern: 'groups3', melodicResource: '1-2-3 / 2-3-4 / 3-4-5', bars: 8, hands: 'RH', explain: 'Los patrones ayudan a recorrer la escala de forma organizada.' },
            { n: 2,  level: 'basic', title: 'Grupos de Tres Descendentes', scaleRoot: 'C', scaleKind: 'major', scalePattern: 'groups3Down', melodicResource: '5-4-3 / 4-3-2 / 3-2-1', bars: 8, hands: 'RH', explain: 'Los patrones funcionan en ambas direcciones.' },
            { n: 3,  level: 'basic', title: 'Terceras Simples', scaleRoot: 'C', scaleKind: 'major', scalePattern: 'thirds', melodicResource: '1-3 / 2-4 / 3-5', bars: 8, hands: 'RH', explain: 'Las terceras aparecen constantemente en melodías.' },
            { n: 4,  level: 'basic', title: 'Terceras Descendentes', scaleRoot: 'C', scaleKind: 'major', scalePattern: 'thirdsDown', melodicResource: 'Terceras descendentes', bars: 8, hands: 'RH', explain: 'Las terceras ayudan a romper el movimiento lineal.' },
            { n: 5,  level: 'basic', title: 'Mini Melodía Básica', scaleRoot: 'C', scaleKind: 'major', scalePattern: 'mixedBasicPatterns', melodicResource: 'Grupos de tres y terceras', bars: 8, hands: 'RH', explain: 'Las melodías suelen mezclar distintos tipos de movimiento.' },
            { n: 6,  level: 'intermediate', title: 'Saltos Controlados', scaleRoot: 'C', scaleKind: 'major', scalePattern: 'controlledLeaps', melodicResource: '1-3-2-4 / 2-4-3-5', bars: 12, hands: 'RH', explain: 'Los saltos generan interés sin abandonar la escala.' },
            { n: 7,  level: 'intermediate', title: 'Primera Secuencia', scaleRoot: 'C', scaleKind: 'major', scalePattern: 'sequenceUp', melodicResource: 'Secuencia ascendente', bars: 12, hands: 'RH', explain: 'Las secuencias son una herramienta fundamental de construcción melódica.' },
            { n: 8,  level: 'intermediate', title: 'Secuencia Descendente', scaleRoot: 'C', scaleKind: 'major', scalePattern: 'sequenceDown', melodicResource: 'Secuencia descendente', bars: 12, hands: 'RH', explain: 'Las secuencias funcionan tanto ascendiendo como descendiendo.' },
            { n: 9,  level: 'intermediate', title: 'Secuencias sobre Acordes', scaleRoot: 'G', scaleKind: 'major', sharps: 1, chords: ['G','D','Em','C'], melodicLH: true, scalePattern: 'sequenceUp', melodicResource: 'Secuencias sobre progresión', bars: 12, hands: 'RH+LH', explain: 'Las secuencias suelen apoyarse en la armonía.' },
            { n: 10, level: 'intermediate', title: 'Mini Melodía Intermedia', scaleRoot: 'G', scaleKind: 'major', sharps: 1, chords: ['G','D','Em','C'], melodicLH: true, scalePattern: 'mixedIntermediatePatterns', melodicResource: 'Secuencias y saltos', bars: 12, hands: 'RH+LH', explain: 'Las secuencias permiten desarrollar una idea musical.' },
            { n: 11, level: 'advanced', title: 'Patrones Pentatónicos', scaleRoot: 'G', scaleKind: 'majorPentatonic', sharps: 1, chords: ['G','D','Em','C'], melodicLH: true, scalePattern: 'pentatonicPattern', melodicResource: 'Patrones pentatónicos mayores', bars: 16, hands: 'RH+LH', explain: 'La pentatónica facilita movimientos muy naturales.' },
            { n: 12, level: 'advanced', title: 'Patrones Pentatónicos Menores', scaleRoot: 'E', scaleKind: 'minorPentatonic', sharps: 1, chords: ['Em','C','G','D'], melodicLH: true, scalePattern: 'pentatonicMinorPattern', melodicResource: 'Patrones pentatónicos menores', bars: 16, hands: 'RH+LH', explain: 'La pentatónica menor es extremadamente versátil.' },
            { n: 13, level: 'advanced', title: 'Patrones Melódicos', scaleRoot: 'D', scaleKind: 'major', sharps: 2, chords: ['D','A','Bm','G'], melodicLH: true, scalePattern: 'melodicPattern', melodicResource: 'Patrones que parecen melodía', bars: 16, hands: 'RH+LH', explain: 'Algunos patrones pueden convertirse directamente en material melódico.' },
            { n: 14, level: 'advanced', title: 'Combinación de Patrones', scaleRoot: 'D', scaleKind: 'major', sharps: 2, chords: ['D','A','Bm','G','Em','A'], melodicLH: true, scalePattern: 'mixedAllPatterns', melodicResource: 'Grupos, terceras, secuencias y pentatónicas', bars: 16, hands: 'RH+LH', explain: 'Los músicos combinan patrones constantemente.' },
            { n: 15, level: 'advanced', title: 'Dominio de Patrones de Escala', scaleRoot: 'C', scaleKind: 'patternsFinal', chords: ['C','G','Am','F','D','A','Bm','G'], melodicLH: true, scalePattern: 'patternsFinal', melodicResource: 'Melodía completa con patrones', bars: 16, hands: 'RH+LH', explain: 'Este ejercicio resume todas las habilidades desarrolladas en Patrones de Escala.' },
          ],
        },
        applied: {
          label: 'Escalas Aplicadas', icon: '✨',
          desc: 'Usar escalas dentro de progresiones reales para conectar, rellenar y adornar.',
          pattern: 'escala_aplicada',
          exercises: [
            { n: 1,  level: 'basic', title: 'Conectando Dos Acordes', scaleRoot: 'C', scaleKind: 'major', chords: ['C','G'], melodicLH: true, appliedResource: 'Conexión escalar', bars: 8, hands: 'RH+LH', explain: 'Las escalas ayudan a conectar acordes de forma natural.' },
            { n: 2,  level: 'basic', title: 'Primera Nota de Paso', scaleRoot: 'C', scaleKind: 'major', chords: ['C','G','Am','F'], melodicLH: true, appliedResource: 'Notas de paso', bars: 8, hands: 'RH+LH', explain: 'Las notas de paso suavizan las transiciones.' },
            { n: 3,  level: 'basic', title: 'Rellenando Espacios', scaleRoot: 'C', scaleKind: 'major', chords: ['C','F','Am','G'], melodicLH: true, appliedResource: 'Relleno escalar', holdChanges: true, bars: 8, hands: 'RH+LH', explain: 'Las escalas pueden aportar movimiento sin cambiar la armonía.' },
            { n: 4,  level: 'basic', title: 'Final de Frase', scaleRoot: 'C', scaleKind: 'major', chords: ['C','G','F','C'], melodicLH: true, appliedResource: 'Adorno de cierre', bars: 8, hands: 'RH+LH', explain: 'Los adornos ayudan a cerrar ideas musicales.' },
            { n: 5,  level: 'basic', title: 'Mini Canción Aplicada', scaleRoot: 'C', scaleKind: 'major', chords: ['C','G','Am','F','C'], melodicLH: true, appliedResource: 'Conexiones y notas de paso', bars: 8, hands: 'RH+LH', explain: 'Las escalas empiezan a formar parte del acompañamiento.' },
            { n: 6,  level: 'intermediate', title: 'Conexiones Más Largas', scaleRoot: 'C', scaleKind: 'major', chords: ['C','G','Am','F'], melodicLH: true, appliedResource: 'Conexiones escalares', bars: 12, hands: 'RH+LH', explain: 'Las escalas permiten enlazar progresiones completas.' },
            { n: 7,  level: 'intermediate', title: 'Rellenos de Compás', scaleRoot: 'G', scaleKind: 'major', sharps: 1, chords: ['G','D','Em','C'], melodicLH: true, appliedResource: 'Rellenos cortos', holdChanges: true, bars: 12, hands: 'RH+LH', explain: 'Los rellenos ayudan a mantener el interés.' },
            { n: 8,  level: 'intermediate', title: 'Adornos Pentatónicos', scaleRoot: 'C', scaleKind: 'majorPentatonic', chords: ['C','G','Am','F'], melodicLH: true, appliedResource: 'Adornos pentatónicos', bars: 12, hands: 'RH+LH', explain: 'La pentatónica facilita adornos naturales y musicales.' },
            { n: 9,  level: 'intermediate', title: 'Pregunta y Respuesta Aplicada', scaleRoot: 'G', scaleKind: 'major', sharps: 1, chords: ['G','D','Em','C'], melodicLH: true, appliedResource: 'Pregunta y respuesta', bars: 12, hands: 'RH+LH', explain: 'Las frases pueden convivir con el acompañamiento.' },
            { n: 10, level: 'intermediate', title: 'Mini Canción Intermedia', scaleRoot: 'G', scaleKind: 'major', sharps: 1, chords: ['G','D','Em','C','Am','D','G'], melodicLH: true, appliedResource: 'Rellenos, conexiones y adornos', bars: 12, hands: 'RH+LH', explain: 'Las escalas ahora forman parte activa de la música.' },
            { n: 11, level: 'advanced', title: 'Escalas dentro del Acompañamiento', scaleRoot: 'D', scaleKind: 'major', sharps: 2, chords: ['D','A','Bm','G'], melodicLH: true, appliedResource: 'Movimiento escalar frecuente', bars: 16, hands: 'RH+LH', explain: 'Las escalas pueden enriquecer el acompañamiento continuamente.' },
            { n: 12, level: 'advanced', title: 'Adornos Modernos', scaleRoot: 'G', scaleKind: 'majorPentatonic', sharps: 1, chords: ['Cadd9','G','Am7','Fmaj7'], melodicLH: true, appliedResource: 'Adornos modernos', bars: 16, hands: 'RH+LH', explain: 'Los adornos modernos suelen ser breves y efectivos.' },
            { n: 13, level: 'advanced', title: 'Movimiento entre Secciones', scaleRoot: 'D', scaleKind: 'major', sharps: 2, chords: ['D','A','Bm','G','Em','A','D'], melodicLH: true, appliedResource: 'Conexiones entre secciones', bars: 16, hands: 'RH+LH', explain: 'Las escalas ayudan a unir distintas partes de una pieza.' },
            { n: 14, level: 'advanced', title: 'Textura Escalar Completa', scaleRoot: 'D', scaleKind: 'major', sharps: 2, chords: ['D','A','Bm','G','Em','A'], melodicLH: true, appliedResource: 'Textura escalar integrada', bars: 16, hands: 'RH+LH', explain: 'El movimiento escalar puede convertirse en parte del estilo.' },
            { n: 15, level: 'advanced', title: 'Dominio de Escalas Aplicadas', scaleRoot: 'C', scaleKind: 'appliedFinal', chords: ['C','G','Am','F','D','A','Bm','G'], melodicLH: true, appliedResource: 'Conexiones, rellenos y adornos', bars: 16, hands: 'RH+LH', explain: 'Este ejercicio resume todas las habilidades desarrolladas en Escalas Aplicadas.' },
          ],
        },
        application: {
          label: 'Aplicación Musical', icon: '🎶',
          desc: 'Mini canciones donde las escalas sirven a un estilo musical real.',
          pattern: 'aplicacion_escalas',
          exercises: [
            { n: 1,  level: 'basic', title: 'Worship Básico', song: 'Worship Básico', scaleRoot: 'C', scaleKind: 'major', chords: ['C','G','Am','F'], melodicLH: true, appliedResource: 'Notas de paso', bars: 8, hands: 'RH+LH', explain: 'Las notas de paso ayudan a suavizar el acompañamiento.' },
            { n: 2,  level: 'basic', title: 'Pop Básico', song: 'Pop Básico', scaleRoot: 'C', scaleKind: 'major', chords: ['C','G','Am','F'], melodicLH: true, appliedResource: 'Frases escalares', bars: 8, hands: 'RH+LH', explain: 'Las frases cortas pueden aportar movimiento sin convertirse en melodías complejas.' },
            { n: 3,  level: 'basic', title: 'Balada Básica', song: 'Balada Básica', scaleRoot: 'A', scaleKind: 'minor', chords: ['Am','F','C','G'], melodicLH: true, appliedResource: 'Conexiones escalares', bars: 8, hands: 'RH+LH', explain: 'Las conexiones ayudan a unir la armonía.' },
            { n: 4,  level: 'basic', title: 'Piano Instrumental Básico', song: 'Piano Instrumental Básico', scaleRoot: 'C', scaleKind: 'major', chords: ['C','F','Am','G','C'], melodicLH: true, appliedResource: 'Frases escalares', bars: 8, hands: 'RH+LH', explain: 'Las escalas pueden aportar movimiento incluso sin melodía principal.' },
            { n: 5,  level: 'basic', title: 'Hebreo Básico', song: 'Hebreo Básico', scaleRoot: 'A', scaleKind: 'minor', chords: ['Am','G','F','E'], melodicLH: true, appliedResource: 'Patrones escalares', bars: 8, hands: 'RH+LH', explain: 'Los patrones ayudan a mantener la energía.' },
            { n: 6,  level: 'intermediate', title: 'Worship Intermedio', song: 'Worship Intermedio', scaleRoot: 'G', scaleKind: 'major', sharps: 1, chords: ['G','D','Em','C'], melodicLH: true, appliedResource: 'Conexiones escalares', bars: 12, hands: 'RH+LH', explain: 'Las conexiones ayudan a unir secciones completas.' },
            { n: 7,  level: 'intermediate', title: 'Pop Intermedio', song: 'Pop Intermedio', scaleRoot: 'G', scaleKind: 'major', sharps: 1, chords: ['G','D','Em','C','Am','D'], melodicLH: true, appliedResource: 'Rellenos escalares', bars: 12, hands: 'RH+LH', explain: 'Los rellenos añaden interés entre frases.' },
            { n: 8,  level: 'intermediate', title: 'Balada Intermedia', song: 'Balada Intermedia', scaleRoot: 'E', scaleKind: 'minor', sharps: 1, chords: ['Em','C','G','D'], melodicLH: true, appliedResource: 'Frases escalares', bars: 12, hands: 'RH+LH', explain: 'Las frases deben convivir con la armonía.' },
            { n: 9,  level: 'intermediate', title: 'Piano Instrumental Intermedio', song: 'Piano Instrumental Intermedio', scaleRoot: 'G', scaleKind: 'major', sharps: 1, chords: ['G','D','Em','C'], melodicLH: true, appliedResource: 'Patrones melódicos', bars: 12, hands: 'RH+LH', explain: 'Los patrones pueden convertirse en material musical.' },
            { n: 10, level: 'intermediate', title: 'Hebreo Intermedio', song: 'Hebreo Intermedio', scaleRoot: 'E', scaleKind: 'minor', sharps: 1, chords: ['Em','D','C','B'], melodicLH: true, appliedResource: 'Secuencias', bars: 12, hands: 'RH+LH', explain: 'Las secuencias ayudan a desarrollar ideas musicales.' },
            { n: 11, level: 'advanced', title: 'Rock Suave', song: 'Rock Suave', scaleRoot: 'G', scaleKind: 'majorPentatonic', sharps: 1, chords: ['G','D','Em','C'], melodicLH: true, appliedResource: 'Frases pentatónicas', bars: 16, hands: 'RH+LH', explain: 'Las pentatónicas producen líneas naturales y directas.' },
            { n: 12, level: 'advanced', title: 'Rock Suave + Pop', song: 'Rock Suave + Pop', scaleRoot: 'G', scaleKind: 'applicationPentatonicMix', chords: ['G','D','Em','C','D','A','Bm','G'], melodicLH: true, appliedResource: 'Rellenos pentatónicos', bars: 16, hands: 'RH+LH', explain: 'Las pentatónicas son ideales para adornos breves.' },
            { n: 13, level: 'advanced', title: 'Worship + Balada', song: 'Worship + Balada', scaleRoot: 'D', scaleKind: 'applicationMajorPenta', chords: ['D','A','Bm','G','Em','A'], melodicLH: true, appliedResource: 'Conexiones escalares', bars: 20, hands: 'RH+LH', explain: 'Las escalas pueden unir armonía y emoción.' },
            { n: 14, level: 'advanced', title: 'Piano Instrumental + Hebreo', song: 'Piano Instrumental + Hebreo', scaleRoot: 'D', scaleKind: 'applicationMajorMinor', chords: ['D','A','Bm','G','Em','A','Bm','G'], melodicLH: true, appliedResource: 'Patrones melódicos', bars: 20, hands: 'RH+LH', explain: 'Los recursos escalares pueden convertirse en parte del estilo.' },
            { n: 15, level: 'advanced', title: 'Proyecto Final de Escalas', song: 'Proyecto Final de Escalas', scaleRoot: 'C', scaleKind: 'applicationFinal', chords: ['C','G','Am','F','D','A','Bm','G'], melodicLH: true, appliedResource: 'Conexiones, rellenos y frases destacadas', bars: 20, hands: 'RH+LH', explain: 'Esta pieza resume todas las habilidades desarrolladas durante el módulo de Escalas.' },
          ],
        },
      },
    },

    // ── MÓDULO 5 — COORDINACIÓN DE MANOS ─────────────────────────────
    coordination: {
      label: 'Coordinación de manos',
      icon:  '🤝',
      desc:  'Independencia tecnica: manos que llegan juntas, alternan, sostienen, se desplazan y mantienen roles distintos.',
      techniques: {
        bassChords: {
          label: 'Bajo + Acordes', icon: '🤝',
          desc: 'Coordinar ataques simultaneos entre bajo de mano izquierda y acordes de mano derecha.',
          pattern: 'bajo_acordes',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primer Ataque Junto', chords: ['C','G'], bars: 8, coordinationPattern: 'rootChord', coordinationResource: 'Ataque simultaneo', explain: 'Ambas manos deben sonar como una sola decision.' },
            { n: 2,  level: 'basic', title: 'Cambio Vertical', chords: ['C','G'], bars: 8, coordinationPattern: 'rootChord', coordinationResource: 'Cambio sincronizado', explain: 'El bajo y el acorde deben moverse juntos.' },
            { n: 3,  level: 'basic', title: 'Bajo Estable, Acorde Movil', chords: ['C','F','G','C'], bars: 8, coordinationPattern: 'rootChord', coordinationResource: 'Independencia estatica', stableBass: true, explain: 'Una mano puede sostener mientras la otra cambia.' },
            { n: 4,  level: 'basic', title: 'Primera Progresion Vertical', chords: ['C','G','Am','F'], bars: 8, coordinationPattern: 'rootChord', coordinationResource: 'Bajo + acorde por compas', explain: 'La prioridad es llegar juntos, no tocar mas notas.' },
            { n: 5,  level: 'basic', title: 'Control de Balance', chords: ['C','F','Am','G','C'], bars: 8, coordinationPattern: 'rootChord', coordinationResource: 'Balance vertical', explain: 'La coordinacion tambien es control de peso.' },
            { n: 6,  level: 'intermediate', title: 'Inversiones Sincronizadas', chords: ['C','F','G','Am'], bars: 12, useInversions: true, coordinationPattern: 'rootChord', coordinationResource: 'Inversiones coordinadas', explain: 'La mano se mueve menos, pero la llegada debe seguir clara.' },
            { n: 7,  level: 'intermediate', title: 'Cambios Cercanos', chords: ['C','G','Am','F'], bars: 12, useInversions: true, coordinationPattern: 'rootChord', coordinationResource: 'Movimiento cercano', explain: 'El cambio debe sentirse comodo y exacto.' },
            { n: 8,  level: 'intermediate', title: 'Fundamental + Quinta', chords: ['C','G','Am','F'], bars: 12, useInversions: true, useFifth: true, coordinationPattern: 'rootFifthChord', coordinationResource: 'Bajo ampliado', explain: 'La izquierda crece sin cambiar la funcion principal.' },
            { n: 9,  level: 'intermediate', title: 'Ataque + Sostenido', chords: ['C','G','Am','F'], bars: 12, useInversions: true, useFifth: true, coordinationPattern: 'independentBass', coordinationResource: 'Duraciones independientes', explain: 'Las manos empiezan juntas, pero no tienen que terminar igual.' },
            { n: 10, level: 'intermediate', title: 'Progresion Intermedia', chords: ['G','D','Em','C','Am','D','G'], bars: 12, useInversions: true, useFifth: true, coordinationPattern: 'rootFifthChord', coordinationResource: 'Coordinacion vertical extendida', explain: 'Mantener precision durante una progresion mas larga.' },
            { n: 11, level: 'advanced', title: 'Octavas Coordinadas', chords: ['D','A','Bm','G'], bars: 16, useInversions: true, useOctaves: true, coordinationPattern: 'octavesChord', coordinationResource: 'Octavas + acorde', explain: 'El peso de la izquierda no debe desbalancear la derecha.' },
            { n: 12, level: 'advanced', title: 'Decimas Coordinadas', chords: ['D','A','Bm','G'], bars: 16, useInversions: true, useTenths: true, coordinationPattern: 'tenthsChord', coordinationResource: 'Decimas', explain: 'La apertura de LH exige mas control fisico.' },
            { n: 13, level: 'advanced', title: 'Septimas Verticales', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 16, useInversions: true, useFifth: true, coordinationPattern: 'rootFifthChord', coordinationResource: 'Acordes extendidos', explain: 'Mas color no debe significar menos precision.' },
            { n: 14, level: 'advanced', title: 'Coordinacion Moderna', chords: ['Cmaj7','Am7','Fmaj7','G7','Dadd9','A'], bars: 16, useInversions: true, useTenths: true, coordinationPattern: 'modernCoordination', coordinationResource: 'Bajo amplio + color', explain: 'El reto es mantener llegada limpia con acordes mas ricos.' },
            { n: 15, level: 'advanced', title: 'Dominio de Bajo + Acordes', chords: ['Cmaj7','G','Am7','Fmaj7','Dadd9','A','Bm7','G'], bars: 16, useInversions: true, useFifth: true, useOctaves: true, useTenths: true, coordinationPattern: 'coordinationFinal', coordinationResource: 'Coordinacion vertical completa', keyChange: true, explain: 'Este ejercicio resume la coordinacion simultanea de ambas manos.' },
          ],
        },
        alternatingHands: {
          label: 'Manos Alternadas', icon: '⇆',
          desc: 'Pasar el pulso de una mano a la otra con entradas claras.',
          pattern: 'manos_alternadas',
          exercises: [
            { n: 1,  level: 'basic', title: 'LH Luego RH', chords: ['C','G'], bars: 8, coordinationPattern: 'alternating', coordinationResource: 'Alternancia basica', explain: 'La derecha debe entrar sin apurarse despues de la izquierda.' },
            { n: 2,  level: 'basic', title: 'RH Luego LH', chords: ['C','G'], bars: 8, coordinationPattern: 'reverseAlternating', coordinationResource: 'Respuesta invertida', explain: 'Cualquiera de las dos manos puede iniciar.' },
            { n: 3,  level: 'basic', title: 'Pulso Compartido', chords: ['C','F','G','C'], bars: 8, coordinationPattern: 'sharedPulse', coordinationResource: 'Manos en turnos', explain: 'El ritmo debe sentirse continuo aunque las manos alternen.' },
            { n: 4,  level: 'basic', title: 'Alternancia por Compas', chords: ['C','G','Am','F'], bars: 8, coordinationPattern: 'chordTurns', coordinationResource: 'Turnos por acorde', explain: 'La progresion no debe romper el patron.' },
            { n: 5,  level: 'basic', title: 'Mini Rutina Alternada', chords: ['C','F','Am','G','C'], bars: 8, coordinationPattern: 'stableAlternating', coordinationResource: 'Alternancia estable', explain: 'Sostener la conversacion ritmica entre manos.' },
            { n: 6,  level: 'intermediate', title: 'Bajo en Tiempo, RH en Contratiempo', chords: ['C','G','Am','F'], bars: 12, coordinationPattern: 'offbeatAlternating', coordinationResource: 'Contratiempo simple', explain: 'La derecha entra entre los apoyos de la izquierda.' },
            { n: 7,  level: 'intermediate', title: 'Dos Respuestas de RH', chords: ['C','G','Am','F'], bars: 12, coordinationPattern: 'oneTwo', coordinationResource: '1 contra 2', explain: 'La mano derecha se mueve mas, pero depende del pulso de LH.' },
            { n: 8,  level: 'intermediate', title: 'Bajo Alternado y Acorde', chords: ['G','D','Em','C'], bars: 12, useFifth: true, coordinationPattern: 'alternatingBassFifth', coordinationResource: 'LH alterna, RH responde', explain: 'La izquierda ya tiene movimiento interno propio.' },
            { n: 9,  level: 'intermediate', title: 'Silencio de Preparacion', chords: ['Am','F','C','G'], bars: 12, coordinationPattern: 'preparedRest', coordinationResource: 'Entrada preparada', explain: 'El silencio tambien debe estar contado.' },
            { n: 10, level: 'intermediate', title: 'Alternancia Intermedia', chords: ['G','D','Em','C','Am','D','G'], bars: 12, coordinationPattern: 'extendedTurns', coordinationResource: 'Turnos extendidos', explain: 'La continuidad es mas importante que la densidad.' },
            { n: 11, level: 'advanced', title: 'Alternancia con Octavas', chords: ['D','A','Bm','G'], bars: 16, useOctaves: true, coordinationPattern: 'octaveAlternating', coordinationResource: 'Octavas alternadas', explain: 'La amplitud de LH no debe retrasar la respuesta de RH.' },
            { n: 12, level: 'advanced', title: 'Alternancia Rapida Controlada', chords: ['D','A','Bm','G'], bars: 16, coordinationPattern: 'fastAlternating', coordinationResource: 'Turnos rapidos', explain: 'Mas eventos no significa mas velocidad.' },
            { n: 13, level: 'advanced', title: 'Alternancia con Acordes Extendidos', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 16, coordinationPattern: 'harmonicResponse', coordinationResource: 'Respuesta armonica', explain: 'La derecha debe entrar clara aunque el acorde tenga mas notas.' },
            { n: 14, level: 'advanced', title: 'Alternancia Moderna', chords: ['Cadd9','Gsus4','Am7','Fmaj7','Dadd9','A'], bars: 16, coordinationPattern: 'modernAlternating', coordinationResource: 'Alternancia con color', explain: 'El color armonico no debe esconder el patron de turnos.' },
            { n: 15, level: 'advanced', title: 'Dominio de Manos Alternadas', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A','Bm7','G'], bars: 16, useOctaves: true, coordinationPattern: 'alternatingFinal', coordinationResource: 'Alternancia completa', keyChange: true, explain: 'Este ejercicio resume pasar la musica de una mano a otra.' },
          ],
        },
        fixedMoving: {
          label: 'Mano Fija + Móvil', icon: '⟷',
          desc: 'Coordinar una mano que sostiene o repite mientras la otra cambia.',
          pattern: 'mano_fija_movil',
          exercises: [
            { n: 1,  level: 'basic', title: 'LH Fija, RH Cambia', chords: ['C'], bars: 8, coordinationPattern: 'leftHold', coordinationResource: 'LH sostenida', stableBass: true, explain: 'La izquierda debe permanecer quieta aunque la derecha trabaje.' },
            { n: 2,  level: 'basic', title: 'RH Fija, LH Cambia', chords: ['C','G'], bars: 8, coordinationPattern: 'rightHold', coordinationResource: 'RH sostenida', explain: 'La derecha no debe seguir cada movimiento de la izquierda.' },
            { n: 3,  level: 'basic', title: 'Pedal de Bajo', chords: ['C','F','G','C'], bars: 8, coordinationPattern: 'pedalBass', coordinationResource: 'Pedal en LH', stableBass: true, explain: 'El pedal crea estabilidad mientras la derecha cambia.' },
            { n: 4,  level: 'basic', title: 'Acorde Sostenido, Bajo Movil', chords: ['C','G','Am','F'], bars: 8, coordinationPattern: 'movingBassHold', coordinationResource: 'RH fija', explain: 'La independencia aparece cuando las duraciones no coinciden.' },
            { n: 5,  level: 'basic', title: 'Primer Cambio de Rol', chords: ['C','F','Am','G','C'], bars: 8, coordinationPattern: 'roleSwitch', coordinationResource: 'Cambio de rol', explain: 'Identificar rapidamente quien sostiene y quien se mueve.' },
            { n: 6,  level: 'intermediate', title: 'Bajo Pedal con Inversiones', chords: ['C','G','Am','F'], bars: 12, useInversions: true, coordinationPattern: 'pedalInversions', coordinationResource: 'Pedal + inversiones', stableBass: true, explain: 'La derecha se mueve con fluidez encima de una base estable.' },
            { n: 7,  level: 'intermediate', title: 'Quinta Fija', chords: ['C','G','Am','F'], bars: 12, useFifth: true, coordinationPattern: 'fixedFifth', coordinationResource: 'Base fija ampliada', stableBass: true, explain: 'La quinta agrega cuerpo sin cambiar la tarea.' },
            { n: 8,  level: 'intermediate', title: 'RH Pulso Largo', chords: ['G','D','Em','C'], bars: 12, coordinationPattern: 'rightLong', coordinationResource: 'Duraciones cruzadas', explain: 'Las manos no necesitan cambiar al mismo ritmo.' },
            { n: 9,  level: 'intermediate', title: 'LH Pulso Largo', chords: ['Am','F','C','G'], bars: 12, coordinationPattern: 'leftLong', coordinationResource: 'Base larga + respuestas', explain: 'La derecha se mueve sin empujar a la izquierda.' },
            { n: 10, level: 'intermediate', title: 'Roles Intermedios', chords: ['G','D','Em','C','Am','D','G'], bars: 12, coordinationPattern: 'changingRoles', coordinationResource: 'Roles cambiantes', explain: 'Reconocer el rol antes de tocar.' },
            { n: 11, level: 'advanced', title: 'Pedal con Octavas', chords: ['D','A','Bm','G'], bars: 16, useOctaves: true, coordinationPattern: 'octavePedal', coordinationResource: 'Octava sostenida', stableBass: true, explain: 'El peso de LH debe mantenerse controlado.' },
            { n: 12, level: 'advanced', title: 'Mano Fija en Acordes Extendidos', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 16, coordinationPattern: 'colorHold', coordinationResource: 'Color sostenido', explain: 'La duracion larga permite escuchar el color del acorde.' },
            { n: 13, level: 'advanced', title: 'Cambio de Rol Avanzado', chords: ['D','A','Bm','G','Em','A'], bars: 16, coordinationPattern: 'advancedRoleSwitch', coordinationResource: 'Roles alternos', explain: 'El cambio de rol debe sentirse preparado.' },
            { n: 14, level: 'advanced', title: 'Mano Fija Moderna', chords: ['Cadd9','Gsus4','Am7','Fmaj7','Dadd9','A'], bars: 16, coordinationPattern: 'modernHold', coordinationResource: 'Sostenido moderno', explain: 'La estabilidad de una mano permite escuchar el color.' },
            { n: 15, level: 'advanced', title: 'Dominio Mano Fija + Mano Movil', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A','Bm7','G'], bars: 16, useOctaves: true, coordinationPattern: 'fixedMovingFinal', coordinationResource: 'Independencia de rol', keyChange: true, explain: 'Este ejercicio resume la independencia entre sostener y moverse.' },
          ],
        },
        continuousPattern: {
          label: 'Patrón Continuo', icon: '♾',
          desc: 'Mantener un patron repetitivo en una mano mientras la otra realiza entradas simples.',
          pattern: 'patron_continuo',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primer Ostinato', chords: ['C'], bars: 8, coordinationPattern: 'ostinato', coordinationResource: 'Ostinato', explain: 'La izquierda debe sentirse automatica.' },
            { n: 2,  level: 'basic', title: 'Ostinato en Dos Acordes', chords: ['C','G'], bars: 8, coordinationPattern: 'ostinatoChange', coordinationResource: 'Patron continuo con cambio', explain: 'El cambio de acorde no debe interrumpir el ciclo.' },
            { n: 3,  level: 'basic', title: 'RH en Tiempos Largos', chords: ['C','G','Am','F'], bars: 8, coordinationPattern: 'patternLongEvent', coordinationResource: 'Patron + evento largo', explain: 'La derecha entra sin detener el patron.' },
            { n: 4,  level: 'basic', title: 'Fundamental + Quinta', chords: ['C','G','Am','F'], bars: 8, useFifth: true, coordinationPattern: 'ostinatoFifth', coordinationResource: '1 - 5 continuo', explain: 'La quinta amplia el patron sin aumentar mucho la carga.' },
            { n: 5,  level: 'basic', title: 'Ciclo Basico', chords: ['C','F','Am','G','C'], bars: 8, coordinationPattern: 'stableOstinato', coordinationResource: 'Ostinato estable', explain: 'La continuidad importa mas que la variedad.' },
            { n: 6,  level: 'intermediate', title: 'Patron Worship Basico', chords: ['C','G','Am','F'], bars: 12, useFifth: true, coordinationPattern: 'worshipOstinato', coordinationResource: 'Patron worship', explain: 'La izquierda sostiene movimiento constante.' },
            { n: 7,  level: 'intermediate', title: 'Patron Continuo con Inversiones', chords: ['G','D','Em','C'], bars: 12, useInversions: true, useFifth: true, coordinationPattern: 'patternInversions', coordinationResource: 'Patron + inversion', explain: 'La mano derecha cambia sin romper el motor de LH.' },
            { n: 8,  level: 'intermediate', title: 'Patron en Octavas', chords: ['C','G','Am','F'], bars: 12, useOctaves: true, coordinationPattern: 'octaveOstinato', coordinationResource: 'Octavas continuas', explain: 'La amplitud debe mantenerse relajada.' },
            { n: 9,  level: 'intermediate', title: 'Patron con Silencios de RH', chords: ['Cmaj7','Am7','Fmaj7','G'], bars: 12, useFifth: true, coordinationPattern: 'patternWithSpaces', coordinationResource: 'Continuidad contra silencio', explain: 'El silencio de una mano no debe afectar a la otra.' },
            { n: 10, level: 'intermediate', title: 'Ciclo Intermedio', chords: ['G','D','Em','C','Am','D','G'], bars: 12, useFifth: true, coordinationPattern: 'prolongedPattern', coordinationResource: 'Patron prolongado', explain: 'La resistencia y regularidad son parte de la coordinacion.' },
            { n: 11, level: 'advanced', title: 'Patron con Bajo Caminante', chords: ['D','A','Bm','G'], bars: 16, coordinationPattern: 'walkingBass', coordinationResource: 'Bajo caminante simple', explain: 'El movimiento conecta acordes sin detener el pulso.' },
            { n: 12, level: 'advanced', title: 'Patron Largo', chords: ['D','A','Bm','G'], bars: 16, useFifth: true, coordinationPattern: 'longCycle', coordinationResource: 'Ciclo extendido', explain: 'Los patrones largos exigen memoria motora.' },
            { n: 13, level: 'advanced', title: 'Patron con Acordes Modernos', chords: ['Dadd9','Asus4','Bm7','Gsus2'], bars: 16, useFifth: true, coordinationPattern: 'modernPattern', coordinationResource: 'Patron moderno', explain: 'La complejidad armonica no debe afectar el pulso.' },
            { n: 14, level: 'advanced', title: 'Patron en Registro Amplio', chords: ['Cmaj7','Am7','Fmaj7','G','Dadd9','A'], bars: 16, useOctaves: true, coordinationPattern: 'widePattern', coordinationResource: 'Registro amplio', explain: 'El desplazamiento fisico debe ser medido y constante.' },
            { n: 15, level: 'advanced', title: 'Dominio de Patron Continuo', chords: ['C','G','Am','F','D','A','Bm','G'], bars: 16, useOctaves: true, coordinationPattern: 'continuousFinal', coordinationResource: 'Patron continuo completo', keyChange: true, explain: 'Este ejercicio resume la habilidad de sostener una mano automatica.' },
          ],
        },
        displacedRhythms: {
          label: 'Ritmos Desplazados', icon: '⏱',
          desc: 'Coordinar manos que entran en momentos distintos sin perder el pulso.',
          pattern: 'ritmos_desplazados',
          exercises: [
            { n: 1,  level: 'basic', title: 'Entrada Despues del Bajo', chords: ['C','G'], bars: 8, coordinationPattern: 'displacedEntry', coordinationResource: 'Entrada desplazada', explain: 'La derecha debe esperar su lugar sin perder pulso.' },
            { n: 2,  level: 'basic', title: 'Bajo Primero', chords: ['C','G'], bars: 8, coordinationPattern: 'bassFirst', coordinationResource: 'Bajo primero', explain: 'La izquierda crea referencia temporal.' },
            { n: 3,  level: 'basic', title: 'Acorde en Contratiempo', chords: ['C','G','Am','F'], bars: 8, coordinationPattern: 'offbeatChord', coordinationResource: 'Contratiempo', explain: 'La derecha no debe caer accidentalmente en el tiempo fuerte.' },
            { n: 4,  level: 'basic', title: 'Respuesta Ritmica', chords: ['C','G','Am','F'], bars: 8, coordinationPattern: 'rhythmicAnswer', coordinationResource: 'Respuesta desplazada', explain: 'Las manos dialogan ritmicamente, no melodicamente.' },
            { n: 5,  level: 'basic', title: 'Desplazamiento Basico', chords: ['C','F','Am','G','C'], bars: 8, coordinationPattern: 'displacedEntry', coordinationResource: 'Entrada retrasada', explain: 'El patron debe mantenerse estable hasta el cierre.' },
            { n: 6,  level: 'intermediate', title: 'Primera Sincopa', chords: ['C','G','Am','F'], bars: 12, coordinationPattern: 'syncopation', coordinationResource: 'Sincopa simple', explain: 'La sincopa empuja el ritmo sin acelerar.' },
            { n: 7,  level: 'intermediate', title: 'Pulso Contra Respuesta', chords: ['G','D','Em','C'], bars: 12, useFifth: true, coordinationPattern: 'melodyAgainstPulse', coordinationResource: 'Respuesta contra pulso', explain: 'La izquierda no debe seguir el desplazamiento de la derecha.' },
            { n: 8,  level: 'intermediate', title: 'Acordes Fuera del Tiempo Fuerte', chords: ['C','G','Am','F'], bars: 12, useInversions: true, coordinationPattern: 'offbeatChord', coordinationResource: 'Offbeat', explain: 'La claridad depende de contar internamente.' },
            { n: 9,  level: 'intermediate', title: 'Desplazamiento con Color', chords: ['Cadd9','G','Am7','Fmaj7'], bars: 12, useInversions: true, coordinationPattern: 'worshipDisplaced', coordinationResource: 'Offbeat moderno', explain: 'El color armonico no debe suavizar el ritmo.' },
            { n: 10, level: 'intermediate', title: 'Desplazamiento Intermedio', chords: ['G','D','Em','C','Am','D','G'], bars: 12, useInversions: true, coordinationPattern: 'mixedDisplaced', coordinationResource: 'Patrones desplazados', explain: 'Mantener pulso comun con entradas diferentes.' },
            { n: 11, level: 'advanced', title: 'Desplazamiento Continuo', chords: ['D','A','Bm','G'], bars: 16, useFifth: true, coordinationPattern: 'continuousDisplaced', coordinationResource: 'Desplazamiento continuo', explain: 'La independencia temporal debe permanecer constante.' },
            { n: 12, level: 'advanced', title: 'Sincopa Extendida', chords: ['G','D','Em','C','D','A','Bm','G'], bars: 16, useInversions: true, coordinationPattern: 'syncopation', coordinationResource: 'Sincopa prolongada', explain: 'La sincopa no debe reiniciarse de forma torpe en cada acorde.' },
            { n: 13, level: 'advanced', title: 'Desplazamiento con Bajo Activo', chords: ['Dadd9','Asus4','Bm7','Gsus2'], bars: 16, useFifth: true, coordinationPattern: 'worshipDisplaced', coordinationResource: 'Bajo activo + offbeat', explain: 'Ambas manos tienen ritmo propio, pero comparten centro.' },
            { n: 14, level: 'advanced', title: 'Manos Nunca Coinciden', chords: ['Cmaj7','Am7','Fmaj7','G'], bars: 16, coordinationPattern: 'neverTogether', coordinationResource: 'No coincidencia', explain: 'El estudiante debe confiar en el pulso interno.' },
            { n: 15, level: 'advanced', title: 'Dominio de Ritmos Desplazados', chords: ['C','G','Am','F','D','A','Bm','G'], bars: 16, useFifth: true, coordinationPattern: 'displacedFinal', coordinationResource: 'Independencia temporal completa', keyChange: true, explain: 'Este ejercicio resume la coordinacion ritmica entre manos.' },
          ],
        },
        simpleVoices: {
          label: 'Dos Voces Simples', icon: '⇄',
          desc: 'Coordinar dos lineas simples, una por mano, sin desarrollar todavia arreglo melodico.',
          pattern: 'dos_voces_simples',
          exercises: [
            { n: 1,  level: 'basic', title: 'Dos Notas Coordinadas', chords: ['C','G'], bars: 8, coordinationPattern: 'twoNotes', coordinationResource: 'Dos voces basicas', explain: 'Cada mano debe escucharse como una linea simple.' },
            { n: 2,  level: 'basic', title: 'Movimiento Paralelo', chords: ['C','G'], bars: 8, coordinationPattern: 'parallelMotion', coordinationResource: 'Movimiento paralelo', explain: 'Las dos voces se mueven juntas, pero en registros diferentes.' },
            { n: 3,  level: 'basic', title: 'Movimiento Contrario', chords: ['C','G','Am','F'], bars: 8, coordinationPattern: 'contraryMotion', coordinationResource: 'Movimiento contrario', explain: 'El movimiento contrario obliga a separar la direccion de cada mano.' },
            { n: 4,  level: 'basic', title: 'Pregunta y Respuesta Tecnica', chords: ['C','F','G','C'], bars: 8, coordinationPattern: 'technicalCallResponse', coordinationResource: 'Respuesta simple', explain: 'El dialogo aqui es de coordinacion, no de composicion melodica.' },
            { n: 5,  level: 'basic', title: 'Dos Voces Basicas', chords: ['C','F','Am','G','C'], bars: 8, coordinationPattern: 'simpleVoices', coordinationResource: 'Lineas simples', explain: 'La meta es claridad entre manos.' },
            { n: 6,  level: 'intermediate', title: 'Linea Larga vs Linea Corta', chords: ['C','G','Am','F'], bars: 12, coordinationPattern: 'longShort', coordinationResource: 'Duraciones distintas', explain: 'Una mano sostiene mientras la otra articula.' },
            { n: 7,  level: 'intermediate', title: 'Escalones en RH, Saltos en LH', chords: ['G','D','Em','C'], bars: 12, coordinationPattern: 'stepsVsLeaps', coordinationResource: 'Tipos de movimiento distintos', explain: 'Cada mano resuelve un problema fisico diferente.' },
            { n: 8,  level: 'intermediate', title: 'Saltos en RH, Escalones en LH', chords: ['Am','F','C','G'], bars: 12, coordinationPattern: 'leapsVsSteps', coordinationResource: 'Roles invertidos', explain: 'Cambiar el rol evita automatismos fragiles.' },
            { n: 9,  level: 'intermediate', title: 'Voces en Espacios', chords: ['C','G','Am','F'], bars: 12, useFifth: true, coordinationPattern: 'staggeredVoices', coordinationResource: 'Entradas escalonadas', explain: 'Las voces no compiten por el mismo espacio temporal.' },
            { n: 10, level: 'intermediate', title: 'Dos Voces Intermedias', chords: ['G','D','Em','C','Am','D','G'], bars: 12, coordinationPattern: 'coordinatedLines', coordinationResource: 'Lineas coordinadas', explain: 'Reconocer rapidamente como se mueve cada mano.' },
            { n: 11, level: 'advanced', title: 'Movimiento Contrario Continuo', chords: ['D','A','Bm','G'], bars: 16, coordinationPattern: 'continuousContrary', coordinationResource: 'Contrario continuo', explain: 'La direccion opuesta debe sentirse natural.' },
            { n: 12, level: 'advanced', title: 'Dos Voces con Acordes de Color', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 16, coordinationPattern: 'colorLines', coordinationResource: 'Lineas con color', explain: 'Los colores no deben volver confusa la coordinacion.' },
            { n: 13, level: 'advanced', title: 'Voz Superior Fija, Inferior Movil', chords: ['Cadd9','G','Am7','Fmaj7'], bars: 16, coordinationPattern: 'fixedUpper', coordinationResource: 'Voz fija + voz movil', explain: 'Combina esta tecnica con la independencia de mano fija.' },
            { n: 14, level: 'advanced', title: 'Dos Voces en Registro Amplio', chords: ['D','A','Bm','G','Em','A'], bars: 16, coordinationPattern: 'wideVoices', coordinationResource: 'Registro amplio', explain: 'La distancia entre manos no debe romper el control.' },
            { n: 15, level: 'advanced', title: 'Dominio de Dos Voces Simples', chords: ['C','G','Am','F','D','A','Bm','G'], bars: 16, coordinationPattern: 'simpleVoicesFinal', coordinationResource: 'Dos voces coordinadas', keyChange: true, explain: 'Prepara para melodias y arreglos reales sin reemplazar ese modulo.' },
          ],
        },
        technicalApplication: {
          label: 'Aplicación Técnica', icon: '🎶',
          desc: 'Estudios cortos que integran recursos de coordinacion sin convertirlos aun en arreglos finales.',
          pattern: 'aplicacion_tecnica',
          exercises: [
            { n: 1,  level: 'basic', title: 'Estudio de Ataques Juntos', song: 'Estudio de Ataques Juntos', chords: ['C','G','Am','F'], bars: 8, useInversions: true, coordinationPattern: 'rootChord', coordinationResource: 'Coordinacion vertical', explain: 'Ambas manos deben llegar juntas con balance.' },
            { n: 2,  level: 'basic', title: 'Estudio de Alternancia', song: 'Estudio de Alternancia', chords: ['C','G','Am','F'], bars: 8, coordinationPattern: 'alternating', coordinationResource: 'Manos alternadas', explain: 'El pulso debe pasar de una mano a la otra sin romperse.' },
            { n: 3,  level: 'basic', title: 'Estudio de Mano Fija', song: 'Estudio de Mano Fija', chords: ['C','F','G','C'], bars: 8, coordinationPattern: 'leftHold', coordinationResource: 'Mano fija + mano movil', explain: 'Una mano permanece estable mientras la otra cambia.' },
            { n: 4,  level: 'basic', title: 'Estudio de Patron Continuo', song: 'Estudio de Patron Continuo', chords: ['C','F','Am','G','C'], bars: 8, coordinationPattern: 'ostinato', coordinationResource: 'Patron continuo', explain: 'La mano del patron no debe detenerse.' },
            { n: 5,  level: 'basic', title: 'Estudio Tecnico Basico', song: 'Estudio Tecnico Basico', chords: ['C','G','Am','F','C'], bars: 8, coordinationPattern: 'technicalMixedBasic', coordinationResource: 'Coordinacion combinada', explain: 'Cambiar de tarea sin perder pulso.' },
            { n: 6,  level: 'intermediate', title: 'Estudio con Contratiempo', song: 'Estudio con Contratiempo', chords: ['C','G','Am','F'], bars: 12, useInversions: true, useFifth: true, coordinationPattern: 'offbeatChord', coordinationResource: 'Contratiempo', explain: 'RH entra fuera del tiempo fuerte con pulso estable.' },
            { n: 7,  level: 'intermediate', title: 'Estudio de Roles Cambiantes', song: 'Estudio de Roles Cambiantes', chords: ['G','D','Em','C'], bars: 12, coordinationPattern: 'changingRoles', coordinationResource: 'Roles cambiantes', explain: 'Reconocer rapidamente la funcion de cada mano.' },
            { n: 8,  level: 'intermediate', title: 'Estudio de Dos Voces', song: 'Estudio de Dos Voces', chords: ['Cmaj7','Am7','F','G'], bars: 12, coordinationPattern: 'simpleVoices', coordinationResource: 'Dos voces simples', explain: 'Las dos manos deben conservar claridad individual.' },
            { n: 9,  level: 'intermediate', title: 'Estudio de Patron y Respuesta', song: 'Estudio de Patron y Respuesta', chords: ['Dmaj7','Bm7','Gmaj7','A7'], bars: 12, useFifth: true, coordinationPattern: 'patternLongEvent', coordinationResource: 'Patron continuo + respuesta', explain: 'La derecha participa sin detener el motor de LH.' },
            { n: 10, level: 'intermediate', title: 'Estudio Tecnico Intermedio', song: 'Estudio Tecnico Intermedio', chords: ['Em','D','C','B'], bars: 12, useFifth: true, coordinationPattern: 'technicalMixedIntermediate', coordinationResource: 'Coordinacion mixta', explain: 'La coordinacion temporal adquiere protagonismo.' },
            { n: 11, level: 'advanced', title: 'Estudio de Desplazamiento Continuo', song: 'Estudio de Desplazamiento Continuo', chords: ['D','A','Bm','G'], bars: 16, useFifth: true, coordinationPattern: 'continuousDisplaced', coordinationResource: 'Ritmos desplazados', explain: 'Las manos operan con autonomia temporal.' },
            { n: 12, level: 'advanced', title: 'Estudio de Alternancia Avanzada', song: 'Estudio de Alternancia Avanzada', chords: ['G','D','Em','C','D','A','Bm','G'], bars: 16, useInversions: true, coordinationPattern: 'alternatingFinal', coordinationResource: 'Manos alternadas avanzadas', explain: 'La actividad aumenta, pero el pulso permanece estable.' },
            { n: 13, level: 'advanced', title: 'Estudio de Patron Moderno', song: 'Estudio de Patron Moderno', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A'], bars: 20, useInversions: true, useFifth: true, coordinationPattern: 'modernPattern', coordinationResource: 'Patron continuo moderno', explain: 'La mano del patron se mantiene automatica aunque cambie el color.' },
            { n: 14, level: 'advanced', title: 'Estudio Combinado Avanzado', song: 'Estudio Combinado Avanzado', chords: ['Am','G','F','E','Dadd9','A','Bm7','G'], bars: 20, useFifth: true, coordinationPattern: 'technicalMixedAdvanced', coordinationResource: 'Combinacion de recursos', explain: 'Las manos mantienen funciones claramente diferenciadas.' },
            { n: 15, level: 'advanced', title: 'Proyecto Tecnico de Coordinacion', song: 'Proyecto Tecnico de Coordinacion', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], bars: 20, useInversions: true, useFifth: true, useOctaves: true, coordinationPattern: 'technicalFinal', coordinationResource: 'Coordinacion tecnica completa', keyChange: true, explain: 'Este ejercicio cierra la tecnica de coordinacion y prepara Melodia y Arreglo.' },
          ],
        },
      },
    },

    // ── MÓDULO 7 — MELODÍA Y ARREGLO ────────────────────────────────
    melodyArrangement: {
      label: 'Melodía y Arreglo',
      icon:  '🎙',
      desc:  'Consolidación musical: melodía principal con bajo, acordes, voicings, arpegios, patrones y forma.',
      techniques: {
        cantableMelody: {
          label: 'Melodía Cantable', icon: '🎵',
          desc: 'Crear melodías claras, respiradas y memorables antes de arreglarlas.',
          pattern: 'melodia_cantable',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primer Motivo Cantable', chords: ['C'], bars: 8, arrangementPattern: 'shortMotif', arrangementAccompaniment: 'none', arrangementResource: 'Motivo de 3 notas', arrangementForm: 'A', explain: 'La melodia debe sentirse como una idea pequena que se puede recordar.' },
            { n: 2,  level: 'basic', title: 'Repeticion Clara', chords: ['C','G'], bars: 8, arrangementPattern: 'repetition', arrangementAccompaniment: 'none', arrangementResource: 'Repeticion', arrangementForm: 'A-A', explain: 'La repeticion ayuda a que el oyente entienda la idea principal.' },
            { n: 3,  level: 'basic', title: 'Pregunta Sencilla', chords: ['C','G'], bars: 8, arrangementPattern: 'question', arrangementAccompaniment: 'none', arrangementResource: 'Pregunta musical', arrangementForm: 'Pregunta', explain: 'La frase debe pedir continuacion, no sonar terminada.' },
            { n: 4,  level: 'basic', title: 'Respuesta Sencilla', chords: ['C','G','C'], bars: 8, arrangementPattern: 'answer', arrangementAccompaniment: 'none', arrangementResource: 'Respuesta musical', arrangementForm: 'Respuesta', explain: 'La respuesta debe sonar como cierre natural de la pregunta.' },
            { n: 5,  level: 'basic', title: 'Mini Melodia Basica', chords: ['C','G','Am','F'], bars: 8, arrangementPattern: 'questionAnswer', arrangementAccompaniment: 'bassLong', arrangementResource: 'Pregunta y respuesta', arrangementForm: 'A-B', explain: 'El estudiante empieza a sentir forma melodica, no solo notas sueltas.' },
            { n: 6,  level: 'intermediate', title: 'Frase con Respiracion', chords: ['C','G','Am','F'], bars: 12, arrangementPattern: 'breathing', arrangementAccompaniment: 'bassLong', arrangementResource: 'Espacios melodicos', arrangementForm: 'A-A prime', explain: 'Una melodia bonita no toca todo el tiempo.' },
            { n: 7,  level: 'intermediate', title: 'Variacion de Motivo', chords: ['C','F','G','C'], bars: 12, arrangementPattern: 'variation', arrangementAccompaniment: 'bass', arrangementResource: 'Variacion simple', arrangementForm: 'A-A prime', explain: 'La variacion mantiene interes sin crear una idea completamente nueva.' },
            { n: 8,  level: 'intermediate', title: 'Direccion Ascendente', chords: ['G','D','Em','C'], bars: 12, arrangementPattern: 'ascending', arrangementAccompaniment: 'bass', arrangementResource: 'Contorno ascendente', arrangementForm: 'A', explain: 'El ascenso debe sonar como crecimiento musical.' },
            { n: 9,  level: 'intermediate', title: 'Direccion Descendente', chords: ['Am','F','C','G'], bars: 12, arrangementPattern: 'descending', arrangementAccompaniment: 'bass', arrangementResource: 'Contorno descendente', arrangementForm: 'A', explain: 'El descenso debe sonar como reposo, no como perdida de energia.' },
            { n: 10, level: 'intermediate', title: 'Mini Melodia Intermedia', chords: ['G','D','Em','C','Am','D','G'], bars: 12, arrangementPattern: 'formAAB', arrangementAccompaniment: 'bass', arrangementResource: 'Forma A - A prime - B', arrangementForm: 'A-A prime-B', explain: 'La melodia ya debe sentirse como una pequena cancion.' },
            { n: 11, level: 'advanced', title: 'Salto Cantable', chords: ['D','A','Bm','G'], bars: 16, arrangementPattern: 'leapResolve', arrangementAccompaniment: 'bass', arrangementResource: 'Salto y resolucion', arrangementForm: 'A-B', explain: 'Un salto funciona mejor cuando despues encuentra descanso.' },
            { n: 12, level: 'advanced', title: 'Punto Alto', chords: ['D','A','Bm','G'], bars: 16, arrangementPattern: 'climax', arrangementAccompaniment: 'bass', arrangementResource: 'Climax melodico', arrangementForm: 'A-B-A prime', explain: 'La melodia debe tener un momento mas importante que los demas.' },
            { n: 13, level: 'advanced', title: 'Melodia con Color', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 16, arrangementPattern: 'colorMelody', arrangementAccompaniment: 'bass', arrangementResource: 'Color melodico', arrangementForm: 'A-B', explain: 'Las notas de color deben sonar expresivas, no accidentales.' },
            { n: 14, level: 'advanced', title: 'Melodia Moderna', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A'], bars: 16, arrangementPattern: 'modernMotif', arrangementAccompaniment: 'bass', arrangementResource: 'Motivo moderno', arrangementForm: 'A-B', explain: 'La melodia debe conservar simplicidad aunque la armonia tenga mas color.' },
            { n: 15, level: 'advanced', title: 'Dominio de Melodia Cantable', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A','Bm7','G'], bars: 16, arrangementPattern: 'cantableFinal', arrangementAccompaniment: 'bassLong', arrangementResource: 'Melodia cantable completa', arrangementForm: 'A-B-A prime', keyChange: true, explain: 'Este ejercicio resume la habilidad de crear una melodia clara antes de arreglarla.' },
          ],
        },
        melodyHarmony: {
          label: 'Melodía sobre Armonía', icon: '🎯',
          desc: 'Construir melodías que siguen la armonía, resuelven y usan notas objetivo.',
          pattern: 'melodia_armonia',
          exercises: [
            { n: 1,  level: 'basic', title: 'Resolver en la Fundamental', chords: ['C'], bars: 8, arrangementPattern: 'targetRoot', arrangementAccompaniment: 'bassLong', arrangementResource: 'Nota objetivo: 1', arrangementForm: 'A', explain: 'La fundamental da estabilidad inmediata.' },
            { n: 2,  level: 'basic', title: 'Resolver en la Tercera', chords: ['C','G'], bars: 8, arrangementPattern: 'targetThird', arrangementAccompaniment: 'bassLong', arrangementResource: 'Nota objetivo: 3', arrangementForm: 'A', explain: 'La tercera suele hacer que la melodia suene mas expresiva.' },
            { n: 3,  level: 'basic', title: 'Resolver en la Quinta', chords: ['C','G','C'], bars: 8, arrangementPattern: 'targetFifth', arrangementAccompaniment: 'bassLong', arrangementResource: 'Nota objetivo: 5', arrangementForm: 'A', explain: 'La quinta da apertura sin perder estabilidad.' },
            { n: 4,  level: 'basic', title: 'Cambios de Nota Objetivo', chords: ['C','G','Am','F'], bars: 8, arrangementPattern: 'mixedTargets', arrangementAccompaniment: 'bass', arrangementResource: '1, 3 y 5 como destinos', arrangementForm: 'A-B', explain: 'La melodia empieza a seguir la progresion.' },
            { n: 5,  level: 'basic', title: 'Mini Frase Armonica', chords: ['C','F','Am','G','C'], bars: 8, arrangementPattern: 'harmonicPhrase', arrangementAccompaniment: 'bass', arrangementResource: 'Destino armonico', arrangementForm: 'A-B', explain: 'Cada frase debe aterrizar en una nota que pertenece al acorde.' },
            { n: 6,  level: 'intermediate', title: 'Nota de Paso', chords: ['C','G','Am','F'], bars: 12, arrangementPattern: 'passingTone', arrangementAccompaniment: 'bass', arrangementResource: 'Nota de paso', arrangementForm: 'A-A prime', explain: 'La nota de paso crea movimiento sin perder claridad armonica.' },
            { n: 7,  level: 'intermediate', title: 'Apoyatura Simple', chords: ['C','G','Am','F'], bars: 12, arrangementPattern: 'appoggiatura', arrangementAccompaniment: 'bass', arrangementResource: 'Apoyatura', arrangementForm: 'A-B', explain: 'La tension debe resolver pronto para sonar intencional.' },
            { n: 8,  level: 'intermediate', title: 'Septima como Color', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 12, arrangementPattern: 'seventhColor', arrangementAccompaniment: 'bass', arrangementResource: 'Septima melodica', arrangementForm: 'A-B', explain: 'La septima agrega profundidad emocional.' },
            { n: 9,  level: 'intermediate', title: 'Novena como Color', chords: ['Cadd9','G','Am7','Fmaj7'], bars: 12, arrangementPattern: 'ninthColor', arrangementAccompaniment: 'bass', arrangementResource: 'Novena melodica', arrangementForm: 'A-B', explain: 'La novena da un sonido moderno y abierto.' },
            { n: 10, level: 'intermediate', title: 'Mini Cancion Armonica', chords: ['G','D','Em','C','Am','D','G'], bars: 12, arrangementPattern: 'targetsPassing', arrangementAccompaniment: 'bass', arrangementResource: 'Notas objetivo con notas de paso', arrangementForm: 'A-B-A', explain: 'La melodia debe moverse con la armonia, no encima de ella.' },
            { n: 11, level: 'advanced', title: 'Tension y Resolucion', chords: ['D','A','Bm','G'], bars: 16, arrangementPattern: 'tensionResolve', arrangementAccompaniment: 'bass', arrangementResource: 'Tension controlada', arrangementForm: 'A-B', explain: 'La tension funciona cuando el oido entiende hacia donde va.' },
            { n: 12, level: 'advanced', title: 'Melodia sobre Cambio de Tonalidad', chords: ['C','G','Am','F','D','A','Bm','G'], bars: 16, arrangementPattern: 'keyChangeTargets', arrangementAccompaniment: 'bass', arrangementResource: 'Notas objetivo por tonalidad', arrangementForm: 'A-B', keyChange: true, explain: 'El estudiante debe sentir cuando cambia el centro armonico.' },
            { n: 13, level: 'advanced', title: 'Frase con Acordes Extendidos', chords: ['Cmaj7','Am7','Fmaj7','Gsus4'], bars: 16, arrangementPattern: 'extendedColors', arrangementAccompaniment: 'bass', arrangementResource: 'Color armonico', arrangementForm: 'A-B', explain: 'Los colores deben aparecer como parte de la frase.' },
            { n: 14, level: 'advanced', title: 'Melodia Guiada por Voicings', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A'], bars: 16, arrangementPattern: 'voicingTop', arrangementAccompaniment: 'bass', arrangementResource: 'Melodia en voz superior', arrangementForm: 'A-B', explain: 'La armonia debe acomodarse a la melodia, no al reves.' },
            { n: 15, level: 'advanced', title: 'Dominio de Melodia sobre Armonia', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], bars: 16, arrangementPattern: 'harmonyFinal', arrangementAccompaniment: 'bass', arrangementResource: 'Melodia armonicamente consciente', arrangementForm: 'A-B-A prime', keyChange: true, explain: 'Este ejercicio resume la relacion entre melodia y armonia.' },
          ],
        },
        melodyBass: {
          label: 'Melodía con Bajo', icon: '〰',
          desc: 'Tocar melodía clara con una base de bajo que sostiene sin competir.',
          pattern: 'melodia_bajo',
          exercises: [
            { n: 1,  level: 'basic', title: 'Melodia con Bajo Largo', chords: ['C'], bars: 8, arrangementPattern: 'simplePhrase', arrangementAccompaniment: 'bassLong', arrangementResource: 'Fundamental larga', arrangementForm: 'A', explain: 'El estudiante aprende a escuchar melodia y base al mismo tiempo.' },
            { n: 2,  level: 'basic', title: 'Bajo por Compas', chords: ['C','G'], bars: 8, arrangementPattern: 'simplePhrase', arrangementAccompaniment: 'bass', arrangementResource: 'Fundamental por compas', arrangementForm: 'A', explain: 'La izquierda marca la armonia mientras la derecha canta.' },
            { n: 3,  level: 'basic', title: 'Bajo y Repeticion Melodica', chords: ['C','G','Am','F'], bars: 8, arrangementPattern: 'repetition', arrangementAccompaniment: 'bass', arrangementResource: 'Fundamental', arrangementForm: 'A-A', explain: 'El motivo debe conservar identidad aunque cambie la armonia.' },
            { n: 4,  level: 'basic', title: 'Bajo con Espacios', chords: ['C','F','G','C'], bars: 8, arrangementPattern: 'breathing', arrangementAccompaniment: 'bassSparse', arrangementResource: 'Fundamental con silencios', arrangementForm: 'A-B', explain: 'El silencio en el bajo ayuda a que la melodia tenga aire.' },
            { n: 5,  level: 'basic', title: 'Mini Cancion Bajo Simple', chords: ['C','F','Am','G','C'], bars: 8, arrangementPattern: 'questionAnswer', arrangementAccompaniment: 'bass', arrangementResource: 'Fundamental por acorde', arrangementForm: 'A-B', explain: 'La cancion debe sentirse completa aunque el acompanamiento sea minimo.' },
            { n: 6,  level: 'intermediate', title: 'Fundamental + Quinta', chords: ['C','G','Am','F'], bars: 12, arrangementPattern: 'harmonicPhrase', arrangementAccompaniment: 'rootFifth', arrangementResource: 'Fundamental + quinta', arrangementForm: 'A-A prime', explain: 'La quinta aporta movimiento y amplitud.' },
            { n: 7,  level: 'intermediate', title: 'Bajo Alternado', chords: ['C','G','Am','F'], bars: 12, arrangementPattern: 'variation', arrangementAccompaniment: 'alternatingBass', arrangementResource: '1 - 5 - 1 - 5', arrangementForm: 'A-A prime', explain: 'El bajo se vuelve mas activo sin robar protagonismo.' },
            { n: 8,  level: 'intermediate', title: 'Bajo en Octavas', chords: ['G','D','Em','C'], bars: 12, arrangementPattern: 'ascending', arrangementAccompaniment: 'octaves', arrangementResource: 'Octavas', arrangementForm: 'A-B', explain: 'Las octavas deben sonar amplias, no pesadas.' },
            { n: 9,  level: 'intermediate', title: 'Bajo de Balada', chords: ['Am','F','C','G'], bars: 12, arrangementPattern: 'descending', arrangementAccompaniment: 'balladBass', arrangementResource: 'Fundamental, quinta y regreso', arrangementForm: 'A-B', explain: 'El bajo debe crear movimiento emocional debajo de la melodia.' },
            { n: 10, level: 'intermediate', title: 'Mini Cancion con Bajo Activo', chords: ['G','D','Em','C','Am','D','G'], bars: 12, arrangementPattern: 'formAAB', arrangementAccompaniment: 'rootFifth', arrangementResource: 'Fundamental + quinta', arrangementForm: 'A-A prime-B', explain: 'La izquierda empieza a sostener una cancion real.' },
            { n: 11, level: 'advanced', title: 'Bajo Caminante Simple', chords: ['D','A','Bm','G'], bars: 16, arrangementPattern: 'leapResolve', arrangementAccompaniment: 'walking', arrangementResource: 'Bajo caminante', arrangementForm: 'A-B', explain: 'El bajo debe conectar sin cambiar el caracter de la melodia.' },
            { n: 12, level: 'advanced', title: 'Bajo con Cambio de Registro', chords: ['D','A','Bm','G'], bars: 16, arrangementPattern: 'climax', arrangementAccompaniment: 'octaveFifth', arrangementResource: 'Octava baja + quinta', arrangementForm: 'A-B-A', explain: 'El registro debe apoyar la forma de la frase.' },
            { n: 13, level: 'advanced', title: 'Bajo Moderno', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 16, arrangementPattern: 'colorMelody', arrangementAccompaniment: 'modernBass', arrangementResource: 'Fundamental + quinta + octava', arrangementForm: 'A-B', explain: 'El bajo debe sostener los colores armonicos sin ensuciarlos.' },
            { n: 14, level: 'advanced', title: 'Melodia con Bajo Instrumental', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A'], bars: 16, arrangementPattern: 'modernMotif', arrangementAccompaniment: 'wideBass', arrangementResource: 'Bajo amplio', arrangementForm: 'A-B', explain: 'La pieza debe sentirse completa aunque no haya acordes llenos.' },
            { n: 15, level: 'advanced', title: 'Dominio de Melodia con Bajo', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A','Bm7','G'], bars: 16, arrangementPattern: 'bassFinal', arrangementAccompaniment: 'mixedBass', arrangementResource: 'Fundamental, quinta, octavas y conexiones', arrangementForm: 'A-B-A prime', keyChange: true, explain: 'Este ejercicio resume el uso del bajo como base de una melodia.' },
          ],
        },
        melodyVoicings: {
          label: 'Melodía + Acordes y Voicings', icon: '🎼',
          desc: 'Poner acordes y voicings debajo de una melodía que manda desde la voz superior.',
          pattern: 'melodia_voicings',
          exercises: [
            { n: 1,  level: 'basic', title: 'Melodia Sobre Triada', chords: ['C'], bars: 8, arrangementPattern: 'topTriad', arrangementAccompaniment: 'chordVoicing', arrangementResource: 'Triada bajo melodia', arrangementForm: 'A', explain: 'La melodia debe escucharse por encima del acorde.' },
            { n: 2,  level: 'basic', title: 'Dos Acordes, Voz Superior', chords: ['C','G'], bars: 8, arrangementPattern: 'topVoice', arrangementAccompaniment: 'chordVoicing', arrangementResource: 'Voz superior', arrangementForm: 'A', explain: 'El cambio de acorde no debe ocultar la frase.' },
            { n: 3,  level: 'basic', title: 'Inversion Simple', chords: ['C','G','Am','F'], bars: 8, useInversions: true, arrangementPattern: 'inversionTop', arrangementAccompaniment: 'chordVoicing', arrangementResource: 'Inversiones', arrangementForm: 'A-B', explain: 'Las inversiones permiten que la melodia fluya sin saltos innecesarios.' },
            { n: 4,  level: 'basic', title: 'Acorde con Melodia Larga', chords: ['C','F','G','C'], bars: 8, arrangementPattern: 'commonTop', arrangementAccompaniment: 'chordVoicing', arrangementResource: 'Nota comun superior', arrangementForm: 'A', explain: 'Una misma nota puede adquirir distinto color segun el acorde.' },
            { n: 5,  level: 'basic', title: 'Mini Cancion con Acordes', chords: ['C','F','Am','G','C'], bars: 8, useInversions: true, arrangementPattern: 'melodyChords', arrangementAccompaniment: 'chordVoicing', arrangementResource: 'Melodia + acordes', arrangementForm: 'A-B', explain: 'El arreglo ya combina frase y armonia en la mano derecha.' },
            { n: 6,  level: 'intermediate', title: 'Voicing Cercano', chords: ['C','G','Am','F'], bars: 12, useInversions: true, arrangementPattern: 'closeVoicing', arrangementAccompaniment: 'chordVoicing', arrangementResource: 'Movimiento minimo', arrangementForm: 'A-A prime', explain: 'La mano debe moverse poco y la melodia debe seguir cantando.' },
            { n: 7,  level: 'intermediate', title: 'Voicing Abierto', chords: ['C','G','Am','F'], bars: 12, useInversions: true, arrangementPattern: 'openVoicing', arrangementAccompaniment: 'openVoicing', arrangementResource: 'Acordes abiertos', arrangementForm: 'A-B', explain: 'El espacio entre voces permite que la melodia respire.' },
            { n: 8,  level: 'intermediate', title: 'Add9 en la Melodia', chords: ['Cadd9','G','Am7','Fmaj7'], bars: 12, useInversions: true, arrangementPattern: 'add9Top', arrangementAccompaniment: 'chordVoicing', arrangementResource: 'Add9', arrangementForm: 'A-B', explain: 'La novena debe sonar como color intencional.' },
            { n: 9,  level: 'intermediate', title: 'Sus como Tension', chords: ['Csus2','Gsus4','Am7','Fmaj7'], bars: 12, useInversions: true, arrangementPattern: 'susTop', arrangementAccompaniment: 'chordVoicing', arrangementResource: 'Suspensiones', arrangementForm: 'A-B', explain: 'La suspension necesita direccion y resolucion.' },
            { n: 10, level: 'intermediate', title: 'Mini Cancion con Voicings', chords: ['G','D','Em','C','Am','D','G'], bars: 12, useInversions: true, arrangementPattern: 'connectedVoicings', arrangementAccompaniment: 'chordVoicing', arrangementResource: 'Voicings conectados', arrangementForm: 'Intro-A-B', explain: 'El arreglo debe sonar mas rico sin perder simplicidad.' },
            { n: 11, level: 'advanced', title: 'Melodia con Maj7', chords: ['Cmaj7','Fmaj7','Am7','G7'], bars: 16, useInversions: true, arrangementPattern: 'maj7Top', arrangementAccompaniment: 'chordVoicing', arrangementResource: 'Maj7', arrangementForm: 'A-B', explain: 'La maj7 debe sonar delicada y estable dentro del voicing.' },
            { n: 12, level: 'advanced', title: 'Melodia con m7', chords: ['Am7','Dm7','G7','Cmaj7'], bars: 16, useInversions: true, arrangementPattern: 'minor7Top', arrangementAccompaniment: 'chordVoicing', arrangementResource: 'm7 y dominante', arrangementForm: 'A-B', explain: 'Las septimas aportan direccion armonica.' },
            { n: 13, level: 'advanced', title: 'Voicings Modernos', chords: ['Cadd9','Gsus4','Am7','Fmaj7'], bars: 16, useInversions: true, arrangementPattern: 'modernVoicingTop', arrangementAccompaniment: 'openVoicing', arrangementResource: 'Textura moderna', arrangementForm: 'A-B', explain: 'Los colores armonicos deben reforzar la melodia.' },
            { n: 14, level: 'advanced', title: 'Melodia Guiando el Arreglo', chords: ['Cmaj7','Am7','Fmaj7','G7','Dadd9','A'], bars: 16, useInversions: true, arrangementPattern: 'melodyGuidedVoicing', arrangementAccompaniment: 'openVoicing', arrangementResource: 'Melodia como guia', arrangementForm: 'A-B-A prime', explain: 'La armonia debe seguir a la melodia de forma natural.' },
            { n: 15, level: 'advanced', title: 'Dominio de Melodia con Voicings', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], bars: 16, useInversions: true, arrangementPattern: 'voicingFinal', arrangementAccompaniment: 'openVoicing', arrangementResource: 'Voicings melodicos', arrangementForm: 'A-B-A prime', keyChange: true, explain: 'Este ejercicio resume la integracion entre melodia, acordes y color armonico.' },
          ],
        },
        melodyPatterns: {
          label: 'Melodía + Arpegios y Patrones', icon: '🌊',
          desc: 'Sostener una melodía mientras la izquierda usa arpegios, Alberti y patrones.',
          pattern: 'melodia_patrones',
          exercises: [
            { n: 1,  level: 'basic', title: 'Melodia con Arpegio Simple', chords: ['C'], bars: 8, arrangementPattern: 'simplePhrase', arrangementAccompaniment: 'arpeggio', arrangementResource: 'Arpegio 1 - 3 - 5', arrangementForm: 'A', explain: 'La izquierda crea movimiento sin competir con la melodia.' },
            { n: 2,  level: 'basic', title: 'Arpegio sobre Dos Acordes', chords: ['C','G'], bars: 8, arrangementPattern: 'repetition', arrangementAccompaniment: 'arpeggio', arrangementResource: 'Arpegio ascendente', arrangementForm: 'A-A', explain: 'El cambio de acorde debe sentirse fluido.' },
            { n: 3,  level: 'basic', title: 'Arpegio con Espacio Melodico', chords: ['C','G','Am','F'], bars: 8, arrangementPattern: 'breathing', arrangementAccompaniment: 'arpeggio', arrangementResource: 'Arpegio suave', arrangementForm: 'A-B', explain: 'El acompanamiento llena el espacio sin saturar.' },
            { n: 4,  level: 'basic', title: 'Arpegio Descendente', chords: ['C','F','G','C'], bars: 8, arrangementPattern: 'descending', arrangementAccompaniment: 'arpeggioDown', arrangementResource: 'Arpegio descendente', arrangementForm: 'A', explain: 'El movimiento descendente puede dar calma a la frase.' },
            { n: 5,  level: 'basic', title: 'Mini Cancion con Arpegio', chords: ['C','F','Am','G','C'], bars: 8, arrangementPattern: 'questionAnswer', arrangementAccompaniment: 'arpeggio', arrangementResource: 'Arpegio basico', arrangementForm: 'A-B', explain: 'La pieza debe sonar completa con recursos sencillos.' },
            { n: 6,  level: 'intermediate', title: 'Arpegio Abierto', chords: ['C','G','Am','F'], bars: 12, arrangementPattern: 'variation', arrangementAccompaniment: 'openArpeggio', arrangementResource: '1 - 5 - 10', arrangementForm: 'A-A prime', explain: 'El arpegio abierto da amplitud al arreglo.' },
            { n: 7,  level: 'intermediate', title: 'Arpegio de Balada', chords: ['Am','F','C','G'], bars: 12, arrangementPattern: 'descending', arrangementAccompaniment: 'balladArpeggio', arrangementResource: 'Bajo - quinta - tercera - quinta', arrangementForm: 'A-B', explain: 'El patron debe sonar continuo y emocional.' },
            { n: 8,  level: 'intermediate', title: 'Primer Alberti con Melodia', chords: ['C','G','Am','F'], bars: 12, arrangementPattern: 'simplePhrase', arrangementAccompaniment: 'alberti', arrangementResource: 'Alberti: bajo - alto - medio - alto', arrangementForm: 'A-B', explain: 'El Alberti debe mantenerse estable mientras la melodia canta.' },
            { n: 9,  level: 'intermediate', title: 'Alberti en Progresion', chords: ['G','D','Em','C'], bars: 12, arrangementPattern: 'harmonicPhrase', arrangementAccompaniment: 'alberti', arrangementResource: 'Alberti', arrangementForm: 'A-B', explain: 'El patron no debe romperse en los cambios armonicos.' },
            { n: 10, level: 'intermediate', title: 'Mini Cancion con Patron', chords: ['G','D','Em','C','Am','D','G'], bars: 12, arrangementPattern: 'formAAB', arrangementAccompaniment: 'mixedPattern', arrangementResource: 'Arpegio abierto + Alberti', arrangementForm: 'A-A prime-B', explain: 'El estudiante empieza a escoger patron segun el caracter de la cancion.' },
            { n: 11, level: 'advanced', title: 'Patron Worship', chords: ['Cadd9','G','Am7','Fmaj7'], bars: 16, arrangementPattern: 'climax', arrangementAccompaniment: 'worship', arrangementResource: 'Worship 1 - 5 - 8 - 5', arrangementForm: 'A-B', explain: 'El patron debe sonar amplio y constante.' },
            { n: 12, level: 'advanced', title: 'Arpegio con Cambio de Registro', chords: ['D','A','Bm','G'], bars: 16, arrangementPattern: 'leapResolve', arrangementAccompaniment: 'extendedArpeggio', arrangementResource: 'Arpegio extendido', arrangementForm: 'A-B', explain: 'El registro debe apoyar la energia de la frase.' },
            { n: 13, level: 'advanced', title: 'Alberti Moderno', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 16, arrangementPattern: 'colorMelody', arrangementAccompaniment: 'alberti', arrangementResource: 'Alberti adaptado', arrangementForm: 'A-B', explain: 'El patron clasico puede sostener colores modernos si la melodia es clara.' },
            { n: 14, level: 'advanced', title: 'Arpegio Instrumental', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A'], bars: 16, arrangementPattern: 'modernMotif', arrangementAccompaniment: 'wideArpeggio', arrangementResource: 'Arpegio amplio', arrangementForm: 'A-B-A', explain: 'La textura debe sonar como arreglo, no como ejercicio de arpegios.' },
            { n: 15, level: 'advanced', title: 'Dominio de Melodia con Patrones', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A','Bm7','G'], bars: 16, arrangementPattern: 'patternsFinal', arrangementAccompaniment: 'mixedPattern', arrangementResource: 'Combinacion de patrones', arrangementForm: 'A-B-A prime', keyChange: true, explain: 'Este ejercicio resume la integracion entre melodia y acompanamiento en movimiento.' },
          ],
        },
        variationForm: {
          label: 'Variación y Forma', icon: '🔁',
          desc: 'Transformar una melodía en arreglo con intro, secciones, variación y cierre.',
          pattern: 'variacion_forma',
          exercises: [
            { n: 1,  level: 'basic', title: 'Forma A', chords: ['C','G','Am','F'], bars: 8, arrangementPattern: 'formA', arrangementAccompaniment: 'bass', arrangementResource: 'Forma A', arrangementForm: 'A', explain: 'La frase debe tener inicio y cierre claros.' },
            { n: 2,  level: 'basic', title: 'A con Repeticion', chords: ['C','G','Am','F'], bars: 8, arrangementPattern: 'repeatA', arrangementAccompaniment: 'bass', arrangementResource: 'Forma A - A', arrangementForm: 'A-A', explain: 'La segunda vuelta puede cambiar ritmo o registro.' },
            { n: 3,  level: 'basic', title: 'A y Respuesta', chords: ['C','F','G','C'], bars: 8, arrangementPattern: 'formAB', arrangementAccompaniment: 'bass', arrangementResource: 'Forma A - B', arrangementForm: 'A-B', explain: 'La seccion B debe contrastar sin sonar desconectada.' },
            { n: 4,  level: 'basic', title: 'Primer Regreso', chords: ['C','G','Am','F','C','F','G','C'], bars: 8, arrangementPattern: 'formABA', arrangementAccompaniment: 'bass', arrangementResource: 'Forma A - B - A', arrangementForm: 'A-B-A', explain: 'El regreso debe sentirse familiar.' },
            { n: 5,  level: 'basic', title: 'Mini Forma Basica', chords: ['C','F','Am','G','C'], bars: 8, arrangementPattern: 'formAAclose', arrangementAccompaniment: 'bass', arrangementResource: 'A - A prime - Cierre', arrangementForm: 'A-A prime-Cierre', explain: 'La variacion pequena evita que la repeticion sea mecanica.' },
            { n: 6,  level: 'intermediate', title: 'Intro Sencilla', chords: ['C','G','Am','F'], bars: 12, arrangementPattern: 'introA', arrangementAccompaniment: 'bass', arrangementResource: 'Intro - A', arrangementForm: 'Intro-A', explain: 'La intro debe preparar la melodia, no competir con ella.' },
            { n: 7,  level: 'intermediate', title: 'Cambio de Textura', chords: ['C','G','Am','F'], bars: 12, arrangementPattern: 'textureChange', arrangementAccompaniment: 'bassToArpeggio', arrangementResource: 'Bajo simple en A y arpegio en B', arrangementForm: 'A-B', explain: 'El cambio de textura crea contraste musical.' },
            { n: 8,  level: 'intermediate', title: 'Variacion Ritmica', chords: ['G','D','Em','C'], bars: 12, arrangementPattern: 'rhythmicVariation', arrangementAccompaniment: 'bass', arrangementResource: 'Variacion ritmica', arrangementForm: 'A-A prime', explain: 'El ritmo puede renovar una melodia sin cambiar su identidad.' },
            { n: 9,  level: 'intermediate', title: 'Variacion de Registro', chords: ['Am','F','C','G'], bars: 12, arrangementPattern: 'registerVariation', arrangementAccompaniment: 'bass', arrangementResource: 'A grave - A aguda', arrangementForm: 'A grave-A aguda', explain: 'El registro cambia la energia de la misma idea.' },
            { n: 10, level: 'intermediate', title: 'Mini Cancion con Forma', chords: ['G','D','Em','C','Am','D','G'], bars: 12, arrangementPattern: 'introABClose', arrangementAccompaniment: 'mixedTexture', arrangementResource: 'Intro - A - B - Cierre', arrangementForm: 'Intro-A-B-Cierre', explain: 'La pieza debe tener sentido de recorrido.' },
            { n: 11, level: 'advanced', title: 'Crecimiento por Capas', chords: ['D','A','Bm','G'], bars: 16, arrangementPattern: 'layerGrowth', arrangementAccompaniment: 'layered', arrangementResource: 'A simple - A con bajo - A con arpegio', arrangementForm: 'A-A prime-A double prime', explain: 'El arreglo crece sin abandonar la melodia.' },
            { n: 12, level: 'advanced', title: 'Contraste Emocional', chords: ['D','A','Bm','G','Em','A'], bars: 16, arrangementPattern: 'emotionalContrast', arrangementAccompaniment: 'mixedTexture', arrangementResource: 'A - B - A', arrangementForm: 'A-B-A', explain: 'El contraste debe enriquecer la historia musical.' },
            { n: 13, level: 'advanced', title: 'Reexposicion', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 16, arrangementPattern: 'reexposition', arrangementAccompaniment: 'bassToVoicing', arrangementResource: 'A - B - A prime', arrangementForm: 'A-B-A prime', explain: 'La reexposicion debe sonar familiar y mas desarrollada.' },
            { n: 14, level: 'advanced', title: 'Cierre Musical', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A'], bars: 16, arrangementPattern: 'musicalClose', arrangementAccompaniment: 'mixedTexture', arrangementResource: 'A - B - Cierre', arrangementForm: 'A-B-Cierre', explain: 'El final debe cerrar la energia acumulada.' },
            { n: 15, level: 'advanced', title: 'Dominio de Variacion y Forma', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], bars: 16, arrangementPattern: 'formFinal', arrangementAccompaniment: 'mixedTexture', arrangementResource: 'Intro - A - B - A prime - Cierre', arrangementForm: 'Intro-A-B-A prime-Cierre', keyChange: true, explain: 'Este ejercicio resume como convertir una melodia en una pieza con forma.' },
          ],
        },
        musicalApplication: {
          label: 'Aplicación Musical', icon: '🎶',
          desc: 'Mini canciones originales que integran melodía, armonía, acompañamiento, patrones y forma.',
          pattern: 'aplicacion_arreglo',
          exercises: [
            { n: 1,  level: 'basic', title: 'Cancion con Bajo Simple', song: 'Cancion con Bajo Simple', chords: ['C','G','Am','F'], bars: 8, arrangementPattern: 'songBassSimple', arrangementAccompaniment: 'bass', arrangementResource: 'Melodia + bajo simple', arrangementForm: 'A', explain: 'La pieza debe sonar completa usando recursos minimos.' },
            { n: 2,  level: 'basic', title: 'Cancion con Acordes Sencillos', song: 'Cancion con Acordes Sencillos', chords: ['C','F','G','C'], bars: 8, useInversions: true, arrangementPattern: 'songChordsSimple', arrangementAccompaniment: 'chordVoicing', arrangementResource: 'Melodia + acordes', arrangementForm: 'A', explain: 'La melodia debe liderar la armonia.' },
            { n: 3,  level: 'basic', title: 'Cancion con Arpegio Simple', song: 'Cancion con Arpegio Simple', chords: ['C','G','Am','F'], bars: 8, arrangementPattern: 'songArpeggioSimple', arrangementAccompaniment: 'arpeggio', arrangementResource: 'Melodia + arpegio', arrangementForm: 'A', explain: 'El arpegio crea movimiento sin ocultar la frase.' },
            { n: 4,  level: 'basic', title: 'Cancion Pregunta y Respuesta', song: 'Cancion Pregunta y Respuesta', chords: ['C','F','Am','G','C'], bars: 8, arrangementPattern: 'songQuestionAnswer', arrangementAccompaniment: 'bass', arrangementResource: 'Pregunta y respuesta', arrangementForm: 'A-B', explain: 'La forma debe sentirse conversacional.' },
            { n: 5,  level: 'basic', title: 'Mini Arreglo Basico', song: 'Mini Arreglo Basico', chords: ['C','G','Am','F','C'], bars: 8, useInversions: true, arrangementPattern: 'basicArrangement', arrangementAccompaniment: 'bassChords', arrangementResource: 'Arreglo basico', arrangementForm: 'A-Cierre', explain: 'El estudiante ya toca una pieza pequena con inicio y cierre.' },
            { n: 6,  level: 'intermediate', title: 'Balada con Arpegio', song: 'Balada con Arpegio', chords: ['Am','F','C','G'], bars: 12, arrangementPattern: 'balladArpeggioSong', arrangementAccompaniment: 'balladArpeggio', arrangementResource: 'Melodia + arpegio de balada', arrangementForm: 'A-B', explain: 'La melodia debe flotar encima del movimiento.' },
            { n: 7,  level: 'intermediate', title: 'Pop con Voicings', song: 'Pop con Voicings', chords: ['G','D','Em','C'], bars: 12, useInversions: true, arrangementPattern: 'popVoicingSong', arrangementAccompaniment: 'chordVoicing', arrangementResource: 'Melodia + voicings', arrangementForm: 'A-B', explain: 'El arreglo debe sonar moderno y limpio.' },
            { n: 8,  level: 'intermediate', title: 'Worship con Patron', song: 'Worship con Patron', chords: ['Cadd9','G','Am7','Fmaj7'], bars: 12, arrangementPattern: 'worshipPatternSong', arrangementAccompaniment: 'worship', arrangementResource: 'Melodia + patron worship', arrangementForm: 'A-B', explain: 'La izquierda sostiene energia y la derecha canta.' },
            { n: 9,  level: 'intermediate', title: 'Cancion con Alberti', song: 'Cancion con Alberti', chords: ['C','G','Am','F'], bars: 12, arrangementPattern: 'albertiSong', arrangementAccompaniment: 'alberti', arrangementResource: 'Melodia + Alberti', arrangementForm: 'A-B', explain: 'El Alberti debe funcionar como acompanamiento real, no como patron aislado.' },
            { n: 10, level: 'intermediate', title: 'Mini Arreglo Intermedio', song: 'Mini Arreglo Intermedio', chords: ['G','D','Em','C','Am','D','G'], bars: 12, useInversions: true, arrangementPattern: 'intermediateArrangement', arrangementAccompaniment: 'mixedTexture', arrangementResource: 'Cambio de textura', arrangementForm: 'Intro-A-B', explain: 'Cada seccion debe aportar una textura diferente.' },
            { n: 11, level: 'advanced', title: 'Piano Instrumental', song: 'Piano Instrumental', chords: ['D','A','Bm','G'], bars: 16, arrangementPattern: 'instrumentalSong', arrangementAccompaniment: 'wideArpeggio', arrangementResource: 'Arreglo instrumental', arrangementForm: 'A-B-A', explain: 'La pieza debe sentirse como una composicion breve.' },
            { n: 12, level: 'advanced', title: 'Balada Moderna', song: 'Balada Moderna', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 16, useInversions: true, arrangementPattern: 'modernBalladSong', arrangementAccompaniment: 'openVoicing', arrangementResource: 'Melodia + colores armonicos', arrangementForm: 'A-B-A', explain: 'Los colores deben servir a la emocion de la melodia.' },
            { n: 13, level: 'advanced', title: 'Worship Avanzado', song: 'Worship Avanzado', chords: ['Cadd9','Gsus4','Am7','Fmaj7','Dadd9','A'], bars: 20, useInversions: true, arrangementPattern: 'advancedWorshipSong', arrangementAccompaniment: 'layered', arrangementResource: 'Crecimiento por capas', arrangementForm: 'Intro-A-B-A prime', explain: 'La energia debe crecer sin abandonar la melodia.' },
            { n: 14, level: 'advanced', title: 'Arreglo con Cambio de Tonalidad', song: 'Arreglo con Cambio de Tonalidad', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','A','Bm7','G'], bars: 20, useInversions: true, arrangementPattern: 'keyChangeArrangement', arrangementAccompaniment: 'mixedTexture', arrangementResource: 'Arreglo con modulacion funcional', arrangementForm: 'A-B-A prime', keyChange: true, explain: 'El cambio tonal debe sonar como expansion musical.' },
            { n: 15, level: 'advanced', title: 'Proyecto Final de Melodia y Arreglo', song: 'Proyecto Final de Melodia y Arreglo', chords: ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], bars: 20, useInversions: true, arrangementPattern: 'arrangementFinal', arrangementAccompaniment: 'fullArrangement', arrangementResource: 'Arreglo completo', arrangementForm: 'Intro-A-B-A prime-Cierre', keyChange: true, explain: 'Este ejercicio resume la meta musical de la app: tocar una pieza real usando todas las herramientas aprendidas.' },
          ],
        },
      },
    },

    // ── MÓDULO FINAL — VOICINGS ─────────────────────────────────────
    voicings: {
      label: 'Voicings',
      icon:  '🎼',
      desc:  'Disposiciones modernas, voz superior, colores, apertura y movimiento mínimo.',
      techniques: {

        musicalInversions: {
          label: 'Inversiones Musicales', icon: '🔁',
          desc: 'Elegir inversiones por fluidez musical, no por memoria mecánica.',
          pattern: 'voicing_inversions',
          exercises: makeVoicingExercises([
            [1,  'basic',        'El Problema de Saltar', ['C','G','Am','F'], 8,  'jumpCompare',        'closed',       'Comparar saltos contra ruta cercana', '', 'Las inversiones reducen movimientos innecesarios.'],
            [2,  'basic',        'Primera Progresión Fluida', ['C','G'], 8,  'nearestInversion',   'closed',       'Elegir inversión cercana', '', 'No todos los acordes deben tocarse en posición fundamental.'],
            [3,  'basic',        'Tres Acordes, Una Posición', ['C','G','Am'], 8,  'sameZone',           'closed',       'Permanecer en una misma zona', '', 'Las inversiones permiten permanecer en la misma región del teclado.'],
            [4,  'basic',        'Cuatro Acordes, Movimiento Mínimo', ['C','G','Am','F'], 8,  'minimumRoute',      'closed',       'Ruta más corta', '', 'La mejor inversión suele ser la que requiere menos movimiento.'],
            [5,  'basic',        'Mini Canción Básica', ['C','F','Am','G','C'], 8,  'basicSong',         'closed',       'Inversiones en mini canción', '', 'Las inversiones suenan mejor cuando sirven a una frase real.'],
            [6,  'intermediate', 'Dos Caminos Posibles', ['C','G','Am','F'], 12, 'twoRoutes',          'compare',      'Comparar dos soluciones', '', 'Una misma progresión puede tener rutas más o menos fluidas.'],
            [7,  'intermediate', 'Mantener Notas Comunes', ['C','Em','Am','F'], 12, 'commonTones',       'closed',       'Notas comunes', '', 'Las notas compartidas conectan acordes con naturalidad.'],
            [8,  'intermediate', 'Inversiones y Bajo', ['C','G','Am','F'], 12, 'bassInversions',     'bassVoicing',  'Bajo + inversión cercana', '', 'El bajo da estabilidad mientras la derecha busca fluidez.'],
            [9,  'intermediate', 'Worship Fluido', ['Cadd9','G','Am7','Fmaj7'], 12, 'worshipInversions',  'modern',       'Inversiones con color worship', 'add9 / maj7 / m7', 'El worship moderno necesita cambios amplios pero suaves.'],
            [10, 'intermediate', 'Mini Canción Intermedia', ['G','D','Em','C','Am','D','G'], 12, 'intermediateSong',  'bassVoicing',  'Inversiones conectadas', '', 'La progresión debe sonar como acompañamiento, no como ejercicio aislado.'],
            [11, 'advanced',     'Inversiones Guiadas por la Melodía', ['D','A','Bm','G'], 16, 'melodyGuided',      'topVoice',     'Melodía decide la inversión', '', 'La melodía puede obligar a escoger una inversión específica.'],
            [12, 'advanced',     'Varias Soluciones', ['C','G','Am','F','D','A'], 16, 'multipleSolutions', 'compare',      'Dos rutas válidas', '', 'El oído decide si una solución realmente mejora la música.'],
            [13, 'advanced',     'Movimiento Invisible', ['Cmaj7','Am7','Fmaj7','G7'], 16, 'invisibleMotion',   'modern',       'Cambios casi invisibles', 'maj7 / m7', 'Los mejores enlaces a veces se sienten más que se ven.'],
            [14, 'advanced',     'Sonido Profesional', ['Cadd9','G','Am7','Fmaj7','Dadd9','A'], 16, 'professionalFlow', 'modern',       'Fluidez moderna', 'add9 / maj7 / m7', 'Un sonido profesional nace de decisiones pequeñas y constantes.'],
            [15, 'advanced',     'Dominio de Inversiones Musicales', ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], 16, 'inversionFinal', 'full', 'Dominio de inversiones musicales', 'add9 / sus / 7', 'El estudiante integra inversión, fluidez y contexto musical.'],
          ]),
        },

        topVoiceMelody: {
          label: 'Melodía en Voz Superior', icon: '🎵',
          desc: 'Construir el voicing alrededor de la nota que canta arriba.',
          pattern: 'voicing_top_voice',
          exercises: makeVoicingExercises([
            [1,  'basic',        'La Nota Superior Importa', ['C'], 8, 'topNote', 'topVoice', 'Nota superior como melodía', '', 'La nota superior es la voz que más percibe el oído.'],
            [2,  'basic',        'Misma Armonía, Distinta Melodía', ['C'], 8, 'sameHarmonyTop', 'topVoice', 'Variar la nota superior', '', 'La melodía cambia completamente la percepción del acorde.'],
            [3,  'basic',        'Melodía de Tres Notas', ['C','G','Am'], 8, 'threeNoteTop', 'topVoice', 'Frase breve en voz superior', '', 'La melodía guía las decisiones armónicas.'],
            [4,  'basic',        'Primera Melodía sobre Progresión', ['C','G'], 8, 'progressionTop', 'topVoice', 'Melodía sobre progresión', '', 'La melodía debe permanecer clara durante los cambios.'],
            [5,  'basic',        'Mini Canción Básica', ['C','F','Am','G','C'], 8, 'basicTopSong', 'topVoice', 'Mini canción con voz superior', '', 'La melodía se convierte en el centro de la música.'],
            [6,  'intermediate', 'Melodía y Primera Inversión', ['C','G','Am','F'], 12, 'firstInvTop', 'topVoice', 'Primera inversión bajo melodía', '', 'La inversión debe acomodarse a la melodía, no al revés.'],
            [7,  'intermediate', 'Melodía y Segunda Inversión', ['C','G','Am','F'], 12, 'secondInvTop', 'topVoice', 'Segunda inversión bajo melodía', '', 'La melodía arriba permite que el acorde cambie de color sin perder dirección.'],
            [8,  'intermediate', 'Melodía Pentatónica Mayor', ['G','D','Em','C'], 12, 'pentMajorTop', 'topVoice', 'Pentatónica mayor en voz superior', '', 'La pentatónica da melodías claras sobre voicings simples.'],
            [9,  'intermediate', 'Melodía Pentatónica Menor', ['Am','F','C','G'], 12, 'pentMinorTop', 'topVoice', 'Pentatónica menor en voz superior', '', 'El color menor debe cantar sin oscurecer el voicing.'],
            [10, 'intermediate', 'Mini Canción Intermedia', ['G','D','Em','C','Am','D','G'], 12, 'intermediateTopSong', 'topVoice', 'Canción con melodía superior', '', 'La voz superior debe sentirse como una frase recordable.'],
            [11, 'advanced',     'Una Melodía, Varias Soluciones', ['D','A','Bm','G'], 16, 'topMultipleSolutions', 'compare', 'Varias armonizaciones', '', 'Una melodía puede admitir varios voicings válidos.'],
            [12, 'advanced',     'Melodía sobre Add9', ['Cadd9','G','Am7','Fmaj7'], 16, 'topAdd9', 'modern', 'Add9 en voz superior', 'add9', 'La novena debe sonar como color intencional.'],
            [13, 'advanced',     'Melodía sobre Maj7 y m7', ['Cmaj7','Am7','Fmaj7','G7'], 16, 'topSevenths', 'modern', 'Maj7 y m7 en voz superior', 'maj7 / m7', 'Las séptimas suavizan la armonía cuando la melodía las sostiene.'],
            [14, 'advanced',     'Worship Moderno', ['Cadd9','Gsus4','Am7','Fmaj7','Dadd9','A'], 16, 'topWorship', 'modern', 'Voz superior worship', 'add9 / sus', 'La voz superior debe flotar sobre una base amplia.'],
            [15, 'advanced',     'Dominio de Melodía en la Voz Superior', ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], 16, 'topVoiceFinal', 'full', 'Dominio de voz superior', 'add9 / sus / 7', 'El estudiante armoniza sin perder la melodía principal.'],
          ]),
        },

        openChords: {
          label: 'Acordes Abiertos', icon: '↔',
          desc: 'Distribuir las mismas notas con más espacio y claridad.',
          pattern: 'voicing_open',
          exercises: makeVoicingExercises([
            [1,  'basic',        'Cerrado vs Abierto', ['C'], 8, 'closedOpenCompare', 'compare', 'Comparación cerrado / abierto', '', 'Las mismas notas pueden generar sensaciones muy distintas.'],
            [2,  'basic',        'Primer Acorde Abierto', ['C'], 8, 'firstOpen', 'open', 'Primer voicing abierto', '', 'Separar notas genera más espacio.'],
            [3,  'basic',        'Dos Acordes Abiertos', ['C','G'], 8, 'twoOpen', 'open', 'Dos acordes abiertos', '', 'Los acordes abiertos funcionan especialmente bien en progresiones.'],
            [4,  'basic',        'Cuatro Acordes Abiertos', ['C','G','Am','F'], 8, 'fourOpen', 'open', 'Progresión abierta', '', 'Los acordes abiertos producen un sonido más moderno.'],
            [5,  'basic',        'Mini Canción Básica', ['C','F','Am','G','C'], 8, 'openBasicSong', 'open', 'Mini canción con apertura', '', 'Los acordes abiertos mejoran inmediatamente el sonido del acompañamiento.'],
            [6,  'intermediate', 'Bajo + Acorde Abierto', ['C','G','Am','F'], 12, 'openBass', 'openBass', 'Bajo + acorde abierto', '', 'El bajo sostiene mientras la derecha distribuye el acorde.'],
            [7,  'intermediate', 'Inversiones Abiertas', ['C','G','Am','F'], 12, 'openInversions', 'open', 'Inversiones abiertas', '', 'La apertura debe mantener fluidez, no crear nuevos saltos.'],
            [8,  'intermediate', 'Melodía en Voicing Abierto', ['G','D','Em','C'], 12, 'openTopVoice', 'openTop', 'Melodía dentro del voicing abierto', '', 'La nota superior sigue siendo la voz principal.'],
            [9,  'intermediate', 'Sonido Worship Básico', ['Cadd9','G','Am7','Fmaj7'], 12, 'openWorship', 'modern', 'Apertura worship', 'add9 / maj7 / m7', 'El worship se beneficia de espacio y resonancia.'],
            [10, 'intermediate', 'Mini Canción Intermedia', ['G','D','Em','C','Am','D','G'], 12, 'openIntermediateSong', 'openBass', 'Canción con acordes abiertos', '', 'La progresión debe sonar amplia sin volverse pesada.'],
            [11, 'advanced',     'Aperturas Amplias', ['D','A','Bm','G'], 16, 'wideOpen', 'wide', 'Aperturas amplias', '', 'La amplitud debe sentirse clara, no dispersa.'],
            [12, 'advanced',     'Piano Instrumental', ['Cmaj7','Am7','Fmaj7','G7'], 16, 'instrumentalOpen', 'modern', 'Apertura instrumental', 'maj7 / m7', 'La textura abierta puede sostener una pieza instrumental.'],
            [13, 'advanced',     'Worship Moderno', ['Cadd9','Gsus4','Am7','Fmaj7'], 16, 'modernOpenWorship', 'modern', 'Voicings abiertos modernos', 'add9 / sus', 'El color moderno necesita espacio entre las voces.'],
            [14, 'advanced',     'Comparación Profesional', ['C','G','Am','F','D','A'], 16, 'professionalCompare', 'compare', 'Comparación profesional', '', 'La versión abierta debe justificar su uso musicalmente.'],
            [15, 'advanced',     'Dominio de Acordes Abiertos', ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], 16, 'openFinal', 'full', 'Dominio de acordes abiertos', 'add9 / sus / 7', 'El estudiante distribuye voces con claridad y control.'],
          ]),
        },

        harmonicColors: {
          label: 'Colores Armónicos', icon: '✨',
          desc: 'Usar add9, sus, maj7 y m7 como color musical, no como adorno vacío.',
          pattern: 'voicing_colors',
          exercises: makeVoicingExercises([
            [1,  'basic',        'Descubriendo el Add9', ['C','Cadd9'], 8, 'discoverAdd9', 'colorCompare', 'C mayor vs Cadd9', 'add9', 'El add9 aporta amplitud y modernidad.'],
            [2,  'basic',        'Primer Sus2', ['C','Csus2'], 8, 'discoverSus2', 'colorCompare', 'Sonido sus2', 'sus2', 'El sus2 crea una sensación abierta y ligera.'],
            [3,  'basic',        'Primer Sus4', ['C','Csus4','C'], 8, 'discoverSus4', 'colorResolve', 'Sus4 resolviendo', 'sus4', 'El sus4 genera expectativa antes de resolver.'],
            [4,  'basic',        'Comparando Colores', ['Cadd9','Csus2','Csus4','C'], 8, 'compareColors', 'colorCompare', 'Comparar add9, sus2 y sus4', 'add9 / sus', 'Cada color produce una emoción diferente.'],
            [5,  'basic',        'Mini Canción Básica', ['Cadd9','G','Am','F'], 8, 'colorBasicSong', 'modern', 'Add9 y suspendidos en canción', 'add9 / sus', 'Los colores funcionan mejor dentro de música real.'],
            [6,  'intermediate', 'Descubriendo Maj7', ['Cmaj7','Fmaj7'], 12, 'discoverMaj7', 'colorCompare', 'Maj7', 'maj7', 'La maj7 añade suavidad y profundidad.'],
            [7,  'intermediate', 'Descubriendo m7', ['Am7','Dm7'], 12, 'discoverMinor7', 'colorCompare', 'm7', 'm7', 'La m7 da un color cálido sin complicar la armonía.'],
            [8,  'intermediate', 'Add9 sobre Progresiones', ['Cadd9','G','Am7','Fmaj7'], 12, 'add9Progression', 'modern', 'Add9 en progresión', 'add9', 'La novena debe integrarse a la progresión.'],
            [9,  'intermediate', 'Worship Moderno', ['Cadd9','Gsus4','Am7','Fmaj7'], 12, 'colorWorship', 'modern', 'Colores worship', 'add9 / sus / maj7', 'El color debe sostener la atmósfera sin exagerarse.'],
            [10, 'intermediate', 'Mini Canción Intermedia', ['G','Dadd9','Em7','Cadd9','Am7','D','G'], 12, 'colorIntermediateSong', 'modern', 'Canción con colores', 'add9 / m7', 'La armonía enriquecida debe seguir siendo clara.'],
            [11, 'advanced',     'Elegir el Color Correcto', ['Dadd9','A','Bm7','Gmaj7'], 16, 'chooseColor', 'colorCompare', 'Elegir color por contexto', 'add9 / maj7 / m7', 'No todos los colores sirven en todos los momentos.'],
            [12, 'advanced',     'Balada Moderna', ['Cmaj7','Am7','Fmaj7','G7'], 16, 'modernBalladColor', 'modern', 'Colores de balada', 'maj7 / m7 / 7', 'La balada necesita colores suaves y dirección clara.'],
            [13, 'advanced',     'Piano Instrumental', ['Cadd9','Gsus4','Am7','Fmaj7'], 16, 'instrumentalColor', 'wide', 'Color instrumental', 'add9 / sus / maj7', 'Los colores pueden crear profundidad instrumental.'],
            [14, 'advanced',     'Combinación de Colores', ['Cadd9','Gsus4','Am7','Fmaj7','Dadd9','A7'], 16, 'combinedColors', 'modern', 'Combinación de colores', 'add9 / sus / 7', 'Combinar colores exige control y buen gusto.'],
            [15, 'advanced',     'Dominio de Colores Armónicos', ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], 16, 'colorFinal', 'full', 'Dominio de colores armónicos', 'add9 / sus / 7 / maj7', 'El estudiante usa colores para mejorar la música, no para complicarla.'],
          ]),
        },

        minimumMovement: {
          label: 'Movimiento Mínimo', icon: '⇄',
          desc: 'Conectar acordes moviendo solo lo necesario.',
          pattern: 'voicing_minimum_movement',
          exercises: makeVoicingExercises([
            [1,  'basic',        'Una Nota se Mueve', ['C','Em'], 8, 'oneNoteMoves', 'closed', 'Una nota se mueve', '', 'A veces un acorde cambia completamente moviendo una sola nota.'],
            [2,  'basic',        'Notas que Permanecen', ['C','Am'], 8, 'commonHold', 'closed', 'Notas comunes que permanecen', '', 'Las notas comunes crean continuidad.'],
            [3,  'basic',        'Movimiento por Paso', ['C','G','Am'], 8, 'stepwiseMotion', 'closed', 'Movimiento por grado conjunto', '', 'Los movimientos pequeños suelen sonar más naturales.'],
            [4,  'basic',        'Comparando Dos Soluciones', ['C','G','Am','F'], 8, 'minimumCompare', 'compare', 'Solución con saltos vs fluida', '', 'No todas las inversiones producen la misma fluidez.'],
            [5,  'basic',        'Mini Canción Básica', ['C','F','Am','G','C'], 8, 'minimumBasicSong', 'closed', 'Mini canción con movimiento mínimo', '', 'La fluidez se entiende mejor dentro de una pieza.'],
            [6,  'intermediate', 'Movimiento Mínimo en C–G–Am–F', ['C','G','Am','F'], 12, 'minimumPop', 'closed', 'Ruta C-G-Am-F cercana', '', 'Una progresión popular puede sonar mucho más profesional.'],
            [7,  'intermediate', 'Melodía y Movimiento Mínimo', ['C','G','Am','F'], 12, 'minimumTopVoice', 'topVoice', 'Melodía + movimiento mínimo', '', 'La melodía debe cantar mientras las voces internas se mueven poco.'],
            [8,  'intermediate', 'Add9 con Movimiento Mínimo', ['Cadd9','G','Am7','Fmaj7'], 12, 'minimumAdd9', 'modern', 'Add9 con enlaces cercanos', 'add9 / maj7 / m7', 'Los colores modernos también deben conectarse con suavidad.'],
            [9,  'intermediate', 'Worship Fluido', ['Cadd9','Gsus4','Am7','Fmaj7'], 12, 'minimumWorship', 'modern', 'Worship con movimiento mínimo', 'add9 / sus', 'La atmósfera depende de que nada salte innecesariamente.'],
            [10, 'intermediate', 'Mini Canción Intermedia', ['G','D','Em','C','Am','D','G'], 12, 'minimumIntermediateSong', 'bassVoicing', 'Canción fluida', '', 'El acompañamiento debe sentirse conectado de principio a fin.'],
            [11, 'advanced',     'Movimiento Invisible', ['D','A','Bm','G'], 16, 'invisibleMinimum', 'closed', 'Movimiento casi imperceptible', '', 'La mano se mueve poco aunque la armonía cambie mucho.'],
            [12, 'advanced',     'Balada Moderna', ['Cmaj7','Am7','Fmaj7','G7'], 16, 'minimumBallad', 'modern', 'Balada con enlaces suaves', 'maj7 / m7 / 7', 'La balada moderna vive de conexiones delicadas.'],
            [13, 'advanced',     'Piano Instrumental', ['Cadd9','G','Am7','Fmaj7'], 16, 'minimumInstrumental', 'wide', 'Instrumental con movimiento mínimo', 'add9 / maj7', 'La textura puede ser amplia sin perder continuidad.'],
            [14, 'advanced',     'El Camino Más Corto', ['Cadd9','G','Am7','Fmaj7','Dadd9','A'], 16, 'shortestPath', 'compare', 'Elegir el camino más corto', 'add9 / m7', 'El mejor camino suele ser el que el oído siente más natural.'],
            [15, 'advanced',     'Dominio de Movimiento Mínimo', ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], 16, 'minimumFinal', 'full', 'Dominio de movimiento mínimo', 'add9 / sus / 7', 'El estudiante conecta voicings con control profesional.'],
          ]),
        },

        modernTextures: {
          label: 'Texturas Modernas', icon: '🌫',
          desc: 'Combinar apertura, colores y movimiento mínimo en estilos reales.',
          pattern: 'voicing_modern_textures',
          exercises: makeVoicingExercises([
            [1,  'basic',        'Primer Sonido Moderno', ['C','G','Am','F'], 8, 'firstModern', 'modern', 'Primer sonido moderno', 'add9', 'El sonido moderno suele surgir de pequeños cambios acumulados.'],
            [2,  'basic',        'Worship Básico', ['Cadd9','G','Am7','Fmaj7'], 8, 'basicWorshipTexture', 'modern', 'Textura worship sencilla', 'add9 / maj7', 'El worship moderno utiliza voicings amplios y fluidos.'],
            [3,  'basic',        'Pop Básico', ['C','G','Am','F'], 8, 'basicPopTexture', 'topVoice', 'Textura pop limpia', '', 'El pop moderno suele favorecer claridad y simplicidad.'],
            [4,  'basic',        'Balada Básica', ['Cmaj7','Am7','Fmaj7','G7'], 8, 'basicBalladTexture', 'modern', 'Textura de balada', 'maj7 / m7', 'Las baladas suelen beneficiarse de colores suaves.'],
            [5,  'basic',        'Mini Canción Básica', ['Cadd9','G','Am7','Fmaj7','Cadd9'], 8, 'modernBasicSong', 'modern', 'Mini canción moderna', 'add9 / maj7', 'Las texturas modernas comienzan a sentirse naturales.'],
            [6,  'intermediate', 'Worship Atmosférico', ['Cadd9','Gsus4','Am7','Fmaj7'], 12, 'atmosphericWorship', 'wide', 'Worship atmosférico', 'add9 / sus', 'La atmósfera requiere espacio y control del registro.'],
            [7,  'intermediate', 'Pop Contemporáneo', ['G','Dadd9','Em7','Cadd9'], 12, 'contemporaryPop', 'topVoice', 'Pop contemporáneo', 'add9 / m7', 'La textura debe ser moderna sin perder pulso.'],
            [8,  'intermediate', 'Balada Moderna', ['Am7','Fmaj7','Cadd9','G'], 12, 'modernBalladTexture', 'modern', 'Balada moderna', 'maj7 / m7 / add9', 'El color emocional debe sostener la melodía.'],
            [9,  'intermediate', 'Piano Instrumental', ['G','D','Em','C','Am','D','G'], 12, 'instrumentalTexture', 'wide', 'Piano instrumental', '', 'La textura debe llenar sin saturar.'],
            [10, 'intermediate', 'Música Hebrea Contemporánea', ['Am','Gsus4','Fmaj7','E7'], 12, 'hebrewContemporary', 'modern', 'Color hebreo contemporáneo', 'sus / maj7 / 7', 'El color modal debe sentirse expresivo y claro.'],
            [11, 'advanced',     'Textura Worship Completa', ['Cadd9','Gsus4','Am7','Fmaj7','Dadd9','A'], 16, 'completeWorshipTexture', 'full', 'Worship completo', 'add9 / sus / maj7', 'La textura debe crecer sin perder claridad.'],
            [12, 'advanced',     'Piano Instrumental Cinemático', ['Dadd9','A','Bm7','Gmaj7'], 16, 'cinematicInstrumental', 'wide', 'Instrumental cinemático', 'add9 / maj7 / m7', 'El registro amplio debe sonar intencional y emocional.'],
            [13, 'advanced',     'Balada Avanzada', ['Cmaj7','Am7','Fmaj7','G7','Dadd9','A7'], 16, 'advancedBalladTexture', 'modern', 'Balada avanzada', 'maj7 / m7 / 7', 'La armonía rica debe respirar como canción.'],
            [14, 'advanced',     'Mezcla de Estilos', ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], 16, 'styleBlendTexture', 'full', 'Mezcla de estilos', 'add9 / sus / 7', 'El estudiante combina recursos sin perder identidad musical.'],
            [15, 'advanced',     'Dominio de Texturas Modernas', ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], 16, 'textureFinal', 'full', 'Dominio de texturas modernas', 'add9 / sus / 7 / maj7', 'El sonido moderno nace de combinar recursos simples con intención.'],
          ]),
        },

        musicalApplication: {
          label: 'Aplicación Musical', icon: '🎶',
          desc: 'Aplicar voicings en mini piezas por estilo y proyecto final.',
          pattern: 'voicing_application',
          exercises: makeVoicingExercises([
            [1,  'basic',        'Worship Básico', ['Cadd9','G','Am7','Fmaj7'], 8, 'appWorshipBasic', 'modern', 'Aplicación worship básica', 'add9 / maj7', 'El voicing debe sostener una canción worship sencilla.'],
            [2,  'basic',        'Pop Básico', ['C','G','Am','F'], 8, 'appPopBasic', 'topVoice', 'Aplicación pop básica', '', 'La claridad del voicing sostiene el carácter pop.'],
            [3,  'basic',        'Balada Básica', ['Cmaj7','Am7','Fmaj7','G7'], 8, 'appBalladBasic', 'modern', 'Aplicación de balada básica', 'maj7 / m7', 'La balada necesita suavidad y dirección.'],
            [4,  'basic',        'Piano Instrumental Básico', ['C','F','Am','G','C'], 8, 'appInstrumentalBasic', 'openBass', 'Aplicación instrumental básica', '', 'El piano debe sonar completo con recursos simples.'],
            [5,  'basic',        'Hebreo Básico', ['Am','G','F','E7'], 8, 'appHebrewBasic', 'modern', 'Aplicación hebrea básica', '7', 'El color hebreo debe sentirse expresivo sin exagerarse.'],
            [6,  'intermediate', 'Worship Moderno', ['Cadd9','Gsus4','Am7','Fmaj7'], 12, 'appWorshipModern', 'wide', 'Worship moderno', 'add9 / sus / maj7', 'La textura worship debe ser amplia y fluida.'],
            [7,  'intermediate', 'Pop Contemporáneo', ['G','Dadd9','Em7','Cadd9'], 12, 'appPopContemporary', 'topVoice', 'Pop contemporáneo', 'add9 / m7', 'La voz superior debe guiar el arreglo.'],
            [8,  'intermediate', 'Balada Moderna', ['Am7','Fmaj7','Cadd9','G'], 12, 'appBalladModern', 'modern', 'Balada moderna', 'maj7 / m7 / add9', 'El color armónico debe apoyar la emoción.'],
            [9,  'intermediate', 'Piano Instrumental Moderno', ['G','D','Em','C','Am','D','G'], 12, 'appInstrumentalModern', 'wide', 'Instrumental moderno', '', 'El voicing abierto crea sensación de pieza completa.'],
            [10, 'intermediate', 'Hebreo Contemporáneo', ['Am','Gsus4','Fmaj7','E7'], 12, 'appHebrewContemporary', 'modern', 'Hebreo contemporáneo', 'sus / maj7 / 7', 'El color modal debe integrarse a una textura moderna.'],
            [11, 'advanced',     'Worship Cinemático', ['Cadd9','Gsus4','Am7','Fmaj7','Dadd9','A'], 16, 'appWorshipCinematic', 'full', 'Worship cinemático', 'add9 / sus / maj7', 'La textura debe crecer como arreglo, no como acumulación de notas.'],
            [12, 'advanced',     'Balada Cinemática', ['Cmaj7','Am7','Fmaj7','G7','Dadd9','A7'], 16, 'appBalladCinematic', 'wide', 'Balada cinemática', 'maj7 / m7 / 7', 'El registro amplio debe conservar una melodía clara.'],
            [13, 'advanced',     'Piano Instrumental Completo', ['Dadd9','A','Bm7','Gmaj7'], 16, 'appInstrumentalComplete', 'full', 'Piano instrumental completo', 'add9 / maj7 / m7', 'El estudiante sostiene una pieza instrumental con voicings.'],
            [14, 'advanced',     'Fusión de Estilos', ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], 16, 'appStyleFusion', 'full', 'Fusión de estilos', 'add9 / sus / 7', 'Los recursos deben mezclarse con intención musical.'],
            [15, 'advanced',     'Proyecto Final de Voicings', ['Cadd9','G','Am7','Fmaj7','Dadd9','Bm7','Gsus4','A7'], 20, 'voicingFinalProject', 'full', 'Proyecto final de voicings', 'add9 / sus / 7 / maj7 / m7', 'Este ejercicio integra inversiones, voz superior, apertura, color, movimiento mínimo y textura moderna.'],
          ]),
        },
      },
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
            meta:       {
              inv: ex.inv || 0,
              useInversions: !!ex.useInversions,
              fastChanges: !!ex.fastChanges,
              keyChange: !!ex.keyChange,
              holdChanges: !!ex.holdChanges,
              useFifth: !!ex.useFifth,
              groove: ex.groove || '',
              meter: ex.meter || '',
              pedal: ex.pedal || '',
              useCase: ex.useCase || '',
              bothHands: !!ex.bothHands,
              arpeggioPattern: ex.arpeggioPattern || (modeKey === 'arpeggios' ? 'basic7' : ''),
              patternFeel: ex.patternFeel || '',
              useWhen: ex.useWhen || '',
              scaleRoot: ex.scaleRoot || '',
              scaleKind: ex.scaleKind || '',
              compareRoot: ex.compareRoot || '',
              rhythmic: !!ex.rhythmic,
              hands: ex.hands || '',
              sharps: Number.isFinite(ex.sharps) ? ex.sharps : null,
              scalePhrase: ex.scalePhrase || '',
              scalePattern: ex.scalePattern || '',
              melodicResource: ex.melodicResource || ex.appliedResource || '',
              appliedResource: ex.appliedResource || '',
              melodicLH: !!ex.melodicLH,
              coordinationPattern: ex.coordinationPattern || '',
              stableBass: !!ex.stableBass,
              useOctaves: !!ex.useOctaves,
              useTenths: !!ex.useTenths,
              coordinationResource: ex.coordinationResource || '',
              arrangementPattern: ex.arrangementPattern || '',
              arrangementAccompaniment: ex.arrangementAccompaniment || '',
              arrangementResource: ex.arrangementResource || '',
              arrangementForm: ex.arrangementForm || '',
              voicingPattern: ex.voicingPattern || '',
              voicingTexture: ex.voicingTexture || '',
              voicingResource: ex.voicingResource || '',
              voicingColor: ex.voicingColor || '',
            },
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
