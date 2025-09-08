import RandomEventImage from "@/components/random-event-image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  PublishedEventDetails,
  PublishedEventTicketTypeDetails,
} from "@/domain/domain";
import { getPublishedEvent } from "@/lib/api";
import { AlertCircle, MapPin, Calendar, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useNavigate, useParams } from "react-router";

const PublishedEventsPage: React.FC = () => {
  const { isLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState<string | undefined>();
  const [publishedEvent, setPublishedEvent] = useState<
    PublishedEventDetails | undefined
  >();
  const [selectedTicketType, setSelectedTicketType] = useState<
    PublishedEventTicketTypeDetails | undefined
  >();

  // Date formatting function
  const formatDateRange = (startStr?: string, endStr?: string): string | null => {
    if (!startStr || !endStr) {
      return null;
    }
    
    try {
      const start = new Date(startStr);
      const end = new Date(endStr);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return null;
      }

      const formatOptions: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
      };

      return `${start.toLocaleDateString("en-US", formatOptions)} - ${end.toLocaleDateString(
        "en-US",
        formatOptions
      )}`;
    } catch (error) {
      console.error("Error formatting dates:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!id) {
      setError("ID must be provided!");
      return;
    }

    const doUseEffect = async () => {
      try {
        const eventData = await getPublishedEvent(id);
        setPublishedEvent(eventData);
        if (eventData.ticketTypes.length > 0) {
          setSelectedTicketType(eventData.ticketTypes[0]);
        }
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
    doUseEffect();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto p-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          <Alert variant="destructive" className="bg-gray-900 border-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading || !publishedEvent) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Back Button */}
      <div className="container mx-auto p-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Header Section with Animations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Left Column - Event Info */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              {publishedEvent?.name}
            </h1>

            {/* Venue info with hover effect */}
            <div className="flex items-center gap-3 text-lg text-gray-300 hover:text-white transition-colors duration-200 p-3 rounded-lg hover:bg-gray-800/50">
              <MapPin className="text-purple-400" />
              <span>{publishedEvent?.venue}</span>
            </div>

            {/* Date info with hover effect */}
            {publishedEvent?.start && publishedEvent?.end && (
              <div className="flex items-center gap-3 text-lg text-gray-300 hover:text-white transition-colors duration-200 p-3 rounded-lg hover:bg-gray-800/50">
                <Calendar className="text-purple-400" />
                <span>{formatDateRange(publishedEvent.start, publishedEvent.end)}</span>
              </div>
            )}

            {/* Fallback for missing dates */}
            {(!publishedEvent?.start || !publishedEvent?.end) && (
              <div className="flex items-center gap-3 text-lg text-gray-500 p-3 rounded-lg">
                <Calendar className="text-gray-500" />
                <span>Date to be announced</span>
              </div>
            )}
          </div>

          {/* Right Column - Event Image */}
          <div className="flex justify-center lg:justify-end animate-slide-in-right">
            <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-2xl p-4 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
              <div className="bg-gray-600 rounded-lg w-full max-w-sm overflow-hidden shadow-2xl">
                <RandomEventImage />
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Section */}
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Available Tickets
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left - Ticket Types List */}
            <div className="space-y-4">
              {publishedEvent?.ticketTypes?.map((ticketType, index) => (
                <Card
                  key={ticketType.id}
                  className={`bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm ${
                    selectedTicketType?.id === ticketType.id 
                      ? 'ring-2 ring-purple-500 bg-gray-700/50' 
                      : ''
                  }`}
                  onClick={() => setSelectedTicketType(ticketType)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInLeft 0.6s ease-out forwards'
                  }}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">
                        {ticketType.name}
                      </h3>
                      <span className="text-xl font-bold text-green-400">
                        ${ticketType.price}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm">
                      {ticketType.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right - Selected Ticket Details */}
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-600 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 sticky top-8">
                {selectedTicketType ? (
                  <>
                    <h2 className="text-3xl font-bold mb-4 text-white">
                      {selectedTicketType.name}
                    </h2>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-green-400">
                        ${selectedTicketType.price}
                      </span>
                    </div>
                    
                    <div className="mb-8">
                      <p className="text-gray-300 text-lg leading-relaxed">
                        {selectedTicketType.description}
                      </p>
                    </div>
                    
                    <Link
                      to={`/events/${publishedEvent?.id}/purchase/${selectedTicketType?.id}`}
                      className="block"
                    >
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30">
                        Purchase Ticket
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">
                      Select a ticket type to see details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
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
      `}</style>
    </div>
  );
};

export default PublishedEventsPage;
