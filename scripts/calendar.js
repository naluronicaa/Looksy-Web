// =================== CALENDÁRIO =======================
const monthNames = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// ----- LOCALSTORAGE -----
function getLooks() {
  const data = localStorage.getItem('looksDemo');
  return data ? JSON.parse(data) : [];
}
function saveLooks(looks) {
  localStorage.setItem('looksDemo', JSON.stringify(looks));
}
function groupLooksByDate(looks) {
  const byDate = {};
  looks.forEach(look => {
    if (look.data_uso) {
      const date = look.data_uso.length > 10 ? look.data_uso.slice(0, 10) : look.data_uso;
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(look);
    }
  });
  return byDate;
}

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDay = null;
let looksPorData = groupLooksByDate(getLooks());

// ----- CALENDÁRIO -----
function renderCalendar(month, year) {
  const calendarBody = document.getElementById('calendarBody');
  calendarBody.innerHTML = "";
  document.getElementById('monthName').textContent =
    `${monthNames[month][0].toUpperCase() + monthNames[month].slice(1)} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = '';
  let day = 1;
  for (let w = 0; w < 6; w++) {
    let tr = '<tr>';
    for (let d = 0; d < 7; d++) {
      if (w === 0 && d < firstDay) {
        tr += `<td><span class="calendar-day disabled"></span></td>`;
      } else if (day > daysInMonth) {
        tr += `<td><span class="calendar-day disabled"></span></td>`;
      } else {
        let classes = ['calendar-day'];
        let dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const isToday =
          day === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear();
        if (isToday) classes.push('today');

        if (selectedDay &&
          day === selectedDay.getDate() &&
          month === selectedDay.getMonth() &&
          year === selectedDay.getFullYear()) {
          classes.push('selected');
        }

        if (looksPorData[dateStr]) {
          classes.push('has-look');
        }

        tr += `<td>
          <button type="button"
            class="${classes.join(' ')}"
            data-date="${dateStr}"
            tabindex="0"
            onclick="handleDayClick('${dateStr}')"
          >
            ${day}
            <span class="look-dot"></span>
          </button>
        </td>`;
        day++;
      }
    }
    tr += '</tr>';
    html += tr;
    if (day > daysInMonth) break;
  }

  calendarBody.innerHTML = html;
}

function handleDayClick(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  selectedDay = new Date(year, month - 1, day);
  renderCalendar(currentMonth, currentYear);
  renderLooksForDate(selectedDay);
}

// Navegação mês
document.getElementById('prevMonth').onclick = () => {
  if (currentMonth === 0) { currentMonth = 11; currentYear--; }
  else currentMonth--;
  selectedDay = null;
  renderCalendar(currentMonth, currentYear);
  document.getElementById('lookContainer').innerHTML = "";
};
document.getElementById('nextMonth').onclick = () => {
  if (currentMonth === 11) { currentMonth = 0; currentYear++; }
  else currentMonth++;
  selectedDay = null;
  renderCalendar(currentMonth, currentYear);
  document.getElementById('lookContainer').innerHTML = "";
};

function renderLooksForDate(dateObj) {
  const lookContainer = document.getElementById('lookContainer');
  const yyyy = dateObj.getFullYear(), mm = String(dateObj.getMonth() + 1).padStart(2, '0'), dd = String(dateObj.getDate()).padStart(2, '0');
  const key = `${yyyy}-${mm}-${dd}`;
  lookContainer.innerHTML = '';
  if (looksPorData[key]) {
    lookContainer.innerHTML = `
      <div class="lookContainer">
        <div class="lookTitle">Looks para o dia ${dd}/${mm}/${yyyy}</div>
        <div class="lookMsg">Esse dia tem ${looksPorData[key].length} look${looksPorData[key].length > 1 ? 's' : ''}</div>
        <div class="lookList">
          ${looksPorData[key].map(look => `
            <div class="lookCardCal" onclick="openImgModal('${look.imagem_uri ? look.imagem_uri.replace(/'/g, "\\'") : ''}')">
              <img src="${look.imagem_uri || '../assets/clothes-placeholder.jpg'}" alt="Look" />
              <div>
                <div class="lookCardCal-title">${look.titulo}</div>
                <div class="lookCardCal-desc">${look.descricao || ''}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    lookContainer.innerHTML = `
      <div class="lookContainer">
        <div class="lookTitle">Looks para o dia ${dd}/${mm}/${yyyy}</div>
        <div class="lookMsg">Nenhum look registrado para esse dia ainda.</div>
      </div>
    `;
  }
}

// ----- MODAL IMG -----
function openImgModal(imgUri) {
  if (!imgUri) return;
  document.getElementById('modalImgBig').src = imgUri;
  document.getElementById('modalImgOverlay').classList.add('active');
}
function closeImgModal(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  document.getElementById('modalImgOverlay').classList.remove('active');
  document.getElementById('modalImgBig').src = "";
}

// ----- LISTAR LOOKS -----
function renderLooksList() {
  const looks = getLooks();
  const q = document.getElementById('searchInput').value.toLowerCase();
  const looksGrid = document.getElementById('looksGrid');
  const emptyText = document.getElementById('emptyText');
  const filtered = looks.filter(l => l.titulo.toLowerCase().includes(q));
  if (!filtered.length) {
    looksGrid.innerHTML = "";
    emptyText.style.display = '';
    return;
  }
  emptyText.style.display = 'none';
  looksGrid.innerHTML = filtered.map(look => `
    <div class="lookCard" onclick='openViewModal(${JSON.stringify(look)})'>
      <img src="${look.imagem_uri || '../assets/clothes-placeholder.jpg'}" alt="Look" />
      <div class="lookCard-title">${look.titulo}</div>
      <div class="lookCard-date">${formatDateBR(look.data_uso)}</div>
      ${look.descricao ? `<div class="lookCard-desc">${look.descricao}</div>` : ""}
    </div>
  `).join('');
}
function formatDateBR(isoDate) {
  if (!isoDate) return '';
  const dt = new Date(isoDate + 'T00:00:00');
  return dt.toLocaleDateString('pt-BR');
}

// Inicializa
renderCalendar(currentMonth, currentYear);

// Atualiza ao cadastrar/excluir looks
window.addEventListener('storage', () => {
  looksPorData = groupLooksByDate(getLooks());
  renderCalendar(currentMonth, currentYear);
  document.getElementById('lookContainer').innerHTML = "";
});
