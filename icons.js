// icons.js - Librería de íconos SVG minimalistas (línea, estilo outline) para Tito's
// Reemplaza el uso de emojis en toda la aplicación por un set de íconos consistente.

const ICON_PATHS = {
  // --- Interfaz general ---
  eye: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c7 0 11 7 11 7a17.6 17.6 0 0 1-3.2 4"/><path d="M6.6 6.6C3.6 8.5 2 12 2 12s4 7 11 7c1.4 0 2.7-.3 3.9-.7"/><path d="M9.5 9.6a3 3 0 0 0 4.2 4.2"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  x: '<path d="M18 6 6 18"/><path d="M6 6l12 12"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  camera: '<path d="M4 8a2 2 0 0 1 2-2h1.2a1 1 0 0 0 .9-.55l.6-1.2A1 1 0 0 1 9.6 3.5h4.8a1 1 0 0 1 .9.55l.6 1.2a1 1 0 0 0 .9.55H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="3.5"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.3 2.3 4.7-5.1"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4"/><path d="M12 17h.01"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16.5 16 11l-8.5 8.5"/>',

  // --- Navegación / secciones ---
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M3 10h18"/>',
  calendarPlus: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M3 10h18"/><path d="M12 14v5"/><path d="M9.5 16.5h5"/>',
  stethoscope: '<path d="M6 4v6a4 4 0 0 0 8 0V4"/><path d="M6 4H4.5"/><path d="M14 4h1.5"/><circle cx="19" cy="15" r="2.2"/><path d="M14 10.5v2a5 5 0 0 1-10 0"/>',
  phone: '<path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1.2 1.2 0 0 1 1.2-.3 9.8 9.8 0 0 0 3.1.5 1.2 1.2 0 0 1 1.2 1.2V20a1.2 1.2 0 0 1-1.2 1.2A17.2 17.2 0 0 1 2.8 3.2 1.2 1.2 0 0 1 4 2h3.4a1.2 1.2 0 0 1 1.2 1.2c0 1.1.2 2.1.5 3.1a1.2 1.2 0 0 1-.3 1.2Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.9 3.6-7 8-7s8 3.1 8 7"/>',
  paw: '<circle cx="6.5" cy="10" r="2"/><circle cx="17.5" cy="10" r="2"/><circle cx="9.5" cy="5.5" r="1.8"/><circle cx="14.5" cy="5.5" r="1.8"/><path d="M12 12.5c-3 0-5.5 2.1-5.5 4.6 0 1.7 1.4 2.9 3.1 2.9.9 0 1.5-.3 2.4-.3s1.5.3 2.4.3c1.7 0 3.1-1.2 3.1-2.9 0-2.5-2.5-4.6-5.5-4.6Z"/>',

  // --- Contacto ---
  mapPin: '<path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  message: '<path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 9 9 0 0 1-3.4-.7L4 21l1.4-4.2A8.3 8.3 0 0 1 3.5 11 8.4 8.4 0 0 1 12 3a8.6 8.6 0 0 1 9 8.5Z"/>',
  atSign: '<circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.6 7.2"/>',

  // --- Especies de mascotas ---
  dog: '<path d="M5 10c0-2.5 1.7-5.5 4-5.5.9 0 1.4.7 1.6 1.3.3-.5 1-1 1.9-1 2.3 0 4 3 4 5.5v3c0 3.3-2.7 6-6 6h-.9c-2.6 0-4.6-2.1-4.6-4.6Z"/><path d="M8.2 13.2h.01"/><path d="M13.8 13.2h.01"/><path d="M10 16.3c.6.5 1.4.5 2 0"/>',
  cat: '<path d="M6 9 4.5 4.5 8 6.5"/><path d="M18 9l1.5-4.5L16 6.5"/><path d="M6 9h12v3.5c0 3.6-2.7 6.5-6 6.5s-6-2.9-6-6.5Z"/><path d="M10 13.2h.01"/><path d="M14 13.2h.01"/><path d="M11 15.8h2"/>',
  rabbit: '<path d="M9 10.5c-1-2-1.6-6-.2-7.6C10 1.5 10.8 3.8 10.4 7"/><path d="M15 10.5c1-2 1.6-6 .2-7.6C14 1.5 13.2 3.8 13.6 7"/><path d="M6.5 14A5.5 5.5 0 0 1 12 8.5 5.5 5.5 0 0 1 17.5 14c0 3.6-2.5 6.5-5.5 6.5s-5.5-2.9-5.5-6.5Z"/><path d="M10 13.7h.01"/><path d="M14 13.7h.01"/><path d="M11 16.3h2"/>',
  bird: '<path d="M9 15c-3.3 0-6-2.5-6-6 0-1.7.9-3 2.3-3.8C6.1 3.9 7.9 3 9.8 3 13 3 15.5 5.5 16 8.5c2 .3 4 1.7 4 3.7 0 2-1.8 3.3-3.8 3.3H15" /><circle cx="8.3" cy="7.5" r=".6" fill="currentColor" stroke="none"/><path d="M9 15c0 2.5 1.6 4.5 4 5.5"/><path d="M5.5 15.5 3 19"/>',
  turtle: '<path d="M7.5 10a4.5 4 0 0 1 9 0v2.5a4.5 4 0 0 1-9 0Z"/><path d="M4.5 9.5c1-1 2-1 3 0"/><path d="M16.5 9.5c1-1 2-1 3 0"/><path d="M9 15.5c-.5 1.3-1.5 2-3 2"/><path d="M15 15.5c.5 1.3 1.5 2 3 2"/><path d="M11.3 6.2h1.4"/>',
  fish: '<path d="M3 12c3-4 8-6 12-4 2 1 4 2.5 6 4-2 1.5-4 3-6 4-4 2-9 0-12-4Z"/><path d="M17 9.5 21 8v8l-4-1.5"/><circle cx="8" cy="11" r=".6" fill="currentColor" stroke="none"/>',

  // --- Fichas médicas ---
  pill: '<rect x="3.5" y="9.5" width="17" height="6.5" rx="3.25" transform="rotate(-35 12 12.7)"/><path d="M9 15.7 14.5 8.3"/>',
  fileText: '<path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v4h4"/><path d="M9 12h6"/><path d="M9 15.5h6"/><path d="M9 8.5h2"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><rect x="8.5" y="2.5" width="7" height="3.5" rx="1"/><path d="M9 12h6"/><path d="M9 16h6"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7"/><path d="M6 7l1 13a2 2 0 0 0 2 1.9h6a2 2 0 0 0 2-1.9L18 7"/><path d="M10 11.5v6"/><path d="M14 11.5v6"/>',
};

/**
 * Devuelve el markup SVG de un ícono.
 * @param {string} name - Nombre del ícono (clave de ICON_PATHS)
 * @param {number} size - Tamaño en px (ancho y alto)
 * @param {string} extraClass - Clases CSS adicionales
 */
function icon(name, size = 20, extraClass = '') {
  const paths = ICON_PATHS[name];
  if (!paths) return '';
  return `<svg class="icon ${extraClass}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

// Mapa de especie -> ícono para avatares de mascotas
const SPECIES_ICON_MAP = {
  'Perro': 'dog',
  'Gato': 'cat',
  'Roedor': 'rabbit',
  'Ave': 'bird',
  'Reptil': 'turtle',
  'Pez': 'fish',
  'Otro': 'paw'
};

// Lista para el selector visual de avatar (icono) en el formulario de mascotas
const PET_AVATAR_OPTIONS = [
  { key: 'dog', label: 'Perro' },
  { key: 'cat', label: 'Gato' },
  { key: 'rabbit', label: 'Roedor / Conejo' },
  { key: 'bird', label: 'Ave' },
  { key: 'turtle', label: 'Reptil' },
  { key: 'fish', label: 'Pez' },
  { key: 'paw', label: 'Genérico' }
];

// Al cargar la página, sustituye cualquier elemento con [data-icon] por su SVG correspondiente.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.getAttribute('data-icon');
    const size = parseInt(el.getAttribute('data-icon-size')) || 20;
    el.innerHTML = icon(name, size);
  });
});

window.Icons = { icon, ICON_PATHS, SPECIES_ICON_MAP, PET_AVATAR_OPTIONS };
