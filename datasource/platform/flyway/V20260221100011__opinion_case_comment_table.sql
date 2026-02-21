CREATE TABLE opinion_case_template
(
    seq                     BIGINT                                 NOT NULL AUTO_INCREMENT COMMENT '일련번호',
    judg_seq                BIGINT                                 NOT NULL COMMENT '재결 일련 번호',
    opinion_template_seq    BIGINT                                 NOT NULL COMMENT '사건 템플릿 일련번호',
    opinion_file_seq        BIGINT                                          COMMENT '의견 첨부파일 일련번호',
    created_by              BIGINT                                 NOT NULL COMMENT '등록자',
    created_time            DATETIME DEFAULT CURRENT_TIMESTAMP     NOT NULL COMMENT '생성일',
    updated_by              BIGINT                                          COMMENT '수정자',
    updated_time            DATETIME                                        COMMENT '수정일',
    PRIMARY KEY (seq),
    FOREIGN KEY (judg_seq) REFERENCES ltis_status (judg_seq),
    FOREIGN KEY (opinion_file_seq) REFERENCES file (seq),
    FOREIGN KEY (opinion_template_seq) REFERENCES opinion_template (seq),
    UNIQUE KEY UK_OPINION_CASE_TEMPLATE (judg_seq, opinion_template_seq)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COMMENT='의견 마스터';

CREATE TABLE opinion_case_comment
(
    opinion_case_template_seq   BIGINT                                      COMMENT '의견 일련번호',
    judg_target                 TEXT                               NOT NULL COMMENT '소유자',
    implementer_comment         TEXT                               NOT NULL COMMENT '사업시행자 의견',
    owner_comment               TEXT                               NOT NULL COMMENT '소유자 의견',
    opinion_case_comment_order  INT UNSIGNED NOT NULL DEFAULT 0        COMMENT '정렬 순서',
    created_by                  BIGINT                             NOT NULL COMMENT '등록자',
    created_time                DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by                  BIGINT                                      COMMENT '수정자',
    updated_time                DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP  COMMENT '수정일',
    FOREIGN KEY (opinion_case_template_seq) REFERENCES opinion_case_template (seq)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COMMENT='템플릿별 의견 정보 ';

