import { TicketDetails, TicketStatus } from "@/domain/domain";
import { getTicket, getTicketQr } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, DollarSign, MapPin, Tag, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams, useNavigate } from "react-router";

const DashboardViewTicketPage: React.FC = () => {
  const [ticket, setTicket] = useState<TicketDetails | undefined>();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>();
  const [isQrLoading, setIsQrCodeLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const { id } = useParams();
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !user?.access_token || !id) {
      return;
    }

    const doUseEffect = async (accessToken: string, id: string) => {
      try {
        setIsQrCodeLoading(true);
        setError(undefined);

        setTicket(await getTicket(accessToken, id));
        setQrCodeUrl(URL.createObjectURL(await getTicketQr(accessToken, id)));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error has occurred");
        }
      } finally {
        setIsQrCodeLoading(false);
      }
    };

    doUseEffect(user?.access_token, id);

    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [user?.access_token, isLoading, id]);

  const getStatusBadgeStyle = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.PURCHASED:
        return "bg-green-900/50 text-green-300 border border-green-700/50";
      case TicketStatus.CANCELLED:
        return "bg-red-900/50 text-red-300 border border-red-700/50";
      default:
        return "bg-gray-900/50 text-gray-300 border border-gray-700/50";
    }
  };

  if (!ticket) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading ticket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header with Back Button */}
      <div className="container mx-auto p-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/tickets")}
          className="mb-4 text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Your Tickets
        </Button>
      </div>

      {/* Ticket Content */}
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20">
            {/* Animated background overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 rounded-3xl animate-pulse"></div>

            {/* Content with relative positioning */}
            <div className="relative z-10">
              {/* Status Badge with enhanced styling */}
              <div
                className={`backdrop-blur-sm px-4 py-2 rounded-full mb-8 text-center transition-all duration-300 ${getStatusBadgeStyle(
                  ticket.status
                )}`}
              >
                <span className="text-sm font-medium">{ticket?.status}</span>
              </div>

              {/* Event Info */}
              <div className="mb-2">
                <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {ticket.eventName}
                </h1>
                <div className="flex items-center gap-2 text-purple-200">
                  <MapPin className="w-4 animate-pulse" />
                  <span>{ticket.eventVenue}</span>
                </div>
              </div>

              {/* Date Info */}
              <div className="flex items-center gap-2 text-purple-300 mb-8">
                <Calendar className="w-4 text-purple-200" />
                <div className="text-sm">
                  {format(ticket.eventStart, "Pp")} -{" "}
                  {format(ticket.eventEnd, "Pp")}
                </div>
              </div>

              {/* QR Code Section with enhanced styling */}
              <div className="flex justify-center mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <div className="w-32 h-32 flex items-center justify-center">
                    {/* Loading */}
                    {isQrLoading && (
                      <div className="text-xs text-center p-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2 mx-auto"></div>
                        <div className="text-gray-800">Loading QR...</div>
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="text-red-400 text-sm text-center p-2">
                        <div className="mb-1 text-2xl animate-bounce">⚠️</div>
                        {error}
                      </div>
                    )}

                    {/* Display QR */}
                    {qrCodeUrl && !isQrLoading && !error && (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code for event"
                        className="w-full h-full object-contain rounded-lg transition-all duration-300 hover:scale-110"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* QR Instructions */}
              <div className="text-center mb-8">
                <p className="text-purple-200 text-sm animate-pulse">
                  Present this QR code at the venue for entry
                </p>
              </div>

              {/* Ticket Details */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg backdrop-blur-sm transition-all duration-200 hover:bg-black/30">
                  <Tag className="w-5 text-purple-200" />
                  <span className="font-semibold">{ticket.description}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg backdrop-blur-sm transition-all duration-200 hover:bg-black/30">
                  <DollarSign className="w-5 text-green-400" />
                  <span className="font-semibold text-green-400">
                    ${ticket.price}
                  </span>
                </div>
              </div>

              {/* Ticket ID */}
              <div className="text-center">
                <h4 className="text-sm font-semibold font-mono text-purple-200 mb-1">
                  Ticket ID
                </h4>
                <p className="text-purple-200 text-sm font-mono bg-black/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                  {ticket.id}
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardViewTicketPage;
