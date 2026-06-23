import {
  Cliente, Proyecto, Proceso,
  EtapaPropuesta, Estados, HerramientaRpa, EtapaCierre,
} from "../modelos/relations.js";

export const getClientesResumen = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      attributes: ["id", "empresa"],
      include: [{
        model: Proyecto, as: "proyectos", attributes: ["id"], required: false,
        include: [{
          model: Proceso, as: "procesos", attributes: ["id"], required: false,
          include: [{
            model: EtapaPropuesta, as: "propuesta",
            attributes: ["valor_presupuestado"], required: false,
          }],
        }],
      }],
      order: [["empresa", "ASC"]],
    });

    const data = clientes.map((c) => {
      const proyectos   = c.proyectos || [];
      const procesos    = proyectos.flatMap((p) => p.procesos || []);
      const valor_total = procesos.reduce(
        (s, p) => s + (Number(p.propuesta?.valor_presupuestado) || 0), 0
      );
      return {
        id: c.id, empresa: c.empresa, email: c.email || "",
        activo: c.activo,
        proyecto_count: proyectos.length,
        proceso_count:  procesos.length,
        valor_total,
      };
    });

    return res.json({ ok: true, data });
  } catch (err) {
    console.error("[getClientesResumen]", err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const getProyectosDeCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const proyectos = await Proyecto.findAll({
      where: { cliente_id: clienteId },
      attributes: ["id", "nombre", "descripcion", "activo"],
      include: [{
        model: Proceso, as: "procesos", attributes: ["id"], required: false,
        include: [{
          model: EtapaPropuesta, as: "propuesta",
          attributes: ["valor_presupuestado", "valor_gerencia"], required: false,
        }],
      }],
      order: [["createdAt", "DESC"]],
    });

    const data = proyectos.map((p) => {
      const procs       = p.procesos || [];
      const valor_total = procs.reduce(
        (s, pr) => s + (Number(pr.propuesta?.valor_presupuestado) || 0), 0
      );
      return {
        id: p.id, nombre: p.nombre, descripcion: p.descripcion,
        activo: p.activo, proceso_count: procs.length, valor_total,
      };
    });

    return res.json({ ok: true, data });
  } catch (err) {
    console.error("[getProyectosDeCliente]", err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const getProcesosDeProyecto = async (req, res) => {
  try {
    const { proyectoId } = req.params;
    const procesos = await Proceso.findAll({
      where:      { proyecto_id: proyectoId },
      attributes: ["id", "nombre_proceso", "tipo", "prioridad"],
      include: [
        { model: Estados,        as: "estadoObj",   attributes: ["id", "nombre"] },
        { model: EtapaPropuesta, as: "propuesta",   attributes: ["valor_presupuestado", "horas_presupuestadas", "valor_gerencia"], required: false },
        { model: HerramientaRpa, as: "herramientas", attributes: ["id", "nombre"], through: { attributes: [] } },
        { model: EtapaCierre,    as: "cierre",      attributes: ["fecha_cierre", "horas_reales"], required: false },
      ],
      order: [["createdAt", "DESC"]],
    });

    const data = procesos.map((p) => p.toJSON());
    return res.json({ ok: true, data });
  } catch (err) {
    console.error("[getProcesosDeProyecto]", err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};