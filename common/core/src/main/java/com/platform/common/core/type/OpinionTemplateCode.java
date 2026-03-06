package com.platform.common.core.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum OpinionTemplateCode {
  NO_OPINION(9999L, "의견 없음");

  private final Long code;
  private final String desc;
}
