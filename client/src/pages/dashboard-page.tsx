import { useRoles } from "@/hooks/use-roles";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const DashboardPage: React.FC = () => {
  const { isLoading, isAdministrator, isOrganizer, isStaff } = useRoles();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return; // Wait for roles to load

    if (isAdministrator) {
      navigate("/dashboard/administration", { replace: true });
      return;
    }
    
    if (isOrganizer) {
      navigate("/dashboard/events", { replace: true });
      return;
    }

    if (isStaff) {
      navigate("/dashboard/validate-qr", { replace: true });
      return;
    }

    // Default to attendee workspace
    navigate("/dashboard/tickets", { replace: true });
  }, [isLoading, isOrganizer, isStaff, navigate]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
};

export default DashboardPage;
