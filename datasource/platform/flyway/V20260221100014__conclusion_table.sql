

create table conclusion_status
(
    seq                     BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '검토 일련번호',
    judg_seq                BIGINT                             NOT NULL COMMENT '재결 일련번호',
    status_code             VARCHAR(10)                        NOT NULL COMMENT '검토 상태 코드(CD002)',
    created_by              BIGINT                             NOT NULL COMMENT '등록자',
    created_time            DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by              BIGINT                             NULL COMMENT '수정자',
    updated_time            DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (seq),
    UNIQUE KEY UK_CONCLUSION_STATUS_JUDG_SEQ (judg_seq),
    FOREIGN KEY (judg_seq) references ltis_status (judg_seq)
) ENGINE = InnoDB
      DEFAULT CHARSET = utf8 COMMENT ='검토 마스터';

create table conclusion_content
(
    conclusion_status_seq         BIGINT                             NOT NULL COMMENT '검토 마스터 일련번호',
    opinion_template_seq          BIGINT                             NOT NULL COMMENT '의견 템플릿 일련번호',
    decree_content                TEXT                                        COMMENT '법령 내용',
    precedent_content             TEXT                                        COMMENT '판례 내용',
    opinion_content               TEXT                               NOT NULL COMMENT '검토의견 내용',
    conclusion_file_seq           BIGINT                                      COMMENT '재결관 의견 첨부파일',
    conclusion_file_page_length   int                                         COMMENT '재결관 의견 첨부파일 페이시 수',
    created_by                    BIGINT                             NOT NULL COMMENT '등록자',
    created_time                  DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by                    BIGINT                                 NULL COMMENT '수정자',
    updated_time                  DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (conclusion_status_seq, opinion_template_seq),
    FOREIGN KEY (conclusion_status_seq) REFERENCES conclusion_status (seq),
    FOREIGN KEY (opinion_template_seq) REFERENCES opinion_template (seq),
    FOREIGN KEY (conclusion_file_seq) REFERENCES file (seq)
) ENGINE = InnoDB
      DEFAULT CHARSET = utf8 COMMENT =' 검토 의견 테이블';

create table conclusion_bookmark
(
    seq                             BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '북마크 일련번호',
    conclusion_status_seq           BIGINT                             NOT NULL COMMENT '검토 마스터 일련번호',
    opinion_template_seq            BIGINT                             NOT NULL COMMENT '의견 템플릿 일련번호',
    bookmark_number                 INT                                NOT NULL COMMENT '북마크 번호',
    bookmark_name                   VARCHAR(100)                       NOT NULL COMMENT '북마크 이름',
    depth                           INT                                NOT NULL COMMENT '깊이',
        parent_conclusion_bookmark_seq  BIGINT                                  COMMENT '부모 북마크 일련번호',
    created_by                      BIGINT                             NOT NULL COMMENT '등록자',
    created_time                    DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    PRIMARY KEY (seq)
) ENGINE = InnoDB
       DEFAULT CHARSET = utf8 COMMENT ='검토 의견 북마크';