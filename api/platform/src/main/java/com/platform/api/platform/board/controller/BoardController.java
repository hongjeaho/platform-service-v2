package com.platform.api.platform.board.controller;

import com.platform.api.platform.board.dto.BoardCreateRequest;
import com.platform.api.platform.board.dto.BoardResponse;
import com.platform.api.platform.board.dto.BoardUpdateRequest;
import com.platform.api.platform.board.service.BoardService;
import com.platform.common.web.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "board", description = "게시판 - 게시글 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/board")
public class BoardController {

    private final BoardService boardService;

    @Operation(summary = "게시글 목록 조회")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<List<BoardResponse>>> getList(
        @Parameter(description = "게시글 분류코드 (미입력 시 전체 조회)", example = "CB001002")
        @RequestParam(required = false) String categoryCode,
        @Parameter(description = "페이지 번호 (0부터 시작)", example = "0")
        @RequestParam(defaultValue = "0") int page,
        @Parameter(description = "페이지 크기", example = "20")
        @RequestParam(defaultValue = "20") int pageSize
    ) {
        List<BoardResponse> list = boardService.getList(categoryCode, page, pageSize);
        int total = boardService.getCount(categoryCode);

        Map<String, Object> meta = new HashMap<>();
        meta.put("total", total);
        meta.put("page", page);
        meta.put("pageSize", pageSize);

        return ResponseEntity.ok(ApiResponse.of(list, meta));
    }

    @Operation(summary = "게시글 상세 조회")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "게시글 없음")
    })
    @GetMapping("/{seq}")
    public ResponseEntity<ApiResponse<BoardResponse>> getDetail(
        @Parameter(description = "게시글 일련번호") @PathVariable Long seq
    ) {
        return ResponseEntity.ok(ApiResponse.of(boardService.getDetail(seq)));
    }

    @Operation(summary = "게시글 등록")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "등록 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "입력값 오류")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<BoardResponse>> create(
        @RequestBody @Valid BoardCreateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(boardService.create(request)));
    }

    @Operation(summary = "게시글 수정")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "게시글 없음 또는 입력값 오류")
    })
    @PutMapping("/{seq}")
    public ResponseEntity<ApiResponse<BoardResponse>> update(
        @Parameter(description = "게시글 일련번호") @PathVariable Long seq,
        @RequestBody @Valid BoardUpdateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.of(boardService.update(seq, request)));
    }

    @Operation(summary = "게시글 삭제")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "삭제 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "게시글 없음")
    })
    @DeleteMapping("/{seq}")
    public ResponseEntity<ApiResponse<Void>> delete(
        @Parameter(description = "게시글 일련번호") @PathVariable Long seq
    ) {
        boardService.delete(seq);
        return ResponseEntity.ok(ApiResponse.of(null));
    }
}
