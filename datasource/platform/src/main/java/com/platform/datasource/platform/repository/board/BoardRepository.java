package com.platform.datasource.platform.repository.board;

import com.platform.datasource.platform.jooq.generated.tables.JBoardContent;
import com.platform.datasource.platform.jooq.generated.tables.pojos.BoardContentEntity;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class BoardRepository {

    private final DSLContext dslContext;
    private final JBoardContent BOARD = JBoardContent.BOARD_CONTENT;

    public List<BoardContentEntity> findAll(String categoryCode, int page, int pageSize) {
        var condition = categoryCode != null
            ? BOARD.BOARD_CATEGORY_CODE.eq(categoryCode)
            : org.jooq.impl.DSL.noCondition();

        return dslContext
            .select(BOARD.fields())
            .from(BOARD)
            .where(condition)
            .orderBy(BOARD.SEQ.desc())
            .limit(pageSize)
            .offset((long) page * pageSize)
            .fetchInto(BoardContentEntity.class);
    }

    public int countAll(String categoryCode) {
        var condition = categoryCode != null
            ? BOARD.BOARD_CATEGORY_CODE.eq(categoryCode)
            : org.jooq.impl.DSL.noCondition();

        Record1<Integer> result = dslContext
            .selectCount()
            .from(BOARD)
            .where(condition)
            .fetchOne();

        return result != null ? result.value1() : 0;
    }

    public BoardContentEntity findById(Long seq) {
        return dslContext
            .select(BOARD.fields())
            .from(BOARD)
            .where(BOARD.SEQ.eq(seq))
            .fetchOneInto(BoardContentEntity.class);
    }

    public Long save(String categoryCode, String title, String content, Long createdBy) {
        Record1<Long> result = dslContext
            .insertInto(BOARD)
            .set(BOARD.BOARD_CATEGORY_CODE, categoryCode)
            .set(BOARD.TITLE, title)
            .set(BOARD.CONTENT, content)
            .set(BOARD.CREATED_BY, createdBy)
            .returningResult(BOARD.SEQ)
            .fetchOne();

        return result != null ? result.value1() : null;
    }

    public int update(Long seq, String title, String content, Long updatedBy) {
        return dslContext
            .update(BOARD)
            .set(BOARD.TITLE, title)
            .set(BOARD.CONTENT, content)
            .set(BOARD.UPDATED_BY, updatedBy)
            .where(BOARD.SEQ.eq(seq))
            .execute();
    }

    public int delete(Long seq) {
        return dslContext
            .deleteFrom(BOARD)
            .where(BOARD.SEQ.eq(seq))
            .execute();
    }

    public void incrementViewCount(Long seq) {
        dslContext
            .update(BOARD)
            .set(BOARD.VIEW_COUNT, BOARD.VIEW_COUNT.add(1))
            .where(BOARD.SEQ.eq(seq))
            .execute();
    }
}
