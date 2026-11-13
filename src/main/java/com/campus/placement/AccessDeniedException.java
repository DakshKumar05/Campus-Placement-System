package com.campus.placement;

/* Thrown when the caller is not allowed to use an endpoint - an admin
   route called by a student, or one student reading another's data.
   PlacementController turns it into HTTP 403 with the message as body. */
public class AccessDeniedException extends RuntimeException {

    public AccessDeniedException(String message) {
        super(message);
    }
}
