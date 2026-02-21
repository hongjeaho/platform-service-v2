-- 심의서 진행 상태 공통 코드
insert into system_group_code (group_code, group_name, group_desc, used, created_by, created_time,
                                 updated_by, updated_time)
values ('CR001', ' 접수 진행 상태', '접수 진행 상태', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR001001', 'CR001', '접수 기본 정보 등록', 1, '접수 진행 상태', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR001002', 'CR001', '총물량조서 등록', 1, '접수 진행 상태', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR001003', 'CR001', '협의감졍평가정보 등록', 1, '접수 진행 상태', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR001004', 'CR001', '첨부파일 등록', 1, '접수 진행 상태', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR001006', 'CR001', '열람공고결과 등록', 1, '접수 진행 상태', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR001007', 'CR001', '의견작성', 1, '접수 진행 상태', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR001008', 'CR001', '심의요청', 1, '접수 진행 상태', true, 1, now(), 1, now());