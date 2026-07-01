// dev-tools.js
(function () {
  const container = document.querySelector('.hand-sprite');
  const readout = document.getElementById('dev-readout');
  const hotspots = document.querySelectorAll('.hotspot');
  const values = {};

  // create the readout panel dynamically too, so nothing extra needs to live in HTML
  const panel = document.createElement('div');
  panel.id = 'dev-readout';
  panel.style.cssText = `
    position:fixed; bottom:10px; right:10px; background:#111; color:#0f0;
    font:12px monospace; padding:10px; max-width:400px; max-height:300px;
    overflow:auto; z-index:9999; white-space:pre-wrap;
  `;
  panel.textContent = 'Drag hotspots to move. Drag the corner square to resize.';
  document.body.appendChild(panel);

  hotspots.forEach(spot => {
    spot.style.background = 'rgba(0,255,0,0.15)';
    spot.style.cursor = 'move';
    spot.style.boxSizing = 'border-box';

    const handle = document.createElement('div');
    handle.style.cssText = `
      position:absolute; right:-4px; bottom:-4px;
      width:10px; height:10px; background:lime;
      cursor:nwse-resize; z-index:2;
    `;
    spot.appendChild(handle);

    let mode = null, startX, startY, startLeft, startTop, startW, startH;

    spot.addEventListener('mousedown', e => {
      if (e.target === handle) return;
      mode = 'move';
      startDrag(e);
    });

    handle.addEventListener('mousedown', e => {
      mode = 'resize';
      startDrag(e);
      e.stopPropagation();
    });

    function startDrag(e) {
      e.preventDefault();
      const rect = spot.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left - parentRect.left;
      startTop = rect.top - parentRect.top;
      startW = rect.width;
      startH = rect.height;
    }

    document.addEventListener('mousemove', e => {
      if (!mode) return;
      const parentRect = container.getBoundingClientRect();
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (mode === 'move') {
        spot.style.left = (((startLeft + dx) / parentRect.width) * 100).toFixed(2) + '%';
        spot.style.top = (((startTop + dy) / parentRect.height) * 100).toFixed(2) + '%';
      } else if (mode === 'resize') {
        spot.style.width = (((startW + dx) / parentRect.width) * 100).toFixed(2) + '%';
        spot.style.height = (((startH + dy) / parentRect.height) * 100).toFixed(2) + '%';
      }
      updateReadout(spot);
    });

    document.addEventListener('mouseup', () => mode = null);
  });

  function updateReadout(spot) {
    const cls = [...spot.classList].find(c => c.startsWith('hotspot-'));
    values[cls] = `.${cls} { top: ${spot.style.top}; left: ${spot.style.left}; width: ${spot.style.width}; height: ${spot.style.height}; }`;
    panel.textContent = Object.values(values).join('\n');
  }
})();


// dev-tools.js
(function () {
  const panel = document.createElement('div');
  panel.id = 'dev-readout';
  panel.style.cssText = `
    position:fixed; bottom:10px; right:10px; background:#111; color:#0f0;
    font:12px monospace; padding:10px; max-width:420px; max-height:320px;
    overflow:auto; z-index:9999; white-space:pre-wrap;
  `;
  panel.textContent = 'Drag elements to move. Drag the corner square to resize.';
  document.body.appendChild(panel);

  const values = {};

  function updateReadout(label, el) {
    values[label] = `.${label} { position: absolute; top: ${el.style.top}; left: ${el.style.left}; width: ${el.style.width}; height: ${el.style.height}; }`;
    panel.textContent = Object.values(values).join('\n');
  }

  function makeDraggable(el, label, parent) {
    const rectBefore = el.getBoundingClientRect();
    const parentRectBefore = parent.getBoundingClientRect();

    el.style.position = 'absolute';
    el.style.left = (((rectBefore.left - parentRectBefore.left) / parentRectBefore.width) * 100).toFixed(2) + '%';
    el.style.top = (((rectBefore.top - parentRectBefore.top) / parentRectBefore.height) * 100).toFixed(2) + '%';
    el.style.width = ((rectBefore.width / parentRectBefore.width) * 100).toFixed(2) + '%';
    el.style.height = ((rectBefore.height / parentRectBefore.height) * 100).toFixed(2) + '%';
    el.style.outline = '1px dashed lime';
    el.style.cursor = 'move';
    el.style.boxSizing = 'border-box';

    const handle = document.createElement('div');
    handle.style.cssText = `
      position:fixed; width:10px; height:10px; background:lime;
      cursor:nwse-resize; z-index:9999;
    `;
    document.body.appendChild(handle);

    function positionHandle() {
      const r = el.getBoundingClientRect();
      handle.style.left = (r.right - 5) + 'px';
      handle.style.top = (r.bottom - 5) + 'px';
    }
    positionHandle();

    let mode = null, startX, startY, startLeft, startTop, startW, startH;

    el.addEventListener('mousedown', e => { mode = 'move'; startDrag(e); });
    handle.addEventListener('mousedown', e => { mode = 'resize'; startDrag(e); e.stopPropagation(); });

    function startDrag(e) {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left - parentRect.left;
      startTop = rect.top - parentRect.top;
      startW = rect.width;
      startH = rect.height;
    }

    document.addEventListener('mousemove', e => {
      if (!mode) return;
      const parentRect = parent.getBoundingClientRect();
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (mode === 'move') {
        el.style.left = (((startLeft + dx) / parentRect.width) * 100).toFixed(2) + '%';
        el.style.top = (((startTop + dy) / parentRect.height) * 100).toFixed(2) + '%';
      } else if (mode === 'resize') {
        el.style.width = (((startW + dx) / parentRect.width) * 100).toFixed(2) + '%';
        el.style.height = (((startH + dy) / parentRect.height) * 100).toFixed(2) + '%';
      }
      positionHandle();
      updateReadout(label, el);
    });

    document.addEventListener('mouseup', () => mode = null);

    updateReadout(label, el);
  }

  // ===== Hotspots =====
  function makeHotspotsEditable() {
    const container = document.querySelector('.hand-sprite');
    document.querySelectorAll('.hotspot').forEach(spot => {
      const label = [...spot.classList].find(c => /-\d+$/.test(c)) || 'hotspot';
      spot.style.background = 'rgba(0,255,0,0.15)';
      makeDraggable(spot, label, container);
    });
  }

  // ===== Logos =====
  function makeLogosEditable() {
    document.querySelectorAll('.grhg_logo, .grhg_bold_logo').forEach(logo => {
      const parent = logo.offsetParent || logo.parentElement;
      const label = logo.classList.contains('grhg_bold_logo') ? 'grhg_bold_logo' : 'grhg_logo';
      makeDraggable(logo, label, parent);
    });
  }

  makeHotspotsEditable();
  makeLogosEditable();
})();