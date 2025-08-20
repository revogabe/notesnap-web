import { test, expect } from '@playwright/test'

// Smoke E2E: verifica rota e campo de upload renderizando no companion

test('companion upload page renders input', async ({ page }) => {
  // Usa um ID dummy; em ambientes reais, substitua por fixture/seed
  await page.goto('/companion/123')
  // Deve existir um input[type=file] oculto
  const fileInput = page.locator('input[type="file"]')
  await expect(fileInput).toHaveCount(1)
})
