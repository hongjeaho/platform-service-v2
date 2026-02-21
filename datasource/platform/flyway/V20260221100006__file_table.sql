CREATE TABLE file
(
    seq                BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '일련번호',
    file_path          VARCHAR(200)                       NOT NULL COMMENT '파일 경로',
    original_file_name VARCHAR(200)                       NOT NULL COMMENT '원본 파일 이름',
    changed_file_name  VARCHAR(200)                       NOT NULL COMMENT '변경된 파일 이름',
    created_by         BIGINT                             NOT NULL COMMENT '등록자',
    created_time       DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by         BIGINT COMMENT '수정자',
    updated_time       DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='파일 테이블';

CREATE TABLE file_pdf_image (
    judg_seq           BIGINT                             NOT NULL COMMENT '재결 일련 번호',
    image_file_seq     BIGINT                             NOT NULL COMMENT '파일 일련 번호',
    max_length         INT                                NOT NULL COMMENT '생성된 이미지 수',
    created_by         BIGINT                             NOT NULL COMMENT '등록자',
    created_time       DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by         BIGINT                             COMMENT '수정자',
    updated_time       DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (judg_seq, image_file_seq),
    FOREIGN KEY (judg_seq) references ltis_status (judg_seq),
    FOREIGN KEY (image_file_seq) references file (seq)
) ENGINE = InnoDB
    DEFAULT CHARSET = utf8 COMMENT ='PDF 이미지 정보 테이블';