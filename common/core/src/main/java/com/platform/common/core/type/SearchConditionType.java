package com.platform.common.core.type;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Schema(enumAsRef = true)
@Getter
public enum SearchConditionType {

  BOTH(0, "전체"),
  TITLE(1, "제목"),
  CONTENT(2, "내용");

  private final int code;
  private final String desc;

  SearchConditionType(int code, String desc) {
    this.code = code;
    this.desc = desc;
  }
}
