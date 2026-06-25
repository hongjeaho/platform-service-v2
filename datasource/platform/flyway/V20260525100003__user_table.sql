CREATE TABLE users
(
    seq BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '사용자 일련번호',

    user_email VARCHAR(100) NOT NULL COMMENT '사용자 이메일',
    user_name VARCHAR(30) NOT NULL COMMENT '사용자명',
    user_id VARCHAR(30) NOT NULL COMMENT '사용자 아이디',
    user_password VARCHAR(100) NOT NULL COMMENT '비밀번호',

    last_login_time DATETIME COMMENT '마지막 로그인 일시',
    password_changed_time DATETIME COMMENT '비밀번호 변경 일시',
    deleted_time DATETIME COMMENT '회원탈퇴 일시',

    created_by BIGINT NOT NULL COMMENT '생성자',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    updated_by BIGINT COMMENT '수정자',
    updated_time DATETIME COMMENT '수정일',

    UNIQUE KEY UK_USERS_USER_EMAIL (user_email),
    UNIQUE KEY UK_USERS_USER_ID (user_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
    COMMENT = '사용자 테이블';


CREATE TABLE roles
(
    seq BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '권한 일련번호',

    role_name VARCHAR(100) NOT NULL COMMENT '권한명',

    UNIQUE KEY UK_ROLES_NAME (role_name)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
    COMMENT = '권한 테이블';


CREATE TABLE user_roles
(
    user_seq BIGINT NOT NULL COMMENT '사용자 일련번호',
    role_seq BIGINT NOT NULL COMMENT '권한 일련번호',

    created_by BIGINT NOT NULL COMMENT '생성자',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',

    PRIMARY KEY (user_seq, role_seq),

    CONSTRAINT FK_USER_ROLES_USER
        FOREIGN KEY (user_seq)
            REFERENCES users (seq)
            ON DELETE CASCADE,

    CONSTRAINT FK_USER_ROLES_ROLE
        FOREIGN KEY (role_seq)
            REFERENCES roles (seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
    COMMENT = '사용자 권한 매핑 테이블';


CREATE TABLE user_login_histories
(
    seq BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '로그인 이력 일련번호',

    user_seq BIGINT NOT NULL COMMENT '사용자 일련번호',

    login_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '로그인 일시',

    ip_address VARCHAR(45) COMMENT '접속 IP',
    user_agent VARCHAR(500) COMMENT 'User-Agent',

    CONSTRAINT FK_USER_LOGIN_HISTORIES_USER
        FOREIGN KEY (user_seq)
            REFERENCES users (seq)
            ON DELETE CASCADE,

    INDEX IX_USER_LOGIN_HISTORIES_USER_SEQ_LOGIN_TIME
        (user_seq, login_time DESC)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
    COMMENT = '사용자 로그인 이력';


-- password: 12345
INSERT INTO users
(
    user_email,
    user_name,
    user_id,
    user_password,
    password_changed_time,
    created_by
)
VALUES
    (
        'admin@gmail.com',
        '어드민',
        'admin',
        '$2a$10$zUBEUh5T1ehLA98ly2n2NeiEevUhyK1axz.2evM.5uyP8cvTWKNay',
        NOW(),
        1
    );

INSERT INTO roles (role_name)
VALUES ('USER');

INSERT INTO roles (role_name)
VALUES ('ADMIN');

INSERT INTO user_roles
(
    user_seq,
    role_seq,
    created_by
)
VALUES
    (
        1,
        2,
        1
    );