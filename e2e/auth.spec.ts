import { test, expect } from '@playwright/test'

// Requer app rodando com dados previsíveis; testa navegação básica de auth pages

test('sign-in page renders and navigates to sign-up', async ({ page }) => {
  await page.goto('/')
  await page.waitForURL('**/notes', { timeout: 5000 }).catch(async () => {
    // se redirecionamento depende de sessão, tente ir diretamente para sign-in
    await page.goto('/sign-in')
  })

  // Garante que a página de login existe
  await page.waitForSelector('text=Welcome to Acme Inc.', { timeout: 10000 })
  const registerLink = page.getByRole('link', { name: /register/i })
  await expect(registerLink).toBeVisible()
  await registerLink.click()
  await expect(page).toHaveURL(/.*sign-up/)
})
