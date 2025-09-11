import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SpringBootPagination, TicketSummary } from "@/domain/domain";
import { listTickets, cancelTicket } from "@/lib/api";
import { AlertCircle, DollarSign, Tag, Ticket, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useNavigate } from "react-router";
import { TicketStatus } from "@/domain/domain";

// Modal component
const ConfirmCancelModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  error?: string;
}> = ({ open, onClose, onConfirm, loading, error }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 border border-red-700 rounded-xl p-8 shadow-2xl w-full max-w-sm animate-fade-in-up">
        <div className="flex flex-col items-center gap-3">
          <XCircle className="w-10 h-10 text-red-400" />
          <h2 className="text-xl font-bold text-red-300 mb-2">Cancel Ticket?</h2>
          <p className="text-gray-300 text-center mb-2">
            This action is <span className="text-red-400 font-semibold">permanent</span> and cannot be undone.<br />
            Are you sure you want to cancel this ticket?
          </p>
          {error && (
            <div className="text-red-400 bg-red-900/30 px-3 py-1 rounded mb-2 text-sm">{error}</div>
          )}
          <div className="flex gap-4 mt-2">
            <Button
              variant="destructive"
              className="bg-red-700 hover:bg-red-800 border border-red-700 transition-colors font-semibold"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Cancelling..." : "Confirm"}
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-800 bg-white hover:bg-gray-200 transition-colors font-semibold"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.3s cubic-bezier(.39,.575,.565,1) both;
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

const AttendeeTicketListPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<
    SpringBootPagination<TicketSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  // Cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | undefined>();
  const [selectedTicketId, setSelectedTicketId] = useState<string | undefined>();

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }

    const doUseEffect = async () => {
      try {
        setTickets(await listTickets(user.access_token, page));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    doUseEffect();
  }, [isLoading, user?.access_token, page]);

  // Handle cancel ticket
  const handleCancelClick = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setCancelModalOpen(true);
    setCancelError(undefined);
  };

  const handleCancelConfirm = async () => {
    if (!selectedTicketId || !user?.access_token) return;
    setCancelLoading(true);
    setCancelError(undefined);
    try {
      await cancelTicket(user.access_token, selectedTicketId);
      // Update UI: set status to CANCELLED
      setTickets((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.map((t) =>
            t.id === selectedTicketId ? { ...t, status: TicketStatus.CANCELLED } : t
          ),
        };
      });
      setCancelModalOpen(false);
    } catch (err: any) {
      setCancelError(err.message || "Cancel failed");
    } finally {
      setCancelLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white">
        <div className="container mx-auto p-4">
          <Alert variant="destructive" className="bg-gray-900 border-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Tickets</h1>
          <p className="text-gray-400">Tickets you have purchased</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {/* Tickets List */}
        {!isLoading && tickets && (
          <>
            {tickets.content.length === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No tickets found
                </h3>
                <p className="text-gray-500 mb-6">
                  You haven't purchased any tickets yet.
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Browse Events
                </Button>
              </div>
            ) : (
              // Tickets Grid
              <div className="max-w-4xl mx-auto">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {tickets.content.map((ticketItem) => (
                    <div key={ticketItem.id} className="relative group h-full">
                      <Link
                        to={`/dashboard/tickets/${ticketItem.id}`}
                        className="block transition-transform hover:scale-105 h-full"
                        tabIndex={-1}
                      >
                        <Card className="bg-gray-900 border-gray-700 text-white h-full hover:bg-gray-800 transition-colors pb-14 relative">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <Ticket className="h-5 w-5 text-blue-400" />
                                <h3 className="font-bold text-lg">
                                  {ticketItem.ticketType.name}
                                </h3>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ticketItem.status === TicketStatus.PURCHASED ? 'bg-green-900 text-green-300' :
                                ticketItem.status === TicketStatus.CANCELLED ? 'bg-gray-700 text-gray-300' :
                                'bg-yellow-900 text-yellow-300'
                              }`}>
                                {ticketItem.status}
                              </span>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            {/* Price */}
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-400" />
                              <p className="font-medium text-green-400">
                                ${ticketItem.ticketType.price}
                              </p>
                            </div>

                            {/* Ticket ID */}
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-gray-400" />
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-sm text-gray-300">
                                  Ticket ID
                                </h4>
                                <p className="text-gray-400 font-mono text-xs truncate">
                                  {ticketItem.id}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                          {/* Cancel button - nằm trong thẻ ticket, góc phải dưới */}
                          {ticketItem.status === TicketStatus.PURCHASED && (
                            <button
                              className="absolute bottom-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-red-600/90 hover:bg-red-700 transition shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 group/cancel"
                              onClick={e => {
                                e.preventDefault();
                                handleCancelClick(ticketItem.id);
                              }}
                              title="Cancel this ticket"
                            >
                              <XCircle className="w-5 h-5 text-white group-hover/cancel:scale-110 transition-transform" />
                              <span className="sr-only">Cancel</span>
                            </button>
                          )}
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {tickets.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <SimplePagination 
                      pagination={tickets} 
                      onPageChange={setPage} 
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {/* Cancel Modal */}
      <ConfirmCancelModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        loading={cancelLoading}
        error={cancelError}
      />
    </div>
  );
};

export default AttendeeTicketListPage;