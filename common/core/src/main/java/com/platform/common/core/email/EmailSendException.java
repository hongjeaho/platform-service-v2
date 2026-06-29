package com.platform.common.core.email;

/** 이메일 발송 실패 시 던지는 비검사 예외. */
public class EmailSendException extends RuntimeException {

    public EmailSendException(String message, Throwable cause) {
        super(message, cause);
    }
}
