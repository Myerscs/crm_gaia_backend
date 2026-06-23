import { sendFileToConsultor } from "../services/email/emailService.js";
import { Consultor } from "../modelos/relations.js";

export const enviarArchivoAConsultor = async (req, res) => {
  try {
    const { consultor_id, asunto, mensaje, link_archivo } = req.body;
    if (!consultor_id) return res.status(400).json({ ok: false, mensaje: "Falta consultor_id" });
    if (!link_archivo) return res.status(400).json({ ok: false, mensaje: "Falta link del archivo" });

    const consultor = await Consultor.findByPk(consultor_id);
    if (!consultor) return res.status(404).json({ ok: false, mensaje: "Consultor no encontrado" });

    await sendFileToConsultor({
      consultorEmail: consultor.email,
      consultorNombre: consultor.nombre,
      remitenteNombre: req.user.nombre,
      asunto: asunto || "Documento compartido desde GAIA",
      mensaje: mensaje || "",
      linkArchivo: link_archivo,
    });

    return res.status(200).json({ ok: true, mensaje: "Archivo enviado correctamente" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, mensaje: "Error al enviar archivo" });
  }
};