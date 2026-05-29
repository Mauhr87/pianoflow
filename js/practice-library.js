/**
 * PianoFlow — Practice Library
 *
 * Organización: familia × patrón × estilo × dificultad
 *
 * Cada familia agrupa acordes que comparten color o forma de mano y
 * define progresiones por estilo (worship / pop / hebrew) y dificultad
 * (basic / intermediate / advanced). El generador de sesión usa esto
 * para armar las 5 secciones (preparación → cierre).
 */

const PracticeLibrary = {

  // ── Familias ────────────────────────────────────────────────────────

  families: {

    abierto_do: {
      label: 'Abierto Do',
      icon:  '🌅',
      desc:  'Los pilares de la tonalidad de Do: C, F, G, Am, Dm, Em.',
      chords: ['C', 'F', 'G', 'Am', 'Dm', 'Em'],
      cue:   'Mantén los dedos curvos y deja la muñeca relajada. Cambia de acorde como bloque, no nota por nota.',
      progressions: {
        worship: {
          basic:        [['C','G'],                ['Am','F']],
          intermediate: [['C','G','Am','F'],       ['Am','F','C','G']],
          advanced:     [['C','G','Am','Em','F','C','F','G'],
                         ['Am','F','C','G','F','C','Dm','G']],
        },
        pop: {
          basic:        [['C','Am'],               ['F','G']],
          intermediate: [['C','G','Am','F'],       ['Am','F','C','G']],
          advanced:     [['C','Em','Am','F','C','G','F','G'],
                         ['Am','C','F','G','Em','Am','Dm','G']],
        },
        hebrew: {
          basic:        [['Am','G'],               ['Am','Dm']],
          intermediate: [['Am','G','F','Em'],      ['Am','Dm','G','Am']],
          advanced:     [['Am','G','F','Em','Am','Dm','G','Am'],
                         ['Am','Em','F','G','Am','Dm','Em','Am']],
        },
      },
    },

    abierto_sol: {
      label: 'Abierto Sol',
      icon:  '🌞',
      desc:  'Tonalidad de Sol mayor: G, D, A, Em, Bm. Brillante y abierta.',
      chords: ['G', 'D', 'A', 'Em', 'Bm'],
      cue:   'El F♯ pide que la mano se acomode un poco. Practica el cambio G→D primero — es el motor de esta familia.',
      progressions: {
        worship: {
          basic:        [['G','D'],                ['Em','D']],
          intermediate: [['G','D','Em','D'],       ['G','D','Em','Bm']],
          advanced:     [['G','D','Em','Bm','G','D','A','D'],
                         ['Em','Bm','G','D','Em','D','G','D']],
        },
        pop: {
          basic:        [['G','Em'],               ['G','D']],
          intermediate: [['G','D','Em','D'],       ['Em','D','G','D']],
          advanced:     [['G','D','Em','Bm','A','D','G','D'],
                         ['Em','G','D','A','Bm','G','D','A']],
        },
        hebrew: {
          basic:        [['Em','D'],               ['Em','Bm']],
          intermediate: [['Em','D','Bm','Em'],     ['Em','D','A','Em']],
          advanced:     [['Em','D','Bm','A','Em','Bm','D','Em'],
                         ['Em','Bm','D','A','Em','D','Bm','Em']],
        },
      },
    },

    worship_moderno: {
      label: 'Worship moderno',
      icon:  '🙏',
      desc:  'Colores sus2/add9 e inversiones. El sonido de la adoración contemporánea.',
      chords: ['Csus2', 'Cadd9', 'Gsus4', 'G', 'Em7', 'Dsus2', 'D', 'F/C'],
      cue:   'Deja que las notas comunes (D y G) suenen entre cambios. No las "cortes": el secreto está en el legato armónico.',
      progressions: {
        worship: {
          basic:        [['Cadd9','G'],            ['Em7','Dsus2']],
          intermediate: [['Cadd9','G','Em7','Dsus2'], ['G','D','Em7','Cadd9']],
          advanced:     [['Cadd9','G','Em7','Dsus2','Cadd9','G','D','Em7'],
                         ['Em7','Cadd9','G','Dsus2','Em7','D','Cadd9','G']],
        },
        pop: {
          basic:        [['Cadd9','G'],            ['Em7','D']],
          intermediate: [['Cadd9','G','Em7','D'],  ['G','D','Em7','Csus2']],
          advanced:     [['G','D','Em7','Cadd9','G','D','Cadd9','Dsus2'],
                         ['Cadd9','Em7','G','D','Cadd9','G','F/C','Dsus2']],
        },
        hebrew: {
          basic:        [['Em7','D'],              ['Em7','G']],
          intermediate: [['Em7','D','G','D'],      ['Em7','Cadd9','G','D']],
          advanced:     [['Em7','D','Cadd9','G','Em7','Dsus2','Cadd9','D'],
                         ['Em7','G','Cadd9','D','Em7','D','G','Em7']],
        },
      },
    },

    hebreo_menor: {
      label: 'Menor hebreo',
      icon:  '🕎',
      desc:  'Am, Dm, E, Am7, G — tensión dominante hacia tónica menor. Sabor frigio dominante.',
      chords: ['Am', 'Dm', 'E', 'Am7', 'G', 'F'],
      cue:   'Siente cómo el E mayor "tira" hacia Am. Esa tensión es el corazón del sabor hebreo.',
      progressions: {
        worship: {
          basic:        [['Am','E'],               ['Am','Dm']],
          intermediate: [['Am','Dm','E','Am'],     ['Am','G','Dm','E']],
          advanced:     [['Am','G','F','E','Am','Dm','E','Am'],
                         ['Am','Dm','G','E','Am','F','Dm','E']],
        },
        pop: {
          basic:        [['Am','G'],               ['Am','F']],
          intermediate: [['Am','G','F','E'],       ['Am','F','G','E']],
          advanced:     [['Am','G','F','E','Am','F','Dm','E'],
                         ['Am','Am7','Dm','G','F','G','E','Am']],
        },
        hebrew: {
          basic:        [['Am','E'],               ['Am','Dm']],
          intermediate: [['Am','Dm','E','Am'],     ['Am','G','F','E']],
          advanced:     [['Am','G','F','E','Am','Dm','E','Am'],
                         ['Am','Am7','Dm','G','F','E','Am','E']],
        },
      },
    },

    septimas_pop: {
      label: 'Séptimas pop',
      icon:  '✨',
      desc:  'Cmaj7, Am7, Dm7, G7, Fmaj7. Colores suaves de jazz-pop.',
      chords: ['Cmaj7', 'Am7', 'Dm7', 'G7', 'Fmaj7'],
      cue:   'La séptima quiere resolver. En Dm7→G7→Cmaj7 escucha cómo cada voz baja un semitono. Eso es el "ii–V–I".',
      progressions: {
        worship: {
          basic:        [['Cmaj7','Am7'],          ['Fmaj7','G7']],
          intermediate: [['Cmaj7','Am7','Fmaj7','G7'], ['Cmaj7','Fmaj7','Am7','G7']],
          advanced:     [['Cmaj7','Am7','Dm7','G7','Cmaj7','Fmaj7','Dm7','G7'],
                         ['Am7','Dm7','G7','Cmaj7','Am7','Fmaj7','Dm7','G7']],
        },
        pop: {
          basic:        [['Cmaj7','Am7'],          ['Dm7','G7']],
          intermediate: [['Cmaj7','Am7','Dm7','G7'], ['Am7','Dm7','G7','Cmaj7']],
          advanced:     [['Cmaj7','Am7','Dm7','G7','Fmaj7','Am7','Dm7','G7'],
                         ['Am7','Fmaj7','Cmaj7','G7','Dm7','G7','Cmaj7','Am7']],
        },
        hebrew: {
          basic:        [['Am7','Dm7'],            ['Am7','G7']],
          intermediate: [['Am7','Dm7','G7','Cmaj7'], ['Am7','Fmaj7','G7','Am7']],
          advanced:     [['Am7','Dm7','G7','Cmaj7','Am7','Fmaj7','Dm7','G7'],
                         ['Am7','Fmaj7','Dm7','G7','Am7','Dm7','G7','Cmaj7']],
        },
      },
    },

  },

  // ── Estilos ─────────────────────────────────────────────────────────

  styles: {
    worship: { label: 'Worship',    icon: '🙏', bpm: 75, description: 'Aire contemplativo, dejar respirar.' },
    pop:     { label: 'Pop / Balada', icon: '✨', bpm: 90, description: 'Pulso firme y melódico.' },
    hebrew:  { label: 'Hebreo',     icon: '🕎', bpm: 85, description: 'Tensión frigia, expresión modal.' },
  },

  // ── Dificultades ────────────────────────────────────────────────────

  difficulties: {
    basic:        { label: 'Básico',     bpmFactor: 0.85, repeats: 4, description: 'Más lento, más repeticiones por acorde.' },
    intermediate: { label: 'Intermedio', bpmFactor: 1.00, repeats: 2, description: 'Tempo base, cambios cada 2 compases.' },
    advanced:     { label: 'Avanzado',   bpmFactor: 1.10, repeats: 1, description: 'Tempo elevado, cambios cada compás.' },
  },

  // ── Estructura de la sesión (5 secciones) ───────────────────────────

  sections: [
    { key: 'prep',        label: 'Preparación', bars: 4,  note: 'Calentamiento sobre 1-2 acordes con patrón simple.', simplified: true },
    { key: 'build',       label: 'Construcción', bars: 6, note: 'Progresión completa, patrón aún simplificado.',     simplified: true },
    { key: 'challenge',   label: 'Desafío',     bars: 6,  note: 'Patrón completo. Es el corazón de la práctica.',     simplified: false },
    { key: 'application', label: 'Aplicación',  bars: 6,  note: 'Mismo patrón con cambios más fluidos.',              simplified: false },
    { key: 'close',       label: 'Cierre',      bars: 2,  note: 'Resolución armónica. Respira y cierra.',             simplified: true },
  ],

  // ── Utilidades ──────────────────────────────────────────────────────

  getFamily(key)   { return this.families[key] || null; },
  getStyle(key)    { return this.styles[key] || null; },
  getDifficulty(k) { return this.difficulties[k] || null; },

  // Devuelve los patrones aplicables a un estilo.
  patternsForStyle(styleKey) {
    const list = PatternLibrary.byStyle[styleKey] || ['bloque'];
    return list.filter(k => PatternLibrary.get(k));
  },

  // ── Manifest: catálogo plano de prácticas pre-armadas ─────────────
  //
  // Cada ítem es una "pista" lista para reproducir. La UI muestra
  // la lista filtrada por familia. El usuario sólo escoge una pista,
  // no ajusta dimensiones — éstas vienen ya cocinadas en el manifest.
  //
  // Estructura por ítem:
  //   { id, family, style, pattern, difficulty,
  //     title, subtitle, icon, bpm }

  manifest: [],

  buildManifest() {
    const out = [];
    Object.entries(this.families).forEach(([famKey, fam]) => {
      Object.entries(this.styles).forEach(([styleKey, style]) => {
        const patterns = this.patternsForStyle(styleKey);
        patterns.forEach(patKey => {
          const pat = PatternLibrary.get(patKey);
          if (!pat) return;
          Object.entries(this.difficulties).forEach(([diffKey, diff]) => {
            const bpm = Math.round(style.bpm * diff.bpmFactor);
            out.push({
              id:         `pf-${famKey}-${styleKey}-${patKey}-${diffKey}`,
              family:     famKey,
              style:      styleKey,
              pattern:    patKey,
              difficulty: diffKey,
              title:      `${pat.label} · ${diff.label}`,
              subtitle:   `${style.label} · ${bpm} BPM`,
              icon:       fam.icon,
              styleIcon:  style.icon,
              patternIcon: pat.icon,
              bpm,
            });
          });
        });
      });
    });
    this.manifest = out;
    return out;
  },

  // Helpers para la UI
  practicesForFamily(famKey) {
    if (!this.manifest.length) this.buildManifest();
    return this.manifest.filter(p => p.family === famKey);
  },

  getPractice(id) {
    if (!this.manifest.length) this.buildManifest();
    return this.manifest.find(p => p.id === id) || null;
  },

  // Total de prácticas en una familia
  practiceCount(famKey) {
    return this.practicesForFamily(famKey).length;
  },
};
