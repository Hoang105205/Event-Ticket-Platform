import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { jwtDecode } from "jwt-decode";

interface UseRolesReturn {
  isLoading: boolean;
  role: string;
  isAdministrator: boolean;
  isOrganizer: boolean;
  isAttendee: boolean;
  isStaff: boolean;
}

interface JwtPayload {
  realm_access?: {
    roles?: string[];
  };
}

export const useRoles = (): UseRolesReturn => {
  const { isLoading: isAuthLoading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string>("");
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isAttendee, setIsAttendee] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    if (isAuthLoading || !user?.access_token) {
      setRole("");
      setIsAdministrator(false);
      setIsOrganizer(false);
      setIsAttendee(false);
      setIsStaff(false);
      setIsLoading(isAuthLoading);
      return;
    }

    try {
      const payload = jwtDecode<JwtPayload>(user?.access_token);
      const allRoles = payload.realm_access?.roles || [];
      const filteredRoles = allRoles.filter((role) => role.startsWith("ROLE_"));

      // Priority: Administrator > Organizer > Staff > Attendee
      const roleMap = [
        {
          keycloakRole: "ROLE_ADMINISTRATOR",
          role: "administrator",
          flags: { isAdministrator: true, isOrganizer: false, isStaff: false, isAttendee: false },
        },
        {
          keycloakRole: "ROLE_ORGANIZER",
          role: "organizer",
          flags: { isAdministrator: false, isOrganizer: true, isStaff: false, isAttendee: false },
        },
        {
          keycloakRole: "ROLE_STAFF",
          role: "staff",
          flags: { isAdministrator: false, isOrganizer: false, isStaff: true, isAttendee: false },
        },
        {
          keycloakRole: "ROLE_ATTENDEE",
          role: "attendee",
          flags: { isAdministrator: false, isOrganizer: false, isStaff: false, isAttendee: true },
        },
      ];

      // Find first matching role based on priority order
      const matchedRole = roleMap.find((rm) => filteredRoles.includes(rm.keycloakRole));

      if (matchedRole) {
        setRole(matchedRole.role);
        setIsAdministrator(matchedRole.flags.isAdministrator);
        setIsOrganizer(matchedRole.flags.isOrganizer);
        setIsStaff(matchedRole.flags.isStaff);
        setIsAttendee(matchedRole.flags.isAttendee);
      } else {
        setRole("");
        setIsAdministrator(false);
        setIsOrganizer(false);
        setIsStaff(false);
        setIsAttendee(false);
      }
    } catch (error) {
      console.error("Error parsing JWT: " + error);
      setRole("");
      setIsAdministrator(false);
      setIsOrganizer(false);
      setIsAttendee(false);
      setIsStaff(false);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthLoading, user?.access_token]);

  return {
    isLoading,
    role,
    isAdministrator,
    isOrganizer,
    isAttendee,
    isStaff,
  };
};
