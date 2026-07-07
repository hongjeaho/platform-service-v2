import { expect, test } from '@playwright/test'

// V20260525100003__user_table.sql에 시드된 관리자 계정
const SEEDED_ADMIN = { id: 'admin', password: '12345' }

test.describe('로그인', () => {
  test('올바른 자격증명으로 로그인하면 리다이렉트된다', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('아이디').fill(SEEDED_ADMIN.id)
    await page.getByLabel('비밀번호').fill(SEEDED_ADMIN.password)
    await page.getByRole('button', { name: '로그인' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('button', { name: '로그인' })).not.toBeVisible()
  })
})
