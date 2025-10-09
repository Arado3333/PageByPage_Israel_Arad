"use client";

import { useState, useEffect } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { X } from "lucide-react";
import { getTokenFromCookies } from "../../lib/clientAuth.js";
import { logUserManagementEvent } from "../../lib/logManager";

export default function EditUserModal({ user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
    bio: "",
    permissions: [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        status: user.status || "active",
        bio: user.bio || "",
        permissions: user.permissions || [],
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handlePermissionChange = (permission, checked) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p !== permission),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = getTokenFromCookies();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/admin/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Log the user update
        logUserManagementEvent("User updated", user._id, user.email, {
          action: "update_user",
          targetUser: user.email,
          targetUserId: user._id,
          changes: {
            name:
              formData.name !== user.name
                ? { from: user.name, to: formData.name }
                : null,
            email:
              formData.email !== user.email
                ? { from: user.email, to: formData.email }
                : null,
            role:
              formData.role !== user.role
                ? { from: user.role, to: formData.role }
                : null,
            status:
              formData.status !== user.status
                ? { from: user.status, to: formData.status }
                : null,
            permissions:
              JSON.stringify(formData.permissions) !==
              JSON.stringify(user.permissions)
                ? { from: user.permissions, to: formData.permissions }
                : null,
          },
          timestamp: new Date().toISOString(),
        });

        onSuccess();
      } else {
        setErrors({ submit: data.message || "Failed to update user" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setErrors({ submit: "Failed to update user" });
    } finally {
      setLoading(false);
    }
  };

  const getTokenFromCookies = () => {
    if (typeof document === "undefined") {
      return null; // Server-side rendering
    }

    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("authToken=")
    );

    if (tokenCookie) {
      return tokenCookie.split("=")[1];
    }

    return null;
  };

  const permissions = [
    { key: "create_user", label: "Create Users" },
    { key: "edit_user", label: "Edit Users" },
    { key: "delete_user", label: "Delete Users" },
    { key: "view_logs", label: "View Logs" },
    { key: "manage_ai_settings", label: "Manage AI Settings" },
    { key: "manage_system_settings", label: "Manage System Settings" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit User</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="user">User</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Bio (Optional)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Enter user bio"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {permissions.map((permission) => (
                  <label
                    key={permission.key}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission.key)}
                      onChange={(e) =>
                        handlePermissionChange(permission.key, e.target.checked)
                      }
                      className="rounded"
                    />
                    <span className="text-sm">{permission.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* User Info */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">User Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : "Unknown"}
                </div>
                <div>
                  <span className="font-medium">Last Login:</span>{" "}
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : "Never"}
                </div>
                <div>
                  <span className="font-medium">User ID:</span> {user._id}
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <p className="text-red-500 text-sm">{errors.submit}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
