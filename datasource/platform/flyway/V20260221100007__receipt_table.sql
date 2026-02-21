CREATE TABLE receipt_status
(
    judg_seq        BIGINT                             NOT NULL COMMENT '재결 일련번호',
    status_code     VARCHAR(10)                        NOT NULL COMMENT '진행 상태 코드 [CR001]',
    created_by      bigint                             NOT NULL COMMENT '등록자',
    created_time    DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by      bigint COMMENT '수정자',
    updated_time    DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (judg_seq),
    FOREIGN KEY (judg_seq) REFERENCES ltis_status (judg_seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='재결접수 상태';

CREATE TABLE receipt_business_info
(
    judg_seq        BIGINT                             NOT NULL COMMENT '재결 일련번호',
    scale           varchar(100)                       NOT NULL COMMENT '규모',
    business_period varchar(100)                       NOT NULL COMMENT '사업기간',
    request_reason  varchar(100)                       NOT NULL COMMENT '신청사유',
    created_by      bigint                             NOT NULL COMMENT '등록자',
    created_time    DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by      bigint COMMENT '수정자',
    updated_time    DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (judg_seq),
    FOREIGN KEY (judg_seq) REFERENCES ltis_status (judg_seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='재결접수 사업 개요';

CREATE TABLE receipt_quantity_report
(
    judg_seq                BIGINT         NOT NULL COMMENT '재결 일련번호',
    land_cnt                bigint         NOT NULL DEFAULT 0 COMMENT '협의취득 필건(토지)',
    obj_cnt                 bigint         NOT NULL DEFAULT 0 COMMENT '협의취득 필건(물건)',
    goodwill_cnt            bigint         NOT NULL DEFAULT 0 COMMENT '협의취득 필건(영업권)',
    etc_cnt                 bigint         NOT NULL DEFAULT 0 COMMENT '협의취득 필건(기타)',
    land_area               decimal(10, 3) NOT NULL DEFAULT 0 COMMENT '협의취득 면적(토지)',
    etc_area                decimal(10, 3) NOT NULL DEFAULT 0 COMMENT '협의취득 면적(기타)',
    land_price              bigint         NOT NULL DEFAULT 0 COMMENT '협의취득 금액(토지)',
    obj_price               bigint         NOT NULL DEFAULT 0 COMMENT '협의취득 금액(물건)',
    goodwill_price          bigint         NOT NULL DEFAULT 0 COMMENT '협의취득 금액(영업권)',
    etc_price               bigint         NOT NULL DEFAULT 0 COMMENT '협의취득 금액(기타)',

    decision_land_cnt       bigint         NOT NULL DEFAULT 0 COMMENT '재결신청 필건(토지)',
    decision_obj_cnt        bigint         NOT NULL DEFAULT 0 COMMENT '재결신청 필건(물건)',
    decision_goodwill_cnt   bigint         NOT NULL DEFAULT 0 COMMENT '재결신청 필건(영업권)',
    decision_etc_cnt        bigint         NOT NULL DEFAULT 0 COMMENT '재결신청 필건(기타)',
    decision_land_area      decimal(10, 3) NOT NULL DEFAULT 0 COMMENT '재결신청 면적(토지)',
    decision_etc_area       decimal(10, 3) NOT NULL DEFAULT 0 COMMENT '재결신청 면적(기타)',
    decision_land_price     bigint         NOT NULL DEFAULT 0 COMMENT '재결신청 금액(토지)',
    decision_obj_price      bigint         NOT NULL DEFAULT 0 COMMENT '재결신청 금액(물건)',
    decision_goodwill_price bigint         NOT NULL DEFAULT 0 COMMENT '재결신청 금액(영업권)',
    decision_etc_price      bigint         NOT NULL DEFAULT 0 COMMENT '재결신청 금액(기타)',

    total_land_cnt          bigint         NOT NULL DEFAULT 0 COMMENT '총보상대상 필건 (토지)',
    total_land_area         decimal(10, 3) NOT NULL DEFAULT 0 COMMENT '총보상대상 면적 (토지)',
    total_land_price        bigint         NOT NULL DEFAULT 0 COMMENT '총보상대상 금액 (토지)',
    total_obj_cnt           bigint         NOT NULL DEFAULT 0 COMMENT '총보상대상 필건 (물건)',
    total_obj_price         bigint         NOT NULL DEFAULT 0 COMMENT '총보상대상 금액 (물건)',
    total_goodwill_cnt      bigint         NOT NULL DEFAULT 0 COMMENT '총보상대상 필건 (영업권)',
    total_goodwill_price    bigint         NOT NULL DEFAULT 0 COMMENT '총보상대상 금액 (영업권)',
    total_etc_cnt           bigint         NOT NULL DEFAULT 0 COMMENT '총보상대상 필건 (기타)',
    total_etc_area          decimal(10, 3) NOT NULL DEFAULT 0 COMMENT '총보상대상 면적 (기타)',
    total_etc_price         bigint         NOT NULL DEFAULT 0 COMMENT '총보상대상 금액 (기타)',

    sum_total_cnt           bigint         NOT NULL DEFAULT 0 COMMENT '총보상대상 필건 합',
    sum_total_area          decimal(10, 3) NOT NULL DEFAULT 0 COMMENT '총보상대상 면적 합',
    sum_total_price         bigint         NOT NULL DEFAULT 0 COMMENT '총보상대상 금액 합',
    sum_cnt                 bigint         NOT NULL DEFAULT 0 COMMENT '협의취득 필건 합',
    sum_area                bigint         NOT NULL DEFAULT 0 COMMENT '협의취득 면적 합',
    sum_price               bigint         NOT NULL DEFAULT 0 COMMENT '협의취득 금액 합',
    sum_decision_cnt        bigint         NOT NULL DEFAULT 0 COMMENT '재결신청 필건 합',
    sum_decision_area       decimal(10, 3) NOT NULL DEFAULT 0 COMMENT '재결신청 면적 합',
    sum_decision_price      bigint         NOT NULL DEFAULT 0 COMMENT '재결신청 금액 합',

    created_by              bigint         NOT NULL COMMENT '등록자',
    created_time            DATETIME                DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by              bigint COMMENT '수정자',
    updated_time            DATETIME COMMENT '수정일',
    PRIMARY KEY (judg_seq),
    FOREIGN KEY (judg_seq) REFERENCES ltis_status (judg_seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='재결접수 총물량조서';

CREATE TABLE receipt_business_recognition
(
    seq          BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '사업인정관계 일련번호',
    judg_seq     BIGINT                             NOT NULL COMMENT '재결 일련번호',
    title        varchar(100)                       NOT NULL COMMENT '사업인정관계 재목',
    content      varchar(200)                       NOT NULL COMMENT '사업인정관계 내용',
    created_by   bigint                             NOT NULL COMMENT '등록자',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by   bigint COMMENT '수정자',
    updated_time DATETIME COMMENT '수정일',
    PRIMARY KEY (seq),
    FOREIGN KEY (judg_seq) REFERENCES ltis_status (judg_seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='재결접수 사업인정관계(도시계획)';

create table receipt_agreement_date
(
    seq          BIGINT                             NOT NULL AUTO_INCREMENT COMMENT '합의내용 일련번호',
    judg_seq     BIGINT                             NOT NULL COMMENT '재결 일련번호',
    agreed_date  DATE                               NOT NULL COMMENT '협의 날짜',
    agreed_desc  varchar(200) NULL COMMENT '협의 내용',
    created_by   bigint                             NOT NULL COMMENT '등록자',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_by   bigint COMMENT '수정자',
    updated_time DATETIME COMMENT '수정일',
    PRIMARY KEY (seq),
    FOREIGN KEY (judg_seq) REFERENCES ltis_status (judg_seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='협의 날짜';