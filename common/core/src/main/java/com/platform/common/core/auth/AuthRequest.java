package com.platform.common.core.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * 로그인 요청 정보.
 *
 * <p>아이디와 비밀번호를 담아 {@code POST /api/public/auth}로 전달한다.
 * {@code @ToString}에서 {@code password}를 제외하여 로그에 비밀번호가 노출되지 않도록 한다.
 */
@Getter
@ToString(exclude = "password")
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(name = "AuthRequest", description = "로그인 요청 정보")
public class AuthRequest {
    @NotBlank(message = "아이디를 입력해주세요.")
    @Schema(description = "아이디", example = "admin")
    private String id;

    @NotBlank(message = "비밀번호를 입력해주세요.")
    @Schema(description = "비밀번호", example = "12345")
    private String password;
}
