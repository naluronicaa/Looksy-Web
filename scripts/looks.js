// ----- LOCALSTORAGE -----
function getLooks() { const data = localStorage.getItem('looksDemo'); return data ? JSON.parse(data) : []; }
function saveLooks(looks) { localStorage.setItem('looksDemo', JSON.stringify(looks)); }

// ----- MODAL CADASTRO -----
function openModal() {
    document.getElementById('addLookModal').classList.add('active');
    document.getElementById('addLookForm').reset();
    document.getElementById('modalImagePreview').style.display = 'none';
    const hoje = new Date();
    const yyyy = hoje.getFullYear(); const mm = String(hoje.getMonth() + 1).padStart(2, '0'); const dd = String(hoje.getDate()).padStart(2, '0');
    document.getElementById('inputDate').value = `${yyyy}-${mm}-${dd}`;
    document.getElementById('dataSelecionada').textContent = `${dd}/${mm}/${yyyy}`;
}
function closeModal() { document.getElementById('addLookModal').classList.remove('active'); }
function handleImageChange(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { document.getElementById('modalImagePreview').src = e.target.result; document.getElementById('modalImagePreview').style.display = ''; document.getElementById('modalImagePreview').alt = 'Imagem selecionada'; };
    reader.readAsDataURL(file);
}
function abrirDataPicker() { document.getElementById('inputDate').showPicker(); }
function atualizarData() {
    const val = document.getElementById('inputDate').value;
    if (val) { const [yyyy, mm, dd] = val.split('-'); document.getElementById('dataSelecionada').textContent = `${dd}/${mm}/${yyyy}`; }
}
function salvarLook(e) {
    e.preventDefault();
    const titulo = document.getElementById('inputTitulo').value.trim();
    const descricao = document.getElementById('inputDesc').value.trim();
    const data_uso = document.getElementById('inputDate').value;
    let imagem_uri = '';
    const imgElem = document.getElementById('modalImagePreview');
    if (imgElem && imgElem.src && imgElem.style.display !== 'none') { imagem_uri = imgElem.src; }
    if (!imagem_uri || !titulo) { alert('Preencha todos os campos e selecione uma imagem.'); return; }
    const novoLook = { id: 'id' + Date.now() + Math.floor(Math.random() * 9999), titulo, descricao, imagem_uri, data_uso, };
    const looks = getLooks(); looks.unshift(novoLook); saveLooks(looks); closeModal(); renderLooksList();
}
window.onclick = function (e) {
    if (e.target === document.getElementById('addLookModal')) closeModal();
    if (e.target === document.getElementById('viewLookModal')) closeViewModal();
}

// ----- MODAL VIEW & DELETE -----
let lookToDeleteId = null;
function openViewModal(look) {
    lookToDeleteId = look.id;
    document.getElementById('viewModalImg').src = look.imagem_uri || 'https://placehold.co/120x120?text=Look';
    document.getElementById('viewModalTitle').textContent = look.titulo;
    document.getElementById('viewModalDesc').textContent = look.descricao || '';
    document.getElementById('viewModalDate').textContent = "Uso: " + formatDateBR(look.data_uso);
    document.getElementById('viewLookModal').classList.add('active');
}
function closeViewModal() {
    document.getElementById('viewLookModal').classList.remove('active');
    lookToDeleteId = null;
}
function confirmDeleteLook() {
    if (!lookToDeleteId) return;
    if (confirm("Tem certeza que deseja excluir este look?")) {
        let looks = getLooks();
        looks = looks.filter(l => l.id !== lookToDeleteId);
        saveLooks(looks);
        closeViewModal();
        renderLooksList();
    }
}

// ----- LISTAR LOOKS -----
function renderLooksList() {
    const looks = getLooks();
    const q = document.getElementById('searchInput').value.toLowerCase();
    const looksGrid = document.getElementById('looksGrid');
    const emptyText = document.getElementById('emptyText');
    const filtered = looks.filter(l => l.titulo.toLowerCase().includes(q));
    if (!filtered.length) { looksGrid.innerHTML = ""; emptyText.style.display = ''; return; }
    emptyText.style.display = 'none';
    looksGrid.innerHTML = filtered.map(look => `
        <div class="lookCard" onclick='openViewModal(${JSON.stringify(look)})'>
          <img src="${look.imagem_uri || 'https://placehold.co/85x85?text=Look'}" alt="Look" />
          <div class="lookCard-title">${look.titulo}</div>
          <div class="lookCard-date">${formatDateBR(look.data_uso)}</div>
          ${look.descricao ? `<div class="lookCard-desc">${look.descricao}</div>` : ""}
        </div>
      `).join('');
}
function formatDateBR(isoDate) { if (!isoDate) return ''; const dt = new Date(isoDate + 'T00:00:00'); return dt.toLocaleDateString('pt-BR'); }

// Inicializa
renderLooksList();