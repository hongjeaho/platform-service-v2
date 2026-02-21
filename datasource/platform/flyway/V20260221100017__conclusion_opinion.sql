  create table reference_conclusion_opinion
 (
    seq                         BIGINT                             NOT NULL AUTO_INCREMENT COMMENT  '재결관 의견 일련번호',
    judg_seq                    BIGINT                             NOT NULL COMMENT '재결 일련번호',
    template_seq_no             BIGINT                             NOT NULL COMMENT '의견 템플릿 일련번호',
    deliberation_period         VARCHAR(100)                       NULL COMMENT '심의 차수',
    deliberation_date           VARCHAR(100)                       NULL COMMENT '심의일자',
    conclusion_opinion_content  TEXT                               NOT NULL COMMENT '재결관 의견 내용',
    ref_count                   BIGINT   default 0                 NULL COMMENT '참조 횟수',
    view_count                  BIGINT   default 0                 NULL COMMENT '조회수',
    created_by                  BIGINT                             NOT NULL COMMENT '등록자',
    created_time                DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by                  BIGINT                             NULL COMMENT '수정자',
    updated_time                DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (seq),
    FOREIGN KEY (template_seq_no) REFERENCES opinion_template (seq)
 ) ENGINE = InnoDB
    DEFAULT CHARSET = UTF8MB4 COMMENT ='재결관 의견 테이블';