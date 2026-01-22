(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const rooms = [
      { name: "Wildspitze (3P)", x: 11.5, y: 9,  width: 2.5, height: 9 },
      { name: "Schneeberg (1P, Box)", x: 20.5, y: 14, width: 1.5, height: 4 },
      { name: "Hornisgrinde (2P, Box)", x: 20.5, y: 10, width: 1.5, height: 4 },
      { name: "Martinskopf (4P)", x: 31.5, y: 9,  width: 2.5, height: 9 },
      { name: "Wasserkuppe (1P, Box)", x: 40.5, y: 15, width: 2,   height: 3 },
      { name: "Feldberg (4P)", x: 44,   y: 9,  width: 5.5, height: 9 },
      { name: "Watzmann (12P)", x: 43,  y: 20.5, width: 6.5, height: 8.5 },
      { name: "Chiemsee (9P)", x: 49.5, y: 20.5, width: 4.5, height: 8.5 },
      { name: "Eibsee (3P)", x: 56,    y: 9,  width: 2.5, height: 9 },
      { name: "Feringasee (1P, Box)", x: 59.2, y: 15, width: 2,   height: 3 },
      { name: "Speichersee (1P, Box)", x: 69.2, y: 15, width: 2,   height: 3 },
      { name: "Tegernsee (3P)", x: 78,  y: 9,  width: 2.5, height: 9 },
      { name: "Starnbergersee (12P)", x: 88, y: 9,  width: 4,   height: 12 },
      { name: "Ammersee (6P)", x: 88,   y: 21, width: 4,   height: 9 },
      { name: "Riegsee (9P)", x: 88,    y: 30, width: 4,   height: 10 },
      { name: "Regattasee (1P, Box)", x: 84.9, y: 31.5, width: 1.8, height: 2.4 },
      { name: "Königsee (3P)", x: 75,   y: 32, width: 2.3, height: 8.5 },
      { name: "Walchensee (4P)", x: 72.8, y: 32, width: 2.3, height: 8.5 },
      { name: "Unterföhringer See (1P, Box)", x: 69.9, y: 31.6, width: 1.8, height: 2.4 },
      { name: "Bodensee (7P)", x: 59.5, y: 32, width: 3.4, height: 8.5 },
      { name: "Langwieder See (1P, Box)", x: 56.5, y: 31.6, width: 1.8, height: 2.4 },
      { name: "Donnersberg (1P, Box)", x: 41.5, y: 32, width: 1.2, height: 3.6 },
      { name: "Lemberg (1P, Box)", x: 41.5, y: 35.6, width: 1.2, height: 3.6 },
      { name: "Drachenfels (1P, Box)", x: 39.2, y: 23, width: 1.2, height: 3.6 },
      { name: "Fichtelberg (6P)", x: 31.5, y: 32, width: 3.5, height: 8.5 },
      { name: "Wendelstein (4P)", x: 20.5, y: 32, width: 2.4, height: 8.5 },
      { name: "Nebelhorn (3P)", x: 18.4, y: 32, width: 2.2, height: 8.5 },
      { name: "Alpspitze (4P)", x: 16,  y: 32, width: 2.4, height: 8.5 },
      { name: "Everest (10P)", x: 10.5, y: 32, width: 5.5, height: 8.5 },
      { name: "Hochvogel (2P, Box)", x: 6, y: 18.2, width: 1, height: 3.6 },
      { name: "Hohe Acht (1P, Box)", x: 8.2, y: 31, width: 1, height: 3.6 },
      { name: "Zugspitze (8P)", x: 10.5, y: 40.5, width: 4, height: 9 },
      { name: "Interhyp Studio", x: 10.5, y: 49.5, width: 4, height: 9 },
      { name: "Lech (6P)", x: 4, y: 50, width: 5, height: 6.5 },
      { name: "Gaming Room", x: 17, y: 59, width: 6, height: 8.5 },
      { name: "Isar (11P)", x: 4.2, y: 82, width: 6.5, height: 9 },
      { name: "Donau (8P)", x: 10.7, y: 82, width: 4.5, height: 9 },
      { name: "Amper (4P)", x: 15.2, y: 82, width: 3, height: 9 }
    ];

    const container    = document.getElementById('floorPlanContainer');
    const tooltip      = document.getElementById('tooltip');
    const searchInput  = document.getElementById('searchRoom');
    const originSelect = document.getElementById('originRoom');
    const destSelect   = document.getElementById('destRoom');

    function seedRoomAvailability() {
      rooms.forEach(room => {
        const available = Math.random() < 0.65; 
        room.available = available;            
        if (available) {
          room.until = null;                   
        } else {
          const now = new Date();
          const addMin = Math.floor(Math.random() * 180);
          now.setMinutes(now.getMinutes() + addMin);
          const hh = String(now.getHours()).padStart(2, '0');
          const mm = String(now.getMinutes()).padStart(2, '0');
          room.until = `${hh}:${mm}`;         

        }
      });
    }
    seedRoomAvailability(); 
    window.seedRooms = () => { seedRoomAvailability(); applyAvailabilityVisuals(); };
    rooms.forEach(room => {
      const a = document.createElement('option');
      a.value = room.name; a.textContent = room.name;
      originSelect.appendChild(a);

      const b = document.createElement('option');
      b.value = room.name; b.textContent = room.name;
      destSelect.appendChild(b);
    });

    let nextTarget = 'origin';
    let svg = null;
    let path = null;

    function ensureSVG() {
      if (svg) return;
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.position = 'absolute';
      svg.style.left = '0';
      svg.style.top = '0';
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.pointerEvents = 'none'; 

      svg.style.zIndex = '50';          

      path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'red');
      path.setAttribute('stroke-width', '6');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');

      svg.appendChild(path);
      container.appendChild(svg);
    }

    function clearLine() {
      if (path) path.setAttribute('d', '');
    }

    function getCenter(div) {
      const cRect = container.getBoundingClientRect();
      const rRect = div.getBoundingClientRect();
      return {
        x: (rRect.left - cRect.left) + rRect.width / 2,
        y: (rRect.top  - cRect.top)  + rRect.height / 2
      };
    }

    function drawLine(from, to) {
      ensureSVG();
      const nodes = document.querySelectorAll('.room');
      const a = [...nodes].find(n => n.dataset.roomName === from);
      const b = [...nodes].find(n => n.dataset.roomName === to);
      if (!a || !b) return clearLine();

      const p1 = getCenter(a);
      const p2 = getCenter(b);

      const bend = (Math.abs(p1.x - p2.x) > Math.abs(p1.y - p2.y))
        ? `${p2.x},${p1.y}` 

        : `${p1.x},${p2.y}`; 

      path.setAttribute('d', `M ${p1.x},${p1.y} L ${bend} L ${p2.x},${p2.y}`);
    }

    function maybeRedrawLine() {
      const o = originSelect.value;
      const d = destSelect.value;
      if (o && d) drawLine(o, d);
    }
    window.addEventListener('resize', maybeRedrawLine);

    function createRoomOverlays() {
      rooms.forEach(room => {
        const div = document.createElement('div');
        div.className = 'room';
        div.dataset.roomName = room.name;
        div.style.left   = room.x + '%';
        div.style.top    = room.y + '%';
        div.style.width  = room.width + '%';
        div.style.height = room.height + '%';

        div.addEventListener('mouseenter', (e) => showTooltip(e.currentTarget));
        div.addEventListener('mousemove',  (e) => moveTooltip(e.currentTarget));
        div.addEventListener('mouseleave', hideTooltip);
        div.addEventListener('click', () => handleRoomClick(room.name));

        container.appendChild(div);
      });
    }


function applyAvailabilityVisuals() {
  document.querySelectorAll('.room').forEach(div => {
    const room = rooms.find(r => r.name === div.dataset.roomName);
    if (!room) return;
    div.style.borderColor = room.available ? '#28a745' : '#dc3545';

    // Tooltip text
    div.dataset.tooltipText = room.available
      ? `${room.name} — Available`
      : `${room.name} — Booked until ${room.until || '—'}`;
  });

  // If you draw the line, keep it on top/updated
  if (typeof maybeRedrawLine === 'function') {
    maybeRedrawLine();
  }
}


    function showTooltip(el) {
      tooltip.textContent = el.dataset.tooltipText || el.dataset.roomName || '';
      tooltip.classList.add('visible');
      moveTooltip(el);
    }

    function moveTooltip(el) {
      const x = el.offsetLeft + el.offsetWidth  / 2 + 32;
      const y = el.offsetTop  + el.offsetHeight / 2;
      tooltip.style.left = `${x}px`;
      tooltip.style.top  = `${y}px`;
      tooltip.style.transform = 'translate(-50%, -50%)';
    }

    function hideTooltip() {
      tooltip.classList.remove('visible');
    }

    function clearOriginDestHighlights() {
      document.querySelectorAll('.room').forEach(div => {
        div.classList.remove('highlight-origin', 'highlight-destination');
      });
    }
    function clearSearchHighlights() {
      document.querySelectorAll('.room').forEach(div => {
        div.classList.remove('highlight-search');
      });
    }

    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      clearSearchHighlights();

      if (term) {
        document.querySelectorAll('.room').forEach(div => {
          const label = (div.dataset.tooltipText || div.dataset.roomName || '').toLowerCase();
          const isSelected =
            div.classList.contains('highlight-origin') ||
            div.classList.contains('highlight-destination');
          if (!isSelected && label.includes(term)) {
            div.classList.add('highlight-search');
          }
        });
      }
      maybeRedrawLine();
    });

    originSelect.addEventListener('change', updateHighlights);
    destSelect.addEventListener('change', updateHighlights);

    function updateHighlights() {
      clearOriginDestHighlights();

      const a = originSelect.value;
      const b = destSelect.value;

      document.querySelectorAll('.room').forEach(div => {
        const n = div.dataset.roomName;
        if (a && n === a) {
          div.classList.add('highlight-origin');
          div.classList.remove('highlight-search'); 

        }
        if (b && n === b) {
          div.classList.add('highlight-destination');
          div.classList.remove('highlight-search'); 

        }
      });

      if (a && b) drawLine(a, b);
      else clearLine();

      applyAvailabilityVisuals();
    }

    function handleRoomClick(name) {
      if (nextTarget === 'origin') {
        originSelect.value = name;
        nextTarget = 'dest';
      } else {
        destSelect.value = name;
        nextTarget = 'origin';
      }
      updateHighlights();
    }

    createRoomOverlays();
    applyAvailabilityVisuals();
  });
})();

