import { expect, test } from '@playwright/test'

test('홈 페이지 접속', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/.+/)
})
