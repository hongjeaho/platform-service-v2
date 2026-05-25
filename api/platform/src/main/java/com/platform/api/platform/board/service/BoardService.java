package com.platform.api.platform.board.service;

import com.platform.api.platform.board.dto.BoardCreateRequest;
import com.platform.api.platform.board.dto.BoardResponse;
import com.platform.api.platform.board.dto.BoardUpdateRequest;
import com.platform.datasource.platform.config.database.PlatformTransactional;
import com.platform.datasource.platform.jooq.generated.tables.pojos.BoardContentEntity;
import com.platform.datasource.platform.repository.board.BoardRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;

    @PlatformTransactional(readOnly = true)
    public List<BoardResponse> getList(String categoryCode, int page, int pageSize) {
        return boardRepository.findAll(categoryCode, page, pageSize).stream()
            .map(this::toResponse)
            .toList();
    }

    @PlatformTransactional(readOnly = true)
    public int getCount(String categoryCode) {
        return boardRepository.countAll(categoryCode);
    }

    @PlatformTransactional
    public BoardResponse getDetail(Long seq) {
        BoardContentEntity entity = boardRepository.findById(seq);
        if (entity == null) {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다. seq=" + seq);
        }
        boardRepository.incrementViewCount(seq);
        entity.setViewCount(entity.getViewCount() + 1);
        return toResponse(entity);
    }

    @PlatformTransactional
    public BoardResponse create(BoardCreateRequest request) {
        Long userSeq = 1L;
        Long seq = boardRepository.save(
            request.getBoardCategoryCode(),
            request.getTitle(),
            request.getContent(),
            userSeq
        );
        BoardContentEntity created = boardRepository.findById(seq);
        return toResponse(created);
    }

    @PlatformTransactional
    public BoardResponse update(Long seq, BoardUpdateRequest request) {
        Long userSeq = 1L;
        int updated = boardRepository.update(seq, request.getTitle(), request.getContent(), userSeq);
        if (updated == 0) {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다. seq=" + seq);
        }
        return toResponse(boardRepository.findById(seq));
    }

    @PlatformTransactional
    public void delete(Long seq) {
        int deleted = boardRepository.delete(seq);
        if (deleted == 0) {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다. seq=" + seq);
        }
    }

    private BoardResponse toResponse(BoardContentEntity entity) {
        BoardResponse response = new BoardResponse();
        response.setSeq(entity.getSeq());
        response.setBoardCategoryCode(entity.getBoardCategoryCode());
        response.setTitle(entity.getTitle());
        response.setContent(entity.getContent());
        response.setViewCount(entity.getViewCount());
        response.setCreatedTime(entity.getCreatedTime());
        response.setCreatedBy(entity.getCreatedBy());
        response.setUpdatedTime(entity.getUpdatedTime());
        response.setUpdatedBy(entity.getUpdatedBy());
        return response;
    }
}
