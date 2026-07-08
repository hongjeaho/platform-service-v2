import { execFileSync } from 'node:child_process'

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

/**
 * 이메일로 실제 발송되는 OTP 코드를 읽을 방법이 테스트 환경에 없어(별도 메일함 연동 없음),
 * 백엔드가 저장하는 Redis 키(`otp:{purpose}:{email}`, ADR-0001)를 직접 조회한다.
 */
function readOtpCodeFromRedis(email: string): string {
  return execFileSync('docker', [
    'exec',
    'platform-redis-v2',
    'redis-cli',
    'GET',
    `otp:SIGNUP:${email}`,
  ])
    .toString()
    .trim()
}

function uniqueSuffix(): string {
  return `${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`
}

test.describe('회원가입 전체 플로우', () => {
  test('아이디 중복확인 → 이메일 인증 → 제출까지 마치면 로그인 화면으로 이동하고 성공 배너가 보인다', async ({
    page,
  }) => {
    const suffix = uniqueSuffix()
    const userId = `e2e${suffix}`
    const userEmail = `e2e${suffix}@example.com`

    await page.goto('/signup')

    await page.getByLabel('아이디').fill(userId)
    await page.getByRole('button', { name: '중복확인' }).click()
    await expect(page.getByText('사용 가능한 아이디예요')).toBeVisible()

    await page.getByLabel('이메일').fill(userEmail)
    await page.getByRole('button', { name: '인증요청' }).click()
    await expect(page.getByText('인증번호를 발송했어요')).toBeVisible()

    const otpCode = readOtpCodeFromRedis(userEmail)
    expect(otpCode).toMatch(/^\d{6}$/)

    await page.getByLabel('이름').fill('홍재호')
    await page.getByLabel('비밀번호', { exact: true }).fill('password1')
    await page.getByLabel('비밀번호 확인').fill('password1')
    await page.getByLabel('인증번호').fill(otpCode)

    await page.getByRole('button', { name: '회원가입' }).click()

    await expect(page).toHaveURL('/login')
    await expect(page.getByText('회원가입이 완료됐어요. 로그인해주세요.')).toBeVisible()
  })

  test('인증번호가 틀리면 제출이 실패하고 상단에 에러 배너가 표시된다', async ({ page }) => {
    const suffix = uniqueSuffix()
    const userId = `e2e${suffix}`
    const userEmail = `e2e${suffix}@example.com`

    await page.goto('/signup')

    await page.getByLabel('아이디').fill(userId)
    await page.getByRole('button', { name: '중복확인' }).click()
    await expect(page.getByText('사용 가능한 아이디예요')).toBeVisible()

    await page.getByLabel('이메일').fill(userEmail)
    await page.getByRole('button', { name: '인증요청' }).click()
    await expect(page.getByText('인증번호를 발송했어요')).toBeVisible()

    await page.getByLabel('이름').fill('홍재호')
    await page.getByLabel('비밀번호', { exact: true }).fill('password1')
    await page.getByLabel('비밀번호 확인').fill('password1')
    await page.getByLabel('인증번호').fill('000000')

    await page.getByRole('button', { name: '회원가입' }).click()

    await expect(page.getByRole('alert')).toHaveText(
      '인증번호가 올바르지 않거나 만료됐어요. 다시 시도해주세요.',
    )
    await expect(page).toHaveURL('/signup')
  })

  test.describe.serial('이미 가입된 아이디/이메일', () => {
    const suffix = uniqueSuffix()
    const userId = `e2edup${suffix}`
    const userEmail = `e2edup${suffix}@example.com`

    test('먼저 정상적으로 가입한다', async ({ page }) => {
      await page.goto('/signup')

      await page.getByLabel('아이디').fill(userId)
      await page.getByRole('button', { name: '중복확인' }).click()
      await expect(page.getByText('사용 가능한 아이디예요')).toBeVisible()

      await page.getByLabel('이메일').fill(userEmail)
      await page.getByRole('button', { name: '인증요청' }).click()
      await expect(page.getByText('인증번호를 발송했어요')).toBeVisible()

      const otpCode = readOtpCodeFromRedis(userEmail)

      await page.getByLabel('이름').fill('홍재호')
      await page.getByLabel('비밀번호', { exact: true }).fill('password1')
      await page.getByLabel('비밀번호 확인').fill('password1')
      await page.getByLabel('인증번호').fill(otpCode)

      await page.getByRole('button', { name: '회원가입' }).click()
      await expect(page).toHaveURL('/login')
    })

    test('같은 아이디로 중복확인하면 중복 에러가 표시된다', async ({ page }) => {
      await page.goto('/signup')

      await page.getByLabel('아이디').fill(userId)
      await page.getByRole('button', { name: '중복확인' }).click()

      await expect(page.getByText('이미 사용 중인 아이디예요')).toBeVisible()
    })

    test('같은 이메일로 인증요청하면 이미 가입된 이메일 에러가 표시된다', async ({ page }) => {
      await page.goto('/signup')

      await page.getByLabel('이메일').fill(userEmail)
      await page.getByRole('button', { name: '인증요청' }).click()

      await expect(page.getByText('이미 가입된 이메일이에요')).toBeVisible()
    })
  })
})
