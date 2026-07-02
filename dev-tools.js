(function () {
  const container = document.querySelector('.hand-sprite');
  if (!container) {
    console.warn('[dev-tools-words] .hand-sprite not found, aborting.');
    return;
  }

  // Helper: pull the "key" (e.g. "projects") off an element's class list,
  // given the possible prefixes it might use.
  function extractKey(el, prefixes) {
    const cls = Array.from(el.classList);
    for (const prefix of prefixes) {
      const match = cls.find((c) => c.startsWith(prefix) && c !== prefix.slice(0, -1));
      if (match) return match.replace(prefix, '');
    }
    return null;
  }

  // ---- build the list of draggable items ----
  // Each item: { id, key, kind, el, linkedEl, cssSelector, linkedCssSelector }

  const items = [];

  // word-labels <-> hand-btn-*
  container.querySelectorAll('.word-label').forEach((label) => {
    const key = extractKey(label, ['word-']);
    if (!key) return;
    const btn = container.querySelector(`.hand-btn-${key}`);
    items.push({
      id: `word-${key}`,
      key,
      kind: 'label',
      el: label,
      linkedEl: btn,
      cssSelector: `.word-${key}`,
      linkedCssSelector: `.hand-btn-${key}`,
    });
  });

  // word-details (accepts either the "detial-" typo or the corrected
  // "detail-" spelling, so this keeps working whichever you use in HTML)
  container.querySelectorAll('.word-detail').forEach((detail) => {
    const key = extractKey(detail, ['detial-', 'detail-']);
    if (!key) return;
    items.push({
      id: `detail-${key}`,
      key,
      kind: 'detail',
      el: detail,
      linkedEl: null,
      cssSelector: `.detail-${key}`, // always emits the corrected spelling
      linkedCssSelector: null,
    });
  });

  if (!items.length) {
    console.warn('[dev-tools-words] No .word-label or .word-detail elements found.');
  }

  // ---- styling for the dev overlay ----
  const style = document.createElement('style');
  style.textContent = `
    .dw-outline {
      outline: 1px dashed rgba(255,0,0,0.7) !important;
      cursor: move;
    }
    .dw-outline.dw-outline-detail {
      outline-color: rgba(0,160,255,0.8) !important;
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
    #dw-panel h4 {
      margin: 10px 0 6px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #888;
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
    .dw-item.dw-item-detail .dw-title { color: #7fd3ff; }
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
  panel.innerHTML = `<h3>Word label / detail / button positions</h3>`;
  document.body.appendChild(panel);

  let lastKind = null;
  const rows = new Map(); // id -> { row, valsEl }

  items.forEach((item) => {
    if (lastKind !== item.kind) {
      const heading = document.createElement('h4');
      heading.textContent = item.kind === 'label' ? 'Labels' : 'Details';
      panel.appendChild(heading);
      lastKind = item.kind;
    }

    [item.el, item.linkedEl].forEach((el) => el && el.classList.add('dw-outline'));
    if (item.kind === 'detail') item.el.classList.add('dw-outline-detail');

    // .word-label / .word-detail normally have pointer-events: none (so
    // they don't block the button underneath), and .hand-btn sits above
    // them in z-index. For dev mode we need the OPPOSITE: the overlay
    // must be clickable/draggable and sit on top, so flip both.
    item.el.style.pointerEvents = 'auto';
    item.el.style.zIndex = 500;
    if (item.linkedEl) item.linkedEl.style.pointerEvents = 'none';

    const handle = document.createElement('div');
    handle.className = 'dw-handle';
    item.el.style.position = 'absolute';
    item.el.appendChild(handle);

    const row = document.createElement('div');
    row.className = `dw-item dw-item-${item.kind}`;
    row.innerHTML = `
      <div class="dw-title">${item.id}</div>
      <div class="dw-vals"></div>
      <div class="dw-scale-row">
        <button data-action="scale-down">− scale</button>
        <button data-action="scale-up">+ scale</button>
      </div>
      <button data-action="select">Select</button>
      <button data-action="copy">Copy CSS</button>
    `;
    panel.appendChild(row);
    rows.set(item.id, { row, valsEl: row.querySelector('.dw-vals') });

    row.querySelector('[data-action="select"]').addEventListener('click', () => selectItem(item.id));
    row.querySelector('[data-action="copy"]').addEventListener('click', () => copyCss(item.id));
    row.querySelector('[data-action="scale-up"]').addEventListener('click', () => scaleBy(item.id, 1.05));
    row.querySelector('[data-action="scale-down"]').addEventListener('click', () => scaleBy(item.id, 1 / 1.05));

    item.el.addEventListener('mousedown', (e) => startDrag(e, item.id));
    handle.addEventListener('mousedown', (e) => startResize(e, item.id));
    item.el.addEventListener('click', () => selectItem(item.id));
    item.el.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        selectItem(item.id);
        const step = e.shiftKey ? 1.1 : 1.02;
        scaleBy(item.id, e.deltaY < 0 ? step : 1 / step);
      },
      { passive: false }
    );

    updateReadout(item.id);
  });

  let selectedId = null;
  let dragState = null;
  let resizeState = null;

  function findItem(id) {
    return items.find((i) => i.id === id);
  }

  function selectItem(id) {
    selectedId = id;
    items.forEach(({ id: itemId, el }) => {
      el.classList.toggle('dw-selected', itemId === id);
    });
    rows.forEach((v, k) => v.row.classList.toggle('dw-active', k === id));
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

  function updateReadout(id) {
    const item = findItem(id);
    if (!item) return;
    const { valsEl } = rows.get(id);
    const p = pctRect(item.el);
    valsEl.textContent =
      `top: ${p.top.toFixed(2)}%; left: ${p.left.toFixed(2)}%;\n` +
      `width: ${p.width.toFixed(2)}%; height: ${p.height.toFixed(2)}%;`;
  }

  function copyCss(id) {
    const item = findItem(id);
    if (!item) return;
    const p = pctRect(item.el);
    let css = `${item.cssSelector} { top: ${p.top.toFixed(2)}%; left: ${p.left.toFixed(2)}%; width: ${p.width.toFixed(2)}%; }`;
    if (item.linkedEl) {
      const lp = pctRect(item.linkedEl);
      css += `\n${item.linkedCssSelector} { top: ${lp.top.toFixed(2)}%; left: ${lp.left.toFixed(2)}%; width: ${lp.width.toFixed(2)}%; height: ${lp.height.toFixed(2)}%; }`;
    }
    navigator.clipboard?.writeText(css).catch(() => {});
    console.log('[dev-tools-words] CSS for', id, '\n' + css);
    alert('Copied to clipboard:\n\n' + css);
  }

  function startDrag(e, id) {
    if (e.target.classList.contains('dw-handle')) return; // let resize handle it
    e.preventDefault();
    selectItem(id);
    const item = findItem(id);
    const cRect = container.getBoundingClientRect();
    dragState = { id, startX: e.clientX, startY: e.clientY, startPct: pctRect(item.el), cRect };
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
  }

  function onDrag(e) {
    if (!dragState) return;
    const { id, startX, startY, startPct, cRect } = dragState;
    const dxPct = ((e.clientX - startX) / cRect.width) * 100;
    const dyPct = ((e.clientY - startY) / cRect.height) * 100;
    const newPct = { ...startPct, top: startPct.top + dyPct, left: startPct.left + dxPct };
    setPosition(id, newPct);
  }

  function stopDrag() {
    dragState = null;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
  }

  function startResize(e, id) {
    e.preventDefault();
    e.stopPropagation();
    selectItem(id);
    const item = findItem(id);
    const cRect = container.getBoundingClientRect();
    resizeState = { id, startX: e.clientX, startY: e.clientY, startPct: pctRect(item.el), cRect };
    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', stopResize);
  }

  function onResize(e) {
    if (!resizeState) return;
    const { id, startX, startY, startPct, cRect } = resizeState;
    const dwPct = ((e.clientX - startX) / cRect.width) * 100;
    const dhPct = ((e.clientY - startY) / cRect.height) * 100;
    const newPct = {
      ...startPct,
      width: Math.max(2, startPct.width + dwPct),
      height: Math.max(2, startPct.height + dhPct),
    };
    setPosition(id, newPct);
  }

  function stopResize() {
    resizeState = null;
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopResize);
  }

  function scaleBy(id, factor) {
    const item = findItem(id);
    if (!item) return;
    const p = pctRect(item.el);
    const cx = p.left + p.width / 2;
    const cy = p.top + p.height / 2;
    const newW = p.width * factor;
    const newH = p.height * factor;
    setPosition(id, { top: cy - newH / 2, left: cx - newW / 2, width: newW, height: newH });
  }

  // Moves the item's own element, and — only for items with a linkedEl
  // (word-labels linked to hand-btn-*) — moves the linked element too.
  // word-details have no linkedEl, so they move independently.
  function setPosition(id, pct) {
    const item = findItem(id);
    if (!item) return;
    applyPct(item.el, pct);
    if (item.linkedEl) applyPct(item.linkedEl, pct);
    updateReadout(id);
  }

  // keyboard nudge for the selected item
  document.addEventListener('keydown', (e) => {
    if (!selectedId) return;
    const step = e.shiftKey ? 1 : 0.1;
    const item = findItem(selectedId);
    if (!item) return;
    const p = pctRect(item.el);
    let handled = true;
    if (e.key === 'ArrowUp') p.top -= step;
    else if (e.key === 'ArrowDown') p.top += step;
    else if (e.key === 'ArrowLeft') p.left -= step;
    else if (e.key === 'ArrowRight') p.left += step;
    else handled = false;
    if (handled) {
      e.preventDefault();
      setPosition(selectedId, p);
    }
  });

  console.log('[dev-tools-words] loaded. Drag labels/details to move, drag the pink handle to resize, arrow keys to nudge.');
})();