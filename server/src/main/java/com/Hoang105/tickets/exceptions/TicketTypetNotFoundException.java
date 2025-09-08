package com.Hoang105.tickets.exceptions;

public class TicketTypetNotFoundException extends EventTicketException{

    public TicketTypetNotFoundException() {
        
    }

    public TicketTypetNotFoundException(String message) {
        super(message);
    }

    public TicketTypetNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public TicketTypetNotFoundException(Throwable cause) {
        super(cause);
    }

    public TicketTypetNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }


}
