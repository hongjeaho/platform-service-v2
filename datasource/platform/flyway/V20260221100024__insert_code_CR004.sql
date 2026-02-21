#사업 시행자 협의 공고 파일 공통 코드 작성
insert into system_group_code (group_code, group_name, group_desc, used, created_by, created_time,
                                 updated_by, updated_time)
values ('CR004', '협의 공고 파일 타입 코드', '협의 공고 파일 타입 코드', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR004001', 'CR004', '공고문', 1, '', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR004002', 'CR004', '의뢰 공문', 2, '', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR004003', 'CR004', '회신 공문', 3, '', true, 3, now(), 1, now());

