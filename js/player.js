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
  _stepIdx: 0,           // step (ataque) actual dentro del compás — navegación manual
  isPlaying: false,
  metronome: false,
  loopSection: false,
  speedFactor: 1.0,
  handsMode: 'both',   // 'both' | 'rh' (derecha) | 'lh' (izquierda)

  _timers: [],
  _measureStartAt: 0,    // performance.now() del compás actual
  _pausedOffsetMs: 0,    // ms transcurridos dentro del compás al pausar (para reanudar exacto)
  _activeSection: null,   // sección donde está currentMeasure (auto)
  _selectedSection: null, // sección elegida por el usuario (target del loop)

  // ── Modo seguimiento (MIDI) ─────────────────────────────────────
  followActive: false,
  _pressed:  null,   // Set de midi presionados (se inicializa lazy)
  _correct:  null,   // Set de midi correctos para el step actual
  _heldPrev: null,   // notas sostenidas del step anterior (release+repress)
  _releaseTimers: null,
  _followTimer: null,
  _followStreak: 0,   // aciertos consecutivos (se reinicia con un fallo)
  _followHits: 0,     // total de aciertos en la sesión de seguimiento
  _followMisses: 0,   // total de notas incorrectas en la sesión de seguimiento

  // ── Carga e init ────────────────────────────────────────────────

  async loadSession(session) {
    this.stop();
    this.session = session;
    this.currentMeasure = 0;
    this._stepIdx = 0;
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
    // Re-asegurar el MIDI al entrar a un ejercicio: Chrome cierra los puertos al
    // navegar, así que los reabrimos para no perder la conexión.
    if (Storage.loadMidiFollow() && MidiEngine.access) MidiEngine.ensure();
    this._refreshFollowVisibility();
  },

  // ── Playback ────────────────────────────────────────────────────

  async togglePlay() {
    if (this.isPlaying) { this.pause(); return; }
    if (!this.session) return;

    // Asegurar audio listo (gesto del usuario abre AudioContext)
    AudioEngine.ensureCtx();
    try {
      const sound = Storage.loadSound();
      if (!AudioEngine.instrument || AudioEngine.instrument.name !== sound) {
        const playBtn = document.getElementById('play-btn');
        if (playBtn) playBtn.textContent = '…';
        await AudioEngine.loadInstrument(sound);
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

    // Conteo inicial (si está activado y empezamos desde el inicio de un compás).
    if (Storage.loadCountIn() && (this._pausedOffsetMs || 0) === 0) {
      this._playCountIn(() => this._scheduleMeasure());
    } else {
      this._scheduleMeasure();
    }
  },

  // Reproduce N clicks de metrónomo antes de arrancar la reproducción real.
  _playCountIn(done) {
    if (!this.session) { done(); return; }
    const beats   = 4; // 4/4
    const beatSec = (60 / this.session.origBpm) / this.speedFactor;
    const playBtn = document.getElementById('play-btn');
    for (let b = 0; b < beats; b++) {
      this._timers.push(setTimeout(() => {
        if (!this.isPlaying) return;
        this._tickClick(b === 0);
        if (playBtn) playBtn.textContent = String(beats - b); // 4,3,2,1
      }, b * beatSec * 1000));
    }
    this._timers.push(setTimeout(() => {
      if (!this.isPlaying) return;
      if (playBtn) playBtn.textContent = '⏸';
      done();
    }, beats * beatSec * 1000));
  },

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this._clearTimers();
    AudioEngine.stopAll();
    // Guardar la posición exacta dentro del compás para reanudar desde ahí.
    if (this.session) {
      const beatSec    = (60 / this.session.origBpm) / this.speedFactor;
      const measureMs  = 4 * beatSec * 1000;
      const elapsed    = performance.now() - this._measureStartAt;
      this._pausedOffsetMs = Math.min(Math.max(0, elapsed), measureMs);
    }
    // NO limpiamos el resaltado del piano: al pausar queremos seguir viendo
    // qué teclas se están tocando para ubicarnos.
    const playBtn = document.getElementById('play-btn');
    if (playBtn) playBtn.textContent = '▶';
  },

  stop() {
    this.pause();
    if (this.followActive) this.stopFollow();
    PianoEngine.clearHL();      // stop sí limpia (salir/recargar sesión)
    this.currentMeasure = 0;
    this._stepIdx = 0;
    this._pausedOffsetMs = 0;
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

    // Reanudar desde la posición exacta donde se pausó (0 en un compás nuevo).
    const startOffsetMs = Math.min(this._pausedOffsetMs || 0, measureMs);
    this._pausedOffsetMs = 0;
    // Referencia coherente: como si el compás hubiese empezado hace startOffsetMs.
    this._measureStartAt = performance.now() - startOffsetMs;

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

    // Al reanudar a mitad de compás, _refreshChordHighlight() ya recolocó el
    // playhead en el beat 0; lo movemos al step que corresponde al offset
    // para que visualmente reanude exactamente donde se pausó.
    if (startOffsetMs > 0 && geom && steps.length) {
      let si = 0;
      for (let i = 0; i < steps.length; i++) {
        if (steps[i].beat * beatSec * 1000 <= startOffsetMs + 1) si = i;
      }
      this._stepIdx = si;
      this._movePlayhead(geom, si, steps.length, steps[si].beat);
    }

    steps.forEach((step, si) => {
      const offsetMs = step.beat * beatSec * 1000;
      const delay    = offsetMs - startOffsetMs;
      if (delay < 0) return;            // step ya tocado antes de la pausa
      const audioWhen = audioBase + delay / 1000;
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
        this._stepIdx = si;
        this._movePlayhead(geom, si, steps.length, step.beat);
        if (notes.length) PianoEngine.highlightNotes(notes);
        else PianoEngine.clearHL();
      }, delay));
    });

    // Metrónomo
    if (this.metronome) {
      for (let b = 0; b < measureBeats; b++) {
        const delay = b * beatSec * 1000 - startOffsetMs;
        if (delay < 0) continue;        // click ya pasado antes de la pausa
        this._timers.push(setTimeout(() => {
          if (!this.isPlaying) return;
          this._tickClick(b === 0);
        }, delay));
      }
    }

    // Avanzar al siguiente compás
    this._timers.push(setTimeout(() => {
      if (!this.isPlaying) return;
      PianoEngine.clearHL();
      this.currentMeasure++;
      this._stepIdx = 0;

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
    }, measureMs - startOffsetMs));
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
    this._applyHandsDimming();
    const txt = { both: 'Ambas manos', rh: 'Solo mano derecha', lh: 'Solo mano izquierda' };
    App.toast(txt[this.handsMode]);
  },

  // Atenúa visualmente en el pentagrama la mano desactivada (clave + pauta).
  // staff 1 = treble (derecha), staff 2 = bass (izquierda).
  _applyHandsDimming() {
    const host = document.getElementById('notation');
    if (!host) return;
    host.querySelectorAll('g.staff.pf-hand-off').forEach(s => s.classList.remove('pf-hand-off'));
    if (this.handsMode === 'both') return;
    const dimBass = this.handsMode === 'rh';   // si toco derecha, apago bajo
    host.querySelectorAll('g.measure').forEach(m => {
      const staves = m.querySelectorAll('g.staff');
      const off = dimBass ? staves[1] : staves[0];
      if (off) off.classList.add('pf-hand-off');
    });
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
          const lbl = (m.chordSegs && m.chordSegs.length)
            ? m.chordSegs.map(s => s.label).join(' ')
            : m.chord;
          return `<span class="section-pill-chord" data-measure="${absIdx}">${lbl}</span>`;
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
    this._stepIdx = 0;
    this._pausedOffsetMs = 0;
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

  // ── Modo seguimiento (MIDI) ─────────────────────────────────────
  //
  // El playhead espera en cada step hasta que el alumno toque las notas
  // correctas (ambas manos del step) en su teclado MIDI. Al completarlas,
  // avanza al siguiente step/compás. Portado del modo follow de KeyPlay.

  _ensureFollowSets() {
    if (!this._pressed)       this._pressed = new Set();
    if (!this._correct)       this._correct = new Set();
    if (!this._heldPrev)      this._heldPrev = new Set();
    if (!this._releaseTimers) this._releaseTimers = {};
  },

  toggleFollow() {
    if (this.followActive) { this.stopFollow(); return; }
    this.startFollow();
  },

  startFollow() {
    if (!this.session) return;
    // Re-asegurar puertos antes de comprobar: pudieron cerrarse al navegar.
    if (MidiEngine.access) MidiEngine.ensure();
    if (!MidiEngine.input) { App.toast('Conecta un teclado MIDI primero', true); return; }
    if (this.isPlaying) this.pause();
    AudioEngine.ensureCtx();
    AudioEngine.loadInstrument(Storage.loadSound()).catch(() => {});
    this._ensureFollowSets();
    this.followActive = true;
    this._pressed.clear();
    this._correct.clear();
    this._heldPrev.clear();
    this._stepIdx = 0;
    this._followStreak = 0;
    this._followHits = 0;
    this._followMisses = 0;
    this._refreshFollowBtn();
    this._showFollowHud(true);
    this._refreshFollowHud();
    this._followShowStep();
    App.toast('Seguimiento activado — toca las notas resaltadas');
  },

  stopFollow() {
    this.followActive = false;
    if (this._followTimer) { clearTimeout(this._followTimer); this._followTimer = null; }
    if (this._releaseTimers) { Object.values(this._releaseTimers).forEach(t => clearTimeout(t)); this._releaseTimers = {}; }
    if (this._correct) this._correct.clear();
    if (this._heldPrev) this._heldPrev.clear();
    this._showFollowHud(false);
    this._refreshFollowBtn();
  },

  // ── HUD de seguimiento (racha de aciertos + fallos) ──────────────
  _showFollowHud(show) {
    const hud = document.getElementById('follow-hud');
    if (hud) hud.hidden = !show;
  },

  _refreshFollowHud() {
    const h = document.getElementById('follow-hits');
    const s = document.getElementById('follow-streak');
    const m = document.getElementById('follow-misses');
    if (h) h.textContent = this._followHits;
    if (s) s.textContent = this._followStreak;
    if (m) m.textContent = this._followMisses;
    const hud = document.getElementById('follow-hud');
    if (hud) {
      // Resaltar récord de racha brevemente
      hud.classList.toggle('on-streak', this._followStreak >= 5);
    }
  },

  _refreshFollowBtn() {
    const btn = document.getElementById('follow-btn');
    if (!btn) return;
    btn.classList.toggle('active', this.followActive);
  },

  // Muestra el botón Seguir solo si el MIDI está activado y hay dispositivo.
  _refreshFollowVisibility() {
    const btn = document.getElementById('follow-btn');
    if (!btn) return;
    const ok = Storage.loadMidiFollow() && !!MidiEngine.input;
    btn.hidden = !ok;
    if (!ok && this.followActive) this.stopFollow();
  },

  // Conjunto de midi requeridos en el step actual (respeta el selector de manos).
  _followRequired() {
    if (!this.session) return new Set();
    const measure = this.session.measures[this.currentMeasure];
    if (!measure) return new Set();
    const steps = PianoEngine.computeSteps(measure);
    const step  = steps[this._stepIdx];
    if (!step) return new Set();
    return new Set(step.notes.filter(n => this._handAllows(n)).map(n => n.midi));
  },

  // Muestra el step actual: playhead + notas esperadas resaltadas.
  _followShowStep() {
    const measure = this.session.measures[this.currentMeasure];
    if (!measure) return;
    const steps = PianoEngine.computeSteps(measure);
    const step  = steps[this._stepIdx];
    if (!step) return;
    this._syncMeasureUI(this.currentMeasure);
    const geom = this._measureGeom(this.currentMeasure);
    this._movePlayhead(geom, this._stepIdx, steps.length, step.beat);
    const notes = step.notes.filter(n => this._handAllows(n));
    PianoEngine.highlightNotes(notes);
    // Marcar en verde las que ya estén correctamente sostenidas.
    this._correct.forEach(m => PianoEngine.markCorrect(m));
  },

  followNoteOn(note) {
    this._ensureFollowSets();
    this._pressed.add(note);
    this._previewMidi(note);
    if (!this.followActive) return;

    // Nota sostenida del step anterior: ignorar (retrigger de pianos tipo Casio).
    if (this._heldPrev.has(note)) {
      if (this._releaseTimers[note]) { clearTimeout(this._releaseTimers[note]); delete this._releaseTimers[note]; }
      return;
    }

    const required = this._followRequired();
    if (!required.size) { this._scheduleFollowAdvance(); return; }

    if (required.has(note)) {
      // Acierto: solo cuenta la primera vez que se pulsa correctamente.
      if (!this._correct.has(note)) {
        this._followStreak++;
        this._followHits++;
        this._refreshFollowHud();
      }
      PianoEngine.markCorrect(note);
      this._correct.add(note);
    } else {
      // Fallo: nota fuera del step. Romper racha, contar y destellar.
      this._followMisses++;
      this._followStreak = 0;
      this._refreshFollowHud();
      PianoEngine.flashWrong(note);
      return; // no avanza
    }

    if (this._followStepComplete(required)) this._scheduleFollowAdvance();
  },

  followNoteOff(note) {
    this._ensureFollowSets();
    this._pressed.delete(note);
    if (this._heldPrev.has(note)) {
      if (this._releaseTimers[note]) clearTimeout(this._releaseTimers[note]);
      this._releaseTimers[note] = setTimeout(() => {
        this._heldPrev.delete(note);
        delete this._releaseTimers[note];
      }, 80);
    } else if (this._releaseTimers[note]) {
      clearTimeout(this._releaseTimers[note]); delete this._releaseTimers[note];
    }
    if (this.followActive) PianoEngine.clearCorrect(note);
  },

  _followStepComplete(required = this._followRequired()) {
    if (!required.size) return true;
    return [...required].every(m => this._correct.has(m) && this._pressed.has(m));
  },

  _scheduleFollowAdvance() {
    if (this._followTimer) return;
    this._followTimer = setTimeout(() => {
      this._followTimer = null;
      if (this.followActive) this._followAdvance();
    }, 90);
  },

  _followAdvance() {
    if (!this.followActive) return;
    // Las notas aún sostenidas deben soltarse y volver a pulsarse en el próximo step.
    this._heldPrev = new Set(this._pressed);
    this._correct.clear();

    const steps = PianoEngine.computeSteps(this.session.measures[this.currentMeasure]);
    const atLastStep    = this._stepIdx >= steps.length - 1;
    const atLastMeasure = this.currentMeasure >= this.session.measures.length - 1;

    if (!atLastStep) {
      this._stepIdx++;
    } else if (!atLastMeasure) {
      this.currentMeasure++;
      this._stepIdx = 0;
    } else {
      // Fin del ejercicio: detener seguimiento y devolver el selector al inicio.
      PianoEngine.clearHL();
      this.stopFollow();
      this.currentMeasure = 0;
      this._stepIdx = 0;
      this._activeSection = null;
      this._syncMeasureUI(0);
      const geom0  = this._measureGeom(0);
      const steps0 = PianoEngine.computeSteps(this.session.measures[0]);
      if (steps0[0]) this._movePlayhead(geom0, 0, steps0.length, steps0[0].beat);
      App.toast('¡Ejercicio completado! 🎉');
      return;
    }
    this._followShowStep();
  },

  // Suena la nota tocada por MIDI a través del piano de la app.
  _previewMidi(note) {
    if (!Storage.loadMidiSound()) return;
    if (!AudioEngine.instrument) return;
    AudioEngine.playNote(note, 0.6, 0.65, AudioEngine.now());
  },

  // ── Navegación manual por pasos (nota a nota del pentagrama) ────────
  //
  // Permite recorrer cada ataque del pentagrama con control total, ideal
  // para estudiar. Mueve el playhead, ilumina las teclas y suena el step.
  // Se controla con los botones ⏮/⏭ y las flechas ← → del teclado.

  stepForward() { this._manualStep(+1); },
  stepBack()    { this._manualStep(-1); },

  _manualStep(dir) {
    if (!this.session) return;
    if (this.isPlaying) this.pause();   // navegación manual ⇒ pausa el playback

    let steps = PianoEngine.computeSteps(this.session.measures[this.currentMeasure]);
    let next  = (this._stepIdx || 0) + dir;

    if (next >= steps.length) {
      // Pasar al siguiente compás
      if (this.currentMeasure + 1 < this.session.measures.length) {
        this.currentMeasure++;
        this._syncMeasureUI(this.currentMeasure);
        steps = PianoEngine.computeSteps(this.session.measures[this.currentMeasure]);
        next = 0;
      } else {
        next = steps.length - 1;        // ya en el último step
      }
    } else if (next < 0) {
      // Retroceder al compás anterior
      if (this.currentMeasure > 0) {
        this.currentMeasure--;
        this._syncMeasureUI(this.currentMeasure);
        steps = PianoEngine.computeSteps(this.session.measures[this.currentMeasure]);
        next = steps.length - 1;
      } else {
        next = 0;                       // ya en el primer step
      }
    }

    this._stepIdx = next;
    this._pausedOffsetMs = 0;   // tras navegar manualmente, reanudar arranca limpio
    this._applyStep(steps, next);
  },

  // Actualiza la UI de compás (sección, acorde, panel, scroll) sin tocar
  // el schedule ni el _stepIdx. Lo usa la navegación por pasos.
  _syncMeasureUI(idx) {
    if (this._activeSection !== this.session.measures[idx]?.sectionKey) {
      this._activeSection = this.session.measures[idx].sectionKey;
      this._refreshSectionHighlight();
    }
    this._refreshChordHighlight();
    this._renderNotePanel(idx);
  },

  // Aplica visual + audio del step `si` del compás actual.
  _applyStep(steps, si) {
    const step = steps[si];
    if (!step) return;

    // Playhead a la posición real de la nota
    const geom = this._measureGeom(this.currentMeasure);
    this._movePlayhead(geom, si, steps.length, step.beat);

    // Iluminar teclas de la(s) mano(s) activa(s) y sonar el step
    const notes = step.notes.filter(n => this._handAllows(n));
    if (notes.length) {
      PianoEngine.highlightNotes(notes);
      this._previewNotes(notes);
    } else {
      PianoEngine.clearHL();
    }
  },

  // Suena un conjunto de notas inmediatamente (si el instrumento ya cargó).
  // Dispara una carga en segundo plano la primera vez para los próximos pasos.
  _previewNotes(notes) {
    AudioEngine.ensureCtx();
    if (!AudioEngine.instrument) {
      AudioEngine.loadInstrument(Storage.loadSound()).catch(() => {});
      return;   // este paso queda sin sonido; los siguientes ya sonarán
    }
    const beatSec = (60 / this.session.origBpm) / this.speedFactor;
    const when = AudioEngine.now();
    notes.forEach(n => {
      const dur = Math.max(0.2, n.duration * beatSec * 0.95);
      const vel = n.staff === 'bass' ? 0.55 : 0.7;
      AudioEngine.playNote(n.midi, dur, vel, when);
    });
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
      this._applyHandsDimming();
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
    const width  = gRect.width;

    // Altura del playhead: abarcar de la primera a la última pauta (g.staff),
    // que es constante entre compases (a diferencia de la caja de glifos).
    let top    = gRect.top - hostRect.top;
    let height = gRect.height;
    const staves = g.querySelectorAll('g.staff');
    if (staves.length) {
      let minTop = Infinity, maxBot = -Infinity;
      staves.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.height === 0) return;
        minTop = Math.min(minTop, r.top - hostRect.top);
        maxBot = Math.max(maxBot, r.bottom - hostRect.top);
      });
      if (minTop !== Infinity) { top = minTop; height = maxBot - minTop; }
    }

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

    this._renderInversionBadge(m);
  },

  // Solo para la técnica de Inversiones: detecta si el acorde del compás
  // suena en posición fundamental, 1ª o 2ª inversión (según qué nota del
  // acorde queda como más grave) y lo muestra en el panel.
  _renderInversionBadge(m) {
    const badge = document.getElementById('panel-inversion');
    if (!badge) return;

    const meta = this.session && this.session.meta;
    const isInv = meta && meta.techniqueKey === 'inversions';
    if (!isInv || !m.bass || !m.bass.length) { badge.hidden = true; return; }

    const label = (m.chord || '').split(' ')[0];
    const text  = this._inversionOf(label, m.bass[0].midi);
    if (!text) { badge.hidden = true; return; }

    badge.textContent = text;
    badge.className = 'inv-badge' + (text === 'Fundamental' ? '' : ' inverted');
    badge.hidden = false;
  },

  // Devuelve 'Fundamental' | '1ª inversión' | '2ª inversión' comparando la
  // clase de altura de la nota más grave contra raíz / 3ª / 5ª del acorde.
  _inversionOf(chordLabel, bassMidi) {
    const c = ChordLibrary.get(chordLabel);
    if (!c) return null;
    const rootPc  = ((c.rootBass % 12) + 12) % 12;
    const isMinor = /m$/.test(chordLabel) && !/maj/i.test(chordLabel);
    const thirdPc = (rootPc + (isMinor ? 3 : 4)) % 12;
    const fifthPc = (rootPc + 7) % 12;
    const bassPc  = ((bassMidi % 12) + 12) % 12;
    if (bassPc === rootPc)  return 'Fundamental';
    if (bassPc === thirdPc) return '1ª inversión';
    if (bassPc === fifthPc) return '2ª inversión';
    return null;
  },

};
