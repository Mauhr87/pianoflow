/**
 * PianoFlow — Player
 *
 * Orquesta la sesión generada por SessionGenerator:
 *   - reproduce audio (AudioEngine) sincronizado al BPM
 *   - ilumina teclas (PianoEngine)
 *   - actualiza UI (barra de reproductor, panel de notas, etiquetas
 *     de acorde, grid de secciones)
 *   - loop de sección y metrónomo on/off
 *
 * En v1 no hay Verovio aún — mostramos la sesión como un grid visual
 * de secciones + acordes. Cuando se incorpore notation-engine, esto se
 * reemplazará por el SVG del pentagrama.
 */

const Player = {

  session: null,
  currentMeasure: 0,
  isPlaying: false,
  metronome: false,
  loopSection: false,
  speedFactor: 1.0,
  handsMode: 'both',   // 'both' | 'rh' (derecha) | 'lh' (izquierda)

  _timers: [],
  _measureStartAt: 0,    // performance.now() del compás actual
  _activeSection: null,   // sección donde está currentMeasure (auto)
  _selectedSection: null, // sección elegida por el usuario (target del loop)

  // ── Carga e init ────────────────────────────────────────────────

  async loadSession(session) {
    this.stop();
    this.session = session;
    this.currentMeasure = 0;
    this._selectedSection = null;

    // Row 1: secciones
    this._renderSectionsRow();
    // Row 2: partitura Verovio (la etiqueta de acorde la pinta Verovio
    // desde el MusicXML; ya no superponemos botones)
    await this._renderNotation();
    // Panel inferior con notas del compás
    this._renderNotePanel(0);

    // Actualizar UI de barra
    const barLabel   = document.getElementById('bar-label');
    const barSection = document.getElementById('bar-section');
    const playerTitle   = document.getElementById('player-title');
    const playerSection = document.getElementById('player-section');
    if (barLabel)      barLabel.textContent     = session.title;
    if (barSection)    barSection.textContent   = session.subtitle;
    if (playerTitle)   playerTitle.textContent  = session.title;
    if (playerSection) playerSection.textContent = session.subtitle;

    // Mostrar la barra
    const bar = document.getElementById('player-bar');
    if (bar) bar.hidden = false;
    document.body.classList.add('player-open');
  },

  // ── Playback ────────────────────────────────────────────────────

  async togglePlay() {
    if (this.isPlaying) { this.pause(); return; }
    if (!this.session) return;

    // Asegurar audio listo (gesto del usuario abre AudioContext)
    AudioEngine.ensureCtx();
    try {
      if (!AudioEngine.instrument) {
        const playBtn = document.getElementById('play-btn');
        if (playBtn) playBtn.textContent = '…';
        await AudioEngine.loadInstrument('classic');
      }
    } catch (e) {
      App.toast('No se pudo cargar el piano. Revisa tu conexión.', true);
      console.error(e);
      const playBtn = document.getElementById('play-btn');
      if (playBtn) playBtn.textContent = '▶';
      return;
    }

    this.isPlaying = true;
    const playBtn = document.getElementById('play-btn');
    if (playBtn) playBtn.textContent = '⏸';

    this._scheduleMeasure();
  },

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this._clearTimers();
    AudioEngine.stopAll();
    PianoEngine.clearHL();
    const playBtn = document.getElementById('play-btn');
    if (playBtn) playBtn.textContent = '▶';
  },

  stop() {
    this.pause();
    this.currentMeasure = 0;
    this._activeSection = null;
    this._refreshSectionHighlight();
    this._renderNotePanel(0);
  },

  _scheduleMeasure() {
    if (!this.isPlaying || !this.session) return;
    if (this.currentMeasure >= this.session.measures.length) {
      this.stop();
      return;
    }

    const measure = this.session.measures[this.currentMeasure];
    const beatSec = (60 / this.session.origBpm) / this.speedFactor;
    const measureBeats = 4;             // v1 fijo en 4/4
    const measureMs    = measureBeats * beatSec * 1000;
    this._measureStartAt = performance.now();

    // Activar highlight de sección
    if (this._activeSection !== measure.sectionKey) {
      this._activeSection = measure.sectionKey;
      this._refreshSectionHighlight();
    }
    this._refreshChordHighlight();

    // Update panel notes for this measure
    this._renderNotePanel(this.currentMeasure);

    // Encolar steps de esta medida.
    const steps = PianoEngine.computeSteps(measure);
    const audioBase = AudioEngine.now();
    // Geometría de las notas del compás para mover el playhead nota por nota.
    const geom = this._measureGeom(this.currentMeasure);

    steps.forEach((step, si) => {
      const offsetMs = step.beat * beatSec * 1000;
      const audioWhen = audioBase + step.beat * beatSec;
      // Filtrar por mano activa (bass = izquierda, treble/otro = derecha)
      const notes = step.notes.filter(n => this._handAllows(n));
      // Audio (sample-accurate) — solo la mano activa
      notes.forEach(n => {
        const dur = Math.max(0.15, n.duration * beatSec * 0.95);
        const vel = n.staff === 'bass' ? 0.55 : 0.7;
        AudioEngine.playNote(n.midi, dur, vel, audioWhen);
      });
      // Visual: el playhead avanza a CADA nota (sigue la posición aunque la
      // mano esté muteada); las teclas se iluminan solo para la mano activa.
      this._timers.push(setTimeout(() => {
        if (!this.isPlaying) return;
        this._movePlayhead(geom, si, steps.length, step.beat);
        if (notes.length) PianoEngine.highlightNotes(notes);
        else PianoEngine.clearHL();
      }, offsetMs));
    });

    // Metrónomo
    if (this.metronome) {
      for (let b = 0; b < measureBeats; b++) {
        const offsetMs = b * beatSec * 1000;
        this._timers.push(setTimeout(() => {
          if (!this.isPlaying) return;
          this._tickClick(b === 0);
        }, offsetMs));
      }
    }

    // Avanzar al siguiente compás
    this._timers.push(setTimeout(() => {
      if (!this.isPlaying) return;
      PianoEngine.clearHL();
      this.currentMeasure++;

      // Loop: target prioriza sección seleccionada por el usuario
      if (this.loopSection) {
        const targetKey = this._selectedSection || this._activeSection;
        if (targetKey) {
          const m = this.session.measures[this.currentMeasure];
          if (!m || m.sectionKey !== targetKey) {
            const sec = this.session.sections.find(s => s.key === targetKey);
            if (sec) this.currentMeasure = sec.startBar;
          }
        }
      }

      this._scheduleMeasure();
    }, measureMs));
  },

  _clearTimers() {
    this._timers.forEach(t => clearTimeout(t));
    this._timers = [];
  },

  _tickClick(accent) {
    // Click corto sintético — no necesita soundfont.
    AudioEngine.ensureCtx();
    const ctx = AudioEngine.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.frequency.value = accent ? 1600 : 1200;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(accent ? 0.18 : 0.12, ctx.currentTime + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
    osc.connect(g).connect(AudioEngine.master);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  },

  // ── Controles ───────────────────────────────────────────────────

  toggleSectionLoop() {
    this.loopSection = !this.loopSection;
    const btn = document.getElementById('loop-btn');
    if (btn) btn.classList.toggle('active', this.loopSection);
    App.toast(this.loopSection ? 'Loop de sección: ON' : 'Loop de sección: OFF');
  },

  toggleMetronome() {
    this.metronome = !this.metronome;
    const btn = document.getElementById('metronome-btn');
    if (btn) btn.classList.toggle('active', this.metronome);
  },

  // ¿Suena esta nota con la mano activa? bass = izquierda, resto = derecha.
  _handAllows(n) {
    if (this.handsMode === 'both') return true;
    if (this.handsMode === 'lh')   return n.staff === 'bass';
    return n.staff !== 'bass';   // 'rh'
  },

  // Cicla manos: ambas → derecha → izquierda → ambas.
  toggleHands() {
    const order = { both: 'rh', rh: 'lh', lh: 'both' };
    this.handsMode = order[this.handsMode] || 'both';
    this._refreshHandsBtn();
    const txt = { both: 'Ambas manos', rh: 'Solo mano derecha', lh: 'Solo mano izquierda' };
    App.toast(txt[this.handsMode]);
  },

  _refreshHandsBtn() {
    const btn = document.getElementById('hands-btn');
    if (!btn) return;
    const cfg = {
      both: { glyph: '♬', label: 'AMBAS' },
      rh:   { glyph: '✋', label: 'DERECHA' },
      lh:   { glyph: '🤚', label: 'IZQUIERDA' },
    }[this.handsMode];
    btn.firstChild.nodeValue = cfg.glyph;
    const small = btn.querySelector('small');
    if (small) small.textContent = cfg.label;
    btn.classList.toggle('active', this.handsMode !== 'both');
  },

  setSpeedFactor(f) {
    this.speedFactor = f;
  },

  // ── Row 1: secciones (scroll horizontal) ──────────────────────

  _renderSectionsRow() {
    const host = document.getElementById('sections-row');
    if (!host || !this.session) return;
    host.innerHTML = '';

    this.session.sections.forEach(sec => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'section-pill';
      pill.dataset.sectionKey = sec.key;
      pill.dataset.startBar   = sec.startBar;

      const chordsHtml = this.session.measures
        .slice(sec.startBar, sec.endBar + 1)
        .map((m, i) => {
          const absIdx = sec.startBar + i;
          return `<span class="section-pill-chord" data-measure="${absIdx}">${m.chord}</span>`;
        })
        .join('');

      const nBars = sec.endBar - sec.startBar + 1;
      pill.innerHTML = `
        <div class="section-pill-head">
          <strong>${sec.label}</strong>
          <span class="pill-bars">${nBars} c.</span>
        </div>
        <div class="section-pill-chords">${chordsHtml}</div>`;

      pill.addEventListener('click', () => this.selectSection(sec.key));
      host.appendChild(pill);
    });
  },

  // El usuario eligió una sección — saltar a su primer compás y marcarla
  // como target del loop si está activo.
  selectSection(key) {
    if (!this.session) return;
    const sec = this.session.sections.find(s => s.key === key);
    if (!sec) return;
    this._selectedSection = key;
    this.jumpToMeasure(sec.startBar);
    this._refreshSelectedHighlight();
  },

  _refreshSelectedHighlight() {
    document.querySelectorAll('.section-pill').forEach(p => {
      p.classList.toggle('selected', p.dataset.sectionKey === this._selectedSection);
    });
  },

  // Saltar a un compás específico (tap del usuario en pentagrama, pill,
  // o chord-label).
  jumpToMeasure(idx) {
    if (!this.session) return;
    if (idx < 0 || idx >= this.session.measures.length) return;
    this.currentMeasure = idx;
    const m = this.session.measures[idx];
    this._activeSection = m ? m.sectionKey : null;
    this._refreshSectionHighlight();
    this._refreshChordHighlight();
    this._renderNotePanel(idx);

    if (this.isPlaying) {
      // Reiniciar el schedule desde aquí
      this._clearTimers();
      AudioEngine.stopAll();
      PianoEngine.clearHL();
      this._scheduleMeasure();
    }
  },

  // ── Render del pentagrama (Verovio) ─────────────────────────────

  async _renderNotation() {
    const host    = document.getElementById('notation');
    const loading = document.getElementById('notation-loading');
    if (!host || !this.session) return;
    if (loading) loading.style.display = '';
    host.innerHTML = '';

    try {
      await NotationEngine.load();
    } catch (e) {
      console.error(e);
      if (loading) loading.textContent = 'No se pudo cargar Verovio (¿sin internet?)';
      App.toast('Sin internet: no se pudo cargar la partitura.', true);
      return;
    }

    const xml = SessionGenerator.toMusicXML(this.session);
    const svg = NotationEngine.render(xml, host, { width: host.clientWidth });
    if (loading) loading.style.display = 'none';
    if (!svg) return;

    // Click en cualquier <g class="measure"> = saltar a ese compás.
    // Usamos delegación en el host (#notation) y un flag para no
    // duplicar listeners en re-renders.
    if (!host._pfTapBound) {
      host.addEventListener('click', (e) => {
        const g = e.target.closest('g.measure');
        if (g && g.dataset.mindex !== undefined) {
          this.jumpToMeasure(parseInt(g.dataset.mindex, 10));
        }
      });
      host._pfTapBound = true;
    }

    // Mostrar el visor sobre el compás actual desde el inicio (siguiente
    // frame, para que los bounding boxes ya estén calculados).
    requestAnimationFrame(() => {
      NotationEngine.highlightMeasure(this.currentMeasure);
      this._positionMeasureCursor(this.currentMeasure);
    });
  },

  _refreshSectionHighlight() {
    // Resaltar la pill de sección activa en la fila superior
    document.querySelectorAll('.section-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.sectionKey === this._activeSection);
    });
    // Auto-scroll horizontal de la fila de secciones hacia la activa
    const activePill = document.querySelector('.section-pill.active');
    if (activePill && activePill.scrollIntoView) {
      activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    // Actualizar copy en la barra inferior
    const sec = this.session?.sections?.find(s => s.key === this._activeSection);
    if (sec) {
      const barSection = document.getElementById('bar-section');
      if (barSection) barSection.textContent = sec.label + ' · ' + (sec.note || '');
    }
  },

  _refreshChordHighlight() {
    // 1) Highlight del compás activo en el pentagrama (tiñe las notas)
    NotationEngine.highlightMeasure(this.currentMeasure);

    // 2) Visor: banda translúcida sobre el compás que se está tocando
    this._positionMeasureCursor(this.currentMeasure);

    // 3) Highlight del chord-chip correspondiente en la fila de secciones
    document.querySelectorAll('.section-pill-chord').forEach(c => {
      c.classList.toggle('active',
        parseInt(c.dataset.measure, 10) === this.currentMeasure);
    });

    // 4) Auto-scroll horizontal del pentagrama
    const sheetScroller = document.getElementById('sheet-frame');
    if (sheetScroller) this._scrollSheetToMeasure(sheetScroller, this.currentMeasure);
  },

  // ── Playhead (visor nota por nota) ──────────────────────────────
  //
  // El playhead es una barra vertical fina que vive DENTRO de #notation
  // (position:relative) para viajar con el SVG al hacer scroll horizontal.
  // Avanza a la posición x de cada nota dentro del compás activo.

  // Geometría del compás: posiciones x (centros de nota, ordenadas y
  // distintas) relativas a #notation, más la caja del compás.
  _measureGeom(idx) {
    const host = document.getElementById('notation');
    if (!host) return null;
    const g = host.querySelector(`g.measure[data-mindex="${idx}"]`);
    if (!g) return null;

    const hostRect = host.getBoundingClientRect();
    const gRect    = g.getBoundingClientRect();
    const left   = gRect.left - hostRect.left;
    const top    = gRect.top  - hostRect.top;
    const width  = gRect.width;
    const height = gRect.height;

    // Centros x de cada cabeza de nota (fallback a g.note). Agrupamos las
    // que coinciden (acordes / ambas manos) usando un umbral de ~4px.
    let heads = g.querySelectorAll('g.notehead');
    if (!heads.length) heads = g.querySelectorAll('g.note');
    const raw = [];
    heads.forEach(h => {
      const r = h.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      raw.push((r.left - hostRect.left) + r.width / 2);
    });
    raw.sort((a, b) => a - b);
    const xs = [];
    raw.forEach(x => {
      if (!xs.length || Math.abs(x - xs[xs.length - 1]) > 4) xs.push(x);
    });

    return { xs, left, top, width, height };
  },

  // Posiciona la barra del playhead en x (relativo a #notation).
  _setPlayhead(x, top, height) {
    const host = document.getElementById('notation');
    if (!host) return;
    let bar = host.querySelector('#pf-measure-cursor');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'pf-measure-cursor';
      bar.className = 'pf-measure-cursor';
      host.style.position = 'relative';
      host.insertBefore(bar, host.firstChild);
    }
    bar.style.left    = `${x}px`;
    bar.style.top     = `${top}px`;
    bar.style.height  = `${height}px`;
    bar.style.display = 'block';
  },

  // Mueve el playhead al step `si` del compás. Usa la posición real de la
  // nota cuando el nº de cabezas coincide con el nº de steps; si no, cae a
  // una interpolación por beat (siempre avanza nota por nota igualmente).
  _movePlayhead(geom, si, total, beat) {
    if (!geom) return;
    let x;
    if (geom.xs.length === total && geom.xs[si] !== undefined) {
      x = geom.xs[si];
    } else if (geom.xs.length && geom.xs[si] !== undefined) {
      x = geom.xs[si];
    } else {
      x = geom.left + (beat / 4) * geom.width;
    }
    this._setPlayhead(x, geom.top, geom.height);
  },

  // Coloca el playhead en la primera nota del compás (estado estático,
  // p.ej. al renderizar o al saltar de compás sin estar reproduciendo).
  _positionMeasureCursor(idx) {
    const geom = this._measureGeom(idx);
    if (!geom) return;
    const x = geom.xs.length ? geom.xs[0] : geom.left;
    this._setPlayhead(x, geom.top, geom.height);
  },

  // Scroll horizontal del sheet-frame para centrar el compás activo
  _scrollSheetToMeasure(scroller, idx) {
    const g = document.querySelector(`g.measure[data-mindex="${idx}"]`);
    if (!g) return;
    const sRect = scroller.getBoundingClientRect();
    const gRect = g.getBoundingClientRect();
    const target = (gRect.left - sRect.left) + scroller.scrollLeft
                 - sRect.width / 2 + gRect.width / 2;
    scroller.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  },

  _renderNotePanel(measureIdx) {
    if (!this.session) return;
    const m = this.session.measures[measureIdx];
    if (!m) return;

    const trebleEl = document.getElementById('panel-treble');
    const bassEl   = document.getElementById('panel-bass');
    if (!trebleEl || !bassEl) return;

    const uniqNames = (notes) => {
      const set = new Set();
      notes.forEach(n => set.add(PianoNotes.letter(n.midi)));
      return [...set];
    };

    const trebleNames = uniqNames(m.treble);
    const bassNames   = uniqNames(m.bass);

    trebleEl.innerHTML = trebleNames.length
      ? trebleNames.map(n => `<span class="note-chip treble">${n}</span>`).join('')
      : '<span class="note-chip rest">—</span>';
    bassEl.innerHTML = bassNames.length
      ? bassNames.map(n => `<span class="note-chip bass">${n}</span>`).join('')
      : '<span class="note-chip rest">—</span>';
  },

};
