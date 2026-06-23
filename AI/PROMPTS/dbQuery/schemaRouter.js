const KEYWORDS = {
  clientes: [
    'cliente', 'empresa', 'compañia', 'compania', 'rubro', 'referido',
    'precio hora', 'direccion', 'razon social', 'cliente nuevo', 'cliente activo',
    'porcentaje gobierno', 'nota cliente',
  ],
  proyectos: [
    'proyecto', 'lead', 'aprobado', 'rechazado', 'ejecuc', 'stand by',
    'precio hora desarrollo', 'precio hora soporte', 'precio hora cambio',
    'proyecto activo', 'area proyecto', 'rol proyecto', 'usuario cliente proyecto',
  ],
  procesos: [
    'proceso', 'automatizac', 'nombre proceso', 'prioridad', 'solicitud de cambio',
    'proyecto nuevo', 'tipo proceso', 'fecha creacion proceso',
    'bajo', 'medio', 'alto', 'muy alto',
  ],
  seguimientos: [
    'seguimiento', 'contacto', 'llamada', 'reunion', 'whatsapp', 'linkedin',
    'videollamada', 'negociacion', 'proximo contacto', 'resultado contacto',
    'medio contacto', 'programado', 'completado', 'cancelado', 'demo', 'propuesta cliente',
  ],
  consultores: [
    'consultor', 'admin', 'equipo', 'asignado', 'vistas', 'vista', 'acceso', 'permiso',
    'responsable', 'creado por', 'actualizado por', 'fecha ingreso',
  ],
  etapas: [
    'etapa', 'horas', 'fecha inicio', 'fecha fin', 'levantamiento', 'estimacion',
    'propuesta', 'preliminar', 'aprobacion', 'ejecucion', 'cierre', 'facturado',
    'rechazado', 'stand_by', 'proximos pasos', 'observacion', 'interaccion',
    'horas reales', 'horas presupuestadas', 'valor presupuestado', 'nivel detalle',
    'hito', 'forma de pago', 'probabilidad', 'viable', 'resultado preliminar',
    'fecha cierre', 'fecha propuesta', 'fecha aprobacion', 'fecha rechazo',
    'motivo rechazo etapa', 'recuperable', 'fecha recontacto', 'condicion reactivar',
    'fecha pausa', 'fecha retorno', 'numero factura', 'valor facturado',
    'estado cobro', 'dias credito', 'fecha vencimiento factura', 'item factura',
    'captcha', 'ocr', 'idp', 'inteligencia artificial estimacion', 'tokens',
    'volumen transaccional', 'tiempo ejecucion transaccion',
    'costo mensual', 'requiere captcha', 'requiere ocr', 'requiere ia',
  ],
  herramientas: [
    'herramienta', 'rpa', 'uipath', 'automation anywhere', 'fabricante',
    'bot', 'asignacion herramienta', 'herramienta rpa', 'licencia herramienta',
  ],
  licencias: [
    'licencia', 'activada', 'desactivada', 'renovacion', 'ip maquina', 'valor anual',
    'cod licencia', 'expiracion', 'fecha estado', 'motivo desactivacion',
    'licencia proceso', 'fecha inicio licencia',
  ],
  soporte: [
    'soporte', 'paquete soporte', 'tarifa soporte', 'horario', 'dias soporte',
    'motivo rechazo soporte', 'fecha inicio soporte', 'valor paquete',
    'horas soporte', 'propuesta soporte', 'responsable cliente soporte',
    'fecha aprobacion soporte', 'fecha fin soporte',
  ],
  geografico: [
    'pais', 'ciudad', 'region', 'codigo iso', 'ubicacion', 'pais cliente',
  ],
  envio: [
    'enviar', 'archivo', 'adjuntar', 'correo', 'email', 'mandar',
    'reenviar', 'compartir', 'enviar documento', 'enviar reporte',
  ],
};

const SCHEMA_FRAGMENTS = {
  clientes: `
── clientes (id UUID, empresa VARCHAR(150) UNIQUE, pais_id→paises, ciudad_id→ciudades, direccion VARCHAR(255), rubro_id→rubros, estado_id→estados, referido_por VARCHAR(200), precio_hora_desarrollo DECIMAL, precio_hora_soporte DECIMAL, precio_hora_cambio DECIMAL, porcentaje_gobierno DECIMAL(5,2), nota TEXT, createdAt, updatedAt)
   NOTA: clientes NO tiene campo "nombre"; el nombre de la empresa es "empresa".
── paises (id INT autoincrement, nombre VARCHAR(100) UNIQUE, codigo_iso CHAR(3)) — sin timestamps
── ciudades (id INT autoincrement, nombre VARCHAR(120), pais_id→paises) — sin timestamps
── rubros (id INT autoincrement, nombre VARCHAR(120) UNIQUE, descripcion TEXT) — sin timestamps
── estados (id UUID, nombre VARCHAR UNIQUE, activo BOOL, createdAt, updatedAt)

── IDs DE RUBROS MÁS COMUNES (usar rubro_id en clientes):
   Tecnología: 1=Tecnología e Informática, 2=Desarrollo de Software, 3=Ciberseguridad,
     4=Inteligencia Artificial y Data, 5=Cloud e Infraestructura, 6=E-commerce,
     8=Robótica y Automatización
   Finanzas: 12=Banca y Servicios Financieros, 13=Fintech, 14=Seguros, 18=Contabilidad y Auditoría
   Salud: 21=Salud y Farmacéutica, 23=Salud Digital y Telemedicina
   Educación: 31=Educación Básica y Media, 32=Educación Superior, 33=Educación en Línea
   Retail: 36=Retail y Comercio, 37=Alimentos y Bebidas, 38=Moda y Textil
   Industria: 47=Manufactura e Industria, 48=Automotriz, 52=Minería y Metales
   Energía: 57=Energía y Utilities, 58=Energías Renovables, 59=Petróleo y Gas
   Construcción: 63=Construcción e Inmobiliario, 64=Arquitectura e Ingeniería
   Logística: 68=Transporte y Logística, 69=Logística y Cadena de Suministro
   Agro: 75=Agroindustria, 76=Agritech
   Telecom: 79=Telecomunicaciones, 80=Medios y Entretenimiento, 81=Publicidad y Marketing
   Turismo: 87=Turismo y Hotelería, 88=Gastronomía y Restaurantes
   Gobierno: 92=Gobierno y Sector Público, 93=ONG y Tercer Sector
   Servicios: 98=Consultoría y Servicios Profesionales, 99=Servicios Legales,
     100=Recursos Humanos y Staffing, 102=Outsourcing y BPO
   Otro: 124=Otro
   NOTA: si el usuario menciona un rubro en texto, inferir el id más cercano de esta lista.

── ESTADOS PARA CLIENTES (usar estado_id — son UUID, buscar por nombre en tabla estados):
   Estados comunes: 'Lead', 'Contactado', 'Activo', 'Inactivo'
   NOTA: estados.id es UUID; para INSERT/UPDATE usar subconsulta:
     (SELECT id FROM estados WHERE nombre = 'Activo')`,

  proyectos: `
── proyectos (id UUID, cliente_id→clientes, nombre VARCHAR, descripcion TEXT, estado_id→estados, activo BOOL, precio_hora_desarrollo DECIMAL(10,2), precio_hora_soporte DECIMAL(10,2), precio_hora_cambio DECIMAL(10,2), porcentaje_gobierno DECIMAL(5,2), createdAt, updatedAt)
── proyecto_area (id UUID, proyecto_id→proyectos, area_id→areas, createdAt, updatedAt)
── areas (id UUID, nombre VARCHAR, descripcion TEXT, activo BOOL, createdAt, updatedAt)
── proyecto_usuario_rol (id UUID, proyecto_id→proyectos, usuario_cliente_id→usuario_cliente, rol_id→roles, fecha_asignacion DATE, activo BOOL, nota TEXT, createdAt, updatedAt)
── roles (id UUID, nombre VARCHAR, descripcion TEXT, activo BOOL, createdAt, updatedAt)
── estado_proyecto (id UUID, proyecto_id→proyectos, consultor_id→consultores, estado_id→estados, observacion TEXT, fecha DATE, createdAt, updatedAt)`,

  procesos: `
── procesos (id UUID, proyecto_id→proyectos, nombre_proceso VARCHAR, tipo ENUM('Proyecto Nuevo','Solicitud de Cambio'), estado_id→estados, prioridad ENUM('Bajo','Medio','Alto','Muy Alto'), fecha_creacion DATE, createdAt, updatedAt)
   NOTA: procesos NO tiene herramienta_rpa_id directo ni probabilidad_aprobacion. Las herramientas se vinculan por pivote.
── proceso_herramientas (id UUID, proceso_id→procesos, herramienta_rpa_id→herramientas_rpa) — pivote M:M, sin timestamps
── interaccion (id UUID, proceso_id→procesos, consultor_id→consultores, tipo VARCHAR, descripcion TEXT, fecha DATE) — sin createdAt/updatedAt`,

  seguimientos: `
── seguimientos_clientes (id UUID, cliente_id→clientes, consultor_id→consultores, usuario_cliente_id→usuario_cliente nullable, fecha DATEONLY, fecha_proxima_accion DATEONLY, medio ENUM('email','telefono','videollamada','presencial','whatsapp','linkedin','otro'), tipo ENUM('llamada','reunion','negociacion','contacto','demo','propuesta','seguimiento','otro'), descripcion TEXT, resultado TEXT, estado ENUM('programado','completado','cancelado'), contexto_seguimiento JSON, createdAt, updatedAt)
── usuario_cliente (id UUID, cliente_id→clientes, nombre VARCHAR, email VARCHAR, telefono VARCHAR, linkedin VARCHAR, cargo VARCHAR, activo BOOL, createdAt, updatedAt)`,

  consultores: `
── consultores (id UUID, nombre VARCHAR, email VARCHAR, rol ENUM('consultor','admin'), telefono VARCHAR, activo BOOL, fecha_ingreso DATEONLY, createdAt, updatedAt)`,

  etapas: `
── FLUJO DE ETAPAS POR PROCESO (proceso_id en cada tabla, todas sin timestamps salvo etapa_estimacion):

── etapa_levantamiento (id UUID, proceso_id UNIQUE→procesos, fecha_levantamiento DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_levantamiento (id UUID, etapa_levantamiento_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_levantamiento_consultor(etapa_levantamiento_id, consultor_id), interaccion_levantamiento_consultor(interaccion_levantamiento_id, consultor_id)

── etapa_estimacion (id UUID, proceso_id UNIQUE→procesos, fecha_estimacion DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados, volumen_transaccional_mensual INT, tiempo_ejecucion_transaccion DECIMAL(10,2), requiere_captcha BOOL, volumen_captcha_mes INT, costo_mensual_captcha DECIMAL(12,2), requiere_ai BOOL, ai_para_que TEXT, ai_nombre VARCHAR(120), ai_metodo_pago VARCHAR(80), ai_volumen_mensual_tokens INT, costo_mensual_ai DECIMAL(12,2), requiere_ocr BOOL, ocr_nombre VARCHAR(120), ocr_volumen_mensual INT, ocr_costo DECIMAL(12,2), requiere_idp BOOL, idp_documentos TEXT, idp_volumen_mensual INT, costo_mensual_idp DECIMAL(12,2), createdAt, updatedAt) — CON timestamps
   NOTA: se agregaron costo_mensual_captcha, costo_mensual_ai, costo_mensual_idp respecto a versión anterior.
   └─ interaccion_estimacion (id UUID, etapa_estimacion_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_estimacion_consultor, interaccion_estimacion_consultor

── etapa_preliminar (id UUID, proceso_id UNIQUE→procesos, fecha_preliminar DATE, resultado VARCHAR, observaciones TEXT, probabilidad ENUM('Alta','Media','Baja')) — sin timestamps, sin estado_id, sin viable
   NOTA: se reemplazó el campo "viable BOOL" por "probabilidad ENUM('Alta','Media','Baja')".
   └─ pivote: etapa_preliminar_consultor(etapa_preliminar_id, consultor_id)

── etapa_propuesta (id UUID, proceso_id UNIQUE→procesos, nivel_detalle VARCHAR, fecha_entrega_propuesta DATE, horas_presupuestadas INT, valor_presupuestado DECIMAL, horas_gerencia INT, valor_gerencia DECIMAL, observaciones TEXT, estado_id→estados, hito_inicio_pct DECIMAL default 30, hito_pruebas_pct DECIMAL default 50, hito_estabilizacion_pct DECIMAL default 20, lic_forma_pago VARCHAR, ocr_forma_pago VARCHAR, captcha_forma_pago VARCHAR, soporte_forma_pago VARCHAR, idp_forma_pago VARCHAR, ia_forma_pago VARCHAR) — sin timestamps
   NOTA: se agregaron campos de hitos (%) y formas de pago por componente (lic, ocr, captcha, soporte, idp, ia).
   └─ interaccion_propuesta (id UUID, etapa_propuesta_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_propuesta_consultor, interaccion_propuesta_consultor

── etapa_aprobacion (id UUID, proceso_id UNIQUE→procesos, aprobado BOOL, fecha_aprobacion DATE, motivo_rechazo VARCHAR, fecha_rechazo DATE, observaciones TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_aprobacion (id UUID, etapa_aprobacion_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_aprobacion_consultor, interaccion_aprobacion_consultor

── etapa_aprobado (id UUID, proceso_id UNIQUE→procesos, fecha_aprobado DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_aprobado (id UUID, etapa_aprobado_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_aprobado_consultor, interaccion_aprobado_consultor

── etapa_ejecucion (id UUID, proceso_id UNIQUE→procesos, fecha_inicio DATE, fecha_fin DATE, horas_reales INT, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_ejecucion (id UUID, etapa_ejecucion_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_ejecucion_consultor, interaccion_ejecucion_consultor

── etapa_cierre (id UUID, proceso_id UNIQUE→procesos, fecha_cierre DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados, horas_reales INT) — sin timestamps
   NOTA: etapa_cierre ahora incluye horas_reales INT.
   └─ interaccion_cierre (id UUID, etapa_cierre_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_cierre_consultor, interaccion_cierre_consultor

── etapa_facturado (id UUID, proceso_id UNIQUE→procesos, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   NOTA: etapa_facturado ya NO tiene numero_factura, fecha_factura, valor_facturado, fecha_vencimiento ni estado_cobro directamente.
         Esos datos se almacenan en etapa_facturado_item (relación 1:N).
   └─ etapa_facturado_item (id UUID, etapa_facturado_id→etapa_facturado, nombre VARCHAR, numero_factura VARCHAR, fecha_factura DATEONLY, dias_credito INT default 0, fecha_vencimiento DATEONLY, valor_facturado DECIMAL(12,2), estado_cobro ENUM('Pendiente','Pagado','Vencido','Anulado') default 'Pendiente') — sin timestamps
   └─ interaccion_facturado (id UUID, etapa_facturado_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_facturado_consultor, interaccion_facturado_consultor

── etapa_rechazado (id UUID, proceso_id UNIQUE→procesos, fecha_rechazo DATE, motivo_categoria ENUM('Precio','Presupuesto','Competencia','Tiempo','Alcance','Decisión interna','Sin respuesta','Otro'), motivo_detalle TEXT, decision_por VARCHAR, recuperable ENUM('Sí','No','Posiblemente'), fecha_recontacto DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_rechazado (id UUID, etapa_rechazado_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_rechazado_consultor, interaccion_rechazado_consultor

── etapa_stand_by (id UUID, proceso_id UNIQUE→procesos, fecha_inicio_pausa DATE, fecha_estimada_retorno DATE, motivo_categoria ENUM('Presupuesto congelado','Decisión pendiente','Cambio interno cliente','Espera técnica','Prioridad baja','Retraso externo','Otro'), motivo_detalle TEXT, decision_por VARCHAR, condicion_reactivar TEXT, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_stand_by (id UUID, etapa_stand_by_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_stand_by_consultor, interaccion_stand_by_consultor`,

  herramientas: `
── herramientas_rpa (id UUID, nombre VARCHAR, fabricante VARCHAR, activo BOOL, createdAt, updatedAt)
── asignacion_herramienta (id UUID, proyecto_id→proyectos, herramienta_rpa_id→herramientas_rpa, cod_licencia VARCHAR, fecha_asignacion DATE, fecha_expiracion DATE, estado ENUM('Activa','Suspendida','Expirada','Revocada'), motivo_cambio TEXT, asignado_por→consultores, createdAt, updatedAt)
── proceso_herramientas (id UUID, proceso_id→procesos, herramienta_rpa_id→herramientas_rpa) — pivote M:M, sin timestamps`,

  licencias: `
── licencias (id UUID, cliente_id→clientes, herramienta_id→herramientas_rpa, estado ENUM('Activada','Desactivada'), fecha_inicio DATEONLY, renovacion ENUM('mensual','anual','2 años','3 años'), valor_anual DECIMAL(12,2), ip_maquina VARCHAR(45), fecha_estado DATEONLY, motivo_desactivacion TEXT, created_by→consultores, updated_by→consultores, createdAt, updatedAt)
   NOTA: el FK hacia herramientas es "herramienta_id" (NO herramienta_rpa_id). licencias NO tiene cod_licencia propio.
── licencia_proceso (id UUID, licencia_id→licencias, proceso_id→procesos) — pivote M:M, sin timestamps`,

  soporte: `
── soportes (id UUID, cliente_id→clientes, responsable_cliente_id→usuario_cliente nullable, created_by→consultores, updated_by→consultores, estado ENUM('En Aprobación','Aprobado','Rechazado'), propuesta TEXT, horas INT, tarifa DECIMAL(12,2), valor_paquete DECIMAL(12,2), fecha_inicio DATEONLY, fecha_fin DATEONLY, horario VARCHAR(100), dias JSON, observacion TEXT, fecha_aprobacion DATEONLY, fecha_rechazo DATEONLY, motivo_rechazo TEXT, fecha_inicio_soporte DATEONLY, createdAt, updatedAt)
   NOTA: el campo es "observacion" (sin 's'), no "observaciones".`,

  geografico: `
── paises (id INT autoincrement, nombre VARCHAR(100) UNIQUE, codigo_iso CHAR(3)) — sin timestamps
── ciudades (id INT autoincrement, nombre VARCHAR(120), pais_id→paises) — sin timestamps

── IDs DE PAÍSES MÁS USADOS (Latinoamérica):
   1=Argentina, 2=Bolivia, 3=Brasil, 4=Chile, 5=Colombia, 6=Ecuador,
   7=Paraguay, 8=Perú, 9=Uruguay, 10=Venezuela, 14=Costa Rica, 16=El Salvador,
   17=Guatemala, 18=Honduras, 19=México, 20=Nicaragua, 21=Panamá,
   23=República Dominicana, 32=Estados Unidos, 33=Canadá, 34=España, 122=Otro

── CIUDADES SELECCIONADAS POR PAÍS (id, pais_id, nombre):
   — Ecuador (pais_id=6): 89=Quito, 90=Guayaquil, 91=Cuenca, 92=Ambato, 93=Manta,
     94=Loja, 95=Santo Domingo, 96=Machala, 97=Esmeraldas, 98=Ibarra,
     99=Riobamba, 100=Portoviejo, 104=Milagro, 105=Durán, 107=Manabí, 573=Otra ciudad
   — Colombia (pais_id=5): 71=Bogotá, 72=Medellín, 73=Cali, 74=Barranquilla,
     75=Cartagena, 76=Bucaramanga, 77=Pereira, 78=Cúcuta, 79=Manizales
   — Perú (pais_id=8): 118=Lima, 119=Arequipa, 120=Trujillo, 121=Chiclayo,
     122=Piura, 123=Iquitos, 124=Cusco
   — Chile (pais_id=4): 56=Santiago, 57=Valparaíso, 58=Concepción, 59=Antofagasta,
     60=La Serena, 61=Temuco, 62=Iquique, 70=Punta Arenas
   — Argentina (pais_id=1): 1=Buenos Aires, 2=Córdoba, 3=Rosario, 4=Mendoza,
     5=La Plata, 6=San Miguel de Tucumán
   — México (pais_id=19): 193=Ciudad de México, 194=Guadalajara, 195=Monterrey,
     196=Puebla, 197=Tijuana, 200=Mérida, 201=Cancún
   — Bolivia (pais_id=2): 26=La Paz, 27=Santa Cruz de la Sierra, 28=Cochabamba,
     29=Oruro, 30=Sucre
   — Venezuela (pais_id=10): 144=Caracas, 145=Maracaibo, 146=Valencia, 147=Barquisimeto
   — Paraguay (pais_id=7): 109=Asunción, 110=Ciudad del Este, 111=Encarnación
   — Uruguay (pais_id=9): 135=Montevideo, 136=Salto, 140=Maldonado
   — España (pais_id=34): 286=Madrid, 287=Barcelona, 288=Valencia, 289=Sevilla
   — Estados Unidos (pais_id=32): 252=Nueva York, 253=Los Ángeles, 254=Miami,
     255=Chicago, 258=San Francisco, 262=Washington D.C.
   — Otro (pais_id=122): 573=Otra ciudad

── NOTA PARA REGISTRO: cuando el usuario diga una ciudad/país en texto, buscar el id
   correspondiente en esta lista y usar el id numérico en pais_id y ciudad_id de clientes.
   Si no aparece en la lista, usar pais_id=122 (Otro) y ciudad_id=573 (Otra ciudad).`,

  envio: `
── ACCIÓN: ENVIAR ARCHIVO A CONSULTOR
   Requiere: consultor_email (de tabla consultores), asunto, mensaje, archivo (adjunto o link)
   La tabla consultores contiene: id, nombre, email.
   No es una consulta SELECT; es una operación de escritura que debe manejarse por endpoint /api/email/enviar-archivo.
   Si el usuario expresa intención de enviar archivo a un consultor, recopila:
     - consultor (nombre o email)
     - asunto (si no lo da, usa "Documento compartido")
     - mensaje (opcional)
     - archivo (si el usuario adjuntó un archivo, se usará esa URL; si no, se puede pedir que lo adjunte)
   `,
};

const RULES = `
REGLAS: Solo SELECT. LIMIT 50. LOWER() para texto. MySQL solo (no PostgreSQL).
Alias: c=clientes,co=consultores,p=proyectos,pr=procesos,uc=usuario_cliente,sc=seguimientos_clientes,s=soportes,l=licencias,h=herramientas_rpa.
Fechas: NOW(),CURDATE(),DATE_SUB(),DATE_FORMAT().
clientes NO tiene campo "nombre", usa "empresa".
estados.nombre es un VARCHAR (ej: 'Activo', 'Lead', 'En Ejecución'); los FK estado_id son UUID en todas las tablas principales.
procesos NO tiene herramienta_rpa_id directo → usar JOIN proceso_herramientas.
procesos NO tiene probabilidad_aprobacion ni tipo_proceso ni fecha_lead; tiene createdAt y updatedAt.
licencias: el FK a herramientas es "herramienta_id" (no herramienta_rpa_id).
soportes: el campo de nota es "observacion" (sin 's').
etapa_estimacion es la ÚNICA etapa con createdAt/updatedAt; el resto de etapas e interacciones NO tienen timestamps.
etapa_preliminar usa "probabilidad" ENUM('Alta','Media','Baja'); NO tiene campo "viable".
etapa_cierre tiene "horas_reales" INT.
etapa_facturado NO tiene campos de factura directamente; usar JOIN etapa_facturado_item para numero_factura, fecha_factura, valor_facturado, dias_credito, fecha_vencimiento, estado_cobro.
etapa_propuesta tiene hitos (hito_inicio_pct, hito_pruebas_pct, hito_estabilizacion_pct) y formas de pago por componente (lic_forma_pago, ocr_forma_pago, captcha_forma_pago, soporte_forma_pago, idp_forma_pago, ia_forma_pago).
etapa_estimacion tiene costos mensuales: costo_mensual_captcha, costo_mensual_ai, costo_mensual_idp.
RESOLUCIÓN GEOGRÁFICA: cuando el usuario mencione ciudad o país en texto al registrar, resolver automáticamente el id numérico desde el catálogo incluido en el schema. NUNCA pedir pais_id o ciudad_id manualmente; inferirlo del nombre. Si no está en el catálogo usar pais_id=122 y ciudad_id=573.
RESOLUCIÓN DE RUBROS: cuando el usuario mencione el rubro/sector en texto, inferir el rubro_id más cercano del catálogo. NUNCA pedir el id numérico al usuario.
RESOLUCIÓN DE ESTADOS: para estado_id en INSERT/UPDATE usar subconsulta (SELECT id FROM estados WHERE nombre='X').
NUNCA expongas: password, token_verificacion, google_token.`;

export function resolveSchemaFragments(pregunta, historial = []) {
  const texto = (pregunta + ' ' + historial.map(m => m.contenido).join(' ')).toLowerCase();

  const dominios = new Set();
  for (const [dominio, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some(k => texto.includes(k))) {
      dominios.add(dominio);
    }
  }

  if (dominios.size === 0 || dominios.size >= 5) {
    return Object.values(SCHEMA_FRAGMENTS).join('\n') + '\n' + RULES;
  }

  if (dominios.has('etapas'))    dominios.add('consultores');
  if (dominios.has('etapas'))    dominios.add('procesos');
  if (dominios.has('licencias')) dominios.add('herramientas');
  if (dominios.has('soporte'))   dominios.add('clientes');
  if (dominios.has('proyectos') || dominios.has('seguimientos')) dominios.add('clientes');
  if (dominios.has('procesos'))  dominios.add('proyectos');

  const schemaSeleccionado = [...dominios].map(d => SCHEMA_FRAGMENTS[d]).filter(Boolean).join('\n');
  return schemaSeleccionado + '\n' + RULES;
}