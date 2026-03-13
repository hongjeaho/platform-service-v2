package com.platform.common.core.type;

import lombok.Getter;

@Getter
public enum FileTypeCode {
  RECEIPT_FILE_UPLOAD("사업 시행자 접수 첨부파일", "${year}/${month}/${caseNo}/receiptFileUpload", true),
  NOTICE_FILE_UPLOAD("공고 의뢰 첨부파일", "${year}/${month}/${caseNo}/noticeFileUpload", true),
  APPRAISAL_RECOMMEND_FILE_UPLOAD("감정평가 추천  의뢰 첨부파일",
      "${year}/${month}/${caseNo}/appraisalRecommendFileUpload", true),
  OPINION_FILE_UPLOAD("사업 시행자 의견 첨부파일", "${year}/${month}/${caseNo}/opinionFileUpload", true),
  CONCLUSION_OPINION_FILE_UPLOAD("재결관 검토 첨부파일",
      "${year}/${month}/${caseNo}/conclusionOpinionFileUpload", true),
  POST_DELIVERY_FILE_UPLOAD("송달결과 첨부파일", "${year}/${month}/${caseNo}/postDeliveryFileUpload",
      true),
  BOARD_FILE_UPLOAD("공지사항 첨부파일", "${year}/${month}/${caseNo}/boardFileUpload",
      true);

  private final String desc;
  private final String path;
  private final boolean caseNo;

  FileTypeCode(String desc, String path, boolean caseNo) {
    this.desc = desc;
    this.path = path;
    this.caseNo = caseNo;
  }
}
