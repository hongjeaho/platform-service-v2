CREATE TABLE opinion_template
(
    seq                  BIGINT                             NOT NULL COMMENT '템플릿 번호',
    template_name        VARCHAR(200)                       NOT NULL COMMENT '템플릿 이름',
    template_order       int                                not null comment '템플릿 순번',
    template_description VARCHAR(400) COMMENT '템플릿 설명',
    template_file_seq    BIGINT COMMENT '템플릿 파일 일련번호',
    template_required    TINYINT(1) COMMENT '필수 여부',
    created_by           bigint                             NOT NULL COMMENT '등록자',
    created_time         DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by           BIGINT COMMENT '수정자',
    updated_time         DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (seq)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COMMENT='의견 템플릿';