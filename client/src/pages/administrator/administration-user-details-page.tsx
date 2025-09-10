import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserDetailProfile, SpringBootPagination, UserTicketDetails } from "@/domain/domain";
import { getAttendeeDetails, getAttendeeTicketDetails } from "@/lib/api";
import { useAuth } from "react-oidc-context";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, Ticket } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const AdministrationUserDetailsPage = () => {
  const { attendeeId } = useParams<{ attendeeId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [attendee, setAttendee] = useState<UserDetailProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  // Ticket paging state
  const [ticketPage, setTicketPage] = useState(0);
  const [ticketPagination, setTicketPagination] = useState<SpringBootPagination<UserTicketDetails> | null>(null);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketError, setTicketError] = useState<string | undefined>();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!user?.access_token || !attendeeId) return;
      setLoading(true);
      setError(undefined);
      try {
        const data = await getAttendeeDetails(user.access_token, attendeeId);
        setAttendee(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch attendee details");
      } finally {
        setLoading(false);
      }
    };
    if (!isAuthLoading) fetchDetails();
  }, [user?.access_token, attendeeId, isAuthLoading]);

  // Fetch tickets when attendeeId, user, or page changes
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.access_token || !attendeeId) return;
      setTicketLoading(true);
      setTicketError(undefined);
      try {
        const data = await getAttendeeTicketDetails(user.access_token, attendeeId, ticketPage, 8);
        setTicketPagination(data);
      } catch (err: any) {
        setTicketError(err.message || "Failed to fetch tickets");
      } finally {
        setTicketLoading(false);
      }
    };
    if (!isAuthLoading) fetchTickets();
  }, [user?.access_token, attendeeId, ticketPage, isAuthLoading]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#181c2b] to-[#10111a] text-white px-0 py-0 flex flex-col">
      {/* Header */}
      <div className="flex items-center px-10 pt-8 pb-2">
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 transition shadow"
          onClick={() => navigate("/dashboard/administration/manage-users")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="ml-6 text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
          Attendee Details
        </span>
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-8 px-10 pb-10">
        {/* Left: Attendee Info */}
        <div className="w-full md:max-w-xs flex-shrink-0">
          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/80 border border-gray-700 rounded-2xl p-7 shadow-xl flex flex-col gap-3 animate-fade-in-up">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 w-full">
                <Loader2 className="w-10 h-10 text-green-400 animate-spin mb-2" />
                <span className="text-gray-400">Loading attendee details...</span>
              </div>
            ) : error ? (
              <div className="text-red-400 bg-red-900/30 px-4 py-2 rounded-lg w-full">{error}</div>
            ) : attendee ? (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-semibold text-2xl text-white">{attendee.name}</span>
                </div>
                <div className="text-gray-300 text-base mb-1 break-all">
                  <span className="font-semibold text-gray-400">Email:</span>{" "}
                  <span className="text-white">{attendee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-base">
                  <span className="font-semibold text-gray-400">Total tickets:</span>
                  <span className="font-semibold text-blue-400">{attendee.totalTickets}</span>
                </div>
                {attendee.lastPurchaseDate && (
                  <div className="text-gray-400 text-sm mt-2">
                    <span className="font-semibold">Last purchase:</span>{" "}
                    {new Date(attendee.lastPurchaseDate + "Z").toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-400 w-full">No attendee found.</div>
            )}
          </Card>
        </div>
        {/* Right: Tickets */}
        <div className="flex-1 flex flex-col">
          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/80 border border-gray-700 rounded-2xl p-7 shadow-xl min-h-[200px] flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xl font-semibold text-white flex items-center gap-2 tracking-tight">
                <Ticket className="w-5 h-5 text-blue-400" /> Purchased Tickets
              </span>
              {ticketPagination && ticketPagination.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 rounded hover:bg-gray-800 disabled:opacity-50"
                    disabled={ticketPage === 0}
                    onClick={() => setTicketPage((p) => Math.max(0, p - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft />
                  </button>
                  <span className="text-gray-400 text-sm">
                    {ticketPage + 1}/{ticketPagination.totalPages}
                  </span>
                  <button
                    className="p-1 rounded hover:bg-gray-800 disabled:opacity-50"
                    disabled={ticketPagination.last}
                    onClick={() => setTicketPage((p) => p + 1)}
                    aria-label="Next page"
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </div>
            {ticketLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
              </div>
            ) : ticketError ? (
              <div className="text-red-400 bg-red-900/30 px-4 py-2 rounded-lg">{ticketError}</div>
            ) : ticketPagination && ticketPagination.content.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ticketPagination.content.map((ticket: UserTicketDetails) => (
                  <Popover key={ticket.id}>
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer bg-gradient-to-br from-gray-800/90 to-gray-900/80 border border-gray-700 rounded-xl p-5 hover:border-blue-400/60 transition-all duration-200 shadow-md group">
                        <div className="flex items-center gap-2 mb-2">
                          <Ticket className="w-4 h-4 text-blue-400" />
                          <span className="font-semibold text-base text-white truncate">{ticket.ticketType_name}</span>
                        </div>
                        <div className="text-gray-300 text-sm truncate">
                          <span className="font-semibold">Event:</span> {ticket.ticketType_event_name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-blue-300">
                            Purchased date: {new Date(ticket.createdAt + "Z").toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                          </span>
                          <span className="text-gray-400 text-xs">
                            <span className="font-semibold">Status:</span>{" "}
                            <span className={ticket.status === "PURCHASED" ? "text-green-400" : "text-red-400"}>
                              {ticket.status}
                            </span>
                          </span>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="bg-gray-900 border border-blue-400 rounded-xl shadow-2xl max-w-xs animate-fade-in-up">
                      <div className="flex flex-col gap-2">
                        <div className="font-semibold text-lg text-blue-300">{ticket.ticketType_name}</div>
                        <div className="text-gray-300 text-sm">
                          <span className="font-semibold">Event:</span> {ticket.ticketType_event_name}
                        </div>
                        <div className="text-gray-300 text-sm">
                          <span className="font-semibold">Venue:</span> {ticket.ticketType_event_venue}
                        </div>
                        <div className="text-gray-300 text-sm">
                          <span className="font-semibold">Price:</span> {ticket.ticketType_price.toLocaleString()}$
                        </div>
                        <div className="text-gray-300 text-sm">
                          <span className="font-semibold">Status:</span>{" "}
                          <span className={ticket.status === "PURCHASED" ? "text-green-400" : "text-red-400"}>
                            {ticket.status}
                          </span>
                        </div>
                        <div className="text-gray-300 text-sm">
                          <span className="font-semibold">Description:</span> {ticket.ticketType_description}
                        </div>
                        <div className="text-gray-300 text-sm">
                          <span className="font-semibold">Start:</span>{" "}
                          {new Date(ticket.ticketType_event_start).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                        </div>
                        <div className="text-gray-300 text-sm">
                          <span className="font-semibold">End:</span>{" "}
                          {new Date(ticket.ticketType_event_end).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-12">No tickets found.</div>
            )}
          </Card>
        </div>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
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

export default AdministrationUserDetailsPage;