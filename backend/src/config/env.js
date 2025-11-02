import dotenv from "dotenv";

dotenv.config();

const required = (name, fallback) => {
  const val = process.env[name] ?? fallback;

  if (val === undefined) throw new Error(`Missing required env ${name}`);

  return val;
};

export const env = {
  nodeEnv: required("NODE_ENV", "development"),
  port: Number(required("PORT", 3000)),
  mongoUri: required("MONGO_URI"),
  corsOrigin: required("CORS_ORIGIN", "*"),
  jwtSecret : required("JWT_SECRET"),
  
};
