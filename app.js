/*
   ESPE EMPRENDE – Lógica principal de la aplicación
   Funcionalidades:
     - Almacenamiento en LocalStorage
     - CRUD completo de emprendimientos
     - Estadísticas y gráficos del panel
     - Filtros y búsqueda en catálogo y tabla
     - Formularios con validación
*/

'use strict';


/* DATOS DE EJEMPLO (demostración inicial) Se cargan la primera vez que el usuario abre el portal */
var DATOS_EJEMPLO = [
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
    imagen: './imagenes/Agrotech.jpg'
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
    imagen: './imagenes/nutriKitchen.png'
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
    imagen: './imagenes/edubot.jpg'
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
    imagen: './imagenes/ecosolucion.jpg'
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
    imagen: './imagenes/arteandino.jpg'
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
    imagen: './imagenes/medialert.jpg'
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
    imagen: './imagenes/serviLimpio.jpg'
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
    imagen: './imagenes/QuantumCode.jpg'
  }
];


/* ESTADO GLOBAL DE LA APLICACIÓN */

/* Clave usada para guardar y leer datos en LocalStorage */
var CLAVE_ALMACENAMIENTO = 'espe_emprendimientos_v1';

/* Array principal que contiene todos los emprendimientos activos */
var listaEmprendimientos = [];

/* ID del emprendimiento que está pendiente de ser eliminado */
var idPendienteEliminar = null;


/* UTILIDADES GENERALES */

/* Atajo para obtener un elemento del DOM por su ID */
function obtenerElemento(id) {
  return document.getElementById(id);
}

/* Formatea un número como precio en dólares (USD) con formato ecuatoriano */
function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number(valor) || 0);
}

/* Genera un ID único usando la marca de tiempo en base 36 */
function generarId() {
  return 'EMP-' + Date.now().toString(36).toUpperCase();
}

/* Devuelve el HTML del ícono Font Awesome correspondiente a cada categoría */
function obtenerIconoCategoria(categoria) {
  switch (categoria) {
    case 'Tecnología':  return '<span class="icono-etiqueta"><i class="fa-solid fa-laptop-code"></i></span>';
    case 'Alimentos':   return '<span class="icono-etiqueta"><i class="fa-solid fa-utensils"></i></span>';
    case 'Servicios':   return '<span class="icono-etiqueta"><i class="fa-solid fa-screwdriver-wrench"></i></span>';
    case 'Educación':   return '<span class="icono-etiqueta"><i class="fa-solid fa-book-open"></i></span>';
    case 'Ambiente':    return '<span class="icono-etiqueta"><i class="fa-solid fa-leaf"></i></span>';
    case 'Artesanías':  return '<span class="icono-etiqueta"><i class="fa-solid fa-palette"></i></span>';
    case 'Salud':       return '<span class="icono-etiqueta"><i class="fa-solid fa-heart-pulse"></i></span>';
    case 'Otro':        return '<span class="icono-etiqueta"><i class="fa-solid fa-lightbulb"></i></span>';
    default:            return '<span class="icono-etiqueta"><i class="fa-solid fa-location-pin"></i></span>';
  }
}

/* Escapa caracteres especiales HTML para prevenir inyección de código */
function escaparHtml(texto) {
  if (!texto) return '';
  return String(texto)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}


/* LOCALSTORAGE – Persistencia de datos */

/* Serializa y guarda la lista completa en LocalStorage */
function guardarEnAlmacenamiento() {
  localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(listaEmprendimientos));
}

/* Carga los datos desde LocalStorage o inicializa con datos de ejemplo */
function cargarDesdeAlmacenamiento() {
  try {
    var datosGuardados = localStorage.getItem(CLAVE_ALMACENAMIENTO);

    if (datosGuardados !== null) {
      /* Si ya existen datos guardados, los parsea */
      listaEmprendimientos = JSON.parse(datosGuardados);
      sincronizarImagenesEjemplo(); /* Asegura que las imágenes de ejemplo estén presentes */
    } else {
      /* Primera visita: carga los datos de demostración */
      listaEmprendimientos = DATOS_EJEMPLO.slice();
      guardarEnAlmacenamiento();
    }

  } catch (error) {
    /* Si hay error de parseo, restaura los datos de ejemplo */
    listaEmprendimientos = DATOS_EJEMPLO.slice();
    guardarEnAlmacenamiento();
  }
}

/* Sincroniza las imágenes de los datos ejemplo que puedan faltar en registros guardados */
function sincronizarImagenesEjemplo() {
  var huboCambios = false;

  for (var i = 0; i < listaEmprendimientos.length; i++) {
    var emp = listaEmprendimientos[i];

    /* Solo actúa si el registro no tiene imagen */
    if (!emp.imagen) {
      for (var j = 0; j < DATOS_EJEMPLO.length; j++) {
        if (DATOS_EJEMPLO[j].id === emp.id) {
          emp.imagen = DATOS_EJEMPLO[j].imagen;
          huboCambios = true;
          break;
        }
      }
    }
  }

  /* Persiste solo si se realizaron cambios */
  if (huboCambios) {
    guardarEnAlmacenamiento();
  }
}


/* AVISO FLOTANTE (TOAST) */

/* Temporizador para ocultar el aviso automáticamente */
var temporizadorAviso;

/*
 * Muestra una notificación temporal en la esquina inferior derecha
 * @param {string} mensaje - Texto a mostrar
 * @param {string} tipo    - 'exito' | 'error' | 'info'
 */
function mostrarAviso(mensaje, tipo) {
  if (tipo == null) { tipo = 'exito'; }

  var elementoAviso = obtenerElemento('aviso');
  elementoAviso.textContent = mensaje;
  elementoAviso.className = 'aviso visible ' + tipo; /* Aplica clase visible */

  clearTimeout(temporizadorAviso);

  /* Oculta el aviso después de 3.2 segundos */
  temporizadorAviso = setTimeout(function () {
    elementoAviso.className = 'aviso';
  }, 3200);
}


/* NAVEGACIÓN ENTRE SECCIONES */

/*
 * Activa la sección indicada y desactiva todas las demás.
 * Actualiza el enlace activo en la barra de navegación.
 * @param {string} idSeccion - ID de la sección a mostrar
 */
function irA(idSeccion) {
  /* Oculta todas las secciones */
  var secciones = document.querySelectorAll('.seccion');
  for (var i = 0; i < secciones.length; i++) {
    secciones[i].classList.remove('activo');
  }

  /* Desactiva todos los enlaces de navegación */
  var enlaces = document.querySelectorAll('.enlace-nav');
  for (var j = 0; j < enlaces.length; j++) {
    enlaces[j].classList.remove('activo');
  }

  /* Muestra la sección solicitada */
  var seccionDestino = obtenerElemento(idSeccion);
  if (seccionDestino !== null) {
    seccionDestino.classList.add('activo');
  }

  /* Marca el enlace correspondiente como activo */
  var todosEnlaces = document.querySelectorAll('.enlace-nav');
  for (var k = 0; k < todosEnlaces.length; k++) {
    if (todosEnlaces[k].getAttribute('data-seccion') === idSeccion) {
      todosEnlaces[k].classList.add('activo');
    }
  }

  /* Cierra el menú móvil si estaba abierto */
  obtenerElemento('enlacesNav').classList.remove('abierto');

  /* Vuelve al inicio de la página */
  window.scrollTo(0, 0);

  /* Acciones adicionales según la sección de destino */
  if (idSeccion === 'emprendimientos') {
    mostrarTarjetas(listaEmprendimientos);
  }
  if (idSeccion === 'panel') {
    mostrarPanel();
  }
  if (idSeccion === 'inicio') {
    actualizarEstadisticasInicio();
  }
}

/*
 * Filtra el catálogo por categoría y navega a la sección de emprendimientos.
 * Se usa desde los chips de categoría en la sección de inicio.
 * @param {string} categoria - Nombre de la categoría a filtrar
 */
function filtrarYNavegar(categoria) {
  irA('emprendimientos');
  obtenerElemento('filtroCatalogo').value = categoria;
  filtrarTarjetas();
}


/* ESTADÍSTICAS DEL INICIO */

/* Actualiza los contadores del bloque hero en la sección de inicio */
function actualizarEstadisticasInicio() {
  obtenerElemento('totalEmprendimientos').textContent = listaEmprendimientos.length;

  /* Suma las ventas de todos los emprendimientos */
  var sumaVentas = 0;
  for (var i = 0; i < listaEmprendimientos.length; i++) {
    sumaVentas += Number(listaEmprendimientos[i].ventas);
  }

  obtenerElemento('totalVentas').textContent = formatearPrecio(sumaVentas);
}


/* CATÁLOGO – TARJETAS DE EMPRENDIMIENTOS */

/*
 * Renderiza la lista de emprendimientos como tarjetas HTML en el catálogo.
 * @param {Array} lista - Lista de objetos emprendimiento a mostrar
 */
function mostrarTarjetas(lista) {
  var contenedor   = obtenerElemento('cuadriculaTarjetas');
  var mensajeVacio = obtenerElemento('estadoVacio');
  contenedor.innerHTML = ''; /* Limpia el contenido previo */

  /* Muestra mensaje vacío si no hay resultados */
  if (lista.length === 0) {
    mensajeVacio.style.display = 'block';
    return;
  }
  mensajeVacio.style.display = 'none';

  /* Crea una tarjeta por cada emprendimiento */
  for (var i = 0; i < lista.length; i++) {
    var emp = lista[i];
    var tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-emp';
    tarjeta.style.animationDelay = (i * 0.06) + 's'; /* Entrada escalonada */

    /* Decide si mostrar imagen real o ícono de categoría */
    var htmlImagen;
    if (emp.imagen) {
      htmlImagen =
        '<div class="imagen-tarjeta">' +
          obtenerIconoCategoria(emp.categoria) +
          '<img src="' + escaparHtml(emp.imagen) + '" alt="' + escaparHtml(emp.nombre) + '" onerror="this.remove()" />' +
        '</div>';
    } else {
      htmlImagen = '<div class="imagen-tarjeta">' + obtenerIconoCategoria(emp.categoria) + '</div>';
    }

    /* Construye el HTML completo de la tarjeta */
    tarjeta.innerHTML =
      htmlImagen +
      '<div class="cuerpo-tarjeta">' +
        '<div class="meta-tarjeta">' +
          '<span class="badge-tarjeta badge-' + emp.categoria + '">' + emp.categoria + '</span>' +
          '<span class="pastilla-estado estado-' + emp.estado + '">' + emp.estado + '</span>' +
        '</div>' +
        '<h3 class="titulo-tarjeta">' + escaparHtml(emp.nombre) + '</h3>' +
        '<p class="subtitulo-tarjeta"><i class="fa-solid fa-user-graduate"></i> ' + escaparHtml(emp.responsable) + ' · ' + escaparHtml(emp.carrera) + '</p>' +
        '<p class="descripcion-tarjeta">' + escaparHtml(emp.descripcion || emp.producto) + '</p>' +
        '<div class="pie-tarjeta">' +
          '<div>' +
            '<span class="etiqueta-ventas">Ventas/mes</span>' +
            '<span class="ventas-tarjeta">' + formatearPrecio(emp.ventas) + '</span>' +
          '</div>' +
          '<div class="acciones-tarjeta">' +
            '<button class="btn-icono" title="Editar" onclick="editarEmprendimiento(\'' + emp.id + '\')"><i class="fa-solid fa-pen"></i></button>' +
            '<button class="btn-icono eliminar" title="Eliminar" onclick="confirmarEliminar(\'' + emp.id + '\')"><i class="fa-solid fa-trash-can"></i></button>' +
          '</div>' +
        '</div>' +
      '</div>';

    contenedor.appendChild(tarjeta);
  }
}

/* Aplica los filtros activos y actualiza la cuadrícula de tarjetas */
function filtrarTarjetas() {
  var texto     = obtenerElemento('busquedaCatalogo').value.toLowerCase().trim();
  var categoria = obtenerElemento('filtroCatalogo').value;
  var estado    = obtenerElemento('estadoCatalogo').value;

  var resultado = [];

  for (var i = 0; i < listaEmprendimientos.length; i++) {
    var emp = listaEmprendimientos[i];

    /* Verifica coincidencia en nombre o código */
    var coincideTexto     = !texto     || emp.nombre.toLowerCase().indexOf(texto) !== -1 || emp.codigo.toLowerCase().indexOf(texto) !== -1;
    var coincideCategoria = !categoria || emp.categoria === categoria;
    var coincideEstado    = !estado    || emp.estado === estado;

    if (coincideTexto && coincideCategoria && coincideEstado) {
      resultado.push(emp);
    }
  }

  mostrarTarjetas(resultado);
}

/* Limpia todos los filtros y muestra todos los emprendimientos */
function limpiarFiltros() {
  obtenerElemento('busquedaCatalogo').value = '';
  obtenerElemento('filtroCatalogo').value   = '';
  obtenerElemento('estadoCatalogo').value   = '';
  mostrarTarjetas(listaEmprendimientos);
}


/* FORMULARIO DE REGISTRO */

/* Definición de los campos del formulario con sus reglas de validación */
var CAMPOS_FORMULARIO = [
  { id: 'codigo',      etiqueta: 'Código',               requerido: true },
  { id: 'nombre',      etiqueta: 'Nombre',               requerido: true },
  { id: 'responsable', etiqueta: 'Responsable',          requerido: true },
  { id: 'carrera',     etiqueta: 'Carrera/Departamento', requerido: true },
  { id: 'categoria',   etiqueta: 'Categoría',            requerido: true },
  { id: 'estado',      etiqueta: 'Estado',               requerido: true },
  { id: 'producto',    etiqueta: 'Producto o servicio',  requerido: true },
  { id: 'ventas',      etiqueta: 'Ventas mensuales',     requerido: true, tipo: 'numero' }
];

/*
 * Valida todos los campos del formulario.
 * Muestra mensajes de error bajo cada campo inválido.
 * @returns {boolean} true si el formulario es válido, false si hay errores
 */
function validarFormulario() {
  var esValido = true;

  for (var i = 0; i < CAMPOS_FORMULARIO.length; i++) {
    var campo       = CAMPOS_FORMULARIO[i];
    var elemento    = obtenerElemento(campo.id);
    var errorElem   = obtenerElemento('err-' + campo.id);
    var valor       = elemento.value.trim();

    /* Limpia estado previo de error */
    elemento.classList.remove('error');
    if (errorElem) errorElem.textContent = '';

    /* Valida campo requerido vacío */
    if (campo.requerido && !valor) {
      elemento.classList.add('error');
      if (errorElem) errorElem.textContent = campo.etiqueta + ' es requerido.';
      esValido = false;

    /* Valida que sea un número positivo */
    } else if (campo.tipo === 'numero' && valor !== '' && (isNaN(valor) || Number(valor) < 0)) {
      elemento.classList.add('error');
      if (errorElem) errorElem.textContent = 'Ingrese un número válido.';
      esValido = false;
    }
  }

  return esValido;
}

/* Restablece el formulario a su estado inicial (sin datos ni errores) */
function reiniciarFormulario() {
  obtenerElemento('formularioEmprendimiento').reset();
  obtenerElemento('idEdicion').value = '';
  obtenerElemento('botonEnviar').textContent = 'Registrar Emprendimiento';

  /* Limpia clases de error y mensajes de todos los campos */
  for (var i = 0; i < CAMPOS_FORMULARIO.length; i++) {
    var campo     = CAMPOS_FORMULARIO[i];
    var elemento  = obtenerElemento(campo.id);
    var errorElem = obtenerElemento('err-' + campo.id);
    if (elemento)  elemento.classList.remove('error');
    if (errorElem) errorElem.textContent = '';
  }
}

/* Escucha el evento submit del formulario principal */
obtenerElemento('formularioEmprendimiento').addEventListener('submit', function (evento) {
  evento.preventDefault(); /* Evita recarga de la página */

  if (!validarFormulario()) return; /* Detiene si hay errores */

  var idEnEdicion = obtenerElemento('idEdicion').value;

  /* Recolecta los datos del formulario */
  var datosEmp = {
    codigo:      obtenerElemento('codigo').value.trim(),
    nombre:      obtenerElemento('nombre').value.trim(),
    responsable: obtenerElemento('responsable').value.trim(),
    carrera:     obtenerElemento('carrera').value.trim(),
    categoria:   obtenerElemento('categoria').value,
    estado:      obtenerElemento('estado').value,
    producto:    obtenerElemento('producto').value.trim(),
    descripcion: obtenerElemento('descripcion').value.trim(),
    ventas:      parseFloat(obtenerElemento('ventas').value) || 0,
    imagen:      obtenerElemento('imagen').value.trim()
  };

  if (idEnEdicion) {
    /* MODO EDICIÓN: actualiza el registro existente */
    for (var i = 0; i < listaEmprendimientos.length; i++) {
      if (listaEmprendimientos[i].id === idEnEdicion) {

        /* Actualiza cada propiedad manualmente */
        listaEmprendimientos[i].codigo      = datosEmp.codigo;
        listaEmprendimientos[i].nombre      = datosEmp.nombre;
        listaEmprendimientos[i].responsable = datosEmp.responsable;
        listaEmprendimientos[i].carrera     = datosEmp.carrera;
        listaEmprendimientos[i].categoria   = datosEmp.categoria;
        listaEmprendimientos[i].estado      = datosEmp.estado;
        listaEmprendimientos[i].producto    = datosEmp.producto;
        listaEmprendimientos[i].descripcion = datosEmp.descripcion;
        listaEmprendimientos[i].ventas      = datosEmp.ventas;
        listaEmprendimientos[i].imagen      = datosEmp.imagen;
        break;
      }
    }
    guardarEnAlmacenamiento();
    mostrarAviso('✅ Emprendimiento actualizado correctamente', 'exito');
    reiniciarFormulario();
    irA('panel'); /* Redirige al panel tras editar */

  } else {
    /* MODO CREACIÓN: añade un nuevo registro */
    datosEmp.id = generarId(); /* Asigna ID único */
    listaEmprendimientos.push(datosEmp);
    guardarEnAlmacenamiento();
    actualizarEstadisticasInicio();

    /* Muestra el mensaje de éxito y oculta el formulario */
    obtenerElemento('formularioEmprendimiento').style.display = 'none';
    obtenerElemento('mensajeExito').textContent = '"' + datosEmp.nombre + '" ha sido añadido al catálogo ESPE Emprende.';
    obtenerElemento('exitoFormulario').style.display = 'block';
    mostrarAviso('🚀 Emprendimiento registrado exitosamente', 'exito');
  }
});


/* EDITAR EMPRENDIMIENTO */

/*
 * Carga los datos de un emprendimiento existente en el formulario para editarlos.
 * @param {string} id - ID del emprendimiento a editar
 */
function editarEmprendimiento(id) {
  var emp = null;

  /* Busca el emprendimiento por ID */
  for (var i = 0; i < listaEmprendimientos.length; i++) {
    if (listaEmprendimientos[i].id === id) {
      emp = listaEmprendimientos[i];
      break;
    }
  }

  if (!emp) return; /* Sale si no lo encuentra */

  /* Navega al formulario y asegura que esté visible */
  irA('registro');
  obtenerElemento('formularioEmprendimiento').style.display = 'grid';
  obtenerElemento('exitoFormulario').style.display = 'none';

  /* Rellena el formulario con los datos del emprendimiento */
  obtenerElemento('idEdicion').value    = emp.id;
  obtenerElemento('codigo').value       = emp.codigo;
  obtenerElemento('nombre').value       = emp.nombre;
  obtenerElemento('responsable').value  = emp.responsable;
  obtenerElemento('carrera').value      = emp.carrera;
  obtenerElemento('categoria').value    = emp.categoria;
  obtenerElemento('estado').value       = emp.estado;
  obtenerElemento('producto').value     = emp.producto;
  obtenerElemento('descripcion').value  = emp.descripcion || '';
  obtenerElemento('ventas').value       = emp.ventas;
  obtenerElemento('imagen').value       = emp.imagen || '';

  /* Cambia el texto del botón para indicar modo edición */
  obtenerElemento('botonEnviar').textContent = '💾 Guardar Cambios';

  mostrarAviso('✏️ Editando: ' + emp.nombre, 'info');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ELIMINAR EMPRENDIMIENTO */

/*
 * Abre el modal de confirmación antes de eliminar.
 * @param {string} id - ID del emprendimiento a eliminar
 */
function confirmarEliminar(id) {
  idPendienteEliminar = id;

  /* Busca el nombre del emprendimiento para mostrarlo en el modal */
  var emp = null;
  for (var i = 0; i < listaEmprendimientos.length; i++) {
    if (listaEmprendimientos[i].id === id) {
      emp = listaEmprendimientos[i];
      break;
    }
  }

  /* Personaliza el mensaje del modal con el nombre del emprendimiento */
  obtenerElemento('mensajeEliminar').textContent =
    '¿Eliminar "' + (emp ? emp.nombre : id) + '"? Esta acción no se puede deshacer.';

  obtenerElemento('modalEliminar').style.display = 'flex'; /* Muestra el modal */
}

/* Cierra el modal de eliminación sin realizar cambios */
function cerrarModal() {
  obtenerElemento('modalEliminar').style.display = 'none';
  idPendienteEliminar = null;
}

/* Ejecuta la eliminación al confirmar en el modal */
obtenerElemento('confirmarEliminar').addEventListener('click', function () {
  if (!idPendienteEliminar) return;

  var nombreEliminado = '';
  var listaFiltrada   = [];

  /* Separa el elemento a eliminar del resto */
  for (var i = 0; i < listaEmprendimientos.length; i++) {
    if (listaEmprendimientos[i].id === idPendienteEliminar) {
      nombreEliminado = listaEmprendimientos[i].nombre;
    } else {
      listaFiltrada.push(listaEmprendimientos[i]);
    }
  }

  listaEmprendimientos = listaFiltrada;
  guardarEnAlmacenamiento();
  cerrarModal();

  /* Refresca la vista activa tras eliminar */
  var seccionActiva = document.querySelector('.seccion.activo');
  if (seccionActiva && seccionActiva.id === 'emprendimientos') filtrarTarjetas();
  if (seccionActiva && seccionActiva.id === 'panel')           mostrarPanel();

  actualizarEstadisticasInicio();
  mostrarAviso('🗑️ "' + nombreEliminado + '" eliminado', 'error');
});

/* Cierra el modal al hacer clic en el fondo oscuro (overlay) */
obtenerElemento('modalEliminar').addEventListener('click', function (evento) {
  if (evento.target === this) cerrarModal();
});


/* TABLA DINÁMICA (PANEL) */

/*
 * Renderiza los emprendimientos como filas en la tabla del panel.
 * @param {Array} lista - Lista de emprendimientos a mostrar
 */
function mostrarTabla(lista) {
  var cuerpoTabla  = obtenerElemento('cuerpoTabla');
  var mensajeVacio = obtenerElemento('tablaVacia');
  cuerpoTabla.innerHTML = ''; /* Limpia filas previas */

  /* Muestra mensaje si no hay registros */
  if (lista.length === 0) {
    mensajeVacio.style.display = 'block';
    return;
  }
  mensajeVacio.style.display = 'none';

  /* Construye una fila por cada emprendimiento */
  for (var i = 0; i < lista.length; i++) {
    var emp  = lista[i];
    var fila = document.createElement('tr');
    fila.innerHTML =
      '<td><span class="celda-codigo">' + escaparHtml(emp.codigo) + '</span></td>' +
      '<td><strong>' + escaparHtml(emp.nombre) + '</strong></td>' +
      '<td>' + escaparHtml(emp.responsable) + '</td>' +
      '<td>' + escaparHtml(emp.carrera) + '</td>' +
      '<td><span class="badge-tarjeta badge-' + emp.categoria + '">' + emp.categoria + '</span></td>' +
      '<td><span class="pastilla-estado estado-' + emp.estado + '">' + emp.estado + '</span></td>' +
      '<td class="celda-ventas">' + formatearPrecio(emp.ventas) + '</td>' +
      '<td>' +
        '<div class="acciones-tabla">' +
          '<button class="btn-icono" title="Editar" onclick="editarEmprendimiento(\'' + emp.id + '\')"><i class="fa-solid fa-pen"></i></button>' +
          '<button class="btn-icono eliminar" title="Eliminar" onclick="confirmarEliminar(\'' + emp.id + '\')"><i class="fa-solid fa-trash-can"></i></button>' +
        '</div>' +
      '</td>';
    cuerpoTabla.appendChild(fila);
  }
}

/* Filtra las filas de la tabla según búsqueda y categoría */
function filtrarTabla() {
  var texto     = obtenerElemento('busquedaTabla').value.toLowerCase().trim();
  var categoria = obtenerElemento('filtroCategoriaTabla').value;

  var resultado = [];

  for (var i = 0; i < listaEmprendimientos.length; i++) {
    var emp = listaEmprendimientos[i];

    /* Coincide si el texto aparece en nombre, código o responsable */
    var coincideTexto     = !texto     || emp.nombre.toLowerCase().indexOf(texto) !== -1 || emp.codigo.toLowerCase().indexOf(texto) !== -1 || emp.responsable.toLowerCase().indexOf(texto) !== -1;
    var coincideCategoria = !categoria || emp.categoria === categoria;

    if (coincideTexto && coincideCategoria) {
      resultado.push(emp);
    }
  }

  mostrarTabla(resultado);
}


/* ESTADÍSTICAS Y GRÁFICOS DEL PANEL */

/* Calcula y actualiza los KPI del panel */
function mostrarEstadisticas() {
  var total       = listaEmprendimientos.length;
  var sumaVentas  = 0;
  var empTop      = null; /* Emprendimiento con más ventas */

  for (var i = 0; i < listaEmprendimientos.length; i++) {
    var emp = listaEmprendimientos[i];
    sumaVentas += Number(emp.ventas);

    if (!empTop || Number(emp.ventas) > Number(empTop.ventas)) {
      empTop = emp;
    }
  }

  var promedio = total ? sumaVentas / total : 0;

  /* Actualiza los valores en el DOM */
  obtenerElemento('kpiTotal').textContent        = total;
  obtenerElemento('kpiVentasTotales').textContent = formatearPrecio(sumaVentas);
  obtenerElemento('kpiPromedio').textContent      = formatearPrecio(promedio);
  obtenerElemento('kpiTop').textContent           = empTop ? empTop.nombre : '—';
}

/* Renderiza el gráfico de barras por categoría */
function mostrarGraficoCategorias() {
  var categorias = ['Tecnología', 'Alimentos', 'Servicios', 'Educación', 'Ambiente', 'Artesanías', 'Salud', 'Otro'];
  var conteos    = [];
  var maximo     = 1; /* Valor mínimo para evitar división por cero */

  /* Cuenta cuántos emprendimientos hay por cada categoría */
  for (var i = 0; i < categorias.length; i++) {
    var cantidad = 0;
    for (var j = 0; j < listaEmprendimientos.length; j++) {
      if (listaEmprendimientos[j].categoria === categorias[i]) { cantidad++; }
    }
    conteos.push(cantidad);
    if (cantidad > maximo) maximo = cantidad;
  }

  var contenedor = obtenerElemento('graficoCategorias');
  contenedor.innerHTML = '';

  /* Dibuja una fila de barra por cada categoría con datos */
  for (var i = 0; i < categorias.length; i++) {
    if (!conteos[i]) continue; /* Omite categorías vacías */
    var porcentaje = Math.round((conteos[i] / maximo) * 100);
    contenedor.innerHTML +=
      '<div class="fila-barra">' +
        '<span class="etiqueta-barra">' + obtenerIconoCategoria(categorias[i]) + ' ' + categorias[i] + '</span>' +
        '<div class="pista-barra"><div class="relleno-barra" style="width:' + porcentaje + '%"></div></div>' +
        '<span class="conteo-barra">' + conteos[i] + '</span>' +
      '</div>';
  }

  /* Mensaje si no hay datos */
  if (!contenedor.innerHTML) {
    contenedor.innerHTML = '<p style="color:var(--gris-400);font-size:.85rem">Sin datos</p>';
  }
}

/* Renderiza el gráfico de barras por estado */
function mostrarGraficoEstados() {
  var estados  = ['Idea', 'Prototipo', 'En marcha', 'En crecimiento'];
  var colores  = ['#F2C300', '#003A70', '#00783F', '#D32F2F']; /* Colores por estado */
  var conteos  = [];
  var maximo   = 1;

  /* Cuenta emprendimientos por cada estado */
  for (var i = 0; i < estados.length; i++) {
    var cantidad = 0;
    for (var j = 0; j < listaEmprendimientos.length; j++) {
      if (listaEmprendimientos[j].estado === estados[i]) { cantidad++; }
    }
    conteos.push(cantidad);
    if (cantidad > maximo) maximo = cantidad;
  }

  var contenedor = obtenerElemento('graficoEstados');
  contenedor.innerHTML = '';

  /* Dibuja una barra por cada estado con su color propio */
  for (var i = 0; i < estados.length; i++) {
    if (!conteos[i]) continue;
    var porcentaje = Math.round((conteos[i] / maximo) * 100);
    contenedor.innerHTML +=
      '<div class="fila-barra">' +
        '<span class="etiqueta-barra">' + estados[i] + '</span>' +
        '<div class="pista-barra"><div class="relleno-barra" style="width:' + porcentaje + '%;background:' + colores[i] + '"></div></div>' +
        '<span class="conteo-barra">' + conteos[i] + '</span>' +
      '</div>';
  }

  if (!contenedor.innerHTML) {
    contenedor.innerHTML = '<p style="color:var(--gris-400);font-size:.85rem">Sin datos</p>';
  }
}

/* Orquesta la actualización completa del panel */
function mostrarPanel() {
  mostrarEstadisticas();
  mostrarGraficoCategorias();
  mostrarGraficoEstados();
  mostrarTabla(listaEmprendimientos);
}


/* FORMULARIO DE CONTACTO */

/* Escucha el submit del formulario de contacto */
obtenerElemento('formularioContacto').addEventListener('submit', function (evento) {
  evento.preventDefault();

  /* Definición de campos del formulario de contacto */
  var camposContacto = [
    { elemento: obtenerElemento('cNombre'),  idError: 'cerr-nombre',  etiqueta: 'Nombre'  },
    { elemento: obtenerElemento('cCorreo'),  idError: 'cerr-correo',  etiqueta: 'Correo'  },
    { elemento: obtenerElemento('cAsunto'),  idError: 'cerr-asunto',  etiqueta: 'Asunto'  },
    { elemento: obtenerElemento('cMensaje'), idError: 'cerr-mensaje', etiqueta: 'Mensaje' }
  ];

  var esValido = true;

  /* Valida que todos los campos estén completos */
  for (var i = 0; i < camposContacto.length; i++) {
    var campo = camposContacto[i];
    campo.elemento.classList.remove('error');
    obtenerElemento(campo.idError).textContent = '';

    if (!campo.elemento.value.trim()) {
      campo.elemento.classList.add('error');
      obtenerElemento(campo.idError).textContent = campo.etiqueta + ' es requerido.';
      esValido = false;
    }
  }

  if (!esValido) return;

  /* Simula el envío ocultando el formulario y mostrando mensaje de éxito */
  obtenerElemento('formularioContacto').style.display = 'none';
  obtenerElemento('exitoContacto').style.display      = 'block';
  mostrarAviso('📬 Mensaje enviado correctamente', 'exito');
});


/* COMPORTAMIENTO DE LA BARRA DE NAVEGACIÓN */

/* Agrega sombra a la barra cuando el usuario hace scroll */
window.addEventListener('scroll', function () {
  var barraNav = obtenerElemento('barraNav');
  if (window.scrollY > 20) {
    barraNav.classList.add('con-sombra');
  } else {
    barraNav.classList.remove('con-sombra');
  }
});

/* Abre / cierra el menú móvil al hacer clic en el botón hamburguesa */
obtenerElemento('botonMenu').addEventListener('click', function () {
  obtenerElemento('enlacesNav').classList.toggle('abierto');
});

/* Añade navegación a todos los enlaces del menú */
var enlacesMenu = document.querySelectorAll('.enlace-nav');
for (var i = 0; i < enlacesMenu.length; i++) {
  enlacesMenu[i].addEventListener('click', function (evento) {
    evento.preventDefault();
    irA(this.dataset.seccion); /* Lee el atributo data-seccion */
  });
}


/* INICIO DE LA APLICACIÓN */

/* Se ejecuta cuando el DOM está completamente cargado */
document.addEventListener('DOMContentLoaded', function () {
  cargarDesdeAlmacenamiento();   /* Carga datos desde LocalStorage */
  actualizarEstadisticasInicio(); /* Muestra contadores en el hero */
  irA('inicio');                 /* Activa la sección de inicio por defecto */
});