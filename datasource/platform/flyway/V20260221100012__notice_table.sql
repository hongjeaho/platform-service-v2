create table notice_info
(
    seq                BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '일련번호',
    judg_seq           bigint                             not null comment '재결 일련번호',
    document_number    varchar(100) comment '의뢰문서번호',
    document_title     varchar(500) comment '문서제목',
    receiver           varchar(50) comment '수신처',
    request_start_date date comment '의뢰시작일',
    request_end_date   date comment '의뢰마감일',
    notice_start_date  date comment '열람시작일',
    notice_end_date    date comment '열람만료일',
    newsletter_date    date comment '회보일',
    created_by         BIGINT                             NOT NULL COMMENT '등록자',
    created_time       DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by         BIGINT NULL COMMENT '수정자',
    updated_time       DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (seq),
    UNIQUE KEY UK_NOTICE_INFO_JUDG_SEQ (judg_seq),
    foreign key (judg_seq) references ltis_status (judg_seq)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COMMENT = '열람공고';

create table notice_attachment
(
    seq                BIGINT                                         NOT NULL AUTO_INCREMENT COMMENT '일련번호',
    notice_info_seq                 bigint                             not null comment '재결 일련번호',
    notice_attachment_type_code     varchar(10)                        not null comment '파일 타입 코드[CN001]',
    notice_attachment_order         INT UNSIGNED NOT NULL DEFAULT 0         comment '정렬 순서',
    notice_attachment_file_seq      bigint                             not null comment '열람공고 파일 일련번호',
    notice_attachment_description   varchar(100)                       null     comment '열람공고 파일 설명',
    parent_notice_attachment_seq    BIGINT                                      comment '상위 일련번호',
    created_by                      BIGINT                             NOT NULL COMMENT '등록자',
    created_time                    DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by                      BIGINT                             NULL COMMENT '수정자',
    updated_time                    DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (seq),
    foreign key (notice_info_seq) references notice_info (seq),
    foreign key (notice_attachment_file_seq) references file (seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT = '열람공고 첨부 파일';