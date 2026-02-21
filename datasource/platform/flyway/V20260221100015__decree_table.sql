create table reference_decree
(
    seq                  BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '법령 일련번호',
    decree_name          TEXT                               NULL COMMENT '법령명',
    decree_memo          TEXT                               NULL COMMENT '비고',
    decree_category_code TEXT                               NULL COMMENT '법령 분류 코드',
    del_check            BIGINT    default 0                NOT NULL COMMENT '삭제여부',
    created_by           BIGINT                             NOT NULL COMMENT '등록자',
    created_time         DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by           BIGINT                             NULL COMMENT '수정자',
    updated_time         DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (seq)
) ENGINE = InnoDB
    DEFAULT CHARSET = UTF8MB4 COMMENT ='법령 테이블';

create table reference_decree_detail
(
    seq            BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '각 조문 고유 일련번호',
    decree_seq     BIGINT                             NOT NULL COMMENT '법령 일련번호',
    article_no     TEXT                             NOT NULL COMMENT '해당 조문',
    decree_content TEXT                               NULL COMMENT '조문 전체 본문',
    del_check      BIGINT    default 0                NOT NULL COMMENT '삭제여부',
    ref_count      BIGINT   default 0                 NULL COMMENT '참조 횟수',
    view_count     BIGINT   default 0                 NULL COMMENT '조회수',
    created_by     BIGINT                             NOT NULL COMMENT '등록자',
    created_time   datetime default CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by     BIGINT                             NULL COMMENT '수정자',
    updated_time   datetime                           NULL COMMENT '수정일',
    PRIMARY KEY (seq),
    FOREIGN KEY (decree_seq) REFERENCES reference_decree (seq)
) ENGINE = InnoDB
    DEFAULT CHARSET = UTF8MB4 COMMENT ='각 법령별 조문 및 본문 테이블';