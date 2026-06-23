import * as dotenv from 'dotenv';
dotenv.config();

export const DB_PORT = process.env.DB_PORT;
export const DB_HOST = process.env.DB_HOST;
export const PORT = process.env.PORT;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const JWT_SECRET = process.env.JWT_SECRET;
export const DB_CONNECTION = process.env.DB_CONNECTION
export const SECRET_KEY = process.env.SECRET_KEY

export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT;
export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASS = process.env.MAIL_PASS;
export const MAIL_FROM = process.env.MAIL_FROM;

export const API_KEY_DEEPSEEK = process.env.API_KEY_DEEPSEEK;
export const API_KEY_CLAUDE = process.env.API_KEY_CLAUDE;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
export const FRONTEND_URL = process.env.FRONTEND_URL;

export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = process.env.REDIS_PORT
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD
