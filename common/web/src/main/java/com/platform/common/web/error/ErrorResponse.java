package com.platform.common.web.error;

import com.platform.common.web.error.type.ErrorCode;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "ErrorResponse", title = "에러 응답")
public class ErrorResponse {

  private boolean success = false;
  private ErrorBody error;
  private LocalDateTime timestamp;

  public static ErrorResponse of(ErrorCode code, String message) {
    return of(code, message, null);
  }

  public static ErrorResponse of(ErrorCode code, String message, Map<String, String> errors) {
    return ErrorResponse.builder()
      .timestamp(LocalDateTime.now())
      .error(ErrorBody.builder()
        .code(code.name())
        .message(message)
        .details(Optional.ofNullable(errors).orElse(Collections.emptyMap()))
        .build())
      .build();
  }

  @Getter
  @Setter
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ErrorBody {

    private String code;
    private String message;
    private  Map<String, String> details;
  }
}
