package com.platform.common.web.dto;

import com.platform.common.web.dto.meta.PageMeta;
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
@Schema(name = "PageApiResponse", title = "페이지 성공 응답")
public class PageApiResponse<T> {

  @Schema(description = "응답 데이터")
  private List<T> data;

  @Schema(description = "페이지 정보")
  private PageMeta meta;
}
