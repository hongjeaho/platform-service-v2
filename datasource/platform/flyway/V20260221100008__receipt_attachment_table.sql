CREATE TABLE receipt_attachment
(
    seq                             BIGINT                              NOT NULL AUTO_INCREMENT COMMENT '일련번호',
    judg_seq                        BIGINT                              NOT NULL COMMENT '재결 일련번호',
    attachment_type_code            VARCHAR(10)                         NOT NULL COMMENT '파일 타입 코드[CR002]',
    attachment_order                INT                                 NOT NULL COMMENT '정렬 순서',
    attachment_file_seq             BIGINT                             NOT NULL  COMMENT '사업 시행자 첨부파 일련번호',
    created_by                      BIGINT                             NOT NULL  COMMENT '등록자',
    created_time                    DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL  COMMENT '생성일',
    updated_by                      BIGINT                                       COMMENT '수정자',
    updated_time                    DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP  COMMENT '수정일',
    PRIMARY KEY (seq),
    FOREIGN KEY (judg_seq) REFERENCES ltis_status (judg_seq),
    FOREIGN KEY (attachment_file_seq) REFERENCES file (seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='사업시행자 사건 접수 첨부 파일';