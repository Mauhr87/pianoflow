/**
 * PianoFlow — App controller  (Fase 3: mode-first + biblioteca)
 *
 * Flujo:
 *   Home (5 modos)  →  Modo (lista de ítems)  →  Player
 *
 * No hay pantalla de "config". Cada ítem es una pista pre-armada del
 * manifest (modo × técnica × estilo × nivel). El progreso por ítem se
 * persiste con ProgressStorage.
 */

const App = {

  // Estado actual
  currentMode:      null,   // key de modo abierto
  currentPractice:  null,   // ítem del manifest activo
  techniqueFilter:  'all',  // tab de técnica activa en la pantalla de modo

  _speedSteps: [1.0, 0.85, 0.7, 0.5],
  _speedIdx:   0,

  // ── Init ────────────────────────────────────────────────────────

  init() {
    const pianoEl = document.getElementById('piano');
    if (pianoEl) PianoEngine.init(pianoEl);

    PracticeLibrary.buildManifest();

    this.renderModes();
    this.goHome();
    this._refreshSpeedBtn();
    this._initSettings();
    this._bindKeyboard();
  },

  // Flechas del teclado para navegar por pasos en el player; espacio = play/pausa.
  _bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      const drawer = document.getElementById('settings-drawer');
      if (drawer && drawer.classList.contains('open')) {
        if (e.key === 'Escape') { e.preventDefault(); this.closeSettings(); }
        return;
      }
      const modal = document.getElementById('info-modal');
      if (modal && !modal.hidden) {
        if (e.key === 'Escape') { e.preventDefault(); this.closeInfo(); }
        return;
      }
      const player = document.getElementById('screen-player');
      if (!player || !player.classList.contains('active')) return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight')      { e.preventDefault(); Player.stepForward(); }
      else if (e.key === 'ArrowLeft')  { e.preventDefault(); Player.stepBack(); }
      else if (e.key === ' ')          { e.preventDefault(); Player.togglePlay(); }
    });
  },

  // ── Navegación ─────────────────────────────────────────────────

  _show(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);
  },

  goHome() {
    this.currentPractice = null;
    Player.stop();
    const bar = document.getElementById('player-bar');
    if (bar) bar.hidden = true;
    document.body.classList.remove('player-open');
    this._renderQuickAccess();     // Seguir practicando + favoritos
    this.renderModes();            // refrescar barras de progreso
    this._show('screen-home');
  },

  // ── Home: acceso rápido (continuar + favoritos) ────────────────
  _renderQuickAccess() {
    const host = document.getElementById('quick-access');
    if (!host) return;

    // Tarjeta "Seguir practicando"
    const lastId = Storage.loadLastExercise();
    const last   = lastId ? PracticeLibrary.byId(lastId) : null;
    const contHost = document.getElementById('qa-continue');
    if (contHost) {
      if (last) {
        const mode = PracticeLibrary.getMode(last.mode);
        const done = ProgressStorage.isCompleted(last.id);
        contHost.innerHTML = `
          <button type="button" class="qa-card qa-cont-card" data-id="${last.id}">
            <span class="qa-eyebrow">Seguir practicando</span>
            <span class="qa-cont-title">${last.techIcon || (mode && mode.icon) || '🎵'} ${last.title}</span>
            <span class="qa-cont-sub">${mode ? mode.label : ''}${done ? ' · ✓ completada' : ''}</span>
          </button>`;
        contHost.querySelector('.qa-cont-card').onclick = () => this.startPractice(last.id);
        contHost.hidden = false;
      } else {
        contHost.innerHTML = '';
        contHost.hidden = true;
      }
    }

    // Tira de favoritos
    const favHost = document.getElementById('qa-favs');
    if (favHost) {
      const favs = Storage.favorites()
        .map(id => PracticeLibrary.byId(id))
        .filter(Boolean);
      if (favs.length) {
        const countBadge = favs.length > 3 ? `<span class="qa-fav-count">${favs.length}</span>` : '';
        favHost.innerHTML = `<span class="qa-eyebrow">★ Favoritos${countBadge}</span>
          <div class="qa-fav-row">${favs.map(p =>
            `<button type="button" class="qa-fav-chip" data-id="${p.id}">${p.techIcon || '🎵'} ${p.title}</button>`
          ).join('')}</div>`;
        favHost.querySelectorAll('.qa-fav-chip').forEach(c =>
          c.onclick = () => this.startPractice(c.dataset.id));
        favHost.hidden = false;
      } else {
        favHost.innerHTML = '';
        favHost.hidden = true;
      }
    }

    // Ocultar todo el bloque si no hay nada que mostrar.
    const anyCont = contHost && !contHost.hidden;
    const anyFav  = favHost && !favHost.hidden;
    host.hidden = !(anyCont || anyFav);
  },

  // ── Home: cards de modos ───────────────────────────────────────

  renderModes() {
    const grid = document.getElementById('mode-grid');
    if (!grid) return;
    grid.innerHTML = '';

    Object.entries(PracticeLibrary.modes).forEach(([key, mode]) => {
      const ids       = PracticeLibrary.forMode(key).map(p => p.id);
      const total     = ids.length;
      const done       = ProgressStorage.countFor(ids);
      const pct        = total ? Math.round((done / total) * 100) : 0;
      const techCount  = PracticeLibrary.techniqueCount(key);
      const ready      = PracticeLibrary.modeReady(key);

      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'mode-card' + (ready ? '' : ' is-pending');

      if (ready) {
        card.innerHTML = `
          <span class="mode-icon">${mode.icon}</span>
          <span class="mode-body">
            <span class="mode-title">${mode.label}</span>
            <span class="mode-desc">${mode.desc}</span>
            <span class="mode-meta">${techCount} técnicas · ${total} ejercicios</span>
            <span class="progress-track"><span class="progress-fill" style="width:${pct}%"></span></span>
            <span class="progress-text">${done} / ${total} completados</span>
          </span>`;
      } else {
        const tag = mode.comingSoon ? 'Próximamente' : 'En construcción';
        card.innerHTML = `
          <span class="mode-icon">${mode.icon}</span>
          <span class="mode-body">
            <span class="mode-title">${mode.label}</span>
            <span class="mode-desc">${mode.desc}</span>
            <span class="mode-meta pending">${tag}</span>
          </span>`;
      }
      card.onclick = () => this.openMode(key);
      grid.appendChild(card);
    });
  },

  // ── Pantalla Modo: lista de prácticas ──────────────────────────

  openMode(key, techniqueFilter) {
    const mode = PracticeLibrary.getMode(key);
    if (!mode) return;

    this.currentMode = key;
    this.techniqueFilter = techniqueFilter || 'all';

    document.getElementById('mode-head-icon').textContent  = mode.icon;
    document.getElementById('mode-head-title').textContent = mode.label;
    document.getElementById('mode-head-desc').textContent  = mode.desc;

    this._renderTechniqueTabs();
    this._renderItemList();
    this._show('screen-mode');
  },

  // Tabs: Todos + una por técnica del módulo
  _renderTechniqueTabs() {
    const host = document.getElementById('technique-tabs');
    if (!host) return;
    const mode = PracticeLibrary.getMode(this.currentMode);
    if (!mode || !PracticeLibrary.modeReady(this.currentMode)) { host.innerHTML = ''; return; }

    let html = `<button class="filter-pill ${this.techniqueFilter === 'all' ? 'active' : ''}" data-tech="all">Todos</button>`;
    Object.entries(mode.techniques).forEach(([techKey, tech]) => {
      if (!(tech.exercises || []).length) return;
      const active = this.techniqueFilter === techKey ? 'active' : '';
      html += `<button class="filter-pill ${active}" data-tech="${techKey}">${tech.icon} ${tech.label}</button>`;
    });
    host.innerHTML = html;

    host.querySelectorAll('.filter-pill').forEach(b => {
      b.onclick = () => this.filterByTechnique(b.dataset.tech);
    });
  },

  filterByTechnique(techKey) {
    this.techniqueFilter = techKey;
    document.querySelectorAll('#technique-tabs .filter-pill').forEach(b =>
      b.classList.toggle('active', b.dataset.tech === techKey));
    this._renderItemList();
  },

  _updateModeProgress() {
    const ids   = PracticeLibrary.forMode(this.currentMode).map(p => p.id);
    const total = ids.length;
    const done  = ProgressStorage.countFor(ids);
    const pct   = total ? Math.round((done / total) * 100) : 0;
    const fill  = document.getElementById('mode-head-fill');
    const text  = document.getElementById('mode-head-progress-text');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = `${done} / ${total} completadas`;
  },

  _renderItemList() {
    const host = document.getElementById('item-list');
    if (!host || !this.currentMode) return;

    const mode = PracticeLibrary.getMode(this.currentMode);

    // Módulo sin contenido todavía
    if (!PracticeLibrary.modeReady(this.currentMode)) {
      const tag = mode.comingSoon
        ? 'Este módulo estará disponible pronto.'
        : 'El currículum de este módulo aún está por integrarse.';
      host.innerHTML = `<div class="empty-mode"><span class="empty-icon">${mode.icon}</span><p>${tag}</p></div>`;
      this._updateModeProgress();
      return;
    }

    let items = PracticeLibrary.forMode(this.currentMode);
    if (this.techniqueFilter !== 'all') {
      items = items.filter(p => p.technique === this.techniqueFilter);
    }

    this._updateModeProgress();

    // Técnicas en juego (respetando orden de definición del módulo)
    const techKeys = Object.keys(mode.techniques)
      .filter(tk => items.some(p => p.technique === tk));

    let html = '';
    techKeys.forEach(techKey => {
      const tech   = PracticeLibrary.getTechnique(this.currentMode, techKey);
      const subset = items.filter(p => p.technique === techKey);
      if (!subset.length) return;

      html += `<div class="item-group-label">${tech.icon} ${tech.label}</div>`;

      // Subgrupos por nivel
      PracticeLibrary.levelOrder.forEach(level => {
        const byLevel = subset.filter(p => p.level === level);
        if (!byLevel.length) return;
        const diff = PracticeLibrary.getDifficulty(level);
        html += `<div class="level-subhead">${diff.label}</div>`;
        byLevel.forEach(p => html += this._itemCardHtml(p));
      });
    });

    host.innerHTML = html;

    host.querySelectorAll('.item-card').forEach(card => {
      const id = card.dataset.id;
      card.querySelector('.ic-check').onclick = (e) => {
        e.stopPropagation();
        this.toggleComplete(id);
      };
      const favBtn = card.querySelector('.ic-fav');
      if (favBtn) favBtn.onclick = (e) => { e.stopPropagation(); this.toggleFavorite(id); };
      card.querySelector('.ic-main').onclick = () => this.startPractice(id);
    });
  },

  _itemCardHtml(p) {
    const done = ProgressStorage.isCompleted(p.id);
    const fav  = Storage.isFavorite(p.id);
    const sub  = `${p.bars} compases · ${p.bpm} BPM`;
    return `
      <div class="item-card ${done ? 'done' : ''}" data-id="${p.id}">
        <button type="button" class="ic-main">
          <span class="ic-icon">${p.techIcon || p.icon || '🎵'}</span>
          <span class="ic-body">
            <span class="ic-title">${p.n}. ${p.title}</span>
            <span class="ic-sub">${sub}</span>
          </span>
        </button>
        <button type="button" class="ic-fav ${fav ? 'on' : ''}" title="${fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}" aria-label="Favorito">${fav ? '★' : '☆'}</button>
        <button type="button" class="ic-check" title="${done ? 'Quitar marca' : 'Marcar completado'}" aria-label="Completado">
          <span class="check-ring">${done ? '✓' : ''}</span>
        </button>
      </div>`;
  },

  toggleComplete(id) {
    ProgressStorage.toggle(id);
    this._renderItemList();
  },

  // Alterna favorito desde la lista. Refresca la tarjeta afectada.
  toggleFavorite(id) {
    const fav = Storage.toggleFavorite(id);
    this.toast(fav ? 'Añadido a favoritos ★' : 'Quitado de favoritos');
    const btn = document.querySelector(`.item-card[data-id="${id}"] .ic-fav`);
    if (btn) {
      btn.classList.toggle('on', fav);
      btn.textContent = fav ? '★' : '☆';
      btn.title = fav ? 'Quitar de favoritos' : 'Añadir a favoritos';
    }
    // Si está abierto el player con este ejercicio, sincronizar su estrella.
    if (this.currentPractice && this.currentPractice.id === id) this._refreshFavBtn();
  },

  // Estrella en el header del player.
  toggleCurrentFavorite() {
    if (!this.currentPractice) return;
    Storage.toggleFavorite(this.currentPractice.id);
    this._refreshFavBtn();
  },

  _refreshFavBtn() {
    const btn = document.getElementById('fav-btn');
    if (!btn || !this.currentPractice) return;
    const fav = Storage.isFavorite(this.currentPractice.id);
    btn.classList.toggle('on', fav);
    btn.textContent = fav ? '★' : '☆';
    btn.title = fav ? 'Quitar de favoritos' : 'Añadir a favoritos';
  },

  // ── Player: arrancar una práctica del manifest ─────────────────

  startPractice(practiceId) {
    const item = PracticeLibrary.byId(practiceId);
    if (!item) { this.toast('Práctica no encontrada', true); return; }
    this.currentPractice = item;
    this.currentMode = item.mode;   // por si se abrió desde "Seguir practicando"
    Storage.saveLastExercise(item.id);

    try {
      const session = SessionGenerator.generate({
        mode:       item.mode,
        technique:  item.technique,
        pattern:    item.pattern,
        style:      item.style,
        difficulty: item.difficulty,
        bpm:        item.bpm,
        // Datos del ejercicio del currículum (usados por la ruta fiel)
        n:          item.n,
        title:      item.title,
        song:       item.song,
        chords:     item.chords,
        bars:       item.bars,
        explain:    item.explain,
        meta:       item.meta,
      });
      Player.loadSession(session);
      this._refreshCompleteBtn();
      this._refreshFavBtn();
      this._refreshExNav();
      this._show('screen-player');
    } catch (e) {
      console.error(e);
      this.toast('No se pudo generar la sesión: ' + e.message, true);
    }
  },

  _siblings() {
    const p = this.currentPractice;
    if (!p) return [];
    return PracticeLibrary.forTechnique(p.mode, p.technique);
  },

  _refreshExNav() {
    const sibs = this._siblings();
    const idx  = this.currentPractice ? sibs.findIndex(s => s.id === this.currentPractice.id) : -1;
    const prev = document.getElementById('prev-ex');
    const next = document.getElementById('next-ex');
    if (prev) prev.disabled = idx <= 0;
    if (next) next.disabled = idx < 0 || idx >= sibs.length - 1;
  },

  gotoSibling(dir) {
    const sibs = this._siblings();
    const idx  = this.currentPractice ? sibs.findIndex(s => s.id === this.currentPractice.id) : -1;
    const target = sibs[idx + dir];
    if (target) { Player.stop(); this.startPractice(target.id); }
  },

  markCurrentComplete() {
    if (!this.currentPractice) return;
    ProgressStorage.toggle(this.currentPractice.id);
    this._refreshCompleteBtn();
    const done = ProgressStorage.isCompleted(this.currentPractice.id);
    if (!done) { this.toast('Marca quitada'); return; }

    // Celebración + avance automático al siguiente ejercicio de la técnica.
    this.celebrate();
    const sibs = this._siblings();
    const idx  = sibs.findIndex(s => s.id === this.currentPractice.id);
    if (idx >= 0 && idx < sibs.length - 1) {
      setTimeout(() => { Player.stop(); this.startPractice(sibs[idx + 1].id); }, 1200);
    } else {
      this.toast('¡Completaste la última de esta técnica! 🎉');
    }
  },

  // Overlay breve de felicitación al completar un ejercicio.
  celebrate() {
    const el = document.getElementById('celebrate');
    if (!el) { this.toast('¡Completada! 🎉'); return; }
    el.hidden = false;
    el.classList.remove('show');
    // reflow para reiniciar la animación
    void el.offsetWidth;
    el.classList.add('show');
    setTimeout(() => { el.classList.remove('show'); el.hidden = true; }, 1300);
  },

  _refreshCompleteBtn() {
    const btn = document.getElementById('complete-btn');
    if (!btn || !this.currentPractice) return;
    const done = ProgressStorage.isCompleted(this.currentPractice.id);
    btn.classList.toggle('done', done);
    btn.innerHTML = done ? '✓ Completada' : 'Marcar completada';
  },

  exitSession() {
    Player.stop();
    const bar = document.getElementById('player-bar');
    if (bar) bar.hidden = true;
    document.body.classList.remove('player-open');
    const tech = this.currentPractice && this.currentPractice.technique;
    if (this.currentMode) this.openMode(this.currentMode, tech);
    else this.goHome();
  },

  toggleSpeed() {
    this._speedIdx = (this._speedIdx + 1) % this._speedSteps.length;
    Player.setSpeedFactor(this._speedSteps[this._speedIdx]);
    this._refreshSpeedBtn();
  },

  _refreshSpeedBtn() {
    const btn = document.getElementById('speed-btn');
    if (!btn) return;
    const pct = Math.round(this._speedSteps[this._speedIdx] * 100);
    btn.innerHTML = `${pct}%<small>VEL.</small>`;
  },

  // ── Info del ejercicio (popup) ──────────────────────────────────

  openInfo() {
    const p = this.currentPractice;
    if (!p) return;

    const mode = PracticeLibrary.getMode(p.mode);
    const tech = PracticeLibrary.getTechnique(p.mode, p.technique);
    const diff = PracticeLibrary.getDifficulty(p.level);

    const eyebrow = [mode && mode.label, tech && tech.label].filter(Boolean).join(' · ');
    document.getElementById('info-eyebrow').textContent = eyebrow || 'Ejercicio';
    document.getElementById('info-title').textContent   = `${p.n}. ${p.title}`;

    const bits = [];
    if (diff) bits.push(diff.label);
    if (p.bars) bits.push(`${p.bars} compases`);
    if (p.bpm)  bits.push(`${p.bpm} BPM`);
    document.getElementById('info-meta').textContent = bits.join(' · ');

    document.getElementById('info-body').textContent = p.explain || 'Sin descripción disponible.';
    document.getElementById('info-modal').hidden = false;
  },

  closeInfo() {
    const m = document.getElementById('info-modal');
    if (m) m.hidden = true;
  },

  // ── Configuración (drawer) ──────────────────────────────────────

  _initSettings() {
    // Poblar selector de sonido
    const sel = document.getElementById('set-sound');
    if (sel) {
      sel.innerHTML = '';
      Object.entries(AudioEngine.presets).forEach(([key, p]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = p.label;
        sel.appendChild(opt);
      });
      sel.value = Storage.loadSound();
    }
    // Estado del toggle MIDI
    const midi = document.getElementById('set-midi');
    if (midi) midi.checked = Storage.loadMidiFollow();
    const midiSound = document.getElementById('set-midi-sound');
    if (midiSound) midiSound.checked = Storage.loadMidiSound();
    const countin = document.getElementById('set-countin');
    if (countin) countin.checked = Storage.loadCountIn();
    // Reconectar MIDI automáticamente si el usuario ya lo tenía activado
    if (Storage.loadMidiFollow() && MidiEngine.supported()) {
      MidiEngine.init().then((ok) => {
        const status = document.getElementById('set-midi-status');
        if (!ok && status) status.textContent = 'No se pudo reconectar MIDI. Reactiva el interruptor.';
      });
    }
  },

  openSettings() {
    const d = document.getElementById('settings-drawer');
    const s = document.getElementById('settings-scrim');
    if (s) s.hidden = false;
    if (d) { d.classList.add('open'); d.setAttribute('aria-hidden', 'false'); }
  },

  closeSettings() {
    const d = document.getElementById('settings-drawer');
    const s = document.getElementById('settings-scrim');
    if (s) s.hidden = true;
    if (d) { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); }
  },

  setSound(name) {
    Storage.saveSound(name);
    // Cargar de inmediato para que el siguiente play use el nuevo sonido.
    AudioEngine.loadInstrument(name).catch(() => {});
    const p = AudioEngine.presets[name];
    this.toast('Sonido: ' + (p ? p.label : name));
  },

  setMidiSound(flag) {
    Storage.saveMidiSound(flag);
    this.toast(flag ? 'El MIDI sonará en la app' : 'El MIDI no sonará en la app');
  },

  setCountIn(flag) {
    Storage.saveCountIn(flag);
    this.toast(flag ? 'Conteo inicial activado' : 'Conteo inicial desactivado');
  },

  async setMidiFollow(flag) {
    Storage.saveMidiFollow(flag);
    const status = document.getElementById('set-midi-status');
    if (!flag) {
      MidiEngine.disconnect();
      if (status) status.textContent = '';
      Player._refreshFollowVisibility();
      this.toast('MIDI desactivado');
      return;
    }
    if (!MidiEngine.supported()) {
      if (status) status.textContent = 'Este navegador no soporta Web MIDI.';
      this.toast('Web MIDI no disponible', true);
      const midi = document.getElementById('set-midi');
      if (midi) midi.checked = false;
      Storage.saveMidiFollow(false);
      return;
    }
    const ok = await MidiEngine.init();
    if (!ok) {
      if (status) status.textContent = 'Permiso MIDI denegado.';
      this.toast('No se pudo acceder a MIDI', true);
      const midi = document.getElementById('set-midi');
      if (midi) midi.checked = false;
      Storage.saveMidiFollow(false);
      return;
    }
    this.toast('MIDI activado');
    // _onMidiDevices actualiza el estado y el botón de seguimiento.
  },

  // Llamado por MidiEngine cuando cambia la lista de dispositivos.
  _onMidiDevices(inputs) {
    const status = document.getElementById('set-midi-status');
    if (status) {
      status.textContent = inputs.length
        ? 'Conectado: ' + inputs.map(i => i.name).join(', ')
        : 'Sin dispositivos MIDI detectados.';
    }
    if (typeof Player !== 'undefined') Player._refreshFollowVisibility();
  },

  // ── Toast ───────────────────────────────────────────────────────

  toast(msg, error = false) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.toggle('error', !!error);
    t.hidden = false;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { t.hidden = true; }, 2400);
  },

};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
