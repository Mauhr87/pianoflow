/**
 * PianoFlow — Session Generator
 *
 * Convierte un config { family, pattern, style, difficulty, bpm } en una
 * sesión completa de 5 secciones, lista para que la consuman piano-engine
 * y notation-engine.
 *
 * Salida (songData):
 *   {
 *     title, timeSig: '4/4', origBpm,
 *     sections: [{ key, label, startBar, endBar, simplified }, ...],
 *     measures: [{
 *       index, sectionKey, sectionLabel, chord, treble: [...], bass: [...]
 *     }, ...],
 *     meta: { ... }   // resumen legible
 *   }
 *
 * Donde cada nota es { midi, beat, duration } igual que en pviewerns.
 */

const SessionGenerator = {

  generate(config) {
    const mode   = PracticeLibrary.getMode(config.mode);
    const tech   = PracticeLibrary.getTechnique(config.mode, config.technique);
    const style  = PracticeLibrary.getStyle(config.style);
    const diff   = PracticeLibrary.getDifficulty(config.difficulty);

    if (!mode || !tech || !style || !diff) {
      throw new Error('Config inválida: faltan mode/technique/style/difficulty');
    }

    // El modo melódico no usa el sistema de patrones sobre acordes: genera
    // escalas/figuras a partir de la tónica del nivel (camino propio).
    if (config.mode === 'melodic') {
      return this._generateMelodic(config, mode, tech, style, diff);
    }

    // ── Currículum fiel: COORDINACIÓN → BAJO + ACORDES ──────────────
    // LH sostiene base armónica; RH toca acordes completos. La dificultad
    // crece por coordinación funcional, no por armonía excesiva.
    if (config.mode === 'coordination') {
      return this._generateBassChordsCoordination(config, mode, tech, style, diff);
    }

    // ── Currículum fiel: MELODÍA Y ARREGLO ──────────────────────────
    // RH siempre presenta una melodía principal; LH y/o voces internas
    // aplican bajo, acordes, arpegios, Alberti, patrones, voicings y forma.
    if (config.mode === 'melodyArrangement') {
      return this._generateMelodyArrangement(config, mode, tech, style, diff);
    }

    // ── Currículum fiel: VOICINGS ───────────────────────────────────
    // RH trabaja distribución de voces, nota superior, colores, apertura
    // y movimiento mínimo; LH sostiene raíz, bajo amplio o patrón suave.
    if (config.mode === 'voicings') {
      return this._generateVoicings(config, mode, tech, style, diff);
    }

    // Lectura a primera vista: piezas leíbles (melodía + bajo) que crecen en
    // densidad sección a sección. También camino propio.
    if (config.mode === 'sightreading') {
      return this._generateSightreading(config, mode, tech, style, diff);
    }

    // ── Currículum fiel: ACORDES → TRIADAS ──────────────────────────
    // Cada ejercicio usa SUS propios acordes y subdivide la pieza en 5
    // etapas pedagógicas (no rangos arbitrarios de compás).
    if (config.mode === 'chords' && config.technique === 'triads') {
      return this._generateTriads(config, mode, tech, style, diff);
    }

    // ── Currículum fiel: ACORDES → INVERSIONES ──────────────────────
    if (config.mode === 'chords' && config.technique === 'inversions') {
      return this._generateInversions(config, mode, tech, style, diff);
    }

    // ── Currículum fiel: ACORDES → SÉPTIMAS / EXTENSIONES / APLICACIÓN ─
    // Todas usan acordes en bloque construidos por nombre (séptimas
    // Maj7/m7/7, extensiones add9/sus2/sus4 y mini-canciones que integran
    // triadas + inversiones + séptimas + extensiones según el ejercicio).
    if (config.mode === 'chords' &&
        (config.technique === 'sevenths' ||
         config.technique === 'extensions' ||
         config.technique === 'application')) {
      return this._generateBlockChords(config, mode, tech, style, diff);
    }

    // ── Currículum fiel: ACOMPAÑAMIENTO ────────────────────────────
    // Rutas propias por técnica para controlar mano izquierda, patrón,
    // compás ternario, pedal y aplicación musical.
    if (config.mode === 'accompaniment') {
      return this._generateAccompaniment(config, mode, tech, style, diff);
    }

    // ── Currículum fiel: ARPEGIOS → ARPEGIOS BÁSICOS ────────────────
    // RH despliega el acorde con la forma 1-3-5-8-5-3-1. En avanzado se
    // añade LH como fundamental sostenida para practicar ambas manos.
    if (config.mode === 'arpeggios') {
      return this._generateBasicArpeggios(config, mode, tech, style, diff);
    }

    const patternKey = config.pattern || (tech && tech.pattern) || 'bloque';
    const pattern    = PatternLibrary.get(patternKey);
    if (!pattern) {
      throw new Error('Config inválida: patrón no encontrado (' + patternKey + ')');
    }

    // La tonalidad sale del nivel (Opción C). La progresión se arma con los
    // acordes diatónicos de esa tonalidad según el estilo.
    const progression = this._progressionFor(config.style, config.difficulty);

    const baseBpm  = Math.round(style.bpm * diff.bpmFactor);
    const finalBpm = clamp(parseInt(config.bpm, 10) || baseBpm, 40, 200);

    const sections = PracticeLibrary.sections;
    const measures = [];
    const sectionMeta = [];
    let measureIndex = 0;

    sections.forEach(section => {
      const startBar = measureIndex;
      const chordPlan = this._chordsForSection(section.key, progression, section.bars);

      chordPlan.forEach(chordLabel => {
        const chord = ChordLibrary.get(chordLabel);
        if (!chord) return;

        const patternToUse = section.simplified
          ? PatternLibrary.bloque
          : pattern;

        const { treble, bass } = this._buildMeasure(chord, patternToUse);

        measures.push({
          index: measureIndex,
          sectionKey:   section.key,
          sectionLabel: section.label,
          chord: chordLabel,
          treble,
          bass,
        });
        measureIndex++;
      });

      sectionMeta.push({
        key:        section.key,
        label:      section.label,
        startBar:   startBar,
        endBar:     measureIndex - 1,
        note:       section.note,
        simplified: !!section.simplified,
      });
    });

    const keyLabel = `${diff.tonic} ${diff.mode === 'major' ? 'mayor' : 'menor'} / ${diff.rel}`;

    return {
      title:    `${mode.label} · ${tech.label}`,
      subtitle: `${style.label} · ${keyLabel} · ${finalBpm} BPM`,
      timeSig:  '4/4',
      origBpm:  finalBpm,
      fifths:   diff.sharps || 0,
      measures,
      sections: sectionMeta,
      meta: {
        mode:        mode.label,
        modeKey:     config.mode,
        technique:   tech.label,
        techniqueKey:config.technique,
        style:       style.label,
        styleKey:    config.style,
        pattern:     pattern.label,
        patternKey:  patternKey,
        difficulty:  diff.label,
        diffKey:     config.difficulty,
        tonic:       diff.tonic,
        rel:         diff.rel,
        sharps:      diff.sharps || 0,
        bpm:         finalBpm,
        pending:     !!tech.pending,
      },
    };
  },

  // ════════════════════════════════════════════════════════════════
  //  ACORDES — TRIADAS (currículum fiel)
  // ════════════════════════════════════════════════════════════════
  //
  // Toma los acordes del ejercicio (config.chords) y los reparte en las
  // 5 etapas de aprendizaje según nuevo-enfoque.md:
  //   Preparación  ~20%  presentar la habilidad (1-2 acordes, bloque calmo)
  //   Construcción ~30%  progresión sencilla (subconjunto), pulso 1 y 3
  //   Desafío      ~30%  progresión completa / cambios más frecuentes
  //   Aplicación   ~15%  frase musical con la progresión, cierre lírico
  //   Cierre       ~5%   resolución a la tónica (redonda)
  //
  // Reglas de la técnica: acordes en bloque, posición fundamental,
  // sin inversiones, sin séptimas ni extensiones.

  _generateTriads(config, mode, tech, style, diff) {
    const prog = (config.chords && config.chords.length) ? config.chords.slice() : ['C'];
    const total = Math.max(5, parseInt(config.bars, 10) || 8);
    const fast  = !!(config.meta && config.meta.fastChanges);

    const finalBpm = clamp(parseInt(config.bpm, 10) || Math.round(style.bpm * diff.bpmFactor), 40, 200);

    const plan = this._chordStagePlan(total, prog, fast);

    const measures = [];
    const sectionMeta = [];
    let mi = 0;

    plan.forEach(stage => {
      const startBar = mi;
      for (let b = 0; b < stage.bars; b++) {
        const segments = stage.build(b, stage.bars);
        const { treble, bass } = this._blockMeasure(segments);
        measures.push({
          index: mi,
          sectionKey:   stage.key,
          sectionLabel: stage.label,
          chord: segments.map(s => s.label).join(' '),
          chordSegs: this._collapseSegs(segments),
          treble,
          bass,
        });
        mi++;
      }
      const note = (PracticeLibrary.sections.find(s => s.key === stage.key) || {}).note || '';
      sectionMeta.push({ key: stage.key, label: stage.label, startBar, endBar: mi - 1, note, simplified: (stage.key === 'prep' || stage.key === 'close') });
    });

    const exTitle = config.title ? `${config.n}. ${config.title}` : tech.label;

    return {
      title:    `${mode.label} · ${exTitle}`,
      subtitle: `${diff.label} · ${total} compases · ${finalBpm} BPM`,
      timeSig:  '4/4',
      origBpm:  finalBpm,
      fifths:   0,                         // acordes explícitos → sin armadura global
      measures,
      sections: sectionMeta,
      meta: {
        mode: mode.label, modeKey: config.mode,
        technique: tech.label, techniqueKey: config.technique,
        exercise: config.title || '', exerciseN: config.n || null,
        style: style.label, styleKey: config.style,
        pattern: 'Bloque', patternKey: 'bloque',
        difficulty: diff.label, diffKey: config.difficulty,
        tonic: diff.tonic, rel: diff.rel, sharps: 0,
        bpm: finalBpm, pending: false,
        explain: config.explain || '',
      },
    };
  },

  // Distribución pedagógica de secciones:
  //   8c  → 1 / 2 / 2 / 2 / 1
  //   12c → 2 / 3 / 3 / 3 / 1
  //   16c → 2 / 4 / 4 / 5 / 1
  //   20c → 3 / 5 / 5 / 6 / 1
  //
  // Desafío es la sección más exigente; Aplicación no compite en dificultad,
  // sino que necesita suficiente espacio para sonar como una frase de canción.
  _sectionBarsFor(total) {
    const t = Math.max(5, parseInt(total, 10) || 8);
    if (t <= 8)  return this._fitSectionBars(t, [1, 2, 2, 2, 1]);
    if (t <= 12) return this._fitSectionBars(t, [2, 3, 3, 3, 1]);
    if (t <= 16) return this._fitSectionBars(t, [2, 4, 4, 5, 1]);
    if (t <= 20) return this._fitSectionBars(t, [3, 5, 5, 6, 1]);

    const close = 1;
    const prep = Math.max(3, Math.round(t * 0.13));
    const build = Math.max(4, Math.round(t * 0.25));
    const chal = Math.max(4, Math.round(t * 0.25));
    const app = Math.max(chal, t - close - prep - build - chal);
    return this._fitSectionBars(t, [prep, build, chal, app, close]);
  },

  _fitSectionBars(total, target) {
    const bars = target.slice();
    const sum = () => bars.reduce((a, b) => a + b, 0);
    const reduceOrder = [3, 1, 2, 0]; // Aplicación, Construcción, Desafío, Preparación
    let guard = 80;
    while (sum() > total && guard--) {
      const idx = reduceOrder.find(i => bars[i] > 1);
      if (idx == null) break;
      bars[idx]--;
    }
    guard = 80;
    while (sum() < total && guard--) {
      bars[3]++; // el espacio extra ayuda a que Aplicación respire
    }
    return { prep: bars[0], build: bars[1], chal: bars[2], app: bars[3], close: bars[4] };
  },

  _chordStagePlan(total, prog, fast) {
    const bars = this._sectionBarsFor(total);
    return [
      { key: 'prep',        label: 'Preparación',  bars: bars.prep,  build: (i, n) => this._triBarsPrep(prog, i, n) },
      { key: 'build',       label: 'Construcción', bars: bars.build, build: (i)    => this._triBarsBuild(prog, i) },
      { key: 'challenge',   label: 'Desafío',      bars: bars.chal,  build: (i, n) => this._triBarsChallenge(prog, i, n, fast) },
      { key: 'application', label: 'Aplicación',   bars: bars.app,   build: (i, n) => this._triBarsApply(prog, i, n) },
      { key: 'close',       label: 'Cierre',       bars: bars.close, build: (i, n) => this._triBarsClose(prog, i, n) },
    ];
  },

  // Etapas (devuelven segmentos [{ label, beat, dur }] que suman 4 pulsos):

  // Preparación: 1-2 acordes, una redonda por compás (mínima carga).
  _triBarsPrep(prog, i, n) {
    const a = prog[0];
    const b = prog[1 % prog.length] || a;
    const label = (i < Math.ceil(n / 2)) ? a : b;
    return [{ label, beat: 0, dur: 4 }];
  },

  // Construcción: subconjunto de la progresión, bloques en tiempos 1 y 3.
  _triBarsBuild(prog, i) {
    const subset = prog.slice(0, Math.min(4, prog.length));
    const label = subset[i % subset.length];
    return [{ label, beat: 0, dur: 2 }, { label, beat: 2, dur: 2 }];
  },

  // Desafío: progresión completa. Cambios más frecuentes (dos acordes por
  // compás) en los ejercicios marcados fastChanges; si no, bloques 1 y 3.
  _triBarsChallenge(prog, i, n, fast) {
    if (fast || prog.length > n) {
      const a = prog[(2 * i) % prog.length];
      const b = prog[(2 * i + 1) % prog.length];
      return [{ label: a, beat: 0, dur: 2 }, { label: b, beat: 2, dur: 2 }];
    }
    const label = prog[i % prog.length];
    return [{ label, beat: 0, dur: 2 }, { label, beat: 2, dur: 2 }];
  },

  // Aplicación: frase con la progresión; último compás se sostiene (lírico).
  _triBarsApply(prog, i, n) {
    const phrase = this._applicationPhrase(prog, n);
    const label = phrase[i % phrase.length];
    if (i === n - 1) return [{ label, beat: 0, dur: 4 }];
    return [{ label, beat: 0, dur: 2 }, { label, beat: 2, dur: 2 }];
  },

  _applicationPhrase(prog, bars) {
    if (!prog.length) return ['C'];
    if (bars >= 4 && prog.length > 4) {
      const tail = prog.slice(-4);
      const phrase = tail.slice();
      while (phrase.length < bars) phrase.push(prog[0]);
      return phrase;
    }
    return prog;
  },

  // Cierre: resolución a la tónica (primer acorde) como redonda.
  _triBarsClose(prog, i, n) {
    return [{ label: prog[0], beat: 0, dur: 4 }];
  },

  // Tríada en POSICIÓN FUNDAMENTAL (raíz–tercera–quinta) en la octava de
  // RH. No se usa chord.rhTriad porque sus voicings están invertidos para
  // suavizar el enlace; la técnica de triadas exige fundamental.
  _rootTriad(label) {
    const chord = ChordLibrary.get(label);
    if (!chord) return null;
    const rootPc = ((chord.rootBass % 12) + 12) % 12;       // clase de altura de la raíz
    const root   = 60 + rootPc;                              // raíz en octava 4 (C4–B4)
    const third  = /m$/.test(label) ? 3 : 4;                // menor (termina en m) vs mayor
    return [root, root + third, root + 7];                  // raíz, 3ª, 5ª
  },

  // Construye treble (tríada en bloque, fundamental) + bass (raíz) de un
  // compás a partir de segmentos { label, beat, dur }.
  _blockMeasure(segments) {
    const treble = [];
    const bass   = [];
    segments.forEach(s => {
      const chord = ChordLibrary.get(s.label);
      const triad = this._rootTriad(s.label);
      if (!chord || !triad) return;
      triad.forEach(midi => treble.push({ midi, beat: s.beat, duration: s.dur }));
      bass.push({ midi: chord.rootBass, beat: s.beat, duration: s.dur });
    });
    return { treble, bass };
  },

  // ════════════════════════════════════════════════════════════════
  //  ACORDES — INVERSIONES (currículum fiel)
  // ════════════════════════════════════════════════════════════════
  //
  // Misma estructura de 5 etapas y misma distribución que Triadas. La
  // nueva habilidad es la INVERSIÓN: la tríada de la mano derecha se
  // presenta en fundamental, 1ª o 2ª inversión y la mano izquierda toca
  // la nota MÁS GRAVE de esa posición (así "la tercera/quinta queda como
  // nota más grave", como dice el currículum).
  //
  // Tres comportamientos según el ejercicio:
  //   meta.inv = 1|2        → un solo acorde, siempre esa inversión (e1, e2)
  //   meta.useInversions    → elige la inversión MÁS CERCANA (mínimo
  //                           movimiento) respecto al acorde anterior
  //   resto (comparación)   → cicla fundamental → 1ª → 2ª (e3)
  //
  // Sin séptimas, add9, sus ni voicings abiertos: solo tríadas.

  _generateInversions(config, mode, tech, style, diff) {
    const prog  = (config.chords && config.chords.length) ? config.chords.slice() : ['C'];
    const total = Math.max(5, parseInt(config.bars, 10) || 8);
    const fast  = !!(config.meta && config.meta.fastChanges);
    const fixedInv = (config.meta && config.meta.inv) || 0;   // e1=1, e2=2
    const useInv   = !!(config.meta && config.meta.useInversions);

    const finalBpm = clamp(parseInt(config.bpm, 10) || Math.round(style.bpm * diff.bpmFactor), 40, 200);

    const plan = this._chordStagePlan(total, prog, fast);

    // Selector de voicing con estado (recorre los segmentos en orden).
    let prevMean = null;
    let cmpIdx   = 0;
    const lastByLabel = {};
    const chooseVoicing = (label) => {
      let v;
      if (useInv) {
        v = (prevMean === null)
          ? this._triadVoicing(label, 0)
          : this._closestInversion(label, prevMean).v;
      } else if (fixedInv) {
        v = this._triadVoicing(label, fixedInv);
      } else {
        // Comparación: misma posición para repeticiones del mismo acorde
        // dentro del compás; avanza fundamental→1ª→2ª al cambiar de acorde.
        if (lastByLabel[label] !== undefined && lastByLabel._last === label) {
          v = this._triadVoicing(label, lastByLabel[label]);
        } else {
          const inv = cmpIdx % 3; cmpIdx++;
          lastByLabel[label] = inv;
          v = this._triadVoicing(label, inv);
        }
        lastByLabel._last = label;
      }
      prevMean = this._voicingMean(v);
      return v;
    };

    const measures = [];
    const sectionMeta = [];
    let mi = 0;

    plan.forEach(stage => {
      const startBar = mi;
      for (let b = 0; b < stage.bars; b++) {
        const segments = stage.build(b, stage.bars);
        const { treble, bass } = this._invMeasure(segments, chooseVoicing);
        measures.push({
          index: mi,
          sectionKey:   stage.key,
          sectionLabel: stage.label,
          chord: segments.map(s => s.label).join(' '),
          chordSegs: this._collapseSegs(segments),
          treble,
          bass,
        });
        mi++;
      }
      const note = (PracticeLibrary.sections.find(s => s.key === stage.key) || {}).note || '';
      sectionMeta.push({ key: stage.key, label: stage.label, startBar, endBar: mi - 1, note, simplified: (stage.key === 'prep' || stage.key === 'close') });
    });

    const exTitle = config.title ? `${config.n}. ${config.title}` : tech.label;

    return {
      title:    `${mode.label} · ${exTitle}`,
      subtitle: `${diff.label} · ${total} compases · ${finalBpm} BPM`,
      timeSig:  '4/4',
      origBpm:  finalBpm,
      fifths:   0,
      measures,
      sections: sectionMeta,
      meta: {
        mode: mode.label, modeKey: config.mode,
        technique: tech.label, techniqueKey: config.technique,
        exercise: config.title || '', exerciseN: config.n || null,
        style: style.label, styleKey: config.style,
        pattern: 'Bloque', patternKey: 'bloque',
        difficulty: diff.label, diffKey: config.difficulty,
        tonic: diff.tonic, rel: diff.rel, sharps: 0,
        bpm: finalBpm, pending: false,
        explain: config.explain || '',
      },
    };
  },

  // Tríada en una inversión dada (0=fundamental, 1=1ª, 2=2ª), sobre la
  // octava de RH. Construida a partir de la fundamental de _rootTriad.
  _triadVoicing(label, inv) {
    const t = this._rootTriad(label);
    if (!t) return null;
    const [r, th, f] = t;
    if (inv === 1) return [th, f, r + 12];          // 3ª como nota más grave
    if (inv === 2) return [f, r + 12, th + 12];     // 5ª como nota más grave
    return [r, th, f];                              // fundamental
  },

  _voicingMean(v) {
    return v.reduce((a, b) => a + b, 0) / v.length;
  },

  // Colapsa segmentos consecutivos del mismo acorde en una sola etiqueta
  // por cambio de acorde, conservando el beat donde ocurre. Así "F F" se
  // muestra como una sola "F", y "C G" muestra "C" en el pulso 1 y "G" en
  // el pulso 3, cada una alineada con su acorde.
  _collapseSegs(segments) {
    const out = [];
    segments.forEach(s => {
      if (!out.length || out[out.length - 1].label !== s.label) {
        out.push({ label: s.label, beat: s.beat });
      }
    });
    return out;
  },

  // Elige la inversión cuyo centro tonal queda más cerca del acorde
  // anterior (mínimo movimiento de la mano).
  _closestInversion(label, prevMean) {
    let best = null, bestDist = Infinity;
    for (let inv = 0; inv < 3; inv++) {
      const v = this._triadVoicing(label, inv);
      if (!v) continue;
      const d = Math.abs(this._voicingMean(v) - prevMean);
      if (d < bestDist) { bestDist = d; best = { inv, v }; }
    }
    return best || { inv: 0, v: this._triadVoicing(label, 0) };
  },

  // Compás de inversiones: RH = voicing elegido; LH = nota más grave del
  // voicing bajada una octava (así la inversión se oye de verdad).
  _invMeasure(segments, chooseVoicing) {
    const treble = [];
    const bass   = [];
    segments.forEach(s => {
      const v = chooseVoicing(s.label);
      if (!v) return;
      v.forEach(midi => treble.push({ midi, beat: s.beat, duration: s.dur }));
      bass.push({ midi: Math.min.apply(null, v) - 12, beat: s.beat, duration: s.dur });
    });
    return { treble, bass };
  },

  // ════════════════════════════════════════════════════════════════
  //  ACORDES — SÉPTIMAS y EXTENSIONES (currículum fiel)
  // ════════════════════════════════════════════════════════════════
  //
  // Acordes en bloque construidos a partir del nombre (Maj7/m7/7 para
  // séptimas; add9/sus2/sus4 para extensiones). Misma estructura de 5
  // etapas. La nueva habilidad es la sonoridad; la dificultad no viene
  // del ritmo.
  //
  //   meta.useInversions → la mano derecha elige el voicing (inversión)
  //                        más cercano al acorde anterior.
  // La mano izquierda siempre toca la fundamental, para que el color del
  // acorde se reconozca con claridad. Sin voicings abiertos ni pedales.

  _generateBlockChords(config, mode, tech, style, diff) {
    const prog  = (config.chords && config.chords.length) ? config.chords.slice() : ['Cmaj7'];
    const total = Math.max(5, parseInt(config.bars, 10) || 8);
    const fast  = !!(config.meta && config.meta.fastChanges);
    const useInv = !!(config.meta && config.meta.useInversions);
    // Solo en Aplicación Musical: el Desafío late en negras (RH) sobre una
    // izquierda sostenida, para que la pieza se sienta como canción. No es
    // independencia de manos: ambas tocan la misma armonía, la derecha solo
    // pulsa. En las demás técnicas el ritmo se mantiene neutro.
    const pulse = (config.technique === 'application');

    const finalBpm = clamp(parseInt(config.bpm, 10) || Math.round(style.bpm * diff.bpmFactor), 40, 200);

    const plan = this._chordStagePlan(total, prog, fast);

    let prevMean = null;
    const chooseVoicing = (label) => {
      const p = this._parseChord(label);
      if (!p) return null;
      const root = 36 + p.rootPc;                  // fundamental en octava 2
      let rh;
      if (useInv) {
        rh = (prevMean === null)
          ? this._chordVoicing(label, 0)
          : this._closestChordVoicing(label, prevMean).v;
      } else {
        rh = this._chordVoicing(label, 0);
      }
      prevMean = this._voicingMean(rh);
      return { rh, root };
    };

    const measures = [];
    const sectionMeta = [];
    let mi = 0;

    plan.forEach(stage => {
      const startBar = mi;
      for (let b = 0; b < stage.bars; b++) {
        const segments = stage.build(b, stage.bars);
        const treble = [], bass = [];
        const pulseHere = pulse && stage.key === 'challenge';
        segments.forEach(s => {
          const v = chooseVoicing(s.label);
          if (!v) return;
          if (pulseHere) {
            // RH en negras (una por pulso que abarca el segmento); LH sostiene
            // el acorde durante todo el segmento (blanca/redonda).
            for (let q = 0; q < s.dur; q++) {
              v.rh.forEach(midi => treble.push({ midi, beat: s.beat + q, duration: 1 }));
            }
            bass.push({ midi: v.root, beat: s.beat, duration: s.dur });
          } else {
            v.rh.forEach(midi => treble.push({ midi, beat: s.beat, duration: s.dur }));
            bass.push({ midi: v.root, beat: s.beat, duration: s.dur });
          }
        });
        measures.push({
          index: mi,
          sectionKey:   stage.key,
          sectionLabel: stage.label,
          chord: segments.map(s => s.label).join(' '),
          chordSegs: this._collapseSegs(segments),
          treble,
          bass,
        });
        mi++;
      }
      const note = (PracticeLibrary.sections.find(s => s.key === stage.key) || {}).note || '';
      sectionMeta.push({ key: stage.key, label: stage.label, startBar, endBar: mi - 1, note, simplified: (stage.key === 'prep' || stage.key === 'close') });
    });

    const exTitle = config.title ? `${config.n}. ${config.title}` : tech.label;

    return {
      title:    `${mode.label} · ${exTitle}`,
      subtitle: `${diff.label} · ${total} compases · ${finalBpm} BPM`,
      timeSig:  '4/4',
      origBpm:  finalBpm,
      fifths:   0,
      measures,
      sections: sectionMeta,
      meta: {
        mode: mode.label, modeKey: config.mode,
        technique: tech.label, techniqueKey: config.technique,
        exercise: config.title || '', exerciseN: config.n || null,
        style: style.label, styleKey: config.style,
        pattern: 'Bloque', patternKey: 'bloque',
        difficulty: diff.label, diffKey: config.difficulty,
        tonic: diff.tonic, rel: diff.rel, sharps: 0,
        bpm: finalBpm, pending: false,
        explain: config.explain || '',
      },
    };
  },

  // Parsea un nombre de acorde → { rootPc, iv } donde iv son los
  // intervalos (semitonos) desde la fundamental. Cubre triadas y séptimas.
  _NOTE_PC: { C:0, 'C#':1, D:2, 'D#':3, E:4, F:5, 'F#':6, G:7, 'G#':8, A:9, 'A#':10, B:11 },
  _parseChord(label) {
    const m = String(label).match(/^([A-G]#?)(.*)$/);
    if (!m) return null;
    const rootPc = this._NOTE_PC[m[1]];
    if (rootPc == null) return null;
    const q = m[2];
    let iv;
    if      (q === 'maj7') iv = [0, 4, 7, 11];
    else if (q === 'm7')   iv = [0, 3, 7, 10];
    else if (q === '7')    iv = [0, 4, 7, 10];
    else if (q === 'add9') iv = [0, 4, 7, 14];   // triada mayor + 9ª
    else if (q === 'sus2') iv = [0, 2, 7];       // 3ª → 2ª
    else if (q === 'sus4') iv = [0, 5, 7];       // 3ª → 4ª
    else if (q === 'm')    iv = [0, 3, 7];
    else if (q === '')     iv = [0, 4, 7];
    else return null;
    return { rootPc, iv };
  },

  // Voicing del acorde (fundamental u otra inversión) en la octava de RH.
  _chordVoicing(label, inv) {
    const p = this._parseChord(label);
    if (!p) return null;
    const notes = p.iv.map(x => 60 + p.rootPc + x);   // posición fundamental, octava 4
    for (let k = 0; k < (inv || 0); k++) notes.push(notes.shift() + 12);
    return notes;
  },

  _closestChordVoicing(label, prevMean) {
    const p = this._parseChord(label);
    if (!p) return { inv: 0, v: this._chordVoicing(label, 0) };
    let best = null, bd = Infinity;
    for (let inv = 0; inv < p.iv.length; inv++) {
      const v = this._chordVoicing(label, inv);
      const d = Math.abs(this._voicingMean(v) - prevMean);
      if (d < bd) { bd = d; best = { inv, v }; }
    }
    return best;
  },

  // ════════════════════════════════════════════════════════════════
  //  ARPEGIOS — BÁSICOS
  // ════════════════════════════════════════════════════════════════
  //
  // Forma principal: 1-3-5-8-5-3-1. En segmentos de 4 pulsos la última
  // nota se sostiene para completar el compás; cuando un compás tiene dos
  // acordes se usa la versión compacta ascendente 1-3-5-8 por acorde.

  _generateBasicArpeggios(config, mode, tech, style, diff) {
    const prog = (config.chords && config.chords.length) ? config.chords.slice() : ['C'];
    const total = Math.max(5, parseInt(config.bars, 10) || 8);
    const useInv = !!(config.meta && config.meta.useInversions);
    const fixedInv = (config.meta && config.meta.inv) || 0;
    const bothHands = !!(config.meta && config.meta.bothHands);
    const useFifth = !!(config.meta && config.meta.useFifth);
    const holdChanges = !!(config.meta && config.meta.holdChanges);
    const patternKey = (config.meta && config.meta.arpeggioPattern) || 'basic7';

    const finalBpm = clamp(parseInt(config.bpm, 10) || Math.round(style.bpm * diff.bpmFactor), 40, 200);
    const plan = this._chordStagePlan(total, prog, false);

    let prevMean = null;
    const chooseVoicing = (label) => {
      const p = this._parseChord(label);
      if (!p) return null;
      let rh;
      if (fixedInv) {
        rh = this._chordVoicing(label, fixedInv);
      } else if (useInv && prevMean !== null) {
        rh = this._closestChordVoicing(label, prevMean).v;
      } else {
        rh = this._chordVoicing(label, 0);
      }
      prevMean = this._voicingMean(rh);
      return { rh, root: 36 + p.rootPc };
    };

    const measures = [];
    const sectionMeta = [];
    let mi = 0;

    plan.forEach(stage => {
      const startBar = mi;
      for (let b = 0; b < stage.bars; b++) {
        const segments = this._arpeggioSegments(prog, stage, b, mi, holdChanges);
        const { treble, bass } = this._arpeggioMeasure(segments, chooseVoicing, {
          bothHands,
          useFifth,
          patternKey,
          stageKey: stage.key,
        });
        measures.push({
          index: mi,
          sectionKey:   stage.key,
          sectionLabel: stage.label,
          chord: segments.map(s => s.label).join(' '),
          chordSegs: this._collapseSegs(segments),
          treble,
          bass,
        });
        mi++;
      }
      const note = (PracticeLibrary.sections.find(s => s.key === stage.key) || {}).note || '';
      sectionMeta.push({ key: stage.key, label: stage.label, startBar, endBar: mi - 1, note, simplified: (stage.key === 'prep' || stage.key === 'close') });
    });

    const exTitle = config.title ? `${config.n}. ${config.title}` : tech.label;

    return {
      title:    `${mode.label} · ${exTitle}`,
      subtitle: `${diff.label} · ${total} compases · ${finalBpm} BPM`,
      timeSig:  '4/4',
      measureBeats: 4,
      origBpm:  finalBpm,
      fifths:   0,
      measures,
      sections: sectionMeta,
      meta: {
        mode: mode.label, modeKey: config.mode,
        technique: tech.label, techniqueKey: config.technique,
        exercise: config.title || '', exerciseN: config.n || null,
        style: style.label, styleKey: config.style,
        pattern: this._arpeggioPatternLabel(patternKey), patternKey,
        difficulty: diff.label, diffKey: config.difficulty,
        tonic: diff.tonic, rel: diff.rel, sharps: 0,
        bpm: finalBpm, pending: false,
        explain: config.explain || '',
        pedal: (config.meta && config.meta.pedal) || '',
        bothHands,
        useFifth,
        patternFeel: (config.meta && config.meta.patternFeel) || '',
        useWhen: (config.meta && config.meta.useWhen) || '',
      },
    };
  },

  _arpeggioSegments(prog, stage, barInStage, globalMeasure, holdChanges) {
    if (stage.key === 'close') return [{ label: prog[0], beat: 0, dur: 4 }];
    if (holdChanges && stage.key !== 'challenge') {
      const label = prog[Math.floor(globalMeasure / 2) % prog.length];
      return [{ label, beat: 0, dur: 4 }];
    }
    if (stage.key === 'prep') {
      const label = prog[barInStage % Math.min(2, prog.length)];
      return [{ label, beat: 0, dur: 4 }];
    }
    if (stage.key === 'build') {
      const subset = prog.slice(0, Math.min(4, prog.length));
      return [{ label: subset[barInStage % subset.length], beat: 0, dur: 4 }];
    }
    if (stage.key === 'challenge') {
      if (prog.length > stage.bars) {
        return [
          { label: prog[(barInStage * 2) % prog.length], beat: 0, dur: 2 },
          { label: prog[(barInStage * 2 + 1) % prog.length], beat: 2, dur: 2 },
        ];
      }
      return [{ label: prog[barInStage % prog.length], beat: 0, dur: 4 }];
    }
    if (stage.key === 'application') {
      const phrase = this._applicationPhrase(prog, stage.bars);
      return [{ label: phrase[barInStage % phrase.length], beat: 0, dur: 4 }];
    }
    return [{ label: prog[barInStage % prog.length], beat: 0, dur: 4 }];
  },

  _arpeggioMeasure(segments, chooseVoicing, opts) {
    const treble = [];
    const bass = [];
    segments.forEach(s => {
      const v = chooseVoicing(s.label);
      if (!v || !v.rh) return;
      const seq = this._arpeggioSequence(v.rh, s.dur, this._effectiveArpeggioPattern(opts.patternKey, opts.stageKey));
      seq.forEach(ev => treble.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur }));
      if (opts.bothHands) {
        if (opts.useFifth && s.dur >= 4) {
          bass.push({ midi: v.root, beat: s.beat, duration: 2 });
          bass.push({ midi: v.root + 7, beat: s.beat + 2, duration: s.dur - 2 });
        } else {
          bass.push({ midi: v.root, beat: s.beat, duration: s.dur });
        }
      }
    });
    return { treble, bass };
  },

  _effectiveArpeggioPattern(patternKey, stageKey) {
    if (patternKey === 'baseBounce') return (stageKey === 'challenge' || stageKey === 'application') ? 'bounce' : 'base4';
    if (patternKey === 'mixedIntermediate') {
      if (stageKey === 'challenge') return 'modern';
      if (stageKey === 'application') return 'open';
      return 'expanded';
    }
    if (patternKey === 'mixedAccompaniment') {
      if (stageKey === 'challenge') return 'modern';
      if (stageKey === 'application') return 'expanded';
      return 'basic7';
    }
    if (patternKey === 'mixedFluid') {
      if (stageKey === 'challenge') return 'modern';
      if (stageKey === 'application') return 'open';
      return 'expanded';
    }
    if (patternKey === 'mixedPatterns') {
      if (stageKey === 'challenge') return 'modern';
      if (stageKey === 'application') return 'alberti';
      return 'base4';
    }
    if (patternKey === 'modulePatterns') {
      if (stageKey === 'prep') return 'base4';
      if (stageKey === 'build') return 'expanded';
      if (stageKey === 'challenge') return 'alberti';
      if (stageKey === 'application') return 'open';
      return 'modern';
    }
    if (patternKey === 'moduleFinalArpeggios') {
      if (stageKey === 'prep') return 'base4';
      if (stageKey === 'build') return 'expanded';
      if (stageKey === 'challenge') return 'modern';
      if (stageKey === 'application') return 'alberti';
      return 'open';
    }
    return patternKey || 'basic7';
  },

  _arpeggioPatternLabel(patternKey) {
    const labels = {
      basic7: 'Arpegio básico',
      base4: 'Patrón Base',
      bounce: 'Patrón Rebote',
      expanded: 'Patrón Expandido',
      modern: 'Patrón Moderno',
      open: 'Patrón Moderno Abierto',
      alberti: 'Alberti',
      baseBounce: 'Patrón Base + Rebote',
      mixedIntermediate: 'Patrones intermedios',
      mixedAccompaniment: 'Arpegios de acompañamiento',
      mixedFluid: 'Arpegios fluidos',
      mixedPatterns: 'Combinación de patrones',
      modulePatterns: 'Dominio de patrones',
      moduleFinalArpeggios: 'Proyecto final de arpegios',
    };
    return labels[patternKey] || 'Arpegio básico';
  },

  _arpeggioSequence(voicing, dur, patternKey) {
    const v = voicing.slice();
    const top = v.length >= 4 ? v[3] : v[0] + 12;
    const shapes = {
      basic7: v.length >= 4 ? [v[0], v[1], v[2], v[3], v[2], v[1], v[0]] : [v[0], v[1], v[2], v[0] + 12, v[2], v[1], v[0]],
      base4: [v[0], v[1], v[2], top],
      bounce: [v[0], v[2], v[1], v[2]],
      expanded: [v[0], v[1], v[2], top, v[2], v[1]],
      modern: [v[0], v[2], top, v[2]],
      open: [v[0], top, v[2], top],
      alberti: [v[0], v[2], v[1], v[2]],
    };
    const fullShape = shapes[patternKey] || shapes.basic7;
    if (dur >= 4) {
      const cycleCount = Math.max(1, Math.floor(4 / 0.5));
      const notes = [];
      for (let i = 0; i < cycleCount; i++) notes.push(fullShape[i % fullShape.length]);
      if (patternKey === 'basic7') {
        const durs = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, dur - 3];
        let beat = 0;
        return fullShape.map((midi, i) => {
          const out = { midi, beat, dur: durs[i] };
          beat += durs[i];
          return out;
        });
      }
      let beat = 0;
      return notes.map(midi => {
        const out = { midi, beat, dur: 0.5 };
        beat += 0.5;
        return out;
      });
    }
    const compact = fullShape.slice(0, Math.max(1, Math.floor(dur / 0.5)));
    return compact.map((midi, i) => ({ midi, beat: i * 0.5, dur: Math.min(0.5, dur - i * 0.5) }))
      .filter(ev => ev.dur > 0);
  },

  // ════════════════════════════════════════════════════════════════
  //  ACOMPAÑAMIENTO — BLOQUE
  // ════════════════════════════════════════════════════════════════
  //
  // No usa octavas, quinta alternada, bajo alternado, arpegios ni vals.
  // LH = fundamental simple sostenida; RH = acorde completo en bloque.
  // La dificultad crece por vocabulario armónico e inversiones, no por ritmo.

  _generateAccompanimentBlock(config, mode, tech, style, diff) {
    return this._generateAccompaniment(config, mode, tech, style, diff);
  },

  // ════════════════════════════════════════════════════════════════
  //  COORDINACIÓN — BAJO + ACORDES
  // ════════════════════════════════════════════════════════════════

  _generateBassChordsCoordination(config, mode, tech, style, diff) {
    const prog = (config.chords && config.chords.length) ? config.chords.slice() : ['C'];
    const total = Math.max(5, parseInt(config.bars, 10) || 8);
    const useInv = !!(config.meta && config.meta.useInversions);
    const pattern = (config.meta && config.meta.coordinationPattern) || 'rootChord';
    const stableBass = !!(config.meta && config.meta.stableBass);

    const finalBpm = clamp(parseInt(config.bpm, 10) || Math.round(style.bpm * diff.bpmFactor), 40, 200);
    const plan = this._chordStagePlan(total, prog, false);

    let prevMean = null;
    const chooseVoicing = (label) => {
      const p = this._parseChord(label);
      if (!p) return null;
      const rh = useInv && prevMean !== null
        ? this._closestChordVoicing(label, prevMean).v
        : this._chordVoicing(label, 0);
      prevMean = this._voicingMean(rh);
      return { rh, parsed: p, root: 36 + p.rootPc };
    };

    const measures = [];
    const sectionMeta = [];
    let mi = 0;

    plan.forEach(stage => {
      const startBar = mi;
      for (let b = 0; b < stage.bars; b++) {
        const segments = this._coordinationSegments(prog, stage, b);
        const { treble, bass } = this._coordinationMeasure(segments, chooseVoicing, {
          pattern,
          stageKey: stage.key,
          techniqueKey: config.technique,
          stableBass,
          stableLabel: prog[0],
          globalMeasure: mi,
        });
        measures.push({
          index: mi,
          sectionKey:   stage.key,
          sectionLabel: stage.label,
          chord: segments.map(s => s.label).join(' '),
          chordSegs: this._collapseSegs(segments),
          treble,
          bass,
        });
        mi++;
      }
      const note = (PracticeLibrary.sections.find(s => s.key === stage.key) || {}).note || '';
      sectionMeta.push({ key: stage.key, label: stage.label, startBar, endBar: mi - 1, note, simplified: (stage.key === 'prep' || stage.key === 'close') });
    });

    const exTitle = config.title ? `${config.n}. ${config.title}` : tech.label;

    return {
      title:    `${mode.label} · ${exTitle}`,
      subtitle: `${diff.label} · ${total} compases · ${finalBpm} BPM`,
      timeSig:  '4/4',
      measureBeats: 4,
      origBpm:  finalBpm,
      fifths:   0,
      measures,
      sections: sectionMeta,
      meta: {
        mode: mode.label, modeKey: config.mode,
        technique: tech.label, techniqueKey: config.technique,
        exercise: config.title || '', exerciseN: config.n || null,
        style: style.label, styleKey: config.style,
        pattern: this._coordinationPatternLabel(pattern), patternKey: pattern,
        difficulty: diff.label, diffKey: config.difficulty,
        tonic: diff.tonic, rel: diff.rel, sharps: 0,
        bpm: finalBpm, pending: false,
        explain: config.explain || '',
        leftRole: this._coordinationLeftRole(pattern, stableBass),
        rightRole: this._coordinationRightRole(config.technique, pattern),
        coordinationResource: (config.meta && config.meta.coordinationResource) || this._coordinationPatternLabel(pattern),
      },
    };
  },

  _coordinationSegments(prog, stage, barInStage) {
    if (stage.key === 'close') return [{ label: prog[0], beat: 0, dur: 4 }];
    if (stage.key === 'prep') {
      const label = prog[barInStage % Math.min(2, prog.length)];
      return [{ label, beat: 0, dur: 4 }];
    }
    if (stage.key === 'build') {
      const subset = prog.slice(0, Math.min(4, prog.length));
      const label = subset[barInStage % subset.length];
      return [{ label, beat: 0, dur: 2 }, { label, beat: 2, dur: 2 }];
    }
    if (stage.key === 'challenge' && prog.length > stage.bars) {
      return [
        { label: prog[(barInStage * 2) % prog.length], beat: 0, dur: 2 },
        { label: prog[(barInStage * 2 + 1) % prog.length], beat: 2, dur: 2 },
      ];
    }
    if (stage.key === 'application') {
      const phrase = this._applicationPhrase(prog, stage.bars);
      const label = phrase[barInStage % phrase.length];
      return [{ label, beat: 0, dur: 2 }, { label, beat: 2, dur: 2 }];
    }
    const label = prog[barInStage % prog.length];
    return [{ label, beat: 0, dur: 2 }, { label, beat: 2, dur: 2 }];
  },

  _coordinationMeasure(segments, chooseVoicing, opts) {
    if (opts.techniqueKey === 'alternatingHands') return this._alternatingCoordinationMeasure(segments, chooseVoicing, opts);
    if (opts.techniqueKey === 'fixedMoving') return this._fixedMovingCoordinationMeasure(segments, chooseVoicing, opts);
    if (opts.techniqueKey === 'continuousPattern') return this._independentBassCoordinationMeasure(segments, chooseVoicing, opts);
    if (opts.techniqueKey === 'simpleVoices') return this._countermelodyCoordinationMeasure(segments, chooseVoicing, opts);
    if (opts.techniqueKey === 'technicalApplication') return this._applicationCoordinationMeasure(segments, chooseVoicing, opts);
    if (opts.techniqueKey === 'melodyChords') return this._melodyChordsCoordinationMeasure(segments, chooseVoicing, opts);
    if (opts.techniqueKey === 'bassMelody') return this._bassMelodyCoordinationMeasure(segments, chooseVoicing, opts);
    if (opts.techniqueKey === 'independentBass') return this._independentBassCoordinationMeasure(segments, chooseVoicing, opts);
    if (opts.techniqueKey === 'displacedRhythms') return this._displacedCoordinationMeasure(segments, chooseVoicing, opts);
    if (opts.techniqueKey === 'countermelodies') return this._countermelodyCoordinationMeasure(segments, chooseVoicing, opts);
    if (opts.techniqueKey === 'application') return this._applicationCoordinationMeasure(segments, chooseVoicing, opts);

    const treble = [];
    const bass = [];
    const stable = opts.stableBass ? chooseVoicing(opts.stableLabel) : null;
    segments.forEach(s => {
      const v = chooseVoicing(s.label);
      if (!v || !v.rh) return;
      v.rh.forEach(midi => treble.push({ midi, beat: s.beat, duration: s.dur }));
      const bassSource = stable || v;
      const bassEvents = this._coordinationBassEvents(bassSource, s.dur, this._effectiveCoordinationPattern(opts.pattern, opts.stageKey));
      bassEvents.forEach(ev => bass.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur }));
    });
    return { treble, bass };
  },

  _alternatingCoordinationMeasure(segments, chooseVoicing, opts) {
    const treble = [];
    const bass = [];
    segments.forEach((s, si) => {
      const v = chooseVoicing(s.label);
      if (!v || !v.rh) return;
      const pat = opts.pattern;
      const reverse = pat === 'reverseAlternating';
      const offbeat = ['offbeatAlternating', 'modernAlternating', 'harmonicResponse'].includes(pat);
      const fast = ['fastAlternating', 'alternatingFinal'].includes(pat);
      const oct = pat === 'octaveAlternating' || opts.useOctaves;
      const bassNotes = oct ? [v.root, v.root + 12] : [v.root];
      const bassBeats = fast ? [0, 1] : [reverse ? 1 : 0];
      const rhBeats = fast ? [0.5, 1.5] : (offbeat ? [0.5, 1.5] : [reverse ? 0 : 1]);
      bassBeats.filter(b => b < s.dur).forEach((b, i) => {
        const midi = bassNotes[i % bassNotes.length] + (pat === 'alternatingBassFifth' && i % 2 ? 7 : 0);
        bass.push({ midi, beat: s.beat + b, duration: Math.min(0.75, s.dur - b) });
      });
      rhBeats.filter(b => b < s.dur).forEach((b, i) => {
        const notes = pat === 'oneTwo' || pat === 'preparedRest'
          ? [this._coordMelodyMidi(v, opts.globalMeasure + si + i, 74)]
          : v.rh;
        notes.forEach(midi => treble.push({ midi, beat: s.beat + b, duration: Math.min(0.75, s.dur - b) }));
      });
    });
    return { treble, bass };
  },

  _fixedMovingCoordinationMeasure(segments, chooseVoicing, opts) {
    const treble = [];
    const bass = [];
    const stable = opts.stableBass ? chooseVoicing(opts.stableLabel) : null;
    segments.forEach((s, si) => {
      const v = chooseVoicing(s.label);
      if (!v || !v.rh) return;
      const pat = opts.pattern;
      const holdLeft = ['leftHold', 'pedalBass', 'pedalInversions', 'fixedFifth', 'leftLong', 'octavePedal'].includes(pat)
        || (pat === 'roleSwitch' && (opts.globalMeasure + si) % 2 === 0)
        || (pat === 'changingRoles' && (opts.globalMeasure + si) % 2 === 0);
      const holdRight = ['rightHold', 'movingBassHold', 'rightLong', 'colorHold', 'modernHold', 'fixedUpper'].includes(pat)
        || (pat === 'roleSwitch' && (opts.globalMeasure + si) % 2 === 1)
        || (pat === 'advancedRoleSwitch' && (opts.globalMeasure + si) % 2 === 1);
      const source = stable || v;
      if (holdLeft) {
        const leftNotes = pat === 'octavePedal' ? [source.root, source.root + 12] : (pat === 'fixedFifth' ? [source.root, source.root + 7] : [source.root]);
        leftNotes.forEach(midi => bass.push({ midi, beat: s.beat, duration: s.dur }));
        [0, Math.min(1, s.dur - 0.5)].filter(b => b >= 0 && b < s.dur).forEach(b => {
          v.rh.forEach(midi => treble.push({ midi, beat: s.beat + b, duration: Math.min(0.75, s.dur - b) }));
        });
        return;
      }
      if (holdRight) {
        v.rh.forEach(midi => treble.push({ midi, beat: s.beat, duration: s.dur }));
        this._coordinationBassEvents(v, s.dur, opts.useOctaves ? 'octavesChord' : 'rootFifthChord')
          .forEach(ev => bass.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur }));
        return;
      }
      v.rh.forEach(midi => treble.push({ midi, beat: s.beat, duration: Math.min(1, s.dur) }));
      bass.push({ midi: v.root, beat: s.beat, duration: s.dur });
    });
    return { treble, bass };
  },

  _melodyChordsCoordinationMeasure(segments, chooseVoicing, opts) {
    const treble = [];
    const bass = [];
    segments.forEach((s, si) => {
      const v = chooseVoicing(s.label);
      if (!v || !v.rh) return;
      const melody = this._coordMelodyNotes(v, opts.globalMeasure + si, s.dur, 76);
      const chordDur = Math.min(1, s.dur);
      const bassEvents = this._coordinationBassEvents(v, s.dur, opts.pattern === 'melodyOctaves' ? 'octavesChord' : (opts.pattern === 'melodyFinal' ? 'rootFifthChord' : 'rootChord'));
      bassEvents.forEach(ev => bass.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur }));
      melody.forEach(ev => {
        const support = v.rh.filter(n => n < ev.midi).slice(0, opts.pattern === 'melodyFragments' ? 2 : 3);
        support.forEach(midi => treble.push({ midi, beat: s.beat + ev.beat, duration: Math.min(ev.dur, chordDur) }));
        treble.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur });
      });
    });
    return { treble, bass };
  },

  _bassMelodyCoordinationMeasure(segments, chooseVoicing, opts) {
    const treble = [];
    const bass = [];
    segments.forEach((s, si) => {
      const v = chooseVoicing(s.label);
      if (!v || !v.rh) return;
      const phrase = this._coordMelodyNotes(v, opts.globalMeasure + si, s.dur, 72, opts.pattern === 'bassMelodySpace');
      phrase.forEach(ev => treble.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur }));
      const bassPattern = opts.pattern === 'octaveBassMelody' || opts.pattern === 'bassMelodyFinal'
        ? 'octavesChord'
        : (opts.pattern === 'rootFifthMelody' || opts.pattern === 'activeBassMelody' || opts.pattern === 'instrumentalBassMelody' ? 'rootFifthChord' : 'rootChord');
      this._coordinationBassEvents(v, s.dur, bassPattern).forEach(ev => bass.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur }));
    });
    return { treble, bass };
  },

  _independentBassCoordinationMeasure(segments, chooseVoicing, opts) {
    const treble = [];
    const bass = [];
    segments.forEach((s, si) => {
      const v = chooseVoicing(s.label);
      if (!v || !v.rh) return;
      this._coordIndependentBassEvents(v, s.dur, opts.pattern).forEach(ev => bass.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur }));
      const melody = this._coordMelodyNotes(v, opts.globalMeasure + si, s.dur, 74, false, 1);
      melody.forEach(ev => treble.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur }));
    });
    return { treble, bass };
  },

  _displacedCoordinationMeasure(segments, chooseVoicing, opts) {
    const treble = [];
    const bass = [];
    segments.forEach((s, si) => {
      const v = chooseVoicing(s.label);
      if (!v || !v.rh) return;
      const noTogether = opts.pattern === 'neverTogether';
      const bassBeats = noTogether ? [0, 1, 2, 3].filter(b => b < s.dur) : [0, Math.min(2, s.dur - 0.5)].filter(b => b >= 0 && b < s.dur);
      bassBeats.forEach((b, i) => bass.push({ midi: i % 2 ? v.root + 7 : v.root, beat: s.beat + b, duration: Math.min(0.5, s.dur - b) }));
      const shift = noTogether ? 0.5 : (opts.pattern === 'syncopation' || opts.pattern === 'worshipDisplaced' ? 0.5 : 1);
      const rhBeats = [shift, shift + 1.5].filter(b => b < s.dur);
      rhBeats.forEach((b, i) => {
        const notes = opts.pattern === 'bassFirst' || opts.pattern === 'melodyAgainstPulse'
          ? [this._coordMelodyMidi(v, opts.globalMeasure + si + i, 76)]
          : v.rh;
        notes.forEach(midi => treble.push({ midi, beat: s.beat + b, duration: Math.min(0.75, s.dur - b) }));
      });
    });
    return { treble, bass };
  },

  _countermelodyCoordinationMeasure(segments, chooseVoicing, opts) {
    const treble = [];
    const bass = [];
    segments.forEach((s, si) => {
      const v = chooseVoicing(s.label);
      if (!v || !v.rh) return;
      const main = this._coordMelodyNotes(v, opts.globalMeasure + si, s.dur, 76, opts.pattern === 'spacesCounter', 1);
      const counter = this._coordCounterNotes(v, opts.globalMeasure + si, s.dur, opts.pattern);
      main.forEach(ev => treble.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur }));
      counter.forEach(ev => bass.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur }));
    });
    return { treble, bass };
  },

  _applicationCoordinationMeasure(segments, chooseVoicing, opts) {
    const pattern = this._applicationCoordinationPattern(opts.pattern, opts.stageKey, opts.globalMeasure);
    const scoped = { ...opts, pattern };
    if (['alternating', 'reverseAlternating', 'sharedPulse', 'chordTurns', 'stableAlternating', 'offbeatAlternating', 'oneTwo', 'alternatingBassFifth', 'preparedRest', 'extendedTurns', 'octaveAlternating', 'fastAlternating', 'harmonicResponse', 'modernAlternating', 'alternatingFinal'].includes(pattern)) return this._alternatingCoordinationMeasure(segments, chooseVoicing, scoped);
    if (['leftHold', 'rightHold', 'pedalBass', 'movingBassHold', 'roleSwitch', 'pedalInversions', 'fixedFifth', 'rightLong', 'leftLong', 'changingRoles', 'octavePedal', 'colorHold', 'advancedRoleSwitch', 'modernHold', 'fixedMovingFinal'].includes(pattern)) return this._fixedMovingCoordinationMeasure(segments, chooseVoicing, scoped);
    if (['ostinato', 'ostinatoChange', 'patternLongEvent', 'ostinatoFifth', 'stableOstinato', 'worshipOstinato', 'patternInversions', 'octaveOstinato', 'patternWithSpaces', 'prolongedPattern', 'walkingBass', 'longCycle', 'modernPattern', 'widePattern', 'continuousFinal'].includes(pattern)) return this._independentBassCoordinationMeasure(segments, chooseVoicing, scoped);
    if (['twoNotes', 'parallelMotion', 'contraryMotion', 'technicalCallResponse', 'simpleVoices', 'longShort', 'stepsVsLeaps', 'leapsVsSteps', 'staggeredVoices', 'coordinatedLines', 'continuousContrary', 'colorLines', 'fixedUpper', 'wideVoices', 'simpleVoicesFinal'].includes(pattern)) return this._countermelodyCoordinationMeasure(segments, chooseVoicing, scoped);
    if (['displacedEntry', 'bassFirst', 'offbeatChord', 'rhythmicAnswer', 'syncopation', 'melodyAgainstPulse', 'worshipDisplaced', 'mixedDisplaced', 'continuousDisplaced', 'neverTogether', 'displacedFinal'].includes(pattern)) return this._displacedCoordinationMeasure(segments, chooseVoicing, scoped);
    if (['melodyChords', 'melodyFinal'].includes(pattern)) return this._melodyChordsCoordinationMeasure(segments, chooseVoicing, scoped);
    if (['bassMelody', 'bassMelodyFinal'].includes(pattern)) return this._bassMelodyCoordinationMeasure(segments, chooseVoicing, scoped);
    if (['ostinato', 'worshipOstinato', 'independentFinal'].includes(pattern)) return this._independentBassCoordinationMeasure(segments, chooseVoicing, scoped);
    if (['displacedEntry', 'syncopation', 'continuousDisplaced'].includes(pattern)) return this._displacedCoordinationMeasure(segments, chooseVoicing, scoped);
    if (['countermelody', 'emotionalCounter', 'instrumentalCounter'].includes(pattern)) return this._countermelodyCoordinationMeasure(segments, chooseVoicing, scoped);
    return this._coordinationMeasure(segments, chooseVoicing, { ...scoped, techniqueKey: 'bassChords' });
  },

  _effectiveCoordinationPattern(pattern, stageKey) {
    if (pattern === 'modernCoordination') {
      if (stageKey === 'challenge') return 'tenthsChord';
      if (stageKey === 'application') return 'rootFifthChord';
      return 'rootChord';
    }
    if (pattern === 'coordinationFinal') {
      if (stageKey === 'prep') return 'rootChord';
      if (stageKey === 'build') return 'rootFifthChord';
      if (stageKey === 'challenge') return 'octavesChord';
      if (stageKey === 'application') return 'tenthsChord';
      return 'rootChord';
    }
    return pattern;
  },

  _coordinationBassEvents(v, dur, pattern) {
    if (pattern === 'rootFifthChord' || pattern === 'independentBass') {
      if (dur >= 2) {
        return [
          { midi: v.root, beat: 0, dur: dur / 2 },
          { midi: v.root + 7, beat: dur / 2, dur: dur / 2 },
        ];
      }
      return [{ midi: v.root, beat: 0, dur }];
    }
    if (pattern === 'octavesChord') {
      return [
        { midi: v.root, beat: 0, dur },
        { midi: v.root + 12, beat: 0, dur },
      ];
    }
    if (pattern === 'tenthsChord') {
      const third = v.parsed && v.parsed.iv && v.parsed.iv[1] != null ? v.parsed.iv[1] : 4;
      return [
        { midi: v.root, beat: 0, dur },
        { midi: v.root + 12 + third, beat: 0, dur },
      ];
    }
    return [{ midi: v.root, beat: 0, dur }];
  },

  _coordMelodyMidi(v, seed, floor) {
    const contour = [0, 2, 4, 5, 4, 2, 1, 0];
    const top = Math.max(...v.rh);
    const midi = top + contour[Math.abs(seed) % contour.length];
    return Math.max(floor || 72, midi);
  },

  _coordMelodyNotes(v, seed, dur, floor, withSpaces, density) {
    const step = density || 1;
    const count = Math.max(1, Math.floor(dur / step));
    const events = [];
    for (let i = 0; i < count; i++) {
      const beat = i * step;
      if (withSpaces && i % 2 === 1) continue;
      events.push({
        midi: this._coordMelodyMidi(v, seed + i, floor),
        beat,
        dur: Math.min(step, dur - beat),
      });
    }
    return events;
  },

  _coordIndependentBassEvents(v, dur, pattern) {
    const out = [];
    const step = 0.5;
    const useOct = pattern === 'octaveOstinato' || pattern === 'instrumentalOstinato' || pattern === 'independentFinal' || pattern === 'widePattern' || pattern === 'continuousFinal';
    const walking = pattern === 'walkingBass';
    const longCycle = pattern === 'longCycle' || pattern === 'modernPattern';
    for (let b = 0, i = 0; b < dur; b += step, i++) {
      let midi;
      if (walking) midi = v.root + [0, 2, 4, 5, 7, 5, 4, 2][i % 8];
      else if (longCycle) midi = v.root + [0, 7, 12, 7, 4, 7, 12, 7][i % 8];
      else if (useOct) midi = v.root + (i % 2 ? 12 : 0);
      else midi = v.root + (i % 2 ? 7 : 0);
      out.push({ midi, beat: b, dur: Math.min(step, dur - b) });
    }
    return out;
  },

  _coordCounterNotes(v, seed, dur, pattern) {
    const out = [];
    const contrary = pattern === 'contraryMotion' || pattern === 'twoVoices' || pattern === 'continuousContrary';
    const call = pattern === 'callResponse' || pattern === 'spacesCounter' || pattern === 'technicalCallResponse' || pattern === 'staggeredVoices';
    const step = call || pattern === 'longShort' ? 1 : 0.5;
    const start = call ? 1 : 0;
    for (let b = start; b < dur; b += step) {
      const idx = Math.round((seed + b) * 2);
      const degrees = contrary ? [7, 5, 4, 2, 0, 2, 4, 5] : [0, 2, 4, 5, 4, 2, 1, 0];
      const octave = pattern === 'wideVoices' ? 0 : 12;
      out.push({ midi: v.root + octave + degrees[Math.abs(idx) % degrees.length], beat: b, dur: Math.min(step, dur - b) });
    }
    return out;
  },

  _applicationCoordinationPattern(pattern, stageKey, globalMeasure) {
    if (pattern === 'applicationMixed') {
      if (stageKey === 'prep') return 'ostinato';
      if (stageKey === 'build') return 'countermelody';
      if (stageKey === 'challenge') return 'syncopation';
      if (stageKey === 'application') return globalMeasure % 2 ? 'emotionalCounter' : 'worshipOstinato';
      return 'rootChord';
    }
    if (pattern === 'applicationFinal') {
      if (stageKey === 'prep') return 'rootChord';
      if (stageKey === 'build') return 'melodyChords';
      if (stageKey === 'challenge') return globalMeasure % 2 ? 'syncopation' : 'ostinato';
      if (stageKey === 'application') return globalMeasure % 2 ? 'countermelody' : 'bassMelody';
      return 'rootChord';
    }
    if (pattern === 'technicalMixedBasic') {
      if (stageKey === 'prep') return 'rootChord';
      if (stageKey === 'build') return 'alternating';
      if (stageKey === 'challenge') return 'leftHold';
      if (stageKey === 'application') return 'ostinato';
      return 'rootChord';
    }
    if (pattern === 'technicalMixedIntermediate') {
      if (stageKey === 'prep') return 'offbeatChord';
      if (stageKey === 'build') return 'changingRoles';
      if (stageKey === 'challenge') return 'patternLongEvent';
      if (stageKey === 'application') return 'syncopation';
      return 'rootChord';
    }
    if (pattern === 'technicalMixedAdvanced') {
      if (stageKey === 'prep') return 'alternatingFinal';
      if (stageKey === 'build') return 'modernPattern';
      if (stageKey === 'challenge') return 'continuousDisplaced';
      if (stageKey === 'application') return 'simpleVoicesFinal';
      return 'rootChord';
    }
    if (pattern === 'technicalFinal') {
      if (stageKey === 'prep') return 'coordinationFinal';
      if (stageKey === 'build') return globalMeasure % 2 ? 'alternatingFinal' : 'fixedMovingFinal';
      if (stageKey === 'challenge') return globalMeasure % 2 ? 'continuousFinal' : 'displacedFinal';
      if (stageKey === 'application') return globalMeasure % 2 ? 'simpleVoicesFinal' : 'modernPattern';
      return 'rootChord';
    }
    return pattern;
  },

  _coordinationPatternLabel(pattern) {
    const labels = {
      rootChord: 'Fundamental + acorde',
      rootFifthChord: 'Fundamental + quinta',
      independentBass: 'Bajo independiente simple',
      octavesChord: 'Octavas + acordes',
      tenthsChord: 'Décimas + acordes',
      modernCoordination: 'Coordinación moderna',
      coordinationFinal: 'Dominio de bajo + acordes',
      alternating: 'Alternancia basica',
      reverseAlternating: 'Respuesta invertida',
      sharedPulse: 'Pulso compartido',
      chordTurns: 'Turnos por acorde',
      stableAlternating: 'Alternancia estable',
      offbeatAlternating: 'Contratiempo simple',
      oneTwo: 'Una entrada contra dos respuestas',
      alternatingBassFifth: 'Bajo alternado y respuesta',
      preparedRest: 'Entrada preparada',
      extendedTurns: 'Turnos extendidos',
      octaveAlternating: 'Octavas alternadas',
      fastAlternating: 'Alternancia rapida controlada',
      harmonicResponse: 'Respuesta armonica',
      modernAlternating: 'Alternancia con color',
      alternatingFinal: 'Dominio de manos alternadas',
      leftHold: 'LH fija, RH movil',
      rightHold: 'RH fija, LH movil',
      pedalBass: 'Pedal en LH',
      movingBassHold: 'Acorde sostenido, bajo movil',
      roleSwitch: 'Cambio de rol',
      pedalInversions: 'Pedal + inversiones',
      fixedFifth: 'Quinta fija',
      rightLong: 'RH en pulso largo',
      leftLong: 'LH en pulso largo',
      changingRoles: 'Roles cambiantes',
      octavePedal: 'Pedal en octavas',
      colorHold: 'Color sostenido',
      advancedRoleSwitch: 'Cambio de rol avanzado',
      modernHold: 'Mano fija moderna',
      fixedMovingFinal: 'Dominio mano fija + movil',
      melodyChords: 'Melodía + acordes',
      melodyScale: 'Melodía escalar',
      melodyFragments: 'Melodía + fragmentos de acorde',
      melodyFluid: 'Melodía fluida',
      melodyPentatonicMajor: 'Melodía pentatónica mayor',
      melodyPentatonicMinor: 'Melodía pentatónica menor',
      melodyVoicing: 'Melodía guiando voicings',
      melodyOctaves: 'Melodía + octavas',
      melodySevenths: 'Melodía + séptimas',
      melodyFinal: 'Dominio de melodía + acordes',
      bassMelody: 'Bajo + melodía',
      bassMelodySpace: 'Melodía con espacios',
      rootFifthMelody: 'Bajo fundamental + quinta',
      scalarMelody: 'Melodía escalar',
      pentatonicMelody: 'Melodía pentatónica',
      minorPentatonicMelody: 'Melodía pentatónica menor',
      octaveBassMelody: 'Bajo en octavas + melodía',
      extendedMelody: 'Melodía extendida',
      activeBassMelody: 'Bajo activo + melodía',
      instrumentalBassMelody: 'Bajo + melodía instrumental',
      bassMelodyFinal: 'Dominio de bajo + melodía',
      ostinato: 'Ostinato',
      ostinatoMelody: 'Ostinato + melodía',
      ostinatoFifth: 'Ostinato fundamental + quinta',
      worshipOstinato: 'Patrón worship',
      continuousOstinato: 'Ostinato continuo',
      octaveOstinato: 'Ostinato en octavas',
      instrumentalOstinato: 'Ostinato instrumental',
      mixedOstinato: 'Ostinatos combinados',
      ostinatoChange: 'Ostinato con cambio',
      patternLongEvent: 'Patron + evento largo',
      stableOstinato: 'Ostinato estable',
      patternInversions: 'Patron + inversion',
      patternWithSpaces: 'Patron con espacios',
      prolongedPattern: 'Patron prolongado',
      walkingBass: 'Bajo caminante simple',
      longCycle: 'Ciclo extendido',
      modernPattern: 'Patron moderno',
      widePattern: 'Patron en registro amplio',
      continuousFinal: 'Dominio de patron continuo',
      independentFinal: 'Dominio de bajo independiente',
      displacedEntry: 'Entrada desplazada',
      bassFirst: 'Bajo primero, melodía después',
      offbeatChord: 'Acorde desplazado',
      rhythmicAnswer: 'Respuesta rítmica',
      syncopation: 'Síncopa simple',
      melodyAgainstPulse: 'Melodía contra pulso',
      worshipDisplaced: 'Desplazamiento worship',
      mixedDisplaced: 'Desplazamientos combinados',
      continuousDisplaced: 'Desplazamiento continuo',
      neverTogether: 'Manos nunca coinciden',
      displacedFinal: 'Dominio de ritmos desplazados',
      callResponse: 'Pregunta y respuesta',
      spacesCounter: 'Contramelodía en espacios',
      contraryMotion: 'Movimiento contrario',
      countermelody: 'Contramelodía',
      continuousDialog: 'Diálogo continuo',
      scalarCounter: 'Contramelodía escalar',
      pentatonicCounter: 'Contramelodía pentatónica',
      bassCounter: 'Bajo + contramelodía',
      continuousCounter: 'Contramelodía continua',
      instrumentalCounter: 'Contramelodía instrumental',
      emotionalCounter: 'Contramelodía expresiva',
      twoVoices: 'Dos voces independientes',
      counterFinal: 'Dominio de contramelodías',
      twoNotes: 'Dos notas coordinadas',
      parallelMotion: 'Movimiento paralelo',
      technicalCallResponse: 'Pregunta y respuesta tecnica',
      simpleVoices: 'Dos voces simples',
      longShort: 'Linea larga vs linea corta',
      stepsVsLeaps: 'Escalones contra saltos',
      leapsVsSteps: 'Saltos contra escalones',
      staggeredVoices: 'Voces en espacios',
      coordinatedLines: 'Lineas coordinadas',
      continuousContrary: 'Movimiento contrario continuo',
      colorLines: 'Dos voces con color',
      fixedUpper: 'Voz superior fija',
      wideVoices: 'Dos voces en registro amplio',
      simpleVoicesFinal: 'Dominio de dos voces simples',
      applicationMixed: 'Combinación de recursos',
      applicationFinal: 'Proyecto final de coordinación',
      technicalMixedBasic: 'Coordinacion combinada basica',
      technicalMixedIntermediate: 'Coordinacion mixta intermedia',
      technicalMixedAdvanced: 'Coordinacion combinada avanzada',
      technicalFinal: 'Proyecto tecnico de coordinacion',
    };
    return labels[pattern] || 'Bajo + acordes';
  },

  _coordinationLeftRole(pattern, stableBass) {
    if (stableBass) return 'Base armónica estable';
    if (/leftHold|pedal|fixedFifth|octavePedal/i.test(pattern)) return 'Base sostenida';
    if (/alternating|sharedPulse|chordTurns|oneTwo|preparedRest/i.test(pattern)) return 'Entrada alternada';
    if (/Fifth|rootFifth|ostinato|Ostinato|worship|Worship|continuous|active/i.test(pattern)) return 'Fundamental + quinta';
    if (/octave|Octave|octaves|Octaves/i.test(pattern)) return 'Octavas';
    if (/tenth|Tenth|tenths|Tenths/i.test(pattern)) return 'Décimas';
    if (/counter|Counter|voice|Voice|call|spaces|contrary|Voices|Motion|Lines|longShort|stepsVsLeaps|leapsVsSteps/i.test(pattern)) return 'Linea simple o respuesta';
    if (/displaced|syncopation|offbeat|neverTogether|bassFirst/i.test(pattern)) return 'Pulso estable';
    return 'Fundamental';
  },

  _coordinationRightRole(techniqueKey, pattern) {
    if (techniqueKey === 'alternatingHands') return 'Respuesta alternada';
    if (techniqueKey === 'fixedMoving') return 'Mano movil o sostenida segun el rol';
    if (techniqueKey === 'continuousPattern') return 'Entrada simple sobre patron continuo';
    if (techniqueKey === 'simpleVoices') return 'Linea simple coordinada';
    if (techniqueKey === 'technicalApplication') return this._coordinationPatternLabel(pattern);
    if (techniqueKey === 'melodyChords') return 'Melodía superior con armonía debajo';
    if (techniqueKey === 'bassMelody') return 'Línea melódica clara';
    if (techniqueKey === 'independentBass') return 'Melodía o frase sobre bajo autónomo';
    if (techniqueKey === 'displacedRhythms') return 'Entrada desplazada o respuesta rítmica';
    if (techniqueKey === 'countermelodies') return 'Voz principal';
    if (techniqueKey === 'application') return this._coordinationPatternLabel(pattern);
    return 'Armonía completa';
  },

  // ════════════════════════════════════════════════════════════════
  //  VOICINGS
  // ════════════════════════════════════════════════════════════════

  _generateVoicings(config, mode, tech, style, diff) {
    const prog = (config.chords && config.chords.length) ? config.chords.slice() : ['C'];
    const total = Math.max(5, parseInt(config.bars, 10) || 8);
    const meta = config.meta || {};
    const pattern = meta.voicingPattern || 'nearestInversion';
    const texture = meta.voicingTexture || 'closed';
    const finalBpm = clamp(parseInt(config.bpm, 10) || Math.round(style.bpm * diff.bpmFactor), 40, 200);
    const plan = this._chordStagePlan(total, prog, false);

    let prevMean = null;
    const chooseVoicing = (label, stageKey, globalMeasure, segIndex) => {
      const parsed = this._parseChord(label) || this._parseChord('C');
      const useClosed = this._voicingUseClosed(pattern, texture, stageKey, globalMeasure, segIndex);
      const useOpen = this._voicingUseOpen(pattern, texture, stageKey);
      const useTop = this._voicingUseTop(pattern, texture);
      let rh;
      if (useClosed) {
        rh = this._chordVoicing(label, 0) || this._chordVoicing('C', 0);
      } else if (useTop) {
        rh = this._topVoiceVoicing(label, prevMean, pattern, globalMeasure + segIndex);
      } else if (useOpen) {
        rh = this._openVoicing(label, texture, prevMean, pattern);
      } else {
        rh = prevMean === null
          ? (this._chordVoicing(label, 0) || this._chordVoicing('C', 0))
          : this._closestChordVoicing(label, prevMean).v;
      }
      prevMean = this._voicingMean(rh);
      return { label, parsed, rh, root: 36 + parsed.rootPc, top: useTop };
    };

    const measures = [];
    const sectionMeta = [];
    let mi = 0;

    plan.forEach(stage => {
      const startBar = mi;
      for (let b = 0; b < stage.bars; b++) {
        const segments = stage.build(b, stage.bars);
        const built = this._voicingMeasure(segments, chooseVoicing, {
          pattern,
          texture,
          stageKey: stage.key,
          globalMeasure: mi,
        });
        measures.push({
          index: mi,
          sectionKey:   stage.key,
          sectionLabel: stage.label,
          chord: segments.map(s => s.label).join(' '),
          chordSegs: this._collapseSegs(segments),
          treble: built.treble,
          bass: built.bass,
        });
        mi++;
      }
      const note = (PracticeLibrary.sections.find(s => s.key === stage.key) || {}).note || '';
      sectionMeta.push({ key: stage.key, label: stage.label, startBar, endBar: mi - 1, note, simplified: (stage.key === 'prep' || stage.key === 'close') });
    });

    const exTitle = config.title ? `${config.n}. ${config.title}` : tech.label;

    return {
      title:    `${mode.label} · ${exTitle}`,
      subtitle: `${diff.label} · ${total} compases · ${finalBpm} BPM`,
      timeSig:  '4/4',
      measureBeats: 4,
      origBpm:  finalBpm,
      fifths:   0,
      measures,
      sections: sectionMeta,
      meta: {
        mode: mode.label, modeKey: config.mode,
        technique: tech.label, techniqueKey: config.technique,
        exercise: config.title || '', exerciseN: config.n || null,
        style: style.label, styleKey: config.style,
        pattern: meta.voicingResource || this._voicingPatternLabel(pattern),
        patternKey: pattern,
        difficulty: diff.label, diffKey: config.difficulty,
        tonic: diff.tonic, rel: diff.rel, sharps: 0,
        bpm: finalBpm, pending: false,
        explain: config.explain || '',
        voicingPattern: pattern,
        voicingTexture: texture,
        voicingResource: meta.voicingResource || this._voicingPatternLabel(pattern),
        voicingColor: meta.voicingColor || '',
      },
    };
  },

  _voicingMeasure(segments, chooseVoicing, opts) {
    const treble = [];
    const bass = [];
    segments.forEach((s, si) => {
      const compare = opts.texture === 'compare' || opts.texture === 'colorCompare' ||
        /compare|Compare|closedOpen|minimumCompare|twoRoutes|multipleSolutions|professionalCompare|shortestPath/.test(opts.pattern);
      if (compare) {
        const closed = this._basicVoicingForCompare(s.label, false);
        const improved = this._basicVoicingForCompare(s.label, true, opts.texture, opts.pattern);
        const half = s.dur / 2;
        closed.forEach(midi => treble.push({ midi, beat: s.beat, duration: half }));
        improved.forEach(midi => treble.push({ midi, beat: s.beat + half, duration: half }));
        const parsed = this._parseChord(s.label) || this._parseChord('C');
        bass.push({ midi: 36 + parsed.rootPc, beat: s.beat, duration: s.dur });
        return;
      }

      const v = chooseVoicing(s.label, opts.stageKey, opts.globalMeasure, si);
      if (!v || !v.rh) return;
      const supportDur = this._voicingSupportDuration(opts.texture, opts.stageKey, s.dur);
      const addTopLine = v.top || opts.texture === 'full' || opts.texture === 'modern';
      const support = addTopLine ? v.rh.slice(0, -1) : v.rh.slice();
      support.forEach(midi => treble.push({ midi, beat: s.beat, duration: supportDur }));
      if (addTopLine) {
        this._voicingTopLine(v, s.dur, opts.pattern, opts.stageKey, opts.globalMeasure + si).forEach(ev => {
          treble.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur });
        });
      } else if (supportDur < s.dur) {
        v.rh.forEach(midi => treble.push({ midi, beat: s.beat + supportDur, duration: s.dur - supportDur }));
      }
      this._voicingBass(v, s.dur, opts.texture, opts.pattern).forEach(ev => {
        bass.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur });
      });
    });
    return { treble, bass };
  },

  _voicingUseClosed(pattern, texture, stageKey, globalMeasure, segIndex) {
    if (texture === 'closed') return false;
    if (stageKey === 'prep' && /jump|closedOpen|discover|compare/i.test(pattern)) return (globalMeasure + segIndex) % 2 === 0;
    return false;
  },

  _voicingUseOpen(pattern, texture, stageKey) {
    if (['open', 'openBass', 'openTop', 'wide', 'modern', 'full'].includes(texture)) return true;
    if (/open|worship|modern|instrumental|cinematic|texture|color|Final|Project|profesional/i.test(pattern)) return true;
    return stageKey === 'application' && texture !== 'closed';
  },

  _voicingUseTop(pattern, texture) {
    return ['topVoice', 'openTop', 'full'].includes(texture) || /top|melody|Melod|voz|superior|pent|Guided|Voice/i.test(pattern);
  },

  _basicVoicingForCompare(label, improved, texture, pattern) {
    if (!improved) return this._chordVoicing(label, 0) || this._chordVoicing('C', 0);
    if (texture === 'colorCompare' || /color|discover|sus|add9|maj7|minor7/i.test(pattern || '')) {
      return this._openVoicing(label, 'modern', null, pattern);
    }
    return this._openVoicing(label, 'open', null, pattern);
  },

  _openVoicing(label, texture, prevMean, pattern) {
    const parsed = this._parseChord(label) || this._parseChord('C');
    const base = 60 + parsed.rootPc;
    const iv = parsed.iv || [0, 4, 7];
    const third = iv[1] == null ? 4 : iv[1];
    const fifth = iv.includes(7) ? 7 : (iv[2] || 7);
    const color = iv.length > 3 ? iv[3] : (/add9|modern|worship|texture|Final|Project/i.test(pattern || '') ? 14 : null);
    let notes;
    if (texture === 'wide' || texture === 'full') {
      notes = [base, base + fifth + 12, base + third + 12];
      if (color != null) notes.push(base + color);
    } else {
      notes = [base + third, base + fifth, base + 12];
      if (color != null) notes.push(base + color);
    }
    notes = [...new Set(notes)].map(n => {
      while (n < 55) n += 12;
      while (n > 88) n -= 12;
      return n;
    }).sort((a, b) => a - b);
    if (prevMean !== null && notes.length >= 3 && Math.abs(this._voicingMean(notes) - prevMean) > 10) {
      const closer = this._closestChordVoicing(label, prevMean).v;
      if (texture !== 'wide' && texture !== 'full') notes = closer;
    }
    return notes;
  },

  _topVoiceVoicing(label, prevMean, pattern, seed) {
    const parsed = this._parseChord(label) || this._parseChord('C');
    const baseVoicing = prevMean === null
      ? (this._chordVoicing(label, 0) || this._chordVoicing('C', 0))
      : this._closestChordVoicing(label, prevMean).v;
    const topInterval = this._voicingTopInterval(parsed, pattern, seed);
    let top = 60 + parsed.rootPc + topInterval;
    while (top < 72) top += 12;
    while (top > 88) top -= 12;
    const support = baseVoicing.filter(n => n < top - 1).slice(-3);
    const fallback = baseVoicing.slice(0, Math.max(2, baseVoicing.length - 1)).map(n => n > top ? n - 12 : n);
    return [...new Set((support.length ? support : fallback).concat(top))].sort((a, b) => a - b);
  },

  _voicingTopInterval(parsed, pattern, seed) {
    const iv = parsed.iv || [0, 4, 7];
    if (/add9|modern|worship|cinematic|texture/i.test(pattern || '')) return 14;
    if (/maj7|seventh|Sevenths/i.test(pattern || '') && iv.length > 3) return iv[3];
    if (/sus4/i.test(pattern || '')) return 5;
    if (/sus2/i.test(pattern || '')) return 2;
    if (/pentMinor|minor/i.test(pattern || '')) return [0, 3, 5, 7, 10][seed % 5];
    if (/pent|Top|top|melody|Melod/i.test(pattern || '')) return [0, 2, 4, 7, 9][seed % 5];
    return [0, iv[1] || 4, 7, 12][seed % 4];
  },

  _voicingTopLine(v, dur, pattern, stageKey, seed) {
    const sparse = stageKey === 'prep' || stageKey === 'close';
    const beats = sparse ? [0, 2] : (dur <= 2 ? [0, 1] : [0, 1, 2, 3]);
    return beats.filter(beat => beat < dur).map((beat, i, arr) => {
      const interval = this._voicingTopInterval(v.parsed, pattern, seed + i);
      let midi = 60 + v.parsed.rootPc + interval;
      while (midi < 72) midi += 12;
      while (midi > 88) midi -= 12;
      const last = i === arr.length - 1;
      return { midi, beat, dur: Math.min(last && dur - beat > 1 ? dur - beat : 1, dur - beat) };
    }).filter(ev => ev.dur > 0);
  },

  _voicingSupportDuration(texture, stageKey, dur) {
    if (dur <= 2) return dur;
    if (texture === 'full' && stageKey !== 'prep' && stageKey !== 'close') return 2;
    return dur;
  },

  _voicingBass(v, dur, texture, pattern) {
    const root = v.root;
    const events = [];
    const push = (midi, beat, d) => {
      if (beat < dur && d > 0) events.push({ midi, beat, dur: Math.min(d, dur - beat) });
    };
    if (texture === 'wide' || texture === 'full' || /cinematic|instrumental|wide/i.test(pattern || '')) {
      push(root, 0, dur >= 4 ? 2 : dur / 2);
      push(root + 7, dur >= 4 ? 2 : dur / 2, dur >= 4 ? dur - 2 : dur / 2);
      return events;
    }
    if (texture === 'modern' || texture === 'openBass' || texture === 'bassVoicing') {
      push(root, 0, dur >= 4 ? 2 : dur);
      if (dur >= 4) push(root + 12, 2, 2);
      return events;
    }
    push(root, 0, dur);
    return events;
  },

  _voicingPatternLabel(pattern) {
    const labels = {
      jumpCompare: 'Comparación de saltos',
      nearestInversion: 'Inversión cercana',
      sameZone: 'Una zona del teclado',
      minimumRoute: 'Movimiento mínimo',
      commonTones: 'Notas comunes',
      topNote: 'Nota superior',
      closedOpenCompare: 'Cerrado vs abierto',
      discoverAdd9: 'Add9',
      discoverSus2: 'Sus2',
      discoverSus4: 'Sus4',
      oneNoteMoves: 'Una nota se mueve',
      firstModern: 'Sonido moderno',
      voicingFinalProject: 'Proyecto final de voicings',
    };
    return labels[pattern] || pattern || 'Recurso de voicing';
  },

  // ════════════════════════════════════════════════════════════════
  //  MELODÍA Y ARREGLO
  // ════════════════════════════════════════════════════════════════

  _generateMelodyArrangement(config, mode, tech, style, diff) {
    const prog = (config.chords && config.chords.length) ? config.chords.slice() : ['C'];
    const total = Math.max(5, parseInt(config.bars, 10) || 8);
    const meta = config.meta || {};
    const useInv = !!meta.useInversions;
    const pattern = meta.arrangementPattern || 'simplePhrase';
    const accompaniment = meta.arrangementAccompaniment || 'bass';
    const finalBpm = clamp(parseInt(config.bpm, 10) || Math.round(style.bpm * diff.bpmFactor), 40, 200);
    const plan = this._chordStagePlan(total, prog, false);

    let prevMean = null;
    const chooseVoicing = (label) => {
      const p = this._parseChord(label);
      if (!p) return null;
      const rh = useInv && prevMean !== null
        ? this._closestChordVoicing(label, prevMean).v
        : this._chordVoicing(label, 0);
      prevMean = this._voicingMean(rh);
      return { rh, parsed: p, root: 36 + p.rootPc, label };
    };

    const measures = [];
    const sectionMeta = [];
    let mi = 0;

    plan.forEach(stage => {
      const startBar = mi;
      for (let b = 0; b < stage.bars; b++) {
        const segments = this._arrangementSegments(prog, stage, b, total);
        const built = this._arrangementMeasure(segments, chooseVoicing, {
          techniqueKey: config.technique,
          pattern,
          accompaniment,
          stageKey: stage.key,
          globalMeasure: mi,
          form: meta.arrangementForm || '',
        });
        measures.push({
          index: mi,
          sectionKey:   stage.key,
          sectionLabel: stage.label,
          chord: segments.map(s => s.label).join(' '),
          chordSegs: this._collapseSegs(segments),
          treble: built.treble,
          bass: built.bass,
        });
        mi++;
      }
      const note = (PracticeLibrary.sections.find(s => s.key === stage.key) || {}).note || '';
      sectionMeta.push({ key: stage.key, label: stage.label, startBar, endBar: mi - 1, note, simplified: (stage.key === 'prep' || stage.key === 'close') });
    });

    const exTitle = config.title ? `${config.n}. ${config.title}` : tech.label;

    return {
      title:    `${mode.label} · ${exTitle}`,
      subtitle: `${diff.label} · ${total} compases · ${finalBpm} BPM`,
      timeSig:  '4/4',
      measureBeats: 4,
      origBpm:  finalBpm,
      fifths:   0,
      measures,
      sections: sectionMeta,
      meta: {
        mode: mode.label, modeKey: config.mode,
        technique: tech.label, techniqueKey: config.technique,
        exercise: config.title || '', exerciseN: config.n || null,
        style: style.label, styleKey: config.style,
        pattern: meta.arrangementResource || this._arrangementPatternLabel(pattern),
        patternKey: pattern,
        difficulty: diff.label, diffKey: config.difficulty,
        tonic: diff.tonic, rel: diff.rel, sharps: 0,
        bpm: finalBpm, pending: false,
        explain: config.explain || '',
        arrangementPattern: pattern,
        arrangementAccompaniment: accompaniment,
        arrangementResource: meta.arrangementResource || this._arrangementPatternLabel(pattern),
        arrangementForm: meta.arrangementForm || '',
      },
    };
  },

  _arrangementSegments(prog, stage, barInStage) {
    if (stage.key === 'close') return [{ label: prog[0], beat: 0, dur: 4 }];
    if (stage.key === 'prep') {
      const label = prog[barInStage % Math.min(2, prog.length)];
      return [{ label, beat: 0, dur: 4 }];
    }
    if (stage.key === 'build') {
      const subset = prog.slice(0, Math.min(4, prog.length));
      const label = subset[barInStage % subset.length];
      return [{ label, beat: 0, dur: 4 }];
    }
    if (stage.key === 'challenge' && prog.length > stage.bars) {
      return [
        { label: prog[(barInStage * 2) % prog.length], beat: 0, dur: 2 },
        { label: prog[(barInStage * 2 + 1) % prog.length], beat: 2, dur: 2 },
      ];
    }
    if (stage.key === 'application') {
      const phrase = this._applicationPhrase(prog, stage.bars);
      const label = phrase[barInStage % phrase.length];
      return [{ label, beat: 0, dur: 4 }];
    }
    const label = prog[barInStage % prog.length];
    return [{ label, beat: 0, dur: 4 }];
  },

  _arrangementMeasure(segments, chooseVoicing, opts) {
    const treble = [];
    const bass = [];
    segments.forEach((s, si) => {
      const v = chooseVoicing(s.label);
      if (!v || !v.rh) return;
      const effective = this._effectiveArrangementAccompaniment(opts.accompaniment, opts.stageKey, opts.globalMeasure + si);
      const melody = this._arrangementMelody(v, s.dur, opts.pattern, opts.stageKey, opts.globalMeasure + si);
      const addVoicing = ['chordVoicing', 'openVoicing', 'bassChords', 'bassToVoicing', 'fullArrangement'].includes(effective);
      melody.forEach((ev, idx) => {
        if (addVoicing && idx === 0) {
          const support = this._arrangementSupportVoicing(v, ev.midi, effective);
          support.forEach(midi => treble.push({ midi, beat: s.beat + ev.beat, duration: Math.min(ev.dur, s.dur - ev.beat) }));
        }
        treble.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur, fingerRole: 'melody' });
      });
      this._arrangementBass(v, s.dur, effective).forEach(ev => {
        bass.push({ midi: ev.midi, beat: s.beat + ev.beat, duration: ev.dur });
      });
    });
    return { treble, bass };
  },

  _effectiveArrangementAccompaniment(accompaniment, stageKey, globalMeasure) {
    if (accompaniment === 'none') return stageKey === 'application' ? 'bassLong' : 'none';
    if (accompaniment === 'mixedBass') return ['bass', 'rootFifth', 'octaves', 'walking'][globalMeasure % 4];
    if (accompaniment === 'mixedPattern') return stageKey === 'challenge' ? 'alberti' : (stageKey === 'application' ? 'openArpeggio' : 'arpeggio');
    if (accompaniment === 'mixedTexture') return ['bass', 'arpeggio', 'chordVoicing', 'rootFifth'][globalMeasure % 4];
    if (accompaniment === 'bassToArpeggio') return stageKey === 'challenge' || stageKey === 'application' ? 'arpeggio' : 'bass';
    if (accompaniment === 'bassToVoicing') return stageKey === 'challenge' || stageKey === 'application' ? 'chordVoicing' : 'bass';
    if (accompaniment === 'layered') {
      if (stageKey === 'prep') return 'bass';
      if (stageKey === 'build') return 'rootFifth';
      if (stageKey === 'challenge') return 'arpeggio';
      return 'openVoicing';
    }
    if (accompaniment === 'fullArrangement') {
      if (stageKey === 'prep') return 'bass';
      if (stageKey === 'build') return 'chordVoicing';
      if (stageKey === 'challenge') return globalMeasure % 2 ? 'alberti' : 'worship';
      if (stageKey === 'application') return globalMeasure % 2 ? 'openVoicing' : 'wideArpeggio';
      return 'bassLong';
    }
    return accompaniment || 'bass';
  },

  _arrangementMelody(v, dur, pattern, stageKey, seed) {
    const sparse = stageKey === 'prep' || stageKey === 'close';
    const beats = sparse ? [0, 2] : (dur <= 2 ? [0, 1] : [0, 1, 2, 3]);
    const contour = this._arrangementContour(pattern, stageKey, seed);
    return beats.filter(b => b < dur).map((beat, i, arr) => {
      const isLast = i === arr.length - 1;
      const interval = this._arrangementMelodyInterval(v, pattern, contour[(seed + i) % contour.length], isLast, stageKey);
      return {
        midi: this._arrangementMelodyPitch(v, interval),
        beat,
        dur: Math.min(isLast && dur - beat > 1 ? dur - beat : 1, dur - beat),
      };
    }).filter(ev => ev.dur > 0);
  },

  _arrangementContour(pattern, stageKey) {
    if (/descending|Desc|answer|close/i.test(pattern) || stageKey === 'close') return [7, 5, 4, 2, 0, 2, 0, 0];
    if (/ascending|climax|growth|worship|instrumental/i.test(pattern)) return [0, 2, 4, 5, 7, 9, 7, 5];
    if (/leap|Jump/i.test(pattern)) return [0, 7, 5, 4, 2, 0, 4, 2];
    if (/question/i.test(pattern)) return [0, 2, 4, 5, 7, 5, 4, 5];
    if (/color|maj7|minor7|add9|sus|modern|Voicing|voicing/i.test(pattern)) return [2, 4, 7, 9, 11, 9, 7, 4];
    return [0, 2, 4, 5, 4, 2, 1, 0];
  },

  _arrangementMelodyInterval(v, pattern, contourValue, isLast, stageKey) {
    const iv = (v.parsed && v.parsed.iv) || [0, 4, 7];
    if (stageKey === 'close' || /answer|Final|final/i.test(pattern) && isLast) return 0;
    if (/targetThird|tercera/i.test(pattern) && isLast) return iv[1] || 4;
    if (/targetFifth|quinta/i.test(pattern) && isLast) return 7;
    if (/seventh|maj7|minor7|color|extended/i.test(pattern) && iv.length >= 4) return iv[3];
    if (/ninth|add9|modern/i.test(pattern)) return 14;
    if (/sus/i.test(pattern)) return iv.includes(5) ? 5 : 2;
    if (/tension|appoggiatura/i.test(pattern) && !isLast) return (iv[1] || 4) + 1;
    if (/question/i.test(pattern) && isLast) return 7;
    const diatonic = [0, 2, 4, 5, 7, 9, 11, 12, 14];
    const closest = diatonic.reduce((best, x) => Math.abs(x - contourValue) < Math.abs(best - contourValue) ? x : best, 0);
    return closest;
  },

  _arrangementMelodyPitch(v, interval) {
    let midi = 60 + v.parsed.rootPc + interval;
    while (midi < 72) midi += 12;
    while (midi > 88) midi -= 12;
    return midi;
  },

  _arrangementSupportVoicing(v, melodyMidi, kind) {
    const raw = v.rh.slice().filter(n => n < melodyMidi - 1);
    if (kind === 'openVoicing' || kind === 'fullArrangement') return raw.filter((_, i) => i !== 1).slice(-2);
    return raw.slice(-3);
  },

  _arrangementBass(v, dur, kind) {
    if (kind === 'none') return [];
    const p = v.parsed || { iv: [0, 4, 7] };
    const root = v.root;
    const third = p.iv[1] || 4;
    const fifth = 7;
    const tenth = 12 + third;
    const events = [];
    const push = (midi, beat, d) => {
      if (beat < dur && d > 0) events.push({ midi, beat, dur: Math.min(d, dur - beat) });
    };
    if (kind === 'bassLong' || kind === 'bass' || kind === 'chordVoicing' || kind === 'openVoicing') {
      push(root, 0, dur);
      return events;
    }
    if (kind === 'bassSparse') {
      push(root, 0, Math.min(2, dur));
      return events;
    }
    if (kind === 'rootFifth' || kind === 'alternatingBass' || kind === 'balladBass') {
      push(root, 0, dur >= 4 ? 2 : dur / 2);
      push(root + fifth, dur >= 4 ? 2 : dur / 2, dur >= 4 ? dur - 2 : dur / 2);
      return events;
    }
    if (kind === 'octaves' || kind === 'octaveFifth' || kind === 'wideBass' || kind === 'modernBass') {
      push(root, 0, dur >= 4 ? 2 : dur / 2);
      push(root + 12, dur >= 4 ? 2 : dur / 2, dur >= 4 ? dur - 2 : dur / 2);
      if (kind === 'modernBass' && dur >= 4) push(root + fifth, 1, 1);
      return events;
    }
    if (kind === 'walking') {
      const seq = [0, 2, 4, 5, 7, 5, 4, 2];
      for (let b = 0, i = 0; b < dur; b += 0.5, i++) push(root + seq[i % seq.length], b, 0.5);
      return events;
    }
    if (kind === 'arpeggio' || kind === 'arpeggioDown' || kind === 'openArpeggio' || kind === 'balladArpeggio' || kind === 'extendedArpeggio' || kind === 'wideArpeggio') {
      const seq = kind === 'arpeggioDown'
        ? [12, 7, third, 0]
        : (kind === 'openArpeggio' || kind === 'wideArpeggio' || kind === 'extendedArpeggio' ? [0, 7, tenth, 7] : [0, third, 7, third]);
      for (let b = 0, i = 0; b < dur; b += 0.5, i++) push(root + seq[i % seq.length], b, 0.5);
      return events;
    }
    if (kind === 'alberti') {
      const seq = [0, 7, third, 7];
      for (let b = 0, i = 0; b < dur; b += 0.5, i++) push(root + seq[i % seq.length], b, 0.5);
      return events;
    }
    if (kind === 'worship') {
      const seq = [0, 7, 12, 7];
      for (let b = 0, i = 0; b < dur; b += 0.5, i++) push(root + seq[i % seq.length], b, 0.5);
      return events;
    }
    if (kind === 'bassChords') {
      push(root, 0, dur);
      return events;
    }
    push(root, 0, dur);
    return events;
  },

  _arrangementPatternLabel(pattern) {
    const labels = {
      shortMotif: 'Motivo corto',
      repetition: 'Repeticion',
      question: 'Pregunta musical',
      answer: 'Respuesta musical',
      questionAnswer: 'Pregunta y respuesta',
      breathing: 'Espacios melodicos',
      variation: 'Variacion',
      ascending: 'Direccion ascendente',
      descending: 'Direccion descendente',
      climax: 'Punto alto',
      colorMelody: 'Color melodico',
      albertiSong: 'Melodia + Alberti',
      arrangementFinal: 'Proyecto final de arreglo',
    };
    return labels[pattern] || 'Melodia y arreglo';
  },

  _generateAccompaniment(config, mode, tech, style, diff) {
    const prog = (config.chords && config.chords.length) ? config.chords.slice() : ['C'];
    const total = Math.max(5, parseInt(config.bars, 10) || 8);
    const useInv = !!(config.meta && config.meta.useInversions);
    const holdChanges = !!(config.meta && config.meta.holdChanges);
    const groove = (config.meta && config.meta.groove) || 'block';
    const meter = (config.meta && config.meta.meter) || '4/4';
    const measureBeats = this._measureBeatsForMeter(meter);

    const finalBpm = clamp(parseInt(config.bpm, 10) || Math.round(style.bpm * diff.bpmFactor), 40, 200);
    const plan = this._chordStagePlan(total, prog, false);

    let prevMean = null;
    const chooseVoicing = (label) => {
      const p = this._parseChord(label);
      if (!p) return null;
      const root = 36 + p.rootPc;
      const rh = useInv && prevMean !== null
        ? this._closestChordVoicing(label, prevMean).v
        : this._chordVoicing(label, 0);
      prevMean = this._voicingMean(rh);
      return { rh, root };
    };

    const measures = [];
    const sectionMeta = [];
    let mi = 0;

    plan.forEach(stage => {
      const startBar = mi;
      for (let b = 0; b < stage.bars; b++) {
        const segments = this._accompanimentSegments(prog, stage, b, mi, measureBeats, holdChanges);
        const { treble, bass } = this._accompanimentMeasure(segments, chooseVoicing, {
          technique: config.technique,
          groove,
          stageKey: stage.key,
          measureBeats,
          useFifth: !!(config.meta && config.meta.useFifth),
        });
        measures.push({
          index: mi,
          sectionKey:   stage.key,
          sectionLabel: stage.label,
          chord: segments.map(s => s.label).join(' '),
          chordSegs: this._collapseSegs(segments),
          treble,
          bass,
        });
        mi++;
      }
      const note = (PracticeLibrary.sections.find(s => s.key === stage.key) || {}).note || '';
      sectionMeta.push({ key: stage.key, label: stage.label, startBar, endBar: mi - 1, note, simplified: (stage.key === 'prep' || stage.key === 'close') });
    });

    const exTitle = config.title ? `${config.n}. ${config.title}` : tech.label;

    return {
      title:    `${mode.label} · ${exTitle}`,
      subtitle: `${diff.label} · ${total} compases · ${finalBpm} BPM`,
      timeSig:  meter,
      measureBeats,
      origBpm:  finalBpm,
      fifths:   0,
      measures,
      sections: sectionMeta,
      meta: {
        mode: mode.label, modeKey: config.mode,
        technique: tech.label, techniqueKey: config.technique,
        exercise: config.title || '', exerciseN: config.n || null,
        style: style.label, styleKey: config.style,
        pattern: 'Bloque', patternKey: 'bloque',
        difficulty: diff.label, diffKey: config.difficulty,
        tonic: diff.tonic, rel: diff.rel, sharps: 0,
        bpm: finalBpm, pending: false,
        explain: config.explain || '',
        pedal: (config.meta && config.meta.pedal) || '',
        useCase: (config.meta && config.meta.useCase) || '',
      },
    };
  },

  _measureBeatsForMeter(meter) {
    if (meter === '3/4') return 3;
    if (meter === '6/8') return 3; // 6 corcheas = 3 negras en nuestro modelo temporal
    return 4;
  },

  _heldChordSegments(prog, measureIndex) {
    const label = prog[Math.floor(measureIndex / 2) % prog.length];
    return [{ label, beat: 0, dur: 4 }];
  },

  _accompanimentSegments(prog, stage, barInStage, globalMeasure, measureBeats, holdChanges) {
    if (stage.key === 'close') return [{ label: prog[0], beat: 0, dur: measureBeats }];
    if (holdChanges && stage.key !== 'challenge') {
      const label = prog[Math.floor(globalMeasure / 2) % prog.length];
      return [{ label, beat: 0, dur: measureBeats }];
    }
    if (stage.key === 'prep') {
      const label = prog[barInStage % Math.min(2, prog.length)];
      return [{ label, beat: 0, dur: measureBeats }];
    }
    if (stage.key === 'build') {
      const subset = prog.slice(0, Math.min(4, prog.length));
      return [{ label: subset[barInStage % subset.length], beat: 0, dur: measureBeats }];
    }
    if (stage.key === 'challenge' && prog.length > stage.bars) {
      const half = measureBeats / 2;
      return [
        { label: prog[(barInStage * 2) % prog.length], beat: 0, dur: half },
        { label: prog[(barInStage * 2 + 1) % prog.length], beat: half, dur: half },
      ];
    }
    if (stage.key === 'application') {
      const phrase = this._applicationPhrase(prog, stage.bars);
      return [{ label: phrase[barInStage % phrase.length], beat: 0, dur: measureBeats }];
    }
    return [{ label: prog[barInStage % prog.length], beat: 0, dur: measureBeats }];
  },

  _accompanimentMeasure(segments, chooseVoicing, opts) {
    const treble = [];
    const bass = [];
    segments.forEach(s => {
      const v = chooseVoicing(s.label);
      if (!v) return;
      const groove = this._grooveFor(opts, s);
      groove.bass.forEach(ev => {
        this._bassRecipe(ev.kind, v.root).forEach(midi => {
          bass.push({ midi, beat: s.beat + ev.beat, duration: ev.dur });
        });
      });
      groove.rh.forEach(ev => {
        v.rh.forEach(midi => treble.push({ midi, beat: s.beat + ev.beat, duration: ev.dur }));
      });
    });
    return { treble, bass };
  },

  _grooveFor(opts, segment) {
    const dur = segment.dur;
    const mb = opts.measureBeats;
    const g = opts.groove || 'block';
    const stage = opts.stageKey || '';
    const useFifth = !!opts.useFifth;

    const whole = () => ({
      bass: [{ kind: 'root', beat: 0, dur }],
      rh: [{ beat: 0, dur }],
    });
    const blockPulse = () => ({
      bass: [{ kind: 'root', beat: 0, dur }],
      rh: dur >= 4
        ? [{ beat: 0, dur: 2 }, { beat: 2, dur: dur - 2 }]
        : [{ beat: 0, dur }],
    });
    const waltz = () => ({
      bass: [
        { kind: 'root', beat: 0, dur: Math.min(1, dur) },
        ...(useFifth && dur >= 3 ? [{ kind: 'fifth', beat: 2, dur: 1 }] : []),
      ],
      rh: dur >= 3
        ? [{ beat: 1, dur: 1 }, { beat: 2, dur: 1 }]
        : [{ beat: dur / 2, dur: dur / 2 }],
    });
    const sixEight = () => ({
      bass: [
        { kind: 'root', beat: 0, dur: 0.5 },
        ...(useFifth || dur >= 3 ? [{ kind: 'fifth', beat: 1.5, dur: 0.5 }] : []),
      ].filter(ev => ev.beat < dur),
      rh: [0.5, 1, 2, 2.5].filter(b => b < dur).map(b => ({ beat: b, dur: Math.min(0.5, dur - b) })),
    });
    const softPulse = () => ({
      bass: [{ kind: 'root', beat: 0, dur }],
      rh: dur >= 4
        ? [{ beat: 0, dur: 1.5 }, { beat: 2, dur: 2 }]
        : [{ beat: 0, dur }],
    });
    const popPulse = () => ({
      bass: [{ kind: 'root', beat: 0, dur }],
      rh: [0, 1.5, 2.5].filter(b => b < dur).map(b => ({ beat: b, dur: Math.min(1, dur - b) })),
    });
    const dynamic = () => stage === 'challenge' || stage === 'application' ? popPulse() : softPulse();
    const octaves = () => ({
      bass: dur >= 4
        ? [{ kind: 'octave', beat: 0, dur: 2 }, { kind: 'octave', beat: 2, dur: 2 }]
        : [{ kind: 'octave', beat: 0, dur }],
      rh: [{ beat: 0, dur }],
    });
    const fifths = () => ({
      bass: dur >= 4
        ? [{ kind: 'root', beat: 0, dur: 2 }, { kind: 'fifth', beat: 2, dur: 2 }]
        : [{ kind: 'root', beat: 0, dur }],
      rh: dur >= 4 ? [{ beat: 0, dur: 2 }, { beat: 2, dur: 2 }] : [{ beat: 0, dur }],
    });
    const alternatingBass = () => ({
      bass: [0, 1, 2, 3].filter(b => b < dur).map((b, i) => ({
        kind: i % 2 === 0 ? (i === 2 ? 'rootHigh' : 'root') : 'fifth',
        beat: b,
        dur: Math.min(1, dur - b),
      })),
      rh: dur >= 4 ? [{ beat: 0, dur: 2 }, { beat: 2, dur: 2 }] : [{ beat: 0, dur }],
    });
    const mixedLeft = () => {
      if (stage === 'challenge') return alternatingBass();
      if (stage === 'application') return fifths();
      return octaves();
    };
    const mixedTernary = () => (mb === 3 && (stage === 'challenge' || g === 'sixEight')) ? sixEight() : waltz();
    const mixedBallad = () => (stage === 'prep' || stage === 'close') ? whole() : dynamic();
    const moduleFinal = () => {
      if (stage === 'challenge') return alternatingBass();
      if (stage === 'application') return mixedBallad();
      return blockPulse();
    };

    if (g === 'waltz') return waltz();
    if (g === 'sixEight') return sixEight();
    if (g === 'mixedTernary') return mixedTernary();
    if (g === 'space' || g === 'sustain' || g === 'pad' || g === 'cinematic') return whole();
    if (g === 'softPulse') return softPulse();
    if (g === 'popPulse' || g === 'gentleVariation') return popPulse();
    if (g === 'dynamic') return dynamic();
    if (g === 'mixedBallad') return mixedBallad();
    if (g === 'octaves') return octaves();
    if (g === 'fifths') return fifths();
    if (g === 'alternatingBass') return alternatingBass();
    if (g === 'mixedLeft') return mixedLeft();
    if (g === 'moduleFinal') return moduleFinal();
    if (g === 'blockPulse') return blockPulse();
    return blockPulse();
  },

  _bassRecipe(kind, root) {
    if (kind === 'fifth') return [root + 7];
    if (kind === 'rootHigh') return [root + 12];
    if (kind === 'octave') return [root, root + 12];
    return [root];
  },

  // ── Progresión por estilo, derivada de la tonalidad del nivel ──────
  //
  // Acordes diatónicos por tonalidad (Opción C). domMin = dominante frigia
  // del relativo menor (la tensión hacia la tónica menor: E→Am, B→Em, F#→Bm).
  _keyChords: {
    basic:        { I: 'C', IV: 'F', V: 'G', vi: 'Am', ii: 'Dm', domMin: 'E'  },
    intermediate: { I: 'G', IV: 'C', V: 'D', vi: 'Em', ii: 'Am', domMin: 'B'  },
    advanced:     { I: 'D', IV: 'G', V: 'A', vi: 'Bm', ii: 'Em', domMin: 'F#' },
  },

  // Plantillas por estilo (grados → acordes de la tonalidad activa):
  //   worship : I–V–vi–IV   (clásico de adoración)
  //   pop     : vi–IV–I–V   (gancho pop)
  //   hebrew  : vi–V–IV–domMin  (cadencia andaluza / sabor frigio en relativo menor)
  _progressionFor(styleKey, diffKey) {
    const k = this._keyChords[diffKey] || this._keyChords.basic;
    const templates = {
      worship: [k.I,  k.V,  k.vi, k.IV],
      pop:     [k.vi, k.IV, k.I,  k.V ],
      hebrew:  [k.vi, k.V,  k.IV, k.domMin],
    };
    return templates[styleKey] || templates.worship;
  },

  // ── Plan de acordes por sección ────────────────────────────────
  //
  // - prep      : primeros 2 acordes alternados cada 2 compases
  // - build     : ciclar progresión, 1 acorde / compás
  // - challenge : ciclar progresión, 1 acorde / compás
  // - apply     : ciclar progresión, 1 acorde / compás
  // - close     : penúltimo acorde + tónica (cadencia)
  _chordsForSection(sectionKey, prog, bars) {
    const out = [];
    if (sectionKey === 'prep') {
      const a = prog[0];
      const b = prog[1] || prog[0];
      for (let i = 0; i < bars; i++) out.push(i < Math.ceil(bars / 2) ? a : b);
      return out;
    }
    if (sectionKey === 'close') {
      // Cadencia simple: V → I si la progresión lo permite.
      // Usamos el penúltimo acorde y luego tónica.
      const tonic = prog[0];
      const pen   = prog[prog.length - 1] || prog[0];
      if (bars === 1) return [tonic];
      return [pen, ...Array(bars - 1).fill(tonic)];
    }
    // build / challenge / application: cycle
    for (let i = 0; i < bars; i++) out.push(prog[i % prog.length]);
    return out;
  },

  // ════════════════════════════════════════════════════════════════
  //  MODO MELÓDICO — escalas, modos, color y técnica
  // ════════════════════════════════════════════════════════════════
  //
  // No usa acordes×patrón. Genera figuras a partir de la tónica del nivel
  // (Opción C). Mantiene el mismo esqueleto de 5 secciones para que el
  // player, la notación y el progreso funcionen igual.

  // Intervalos (semitonos desde la raíz) de cada escala.
  _scaleIntervals: {
    ionian:   [0, 2, 4, 5, 7, 9, 11],
    majpenta: [0, 2, 4, 7, 9],
    minpenta: [0, 3, 5, 7, 10],
    blues:    [0, 3, 5, 6, 7, 10],
    aeolian:  [0, 2, 3, 5, 7, 8, 10],
  },

  // Tónica MIDI (mayor) por letra del nivel.
  _tonicMidiFor(letter) {
    const map = { C: 60, G: 67, D: 62 };
    return map[letter] != null ? map[letter] : 60;
  },

  // Raíz MIDI del relativo menor por etiqueta del nivel.
  _relMidiFor(rel) {
    const map = { Am: 57, Em: 64, Bm: 59 };
    return map[rel] != null ? map[rel] : 57;
  },

  _scaleRootMidi(root) {
    const map = { C: 60, D: 62, E: 64, F: 65, G: 67, A: 57, B: 59 };
    return map[root] != null ? map[root] : 60;
  },

  // Nota MIDI para un grado (puede ser >= longitud → sube de octava).
  _scaleNote(root, intervals, degree) {
    const n   = intervals.length;
    const oct = Math.floor(degree / n);
    const idx = ((degree % n) + n) % n;
    return root + 12 * oct + intervals[idx];
  },

  _generateMelodic(config, mode, tech, style, diff) {
    if (config.technique === 'fundamentals') {
      return this._generateScaleFundamentals(config, mode, tech, style, diff);
    }

    if (config.mode === 'melodic') {
      return this._generateMelodicCurriculum(config, mode, tech, style, diff);
    }

    const baseBpm  = Math.round(style.bpm * diff.bpmFactor);
    const finalBpm = clamp(parseInt(config.bpm, 10) || baseBpm, 40, 200);

    const tonicMidi = this._tonicMidiFor(diff.tonic);
    const relMidi   = this._relMidiFor(diff.rel);
    const sections  = PracticeLibrary.sections;
    const measures  = [];
    const sectionMeta = [];
    let mi = 0;

    sections.forEach(section => {
      const startBar = mi;
      for (let b = 0; b < section.bars; b++) {
        const built = this._melodicMeasure(
          config, section.key, b, mi, tonicMidi, relMidi
        );
        measures.push({
          index: mi,
          sectionKey:   section.key,
          sectionLabel: section.label,
          chord: built.label,
          treble: built.treble,
          bass:   built.bass,
        });
        mi++;
      }
      sectionMeta.push({
        key: section.key, label: section.label,
        startBar, endBar: mi - 1,
        note: section.note, simplified: !!section.simplified,
      });
    });

    const keyLabel = `${diff.tonic} ${diff.mode === 'major' ? 'mayor' : 'menor'} / ${diff.rel}`;

    return {
      title:    `${mode.label} · ${tech.label}`,
      subtitle: `${style.label} · ${keyLabel} · ${finalBpm} BPM`,
      timeSig:  '4/4',
      origBpm:  finalBpm,
      fifths:   diff.sharps || 0,
      measures,
      sections: sectionMeta,
      meta: {
        mode: mode.label, modeKey: config.mode,
        technique: tech.label, techniqueKey: config.technique,
        style: style.label, styleKey: config.style,
        pattern: tech.label, patternKey: 'melodic',
        difficulty: diff.label, diffKey: config.difficulty,
        tonic: diff.tonic, rel: diff.rel, sharps: diff.sharps || 0,
        bpm: finalBpm, pending: false,
      },
    };
  },

  _generateMelodicCurriculum(config, mode, tech, style, diff) {
    const total = Math.max(5, parseInt(config.bars, 10) || 8);
    const finalBpm = clamp(parseInt(config.bpm, 10) || Math.round(style.bpm * diff.bpmFactor), 40, 200);
    const bars = this._sectionBarsFor(total);
    const stages = [
      { key: 'prep',        label: 'Preparación',  bars: bars.prep },
      { key: 'build',       label: 'Construcción', bars: bars.build },
      { key: 'challenge',   label: 'Desafío',      bars: bars.chal },
      { key: 'application', label: 'Aplicación',   bars: bars.app },
      { key: 'close',       label: 'Cierre',       bars: bars.close },
    ];

    const measures = [];
    const sectionMeta = [];
    let mi = 0;

    stages.forEach(stage => {
      const startBar = mi;
      for (let b = 0; b < stage.bars; b++) {
        const built = this._melodicCurriculumMeasure(config, stage.key, b, mi);
        measures.push({
          index: mi,
          sectionKey:   stage.key,
          sectionLabel: stage.label,
          chord: built.label,
          chordSegs: [{ label: built.label, beat: 0, dur: 4 }],
          treble: built.treble,
          bass: built.bass,
        });
        mi++;
      }
      const note = (PracticeLibrary.sections.find(s => s.key === stage.key) || {}).note || '';
      sectionMeta.push({ key: stage.key, label: stage.label, startBar, endBar: mi - 1, note, simplified: (stage.key === 'prep' || stage.key === 'close') });
    });

    const exTitle = config.title ? `${config.n}. ${config.title}` : tech.label;
    const scaleNames = this._scaleNamesForExercise(config);
    const fifths = (config.meta && config.meta.sharps != null) ? config.meta.sharps : (diff.sharps || 0);

    return {
      title:    `${mode.label} · ${exTitle}`,
      subtitle: `${diff.label} · ${total} compases · ${finalBpm} BPM`,
      timeSig:  '4/4',
      measureBeats: 4,
      origBpm:  finalBpm,
      fifths,
      measures,
      sections: sectionMeta,
      meta: {
        mode: mode.label, modeKey: config.mode,
        technique: tech.label, techniqueKey: config.technique,
        exercise: config.title || '', exerciseN: config.n || null,
        style: style.label, styleKey: config.style,
        pattern: this._melodicPatternLabel(config), patternKey: config.pattern || 'melodic',
        difficulty: diff.label, diffKey: config.difficulty,
        tonic: diff.tonic, rel: diff.rel, sharps: fifths,
        bpm: finalBpm, pending: false,
        explain: config.explain || '',
        scaleNames,
        scaleKind: (config.meta && config.meta.scaleKind) || '',
        scaleRoot: (config.meta && config.meta.scaleRoot) || '',
        hands: (config.meta && config.meta.hands) || '',
        melodicResource: (config.meta && (config.meta.melodicResource || config.meta.appliedResource)) || '',
      },
    };
  },

  _melodicCurriculumMeasure(config, sectionKey, barInSection, globalIdx) {
    const spec = this._scaleSpecForExercise(config, sectionKey, barInSection, globalIdx);
    const root = this._scaleRootMidi(spec.root);
    const intervals = this._scaleIntervalsForKind(spec.kind);
    const scaleLabel = this._scaleLabel(spec.root, spec.kind);
    const phrase = this._melodicPhraseKind(config, sectionKey, barInSection, globalIdx, spec.kind);
    const treble = this._scalePhrase(root, intervals, phrase);
    const chordLabel = this._melodicChordFor(config, sectionKey, globalIdx);
    const bass = (config.meta && config.meta.melodicLH) ? this._melodicBass(chordLabel, config.technique, sectionKey) : [];
    const label = chordLabel ? `${chordLabel} / ${scaleLabel}` : scaleLabel;
    return { label, treble, bass };
  },

  _melodicPatternLabel(config) {
    const meta = config.meta || {};
    return meta.appliedResource || meta.melodicResource || meta.scalePattern || meta.scalePhrase || 'Recurso melódico';
  },

  _melodicChordFor(config, sectionKey, globalIdx) {
    const prog = (config.chords && config.chords.length) ? config.chords : [];
    if (!prog.length) return '';
    if (sectionKey === 'close') return prog[0];
    if (config.meta && config.meta.holdChanges) return prog[Math.floor(globalIdx / 2) % prog.length];
    return prog[globalIdx % prog.length];
  },

  _melodicBass(chordLabel, techniqueKey, sectionKey) {
    if (!chordLabel) return [];
    const p = this._parseChord(chordLabel);
    if (!p) return [];
    const root = 36 + p.rootPc;
    if (techniqueKey === 'phrases' && sectionKey === 'prep') {
      return [{ midi: root, beat: 0, duration: 4 }];
    }
    if (techniqueKey === 'applied' || techniqueKey === 'application' || sectionKey === 'challenge' || sectionKey === 'application') {
      return [
        { midi: root, beat: 0, duration: 2 },
        { midi: root + 7, beat: 2, duration: 2 },
      ];
    }
    return [{ midi: root, beat: 0, duration: 4 }];
  },

  _melodicPhraseKind(config, sectionKey, barInSection, globalIdx, scaleKind) {
    const meta = config.meta || {};
    if (sectionKey === 'close') return scaleKind === 'minor' || scaleKind === 'minorPentatonic' ? 'minorClose' : 'majorClose';
    if (sectionKey === 'prep') return 'simple';

    if (config.technique === 'phrases') {
      const k = meta.scalePhrase || 'simple';
      if (k === 'questionAnswer') return barInSection % 2 === 0 ? 'question' : 'answer';
      if (k === 'miniMelody') return barInSection % 2 === 0 ? 'phraseA' : 'phraseB';
      if (k === 'finalPhrases') return ['question', 'answer', 'pentatonicOpen', 'minorPhrase'][globalIdx % 4];
      return k;
    }

    if (config.technique === 'patterns') {
      return this._effectiveScalePattern(meta.scalePattern || 'groups3', sectionKey, globalIdx);
    }

    const resource = meta.appliedResource || meta.melodicResource || '';
    if (/Nota|paso/i.test(resource)) return 'passing';
    if (/Rellen/i.test(resource)) return 'fill';
    if (/Adorno/i.test(resource)) return 'ornament';
    if (/Pregunta/i.test(resource)) return barInSection % 2 === 0 ? 'question' : 'answer';
    if (/Secuencia/i.test(resource)) return sectionKey === 'challenge' ? 'sequenceDown' : 'sequenceUp';
    if (/Pentat/i.test(resource)) return scaleKind === 'minorPentatonic' ? 'pentatonicMinor' : 'pentatonicOpen';
    if (/Patr/i.test(resource)) return sectionKey === 'challenge' ? 'controlledLeaps' : 'groups3';
    if (/Conex/i.test(resource)) return 'connection';
    if (/Frase/i.test(resource)) return barInSection % 2 === 0 ? 'phraseA' : 'phraseB';
    return sectionKey === 'application' ? 'phraseA' : 'connection';
  },

  _effectiveScalePattern(patternKey, sectionKey, globalIdx) {
    const mixedBasic = () => (sectionKey === 'challenge' || sectionKey === 'application') ? 'thirds' : 'groups3';
    const mixedIntermediate = () => (sectionKey === 'challenge') ? 'controlledLeaps' : (sectionKey === 'application' ? 'sequenceUp' : 'sequenceDown');
    const mixedAll = () => ['groups3', 'thirds', 'sequenceUp', 'pentatonicPattern'][globalIdx % 4];
    const final = () => ['groups3', 'controlledLeaps', 'sequenceDown', 'melodicPattern', 'pentatonicPattern'][globalIdx % 5];
    if (patternKey === 'mixedBasicPatterns') return mixedBasic();
    if (patternKey === 'mixedIntermediatePatterns') return mixedIntermediate();
    if (patternKey === 'mixedAllPatterns') return mixedAll();
    if (patternKey === 'patternsFinal') return final();
    return patternKey;
  },

  _generateScaleFundamentals(config, mode, tech, style, diff) {
    const total = Math.max(5, parseInt(config.bars, 10) || 8);
    const finalBpm = clamp(parseInt(config.bpm, 10) || Math.round(style.bpm * diff.bpmFactor), 40, 200);
    const bars = this._sectionBarsFor(total);
    const stages = [
      { key: 'prep',        label: 'Preparación',  bars: bars.prep },
      { key: 'build',       label: 'Construcción', bars: bars.build },
      { key: 'challenge',   label: 'Desafío',      bars: bars.chal },
      { key: 'application', label: 'Aplicación',   bars: bars.app },
      { key: 'close',       label: 'Cierre',       bars: bars.close },
    ];

    const measures = [];
    const sectionMeta = [];
    let mi = 0;

    stages.forEach(stage => {
      const startBar = mi;
      for (let b = 0; b < stage.bars; b++) {
        const built = this._scaleFundamentalMeasure(config, stage.key, b, mi);
        const seg = { label: built.label, beat: 0, dur: 4 };
        measures.push({
          index: mi,
          sectionKey:   stage.key,
          sectionLabel: stage.label,
          chord: built.label,
          chordSegs: [seg],
          treble: built.treble,
          bass: built.bass,
        });
        mi++;
      }
      const note = (PracticeLibrary.sections.find(s => s.key === stage.key) || {}).note || '';
      sectionMeta.push({ key: stage.key, label: stage.label, startBar, endBar: mi - 1, note, simplified: (stage.key === 'prep' || stage.key === 'close') });
    });

    const exTitle = config.title ? `${config.n}. ${config.title}` : tech.label;
    const scaleNames = this._scaleNamesForExercise(config);
    const fifths = (config.meta && config.meta.sharps != null) ? config.meta.sharps : (diff.sharps || 0);

    return {
      title:    `${mode.label} · ${exTitle}`,
      subtitle: `${diff.label} · ${total} compases · ${finalBpm} BPM`,
      timeSig:  '4/4',
      measureBeats: 4,
      origBpm:  finalBpm,
      fifths,
      measures,
      sections: sectionMeta,
      meta: {
        mode: mode.label, modeKey: config.mode,
        technique: tech.label, techniqueKey: config.technique,
        exercise: config.title || '', exerciseN: config.n || null,
        style: style.label, styleKey: config.style,
        pattern: 'Escala fundamental', patternKey: 'escala_fundamental',
        difficulty: diff.label, diffKey: config.difficulty,
        tonic: diff.tonic, rel: diff.rel, sharps: fifths,
        bpm: finalBpm, pending: false,
        explain: config.explain || '',
        scaleNames,
        scaleKind: (config.meta && config.meta.scaleKind) || '',
        scaleRoot: (config.meta && config.meta.scaleRoot) || '',
        compareRoot: (config.meta && config.meta.compareRoot) || '',
        rhythmic: !!(config.meta && config.meta.rhythmic),
        hands: (config.meta && config.meta.hands) || '',
      },
    };
  },

  _scaleFundamentalMeasure(config, sectionKey, barInSection, globalIdx) {
    const spec = this._scaleSpecForExercise(config, sectionKey, barInSection, globalIdx);
    const root = this._scaleRootMidi(spec.root);
    const intervals = this._scaleIntervalsForKind(spec.kind);
    const label = this._scaleLabel(spec.root, spec.kind);
    const phrase = this._scalePhraseKind(config, sectionKey, barInSection, spec.kind);
    const treble = this._scalePhrase(root, intervals, phrase);
    return { label, treble, bass: [] };
  },

  _scaleSpecForExercise(config, sectionKey, barInSection, globalIdx) {
    const meta = config.meta || {};
    const kind = meta.scaleKind || 'major';
    const root = meta.scaleRoot || 'C';
    const compareRoot = meta.compareRoot || 'A';

    if (kind === 'compareMajorMinor' || kind === 'majorMinorPiece') {
      const useMinor = sectionKey === 'challenge' || (sectionKey === 'application' && barInSection % 2 === 1);
      return useMinor ? { root: compareRoot, kind: 'minor' } : { root, kind: 'major' };
    }

    if (kind === 'compareScalePentatonic') {
      const usePenta = sectionKey === 'challenge' || (sectionKey === 'application' && barInSection % 2 === 1);
      return usePenta ? { root, kind: 'majorPentatonic' } : { root, kind: 'major' };
    }

    if (kind === 'fundamentalsFinal') {
      const palette = [
        { root: 'C', kind: 'major' },
        { root: 'A', kind: 'minor' },
        { root: 'G', kind: 'majorPentatonic' },
        { root: 'E', kind: 'minorPentatonic' },
        { root: 'D', kind: 'major' },
        { root: 'B', kind: 'minor' },
      ];
      if (sectionKey === 'close') return palette[0];
      return palette[globalIdx % palette.length];
    }

    if (kind === 'melodicPhrasesFinal' || kind === 'patternsFinal' || kind === 'appliedFinal' || kind === 'applicationFinal') {
      const palette = [
        { root: 'C', kind: 'major' },
        { root: 'A', kind: 'minor' },
        { root: 'G', kind: 'majorPentatonic' },
        { root: 'E', kind: 'minorPentatonic' },
        { root: 'D', kind: 'major' },
        { root: 'B', kind: 'minor' },
      ];
      if (sectionKey === 'close') return palette[0];
      return palette[globalIdx % palette.length];
    }

    if (kind === 'applicationPentatonicMix') {
      return globalIdx % 2 === 0
        ? { root: 'G', kind: 'majorPentatonic' }
        : { root: 'E', kind: 'minorPentatonic' };
    }

    if (kind === 'applicationMajorPenta') {
      return (sectionKey === 'challenge' || globalIdx % 3 === 0)
        ? { root: 'G', kind: 'majorPentatonic' }
        : { root: 'D', kind: 'major' };
    }

    if (kind === 'applicationMajorMinor') {
      return globalIdx % 2 === 0
        ? { root: 'D', kind: 'major' }
        : { root: 'B', kind: 'minor' };
    }

    return { root, kind };
  },

  _scalePhraseKind(config, sectionKey, barInSection, scaleKind) {
    const rhythmic = !!(config.meta && config.meta.rhythmic);
    if (sectionKey === 'prep') return 'fragment';
    if (sectionKey === 'build') return barInSection % 2 === 0 ? 'asc' : 'desc';
    if (sectionKey === 'challenge') {
      if (rhythmic) return 'rhythm';
      return barInSection % 2 === 0 ? 'asc' : 'turn';
    }
    if (sectionKey === 'application') return barInSection % 2 === 0 ? 'phraseA' : 'phraseB';
    return scaleKind === 'minor' || scaleKind === 'minorPentatonic' ? 'minorClose' : 'majorClose';
  },

  _scaleIntervalsForKind(kind) {
    if (kind === 'minor') return this._scaleIntervals.aeolian;
    if (kind === 'majorPentatonic') return this._scaleIntervals.majpenta;
    if (kind === 'minorPentatonic') return this._scaleIntervals.minpenta;
    return this._scaleIntervals.ionian;
  },

  _scaleLabel(root, kind) {
    if (kind === 'minor') return `${root} Menor natural`;
    if (kind === 'majorPentatonic') return `${root} Pentatónica mayor`;
    if (kind === 'minorPentatonic') return `${root} Pentatónica menor`;
    return `${root} Mayor`;
  },

  _scaleNamesForExercise(config) {
    const meta = config.meta || {};
    const root = meta.scaleRoot || 'C';
    const compareRoot = meta.compareRoot || 'A';
    const kind = meta.scaleKind || 'major';
    if (kind === 'compareMajorMinor' || kind === 'majorMinorPiece') {
      return [this._scaleLabel(root, 'major'), this._scaleLabel(compareRoot, 'minor')];
    }
    if (kind === 'compareScalePentatonic') {
      return [this._scaleLabel(root, 'major'), this._scaleLabel(root, 'majorPentatonic')];
    }
    if (kind === 'fundamentalsFinal') {
      return ['C Mayor', 'A Menor natural', 'G Pentatónica mayor', 'E Pentatónica menor', 'D Mayor', 'B Menor natural'];
    }
    if (kind === 'melodicPhrasesFinal' || kind === 'patternsFinal' || kind === 'appliedFinal' || kind === 'applicationFinal') {
      return ['C Mayor', 'A Menor natural', 'G Pentatónica mayor', 'E Pentatónica menor', 'D Mayor', 'B Menor natural'];
    }
    if (kind === 'applicationPentatonicMix') {
      return ['G Pentatónica mayor', 'E Pentatónica menor'];
    }
    if (kind === 'applicationMajorPenta') {
      return ['D Mayor', 'G Pentatónica mayor'];
    }
    if (kind === 'applicationMajorMinor') {
      return ['D Mayor', 'B Menor natural'];
    }
    return [this._scaleLabel(root, kind)];
  },

  _scalePhrase(rootMidi, intervals, phraseKind) {
    const isPentatonic = intervals.length === 5;
    const degreeSets = {
      fragment: isPentatonic ? [0, 1, 2, 3] : [0, 1, 2, 3],
      asc:      isPentatonic ? [0, 1, 2, 3, 4, 5, 4, 3] : [0, 1, 2, 3, 4, 5, 6, 7],
      desc:     isPentatonic ? [5, 4, 3, 2, 1, 0, 1, 2] : [7, 6, 5, 4, 3, 2, 1, 0],
      turn:     isPentatonic ? [0, 1, 2, 4, 3, 2, 1, 0] : [0, 1, 2, 4, 3, 2, 1, 0],
      phraseA:  isPentatonic ? [0, 2, 3, 4, 3, 2, 1, 0] : [0, 2, 4, 5, 4, 2, 1, 0],
      phraseB:  isPentatonic ? [4, 3, 2, 1, 0, 1, 2, 0] : [4, 3, 2, 1, 0, 1, 2, 0],
      simple: [0, 1, 2, 4, 2, 1, 0, 0],
      ascendingPhrase: [0, 1, 2, 3, 4, 2, 3, 4],
      descendingPhrase: [5, 4, 3, 2, 1, 3, 2, 0],
      minorPhrase: [0, 2, 3, 4, 3, 2, 1, 0],
      question: [0, 1, 2, 4, 4, 3, 2, 4],
      answer: [4, 3, 2, 1, 2, 1, 0, 0],
      harmonyPhrase: [0, 2, 4, 5, 4, 2, 1, 0],
      variedRhythm: [0, 1, 2, 4, 3, 2],
      pentatonicOpen: [0, 2, 3, 4, 3, 2, 1, 0],
      pentatonicMinor: [0, 1, 3, 4, 3, 2, 1, 0],
      extendedMelody: [0, 2, 4, 5, 6, 5, 4, 2],
      finalPhrases: [0, 2, 4, 5, 4, 2, 1, 0],
      groups3: [0, 1, 2, 1, 2, 3, 2, 3],
      groups3Down: [5, 4, 3, 4, 3, 2, 3, 2],
      thirds: [0, 2, 1, 3, 2, 4, 3, 5],
      thirdsDown: [5, 3, 4, 2, 3, 1, 2, 0],
      controlledLeaps: [0, 2, 1, 3, 2, 4, 3, 5],
      sequenceUp: [0, 1, 2, 1, 2, 3, 2, 3],
      sequenceDown: [5, 4, 3, 4, 3, 2, 3, 2],
      pentatonicPattern: [0, 2, 1, 3, 2, 4, 3, 2],
      pentatonicMinorPattern: [0, 1, 2, 4, 3, 2, 1, 0],
      melodicPattern: [0, 2, 1, 4, 3, 5, 4, 2],
      passing: [0, 1, 2, 2, 3, 4, 4, 3],
      connection: [0, 1, 2, 3, 4, 3, 2, 1],
      fill: [0, 2, 4, 2, 1, 2, 3, 2],
      ornament: [2, 3, 2, 1, 0, 1, 0, 0],
      majorClose: [2, 1, 0],
      minorClose: [2, 1, 0],
    };
    if (phraseKind === 'rhythm') {
      return this._melodyFromDegrees(rootMidi, intervals, [
        { d: 0, dur: 1 }, { d: 1, dur: 0.5 }, { d: 2, dur: 0.5 },
        { d: 4, dur: 1 }, { d: 2, dur: 0.5 }, { d: 0, dur: 0.5 },
      ]);
    }
    if (phraseKind === 'fragment') {
      return this._melodyFromDegrees(rootMidi, intervals, degreeSets.fragment.map((d, i) => ({ d, dur: i === 3 ? 1 : 1 })));
    }
    if (phraseKind === 'variedRhythm') {
      return this._melodyFromDegrees(rootMidi, intervals, [
        { d: 0, dur: 0.5 }, { d: 1, dur: 0.5 }, { d: 2, dur: 1 },
        { d: 4, dur: 0.5 }, { d: 3, dur: 0.5 }, { d: 2, dur: 1 },
      ]);
    }
    if (phraseKind === 'majorClose' || phraseKind === 'minorClose') {
      return this._melodyFromDegrees(rootMidi, intervals, [
        { d: 2, dur: 1 }, { d: 1, dur: 1 }, { d: 0, dur: 2 },
      ]);
    }
    return this._melodyFromDegrees(rootMidi, intervals, (degreeSets[phraseKind] || degreeSets.asc).map(d => ({ d, dur: 0.5 })));
  },

  _melodyFromDegrees(rootMidi, intervals, events) {
    const treble = [];
    let beat = 0;
    events.forEach(ev => {
      treble.push({ midi: this._scaleNote(rootMidi, intervals, ev.d), beat, duration: ev.dur });
      beat += ev.dur;
    });
    return treble;
  },

  // Devuelve { treble, bass, label } para un compás melódico.
  _melodicMeasure(config, sectionKey, barInSection, globalIdx, tonicMidi, relMidi) {
    const techKey = config.technique;
    const ION = this._scaleIntervals.ionian;

    // Helper: run de 8 corcheas a partir de grados consecutivos.
    const run8 = (root, intervals, startDeg, ascending) => {
      const treble = [], bass = [];
      for (let i = 0; i < 8; i++) {
        const deg  = ascending ? startDeg + i : startDeg + (7 - i);
        const midi = this._scaleNote(root, intervals, deg);
        treble.push({ midi,        beat: i * 0.5, duration: 0.5 });
        bass.push({   midi: midi - 12, beat: i * 0.5, duration: 0.5 });
      }
      return { treble, bass };
    };

    const asc = (barInSection % 2 === 0);

    if (techKey === 'majorscale') {
      const r = run8(tonicMidi, ION, 0, asc);
      return { treble: r.treble, bass: r.bass, label: 'Escala mayor' };
    }

    if (techKey === 'minorscale') {
      const r = run8(relMidi, this._scaleIntervals.aeolian, 0, asc);
      return { treble: r.treble, bass: r.bass, label: 'Escala menor' };
    }

    if (techKey === 'modes') {
      // Modos diatónicos del nivel: misma escala, distinta nota de inicio.
      // Solo usa notas de la armadura → cifrado limpio, sin alteraciones.
      const plan = {
        prep:        { deg: 0, name: 'Jónico'      },
        build:       { deg: 1, name: 'Dórico'      },
        challenge:   { deg: 2, name: 'Frigio'      },
        application: { deg: 4, name: 'Mixolidio'   },
        close:       { deg: 5, name: 'Eólico'      },
      };
      const p = plan[sectionKey] || plan.prep;
      const r = run8(tonicMidi, ION, p.deg, asc);
      return { treble: r.treble, bass: r.bass, label: p.name };
    }

    if (techKey === 'pentablues') {
      const useBlues = (sectionKey === 'challenge' || sectionKey === 'application');
      const intervals = useBlues ? this._scaleIntervals.blues : this._scaleIntervals.majpenta;
      const root = useBlues ? relMidi : tonicMidi;
      const r = run8(root, intervals, 0, asc);
      return { treble: r.treble, bass: r.bass, label: useBlues ? 'Blues' : 'Pentatónica' };
    }

    if (techKey === 'hanon') {
      // Figura Hanon Nº1: por cada grado de partida, patrón de 8 notas.
      const start = barInSection % 7;
      const fig = [start, start + 2, start + 1, start + 3,
                   start + 2, start + 4, start + 3, start + 5];
      const treble = [], bass = [];
      fig.forEach((deg, i) => {
        const midi = this._scaleNote(tonicMidi, ION, deg);
        treble.push({ midi,        beat: i * 0.5, duration: 0.5 });
        bass.push({   midi: midi - 12, beat: i * 0.5, duration: 0.5 });
      });
      return { treble, bass, label: 'Hanon' };
    }

    if (techKey === 'phrases') {
      // Frase melódica corta sobre el bajo del acorde diatónico.
      const prog = this._progressionFor(config.style, config.difficulty);
      const chordLabel = prog[globalIdx % prog.length];
      const chord = ChordLibrary.get(chordLabel);
      const motifs = [
        [{ d: 0, dur: 1 }, { d: 1, dur: 0.5 }, { d: 2, dur: 0.5 }, { d: 4, dur: 1 }, { d: 2, dur: 1 }],
        [{ d: 4, dur: 1 }, { d: 3, dur: 0.5 }, { d: 2, dur: 0.5 }, { d: 1, dur: 1 }, { d: 0, dur: 1 }],
        [{ d: 2, dur: 0.5 }, { d: 4, dur: 0.5 }, { d: 7, dur: 1 }, { d: 6, dur: 1 }, { d: 4, dur: 1 }],
      ];
      const motif = motifs[globalIdx % motifs.length];
      const treble = [];
      let beat = 0;
      motif.forEach(s => {
        treble.push({ midi: this._scaleNote(tonicMidi, ION, s.d), beat, duration: s.dur });
        beat += s.dur;
      });
      const bass = chord ? [{ midi: chord.rootBass, beat: 0, duration: 4 }] : [];
      return { treble, bass, label: chordLabel };
    }

    // Fallback defensivo: escala mayor.
    const r = run8(tonicMidi, ION, 0, asc);
    return { treble: r.treble, bass: r.bass, label: 'Escala' };
  },

  // ── Compás: aplicar el patrón a un acorde concreto ─────────────
  _buildMeasure(chord, pattern) {
    const treble = [];
    const bass   = [];
    let beat = 0;

    pattern.sequence.forEach(slot => {
      if (slot.lh !== undefined) {
        this._resolveRecipe(slot.lh, chord).forEach(midi => {
          bass.push({ midi, beat, duration: slot.dur });
        });
      }
      if (slot.rh !== undefined) {
        this._resolveRecipe(slot.rh, chord).forEach(midi => {
          treble.push({ midi, beat, duration: slot.dur });
        });
      }
      beat += slot.dur;
    });

    // Extender la duración de cada nota hasta el siguiente ataque
    // en su mano (o final del compás). Así las teclas se mantienen
    // iluminadas el tiempo correcto en pantalla.
    const total = beat;
    [treble, bass].forEach(arr => {
      arr.sort((a, b) => a.beat - b.beat);
      for (let i = 0; i < arr.length; i++) {
        // Buscar el siguiente ataque en una mano (cualquier nota más tarde)
        let nextBeat = total;
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[j].beat > arr[i].beat + 0.0001) {
            nextBeat = arr[j].beat;
            break;
          }
        }
        if (nextBeat > arr[i].beat + arr[i].duration) {
          arr[i].duration = nextBeat - arr[i].beat;
        }
      }
    });

    return { treble, bass };
  },

  // Resuelve una receta de slot a 1+ números MIDI usando el acorde.
  // `recipe` puede ser un array de recetas (se aplanan).
  _resolveRecipe(recipe, chord) {
    if (recipe == null || recipe === 'rest') return [];
    if (Array.isArray(recipe)) {
      return recipe.flatMap(r => this._resolveRecipe(r, chord));
    }
    if (recipe === 'root')     return [chord.rootBass];
    if (recipe === 'fifth')    return [chord.altBass];
    if (recipe === 'root+12')  return [chord.rootBass + 12];
    if (recipe === 'fifth+12') return [chord.altBass + 12];
    if (recipe === 'triad')    return [...chord.rhTriad];
    if (recipe === 'triad^')   return this._invert(chord.rhTriad, 1);
    if (recipe === 'triad^^')  return this._invert(chord.rhTriad, 2);
    const m = /^t(\d+)$/.exec(recipe);
    if (m) {
      const i = parseInt(m[1], 10);
      const t = chord.tones;
      if (!t || !t.length) return [];
      const safe = Math.max(0, Math.min(t.length - 1, i));
      return [t[safe]];
    }
    return [];
  },

  // Inversión: sube una octava las `n` notas más graves del voicing y
  // reordena. Funciona para tríadas de 3 o 4 notas.
  _invert(triad, n) {
    const arr = (triad || []).slice().sort((a, b) => a - b);
    for (let i = 0; i < n && i < arr.length; i++) arr[i] += 12;
    return arr.sort((a, b) => a - b);
  },

};

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }


// ════════════════════════════════════════════════════════════════════
//  MusicXML serializer — para que Verovio renderice el pentagrama
// ════════════════════════════════════════════════════════════════════
//
// Estructura: score-partwise con 1 parte de piano de 2 pentagramas.
// - Voice 1 / staff 1 = mano derecha (treble)
// - Voice 5 / staff 2 = mano izquierda (bass)   ← Verovio prefiere
//                                                  voces distintas por staff
// - Divisions = 4 (cuarto = 4 divs, corchea = 2, semi = 1)
// - Time signature 4/4, key signature 0 fifths (sin armadura), tempo
//   en el primer compás.
// - Los símbolos de acorde se muestran solo cuando ayudan al objetivo
//   pedagógico del módulo. En ejercicios melódicos puros se ocultan para
//   que el estudiante lea frase, escala y dirección sin confundirlos con
//   notas de mano derecha.

const DIVISIONS = 12;             // divisiones por negra (12 = admite binario y tresillos)
const BEATS_PER_MEASURE = 4;
const MEASURE_DIVS = DIVISIONS * BEATS_PER_MEASURE;
const STEP_NAMES = ['C','C','D','D','E','F','F','G','G','A','A','B'];
const STEP_ALTER = [ 0,  1,  0,  1,  0, 0,  1,  0,  1, 0,  1, 0];

SessionGenerator.toMusicXML = function (session) {
  const measures = session.measures;
  const bpm = session.origBpm || 90;
  const fifths = session.fifths || 0;
  const sig = String(session.timeSig || '4/4').split('/');
  const beats = parseInt(sig[0], 10) || 4;
  const beatType = parseInt(sig[1], 10) || 4;
  const measureDivs = Math.round(beats * DIVISIONS * (4 / beatType));
  const showChordSymbols = shouldShowChordSymbols(session);
  const fingeringContext = createFingeringContext(session);

  let xml = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n';
  xml += '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n';
  xml += '<score-partwise version="3.1">\n';
  xml += `  <work><work-title>${escapeXml(session.title || 'PianoFlow')}</work-title></work>\n`;
  xml += '  <identification><creator type="composer">PianoFlow</creator></identification>\n';
  xml += '  <part-list>\n';
  xml += '    <score-part id="P1"><part-name>Piano</part-name></score-part>\n';
  xml += '  </part-list>\n';
  xml += '  <part id="P1">\n';

  measures.forEach((m, i) => {
    xml += `    <measure number="${i + 1}">\n`;

    if (i === 0) {
      xml += '      <attributes>\n';
      xml += `        <divisions>${DIVISIONS}</divisions>\n`;
      xml += `        <key><fifths>${fifths}</fifths></key>\n`;
      xml += `        <time><beats>${beats}</beats><beat-type>${beatType}</beat-type></time>\n`;
      xml += '        <staves>2</staves>\n';
      xml += '        <clef number="1"><sign>G</sign><line>2</line></clef>\n';
      xml += '        <clef number="2"><sign>F</sign><line>4</line></clef>\n';
      xml += '      </attributes>\n';
      xml += `      <direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${bpm}</per-minute></metronome></direction-type><sound tempo="${bpm}"/></direction>\n`;
    }

    // Línea de armonía como <words> encima del sistema. No representa una
    // mano específica: es contexto armónico cuando el módulo lo necesita.
    if (showChordSymbols && m.chordSegs && m.chordSegs.length) {
      m.chordSegs.forEach(seg => {
        const offDivs = Math.round((seg.beat || 0) * DIVISIONS);
        const offset  = offDivs > 0 ? `<offset>${offDivs}</offset>` : '';
        const label = displayChordSymbolLabel(session, seg.label);
        if (label) xml += `      <direction placement="above"><direction-type><words font-weight="bold">${escapeXml(label)}</words></direction-type>${offset}</direction>\n`;
      });
    } else if (showChordSymbols && m.chord) {
      const label = displayChordSymbolLabel(session, m.chord);
      if (label) xml += `      <direction placement="above"><direction-type><words font-weight="bold">${escapeXml(label)}</words></direction-type></direction>\n`;
    }

    // Voz 1 / staff 1 (treble - mano derecha)
    xml += emitStaff(m.treble, 1, 1, measureDivs, fingeringContext);

    // Backup al inicio del compás para escribir el bajo
    xml += `      <backup><duration>${measureDivs}</duration></backup>\n`;

    // Voz 5 / staff 2 (bass - mano izquierda)
    xml += emitStaff(m.bass, 5, 2, measureDivs, fingeringContext);

    xml += '    </measure>\n';
  });

  xml += '  </part>\n';
  xml += '</score-partwise>\n';
  return xml;
};

function shouldShowChordSymbols(session) {
  const meta = (session && session.meta) || {};
  if (meta.hideChordSymbols === true) return false;
  if (meta.showChordSymbols === true) return true;

  switch (meta.modeKey) {
    case 'chords':
    case 'accompaniment':
    case 'arpeggios':
    case 'melodyArrangement':
    case 'voicings':
      return true;

    case 'melodic':
      return meta.techniqueKey === 'applied' ||
             meta.techniqueKey === 'application' ||
             hasBassSupport(session);

    case 'coordination':
      return meta.techniqueKey === 'bassChords' ||
             meta.techniqueKey === 'fixedMoving' ||
             meta.techniqueKey === 'technicalApplication';

    default:
      return true;
  }
}

function hasBassSupport(session) {
  return !!(session && session.measures || []).some(m => (m.bass || []).length);
}

function displayChordSymbolLabel(session, label) {
  const raw = String(label || '').trim();
  if (!raw) return '';
  const meta = (session && session.meta) || {};
  if (meta.modeKey === 'melodic') {
    return raw.split('/')[0].trim();
  }
  return raw;
}

function createFingeringContext(session) {
  return {
    meta: (session && session.meta) || {},
    direction: null,
    patternIndex: 0,
    lastMidi: null,
    lastFinger: null,
  };
}

function shouldFingerStaff(ctx, staff) {
  if (!ctx || staff !== 1) return false;
  const mode = ctx.meta && ctx.meta.modeKey;
  return mode === 'melodic' || mode === 'melodyArrangement';
}

function shouldFingerNote(note, ctx) {
  if (!note || !ctx) return false;
  if (Number.isFinite(note.finger)) return true;
  if (ctx.meta.modeKey === 'melodyArrangement') return note.fingerRole === 'melody';
  return ctx.meta.modeKey === 'melodic';
}

function prepareNotesWithFingering(notes, staff, ctx) {
  const cloned = (notes || []).map(n => ({ ...n }));
  if (!shouldFingerStaff(ctx, staff)) return cloned;

  const groups = new Map();
  cloned.forEach(n => {
    const key = Math.round((n.beat || 0) * 1000);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(n);
  });

  const targets = [...groups.values()]
    .map(group => group
      .filter(n => shouldFingerNote(n, ctx))
      .sort((a, b) => b.midi - a.midi)[0])
    .filter(Boolean)
    .sort((a, b) => (a.beat || 0) - (b.beat || 0));

  if (targets.length && targets[0].beat === 0 && ctx.lastMidi != null && targets[0].midi <= ctx.lastMidi - 5) {
    ctx.lastMidi = null;
    ctx.lastFinger = null;
    ctx.patternIndex = 0;
    ctx.direction = targets.length > 1 && targets[1].midi < targets[0].midi ? 'down' : 'up';
  }

  if (!ctx.direction && ctx.lastMidi == null && targets.length > 1) {
    ctx.direction = targets[1].midi < targets[0].midi ? 'down' : 'up';
  }

  targets.forEach(n => {
    n.finger = Number.isFinite(n.finger) ? n.finger : nextRightHandFinger(n, ctx);
  });

  return cloned;
}

function nextRightHandFinger(note, ctx) {
  const midi = note.midi;
  const meta = ctx.meta || {};
  const pentatonic = /pentatonic|Pentat/i.test(`${meta.scaleKind || ''} ${meta.melodicResource || ''} ${meta.pattern || ''}`);
  const arrangement = meta.modeKey === 'melodyArrangement';
  const asc = arrangement || pentatonic ? [1, 2, 3, 4, 5] : [1, 2, 3, 1, 2, 3, 4, 5];
  const desc = arrangement || pentatonic ? [5, 4, 3, 2, 1] : [5, 4, 3, 2, 1, 3, 2, 1];

  if (ctx.lastMidi == null) {
    const pattern = ctx.direction === 'down' ? desc : asc;
    const finger = pattern[0];
    ctx.lastMidi = midi;
    ctx.lastFinger = finger;
    ctx.patternIndex = 1;
    return finger;
  }

  if (midi === ctx.lastMidi) return ctx.lastFinger || 1;

  const nextDirection = midi < ctx.lastMidi ? 'down' : 'up';
  if (ctx.direction !== nextDirection) {
    ctx.direction = nextDirection;
    ctx.patternIndex = Math.abs(midi - ctx.lastMidi) >= 5 ? 0 : 1;
  }

  const pattern = ctx.direction === 'down' ? desc : asc;
  let finger = pattern[ctx.patternIndex % pattern.length];
  if (Math.abs(midi - ctx.lastMidi) >= 7) {
    finger = ctx.direction === 'down' ? 5 : 1;
    ctx.patternIndex = 1;
  } else {
    ctx.patternIndex++;
  }

  ctx.lastMidi = midi;
  ctx.lastFinger = finger;
  return finger;
}

// Serializa las notas de UN pentagrama agrupando ataques simultáneos
// como acordes, rellenando los huecos con silencios y agrupando corcheas
// con barra (beaming) por pulso.
function emitStaff(notes, voice, staff, measureDivs, fingeringContext) {
  const preparedNotes = prepareNotesWithFingering(notes, staff, fingeringContext);

  // 1) Agrupar ataques simultáneos por beat
  const groups = new Map();
  preparedNotes.forEach(n => {
    const key = Math.round(n.beat * 1000);
    if (!groups.has(key)) groups.set(key, { beat: n.beat, notes: [] });
    groups.get(key).notes.push(n);
  });
  const events = [...groups.values()].sort((a, b) => a.beat - b.beat);

  // 2) Construir la secuencia ordenada de slots (notas + silencios)
  const slots = [];
  let cursor = 0;   // posición en divs
  events.forEach(ev => {
    const evDivs = Math.round(ev.beat * DIVISIONS);
    if (evDivs > cursor) {
      slots.push({ type: 'rest', startDiv: cursor, durDivs: evDivs - cursor });
      cursor = evDivs;
    }
    const sorted = ev.notes.slice().sort((a, b) => a.midi - b.midi);
    const durDivs = Math.max(1, Math.round((sorted[0].duration || 0.5) * DIVISIONS));
    slots.push({ type: 'note', startDiv: cursor, durDivs, notes: sorted });
    cursor += durDivs;
  });
  if (cursor < measureDivs) {
    slots.push({ type: 'rest', startDiv: cursor, durDivs: measureDivs - cursor });
  }

  // 3) Asignar barras (beaming) a corridas de corcheas/semicorcheas
  assignBeams(slots);

  // 4) Emitir. La barra va solo en la nota principal del slot (no en las
  //    notas de acorde adicionales).
  let xml = '';
  slots.forEach(slot => {
    if (slot.type === 'rest') {
      xml += emitRest(slot.durDivs, voice, staff);
    } else {
      slot.notes.forEach((n, idx) => {
        xml += emitNote(n.midi, slot.durDivs, voice, staff, idx > 0,
                        idx === 0 ? slot.beam : null, n.finger);
      });
    }
  });
  return xml;
}

// Marca slot.beam = 'begin'|'continue'|'end' para corridas de notas con
// barra (corchea=2 divs, semicorchea=1, corchea con puntillo=3) que caen
// dentro del MISMO pulso. Silencios, negras+ y cambios de pulso cortan la
// barra. Una nota beameable suelta no lleva barra (queda con bandera).
function assignBeams(slots) {
  // Beameables (DIVISIONS=12): corchea=6, semicorchea=3, corchea-tresillo=4,
  // semi-tresillo=2. NO la negra (12) ni la negra-tresillo (8).
  const isBeamable = s => s.type === 'note' && s.durDivs >= 2 && s.durDivs <= 6;
  const beatOf     = s => Math.floor(s.startDiv / DIVISIONS);
  let i = 0;
  while (i < slots.length) {
    if (!isBeamable(slots[i])) { i++; continue; }
    const run = [i];
    let j = i + 1;
    while (j < slots.length && isBeamable(slots[j]) && beatOf(slots[j]) === beatOf(slots[i])) {
      run.push(j);
      j++;
    }
    if (run.length >= 2) {
      slots[run[0]].beam = 'begin';
      slots[run[run.length - 1]].beam = 'end';
      for (let k = 1; k < run.length - 1; k++) slots[run[k]].beam = 'continue';
    }
    i = j;
  }
}

function emitNote(midi, durDivs, voice, staff, isChordNote, beam, finger) {
  const pc  = ((midi % 12) + 12) % 12;
  const step = STEP_NAMES[pc];
  const alter = STEP_ALTER[pc];
  const oct = Math.floor(midi / 12) - 1;
  const spec = durToSpec(durDivs);
  let s = '      <note>\n';
  if (isChordNote) s += '        <chord/>\n';
  s += `        <pitch><step>${step}</step>`;
  if (alter !== 0) s += `<alter>${alter}</alter>`;
  s += `<octave>${oct}</octave></pitch>\n`;
  s += `        <duration>${durDivs}</duration>\n`;
  s += `        <voice>${voice}</voice>\n`;
  if (spec.type) s += `        <type>${spec.type}</type>\n`;
  if (spec.triplet) s += '        <time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>\n';
  s += `        <staff>${staff}</staff>\n`;
  if (beam) s += `        <beam number="1">${beam}</beam>\n`;
  if (Number.isFinite(finger)) {
    s += `        <notations><technical><fingering placement="above">${finger}</fingering></technical></notations>\n`;
  }
  s += '      </note>\n';
  return s;
}

function emitRest(durDivs, voice, staff) {
  const spec = durToSpec(durDivs);
  let s = '      <note>\n';
  s += '        <rest/>\n';
  s += `        <duration>${durDivs}</duration>\n`;
  s += `        <voice>${voice}</voice>\n`;
  if (spec.type) s += `        <type>${spec.type}</type>\n`;
  if (spec.triplet) s += '        <time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>\n';
  s += `        <staff>${staff}</staff>\n`;
  s += '      </note>\n';
  return s;
}

// Para DIVISIONS=12. Binario: 3=16th, 6=eighth, 12=quarter, 24=half, 48=whole.
// Tresillos (× 2/3 del binario): 2=16th·3, 4=eighth·3, 8=quarter·3, 16=half·3.
function durToSpec(divs) {
  switch (divs) {
    case 2:  return { type: '16th',    triplet: true  };
    case 3:  return { type: '16th',    triplet: false };
    case 4:  return { type: 'eighth',  triplet: true  };
    case 6:  return { type: 'eighth',  triplet: false };
    case 8:  return { type: 'quarter', triplet: true  };
    case 9:  return { type: 'eighth',  triplet: false };  // corchea con puntillo (aprox)
    case 12: return { type: 'quarter', triplet: false };
    case 16: return { type: 'half',    triplet: true  };
    case 18: return { type: 'quarter', triplet: false };  // negra con puntillo (aprox)
    case 24: return { type: 'half',    triplet: false };
    case 36: return { type: 'half',    triplet: false };  // blanca con puntillo (aprox)
    case 48: return { type: 'whole',   triplet: false };
    default: return { type: 'quarter', triplet: false };
  }
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
