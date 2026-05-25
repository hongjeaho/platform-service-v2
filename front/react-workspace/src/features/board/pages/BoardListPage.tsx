import type { BoardCreateRequest, BoardResponse } from '@api/generated/model'
import { SimpleAlertDialog } from '@components/common/AlertDialog'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { Pagination } from '@components/common/Pagination'
import { Select, SelectItem } from '@components/common/Select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/common/Table'
import { Textarea } from '@components/common/Textarea'
import { useState } from 'react'

import { textCombinationsV2 } from '@/styles'

import { useBoardCreate, useBoardDelete, useBoardList } from '../hooks/useBoard'

const CATEGORY_OPTIONS = [
  { label: '전체', value: '' },
  { label: '공지사항', value: 'CB001001' },
  { label: '묻고 답하기', value: 'CB001002' },
]

const PAGE_SIZE = 20

interface BoardListMeta {
  total: number
  page: number
  pageSize: number
}

export function Component() {
  const [categoryCode, setCategoryCode] = useState<string>('')
  const [page, setPage] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [form, setForm] = useState<BoardCreateRequest>({
    boardCategoryCode: 'CB001001',
    title: '',
    content: '',
  })

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useBoardList({
    categoryCode: categoryCode || undefined,
    page,
    pageSize: PAGE_SIZE,
  })

  const createMutation = useBoardCreate()
  const deleteMutation = useBoardDelete()

  const items = (response?.data as unknown as BoardResponse[]) ?? []
  const meta = response?.meta as BoardListMeta | undefined
  const total = meta?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handleCategoryChange = (code: string) => {
    setCategoryCode(code)
    setPage(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title?.trim()) return
    await createMutation.mutateAsync({ data: form })
    setForm({ boardCategoryCode: 'CB001001', title: '', content: '' })
    setShowForm(false)
  }

  const handleDeleteConfirm = async () => {
    if (deleteTarget === null) return
    await deleteMutation.mutateAsync({ seq: deleteTarget })
    setDeleteTarget(null)
  }

  if (isError) {
    return (
      <div className='text-center py-12'>
        <div className='bg-error/10 border border-error rounded-lg p-6 max-w-md mx-auto'>
          <h3 className={`${textCombinationsV2.headlineSm} text-error-foreground mb-2`}>
            목록 로드 실패
          </h3>
          <p className={`${textCombinationsV2.bodyMd} text-error mb-4`}>
            게시글 목록을 불러오지 못했습니다.
          </p>
          <Button onClick={() => refetch()} variant='primary'>
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-card rounded-lg shadow-(--shadow-card) border border-border p-6'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h1 className={textCombinationsV2.headlineLg}>게시판</h1>
            <p className={`${textCombinationsV2.bodyMd} text-muted-foreground mt-1`}>
              전체 {total}건
            </p>
          </div>
          <Button onClick={() => setShowForm(prev => !prev)} variant='primary'>
            {showForm ? '취소' : '글 작성'}
          </Button>
        </div>

        {/* Category Filter */}
        <div className='flex gap-2'>
          {CATEGORY_OPTIONS.map(opt => (
            <Button
              key={opt.value}
              onClick={() => handleCategoryChange(opt.value)}
              variant={categoryCode === opt.value ? 'accent' : 'ghost'}
              size='sm'
            >
              {opt.label}
            </Button>
          ))}
          <Button onClick={() => refetch()} variant='outline' disabled={isFetching} size='sm'>
            {isFetching ? '새로고침 중...' : '새로고침'}
          </Button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className='bg-card rounded-lg shadow-(--shadow-card) border border-border p-6 space-y-4'
        >
          <h2 className={textCombinationsV2.headlineSm}>새 게시글</h2>
          <div className='flex gap-3'>
            <Select
              value={form.boardCategoryCode}
              onValueChange={value => setForm(prev => ({ ...prev, boardCategoryCode: value }))}
            >
              {CATEGORY_OPTIONS.filter(o => o.value).map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
            <Input
              placeholder='제목'
              value={form.title}
              onValueChange={value => setForm(prev => ({ ...prev, title: value }))}
              required
              className='flex-1'
            />
          </div>
          <Textarea
            placeholder='내용'
            value={form.content}
            onValueChange={value => setForm(prev => ({ ...prev, content: value }))}
            rows={4}
          />
          <div className='flex justify-end gap-2'>
            <Button type='button' onClick={() => setShowForm(false)} variant='outline'>
              취소
            </Button>
            <Button type='submit' variant='primary' disabled={createMutation.isPending}>
              {createMutation.isPending ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      )}

      {/* List */}
      {isLoading ? (
        <div className='space-y-3'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='bg-card rounded-lg shadow-(--shadow-card) p-4 animate-pulse'>
              <div className='h-4 bg-muted rounded w-2/3 mb-2' />
              <div className='h-3 bg-muted rounded w-1/4' />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <Table hoverable ariaLabel='게시판 목록'>
          <TableHeader>
            <TableRow>
              <TableHead align='left'>번호</TableHead>
              <TableHead align='left'>제목</TableHead>
              <TableHead align='left'>등록일</TableHead>
              <TableHead align='right'>조회</TableHead>
              <TableHead align='center'>{null}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.seq}>
                <TableCell align='left'>{item.seq}</TableCell>
                <TableCell align='left'>{item.title}</TableCell>
                <TableCell align='left'>{item.createdTime?.slice(0, 10)}</TableCell>
                <TableCell align='right'>{item.viewCount}</TableCell>
                <TableCell align='center'>
                  <Button
                    onClick={() => setDeleteTarget(item.seq!)}
                    disabled={deleteMutation.isPending}
                    variant='destructive'
                    size='sm'
                  >
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div
          className={`text-center py-12 text-muted-foreground bg-card rounded-lg shadow-(--shadow-card) border border-border ${textCombinationsV2.bodyMd}`}
        >
          게시글이 없습니다.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center'>
          <Pagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={p => setPage(p - 1)}
          />
        </div>
      )}

      <SimpleAlertDialog
        open={deleteTarget !== null}
        onOpenChange={open => {
          if (!open) setDeleteTarget(null)
        }}
        title='게시글 삭제'
        description='삭제한 게시글은 복구할 수 없습니다. 계속하시겠습니까?'
        confirmLabel='삭제'
        cancelLabel='취소'
        confirmVariant='destructive'
        confirmDisabled={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
