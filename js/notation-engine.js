/**
 * PianoFlow — Notation Engine (Verovio wrapper)
 *
 * Carga Verovio (WASM) en lazy mode, renderiza una pieza MusicXML como
 * SVG y expone helpers para que el Player resalte el compás activo y
 * posicione las etiquetas sutiles de acorde encima del pentagrama.
 *
 * API:
 *   await NotationEngine.load()
 *   NotationEngine.render(musicXML, containerEl, opts)
 *   NotationEngine.highlightMeasure(index)
 *   NotationEngine.getMeasureBounds(containerEl)  →  [{ index, x, y, w, h }]
 *   NotationEngine.scrollToMeasure(scroller, index)
 */

const NotationEngine = {

  toolkit:  null,
  loading:  null,

  CDN_URL: 'https://www.verovio.org/javascript/latest/verovio-toolkit-wasm.js',

  ready() { return !!this.toolkit; },

  load() {
    if (this.toolkit) return Promise.resolve(this.toolkit);
    if (this.loading) return this.loading;

    this.loading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = this.CDN_URL;
      s.async = true;
      s.onerror = () => reject(new Error('No se pudo cargar Verovio (¿offline o file://?)'));
      s.onload = () => {
        // El runtime de WASM inicializa de forma asíncrona y NO siempre
        // dispara onRuntimeInitialized. Lo más confiable es hacer polling
        // intentando construir el toolkit hasta que tenga éxito (max ~8s).
        let tries = 0;
        const poll = setInterval(() => {
          tries++;
          try {
            this.toolkit = new verovio.toolkit();
            clearInterval(poll);
            resolve(this.toolkit);
          } catch (e) {
            if (tries > 80) {
              clearInterval(poll);
              reject(new Error('Verovio WASM no inicializó. Si abriste index.html con doble click, sirve la carpeta vía http://'));
            }
          }
        }, 100);
      };
      document.head.appendChild(s);
    });

    return this.loading;
  },

  // ── Render ─────────────────────────────────────────────────────

  render(musicXML, container, opts = {}) {
    if (!this.toolkit || !container) return null;

    // Layout horizontal de una sola línea: breaks='none' fuerza a Verovio
    // a poner TODOS los compases en un solo sistema. pageWidth muy ancho
    // para que no comprima, y el contenedor padre hace scroll horizontal.
    // NOTA: NO usamos svgViewBox — Verovio debe escribir width/height
    // explícitos en el SVG, si no CSS lo colapsa a 0 alto.
    const scale = opts.scale || 30;
    this.toolkit.setOptions({
      pageWidth:        60000,
      pageHeight:       60000,
      scale,
      adjustPageHeight: true,
      breaks:           'none',     // ← una sola línea
      spacingNonLinear: 0.65,
      spacingLinear:    0.22,
      header:           'none',
      footer:           'none',
    });

    this.toolkit.loadData(musicXML);
    const svg = this.toolkit.renderToSVG(1);
    container.innerHTML = svg;

    // El SVG generado tiene measures como <g class="measure" id="m...">
    // Le añadimos un atributo data-index para poder ubicarlos por número.
    const measureEls = container.querySelectorAll('g.measure');
    measureEls.forEach((g, idx) => g.setAttribute('data-mindex', idx));

    return container.querySelector('svg');
  },

  // ── Highlights ─────────────────────────────────────────────────

  highlightMeasure(index) {
    document.querySelectorAll('g.measure.pf-active').forEach(g =>
      g.classList.remove('pf-active'));
    const target = document.querySelector(`g.measure[data-mindex="${index}"]`);
    if (target) target.classList.add('pf-active');
  },

  // ── Bounding boxes para overlays ──────────────────────────────
  //
  // Devuelve, en coords del container (no de pantalla), la caja de
  // cada compás. Útil para posicionar etiquetas de acorde encima.

  getMeasureBounds(container) {
    if (!container) return [];
    const containerRect = container.getBoundingClientRect();
    const out = [];
    container.querySelectorAll('g.measure').forEach((g, idx) => {
      const r = g.getBoundingClientRect();
      out.push({
        index: idx,
        x: r.left - containerRect.left + container.scrollLeft,
        y: r.top  - containerRect.top  + container.scrollTop,
        w: r.width,
        h: r.height,
      });
    });
    return out;
  },

  // Lleva el scroll del contenedor para que el compás index quede a la vista.
  scrollToMeasure(scroller, index) {
    if (!scroller) return;
    const g = document.querySelector(`g.measure[data-mindex="${index}"]`);
    if (!g) return;
    const sRect = scroller.getBoundingClientRect();
    const gRect = g.getBoundingClientRect();
    // Vertical scroll (Verovio reparte compases en líneas)
    const yTarget = gRect.top - sRect.top + scroller.scrollTop - sRect.height * 0.35;
    scroller.scrollTo({ top: Math.max(0, yTarget), behavior: 'smooth' });
  },

};
