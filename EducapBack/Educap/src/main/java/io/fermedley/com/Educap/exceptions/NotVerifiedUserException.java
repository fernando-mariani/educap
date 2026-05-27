package io.fermedley.com.Educap.exceptions;

public class NotVerifiedUserException extends RuntimeException {
    public NotVerifiedUserException(String message) {
        super(message);
    }
}
