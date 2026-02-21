create table system_group_code
(
    seq          BIGINT                              NOT NULL AUTO_INCREMENT COMMENT '일련번호',
    group_code   VARCHAR(10)                         NOT NULL COMMENT '그룹코드',
    group_name   VARCHAR(100)                        NOT NULL COMMENT '그룹코드명',
    group_desc   TEXT                                NOT NULL COMMENT '그룹코드 설명',
    used         BIT                                 NOT NULL DEFAULT false COMMENT '사용여부',
    created_by   BIGINT                              NOT NULL COMMENT '생성자',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by   BIGINT                              NOT NULL COMMENT '수정자',
    updated_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',

    UNIQUE KEY UK_SYSTEM_GROUP_CODE_GROUP_CODE (group_code),
    PRIMARY KEY (seq)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COMMENT ='그룹 코드 테이블';;


create table system_code
(
    seq          BIGINT                              NOT NULL AUTO_INCREMENT COMMENT '일련번호',
    code         VARCHAR(10)                         NOT NULL COMMENT '코드',
    group_code   VARCHAR(10)                         NOT NULL COMMENT '그룹코드',
    code_name    VARCHAR(100)                        NOT NULL COMMENT '코드명',
    code_order   INT                                 NOT NULL COMMENT '코드 정렬 순서',
    code_desc    TEXT                                NOT NULL COMMENT '코드 설명',
    used         BIT                                 NOT NULL DEFAULT false COMMENT '사용여부',
    created_by   BIGINT                              NOT NULL COMMENT '생성자',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by   BIGINT                              NOT NULL COMMENT '수정자',
    updated_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',

    UNIQUE KEY UK_SYSTEM_CODE_GROUP_CODE_CODE (group_code, code),
    FOREIGN KEY (group_code) REFERENCES system_group_code (group_code),
    PRIMARY KEY (seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8  COMMENT ='코드 테이블';