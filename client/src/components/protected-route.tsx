import { ReactNode } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate, useLocation } from "react-router";
import { useRoles } from "@/hooks/use-roles";
import {
  canUserAccessRoute,
  getFallbackPathForUser,
  type UserRole,
} from "@/config/routes";

interface ProtectedRouteProperties {
  children: ReactNode;
  allowedRoles?: UserRole[]; // Optional: override từ route config
  fallbackPath?: string; // Optional: custom fallback path
  requireAuth?: boolean; // Optional: default true
}

const ProtectedRoute: React.FC<ProtectedRouteProperties> = ({
  children,
  allowedRoles,
  fallbackPath,
  requireAuth = true,
}) => {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const { isLoading: isRolesLoading, role } = useRoles(); // ✅ Use single role
  const location = useLocation();

  // Total loading state - wait for both auth and roles
  const isLoading = isAuthLoading || isRolesLoading;

  // Enhanced loading UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Authentication check
  if (requireAuth && !isAuthenticated) {
    // Store attempted path để redirect sau khi login
    localStorage.setItem(
      "redirectPath",
      location.pathname + location.search,
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Skip role checking nếu không require auth
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Role-based access control
  let hasAccess = false;

  if (allowedRoles) {
    // Option 1: Use explicit allowedRoles prop - check single role
    hasAccess = role ? allowedRoles.includes(role as UserRole) : false;
  } else {
    // Option 2: Use route config from ROUTES_CONFIG (automatic)
    // Convert single role back to array format for existing route functions
    const userRoles = role ? [`ROLE_${role.toUpperCase()}`] : [];
    hasAccess = canUserAccessRoute(userRoles, location.pathname);
  }

  // Redirect nếu không có quyền access
  if (!hasAccess) {
    // Convert single role back to array format for fallback function
    const userRoles = role ? [`ROLE_${role.toUpperCase()}`] : [];
    const redirectPath = fallbackPath || getFallbackPathForUser(userRoles);

    // Debug log for development (optional - có thể remove trong production)
    console.warn(
      `Unauthorized access attempt: ${location.pathname} by role:`,
      role,
    );

    return <Navigate to={redirectPath} replace />;
  }

  // All checks passed - render children
  return <>{children}</>;
};

export default ProtectedRoute;
