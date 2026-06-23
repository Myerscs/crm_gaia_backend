import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { enviarArchivoAConsultor } from "../controladores/email.controller.js";

const router = Router();
router.use(verifyToken);
router.post("/email/enviar-archivo", enviarArchivoAConsultor);
export default router;