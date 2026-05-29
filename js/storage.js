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

};
