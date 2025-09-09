import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateEventRequest,
  CreateTicketTypeRequest,
  EventDetails,
  EventStatusEnum,
  UpdateEventRequest,
  UpdateTicketTypeRequest,
} from "@/domain/domain";
import { createEvent, getEvent, updateEvent } from "@/lib/api";
import { format } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  Edit,
  Plus,
  Ticket,
  Trash,
  ArrowLeft,
  Save,
  Calendar as CalendarIco,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";

interface DateTimeSelectProperties {
  date: Date | undefined;
  setDate: (date: Date) => void;
  time: string | undefined;
  setTime: (time: string) => void;
  enabled: boolean;
  setEnabled: (isEnabled: boolean) => void;
}

const DateTimeSelect: React.FC<DateTimeSelectProperties> = ({
  date,
  setDate,
  time,
  setTime,
  enabled,
  setEnabled,
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Switch checked={enabled} onCheckedChange={setEnabled} />

      {enabled && (
        <div className="w-full flex gap-2">
          {/* Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-2">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {date ? format(date, "MMM dd, yyyy") : <span className="text-gray-200">Pick Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-gray-300" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (!selectedDate) {
                    return;
                  }
                  const displayedYear = selectedDate.getFullYear();
                  const displayedMonth = selectedDate.getMonth();
                  const displayedDay = selectedDate.getDate();

                  const correctedDate = new Date(
                    Date.UTC(displayedYear, displayedMonth, displayedDay),
                  );

                  setDate(correctedDate);
                }}
                className="rounded-md border shadow bg-white text-black"
              />
            </PopoverContent>
          </Popover>
          {/* Time */}
          <Input
            type="time"
            className="w-[120px] bg-gray-800 text-white border-gray-600 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 [&::-webkit-calendar-picker-indicator]:invert"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

const generateTempId = () => `temp_${crypto.randomUUID()}`;
const isTempId = (id: string | undefined) => id && id.startsWith("temp_");

interface TicketTypeData {
  id: string | undefined;
  name: string;
  price: number;
  totalAvailable?: number;
  description: string;
}

interface EventData {
  id: string | undefined;
  name: string;
  startDate: Date | undefined;
  startTime: string | undefined;
  endDate: Date | undefined;
  endTime: string | undefined;
  venueDetails: string;
  salesStartDate: Date | undefined;
  salesStartTime: string | undefined;
  salesEndDate: Date | undefined;
  salesEndTime: string | undefined;
  ticketTypes: TicketTypeData[];
  status: EventStatusEnum;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

const OrganizerManageEventPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [eventData, setEventData] = useState<EventData>({
    id: undefined,
    name: "",
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
    venueDetails: "",
    salesStartDate: undefined,
    salesStartTime: undefined,
    salesEndDate: undefined,
    salesEndTime: undefined,
    ticketTypes: [],
    status: EventStatusEnum.DRAFT,
    createdAt: undefined,
    updatedAt: undefined,
  });

  const [currentTicketType, setCurrentTicketType] = useState<
    TicketTypeData | undefined
  >();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [eventDateEnabled, setEventDateEnabled] = useState(false);
  const [eventSalesDateEnabled, setEventSalesDateEnabled] = useState(false);

  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof EventData, value: any) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (isEditMode && !isLoading && user?.access_token) {
      const fetchEvent = async () => {
        const event: EventDetails = await getEvent(user.access_token, id);
        setEventData({
          id: event.id,
          name: event.name,
          startDate: event.start,
          startTime: event.start
            ? formatTimeFromDate(new Date(event.start))
            : undefined,
          endDate: event.end,
          endTime: event.end
            ? formatTimeFromDate(new Date(event.end))
            : undefined,
          venueDetails: event.venue,
          salesStartDate: event.salesStart,
          salesStartTime: event.salesStart
            ? formatTimeFromDate(new Date(event.salesStart))
            : undefined,
          salesEndDate: event.salesEnd,
          salesEndTime: event.salesEnd
            ? formatTimeFromDate(new Date(event.salesEnd))
            : undefined,
          status: event.status,
          ticketTypes: event.ticketTypes.map((ticket) => ({
            id: ticket.id,
            name: ticket.name,
            description: ticket.description,
            price: ticket.price,
            totalAvailable: ticket.totalAvailable,
          })),
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        });
        setEventDateEnabled(!!(event.start || event.end));
        setEventSalesDateEnabled(!!(event.salesStart || event.salesEnd));
      };
      fetchEvent();
    }
  }, [id, user]);

  const formatTimeFromDate = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const combineDateTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time
      .split(":")
      .map((num) => Number.parseInt(num, 10));

    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours);
    combinedDateTime.setMinutes(minutes);
    combinedDateTime.setSeconds(0);

    const utcResult = new Date(
      Date.UTC(
        combinedDateTime.getFullYear(),
        combinedDateTime.getMonth(),
        combinedDateTime.getDate(),
        hours,
        minutes,
        0,
        0,
      ),
    );

    return utcResult;
  };

  const getStatusBadgeStyle = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.DRAFT:
        return "bg-gray-700 text-gray-200 border border-gray-600";
      case EventStatusEnum.PUBLISHED:
        return "bg-green-800 text-green-200 border border-green-600";
      case EventStatusEnum.CANCELLED:
        return "bg-red-800 text-red-200 border border-red-600";
      case EventStatusEnum.COMPLETED:
        return "bg-blue-800 text-blue-200 border border-blue-600";
      default:
        return "bg-gray-700 text-gray-200 border border-gray-600";
    }
  };

  const handleEventUpdateSubmit = async (accessToken: string, id: string) => {
    const ticketTypes: UpdateTicketTypeRequest[] = eventData.ticketTypes.map(
      (ticketType) => {
        return {
          id: isTempId(ticketType.id) ? undefined : ticketType.id,
          name: ticketType.name,
          price: ticketType.price,
          description: ticketType.description,
          totalAvailable: ticketType.totalAvailable,
        };
      },
    );

    const request: UpdateEventRequest = {
      id: id,
      name: eventData.name,
      start:
        eventData.startDate && eventData.startTime
          ? combineDateTime(eventData.startDate, eventData.startTime)
          : undefined,
      end:
        eventData.endDate && eventData.endTime
          ? combineDateTime(eventData.endDate, eventData.endTime)
          : undefined,
      venue: eventData.venueDetails,
      salesStart:
        eventData.salesStartDate && eventData.salesStartTime
          ? combineDateTime(eventData.salesStartDate, eventData.salesStartTime)
          : undefined,
      salesEnd:
        eventData.salesEndDate && eventData.salesEndTime
          ? combineDateTime(eventData.salesEndDate, eventData.salesEndTime)
          : undefined,
      status: eventData.status,
      ticketTypes: ticketTypes,
    };

    try {
      await updateEvent(accessToken, id, request);
      navigate("/dashboard/events");
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

  const handleEventCreateSubmit = async (accessToken: string) => {
    const ticketTypes: CreateTicketTypeRequest[] = eventData.ticketTypes.map(
      (ticketType) => {
        return {
          name: ticketType.name,
          price: ticketType.price,
          description: ticketType.description,
          totalAvailable: ticketType.totalAvailable,
        };
      },
    );

    const request: CreateEventRequest = {
      name: eventData.name,
      start:
        eventData.startDate && eventData.startTime
          ? combineDateTime(eventData.startDate, eventData.startTime)
          : undefined,
      end:
        eventData.endDate && eventData.endTime
          ? combineDateTime(eventData.endDate, eventData.endTime)
          : undefined,
      venue: eventData.venueDetails,
      salesStart:
        eventData.salesStartDate && eventData.salesStartTime
          ? combineDateTime(eventData.salesStartDate, eventData.salesStartTime)
          : undefined,
      salesEnd:
        eventData.salesEndDate && eventData.salesEndTime
          ? combineDateTime(eventData.salesEndDate, eventData.salesEndTime)
          : undefined,
      status: eventData.status,
      ticketTypes: ticketTypes,
    };

    try {
      await createEvent(accessToken, request);
      navigate("/dashboard/events");
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setIsSubmitting(true);

    if (isLoading || !user || !user.access_token) {
      console.error("User not found!");
      setIsSubmitting(false);
      return;
    }

    if (isEditMode) {
      if (!eventData.id) {
        setError("Event does not have an ID");
        setIsSubmitting(false);
        return;
      }
      await handleEventUpdateSubmit(user.access_token, eventData.id);
    } else {
      await handleEventCreateSubmit(user.access_token);
    }
    
    setIsSubmitting(false);
  };

  const handleAddTicketType = () => {
    setCurrentTicketType({
      id: undefined,
      name: "",
      price: 0,
      totalAvailable: 0,
      description: "",
    });
    setDialogOpen(true);
  };

  const handleSaveTicketType = () => {
    if (!currentTicketType) {
      return;
    }

    const newTicketTypes = [...eventData.ticketTypes];

    if (currentTicketType.id) {
      const index = newTicketTypes.findIndex(
        (t) => t.id === currentTicketType.id,
      );
      if (index !== -1) {
        newTicketTypes[index] = currentTicketType;
      }
    } else {
      newTicketTypes.push({
        ...currentTicketType,
        id: generateTempId(),
      });
    }

    updateField("ticketTypes", newTicketTypes);
    setDialogOpen(false);
  };

  const handleEditTicketType = (ticketType: TicketTypeData) => {
    setCurrentTicketType(ticketType);
    setDialogOpen(true);
  };

  const handleDeleteTicketType = (id: string | undefined) => {
    if (!id) {
      return;
    }
    updateField(
      "ticketTypes",
      eventData.ticketTypes.filter((t) => t.id !== id),
    );
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Compact Header */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard/events")}
              className="text-gray-200 hover:text-white hover:bg-gray-800 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
            
            {isEditMode && (
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(eventData.status)}`}>
                <span>{eventData.status}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-10 h-10 rounded-full flex items-center justify-center">
              <CalendarIco className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {isEditMode ? "Edit Event" : "Create New Event"}
            </h1>
          </div>

          {isEditMode && (
            <div className="text-xs text-gray-300 space-y-1">
              {eventData.id && <p className="text-gray-300">ID: {eventData.id}</p>}
              {eventData.createdAt && (
                <p className="text-gray-300">Created: {format(eventData.createdAt, "MMM dd, yyyy 'at' HH:mm")}</p>
              )}
              {eventData.updatedAt && (
                <p className="text-gray-300">Updated: {format(eventData.updatedAt, "MMM dd, yyyy 'at' HH:mm")}</p>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Event Name */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <Edit className="w-5 h-5 text-purple-400" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="event-name" className="text-sm font-medium text-gray-200">
                      Event Name
                    </Label>
                    <Input
                      id="event-name"
                      className="bg-gray-800 border-gray-600 text-white mt-1 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      placeholder="Enter event name"
                      value={eventData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      required
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      This is the public name of your event
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="venue-details" className="text-sm font-medium text-gray-200">
                      Venue Details
                    </Label>
                    <Textarea
                      id="venue-details"
                      className="bg-gray-800 border-gray-600 text-white min-h-[80px] mt-1 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      placeholder="Venue address and details..."
                      value={eventData.venueDetails}
                      onChange={(e) => updateField("venueDetails", e.target.value)}
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Include address and venue details
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Event Schedule */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <CalendarIco className="w-5 h-5 text-blue-400" />
                    Event Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-200">Event Start</Label>
                    <DateTimeSelect
                      date={eventData.startDate}
                      setDate={(date) => updateField("startDate", date)}
                      time={eventData.startTime}
                      setTime={(time) => updateField("startTime", time)}
                      enabled={eventDateEnabled}
                      setEnabled={setEventDateEnabled}
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      When the event starts
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-200">Event End</Label>
                    <DateTimeSelect
                      date={eventData.endDate}
                      setDate={(date) => updateField("endDate", date)}
                      time={eventData.endTime}
                      setTime={(time) => updateField("endTime", time)}
                      enabled={eventDateEnabled}
                      setEnabled={setEventDateEnabled}
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      When the event ends
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sales & Tickets */}
            <div className="space-y-6">
              {/* Sales Period */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <Clock className="w-5 h-5 text-green-400" />
                    Sales Period
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-200">Sales Start</Label>
                    <DateTimeSelect
                      date={eventData.salesStartDate}
                      setDate={(date) => updateField("salesStartDate", date)}
                      time={eventData.salesStartTime}
                      setTime={(time) => updateField("salesStartTime", time)}
                      enabled={eventSalesDateEnabled}
                      setEnabled={setEventSalesDateEnabled}
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      When tickets become available
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-200">Sales End</Label>
                    <DateTimeSelect
                      date={eventData.salesEndDate}
                      setDate={(date) => updateField("salesEndDate", date)}
                      time={eventData.salesEndTime}
                      setTime={(time) => updateField("salesEndTime", time)}
                      enabled={eventSalesDateEnabled}
                      setEnabled={setEventSalesDateEnabled}
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      When ticket sales end
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-200">Event Status</Label>
                    <Select
                      value={eventData.status}
                      onValueChange={(value) => updateField("status", value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600 text-white">
                        <SelectItem value={EventStatusEnum.DRAFT} className="text-white hover:bg-gray-700 focus:bg-gray-700">Draft</SelectItem>
                        <SelectItem value={EventStatusEnum.PUBLISHED} className="text-white hover:bg-gray-700 focus:bg-gray-700">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-gray-400 text-xs">
                      Draft events are not visible to attendees
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Ticket Types - Full Width */}
          <Card className="bg-gray-900 border-gray-700">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex gap-2 items-center text-lg text-white">
                    <Ticket className="w-5 h-5 text-orange-400" />
                    Ticket Types
                  </CardTitle>
                  <Button
                    type="button"
                    onClick={handleAddTicketType}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm px-3 py-2 hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Ticket Type
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {eventData.ticketTypes.length === 0 ? (
                  <div className="text-center py-8 text-gray-300">
                    <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-gray-300">No ticket types yet. Add your first ticket type!</p>
                  </div>
                ) : (
                  eventData.ticketTypes.map((ticketType, index) => (
                    <div
                      key={ticketType.id}
                      className="bg-gray-800 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-white">{ticketType.name}</h4>
                            <Badge className="bg-green-800 text-green-200 border border-green-600 text-xs">
                              ${ticketType.price}
                            </Badge>
                            {ticketType.totalAvailable && (
                              <Badge variant="outline" className="border-gray-500 text-gray-200 text-xs">
                                {ticketType.totalAvailable} available
                              </Badge>
                            )}
                          </div>
                          {ticketType.description && (
                            <p className="text-gray-300 text-sm">{ticketType.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTicketType(ticketType)}
                            className="hover:bg-gray-700 text-gray-200 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-red-900/30 hover:text-red-300"
                            onClick={() => handleDeleteTicketType(ticketType.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>

              {/* Ticket Type Dialog */}
              <DialogContent className="bg-gray-900 border-gray-600 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {currentTicketType?.id ? "Edit Ticket Type" : "Add Ticket Type"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Configure your ticket type details
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ticket-type-name" className="text-sm text-gray-200">Name</Label>
                    <Input
                      id="ticket-type-name"
                      className="bg-gray-800 border-gray-600 text-white mt-1 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      value={currentTicketType?.name}
                      onChange={(e) =>
                        setCurrentTicketType(
                          currentTicketType
                            ? { ...currentTicketType, name: e.target.value }
                            : undefined,
                        )
                      }
                      placeholder="e.g. General Admission, VIP"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="ticket-type-price" className="text-sm text-gray-200">Price ($)</Label>
                      <Input
                        id="ticket-type-price"
                        type="number"
                        step="0.01"
                        className="bg-gray-800 border-gray-600 text-white mt-1 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                        value={currentTicketType?.price}
                        onChange={(e) =>
                          setCurrentTicketType(
                            currentTicketType
                              ? {
                                  ...currentTicketType,
                                  price: Number.parseFloat(e.target.value),
                                }
                              : undefined,
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="ticket-type-total-available" className="text-sm text-gray-200">Available</Label>
                      <Input
                        id="ticket-type-total-available"
                        type="number"
                        className="bg-gray-800 border-gray-600 text-white mt-1 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                        value={currentTicketType?.totalAvailable}
                        onChange={(e) =>
                          setCurrentTicketType(
                            currentTicketType
                              ? {
                                  ...currentTicketType,
                                  totalAvailable: Number.parseFloat(e.target.value),
                                }
                              : undefined,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ticket-type-description" className="text-sm text-gray-200">Description</Label>
                    <Textarea
                      id="ticket-type-description"
                      className="bg-gray-800 border-gray-600 text-white min-h-[60px] mt-1 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      value={currentTicketType?.description}
                      onChange={(e) =>
                        setCurrentTicketType(
                          currentTicketType
                            ? {
                                ...currentTicketType,
                                description: e.target.value,
                              }
                            : undefined,
                        )
                      }
                      placeholder="Describe what's included..."
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setDialogOpen(false)}
                    className="text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveTicketType}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Save Ticket Type
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="bg-red-900 border-red-600 animate-shake">
              <AlertCircle className="h-4 w-4 text-red-300" />
              <AlertTitle className="text-red-200">Error</AlertTitle>
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 text-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditMode ? "Updating..." : "Creating..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  {isEditMode ? "Update Event" : "Create Event"}
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
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

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default OrganizerManageEventPage;
