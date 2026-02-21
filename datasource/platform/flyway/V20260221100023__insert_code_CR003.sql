# 감평평가 추천 코드
insert into system_group_code (group_code, group_name, group_desc, used, created_by, created_time,
                                 updated_by, updated_time)
values ('CR003', '감평평가 추천 코드', '감평평가 추천 코드', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR003001', 'CR003', '사업시행자 추천', 1, '', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR003002', 'CR003', '시도지사 추천', 2, '', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR003003', 'CR003', '토지 소유자 추천', 3, '', true, 3, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CR003004', 'CR003', '추가 사업시행자 소유자 추천', 4, '', true, 3, now(), 1, now());

