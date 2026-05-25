package com.platform.api.platform.board.dto;

import com.platform.common.core.dto.AbstractResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "게시글 응답")
public class BoardResponse extends AbstractResponse {

    @Schema(description = "게시글 일련번호", example = "1")
    private Long seq;

    @Schema(description = "게시글 분류코드", example = "CB001002")
    private String boardCategoryCode;

    @Schema(description = "제목", example = "공지사항 제목")
    private String title;

    @Schema(description = "내용", example = "공지사항 내용입니다.")
    private String content;

    @Schema(description = "조회수", example = "42")
    private Long viewCount;

    @Schema(description = "생성일시")
    private LocalDateTime createdTime;

    @Schema(description = "등록자 일련번호", example = "1")
    private Long createdBy;

    @Schema(description = "수정일시")
    private LocalDateTime updatedTime;

    @Schema(description = "수정자 일련번호", example = "1")
    private Long updatedBy;
}
