import { createClient } from "redis";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "./config.js";


export const redis = createClient({
  socket: {
    host: REDIS_HOST || "127.0.0.1",
    port: Number(REDIS_PORT) || 6379,
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        console.error("❌ Redis no disponible, se detuvo la reconexión.");
        return false; 
      }
      return retries * 500; 
    },
  },
  password: REDIS_PASSWORD,
});
redis.on("error", (err) => console.error("❌ Redis error:", err.message));
redis.on("connect", () => console.log("✅ Redis conectado"));