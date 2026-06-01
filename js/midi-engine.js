/**
 * PianoFlow — MidiEngine (Web MIDI)
 *
 * Detecta dispositivos MIDI de entrada y reenvía los Note On/Off al Player
 * para el modo seguimiento.
 *
 * Robustez (portado de KeyPlay): Chrome puede dejar los puertos MIDI en estado
 * "closed"/"pending" tras navegar entre pantallas o al bloquear/desbloquear el
 * dispositivo. Reasignar solo `onmidimessage` NO los reabre de forma fiable, así
 * que SIEMPRE llamamos `port.open()` al (re)vincular. Además:
 *   - vinculamos TODOS los inputs (no solo el primero), para no depender de un
 *     único puerto que a veces no aparece;
 *   - `ensure()` re-resuelve y re-vincula los puertos; el Player lo llama al
 *     entrar a cada ejercicio y al activar seguimiento;
 *   - reabrimos cuando la pestaña vuelve a estar visible (tablet desbloqueada).
 */
const MidiEngine = {
  access:   null,
  inputs:   [],     // todos los puertos de entrada vinculados
  input:    null,   // puerto primario (primero) — usado para estado/visibilidad
  _visBound: false,

  supported() { return !!navigator.requestMIDIAccess; },

  // Solicita acceso y engancha los dispositivos disponibles.
  async init() {
    if (!this.supported()) return false;
    try {
      this.access = await navigator.requestMIDIAccess({ sysex: false });
      this.access.onstatechange = () => this._refresh();
      this._refresh();
      this._bindVisibility();
      return true;
    } catch (e) {
      return false;
    }
  },

  // Reabrir puertos cuando la pestaña/ventana vuelve a primer plano. El OS
  // suele cerrar los puertos MIDI al bloquear la pantalla sin emitir statechange.
  _bindVisibility() {
    if (this._visBound) return;
    this._visBound = true;
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.ensure();
    });
    window.addEventListener('focus', () => this.ensure());
  },

  // Lista de nombres de dispositivos de entrada conectados.
  deviceNames() {
    if (!this.access) return [];
    return [...this.access.inputs.values()].map(i => i.name);
  },

  // (Re)vincula un puerto: asigna el handler Y fuerza open() para reabrirlo.
  _bind(port) {
    if (!port) return;
    port.onmidimessage = (e) => this._onMessage(e);
    try {
      const p = port.open && port.open();
      if (p && typeof p.then === 'function') p.catch(() => {});
    } catch (e) { /* ya abierto o no soportado — ignorar */ }
  },

  // Re-evalúa la lista actual de inputs y los vincula todos.
  _refresh() {
    const list = this.access ? [...this.access.inputs.values()] : [];
    list.forEach(p => this._bind(p));
    this.inputs = list;
    this.input  = list[0] || null;
    if (typeof App !== 'undefined' && App._onMidiDevices) App._onMidiDevices(list);
  },

  // Re-resuelve y re-vincula todo. El Player lo llama al entrar a un ejercicio
  // y al activar seguimiento, para que el MIDI nunca quede "muerto" tras navegar.
  ensure() {
    if (!this.access) return false;
    this._refresh();
    return !!this.input;
  },

  _onMessage(e) {
    const cmd  = e.data[0] & 0xF0;
    const note = e.data[1];
    const vel  = e.data[2];
    if (cmd === 0x90 && vel > 0) {
      if (Player.followNoteOn) Player.followNoteOn(note);
    } else if (cmd === 0x80 || (cmd === 0x90 && vel === 0)) {
      if (Player.followNoteOff) Player.followNoteOff(note);
    }
  },

  disconnect() {
    this.inputs.forEach(p => { try { p.onmidimessage = null; } catch (e) {} });
    this.inputs = [];
    this.input  = null;
    if (this.access) { this.access.onstatechange = null; this.access = null; }
  },
};
