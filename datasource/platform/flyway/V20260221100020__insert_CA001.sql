insert into system_group_code (group_code, group_name, group_desc, used, created_by, created_time,
                                 updated_by, updated_time)
values ('CA001', '위원회 구분 코드', 'admin_committee_member.committee_type 에서 사용하는 구분 코드', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CA001001', 'CA001', '위원장', 1, '', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CA001002', 'CA001', '위원', 2, '', true, 1, now(), 1, now());