/**
 * PianoFlow — App controller
 *
 * Flujo:
 *   Home (familias)  →  Familia (lista de prácticas)  →  Player
 *
 * No hay pantalla de "config". Cada práctica es una pista pre-armada
 * del manifest (familia × estilo × patrón × dificultad ya cocinados).
 */

const App = {

  // Estado actual
  currentFamily:    null,   // key de familia abierta
  currentPractice:  null,   // ítem del manifest activo
  styleFilter:      'all',  // filtro de estilo en la pantalla familia

  _speedSteps: [1.0, 0.85, 0.7, 0.5],
  _speedIdx:   0,

  // ── Init ────────────────────────────────────────────────────────

  init() {
    // Inicializar piano engine
    const pianoEl = document.getElementById('piano');
    if (pianoEl) PianoEngine.init(pianoEl);

    // Construir el manifest una vez
    PracticeLibrary.buildManifest();

    this.renderFamilies();
    this.goHome();
    this._refreshSpeedBtn();
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
    this._show('screen-home');
  },

  // ── Home: cards de familias ────────────────────────────────────

  renderFamilies() {
    const grid = document.getElementById('family-grid');
    if (!grid) return;
    grid.innerHTML = '';

    Object.entries(PracticeLibrary.families).forEach(([key, fam]) => {
      const count = PracticeLibrary.practiceCount(key);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'family-card';
      card.innerHTML = `
        <span class="family-icon">${fam.icon}</span>
        <span class="family-body">
          <span class="family-title">${fam.label}</span>
          <span class="family-desc">${fam.desc}</span>
          <span class="family-meta">${fam.chords.length} acordes · ${count} prácticas</span>
        </span>`;
      card.onclick = () => this.openFamily(key);
      grid.appendChild(card);
    });
  },

  // ── Pantalla Familia: lista de prácticas ───────────────────────

  openFamily(key) {
    const fam = PracticeLibrary.getFamily(key);
    if (!fam) return;

    this.currentFamily = key;
    this.styleFilter   = 'all';

    // Header
    document.getElementById('family-head-icon').textContent  = fam.icon;
    document.getElementById('family-head-title').textContent = fam.label;
    document.getElementById('family-head-desc').textContent  = fam.desc;
    const cueEl = document.getElementById('family-head-cue');
    if (cueEl) cueEl.textContent = fam.cue || '';

    // Chord chips
    document.getElementById('family-head-chords').innerHTML =
      fam.chords.map(c => `<span class="chord-chip">${c}</span>`).join('');

    // Reset filtro UI
    document.querySelectorAll('#style-filter .filter-pill').forEach(b =>
      b.classList.toggle('active', b.dataset.filter === 'all'));

    this._renderPracticeList();
    this._show('screen-family');
  },

  filterByStyle(styleKey) {
    this.styleFilter = styleKey;
    document.querySelectorAll('#style-filter .filter-pill').forEach(b =>
      b.classList.toggle('active', b.dataset.filter === styleKey));
    this._renderPracticeList();
  },

  _renderPracticeList() {
    const host = document.getElementById('practice-list');
    if (!host || !this.currentFamily) return;

    let items = PracticeLibrary.practicesForFamily(this.currentFamily);
    if (this.styleFilter !== 'all') {
      items = items.filter(p => p.style === this.styleFilter);
    }

    if (!items.length) {
      host.innerHTML = '<div class="lede">No hay prácticas para este filtro.</div>';
      return;
    }

    // Agrupar por estilo (cuando filtro = all) o lista plana
    const styleOrder = ['worship', 'pop', 'hebrew'];
    let html = '';

    if (this.styleFilter === 'all') {
      styleOrder.forEach(styleKey => {
        const subset = items.filter(p => p.style === styleKey);
        if (!subset.length) return;
        const style = PracticeLibrary.getStyle(styleKey);
        html += `<div class="practice-group-label">${style.icon} ${style.label}</div>`;
        subset.forEach(p => html += this._practiceCardHtml(p));
      });
    } else {
      items.forEach(p => html += this._practiceCardHtml(p));
    }

    host.innerHTML = html;

    // Attach handlers
    host.querySelectorAll('.practice-card').forEach(card => {
      card.onclick = () => this.startPractice(card.dataset.id);
    });
  },

  _practiceCardHtml(p) {
    const diff = PracticeLibrary.getDifficulty(p.difficulty);
    return `
      <button type="button" class="practice-card" data-id="${p.id}">
        <span class="pc-icon">${p.patternIcon || '🎵'}</span>
        <span class="pc-body">
          <span class="pc-title">${p.title}</span>
          <span class="pc-sub">${p.subtitle}</span>
        </span>
        <span class="pc-diff">${diff.label}</span>
      </button>`;
  },

  // ── Player: arrancar una práctica del manifest ─────────────────

  startPractice(practiceId) {
    const item = PracticeLibrary.getPractice(practiceId);
    if (!item) { this.toast('Práctica no encontrada', true); return; }
    this.currentPractice = item;

    try {
      const session = SessionGenerator.generate({
        family:     item.family,
        pattern:    item.pattern,
        style:      item.style,
        difficulty: item.difficulty,
        bpm:        item.bpm,
      });
      Player.loadSession(session);
      this._show('screen-player');
    } catch (e) {
      console.error(e);
      this.toast('No se pudo generar la sesión: ' + e.message, true);
    }
  },

  exitSession() {
    Player.stop();
    // Volver a la pantalla de la familia donde estábamos
    if (this.currentFamily) this.openFamily(this.currentFamily);
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
