import { Consultor, Estados, Pais, Ciudad, Rubro, Proyecto, SeguimientoCliente, UsuarioCliente } from "../modelos/relations.js";

export const INCLUDE_CLIENTE = [
        {
          model: SeguimientoCliente,
          as: "seguimientos",
          include: [
            { model: Consultor, as: "consultor", attributes: ["id", "nombre", "email"] },
            { model: UsuarioCliente, as: "contacto_cliente", attributes: ["id", "nombre", "email", "telefono", "linkedin", "cargo"] },
          ],
          order: [["fecha", "DESC"]],
        },
        {
          model: Proyecto,
          as: "proyectos",
          attributes: ["id", "nombre", "activo", "createdAt"],
        },
        { model: Estados, as: "estadoObj", attributes: ["id", "nombre"] },
        { model: Pais, as: "pais", attributes: ["id", "nombre", "codigo_iso"] },
        { model: Ciudad, as: "ciudad", attributes: ["id", "nombre"] },
        { model: Rubro, as: "rubro", attributes: ["id", "nombre"] },
      ]