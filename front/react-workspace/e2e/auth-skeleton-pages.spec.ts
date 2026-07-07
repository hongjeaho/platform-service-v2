import { expect, test } from '@playwright/test'

test.describe('회원가입/비밀번호 재설정 스켈레톤 페이지', () => {
  test('/signup 접속 시 회원가입 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/signup')

    await expect(page.getByRole('heading', { name: '회원가입' })).toBeVisible()
  })

  test('/password-reset 접속 시 비밀번호 재설정 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/password-reset')

    await expect(page.getByRole('heading', { name: '비밀번호 재설정' })).toBeVisible()
  })

  test('로그인 화면의 회원가입 링크를 클릭하면 /signup으로 이동한다', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('link', { name: '회원가입' }).click()

    await expect(page).toHaveURL('/signup')
    await expect(page.getByRole('heading', { name: '회원가입' })).toBeVisible()
  })

  test('로그인 화면의 비밀번호 찾기 링크를 클릭하면 /password-reset으로 이동한다', async ({
    page,
  }) => {
    await page.goto('/login')

    await page.getByRole('link', { name: '비밀번호를 잊으셨나요?' }).click()

    await expect(page).toHaveURL('/password-reset')
    await expect(page.getByRole('heading', { name: '비밀번호 재설정' })).toBeVisible()
  })
})
