"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { usersService, type AdminUser } from "@/lib/api";
import { createAdminRoute, ADMIN_ROUTES } from "@/lib/adminRoutes";
import { Plus, Edit2, Trash2, User, Shield, Eye } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};

const STATE_LABELS: Record<string, string> = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  SUSPENDED: "Suspendido",
};

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "text-purple-700 bg-purple-100",
  ADMIN: "text-blue-700 bg-blue-100",
  EDITOR: "text-green-700 bg-green-100",
  VIEWER: "text-gray-700 bg-gray-100",
};

const STATE_COLORS: Record<string, string> = {
  ACTIVE: "text-green-700 bg-green-100",
  INACTIVE: "text-gray-700 bg-gray-100",
  SUSPENDED: "text-red-700 bg-red-100",
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersService.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (err: any) {
      console.error("Error al cargar usuarios:", err);
      setError(err.response?.data?.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      const response = await usersService.deleteUser(id);
      if (response.success) {
        setUsers(users.filter((user) => user.id !== id));
        setDeleteConfirm(null);
      }
    } catch (err: any) {
      console.error("Error al eliminar usuario:", err);
      alert(err.response?.data?.message || "Error al eliminar usuario");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los usuarios del sistema
            </p>
          </div>
          <button
            onClick={() => router.push(createAdminRoute("/dashboard/users/create"))}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Crear Usuario
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Users Table */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No hay usuarios registrados
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              ROLE_COLORS[user.role] || "text-gray-700 bg-gray-100"
                            }`}
                          >
                            {ROLE_LABELS[user.role] || user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              STATE_COLORS[user.state] || "text-gray-700 bg-gray-100"
                            }`}
                          >
                            {STATE_LABELS[user.state] || user.state}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                router.push(
                                  createAdminRoute(`/dashboard/users/edit/${user.id}`)
                                )
                              }
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className={`p-1 ${
                                deleteConfirm === user.id
                                  ? "text-red-600 hover:text-red-900"
                                  : "text-gray-400 hover:text-red-600"
                              }`}
                              title={
                                deleteConfirm === user.id
                                  ? "Confirmar eliminación"
                                  : "Eliminar"
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Count */}
        {!loading && users.length > 0 && (
          <div className="text-sm text-gray-500 text-center">
            Total de usuarios: {users.length}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
