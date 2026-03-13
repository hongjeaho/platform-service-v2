package com.platform.common.core.type.status;

import lombok.Getter;

@Getter
public enum BoardTypeCode {

  POST_DELIVERY("CB001001", "송달결과 게시글");

  private final String boardTypeCode;
  private final String desc;

  BoardTypeCode(String boardTypeCode, String desc) {
    this.boardTypeCode = boardTypeCode;
    this.desc = desc;
  }

}
