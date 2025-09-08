import { useAuth } from "react-oidc-context";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Search, Calendar, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { PublishedEventSummary, SpringBootPagination } from "@/domain/domain";
import { listPublishedEvents, searchPublishedEvents } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublishedEventCard from "@/components/published-event-card";
import { SimplePagination } from "@/components/simple-pagination";

const AttendeeLandingPage: React.FC = () => {
  const { isLoading } = useAuth();

  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState<
    SpringBootPagination<PublishedEventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [query, setQuery] = useState<string | undefined>();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query && query.length > 0) {
      queryPublishedEvents();
    } else {
      refreshPublishedEvents();
    }
  }, [page]);

  const refreshPublishedEvents = async () => {
    try {
      setIsSearching(true);
      setPublishedEvents(await listPublishedEvents(page));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error has occurred");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const queryPublishedEvents = async () => {
    if (!query) {
      await refreshPublishedEvents();
      return;
    }

    try {
      setIsSearching(true);
      setPublishedEvents(await searchPublishedEvents(query, page));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error has occurred");
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Error state
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

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Compact Hero Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="relative overflow-hidden rounded-xl shadow-xl animate-fade-in">
          <div className="bg-[url(/organizers-landing-hero.png)] bg-cover min-h-[180px] md:min-h-[220px] bg-bottom">
            {/* Simplified overlay */}
            <div className="bg-gradient-to-r from-black/70 via-purple-900/50 to-black/70 min-h-[180px] md:min-h-[220px] p-6 md:p-8 flex flex-col justify-center relative">
              {/* Minimal floating particles */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-8 left-8 w-3 h-3 bg-purple-400/20 rounded-full animate-float-slow"></div>
                <div className="absolute top-12 right-12 w-4 h-4 bg-pink-400/15 rounded-full animate-float-medium"></div>
                <div className="absolute bottom-8 right-8 w-3 h-3 bg-yellow-400/15 rounded-full animate-float-slow"></div>
              </div>

              {/* Compact Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 animate-slide-in-left">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <span className="text-yellow-400 font-medium text-sm">Discover Events</span>
                </div>
                
                <h1 className="text-2xl md:text-4xl font-bold mb-4 text-white animate-slide-in-up">
                  Find Tickets to Your{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Next Event
                  </span>
                </h1>
                
                <p className="text-gray-200 mb-6 max-w-xl animate-fade-in-delayed">
                  Discover amazing events, connect with your community, and create unforgettable memories
                </p>

                {/* Compact Search Bar */}
                <div className="flex gap-2 max-w-md animate-slide-in-right">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-purple-400 transition-colors duration-200" />
                    <Input
                      className="bg-white/95 backdrop-blur-sm text-black border-none pl-10 pr-3 py-2 rounded-lg shadow-lg focus:shadow-xl focus:bg-white transition-all duration-300 placeholder:text-gray-500 text-sm"
                      placeholder="Search events..."
                      value={query || ""}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          queryPublishedEvents();
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={queryPublishedEvents}
                    disabled={isSearching}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section with integrated stats */}
      <div className="container mx-auto px-4 pb-8">
        {/* Section Header with Events Count */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {query ? `Search Results for "${query}"` : "Featured Events"}
              </span>
            </h2>
            
            {/* Events Available Badge */}
            {publishedEvents && publishedEvents.totalElements > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-900/30 to-purple-800/30 rounded-full border border-purple-700/50 backdrop-blur-sm">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">
                  {publishedEvents.totalElements} available
                </span>
              </div>
            )}
          </div>
          
          <p className="text-gray-400 max-w-xl mx-auto">
            {query 
              ? "Here are the events matching your search"
              : "Discover the most popular events happening near you"
            }
          </p>
        </div>

        {/* Loading State for Events */}
        {isSearching && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Searching for amazing events...</p>
          </div>
        )}

        {/* Events Grid */}
        {!isSearching && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {publishedEvents?.content?.map((publishedEvent, index) => (
              <div
                key={publishedEvent.id}
                className="animate-fade-in-up hover:scale-105 transition-transform duration-300"
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <PublishedEventCard publishedEvent={publishedEvent} />
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {!isSearching && publishedEvents?.content?.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-3">
                {query ? "No Events Found" : "No Events Available"}
              </h3>
              <p className="text-gray-400 mb-6 text-sm">
                {query
                  ? `We couldn't find any events matching "${query}".`
                  : "There are no events available at the moment."
                }
              </p>
              {query && (
                <Button
                  onClick={() => {
                    setQuery("");
                    setPage(0);
                    refreshPublishedEvents();
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 text-sm"
                >
                  View All Events
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isSearching && publishedEvents && publishedEvents.totalElements > 0 && (
          <div className="w-full flex justify-center py-6 animate-fade-in-up">
            <SimplePagination
              pagination={publishedEvents}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Simplified CSS for animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-fade-in-delayed {
          animation: fadeIn 0.8s ease-out 0.3s both;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out;
        }

        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out 0.1s both;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out 0.2s both;
        }

        .animate-float-slow {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float 3s ease-in-out infinite 1s;
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
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

export default AttendeeLandingPage;
