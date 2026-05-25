package com.platform.api.platform.board.dto;

import com.platform.common.core.dto.AbstractResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "게시글 수정 요청")
public class BoardUpdateRequest extends AbstractResponse {

    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 500, message = "제목은 500자를 초과할 수 없습니다.")
    @Schema(description = "제목", example = "수정된 제목")
    private String title;

    @Schema(description = "내용", example = "수정된 내용입니다.")
    private String content;
}
