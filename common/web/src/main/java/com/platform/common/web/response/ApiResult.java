package com.platform.common.web.response;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(name = "ApiResult", title = "성공 응답")
public class ApiResult<T> {
    private boolean success;
    private T data;
    private Object meta;

    public static <T> ApiResult<T> of(T data) {
        return ApiResult.<T>builder().success(true).data(data).build();
    }

    public static <T> ApiResult<T> of(T data, Object meta) {
        return ApiResult.<T>builder().success(true).data(data).meta(meta).build();
    }
}
