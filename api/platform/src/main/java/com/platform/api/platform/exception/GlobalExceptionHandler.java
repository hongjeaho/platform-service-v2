package com.platform.api.platform.exception;

import com.platform.common.web.error.type.ErrorCode;
import com.platform.common.web.error.ErrorResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/**
 * 전역 예외 처리 핸들러
 * <p>
 * 애플리케이션 전역에서 발생하는 예외를 일관된 형식으로 처리하여
 * 클라이언트에 적절한 에러 응답을 반환합니다.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  /**
   * 일반 예외 처리 (500 Internal Server Error)
   * <p>
   * 처리되지 않은 모든 예외를 캐치하여 일관된 에러 응답 반환
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleException(Exception ex) {
    log.error("Unhandled exception occurred", ex);
    return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다."));
  }

  /**
   * Bean Validation 예외 처리 (400 Bad Request)
   * <p>
   * @Valid 또는 @Validated 어노테이션으로 검증 실패 시 발생
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(
      MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach(error -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });

    log.warn("Validation failed: {}", errors);
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ErrorResponse.of(ErrorCode.VALIDATION_FAILED,
            "입력 값 검증에 실패했습니다.", errors));
  }

  /**
   * Constraint Violation 예외 처리 (400 Bad Request)
   * <p>
   * 메서드 파라미터 레벨의 @Valid 검증 실패 시 발생
   */
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ErrorResponse> handleConstraintViolationException(
      ConstraintViolationException ex) {
    Map<String, String> errors = new HashMap<>();
    for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
      String propertyPath = violation.getPropertyPath().toString();
      String message = violation.getMessage();
      errors.put(propertyPath, message);
    }

    log.warn("Constraint violation: {}", errors);
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ErrorResponse.of(ErrorCode.VALIDATION_FAILED,
            "제약 조건 검증에 실패했습니다.", errors));
  }

  /**
   * 타입 미스매치 예외 처리 (400 Bad Request)
   * <p>
   * 요청 파라미터의 타입이 올바르지 않을 때 발생
   */
  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ErrorResponse> handleTypeMismatchException(
      MethodArgumentTypeMismatchException ex) {
    String error = String.format("파라미터 '%s'의 값 '%s'을(를) %s 타입으로 변환할 수 없습니다.",
        ex.getName(), ex.getValue(), ex.getRequiredType().getSimpleName());

    log.warn("Type mismatch: {}", error);
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ErrorResponse.of(ErrorCode.VALIDATION_FAILED, error));
  }

  /**
   * 데이터베이스 예외 처리 (503 Service Unavailable)
   * <p>
   * 데이터베이스 연결 또는 쿼리 실행 중 오류 발생 시
   */
  @ExceptionHandler(DataAccessException.class)
  public ResponseEntity<ErrorResponse> handleDatabaseException(DataAccessException ex) {
    log.error("Database error occurred", ex);
    return ResponseEntity
        .status(HttpStatus.SERVICE_UNAVAILABLE)
        .body(ErrorResponse.of(ErrorCode.DATABASE_ERROR, "데이터베이스 작업 중 오류가 발생했습니다."));
  }

  /**
   * IllegalArgumentException 예외 처리 (400 Bad Request)
   * <p>
   * 잘못된 인자가 전달되었을 때 발생
   */
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
      IllegalArgumentException ex) {
    log.warn("Illegal argument: {}", ex.getMessage());
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ErrorResponse.of(ErrorCode.VALIDATION_FAILED, ex.getMessage()));
  }

  /**
   * IllegalStateException 예외 처리 (409 Conflict)
   * <p>
   * 비즈니스 로직 상 잘못된 상태일 때 발생
   */
  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<ErrorResponse> handleIllegalStateException(IllegalStateException ex) {
    log.warn("Illegal state: {}", ex.getMessage());
    return ResponseEntity
        .status(HttpStatus.CONFLICT)
        .body(ErrorResponse.of(ErrorCode.BUSINESS_ERROR, ex.getMessage()));
  }
}
