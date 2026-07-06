package com.platform.api.platform.users.type;

/**
 * OTP 검증 용도(OtpPurpose).
 *
 * <p>OTP가 <strong>무엇을 증명하는지</strong>를 나타내는 차원이다. 두 용도는 서로 독립된 검증이다 —
 * 각각 별도의 Redis 네임스페이스({@code otp:{purpose}:{email}})와 별도의 재발송 throttle을 가지며,
 * <strong>서로 교차 만족할 수 없다</strong> (한 용도로 발급된 코드가 다른 용도의 검증을 통과하지 못한다).</p>
 *
 * <p>용도별 사전조건(가입 필요 vs 미가입 필요)은 OTP 기계가 아닌 <em>호출자(회원 도메인)</em>가 소유한다.
 * OTP 인증 메커니즘은 회원 가입 여부를 알지 않는다 (근거: {@code docs/adr/0001-otp-purpose-scoping.md}).</p>
 *
 * @see com.platform.api.platform.users.service.OtpService
 */
public enum OtpPurpose {

    /** 미가입 이메일이 도달 가능함을 증명. 회원가입 시 사용. */
    SIGNUP,

    /** 가입된 사용자가 해당 이메일을 통제함을 증명. 비밀번호 재설정(로그인 전) 시 사용. */
    PASSWORD_CHANGE
}
