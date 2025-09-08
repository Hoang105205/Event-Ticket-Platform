import { PublishedEventSummary } from "@/domain/domain";
import { Card, CardContent } from "./ui/card";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import RandomEventImage from "./random-event-image";

interface PublishedEventCardProperties {
  publishedEvent: PublishedEventSummary;
}

const PublishedEventCard: React.FC<PublishedEventCardProperties> = ({
  publishedEvent,
}) => {
  return (
    <Link to={`/events/${publishedEvent.id}`} className="block group">
      <Card className="overflow-hidden bg-gray-900/50 border-gray-700 hover:bg-gray-800/60 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm">
        {/* Card Image */}
        <div className="relative h-[160px] overflow-hidden">
          <div className="w-full h-full transition-transform duration-300 group-hover:scale-110">
            <RandomEventImage />
          </div>
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Event Title */}
          <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-purple-200 transition-colors duration-200">
            {publishedEvent.name}
          </h3>

          {/* Event Details */}
          <div className="space-y-2">
            {/* Venue */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="truncate">{publishedEvent.venue}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
              {publishedEvent.start && publishedEvent.end ? (
                <span className="truncate">
                  {format(new Date(publishedEvent.start), "MMM dd")} -{" "}
                  {format(new Date(publishedEvent.end), "MMM dd, yyyy")}
                </span>
              ) : (
                <span className="text-gray-500">Dates TBD</span>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
            <span className="text-purple-300 text-sm font-medium">
              View Details
            </span>
            <ArrowRight className="w-4 h-4 text-purple-400 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PublishedEventCard;
