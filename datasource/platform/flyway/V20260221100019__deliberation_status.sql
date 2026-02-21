
CREATE TABLE deliberation_status
(
    seq                      BIGINT                              NOT NULL AUTO_INCREMENT COMMENT '심의 일련번호',
    schedule_date_seq        BIGINT                              NOT NULL COMMENT '심의 일자 일련번호',
    schedule_group_seq       BIGINT                              NOT NULL COMMENT '심의 그룹 일련번호',
    deliberation_file_seq    BIGINT                                        COMMENT '전체 심의서 파일 일련번호',
    created_time             DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    created_by               BIGINT                              NOT NULL COMMENT '등록자',
    updated_time             DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    updated_by               BIGINT                              NULL COMMENT '수정자',
    PRIMARY KEY (seq),
    UNIQUE KEY UK_DELIBERATION_STATUS_SCHEDULE_DATE_GROUP (schedule_date_seq, schedule_group_seq)
) ENGINE = InnoDB DEFAULT CHARSET = UTF8MB4 COMMENT = '심의 상태 테이블';

CREATE TABLE deliberation_target
(
    deliberation_status_seq  BIGINT                              NOT NULL COMMENT '심의 상태 일련번호',
    judg_seq                 BIGINT                              NOT NULL COMMENT '재결 일련번호',
    target_order             INT UNSIGNED NOT NULL DEFAULT 0             COMMENT '순번',
    created_time             DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    created_by               BIGINT                              NOT NULL COMMENT '등록자',
    updated_time             DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    updated_by               BIGINT                              NULL COMMENT '수정자',
    PRIMARY KEY (deliberation_status_seq, judg_seq),
    FOREIGN KEY (deliberation_status_seq) references deliberation_status (seq),
    UNIQUE KEY UK_DELIBERATION_TARGET_JUDG_SEQ (judg_seq)
) ENGINE = InnoDB DEFAULT CHARSET = UTF8MB4 COMMENT = '심의 대상 테이블';