import { emailHead, emailHeader, emailFooter } from "./base.js";

export const fileToConsultorTemplate = (consultorNombre, remitenteNombre, asunto, mensaje, linkArchivo) => `
<!DOCTYPE html>
<html lang="es">
<head>${emailHead()}</head>
<body>
  <div class="wrapper">
    ${emailHeader()}
    <div class="body">
      <p class="greeting">Hola, ${consultorNombre} 👋</p>
      <p class="text">
        <strong>${remitenteNombre}</strong> te ha compartido un archivo relacionado con el asunto:
        <strong>${asunto}</strong>
      </p>
      <div style="background:#F4F6F8; border-left:4px solid #95B359; padding:16px; margin:20px 0;">
        <p style="margin:0 0 8px 0;"><strong>Mensaje:</strong></p>
        <p style="margin:0;">${mensaje}</p>
      </div>
      <div class="btn-wrap" style="text-align:center; margin:30px 0;">
        <a href="${linkArchivo}" class="btn" style="background:#95B359; color:#fff; padding:10px 24px; text-decoration:none; border-radius:8px;">
          📎 Descargar archivo
        </a>
      </div>
      <p class="notice" style="font-size:12px; color:#8A99AA;">
        El enlace expira en 7 días. Si no esperabas este correo, puedes ignorarlo.
      </p>
    </div>
    ${emailFooter()}
  </div>
</body>
</html>
`;
