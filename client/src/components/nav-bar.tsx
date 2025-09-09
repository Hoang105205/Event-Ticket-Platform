import { useAuth } from "react-oidc-context";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  LogOut,
  LogIn,
  Calendar,
  Plus,
  Search,
  Ticket,
  QrCode,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useRoles } from "@/hooks/use-roles";
import { Link, useNavigate } from "react-router";

const NavBar: React.FC = () => {
  const { user, signoutRedirect, isAuthenticated, isLoading: isAuthLoading } =
    useAuth();
  const { isAdministrator, isOrganizer, isAttendee, isStaff, isLoading: isRolesLoading } = useRoles();
  const navigate = useNavigate();

  const isLoading = isAuthLoading || isRolesLoading;

  // Helper function để handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 border-b border-gray-700/50 text-white backdrop-blur-xl shadow-lg shadow-purple-500/10">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          {/* Left side - Logo + Navigation */}
          <div className="flex gap-6 md:gap-10 items-center">
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all duration-300 hover:scale-105"
            >
              Event Ticket Platform
            </Link>

            {/* Navigation Links - Role-based access */}
            {isAuthenticated && !isLoading && (
              <nav className="flex gap-2 items-center">
                {/* Organizer Navigation - Event management only */}
                {isOrganizer && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigation("/dashboard/events")}
                      className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 border border-transparent hover:border-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                      Your Events
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigation("/dashboard/events/create")}
                      className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-green-600/20 hover:to-blue-600/20 border border-transparent hover:border-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
                    >
                      <Plus className="w-4 h-4 mr-2 text-green-400" />
                      Create Event
                    </Button>
                  </>
                )}

                {/* Staff Navigation - QR validation only */}
                {isStaff && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation("/dashboard/validate-qr")}
                    className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-600/20 hover:to-red-600/20 border border-transparent hover:border-orange-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20"
                  >
                    <QrCode className="w-4 h-4 mr-2 text-orange-400" />
                    QR Validation
                  </Button>
                )}

                {/* Attendee Navigation - Browse and tickets only */}
                {isAttendee && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigation("/")}
                      className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 border border-transparent hover:border-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <Search className="w-4 h-4 mr-2 text-blue-400" />
                      Browse Events
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigation("/dashboard/tickets")}
                      className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-purple-600/20 border border-transparent hover:border-pink-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20"
                    >
                      <Ticket className="w-4 h-4 mr-2 text-pink-400" />
                      My Tickets
                    </Button>
                  </>
                )}

                {/* Administrator Navigation - Admin features */}
                {isAdministrator && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigation("/dashboard/administration")}
                      className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-yellow-600/20 hover:to-orange-600/20 border border-transparent hover:border-yellow-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20"
                    >
                      <ShieldCheck className="w-4 h-4 mr-2 text-yellow-400" />
                      Admin Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigation("/dashboard/administration/manage-users")}
                      className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-green-600/20 border border-transparent hover:border-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <Users className="w-4 h-4 mr-2 text-blue-400" />
                      Manage Users
                    </Button>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Right side - User Actions */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              // Enhanced Loading state
              <div className="relative">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500/20 border-t-purple-500"></div>
                <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-pulse"></div>
              </div>
            ) : !isAuthenticated ? (
              // Enhanced Login button
              <Button
                onClick={() => handleNavigation("/login")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border border-blue-500/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            ) : (
              // Enhanced User dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full border border-gray-600/50 hover:border-purple-500/50 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-purple-900/30 hover:to-pink-900/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold">
                        {user?.profile?.preferred_username
                          ?.slice(0, 2)
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600/50 text-white shadow-xl shadow-purple-500/10 backdrop-blur-xl animate-fade-in"
                  align="end"
                  forceMount
                >
                  {/* User Info */}
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold">
                            {user?.profile?.preferred_username
                              ?.slice(0, 2)
                              .toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold leading-none text-white">
                            {user?.profile?.preferred_username || "User"}
                          </p>
                          <p className="text-xs leading-none text-gray-400 mt-1">
                            {user?.profile?.email || "No email"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Role badge */}
                      <div className="flex gap-1">
                        {isOrganizer && (
                          <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                            Organizer
                          </span>
                        )}
                        {isAttendee && (
                          <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                            Attendee
                          </span>
                        )}
                        {isStaff && (
                          <span className="px-2 py-1 bg-orange-600/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                            Staff
                          </span>
                        )}
                        {isAdministrator && (
                          <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

                  {/* Logout */}
                  <DropdownMenuItem
                    className="hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/30 cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300 m-2 rounded-lg border border-transparent hover:border-red-500/30 transition-all duration-200"
                    onClick={() => signoutRedirect()}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NavBar;
