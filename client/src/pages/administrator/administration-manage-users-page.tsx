import { useEffect, useState } from "react";
import { Users, Loader2 } from "lucide-react";
import { fetchAttendeeList } from "@/lib/api";
import { UserGeneralProfile, SpringBootPagination } from "@/domain/domain";
import { useAuth } from "react-oidc-context";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimplePagination } from "@/components/simple-pagination";

const AdministrationViewAttendeesPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [attendeePagination, setAttendeePagination] = useState<SpringBootPagination<UserGeneralProfile>>();
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (isAuthLoading || !user?.access_token) return;

    const fetchData = async () => {
      try {
        const res = await fetchAttendeeList(user.access_token, page, 5);
        setAttendeePagination(res);
      } catch (err: any) {
        setError(err.message || "Failed to fetch attendees");
      }
    };
    fetchData();
  }, [user?.access_token, page, isAuthLoading]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 text-white animate-fade-in px-4 py-8">
      <div className="flex flex-col items-center gap-4 mb-8">
        <Users className="w-16 h-16 text-blue-400 animate-pulse" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Attendee List
        </h1>
        <p className="text-lg text-gray-300">All registered attendees</p>
      </div>

      {isAuthLoading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin mb-2" />
          <span className="text-gray-400">Loading attendees...</span>
        </div>
      ) : error ? (
        <div className="text-red-400 bg-red-900/30 px-4 py-2 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="w-full max-w-3xl space-y-4">
          {!attendeePagination || attendeePagination.content.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No attendees found.
            </div>
          ) : (
            attendeePagination.content.map((attendee) => (
              <Card
                key={attendee.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:border-blue-400/60 transition-all duration-200 animate-fade-in-up"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-lg text-white">
                      {attendee.name}
                    </span>
                    <Badge className="bg-blue-900 text-blue-300 border border-blue-700 text-xs">
                      {attendee.email}
                    </Badge>
                  </div>
                  <div className="text-gray-300 text-sm">
                    Total tickets:{" "}
                    <span className="font-semibold text-green-400">
                      {attendee.totalTickets}
                    </span>
                  </div>
                  {attendee.lastPurchaseDate && (
                    <div className="text-gray-400 text-xs mt-1">
                      Last purchase:{" "}
                      {new Date(attendee.lastPurchaseDate).toLocaleString()}
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
          {attendeePagination && attendeePagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <SimplePagination
                pagination={attendeePagination}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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

export default AdministrationViewAttendeesPage;