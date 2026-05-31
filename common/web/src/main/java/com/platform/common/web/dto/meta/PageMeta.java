package com.platform.common.web.dto.meta;


import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
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
@Schema(name = "PageMeta", title = "페이지 메타 정보")
public class PageMeta {
  @Schema(description = "현재 페이지")
  private int currentPage;

  @Schema(description = "페이지 크기")
  private int pageSize;

  @Schema(description = "전체 페이지 수")
  private int totalPages;

  @Schema(description = "전체 데이터 수")
  private long totalCount;

  @Schema(description = "다음 페이지 존재 여부")
  private boolean hasNext;
}
