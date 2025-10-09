"use client";

import { useState } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { X, Eye, EyeOff } from "lucide-react";
import { getTokenFromCookies } from "../../lib/clientAuth.js";
import { logUserManagementEvent } from "../../lib/logManager";

export default function CreateUserModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    bio: "",
    permissions: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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
        `${process.env.NEXT_PUBLIC_SERVICE}/api/admin/users`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Log the user creation
        logUserManagementEvent(
          "User created",
          data.user?._id || "unknown",
          formData.email,
          {
            action: "create_user",
            newUserEmail: formData.email,
            newUserRole: formData.role,
            permissions: formData.permissions,
            timestamp: new Date().toISOString(),
          }
        );

        onSuccess();
      } else {
        setErrors({ submit: data.message || "Failed to create user" });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setErrors({ submit: "Failed to create user" });
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
          <CardTitle>Create New User</CardTitle>
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Enter password"
                  className={errors.password ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
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
                {loading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
