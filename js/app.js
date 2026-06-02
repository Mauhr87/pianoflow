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
            <span class="qa-cont-title">${this._iconHtml(last.techIcon || (mode && mode.icon) || '🎵')} ${last.title}</span>
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
            `<button type="button" class="qa-fav-chip" data-id="${p.id}">${this._iconHtml(p.techIcon || '🎵')} ${p.title}</button>`
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
      html += `<button class="filter-pill ${active}" data-tech="${techKey}">${this._iconHtml(tech.icon)} ${tech.label}</button>`;
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

      html += `<div class="item-group-label">${this._iconHtml(tech.icon)} ${tech.label}</div>`;

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
          <span class="ic-icon">${this._iconHtml(p.techIcon || p.icon || '🎵')}</span>
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

  _iconHtml(icon) {
    if (icon === '⏹') {
      return '<span class="pf-tech-icon pf-tech-icon-block" aria-hidden="true"><span></span><span></span><span></span></span>';
    }
    return icon || '🎵';
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
        meta: {
          ...(item.meta || {}),
          useInversions: item.useInversions || (item.meta && item.meta.useInversions) || false,
          arrangementPattern: item.arrangementPattern || (item.meta && item.meta.arrangementPattern) || '',
          arrangementAccompaniment: item.arrangementAccompaniment || (item.meta && item.meta.arrangementAccompaniment) || '',
          arrangementResource: item.arrangementResource || (item.meta && item.meta.arrangementResource) || '',
          arrangementForm: item.arrangementForm || (item.meta && item.meta.arrangementForm) || '',
        },
      });
      this.currentPractice = {
        ...item,
        renderedChords: this._uniqueSessionChords(session),
        renderedScales: session.meta && session.meta.scaleNames,
      };
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

    this._renderInfoBody(document.getElementById('info-body'), this._exerciseInfo(p));
    document.getElementById('info-modal').hidden = false;
  },

  _renderInfoBody(host, blocks) {
    if (!host) return;
    host.textContent = '';
    const items = (blocks && blocks.length)
      ? blocks
      : [{ title: 'Qué estás entrenando', body: 'Este ejercicio presenta una habilidad musical concreta para usarla en canciones.' }];

    items.forEach(item => {
      const block = document.createElement('section');
      block.className = 'info-block';
      const title = document.createElement('strong');
      title.className = 'info-block-title';
      title.textContent = item.title;
      const body = document.createElement('p');
      body.textContent = item.body;
      block.appendChild(title);
      block.appendChild(body);
      host.appendChild(block);
    });
  },

  _exerciseInfo(p) {
    const exerciseChords = p.renderedChords || p.chords;
    const chords = this._chordList(exerciseChords);
    const baseExplain = p.explain || 'Practicas una habilidad armónica aplicable a canciones reales.';
    const isSingleChord = (exerciseChords || []).length === 1;

    if (p.mode === 'accompaniment') {
      const focus = p.meta && p.meta.useInversions
        ? 'mantener la base en la mano izquierda mientras la derecha usa acordes cómodos e inversiones'
        : 'coordinar fundamental en la mano izquierda con acordes completos en la mano derecha';
      const pedal = p.meta && p.meta.pedal ? ` Pedal: ${p.meta.pedal}.` : '';
      const useCase = p.meta && p.meta.useCase ? ` ${p.meta.useCase}` : '';
      return [
        { title: 'Qué estás entrenando', body: `${baseExplain} El foco es ${focus} con ${chords}.${pedal}${useCase}` },
        { title: 'Qué debes escuchar', body: 'La mano izquierda debe sentirse como base estable y la derecha debe sostener la armonía sin competir con una melodía imaginaria.' },
        { title: 'Error común', body: 'Golpear ambas manos sin pulso interno, o dejar que la derecha suene pesada y tape la función del bajo.' },
        { title: 'Señal de éxito', body: 'Puedes repetir la sección con pulso firme, cambios claros y sensación de acompañar una canción real.' },
      ];
    }

    if (p.mode === 'arpeggios') {
      const hands = p.meta && p.meta.bothHands
        ? 'la derecha despliega el acorde y la izquierda sostiene la fundamental'
        : 'la mano derecha despliega el acorde nota por nota';
      const position = p.meta && p.meta.inv
        ? (p.meta.inv === 1 ? ' desde primera inversión' : ' desde segunda inversión')
        : (p.meta && p.meta.useInversions ? ' usando inversiones cercanas' : '');
      const pedal = p.meta && p.meta.pedal ? ` Pedal: ${p.meta.pedal}.` : '';
      const patternName = this._arpeggioPatternName(p.meta && p.meta.arpeggioPattern);
      const pattern = patternName ? ` Patrón principal: ${patternName}.` : '';
      const feel = p.meta && p.meta.patternFeel ? ` Sensación: ${p.meta.patternFeel}` : '';
      const useWhen = p.meta && p.meta.useWhen ? ` Úsalo: ${p.meta.useWhen}` : '';
      const fifth = p.meta && p.meta.useFifth ? ' La izquierda alterna fundamental y quinta para dar más base.' : '';
      const patternKey = p.meta && p.meta.arpeggioPattern;
      const patternError = patternKey === 'basic7'
        ? 'Acelerar las notas internas, perder la forma 1-3-5-8-5-3-1 o desconectar la llegada al siguiente acorde.'
        : 'Acelerar las notas internas, perder el dibujo del patrón principal o desconectar la llegada al siguiente acorde.';
      return [
        { title: 'Qué estás entrenando', body: `${baseExplain} El foco es que ${hands}${position} con ${chords}.${pattern}${pedal}${fifth}` },
        { title: 'Qué debes escuchar', body: `El arpegio debe sonar como un solo gesto continuo: cada nota revela el acorde sin volverse una escala mecánica.${feel}${useWhen}` },
        { title: 'Error común', body: patternError },
        { title: 'Señal de éxito', body: 'Puedes repetir la sección con sonido parejo, pulso estable y una progresión que se entiende aunque las notas estén separadas.' },
      ];
    }

    if (p.mode === 'melodic') {
      const scaleText = this._scaleList(p.renderedScales || exerciseChords);
      const hands = p.meta && p.meta.hands === 'RH' ? 'mano derecha' : 'melodía principal';
      const rhythm = p.meta && p.meta.rhythmic ? ' Aquí el ritmo es parte del objetivo, no solo la sucesión de notas.' : '';
      const resource = p.meta && (p.meta.melodicResource || p.meta.appliedResource)
        ? ` Recurso principal: ${p.meta.melodicResource || p.meta.appliedResource}.`
        : '';
      return [
        { title: 'Qué estás entrenando', body: `${baseExplain} Trabajas ${scaleText} con foco en ${hands} y una mini aplicación musical dentro del ejercicio.${resource}${rhythm}` },
        { title: 'Qué debes escuchar', body: 'La escala debe sonar como vocabulario musical: dirección, llegada y color, no como una lista de notas.' },
        { title: 'Error común', body: 'Subir y bajar la escala mecánicamente sin escuchar dónde descansa la frase o qué emoción produce mayor, menor o pentatónica.' },
        { title: 'Señal de éxito', body: 'Puedes reconocer el color de la escala y tocar la aplicación final como una frase breve con sentido musical.' },
      ];
    }

    if (p.mode === 'coordination') {
      const roles = this._coordinationRoles(p.technique, p.meta || {});
      const left = roles.left;
      const right = roles.right;
      const resource = (p.meta && p.meta.coordinationResource) || this._coordinationPatternName(p.meta && p.meta.coordinationPattern);
      const modern = p.meta && (p.meta.useOctaves || p.meta.useTenths)
        ? ' El reto es mantener el peso de la izquierda sin desordenar la llegada de la derecha.'
        : '';
      return [
        { title: 'Qué estás entrenando', body: `${baseExplain} Recurso principal: ${resource}. Mano izquierda: ${left}. Mano derecha: ${right}. Usas ${chords}.${modern}` },
        { title: 'Qué debes escuchar', body: 'Cada mano debe conservar su tarea: llegar junta, alternar, sostener, responder, desplazarse o mantener un patrón sin arrastrar a la otra.' },
        { title: 'Error común', body: 'Tocar las notas correctas pero dejar que una mano copie el ritmo, peso o duración de la otra.' },
        { title: 'Señal de éxito', body: 'Puedes repetir la progresión manteniendo pulso estable, roles claros y cambios limpios entre manos.' },
      ];
    }

    if (p.mode === 'melodyArrangement') {
      const resource = (p.meta && p.meta.arrangementResource) || 'melodía principal';
      const accompaniment = this._arrangementAccompanimentName(p.meta && p.meta.arrangementAccompaniment);
      const form = p.meta && p.meta.arrangementForm ? ` Forma: ${p.meta.arrangementForm}.` : '';
      return [
        { title: 'Qué estás entrenando', body: `${baseExplain} Recurso principal: ${resource}. Acompañamiento: ${accompaniment}.${form} Usas ${chords}.` },
        { title: 'Qué debes escuchar', body: 'La melodía debe ser la voz que canta; el bajo, los acordes, arpegios o patrones existen para sostenerla sin taparla.' },
        { title: 'Error común', body: 'Tocar el acompañamiento con más intención que la melodía, o dejar que el patrón rompa la respiración de la frase.' },
        { title: 'Señal de éxito', body: 'Puedes cantar mentalmente la melodía mientras tocas y sentir que el acompañamiento crea una pieza completa.' },
      ];
    }

    if (p.mode === 'voicings') {
      const resource = (p.meta && p.meta.voicingResource) || 'voicing cercano';
      const texture = this._voicingTextureName(p.meta && p.meta.voicingTexture);
      const color = p.meta && p.meta.voicingColor ? ` Color: ${p.meta.voicingColor}.` : '';
      return [
        { title: 'Qué estás entrenando', body: `${baseExplain} Recurso principal: ${resource}. Textura: ${texture}.${color} Usas ${chords}.` },
        { title: 'Qué debes escuchar', body: 'El acorde debe sonar más claro, más conectado o más moderno por la distribución de sus notas, no por tocar más fuerte ni agregar notas sin intención.' },
        { title: 'Error común', body: 'Pensar solo en el nombre del acorde y olvidar qué nota queda arriba, cuánto se mueve la mano o si el voicing realmente mejora la frase.' },
        { title: 'Señal de éxito', body: 'Puedes tocar la progresión sintiendo continuidad entre acordes, una voz superior clara y un sonido más profesional sin perder simplicidad.' },
      ];
    }

    if (p.mode !== 'chords') {
      return [
        { title: 'Qué estás entrenando', body: baseExplain },
        { title: 'Qué debes escuchar', body: 'Busca que el pulso se mantenga estable y que cada cambio tenga intención musical.' },
        { title: 'Error común', body: 'Tocar las notas correctas sin escuchar si la frase respira como música.' },
        { title: 'Señal de éxito', body: 'Puedes repetir la sección manteniendo continuidad, sonido parejo y una llegada clara.' },
      ];
    }

    if (p.technique === 'triads') {
      const family = this._triadFamily(exerciseChords);
      return [
        { title: 'Qué estás entrenando', body: `${baseExplain} Trabaja ${family} en posición fundamental usando ${chords}.` },
        { title: 'Qué debes escuchar', body: 'Cada acorde debe sonar estable y reconocible; distingue si el color es mayor, menor, tensión o reposo.' },
        { title: 'Error común', body: 'Memorizar solo la forma visual y perder el nombre o la función del acorde dentro de la progresión.' },
        { title: 'Señal de éxito', body: 'Puedes anticipar el próximo acorde, tocarlo en el pulso y sentir la progresión como una frase de canción.' },
      ];
    }

    if (p.technique === 'inversions') {
      const focus = p.meta && p.meta.inv
        ? (p.meta.inv === 1 ? 'la primera inversión' : 'la segunda inversión')
        : (p.meta && p.meta.useInversions ? 'la inversión más cercana para reducir saltos' : 'fundamental, primera inversión y segunda inversión');
      return [
        { title: 'Qué estás entrenando', body: `${baseExplain} El foco es ${focus} con ${chords}.` },
        { title: 'Qué debes escuchar', body: isSingleChord ? 'El acorde debe conservar su identidad aunque la nota grave cambie.' : 'Los cambios deben sentirse conectados, como si la mano se moviera poco entre acordes.' },
        { title: 'Error común', body: 'Volver siempre a posición fundamental o elegir una inversión sin propósito musical.' },
        { title: 'Señal de éxito', body: 'Puedes tocar la progresión manteniendo la mano en una zona reducida y reconocer qué inversión estás usando.' },
      ];
    }

    if (p.technique === 'sevenths') {
      return [
        { title: 'Qué estás entrenando', body: `${baseExplain} Compara y aplica familias de séptima con ${chords}.` },
        { title: 'Qué debes escuchar', body: 'El Maj7 debe sentirse amplio, el m7 más profundo y el dominante 7 con deseo de resolver.' },
        { title: 'Error común', body: 'Tratar la séptima como una nota extra cualquiera y no escuchar cómo cambia la emoción del acorde.' },
        { title: 'Señal de éxito', body: 'Puedes nombrar el tipo de séptima y tocarla sin que la progresión pierda claridad pop, worship o balada.' },
      ];
    }

    if (p.technique === 'extensions') {
      return [
        { title: 'Qué estás entrenando', body: `${baseExplain} Exploras colores modernos como add9, sus2 y sus4 dentro de ${chords}.` },
        { title: 'Qué debes escuchar', body: 'Las extensiones deben abrir el sonido sin volver confusa la función principal del acorde.' },
        { title: 'Error común', body: 'Tocar el color como adorno aislado y olvidar si el acorde está reposando, esperando o resolviendo.' },
        { title: 'Señal de éxito', body: 'Puedes sentir cuándo el color aporta espacio, cuándo crea espera y cuándo conviene resolverlo.' },
      ];
    }

    if (p.technique === 'application') {
      return [
        { title: 'Qué estás entrenando', body: `${baseExplain} Aquí usas ${chords} como una mini canción, no como lista de acordes.` },
        { title: 'Qué debes escuchar', body: 'La pieza debe tener inicio, movimiento y cierre; cada sección debe sonar conectada con la anterior.' },
        { title: 'Error común', body: 'Tocar todos los compases con la misma intención, sin preparar la llegada ni respirar al final.' },
        { title: 'Señal de éxito', body: 'Puedes repetirla de memoria corta sintiendo una forma musical clara y una resolución convincente.' },
      ];
    }

    return [
      { title: 'Qué estás entrenando', body: baseExplain },
      { title: 'Qué debes escuchar', body: 'Escucha la función de cada acorde dentro de la progresión.' },
      { title: 'Error común', body: 'Tocar cambios correctos sin una intención musical clara.' },
      { title: 'Señal de éxito', body: 'La progresión se siente útil dentro de una canción real.' },
    ];
  },

  _chordList(chords) {
    const list = (chords || []).filter(Boolean);
    if (!list.length) return 'la progresión del ejercicio';
    if (list.length === 1) return `el acorde ${list[0]}`;
    return `los acordes ${list.join(' - ')}`;
  },

  _scaleList(scales) {
    const list = (scales || []).filter(Boolean);
    if (!list.length) return 'la escala del ejercicio';
    if (list.length === 1) return `la escala ${list[0]}`;
    return `las escalas ${list.join(' - ')}`;
  },

  _arpeggioPatternName(key) {
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
    return labels[key] || '';
  },

  _coordinationLeftRoleName(pattern, stableBass) {
    if (stableBass) return 'bajo estable';
    const labels = {
      rootChord: 'fundamental',
      rootFifthChord: 'fundamental + quinta',
      independentBass: 'patrón simple de bajo',
      octavesChord: 'octavas',
      tenthsChord: 'décimas',
      modernCoordination: 'recursos modernos de bajo',
      coordinationFinal: 'fundamental, quinta, octavas y décimas',
      alternating: 'entrada alternada',
      reverseAlternating: 'respuesta despues de RH',
      sharedPulse: 'pulso compartido',
      offbeatAlternating: 'pulso estable',
      leftHold: 'base sostenida',
      rightHold: 'bajo móvil',
      pedalBass: 'nota pedal',
      movingBassHold: 'bajo móvil',
      fixedFifth: 'base fija con quinta',
      ostinato: 'patrón continuo',
      ostinatoChange: 'patrón continuo',
      worshipOstinato: 'patrón worship',
      walkingBass: 'bajo caminante',
      displacedEntry: 'pulso estable',
      bassFirst: 'pulso estable',
      offbeatChord: 'pulso estable',
      syncopation: 'pulso estable',
      neverTogether: 'entrada independiente',
      twoNotes: 'línea simple',
      parallelMotion: 'línea paralela',
      contraryMotion: 'línea contraria',
      simpleVoices: 'línea simple',
    };
    return labels[pattern] || 'base armónica';
  },

  _coordinationPatternName(pattern) {
    const labels = {
      rootChord: 'Bajo + Acordes',
      rootFifthChord: 'Fundamental + quinta',
      independentBass: 'Bajo independiente simple',
      octavesChord: 'Octavas',
      tenthsChord: 'Décimas',
      coordinationFinal: 'Dominio de Bajo + Acordes',
      alternating: 'Alternancia básica',
      reverseAlternating: 'Respuesta invertida',
      sharedPulse: 'Pulso compartido',
      chordTurns: 'Turnos por acorde',
      stableAlternating: 'Alternancia estable',
      offbeatAlternating: 'Contratiempo simple',
      oneTwo: '1 contra 2',
      alternatingBassFifth: 'LH alterna, RH responde',
      preparedRest: 'Entrada preparada',
      extendedTurns: 'Turnos extendidos',
      octaveAlternating: 'Octavas alternadas',
      fastAlternating: 'Alternancia rápida controlada',
      harmonicResponse: 'Respuesta armónica',
      modernAlternating: 'Alternancia con color',
      alternatingFinal: 'Dominio de manos alternadas',
      leftHold: 'LH fija, RH móvil',
      rightHold: 'RH fija, LH móvil',
      pedalBass: 'Pedal en LH',
      movingBassHold: 'Acorde sostenido, bajo móvil',
      roleSwitch: 'Cambio de rol',
      pedalInversions: 'Pedal + inversiones',
      fixedFifth: 'Quinta fija',
      rightLong: 'RH pulso largo',
      leftLong: 'LH pulso largo',
      changingRoles: 'Roles cambiantes',
      octavePedal: 'Pedal en octavas',
      colorHold: 'Color sostenido',
      advancedRoleSwitch: 'Cambio de rol avanzado',
      modernHold: 'Mano fija moderna',
      fixedMovingFinal: 'Dominio mano fija + móvil',
      melodyChords: 'Melodía + Acordes',
      melodyFinal: 'Dominio de Melodía + Acordes',
      bassMelody: 'Bajo + Melodía',
      bassMelodyFinal: 'Dominio de Bajo + Melodía',
      ostinato: 'Ostinato',
      ostinatoChange: 'Ostinato con cambio',
      patternLongEvent: 'Patrón + evento largo',
      stableOstinato: 'Ostinato estable',
      worshipOstinato: 'Patrón worship',
      patternInversions: 'Patrón + inversión',
      octaveOstinato: 'Octavas continuas',
      patternWithSpaces: 'Continuidad contra silencio',
      prolongedPattern: 'Patrón prolongado',
      walkingBass: 'Bajo caminante simple',
      longCycle: 'Ciclo extendido',
      modernPattern: 'Patrón moderno',
      widePattern: 'Registro amplio',
      continuousFinal: 'Dominio de patrón continuo',
      independentFinal: 'Dominio de Bajo Independiente',
      displacedEntry: 'Entrada desplazada',
      syncopation: 'Síncopa simple',
      neverTogether: 'Manos nunca coinciden',
      displacedFinal: 'Dominio de Ritmos Desplazados',
      callResponse: 'Pregunta y respuesta',
      countermelody: 'Contramelodía',
      counterFinal: 'Dominio de Contramelodías',
      twoNotes: 'Dos notas coordinadas',
      parallelMotion: 'Movimiento paralelo',
      contraryMotion: 'Movimiento contrario',
      technicalCallResponse: 'Pregunta y respuesta técnica',
      simpleVoices: 'Dos voces simples',
      longShort: 'Duraciones distintas',
      stepsVsLeaps: 'Escalones contra saltos',
      leapsVsSteps: 'Saltos contra escalones',
      staggeredVoices: 'Voces en espacios',
      coordinatedLines: 'Líneas coordinadas',
      continuousContrary: 'Movimiento contrario continuo',
      colorLines: 'Líneas con color',
      fixedUpper: 'Voz superior fija',
      wideVoices: 'Registro amplio',
      simpleVoicesFinal: 'Dominio de dos voces simples',
      applicationMixed: 'Combinación de recursos',
      applicationFinal: 'Proyecto final de coordinación',
      technicalMixedBasic: 'Coordinación combinada básica',
      technicalMixedIntermediate: 'Coordinación mixta intermedia',
      technicalMixedAdvanced: 'Coordinación combinada avanzada',
      technicalFinal: 'Proyecto técnico de coordinación',
    };
    return labels[pattern] || 'Coordinación de manos';
  },

  _coordinationRoles(technique, meta) {
    if (technique === 'alternatingHands') return { left: this._coordinationLeftRoleName(meta.coordinationPattern, meta.stableBass), right: 'respuesta alternada o acorde en turno' };
    if (technique === 'fixedMoving') return { left: this._coordinationLeftRoleName(meta.coordinationPattern, meta.stableBass), right: 'mano móvil o sostenida según el rol del compás' };
    if (technique === 'continuousPattern') return { left: 'patrón continuo automático', right: 'entrada simple que no detiene el patrón' };
    if (technique === 'simpleVoices') return { left: 'línea simple coordinada', right: 'línea simple coordinada' };
    if (technique === 'technicalApplication') return { left: 'función técnica cambiante', right: 'función técnica complementaria' };
    if (technique === 'melodyChords') return { left: 'bajo sencillo', right: 'melodía superior con armonía debajo' };
    if (technique === 'bassMelody') return { left: this._coordinationLeftRoleName(meta.coordinationPattern, meta.stableBass), right: 'una sola línea melódica clara' };
    if (technique === 'independentBass') return { left: 'patrón de bajo autónomo', right: 'melodía, frase o fragmento armónico independiente' };
    if (technique === 'displacedRhythms') return { left: 'pulso estable', right: 'entrada desplazada, síncopa o respuesta rítmica' };
    if (technique === 'countermelodies') return { left: 'contramelodía o respuesta musical', right: 'voz principal' };
    if (technique === 'application') return { left: 'función cambiante según la sección', right: 'melodía, acordes o respuesta según el recurso principal' };
    return {
      left: this._coordinationLeftRoleName(meta.coordinationPattern, meta.stableBass),
      right: meta.useInversions ? 'acordes completos con inversiones cercanas' : 'acordes completos',
    };
  },

  _arrangementAccompanimentName(key) {
    const labels = {
      none: 'melodía sola',
      bassLong: 'bajo largo',
      bass: 'bajo simple',
      bassSparse: 'bajo con espacios',
      rootFifth: 'fundamental + quinta',
      alternatingBass: 'bajo alternado',
      balladBass: 'bajo de balada',
      octaves: 'octavas',
      octaveFifth: 'octava + quinta',
      walking: 'bajo caminante',
      modernBass: 'bajo moderno',
      wideBass: 'bajo amplio',
      mixedBass: 'bajos combinados',
      chordVoicing: 'acordes/voicings bajo la melodía',
      openVoicing: 'voicings abiertos',
      bassChords: 'bajo + acordes simples',
      arpeggio: 'arpegio simple',
      arpeggioDown: 'arpegio descendente',
      openArpeggio: 'arpegio abierto',
      balladArpeggio: 'arpegio de balada',
      extendedArpeggio: 'arpegio extendido',
      wideArpeggio: 'arpegio amplio',
      alberti: 'Alberti',
      worship: 'patrón worship',
      mixedPattern: 'combinación de patrones',
      mixedTexture: 'cambio de textura',
      layered: 'crecimiento por capas',
      fullArrangement: 'arreglo completo',
    };
    return labels[key] || 'acompañamiento aplicado';
  },

  _voicingTextureName(key) {
    const labels = {
      closed: 'voicing cerrado con inversión cercana',
      compare: 'comparación de soluciones',
      colorCompare: 'comparación de colores',
      colorResolve: 'color que resuelve',
      open: 'voicing abierto',
      openBass: 'bajo + voicing abierto',
      openTop: 'voicing abierto con melodía arriba',
      bassVoicing: 'bajo + voicing conectado',
      topVoice: 'melodía en voz superior',
      modern: 'textura moderna',
      wide: 'registro amplio',
      full: 'textura completa',
    };
    return labels[key] || 'voicing aplicado';
  },

  _triadFamily(chords) {
    const list = chords || [];
    const hasMinor = list.some(ch => /m$/.test(ch));
    const hasMajor = list.some(ch => /^[A-G]#?$/.test(ch));
    if (hasMajor && hasMinor) return 'triadas mayores y menores';
    if (hasMinor) return 'triadas menores';
    return 'triadas mayores';
  },

  _uniqueSessionChords(session) {
    const out = [];
    (session && session.measures || []).forEach(measure => {
      const segs = measure.chordSegs || [];
      segs.forEach(seg => {
        if (seg && seg.label && !out.includes(seg.label)) out.push(seg.label);
      });
    });
    return out;
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
