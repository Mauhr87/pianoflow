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
      desc:  'Independencia funcional: una mano sostiene la base y la otra completa la música.',
      techniques: {
        bassChords: {
          label: 'Bajo + Acordes', icon: '🤝',
          desc: 'Coordinar mano izquierda como base armónica y mano derecha como armonía completa.',
          pattern: 'bajo_acordes',
          exercises: [
            { n: 1,  level: 'basic', title: 'Primer Bajo + Acorde', chords: ['C','G'], bars: 8, coordinationPattern: 'rootChord', explain: 'Cada mano tiene una función distinta.' },
            { n: 2,  level: 'basic', title: 'Dos Acordes', chords: ['C','G'], bars: 8, coordinationPattern: 'rootChord', explain: 'Ahora ambas manos deben cambiar juntas.' },
            { n: 3,  level: 'basic', title: 'Bajo Estable', chords: ['C','F','G','C'], bars: 8, coordinationPattern: 'rootChord', stableBass: true, explain: 'La mano izquierda no siempre necesita moverse.' },
            { n: 4,  level: 'basic', title: 'Primera Progresión', chords: ['C','G','Am','F'], bars: 8, coordinationPattern: 'rootChord', explain: 'Esta progresión aparece constantemente en canciones.' },
            { n: 5,  level: 'basic', title: 'Mini Canción Básica', chords: ['C','F','Am','G','C'], bars: 8, coordinationPattern: 'rootChord', explain: 'El bajo y los acordes ya forman un acompañamiento completo.' },
            { n: 6,  level: 'intermediate', title: 'Introducción de Inversiones', chords: ['C','F','G','Am'], bars: 12, useInversions: true, coordinationPattern: 'rootChord', explain: 'Las inversiones ayudan a mantener fluidez.' },
            { n: 7,  level: 'intermediate', title: 'Progresión Fluida', chords: ['C','G','Am','F'], bars: 12, useInversions: true, coordinationPattern: 'rootChord', explain: 'Las manos empiezan a trabajar de forma más eficiente.' },
            { n: 8,  level: 'intermediate', title: 'Fundamental + Quinta', chords: ['C','G','Am','F'], bars: 12, useInversions: true, useFifth: true, coordinationPattern: 'rootFifthChord', explain: 'La quinta aporta amplitud al acompañamiento.' },
            { n: 9,  level: 'intermediate', title: 'Bajo Independiente Simple', chords: ['C','G','Am','F'], bars: 12, useInversions: true, useFifth: true, coordinationPattern: 'independentBass', explain: 'La mano izquierda comienza a desarrollar autonomía.' },
            { n: 10, level: 'intermediate', title: 'Mini Canción Intermedia', chords: ['G','D','Em','C','Am','D','G'], bars: 12, useInversions: true, useFifth: true, coordinationPattern: 'rootFifthChord', explain: 'Las inversiones y el bajo ampliado generan un sonido más profesional.' },
            { n: 11, level: 'advanced', title: 'Octavas', chords: ['D','A','Bm','G'], bars: 16, useInversions: true, useOctaves: true, coordinationPattern: 'octavesChord', explain: 'Las octavas fortalecen la base armónica.' },
            { n: 12, level: 'advanced', title: 'Décimas', chords: ['D','A','Bm','G'], bars: 16, useInversions: true, useTenths: true, coordinationPattern: 'tenthsChord', explain: 'Las décimas suelen sonar abiertas y elegantes.' },
            { n: 13, level: 'advanced', title: 'Séptimas en Acompañamiento', chords: ['Cmaj7','Am7','Fmaj7','G7'], bars: 16, useInversions: true, useFifth: true, coordinationPattern: 'rootFifthChord', explain: 'Las séptimas enriquecen enormemente el acompañamiento.' },
            { n: 14, level: 'advanced', title: 'Bajo + Acordes Modernos', chords: ['Cmaj7','Am7','Fmaj7','G7','Dadd9','A'], bars: 16, useInversions: true, useTenths: true, coordinationPattern: 'modernCoordination', explain: 'Las manos trabajan juntas para crear un acompañamiento moderno.' },
            { n: 15, level: 'advanced', title: 'Dominio de Bajo + Acordes', chords: ['Cmaj7','G','Am7','Fmaj7','Dadd9','A','Bm7','G'], bars: 16, useInversions: true, useFifth: true, useOctaves: true, useTenths: true, coordinationPattern: 'coordinationFinal', keyChange: true, explain: 'Este ejercicio resume todas las habilidades desarrolladas en Bajo + Acordes.' },
          ],
        },
      },
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
