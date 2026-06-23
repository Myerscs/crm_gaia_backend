import { getTransporter } from "./transporter.js";
import { verificationTemplate } from "./templates/verification.js";
import { fileToConsultorTemplate } from "./templates/fileToConsultor.js";
import { MAIL_FROM, FRONTEND_URL } from "../../config/config.js";

export const sendVerificationEmail = async (email, nombre, token, password) => {
  const verifyUrl = `${FRONTEND_URL}/verificar?token=${token}`;
  const transporter = getTransporter();
  await transporter.sendMail({
    from: MAIL_FROM,
    to: email,
    subject: "Bienvenido a GAIA — Verifica tu cuenta",
    html: verificationTemplate(nombre, email, password, verifyUrl),
  });
  console.log(`[email] ✓ Verificación enviada a ${email}`);
};

export const sendFileToConsultor = async ({ consultorEmail, consultorNombre, remitenteNombre, asunto, mensaje, linkArchivo }) => {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: MAIL_FROM,
    to: consultorEmail,
    subject: `📄 ${asunto}`,
    html: fileToConsultorTemplate(consultorNombre, remitenteNombre, asunto, mensaje, linkArchivo),
  });
  console.log(`[email] ✓ Archivo enviado a ${consultorEmail}`);
};
