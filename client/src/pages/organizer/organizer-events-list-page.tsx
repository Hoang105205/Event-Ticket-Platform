import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  EventSummary,
  EventStatusEnum,
  SpringBootPagination,
} from "@/domain/domain";
import { deleteEvent, listEvents } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  Clock,
  Edit,
  MapPin,
  Tag,
  Trash,
  Plus,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";

const OrganizerEventsListpage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [events, setEvents] = useState<
    SpringBootPagination<EventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [deleteEventError, setDeleteEventError] = useState<
    string | undefined
  >();

  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<
    EventSummary | undefined
  >();

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }
    refreshEvents(user.access_token);
  }, [isLoading, user, page]);

  const refreshEvents = async (accessToken: string) => {
    try {
      setEvents(await listEvents(accessToken, page));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error has occurred");
      }
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) {
      return "TBD";
    }
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date?: Date) => {
    if (!date) {
      return "";
    }
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatusBadge = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.DRAFT:
        return "bg-gray-800/50 text-gray-300 border border-gray-600/50";
      case EventStatusEnum.PUBLISHED:
        return "bg-green-900/50 text-green-300 border border-green-700/50";
      case EventStatusEnum.CANCELLED:
        return "bg-red-900/50 text-red-300 border border-red-700/50";
      case EventStatusEnum.COMPLETED:
        return "bg-blue-900/50 text-blue-300 border border-blue-700/50";
      default:
        return "bg-gray-800/50 text-gray-300 border border-gray-600/50";
    }
  };

  const getStatusIcon = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.PUBLISHED:
        return "🟢";
      case EventStatusEnum.CANCELLED:
        return "🔴";
      case EventStatusEnum.COMPLETED:
        return "🏁";
      default:
        return "⚫";
    }
  };

  const handleOpenDeleteEventDialog = (eventToDelete: EventSummary) => {
    setEventToDelete(eventToDelete);
    setDialogOpen(true);
  };

  const handleCancelDeleteEventDialog = () => {
    setEventToDelete(undefined);
    setDialogOpen(false);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete || isLoading || !user?.access_token) {
      return;
    }

    try {
      setDeleteEventError(undefined);
      await deleteEvent(user.access_token, eventToDelete.id);
      setEventToDelete(undefined);
      setDialogOpen(false);
      refreshEvents(user.access_token);
    } catch (err) {
      if (err instanceof Error) {
        setDeleteEventError(err.message);
      } else if (typeof err === "string") {
        setDeleteEventError(err);
      } else {
        setDeleteEventError("An unknown error has occurred");
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="container mx-auto">
          <Alert variant="destructive" className="bg-gray-900 border-red-700 animate-shake">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-12 h-12 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Events
            </h1>
            {events && events.totalElements > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-900/30 to-purple-800/30 rounded-full border border-purple-700/50 backdrop-blur-sm">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">
                  {events.totalElements} events
                </span>
              </div>
            )}
          </div>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Manage and track all your created events in one place
          </p>
        </div>

        {/* Events Grid */}
        <div className="max-w-6xl mx-auto">
          {events?.content?.length === 0 ? (
            // Enhanced Empty State
            <div className="text-center py-16 animate-fade-in">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                  <Plus className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-300 mb-4">
                  No Events Yet
                </h3>
                <p className="text-gray-400 text-lg mb-8">
                  Start creating amazing events for your audience. Your first event is just one click away!
                </p>
                <Link to="/dashboard/events/create">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 text-lg rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/30">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Event
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            // Events Grid
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events?.content?.map((eventItem, index) => (
                <Card
                  key={eventItem.id}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 text-white backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-bold text-xl text-white group-hover:text-purple-200 transition-colors duration-200 line-clamp-2">
                        {eventItem.name}
                      </h3>
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${formatStatusBadge(eventItem.status)}`}
                      >
                        <span>{getStatusIcon(eventItem.status)}</span>
                        {eventItem.status}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Event Date & Time */}
                    <div className="flex items-start gap-3 p-3 bg-black/20 rounded-lg backdrop-blur-sm transition-all duration-200 hover:bg-black/30">
                      <Calendar className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white">
                          {formatDate(eventItem.start)} to {formatDate(eventItem.end)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatTime(eventItem.start)} - {formatTime(eventItem.end)}
                        </p>
                      </div>
                    </div>

                    {/* Sales Period */}
                    <div className="flex items-start gap-3 p-3 bg-black/20 rounded-lg backdrop-blur-sm transition-all duration-200 hover:bg-black/30">
                      <Clock className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-white">Sales Period</h4>
                        <p className="text-sm text-gray-400">
                          {formatDate(eventItem.salesStart)} to {formatDate(eventItem.salesEnd)}
                        </p>
                      </div>
                    </div>

                    {/* Venue */}
                    <div className="flex items-start gap-3 p-3 bg-black/20 rounded-lg backdrop-blur-sm transition-all duration-200 hover:bg-black/30">
                      <MapPin className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white truncate">{eventItem.venue}</p>
                      </div>
                    </div>

                    {/* Ticket Types */}
                    <div className="flex items-start gap-3 p-3 bg-black/20 rounded-lg backdrop-blur-sm transition-all duration-200 hover:bg-black/30">
                      <Tag className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-white mb-2">Ticket Types</h4>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {eventItem.ticketTypes.map((ticketType) => (
                            <div
                              key={ticketType.id}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-gray-300 truncate mr-2">{ticketType.name}</span>
                              <span className="font-medium text-green-400 flex-shrink-0">${ticketType.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-end gap-2 pt-4 border-t border-gray-700/50">
                    <Link to={`/dashboard/events/update/${eventItem.id}`}>
                      <Button
                        type="button"
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 hover:scale-105"
                      onClick={() => handleOpenDeleteEventDialog(eventItem)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {events && events.totalElements > 0 && (
            <div className="flex justify-center py-8 animate-fade-in-up">
              <SimplePagination pagination={events} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Delete Dialog */}
      <AlertDialog open={dialogOpen}>
        <AlertDialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 text-white backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-400">
              Delete Event
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 text-base">
              This will permanently delete your event <span className="font-semibold text-white">'{eventToDelete?.name}'</span> and cannot be undone. All tickets and data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {deleteEventError && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-700 animate-shake">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteEventError}</AlertDescription>
            </Alert>
          )}
          
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel 
              onClick={handleCancelDeleteEventDialog}
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 hover:scale-105 transition-all duration-200"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEvent}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:scale-105 transition-all duration-200"
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Custom CSS for animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }

        .animate-bounce-slow {
          animation: bounceGentle 2s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceGentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default OrganizerEventsListpage;
