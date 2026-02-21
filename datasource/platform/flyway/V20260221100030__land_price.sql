create table kapa_standard_price
(
    seq_no       BIGINT                             NOT NULL COMMENT '일련번호',
    c_year       VARCHAR(50)                        NOT NULL COMMENT '기준년도',
    s_pnu        VARCHAR(100) COMMENT 'PNU',
    s_reg        VARCHAR(50) COMMENT '시군구(최신)',
    s_eub        VARCHAR(50) COMMENT '읍면동(최신)',
    s_san        VARCHAR(50) COMMENT '산구분(최신)',
    s_bun1       VARCHAR(50) COMMENT '본번(최신)',
    s_bun2       VARCHAR(50) COMMENT '부번(최신)',
    eub_name     VARCHAR(100) COMMENT '읍면동 한글명',
    jibun        VARCHAR(100) COMMENT '지번(본번+부번)',
    gimok1       VARCHAR(50) COMMENT '공부지목',
    gimok1_str   VARCHAR(200) COMMENT '공부지목 한글명',
    gimok2       VARCHAR(50) COMMENT '실제지목',
    gimok2_str   VARCHAR(200) COMMENT '실제 지목 한글명',
    giyuk1       VARCHAR(50) COMMENT '용도지역1',
    giyuk1_str   VARCHAR(200) COMMENT '용도지역1 한글명',
    youngdo1     VARCHAR(50) COMMENT '이용상황',
    youngdo1_str VARCHAR(200) COMMENT '이용상황 한글명',
    youngdo2     VARCHAR(50) COMMENT '이용상황기타',
    area         VARCHAR(50) COMMENT '면적',
    gojeu        VARCHAR(50) COMMENT '고저',
    gojeu_str    VARCHAR(200) COMMENT '고저 한글명',
    hung         VARCHAR(50) COMMENT '형상',
    hung_str     VARCHAR(200) COMMENT '형상 한글명',
    ban          VARCHAR(50) COMMENT '방위',
    ban_str      VARCHAR(200) COMMENT '방위 한글명',
    jub          VARCHAR(50) COMMENT '도로 접면',
    jub_str      VARCHAR(200) COMMENT '도로 접면 한글명',
    fasc         VARCHAR(50) COMMENT '도시계획시설,저촉여부',
    fasc_str     VARCHAR(100) COMMENT '도시계획시설,저촉여부명',
    gakukc       VARCHAR(50) COMMENT '공시지가',
    gakuk1       VARCHAR(50) COMMENT '1년전공시지가',
    gakuk2       VARCHAR(50) COMMENT '2년전공시지가',
    gakuk3       VARCHAR(50) COMMENT '3년전공시지가',
    gakuk4       VARCHAR(50) COMMENT '4년전공시지가',
    tm_x         VARCHAR(50) COMMENT 'TM x좌표',
    tm_y         VARCHAR(50) COMMENT 'TM y좌표',
    wgs84_x      VARCHAR(50) COMMENT 'WGS84 x좌표',
    wgs84_y      VARCHAR(50) COMMENT 'WGS84 y좌표',
    use_yn       VARCHAR(1) COMMENT '사용여부',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    PRIMARY KEY (c_year, s_pnu)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT = '표준지 공시지가';

create table kapa_standard_price_tmp
(
    c_year          VARCHAR(50) NOT NULL COMMENT '기준년도',
    s_reg           VARCHAR(50) COMMENT '시군구',
    standard_seq_no BIGINT      NOT NULL COMMENT '표준지 일련번호',
    PRIMARY KEY (c_year, s_reg, standard_seq_no)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT = '표준지 공시지가 API 호출';

create table kapa_official_price
(
    c_year          VARCHAR(50)                        NOT NULL COMMENT '기준년도',
    pnu             VARCHAR(20)                        NOT NULL COMMENT 'PNU',
    standard_seq_no BIGINT                             COMMENT '표준지 일련번호',
    reg             VARCHAR(5)                         COMMENT '시군구',
    eub             VARCHAR(5)                         COMMENT '읍면동',
    san             VARCHAR(1)                         COMMENT '산구분',
    bun1            VARCHAR(4)                         COMMENT '본번',
    bun2            VARCHAR(4)                         COMMENT '부번',
    as1             VARCHAR(50)                        COMMENT '시도명',
    eub_name        VARCHAR(100)                       COMMENT '읍면동명',
    jibun           VARCHAR(100)                       COMMENT '지번(본번+부번)',
    area            DECIMAL(10, 1)                     COMMENT '면적',
    gakuka          BIGINT                             COMMENT '공시가격',
    gimok           VARCHAR(5)                         COMMENT '지목',
    gimok_str       VARCHAR(100)                       COMMENT '지목명',
    youngdo         VARCHAR(5)                         COMMENT '이용상황',
    youngdo_str     VARCHAR(100)                       COMMENT '이용상황명',
    giyuk           VARCHAR(5)                         COMMENT '용도지역',
    giyuk_str       VARCHAR(100)                       COMMENT '용도지역명',
    gojeu           VARCHAR(5)                         COMMENT '고저',
    gojeu_str       VARCHAR(100)                       COMMENT '고저명',
    hung            VARCHAR(5)                         COMMENT '형상',
    hung_str        VARCHAR(100)                       COMMENT '형상명',
    ban             VARCHAR(5)                         COMMENT '방위',
    ban_str         VARCHAR(100)                       COMMENT '방위명',
    jub             VARCHAR(5)                         COMMENT '도로접면',
    jub_str         VARCHAR(100)                       COMMENT '도로접면명',
    fasc            DECIMAL(10, 1) COMMENT '도시계획시설,저촉여부',
    fasc_str        VARCHAR(100) COMMENT '도시계획시설,저촉여부명',
    fascy           VARCHAR(50) COMMENT '저촉율',
    tm_x            VARCHAR(50) COMMENT 'TM x좌표',
    tm_y            VARCHAR(50) COMMENT 'TM y좌표',
    wgs84_x         VARCHAR(50) COMMENT 'WGS84 x좌표',
    wgs84_y         VARCHAR(50) COMMENT 'WGS84 y좌표',
    use_yn          VARCHAR(1)                         NOT NULL COMMENT '사용여부',
    created_time    DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성일',
    PRIMARY KEY (c_year, pnu)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT = '공시지가';


create table kapa_official_price_tmp
(
    c_year   VARCHAR(50) NOT NULL COMMENT '기준년도',
    pnu      VARCHAR(20) NOT NULL COMMENT 'PNU',
    PRIMARY KEY (c_year, pnu)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT = '공시지가 API 호출';



