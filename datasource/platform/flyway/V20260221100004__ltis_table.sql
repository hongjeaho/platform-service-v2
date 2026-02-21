CREATE TABLE ltis_status
(
    judg_seq           BIGINT                             NOT NULL COMMENT '재결일련번호',
    judg_div_cd        VARCHAR(100)                       NOT NULL COMMENT '재결구분코드',
    judg_div_nm        VARCHAR(100)                       NOT NULL COMMENT '재결구분코드명',
    stat_cd            VARCHAR(100)                       NOT NULL COMMENT '처리상태코드',
    stat_nm            VARCHAR(100)                       NOT NULL COMMENT '처리상태코드명',
    use_yn             VARCHAR(10)                        NOT NULL COMMENT '사용유무',
    bef_case_judg_seq  BIGINT COMMENT '이전 재결일련번호',
    rept_mod_dt        DATE COMMENT '조서정보최종수정일시',
    owner_mod_dt       DATE COMMENT '소유자정보최종수정일시',
    rept_owner_mod_dt  DATE COMMENT '조서소유자정보최종수정일시',
    recm_mod_dt        DATE COMMENT '평가법인정보최종수정일시',
    implementer_mod_dt DATE COMMENT '사업시행자정보최종수정일시',
    ltis_mod_dt        DATE COMMENT 'LTIS 수정일',
    created_time       DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_time       DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (judg_seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='LTIS 리스트 입력 정보 테이블';

CREATE TABLE ltis_info
(
    judg_seq           BIGINT                             NOT NULL COMMENT '재결일련번호',
    recep_dt           DATE                               NOT NULL COMMENT '접수일',
    judg_dt            DATE COMMENT '재결일',
    implementer_dt     DATE COMMENT '시행자기준시점',
    recm_req_prc_dt    DATE COMMENT '재결기준시점',
    case_no            VARCHAR(100)                       NOT NULL COMMENT '사건번호',
    case_title         VARCHAR(100)                       NOT NULL COMMENT '사건명',
    desn_ins           VARCHAR(100)                       NOT NULL COMMENT '재결기관',
    address            VARCHAR(100) COMMENT '소재지',
    dession_corp       VARCHAR(255) COMMENT '수용재결법인',
    corp_nm            VARCHAR(255) COMMENT '협의법인',
    implementer_biz_nm VARCHAR(255) COMMENT '시행자명',
    business_type      VARCHAR(255) COMMENT '사업유형',
    land_cnt           INT(10) COMMENT '필지수',
    land_owner_cnt     INT(10) COMMENT '필지소유자수',
    object_cnt         INT(10) COMMENT '지장물수',
    object_owner_cnt   INT(10) COMMENT '지장물소유자수',
    biz_oprt_price     BIGINT COMMENT '시행사금액',
    frst_comp_amt_sum  BIGINT COMMENT 'A법인평가금액',
    secd_comp_amt_sum  BIGINT COMMENT 'B법인평가금액',
    created_time       DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_time       DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    PRIMARY KEY (judg_seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='LTIS 세부 정보 테이블';


CREATE TABLE ltis_charge
(
    judg_seq          BIGINT                             NOT NULL COMMENT '재결일련번호',
    charge_nm         VARCHAR(255)                                COMMENT '담당자 이름',
    charge_id         VARCHAR(255)                                COMMENT '담당자 Id',
    charge_email      VARCHAR(255)                                COMMENT '담당자 Email',
    implementer_nm    VARCHAR(255)                                COMMENT '사업시행자 담당자',
    implementer_tel   VARCHAR(255)                                COMMENT '사업시행자 담당자 전화번호',
    implementer_id    VARCHAR(255)                                COMMENT '사업시행자 담당자 ID',
    implementer_email VARCHAR(255)                                COMMENT '사업시행자 담당자 Email',
    implementer_phone VARCHAR(50)                                 COMMENT '사업시행자휴대폰번호',
    created_time      DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    updated_time      DATETIME COMMENT '수정일',
    PRIMARY KEY (judg_seq)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='LTIS 담당자 정보 테이블';


