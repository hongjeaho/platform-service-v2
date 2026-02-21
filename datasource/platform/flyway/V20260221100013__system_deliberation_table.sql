create table system_deliberation_date
(
    seq                     BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '심의일자 일련번호',
    scheduled_date          date                               NOT NULL COMMENT '심의일자',
    created_by              bigint                             NOT NULL COMMENT '등록자',
    created_time            DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by              BIGINT COMMENT '수정자',
    updated_time            DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (seq),
    UNIQUE KEY UK_SYSTEM_DELIBERATION_DATE_SCHEDULED_DATE (scheduled_date)
) ENGINE = InnoDB
    DEFAULT CHARSET = utf8 COMMENT ='심의일자 테이블';

create table system_deliberation_group
(
    seq                  BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '심의그룹 일련번호',
    group_name           varchar(10)                        NOT NULL COMMENT '심의그룹 이름',
    created_by           bigint                             NOT NULL COMMENT '등록자',
    created_time         DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by           BIGINT COMMENT '수정자',
    updated_time         DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
     PRIMARY KEY (seq),
     UNIQUE KEY UK_SYSTEM_DELIBERATION_GROUP_NAME (group_name)
) ENGINE = InnoDB
    DEFAULT CHARSET = utf8 COMMENT ='심의그룹 테이블';


