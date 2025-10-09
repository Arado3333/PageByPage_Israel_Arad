"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  RotateCcw,
  Key,
} from "lucide-react";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import ConfirmDialog from "./ConfirmDialog";
import { getTokenFromCookies } from "../../lib/clientAuth.js";
import { logUserManagementEvent } from "../../lib/logManager";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(activeSearchTerm && { search: activeSearchTerm }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/admin/users?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeSearchTerm, roleFilter, statusFilter]);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveSearchTerm("");
  };

  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSuspendUser = (user) => {
    setSelectedUser(user);
    setConfirmAction("suspend");
    setShowConfirmDialog(true);
  };

  const handleActivateUser = (user) => {
    setSelectedUser(user);
    setConfirmAction("activate");
    setShowConfirmDialog(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setConfirmAction("delete");
    setShowConfirmDialog(true);
  };

  const handleRestoreUser = (user) => {
    setSelectedUser(user);
    setConfirmAction("restore");
    setShowConfirmDialog(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setConfirmAction("resetPassword");
    setShowConfirmDialog(true);
  };

  const executeAction = async () => {
    if (!selectedUser || !confirmAction) return;

    try {
      const token = getTokenFromCookies();
      let endpoint = "";
      let method = "PATCH";

      switch (confirmAction) {
        case "suspend":
          endpoint = `/api/admin/users/${selectedUser._id}/status`;
          break;
        case "activate":
          endpoint = `/api/admin/users/${selectedUser._id}/status`;
          break;
        case "delete":
          endpoint = `/api/admin/users/${selectedUser._id}`;
          method = "DELETE";
          break;
        case "restore":
          endpoint = `/api/admin/users/${selectedUser._id}/restore`;
          method = "POST";
          break;
        case "resetPassword":
          endpoint = `/api/admin/users/${selectedUser._id}/reset-password`;
          method = "POST";
          break;
      }

      const body =
        confirmAction === "suspend"
          ? { status: "suspended" }
          : confirmAction === "activate"
          ? { status: "active" }
          : confirmAction === "resetPassword"
          ? { newPassword: "TempPassword123!" }
          : undefined;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}${endpoint}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          ...(body && { body: JSON.stringify(body) }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Log the action
        const actionMap = {
          suspend: "User suspended",
          activate: "User activated",
          delete: "User deleted",
          restore: "User restored",
          resetPassword: "User password reset",
        };

        logUserManagementEvent(
          actionMap[confirmAction] || confirmAction,
          selectedUser._id,
          selectedUser.email,
          {
            action: confirmAction,
            targetUser: selectedUser.email,
            targetUserId: selectedUser._id,
            timestamp: new Date().toISOString(),
          }
        );

        fetchUsers(); // Refresh the list
        setShowConfirmDialog(false);
        setSelectedUser(null);
        setConfirmAction(null);
      } else {
        alert(data.message || "Action failed");
      }
    } catch (error) {
      console.error("Error executing action:", error);
      alert("Action failed");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "default",
      suspended: "destructive",
      deleted: "secondary",
    };

    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getRoleBadge = (role) => {
    const variants = {
      admin: "destructive",
      editor: "default",
      user: "secondary",
    };

    return <Badge variant={variants[role] || "secondary"}>{role}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            User Management
          </h2>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <Button onClick={handleCreateUser} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                {(searchTerm || activeSearchTerm) && (
                  <Button
                    onClick={handleClearSearch}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Last Login</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{getRoleBadge(user.role)}</td>
                    <td className="p-2">{getStatusBadge(user.status)}</td>
                    <td className="p-2 text-sm text-gray-600">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>

                        {user.status === "active" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSuspendUser(user)}
                          >
                            <UserX className="h-3 w-3" />
                          </Button>
                        ) : user.status === "suspended" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleActivateUser(user)}
                          >
                            <UserCheck className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestoreUser(user)}
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResetPassword(user)}
                        >
                          <Key className="h-3 w-3" />
                        </Button>

                        {user.status !== "deleted" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchUsers();
          }}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      )}

      {showConfirmDialog && selectedUser && (
        <ConfirmDialog
          user={selectedUser}
          action={confirmAction}
          onClose={() => {
            setShowConfirmDialog(false);
            setSelectedUser(null);
            setConfirmAction(null);
          }}
          onConfirm={executeAction}
        />
      )}
    </div>
  );
}
