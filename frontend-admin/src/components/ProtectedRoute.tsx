"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // Verificar rol si es requerido
      if (requiredRole && user) {
        const roleHierarchy = {
          SUPER_ADMIN: 3,
          ADMIN: 2,
          EDITOR: 1,
        };

        const userRole = roleHierarchy[user.role] || 0;
        const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

        if (userRole < requiredRoleLevel) {
          router.push("/unauthorized");
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verificando permisos...
          </h2>
          <p className="text-gray-600">Un momento por favor</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Se redirigirá en el useEffect
  }

  if (requiredRole && user) {
    const roleHierarchy = {
      SUPER_ADMIN: 3,
      ADMIN: 2,
      EDITOR: 1,
    };

    const userRole = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRole < requiredRoleLevel) {
      return null; // Se redirigirá en el useEffect
    }
  }

  return <>{children}</>;
}
