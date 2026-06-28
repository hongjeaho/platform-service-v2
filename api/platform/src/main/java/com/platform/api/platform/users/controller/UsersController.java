package com.platform.api.platform.users.controller;

import com.platform.api.platform.users.dto.ChangePasswordRequest;
import com.platform.api.platform.users.dto.ChangePasswordResponse;
import com.platform.api.platform.users.service.UsersService;
import com.platform.common.core.auth.context.UserAccountHolder;
import com.platform.common.web.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "users", description = "회원 관리 API")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UsersController {

    private final UsersService usersService;

    @Operation(summary = "비밀번호 변경 (로그인 후)")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "변경 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "입력값 오류 / 비밀번호 불일치"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "JWT 인증 실패 (SecurityConfig 자동 처리)"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "현재 비밀번호와 동일")
    })
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<ChangePasswordResponse>> changePassword(
        @RequestBody @Valid ChangePasswordRequest request
    ) {
        Long userSeq = UserAccountHolder.getSeqNo();
        return ResponseEntity.ok(ApiResponse.of(
            usersService.changePassword(
                userSeq,
                request.getCurrentPassword(),
                request.getNewPassword()
            )
        ));
    }
}
