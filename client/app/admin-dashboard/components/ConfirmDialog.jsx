"use client";

import { Button } from "../../books/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import {
  AlertTriangle,
  UserX,
  UserCheck,
  Trash2,
  RotateCcw,
  Key,
} from "lucide-react";

export default function ConfirmDialog({ user, action, onClose, onConfirm }) {
  const getActionConfig = () => {
    switch (action) {
      case "suspend":
        return {
          title: "Suspend User",
          message: `Are you sure you want to suspend ${user.name}? They will not be able to log in until reactivated.`,
          icon: <UserX className="h-6 w-6 text-orange-500" />,
          confirmText: "Suspend User",
          confirmVariant: "destructive",
        };
      case "activate":
        return {
          title: "Activate User",
          message: `Are you sure you want to activate ${user.name}? They will be able to log in again.`,
          icon: <UserCheck className="h-6 w-6 text-green-500" />,
          confirmText: "Activate User",
          confirmVariant: "default",
        };
      case "delete":
        return {
          title: "Delete User",
          message: `Are you sure you want to delete ${user.name}? This will deactivate their account and they will not be able to log in. This action can be reversed by restoring the user.`,
          icon: <Trash2 className="h-6 w-6 text-red-500" />,
          confirmText: "Delete User",
          confirmVariant: "destructive",
        };
      case "restore":
        return {
          title: "Restore User",
          message: `Are you sure you want to restore ${user.name}? They will be able to log in again.`,
          icon: <RotateCcw className="h-6 w-6 text-blue-500" />,
          confirmText: "Restore User",
          confirmVariant: "default",
        };
      case "resetPassword":
        return {
          title: "Reset Password",
          message: `Are you sure you want to reset the password for ${user.name}? A temporary password will be generated and they will need to change it on their next login.`,
          icon: <Key className="h-6 w-6 text-purple-500" />,
          confirmText: "Reset Password",
          confirmVariant: "default",
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to perform this action?",
          icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
          confirmText: "Confirm",
          confirmVariant: "default",
        };
    }
  };

  const config = getActionConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {config.icon}
            {config.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{config.message}</p>

          {/* User Details */}
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm">
              <div>
                <strong>Name:</strong> {user.name}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Role:</strong> {user.role}
              </div>
              <div>
                <strong>Status:</strong> {user.status}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant={config.confirmVariant} onClick={onConfirm}>
              {config.confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
