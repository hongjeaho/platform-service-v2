
create table receipt_previous_appraisal
(

    seq                                      BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '협의 감정평가 정보 일련번호',
    judg_seq                                 BIGINT                             NOT NULL COMMENT '재결 일련번호',
    governor_recommendation                  BOOLEAN                            NOT NULL COMMENT '시도지사 추천여부',
    optional_implementer_recommendation      BOOLEAN                            NOT NULL COMMENT '사업시행자 추천 추가  여부' ,
    optional_land_owner_recommendation            BOOLEAN                       NOT NULL COMMENT '토지소유자 추천 추가  여부',
    governor_not_recommendation              VARCHAR(4000)                               COMMENT '시도지사 추천 하지 않는 이유',
    created_by                               BIGINT                             NOT NULL COMMENT '등록자',
    created_time                             DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by                               BIGINT                             NULL     COMMENT '수정자',
    updated_time                             DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP NULL     COMMENT '수정일',
    PRIMARY KEY (seq),
    UNIQUE KEY UK_RECEIPT_PREVIOUS_APPRAISAL_JUDG_SEQ (judg_seq),
    foreign key (judg_seq) references ltis_status (judg_seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT = '협의 감정평가 정보';

create table receipt_previous_appraisal_recommend
(
    receipt_previous_appraisal_seq         BIGINT                             NOT NULL COMMENT '협의 감정평가 정보 재결 일련번호',
    recommend_type_code                    VARCHAR(100)                       NOT NULL COMMENT '추천 유형 코드',
    recommend_corporation_name             VARCHAR(100)                       NOT NULL COMMENT '법인명',
    recommend_price                        BIGINT                             NOT NULL COMMENT '추천 금액',
    recommend_file_seq                     BIGINT                             NOT NULL COMMENT '감졍평가서 파일 일련번호[CR003]',
    created_by                             BIGINT                             NOT NULL COMMENT '등록자',
    created_time                           DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by                             BIGINT                             NULL     COMMENT '수정자',
    updated_time                           DATETIME                           NULL     COMMENT '수정일',
    PRIMARY KEY (receipt_previous_appraisal_seq, recommend_type_code),
    foreign key (receipt_previous_appraisal_seq) references receipt_previous_appraisal (seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT = '협의 감정평가 추천 정보';


create table receipt_previous_appraisal_attachment
(
    judg_seq                  bigint                             not null comment '재결 일련번호',
    previous_appraisal_type_code          varchar(10)                        not null comment '파일 타입 코드[CR004]',
    previous_appraisal_file_seq           bigint                             not null comment '파일 일련번호',
    created_by                bigint                             not null comment '등록자',
    created_time              datetime default CURRENT_TIMESTAMP not null comment '생성일',
    updated_by                bigint                             null comment '수정자',
    updated_time              datetime                           null comment '수정일',
    foreign key (judg_seq) references ltis_status (judg_seq),
    FOREIGN KEY (previous_appraisal_file_seq) REFERENCES file (seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT = '협의 공고 파일';