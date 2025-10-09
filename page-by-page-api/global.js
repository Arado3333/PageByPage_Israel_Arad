import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const ROLES = { USER: "user", EDITOR: "editor", ADMIN: "admin" };
export const USER_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  DELETED: "deleted",
};
export const PERMISSIONS = {
  CREATE_USER: "create_user",
  DELETE_USER: "delete_user",
  EDIT_USER: "edit_user",
  VIEW_LOGS: "view_logs",
  MANAGE_AI_SETTINGS: "manage_ai_settings",
  MANAGE_SYSTEM_SETTINGS: "manage_system_settings",
};

// JWT Configuration
export const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
export const JWT_EXPIRES_IN = "1h"; // Token expires in 1 hour
