
CREATE TABLE board_content
(
seq                      BIGINT                              NOT NULL AUTO_INCREMENT COMMENT '게시글 일련번호',
board_category_code      VARCHAR(10)                         NOT NULL COMMENT '게시글 분류코드(CB0001)',
title                    VARCHAR(500)                        NULL COMMENT '제목',
content                  TEXT                                NULL COMMENT '내용',
reply_seq                BIGINT                              NULL COMMENT '답변의 일련번호',
view_count               BIGINT   DEFAULT 0                  NULL COMMENT '조회수',
created_time             DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
created_by               BIGINT                              NOT NULL COMMENT '등록자',
updated_time             DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
updated_by               BIGINT                              NULL COMMENT '수정자',
PRIMARY KEY (seq)
) ENGINE = InnoDB DEFAULT CHARSET = UTF8MB4 COMMENT = '게시글 테이블';

CREATE TABLE board_question_answer_reply
(
board_seq                BIGINT                              NOT NULL COMMENT '게시글의 일련번호',
reply                    TEXT                                NULL COMMENT '답변 내용',
created_time             DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
created_by               BIGINT                              NOT NULL COMMENT '등록자',
updated_time             DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
updated_by               BIGINT                              NULL COMMENT '수정자',
PRIMARY KEY (board_seq)
) ENGINE = InnoDB DEFAULT CHARSET = UTF8MB4 COMMENT = '게시글의 답글 테이블';

CREATE TABLE board_attachment
(
    seq                                 BIGINT                              NOT NULL AUTO_INCREMENT COMMENT '일련번호',
    board_seq                           BIGINT                              NOT NULL COMMENT '게시글 일련번호',
    board_attachment_type_code          VARCHAR(10)                         NOT NULL COMMENT '게시글 첨부파일 타입 코드',
    board_attachment_file_seq           BIGINT                              NOT NULL COMMENT '게시글 첨부파일 일련번호',
    board_attachment_order              INT UNSIGNED NOT NULL DEFAULT 0        COMMENT '게시글 첨부파일 정렬순서',
    created_time                        DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    created_by                          BIGINT                              NOT NULL COMMENT '등록자',
    updated_time                        DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    updated_by                          BIGINT                              NULL COMMENT '수정자',
    PRIMARY KEY (seq),
    foreign key (board_seq) references board_content (seq)
) ENGINE = InnoDB DEFAULT CHARSET = UTF8MB4 COMMENT = '게시글 첨부파일';


insert into system_group_code (group_code, group_name, group_desc, used, created_by, created_time,
                                 updated_by, updated_time)
values ('CB001', '송달 결과', '송달 결과', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CB001001', 'CB001', '송달 결과', 1, '송달 결과 및 관련 첨부문서 확인 목적 게시글', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CB001002', 'CB001', '공지사항', 1, '공지사항', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CB001003', 'CB001', '묻고 답하기', 1, '묻고 답하기', true, 1, now(), 1, now());