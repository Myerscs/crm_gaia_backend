import nodemailer from "nodemailer";
import { MAIL_USER, MAIL_PASS, MAIL_FROM } from "../../config/config.js";

let transporter = null;

export const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",         
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,        
      },
    });
  }
  return transporter;
};

export const verifyMailConnection = async () => {
  try {
    await getTransporter().verify();
    console.log("[email] ✓ Conexión SMTP verificada");
  } catch (err) {
    console.error("[email] ✗ Error SMTP:", err.message);
  }
};