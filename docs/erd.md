# 데이터베이스 테이블 설계 문서

## 목차

1. [개요](#개요)
2. [시스템 코드 관리](#시스템-코드-관리)
3. [사용자 및 권한 관리](#사용자-및-권한-관리)
4. [관리자 및 위원회 관리](#관리자-및-위원회-관리)
5. [LTIS 연동](#ltis-연동)
6. [파일 관리](#파일-관리)
7. [재결 접수](#재결-접수)
8. [의견 관리](#의견-관리)
9. [열람공고](#열람공고)
10. [검토 관리](#검토-관리)
11. [심의 관리](#심의-관리)
12. [참고자료 관리](#참고자료-관리)
13. [공시지가 관리](#공시지가-관리)
14. [게시판](#게시판)
15. [ERD 관계도](#erd-관계도)

---

## 개요

본 시스템은 토지보상 재결 업무를 관리하는 플랫폼으로, LTIS 시스템과 연동하여 재결 접수부터 심의, 검토, 의견 작성까지의 전체 프로세스를 지원합니다.

**주요 기능:**

- LTIS 시스템 연동 및 데이터 동기화
- 재결 접수 및 진행 상태 관리
- 사업시행자/소유자 의견 관리
- 재결관 검토 의견 작성
- 위원회 심의 일정 및 그룹 관리
- 법령/판례 참고자료 관리

---

## 시스템 코드 관리

### system_group_code

그룹 코드 마스터 테이블

| 컬럼명       | 타입         | 제약조건                            | 설명          |
| ------------ | ------------ | ----------------------------------- | ------------- |
| seq          | BIGINT       | PK, AUTO_INCREMENT                  | 일련번호      |
| group_code   | VARCHAR(10)  | UNIQUE, NOT NULL                    | 그룹코드      |
| group_name   | VARCHAR(100) | NOT NULL                            | 그룹코드명    |
| group_desc   | TEXT         | NOT NULL                            | 그룹코드 설명 |
| used         | BIT          | NOT NULL, DEFAULT false             | 사용여부      |
| created_by   | BIGINT       | NOT NULL                            | 생성자        |
| created_time | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일        |
| updated_by   | BIGINT       | NOT NULL                            | 수정자        |
| updated_time | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 수정일        |

**등록된 그룹 코드:**

- CA001: 위원회 구분 코드
- CR001: 접수 진행 상태
- CR002: 사업 시행자 첨부파일
- CR003: 감평평가 추천 코드
- CR004: 협의 공고 파일 타입 코드
- CO001: 사업 시행자 의견 첨부파일
- CN001: 열람 공고 등록 파일 타입 코드
- CC001: 검토 진행 상태
- CD001: 법령의 분류
- CB001: 게시판 분류 (송달 결과, 공지사항, 묻고 답하기)

### system_code

세부 코드 테이블

| 컬럼명       | 타입         | 제약조건                            | 설명           |
| ------------ | ------------ | ----------------------------------- | -------------- |
| seq          | BIGINT       | PK, AUTO_INCREMENT                  | 일련번호       |
| code         | VARCHAR(10)  | UNIQUE(group_code, code), NOT NULL  | 코드           |
| group_code   | VARCHAR(10)  | FK(system_group_code), NOT NULL     | 그룹코드       |
| code_name    | VARCHAR(100) | NOT NULL                            | 코드명         |
| code_order   | INT          | NOT NULL                            | 코드 정렬 순서 |
| code_desc    | TEXT         | NOT NULL                            | 코드 설명      |
| used         | BIT          | NOT NULL, DEFAULT false             | 사용여부       |
| created_by   | BIGINT       | NOT NULL                            | 생성자         |
| created_time | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일         |
| updated_by   | BIGINT       | NOT NULL                            | 수정자         |
| updated_time | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 수정일         |

---

## 사용자 및 권한 관리

### user

사용자 테이블

| 컬럼명        | 타입         | 제약조건                            | 설명            |
| ------------- | ------------ | ----------------------------------- | --------------- |
| seq           | BIGINT       | PK, AUTO_INCREMENT                  | 사용자 일련번호 |
| user_email    | VARCHAR(100) |                                     | 사용자 이메일   |
| user_name     | VARCHAR(30)  | NOT NULL                            | 사용자명        |
| user_id       | VARCHAR(30)  | UNIQUE, NOT NULL                    | 사용자 아이디   |
| user_password | VARCHAR(100) | NOT NULL                            | 비밀번호        |
| created_by    | BIGINT       | NOT NULL                            | 생성자          |
| created_time  | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일          |
| updated_by    | BIGINT       |                                     | 수정자          |
| updated_time  | DATETIME     |                                     | 수정일          |

**기본 계정:**

- ID: admin, Password: 12345 (암호화됨)

### user_role

사용자 권한 테이블

| 컬럼명         | 타입         | 제약조건                            | 설명          |
| -------------- | ------------ | ----------------------------------- | ------------- |
| seq            | BIGINT       | PK, AUTO_INCREMENT                  | Role 일련번호 |
| user_role_name | VARCHAR(100) | UNIQUE, NOT NULL                    | Role명        |
| created_by     | BIGINT       | NOT NULL                            | 생성자        |
| created_time   | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일        |
| updated_by     | BIGINT       |                                     | 수정자        |
| updated_time   | DATETIME     |                                     | 수정일        |

**기본 권한:**

- IMPLEMENTER: 사업 시행자
- DECISION: 재결관
- DELIBERATE: 위원
- ADMIN: 관리자

### user_role_mapping

사용자 권한 매핑 테이블

| 컬럼명       | 타입     | 제약조건                                       | 설명                 |
| ------------ | -------- | ---------------------------------------------- | -------------------- |
| seq          | BIGINT   | PK, AUTO_INCREMENT                             | 사용자 Role 일련번호 |
| user_seq     | BIGINT   | FK(user), UNIQUE(user_seq, role_seq), NOT NULL | 사용자 일련번호      |
| role_seq     | BIGINT   | FK(user_role), NOT NULL                        | 권한 일련번호        |
| created_by   | BIGINT   | NOT NULL                                       | 생성자               |
| created_time | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP            | 생성일               |

---

## 관리자 및 위원회 관리

### admin_district_manager

구별 담당자 테이블

| 컬럼명       | 타입        | 제약조건                            | 설명            |
| ------------ | ----------- | ----------------------------------- | --------------- |
| seq          | BIGINT      | PK, AUTO_INCREMENT                  | 담당자 일련번호 |
| manager_name | VARCHAR(30) | NOT NULL                            | 담당자 이름     |
| district     | VARCHAR(50) | NOT NULL                            | 담당구          |
| phone_number | VARCHAR(20) | NOT NULL                            | 전화번호        |
| created_by   | BIGINT      | NOT NULL                            | 생성자          |
| created_time | DATETIME    | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일          |
| updated_by   | BIGINT      |                                     | 수정자          |
| updated_time | DATETIME    |                                     | 수정일          |

### admin_committee_member

위원회 명단 테이블

| 컬럼명         | 타입         | 제약조건                            | 설명                      |
| -------------- | ------------ | ----------------------------------- | ------------------------- |
| seq            | BIGINT       | PK, AUTO_INCREMENT                  | 위원회 명단 일련번호      |
| committee_name | VARCHAR(10)  | NOT NULL                            | 위원 이름                 |
| committee_type | VARCHAR(10)  | NOT NULL, INDEX                     | 구분 (CA001: 위원장/위원) |
| remarks        | VARCHAR(500) |                                     | 비고                      |
| created_by     | BIGINT       | NOT NULL                            | 생성자                    |
| created_time   | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                    |
| updated_by     | BIGINT       |                                     | 수정자                    |
| updated_time   | DATETIME     |                                     | 수정일                    |

---

## LTIS 연동

### ltis_status

LTIS 리스트 입력 정보 테이블

| 컬럼명             | 타입         | 제약조건                            | 설명                       |
| ------------------ | ------------ | ----------------------------------- | -------------------------- |
| judg_seq           | BIGINT       | PK                                  | 재결일련번호               |
| judg_div_cd        | VARCHAR(100) | NOT NULL                            | 재결구분코드               |
| judg_div_nm        | VARCHAR(100) | NOT NULL                            | 재결구분코드명             |
| stat_cd            | VARCHAR(100) | NOT NULL                            | 처리상태코드               |
| stat_nm            | VARCHAR(100) | NOT NULL                            | 처리상태코드명             |
| use_yn             | VARCHAR(10)  | NOT NULL                            | 사용유무                   |
| bef_case_judg_seq  | BIGINT       |                                     | 이전 재결일련번호          |
| rept_mod_dt        | DATE         |                                     | 조서정보최종수정일시       |
| owner_mod_dt       | DATE         |                                     | 소유자정보최종수정일시     |
| rept_owner_mod_dt  | DATE         |                                     | 조서소유자정보최종수정일시 |
| recm_mod_dt        | DATE         |                                     | 평가법인정보최종수정일시   |
| implementer_mod_dt | DATE         |                                     | 사업시행자정보최종수정일시 |
| ltis_mod_dt        | DATE         |                                     | LTIS 수정일                |
| created_time       | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                     |
| updated_time       | DATETIME     |                                     | 수정일                     |

### ltis_info

LTIS 세부 정보 테이블

| 컬럼명             | 타입         | 제약조건                            | 설명           |
| ------------------ | ------------ | ----------------------------------- | -------------- |
| judg_seq           | BIGINT       | PK                                  | 재결일련번호   |
| recep_dt           | DATE         | NOT NULL                            | 접수일         |
| judg_dt            | DATE         |                                     | 재결일         |
| implementer_dt     | DATE         |                                     | 시행자기준시점 |
| recm_req_prc_dt    | DATE         |                                     | 재결기준시점   |
| case_no            | VARCHAR(100) | NOT NULL                            | 사건번호       |
| case_title         | VARCHAR(100) | NOT NULL                            | 사건명         |
| desn_ins           | VARCHAR(100) | NOT NULL                            | 재결기관       |
| address            | VARCHAR(100) |                                     | 소재지         |
| dession_corp       | VARCHAR(255) |                                     | 수용재결법인   |
| corp_nm            | VARCHAR(255) |                                     | 협의법인       |
| implementer_biz_nm | VARCHAR(255) |                                     | 시행자명       |
| business_type      | VARCHAR(255) |                                     | 사업유형       |
| land_cnt           | INT(10)      |                                     | 필지수         |
| land_owner_cnt     | INT(10)      |                                     | 필지소유자수   |
| object_cnt         | INT(10)      |                                     | 지장물수       |
| object_owner_cnt   | INT(10)      |                                     | 지장물소유자수 |
| biz_oprt_price     | BIGINT       |                                     | 시행사금액     |
| frst_comp_amt_sum  | BIGINT       |                                     | A법인평가금액  |
| secd_comp_amt_sum  | BIGINT       |                                     | B법인평가금액  |
| created_time       | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일         |
| updated_time       | DATETIME     |                                     | 수정일         |

### ltis_charge

LTIS 담당자 정보 테이블

| 컬럼명            | 타입         | 제약조건                            | 설명                       |
| ----------------- | ------------ | ----------------------------------- | -------------------------- |
| judg_seq          | BIGINT       | PK                                  | 재결일련번호               |
| charge_nm         | VARCHAR(255) |                                     | 담당자 이름                |
| charge_id         | VARCHAR(255) |                                     | 담당자 Id                  |
| charge_email      | VARCHAR(255) |                                     | 담당자 Email               |
| implementer_nm    | VARCHAR(255) |                                     | 사업시행자 담당자          |
| implementer_tel   | VARCHAR(255) |                                     | 사업시행자 담당자 전화번호 |
| implementer_id    | VARCHAR(255) |                                     | 사업시행자 담당자 ID       |
| implementer_email | VARCHAR(255) |                                     | 사업시행자 담당자 Email    |
| implementer_phone | VARCHAR(50)  |                                     | 사업시행자휴대폰번호       |
| created_time      | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                     |
| updated_time      | DATETIME     |                                     | 수정일                     |

### ltis_ownr_info

소유자 정보 테이블

| 컬럼명            | 타입         | 제약조건                            | 설명                      |
| ----------------- | ------------ | ----------------------------------- | ------------------------- |
| ownr_seq          | BIGINT       | PK                                  | 소유자SEQ                 |
| judg_seq          | BIGINT       | PK                                  | 재결일련번호              |
| ownr_intr_nm      | VARCHAR(255) |                                     | 소유자관계인명            |
| ownr_intr_yn      | VARCHAR(255) |                                     | 소유자관계인여부          |
| delv_zip_no       | VARCHAR(255) |                                     | 송달우편번호              |
| delv_dtl_addr1    | VARCHAR(255) |                                     | 송달상세주소1             |
| delv_dtl_addr2    | VARCHAR(255) |                                     | 송달상세주소2             |
| depy_zip_no       | VARCHAR(255) |                                     | 대리인우편번호            |
| depy_dtl_addr1    | VARCHAR(255) |                                     | 대리인상세주소1           |
| depy_dtl_addr2    | VARCHAR(255) |                                     | 대리인상세주소2           |
| regt_no           | VARCHAR(255) |                                     | 등기번호                  |
| ownr_intr_rmk     | VARCHAR(255) |                                     | 소유자관계인비고          |
| regt_year         | VARCHAR(255) |                                     | 등기년도                  |
| bef_ownr_intr_seq | VARCHAR(255) |                                     | 이전소유자관계인일련번호  |
| represent_yn      | VARCHAR(255) |                                     | 대표 여부                 |
| agree_yn          | VARCHAR(255) |                                     | 동의 여부                 |
| add_dt1           | DATE         |                                     | 협의만료일,현금청산만료일 |
| add_dt2           | DATE         |                                     | 재결청구일                |
| add_dt3           | DATE         |                                     | 수용신청일                |
| ownr_intr_nm_seq  | BIGINT       |                                     | 소유자 동명이인 구분자    |
| mod_dt            | DATE         |                                     | 수정일시                  |
| created_time      | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                    |
| updated_time      | DATETIME     |                                     | 수정일                    |

### ltis_recm_info

평가법인정보 테이블

| 컬럼명           | 타입         | 제약조건                            | 설명               |
| ---------------- | ------------ | ----------------------------------- | ------------------ |
| recm_advc_seq    | BIGINT       | PK                                  | 추천상담일련번호   |
| judg_seq         | BIGINT       | PK                                  | 재결일련번호       |
| grp_div_cd       | VARCHAR(250) |                                     | 조구분코드         |
| comp_cd          | VARCHAR(250) |                                     | 법인코드           |
| comy_abbv        | VARCHAR(250) |                                     | 법인약어           |
| recm_req_dt      | DATE         |                                     | 추천의뢰 요청 일시 |
| recm_req_sbmt_dt | DATE         |                                     | 추천의뢰 제출 일시 |
| case_no          | VARCHAR(250) |                                     | 감정평가서 번호    |
| rwrd_prce        | BIGINT       |                                     | 보상가액           |
| recm_advc_rmk    | VARCHAR(250) |                                     | 추천상담 비고      |
| prce_dt          | DATE         |                                     | 가격시점           |
| prgs_stat_cd     | VARCHAR(250) |                                     | 진행상태코드       |
| appr_path        | VARCHAR(250) |                                     | 감정평가서경로     |
| appr_inst_info   | VARCHAR(250) |                                     | 평가기관정보       |
| ...              | ...          |                                     | (평가사 정보 등)   |
| created_time     | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일             |
| updated_time     | DATETIME     |                                     | 수정일             |

### ltis_rept_info

조서 정보 테이블

| 컬럼명              | 타입           | 제약조건                            | 설명             |
| ------------------- | -------------- | ----------------------------------- | ---------------- |
| rept_seq            | BIGINT         | PK                                  | 조서일련번호     |
| judg_seq            | BIGINT         | PK                                  | 재결일련번호     |
| rept_lst_seq        | BIGINT         | PK                                  | 조서목록일련번호 |
| sido_gungu_cd       | VARCHAR(255)   |                                     | 시군구코드       |
| domyri_cd           | VARCHAR(255)   |                                     | 동면리코드       |
| mont_div_cd         | VARCHAR(255)   |                                     | 산구분코드       |
| main_strt_no        | VARCHAR(255)   |                                     | 본번             |
| sub_strt_no         | VARCHAR(255)   |                                     | 부번             |
| rept_addr           | VARCHAR(255)   |                                     | 조서주소         |
| area_amot           | DECIMAL(23, 4) |                                     | 면적및수량       |
| obst_kind_nm        | VARCHAR(255)   |                                     | 지장물종류명     |
| bef_unit_cost       | BIGINT         |                                     | 이전단가         |
| frst_comp_unit_cost | BIGINT         |                                     | 법인A단가        |
| secd_comp_unit_cost | BIGINT         |                                     | 법인B단가        |
| judg_unit_cost      | BIGINT         |                                     | 재결단가         |
| ...                 | ...            |                                     | (기타 조서 정보) |
| created_time        | DATETIME       | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일           |
| updated_time        | DATETIME       |                                     | 수정일           |

### ltis_rept_ownr_info

조서소유자맵핑정보 테이블

| 컬럼명             | 타입         | 제약조건                            | 설명                     |
| ------------------ | ------------ | ----------------------------------- | ------------------------ |
| rept_ownr_intr_seq | BIGINT       | PK                                  | 조서관계인소유자일련번호 |
| rept_seq           | BIGINT       | PK                                  | 조서일련번호             |
| judg_seq           | BIGINT       | PK                                  | 재결일련번호             |
| ownr_intr_yn       | VARCHAR(255) |                                     | 소유자관계인여부         |
| ownr_seq           | BIGINT       |                                     | 소유자일련번호           |
| intr_seq           | BIGINT       |                                     | 관계인일련번호           |
| land_shre          | VARCHAR(255) |                                     | 지분                     |
| bef_amt            | BIGINT       |                                     | 이전금액                 |
| frst_comp_amt      | BIGINT       |                                     | 법인A금액                |
| secd_comp_amt      | BIGINT       |                                     | 법인B금액                |
| judg_amt           | BIGINT       |                                     | 재결금액                 |
| ...                | ...          |                                     | (기타 매핑 정보)         |
| created_time       | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                   |
| updated_time       | DATETIME     |                                     | 수정일                   |

### ltis_pnu

PNU 테이블

| 컬럼명        | 타입         | 제약조건                            | 설명         |
| ------------- | ------------ | ----------------------------------- | ------------ |
| judg_seq      | BIGINT       | PK, FK(ltis_status)                 | 재결일련번호 |
| pnu           | VARCHAR(20)  | PK                                  | PNU          |
| sido_gungu_cd | VARCHAR(5)   | NOT NULL                            | 시군구코드   |
| domyri_cd     | VARCHAR(5)   | NOT NULL                            | 동면리코드   |
| mont_div_cd   | VARCHAR(1)   | NOT NULL                            | 산구분코드   |
| main_strt_no  | VARCHAR(4)   | NOT NULL                            | 본번         |
| sub_strt_no   | VARCHAR(4)   | NOT NULL                            | 부번         |
| addr          | VARCHAR(150) | NOT NULL                            | 조서주소     |
| created_time  | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 등록일자     |
| updated_time  | DATETIME     |                                     | 수정일자     |

### ltis_tmp

LTIS 통합 임시 테이블

- LTIS 전체 데이터를 통합한 임시 테이블
- 조회 성능 향상을 위한 비정규화 테이블

---

## 파일 관리

### file

파일 테이블

| 컬럼명             | 타입         | 제약조건                            | 설명             |
| ------------------ | ------------ | ----------------------------------- | ---------------- |
| seq                | BIGINT       | PK, AUTO_INCREMENT                  | 일련번호         |
| file_path          | VARCHAR(200) | NOT NULL                            | 파일 경로        |
| original_file_name | VARCHAR(200) | NOT NULL                            | 원본 파일 이름   |
| changed_file_name  | VARCHAR(200) | NOT NULL                            | 변경된 파일 이름 |
| created_by         | BIGINT       | NOT NULL                            | 등록자           |
| created_time       | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일           |
| updated_by         | BIGINT       |                                     | 수정자           |
| updated_time       | DATETIME     |                                     | 수정일           |

### file_pdf_image

PDF 이미지 정보 테이블

| 컬럼명         | 타입     | 제약조건                            | 설명             |
| -------------- | -------- | ----------------------------------- | ---------------- |
| judg_seq       | BIGINT   | PK, FK(ltis_status)                 | 재결 일련 번호   |
| image_file_seq | BIGINT   | PK, FK(file)                        | 파일 일련 번호   |
| max_length     | INT      | NOT NULL                            | 생성된 이미지 수 |
| created_by     | BIGINT   | NOT NULL                            | 등록자           |
| created_time   | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일           |
| updated_by     | BIGINT   |                                     | 수정자           |
| updated_time   | DATETIME |                                     | 수정일           |

---

## 재결 접수

### receipt_status

재결접수 상태 테이블

| 컬럼명       | 타입        | 제약조건                            | 설명                   |
| ------------ | ----------- | ----------------------------------- | ---------------------- |
| judg_seq     | BIGINT      | PK, FK(ltis_status)                 | 재결 일련번호          |
| status_code  | VARCHAR(10) | NOT NULL                            | 진행 상태 코드 [CR001] |
| created_by   | BIGINT      | NOT NULL                            | 등록자                 |
| created_time | DATETIME    | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                 |
| updated_by   | BIGINT      |                                     | 수정자                 |
| updated_time | DATETIME    |                                     | 수정일                 |

**CR001 진행 상태:**

1. CR001001: 접수 기본 정보 등록
2. CR001002: 총물량조서 등록
3. CR001003: 협의감정평가정보 등록
4. CR001004: 첨부파일 등록
5. CR001006: 열람공고결과 등록
6. CR001007: 의견작성
7. CR001008: 심의요청

### receipt_business_info

재결접수 사업 개요 테이블

| 컬럼명          | 타입         | 제약조건                            | 설명          |
| --------------- | ------------ | ----------------------------------- | ------------- |
| judg_seq        | BIGINT       | PK, FK(ltis_status)                 | 재결 일련번호 |
| scale           | VARCHAR(100) | NOT NULL                            | 규모          |
| business_period | VARCHAR(100) | NOT NULL                            | 사업기간      |
| request_reason  | VARCHAR(100) | NOT NULL                            | 신청사유      |
| created_by      | BIGINT       | NOT NULL                            | 등록자        |
| created_time    | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일        |
| updated_by      | BIGINT       |                                     | 수정자        |
| updated_time    | DATETIME     |                                     | 수정일        |

### receipt_quantity_report

재결접수 총물량조서 테이블

| 컬럼명       | 타입           | 제약조건                            | 설명                      |
| ------------ | -------------- | ----------------------------------- | ------------------------- |
| judg_seq     | BIGINT         | PK, FK(ltis_status)                 | 재결 일련번호             |
| land_cnt     | BIGINT         | NOT NULL, DEFAULT 0                 | 협의취득 필건(토지)       |
| obj_cnt      | BIGINT         | NOT NULL, DEFAULT 0                 | 협의취득 필건(물건)       |
| goodwill_cnt | BIGINT         | NOT NULL, DEFAULT 0                 | 협의취득 필건(영업권)     |
| etc_cnt      | BIGINT         | NOT NULL, DEFAULT 0                 | 협의취득 필건(기타)       |
| land_area    | DECIMAL(10, 3) | NOT NULL, DEFAULT 0                 | 협의취득 면적(토지)       |
| land_price   | BIGINT         | NOT NULL, DEFAULT 0                 | 협의취득 금액(토지)       |
| ...          | ...            |                                     | (재결신청, 총보상대상 등) |
| created_by   | BIGINT         | NOT NULL                            | 등록자                    |
| created_time | DATETIME       | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                    |
| updated_by   | BIGINT         |                                     | 수정자                    |
| updated_time | DATETIME       |                                     | 수정일                    |

### receipt_business_recognition

재결접수 사업인정관계(도시계획) 테이블

| 컬럼명       | 타입         | 제약조건                            | 설명                  |
| ------------ | ------------ | ----------------------------------- | --------------------- |
| seq          | BIGINT       | PK, AUTO_INCREMENT                  | 사업인정관계 일련번호 |
| judg_seq     | BIGINT       | FK(ltis_status), NOT NULL           | 재결 일련번호         |
| title        | VARCHAR(100) | NOT NULL                            | 사업인정관계 제목     |
| content      | VARCHAR(200) | NOT NULL                            | 사업인정관계 내용     |
| created_by   | BIGINT       | NOT NULL                            | 등록자                |
| created_time | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                |
| updated_by   | BIGINT       |                                     | 수정자                |
| updated_time | DATETIME     |                                     | 수정일                |

### receipt_agreement_date

협의 날짜 테이블

| 컬럼명       | 타입         | 제약조건                            | 설명              |
| ------------ | ------------ | ----------------------------------- | ----------------- |
| seq          | BIGINT       | PK, AUTO_INCREMENT                  | 합의내용 일련번호 |
| judg_seq     | BIGINT       | FK(ltis_status), NOT NULL           | 재결 일련번호     |
| agreed_date  | DATE         | NOT NULL                            | 협의 날짜         |
| agreed_desc  | VARCHAR(200) |                                     | 협의 내용         |
| created_by   | BIGINT       | NOT NULL                            | 등록자            |
| created_time | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일            |
| updated_by   | BIGINT       |                                     | 수정자            |
| updated_time | DATETIME     |                                     | 수정일            |

### receipt_attachment

사업시행자 사건 접수 첨부 파일 테이블

| 컬럼명               | 타입        | 제약조건                            | 설명                  |
| -------------------- | ----------- | ----------------------------------- | --------------------- |
| seq                  | BIGINT      | PK, AUTO_INCREMENT                  | 일련번호              |
| judg_seq             | BIGINT      | FK(ltis_status), NOT NULL           | 재결 일련번호         |
| attachment_type_code | VARCHAR(10) | NOT NULL                            | 파일 타입 코드[CR002] |
| attachment_order     | INT         | NOT NULL                            | 정렬 순서             |
| attachment_file_seq  | BIGINT      | FK(file), NOT NULL                  | 첨부파일 일련번호     |
| created_by           | BIGINT      | NOT NULL                            | 등록자                |
| created_time         | DATETIME    | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                |
| updated_by           | BIGINT      |                                     | 수정자                |
| updated_time         | DATETIME    |                                     | 수정일                |

**CR002 첨부파일 유형 (27종):**

- 적정성 검토서, 신청 문서(공문), 재결 신청서, 재결신청 청구서
- 사업계획서, 구역결정고시문, 사업시행실시계획인가
- 소유자별서류: 토지조서, 물건조서, 협의 경위서, 등기사항전부증명서 등
- 협의관계서류: 보상계획공고, 손실보상 협의 요청문서 등

### receipt_previous_appraisal

협의 감정평가 정보 테이블

| 컬럼명                              | 타입          | 제약조건                            | 설명                         |
| ----------------------------------- | ------------- | ----------------------------------- | ---------------------------- |
| seq                                 | BIGINT        | PK, AUTO_INCREMENT                  | 협의 감정평가 정보 일련번호  |
| judg_seq                            | BIGINT        | FK(ltis_status), UNIQUE, NOT NULL   | 재결 일련번호                |
| governor_recommendation             | BOOLEAN       | NOT NULL                            | 시도지사 추천여부            |
| optional_implementer_recommendation | BOOLEAN       | NOT NULL                            | 사업시행자 추천 추가 여부    |
| optional_land_owner_recommendation  | BOOLEAN       | NOT NULL                            | 토지소유자 추천 추가 여부    |
| governor_not_recommendation         | VARCHAR(4000) |                                     | 시도지사 추천 하지 않는 이유 |
| created_by                          | BIGINT        | NOT NULL                            | 등록자                       |
| created_time                        | DATETIME      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                       |
| updated_by                          | BIGINT        |                                     | 수정자                       |
| updated_time                        | DATETIME      |                                     | 수정일                       |

### receipt_previous_appraisal_recommend

협의 감정평가 추천 정보 테이블

| 컬럼명                         | 타입         | 제약조건                            | 설명                        |
| ------------------------------ | ------------ | ----------------------------------- | --------------------------- |
| receipt_previous_appraisal_seq | BIGINT       | PK, FK(receipt_previous_appraisal)  | 협의 감정평가 정보 일련번호 |
| recommend_type_code            | VARCHAR(100) | PK                                  | 추천 유형 코드[CR003]       |
| recommend_corporation_name     | VARCHAR(100) | NOT NULL                            | 법인명                      |
| recommend_price                | BIGINT       | NOT NULL                            | 추천 금액                   |
| recommend_file_seq             | BIGINT       | NOT NULL                            | 감정평가서 파일 일련번호    |
| created_by                     | BIGINT       | NOT NULL                            | 등록자                      |
| created_time                   | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                      |
| updated_by                     | BIGINT       |                                     | 수정자                      |
| updated_time                   | DATETIME     |                                     | 수정일                      |

**CR003 추천 유형:**

- CR003001: 사업시행자 추천
- CR003002: 시도지사 추천
- CR003003: 토지 소유자 추천
- CR003004: 추가 사업시행자 소유자 추천

### receipt_previous_appraisal_attachment

협의 공고 파일 테이블

| 컬럼명                       | 타입        | 제약조건                            | 설명                  |
| ---------------------------- | ----------- | ----------------------------------- | --------------------- |
| judg_seq                     | BIGINT      | FK(ltis_status), NOT NULL           | 재결 일련번호         |
| previous_appraisal_type_code | VARCHAR(10) | NOT NULL                            | 파일 타입 코드[CR004] |
| previous_appraisal_file_seq  | BIGINT      | FK(file), NOT NULL                  | 파일 일련번호         |
| created_by                   | BIGINT      | NOT NULL                            | 등록자                |
| created_time                 | DATETIME    | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                |
| updated_by                   | BIGINT      |                                     | 수정자                |
| updated_time                 | DATETIME    |                                     | 수정일                |

**CR004 파일 타입:**

- CR004001: 공고문
- CR004002: 의뢰 공문
- CR004003: 회신 공문

---

## 의견 관리

### opinion_template

의견 템플릿 테이블

| 컬럼명               | 타입         | 제약조건                            | 설명                 |
| -------------------- | ------------ | ----------------------------------- | -------------------- |
| seq                  | BIGINT       | PK                                  | 템플릿 번호          |
| template_name        | VARCHAR(200) | NOT NULL                            | 템플릿 이름          |
| template_order       | INT          | NOT NULL                            | 템플릿 순번          |
| template_description | VARCHAR(400) |                                     | 템플릿 설명          |
| template_file_seq    | BIGINT       |                                     | 템플릿 파일 일련번호 |
| template_required    | TINYINT(1)   |                                     | 필수 여부            |
| created_by           | BIGINT       | NOT NULL                            | 등록자               |
| created_time         | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일               |
| updated_by           | BIGINT       |                                     | 수정자               |
| updated_time         | DATETIME     |                                     | 수정일               |

**등록된 템플릿 (23종):**

1. 지연가산금(재결신청 청구)
2. 보상금 증액 (감정평가 검토)
3. 협의 절차 미이행
4. 사업폐지
5. 재결 보류
6. 무허가건물 부지면적 보상
7. 잔여지/잔여건물 가치 하락
8. 잔여지/잔여건물 매수 청구
9. 사도(사실상 사도)평가 적정성
10. 일단지 보상
11. 미지급 용지
12. 영업보상(이전비)
13. 누락 물건 반영
14. 폐업 보상
15. 영농손실보상
16. 휴직(실직)보상
17. 이주대책 수립
18. 이주정착금, 주거이전비, 이사비
19. 구분지상권
20. 10% 변동 내역
21. 대토 보상
22. 권리금 적정성
23. 감정평가법인 선정 위법성
24. 기타 의견
25. 의견 없음

### opinion_case_template

의견 마스터 테이블

| 컬럼명               | 타입     | 제약조건                                                          | 설명                   |
| -------------------- | -------- | ----------------------------------------------------------------- | ---------------------- |
| seq                  | BIGINT   | PK, AUTO_INCREMENT                                                | 일련번호               |
| judg_seq             | BIGINT   | FK(ltis_status), UNIQUE(judg_seq, opinion_template_seq), NOT NULL | 재결 일련번호          |
| opinion_template_seq | BIGINT   | FK(opinion_template), NOT NULL                                    | 사건 템플릿 일련번호   |
| opinion_file_seq     | BIGINT   | FK(file)                                                          | 의견 첨부파일 일련번호 |
| created_by           | BIGINT   | NOT NULL                                                          | 등록자                 |
| created_time         | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP                               | 생성일                 |
| updated_by           | BIGINT   |                                                                   | 수정자                 |
| updated_time         | DATETIME |                                                                   | 수정일                 |

### opinion_case_comment

템플릿별 의견 정보 테이블

| 컬럼명                     | 타입     | 제약조건                            | 설명            |
| -------------------------- | -------- | ----------------------------------- | --------------- |
| opinion_case_template_seq  | BIGINT   | FK(opinion_case_template)           | 의견 일련번호   |
| judg_target                | TEXT     | NOT NULL                            | 소유자          |
| implementer_comment        | TEXT     | NOT NULL                            | 사업시행자 의견 |
| owner_comment              | TEXT     | NOT NULL                            | 소유자 의견     |
| opinion_case_comment_order | BIGINT   | NOT NULL                            | 정렬 순서       |
| created_by                 | BIGINT   | NOT NULL                            | 등록자          |
| created_time               | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일          |
| updated_by                 | BIGINT   |                                     | 수정자          |
| updated_time               | DATETIME |                                     | 수정일          |

---

## 열람공고

### notice_info

열람공고 테이블

| 컬럼명             | 타입         | 제약조건                            | 설명          |
| ------------------ | ------------ | ----------------------------------- | ------------- |
| seq                | BIGINT       | PK, AUTO_INCREMENT                  | 일련번호      |
| judg_seq           | BIGINT       | FK(ltis_status), UNIQUE, NOT NULL   | 재결 일련번호 |
| document_number    | VARCHAR(100) |                                     | 의뢰문서번호  |
| document_title     | VARCHAR(500) |                                     | 문서제목      |
| receiver           | VARCHAR(50)  |                                     | 수신처        |
| request_start_date | DATE         |                                     | 의뢰시작일    |
| request_end_date   | DATE         |                                     | 의뢰마감일    |
| notice_start_date  | DATE         |                                     | 열람시작일    |
| notice_end_date    | DATE         |                                     | 열람만료일    |
| newsletter_date    | DATE         |                                     | 회보일        |
| created_by         | BIGINT       | NOT NULL                            | 등록자        |
| created_time       | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일        |
| updated_by         | BIGINT       |                                     | 수정자        |
| updated_time       | DATETIME     |                                     | 수정일        |

### notice_attachment

열람공고 첨부 파일 테이블

| 컬럼명                        | 타입         | 제약조건                            | 설명                   |
| ----------------------------- | ------------ | ----------------------------------- | ---------------------- |
| seq                           | BIGINT       | PK, AUTO_INCREMENT                  | 일련번호               |
| notice_info_seq               | BIGINT       | FK(notice_info), NOT NULL           | 재결 일련번호          |
| notice_attachment_type_code   | VARCHAR(10)  | NOT NULL                            | 파일 타입 코드[CN001]  |
| notice_attachment_order       | INT          | NOT NULL                            | 정렬 순서              |
| notice_attachment_file_seq    | BIGINT       | FK(file), NOT NULL                  | 열람공고 파일 일련번호 |
| notice_attachment_description | VARCHAR(100) |                                     | 열람공고 파일 설명     |
| parent_notice_attachment_seq  | BIGINT       |                                     | 상위 일련번호          |
| created_by                    | BIGINT       | NOT NULL                            | 등록자                 |
| created_time                  | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                 |
| updated_by                    | BIGINT       |                                     | 수정자                 |
| updated_time                  | DATETIME     |                                     | 수정일                 |

**CN001 파일 타입:**

- CN001001: 열람공고 회보공문
- CN001002: 열람공고 공고문
- CN001003: 열람공고 등기송달증빙
- CN001004: 열람공고 소유자의견

---

## 검토 관리

### conclusion_status

검토 마스터 테이블

| 컬럼명       | 타입        | 제약조건                            | 설명                  |
| ------------ | ----------- | ----------------------------------- | --------------------- |
| seq          | BIGINT      | PK, AUTO_INCREMENT                  | 검토 일련번호         |
| judg_seq     | BIGINT      | FK(ltis_status), UNIQUE, NOT NULL   | 재결 일련번호         |
| status_code  | VARCHAR(10) | NOT NULL                            | 검토 상태 코드(CC001) |
| created_by   | BIGINT      | NOT NULL                            | 등록자                |
| created_time | DATETIME    | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                |
| updated_by   | BIGINT      |                                     | 수정자                |
| updated_time | DATETIME    |                                     | 수정일                |

**CC001 검토 상태:**

- CC001001: 검토 시작
- CC001002: 검토 완료
- CC001003: 안건 상정
- CC001004: 보류 (심의 일자, 그룹 수정가능)

### conclusion_content

검토 의견 테이블

| 컬럼명                      | 타입     | 제약조건                            | 설명                           |
| --------------------------- | -------- | ----------------------------------- | ------------------------------ |
| conclusion_status_seq       | BIGINT   | PK, FK(conclusion_status)           | 검토 마스터 일련번호           |
| opinion_template_seq        | BIGINT   | PK, FK(opinion_template)            | 의견 템플릿 일련번호           |
| decree_content              | TEXT     |                                     | 법령 내용                      |
| precedent_content           | TEXT     |                                     | 판례 내용                      |
| opinion_content             | TEXT     | NOT NULL                            | 검토의견 내용                  |
| conclusion_file_seq         | BIGINT   | FK(file)                            | 재결관 의견 첨부파일           |
| conclusion_file_page_length | INT      |                                     | 재결관 의견 첨부파일 페이지 수 |
| created_by                  | BIGINT   | NOT NULL                            | 등록자                         |
| created_time                | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                         |
| updated_by                  | BIGINT   |                                     | 수정자                         |
| updated_time                | DATETIME |                                     | 수정일                         |

### conclusion_bookmark

검토 의견 북마크 테이블

| 컬럼명                         | 타입         | 제약조건                            | 설명                 |
| ------------------------------ | ------------ | ----------------------------------- | -------------------- |
| seq                            | BIGINT       | PK, AUTO_INCREMENT                  | 북마크 일련번호      |
| conclusion_status_seq          | BIGINT       | NOT NULL                            | 검토 마스터 일련번호 |
| opinion_template_seq           | BIGINT       | NOT NULL                            | 의견 템플릿 일련번호 |
| bookmark_number                | INT          | NOT NULL                            | 북마크 번호          |
| bookmark_name                  | VARCHAR(100) | NOT NULL                            | 북마크 이름          |
| depth                          | INT          | NOT NULL                            | 깊이                 |
| parent_conclusion_bookmark_seq | BIGINT       |                                     | 부모 북마크 일련번호 |
| created_by                     | BIGINT       | NOT NULL                            | 등록자               |
| created_time                   | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일               |

---

## 심의 관리

### system_deliberation_date

심의일자 테이블

| 컬럼명         | 타입     | 제약조건                            | 설명              |
| -------------- | -------- | ----------------------------------- | ----------------- |
| seq            | BIGINT   | PK, AUTO_INCREMENT                  | 심의일자 일련번호 |
| scheduled_date | DATE     | UNIQUE, NOT NULL                    | 심의일자          |
| created_by     | BIGINT   | NOT NULL                            | 등록자            |
| created_time   | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일            |
| updated_by     | BIGINT   |                                     | 수정자            |
| updated_time   | DATETIME |                                     | 수정일            |

### system_deliberation_group

심의그룹 테이블

| 컬럼명       | 타입        | 제약조건                            | 설명              |
| ------------ | ----------- | ----------------------------------- | ----------------- |
| seq          | BIGINT      | PK, AUTO_INCREMENT                  | 심의그룹 일련번호 |
| group_name   | VARCHAR(10) | UNIQUE, NOT NULL                    | 심의그룹 이름     |
| created_by   | BIGINT      | NOT NULL                            | 등록자            |
| created_time | DATETIME    | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일            |
| updated_by   | BIGINT      |                                     | 수정자            |
| updated_time | DATETIME    |                                     | 수정일            |

### deliberation_status

심의 상태 테이블

| 컬럼명                | 타입     | 제약조건                                                | 설명                      |
| --------------------- | -------- | ------------------------------------------------------- | ------------------------- |
| seq                   | BIGINT   | PK, AUTO_INCREMENT                                      | 심의 일련번호             |
| schedule_date_seq     | BIGINT   | UNIQUE(schedule_date_seq, schedule_group_seq), NOT NULL | 심의 일자 일련번호        |
| schedule_group_seq    | BIGINT   | NOT NULL                                                | 심의 그룹 일련번호        |
| deliberation_file_seq | BIGINT   |                                                         | 전체 심의서 파일 일련번호 |
| created_time          | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP                     | 생성일                    |
| created_by            | BIGINT   | NOT NULL                                                | 등록자                    |
| updated_time          | DATETIME |                                                         | 수정일                    |
| updated_by            | BIGINT   |                                                         | 수정자                    |

### deliberation_target

심의 대상 테이블

| 컬럼명                  | 타입     | 제약조건                            | 설명               |
| ----------------------- | -------- | ----------------------------------- | ------------------ |
| deliberation_status_seq | BIGINT   | PK, FK(deliberation_status)         | 심의 상태 일련번호 |
| judg_seq                | BIGINT   | PK, UNIQUE                          | 재결 일련번호      |
| target_order            | INT      | DEFAULT 0                           | 순번               |
| created_time            | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일             |
| created_by              | BIGINT   | NOT NULL                            | 등록자             |
| updated_time            | DATETIME |                                     | 수정일             |
| updated_by              | BIGINT   |                                     | 수정자             |

---

## 참고자료 관리

### reference_decree

법령 테이블

| 컬럼명               | 타입     | 제약조건                            | 설명                  |
| -------------------- | -------- | ----------------------------------- | --------------------- |
| seq                  | BIGINT   | PK, AUTO_INCREMENT                  | 법령 일련번호         |
| decree_name          | TEXT     |                                     | 법령명                |
| decree_memo          | TEXT     |                                     | 비고                  |
| decree_category_code | TEXT     |                                     | 법령 분류 코드[CD001] |
| del_check            | BIGINT   | NOT NULL, DEFAULT 0                 | 삭제여부              |
| created_by           | BIGINT   | NOT NULL                            | 등록자                |
| created_time         | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                |
| updated_by           | BIGINT   |                                     | 수정자                |
| updated_time         | DATETIME |                                     | 수정일                |

**CD001 법령 분류:**

- CD001001: 법률
- CD001002: 시행령
- CD001003: 시행규칙

### reference_decree_detail

각 법령별 조문 및 본문 테이블

| 컬럼명         | 타입     | 제약조건                            | 설명                  |
| -------------- | -------- | ----------------------------------- | --------------------- |
| seq            | BIGINT   | PK, AUTO_INCREMENT                  | 각 조문 고유 일련번호 |
| decree_seq     | BIGINT   | FK(reference_decree), NOT NULL      | 법령 일련번호         |
| article_no     | TEXT     | NOT NULL                            | 해당 조문             |
| decree_content | TEXT     |                                     | 조문 전체 본문        |
| del_check      | BIGINT   | NOT NULL, DEFAULT 0                 | 삭제여부              |
| ref_count      | BIGINT   | DEFAULT 0                           | 참조 횟수             |
| view_count     | BIGINT   | DEFAULT 0                           | 조회수                |
| created_by     | BIGINT   | NOT NULL                            | 등록자                |
| created_time   | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                |
| updated_by     | BIGINT   |                                     | 수정자                |
| updated_time   | DATETIME |                                     | 수정일                |

### reference_precedent

판례 참고 사건 테이블

| 컬럼명              | 타입         | 제약조건                            | 설명                      |
| ------------------- | ------------ | ----------------------------------- | ------------------------- |
| seq                 | BIGINT       | PK, AUTO_INCREMENT                  | 판례 참고 사건의 일련번호 |
| judg_seq            | BIGINT       | NOT NULL                            | 재결 일련번호             |
| template_seq_no     | BIGINT       | FK(opinion_template), NOT NULL      | 의견 템플릿 일련번호      |
| case_no             | VARCHAR(100) |                                     | 사건번호                  |
| case_title          | VARCHAR(100) |                                     | 사업명                    |
| deliberation_period | VARCHAR(100) |                                     | 심의 기간                 |
| deliberation_date   | DATE         |                                     | 심의일                    |
| precedent_case_no   | VARCHAR(100) |                                     | 법원사건번호              |
| court_name          | VARCHAR(100) |                                     | 법원명                    |
| precedent_content   | TEXT         |                                     | 판례 내용                 |
| ref_count           | BIGINT       | DEFAULT 0                           | 참조 횟수                 |
| view_count          | BIGINT       | DEFAULT 0                           | 조회수                    |
| del_check           | BIGINT       | NOT NULL, DEFAULT 0                 | 삭제여부                  |
| created_by          | BIGINT       | NOT NULL                            | 등록자                    |
| created_time        | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                    |
| updated_by          | BIGINT       |                                     | 수정자                    |
| updated_time        | DATETIME     |                                     | 수정일                    |

### reference_conclusion_opinion

재결관 의견 테이블

| 컬럼명                     | 타입         | 제약조건                            | 설명                 |
| -------------------------- | ------------ | ----------------------------------- | -------------------- |
| seq                        | BIGINT       | PK, AUTO_INCREMENT                  | 재결관 의견 일련번호 |
| judg_seq                   | BIGINT       | NOT NULL                            | 재결 일련번호        |
| template_seq_no            | BIGINT       | FK(opinion_template), NOT NULL      | 의견 템플릿 일련번호 |
| deliberation_period        | VARCHAR(100) |                                     | 심의 차수            |
| deliberation_date          | VARCHAR(100) |                                     | 심의일자             |
| conclusion_opinion_content | TEXT         | NOT NULL                            | 재결관 의견 내용     |
| ref_count                  | BIGINT       | DEFAULT 0                           | 참조 횟수            |
| view_count                 | BIGINT       | DEFAULT 0                           | 조회수               |
| created_by                 | BIGINT       | NOT NULL                            | 등록자               |
| created_time               | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일               |
| updated_by                 | BIGINT       |                                     | 수정자               |
| updated_time               | DATETIME     |                                     | 수정일               |

---

## 공시지가 관리

### kapa_standard_price

표준지 공시지가 테이블

| 컬럼명       | 타입         | 제약조건                            | 설명            |
| ------------ | ------------ | ----------------------------------- | --------------- |
| seq_no       | BIGINT       | NOT NULL                            | 일련번호        |
| c_year       | VARCHAR(50)  | PK                                  | 기준년도        |
| s_pnu        | VARCHAR(100) | PK                                  | PNU             |
| s_reg        | VARCHAR(50)  |                                     | 시군구(최신)    |
| s_eub        | VARCHAR(50)  |                                     | 읍면동(최신)    |
| s_san        | VARCHAR(50)  |                                     | 산구분(최신)    |
| s_bun1       | VARCHAR(50)  |                                     | 본번(최신)      |
| s_bun2       | VARCHAR(50)  |                                     | 부번(최신)      |
| eub_name     | VARCHAR(100) |                                     | 읍면동 한글명   |
| jibun        | VARCHAR(100) |                                     | 지번(본번+부번) |
| gimok1       | VARCHAR(50)  |                                     | 공부지목        |
| gimok2       | VARCHAR(50)  |                                     | 실제지목        |
| giyuk1       | VARCHAR(50)  |                                     | 용도지역1       |
| youngdo1     | VARCHAR(50)  |                                     | 이용상황        |
| area         | VARCHAR(50)  |                                     | 면적            |
| gakukc       | VARCHAR(50)  |                                     | 공시지가        |
| gakuk1       | VARCHAR(50)  |                                     | 1년전공시지가   |
| gakuk2       | VARCHAR(50)  |                                     | 2년전공시지가   |
| gakuk3       | VARCHAR(50)  |                                     | 3년전공시지가   |
| gakuk4       | VARCHAR(50)  |                                     | 4년전공시지가   |
| tm_x         | VARCHAR(50)  |                                     | TM x좌표        |
| tm_y         | VARCHAR(50)  |                                     | TM y좌표        |
| wgs84_x      | VARCHAR(50)  |                                     | WGS84 x좌표     |
| wgs84_y      | VARCHAR(50)  |                                     | WGS84 y좌표     |
| use_yn       | VARCHAR(1)   |                                     | 사용여부        |
| created_time | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일          |

### kapa_standard_price_tmp

표준지 공시지가 API 호출 임시 테이블

| 컬럼명          | 타입        | 제약조건 | 설명            |
| --------------- | ----------- | -------- | --------------- |
| c_year          | VARCHAR(50) | PK       | 기준년도        |
| s_reg           | VARCHAR(50) | PK       | 시군구          |
| standard_seq_no | BIGINT      | PK       | 표준지 일련번호 |

### kapa_official_price

공시지가 테이블

| 컬럼명          | 타입           | 제약조건                            | 설명             |
| --------------- | -------------- | ----------------------------------- | ---------------- |
| c_year          | VARCHAR(50)    | PK                                  | 기준년도         |
| pnu             | VARCHAR(20)    | PK                                  | PNU              |
| standard_seq_no | BIGINT         |                                     | 표준지 일련번호  |
| reg             | VARCHAR(5)     |                                     | 시군구           |
| eub             | VARCHAR(5)     |                                     | 읍면동           |
| san             | VARCHAR(1)     |                                     | 산구분           |
| bun1            | VARCHAR(4)     |                                     | 본번             |
| bun2            | VARCHAR(4)     |                                     | 부번             |
| as1             | VARCHAR(50)    |                                     | 시도명           |
| eub_name        | VARCHAR(100)   |                                     | 읍면동명         |
| jibun           | VARCHAR(100)   |                                     | 지번(본번+부번)  |
| area            | DECIMAL(10, 1) |                                     | 면적             |
| gakuka          | BIGINT         |                                     | 공시가격         |
| gimok           | VARCHAR(5)     |                                     | 지목             |
| youngdo         | VARCHAR(5)     |                                     | 이용상황         |
| giyuk           | VARCHAR(5)     |                                     | 용도지역         |
| ...             | ...            |                                     | (기타 속성 정보) |
| use_yn          | VARCHAR(1)     | NOT NULL                            | 사용여부         |
| created_time    | DATETIME       | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일           |

### kapa_official_price_tmp

공시지가 API 호출 임시 테이블

| 컬럼명 | 타입        | 제약조건 | 설명     |
| ------ | ----------- | -------- | -------- |
| c_year | VARCHAR(50) | PK       | 기준년도 |
| pnu    | VARCHAR(20) | PK       | PNU      |

---

## 게시판

### board_content

게시글 테이블

| 컬럼명              | 타입         | 제약조건                            | 설명                   |
| ------------------- | ------------ | ----------------------------------- | ---------------------- |
| seq                 | BIGINT       | PK, AUTO_INCREMENT                  | 게시글 일련번호        |
| board_category_code | VARCHAR(10)  | NOT NULL                            | 게시글 분류코드(CB001) |
| title               | VARCHAR(500) |                                     | 제목                   |
| content             | TEXT         |                                     | 내용                   |
| reply_seq           | BIGINT       |                                     | 답변의 일련번호        |
| view_count          | BIGINT       | DEFAULT 0                           | 조회수                 |
| created_time        | DATETIME     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                 |
| created_by          | BIGINT       | NOT NULL                            | 등록자                 |
| updated_time        | DATETIME     |                                     | 수정일                 |
| updated_by          | BIGINT       |                                     | 수정자                 |

**CB001 게시판 분류:**

- CB001001: 송달 결과
- CB001002: 공지사항
- CB001003: 묻고 답하기

### board_question_answer_reply

게시글의 답글 테이블

| 컬럼명       | 타입     | 제약조건                            | 설명              |
| ------------ | -------- | ----------------------------------- | ----------------- |
| board_seq    | BIGINT   | PK                                  | 게시글의 일련번호 |
| reply        | TEXT     |                                     | 답변 내용         |
| created_time | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일            |
| created_by   | BIGINT   | NOT NULL                            | 등록자            |
| updated_time | DATETIME |                                     | 수정일            |
| updated_by   | BIGINT   |                                     | 수정자            |

### board_attachment

게시글 첨부파일 테이블

| 컬럼명                     | 타입        | 제약조건                            | 설명                      |
| -------------------------- | ----------- | ----------------------------------- | ------------------------- |
| seq                        | BIGINT      | PK, AUTO_INCREMENT                  | 일련번호                  |
| board_seq                  | BIGINT      | FK(board_content), NOT NULL         | 게시글 일련번호           |
| board_attachment_type_code | VARCHAR(10) | NOT NULL                            | 게시글 첨부파일 타입 코드 |
| board_attachment_file_seq  | BIGINT      | NOT NULL                            | 게시글 첨부파일 일련번호  |
| board_attachment_order     | BIGINT      | NOT NULL                            | 게시글 첨부파일 정렬순서  |
| created_time               | DATETIME    | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성일                    |
| created_by                 | BIGINT      | NOT NULL                            | 등록자                    |
| updated_time               | DATETIME    |                                     | 수정일                    |
| updated_by                 | BIGINT      |                                     | 수정자                    |

---

## ERD 관계도

### 핵심 데이터 흐름

```
LTIS 시스템
    ↓
ltis_status (재결 마스터)
    ├─→ ltis_info (세부정보)
    ├─→ ltis_charge (담당자)
    ├─→ ltis_ownr_info (소유자)
    ├─→ ltis_recm_info (평가법인)
    ├─→ ltis_rept_info (조서)
    ├─→ ltis_rept_ownr_info (조서-소유자 매핑)
    └─→ ltis_pnu (PNU)

재결 접수 프로세스
    ↓
ltis_status
    ├─→ receipt_status (진행상태)
    ├─→ receipt_business_info (사업개요)
    ├─→ receipt_quantity_report (총물량조서)
    ├─→ receipt_business_recognition (사업인정관계)
    ├─→ receipt_agreement_date (협의날짜)
    ├─→ receipt_attachment (첨부파일)
    ├─→ receipt_previous_appraisal (감정평가정보)
    │       └─→ receipt_previous_appraisal_recommend (추천정보)
    └─→ receipt_previous_appraisal_attachment (공고파일)

의견 작성
    ↓
opinion_template (템플릿)
    └─→ opinion_case_template (사건별 의견)
            └─→ opinion_case_comment (의견 상세)

열람공고
    ↓
notice_info (공고 정보)
    └─→ notice_attachment (첨부파일)

검토 단계
    ↓
conclusion_status (검토 상태)
    ├─→ conclusion_content (검토 의견)
    │       ├─→ reference_decree_detail (법령 참조)
    │       └─→ reference_precedent (판례 참조)
    └─→ conclusion_bookmark (북마크)

심의 단계
    ↓
system_deliberation_date (심의일자)
system_deliberation_group (심의그룹)
    ↓
deliberation_status (심의 상태)
    └─→ deliberation_target (심의 대상)
```

### 주요 외래키 관계

1. **LTIS 연동**

    - ltis_pnu → ltis_status (judg_seq)
    - file_pdf_image → ltis_status (judg_seq)

2. **재결 접수**

    - receipt\_\* → ltis_status (judg_seq)
    - receipt_previous_appraisal_recommend → receipt_previous_appraisal (seq)

3. **의견 관리**

    - opinion_case_template → ltis_status (judg_seq)
    - opinion_case_template → opinion_template (seq)
    - opinion_case_comment → opinion_case_template (seq)

4. **검토 관리**

    - conclusion_status → ltis_status (judg_seq)
    - conclusion_content → conclusion_status (seq)
    - conclusion_content → opinion_template (seq)

5. **심의 관리**

    - deliberation_target → deliberation_status (seq)
    - deliberation_target → ltis_status (judg_seq, UNIQUE)

6. **파일 관리**
    - 모든 첨부파일 관련 테이블 → file (seq)

---

## 데이터 정합성 및 제약사항

### UNIQUE 제약조건

- system_group_code: group_code
- system_code: (group_code, code)
- user: user_id
- user_role: user_role_name
- user_role_mapping: (user_seq, role_seq)
- receipt_previous_appraisal: judg_seq
- opinion_case_template: (judg_seq, opinion_template_seq)
- notice_info: judg_seq
- conclusion_status: judg_seq
- system_deliberation_date: scheduled_date
- system_deliberation_group: group_name
- deliberation_status: (schedule_date_seq, schedule_group_seq)
- deliberation_target: judg_seq

### CASCADE 정책

현재 Flyway 스크립트에는 명시적인 ON DELETE/UPDATE CASCADE 정책이 없으므로, 삭제 시 참조 무결성 오류가 발생할 수 있습니다.

### 소프트 삭제

- reference_decree: del_check (0: 사용, 1: 삭제)
- reference_decree_detail: del_check
- reference_precedent: del_check

---

## 성능 최적화 고려사항

### 인덱스

- admin_committee_member: INDEX on committee_type
- 기타 테이블: PRIMARY KEY, UNIQUE KEY, FOREIGN KEY에 자동 인덱스 생성

### 비정규화

- ltis_tmp: 조회 성능 향상을 위한 통합 임시 테이블
- kapa\_\*\_tmp: API 호출 이력 관리용 임시 테이블

### 대용량 데이터

- ltis_rept_info: 조서 정보 (다량의 필지 데이터)
- ltis_rept_ownr_info: 조서-소유자 매핑 (다대다 관계)
- kapa_official_price: 전국 공시지가 데이터

---

## 문서 정보

- **작성일**: 2025년
- **데이터베이스**: MySQL/InnoDB
- **문자셋**: UTF8, UTF8MB4
- **총 테이블 수**: 51개
