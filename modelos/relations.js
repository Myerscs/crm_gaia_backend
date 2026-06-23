import { Estados } from "./Estados.js";
import { Pais } from "./Pais.js";
import { Ciudad } from "./Ciudad.js";
import { Rubro } from "./Rubro.js";
import { Rol } from "./Rol.js";
import { Consultor } from "./Consultor.js";
import { Cliente } from "./Cliente.js";
import { UsuarioCliente } from "./UsuarioCliente.js";
import { Area } from "./Area.js";
import { HerramientaRpa } from "./HerramientaRpa.js";
import { Proyecto } from "./Proyecto.js";
import { Proceso } from "./Proceso.js";
import { EtapaLevantamiento } from "./EtapaLevantamiento.js";
import { EtapaEstimacion } from "./EtapaEstimacion.js";
import { EtapaPropuesta } from "./EtapaPropuesta.js";
import { EtapaPreliminar } from "./EtapaPreliminar.js";
import { EtapaAprobacion } from "./EtapaAprobacion.js";
import { EtapaEjecucion } from "./EtapaEjecucion.js";
import { Interaccion } from "./Interaccion.js";
import { InteraccionLevantamiento } from "./InteraccionLevantamiento.js";
import { InteraccionEstimacion } from "./InteraccionEstimacion.js";
import { Soporte } from "./Soporte.js";
import { Licencia } from "./Licencia.js";
import { LicenciaProceso } from "./LicenciaProceso.js";
import { ProyectoArea } from "./ProyectoArea.js";
import { ProyectoUsuarioRol } from "./ProyectoUsuarioRol.js";
import { AsignacionHerramientas } from "./AsignacionHerramientas.js";
import { ProcesoHerramienta } from "./ProcesoHerramienta.js";
import { EtapaLevantamientoConsultor } from "./EtapaLevantamientoConsultor.js";
import { EtapaEstimacionConsultor } from "./EtapaEstimacionConsultor.js";
import { EtapaPropuestaConsultor } from "./EtapaPropuestaConsultor.js";
import { EtapaEjecucionConsultor } from "./EtapaEjecucionConsultor.js";
import { EtapaAprobacionConsultor } from "./EtapaAprobacionConsultor.js";
import { EtapaPreliminarConsultor } from "./EtapaPreliminarConsultor.js";
import { InteraccionLevantamientoConsultor } from "./InteraccionLevantamientoConsultor.js";
import { InteraccionEstimacionConsultor } from "./InteraccionEstimacionConsultor.js";
import { InteraccionPropuesta } from "./InteraccionPropuesta.js";
import { InteraccionPropuestaConsultor } from "./InteraccionPropuestaConsultor.js";
import { EstadoProyecto } from "./EstadoProyecto.js";
import { Chat } from "./Chat.js";
import { ContextoChat } from "./ContextoChat.js";
import { Mensaje } from "./Mensajes.js";
import User from "./User.js";
import { SeguimientoCliente } from "./SeguimientoCliente.js";
import { InteraccionAprobacion } from "./InteraccionAprobacion.js";
import { InteraccionAprobacionConsultor } from "./InteraccionAprobacionConsultor.js";
import { SeguimientoContacto } from "./SeguimientoContacto.js";
import { EtapaAprobado } from "./EtapaAprobado.js";
import { EtapaAprobadoConsultor } from "./EtapaAprobadoConsultor.js";
import { InteraccionAprobado } from "./InteraccionAprobado.js";
import { InteraccionAprobadoConsultor } from "./InteraccionAprobadoConsultor.js";
import { InteraccionEjecucion } from "./InteraccionEjecucion.js";
import { InteraccionEjecucionConsultor } from "./InteraccionEjecucionConsultor.js";
import { EtapaCierre } from "./EtapaCierre.js";
import { EtapaCierreConsultor } from "./EtapaCierreConsultor.js";
import { InteraccionCierre } from "./InteraccionCierre.js";
import { InteraccionCierreConsultor } from "./InteraccionCierreConsultor.js";
import { EtapaFacturado } from "./EtapaFacturado.js";
import { EtapaFacturadoConsultor } from "./EtapaFacturadoConsultor.js";
import { EtapaFacturadoItem } from "./EtapaFacturadoItem.js";
import { InteraccionFacturado } from "./InteraccionFacturado.js";
import { InteraccionFacturadoConsultor } from "./InteraccionFacturadoConsultor.js";
import { EtapaRechazado } from "./EtapaRechazado.js";
import { EtapaRechazadoConsultor } from "./EtapaRechazadoConsultor.js";
import { InteraccionRechazado } from "./InteraccionRechazado.js";
import { InteraccionRechazadoConsultor } from "./InteraccionRechazadoConsultor.js";
import { EtapaStandBy } from "./EtapaStandBy.js";
import { EtapaStandByConsultor } from "./EtapaStandByConsultor.js";
import { InteraccionStandBy } from "./InteraccionStandBy.js";
import { InteraccionStandByConsultor } from "./InteraccionStandByConsultor.js";


Cliente.hasMany(Proyecto,       { foreignKey: "cliente_id", as: "proyectos", onDelete: "CASCADE" });
Cliente.hasMany(UsuarioCliente, { foreignKey: "cliente_id", as: "usuarios",  onDelete: "CASCADE" });
Proyecto.belongsTo(Cliente,       { foreignKey: "cliente_id", as: "cliente" });
UsuarioCliente.belongsTo(Cliente, { foreignKey: "cliente_id", as: "cliente" });

Proyecto.belongsToMany(Area, { through: ProyectoArea, foreignKey: "proyecto_id", otherKey: "area_id", as: "areas" });
Area.belongsToMany(Proyecto, { through: ProyectoArea, foreignKey: "area_id", otherKey: "proyecto_id", as: "proyectos" });
ProyectoArea.belongsTo(Proyecto, { foreignKey: "proyecto_id" });
ProyectoArea.belongsTo(Area,     { foreignKey: "area_id" });

Proyecto.belongsToMany(UsuarioCliente, { through: ProyectoUsuarioRol, foreignKey: "proyecto_id", otherKey: "usuario_cliente_id", as: "miembros" });
UsuarioCliente.belongsToMany(Proyecto, { through: ProyectoUsuarioRol, foreignKey: "usuario_cliente_id", otherKey: "proyecto_id", as: "proyectos" });
ProyectoUsuarioRol.belongsTo(Proyecto,       { foreignKey: "proyecto_id" });
ProyectoUsuarioRol.belongsTo(UsuarioCliente, { foreignKey: "usuario_cliente_id", as: "usuario" });
ProyectoUsuarioRol.belongsTo(Rol,            { foreignKey: "rol_id", as: "rol" });
Rol.hasMany(ProyectoUsuarioRol, { foreignKey: "rol_id" });

HerramientaRpa.hasMany(AsignacionHerramientas, { foreignKey: "herramienta_rpa_id", as: "asignaciones" });
AsignacionHerramientas.belongsTo(HerramientaRpa, { foreignKey: "herramienta_rpa_id", as: "herramienta" });
AsignacionHerramientas.belongsTo(Proyecto,       { foreignKey: "proyecto_id",        as: "proyecto"   });
AsignacionHerramientas.belongsTo(Consultor,      { foreignKey: "asignado_por",        as: "asignadoPor" });
Proyecto.hasMany(AsignacionHerramientas, { foreignKey: "proyecto_id", as: "herramientas", onDelete: "CASCADE" });

Proceso.belongsToMany(HerramientaRpa, { through: ProcesoHerramienta, foreignKey: "proceso_id",         otherKey: "herramienta_rpa_id", as: "herramientas" });
HerramientaRpa.belongsToMany(Proceso, { through: ProcesoHerramienta, foreignKey: "herramienta_rpa_id", otherKey: "proceso_id",         as: "procesos" });

Proyecto.hasMany(EstadoProyecto,   { foreignKey: "proyecto_id",  as: "historial_estados", onDelete: "CASCADE" });
EstadoProyecto.belongsTo(Proyecto, { foreignKey: "proyecto_id" });
EstadoProyecto.belongsTo(Consultor,{ foreignKey: "consultor_id", as: "consultor" });
EstadoProyecto.belongsTo(Estados,  { foreignKey: "estado_id",    as: "estado" });
Consultor.hasMany(EstadoProyecto,  { foreignKey: "consultor_id" });

Proyecto.hasMany(Proceso, { foreignKey: "proyecto_id", as: "procesos", onDelete: "CASCADE" });
Proceso.belongsTo(Proyecto, { foreignKey: "proyecto_id", as: "proyecto" });

Proceso.hasOne(EtapaLevantamiento, { foreignKey: "proceso_id", as: "levantamiento", onDelete: "CASCADE" });
Proceso.hasOne(EtapaEstimacion,    { foreignKey: "proceso_id", as: "estimacion",    onDelete: "CASCADE" });
Proceso.hasOne(EtapaPropuesta,     { foreignKey: "proceso_id", as: "propuesta",     onDelete: "CASCADE" });
Proceso.hasOne(EtapaPreliminar,    { foreignKey: "proceso_id", as: "preliminar",    onDelete: "CASCADE" });
Proceso.hasOne(EtapaAprobacion,    { foreignKey: "proceso_id", as: "aprobacion",    onDelete: "CASCADE" });
Proceso.hasOne(EtapaEjecucion,     { foreignKey: "proceso_id", as: "ejecucion",     onDelete: "CASCADE" });

EtapaAprobacion.belongsTo(Estados, { foreignKey: "estado_id", as: "estadoObj" });

EtapaAprobacion.hasMany(InteraccionAprobacion,   { foreignKey: "etapa_aprobacion_id", as: "interacciones", onDelete: "CASCADE" });
InteraccionAprobacion.belongsTo(EtapaAprobacion, { foreignKey: "etapa_aprobacion_id" });
InteraccionAprobacion.belongsTo(Estados,         { foreignKey: "estado_id", as: "estadoObj" });
InteraccionAprobacion.belongsToMany(Consultor, {
  through: InteraccionAprobacionConsultor,
  foreignKey: "interaccion_aprobacion_id", otherKey: "consultor_id",
  as: "consultores", uniqueKey: "uniq_iac_inter_cons"
});
Consultor.belongsToMany(InteraccionAprobacion, {
  through: InteraccionAprobacionConsultor,
  foreignKey: "consultor_id", otherKey: "interaccion_aprobacion_id",
  as: "interaccionesAprobacion", uniqueKey: "uniq_iac_inter_cons"
});

Proceso.hasOne(EtapaAprobado,    { foreignKey: "proceso_id", as: "aprobado", onDelete: "CASCADE" });
EtapaAprobado.belongsTo(Proceso, { foreignKey: "proceso_id" });
EtapaAprobado.belongsTo(Estados, { foreignKey: "estado_id", as: "estadoObj" });

EtapaAprobado.belongsToMany(Consultor, {
  through: EtapaAprobadoConsultor,
  foreignKey: "etapa_aprobado_id", otherKey: "consultor_id",
  as: "consultores", uniqueKey: "uniq_aprobado_cons"
});
Consultor.belongsToMany(EtapaAprobado, {
  through: EtapaAprobadoConsultor,
  foreignKey: "consultor_id", otherKey: "etapa_aprobado_id",
  as: "aprobados", uniqueKey: "uniq_aprobado_cons"
});

EtapaAprobado.hasMany(InteraccionAprobado,   { foreignKey: "etapa_aprobado_id", as: "interacciones", onDelete: "CASCADE" });
InteraccionAprobado.belongsTo(EtapaAprobado, { foreignKey: "etapa_aprobado_id" });
InteraccionAprobado.belongsTo(Estados,       { foreignKey: "estado_id", as: "estadoObj" });
InteraccionAprobado.belongsToMany(Consultor, {
  through: InteraccionAprobadoConsultor,
  foreignKey: "interaccion_aprobado_id", otherKey: "consultor_id",
  as: "consultores", uniqueKey: "uniq_iaprobado_cons"
});
Consultor.belongsToMany(InteraccionAprobado, {
  through: InteraccionAprobadoConsultor,
  foreignKey: "consultor_id", otherKey: "interaccion_aprobado_id",
  as: "interaccionesAprobado", uniqueKey: "uniq_iaprobado_cons"
});


EtapaLevantamiento.belongsTo(Proceso, { foreignKey: "proceso_id" });
EtapaEstimacion.belongsTo(Proceso,    { foreignKey: "proceso_id" });
EtapaPropuesta.belongsTo(Proceso,     { foreignKey: "proceso_id" });
EtapaPreliminar.belongsTo(Proceso,    { foreignKey: "proceso_id" });
EtapaAprobacion.belongsTo(Proceso,    { foreignKey: "proceso_id" });
EtapaEjecucion.belongsTo(Proceso,     { foreignKey: "proceso_id" });

EtapaLevantamiento.belongsToMany(Consultor, { through: EtapaLevantamientoConsultor, foreignKey: "etapa_levantamiento_id", otherKey: "consultor_id",        as: "consultores",    uniqueKey: "uniq_lev_cons" });
Consultor.belongsToMany(EtapaLevantamiento, { through: EtapaLevantamientoConsultor, foreignKey: "consultor_id",        otherKey: "etapa_levantamiento_id", as: "levantamientos", uniqueKey: "uniq_lev_cons" });
EtapaLevantamiento.belongsTo(Estados, { foreignKey: "estado_id", as: "estadoObj" });

EtapaLevantamiento.hasMany(InteraccionLevantamiento,    { foreignKey: "etapa_levantamiento_id", as: "interacciones", onDelete: "CASCADE" });
InteraccionLevantamiento.belongsTo(EtapaLevantamiento,  { foreignKey: "etapa_levantamiento_id" });
InteraccionLevantamiento.belongsTo(Estados,             { foreignKey: "estado_id", as: "estadoObj" });
InteraccionLevantamiento.belongsToMany(Consultor, { through: InteraccionLevantamientoConsultor, foreignKey: "interaccion_levantamiento_id", otherKey: "consultor_id",                as: "consultores",              uniqueKey: "uniq_ilc_inter_cons" });
Consultor.belongsToMany(InteraccionLevantamiento, { through: InteraccionLevantamientoConsultor, foreignKey: "consultor_id",                otherKey: "interaccion_levantamiento_id", as: "interaccionesLevantamiento", uniqueKey: "uniq_ilc_inter_cons" });

EtapaEstimacion.belongsToMany(Consultor, { through: EtapaEstimacionConsultor, foreignKey: "etapa_estimacion_id", otherKey: "consultor_id",       as: "consultores", uniqueKey: "uniq_est_cons" });
Consultor.belongsToMany(EtapaEstimacion, { through: EtapaEstimacionConsultor, foreignKey: "consultor_id",       otherKey: "etapa_estimacion_id", as: "estimaciones", uniqueKey: "uniq_est_cons" });
EtapaEstimacion.belongsTo(Estados, { foreignKey: "estado_id", as: "estadoObj" });

EtapaEstimacion.hasMany(InteraccionEstimacion,    { foreignKey: "etapa_estimacion_id", as: "interacciones", onDelete: "CASCADE" });
InteraccionEstimacion.belongsTo(EtapaEstimacion,  { foreignKey: "etapa_estimacion_id" });
InteraccionEstimacion.belongsTo(Estados,          { foreignKey: "estado_id", as: "estadoObj" });
InteraccionEstimacion.belongsToMany(Consultor, { through: InteraccionEstimacionConsultor, foreignKey: "interaccion_estimacion_id", otherKey: "consultor_id",              as: "consultores",             uniqueKey: "uniq_iec_inter_cons" });
Consultor.belongsToMany(InteraccionEstimacion, { through: InteraccionEstimacionConsultor, foreignKey: "consultor_id",              otherKey: "interaccion_estimacion_id", as: "interaccionesEstimacion", uniqueKey: "uniq_iec_inter_cons" });

EtapaPropuesta.belongsToMany(Consultor, { through: EtapaPropuestaConsultor, foreignKey: "etapa_propuesta_id", otherKey: "consultor_id",      as: "consultores", uniqueKey: "uniq_prop_cons" });
Consultor.belongsToMany(EtapaPropuesta, { through: EtapaPropuestaConsultor, foreignKey: "consultor_id",      otherKey: "etapa_propuesta_id", as: "propuestas",  uniqueKey: "uniq_prop_cons" });

EtapaEjecucion.belongsToMany(Consultor, { through: EtapaEjecucionConsultor, foreignKey: "etapa_ejecucion_id", otherKey: "consultor_id",      as: "consultores", uniqueKey: "uniq_ejec_cons" });
Consultor.belongsToMany(EtapaEjecucion, { through: EtapaEjecucionConsultor, foreignKey: "consultor_id",      otherKey: "etapa_ejecucion_id", as: "ejecuciones", uniqueKey: "uniq_ejec_cons" });
EtapaEjecucion.belongsTo(Estados, { foreignKey: "estado_id", as: "estadoObj" });

EtapaEjecucion.hasMany(InteraccionEjecucion,   { foreignKey: "etapa_ejecucion_id", as: "interacciones", onDelete: "CASCADE" });
InteraccionEjecucion.belongsTo(EtapaEjecucion, { foreignKey: "etapa_ejecucion_id" });
InteraccionEjecucion.belongsTo(Estados,        { foreignKey: "estado_id", as: "estadoObj" });
InteraccionEjecucion.belongsToMany(Consultor, {
  through: InteraccionEjecucionConsultor,
  foreignKey: "interaccion_ejecucion_id", otherKey: "consultor_id",
  as: "consultores", uniqueKey: "uniq_iejec_cons"
});
Consultor.belongsToMany(InteraccionEjecucion, {
  through: InteraccionEjecucionConsultor,
  foreignKey: "consultor_id", otherKey: "interaccion_ejecucion_id",
  as: "interaccionesEjecucion", uniqueKey: "uniq_iejec_cons"
});

EtapaAprobacion.belongsToMany(Consultor, { through: EtapaAprobacionConsultor, foreignKey: "etapa_aprobacion_id", otherKey: "consultor_id",       as: "consultores", uniqueKey: "uniq_aprob_cons" });
Consultor.belongsToMany(EtapaAprobacion, { through: EtapaAprobacionConsultor, foreignKey: "consultor_id",       otherKey: "etapa_aprobacion_id", as: "aprobaciones", uniqueKey: "uniq_aprob_cons" });

EtapaPreliminar.belongsToMany(Consultor, { through: EtapaPreliminarConsultor, foreignKey: "etapa_preliminar_id", otherKey: "consultor_id",       as: "consultores",  uniqueKey: "uniq_prel_cons" });
Consultor.belongsToMany(EtapaPreliminar, { through: EtapaPreliminarConsultor, foreignKey: "consultor_id",       otherKey: "etapa_preliminar_id", as: "preliminares", uniqueKey: "uniq_prel_cons" });

Proceso.hasMany(Interaccion,     { foreignKey: "proceso_id",   as: "interacciones", onDelete: "CASCADE" });
Interaccion.belongsTo(Proceso,   { foreignKey: "proceso_id" });
Interaccion.belongsTo(Consultor, { foreignKey: "consultor_id", as: "consultor" });
Consultor.hasMany(Interaccion,   { foreignKey: "consultor_id", as: "interacciones" });

User.hasMany(Chat,   { foreignKey: "user_id", as: "chats", onDelete: "CASCADE" });
Chat.belongsTo(User, { foreignKey: "user_id", as: "user" });
Chat.hasMany(Mensaje,   { foreignKey: "chat_id", as: "mensajes", onDelete: "CASCADE" });
Mensaje.belongsTo(Chat, { foreignKey: "chat_id", as: "chat" });
Chat.hasOne(ContextoChat,    { foreignKey: "chat_id", as: "contexto", onDelete: "CASCADE" });
ContextoChat.belongsTo(Chat, { foreignKey: "chat_id", as: "chat" });

Pais.hasMany(Ciudad,   { foreignKey: "pais_id", as: "ciudades" });
Ciudad.belongsTo(Pais, { foreignKey: "pais_id", as: "pais" });

Cliente.belongsTo(Pais,   { foreignKey: "pais_id",   as: "pais"   });
Cliente.belongsTo(Ciudad, { foreignKey: "ciudad_id", as: "ciudad" });
Cliente.belongsTo(Rubro,  { foreignKey: "rubro_id",  as: "rubro"  });

Cliente.hasMany(SeguimientoCliente, { foreignKey: "cliente_id", as: "seguimientos", onDelete: "CASCADE" });
SeguimientoCliente.belongsTo(Cliente,        { foreignKey: "cliente_id" });
SeguimientoCliente.belongsTo(Consultor,      { foreignKey: "consultor_id",       as: "consultor"        });
SeguimientoCliente.belongsTo(UsuarioCliente, { foreignKey: "usuario_cliente_id", as: "contacto_cliente" });
SeguimientoCliente.belongsToMany(UsuarioCliente, {
  through: SeguimientoContacto,
  foreignKey: "seguimiento_id",
  otherKey: "usuario_cliente_id",
  as: "contactos",
});
UsuarioCliente.belongsToMany(SeguimientoCliente, {
  through: SeguimientoContacto,
  foreignKey: "usuario_cliente_id",
  otherKey: "seguimiento_id",
  as: "seguimientos",
});

Cliente.belongsTo(Estados,        { foreignKey: "estado_id", as: "estadoObj" });
Estados.hasMany(Cliente,          { foreignKey: "estado_id" });
Proyecto.belongsTo(Estados,       { foreignKey: "estado_id", as: "estadoObj" });
Estados.hasMany(Proyecto,         { foreignKey: "estado_id" });
Proceso.belongsTo(Estados,        { foreignKey: "estado_id", as: "estadoObj" });
Estados.hasMany(Proceso,          { foreignKey: "estado_id" });
EstadoProyecto.belongsTo(Estados, { foreignKey: "estado_id", as: "estadoObj" });
Estados.hasMany(EstadoProyecto,   { foreignKey: "estado_id" });

// Soporte
Soporte.belongsTo(Cliente, { foreignKey: "cliente_id", as: "cliente" });
Cliente.hasMany(Soporte, { foreignKey: "cliente_id", as: "soportes" });
Soporte.belongsTo(UsuarioCliente, { foreignKey: "responsable_cliente_id", as: "responsableCliente" });
Soporte.belongsTo(Consultor, { foreignKey: "created_by", as: "creador" });
Soporte.belongsTo(Consultor, { foreignKey: "updated_by", as: "actualizador" });

// Licencia
Licencia.belongsTo(Cliente, { foreignKey: "cliente_id", as: "cliente" });
Cliente.hasMany(Licencia, { foreignKey: "cliente_id", as: "licencias" });
Licencia.belongsToMany(Proceso, { through: LicenciaProceso, foreignKey: "licencia_id", otherKey: "proceso_id", as: "procesos" });
Proceso.belongsToMany(Licencia, { through: LicenciaProceso, foreignKey: "proceso_id", otherKey: "licencia_id", as: "licencias" });
Licencia.belongsTo(Consultor, { foreignKey: "created_by", as: "creador" });
Licencia.belongsTo(Consultor, { foreignKey: "updated_by", as: "actualizador" });
Licencia.belongsTo(HerramientaRpa, { foreignKey: "herramienta_id", as: "herramienta" });
HerramientaRpa.hasMany(Licencia,   { foreignKey: "herramienta_id", as: "licencias_herramienta" });

EtapaPropuesta.hasMany(InteraccionPropuesta,   { foreignKey: "etapa_propuesta_id", as: "interacciones", onDelete: "CASCADE" });
InteraccionPropuesta.belongsTo(EtapaPropuesta, { foreignKey: "etapa_propuesta_id" });
InteraccionPropuesta.belongsTo(Estados,        { foreignKey: "estado_id", as: "estadoObj" });
InteraccionPropuesta.belongsToMany(Consultor, {
  through: InteraccionPropuestaConsultor,
  foreignKey: "interaccion_propuesta_id", otherKey: "consultor_id",
  as: "consultores", uniqueKey: "uniq_ipc_inter_cons"
});
Consultor.belongsToMany(InteraccionPropuesta, {
  through: InteraccionPropuestaConsultor,
  foreignKey: "consultor_id", otherKey: "interaccion_propuesta_id",
  as: "interaccionesPropuesta", uniqueKey: "uniq_ipc_inter_cons"
});

EtapaPropuesta.belongsTo(Estados, { foreignKey: "estado_id", as: "estadoObj" });

Proceso.hasOne(EtapaCierre,    { foreignKey: "proceso_id", as: "cierre", onDelete: "CASCADE" });
EtapaCierre.belongsTo(Proceso, { foreignKey: "proceso_id" });
EtapaCierre.belongsTo(Estados, { foreignKey: "estado_id", as: "estadoObj" });

EtapaCierre.belongsToMany(Consultor, {
  through: EtapaCierreConsultor,
  foreignKey: "etapa_cierre_id", otherKey: "consultor_id",
  as: "consultores", uniqueKey: "uniq_cierre_cons"
});
Consultor.belongsToMany(EtapaCierre, {
  through: EtapaCierreConsultor,
  foreignKey: "consultor_id", otherKey: "etapa_cierre_id",
  as: "cierres", uniqueKey: "uniq_cierre_cons"
});

EtapaCierre.hasMany(InteraccionCierre,   { foreignKey: "etapa_cierre_id", as: "interacciones", onDelete: "CASCADE" });
InteraccionCierre.belongsTo(EtapaCierre, { foreignKey: "etapa_cierre_id" });
InteraccionCierre.belongsTo(Estados,     { foreignKey: "estado_id", as: "estadoObj" });
InteraccionCierre.belongsToMany(Consultor, {
  through: InteraccionCierreConsultor,
  foreignKey: "interaccion_cierre_id", otherKey: "consultor_id",
  as: "consultores", uniqueKey: "uniq_icierre_cons"
});
Consultor.belongsToMany(InteraccionCierre, {
  through: InteraccionCierreConsultor,
  foreignKey: "consultor_id", otherKey: "interaccion_cierre_id",
  as: "interaccionesCierre", uniqueKey: "uniq_icierre_cons"
});

Proceso.hasOne(EtapaFacturado,    { foreignKey: "proceso_id", as: "facturado", onDelete: "CASCADE" });
EtapaFacturado.belongsTo(Proceso, { foreignKey: "proceso_id" });
EtapaFacturado.belongsTo(Estados, { foreignKey: "estado_id", as: "estadoObj" });

EtapaFacturado.belongsToMany(Consultor, {
  through: EtapaFacturadoConsultor,
  foreignKey: "etapa_facturado_id", otherKey: "consultor_id",
  as: "consultores", uniqueKey: "uniq_facturado_cons"
});
Consultor.belongsToMany(EtapaFacturado, {
  through: EtapaFacturadoConsultor,
  foreignKey: "consultor_id", otherKey: "etapa_facturado_id",
  as: "facturados", uniqueKey: "uniq_facturado_cons"
});

EtapaFacturado.hasMany(InteraccionFacturado,   { foreignKey: "etapa_facturado_id", as: "interacciones", onDelete: "CASCADE" });
InteraccionFacturado.belongsTo(EtapaFacturado, { foreignKey: "etapa_facturado_id" });
InteraccionFacturado.belongsTo(Estados,        { foreignKey: "estado_id", as: "estadoObj" });
EtapaFacturado.hasMany(EtapaFacturadoItem, {
  foreignKey: "etapa_facturado_id", as: "facturas", onDelete: "CASCADE"
});
EtapaFacturadoItem.belongsTo(EtapaFacturado, {
  foreignKey: "etapa_facturado_id"
});
InteraccionFacturado.belongsToMany(Consultor, {
  through: InteraccionFacturadoConsultor,
  foreignKey: "interaccion_facturado_id", otherKey: "consultor_id",
  as: "consultores", uniqueKey: "uniq_ifacturado_cons"
});
Consultor.belongsToMany(InteraccionFacturado, {
  through: InteraccionFacturadoConsultor,
  foreignKey: "consultor_id", otherKey: "interaccion_facturado_id",
  as: "interaccionesFacturado", uniqueKey: "uniq_ifacturado_cons"
});

Proceso.hasOne(EtapaRechazado,    { foreignKey: "proceso_id", as: "rechazado", onDelete: "CASCADE" });
EtapaRechazado.belongsTo(Proceso, { foreignKey: "proceso_id" });
EtapaRechazado.belongsTo(Estados, { foreignKey: "estado_id", as: "estadoObj" });

EtapaRechazado.belongsToMany(Consultor, {
  through: EtapaRechazadoConsultor,
  foreignKey: "etapa_rechazado_id", otherKey: "consultor_id",
  as: "consultores", uniqueKey: "uniq_rechazado_cons"
});
Consultor.belongsToMany(EtapaRechazado, {
  through: EtapaRechazadoConsultor,
  foreignKey: "consultor_id", otherKey: "etapa_rechazado_id",
  as: "rechazados", uniqueKey: "uniq_rechazado_cons"
});

EtapaRechazado.hasMany(InteraccionRechazado,   { foreignKey: "etapa_rechazado_id", as: "interacciones", onDelete: "CASCADE" });
InteraccionRechazado.belongsTo(EtapaRechazado, { foreignKey: "etapa_rechazado_id" });
InteraccionRechazado.belongsTo(Estados,        { foreignKey: "estado_id", as: "estadoObj" });
InteraccionRechazado.belongsToMany(Consultor, {
  through: InteraccionRechazadoConsultor,
  foreignKey: "interaccion_rechazado_id", otherKey: "consultor_id",
  as: "consultores", uniqueKey: "uniq_irechazado_cons"
});
Consultor.belongsToMany(InteraccionRechazado, {
  through: InteraccionRechazadoConsultor,
  foreignKey: "consultor_id", otherKey: "interaccion_rechazado_id",
  as: "interaccionesRechazado", uniqueKey: "uniq_irechazado_cons"
});

Proceso.hasOne(EtapaStandBy,    { foreignKey: "proceso_id", as: "stand_by", onDelete: "CASCADE" });
EtapaStandBy.belongsTo(Proceso, { foreignKey: "proceso_id" });
EtapaStandBy.belongsTo(Estados, { foreignKey: "estado_id", as: "estadoObj" });

EtapaStandBy.belongsToMany(Consultor, {
  through: EtapaStandByConsultor,
  foreignKey: "etapa_stand_by_id", otherKey: "consultor_id",
  as: "consultores", uniqueKey: "uniq_standby_cons"
});
Consultor.belongsToMany(EtapaStandBy, {
  through: EtapaStandByConsultor,
  foreignKey: "consultor_id", otherKey: "etapa_stand_by_id",
  as: "standBys", uniqueKey: "uniq_standby_cons"
});

EtapaStandBy.hasMany(InteraccionStandBy,   { foreignKey: "etapa_stand_by_id", as: "interacciones", onDelete: "CASCADE" });
InteraccionStandBy.belongsTo(EtapaStandBy, { foreignKey: "etapa_stand_by_id" });
InteraccionStandBy.belongsTo(Estados,      { foreignKey: "estado_id", as: "estadoObj" });
InteraccionStandBy.belongsToMany(Consultor, {
  through: InteraccionStandByConsultor,
  foreignKey: "interaccion_stand_by_id", otherKey: "consultor_id",
  as: "consultores", uniqueKey: "uniq_istandby_cons"
});
Consultor.belongsToMany(InteraccionStandBy, {
  through: InteraccionStandByConsultor,
  foreignKey: "consultor_id", otherKey: "interaccion_stand_by_id",
  as: "interaccionesStandBy", uniqueKey: "uniq_istandby_cons"
});

export {
  Area, AsignacionHerramientas, Cliente, Consultor,
  EtapaAprobacion, EtapaEjecucion, EtapaEstimacion,
  EtapaLevantamiento, EtapaPreliminar, EtapaPropuesta,
  EstadoProyecto, HerramientaRpa, Interaccion,
  Proceso, Proyecto, ProyectoArea, ProyectoUsuarioRol,
  Rol, UsuarioCliente,
  EtapaLevantamientoConsultor, EtapaEstimacionConsultor,
  EtapaPropuestaConsultor, EtapaEjecucionConsultor,
  EtapaAprobacionConsultor, EtapaPreliminarConsultor,
  Chat, Mensaje, ContextoChat, User,
  Pais, Ciudad, Rubro, SeguimientoCliente, Estados,
  ProcesoHerramienta,
  InteraccionLevantamiento, InteraccionEstimacion,
  InteraccionLevantamientoConsultor, InteraccionEstimacionConsultor,
  Soporte, Licencia, LicenciaProceso,
  InteraccionPropuesta, InteraccionPropuestaConsultor,
  InteraccionAprobacion, InteraccionAprobacionConsultor,
  EtapaAprobado, EtapaAprobadoConsultor, InteraccionAprobado, InteraccionAprobadoConsultor,
  InteraccionEjecucion, InteraccionEjecucionConsultor,
  EtapaCierre, EtapaCierreConsultor, InteraccionCierre, InteraccionCierreConsultor,
  EtapaFacturado, EtapaFacturadoConsultor, InteraccionFacturado, InteraccionFacturadoConsultor,
  EtapaFacturadoItem,
  EtapaRechazado, EtapaRechazadoConsultor, InteraccionRechazado, InteraccionRechazadoConsultor,
  EtapaStandBy, EtapaStandByConsultor, InteraccionStandBy, InteraccionStandByConsultor,
  SeguimientoContacto
};
