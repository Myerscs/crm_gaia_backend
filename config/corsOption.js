export const corsOption = {
  origin: ['http://localhost:8100', 'http://localhost:3000','http://localhost:5173', 'https://gaia-corp.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
};