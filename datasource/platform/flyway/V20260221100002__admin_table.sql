CREATE TABLE admin_district_manager
(
    seq             BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '담당자 일련번호',
    manager_name    VARCHAR(30)                        NOT NULL COMMENT '담당자 이름',
    district        VARCHAR(50)                        NOT NULL COMMENT '담당구',
    phone_number    VARCHAR(20)                        NOT NULL COMMENT '전화번호',
    created_by      BIGINT                             NOT NULL COMMENT '생성자',
    created_time    DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by      BIGINT COMMENT '수정자',
    updated_time    DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT = '구별 담당자 테이블';

CREATE TABLE admin_committee_member
(
    seq                 BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '위원회 명단 일련번호',
    committee_name      VARCHAR(10)                        NOT NULL COMMENT '위원 이름',
    committee_type      VARCHAR(10)                        NOT NULL COMMENT '구분 (CA001)',
    remarks             VARCHAR(500)                                COMMENT '비고',
    created_by          BIGINT                             NOT NULL COMMENT '생성자',
    created_time        DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by          BIGINT COMMENT '수정자',
    updated_time        DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (seq),
    INDEX IDX_ADMIN_COMMITTEE_MEMBER_TYPE (committee_type)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT = '위원회 명단 테이블';

