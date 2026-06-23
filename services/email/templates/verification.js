import { emailHead, emailHeader, emailFooter, credRow } from "./base.js";

export const verificationTemplate = (nombre, email, password, verifyUrl) => `
<!DOCTYPE html>
<html lang="es">
<head>${emailHead()}</head>
<body>
  <div class="wrapper">
    ${emailHeader()}
    <div class="body">
      <p class="greeting">Hola, ${nombre} 👋</p>
      <p class="text">
        Tu cuenta en <strong>GAIA CRM</strong> ha sido creada. A continuación encontrarás
        tus credenciales de acceso temporales. Te recomendamos cambiar tu contraseña tras
        el primer inicio de sesión.
      </p>
      <div class="creds">
        ${credRow("Correo", email)}
        ${credRow("Contraseña temporal", password)}
      </div>
      <div class="btn-wrap">
        <a href="${verifyUrl}" class="btn">✓ Verificar mi cuenta</a>
      </div>
      <p class="notice">
        Este enlace expira en <strong>24 horas</strong>.<br/>
        Si no esperabas este correo, puedes ignorarlo con seguridad.
      </p>
    </div>
    ${emailFooter()}
  </div>
</body>
</html>
`;
