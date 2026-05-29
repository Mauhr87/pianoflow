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
    const family   = PracticeLibrary.getFamily(config.family);
    const style    = PracticeLibrary.getStyle(config.style);
    const diff     = PracticeLibrary.getDifficulty(config.difficulty);
    const pattern  = PatternLibrary.get(config.pattern);

    if (!family || !style || !diff || !pattern) {
      throw new Error('Config inválida: faltan family/style/difficulty/pattern');
    }

    const progBank   = family.progressions[config.style][config.difficulty];
    const progression = progBank[0]; // por ahora siempre la primera variante

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

    return {
      title:    `${family.label} · ${style.label}`,
      subtitle: `${pattern.label} · ${diff.label} · ${finalBpm} BPM`,
      timeSig:  '4/4',
      origBpm:  finalBpm,
      measures,
      sections: sectionMeta,
      meta: {
        family:     family.label,
        familyKey:  config.family,
        style:      style.label,
        styleKey:   config.style,
        pattern:    pattern.label,
        patternKey: config.pattern,
        difficulty: diff.label,
        diffKey:    config.difficulty,
        bpm:        finalBpm,
      },
    };
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
  _resolveRecipe(recipe, chord) {
    if (recipe == null || recipe === 'rest') return [];
    if (recipe === 'root')    return [chord.rootBass];
    if (recipe === 'fifth')   return [chord.altBass];
    if (recipe === 'root+12') return [chord.rootBass + 12];
    if (recipe === 'triad')   return [...chord.rhTriad];
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
// - Cada compás lleva una <direction><words> con el nombre del acorde
//   arriba del pentagrama (Verovio lo dibuja con su tipografía).

const DIVISIONS = 4;              // divisiones por negra
const BEATS_PER_MEASURE = 4;
const MEASURE_DIVS = DIVISIONS * BEATS_PER_MEASURE;
const STEP_NAMES = ['C','C','D','D','E','F','F','G','G','A','A','B'];
const STEP_ALTER = [ 0,  1,  0,  1,  0, 0,  1,  0,  1, 0,  1, 0];

SessionGenerator.toMusicXML = function (session) {
  const measures = session.measures;
  const bpm = session.origBpm || 90;

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
      xml += '        <key><fifths>0</fifths></key>\n';
      xml += '        <time><beats>4</beats><beat-type>4</beat-type></time>\n';
      xml += '        <staves>2</staves>\n';
      xml += '        <clef number="1"><sign>G</sign><line>2</line></clef>\n';
      xml += '        <clef number="2"><sign>F</sign><line>4</line></clef>\n';
      xml += '      </attributes>\n';
      xml += `      <direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${bpm}</per-minute></metronome></direction-type><sound tempo="${bpm}"/></direction>\n`;
    }

    // Etiqueta de acorde como <words> encima del pentagrama
    if (m.chord) {
      xml += `      <direction placement="above"><direction-type><words font-weight="bold">${escapeXml(m.chord)}</words></direction-type></direction>\n`;
    }

    // Voz 1 / staff 1 (treble - mano derecha)
    xml += emitStaff(m.treble, 1, 1);

    // Backup al inicio del compás para escribir el bajo
    xml += `      <backup><duration>${MEASURE_DIVS}</duration></backup>\n`;

    // Voz 5 / staff 2 (bass - mano izquierda)
    xml += emitStaff(m.bass, 5, 2);

    xml += '    </measure>\n';
  });

  xml += '  </part>\n';
  xml += '</score-partwise>\n';
  return xml;
};

// Serializa las notas de UN pentagrama agrupando ataques simultáneos
// como acordes, rellenando los huecos con silencios y agrupando corcheas
// con barra (beaming) por pulso.
function emitStaff(notes, voice, staff) {
  // 1) Agrupar ataques simultáneos por beat
  const groups = new Map();
  (notes || []).forEach(n => {
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
  if (cursor < MEASURE_DIVS) {
    slots.push({ type: 'rest', startDiv: cursor, durDivs: MEASURE_DIVS - cursor });
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
                        idx === 0 ? slot.beam : null);
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
  const isBeamable = s => s.type === 'note' && s.durDivs >= 1 && s.durDivs <= 3;
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

function emitNote(midi, durDivs, voice, staff, isChordNote, beam) {
  const pc  = ((midi % 12) + 12) % 12;
  const step = STEP_NAMES[pc];
  const alter = STEP_ALTER[pc];
  const oct = Math.floor(midi / 12) - 1;
  const type = durToType(durDivs);
  let s = '      <note>\n';
  if (isChordNote) s += '        <chord/>\n';
  s += `        <pitch><step>${step}</step>`;
  if (alter !== 0) s += `<alter>${alter}</alter>`;
  s += `<octave>${oct}</octave></pitch>\n`;
  s += `        <duration>${durDivs}</duration>\n`;
  s += `        <voice>${voice}</voice>\n`;
  if (type) s += `        <type>${type}</type>\n`;
  s += `        <staff>${staff}</staff>\n`;
  if (beam) s += `        <beam number="1">${beam}</beam>\n`;
  s += '      </note>\n';
  return s;
}

function emitRest(durDivs, voice, staff) {
  const type = durToType(durDivs);
  let s = '      <note>\n';
  s += '        <rest/>\n';
  s += `        <duration>${durDivs}</duration>\n`;
  s += `        <voice>${voice}</voice>\n`;
  if (type) s += `        <type>${type}</type>\n`;
  s += `        <staff>${staff}</staff>\n`;
  s += '      </note>\n';
  return s;
}

function durToType(divs) {
  // Para DIVISIONS=4: 1=16th, 2=eighth, 4=quarter, 8=half, 16=whole
  switch (divs) {
    case 1:  return '16th';
    case 2:  return 'eighth';
    case 3:  return 'eighth';   // corchea con puntillo — Verovio interpretará
    case 4:  return 'quarter';
    case 6:  return 'quarter';  // negra con puntillo
    case 8:  return 'half';
    case 12: return 'half';     // blanca con puntillo
    case 16: return 'whole';
    default: return 'quarter';
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

