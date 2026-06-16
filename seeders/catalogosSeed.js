import { Pais, Ciudad, Rubro, Estados } from "../modelos/relations.js";

const ESTADOS = [
  { nombre: "Lead" },
  { nombre: "Contactado" },
  { nombre: "Levantamiento" },
  { nombre: "Estimacion" },
  { nombre: "Propuesta" },
  { nombre: "En Aprobacion" },
  { nombre: "Aprobado" },
  { nombre: "Rechazado" },
  { nombre: "En Ejecución" },
  { nombre: "Cerrado" },
  { nombre: "Stand BY" },
  { nombre: "Facturada" },
  { nombre: "Activo" },
  { nombre: "Inactivo" },
  { nombre: "Pendiente" },
];
const PAISES = [
  // ── América del Sur ──────────────────────────────────────
  { id: 1,  nombre: "Argentina",              codigo_iso: "ARG" },
  { id: 2,  nombre: "Bolivia",               codigo_iso: "BOL" },
  { id: 3,  nombre: "Brasil",                codigo_iso: "BRA" },
  { id: 4,  nombre: "Chile",                 codigo_iso: "CHL" },
  { id: 5,  nombre: "Colombia",              codigo_iso: "COL" },
  { id: 6,  nombre: "Ecuador",               codigo_iso: "ECU" },
  { id: 7,  nombre: "Paraguay",              codigo_iso: "PRY" },
  { id: 8,  nombre: "Perú",                  codigo_iso: "PER" },
  { id: 9,  nombre: "Uruguay",               codigo_iso: "URY" },
  { id: 10, nombre: "Venezuela",             codigo_iso: "VEN" },
  { id: 11, nombre: "Guyana",                codigo_iso: "GUY" },
  { id: 12, nombre: "Surinam",               codigo_iso: "SUR" },
  { id: 13, nombre: "Guayana Francesa",      codigo_iso: "GUF" },

  // ── América Central ──────────────────────────────────────
  { id: 14, nombre: "Costa Rica",            codigo_iso: "CRI" },
  { id: 15, nombre: "Cuba",                  codigo_iso: "CUB" },
  { id: 16, nombre: "El Salvador",           codigo_iso: "SLV" },
  { id: 17, nombre: "Guatemala",             codigo_iso: "GTM" },
  { id: 18, nombre: "Honduras",              codigo_iso: "HND" },
  { id: 19, nombre: "México",                codigo_iso: "MEX" },
  { id: 20, nombre: "Nicaragua",             codigo_iso: "NIC" },
  { id: 21, nombre: "Panamá",               codigo_iso: "PAN" },
  { id: 22, nombre: "Belice",               codigo_iso: "BLZ" },

  // ── Caribe ───────────────────────────────────────────────
  { id: 23, nombre: "República Dominicana",  codigo_iso: "DOM" },
  { id: 24, nombre: "Puerto Rico",           codigo_iso: "PRI" },
  { id: 25, nombre: "Jamaica",               codigo_iso: "JAM" },
  { id: 26, nombre: "Haití",                 codigo_iso: "HTI" },
  { id: 27, nombre: "Trinidad y Tobago",     codigo_iso: "TTO" },
  { id: 28, nombre: "Bahamas",               codigo_iso: "BHS" },
  { id: 29, nombre: "Barbados",              codigo_iso: "BRB" },
  { id: 30, nombre: "Curazao",               codigo_iso: "CUW" },
  { id: 31, nombre: "Aruba",                 codigo_iso: "ABW" },

  // ── América del Norte ────────────────────────────────────
  { id: 32, nombre: "Estados Unidos",        codigo_iso: "USA" },
  { id: 33, nombre: "Canadá",               codigo_iso: "CAN" },

  // ── Europa Occidental ────────────────────────────────────
  { id: 34, nombre: "España",               codigo_iso: "ESP" },
  { id: 35, nombre: "Portugal",             codigo_iso: "PRT" },
  { id: 36, nombre: "Francia",              codigo_iso: "FRA" },
  { id: 37, nombre: "Alemania",             codigo_iso: "DEU" },
  { id: 38, nombre: "Reino Unido",          codigo_iso: "GBR" },
  { id: 39, nombre: "Italia",               codigo_iso: "ITA" },
  { id: 40, nombre: "Países Bajos",         codigo_iso: "NLD" },
  { id: 41, nombre: "Suiza",                codigo_iso: "CHE" },
  { id: 42, nombre: "Bélgica",             codigo_iso: "BEL" },
  { id: 43, nombre: "Austria",              codigo_iso: "AUT" },
  { id: 44, nombre: "Suecia",               codigo_iso: "SWE" },
  { id: 45, nombre: "Noruega",              codigo_iso: "NOR" },
  { id: 46, nombre: "Dinamarca",            codigo_iso: "DNK" },
  { id: 47, nombre: "Finlandia",            codigo_iso: "FIN" },
  { id: 48, nombre: "Irlanda",              codigo_iso: "IRL" },
  { id: 49, nombre: "Luxemburgo",           codigo_iso: "LUX" },

  // ── Europa del Este y Central ────────────────────────────
  { id: 50, nombre: "Polonia",              codigo_iso: "POL" },
  { id: 51, nombre: "República Checa",      codigo_iso: "CZE" },
  { id: 52, nombre: "Hungría",              codigo_iso: "HUN" },
  { id: 53, nombre: "Rumania",              codigo_iso: "ROU" },
  { id: 54, nombre: "Bulgaria",             codigo_iso: "BGR" },
  { id: 55, nombre: "Croacia",              codigo_iso: "HRV" },
  { id: 56, nombre: "Serbia",               codigo_iso: "SRB" },
  { id: 57, nombre: "Ucrania",              codigo_iso: "UKR" },
  { id: 58, nombre: "Grecia",               codigo_iso: "GRC" },
  { id: 59, nombre: "Eslovaquia",           codigo_iso: "SVK" },
  { id: 60, nombre: "Eslovenia",            codigo_iso: "SVN" },
  { id: 61, nombre: "Estonia",              codigo_iso: "EST" },
  { id: 62, nombre: "Letonia",              codigo_iso: "LVA" },
  { id: 63, nombre: "Lituania",             codigo_iso: "LTU" },

  // ── Europa del Sur ───────────────────────────────────────
  { id: 64, nombre: "Turquía",              codigo_iso: "TUR" },

  // ── Rusia / CEI ──────────────────────────────────────────
  { id: 65, nombre: "Rusia",                codigo_iso: "RUS" },

  // ── Asia Oriental ────────────────────────────────────────
  { id: 66, nombre: "China",                codigo_iso: "CHN" },
  { id: 67, nombre: "Japón",               codigo_iso: "JPN" },
  { id: 68, nombre: "Corea del Sur",        codigo_iso: "KOR" },
  { id: 69, nombre: "Taiwán",               codigo_iso: "TWN" },
  { id: 70, nombre: "Hong Kong",            codigo_iso: "HKG" },

  // ── Asia del Sudeste ─────────────────────────────────────
  { id: 71, nombre: "Singapur",             codigo_iso: "SGP" },
  { id: 72, nombre: "Indonesia",            codigo_iso: "IDN" },
  { id: 73, nombre: "Malasia",              codigo_iso: "MYS" },
  { id: 74, nombre: "Filipinas",            codigo_iso: "PHL" },
  { id: 75, nombre: "Vietnam",              codigo_iso: "VNM" },
  { id: 76, nombre: "Tailandia",            codigo_iso: "THA" },
  { id: 77, nombre: "Myanmar",              codigo_iso: "MMR" },
  { id: 78, nombre: "Cambodia",             codigo_iso: "KHM" },

  // ── Asia del Sur ─────────────────────────────────────────
  { id: 79, nombre: "India",                codigo_iso: "IND" },
  { id: 80, nombre: "Pakistán",            codigo_iso: "PAK" },
  { id: 81, nombre: "Bangladesh",           codigo_iso: "BGD" },
  { id: 82, nombre: "Sri Lanka",            codigo_iso: "LKA" },
  { id: 83, nombre: "Nepal",                codigo_iso: "NPL" },

  // ── Oriente Medio ────────────────────────────────────────
  { id: 84, nombre: "Emiratos Árabes Unidos", codigo_iso: "ARE" },
  { id: 85, nombre: "Arabia Saudita",       codigo_iso: "SAU" },
  { id: 86, nombre: "Qatar",                codigo_iso: "QAT" },
  { id: 87, nombre: "Kuwait",               codigo_iso: "KWT" },
  { id: 88, nombre: "Israel",               codigo_iso: "ISR" },
  { id: 89, nombre: "Jordania",             codigo_iso: "JOR" },
  { id: 90, nombre: "Líbano",              codigo_iso: "LBN" },
  { id: 91, nombre: "Egipto",               codigo_iso: "EGY" },
  { id: 92, nombre: "Irak",                 codigo_iso: "IRQ" },
  { id: 93, nombre: "Irán",                codigo_iso: "IRN" },
  { id: 94, nombre: "Omán",                codigo_iso: "OMN" },
  { id: 95, nombre: "Baréin",              codigo_iso: "BHR" },

  // ── África del Norte ─────────────────────────────────────
  { id: 96, nombre: "Marruecos",            codigo_iso: "MAR" },
  { id: 97, nombre: "Argelia",              codigo_iso: "DZA" },
  { id: 98, nombre: "Túnez",               codigo_iso: "TUN" },
  { id: 99, nombre: "Libia",               codigo_iso: "LBY" },

  // ── África Subsahariana ──────────────────────────────────
  { id: 100, nombre: "Nigeria",             codigo_iso: "NGA" },
  { id: 101, nombre: "Sudáfrica",          codigo_iso: "ZAF" },
  { id: 102, nombre: "Kenia",               codigo_iso: "KEN" },
  { id: 103, nombre: "Ghana",               codigo_iso: "GHA" },
  { id: 104, nombre: "Etiopía",            codigo_iso: "ETH" },
  { id: 105, nombre: "Tanzania",            codigo_iso: "TZA" },
  { id: 106, nombre: "Uganda",              codigo_iso: "UGA" },
  { id: 107, nombre: "Costa de Marfil",    codigo_iso: "CIV" },
  { id: 108, nombre: "Senegal",             codigo_iso: "SEN" },
  { id: 109, nombre: "Camerún",            codigo_iso: "CMR" },
  { id: 110, nombre: "Angola",              codigo_iso: "AGO" },
  { id: 111, nombre: "Mozambique",          codigo_iso: "MOZ" },
  { id: 112, nombre: "Zambia",              codigo_iso: "ZMB" },
  { id: 113, nombre: "Zimbabue",            codigo_iso: "ZWE" },
  { id: 114, nombre: "República Democrática del Congo", codigo_iso: "COD" },
  { id: 115, nombre: "Madagascar",          codigo_iso: "MDG" },

  // ── Oceanía ──────────────────────────────────────────────
  { id: 116, nombre: "Australia",           codigo_iso: "AUS" },
  { id: 117, nombre: "Nueva Zelanda",       codigo_iso: "NZL" },
  { id: 118, nombre: "Papúa Nueva Guinea", codigo_iso: "PNG" },
  { id: 119, nombre: "Fiji",                codigo_iso: "FJI" },

  // ── Asia Central ─────────────────────────────────────────
  { id: 120, nombre: "Kazajistán",          codigo_iso: "KAZ" },
  { id: 121, nombre: "Uzbekistán",          codigo_iso: "UZB" },

  // ── Otro ─────────────────────────────────────────────────
  { id: 122, nombre: "Otro",                codigo_iso: "OTR" },
];

const CIUDADES = [
  // ── Argentina (1) ─────────────────────────────────────────
  { id: 1,   pais_id: 1,  nombre: "Buenos Aires" },
  { id: 2,   pais_id: 1,  nombre: "Córdoba" },
  { id: 3,   pais_id: 1,  nombre: "Rosario" },
  { id: 4,   pais_id: 1,  nombre: "Mendoza" },
  { id: 5,   pais_id: 1,  nombre: "La Plata" },
  { id: 6,   pais_id: 1,  nombre: "San Miguel de Tucumán" },
  { id: 7,   pais_id: 1,  nombre: "Mar del Plata" },
  { id: 8,   pais_id: 1,  nombre: "Salta" },
  { id: 9,   pais_id: 1,  nombre: "Santa Fe" },
  { id: 10,  pais_id: 1,  nombre: "San Juan" },
  { id: 11,  pais_id: 1,  nombre: "Resistencia" },
  { id: 12,  pais_id: 1,  nombre: "Santiago del Estero" },
  { id: 13,  pais_id: 1,  nombre: "Corrientes" },
  { id: 14,  pais_id: 1,  nombre: "Neuquén" },
  { id: 15,  pais_id: 1,  nombre: "Posadas" },
  { id: 16,  pais_id: 1,  nombre: "Bahía Blanca" },
  { id: 17,  pais_id: 1,  nombre: "San Luis" },
  { id: 18,  pais_id: 1,  nombre: "Río Cuarto" },
  { id: 19,  pais_id: 1,  nombre: "Formosa" },
  { id: 20,  pais_id: 1,  nombre: "San Salvador de Jujuy" },
  { id: 21,  pais_id: 1,  nombre: "Comodoro Rivadavia" },
  { id: 22,  pais_id: 1,  nombre: "Paraná" },
  { id: 23,  pais_id: 1,  nombre: "La Rioja" },
  { id: 24,  pais_id: 1,  nombre: "Catamarca" },
  { id: 25,  pais_id: 1,  nombre: "Bariloche" },

  // ── Bolivia (2) ───────────────────────────────────────────
  { id: 26,  pais_id: 2,  nombre: "La Paz" },
  { id: 27,  pais_id: 2,  nombre: "Santa Cruz de la Sierra" },
  { id: 28,  pais_id: 2,  nombre: "Cochabamba" },
  { id: 29,  pais_id: 2,  nombre: "Oruro" },
  { id: 30,  pais_id: 2,  nombre: "Sucre" },
  { id: 31,  pais_id: 2,  nombre: "Potosí" },
  { id: 32,  pais_id: 2,  nombre: "Tarija" },
  { id: 33,  pais_id: 2,  nombre: "Trinidad" },
  { id: 34,  pais_id: 2,  nombre: "Cobija" },

  // ── Brasil (3) ────────────────────────────────────────────
  { id: 35,  pais_id: 3,  nombre: "São Paulo" },
  { id: 36,  pais_id: 3,  nombre: "Río de Janeiro" },
  { id: 37,  pais_id: 3,  nombre: "Brasilia" },
  { id: 38,  pais_id: 3,  nombre: "Belo Horizonte" },
  { id: 39,  pais_id: 3,  nombre: "Porto Alegre" },
  { id: 40,  pais_id: 3,  nombre: "Salvador" },
  { id: 41,  pais_id: 3,  nombre: "Fortaleza" },
  { id: 42,  pais_id: 3,  nombre: "Recife" },
  { id: 43,  pais_id: 3,  nombre: "Manaus" },
  { id: 44,  pais_id: 3,  nombre: "Curitiba" },
  { id: 45,  pais_id: 3,  nombre: "Goiânia" },
  { id: 46,  pais_id: 3,  nombre: "Belém" },
  { id: 47,  pais_id: 3,  nombre: "Florianópolis" },
  { id: 48,  pais_id: 3,  nombre: "Natal" },
  { id: 49,  pais_id: 3,  nombre: "Maceió" },
  { id: 50,  pais_id: 3,  nombre: "Campo Grande" },
  { id: 51,  pais_id: 3,  nombre: "João Pessoa" },
  { id: 52,  pais_id: 3,  nombre: "Teresina" },
  { id: 53,  pais_id: 3,  nombre: "São Luís" },
  { id: 54,  pais_id: 3,  nombre: "Campinas" },
  { id: 55,  pais_id: 3,  nombre: "Santos" },

  // ── Chile (4) ─────────────────────────────────────────────
  { id: 56,  pais_id: 4,  nombre: "Santiago" },
  { id: 57,  pais_id: 4,  nombre: "Valparaíso" },
  { id: 58,  pais_id: 4,  nombre: "Concepción" },
  { id: 59,  pais_id: 4,  nombre: "Antofagasta" },
  { id: 60,  pais_id: 4,  nombre: "La Serena" },
  { id: 61,  pais_id: 4,  nombre: "Temuco" },
  { id: 62,  pais_id: 4,  nombre: "Iquique" },
  { id: 63,  pais_id: 4,  nombre: "Puerto Montt" },
  { id: 64,  pais_id: 4,  nombre: "Rancagua" },
  { id: 65,  pais_id: 4,  nombre: "Arica" },
  { id: 66,  pais_id: 4,  nombre: "Talca" },
  { id: 67,  pais_id: 4,  nombre: "Chillán" },
  { id: 68,  pais_id: 4,  nombre: "Calama" },
  { id: 69,  pais_id: 4,  nombre: "Osorno" },
  { id: 70,  pais_id: 4,  nombre: "Punta Arenas" },

  // ── Colombia (5) ──────────────────────────────────────────
  { id: 71,  pais_id: 5,  nombre: "Bogotá" },
  { id: 72,  pais_id: 5,  nombre: "Medellín" },
  { id: 73,  pais_id: 5,  nombre: "Cali" },
  { id: 74,  pais_id: 5,  nombre: "Barranquilla" },
  { id: 75,  pais_id: 5,  nombre: "Cartagena" },
  { id: 76,  pais_id: 5,  nombre: "Bucaramanga" },
  { id: 77,  pais_id: 5,  nombre: "Pereira" },
  { id: 78,  pais_id: 5,  nombre: "Cúcuta" },
  { id: 79,  pais_id: 5,  nombre: "Manizales" },
  { id: 80,  pais_id: 5,  nombre: "Santa Marta" },
  { id: 81,  pais_id: 5,  nombre: "Ibagué" },
  { id: 82,  pais_id: 5,  nombre: "Pasto" },
  { id: 83,  pais_id: 5,  nombre: "Villavicencio" },
  { id: 84,  pais_id: 5,  nombre: "Armenia" },
  { id: 85,  pais_id: 5,  nombre: "Neiva" },
  { id: 86,  pais_id: 5,  nombre: "Montería" },
  { id: 87,  pais_id: 5,  nombre: "Soledad" },
  { id: 88,  pais_id: 5,  nombre: "Soacha" },

  // ── Ecuador (6) ───────────────────────────────────────────
  { id: 89,  pais_id: 6,  nombre: "Quito" },
  { id: 90,  pais_id: 6,  nombre: "Guayaquil" },
  { id: 91,  pais_id: 6,  nombre: "Cuenca" },
  { id: 92,  pais_id: 6,  nombre: "Ambato" },
  { id: 93,  pais_id: 6,  nombre: "Manta" },
  { id: 94,  pais_id: 6,  nombre: "Loja" },
  { id: 95,  pais_id: 6,  nombre: "Santo Domingo" },
  { id: 96,  pais_id: 6,  nombre: "Machala" },
  { id: 97,  pais_id: 6,  nombre: "Esmeraldas" },
  { id: 98,  pais_id: 6,  nombre: "Ibarra" },
  { id: 99,  pais_id: 6,  nombre: "Riobamba" },
  { id: 100, pais_id: 6,  nombre: "Portoviejo" },
  { id: 101, pais_id: 6,  nombre: "Babahoyo" },
  { id: 102, pais_id: 6,  nombre: "Latacunga" },
  { id: 103, pais_id: 6,  nombre: "Quevedo" },
  { id: 104, pais_id: 6,  nombre: "Milagro" },
  { id: 105, pais_id: 6,  nombre: "Durán" },
  { id: 106, pais_id: 6,  nombre: "Tulcán" },
  { id: 107, pais_id: 6,  nombre: "Manabí" },

  // ── Paraguay (7) ──────────────────────────────────────────
  { id: 109, pais_id: 7,  nombre: "Asunción" },
  { id: 110, pais_id: 7,  nombre: "Ciudad del Este" },
  { id: 111, pais_id: 7,  nombre: "Encarnación" },
  { id: 112, pais_id: 7,  nombre: "San Lorenzo" },
  { id: 113, pais_id: 7,  nombre: "Lambaré" },
  { id: 114, pais_id: 7,  nombre: "Fernando de la Mora" },
  { id: 115, pais_id: 7,  nombre: "Luque" },
  { id: 116, pais_id: 7,  nombre: "Capiatá" },
  { id: 117, pais_id: 7,  nombre: "Pedro Juan Caballero" },

  // ── Perú (8) ──────────────────────────────────────────────
  { id: 118, pais_id: 8,  nombre: "Lima" },
  { id: 119, pais_id: 8,  nombre: "Arequipa" },
  { id: 120, pais_id: 8,  nombre: "Trujillo" },
  { id: 121, pais_id: 8,  nombre: "Chiclayo" },
  { id: 122, pais_id: 8,  nombre: "Piura" },
  { id: 123, pais_id: 8,  nombre: "Iquitos" },
  { id: 124, pais_id: 8,  nombre: "Cusco" },
  { id: 125, pais_id: 8,  nombre: "Huancayo" },
  { id: 126, pais_id: 8,  nombre: "Tacna" },
  { id: 127, pais_id: 8,  nombre: "Puno" },
  { id: 128, pais_id: 8,  nombre: "Chimbote" },
  { id: 129, pais_id: 8,  nombre: "Juliaca" },
  { id: 130, pais_id: 8,  nombre: "Ica" },
  { id: 131, pais_id: 8,  nombre: "Ayacucho" },
  { id: 132, pais_id: 8,  nombre: "Cajamarca" },
  { id: 133, pais_id: 8,  nombre: "Sullana" },
  { id: 134, pais_id: 8,  nombre: "Huánuco" },

  // ── Uruguay (9) ───────────────────────────────────────────
  { id: 135, pais_id: 9,  nombre: "Montevideo" },
  { id: 136, pais_id: 9,  nombre: "Salto" },
  { id: 137, pais_id: 9,  nombre: "Paysandú" },
  { id: 138, pais_id: 9,  nombre: "Las Piedras" },
  { id: 139, pais_id: 9,  nombre: "Rivera" },
  { id: 140, pais_id: 9,  nombre: "Maldonado" },
  { id: 141, pais_id: 9,  nombre: "Tacuarembó" },
  { id: 142, pais_id: 9,  nombre: "Melo" },
  { id: 143, pais_id: 9,  nombre: "Mercedes" },

  // ── Venezuela (10) ────────────────────────────────────────
  { id: 144, pais_id: 10, nombre: "Caracas" },
  { id: 145, pais_id: 10, nombre: "Maracaibo" },
  { id: 146, pais_id: 10, nombre: "Valencia" },
  { id: 147, pais_id: 10, nombre: "Barquisimeto" },
  { id: 148, pais_id: 10, nombre: "Maracay" },
  { id: 149, pais_id: 10, nombre: "Ciudad Guayana" },
  { id: 150, pais_id: 10, nombre: "Barcelona" },
  { id: 151, pais_id: 10, nombre: "Maturín" },
  { id: 152, pais_id: 10, nombre: "San Cristóbal" },
  { id: 153, pais_id: 10, nombre: "Cumaná" },

  // ── Guyana (11) ───────────────────────────────────────────
  { id: 154, pais_id: 11, nombre: "Georgetown" },
  { id: 155, pais_id: 11, nombre: "Linden" },

  // ── Surinam (12) ──────────────────────────────────────────
  { id: 156, pais_id: 12, nombre: "Paramaribo" },
  { id: 157, pais_id: 12, nombre: "Lelydorp" },

  // ── Guayana Francesa (13) ─────────────────────────────────
  { id: 158, pais_id: 13, nombre: "Cayena" },

  // ── Costa Rica (14) ───────────────────────────────────────
  { id: 159, pais_id: 14, nombre: "San José" },
  { id: 160, pais_id: 14, nombre: "Alajuela" },
  { id: 161, pais_id: 14, nombre: "Cartago" },
  { id: 162, pais_id: 14, nombre: "Heredia" },
  { id: 163, pais_id: 14, nombre: "Liberia" },
  { id: 164, pais_id: 14, nombre: "Puntarenas" },
  { id: 165, pais_id: 14, nombre: "Limón" },

  // ── Cuba (15) ─────────────────────────────────────────────
  { id: 166, pais_id: 15, nombre: "La Habana" },
  { id: 167, pais_id: 15, nombre: "Santiago de Cuba" },
  { id: 168, pais_id: 15, nombre: "Camagüey" },
  { id: 169, pais_id: 15, nombre: "Holguín" },
  { id: 170, pais_id: 15, nombre: "Santa Clara" },
  { id: 171, pais_id: 15, nombre: "Guantánamo" },
  { id: 172, pais_id: 15, nombre: "Trinidad" },

  // ── El Salvador (16) ──────────────────────────────────────
  { id: 173, pais_id: 16, nombre: "San Salvador" },
  { id: 174, pais_id: 16, nombre: "Santa Ana" },
  { id: 175, pais_id: 16, nombre: "San Miguel" },
  { id: 176, pais_id: 16, nombre: "Soyapango" },
  { id: 177, pais_id: 16, nombre: "Nueva San Salvador" },
  { id: 178, pais_id: 16, nombre: "Mejicanos" },

  // ── Guatemala (17) ────────────────────────────────────────
  { id: 179, pais_id: 17, nombre: "Ciudad de Guatemala" },
  { id: 180, pais_id: 17, nombre: "Quetzaltenango" },
  { id: 181, pais_id: 17, nombre: "Escuintla" },
  { id: 182, pais_id: 17, nombre: "Villa Nueva" },
  { id: 183, pais_id: 17, nombre: "Mixco" },
  { id: 184, pais_id: 17, nombre: "Huehuetenango" },
  { id: 185, pais_id: 17, nombre: "Cobán" },
  { id: 186, pais_id: 17, nombre: "Antigua Guatemala" },

  // ── Honduras (18) ─────────────────────────────────────────
  { id: 187, pais_id: 18, nombre: "Tegucigalpa" },
  { id: 188, pais_id: 18, nombre: "San Pedro Sula" },
  { id: 189, pais_id: 18, nombre: "La Ceiba" },
  { id: 190, pais_id: 18, nombre: "Choloma" },
  { id: 191, pais_id: 18, nombre: "El Progreso" },
  { id: 192, pais_id: 18, nombre: "Comayagua" },

  // ── México (19) ───────────────────────────────────────────
  { id: 193, pais_id: 19, nombre: "Ciudad de México" },
  { id: 194, pais_id: 19, nombre: "Guadalajara" },
  { id: 195, pais_id: 19, nombre: "Monterrey" },
  { id: 196, pais_id: 19, nombre: "Puebla" },
  { id: 197, pais_id: 19, nombre: "Tijuana" },
  { id: 198, pais_id: 19, nombre: "León" },
  { id: 199, pais_id: 19, nombre: "Juárez" },
  { id: 200, pais_id: 19, nombre: "Mérida" },
  { id: 201, pais_id: 19, nombre: "Cancún" },
  { id: 202, pais_id: 19, nombre: "Querétaro" },
  { id: 203, pais_id: 19, nombre: "San Luis Potosí" },
  { id: 204, pais_id: 19, nombre: "Hermosillo" },
  { id: 205, pais_id: 19, nombre: "Torreón" },
  { id: 206, pais_id: 19, nombre: "Morelia" },
  { id: 207, pais_id: 19, nombre: "Veracruz" },
  { id: 208, pais_id: 19, nombre: "Aguascalientes" },
  { id: 209, pais_id: 19, nombre: "Culiacán" },
  { id: 210, pais_id: 19, nombre: "Acapulco" },
  { id: 211, pais_id: 19, nombre: "Chihuahua" },
  { id: 212, pais_id: 19, nombre: "Oaxaca" },
  { id: 213, pais_id: 19, nombre: "Saltillo" },
  { id: 214, pais_id: 19, nombre: "Mexicali" },
  { id: 215, pais_id: 19, nombre: "Villahermosa" },
  { id: 216, pais_id: 19, nombre: "Toluca" },

  // ── Nicaragua (20) ────────────────────────────────────────
  { id: 217, pais_id: 20, nombre: "Managua" },
  { id: 218, pais_id: 20, nombre: "León" },
  { id: 219, pais_id: 20, nombre: "Masaya" },
  { id: 220, pais_id: 20, nombre: "Granada" },
  { id: 221, pais_id: 20, nombre: "Estelí" },
  { id: 222, pais_id: 20, nombre: "Matagalpa" },

  // ── Panamá (21) ───────────────────────────────────────────
  { id: 223, pais_id: 21, nombre: "Ciudad de Panamá" },
  { id: 224, pais_id: 21, nombre: "Colón" },
  { id: 225, pais_id: 21, nombre: "David" },
  { id: 226, pais_id: 21, nombre: "La Chorrera" },
  { id: 227, pais_id: 21, nombre: "Santiago" },

  // ── Belice (22) ───────────────────────────────────────────
  { id: 228, pais_id: 22, nombre: "Ciudad de Belice" },

  // ── República Dominicana (23) ─────────────────────────────
  { id: 229, pais_id: 23, nombre: "Santo Domingo" },
  { id: 230, pais_id: 23, nombre: "Santiago de los Caballeros" },
  { id: 231, pais_id: 23, nombre: "La Romana" },
  { id: 232, pais_id: 23, nombre: "San Pedro de Macorís" },
  { id: 233, pais_id: 23, nombre: "San Francisco de Macorís" },
  { id: 234, pais_id: 23, nombre: "Punta Cana" },

  // ── Puerto Rico (24) ──────────────────────────────────────
  { id: 235, pais_id: 24, nombre: "San Juan" },
  { id: 236, pais_id: 24, nombre: "Bayamón" },
  { id: 237, pais_id: 24, nombre: "Carolina" },
  { id: 238, pais_id: 24, nombre: "Ponce" },
  { id: 239, pais_id: 24, nombre: "Caguas" },

  // ── Jamaica (25) ──────────────────────────────────────────
  { id: 240, pais_id: 25, nombre: "Kingston" },
  { id: 241, pais_id: 25, nombre: "Montego Bay" },
  { id: 242, pais_id: 25, nombre: "Portmore" },

  // ── Haití (26) ────────────────────────────────────────────
  { id: 243, pais_id: 26, nombre: "Puerto Príncipe" },
  { id: 244, pais_id: 26, nombre: "Cap-Haïtien" },
  { id: 245, pais_id: 26, nombre: "Gonaïves" },

  // ── Trinidad y Tobago (27) ────────────────────────────────
  { id: 246, pais_id: 27, nombre: "Puerto España" },
  { id: 247, pais_id: 27, nombre: "San Fernando" },

  // ── Bahamas (28) ──────────────────────────────────────────
  { id: 248, pais_id: 28, nombre: "Nassau" },

  // ── Barbados (29) ─────────────────────────────────────────
  { id: 249, pais_id: 29, nombre: "Bridgetown" },

  // ── Curazao (30) ──────────────────────────────────────────
  { id: 250, pais_id: 30, nombre: "Willemstad" },

  // ── Aruba (31) ────────────────────────────────────────────
  { id: 251, pais_id: 31, nombre: "Oranjestad" },

  // ── Estados Unidos (32) ───────────────────────────────────
  { id: 252, pais_id: 32, nombre: "Nueva York" },
  { id: 253, pais_id: 32, nombre: "Los Ángeles" },
  { id: 254, pais_id: 32, nombre: "Miami" },
  { id: 255, pais_id: 32, nombre: "Chicago" },
  { id: 256, pais_id: 32, nombre: "Houston" },
  { id: 257, pais_id: 32, nombre: "Dallas" },
  { id: 258, pais_id: 32, nombre: "San Francisco" },
  { id: 259, pais_id: 32, nombre: "Seattle" },
  { id: 260, pais_id: 32, nombre: "Boston" },
  { id: 261, pais_id: 32, nombre: "Atlanta" },
  { id: 262, pais_id: 32, nombre: "Washington D.C." },
  { id: 263, pais_id: 32, nombre: "Phoenix" },
  { id: 264, pais_id: 32, nombre: "San Diego" },
  { id: 265, pais_id: 32, nombre: "Denver" },
  { id: 266, pais_id: 32, nombre: "Las Vegas" },
  { id: 267, pais_id: 32, nombre: "Nashville" },
  { id: 268, pais_id: 32, nombre: "Portland" },
  { id: 269, pais_id: 32, nombre: "Austin" },
  { id: 270, pais_id: 32, nombre: "Orlando" },
  { id: 271, pais_id: 32, nombre: "San Antonio" },
  { id: 272, pais_id: 32, nombre: "Minneapolis" },
  { id: 273, pais_id: 32, nombre: "Charlotte" },
  { id: 274, pais_id: 32, nombre: "Detroit" },
  { id: 275, pais_id: 32, nombre: "Philadelphia" },

  // ── Canadá (33) ───────────────────────────────────────────
  { id: 276, pais_id: 33, nombre: "Toronto" },
  { id: 277, pais_id: 33, nombre: "Vancouver" },
  { id: 278, pais_id: 33, nombre: "Montreal" },
  { id: 279, pais_id: 33, nombre: "Calgary" },
  { id: 280, pais_id: 33, nombre: "Ottawa" },
  { id: 281, pais_id: 33, nombre: "Edmonton" },
  { id: 282, pais_id: 33, nombre: "Winnipeg" },
  { id: 283, pais_id: 33, nombre: "Quebec" },
  { id: 284, pais_id: 33, nombre: "Hamilton" },
  { id: 285, pais_id: 33, nombre: "Halifax" },

  // ── España (34) ───────────────────────────────────────────
  { id: 286, pais_id: 34, nombre: "Madrid" },
  { id: 287, pais_id: 34, nombre: "Barcelona" },
  { id: 288, pais_id: 34, nombre: "Valencia" },
  { id: 289, pais_id: 34, nombre: "Sevilla" },
  { id: 290, pais_id: 34, nombre: "Bilbao" },
  { id: 291, pais_id: 34, nombre: "Málaga" },
  { id: 292, pais_id: 34, nombre: "Zaragoza" },
  { id: 293, pais_id: 34, nombre: "Murcia" },
  { id: 294, pais_id: 34, nombre: "Palma de Mallorca" },
  { id: 295, pais_id: 34, nombre: "Las Palmas de Gran Canaria" },
  { id: 296, pais_id: 34, nombre: "Alicante" },
  { id: 297, pais_id: 34, nombre: "Córdoba" },
  { id: 298, pais_id: 34, nombre: "Valladolid" },
  { id: 299, pais_id: 34, nombre: "Vigo" },
  { id: 300, pais_id: 34, nombre: "Gijón" },
  { id: 301, pais_id: 34, nombre: "San Sebastián" },

  // ── Portugal (35) ─────────────────────────────────────────
  { id: 302, pais_id: 35, nombre: "Lisboa" },
  { id: 303, pais_id: 35, nombre: "Porto" },
  { id: 304, pais_id: 35, nombre: "Braga" },
  { id: 305, pais_id: 35, nombre: "Coímbra" },
  { id: 306, pais_id: 35, nombre: "Setúbal" },
  { id: 307, pais_id: 35, nombre: "Funchal" },

  // ── Francia (36) ──────────────────────────────────────────
  { id: 308, pais_id: 36, nombre: "París" },
  { id: 309, pais_id: 36, nombre: "Lyon" },
  { id: 310, pais_id: 36, nombre: "Marsella" },
  { id: 311, pais_id: 36, nombre: "Toulouse" },
  { id: 312, pais_id: 36, nombre: "Niza" },
  { id: 313, pais_id: 36, nombre: "Estrasburgo" },
  { id: 314, pais_id: 36, nombre: "Burdeos" },
  { id: 315, pais_id: 36, nombre: "Lille" },
  { id: 316, pais_id: 36, nombre: "Nantes" },

  // ── Alemania (37) ─────────────────────────────────────────
  { id: 317, pais_id: 37, nombre: "Berlín" },
  { id: 318, pais_id: 37, nombre: "Múnich" },
  { id: 319, pais_id: 37, nombre: "Hamburgo" },
  { id: 320, pais_id: 37, nombre: "Frankfurt" },
  { id: 321, pais_id: 37, nombre: "Colonia" },
  { id: 322, pais_id: 37, nombre: "Stuttgart" },
  { id: 323, pais_id: 37, nombre: "Düsseldorf" },
  { id: 324, pais_id: 37, nombre: "Leipzig" },
  { id: 325, pais_id: 37, nombre: "Dresde" },
  { id: 326, pais_id: 37, nombre: "Hannover" },

  // ── Reino Unido (38) ──────────────────────────────────────
  { id: 327, pais_id: 38, nombre: "Londres" },
  { id: 328, pais_id: 38, nombre: "Manchester" },
  { id: 329, pais_id: 38, nombre: "Birmingham" },
  { id: 330, pais_id: 38, nombre: "Leeds" },
  { id: 331, pais_id: 38, nombre: "Glasgow" },
  { id: 332, pais_id: 38, nombre: "Edimburgo" },
  { id: 333, pais_id: 38, nombre: "Liverpool" },
  { id: 334, pais_id: 38, nombre: "Bristol" },
  { id: 335, pais_id: 38, nombre: "Cardiff" },
  { id: 336, pais_id: 38, nombre: "Belfast" },

  // ── Italia (39) ───────────────────────────────────────────
  { id: 337, pais_id: 39, nombre: "Roma" },
  { id: 338, pais_id: 39, nombre: "Milán" },
  { id: 339, pais_id: 39, nombre: "Nápoles" },
  { id: 340, pais_id: 39, nombre: "Turín" },
  { id: 341, pais_id: 39, nombre: "Palermo" },
  { id: 342, pais_id: 39, nombre: "Génova" },
  { id: 343, pais_id: 39, nombre: "Bolonia" },
  { id: 344, pais_id: 39, nombre: "Florencia" },
  { id: 345, pais_id: 39, nombre: "Venecia" },
  { id: 346, pais_id: 39, nombre: "Bari" },

  // ── Países Bajos (40) ─────────────────────────────────────
  { id: 347, pais_id: 40, nombre: "Ámsterdam" },
  { id: 348, pais_id: 40, nombre: "Rotterdam" },
  { id: 349, pais_id: 40, nombre: "La Haya" },
  { id: 350, pais_id: 40, nombre: "Utrecht" },
  { id: 351, pais_id: 40, nombre: "Eindhoven" },

  // ── Suiza (41) ────────────────────────────────────────────
  { id: 352, pais_id: 41, nombre: "Zúrich" },
  { id: 353, pais_id: 41, nombre: "Ginebra" },
  { id: 354, pais_id: 41, nombre: "Berna" },
  { id: 355, pais_id: 41, nombre: "Basilea" },
  { id: 356, pais_id: 41, nombre: "Lausana" },

  // ── Bélgica (42) ──────────────────────────────────────────
  { id: 357, pais_id: 42, nombre: "Bruselas" },
  { id: 358, pais_id: 42, nombre: "Amberes" },
  { id: 359, pais_id: 42, nombre: "Gante" },
  { id: 360, pais_id: 42, nombre: "Brujas" },

  // ── Austria (43) ──────────────────────────────────────────
  { id: 361, pais_id: 43, nombre: "Viena" },
  { id: 362, pais_id: 43, nombre: "Graz" },
  { id: 363, pais_id: 43, nombre: "Linz" },
  { id: 364, pais_id: 43, nombre: "Salzburgo" },
  { id: 365, pais_id: 43, nombre: "Innsbruck" },

  // ── Suecia (44) ───────────────────────────────────────────
  { id: 366, pais_id: 44, nombre: "Estocolmo" },
  { id: 367, pais_id: 44, nombre: "Gotemburgo" },
  { id: 368, pais_id: 44, nombre: "Malmö" },
  { id: 369, pais_id: 44, nombre: "Uppsala" },

  // ── Noruega (45) ──────────────────────────────────────────
  { id: 370, pais_id: 45, nombre: "Oslo" },
  { id: 371, pais_id: 45, nombre: "Bergen" },
  { id: 372, pais_id: 45, nombre: "Trondheim" },

  // ── Dinamarca (46) ────────────────────────────────────────
  { id: 373, pais_id: 46, nombre: "Copenhague" },
  { id: 374, pais_id: 46, nombre: "Aarhus" },

  // ── Finlandia (47) ────────────────────────────────────────
  { id: 375, pais_id: 47, nombre: "Helsinki" },
  { id: 376, pais_id: 47, nombre: "Tampere" },
  { id: 377, pais_id: 47, nombre: "Turku" },

  // ── Irlanda (48) ──────────────────────────────────────────
  { id: 378, pais_id: 48, nombre: "Dublín" },
  { id: 379, pais_id: 48, nombre: "Cork" },
  { id: 380, pais_id: 48, nombre: "Galway" },

  // ── Luxemburgo (49) ───────────────────────────────────────
  { id: 381, pais_id: 49, nombre: "Luxemburgo" },

  // ── Polonia (50) ──────────────────────────────────────────
  { id: 382, pais_id: 50, nombre: "Varsovia" },
  { id: 383, pais_id: 50, nombre: "Cracovia" },
  { id: 384, pais_id: 50, nombre: "Łódź" },
  { id: 385, pais_id: 50, nombre: "Wrocław" },
  { id: 386, pais_id: 50, nombre: "Poznan" },
  { id: 387, pais_id: 50, nombre: "Gdansk" },

  // ── República Checa (51) ──────────────────────────────────
  { id: 388, pais_id: 51, nombre: "Praga" },
  { id: 389, pais_id: 51, nombre: "Brno" },
  { id: 390, pais_id: 51, nombre: "Ostrava" },

  // ── Hungría (52) ──────────────────────────────────────────
  { id: 391, pais_id: 52, nombre: "Budapest" },
  { id: 392, pais_id: 52, nombre: "Debrecen" },

  // ── Rumania (53) ──────────────────────────────────────────
  { id: 393, pais_id: 53, nombre: "Bucarest" },
  { id: 394, pais_id: 53, nombre: "Cluj-Napoca" },
  { id: 395, pais_id: 53, nombre: "Timișoara" },
  { id: 396, pais_id: 53, nombre: "Iași" },

  // ── Bulgaria (54) ─────────────────────────────────────────
  { id: 397, pais_id: 54, nombre: "Sofía" },
  { id: 398, pais_id: 54, nombre: "Plovdiv" },
  { id: 399, pais_id: 54, nombre: "Varna" },

  // ── Croacia (55) ──────────────────────────────────────────
  { id: 400, pais_id: 55, nombre: "Zagreb" },
  { id: 401, pais_id: 55, nombre: "Split" },
  { id: 402, pais_id: 55, nombre: "Rijeka" },

  // ── Serbia (56) ───────────────────────────────────────────
  { id: 403, pais_id: 56, nombre: "Belgrado" },
  { id: 404, pais_id: 56, nombre: "Novi Sad" },

  // ── Ucrania (57) ──────────────────────────────────────────
  { id: 405, pais_id: 57, nombre: "Kiev" },
  { id: 406, pais_id: 57, nombre: "Járkov" },
  { id: 407, pais_id: 57, nombre: "Odesa" },
  { id: 408, pais_id: 57, nombre: "Dnipro" },
  { id: 409, pais_id: 57, nombre: "Leópolis" },

  // ── Grecia (58) ───────────────────────────────────────────
  { id: 410, pais_id: 58, nombre: "Atenas" },
  { id: 411, pais_id: 58, nombre: "Salónica" },
  { id: 412, pais_id: 58, nombre: "Patras" },

  // ── Eslovaquia (59) ───────────────────────────────────────
  { id: 413, pais_id: 59, nombre: "Bratislava" },
  { id: 414, pais_id: 59, nombre: "Košice" },

  // ── Eslovenia (60) ────────────────────────────────────────
  { id: 415, pais_id: 60, nombre: "Liubliana" },

  // ── Estonia (61) ──────────────────────────────────────────
  { id: 416, pais_id: 61, nombre: "Tallin" },

  // ── Letonia (62) ──────────────────────────────────────────
  { id: 417, pais_id: 62, nombre: "Riga" },

  // ── Lituania (63) ─────────────────────────────────────────
  { id: 418, pais_id: 63, nombre: "Vilna" },

  // ── Turquía (64) ──────────────────────────────────────────
  { id: 419, pais_id: 64, nombre: "Estambul" },
  { id: 420, pais_id: 64, nombre: "Ankara" },
  { id: 421, pais_id: 64, nombre: "Esmirna" },
  { id: 422, pais_id: 64, nombre: "Antalya" },
  { id: 423, pais_id: 64, nombre: "Bursa" },

  // ── Rusia (65) ────────────────────────────────────────────
  { id: 424, pais_id: 65, nombre: "Moscú" },
  { id: 425, pais_id: 65, nombre: "San Petersburgo" },
  { id: 426, pais_id: 65, nombre: "Novosibirsk" },
  { id: 427, pais_id: 65, nombre: "Ekaterimburgo" },
  { id: 428, pais_id: 65, nombre: "Kazán" },

  // ── China (66) ────────────────────────────────────────────
  { id: 429, pais_id: 66, nombre: "Pekín" },
  { id: 430, pais_id: 66, nombre: "Shanghái" },
  { id: 431, pais_id: 66, nombre: "Shenzhen" },
  { id: 432, pais_id: 66, nombre: "Guangzhou" },
  { id: 433, pais_id: 66, nombre: "Chengdu" },
  { id: 434, pais_id: 66, nombre: "Wuhan" },
  { id: 435, pais_id: 66, nombre: "Hangzhou" },
  { id: 436, pais_id: 66, nombre: "Chongqing" },
  { id: 437, pais_id: 66, nombre: "Tianjin" },
  { id: 438, pais_id: 66, nombre: "Nanjing" },
  { id: 439, pais_id: 66, nombre: "Xi'an" },
  { id: 440, pais_id: 66, nombre: "Suzhou" },
  { id: 441, pais_id: 66, nombre: "Kunming" },
  { id: 442, pais_id: 66, nombre: "Qingdao" },

  // ── Japón (67) ────────────────────────────────────────────
  { id: 443, pais_id: 67, nombre: "Tokio" },
  { id: 444, pais_id: 67, nombre: "Osaka" },
  { id: 445, pais_id: 67, nombre: "Yokohama" },
  { id: 446, pais_id: 67, nombre: "Nagoya" },
  { id: 447, pais_id: 67, nombre: "Sapporo" },
  { id: 448, pais_id: 67, nombre: "Kobe" },
  { id: 449, pais_id: 67, nombre: "Kioto" },
  { id: 450, pais_id: 67, nombre: "Fukuoka" },

  // ── Corea del Sur (68) ────────────────────────────────────
  { id: 451, pais_id: 68, nombre: "Seúl" },
  { id: 452, pais_id: 68, nombre: "Busan" },
  { id: 453, pais_id: 68, nombre: "Incheon" },
  { id: 454, pais_id: 68, nombre: "Daegu" },
  { id: 455, pais_id: 68, nombre: "Daejeon" },

  // ── Taiwán (69) ───────────────────────────────────────────
  { id: 456, pais_id: 69, nombre: "Taipéi" },
  { id: 457, pais_id: 69, nombre: "Kaohsiung" },

  // ── Hong Kong (70) ────────────────────────────────────────
  { id: 458, pais_id: 70, nombre: "Hong Kong" },

  // ── Singapur (71) ─────────────────────────────────────────
  { id: 459, pais_id: 71, nombre: "Singapur" },

  // ── Indonesia (72) ────────────────────────────────────────
  { id: 460, pais_id: 72, nombre: "Yakarta" },
  { id: 461, pais_id: 72, nombre: "Surabaya" },
  { id: 462, pais_id: 72, nombre: "Bandung" },
  { id: 463, pais_id: 72, nombre: "Medan" },
  { id: 464, pais_id: 72, nombre: "Bali (Denpasar)" },
  { id: 465, pais_id: 72, nombre: "Makassar" },

  // ── Malasia (73) ──────────────────────────────────────────
  { id: 466, pais_id: 73, nombre: "Kuala Lumpur" },
  { id: 467, pais_id: 73, nombre: "George Town" },
  { id: 468, pais_id: 73, nombre: "Johor Bahru" },

  // ── Filipinas (74) ────────────────────────────────────────
  { id: 469, pais_id: 74, nombre: "Manila" },
  { id: 470, pais_id: 74, nombre: "Quezon City" },
  { id: 471, pais_id: 74, nombre: "Cebu" },
  { id: 472, pais_id: 74, nombre: "Davao" },

  // ── Vietnam (75) ──────────────────────────────────────────
  { id: 473, pais_id: 75, nombre: "Ciudad Ho Chi Minh" },
  { id: 474, pais_id: 75, nombre: "Hanói" },
  { id: 475, pais_id: 75, nombre: "Da Nang" },

  // ── Tailandia (76) ────────────────────────────────────────
  { id: 476, pais_id: 76, nombre: "Bangkok" },
  { id: 477, pais_id: 76, nombre: "Chiang Mai" },
  { id: 478, pais_id: 76, nombre: "Phuket" },

  // ── Myanmar (77) ──────────────────────────────────────────
  { id: 479, pais_id: 77, nombre: "Rangún" },
  { id: 480, pais_id: 77, nombre: "Mandalay" },

  // ── Cambodia (78) ─────────────────────────────────────────
  { id: 481, pais_id: 78, nombre: "Nom Pen" },
  { id: 482, pais_id: 78, nombre: "Siem Reap" },

  // ── India (79) ────────────────────────────────────────────
  { id: 483, pais_id: 79, nombre: "Mumbai" },
  { id: 484, pais_id: 79, nombre: "Bangalore" },
  { id: 485, pais_id: 79, nombre: "Nueva Delhi" },
  { id: 486, pais_id: 79, nombre: "Chennai" },
  { id: 487, pais_id: 79, nombre: "Hyderabad" },
  { id: 488, pais_id: 79, nombre: "Kolkata" },
  { id: 489, pais_id: 79, nombre: "Ahmedabad" },
  { id: 490, pais_id: 79, nombre: "Pune" },
  { id: 491, pais_id: 79, nombre: "Surat" },
  { id: 492, pais_id: 79, nombre: "Jaipur" },

  // ── Pakistán (80) ─────────────────────────────────────────
  { id: 493, pais_id: 80, nombre: "Karachi" },
  { id: 494, pais_id: 80, nombre: "Lahore" },
  { id: 495, pais_id: 80, nombre: "Islamabad" },

  // ── Bangladesh (81) ───────────────────────────────────────
  { id: 496, pais_id: 81, nombre: "Daca" },
  { id: 497, pais_id: 81, nombre: "Chittagong" },

  // ── Sri Lanka (82) ────────────────────────────────────────
  { id: 498, pais_id: 82, nombre: "Colombo" },
  { id: 499, pais_id: 82, nombre: "Kandy" },

  // ── Nepal (83) ────────────────────────────────────────────
  { id: 500, pais_id: 83, nombre: "Katmandú" },

  // ── Emiratos Árabes (84) ──────────────────────────────────
  { id: 501, pais_id: 84, nombre: "Dubái" },
  { id: 502, pais_id: 84, nombre: "Abu Dabi" },
  { id: 503, pais_id: 84, nombre: "Sharjah" },

  // ── Arabia Saudita (85) ───────────────────────────────────
  { id: 504, pais_id: 85, nombre: "Riad" },
  { id: 505, pais_id: 85, nombre: "Yeda" },
  { id: 506, pais_id: 85, nombre: "La Meca" },
  { id: 507, pais_id: 85, nombre: "Medina" },
  { id: 508, pais_id: 85, nombre: "Dammam" },

  // ── Qatar (86) ────────────────────────────────────────────
  { id: 509, pais_id: 86, nombre: "Doha" },

  // ── Kuwait (87) ───────────────────────────────────────────
  { id: 510, pais_id: 87, nombre: "Kuwait City" },

  // ── Israel (88) ───────────────────────────────────────────
  { id: 511, pais_id: 88, nombre: "Tel Aviv" },
  { id: 512, pais_id: 88, nombre: "Jerusalén" },
  { id: 513, pais_id: 88, nombre: "Haifa" },

  // ── Jordania (89) ─────────────────────────────────────────
  { id: 514, pais_id: 89, nombre: "Ammán" },

  // ── Líbano (90) ───────────────────────────────────────────
  { id: 515, pais_id: 90, nombre: "Beirut" },

  // ── Egipto (91) ───────────────────────────────────────────
  { id: 516, pais_id: 91, nombre: "El Cairo" },
  { id: 517, pais_id: 91, nombre: "Alejandría" },
  { id: 518, pais_id: 91, nombre: "Giza" },

  // ── Irak (92) ─────────────────────────────────────────────
  { id: 519, pais_id: 92, nombre: "Bagdad" },
  { id: 520, pais_id: 92, nombre: "Basora" },
  { id: 521, pais_id: 92, nombre: "Erbil" },

  // ── Irán (93) ─────────────────────────────────────────────
  { id: 522, pais_id: 93, nombre: "Teherán" },
  { id: 523, pais_id: 93, nombre: "Isfahán" },
  { id: 524, pais_id: 93, nombre: "Mashhad" },

  // ── Omán (94) ─────────────────────────────────────────────
  { id: 525, pais_id: 94, nombre: "Mascate" },

  // ── Baréin (95) ───────────────────────────────────────────
  { id: 526, pais_id: 95, nombre: "Manama" },

  // ── Marruecos (96) ────────────────────────────────────────
  { id: 527, pais_id: 96, nombre: "Casablanca" },
  { id: 528, pais_id: 96, nombre: "Rabat" },
  { id: 529, pais_id: 96, nombre: "Marrakech" },
  { id: 530, pais_id: 96, nombre: "Fez" },
  { id: 531, pais_id: 96, nombre: "Tánger" },

  // ── Argelia (97) ──────────────────────────────────────────
  { id: 532, pais_id: 97, nombre: "Argel" },
  { id: 533, pais_id: 97, nombre: "Orán" },

  // ── Túnez (98) ────────────────────────────────────────────
  { id: 534, pais_id: 98, nombre: "Túnez" },
  { id: 535, pais_id: 98, nombre: "Sfax" },

  // ── Nigeria (100) ─────────────────────────────────────────
  { id: 536, pais_id: 100, nombre: "Lagos" },
  { id: 537, pais_id: 100, nombre: "Abuja" },
  { id: 538, pais_id: 100, nombre: "Kano" },
  { id: 539, pais_id: 100, nombre: "Ibadan" },
  { id: 540, pais_id: 100, nombre: "Port Harcourt" },

  // ── Sudáfrica (101) ───────────────────────────────────────
  { id: 541, pais_id: 101, nombre: "Johannesburgo" },
  { id: 542, pais_id: 101, nombre: "Ciudad del Cabo" },
  { id: 543, pais_id: 101, nombre: "Durban" },
  { id: 544, pais_id: 101, nombre: "Pretoria" },
  { id: 545, pais_id: 101, nombre: "Port Elizabeth" },

  // ── Kenia (102) ───────────────────────────────────────────
  { id: 546, pais_id: 102, nombre: "Nairobi" },
  { id: 547, pais_id: 102, nombre: "Mombasa" },

  // ── Ghana (103) ───────────────────────────────────────────
  { id: 548, pais_id: 103, nombre: "Acra" },
  { id: 549, pais_id: 103, nombre: "Kumasi" },

  // ── Etiopía (104) ─────────────────────────────────────────
  { id: 550, pais_id: 104, nombre: "Addis Abeba" },

  // ── Tanzania (105) ────────────────────────────────────────
  { id: 551, pais_id: 105, nombre: "Dar es Salaam" },
  { id: 552, pais_id: 105, nombre: "Dodoma" },

  // ── Uganda (106) ──────────────────────────────────────────
  { id: 553, pais_id: 106, nombre: "Kampala" },

  // ── Costa de Marfil (107) ─────────────────────────────────
  { id: 554, pais_id: 107, nombre: "Abiyán" },
  { id: 555, pais_id: 107, nombre: "Yamusukro" },

  // ── Senegal (108) ─────────────────────────────────────────
  { id: 556, pais_id: 108, nombre: "Dakar" },

  // ── Angola (110) ──────────────────────────────────────────
  { id: 557, pais_id: 110, nombre: "Luanda" },

  // ── Mozambique (111) ──────────────────────────────────────
  { id: 558, pais_id: 111, nombre: "Maputo" },

  // ── Australia (116) ───────────────────────────────────────
  { id: 559, pais_id: 116, nombre: "Sídney" },
  { id: 560, pais_id: 116, nombre: "Melbourne" },
  { id: 561, pais_id: 116, nombre: "Brisbane" },
  { id: 562, pais_id: 116, nombre: "Perth" },
  { id: 563, pais_id: 116, nombre: "Adelaida" },
  { id: 564, pais_id: 116, nombre: "Canberra" },
  { id: 565, pais_id: 116, nombre: "Gold Coast" },

  // ── Nueva Zelanda (117) ───────────────────────────────────
  { id: 566, pais_id: 117, nombre: "Auckland" },
  { id: 567, pais_id: 117, nombre: "Wellington" },
  { id: 568, pais_id: 117, nombre: "Christchurch" },

  // ── Kazajistán (120) ──────────────────────────────────────
  { id: 569, pais_id: 120, nombre: "Almatý" },
  { id: 570, pais_id: 120, nombre: "Astana (Nursultán)" },

  // ── Uzbekistán (121) ──────────────────────────────────────
  { id: 571, pais_id: 121, nombre: "Taskent" },
  { id: 572, pais_id: 121, nombre: "Samarcanda" },

  { id: 573, pais_id: 122, nombre: "Otra ciudad" },
];

export const RUBROS = [
  // ── Tecnología ────────────────────────────────────────────
  { id: 1,  categoria: "Tecnología", nombre: "Tecnología e Informática",        descripcion: "Software, hardware, telecomunicaciones y servicios TI" },
  { id: 2,  categoria: "Tecnología", nombre: "Desarrollo de Software",          descripcion: "Empresas de desarrollo de aplicaciones web, móviles y sistemas" },
  { id: 3,  categoria: "Tecnología", nombre: "Ciberseguridad",                  descripcion: "Seguridad informática, protección de datos y auditoría digital" },
  { id: 4,  categoria: "Tecnología", nombre: "Inteligencia Artificial y Data",  descripcion: "IA, machine learning, big data, analítica y ciencia de datos" },
  { id: 5,  categoria: "Tecnología", nombre: "Cloud e Infraestructura",         descripcion: "Servicios en la nube, DevOps, hosting y gestión de infraestructura" },
  { id: 6,  categoria: "Tecnología", nombre: "E-commerce y Marketplaces",       descripcion: "Plataformas de comercio electrónico y mercados digitales" },
  { id: 7,  categoria: "Tecnología", nombre: "Hardware y Electrónica",          descripcion: "Fabricación y distribución de hardware, semiconductores y componentes electrónicos" },
  { id: 8,  categoria: "Tecnología", nombre: "Robótica y Automatización",       descripcion: "Robots industriales, automatización de procesos físicos y cobots" },
  { id: 9,  categoria: "Tecnología", nombre: "Internet de las Cosas (IoT)",     descripcion: "Dispositivos conectados, sensores, redes IoT y ciudades inteligentes" },
  { id: 10, categoria: "Tecnología", nombre: "Realidad Virtual y Aumentada",    descripcion: "VR, AR, XR, metaverso y experiencias inmersivas" },
  { id: 11, categoria: "Tecnología", nombre: "Impresión 3D y Fabricación Digital", descripcion: "Prototipado, manufactura aditiva y diseño digital-físico" },

  // ── Finanzas ──────────────────────────────────────────────
  { id: 12, categoria: "Finanzas", nombre: "Banca y Servicios Financieros",   descripcion: "Bancos, aseguradoras, fondos de inversión y fintech" },
  { id: 13, categoria: "Finanzas", nombre: "Fintech",                          descripcion: "Pagos digitales, cripto, neobancos y tecnología financiera" },
  { id: 14, categoria: "Finanzas", nombre: "Seguros",                          descripcion: "Aseguradoras, reaseguradoras y corredores de seguros" },
  { id: 15, categoria: "Finanzas", nombre: "Insurtech",                        descripcion: "Tecnología aplicada al sector asegurador" },
  { id: 16, categoria: "Finanzas", nombre: "Gestión de Inversiones",           descripcion: "Fondos, portafolios, family offices y asset management" },
  { id: 17, categoria: "Finanzas", nombre: "Capital de Riesgo y Private Equity", descripcion: "Fondos de venture capital, private equity y aceleradoras" },
  { id: 18, categoria: "Finanzas", nombre: "Contabilidad y Auditoría",         descripcion: "Firmas contables, auditorías externas y servicios fiscales" },
  { id: 19, categoria: "Finanzas", nombre: "Mercado de Capitales y Bolsa",     descripcion: "Bolsas de valores, brokers, trading y derivados financieros" },
  { id: 20, categoria: "Finanzas", nombre: "Microfinanzas y Cooperativas",     descripcion: "Crédito solidario, cooperativas de ahorro y microempresas" },

  // ── Salud ─────────────────────────────────────────────────
  { id: 21, categoria: "Salud", nombre: "Salud y Farmacéutica",            descripcion: "Hospitales, clínicas, laboratorios y farmacéuticas" },
  { id: 22, categoria: "Salud", nombre: "Biotecnología y Ciencias de la Vida", descripcion: "Investigación biomédica, genómica y dispositivos médicos" },
  { id: 23, categoria: "Salud", nombre: "Salud Digital y Telemedicina",    descripcion: "Plataformas de telemedicina, apps de salud y HIS/EHR" },
  { id: 24, categoria: "Salud", nombre: "Bienestar y Fitness",             descripcion: "Gimnasios, nutrición, wellness corporativo y spas" },
  { id: 25, categoria: "Salud", nombre: "Salud Mental",                    descripcion: "Psicología, psiquiatría, terapias y plataformas de bienestar emocional" },
  { id: 26, categoria: "Salud", nombre: "Medicina Veterinaria",            descripcion: "Clínicas veterinarias, farmacología animal y bienestar animal" },
  { id: 27, categoria: "Salud", nombre: "Dispositivos Médicos",            descripcion: "Fabricación y distribución de equipamiento médico y diagnóstico" },
  { id: 28, categoria: "Salud", nombre: "Óptica y Audiología",             descripcion: "Productos y servicios visuales y auditivos" },
  { id: 29, categoria: "Salud", nombre: "Odontología",                     descripcion: "Clínicas dentales, ortodoncia e implantología" },
  { id: 30, categoria: "Salud", nombre: "Medicina Estética y Cirugía Plástica", descripcion: "Estética médica, rejuvenecimiento y cirugías cosméticas" },

  // ── Educación ─────────────────────────────────────────────
  { id: 31, categoria: "Educación", nombre: "Educación Básica y Media",        descripcion: "Colegios, escuelas privadas y públicas, e institutos técnicos" },
  { id: 32, categoria: "Educación", nombre: "Educación Superior",              descripcion: "Universidades, politécnicos y centros de posgrado" },
  { id: 33, categoria: "Educación", nombre: "Educación en Línea y EdTech",     descripcion: "Plataformas LMS, MOOCs, capacitación corporativa digital" },
  { id: 34, categoria: "Educación", nombre: "Capacitación Corporativa",        descripcion: "Formación empresarial, e-learning B2B y desarrollo de talento" },
  { id: 35, categoria: "Educación", nombre: "Idiomas y Formación Internacional", descripcion: "Escuelas de idiomas, intercambios y certificaciones lingüísticas" },

  // ── Retail y Consumo ──────────────────────────────────────
  { id: 36, categoria: "Retail y Consumo", nombre: "Retail y Comercio",               descripcion: "Tiendas, supermercados, e-commerce y distribución" },
  { id: 37, categoria: "Retail y Consumo", nombre: "Alimentos y Bebidas",             descripcion: "Producción, distribución y retail de alimentos" },
  { id: 38, categoria: "Retail y Consumo", nombre: "Moda y Textil",                   descripcion: "Confección, diseño, calzado y accesorios" },
  { id: 39, categoria: "Retail y Consumo", nombre: "Cosmética y Cuidado Personal",    descripcion: "Belleza, cosméticos, higiene y cuidado del hogar" },
  { id: 40, categoria: "Retail y Consumo", nombre: "Productos de Lujo",               descripcion: "Joyería, relojes, artículos premium y marcas de lujo" },
  { id: 41, categoria: "Retail y Consumo", nombre: "Juguetes y Productos Infantiles", descripcion: "Fabricación y distribución de productos para niños" },
  { id: 42, categoria: "Retail y Consumo", nombre: "Mascotas y Pet Care",             descripcion: "Alimentos, accesorios, veterinaria y servicios para mascotas" },
  { id: 43, categoria: "Retail y Consumo", nombre: "Artículos del Hogar y Muebles",   descripcion: "Muebles, decoración, electrodomésticos y mejoras del hogar" },
  { id: 44, categoria: "Retail y Consumo", nombre: "Deporte y Artículos Deportivos",  descripcion: "Equipamiento deportivo, ropa técnica y tiendas especializadas" },
  { id: 45, categoria: "Retail y Consumo", nombre: "Librería y Papelería",            descripcion: "Venta de libros, material de oficina y productos educativos" },
  { id: 46, categoria: "Retail y Consumo", nombre: "Joyería y Relojería",             descripcion: "Diseño, fabricación y venta de joyería y relojes" },

  // ── Industria y Manufactura ───────────────────────────────
  { id: 47, categoria: "Industria y Manufactura", nombre: "Manufactura e Industria",         descripcion: "Fabricación, ensamblaje y producción industrial" },
  { id: 48, categoria: "Industria y Manufactura", nombre: "Automotriz",                      descripcion: "Fabricantes, concesionarios y servicios automotrices" },
  { id: 49, categoria: "Industria y Manufactura", nombre: "Movilidad Eléctrica",             descripcion: "Vehículos eléctricos, movilidad sostenible e infraestructura de carga" },
  { id: 50, categoria: "Industria y Manufactura", nombre: "Aeroespacial y Defensa",          descripcion: "Aviación, aeronáutica, defensa y equipamiento militar" },
  { id: 51, categoria: "Industria y Manufactura", nombre: "Química y Petroquímica",          descripcion: "Industria química, plásticos, fertilizantes y derivados" },
  { id: 52, categoria: "Industria y Manufactura", nombre: "Minería y Metales",               descripcion: "Extracción minera, metalurgia y procesamiento de minerales" },
  { id: 53, categoria: "Industria y Manufactura", nombre: "Papel y Celulosa",                descripcion: "Industria forestal, papel, cartón y packaging" },
  { id: 54, categoria: "Industria y Manufactura", nombre: "Vidrio, Cerámica y Materiales",   descripcion: "Materiales de construcción, vidrio industrial y cerámica" },
  { id: 55, categoria: "Industria y Manufactura", nombre: "Industria Textil y Confección",   descripcion: "Hilos, telas, fibras y procesos de confección a escala industrial" },
  { id: 56, categoria: "Industria y Manufactura", nombre: "Empaque y Packaging",             descripcion: "Diseño y producción de embalajes, envases y soluciones de packaging" },

  // ── Energía ───────────────────────────────────────────────
  { id: 57, categoria: "Energía", nombre: "Energía y Utilities",             descripcion: "Electricidad, gas, agua, petróleo y renovables" },
  { id: 58, categoria: "Energía", nombre: "Energías Renovables",             descripcion: "Solar, eólica, hidroeléctrica y almacenamiento de energía" },
  { id: 59, categoria: "Energía", nombre: "Petróleo y Gas",                  descripcion: "Exploración, extracción, refinación y distribución de hidrocarburos" },
  { id: 60, categoria: "Energía", nombre: "Gestión del Agua",                descripcion: "Tratamiento, distribución, saneamiento y tecnología hídrica" },
  { id: 61, categoria: "Energía", nombre: "Gestión de Residuos",             descripcion: "Reciclaje, tratamiento de residuos y economía circular" },
  { id: 62, categoria: "Energía", nombre: "Hidrógeno Verde y Nuevas Energías", descripcion: "Hidrógeno, biocombustibles, baterías y nuevas fuentes energéticas" },

  // ── Construcción e Inmobiliario ───────────────────────────
  { id: 63, categoria: "Construcción e Inmobiliario", nombre: "Construcción e Inmobiliario",     descripcion: "Constructoras, inmobiliarias y gestión de activos" },
  { id: 64, categoria: "Construcción e Inmobiliario", nombre: "Arquitectura e Ingeniería",       descripcion: "Diseño arquitectónico, ingeniería civil y consultoría de proyectos" },
  { id: 65, categoria: "Construcción e Inmobiliario", nombre: "Facilities y Gestión de Espacios", descripcion: "Administración de edificios, coworking y property management" },
  { id: 66, categoria: "Construcción e Inmobiliario", nombre: "Smart Buildings y PropTech",      descripcion: "Tecnología aplicada a edificios inteligentes y mercado inmobiliario" },
  { id: 67, categoria: "Construcción e Inmobiliario", nombre: "Infraestructura y Obra Pública",  descripcion: "Autopistas, puentes, aeropuertos y concesiones de infraestructura" },

  // ── Logística y Transporte ────────────────────────────────
  { id: 68, categoria: "Logística y Transporte", nombre: "Transporte y Logística",          descripcion: "Carga, courier, supply chain y movilidad" },
  { id: 69, categoria: "Logística y Transporte", nombre: "Logística y Cadena de Suministro", descripcion: "Almacenamiento, distribución, importación y exportación" },
  { id: 70, categoria: "Logística y Transporte", nombre: "Transporte de Pasajeros",         descripcion: "Aerolíneas, transporte terrestre, navieras y movilidad urbana" },
  { id: 71, categoria: "Logística y Transporte", nombre: "Logística de Última Milla",       descripcion: "Delivery, drone delivery y optimización de entregas urbanas" },
  { id: 72, categoria: "Logística y Transporte", nombre: "Transporte Marítimo y Portuario", descripcion: "Armadores, puertos, agentes navieros y logística marítima" },
  { id: 73, categoria: "Logística y Transporte", nombre: "Aviación y Aerolíneas",           descripcion: "Aerolíneas comerciales, carga aérea y mantenimiento de aeronaves" },
  { id: 74, categoria: "Logística y Transporte", nombre: "Ferroviario",                     descripcion: "Trenes de pasajeros, carga ferroviaria e infraestructura vial-férreo" },

  // ── Agroindustria ─────────────────────────────────────────
  { id: 75, categoria: "Agroindustria", nombre: "Agroindustria",   descripcion: "Agricultura, ganadería, pesca y agronegocios" },
  { id: 76, categoria: "Agroindustria", nombre: "Agritech",        descripcion: "Tecnología aplicada al agro, riego inteligente y gestión de cultivos" },
  { id: 77, categoria: "Agroindustria", nombre: "Acuicultura y Pesca", descripcion: "Pesca extractiva, acuicultura, mariscos y procesamiento marino" },
  { id: 78, categoria: "Agroindustria", nombre: "Silvicultura y Forestal", descripcion: "Explotación forestal sostenible, reforestación y madera" },

  // ── Telecomunicaciones y Medios ───────────────────────────
  { id: 79, categoria: "Telecomunicaciones y Medios", nombre: "Telecomunicaciones",              descripcion: "Operadores móviles, internet, cable y comunicaciones empresariales" },
  { id: 80, categoria: "Telecomunicaciones y Medios", nombre: "Medios y Entretenimiento",        descripcion: "TV, radio, prensa, streaming y producción de contenido" },
  { id: 81, categoria: "Telecomunicaciones y Medios", nombre: "Publicidad y Marketing Digital",  descripcion: "Agencias creativas, performance marketing y gestión de marcas" },
  { id: 82, categoria: "Telecomunicaciones y Medios", nombre: "Relaciones Públicas y Comunicación", descripcion: "Comunicación corporativa, PR, imagen institucional y crisis" },
  { id: 83, categoria: "Telecomunicaciones y Medios", nombre: "Videojuegos y Entretenimiento Digital", descripcion: "Desarrollo de juegos, esports y experiencias interactivas" },
  { id: 84, categoria: "Telecomunicaciones y Medios", nombre: "Música y Producción Audiovisual", descripcion: "Discográficas, productoras, streaming musical y cine/TV" },
  { id: 85, categoria: "Telecomunicaciones y Medios", nombre: "Medios Digitales y Contenido",    descripcion: "Creadores de contenido, podcasts, newsletters y medios nativos digitales" },
  { id: 86, categoria: "Telecomunicaciones y Medios", nombre: "Fotografía y Diseño Gráfico",     descripcion: "Estudios creativos, fotografía comercial y diseño visual" },

  // ── Turismo y Hostelería ──────────────────────────────────
  { id: 87, categoria: "Turismo y Hostelería", nombre: "Turismo y Hotelería",             descripcion: "Hoteles, agencias de viaje, restauración y turismo receptivo" },
  { id: 88, categoria: "Turismo y Hostelería", nombre: "Gastronomía y Restaurantes",      descripcion: "Restaurantes, franquicias de comida y servicios de catering" },
  { id: 89, categoria: "Turismo y Hostelería", nombre: "Turismo de Aventura y Naturaleza", descripcion: "Ecoturismo, turismo de aventura y experiencias al aire libre" },
  { id: 90, categoria: "Turismo y Hostelería", nombre: "Alojamiento Alternativo",         descripcion: "Airbnb, hostels, glamping y nuevas formas de hospedaje" },
  { id: 91, categoria: "Turismo y Hostelería", nombre: "Eventos y Turismo de Reuniones",  descripcion: "Organización de congresos, ferias, bodas y eventos corporativos" },

  // ── Gobierno y Tercer Sector ──────────────────────────────
  { id: 92, categoria: "Gobierno y Tercer Sector", nombre: "Gobierno y Sector Público",       descripcion: "Entidades estatales, municipios y organismos públicos" },
  { id: 93, categoria: "Gobierno y Tercer Sector", nombre: "ONG y Tercer Sector",             descripcion: "Fundaciones, asociaciones y organismos sin fines de lucro" },
  { id: 94, categoria: "Gobierno y Tercer Sector", nombre: "Organismos Internacionales",      descripcion: "Agencias de la ONU, BID, Banco Mundial y organismos multilaterales" },
  { id: 95, categoria: "Gobierno y Tercer Sector", nombre: "Partidos y Organizaciones Políticas", descripcion: "Partidos políticos, movimientos sociales y organizaciones civiles" },
  { id: 96, categoria: "Gobierno y Tercer Sector", nombre: "Religión e Instituciones Religiosas", descripcion: "Iglesias, congregaciones y organismos religiosos" },
  { id: 97, categoria: "Gobierno y Tercer Sector", nombre: "Sindicatos y Gremios",            descripcion: "Organizaciones de trabajadores, cámaras empresariales y gremios" },

  // ── Servicios Profesionales ───────────────────────────────
  { id: 98,  categoria: "Servicios Profesionales", nombre: "Consultoría y Servicios Profesionales", descripcion: "Auditoría, legal, RRHH y consultoría de negocio" },
  { id: 99,  categoria: "Servicios Profesionales", nombre: "Servicios Legales",              descripcion: "Firmas de abogados, notarías y servicios de cumplimiento normativo" },
  { id: 100, categoria: "Servicios Profesionales", nombre: "Recursos Humanos y Staffing",    descripcion: "Reclutamiento, headhunting, outsourcing de RRHH y nómina" },
  { id: 101, categoria: "Servicios Profesionales", nombre: "Investigación y Desarrollo (I+D)", descripcion: "Centros de investigación, laboratorios y transferencia tecnológica" },
  { id: 102, categoria: "Servicios Profesionales", nombre: "Outsourcing y BPO",              descripcion: "Externalización de procesos de negocio, call centers y back-office" },
  { id: 103, categoria: "Servicios Profesionales", nombre: "Traducción e Interpretación",    descripcion: "Servicios lingüísticos, localización y traducción técnica" },
  { id: 104, categoria: "Servicios Profesionales", nombre: "Gestión Empresarial y ERP",      descripcion: "Implementación de sistemas de gestión, ERP, CRM y software empresarial" },

  // ── Deportes ──────────────────────────────────────────────
  { id: 105, categoria: "Deportes", nombre: "Deportes",                       descripcion: "Clubes, federaciones, equipamiento deportivo y gestión de eventos" },
  { id: 106, categoria: "Deportes", nombre: "Deportes Electrónicos (Esports)", descripcion: "Organizaciones de esports, torneos y ligas de videojuegos competitivos" },
  { id: 107, categoria: "Deportes", nombre: "Fútbol Profesional",             descripcion: "Clubes, academias, gestión deportiva y marketing futbolístico" },

  // ── Arte, Cultura y Diseño ────────────────────────────────
  { id: 108, categoria: "Arte, Cultura y Diseño", nombre: "Arte y Cultura",                 descripcion: "Museos, galerías, fundaciones culturales y artes escénicas" },
  { id: 109, categoria: "Arte, Cultura y Diseño", nombre: "Diseño Industrial y de Producto", descripcion: "Diseño de objetos, packaging, ergonomía y prototipado" },
  { id: 110, categoria: "Arte, Cultura y Diseño", nombre: "Moda y Diseño de Autor",         descripcion: "Diseñadores independientes, couture y marcas de moda emergentes" },
  { id: 111, categoria: "Arte, Cultura y Diseño", nombre: "Arquitectura de Interiores",     descripcion: "Diseño de espacios interiores, decoración y retail design" },

  // ── Sostenibilidad ────────────────────────────────────────
  { id: 112, categoria: "Sostenibilidad", nombre: "Medioambiente y Sostenibilidad",     descripcion: "Consultoría ambiental, reciclaje, economía circular y ESG" },
  { id: 113, categoria: "Sostenibilidad", nombre: "Agricultura Sostenible y Orgánica",  descripcion: "Producción orgánica, permacultura y certificación sostenible" },
  { id: 114, categoria: "Sostenibilidad", nombre: "Carbono y Mercados de Compensación", descripcion: "Bonos de carbono, huella de carbono y offset climático" },

  // ── Web3 y Emergentes ─────────────────────────────────────
  { id: 115, categoria: "Web3 y Emergentes", nombre: "Blockchain y Web3",              descripcion: "Criptomonedas, contratos inteligentes, NFTs y descentralización" },
  { id: 116, categoria: "Web3 y Emergentes", nombre: "Criptoactivos y DeFi",           descripcion: "Finanzas descentralizadas, exchanges cripto y stablecoins" },
  { id: 117, categoria: "Web3 y Emergentes", nombre: "SpaceTech",                      descripcion: "Tecnología espacial, satélites, cohetes y exploración espacial comercial" },
  { id: 118, categoria: "Web3 y Emergentes", nombre: "Nanotecnología",                 descripcion: "Investigación y aplicaciones a escala nanométrica" },
  { id: 119, categoria: "Web3 y Emergentes", nombre: "Bioinformática y Genómica",      descripcion: "Análisis de datos biológicos, secuenciación genómica y medicina personalizada" },

  // ── Servicios al Consumidor ───────────────────────────────
  { id: 120, categoria: "Servicios al Consumidor", nombre: "Servicios Domésticos",             descripcion: "Limpieza, reparaciones del hogar, lavandería y servicios personales" },
  { id: 121, categoria: "Servicios al Consumidor", nombre: "Servicios Funerarios",             descripcion: "Empresas funerarias, crematorios y servicios de última disposición" },
  { id: 122, categoria: "Servicios al Consumidor", nombre: "Seguridad y Vigilancia",           descripcion: "Empresas de seguridad privada, alarmas, CCTV y ciberseguridad física" },
  { id: 123, categoria: "Servicios al Consumidor", nombre: "Cobranzas y Recuperación de Deuda", descripcion: "Gestión de cartera, cobranzas extrajudiciales y factoring" },

  // ── Otro ─────────────────────────────────────────────────
  { id: 124, categoria: "Otro", nombre: "Otro", descripcion: "Sector no listado" },
];


export const cargarCatalogos = async () => {
  try {
    const totalPaises = await Pais.count();
    if (totalPaises > 0) {
      console.log("ℹ Catálogos ya cargados.");
      return;
    }

    await Pais.bulkCreate(PAISES, { returning: false });
    await Ciudad.bulkCreate(CIUDADES, { returning: false });
    await Rubro.bulkCreate(RUBROS, { returning: false });
    await Estados.bulkCreate(ESTADOS, { returning: false });

    console.log("Catálogos cargados correctamente.");
  } catch (err) {
    console.error("Error al cargar catálogos:", err.message);
    throw err;
  }
};

