import { test, expect } from '@playwright/test'

// Smoke: editor de notas exibe input de título quando acessa /notes

test('notes page shows editor UI elements', async ({ page }) => {
  await page.goto('/notes')
  // Espera por algum input de título
  const titleInput = page.locator('input[placeholder*="title"]')
  await expect(titleInput).toBeVisible({ timeout: 10000 })
})
