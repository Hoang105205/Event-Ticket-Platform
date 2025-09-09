type KeycloakRole = "ROLE_ADMINISTRATOR" | "ROLE_ORGANIZER" | "ROLE_ATTENDEE" | "ROLE_STAFF";

// Internal route system types (simplified)
export type UserRole = 'administrator' | 'organizer' | 'staff' | 'attendee';

// Adapter: Convert từ Keycloak roles sang internal roles
export const mapKeycloakRoleToUserRole = (keycloakRoles: string[]): UserRole => {
  // Priority: ADMINISTRATOR > ORGANIZER > STAFF > ATTENDEE
  if (keycloakRoles.includes("ROLE_ADMINISTRATOR")) return 'administrator';
  if (keycloakRoles.includes("ROLE_ORGANIZER")) return 'organizer';
  if (keycloakRoles.includes("ROLE_STAFF")) return 'staff';
  return 'attendee'; // Default
};

// Reverse mapping: Internal role to Keycloak roles
export const mapUserRoleToKeycloakRoles = (userRole: UserRole): KeycloakRole[] => {
  switch (userRole) {
    case 'administrator': return ["ROLE_ADMINISTRATOR"];
    case 'organizer': return ["ROLE_ORGANIZER"];
    case 'staff': return ["ROLE_STAFF"];
    case 'attendee': return ["ROLE_ATTENDEE"];
    default: return ["ROLE_ATTENDEE"];
  }
};

// Check if user có required role
export const hasRequiredRole = (userKeycloakRoles: string[], allowedRoles: UserRole[]): boolean => {
  const userRole = mapKeycloakRoleToUserRole(userKeycloakRoles);
  return allowedRoles.includes(userRole);
};

export interface RouteConfig {
  path: string;
  allowedRoles: UserRole[];
  label: string;
  icon?: string;        // For button icons
  description?: string; // For tooltips/accessibility
}

export const ROUTES_CONFIG: RouteConfig[] = [

  // Dashboard routes
  {
  path: '/dashboard',
  allowedRoles: ['staff', 'organizer', 'attendee', 'administrator'],
  label: 'Dashboard',
  icon: 'LayoutDashboard',
  description: 'Overview and quick actions'
  },

  // Administrator routes
  {
    path: '/dashboard/administration',
    allowedRoles: ['administrator'],
    label: 'Manage Platform',
    icon: 'ShieldCheck',
    description: 'Manage platform settings and users'
  },

  {
    path: '/dashboard/administration/manage-users',
    allowedRoles: ['administrator'],
    label: 'Manage Users',
    icon: 'Users',
    description: 'Manage users in the platform'
  },




  // Organizer routes
  {
    path: '/dashboard/events',
    allowedRoles: ['organizer'],
    label: 'Manage Events',
    icon: 'Calendar',
    description: 'Manage events'
  },

  {
    path: '/dashboard/events/create',
    allowedRoles: ['organizer'],
    label: 'Create Event',
    icon: 'PlusCircle',
    description: 'Create event'
  },

  {
    path: '/dashboard/events/update/:id',
    allowedRoles: ['organizer'],
    label: 'Update Event',
    icon: 'Edit',
    description: 'Update event'
  },

  // Attendee routes
  {
    path: '/dashboard/tickets',
    allowedRoles: ['attendee'],
    label: 'My Tickets',
    icon: 'Ticket',
    description: 'View your tickets'
  },
  {
    path: '/dashboard/tickets/:id',
    allowedRoles: ['attendee'],
    label: 'Ticket Details',
    icon: 'Eye',
    description: 'View ticket details'
  },

  {
    path: '/events/:eventId/purchase/:ticketTypeId',
    allowedRoles: ['attendee'],
    label: 'Purchase Ticket',
    icon: 'Ticket',
    description: 'Purchase a ticket for the event'
  },

  // Staff routes
  {
    path: '/dashboard/validate-qr',
    allowedRoles: ['staff'],
    label: 'QR Validation',
    icon: 'QrCode',
    description: 'Validate ticket QR codes'
  },


];

// Helper functions với adapter layer
export const getRouteConfig = (path: string): RouteConfig | undefined => {
  return ROUTES_CONFIG.find(route => route.path === path);
};

export const getRoutesForUser = (userKeycloakRoles: string[]): RouteConfig[] => {
  return ROUTES_CONFIG.filter(route => 
    hasRequiredRole(userKeycloakRoles, route.allowedRoles)
  );
};

export const canUserAccessRoute = (userKeycloakRoles: string[], path: string): boolean => {
  const routeConfig = getRouteConfig(path);
  return routeConfig ? hasRequiredRole(userKeycloakRoles, routeConfig.allowedRoles) : false;
};

// Default paths với simplified roles
export const DEFAULT_PATHS: Record<UserRole, string> = {
  administrator: '/dashboard',
  organizer: '/dashboard',
  staff: '/dashboard',
  attendee: '/dashboard'
};

export const FALLBACK_PATHS: Record<UserRole, string> = {
  administrator: '/dashboard',
  organizer: '/dashboard',
  staff: '/dashboard',
  attendee: '/'
};

// Helper để get fallback path từ Keycloak roles
export const getFallbackPathForUser = (userKeycloakRoles: string[]): string => {
  const userRole = mapKeycloakRoleToUserRole(userKeycloakRoles);
  return FALLBACK_PATHS[userRole];
};

export const getDefaultPathForUser = (userKeycloakRoles: string[]): string => {
  const userRole = mapKeycloakRoleToUserRole(userKeycloakRoles);
  return DEFAULT_PATHS[userRole];
};