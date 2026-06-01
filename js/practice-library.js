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
