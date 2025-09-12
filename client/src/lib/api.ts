import {
  CreateEventRequest,
  EventDetails,
  EventSummary,
  isErrorResponse,
  PublishedEventDetails,
  PublishedEventSummary,
  SpringBootPagination,
  TicketDetails,
  TicketSummary,
  TicketValidationRequest,
  TicketValidationResponse,
  UpdateEventRequest, 
  UserGeneralProfile,
  UserDetailProfile, UserTicketDetails,
  PlatformStatistics,
} from "@/domain/domain";
import api from "@/config/axios";

export const createEvent = async (
  accessToken: string,
  request: CreateEventRequest,
): Promise<void> => {
  try {
    await api.post("/api/v1/events", request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const updateEvent = async (
  accessToken: string,
  id: string,
  request: UpdateEventRequest,
): Promise<void> => {
  try {
    await api.put(`/api/v1/events/${id}`, request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const listEvents = async (
  accessToken: string,
  page: number,
): Promise<SpringBootPagination<EventSummary>> => {
  try {
    const response = await api.get(`/api/v1/events?page=${page}&size=2`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as SpringBootPagination<EventSummary>;
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const getEvent = async (
  accessToken: string,
  id: string,
): Promise<EventDetails> => {
  try {
    const response = await api.get(`/api/v1/events/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as EventDetails;
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const deleteEvent = async (
  accessToken: string,
  id: string,
): Promise<void> => {
  try {
    await api.delete(`/api/v1/events/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const listPublishedEvents = async (
  page: number,
): Promise<SpringBootPagination<PublishedEventSummary>> => {
  try {
    const response = await api.get(`/api/v1/published-events?page=${page}&size=4`);
    return response.data as SpringBootPagination<PublishedEventSummary>;
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const searchPublishedEvents = async (
  query: string,
  page: number,
): Promise<SpringBootPagination<PublishedEventSummary>> => {
  try {
    const response = await api.get(
      `/api/v1/published-events?q=${query}&page=${page}&size=4`,
    );
    return response.data as SpringBootPagination<PublishedEventSummary>;
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const getPublishedEvent = async (
  id: string,
): Promise<PublishedEventDetails> => {
  try {
    const response = await api.get(`/api/v1/published-events/${id}`);
    return response.data as PublishedEventDetails;
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const purchaseTicket = async (
  accessToken: string,
  eventId: string,
  ticketTypeId: string,
): Promise<void> => {
  try {
    await api.post(
      `/api/v1/events/${eventId}/ticket-types/${ticketTypeId}/tickets`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const listTickets = async (
  accessToken: string,
  page: number,
): Promise<SpringBootPagination<TicketSummary>> => {
  try {
    const response = await api.get(`/api/v1/tickets?page=${page}&size=8`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as SpringBootPagination<TicketSummary>;
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const getTicket = async (
  accessToken: string,
  id: string,
): Promise<TicketDetails> => {
  try {
    const response = await api.get(`/api/v1/tickets/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as TicketDetails;
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const cancelTicket = async (
  accessToken: string,
  id: string,
): Promise<void> => {
  try {
    await api.put(`/api/v1/tickets/${id}/cancel-ticket`, 
      {}, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    }
    else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const getTicketQr = async (
  accessToken: string,
  id: string,
): Promise<Blob> => {
  try {
    const response = await api.get(`/api/v1/tickets/${id}/qr-codes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "blob",
    });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error("Unable to get ticket QR code");
  }
};

export const validateTicket = async (
  accessToken: string,
  request: TicketValidationRequest,
): Promise<TicketValidationResponse> => {
  try {
    const response = await api.post(`/api/v1/ticket-validations`, request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as TicketValidationResponse;
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const fetchAttendeeList = async (
  accessToken: string,
  page: number = 0,
  size: number = 10
): Promise<SpringBootPagination<UserGeneralProfile>> => {
  try {
    const response = await api.get(
      `/api/v1/users/attendees?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data as SpringBootPagination<UserGeneralProfile>;
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const getAttendeeDetails = async (
  accessToken: string,
  userId: string
): Promise<UserDetailProfile> => {
  try {
    
    const response = await api.get(
      `/api/v1/users/attendees/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
      }
    );
    
    return response.data as UserDetailProfile;
    
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    } else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

export const getAttendeeTicketDetails = async (
  accessToken: string,
  userId: string,
  page: number = 0,
  size: number = 10
): Promise<SpringBootPagination<UserTicketDetails>> => {
  try {
    const response = await api.get(
      `/api/v1/users/attendees/${userId}/tickets?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data as SpringBootPagination<UserTicketDetails>;
  }
  catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    }
    else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};


export const getPlatformStatistics = async (
  accessToken: string
): Promise<PlatformStatistics> => {
  try {
    const response = await api.get(
      `/api/v1/admin`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data as PlatformStatistics;
  } catch (error: any) {
    if (error.response?.data && isErrorResponse(error.response.data)) {
      throw new Error(error.response.data.error);
    }
    else {
      console.error(error);
      throw new Error("An any error occurred");
    }
  }
};

