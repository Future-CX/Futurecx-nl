// Configuration
const categoriesOrder = ['Data & AI', 'Advertising & Promotion', 'Content & Experience', 'CRM & Analytics', 'Commerce & Sales', 'Software Architecture'];
const categoryColors = {
  'Data & AI': 'var(--c-data-ai)',
  'Advertising & Promotion': 'var(--c-adv-promo)',
  'Content & Experience': 'var(--c-content-exp)',
  'CRM & Analytics': 'var(--c-crm-analytics)',
  'Commerce & Sales': 'var(--c-commerce-sales)',
  'Software Architecture': 'var(--c-software-arch)',
};
const stageOrder = ['Innovators', 'Early Adopters', 'Early Majority', 'Late Majority']; // for overview display order
const ringOrder = ['Late Majority', 'Early Majority', 'Early Adopters', 'Innovators']; // inner -> outer
const ringIndexByStage = {
  'Late Majority': 0,
  'Early Majority': 1,
  'Early Adopters': 2,
  Innovators: 3,
  Laggards: 4, // plot just beyond the outer ring
};

// Utility helpers
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100);

const seeded = (str) => {
  // simple string hash -> [0,1)
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // final scramble
  h += h << 13;
  h ^= h >>> 7;
  h += h << 3;
  h ^= h >>> 17;
  h += h << 5;
  return ((h >>> 0) % 10000) / 10000;
};

// Parse markdown to structured data
function parseTrends(md) {
  const lines = md.split('\n');
  const trends = [];
  let cur = null;

  for (let raw of lines) {
    const line = raw.trim();
    if (line.startsWith('## Trend:')) {
      if (cur) trends.push(cur);
      cur = { name: line.replace(/^##\s*Trend:\s*/, '').trim(), category: '', stage: '', summary: '', sources: [] };
    } else if (cur && line.startsWith('- Category:')) {
      cur.category = line.split(':')[1].trim();
    } else if (cur && line.startsWith('- Stage:')) {
      cur.stage = line.split(':')[1].trim();
    } else if (cur && line.startsWith('- Why it fits here:')) {
      cur.summary = line.substring(line.indexOf(':') + 1).trim();
    } else if (cur && line.startsWith('- Sources:')) {
      const v = line.substring(line.indexOf(':') + 1).trim();
      const parts = v
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean);
      cur.sources = parts;
    }
  }
  if (cur) trends.push(cur);

  // keep only known categories; attach id
  return trends.filter((t) => categoriesOrder.includes(t.category)).map((t) => ({ ...t, id: slug(t.name) }));
}

// Radar drawing and layout
function drawRadar(trends) {
  const svg = document.getElementById('radar');
  const gGrid = document.getElementById('grid');
  const gLabels = document.getElementById('labels');
  const gDots = document.getElementById('dots');

  const W = 1000,
    H = 900;
  const cx = W / 2,
    cy = H / 2;
  const sliceCount = categoriesOrder.length;
  const sliceAngle = (Math.PI * 2) / sliceCount;
  const startAngle = -Math.PI / 2; // top
  const outerRadius = 360;
  const ringCount = 4;
  const ringThickness = outerRadius / ringCount;
  const laggardsBandInner = outerRadius + 14;
  const laggardsBandThickness = 26;
  const slicePad = (Math.PI / 180) * 6; // 6 deg

  // Draw rings
  for (let i = 1; i <= ringCount; i++) {
    const r = i * ringThickness;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', i === ringCount ? '#D1D5DB' : '#E5E7EB');
    circle.setAttribute('stroke-width', i === ringCount ? '1.25' : '1');
    gGrid.appendChild(circle);
  }
  // Laggards band boundary (dashed)
  const lagOuter = laggardsBandInner + laggardsBandThickness;
  const lagCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  lagCircle.setAttribute('cx', cx);
  lagCircle.setAttribute('cy', cy);
  lagCircle.setAttribute('r', lagOuter);
  lagCircle.setAttribute('fill', 'none');
  lagCircle.setAttribute('stroke', '#E5E7EB');
  lagCircle.setAttribute('stroke-dasharray', '4 4');
  gGrid.appendChild(lagCircle);

  // Slice spokes
  for (let s = 0; s < sliceCount; s++) {
    const ang = startAngle + s * sliceAngle;
    const x = cx + Math.cos(ang) * (outerRadius + laggardsBandThickness);
    const y = cy + Math.sin(ang) * (outerRadius + laggardsBandThickness);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', x);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', '#E5E7EB');
    line.setAttribute('stroke-width', '1');
    gGrid.appendChild(line);
  }

  // Category labels around
  const labelRadius = outerRadius + 52;
  const labelSafetyGap = 36;
  const maxDotRadius = labelRadius - labelSafetyGap;
  for (let s = 0; s < sliceCount; s++) {
    const label = categoriesOrder[s];
    const midAng = startAngle + (s + 0.5) * sliceAngle;

    const x = cx + Math.cos(midAng) * labelRadius;
    const y = cy + Math.sin(midAng) * labelRadius + 20;

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('text-anchor', Math.cos(midAng) > 0.3 ? 'start' : Math.cos(midAng) < -0.3 ? 'end' : 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', '#4B5563');
    text.setAttribute('font-size', '13');
    text.setAttribute('font-weight', '600');

    const words = label.split(' ');
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(' ');
    const line2 = words.slice(mid).join(' ');

    const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan1.setAttribute('x', x);
    tspan1.setAttribute('dy', '-0.6em');
    tspan1.textContent = line1;

    const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan2.setAttribute('x', x);
    tspan2.setAttribute('dy', '1.2em');
    tspan2.textContent = line2;

    text.appendChild(tspan1);
    text.appendChild(tspan2);
    gLabels.appendChild(text);
  }

  // Bucket trends by [category, ringIndex]
  const buckets = new Map();
  const byId = new Map();
  for (const t of trends) {
    const rIdx = ringIndexByStage[t.stage] ?? 0;
    const key = `${t.category}|${rIdx}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(t);
    byId.set(t.id, t);
  }

  // Place dots
  const positions = new Map();
  for (let s = 0; s < sliceCount; s++) {
    const cat = categoriesOrder[s];
    const sStart = startAngle + s * sliceAngle + slicePad;
    const sEnd = startAngle + (s + 1) * sliceAngle - slicePad;

    for (let rIdx = 0; rIdx <= 4; rIdx++) {
      const key = `${cat}|${rIdx}`;
      const items = buckets.get(key) || [];
      if (items.length === 0) continue;

      for (let j = 0; j < items.length; j++) {
        const t = items[j];
        const frac = (j + 1) / (items.length + 1);
        const ang = sStart + frac * (sEnd - sStart);

        let radius;
        if (rIdx < 4) {
          const inner = rIdx * ringThickness;
          const outer = inner + ringThickness;

          const sd = seeded(t.name);
          const pad = 0.18;
          let rr = inner + ringThickness * (pad + sd * (1 - 2 * pad));

          radius = Math.min(rr, maxDotRadius);
        } else {
          const lagCenter = laggardsBandInner + laggardsBandThickness * 0.5;
          radius = Math.min(lagCenter, maxDotRadius);
        }

        const x = cx + Math.cos(ang) * radius;
        const y = cy + Math.sin(ang) * radius;

        // Draw dot
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', x.toFixed(2));
        c.setAttribute('cy', y.toFixed(2));
        c.setAttribute('r', '5');
        c.setAttribute('fill', getComputedStyle(document.documentElement).getPropertyValue(colorVarForCategory(t.category)).trim() || '#000');
        c.setAttribute('stroke', '#ffffff');
        c.setAttribute('stroke-width', '2');
        c.setAttribute('data-id', t.id);
        c.setAttribute('data-category', t.category);
        c.setAttribute('data-stage', t.stage);
        c.setAttribute('tabindex', '0');
        c.setAttribute('role', 'button');
        c.setAttribute('aria-label', `${t.name} — ${t.stage} in ${t.category}`);
        c.dataset.baseR = '5';
        gDots.appendChild(c);
      }
    }
  }

  // Interactions
  const tooltip = document.getElementById('tooltip');
  const ttName = document.getElementById('ttName');
  const ttSummary = document.getElementById('ttSummary');
  const ttMeta = document.getElementById('ttMeta');
  const card = document.getElementById('detailCard');
  const cardTitle = document.getElementById('cardTitle');
  const cardMeta = document.getElementById('cardMeta');
  const cardSummary = document.getElementById('cardSummary');
  const cardSources = document.getElementById('cardSources');
  const cardClose = document.getElementById('cardClose');
  let hoverId = null;
  let selectedId = null;

  function showTooltipFor(t, evtTarget, evt) {
    if (!t) return;
    hoverId = t.id;
    ttName.textContent = t.name;
    ttSummary.textContent = t.summary;
    ttMeta.textContent = `${t.category} • ${t.stage}`;
    tooltip.style.display = 'block';
    tooltip.setAttribute('aria-hidden', 'false');
    positionTooltip(evt);
  }
  function hideTooltip() {
    tooltip.style.display = 'none';
    tooltip.setAttribute('aria-hidden', 'true');
    hoverId = null;
  }
  function positionTooltip(evt) {
    const pad = 12;
    let x = evt.clientX + pad;
    let y = evt.clientY + pad;
    const rect = tooltip.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (x + rect.width + pad > vw) x = Math.max(pad, evt.clientX - rect.width - pad);
    if (y + rect.height + pad > vh) y = Math.max(pad, evt.clientY - rect.height - pad);
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  }
  function resizeCircle(el, r) {
    el.setAttribute('r', String(r));
  }
  function clearSelections() {
    const prev = selectedId && svg.querySelector(`circle[data-id="${CSS.escape(selectedId)}"]`);
    if (prev) resizeCircle(prev, prev.dataset.baseR || 5);
    selectedId = null;
  }
  function showCard(t) {
    if (!t) return;
    selectedId = t.id;
    const dot = svg.querySelector(`circle[data-id="${CSS.escape(t.id)}"]`);
    if (dot) resizeCircle(dot, 8);

    cardTitle.textContent = t.name;
    cardSummary.textContent = t.summary;
    cardMeta.innerHTML = `<span class="badge">${t.category}</span><span class="badge">${t.stage}</span>`;
    cardSources.innerHTML = '';
    cardSources.innerHTML += '<span class="readmore">Read More</span>';
    t.sources.forEach((url) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = '↗ ' + extractDomain(url);
      a.title = url;
      li.appendChild(a);
      cardSources.appendChild(li);
    });
    card.classList.add('visible');
  }
  function extractDomain(url) {
    return new URL(url).hostname.replace(/^www\./, '');
  }
  function handleDotEnter(e) {
    const el = e.target.closest('circle[data-id]');
    if (!el) return;
    const id = el.getAttribute('data-id');
    const t = byId.get(id);
    resizeCircle(el, 8); // only size transform on hover
    showTooltipFor(t, el, e);
  }
  function handleDotMove(e) {
    if (tooltip.style.display === 'block') positionTooltip(e);
  }
  function handleDotLeave(e) {
    const el = e.target.closest('circle[data-id]');
    if (el && el.getAttribute('data-id') !== selectedId) {
      resizeCircle(el, el.dataset.baseR || 5);
    } else if (el && el.getAttribute('data-id') === selectedId) {
      // keep selected a bit larger
      resizeCircle(el, 8);
    }
    hideTooltip();
  }
  function handleDotClick(e) {
    const el = e.target.closest('circle[data-id]');
    if (!el) return;
    const id = el.getAttribute('data-id');
    const t = byId.get(id);
    // clear previous selection size
    if (selectedId && selectedId !== id) {
      const prev = svg.querySelector(`circle[data-id="${CSS.escape(selectedId)}"]`);
      if (prev) resizeCircle(prev, prev.dataset.baseR || 5);
    }
    showCard(t);
  }
  function handleTooltipClick() {
    if (!hoverId) return;
    const t = byId.get(hoverId);
    if (t) showCard(t);
  }
  function handleCardClose() {
    card.classList.remove('visible');
    clearSelections();
  }

  svg.addEventListener('mouseover', handleDotEnter);
  svg.addEventListener('mousemove', handleDotMove);
  svg.addEventListener('mouseout', handleDotLeave);
  svg.addEventListener('click', handleDotClick);
  tooltip.addEventListener('click', handleTooltipClick);
  cardClose.addEventListener('click', handleCardClose);

  // Keyboard accessibility: Enter/Space to open card
  svg.addEventListener('keydown', (e) => {
    const el = e.target.closest('circle[data-id]');
    if (!el) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const id = el.getAttribute('data-id');
      const t = byId.get(id);
      showCard(t);
    }
  });

  // Build legends and overview
  buildLegends();
  buildOverview(trends, byId);
}

function colorVarForCategory(cat) {
  switch (cat) {
    case 'Data & AI':
      return '--c-data-ai';
    case 'Advertising & Promotion':
      return '--c-adv-promo';
    case 'Content & Experience':
      return '--c-content-exp';
    case 'CRM & Analytics':
      return '--c-crm-analytics';
    case 'Commerce & Sales':
      return '--c-commerce-sales';
    case 'Software Architecture':
      return '--c-software-arch';
    default:
      return '--c-data-ai';
  }
}

function buildLegends() {
  const cont = document.getElementById('legendCategories');
  cont.innerHTML = '';
  for (const cat of categoriesOrder) {
    const item = document.createElement('div');
    item.className = 'item';
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = getComputedStyle(document.documentElement).getPropertyValue(colorVarForCategory(cat)).trim();
    item.appendChild(dot);
    const label = document.createElement('span');
    label.textContent = cat;
    item.appendChild(label);
    cont.appendChild(item);
  }
}

function buildOverview(trends, byId) {
  const grid = document.getElementById('overviewGrid');
  grid.innerHTML = '';

  // Group by category then by stage
  const byCatStage = new Map();
  for (const cat of categoriesOrder) {
    byCatStage.set(cat, {
      Innovators: [],
      'Early Adopters': [],
      'Early Majority': [],
      'Late Majority': [],
      Laggards: [],
    });
  }
  for (const t of trends) {
    const g = byCatStage.get(t.category);
    if (g) (g[t.stage] || g['Early Majority']).push(t);
  }

  for (const cat of categoriesOrder) {
    const col = document.createElement('div');
    col.className = 'col';

    const h3 = document.createElement('h3');
    const swatch = document.createElement('span');
    swatch.className = 'swatch';
    swatch.style.background = getComputedStyle(document.documentElement).getPropertyValue(colorVarForCategory(cat)).trim();
    h3.appendChild(swatch);
    const title = document.createElement('span');
    title.textContent = cat;
    h3.appendChild(title);
    col.appendChild(h3);

    // Required order
    for (const st of stageOrder) {
      const sec = document.createElement('div');
      sec.className = 'stage';
      const sh = document.createElement('h4');
      sh.textContent = st;
      sec.appendChild(sh);
      const ul = document.createElement('ul');
      (byCatStage.get(cat)[st] || []).forEach((t) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = t.name;
        btn.title = `${t.stage} • ${t.category}`;
        btn.addEventListener('click', () => focusOnTrend(t.id));
        li.appendChild(btn);
        ul.appendChild(li);
      });
      sec.appendChild(ul);
      col.appendChild(sec);
    }

    // Add Laggards (declining) as an extra section, if any
    const lag = byCatStage.get(cat)['Laggards'] || [];
    if (lag.length) {
      const secLag = document.createElement('div');
      secLag.className = 'stage laggards';
      const sh = document.createElement('h4');
      sh.textContent = 'Laggards (declining)';
      secLag.appendChild(sh);
      const ul = document.createElement('ul');
      lag.forEach((t) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = t.name;
        btn.title = `${t.stage} • ${t.category}`;
        btn.addEventListener('click', () => focusOnTrend(t.id));
        li.appendChild(btn);
        ul.appendChild(li);
      });
      secLag.appendChild(ul);
      col.appendChild(secLag);
    }

    grid.appendChild(col);
  }

  function focusOnTrend(id) {
    const svg = document.getElementById('radar');
    const dot = svg.querySelector(`circle[data-id="${CSS.escape(id)}"]`);
    if (!dot) return;
    // simulate click to open card and highlight
    dot.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    // scroll to radar
    document.getElementById('radarBoard').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
