import User from "../../users/models/user.model.js";
import AdminUserModel from "../models/user.model.js";
import {
  ROLES,
  USER_STATUS,
  PERMISSIONS,
  JWT_SECRET,
} from "../../../global.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Get all users with pagination and filtering
export async function getAllUsers(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      role = "",
      status = "",
      includeDeleted = false,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.status = status;
    }

    if (!includeDeleted) {
      filter.status = { $ne: USER_STATUS.DELETED };
    }

    const users = await AdminUserModel.getAllUsersPaginated(
      filter,
      skip,
      parseInt(limit)
    );
    const total = await AdminUserModel.getUsersCount(filter);

    res.status(200).json({
      success: true,
      users: users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
}

// Create new user
export async function createUser(req, res) {
  try {
    const { name, email, password, role, permissions, bio } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if email already exists
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Create new user
    const user = new User(name, email, password, role, bio, permissions);
    const result = await user.save();

    // Log user creation
    await logEvent({
      eventType: "user_management",
      action: "create_user",
      userId: req.user.userId,
      details: {
        createdUserId: result.insertedId,
        createdUserEmail: email,
        role: role || ROLES.USER,
      },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: result.insertedId,
        name,
        email,
        role: role || ROLES.USER,
        status: USER_STATUS.ACTIVE,
        permissions: user.permissions,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
    });
  }
}

// Update user
export async function updateUser(req, res) {
  try {
    const { userId } = req.params;
    const { name, email, role, permissions, status, bio } = req.body;

    // Prevent admin from demoting themselves
    if (req.user.userId === userId && role && role !== ROLES.ADMIN) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await User.getUserByEmail(email);
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }
    }

    // Get current user
    const currentUser = await AdminUserModel.getUserById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields
    const updateData = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (permissions) updateData.permissions = permissions;
    if (status) updateData.status = status;
    if (bio !== undefined) updateData.bio = bio;

    const result = await AdminUserModel.updateUser(userId, updateData);

    // Log user update
    await logEvent({
      eventType: "user_management",
      action: "update_user",
      userId: req.user.userId,
      details: {
        updatedUserId: userId,
        changes: updateData,
      },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: result,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
    });
  }
}

// Update user status (suspend/activate)
export async function updateUserStatus(req, res) {
  try {
    const { userId } = req.params;
    const { status, reason } = req.body;

    if (!Object.values(USER_STATUS).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Prevent admin from suspending themselves
    if (req.user.userId === userId && status === USER_STATUS.SUSPENDED) {
      return res.status(400).json({
        success: false,
        message: "You cannot suspend yourself",
      });
    }

    const user = await AdminUserModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create user instance to use methods
    const userInstance = new User(
      user.name,
      user.email,
      "dummy",
      user.role,
      user.bio,
      user.permissions
    );
    userInstance._id = user._id.toString();
    await userInstance.updateStatus(status);

    // Log status change
    await logEvent({
      eventType: "user_management",
      action: "update_user_status",
      userId: req.user.userId,
      details: {
        targetUserId: userId,
        newStatus: status,
        reason: reason || null,
      },
    });

    res.status(200).json({
      success: true,
      message: `User ${status} successfully`,
      user: {
        _id: user._id,
        email: user.email,
        status: status,
      },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user status",
    });
  }
}

// Soft delete user
export async function deleteUser(req, res) {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.userId === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete yourself",
      });
    }

    const user = await AdminUserModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if this is the last admin
    if (user.role === ROLES.ADMIN) {
      const adminCount = await AdminUserModel.getUsersCount({
        role: ROLES.ADMIN,
        status: USER_STATUS.ACTIVE,
      });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete the last admin user",
        });
      }
    }

    // Create user instance to use methods
    const userInstance = new User(
      user.name,
      user.email,
      "dummy",
      user.role,
      user.bio,
      user.permissions
    );
    userInstance._id = user._id.toString();

    await userInstance.softDelete();

    // Log user deletion
    await logEvent({
      eventType: "user_management",
      action: "delete_user",
      userId: req.user.userId,
      details: {
        deletedUserId: userId,
        deletedUserEmail: user.email,
      },
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
}

// Restore deleted user
export async function restoreUser(req, res) {
  try {
    const { userId } = req.params;

    const user = await AdminUserModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.status !== USER_STATUS.DELETED) {
      return res.status(400).json({
        success: false,
        message: "User is not deleted",
      });
    }

    // Create user instance to use methods
    const userInstance = new User(
      user.name,
      user.email,
      "dummy",
      user.role,
      user.bio,
      user.permissions
    );
    userInstance._id = user._id.toString();
    await userInstance.restore();

    // Log user restoration
    await logEvent({
      eventType: "user_management",
      action: "restore_user",
      userId: req.user.userId,
      details: {
        restoredUserId: userId,
        restoredUserEmail: user.email,
      },
    });

    res.status(200).json({
      success: true,
      message: "User restored successfully",
    });
  } catch (error) {
    console.error("Error restoring user:", error);
    res.status(500).json({
      success: false,
      message: "Error restoring user",
    });
  }
}

// Reset user password
export async function resetUserPassword(req, res) {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const user = await AdminUserModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 15);
    await AdminUserModel.updateUser(userId, {
      password: hashedPassword,
      updatedAt: new Date(),
    });

    // Log password reset
    await logEvent({
      eventType: "user_management",
      action: "reset_password",
      userId: req.user.userId,
      details: {
        targetUserId: userId,
        targetUserEmail: user.email,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
}

// Simple logging function (will be replaced with proper logging system)
async function logEvent(eventData) {
  try {
    // For now, just log to console
    // In Phase 4, this will be replaced with proper logging system
    console.log("Admin Event:", {
      timestamp: new Date().toISOString(),
      ...eventData,
    });
  } catch (error) {
    console.error("Error logging event:", error);
  }
}
