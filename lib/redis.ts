// lib/redis.ts
import { Redis } from "ioredis";

// Check of de variabele bestaat (deze komt uit je Vercel omgeving)
if (!process.env.REDIS_URL) {
  throw new Error("🔴 FOUT: REDIS_URL is niet ingesteld in de omgevingsvariabelen.");
}

// Initialiseer de Redis client met de volledige verbindings-URL
// We exporteren deze als 'redis', in plaats van 'kv'.
export const redis = new Redis(process.env.REDIS_URL); 

// Optioneel: Log de verbinding voor debugging
redis.on('connect', () => {
    console.log('✅ Redis verbinding succesvol.');
});