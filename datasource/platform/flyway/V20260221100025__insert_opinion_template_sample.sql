INSERT INTO file (seq, file_path, original_file_name, changed_file_name, created_by, created_time, updated_by,
                  updated_time)
VALUES (1, '/files/template/', '지연가산금.hwpx', '지연가산금.hwpx', 1, now(), null, null);

INSERT INTO file (seq, file_path, original_file_name, changed_file_name, created_by, created_time, updated_by,
                  updated_time)
VALUES (2, '/files/template/', '무허가건물_부지면적_보상.hwpx', '무허가건물_부지면적_보상.hwpx', 1, now(), null, null);

INSERT INTO file (seq, file_path, original_file_name, changed_file_name, created_by, created_time, updated_by,
                  updated_time)
VALUES (3, '/files/template/', '잔여지_잔여건물_가치_하락.hwpx', '잔여지_잔여건물_가치_하락.hwpx', 1, now(), null, null);
INSERT INTO file (seq, file_path, original_file_name, changed_file_name, created_by, created_time, updated_by,
                  updated_time)
VALUES (4, '/files/template/', '잔여지_잔여건물_매수_청구.hwpx', '잔여지_잔여건물_매수_청구.hwpx', 1, now(), null, null);
INSERT INTO file (seq, file_path, original_file_name, changed_file_name, created_by, created_time, updated_by,
                  updated_time)
VALUES (5, '/files/template/', '사도(사실상 사도)평가_적정성.hwpx', '사도(사실상 사도)평가_적정성.hwpx', 1, now(), null, null);
INSERT INTO file (seq, file_path, original_file_name, changed_file_name, created_by, created_time, updated_by,
                  updated_time)
VALUES (6, '/files/template/', '일단지_보상.hwpx', '일단지_보상.hwpx', 1, now(), null, null);
INSERT INTO file (seq, file_path, original_file_name, changed_file_name, created_by, created_time, updated_by,
                  updated_time)
VALUES (7, '/files/template/', '미지급_용지.hwpx', '미지급_용지.hwpx', 1, now(), null, null);
INSERT INTO file (seq, file_path, original_file_name, changed_file_name, created_by, created_time, updated_by,
                  updated_time)
VALUES (8, '/files/template/', '영업보상(이전비).hwpx', '영업보상(이전비).hwpx', 1, now(), null, null);
INSERT INTO file (seq, file_path, original_file_name, changed_file_name, created_by, created_time, updated_by,
                  updated_time)
VALUES (9, '/files/template/', '구분지상권.hwpx', '구분지상권.hwpx', 1, now(), null, null);
INSERT INTO file (seq, file_path, original_file_name, changed_file_name, created_by, created_time, updated_by,
                  updated_time)
VALUES (10, '/files/template/', '의견.hwpx', '의견.hwpx', 0, now(), null, null);


INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (1, '지연가산금(재결신청 청구)', 1, '재결신청 청구 제출한 소유자 등', 1, 1, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (2, '보상금 증액 (감정평가 검토)', 2, '보상금 증액 및 재결 감정평가 검토 의견', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (3, '협의 절차 미이행(불이행, 미준수)', 3, '법령상 협의 절차 불이행 등 주장 의견', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (4, '사업폐지(취소, 중단, 변경, 보류, 제외)', 4, '사업의 폐지를 주장하는 의견', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (5, '재결 보류', 5, '재결 신청의 위법을 주장하는 의견', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (6, '무허가건물 부지면적 보상', 6, '무허가 건물 등에 대한 보상 적정성', 2, 1, 1, now(), null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (7, '잔여지/잔여건물 가치 하락', 7, '잔여지, 잔여건물에 대한 보상 요구', 3, 1, 1, now(), null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (8, '잔여지/잔여건물 매수 청구(확대보상)', 8, '잔여지, 잔여건물에 대한 수용 청구', 4, 1, 1, now(), null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (9, '사도(사실상 사도)평가 적정성', 9, '본래의 시설 목적대로 평가 요구', 5, 1, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (10, '일단지 보상', 10, '하나의 가격 보상 요구', 6, 1, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (11, '미지급 용지', 11, '시설 결정 이전의 목적대로 보상', 7, 1, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (12, '영업보상(이전비)', 12, '영업권 보상 요구', 8, 1, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (13, '누락 물건 반영', 13, '보상 대상 추가 요구', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (14, '폐업 보상', 14, '휴업 보상이 아닌 폐업 보상 요구', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (15, '영농손실보상', 15, '영농에 대한 손실 보상 요구', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (16, '휴직(실직)보상', 16, '휴직에 따른 손실 보상 요구', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (17, '이주대책 수립', 17, '이주대책 방안 요구', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (18, '이주정착금, 주거이전비, 이사비', 10, '이주에 따른 보상금 요구', 18, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (19, '구분지상권', 19, '구분지상권 설정 요구', 9, 1, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (20, '10% 변동 내역', 20, '변동폭이 큰 물건지 작성', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (21, '대토 보상', 21, '대토 보상', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (22, '권리금 적정성', 22, '권리금 보상 반영 적정성', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (23, '감정평가법인 선정 위법성', 23, '감정평가법인 선정 위법성', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (9998, '기타 의견', 24, '그 외 기타 의견 요구', 10, 0, 1, '2025-04-18 18:06:35', null, null);

INSERT INTO opinion_template (seq, template_name, template_order, template_description, template_file_seq,
                           template_required, created_by, created_time, updated_by, updated_time)
VALUES (9999, '의견 없음', 25, '의견 제출 없음', null, false, 1, now(), null, null);
