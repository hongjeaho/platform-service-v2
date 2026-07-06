package com.platform.api.platform.users.controller;

import com.platform.api.platform.users.dto.ChangePasswordResponse;
import com.platform.api.platform.users.dto.ChangePasswordWithOtpRequest;
import com.platform.api.platform.users.dto.CheckDuplicateResponse;
import com.platform.api.platform.users.dto.UsersSignupRequest;
import com.platform.api.platform.users.dto.UsersSignupResponse;
import com.platform.api.platform.users.service.UsersService;
import com.platform.common.web.response.ApiResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "users", description = "회원 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/users")
public class PublicUsersController {

    private final UsersService usersService;

    @Operation(summary = "회원가입")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "등록 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 오류"),
        @ApiResponse(responseCode = "409", description = "중복 아이디 또는 이메일")
    })
    @PostMapping
    public ResponseEntity<ApiResult<UsersSignupResponse>> signup(
        @RequestBody @Valid UsersSignupRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResult.of(usersService.signup(request)));
    }

    @Operation(summary = "아이디·이메일 가용성 확인")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "사용 가능"),
        @ApiResponse(responseCode = "409", description = "중복"),
        @ApiResponse(responseCode = "400", description = "입력값 오류")
    })
    @GetMapping("/availability")
    public ResponseEntity<ApiResult<CheckDuplicateResponse>> checkAvailability(
        @RequestParam(required = false) String userId,
        @RequestParam(required = false) String userEmail
    ) {
        return ResponseEntity.ok(ApiResult.of(usersService.checkAvailability(userId, userEmail)));
    }

    @Operation(summary = "비밀번호 변경 (로그인 전 - OTP 방식)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "변경 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 오류 / 사용자 없음 / OTP 만료 또는 불일치"),
            @ApiResponse(responseCode = "409", description = "현재 비밀번호와 동일")
    })
    @PatchMapping("/password")
    public ResponseEntity<ApiResult<ChangePasswordResponse>> changePasswordBeforeLogin(
        @RequestBody @Valid ChangePasswordWithOtpRequest request
    ) {
        return ResponseEntity.ok(ApiResult.of(
            usersService.changePasswordBeforeLogin(
                request.userEmail(),
                request.newPassword(),
                request.otpCode()
            )
        ));
    }
}
