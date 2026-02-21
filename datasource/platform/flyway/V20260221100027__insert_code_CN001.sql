insert into system_group_code (group_code, group_name, group_desc, used, created_by, created_time,
                                 updated_by, updated_time)
values ('CN001', '열람 공고 등록 파일 타입 코드', '공고 파일 타입 코드', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CN001001', 'CN001', '열람공고  회보공문', 2, '', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CN001002', 'CN001', '열람공고 공고문', 3, '', true, 3, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CN001003', 'CN001', '열람공고 등기송달증빙', 4, '', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CN001004', 'CN001', '열람공고 소유자의견', 5, '', true, 1, now(), 1, now());