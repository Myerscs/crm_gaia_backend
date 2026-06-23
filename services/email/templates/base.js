export const emailHead = () => `
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{background:#F4F6F8;font-family:'Segoe UI',Arial,sans-serif;color:#2F3D4D;}
    .wrapper{max-width:560px;margin:40px auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(47,61,77,.10);}
    .header{background:#2F3D4D;padding:36px 40px 28px;}
    .logo{font-size:22px;font-weight:800;color:#fff;letter-spacing:.06em;}
    .logo span{color:#95B359;}
    .logo-sub{font-size:11px;color:rgba(255,255,255,.35);margin-top:4px;letter-spacing:.1em;text-transform:uppercase;}
    .body{padding:36px 40px;}
    .footer{background:#F4F6F8;border-top:1px solid #E2E8EE;padding:18px 40px;text-align:center;}
    .footer p{font-size:11px;color:#8A99AA;}
  </style>
`;

export const emailHeader = () => `
  <div class="header">
    <div class="logo">GAIA</div>
    <div class="logo-sub">CRM · Propuestas</div>
  </div>
`;

export const emailFooter = () => `
  <div class="footer">
    <p>© ${new Date().getFullYear()} GAIA CRM · Todos los derechos reservados</p>
  </div>
`;

export const credRow = (label, value) => `
  <div class="cred-row">
    <span class="cred-label">${label}</span>
    <span class="cred-value">${value}</span>
  </div>
`;
