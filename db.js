// db.js - Módulo de Base de Datos para Tito's Veterinaria

class TitosDB {
  constructor() {
    this.key = 'titos_veterinaria_db';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.key)) {
      const defaultData = {
        propietarios: [
          {
            id: 1,
            nombre: 'Belén Fenoy',
            dni: 39123456,
            telefono: 1136851059,
            calle: 'Pio Diaz',
            altura: 862,
            piso: 1,
            localidad: 'Saenz Peña',
            codigoPostal: 1674
          },
          {
            id: 2,
            nombre: 'Stella González',
            dni: 21476362,
            telefono: 1141565644,
            calle: 'Uruguay',
            altura: 3276,
            piso: 0,
            localidad: 'Saenz Peña',
            codigoPostal: 1674
          },
          {
            id: 3,
            nombre: 'Candela Fenoy',
            dni: 43901464,
            telefono: 1138606090,
            calle: 'Uruguay',
            altura: 3276,
            piso: 0,
            localidad: 'Saenz Peña',
            codigoPostal: 1674
          }
        ],
        veterinarios: [
          {
            id: 1,
            nombre: 'Sergio Medina',
            matricula: 112233,
            especialidad: 'Dermatología',
            horario: '09:00 - 13:00'
          },
          {
            id: 2,
            nombre: 'Martina Lampone',
            matricula: 556677,
            especialidad: 'Medicina General',
            horario: '14:00 - 18:00'
          }
        ],
        mascotas: [
          {
            id: 1,
            nombre: 'Floki',
            especie: 'Perro',
            raza: 'Mestizo',
            edad: '2022-04-04',
            peso: 18,
            color: 'Gris',
            propietarioId: 1,
            avatarType: 'icon',
            avatarValue: 'dog'
          },
          {
            id: 2,
            nombre: 'Mora',
            especie: 'Perro',
            raza: 'Mestiza',
            edad: '2015-02-02',
            peso: 12,
            color: 'Negro y Fuego',
            propietarioId: 2,
            avatarType: 'icon',
            avatarValue: 'dog'
          },
          {
            id: 3,
            nombre: 'Dinamita',
            especie: 'Perro',
            raza: 'Pitbull',
            edad: '2025-11-12',
            peso: 22,
            color: 'Marrón',
            propietarioId: 3,
            avatarType: 'icon',
            avatarValue: 'dog'
          }
        ],
        condicionesprevias: [
          { id: 1, mascotaId: 1, condicion: 'Alergia al shampoo' },
          { id: 2, mascotaId: 2, condicion: 'Vómitos recurrentes' }
        ],
        consultas: [
          {
            id: 1,
            fechaHora: '2026-06-23 11:30:00',
            motivo: 'Picazón constante luego del baño',
            veterinarioId: 1,
            mascotaId: 1,
            diagnostico: 'Alergia al shampoo',
            tratamiento: 'Pastillas para la alergia y utilizar productos aptos al bañar'
          },
          {
            id: 2,
            fechaHora: '2026-06-26 17:45:00',
            motivo: 'Vómitos recurrentes',
            veterinarioId: 2,
            mascotaId: 2,
            diagnostico: 'Indefinido',
            tratamiento: 'Antiinflamatorio, dieta y control en 48hs'
          }
        ],
        medicamentos: [
          { id: 1, nombre: 'Loradatadina', tipo: 'Antihistamínico' },
          { id: 2, nombre: 'Meloxicam', tipo: 'Antiinflamatorio' }
        ],
        prescripciones: [
          {
            id: 1,
            dosis: 1,
            frecuencia: 8,
            duracion: 7,
            reaccionAdversa: null,
            consultaId: 2,
            medicamentoId: 2
          },
          {
            id: 2,
            dosis: 1,
            frecuencia: 12,
            duracion: 7,
            reaccionAdversa: null,
            consultaId: 1,
            medicamentoId: 1
          }
        ],
        turnos: [
          {
            id: 1,
            fechaHora: '2026-07-10T10:00',
            motivo: 'Control de alergia',
            veterinarioId: 1,
            mascotaId: 1,
            estado: 'Pendiente' // Pendiente, Completado, Cancelado
          },
          {
            id: 2,
            fechaHora: '2026-07-12T15:00',
            motivo: 'Control de vómitos',
            veterinarioId: 2,
            mascotaId: 2,
            estado: 'Pendiente'
          }
        ],
        usuarios: [
          {
            username: 'belen',
            email: 'belen@gmail.com',
            password: '123',
            role: 'propietario',
            propietarioId: 1,
            veterinarioId: null
          },
          {
            username: 'stella',
            email: 'stella@gmail.com',
            password: '123',
            role: 'propietario',
            propietarioId: 2,
            veterinarioId: null
          },
          {
            username: 'candela',
            email: 'candela@gmail.com',
            password: '123',
            role: 'propietario',
            propietarioId: 3,
            veterinarioId: null
          },
          {
            username: 'sergio',
            email: 'sergio@gmail.com',
            password: '123',
            role: 'veterinario',
            propietarioId: null,
            veterinarioId: 1
          },
          {
            username: 'martina',
            email: 'martina@gmail.com',
            password: '123',
            role: 'veterinario',
            propietarioId: null,
            veterinarioId: 2
          }
        ]
      };
      localStorage.setItem(this.key, JSON.stringify(defaultData));
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem(this.key));
  }

  saveData(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  // --- MÉTODOS DE USUARIOS / AUTENTICACIÓN ---
  login(usernameOrEmail, password, selectedRole) {
    const data = this.getData();
    const user = data.usuarios.find(
      u => (u.username.toLowerCase() === usernameOrEmail.toLowerCase() || u.email.toLowerCase() === usernameOrEmail.toLowerCase()) && 
           u.password === password && 
           u.role === selectedRole
    );
    if (!user) return null;
    
    // Obtener detalles del dueño o veterinario asociado
    let details = null;
    if (user.role === 'propietario') {
      details = data.propietarios.find(p => p.id === user.propietarioId);
    } else if (user.role === 'veterinario') {
      details = data.veterinarios.find(v => v.id === user.veterinarioId);
    }
    return { ...user, details };
  }

  register(username, email, password, role, additionalData) {
    const data = this.getData();
    
    if (data.usuarios.some(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('El usuario o correo electrónico ya existe.');
    }

    if (role === 'propietario') {
      const newOwnerId = data.propietarios.length ? Math.max(...data.propietarios.map(p => p.id)) + 1 : 1;
      const newOwner = {
        id: newOwnerId,
        nombre: additionalData.nombre || username,
        dni: additionalData.dni || 0,
        telefono: additionalData.telefono || 0,
        calle: additionalData.calle || '',
        altura: additionalData.altura || 0,
        piso: additionalData.piso || 0,
        localidad: additionalData.localidad || '',
        codigoPostal: additionalData.codigoPostal || 0,
        avatarType: null,
        avatarValue: null
      };

      const newUser = {
        username,
        email,
        password,
        role: 'propietario',
        propietarioId: newOwnerId,
        veterinarioId: null
      };

      data.propietarios.push(newOwner);
      data.usuarios.push(newUser);
      this.saveData(data);

      return { ...newUser, details: newOwner };
    } else if (role === 'veterinario') {
      const newVetId = data.veterinarios.length ? Math.max(...data.veterinarios.map(v => v.id)) + 1 : 1;
      const newVet = {
        id: newVetId,
        nombre: additionalData.nombre || username,
        matricula: parseInt(additionalData.matricula) || 0,
        especialidad: additionalData.especialidad || 'Medicina General',
        horario: additionalData.horario || '09:00 - 18:00',
        avatarType: null,
        avatarValue: null
      };

      const newUser = {
        username,
        email,
        password,
        role: 'veterinario',
        propietarioId: null,
        veterinarioId: newVetId
      };

      data.veterinarios.push(newVet);
      data.usuarios.push(newUser);
      this.saveData(data);

      return { ...newUser, details: newVet };
    } else {
      throw new Error('Rol de registro no válido.');
    }
  }

  updateProfile(role, id, updateData) {
    const data = this.getData();
    if (role === 'propietario') {
      const idx = data.propietarios.findIndex(p => p.id === id);
      if (idx !== -1) {
        data.propietarios[idx] = { ...data.propietarios[idx], ...updateData };
      }
    } else if (role === 'veterinario') {
      const idx = data.veterinarios.findIndex(v => v.id === id);
      if (idx !== -1) {
        data.veterinarios[idx] = { ...data.veterinarios[idx], ...updateData };
      }
    }
    this.saveData(data);
    return this.getData();
  }

  // --- MÉTODOS DE MASCOTAS ---
  getPetsByOwner(ownerId) {
    const data = this.getData();
    return data.mascotas.filter(m => m.propietarioId === ownerId);
  }

  getAllPets() {
    const data = this.getData();
    // Retornamos mascotas incluyendo el nombre del propietario para el buscador del veterinario
    return data.mascotas.map(m => {
      const prop = data.propietarios.find(p => p.id === m.propietarioId);
      return {
        ...m,
        propietarioNombre: prop ? prop.nombre : 'Desconocido'
      };
    });
  }

  addPet(ownerId, petData) {
    const data = this.getData();
    const newId = data.mascotas.length ? Math.max(...data.mascotas.map(m => m.id)) + 1 : 1;
    const newPet = {
      id: newId,
      nombre: petData.nombre,
      especie: petData.especie,
      raza: petData.raza,
      edad: petData.edad,
      peso: parseFloat(petData.peso) || 0,
      color: petData.color,
      propietarioId: ownerId,
      avatarType: petData.avatarType || 'icon',
      avatarValue: petData.avatarValue || 'paw'
    };
    data.mascotas.push(newPet);
    
    if (petData.condicionPrevia) {
      const newCondId = data.condicionesprevias.length ? Math.max(...data.condicionesprevias.map(c => c.id)) + 1 : 1;
      data.condicionesprevias.push({
        id: newCondId,
        mascotaId: newId,
        condicion: petData.condicionPrevia
      });
    }

    this.saveData(data);
    return newPet;
  }

  // Actualizar los datos de una mascota existente (dueño o veterinario)
  updatePet(petId, petData) {
    const data = this.getData();
    const idx = data.mascotas.findIndex(m => m.id === petId);
    if (idx === -1) throw new Error('Mascota no encontrada.');

    data.mascotas[idx] = {
      ...data.mascotas[idx],
      nombre: petData.nombre,
      especie: petData.especie,
      raza: petData.raza,
      edad: petData.edad,
      peso: parseFloat(petData.peso) || 0,
      color: petData.color,
      avatarType: petData.avatarType || data.mascotas[idx].avatarType || 'icon',
      avatarValue: petData.avatarValue || data.mascotas[idx].avatarValue || 'paw'
    };

    // Actualizar/crear la condición previa (se maneja como única condición editable rápida)
    if (petData.condicionPrevia) {
      const existingIdx = data.condicionesprevias.findIndex(c => c.mascotaId === petId);
      if (existingIdx !== -1) {
        data.condicionesprevias[existingIdx].condicion = petData.condicionPrevia;
      } else {
        const newCondId = data.condicionesprevias.length ? Math.max(...data.condicionesprevias.map(c => c.id)) + 1 : 1;
        data.condicionesprevias.push({ id: newCondId, mascotaId: petId, condicion: petData.condicionPrevia });
      }
    }

    this.saveData(data);
    return data.mascotas[idx];
  }

  // Eliminar una mascota y todos sus datos asociados (turnos, consultas, prescripciones, condiciones)
  deletePet(petId) {
    const data = this.getData();
    const petExists = data.mascotas.some(m => m.id === petId);
    if (!petExists) throw new Error('Mascota no encontrada.');

    data.mascotas = data.mascotas.filter(m => m.id !== petId);
    data.condicionesprevias = data.condicionesprevias.filter(c => c.mascotaId !== petId);
    data.turnos = data.turnos.filter(t => t.mascotaId !== petId);

    const consultaIdsToRemove = data.consultas.filter(c => c.mascotaId === petId).map(c => c.id);
    data.prescripciones = data.prescripciones.filter(p => !consultaIdsToRemove.includes(p.consultaId));
    data.consultas = data.consultas.filter(c => c.mascotaId !== petId);

    this.saveData(data);
    return true;
  }

  getPetMedicalHistory(petId) {
    const data = this.getData();
    const pet = data.mascotas.find(m => m.id === petId);
    if (!pet) return null;

    const owner = data.propietarios.find(p => p.id === pet.propietarioId);
    const condiciones = data.condicionesprevias.filter(c => c.mascotaId === petId).map(c => c.condicion);
    
    // Obtener consultas
    const consultas = data.consultas.filter(c => c.mascotaId === petId).map(c => {
      const vet = data.veterinarios.find(v => v.id === c.veterinarioId);
      // Obtener prescripciones asociadas
      const prescripciones = data.prescripciones.filter(p => p.consultaId === c.id).map(p => {
        const med = data.medicamentos.find(m => m.id === p.medicamentoId);
        return {
          ...p,
          medicamentoNombre: med ? med.nombre : 'Medicamento Desconocido',
          medicamentoTipo: med ? med.tipo : ''
        };
      });

      return {
        ...c,
        veterinarioNombre: vet ? vet.nombre : 'Veterinario Desconocido',
        prescripciones
      };
    });

    return {
      pet,
      owner,
      condiciones,
      consultas
    };
  }

  // --- MÉTODOS DE TURNOS ---
  getAppointmentsByOwner(ownerId) {
    const data = this.getData();
    const pets = data.mascotas.filter(m => m.propietarioId === ownerId).map(m => m.id);
    return data.turnos.filter(t => pets.includes(t.mascotaId)).map(t => {
      const pet = data.mascotas.find(m => m.id === t.mascotaId);
      const vet = data.veterinarios.find(v => v.id === t.veterinarioId);
      return {
        ...t,
        mascotaNombre: pet ? pet.nombre : 'Mascota',
        veterinarioNombre: vet ? vet.nombre : 'Veterinario'
      };
    }).sort((a,b) => new Date(a.fechaHora) - new Date(b.fechaHora));
  }

  getAppointmentsByVet(vetId) {
    const data = this.getData();
    return data.turnos.filter(t => t.veterinarioId === vetId).map(t => {
      const pet = data.mascotas.find(m => m.id === t.mascotaId);
      const owner = pet ? data.propietarios.find(p => p.id === pet.propietarioId) : null;
      return {
        ...t,
        mascotaNombre: pet ? pet.nombre : 'Mascota',
        mascotaEspecie: pet ? pet.especie : '',
        mascotaRaza: pet ? pet.raza : '',
        propietarioNombre: owner ? owner.nombre : 'Dueño'
      };
    }).sort((a,b) => new Date(a.fechaHora) - new Date(b.fechaHora));
  }

  bookAppointment(appointmentData) {
    const data = this.getData();
    const newId = data.turnos.length ? Math.max(...data.turnos.map(t => t.id)) + 1 : 1;
    const newAppt = {
      id: newId,
      fechaHora: appointmentData.fechaHora,
      motivo: appointmentData.motivo,
      veterinarioId: parseInt(appointmentData.veterinarioId),
      mascotaId: parseInt(appointmentData.mascotaId),
      estado: 'Pendiente'
    };
    data.turnos.push(newAppt);
    this.saveData(data);
    return newAppt;
  }

  updateAppointment(appointmentId, updatedData) {
    const data = this.getData();
    const idx = data.turnos.findIndex(t => t.id === appointmentId);
    if (idx !== -1) {
      data.turnos[idx] = { ...data.turnos[idx], ...updatedData };
      this.saveData(data);
      return data.turnos[idx];
    }
    return null;
  }

  cancelAppointment(appointmentId) {
    return this.updateAppointment(appointmentId, { estado: 'Cancelado' });
  }

  // --- MÉTODOS DE VETERINARIOS Y MEDICAMENTOS ---
  getVeterinarians() {
    return this.getData().veterinarios;
  }

  getMedicaments() {
    return this.getData().medicamentos;
  }

  // Eliminar un veterinario. Cancela sus turnos pendientes y desvincula al usuario asociado.
  deleteVeterinarian(vetId) {
    const data = this.getData();
    const vetExists = data.veterinarios.some(v => v.id === vetId);
    if (!vetExists) throw new Error('Veterinario no encontrado.');

    data.veterinarios = data.veterinarios.filter(v => v.id !== vetId);

    // Cancelar los turnos pendientes asignados a este veterinario
    data.turnos = data.turnos.map(t => {
      if (t.veterinarioId === vetId && t.estado === 'Pendiente') {
        return { ...t, estado: 'Cancelado' };
      }
      return t;
    });

    // El usuario de login queda sin veterinario asociado (no puede volver a iniciar sesión con ese rol)
    data.usuarios = data.usuarios.filter(u => u.veterinarioId !== vetId);

    this.saveData(data);
    return true;
  }

  // --- REGISTRAR CONSULTA (VETERINARIO) ---
  attendConsultation(appointmentId, consultationData) {
    const data = this.getData();
    
    // 1. Obtener datos del turno
    const appt = data.turnos.find(t => t.id === appointmentId);
    if (!appt) throw new Error('Turno no encontrado');

    // 2. Crear nueva consulta
    const newConsultId = data.consultas.length ? Math.max(...data.consultas.map(c => c.id)) + 1 : 1;
    const newConsult = {
      id: newConsultId,
      fechaHora: new Date().toISOString().replace('T', ' ').substring(0, 19),
      motivo: appt.motivo,
      veterinarioId: appt.veterinarioId,
      mascotaId: appt.mascotaId,
      diagnostico: consultationData.diagnostico,
      tratamiento: consultationData.tratamiento
    };
    data.consultas.push(newConsult);

    // 3. Crear prescripción si hay medicamentos indicados
    if (consultationData.medicamentoId && consultationData.dosis) {
      const newPrescId = data.prescripciones.length ? Math.max(...data.prescripciones.map(p => p.id)) + 1 : 1;
      data.prescripciones.push({
        id: newPrescId,
        dosis: parseInt(consultationData.dosis) || 1,
        frecuencia: parseInt(consultationData.frecuencia) || 12,
        duracion: parseInt(consultationData.duracion) || 7,
        reaccionAdversa: consultationData.reaccionAdversa || null,
        consultaId: newConsultId,
        medicamentoId: parseInt(consultationData.medicamentoId)
      });
    }

    // 4. Actualizar el estado del turno
    appt.estado = 'Completado';
    
    this.saveData(data);
    return newConsult;
  }
}

// Inicializar la base de datos y exponerla de forma global
window.db = new TitosDB();
