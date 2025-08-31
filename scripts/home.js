// Dados de clima/data
function getFakeWeatherData() {
    const now = new Date();
    const weekDays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const weekday = weekDays[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    // Estação fake
    const m = now.getMonth() + 1, d = now.getDate();
    let estacao = 'primavera';
    if ((m === 12 && d >= 21) || (m <= 3 && (m < 3 || d < 20))) estacao = 'verão';
    else if ((m === 3 && d >= 20) || (m <= 6 && (m < 6 || d < 21))) estacao = 'outono';
    else if ((m === 6 && d >= 21) || (m <= 9 && (m < 9 || d < 23))) estacao = 'inverno';
    // Período do dia
    const h = now.getHours();
    const periodo = h < 12 ? 'manhã' : h < 18 ? 'tarde' : 'noite';
    return {
        dataFormatada: `${weekday}, ${day} de ${month}`,
        cidade: "São Paulo",
        estacao,
        periodo
    };
}

function renderInfoArea() {
    const data = getFakeWeatherData();
    document.getElementById('infoArea').innerHTML = `
                <div class="info-row">
                <i class="bi bi-calendar2-week info-text" style="color:#966D46; font-size:18px; min-width:20px;"></i>
                <span class="info-text">${data.dataFormatada}</span>
                </div>
                <div class="info-row">
                <i class="bi bi-geo-alt info-text" style="color:#966D46; font-size:18px; min-width:20px;"></i>
                <span class="info-text">${data.cidade}</span>
                </div>
                <div class="info-row">
                <i class="bi bi-thermometer-half info-text" style="color:#966D46; font-size:18px; min-width:20px;"></i>
                <span class="info-text">${data.estacao}, ${data.periodo}</span>
                </div>
            `;
}

function getLooks() {
    const data = localStorage.getItem('looksDemo');
    return data ? JSON.parse(data) : [];
}
function formatDateBR(isoDate) {
    if (!isoDate) return '';
    const dt = new Date(isoDate + 'T00:00:00');
    return dt.toLocaleDateString('pt-BR');
}

// Render do Look Recente (primeiro look salvo)
function renderMainLook(selectedId = null) {
    const mainLookArea = document.getElementById('mainLookArea');
    const looks = getLooks();
    let look = null;
    if (selectedId !== null) {
        look = looks.find(l => l.id === selectedId);
    } 

    if (look) {
        mainLookArea.innerHTML = `
                <div class="main-look-area">
                    <img src="${look.imagem_uri || 'https://placehold.co/120x120?text=Look'}" alt="Look" />
                    <div class="main-look-title">${look.titulo} - ${formatDateBR(look.data_uso)}</div>
                    ${look.descricao ? `<div class="main-look-desc">${look.descricao}</div>` : ''}
                </div>
                `;
    } else {
        mainLookArea.innerHTML = `<div class="main-look-title" style="margin-left:12px;">Selecione um look abaixo para exibir aqui.</div>`;
    }
}

// Render carrossel dos looks
function renderLooksCarousel(selectedId = null) {
    const looks = getLooks();
    const looksCarousel = document.getElementById('looksCarousel');
    if (!looks.length) {
        looksCarousel.innerHTML = `<div class="empty-text">Você ainda não cadastrou looks recentes.</div>`;
        renderMainLook(null);
        return;
    }
    looksCarousel.innerHTML = looks.map(look => `
                <div class="look-card${look.id === selectedId ? ' selected' : ''}" tabindex="0"
                onclick="selectMainLook('${look.id}')"
                >
                <img src="${look.imagem_uri || '../assets/clothes-placeholder.jpg'}" alt="Look" />
                <div class="look-card-title">${look.titulo}</div>
                <div class="look-card-date">${formatDateBR(look.data_uso)}</div>
                </div>
            `).join('');
}

function selectMainLook(id) {
    renderMainLook(id);
    renderLooksCarousel(id);
}

renderMainLook(null);

renderInfoArea();
renderLooksCarousel();
