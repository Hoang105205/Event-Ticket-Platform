import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SpringBootPagination, TicketSummary } from "@/domain/domain";
import { listTickets } from "@/lib/api";
import { AlertCircle, DollarSign, Tag, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useNavigate } from "react-router";

import { TicketStatus } from "@/domain/domain";

const AttendeeTicketListPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<
    SpringBootPagination<TicketSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);

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
                    <Link
                      key={ticketItem.id}
                      to={`/dashboard/tickets/${ticketItem.id}`}
                      className="block transition-transform hover:scale-105"
                    >
                      <Card className="bg-gray-900 border-gray-700 text-white h-full hover:bg-gray-800 transition-colors">
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
                      </Card>
                    </Link>
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
    </div>
  );
};

export default AttendeeTicketListPage;