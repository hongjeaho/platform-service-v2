insert into system_group_code (group_code, group_name, group_desc, used, created_by, created_time,
                                 updated_by, updated_time)
values ('CC001', '검토 진행 상태', '검토 진행 상태', true, 1, now(), 1, now());


insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CC001001', 'CC001', '검토 시작', 1, '검토 시작', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CC001002', 'CC001', '검토 완료', 1, '검토 완료', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CC001003', 'CC001', '안건 상정', 1, '심의 상정', true, 1, now(), 1, now());

insert into system_code (code, group_code, code_name, code_order, code_desc, used, created_by,
                           created_time, updated_by, updated_time)
values ('CC001004', 'CC001', '보류', 1, '보류(심의 일자, 그룹 수정가능) ', true, 1, now(), 1, now());
