// // dev-tools.js
// (function () {
//   const container = document.querySelector('.hand-sprite');
//   const readout = document.getElementById('dev-readout');
//   const hotspots = document.querySelectorAll('.hotspot');
//   const values = {};

//   // create the readout panel dynamically too, so nothing extra needs to live in HTML
//   const panel = document.createElement('div');
//   panel.id = 'dev-readout';
//   panel.style.cssText = `
//     position:fixed; bottom:10px; right:10px; background:#111; color:#0f0;
//     font:12px monospace; padding:10px; max-width:400px; max-height:300px;
//     overflow:auto; z-index:9999; white-space:pre-wrap;
//   `;
//   panel.textContent = 'Drag hotspots to move. Drag the corner square to resize.';
//   document.body.appendChild(panel);

//   hotspots.forEach(spot => {
//     spot.style.background = 'rgba(0,255,0,0.15)';
//     spot.style.cursor = 'move';
//     spot.style.boxSizing = 'border-box';

//     const handle = document.createElement('div');
//     handle.style.cssText = `
//       position:absolute; right:-4px; bottom:-4px;
//       width:10px; height:10px; background:lime;
//       cursor:nwse-resize; z-index:2;
//     `;
//     spot.appendChild(handle);

//     let mode = null, startX, startY, startLeft, startTop, startW, startH;

//     spot.addEventListener('mousedown', e => {
//       if (e.target === handle) return;
//       mode = 'move';
//       startDrag(e);
//     });

//     handle.addEventListener('mousedown', e => {
//       mode = 'resize';
//       startDrag(e);
//       e.stopPropagation();
//     });

//     function startDrag(e) {
//       e.preventDefault();
//       const rect = spot.getBoundingClientRect();
//       const parentRect = container.getBoundingClientRect();
//       startX = e.clientX;
//       startY = e.clientY;
//       startLeft = rect.left - parentRect.left;
//       startTop = rect.top - parentRect.top;
//       startW = rect.width;
//       startH = rect.height;
//     }

//     document.addEventListener('mousemove', e => {
//       if (!mode) return;
//       const parentRect = container.getBoundingClientRect();
//       const dx = e.clientX - startX;
//       const dy = e.clientY - startY;

//       if (mode === 'move') {
//         spot.style.left = (((startLeft + dx) / parentRect.width) * 100).toFixed(2) + '%';
//         spot.style.top = (((startTop + dy) / parentRect.height) * 100).toFixed(2) + '%';
//       } else if (mode === 'resize') {
//         spot.style.width = (((startW + dx) / parentRect.width) * 100).toFixed(2) + '%';
//         spot.style.height = (((startH + dy) / parentRect.height) * 100).toFixed(2) + '%';
//       }
//       updateReadout(spot);
//     });

//     document.addEventListener('mouseup', () => mode = null);
//   });

//   function updateReadout(spot) {
//     const cls = [...spot.classList].find(c => c.startsWith('hotspot-'));
//     values[cls] = `.${cls} { top: ${spot.style.top}; left: ${spot.style.left}; width: ${spot.style.width}; height: ${spot.style.height}; }`;
//     panel.textContent = Object.values(values).join('\n');
//   }
// })();


// // dev-tools.js
// (function () {
//   const panel = document.createElement('div');
//   panel.id = 'dev-readout';
//   panel.style.cssText = `
//     position:fixed; bottom:10px; right:10px; background:#111; color:#0f0;
//     font:12px monospace; padding:10px; max-width:420px; max-height:320px;
//     overflow:auto; z-index:9999; white-space:pre-wrap;
//   `;
//   panel.textContent = 'Drag elements to move. Drag the corner square to resize.';
//   document.body.appendChild(panel);

//   const values = {};

//   function updateReadout(label, el) {
//     values[label] = `.${label} { position: absolute; top: ${el.style.top}; left: ${el.style.left}; width: ${el.style.width}; height: ${el.style.height}; }`;
//     panel.textContent = Object.values(values).join('\n');
//   }

//   function makeDraggable(el, label, parent) {
//     const rectBefore = el.getBoundingClientRect();
//     const parentRectBefore = parent.getBoundingClientRect();

//     el.style.position = 'absolute';
//     el.style.left = (((rectBefore.left - parentRectBefore.left) / parentRectBefore.width) * 100).toFixed(2) + '%';
//     el.style.top = (((rectBefore.top - parentRectBefore.top) / parentRectBefore.height) * 100).toFixed(2) + '%';
//     el.style.width = ((rectBefore.width / parentRectBefore.width) * 100).toFixed(2) + '%';
//     el.style.height = ((rectBefore.height / parentRectBefore.height) * 100).toFixed(2) + '%';
//     el.style.outline = '1px dashed lime';
//     el.style.cursor = 'move';
//     el.style.boxSizing = 'border-box';

//     const handle = document.createElement('div');
//     handle.style.cssText = `
//       position:fixed; width:10px; height:10px; background:lime;
//       cursor:nwse-resize; z-index:9999;
//     `;
//     document.body.appendChild(handle);

//     function positionHandle() {
//       const r = el.getBoundingClientRect();
//       handle.style.left = (r.right - 5) + 'px';
//       handle.style.top = (r.bottom - 5) + 'px';
//     }
//     positionHandle();

//     let mode = null, startX, startY, startLeft, startTop, startW, startH;

//     el.addEventListener('mousedown', e => { mode = 'move'; startDrag(e); });
//     handle.addEventListener('mousedown', e => { mode = 'resize'; startDrag(e); e.stopPropagation(); });

//     function startDrag(e) {
//       e.preventDefault();
//       const rect = el.getBoundingClientRect();
//       const parentRect = parent.getBoundingClientRect();
//       startX = e.clientX;
//       startY = e.clientY;
//       startLeft = rect.left - parentRect.left;
//       startTop = rect.top - parentRect.top;
//       startW = rect.width;
//       startH = rect.height;
//     }

//     document.addEventListener('mousemove', e => {
//       if (!mode) return;
//       const parentRect = parent.getBoundingClientRect();
//       const dx = e.clientX - startX;
//       const dy = e.clientY - startY;

//       if (mode === 'move') {
//         el.style.left = (((startLeft + dx) / parentRect.width) * 100).toFixed(2) + '%';
//         el.style.top = (((startTop + dy) / parentRect.height) * 100).toFixed(2) + '%';
//       } else if (mode === 'resize') {
//         el.style.width = (((startW + dx) / parentRect.width) * 100).toFixed(2) + '%';
//         el.style.height = (((startH + dy) / parentRect.height) * 100).toFixed(2) + '%';
//       }
//       positionHandle();
//       updateReadout(label, el);
//     });

//     document.addEventListener('mouseup', () => mode = null);

//     updateReadout(label, el);
//   }

//   // ===== Hotspots =====
//   function makeHotspotsEditable() {
//     const container = document.querySelector('.hand-sprite');
//     document.querySelectorAll('.hotspot').forEach(spot => {
//       const label = [...spot.classList].find(c => /-\d+$/.test(c)) || 'hotspot';
//       spot.style.background = 'rgba(0,255,0,0.15)';
//       makeDraggable(spot, label, container);
//     });
//   }

//   // ===== Logos =====
//   function makeLogosEditable() {
//     document.querySelectorAll('.grhg_logo, .grhg_bold_logo').forEach(logo => {
//       const parent = logo.offsetParent || logo.parentElement;
//       const label = logo.classList.contains('grhg_bold_logo') ? 'grhg_bold_logo' : 'grhg_logo';
//       makeDraggable(logo, label, parent);
//     });
//   }

//   makeHotspotsEditable();
//   makeLogosEditable();
// })();



// ===================================================
// ===================================================
// ===================================================
// ===================================================

/**
 * dev-tools-words.js
 *
 * Dev-only helper for positioning the .word-label / .hand-btn pairs
 * inside .hand-sprite. Load it the same way you load dev-tools.js:
 *
 *   if (new URLSearchParams(location.search).has('dev')) {
 *     const s = document.createElement('script');
 *     s.src = 'dev-tools-words.js';
 *     document.body.appendChild(s);
 *   }
 *
 * Or just add a second block next to your existing one in index.html.
 *
 * What it does:
 * - Makes every .word-label and its matching .hand-btn draggable + resizable
 *   (drag the body to move, drag the bottom-right handle to resize)
 * - Moving/resizing a .word-label also moves/resizes its paired .hand-btn
 *   (so the invisible click target always matches the visible svg)
 * - Shows a floating panel with live top/left/width/height in %
 *   relative to .hand-sprite, plus a "Copy CSS" button per element
 * - Arrow keys nudge the selected element by 0.1% (hold Shift for 1%)
 */
(function () {
  const container = document.querySelector('.hand-sprite');
  if (!container) {
    console.warn('[dev-tools-words] .hand-sprite not found, aborting.');
    return;
  }

  // Pair up each word-label with its matching hand-btn by naming convention:
  // word-projects <-> hand-btn-projects, word-random <-> hand-btn-random, etc.
  const labels = Array.from(container.querySelectorAll('.word-label'));
  const pairs = labels.map((label) => {
    const key = Array.from(label.classList)
      .find((c) => c.startsWith('word-') && c !== 'word-label')
      ?.replace('word-', '');
    const btn = key ? container.querySelector(`.hand-btn-${key}`) : null;
    return { key, label, btn };
  });

  if (!pairs.length) {
    console.warn('[dev-tools-words] No .word-label elements found.');
  }

  // ---- styling for the dev overlay ----
  const style = document.createElement('style');
  style.textContent = `
    .dw-outline {
      outline: 1px dashed rgba(255,0,0,0.7) !important;
      cursor: move;
    }
    .dw-outline.dw-selected {
      outline: 2px solid #ff2d55 !important;
      z-index: 999 !important;
    }
    .dw-handle {
      position: absolute;
      width: 10px;
      height: 10px;
      right: -6px;
      bottom: -6px;
      background: #ff2d55;
      border: 1px solid #fff;
      cursor: nwse-resize;
      z-index: 1000;
    }
    #dw-panel {
      position: fixed;
      top: 12px;
      right: 12px;
      width: 300px;
      max-height: 90vh;
      overflow-y: auto;
      background: #1e1e1e;
      color: #eee;
      font: 12px/1.4 monospace;
      padding: 10px;
      border-radius: 8px;
      z-index: 100000;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    }
    #dw-panel h3 {
      margin: 0 0 8px;
      font-size: 13px;
      color: #fff;
    }
    .dw-item {
      border: 1px solid #444;
      border-radius: 6px;
      padding: 6px;
      margin-bottom: 8px;
    }
    .dw-item.dw-active { border-color: #ff2d55; }
    .dw-item .dw-title {
      font-weight: bold;
      margin-bottom: 4px;
      color: #ffb3c6;
    }
    .dw-item .dw-vals { white-space: pre; margin-bottom: 4px; }
    .dw-scale-row { margin-bottom: 4px; }
    .dw-item button {
      font: 11px monospace;
      background: #333;
      color: #eee;
      border: 1px solid #555;
      border-radius: 4px;
      padding: 2px 6px;
      cursor: pointer;
      margin-right: 4px;
    }
    .dw-item button:hover { background: #444; }
  `;
  document.head.appendChild(style);

  // ---- panel ----
  const panel = document.createElement('div');
  panel.id = 'dw-panel';
  panel.innerHTML = `<h3>Word label / button positions</h3>`;
  document.body.appendChild(panel);

  const rows = new Map(); // key -> { row, valsEl }

  pairs.forEach(({ key, label, btn }) => {
    if (!key) return;

    [label, btn].forEach((el) => el && el.classList.add('dw-outline'));

    // .word-label normally has pointer-events: none (so it doesn't block
    // the button underneath), and .hand-btn sits above it in z-index.
    // For dev mode we need the OPPOSITE: label must be clickable/draggable
    // and sit on top, so flip both while this script is active.
    label.style.pointerEvents = 'auto';
    label.style.zIndex = 500;
    if (btn) btn.style.pointerEvents = 'none';

    const handle = document.createElement('div');
    handle.className = 'dw-handle';
    label.style.position = 'absolute';
    label.appendChild(handle);

    const row = document.createElement('div');
    row.className = 'dw-item';
    row.innerHTML = `
      <div class="dw-title">${key}</div>
      <div class="dw-vals"></div>
      <div class="dw-scale-row">
        <button data-action="scale-down">− scale</button>
        <button data-action="scale-up">+ scale</button>
      </div>
      <button data-action="select">Select</button>
      <button data-action="copy">Copy CSS</button>
    `;
    panel.appendChild(row);
    rows.set(key, { row, valsEl: row.querySelector('.dw-vals') });

    row.querySelector('[data-action="select"]').addEventListener('click', () => selectPair(key));
    row.querySelector('[data-action="copy"]').addEventListener('click', () => copyCss(key));
    row.querySelector('[data-action="scale-up"]').addEventListener('click', () => scaleBy(key, 1.05));
    row.querySelector('[data-action="scale-down"]').addEventListener('click', () => scaleBy(key, 1 / 1.05));

    label.addEventListener('mousedown', (e) => startDrag(e, key));
    handle.addEventListener('mousedown', (e) => startResize(e, key));
    label.addEventListener('click', () => selectPair(key));
    label.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        selectPair(key);
        const step = e.shiftKey ? 1.1 : 1.02;
        scaleBy(key, e.deltaY < 0 ? step : 1 / step);
      },
      { passive: false }
    );

    updateReadout(key);
  });

  let selectedKey = null;
  let dragState = null;
  let resizeState = null;

  function selectPair(key) {
    selectedKey = key;
    pairs.forEach(({ key: k, label }) => {
      label.classList.toggle('dw-selected', k === key);
    });
    rows.forEach((v, k) => v.row.classList.toggle('dw-active', k === key));
  }

  function pctRect(el) {
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    return {
      top: ((eRect.top - cRect.top) / cRect.height) * 100,
      left: ((eRect.left - cRect.left) / cRect.width) * 100,
      width: (eRect.width / cRect.width) * 100,
      height: (eRect.height / cRect.height) * 100,
    };
  }

  function applyPct(el, pct) {
    el.style.top = pct.top + '%';
    el.style.left = pct.left + '%';
    if (pct.width != null) el.style.width = pct.width + '%';
    if (pct.height != null) el.style.height = pct.height + '%';
  }

  function updateReadout(key) {
    const pair = pairs.find((p) => p.key === key);
    if (!pair) return;
    const { valsEl } = rows.get(key);
    const p = pctRect(pair.label);
    valsEl.textContent =
      `top: ${p.top.toFixed(2)}%; left: ${p.left.toFixed(2)}%;\n` +
      `width: ${p.width.toFixed(2)}%; height: ${p.height.toFixed(2)}%;`;
  }

  function copyCss(key) {
    const pair = pairs.find((p) => p.key === key);
    if (!pair) return;
    const p = pctRect(pair.label);
    const css =
      `.word-${key} { top: ${p.top.toFixed(2)}%; left: ${p.left.toFixed(2)}%; width: ${p.width.toFixed(2)}%; }\n` +
      `.hand-btn-${key} { top: ${p.top.toFixed(2)}%; left: ${p.left.toFixed(2)}%; width: ${p.width.toFixed(2)}%; height: ${p.height.toFixed(2)}%; }`;
    navigator.clipboard?.writeText(css).catch(() => {});
    console.log('[dev-tools-words] CSS for', key, '\n' + css);
    alert('Copied to clipboard:\n\n' + css);
  }

  function startDrag(e, key) {
    if (e.target.classList.contains('dw-handle')) return; // let resize handle it
    e.preventDefault();
    selectPair(key);
    const pair = pairs.find((p) => p.key === key);
    const cRect = container.getBoundingClientRect();
    dragState = {
      key,
      startX: e.clientX,
      startY: e.clientY,
      startPct: pctRect(pair.label),
      cRect,
    };
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
  }

  function onDrag(e) {
    if (!dragState) return;
    const { key, startX, startY, startPct, cRect } = dragState;
    const dxPct = ((e.clientX - startX) / cRect.width) * 100;
    const dyPct = ((e.clientY - startY) / cRect.height) * 100;
    const newPct = { ...startPct, top: startPct.top + dyPct, left: startPct.left + dxPct };
    setBoth(key, newPct);
  }

  function stopDrag() {
    dragState = null;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
  }

  function startResize(e, key) {
    e.preventDefault();
    e.stopPropagation();
    selectPair(key);
    const pair = pairs.find((p) => p.key === key);
    const cRect = container.getBoundingClientRect();
    resizeState = {
      key,
      startX: e.clientX,
      startY: e.clientY,
      startPct: pctRect(pair.label),
      cRect,
    };
    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', stopResize);
  }

  function onResize(e) {
    if (!resizeState) return;
    const { key, startX, startY, startPct, cRect } = resizeState;
    const dwPct = ((e.clientX - startX) / cRect.width) * 100;
    const dhPct = ((e.clientY - startY) / cRect.height) * 100;
    const newPct = {
      ...startPct,
      width: Math.max(2, startPct.width + dwPct),
      height: Math.max(2, startPct.height + dhPct),
    };
    setBoth(key, newPct);
  }

  function stopResize() {
    resizeState = null;
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopResize);
  }

  function setBoth(key, pct) {
    const pair = pairs.find((p) => p.key === key);
    if (!pair) return;
    applyPct(pair.label, pct);
    if (pair.btn) applyPct(pair.btn, pct);
    updateReadout(key);
  }

  // keyboard nudge for the selected pair
  document.addEventListener('keydown', (e) => {
    if (!selectedKey) return;
    const step = e.shiftKey ? 1 : 0.1;
    const pair = pairs.find((p) => p.key === selectedKey);
    if (!pair) return;
    const p = pctRect(pair.label);
    let handled = true;
    if (e.key === 'ArrowUp') p.top -= step;
    else if (e.key === 'ArrowDown') p.top += step;
    else if (e.key === 'ArrowLeft') p.left -= step;
    else if (e.key === 'ArrowRight') p.left += step;
    else handled = false;
    if (handled) {
      e.preventDefault();
      setBoth(selectedKey, p);
    }
  });

  console.log('[dev-tools-words] loaded. Drag labels to move, drag the pink handle to resize, arrow keys to nudge.');
})();