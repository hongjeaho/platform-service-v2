insert into system_group_code (group_code, group_name, group_desc, used, created_by, created_time,
                                 updated_by, updated_time)
values ('CD001', '법령의 분류', '법령의 분류', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CD001001', 'CD001', '법률', 1, '법률', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CD001002', 'CD001', '시행령', 1, '시행령', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CD001003', 'CD001', '시행규칙', 1, '시행규칙', true, 1, now(), 1, now());