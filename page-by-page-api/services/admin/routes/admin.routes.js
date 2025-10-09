import { Router } from "express";
import {
  isAdmin,
  canCreateUser,
  canDeleteUser,
  canEditUser,
  canManageAISettings,
} from "../../../middlewares/auth.js";
import {
  getAllUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  restoreUser,
  resetUserPassword,
} from "../controllers/admin.controller.js";
import {
  getAllAISettings,
  getGlobalAISettings,
  getUserAISettings,
  getMergedAISettings,
  upsertAISettings,
  deleteAISettings,
  initializeDefaultAISettings,
} from "../controllers/ai-settings.controller.js";

const adminRouter = Router();

// User Management Routes
adminRouter.get("/users", isAdmin, getAllUsers);
adminRouter.post("/users", isAdmin, canCreateUser, createUser);
adminRouter.put("/users/:userId", isAdmin, canEditUser, updateUser);
adminRouter.patch(
  "/users/:userId/status",
  isAdmin,
  canEditUser,
  updateUserStatus
);
adminRouter.delete("/users/:userId", isAdmin, canDeleteUser, deleteUser);
adminRouter.post("/users/:userId/restore", isAdmin, canDeleteUser, restoreUser);
adminRouter.post(
  "/users/:userId/reset-password",
  isAdmin,
  canEditUser,
  resetUserPassword
);

// AI Settings Routes
adminRouter.get("/ai-settings", isAdmin, canManageAISettings, getAllAISettings);
adminRouter.get(
  "/ai-settings/global",
  isAdmin,
  canManageAISettings,
  getGlobalAISettings
);
adminRouter.get(
  "/ai-settings/user/:userId",
  isAdmin,
  canManageAISettings,
  getUserAISettings
);
adminRouter.get(
  "/ai-settings/merged",
  isAdmin,
  canManageAISettings,
  getMergedAISettings
);
adminRouter.post(
  "/ai-settings",
  isAdmin,
  canManageAISettings,
  upsertAISettings
);
adminRouter.delete(
  "/ai-settings/:settingsId",
  isAdmin,
  canManageAISettings,
  deleteAISettings
);
adminRouter.post(
  "/ai-settings/initialize",
  isAdmin,
  canManageAISettings,
  initializeDefaultAISettings
);

export default adminRouter;
