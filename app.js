// app.js - Lógica y Control de la Aplicación Tito's Veterinaria

document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTOS DOM: PANTALLAS ---
  const screens = {
    welcome: document.getElementById('screen-welcome'),
    register: document.getElementById('screen-register'),
    login: document.getElementById('screen-login'),
    forgot: document.getElementById('screen-forgot'),
    main: document.getElementById('screen-main')
  };

  // --- ELEMENTOS DOM: VISTAS (Dentro de Main) ---
  const views = {
    // Dueño
    'owner-mascota': document.getElementById('view-owner-mascota'),
    'owner-turnos': document.getElementById('view-owner-turnos'),
    'owner-vets': document.getElementById('view-owner-vets'),
    'owner-contacto': document.getElementById('view-owner-contacto'),
    'owner-cuenta': document.getElementById('view-owner-cuenta'),
    // Veterinario
    'vet-agenda': document.getElementById('view-vet-agenda'),
    'vet-pacientes': document.getElementById('view-vet-pacientes'),
    'vet-perfil': document.getElementById('view-vet-perfil')
  };

  // --- COMPONENTES DE INTERFAZ GENERAL ---
  const headerRoleBadge = document.getElementById('header-role-badge');
  const btnLogoutHeader = document.getElementById('btn-logout-header');
  const appBottomNav = document.getElementById('app-bottom-nav');
  const logoutBar = document.querySelector('.logout-bar');
  const logoutUserGreeting = document.getElementById('logout-user-greeting');
  const btnLogoutBarAction = document.getElementById('btn-logout-bar-action');

  // --- ESTADO DE LA APLICACIÓN ---
  let currentUser = null;
  let currentPetId = null; // Para la vista de dueño: ID de mascota activa

  // --- HELPERS DE AVATAR (mascotas y perfiles) ---
  // Devuelve el HTML del avatar de una mascota: foto subida o ícono según especie/elección.
  function renderPetAvatar(pet, iconSize = 30) {
    if (pet.avatarType === 'photo' && pet.avatarValue) {
      return `<img src="${pet.avatarValue}" alt="Foto de ${pet.nombre}">`;
    }
    const iconKey = (pet.avatarType === 'icon' && pet.avatarValue) ? pet.avatarValue : (window.Icons.SPECIES_ICON_MAP[pet.especie] || 'paw');
    return window.Icons.icon(iconKey, iconSize);
  }

  // Devuelve el HTML del avatar de un perfil (dueño/veterinario): foto o ícono elegido, con fallback.
  function renderProfileAvatar(person, fallbackIcon = 'user', iconSize = 38) {
    if (person && person.avatarType === 'photo' && person.avatarValue) {
      return `<img src="${person.avatarValue}" alt="Foto de perfil">`;
    }
    const iconKey = (person && person.avatarType === 'icon' && person.avatarValue) ? person.avatarValue : fallbackIcon;
    return window.Icons.icon(iconKey, iconSize);
  }

  // Confirmar y eliminar una mascota, luego refrescar la vista indicada
  function handleDeletePet(petId, refreshCallback) {
    if (confirm('¿Estás seguro de que deseas eliminar esta mascota? Se borrará también su historial médico y turnos asociados.')) {
      window.db.deletePet(petId);
      if (currentPetId === petId) currentPetId = null;
      if (typeof refreshCallback === 'function') refreshCallback();
    }
  }

  // --- NAVEGACIÓN ENTRE PANTALLAS ---
  function showScreen(screenKey) {
    Object.keys(screens).forEach(key => {
      if (key === screenKey) {
        screens[key].classList.add('active');
      } else {
        screens[key].classList.remove('active');
      }
    });
  }

  // --- CONFIGURACIÓN DE NAVEGACIÓN INFERIOR DINÁMICA ---
  function setupBottomNav(role) {
    appBottomNav.innerHTML = '';
    
    const navItems = {
      propietario: [
        { view: 'owner-mascota', icon: 'paw', label: 'Mascotas' },
        { view: 'owner-turnos', icon: 'calendar', label: 'Turnos' },
        { view: 'owner-vets', icon: 'stethoscope', label: 'Médicos' },
        { view: 'owner-contacto', icon: 'phone', label: 'Contacto' },
        { view: 'owner-cuenta', icon: 'user', label: 'Cuenta' }
      ],
      veterinario: [
        { view: 'vet-agenda', icon: 'calendar', label: 'Agenda' },
        { view: 'vet-pacientes', icon: 'paw', label: 'Pacientes' },
        { view: 'owner-vets', icon: 'stethoscope', label: 'Veterinarios' },
        { view: 'vet-perfil', icon: 'user', label: 'Perfil' }
      ]
    };

    const items = navItems[role] || [];
    items.forEach((item, index) => {
      const button = document.createElement('button');
      button.className = `nav-item ${index === 0 ? 'active' : ''}`;
      button.innerHTML = window.Icons.icon(item.icon, 22);
      button.title = item.label;
      button.id = `nav-btn-${item.view}`;
      button.addEventListener('click', () => {
        // Cambiar pestaña activa
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        showView(item.view);
      });
      appBottomNav.appendChild(button);
    });

    // Mostrar por defecto la primera vista del rol
    if (items.length > 0) {
      showView(items[0].view);
    }
  }

  function showView(viewKey) {
    Object.keys(views).forEach(key => {
      if (key === viewKey) {
        views[key].style.display = 'block';
        // Acciones específicas al cargar vista
        if (key === 'owner-mascota') renderMascotaView();
        if (key === 'owner-turnos') renderOwnerAppointments();
        if (key === 'owner-vets') renderOwnerVets();
        if (key === 'owner-cuenta') fillOwnerProfileFields();
        if (key === 'vet-agenda') renderVetAgenda();
        if (key === 'vet-pacientes') renderVetPatients();
        if (key === 'vet-perfil') fillVetProfileFields();
      } else {
        views[key].style.display = 'none';
      }
    });
  }

  // --- EVENTOS DE AUTENTICACIÓN (LOGIN / REGISTRO) ---
  
  // Pantalla Bienvenida
  document.getElementById('btn-welcome-create').addEventListener('click', () => showScreen('register'));
  document.getElementById('link-welcome-login').addEventListener('click', () => showScreen('login'));

  // Enlaces de navegación rápida
  document.getElementById('link-register-login').addEventListener('click', () => showScreen('login'));
  document.getElementById('link-login-register').addEventListener('click', () => showScreen('register'));
  document.getElementById('link-login-forgot').addEventListener('click', () => showScreen('forgot'));
  document.getElementById('link-forgot-login').addEventListener('click', () => showScreen('login'));

  // Mostrar/ocultar campos de veterinario en el registro
  const regRoleSelect = document.getElementById('reg-role');
  const regVetFields = document.getElementById('reg-vet-fields');
  if (regRoleSelect && regVetFields) {
    regRoleSelect.addEventListener('change', () => {
      if (regRoleSelect.value === 'veterinario') {
        regVetFields.style.display = 'block';
        document.getElementById('reg-matricula').required = true;
        document.getElementById('reg-especialidad').required = true;
      } else {
        regVetFields.style.display = 'none';
        document.getElementById('reg-matricula').required = false;
        document.getElementById('reg-especialidad').required = false;
      }
    });
  }

  // Formulario de Registro
  document.getElementById('form-register').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;

    const additionalData = { nombre: username };
    if (role === 'veterinario') {
      additionalData.matricula = document.getElementById('reg-matricula').value.trim();
      additionalData.especialidad = document.getElementById('reg-especialidad').value.trim();
    }

    try {
      const user = window.db.register(username, email, password, role, additionalData);
      handleLoginSuccess(user);
    } catch (error) {
      alert(error.message);
    }
  });

  // --- LÓGICA DE CONTROL: CAMPO CONTRASEÑA (OJITO) ---
  const togglePassword = document.getElementById('btn-toggle-login-pass'); // Usamos tu ID real
  const loginPasswordInput = document.getElementById('login-password');

  if (togglePassword && loginPasswordInput) {
    togglePassword.addEventListener('click', function () {
      const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      loginPasswordInput.setAttribute('type', type);
      this.innerHTML = window.Icons.icon(type === 'password' ? 'eye' : 'eyeOff', 20);
    });
  }

  // Toggle de contraseña en el formulario de Registro
  const toggleRegPassword = document.getElementById('btn-toggle-reg-pass');
  const regPasswordInput = document.getElementById('reg-password');
  if (toggleRegPassword && regPasswordInput) {
    toggleRegPassword.addEventListener('click', function () {
      const type = regPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      regPasswordInput.setAttribute('type', type);
      this.innerHTML = window.Icons.icon(type === 'password' ? 'eye' : 'eyeOff', 20);
    });
  }

  // Formulario de Login
  document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameOrEmail = document.getElementById('login-username').value.trim();
    const password = loginPasswordInput.value;
    const selectedRole = document.getElementById('login-role').value;
    
    // Captura de tu checkbox real "Recordar contraseña"
    const rememberMeChecked = document.getElementById('login-remember') ? document.getElementById('login-remember').checked : false;

    const user = window.db.login(usernameOrEmail, password, selectedRole);
    if (user) {
      if (rememberMeChecked) {
        // Guardamos credenciales para que inicie directo la próxima vez
        localStorage.setItem('rememberedUser', usernameOrEmail);
        localStorage.setItem('rememberedPass', password);
        localStorage.setItem('rememberedRole', selectedRole);
      } else {
        // Si no está tildado, borramos lo guardado
        localStorage.removeItem('rememberedUser');
        localStorage.removeItem('rememberedPass');
        localStorage.removeItem('rememberedRole');
      }
      
      handleLoginSuccess(user);
    } else {
      alert('Credenciales incorrectas o el rol no coincide con la cuenta. Intenta de nuevo.');
    }
  });

  // AUTOCOMPLETAR E INGRESAR DIRECTO SI FUE RECORDADO
  const savedUser = localStorage.getItem('rememberedUser');
  const savedPass = localStorage.getItem('rememberedPass');
  const savedRole = localStorage.getItem('rememberedRole');

  if (savedUser && savedPass && document.getElementById('login-username')) {
    document.getElementById('login-username').value = savedUser;
    loginPasswordInput.value = savedPass;
    if (document.getElementById('login-role')) {
      document.getElementById('login-role').value = savedRole;
    }
    if (document.getElementById('login-remember')) {
      document.getElementById('login-remember').checked = true;
    }
  }

  // Formulario Olvidé Contraseña
  document.getElementById('form-forgot').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    alert(`Se ha enviado un enlace de recuperación a ${email}`);
    showScreen('login');
  });

  // Manejo de Inicio de Sesión Exitoso
  function handleLoginSuccess(user) {
    currentUser = user;
    
    // Configurar encabezado y rol
    headerRoleBadge.innerText = user.role === 'veterinario' ? 'Veterinario' : 'Dueño';
    headerRoleBadge.className = `role-badge ${user.role === 'veterinario' ? 'vet' : ''}`;
    
    // Configurar barra de logout (para coincidir con algunas estéticas opcionales)
    logoutUserGreeting.innerText = `Hola, ${user.details.nombre || user.username}`;
    
    // Limpiar contraseñas de los formularios
    document.getElementById('login-password').value = '';
    document.getElementById('reg-password').value = '';
    
    // Configurar pestañas
    setupBottomNav(user.role);
    showScreen('main');
  }

  // Cierre de Sesión
  function handleLogout() {
    currentUser = null;
    currentPetId = null;
    showScreen('welcome');
  }

  btnLogoutHeader.addEventListener('click', handleLogout);
  btnLogoutBarAction.addEventListener('click', handleLogout);


  // ================= VISTA DUEÑO DE MASCOTAS =================

  // --- RENDERIZADO FICHA MASCOTA Y HISTORIAL ---
  function renderMascotaView() {
    const ownerId = currentUser.details.id;
    const pets = window.db.getPetsByOwner(ownerId);
    const switcher = document.getElementById('pet-switcher-container');
    const detailsContainer = document.getElementById('pet-details-container');

    switcher.innerHTML = '';
    
    if (pets.length === 0) {
      detailsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${window.Icons.icon('paw', 44)}</div>
          <p>Aún no tenés mascotas registradas.</p>
          <p>Presioná el botón de abajo para agregar una mascota.</p>
        </div>
      `;
      currentPetId = null;
      return;
    }

    // Si no hay mascota activa o la mascota activa no pertenece a este dueño, seleccionar la primera
    if (!currentPetId || !pets.some(p => p.id === currentPetId)) {
      currentPetId = pets[0].id;
    }

    // Renderizar botones de switch
    pets.forEach(pet => {
      const btn = document.createElement('button');
      btn.className = `pet-switch-btn ${pet.id === currentPetId ? 'active' : ''}`;
      btn.innerText = pet.nombre;
      btn.addEventListener('click', () => {
        currentPetId = pet.id;
        renderMascotaView();
      });
      switcher.appendChild(btn);
    });

    // Cargar Historial e información detallada de la mascota activa
    const history = window.db.getPetMedicalHistory(currentPetId);
    if (!history) return;

    const { pet, condiciones, consultas } = history;

    // Calcular edad
    const birthDate = new Date(pet.edad);
    const today = new Date();
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();
    if (ageMonths < 0 || (ageMonths === 0 && today.getDate() < birthDate.getDate())) {
      ageYears--;
      ageMonths += 12;
    }
    const ageString = ageYears > 0 
      ? `${ageYears} ${ageYears === 1 ? 'año' : 'años'} ${ageMonths > 0 ? `y ${ageMonths} meses` : ''}`
      : `${ageMonths} meses`;

    // Renderizar Ficha
    let html = `
      <!-- Ficha de Datos -->
      <div class="data-card">
        <div class="card-actions-corner">
          <button class="btn-card-action edit btn-edit-pet" data-id="${pet.id}" title="Editar Mascota">${window.Icons.icon('pencil', 16)}</button>
          <button class="btn-card-action delete btn-delete-pet" data-id="${pet.id}" title="Eliminar Mascota">${window.Icons.icon('x', 16)}</button>
        </div>
        <div class="pet-profile-header">
          <div class="pet-avatar-wrapper">${renderPetAvatar(pet, 36)}</div>
          <div class="pet-main-info">
            <h3 class="pet-name-title">${pet.nombre}</h3>
            <span class="pet-species-tag">${pet.especie}</span>
          </div>
        </div>

        <div class="grid-2">
          <div class="info-field-bubble">
            <label>Fecha de Nacimiento</label>
            <div class="value">${pet.edad.split('-').reverse().join('/')}</div>
          </div>
          <div class="info-field-bubble">
            <label>Edad Estimada</label>
            <div class="value">${ageString}</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="info-field-bubble">
            <label>Raza</label>
            <div class="value">${pet.raza}</div>
          </div>
          <div class="info-field-bubble">
            <label>Peso</label>
            <div class="value">${pet.peso} Kg</div>
          </div>
        </div>

        <div class="info-field-bubble" style="margin-bottom: 0;">
          <label>Color</label>
          <div class="value">${pet.color}</div>
        </div>
      </div>

      <!-- Condiciones Previas -->
      <h3 class="info-section-title">Historial Clínico</h3>
      <div class="data-card">
        <label style="display:block; font-size:12px; color:var(--text-muted); font-weight:600; margin-bottom:8px;">CONDICIONES PREVIAS / DIAGNÓSTICOS CRÓNICOS</label>
        <div class="pill-list">
          ${condiciones.length > 0 
            ? condiciones.map(c => `<span class="pill-item">${c}</span>`).join('') 
            : '<span class="pill-item" style="color:var(--text-muted); border-style:dashed;">Ninguna registrada</span>'
          }
        </div>
      </div>

      <!-- Prescripciones / Tratamientos Activos -->
      <h3 class="info-section-title">Tratamientos y Recetas</h3>
      <div class="data-card">
        <div id="active-prescriptions-list">
          ${renderActivePrescriptions(consultas)}
        </div>
      </div>

      <!-- Historial de Consultas -->
      <h3 class="info-section-title">Historial de Consultas</h3>
      <div class="consultations-history-list">
        ${consultas.length > 0 
          ? consultas.map(c => `
              <div class="consultation-card">
                <div class="consultation-header">
                  <span>${window.Icons.icon('calendar', 13)} ${c.fechaHora.substring(0, 16)}</span>
                  <span>${window.Icons.icon('stethoscope', 13)} Dr. ${c.veterinarioNombre}</span>
                </div>
                <div class="consultation-reason">Motivo: ${c.motivo}</div>
                <div class="consultation-body">
                  <p><span>Diagnóstico:</span> ${c.diagnostico}</p>
                  <p style="margin-top: 4px;"><span>Tratamiento:</span> ${c.tratamiento}</p>
                </div>
              </div>
            `).join('') 
          : '<div class="empty-state" style="padding:20px 0;"><p>No hay consultas registradas para esta mascota.</p></div>'
        }
      </div>
    `;

    detailsContainer.innerHTML = html;

    detailsContainer.querySelectorAll('.btn-edit-pet').forEach(btn => {
      btn.addEventListener('click', () => openPetModal(parseInt(btn.dataset.id)));
    });
    detailsContainer.querySelectorAll('.btn-delete-pet').forEach(btn => {
      btn.addEventListener('click', () => handleDeletePet(parseInt(btn.dataset.id), renderMascotaView));
    });
  }

  // Generar recetas en base a las consultas
  function renderActivePrescriptions(consultas) {
    const list = [];
    consultas.forEach(c => {
      c.prescripciones.forEach(p => {
        list.push(`
          <div class="medical-record-item">
            <h4>${window.Icons.icon('pill', 15)} ${p.medicamentoNombre} (${p.medicamentoTipo})</h4>
            <p><strong>Dosis:</strong> ${p.dosis} comprimido/unidad cada ${p.frecuencia} hs por ${p.duracion} días.</p>
            ${p.reaccionAdversa ? `<p style="font-size: 11px; margin-top:2px; color:#A84040;">${window.Icons.icon('alert', 12)} <em>Reacción adversa posible: ${p.reaccionAdversa}</em></p>` : ''}
            <p style="font-size: 11px; margin-top: 4px; color:var(--text-muted);">Asociado a consulta del: ${c.fechaHora.substring(0,10)}</p>
          </div>
        `);
      });
    });

    return list.length > 0 
      ? list.join('') 
      : '<p style="color:var(--text-muted); font-size:14px; text-align:center; padding:10px 0;">No hay recetas activas registradas.</p>';
  }


  // --- GESTIÓN DE TURNOS (DUEÑO) ---
  function renderOwnerAppointments() {
    const ownerId = currentUser.details.id;
    const appts = window.db.getAppointmentsByOwner(ownerId);
    const container = document.getElementById('appt-list-container');

    container.innerHTML = '';

    if (appts.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${window.Icons.icon('calendar', 44)}</div>
          <p>No tenés ningún turno agendado.</p>
          <p>Presioná el botón de abajo para solicitar un turno.</p>
        </div>
      `;
      return;
    }

    appts.forEach(appt => {
      const date = new Date(appt.fechaHora);
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthStr = months[date.getMonth()];
      const dayStr = date.getDate().toString().padStart(2, '0');
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}Hs`;

      const card = document.createElement('div');
      card.className = 'appointment-card';
      card.innerHTML = `
        <div class="appt-date-badge">
          <span class="appt-date-month">${monthStr}</span>
          <span class="appt-date-day">${dayStr}</span>
        </div>
        <div class="appt-details">
          <div class="appt-title">Turno para: ${appt.mascotaNombre}</div>
          <div class="appt-meta">${window.Icons.icon('stethoscope', 13)} Vet: Dr. ${appt.veterinarioNombre}</div>
          <div class="appt-meta">${window.Icons.icon('clock', 13)} Horario: ${timeStr}</div>
          <div class="appt-meta">${window.Icons.icon('fileText', 13)} Motivo: ${appt.motivo}</div>
          <span class="appt-status ${appt.estado.toLowerCase()}">${appt.estado}</span>
        </div>
        ${appt.estado === 'Pendiente' ? `
          <div class="appt-actions">
            <button class="btn-icon btn-edit-appt" data-id="${appt.id}" title="Reprogramar">${window.Icons.icon('pencil', 15)}</button>
            <button class="btn-icon btn-cancel-appt" data-id="${appt.id}" title="Cancelar Turno" style="color:#C0392B;">${window.Icons.icon('x', 15)}</button>
          </div>
        ` : ''}
      `;
      container.appendChild(card);
    });

    // Agregar listeners para cancelar y editar
    container.querySelectorAll('.btn-cancel-appt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.dataset.id);
        if (confirm('¿Estás seguro de que deseas cancelar este turno?')) {
          window.db.cancelAppointment(id);
          renderOwnerAppointments();
        }
      });
    });

    container.querySelectorAll('.btn-edit-appt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.dataset.id);
        openApptModal(id);
      });
    });
  }


  // --- VISTA EQUIPO MÉDICO (VETERINARIOS) ---
  function renderOwnerVets() {
    const vets = window.db.getVeterinarians();
    const container = document.getElementById('vets-list-container');
    container.innerHTML = '';

    const canManage = currentUser && currentUser.role === 'veterinario';

    if (vets.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">${window.Icons.icon('stethoscope', 44)}</div><p>No hay veterinarios registrados.</p></div>`;
      return;
    }

    vets.forEach(vet => {
      const card = document.createElement('div');
      card.className = 'vet-card';
      card.innerHTML = `
        <div class="vet-avatar">${renderProfileAvatar(vet, 'stethoscope', 24)}</div>
        <div class="vet-info">
          <h3 class="vet-name">Dr. ${vet.nombre}</h3>
          <p class="vet-specialty">${vet.especialidad}</p>
          <p class="vet-hours">Horarios: ${vet.horario}</p>
        </div>
        ${canManage ? `
          <div class="vet-card-actions">
            <button class="btn-card-action edit btn-edit-vet-card" data-id="${vet.id}" title="Editar Veterinario">${window.Icons.icon('pencil', 15)}</button>
            <button class="btn-card-action delete btn-delete-vet-card" data-id="${vet.id}" title="Eliminar Veterinario">${window.Icons.icon('x', 15)}</button>
          </div>
        ` : ''}
      `;
      container.appendChild(card);
    });

    if (canManage) {
      container.querySelectorAll('.btn-edit-vet-card').forEach(btn => {
        btn.addEventListener('click', () => openEditVetModal(parseInt(btn.dataset.id)));
      });
      container.querySelectorAll('.btn-delete-vet-card').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteVet(parseInt(btn.dataset.id)));
      });
    }
  }


  // --- VISTA PERFIL DUEÑO (EDITAR) ---
  const formProfileOwner = document.getElementById('form-profile-owner');
  const btnToggleEditProfile = document.getElementById('btn-toggle-edit-profile');
  const btnSaveProfile = document.getElementById('btn-save-profile');
  let isEditingProfile = false;

  function fillOwnerProfileFields() {
    const p = currentUser.details;
    document.getElementById('profile-display-name').innerText = p.nombre;
    document.getElementById('profile-display-email').innerText = currentUser.email;
    document.getElementById('owner-avatar-display').innerHTML = renderProfileAvatar(p, 'user', 40);

    document.getElementById('prof-nombre').value = p.nombre;
    document.getElementById('prof-dni').value = p.dni || '';
    document.getElementById('prof-telefono').value = p.telefono || '';
    document.getElementById('prof-calle').value = p.calle || '';
    document.getElementById('prof-altura').value = p.altura || '';
    document.getElementById('prof-piso').value = p.piso || '0';
    document.getElementById('prof-localidad').value = p.localidad || '';
    document.getElementById('prof-cp').value = p.codigoPostal || '';

    // Asegurarse de que esté deshabilitado al entrar
    toggleFieldsEditable(false);
  }

  function toggleFieldsEditable(editable) {
    isEditingProfile = editable;
    const inputs = formProfileOwner.querySelectorAll('input');
    inputs.forEach(input => input.disabled = !editable);

    if (editable) {
      btnToggleEditProfile.innerHTML = `${window.Icons.icon('x', 14)} Cancelar Edición`;
      btnToggleEditProfile.style.backgroundColor = '#8E8E8E';
      btnSaveProfile.style.display = 'block';
    } else {
      btnToggleEditProfile.innerHTML = `${window.Icons.icon('pencil', 14)} Editar Datos`;
      btnToggleEditProfile.style.backgroundColor = 'var(--primary-blue)';
      btnSaveProfile.style.display = 'none';
    }
  }

  btnToggleEditProfile.addEventListener('click', () => {
    if (isEditingProfile) {
      fillOwnerProfileFields(); // Resetear valores
    } else {
      toggleFieldsEditable(true);
    }
  });

  formProfileOwner.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedData = {
      nombre: document.getElementById('prof-nombre').value.trim(),
      dni: parseInt(document.getElementById('prof-dni').value) || 0,
      telefono: parseInt(document.getElementById('prof-telefono').value) || 0,
      calle: document.getElementById('prof-calle').value.trim(),
      altura: parseInt(document.getElementById('prof-altura').value) || 0,
      piso: parseInt(document.getElementById('prof-piso').value) || 0,
      localidad: document.getElementById('prof-localidad').value.trim(),
      codigoPostal: parseInt(document.getElementById('prof-cp').value) || 0
    };

    const newDb = window.db.updateProfile('propietario', currentUser.details.id, updatedData);
    currentUser.details = newDb.propietarios.find(p => p.id === currentUser.details.id);
    logoutUserGreeting.innerText = `Hola, ${currentUser.details.nombre}`;
    
    toggleFieldsEditable(false);
    fillOwnerProfileFields();
    alert('Tus datos han sido actualizados con éxito.');
  });


  // ================= VISTAS DEL VETERINARIO =================

  // --- AGENDA DE TURNOS (VET) ---
  function renderVetAgenda() {
    const vetId = currentUser.details.id;
    const appts = window.db.getAppointmentsByVet(vetId);
    const container = document.getElementById('vet-appt-list-container');
    container.innerHTML = '';

    const pendingAppts = appts.filter(t => t.estado === 'Pendiente');

    if (pendingAppts.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${window.Icons.icon('calendar', 44)}</div>
          <p>No tenés consultas pendientes asignadas en tu agenda.</p>
        </div>
      `;
      return;
    }

    pendingAppts.forEach(appt => {
      const date = new Date(appt.fechaHora);
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthStr = months[date.getMonth()];
      const dayStr = date.getDate().toString().padStart(2, '0');
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}Hs`;

      const card = document.createElement('div');
      card.className = 'appointment-card';
      card.innerHTML = `
        <div class="appt-date-badge">
          <span class="appt-date-month">${monthStr}</span>
          <span class="appt-date-day">${dayStr}</span>
        </div>
        <div class="appt-details">
          <div class="appt-title">Paciente: ${appt.mascotaNombre} (${appt.mascotaEspecie})</div>
          <div class="appt-meta">${window.Icons.icon('user', 13)} Dueño/a: ${appt.propietarioNombre}</div>
          <div class="appt-meta">${window.Icons.icon('clock', 13)} Horario: ${timeStr}</div>
          <div class="appt-meta">${window.Icons.icon('fileText', 13)} Motivo: ${appt.motivo}</div>
        </div>
        <div class="appt-actions">
          <button class="btn-round-accent btn-attend-consult" data-id="${appt.id}" data-pet="${appt.mascotaNombre}" style="padding:8px 14px; font-size:13px; border-radius:12px; font-family:var(--font-body);">Atender</button>
        </div>
      `;
      container.appendChild(card);
    });

    // Listener para botón Atender
    container.querySelectorAll('.btn-attend-consult').forEach(btn => {
      btn.addEventListener('click', () => {
        const apptId = parseInt(btn.dataset.id);
        const petName = btn.dataset.pet;
        openConsultModal(apptId, petName);
      });
    });
  }


  // --- BUSCADOR DE PACIENTES (VET) ---
  const inputPatientSearch = document.getElementById('input-patient-search');
  
  function renderVetPatients() {
    const searchVal = inputPatientSearch.value.trim().toLowerCase();
    const pets = window.db.getAllPets();
    const container = document.getElementById('patient-list-container');
    container.innerHTML = '';

    // Filtrar mascotas
    const filteredPets = pets.filter(m => 
      m.nombre.toLowerCase().includes(searchVal) ||
      m.raza.toLowerCase().includes(searchVal) ||
      m.propietarioNombre.toLowerCase().includes(searchVal)
    );

    if (filteredPets.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>No se encontraron mascotas que coincidan con la búsqueda.</p></div>`;
      return;
    }

    filteredPets.forEach(pet => {
      const card = document.createElement('div');
      card.className = 'patient-card';
      card.innerHTML = `
        <div class="vet-avatar" style="width:44px; height:44px; margin-right:10px; flex-shrink:0;">${renderPetAvatar(pet, 20)}</div>
        <div class="patient-info" style="flex:1;">
          <h4>${pet.nombre}</h4>
          <p>${pet.especie} - ${pet.raza}</p>
          <span class="patient-owner-tag">Dueño: ${pet.propietarioNombre}</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
          <button class="btn-history-view btn-view-medical-history" data-id="${pet.id}">Ver Ficha</button>
          <div style="display:flex; gap:6px;">
            <button class="btn-card-action edit btn-edit-patient" data-id="${pet.id}" title="Editar Mascota">${window.Icons.icon('pencil', 14)}</button>
            <button class="btn-card-action delete btn-delete-patient" data-id="${pet.id}" title="Eliminar Mascota">${window.Icons.icon('x', 14)}</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Agregar listeners para el historial
    container.querySelectorAll('.btn-view-medical-history').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        openHistoryModal(id);
      });
    });

    // Agregar listeners para editar/eliminar mascota desde el buscador (veterinario)
    container.querySelectorAll('.btn-edit-patient').forEach(btn => {
      btn.addEventListener('click', () => openPetModal(parseInt(btn.dataset.id)));
    });
    container.querySelectorAll('.btn-delete-patient').forEach(btn => {
      btn.addEventListener('click', () => handleDeletePet(parseInt(btn.dataset.id), renderVetPatients));
    });
  }

  // Filtrado reactivo en la búsqueda de pacientes
  inputPatientSearch.addEventListener('input', renderVetPatients);


  // --- PERFIL VETERINARIO (EDITAR) ---
  const formProfileVet = document.getElementById('form-profile-vet');
  const btnToggleEditVet = document.getElementById('btn-toggle-edit-vet');
  const btnSaveVetProfile = document.getElementById('btn-save-vet-profile');
  let isEditingVet = false;

  function fillVetProfileFields() {
    const v = currentUser.details;
    document.getElementById('vet-profile-display-name').innerText = `Dr. ${v.nombre}`;
    document.getElementById('vet-profile-display-email').innerText = currentUser.email;
    document.getElementById('vet-avatar-display').innerHTML = renderProfileAvatar(v, 'stethoscope', 38);

    document.getElementById('vet-prof-nombre').value = v.nombre;
    document.getElementById('vet-prof-matricula').value = v.matricula;
    document.getElementById('vet-prof-especialidad').value = v.especialidad;
    document.getElementById('vet-prof-horario').value = v.horario;

    toggleVetFieldsEditable(false);
  }

  function toggleVetFieldsEditable(editable) {
    isEditingVet = editable;
    const inputs = formProfileVet.querySelectorAll('input');
    inputs.forEach(input => input.disabled = !editable);

    if (editable) {
      btnToggleEditVet.innerHTML = `${window.Icons.icon('x', 14)} Cancelar`;
      btnToggleEditVet.style.backgroundColor = '#8E8E8E';
      btnSaveVetProfile.style.display = 'block';
    } else {
      btnToggleEditVet.innerHTML = `${window.Icons.icon('pencil', 14)} Editar Datos`;
      btnToggleEditVet.style.backgroundColor = 'var(--primary-blue)';
      btnSaveVetProfile.style.display = 'none';
    }
  }

  btnToggleEditVet.addEventListener('click', () => {
    if (isEditingVet) {
      fillVetProfileFields();
    } else {
      toggleVetFieldsEditable(true);
    }
  });

  formProfileVet.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedData = {
      nombre: document.getElementById('vet-prof-nombre').value.trim(),
      matricula: parseInt(document.getElementById('vet-prof-matricula').value) || 0,
      especialidad: document.getElementById('vet-prof-especialidad').value.trim(),
      horario: document.getElementById('vet-prof-horario').value.trim()
    };

    const newDb = window.db.updateProfile('veterinario', currentUser.details.id, updatedData);
    currentUser.details = newDb.veterinarios.find(v => v.id === currentUser.details.id);
    
    toggleVetFieldsEditable(false);
    fillVetProfileFields();
    alert('Tu perfil profesional ha sido actualizado.');
  });


  // ================= EVENTOS Y LÓGICA DE MODALES =================

  // --- MODAL: AGREGAR / EDITAR MASCOTA ---
  const modalAddPet = document.getElementById('modal-add-pet');
  const btnActionAddPet = document.getElementById('btn-action-add-pet');
  const btnCloseModalPet = document.getElementById('btn-close-modal-pet');
  const btnCancelModalPet = document.getElementById('btn-cancel-modal-pet');
  const formAddPet = document.getElementById('form-add-pet');
  const petAvatarPreview = document.getElementById('pet-add-avatar-preview');
  const petAvatarTypeInput = document.getElementById('pet-add-avatar-type');
  const petAvatarValueInput = document.getElementById('pet-add-avatar-value');
  const petIconGrid = document.getElementById('pet-add-icon-grid');
  const petPhotoInput = document.getElementById('pet-add-photo-input');

  // Construir la grilla de íconos de especies una sola vez
  function buildPetIconGrid() {
    petIconGrid.innerHTML = window.Icons.PET_AVATAR_OPTIONS.map(opt => 
      `<button type="button" class="pet-icon-option" data-key="${opt.key}" title="${opt.label}">${window.Icons.icon(opt.key, 18)}</button>`
    ).join('');

    petIconGrid.querySelectorAll('.pet-icon-option').forEach(btn => {
      btn.addEventListener('click', () => {
        petAvatarTypeInput.value = 'icon';
        petAvatarValueInput.value = btn.dataset.key;
        petAvatarPreview.innerHTML = window.Icons.icon(btn.dataset.key, 30);
        petIconGrid.querySelectorAll('.pet-icon-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }
  buildPetIconGrid();

  document.getElementById('btn-pet-add-upload').addEventListener('click', () => petPhotoInput.click());
  petPhotoInput.addEventListener('change', () => {
    const file = petPhotoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      petAvatarTypeInput.value = 'photo';
      petAvatarValueInput.value = ev.target.result;
      petAvatarPreview.innerHTML = `<img src="${ev.target.result}" alt="Foto de la mascota">`;
      petIconGrid.querySelectorAll('.pet-icon-option').forEach(b => b.classList.remove('active'));
    };
    reader.readAsDataURL(file);
  });

  // Sincronizar el ícono sugerido cuando cambia la especie (solo si todavía no subió foto)
  document.getElementById('pet-add-especie').addEventListener('change', (e) => {
    if (petAvatarTypeInput.value === 'photo') return;
    const suggested = window.Icons.SPECIES_ICON_MAP[e.target.value] || 'paw';
    petAvatarTypeInput.value = 'icon';
    petAvatarValueInput.value = suggested;
    petAvatarPreview.innerHTML = window.Icons.icon(suggested, 30);
    petIconGrid.querySelectorAll('.pet-icon-option').forEach(b => b.classList.toggle('active', b.dataset.key === suggested));
  });

  // Abre el modal en modo "Agregar" (petId nulo) o "Editar" (con datos precargados)
  function openPetModal(petId = null) {
    formAddPet.reset();
    petIconGrid.querySelectorAll('.pet-icon-option').forEach(b => b.classList.remove('active'));

    if (petId) {
      const history = window.db.getPetMedicalHistory(petId);
      if (!history) return;
      const pet = history.pet;

      document.querySelector('#modal-add-pet .modal-title').innerText = 'Editar Mascota';
      document.getElementById('btn-submit-pet').innerText = 'Guardar Cambios';
      document.getElementById('pet-edit-id').value = pet.id;

      document.getElementById('pet-add-nombre').value = pet.nombre;
      document.getElementById('pet-add-especie').value = pet.especie;
      document.getElementById('pet-add-raza').value = pet.raza;
      document.getElementById('pet-add-edad').value = pet.edad;
      document.getElementById('pet-add-peso').value = pet.peso;
      document.getElementById('pet-add-color').value = pet.color;
      document.getElementById('pet-add-condicion').value = history.condiciones[0] || '';

      const avType = pet.avatarType || 'icon';
      const avValue = pet.avatarValue || window.Icons.SPECIES_ICON_MAP[pet.especie] || 'paw';
      petAvatarTypeInput.value = avType;
      petAvatarValueInput.value = avValue;
      if (avType === 'photo') {
        petAvatarPreview.innerHTML = `<img src="${avValue}" alt="Foto de la mascota">`;
      } else {
        petAvatarPreview.innerHTML = window.Icons.icon(avValue, 30);
        petIconGrid.querySelectorAll('.pet-icon-option').forEach(b => b.classList.toggle('active', b.dataset.key === avValue));
      }
    } else {
      document.querySelector('#modal-add-pet .modal-title').innerText = 'Agregar Mascota';
      document.getElementById('btn-submit-pet').innerText = 'Guardar Mascota';
      document.getElementById('pet-edit-id').value = '';
      petAvatarTypeInput.value = 'icon';
      petAvatarValueInput.value = 'paw';
      petAvatarPreview.innerHTML = window.Icons.icon('paw', 30);
    }

    modalAddPet.classList.add('active');
  }

  function closeAddPetModal() {
    modalAddPet.classList.remove('active');
  }

  btnActionAddPet.addEventListener('click', () => openPetModal());
  btnCloseModalPet.addEventListener('click', closeAddPetModal);
  btnCancelModalPet.addEventListener('click', closeAddPetModal);

  formAddPet.addEventListener('submit', (e) => {
    e.preventDefault();
    const petData = {
      nombre: document.getElementById('pet-add-nombre').value.trim(),
      especie: document.getElementById('pet-add-especie').value,
      raza: document.getElementById('pet-add-raza').value.trim(),
      edad: document.getElementById('pet-add-edad').value,
      peso: parseFloat(document.getElementById('pet-add-peso').value) || 0,
      color: document.getElementById('pet-add-color').value.trim(),
      condicionPrevia: document.getElementById('pet-add-condicion').value.trim(),
      avatarType: petAvatarTypeInput.value,
      avatarValue: petAvatarValueInput.value
    };

    const editId = document.getElementById('pet-edit-id').value;

    if (editId) {
      window.db.updatePet(parseInt(editId), petData);
      closeAddPetModal();
      // Refrescar la vista que corresponda según el rol actual
      if (currentUser.role === 'propietario') {
        renderMascotaView();
      } else {
        renderVetPatients();
      }
    } else {
      const newPet = window.db.addPet(currentUser.details.id, petData);
      currentPetId = newPet.id; // Enfocar la nueva mascota agregada
      closeAddPetModal();
      renderMascotaView();
    }
  });


  // --- MODAL: NUEVO / EDITAR TURNO ---
  const modalNewAppt = document.getElementById('modal-new-appt');
  const btnActionNewAppt = document.getElementById('btn-action-new-appt');
  const btnCloseModalAppt = document.getElementById('btn-close-modal-appt');
  const btnCancelModalAppt = document.getElementById('btn-cancel-modal-appt');
  const formNewAppt = document.getElementById('form-new-appt');
  const apptSelectMascota = document.getElementById('appt-select-mascota');
  const apptSelectVeterinario = document.getElementById('appt-select-veterinario');

  function openApptModal(editApptId = null) {
    formNewAppt.reset();
    
    // Cargar select de mascotas del dueño
    const pets = window.db.getPetsByOwner(currentUser.details.id);
    apptSelectMascota.innerHTML = pets.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');

    // Cargar select de veterinarios
    const vets = window.db.getVeterinarians();
    apptSelectVeterinario.innerHTML = vets.map(v => `<option value="${v.id}">Dr. ${v.nombre} - ${v.especialidad}</option>`).join('');

    // Si es para editar
    if (editApptId) {
      document.getElementById('modal-new-appt').querySelector('.modal-title').innerText = 'Reprogramar Turno';
      document.getElementById('btn-submit-appt').innerText = 'Actualizar Turno';
      
      const appt = window.db.getData().turnos.find(t => t.id === editApptId);
      if (appt) {
        document.getElementById('appt-edit-id').value = appt.id;
        apptSelectMascota.value = appt.mascotaId;
        apptSelectVeterinario.value = appt.veterinarioId;
        document.getElementById('appt-datetime').value = appt.fechaHora;
        document.getElementById('appt-motivo').value = appt.motivo;
      }
    } else {
      document.getElementById('modal-new-appt').querySelector('.modal-title').innerText = 'Nuevo Turno';
      document.getElementById('btn-submit-appt').innerText = 'Reservar Turno';
      document.getElementById('appt-edit-id').value = '';
    }

    modalNewAppt.classList.add('active');
  }

  function closeApptModal() {
    modalNewAppt.classList.remove('active');
  }

  btnActionNewAppt.addEventListener('click', () => openApptModal());
  btnCloseModalAppt.addEventListener('click', closeApptModal);
  btnCancelModalAppt.addEventListener('click', closeApptModal);

  formNewAppt.addEventListener('submit', (e) => {
    e.preventDefault();
    const apptId = document.getElementById('appt-edit-id').value;
    const apptData = {
      mascotaId: apptSelectMascota.value,
      veterinarioId: apptSelectVeterinario.value,
      fechaHora: document.getElementById('appt-datetime').value,
      motivo: document.getElementById('appt-motivo').value.trim()
    };

    if (apptId) {
      // Reprogramar
      window.db.updateAppointment(parseInt(apptId), apptData);
      alert('El turno ha sido reprogramado.');
    } else {
      // Crear
      window.db.bookAppointment(apptData);
      alert('El turno ha sido reservado con éxito.');
    }

    closeApptModal();
    renderOwnerAppointments();
  });


  // --- MODAL: ATENDER CONSULTA (VETERINARIO) ---
  const modalAttendConsult = document.getElementById('modal-attend-consult');
  const btnCloseModalConsult = document.getElementById('btn-close-modal-consult');
  const btnCancelModalConsult = document.getElementById('btn-cancel-modal-consult');
  const formAttendConsult = document.getElementById('form-attend-consult');
  const consultDisplayPet = document.getElementById('consult-display-pet');
  const consultSelectMed = document.getElementById('consult-select-med');

  function openConsultModal(apptId, petName) {
    formAttendConsult.reset();
    document.getElementById('consult-appt-id').value = apptId;
    consultDisplayPet.innerText = petName;

    // Cargar select de medicamentos
    const meds = window.db.getMedicaments();
    consultSelectMed.innerHTML = '<option value="">-- Sin prescripción --</option>' + 
      meds.map(m => `<option value="${m.id}">${m.nombre} (${m.tipo})</option>`).join('');

    modalAttendConsult.classList.add('active');
  }

  function closeConsultModal() {
    modalAttendConsult.classList.remove('active');
  }

  btnCloseModalConsult.addEventListener('click', closeConsultModal);
  btnCancelModalConsult.addEventListener('click', closeConsultModal);

  formAttendConsult.addEventListener('submit', (e) => {
    e.preventDefault();
    const apptId = parseInt(document.getElementById('consult-appt-id').value);
    const consultData = {
      diagnostico: document.getElementById('consult-diagnostico').value.trim(),
      tratamiento: document.getElementById('consult-tratamiento').value.trim(),
      medicamentoId: consultSelectMed.value,
      dosis: document.getElementById('consult-dosis').value.trim(),
      frecuencia: document.getElementById('consult-frecuencia').value.trim(),
      duracion: document.getElementById('consult-duracion').value.trim(),
      reaccionAdversa: document.getElementById('consult-reaccion').value.trim()
    };

    try {
      window.db.attendConsultation(apptId, consultData);
      alert('La consulta ha sido guardada en la ficha médica del paciente.');
      closeConsultModal();
      renderVetAgenda();
    } catch (error) {
      alert(error.message);
    }
  });


  // --- MODAL: VER HISTORIAL PACIENTE (VETERINARIO / BUSCADOR) ---
  const modalViewHistory = document.getElementById('modal-view-history');
  const btnCloseModalHistory = document.getElementById('btn-close-modal-history');
  const btnCloseHistoryFooter = document.getElementById('btn-close-history-footer');
  const historyModalContent = document.getElementById('history-modal-content');

  function openHistoryModal(petId) {
    const history = window.db.getPetMedicalHistory(petId);
    if (!history) return;

    const { pet, owner, condiciones, consultas } = history;

    // Construir contenido dinámico
    let html = `
      <!-- Datos Mascota -->
      <div class="data-card" style="background-color:#F5EFE6; margin-bottom:15px;">
        <h4 style="font-family:var(--font-body); color:var(--primary-blue); font-size:18px; display:flex; align-items:center; gap:8px;">${window.Icons.icon('paw', 18)} ${pet.nombre}</h4>
        <p style="font-size:13px; color:var(--text-muted);">${pet.especie} - ${pet.raza} (${pet.color})</p>
        <p style="font-size:13px; font-weight:600; margin-top:2px;">Nacido/a: ${pet.edad.split('-').reverse().join('/')} - Peso: ${pet.peso} Kg</p>
      </div>

      <!-- Datos Propietario -->
      <div class="data-card" style="margin-bottom:15px;">
        <h4 style="font-size:13px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:6px;">Dueño de la Mascota</h4>
        <p><strong>Nombre:</strong> ${owner.nombre}</p>
        <p><strong>DNI:</strong> ${owner.dni} | <strong>Tel:</strong> ${owner.telefono}</p>
        <p><strong>Dirección:</strong> ${owner.calle} ${owner.altura} ${owner.piso ? `piso ${owner.piso}` : ''}, ${owner.localidad} (CP ${owner.codigoPostal})</p>
      </div>

      <!-- Condiciones Previas -->
      <div class="data-card" style="margin-bottom:15px;">
        <h4 style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:6px;">Condiciones Médicas</h4>
        <div class="pill-list">
          ${condiciones.length > 0 
            ? condiciones.map(c => `<span class="pill-item" style="font-size:12px;">${c}</span>`).join('') 
            : '<span class="pill-item" style="font-size:12px; color:var(--text-muted); border-style:dashed;">Ninguna registrada</span>'
          }
        </div>
      </div>

      <!-- Consultas Anteriores -->
      <h4 style="font-family:var(--font-display); color:var(--accent-orange); margin-bottom:8px;">Consultas Registradas</h4>
      <div style="max-height: 250px; overflow-y: auto;">
        ${consultas.length > 0 
          ? consultas.map(c => `
              <div class="consultation-card" style="font-size:13px;">
                <div class="consultation-header">
                  <span>${window.Icons.icon('calendar', 13)} ${c.fechaHora.substring(0, 16)}</span>
                  <span>${window.Icons.icon('stethoscope', 13)} Dr. ${c.veterinarioNombre}</span>
                </div>
                <div class="consultation-reason" style="font-size:13px;">Motivo: ${c.motivo}</div>
                <p><strong>Diag:</strong> ${c.diagnostico}</p>
                <p style="margin-top:2px;"><strong>Trat:</strong> ${c.tratamiento}</p>
                ${c.prescripciones.length > 0 
                  ? `<div style="margin-top:6px; padding-top:4px; border-top:1px dashed var(--border-color);">
                      <strong>Receta:</strong> ${c.prescripciones.map(p => `${p.medicamentoNombre} (cada ${p.frecuencia} hs x ${p.duracion} días)`).join(', ')}
                     </div>`
                  : ''
                }
              </div>
            `).join('') 
          : '<p style="color:var(--text-muted); text-align:center; padding:10px 0;">No se registran consultas previas.</p>'
        }
      </div>
    `;

    historyModalContent.innerHTML = html;
    modalViewHistory.classList.add('active');
  }

  function closeHistoryModal() {
    modalViewHistory.classList.remove('active');
  }

  btnCloseModalHistory.addEventListener('click', closeHistoryModal);
  btnCloseHistoryFooter.addEventListener('click', closeHistoryModal);


  // ================= MODAL: EDITAR / ELIMINAR VETERINARIO =================
  const modalEditVet = document.getElementById('modal-edit-vet');
  const btnCloseModalEditVet = document.getElementById('btn-close-modal-edit-vet');
  const btnCancelModalEditVet = document.getElementById('btn-cancel-modal-edit-vet');
  const formEditVet = document.getElementById('form-edit-vet');
  const btnDeleteVet = document.getElementById('btn-delete-vet');

  function openEditVetModal(vetId) {
    const vet = window.db.getVeterinarians().find(v => v.id === vetId);
    if (!vet) return;

    document.getElementById('edit-vet-id').value = vet.id;
    document.getElementById('edit-vet-nombre').value = vet.nombre;
    document.getElementById('edit-vet-matricula').value = vet.matricula;
    document.getElementById('edit-vet-especialidad').value = vet.especialidad;
    document.getElementById('edit-vet-horario').value = vet.horario;

    modalEditVet.classList.add('active');
  }

  function closeEditVetModal() {
    modalEditVet.classList.remove('active');
  }

  btnCloseModalEditVet.addEventListener('click', closeEditVetModal);
  btnCancelModalEditVet.addEventListener('click', closeEditVetModal);

  formEditVet.addEventListener('submit', (e) => {
    e.preventDefault();
    const vetId = parseInt(document.getElementById('edit-vet-id').value);
    const updatedData = {
      nombre: document.getElementById('edit-vet-nombre').value.trim(),
      matricula: parseInt(document.getElementById('edit-vet-matricula').value) || 0,
      especialidad: document.getElementById('edit-vet-especialidad').value.trim(),
      horario: document.getElementById('edit-vet-horario').value.trim()
    };

    window.db.updateProfile('veterinario', vetId, updatedData);

    // Si el veterinario editado es el usuario logueado, sincronizar sus datos en memoria
    if (currentUser.role === 'veterinario' && currentUser.details.id === vetId) {
      currentUser.details = { ...currentUser.details, ...updatedData };
    }

    closeEditVetModal();
    renderOwnerVets();
    alert('Los datos del veterinario fueron actualizados.');
  });

  btnDeleteVet.addEventListener('click', () => {
    const vetId = parseInt(document.getElementById('edit-vet-id').value);
    handleDeleteVet(vetId);
    closeEditVetModal();
  });

  function handleDeleteVet(vetId) {
    if (currentUser.role === 'veterinario' && currentUser.details.id === vetId) {
      alert('No podés eliminar tu propio usuario de veterinario mientras estás conectado con él.');
      return;
    }
    if (confirm('¿Estás seguro de que deseas eliminar a este veterinario? Sus turnos pendientes serán cancelados.')) {
      window.db.deleteVeterinarian(vetId);
      renderOwnerVets();
    }
  }


  // ================= MODAL: SELECTOR DE AVATAR DE PERFIL =================
  const modalAvatarPicker = document.getElementById('modal-avatar-picker');
  const avatarPickerTitle = document.getElementById('avatar-picker-title');
  const avatarPickerPreview = document.getElementById('avatar-picker-preview');
  const avatarPickerIconGrid = document.getElementById('avatar-picker-icon-grid');
  const avatarPickerPhotoInput = document.getElementById('avatar-picker-photo-input');
  const btnAvatarPickerUpload = document.getElementById('btn-avatar-picker-upload');
  const btnCloseModalAvatar = document.getElementById('btn-close-modal-avatar');
  const btnConfirmAvatar = document.getElementById('btn-confirm-avatar');

  // Íconos disponibles como avatar de perfil para dueños y veterinarios
  const PROFILE_AVATAR_ICONS = ['user', 'stethoscope', 'dog', 'cat', 'paw'];

  let avatarPickerContext = null; // 'owner' | 'vet'
  let pendingAvatar = { type: 'icon', value: 'user' };

  function buildAvatarPickerGrid() {
    avatarPickerIconGrid.innerHTML = PROFILE_AVATAR_ICONS.map(key => 
      `<button type="button" class="pet-icon-option" data-key="${key}">${window.Icons.icon(key, 18)}</button>`
    ).join('');

    avatarPickerIconGrid.querySelectorAll('.pet-icon-option').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingAvatar = { type: 'icon', value: btn.dataset.key };
        avatarPickerPreview.innerHTML = window.Icons.icon(btn.dataset.key, 34);
        avatarPickerIconGrid.querySelectorAll('.pet-icon-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }
  buildAvatarPickerGrid();

  btnAvatarPickerUpload.addEventListener('click', () => avatarPickerPhotoInput.click());
  avatarPickerPhotoInput.addEventListener('change', () => {
    const file = avatarPickerPhotoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      pendingAvatar = { type: 'photo', value: ev.target.result };
      avatarPickerPreview.innerHTML = `<img src="${ev.target.result}" alt="Foto de perfil">`;
      avatarPickerIconGrid.querySelectorAll('.pet-icon-option').forEach(b => b.classList.remove('active'));
    };
    reader.readAsDataURL(file);
  });

  function openAvatarPicker(context) {
    avatarPickerContext = context;
    const person = currentUser.details;
    avatarPickerTitle.innerText = context === 'vet' ? 'Foto de Perfil Profesional' : 'Foto de Perfil';

    const currentType = person.avatarType || 'icon';
    const currentValue = person.avatarValue || (context === 'vet' ? 'stethoscope' : 'user');
    pendingAvatar = { type: currentType, value: currentValue };

    if (currentType === 'photo') {
      avatarPickerPreview.innerHTML = `<img src="${currentValue}" alt="Foto de perfil">`;
    } else {
      avatarPickerPreview.innerHTML = window.Icons.icon(currentValue, 34);
    }
    avatarPickerIconGrid.querySelectorAll('.pet-icon-option').forEach(b => b.classList.toggle('active', currentType === 'icon' && b.dataset.key === currentValue));

    modalAvatarPicker.classList.add('active');
  }

  function closeAvatarPicker() {
    modalAvatarPicker.classList.remove('active');
  }

  document.getElementById('btn-edit-owner-avatar').addEventListener('click', () => openAvatarPicker('owner'));
  document.getElementById('btn-edit-vet-avatar').addEventListener('click', () => openAvatarPicker('vet'));
  btnCloseModalAvatar.addEventListener('click', closeAvatarPicker);

  btnConfirmAvatar.addEventListener('click', () => {
    const role = avatarPickerContext === 'vet' ? 'veterinario' : 'propietario';
    const updated = window.db.updateProfile(role, currentUser.details.id, {
      avatarType: pendingAvatar.type,
      avatarValue: pendingAvatar.value
    });

    if (role === 'propietario') {
      currentUser.details = updated.propietarios.find(p => p.id === currentUser.details.id);
      fillOwnerProfileFields();
    } else {
      currentUser.details = updated.veterinarios.find(v => v.id === currentUser.details.id);
      fillVetProfileFields();
    }

    closeAvatarPicker();
  });


  // Cerrar modales si se hace clic fuera del contenedor (overlay)
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
    }
  });

});
