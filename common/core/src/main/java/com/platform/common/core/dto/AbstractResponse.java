package com.platform.common.core.dto;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/**
 * AbstractResponse 클래스는 DTO(Data Transfer Object)로서, 주요 객체의 생성 및 수정 정보를 포함하며 직렬화가 가능한 추상 클래스입니다.
 * 데이터 복사를 위한 기능을 제공하며, Jackson ObjectMapper를 사용하여 JSON 직렬화/역직렬화를 처리합니다.
 *
 * 주요 기능:
 * - 생성자 및 수정자의 ID와 시간을 관리하기 위한 필드 제공
 * - 객체를 특정 타입으로 복사(copy)하는 메서드 지원
 *
 * 직렬화/역직렬화 처리를 위한 설정:
 * - JavaTimeModule을 등록해 LocalDateTime 처리를 지원
 * - JSON의 날짜 형식을 TIMESTAMP 대신 특정 형식으로 처리
 * - 알 수 없는 속성(Unknown Properties) 무시 설정
 *
 * 사용 맥락:
 * - 매개변수 또는 DTO 객체의 검증/처리 과정에서 주로 사용
 * - Auditing 애노테이션(@Auditing)과 결합하여 생성 정보 및 수정 정보를 설정
 */
@Getter
@Setter
public class AbstractResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private static final ObjectMapper OBJECT_MAPPER;

    static {
        OBJECT_MAPPER = new ObjectMapper();
        OBJECT_MAPPER.registerModule(new JavaTimeModule());
        OBJECT_MAPPER.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        OBJECT_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    private Long createdBy;
    private LocalDateTime createdTime;
    private Long updatedBy;
    private LocalDateTime updatedTime;

    public <T> T copy(final Class<T> targetType) {
        return copy(this, targetType);
    }

    public static <T> T copy(final AbstractResponse source, final Class<T> targetType) {
        try {
            final String json = OBJECT_MAPPER.writeValueAsString(source);
            return OBJECT_MAPPER.readValue(json, targetType);
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new IllegalStateException("객체 복사 중 직렬화 오류가 발생했습니다: " + targetType.getName(), e);
        }
    }
}
