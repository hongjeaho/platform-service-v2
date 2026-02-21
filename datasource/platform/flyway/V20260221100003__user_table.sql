create table user
(
    seq           BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '사용자 일련번호',
    user_email    VARCHAR(100)                                COMMENT '사용자 이메일',
    user_name     VARCHAR(30)                        NOT NULL COMMENT '사용자명',
    user_id       VARCHAR(30)                        NOT NULL COMMENT '사용자 아이디',
    user_password VARCHAR(100)                       NOT NULL COMMENT '비밀번호',
    created_by    BIGINT                             NOT NULL COMMENT '생성자',
    created_time  DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by    BIGINT COMMENT '수정자',
    updated_time  DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (seq),
    UNIQUE KEY UK_USER_USER_ID (user_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='사용자 테이블';

create table user_role
(
    seq            BIGINT                             NOT NULL AUTO_INCREMENT COMMENT 'Role 일련번호',
    user_role_name VARCHAR(100)                       NOT NULL COMMENT 'Role명',
    created_by     BIGINT                             NOT NULL COMMENT '생성자',
    created_time   DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by     BIGINT COMMENT '수정자',
    updated_time   DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (seq),
    UNIQUE KEY UK_USER_ROLE_NAME (user_role_name)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='사용자 권한 테이블';

create table user_role_mapping
(
    seq          BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '사용자 Role 일련번호',
    user_seq     BIGINT                             NOT NULL COMMENT '사용자 일련번호',
    role_seq     BIGINT                             NOT NULL COMMENT '사용자 일련번호',
    created_by   BIGINT                             NOT NULL COMMENT '생성자',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',

    PRIMARY KEY (seq),
    UNIQUE KEY UK_USER_ROLE_MAPPING_USER_ROLE (user_seq, role_seq),
    FOREIGN KEY (user_seq) REFERENCES user (seq),
    FOREIGN KEY (role_seq) REFERENCES user_role (seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='사용자 권한 매핑 테이블';

-- passwordis 12345
insert into user (user_email, user_name, user_id, user_password, created_by, updated_by)
values ('admin@gmail.com', '어드민', 'admin',
        '$2a$10$zUBEUh5T1ehLA98ly2n2NeiEevUhyK1axz.2evM.5uyP8cvTWKNay', 1, 1);

-- 사업 시행자
insert into user_role (user_role_name, created_by, updated_by)
values ('IMPLEMENTER', 1, 1);
-- 재결관
insert into user_role (user_role_name, created_by, updated_by)
values ('DECISION', 1, 1);
-- 위원
insert into user_role (user_role_name, created_by, updated_by)
values ('DELIBERATE', 1, 1);
-- 관리자
insert into user_role (user_role_name, created_by, updated_by)
values ('ADMIN', 1, 1);

insert into user_role_mapping (user_seq, role_seq, created_by)
values (1, 4, 1);