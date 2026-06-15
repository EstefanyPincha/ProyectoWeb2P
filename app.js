/* ============================================================
   ESPE EMPRENDE – Lógica principal
   LocalStorage + CRUD completo + Estadísticas + Filtros
   ============================================================ */

'use strict';

/* ---------- DATOS INICIALES (demostración) ---------- */
const SAMPLE_DATA = [
  {
    id: 'EMP-001',
    codigo: 'ESPE-2025-001',
    nombre: 'AgroTech ESPE',
    responsable: 'Camila Torres',
    carrera: 'Ingeniería Agropecuaria',
    categoria: 'Tecnología',
    producto: 'Sistema IoT para monitoreo de cultivos',
    descripcion: 'Sensores inteligentes conectados a la nube que analizan humedad, temperatura y luminosidad en tiempo real para optimizar la producción agrícola.',
    ventas: 1850,
    estado: 'En crecimiento',
    imagen: ''
  },
  {
    id: 'EMP-002',
    codigo: 'ESPE-2025-002',
    nombre: 'NutriKitchen',
    responsable: 'Diego Ramírez',
    carrera: 'Ingeniería en Alimentos',
    categoria: 'Alimentos',
    producto: 'Kits de comida saludable lista para cocinar',
    descripcion: 'Cajas semanales con ingredientes frescos y recetas balanceadas diseñadas por nutricionistas de la ESPE.',
    ventas: 980,
    estado: 'En marcha',
    imagen: ''
  },
  {
    id: 'EMP-003',
    codigo: 'ESPE-2025-003',
    nombre: 'EduBot Academy',
    responsable: 'Sofía Velasco',
    carrera: 'Ingeniería en Sistemas',
    categoria: 'Educación',
    producto: 'Plataforma de tutoría con IA para estudiantes',
    descripcion: 'Asistente educativo basado en inteligencia artificial que personaliza el aprendizaje para estudiantes de bachillerato.',
    ventas: 2400,
    estado: 'En crecimiento',
    imagen: ''
  },
  {
    id: 'EMP-004',
    codigo: 'ESPE-2025-004',
    nombre: 'EcoSoluciones EC',
    responsable: 'Andrés Morales',
    carrera: 'Ingeniería Ambiental',
    categoria: 'Ambiente',
    producto: 'Residuos sólidos convertidos en abono orgánico',
    descripcion: 'Recolectamos residuos orgánicos domiciliarios y los transformamos en compost certificado para uso agrícola.',
    ventas: 620,
    estado: 'En marcha',
    imagen: ''
  },
  {
    id: 'EMP-005',
    codigo: 'ESPE-2025-005',
    nombre: 'ArteAndino Studio',
    responsable: 'María José Cando',
    carrera: 'Diseño Industrial',
    categoria: 'Artesanías',
    producto: 'Joyería étnica contemporánea con materiales reciclados',
    descripcion: 'Colecciones de joyería que fusionan técnicas ancestrales andinas con diseño moderno usando metales reciclados.',
    ventas: 430,
    estado: 'Prototipo',
    imagen: ''
  },
  {
    id: 'EMP-006',
    codigo: 'ESPE-2025-006',
    nombre: 'MediAlert Wearable',
    responsable: 'Luis Enríquez',
    carrera: 'Ingeniería Electrónica',
    categoria: 'Salud',
    producto: 'Pulsera de monitoreo médico para adultos mayores',
    descripcion: 'Dispositivo wearable que mide frecuencia cardíaca, presión arterial y detecta caídas, enviando alertas automáticas a familiares.',
    ventas: 3100,
    estado: 'En crecimiento',
    imagen: ''
  },
  {
    id: 'EMP-007',
    codigo: 'ESPE-2025-007',
    nombre: 'ServiLimpio Pro',
    responsable: 'Gabriela Suárez',
    carrera: 'Administración de Empresas',
    categoria: 'Servicios',
    producto: 'Limpieza profesional de hogares y oficinas',
    descripcion: 'Servicio de limpieza con personal capacitado, productos ecológicos y sistema de reserva en línea.',
    ventas: 740,
    estado: 'En marcha',
    imagen: ''
  },
  {
    id: 'EMP-008',
    codigo: 'ESPE-2025-008',
    nombre: 'QuantumCode Labs',
    responsable: 'Sebastián Flores',
    carrera: 'Ingeniería en Sistemas',
    categoria: 'Tecnología',
    producto: 'Desarrollo de software a medida para PYMEs',
    descripcion: 'Soluciones tecnológicas personalizadas para pequeñas y medianas empresas: sistemas de gestión, e-commerce y apps móviles.',
    ventas: 4200,
    estado: 'En crecimiento',
    imagen: ''
  }
];

/* ---------- ESTADO GLOBAL ---------- */
const LS_KEY = 'espe_emprendimientos_v1';
let emprendimientos = [];
let deleteTargetId = null;

/* ---------- UTILIDADES ---------- */
const $ = id => document.getElementById(id);
const uid = () => 'EMP-' + Date.now();
const fmt = n => '$' + Number(n).toLocaleString('es-EC', { minimumFractionDigits: 0 });
const emojiFor = cat => ({
  Tecnología: '💻', Alimentos: '🍎', Servicios: '🛠️',
  Educación: '📚', Ambiente: '🌱', Artesanías: '🎨',
  Salud: '❤️', Otro: '✨'
}[cat] || '📌');

/* ---------- LOCALSTORAGE ---------- */
function saveLS() {
  localStorage.setItem(LS_KEY, JSON.stringify(emprendimientos));
}
function loadLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      emprendimientos = JSON.parse(raw);
    } else {
      emprendimientos = [...SAMPLE_DATA];
      saveLS();
    }
  } catch {
    emprendimientos = [...SAMPLE_DATA];
    saveLS();
  }
}

/* ---------- TOAST ---------- */
let toastTimer;
function showToast(msg, type = 'success') {
  const t = $('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.className = 'toast';
  }, 3200);
}

/* ---------- NAVEGACIÓN ---------- */
function goTo(sectionId) {
  // Ocultar todas
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  // Mostrar target
  const sec = document.getElementById(sectionId);
  if (sec) sec.classList.add('active');
  const link = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
  if (link) link.classList.add('active');
  // Cerrar menú móvil
  $('navLinks').classList.remove('open');
  // Scroll top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Renderizar según sección
  if (sectionId === 'emprendimientos') renderCards(emprendimientos);
  if (sectionId === 'dashboard') renderDashboard();
  if (sectionId === 'inicio') updateHeroStats();
}

function filterAndGo(categoria) {
  goTo('emprendimientos');
  $('catalogFilter').value = categoria;
  filterCards();
}

/* ---------- HERO STATS ---------- */
function updateHeroStats() {
  $('statTotal').textContent = emprendimientos.length;
  const total = emprendimientos.reduce((s, e) => s + Number(e.ventas), 0);
  $('statVentas').textContent = fmt(total);
}

/* ---------- CARDS – CATÁLOGO ---------- */
function renderCards(list) {
  const grid = $('cardsGrid');
  const empty = $('emptyState');
  grid.innerHTML = '';
  if (!list.length) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  list.forEach((e, i) => {
    const card = document.createElement('div');
    card.className = 'emp-card';
    card.style.animationDelay = (i * 0.06) + 's';
    const imgHtml = e.imagen
      ? `<div class="card-img"><img src="${escHtml(e.imagen)}" alt="${escHtml(e.nombre)}" onerror="this.parentElement.innerHTML='${emojiFor(e.categoria)}'" /></div>`
      : `<div class="card-img">${emojiFor(e.categoria)}</div>`;
    card.innerHTML = `
      ${imgHtml}
      <div class="card-body">
        <div class="card-meta">
          <span class="card-badge badge-${e.categoria}">${e.categoria}</span>
          <span class="status-pill status-${e.estado}">${e.estado}</span>
        </div>
        <h3 class="card-title">${escHtml(e.nombre)}</h3>
        <p class="card-subtitle">👤 ${escHtml(e.responsable)} · ${escHtml(e.carrera)}</p>
        <p class="card-desc">${escHtml(e.descripcion || e.producto)}</p>
        <div class="card-footer">
          <div>
            <span class="card-sales-label">Ventas/mes</span>
            <span class="card-sales">${fmt(e.ventas)}</span>
          </div>
          <div class="card-actions">
            <button class="btn-icon" title="Editar" onclick="editEmp('${e.id}')">✏️</button>
            <button class="btn-icon del" title="Eliminar" onclick="confirmDelete('${e.id}')">🗑️</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterCards() {
  const q = $('catalogSearch').value.toLowerCase().trim();
  const cat = $('catalogFilter').value;
  const st = $('catalogStatus').value;
  const filtered = emprendimientos.filter(e => {
    const matchQ = !q || e.nombre.toLowerCase().includes(q) || e.codigo.toLowerCase().includes(q);
    const matchCat = !cat || e.categoria === cat;
    const matchSt = !st || e.estado === st;
    return matchQ && matchCat && matchSt;
  });
  renderCards(filtered);
}

function clearFilters() {
  $('catalogSearch').value = '';
  $('catalogFilter').value = '';
  $('catalogStatus').value = '';
  renderCards(emprendimientos);
}

/* ---------- FORMULARIO – REGISTRO ---------- */
const FIELDS = [
  { id: 'codigo',      label: 'Código',              req: true },
  { id: 'nombre',      label: 'Nombre',              req: true },
  { id: 'responsable', label: 'Responsable',         req: true },
  { id: 'carrera',     label: 'Carrera/Departamento',req: true },
  { id: 'categoria',   label: 'Categoría',           req: true },
  { id: 'estado',      label: 'Estado',              req: true },
  { id: 'producto',    label: 'Producto o servicio', req: true },
  { id: 'ventas',      label: 'Ventas mensuales',    req: true, type: 'number' }
];

function validateForm() {
  let valid = true;
  FIELDS.forEach(f => {
    const el = $(f.id);
    const err = $('err-' + f.id);
    const val = el.value.trim();
    el.classList.remove('error');
    if (err) err.textContent = '';
    if (f.req && !val) {
      el.classList.add('error');
      if (err) err.textContent = f.label + ' es requerido.';
      valid = false;
    } else if (f.type === 'number' && val !== '' && (isNaN(val) || Number(val) < 0)) {
      el.classList.add('error');
      if (err) err.textContent = 'Ingrese un número válido.';
      valid = false;
    }
  });
  return valid;
}

function resetForm() {
  $('emprendimientoForm').reset();
  $('editId').value = '';
  $('submitBtn').textContent = 'Registrar Emprendimiento';
  FIELDS.forEach(f => {
    const el = $(f.id);
    const err = $('err-' + f.id);
    if (el) el.classList.remove('error');
    if (err) err.textContent = '';
  });
}

$('emprendimientoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const editId = $('editId').value;
  const empData = {
    codigo:      $('codigo').value.trim(),
    nombre:      $('nombre').value.trim(),
    responsable: $('responsable').value.trim(),
    carrera:     $('carrera').value.trim(),
    categoria:   $('categoria').value,
    estado:      $('estado').value,
    producto:    $('producto').value.trim(),
    descripcion: $('descripcion').value.trim(),
    ventas:      parseFloat($('ventas').value) || 0,
    imagen:      $('imagen').value.trim()
  };

  if (editId) {
    // Editar
    const idx = emprendimientos.findIndex(x => x.id === editId);
    if (idx !== -1) {
      emprendimientos[idx] = { ...emprendimientos[idx], ...empData };
      saveLS();
      showToast('✅ Emprendimiento actualizado correctamente', 'success');
    }
    resetForm();
    goTo('dashboard');
  } else {
    // Crear
    const nuevo = { id: uid(), ...empData };
    emprendimientos.push(nuevo);
    saveLS();
    updateHeroStats();
    // Mostrar éxito
    $('emprendimientoForm').style.display = 'none';
    $('successMsg').textContent = `"${nuevo.nombre}" ha sido añadido al catálogo ESPE Emprende.`;
    $('formSuccess').style.display = 'block';
    showToast('🚀 Emprendimiento registrado exitosamente', 'success');
  }
});

/* ---------- EDITAR ---------- */
function editEmp(id) {
  const emp = emprendimientos.find(e => e.id === id);
  if (!emp) return;
  goTo('registro');
  // Asegurar que el form esté visible
  $('emprendimientoForm').style.display = 'grid';
  $('formSuccess').style.display = 'none';
  // Rellenar campos
  $('editId').value = emp.id;
  $('codigo').value = emp.codigo;
  $('nombre').value = emp.nombre;
  $('responsable').value = emp.responsable;
  $('carrera').value = emp.carrera;
  $('categoria').value = emp.categoria;
  $('estado').value = emp.estado;
  $('producto').value = emp.producto;
  $('descripcion').value = emp.descripcion || '';
  $('ventas').value = emp.ventas;
  $('imagen').value = emp.imagen || '';
  $('submitBtn').textContent = '💾 Guardar Cambios';
  showToast('✏️ Editando: ' + emp.nombre, 'info');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- ELIMINAR ---------- */
function confirmDelete(id) {
  deleteTargetId = id;
  const emp = emprendimientos.find(e => e.id === id);
  $('deleteMsg').textContent = `¿Eliminar "${emp ? emp.nombre : id}"? Esta acción no se puede deshacer.`;
  $('deleteModal').style.display = 'flex';
}

function closeModal() {
  $('deleteModal').style.display = 'none';
  deleteTargetId = null;
}

$('confirmDelete').addEventListener('click', function() {
  if (!deleteTargetId) return;
  const emp = emprendimientos.find(e => e.id === deleteTargetId);
  emprendimientos = emprendimientos.filter(e => e.id !== deleteTargetId);
  saveLS();
  closeModal();
  // Refrescar vistas activas
  const active = document.querySelector('.section.active');
  if (active && active.id === 'emprendimientos') filterCards();
  if (active && active.id === 'dashboard') renderDashboard();
  updateHeroStats();
  showToast(`🗑️ "${emp ? emp.nombre : ''}" eliminado`, 'error');
});

// Cerrar modal al click fuera
$('deleteModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

/* ---------- TABLA DINÁMICA ---------- */
function renderTable(list) {
  const tbody = $('tableBody');
  const empty = $('tableEmpty');
  tbody.innerHTML = '';
  if (!list.length) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  list.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="code-cell">${escHtml(e.codigo)}</span></td>
      <td><strong>${escHtml(e.nombre)}</strong></td>
      <td>${escHtml(e.responsable)}</td>
      <td>${escHtml(e.carrera)}</td>
      <td><span class="card-badge badge-${e.categoria}">${e.categoria}</span></td>
      <td><span class="status-pill status-${e.estado}">${e.estado}</span></td>
      <td class="sales-cell">${fmt(e.ventas)}</td>
      <td>
        <div style="display:flex;gap:.35rem">
          <button class="btn-icon" title="Editar" onclick="editEmp('${e.id}')">✏️</button>
          <button class="btn-icon del" title="Eliminar" onclick="confirmDelete('${e.id}')">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterTable() {
  const q = $('tableSearch').value.toLowerCase().trim();
  const cat = $('tableFilterCat').value;
  const filtered = emprendimientos.filter(e => {
    const matchQ = !q || e.nombre.toLowerCase().includes(q) || e.codigo.toLowerCase().includes(q) || e.responsable.toLowerCase().includes(q);
    const matchCat = !cat || e.categoria === cat;
    return matchQ && matchCat;
  });
  renderTable(filtered);
}

/* ---------- ESTADÍSTICAS ---------- */
function renderStats() {
  const total = emprendimientos.length;
  const totalVentas = emprendimientos.reduce((s, e) => s + Number(e.ventas), 0);
  const promedio = total ? totalVentas / total : 0;
  const topEmp = emprendimientos.reduce((best, e) => (!best || Number(e.ventas) > Number(best.ventas)) ? e : best, null);

  $('kpiTotal').textContent = total;
  $('kpiVentasTotal').textContent = fmt(totalVentas);
  $('kpiPromedio').textContent = fmt(promedio);
  $('kpiTop').textContent = topEmp ? topEmp.nombre : '—';
}

function renderCategoryChart() {
  const cats = ['Tecnología','Alimentos','Servicios','Educación','Ambiente','Artesanías','Salud','Otro'];
  const counts = cats.map(c => emprendimientos.filter(e => e.categoria === c).length);
  const max = Math.max(...counts, 1);
  const container = $('catChart');
  container.innerHTML = '';
  cats.forEach((c, i) => {
    if (!counts[i]) return;
    const pct = Math.round((counts[i] / max) * 100);
    container.innerHTML += `
      <div class="bar-row">
        <span class="bar-label">${emojiFor(c)} ${c}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        <span class="bar-count">${counts[i]}</span>
      </div>`;
  });
  if (!container.innerHTML) container.innerHTML = '<p style="color:var(--gray-400);font-size:.85rem">Sin datos</p>';
}

function renderStatusChart() {
  const statuses = ['Idea','Prototipo','En marcha','En crecimiento'];
  const colors = ['#f97316','#3a7bd5','#22c55e','#a855f7'];
  const counts = statuses.map(s => emprendimientos.filter(e => e.estado === s).length);
  const max = Math.max(...counts, 1);
  const container = $('statusChart');
  container.innerHTML = '';
  statuses.forEach((s, i) => {
    if (!counts[i]) return;
    const pct = Math.round((counts[i] / max) * 100);
    container.innerHTML += `
      <div class="bar-row">
        <span class="bar-label">${s}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${colors[i]}"></div></div>
        <span class="bar-count">${counts[i]}</span>
      </div>`;
  });
  if (!container.innerHTML) container.innerHTML = '<p style="color:var(--gray-400);font-size:.85rem">Sin datos</p>';
}

function renderDashboard() {
  renderStats();
  renderCategoryChart();
  renderStatusChart();
  renderTable(emprendimientos);
}

/* ---------- CONTACTO ---------- */
$('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = $('cNombre'), email = $('cEmail'), asunto = $('cAsunto'), mensaje = $('cMensaje');
  let valid = true;
  [
    { el: nombre, err: 'cerr-nombre', label: 'Nombre' },
    { el: email,  err: 'cerr-email',  label: 'Correo' },
    { el: asunto, err: 'cerr-asunto', label: 'Asunto' },
    { el: mensaje,err: 'cerr-mensaje',label: 'Mensaje' }
  ].forEach(({ el, err, label }) => {
    el.classList.remove('error');
    $(err).textContent = '';
    if (!el.value.trim()) {
      el.classList.add('error');
      $(err).textContent = label + ' es requerido.';
      valid = false;
    }
  });
  if (!valid) return;
  // Simular envío
  $('contactForm').style.display = 'none';
  $('contactSuccess').style.display = 'block';
  showToast('📬 Mensaje enviado correctamente', 'success');
});

/* ---------- NAVBAR COMPORTAMIENTO ---------- */
window.addEventListener('scroll', () => {
  const nav = $('navbar');
  if (window.scrollY > 20) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

$('navToggle').addEventListener('click', () => {
  $('navLinks').classList.toggle('open');
});

// Navegación por links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    goTo(this.dataset.section);
  });
});

/* ---------- ESCAPE HTML ---------- */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadLS();
  updateHeroStats();
  // Activar sección inicio por defecto
  goTo('inicio');
});
