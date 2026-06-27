package com.platform.api.platform.users.controller;

import com.platform.api.platform.users.dto.CheckDuplicateResponse;
import com.platform.api.platform.users.dto.UserEmailCheckRequest;
import com.platform.api.platform.users.dto.UserIdCheckRequest;
import com.platform.api.platform.users.dto.UsersSignupRequest;
import com.platform.api.platform.users.dto.UsersSignupResponse;
import com.platform.api.platform.users.service.UsersService;
import com.platform.common.web.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "users", description = "회원 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/users")
public class UsersController {

    private final UsersService usersService;

    @Operation(summary = "회원 등록")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "등록 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "입력값 오류"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "중복 아이디 또는 이메일")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<UsersSignupResponse>> signup(
        @RequestBody @Valid UsersSignupRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(usersService.signup(request)));
    }

    // ========== 이슈 #1: 아이디 중복 확인 API ==========

    @Operation(summary = "아이디 중복 확인")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "사용 가능"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "중복"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "입력값 오류")
    })
    @PostMapping("/check-id")
    public ResponseEntity<ApiResponse<CheckDuplicateResponse>> checkId(
        @RequestBody @Valid UserIdCheckRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.of(usersService.checkDuplicateUserId(request.getUserId())));
    }

    // ========== 이슈 #2: 이메일 중복 확인 API ==========

    @Operation(summary = "이메일 중복 확인")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "사용 가능"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "중복"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "입력값 오류")
    })
    @PostMapping("/check-email")
    public ResponseEntity<ApiResponse<CheckDuplicateResponse>> checkEmail(
        @RequestBody @Valid UserEmailCheckRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.of(usersService.checkDuplicateUserEmail(request.getUserEmail())));
    }
}
