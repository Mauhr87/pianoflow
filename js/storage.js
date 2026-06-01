/**
 * PianoFlow — Storage (localStorage simple)
 *
 * Persiste el último config para que el usuario abra la app y siga donde
 * estaba. En v1 no usamos IndexedDB todavía — viene en v2 cuando guardemos
 * progreso por sesión.
 */

const Storage = {

  KEY_LAST_CONFIG: 'pf_last_config',
  KEY_SOUND:       'pf_sound',
  KEY_METRONOME:   'pf_metronome',
  KEY_MIDI:        'pf_midi_follow',
  KEY_MIDI_SOUND:  'pf_midi_sound',
  KEY_COUNTIN:     'pf_countin',
  KEY_LAST_EX:     'pf_last_exercise',
  KEY_FAVS:        'pf_favorites',

  saveLastConfig(cfg) {
    try { localStorage.setItem(this.KEY_LAST_CONFIG, JSON.stringify(cfg)); } catch (e) {}
  },

  loadLastConfig() {
    try {
      const raw = localStorage.getItem(this.KEY_LAST_CONFIG);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  },

  saveSound(name) {
    try { localStorage.setItem(this.KEY_SOUND, name); } catch (e) {}
  },

  loadSound() {
    try { return localStorage.getItem(this.KEY_SOUND) || 'classic'; }
    catch (e) { return 'classic'; }
  },

  saveMidiFollow(flag) {
    try { localStorage.setItem(this.KEY_MIDI, flag ? '1' : '0'); } catch (e) {}
  },

  loadMidiFollow() {
    try { return localStorage.getItem(this.KEY_MIDI) === '1'; }
    catch (e) { return false; }
  },

  // ¿Reproducir el sonido del MIDI en la app durante el modo seguimiento?
  // Por defecto NO (el usuario suele tocar su propio piano).
  saveMidiSound(flag) {
    try { localStorage.setItem(this.KEY_MIDI_SOUND, flag ? '1' : '0'); } catch (e) {}
  },

  loadMidiSound() {
    try { return localStorage.getItem(this.KEY_MIDI_SOUND) === '1'; }
    catch (e) { return false; }
  },

  // Conteo inicial (metrónomo) antes de reproducir. Por defecto NO.
  saveCountIn(flag) {
    try { localStorage.setItem(this.KEY_COUNTIN, flag ? '1' : '0'); } catch (e) {}
  },

  loadCountIn() {
    try { return localStorage.getItem(this.KEY_COUNTIN) === '1'; }
    catch (e) { return false; }
  },

  // Último ejercicio abierto (para "Seguir practicando" en Home).
  saveLastExercise(id) {
    try { localStorage.setItem(this.KEY_LAST_EX, id); } catch (e) {}
  },

  loadLastExercise() {
    try { return localStorage.getItem(this.KEY_LAST_EX) || null; }
    catch (e) { return null; }
  },

  // ── Favoritos ───────────────────────────────────────────────────
  _loadFavs() {
    try { return new Set(JSON.parse(localStorage.getItem(this.KEY_FAVS) || '[]')); }
    catch (e) { return new Set(); }
  },

  _saveFavs(set) {
    try { localStorage.setItem(this.KEY_FAVS, JSON.stringify([...set])); } catch (e) {}
  },

  favorites() { return [...this._loadFavs()]; },

  isFavorite(id) { return this._loadFavs().has(id); },

  toggleFavorite(id) {
    const set = this._loadFavs();
    if (set.has(id)) set.delete(id); else set.add(id);
    this._saveFavs(set);
    return set.has(id);
  },

};

/**
 * PianoFlow — ProgressStorage  (Fase 2, portado de DrumFlow)
 *
 * Persiste el Set de IDs de prácticas completadas en localStorage.
 * Convive con `Storage` (que solo guarda last-config y sonido).
 */
const ProgressStorage = {
  KEY: 'pf_progress_v1',

  _load() {
    try { return new Set(JSON.parse(localStorage.getItem(this.KEY) || '[]')); }
    catch (e) { return new Set(); }
  },

  _save(set) {
    try { localStorage.setItem(this.KEY, JSON.stringify([...set])); }
    catch (e) { /* cuota llena — ignorar */ }
  },

  /** Devuelve el Set completo de IDs completados. */
  all() { return this._load(); },

  /** True si la práctica con ese id está completada. */
  isCompleted(id) { return this._load().has(id); },

  /** Alterna el estado completado. Devuelve el nuevo estado (true=completada). */
  toggle(id) {
    const set = this._load();
    if (set.has(id)) { set.delete(id); } else { set.add(id); }
    this._save(set);
    return set.has(id);
  },

  /** Cuántos IDs del array dado están completados. */
  countFor(ids) {
    const set = this._load();
    return ids.filter(id => set.has(id)).length;
  },
};
