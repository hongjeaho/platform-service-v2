create table  reference_precedent
(
    seq                  BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '판례 참고 사건의 일련번호',
    judg_seq             BIGINT                             NOT NULL COMMENT '재결 일련번호',
    template_seq_no      BIGINT                             NOT NULL COMMENT '의견 템플릿 일련번호',
    case_no              VARCHAR(100)                       NULL COMMENT '사건번호',
    case_title           VARCHAR(100)                       NULL COMMENT '사업명',
    deliberation_period  VARCHAR(100)                       NULL COMMENT '심의 기간',
    deliberation_date    DATE                               NULL COMMENT '심의일',
    precedent_case_no    VARCHAR(100)                       NULL COMMENT '법원사건번호',
    court_name           VARCHAR(100)                       NULL COMMENT '법원명',
    precedent_content   TEXT                                NULL COMMENT '판례 내용',
    ref_count            BIGINT    default 0                NULL COMMENT '참조 횟수',
    view_count           BIGINT    default 0                NULL COMMENT '조회수',
    del_check            BIGINT    default 0                NOT NULL COMMENT '삭제여부',
    created_by           BIGINT                             NOT NULL COMMENT '등록자',
    created_time         DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by           BIGINT                             NULL COMMENT '수정자',
    updated_time         DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (seq),
    FOREIGN KEY (template_seq_no) REFERENCES opinion_template (seq)
) ENGINE = InnoDB
    DEFAULT CHARSET = UTF8MB4 COMMENT ='판례 참고 사건 테이블';
