package com.example.ecommerce.resources.exceptions;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.ecommerce.resources.exceptions.StandardError;
import com.example.ecommerce.resources.exceptions.ValidationError;
import com.example.ecommerce.services.exceptions.BadRequestException;
import com.example.ecommerce.services.exceptions.DatabaseException;
import com.example.ecommerce.services.exceptions.ResourceNotFoundException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

@ControllerAdvice
public class ResourceExceptionHandler {
	
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<StandardError> resourceNotFound(ResourceNotFoundException e, HttpServletRequest request){
		String standardError = "Resource Not Found";
		HttpStatus status = HttpStatus.NOT_FOUND;
		StandardError error = new StandardError(Instant.now(), status.value(), standardError, e.getMessage(), request.getRequestURI());
		return ResponseEntity.status(status).body(error);
	}
	
    @ExceptionHandler({DatabaseException.class, BadRequestException.class, IllegalArgumentException.class})
    public ResponseEntity<StandardError> badRequest(RuntimeException e, HttpServletRequest request){
        String standardError = "Bad Request";
        HttpStatus status = HttpStatus.BAD_REQUEST;
        StandardError error = new StandardError(Instant.now(), status.value(), standardError, e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<StandardError> messageNotReadable(HttpMessageNotReadableException e, HttpServletRequest request) {
        String standardError = "Malformed request";
        HttpStatus status = HttpStatus.BAD_REQUEST;
        StandardError error = new StandardError(Instant.now(), status.value(), standardError, "Request body is invalid or malformed.", request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationError> methodArgumentNotValid(MethodArgumentNotValidException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNPROCESSABLE_ENTITY;
        ValidationError error = new ValidationError(Instant.now(), status.value(), "Validation Error", "One or more fields are invalid.", request.getRequestURI());
        e.getBindingResult().getFieldErrors().forEach(fieldError -> {
            error.addError(fieldError.getField(), fieldError.getDefaultMessage());
        });
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ValidationError> constraintViolation(ConstraintViolationException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNPROCESSABLE_ENTITY;
        ValidationError error = new ValidationError(Instant.now(), status.value(), "Validation Error", "Validation constraints were violated.", request.getRequestURI());
        e.getConstraintViolations().forEach(violation -> {
            String field = violation.getPropertyPath().toString();
            error.addError(field, violation.getMessage());
        });
        return ResponseEntity.status(status).body(error);
    }
}

