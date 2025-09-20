package com.Hoang105.tickets.controllers;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.Hoang105.tickets.domain.dtos.Error.ErrorDto;
import com.Hoang105.tickets.exceptions.*;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
@Tag(name = "Global Exception Handler", description = "Handles exceptions globally and returns appropriate error responses")
public class GlobalExceptionHandler {

    @ExceptionHandler(TicketNotFoundException.class)
    @Operation(summary = "Handle TicketNotFoundException", description = "Handles TicketNotFoundException and returns a 400 Bad Request response")
    public ResponseEntity<ErrorDto> handleTicketNotFoundException(TicketNotFoundException ex) {
        log.error("Caught TicketNotFoundException", ex);
        ErrorDto errorDto = new ErrorDto();
        errorDto.setError("Ticket not found");
        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TicketsSoldOutException.class)
    @Operation(summary = "Handle TicketsSoldOutException", description = "Handles TicketsSoldOutException and returns a 400 Bad Request response")
    public ResponseEntity<ErrorDto> handleTicketsSoldOutException(TicketsSoldOutException ex) {
        log.error("Caught TicketsSoldOutException", ex);
        ErrorDto errorDto = new ErrorDto();
        errorDto.setError("Tickets are sold out for this ticket type");
        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(QrCodeNotFoundException.class)
    @Operation(summary = "Handle QrCodeNotFoundException", description = "Handles QrCodeNotFoundException and returns a 500 Internal Server Error response")
    public ResponseEntity<ErrorDto> handleQrCodeNotFoundException(QrCodeNotFoundException ex) {
        log.error("Caught QrCodeNotFoundException", ex);
        ErrorDto errorDto = new ErrorDto();
        errorDto.setError("QR code not found");
        return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @ExceptionHandler(QrCodeGenerationException.class)
    @Operation(summary = "Handle QrCodeGenerationException", description = "Handles QrCodeGenerationException and returns a 500 Internal Server Error response")
    public ResponseEntity<ErrorDto> handleQrCodeGenerationException(QrCodeGenerationException ex) {
        log.error("Caught QrCodeGenerationException", ex);
        ErrorDto errorDto = new ErrorDto();
        errorDto.setError("Unable to generate QR code");
        return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(EventUpdateException.class)
    @Operation(summary = "Handle EventUpdateException", description = "Handles EventUpdateException and returns a 400 Bad Request response")
    public ResponseEntity<ErrorDto> handleEventUpdateException(EventUpdateException ex){
        log.error("Caught EventUpdateException", ex);
        ErrorDto errorDto = new ErrorDto(); 
        errorDto.setError("Unable to update event");
        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(TicketTypetNotFoundException.class)
    @Operation(summary = "Handle TicketTypetNotFoundException", description = "Handles TicketTypetNotFoundException and returns a 400 Bad Request response")
    public ResponseEntity<ErrorDto> handleTicketTypeNotFoundException(TicketTypetNotFoundException ex){
        log.error("Caught TicketTypetNotFoundException", ex);
        ErrorDto errorDto = new ErrorDto(); 
        errorDto.setError("Ticket type not found");
        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(EventNotFoundException.class)
    @Operation(summary = "Handle EventNotFoundException", description = "Handles EventNotFoundException and returns a 400 Bad Request response")
    public ResponseEntity<ErrorDto> handleEventNotFoundException(EventNotFoundException ex){
        log.error("Caught EventNotFoundException", ex);
        ErrorDto errorDto = new ErrorDto(); 
        errorDto.setError("Event not found");
        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(UserNotFoundException.class)
    @Operation(summary = "Handle UserNotFoundException", description = "Handles UserNotFoundException and returns a 400 Bad Request response")
    public ResponseEntity<ErrorDto> handleUserNotFoundException(UserNotFoundException ex){
        log.error("Caught UserNotFoundException", ex);
        ErrorDto errorDto = new ErrorDto(); 
        errorDto.setError("User not found");
        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @Operation(summary = "Handle MethodArgumentNotValidException", description = "Handles MethodArgumentNotValidException and returns a 400 Bad Request response with validation error details")
    public ResponseEntity<ErrorDto> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex){
        log.error("Caught MethodArgumentNotValidException", ex);
        ErrorDto errorDto = new ErrorDto(); 


        BindingResult bindingResult = ex.getBindingResult();
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();
        String errorMessage = fieldErrors.stream().findFirst()
                                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                                .orElse("Validation error occurred");



        errorDto.setError(errorMessage);
        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @Operation(summary = "Handle ConstraintViolationException", description = "Handles ConstraintViolationException and returns a 400 Bad Request response with validation error details")
    public ResponseEntity<ErrorDto> handleConstraintViolation(ConstraintViolationException ex) {
        log.error("Caught ConstraintViolationException", ex);
        ErrorDto errorDto = new ErrorDto(); 

        String errorMessage = ex.getConstraintViolations()
                .stream()
                .findFirst()
                    .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                    .orElse("Constraint violation occurred");


        errorDto.setError(errorMessage);
        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(Exception.class)
    @Operation(summary = "Handle generic Exception", description = "Handles generic Exception and returns a 500 Internal Server Error response")
    public ResponseEntity<ErrorDto> handleException(Exception ex) {
        log.error("Caught exception", ex);
        ErrorDto errorDto = new ErrorDto(); 
        errorDto.setError("An unknown error occurred");
        return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }
       
}
