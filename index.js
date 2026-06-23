import express from "express";
import cors    from "cors";

import { PORT }        from "./config/config.js";
import { sequelize }   from "./config/database.js";
import { corsOption }  from "./config/corsOption.js";

import "./modelos/relations.js";

import authRoutes           from "./rutas/auth.routes.js";
import clienteRoutes        from "./rutas/cliente.routes.js";
import estadosRoutes        from "./rutas/estados.routes.js";
import consultorRoutes      from "./rutas/consultor.routes.js";
import proyectoRoutes       from "./rutas/proyecto.routes.js";
import procesoRoutes        from "./rutas/proceso.routes.js";
import maestrosRoutes       from "./rutas/maestros.routes.js";
import estadoProyectoRoutes from "./rutas/estadoProyecto.routes.js";
import reporteRoutes        from "./rutas/reporte.routes.js";
import chatRoutes           from "./rutas/chat.routes.js";
import aiApp                from "./rutas/ai.routes.js";
import calendarRoutes from './rutas/calendario.routes.js';
import soporteRoutes from "./rutas/soporte.routes.js";
import licenciaRoutes from "./rutas/licencia.routes.js";
import emailRoutes from "./rutas/email.routes.js";
import pipelineRoutes from "./rutas/pipeline.routes.js";
import { cargarCatalogos }  from "./seeders/catalogosSeed.js";
import { redis } from "./config/redis.js";

const app  = express();
const _PORT = PORT || 3000;

app.use(express.json());
app.use(cors(corsOption));

const api = express.Router();
api.use(authRoutes);
api.use(clienteRoutes);
api.use(consultorRoutes);
api.use(proyectoRoutes);
api.use(procesoRoutes);
api.use(maestrosRoutes);
api.use(estadoProyectoRoutes);
api.use(reporteRoutes);
api.use(chatRoutes);
api.use(aiApp);
api.use(estadosRoutes);
api.use(calendarRoutes);
api.use(soporteRoutes);
api.use(licenciaRoutes);
api.use(emailRoutes);
api.use(pipelineRoutes);

app.use("/api", api);

app.use((err, req, res, _next) => {
  console.error("[GlobalError]", err);
  res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: err.message });
});

const main = async () => {
  try {
    try {
      await redis.connect();
      console.log("Redis conectado.");
    } catch (redisError) {
      console.warn("Redis no disponible, continuando sin caché:", redisError.message);
    }

    await sequelize.authenticate();
    console.log("Base de datos conectada.");

    await sequelize.sync({ alter: true });
    await cargarCatalogos();

    app.listen(_PORT, "0.0.0.0", () => {
      console.log(`Servidor corriendo en el puerto => ${_PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar:", error);
    process.exit(1);
  }
};

main();