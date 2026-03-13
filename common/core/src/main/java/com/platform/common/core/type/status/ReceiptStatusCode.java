package com.platform.common.core.type.status;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum ReceiptStatusCode {
  ZERO("CR001000", "접수 전"),
  CASE_INFO("CR001001", "접수 기본 정보 등록"),
  QUANTITY_REPORT("CR001002", "총물량조서 등록"),
  BEFORE_APPRAISAL("CR001003", "협의감졍평가정보 등록"),
  ATTACHMENT("CR001004", "첨부파일 등록"),
  NOTICE_END("CR001005", "열람공고결과 등록"),
  OPINION_WRITE("CR001006", "의견작성"),
  DECISION_START("CR001007", "검토 요청");

  private final String code;
  private final String desc;
}
