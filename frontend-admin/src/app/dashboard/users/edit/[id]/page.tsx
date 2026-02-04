"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { usersService, type AdminUser } from "@/lib/api";
import { createAdminRoute, ADMIN_ROUTES } from "@/lib/adminRoutes";
import { ArrowLeft, Save, User } from "lucide-react";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = parseInt(params.id as string);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ADMIN" as "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER",
    state: "ACTIVE" as "ACTIVE" | "INACTIVE" | "SUSPENDED",
  });

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await usersService.getUserById(userId);
      if (response.success && response.data) {
        const userData = response.data;
        setUser(userData);
        setFormData({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          password: "",
          confirmPassword: "",
          role: userData.role as any,
          state: userData.state as any,
        });
      }
    } catch (err: any) {
      console.error("Error al cargar usuario:", err);
      setError(err.response?.data?.message || "Error al cargar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.name.trim()) {
      setError("El nombre es requerido");
      return;
    }
    if (!formData.username.trim()) {
      setError("El nombre de usuario es requerido");
      return;
    }
    if (!formData.email.trim()) {
      setError("El email es requerido");
      return;
    }
    
    // Validar contraseña solo si se ingresó una nueva
    if (formData.password) {
      if (formData.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }
    }

    try {
      setSaving(true);
      const updateData: any = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        state: formData.state,
      };

      // Solo incluir password si se ingresó uno nuevo
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await usersService.updateUser(userId, updateData);

      if (response.success) {
        router.push(createAdminRoute(ADMIN_ROUTES.USERS));
      }
    } catch (err: any) {
      console.error("Error al actualizar usuario:", err);
      setError(err.response?.data?.message || "Error al actualizar usuario");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Usuario no encontrado</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Usuario</h1>
            <p className="text-gray-600 mt-1">
              Modifica la información del usuario
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Información Personal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de Usuario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: juanperez"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
          </div>

          {/* Cambiar Contraseña */}
          <div className="space-y-4 pt-4 border-t">
            <h2 className="text-lg font-semibold text-gray-900">Cambiar Contraseña</h2>
            <p className="text-sm text-gray-500">
              Deja estos campos en blanco si no deseas cambiar la contraseña
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Repite la contraseña"
                />
              </div>
            </div>
          </div>

          {/* Permisos */}
          <div className="space-y-4 pt-4 border-t">
            <h2 className="text-lg font-semibold text-gray-900">Permisos y Estado</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="VIEWER">Viewer (Solo lectura)</option>
                  <option value="EDITOR">Editor (Crear/Editar)</option>
                  <option value="ADMIN">Admin (Control total)</option>
                  <option value="SUPER_ADMIN">Super Admin (Acceso completo)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      state: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                  <option value="SUSPENDED">Suspendido</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
