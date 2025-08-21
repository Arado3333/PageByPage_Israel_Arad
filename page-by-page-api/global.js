import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const ROLES = { USER: "user", ADMIN: "admin" };

// JWT Configuration
export const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
export const JWT_EXPIRES_IN = "1h"; // Token expires in 1 hour
