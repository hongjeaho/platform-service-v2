package com.platform.common.core.type.status;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ConclusionStatusCode {
  ZERO("CC001000", "검토 전"),
  START("CC001001", "검토 시작"),
  COMPLETE("CC001002", "검토 완료");

  private final String code;
  private final String desc;
}
