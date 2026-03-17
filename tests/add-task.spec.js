import { test, expect } from '@playwright/test';

test.describe('E2E: Менеджер дедлайнів', () => {
    test('Успішне додавання нового завдання', async ({ page }) => {
        // 1. Відкриваємо локальний сервер (адреса з Go Live)
        await page.goto('http://127.0.0.1:5500/main.html');

        // 2. Заповнюємо форму
        await page.fill('#task-name', 'Вивчити Playwright');
        
        // Вибираємо дату в майбутньому (наприклад, +10 днів)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10);
        const dateString = futureDate.toISOString().split('T')[0];
        await page.fill('#deadline-date', dateString);

        // 3. Натискаємо кнопку додавання [cite: 19]
        await page.click('#add-task-btn');

        // 4. Перевіряємо результат у списку [cite: 261]
        const taskItem = page.locator('#task-list');
        await expect(taskItem).toContainText('Вивчити Playwright');
        await expect(taskItem).toContainText('Вчасно');
    });

    test('Відображення статусу "Сьогодні!" при виборі поточної дати', async ({ page }) => {
        await page.goto('http://127.0.0.1:5500/main.html');
        await page.fill('#task-name', 'Термінове завдання');
        
        const today = new Date().toISOString().split('T')[0];
        await page.fill('#deadline-date', today);
        await page.click('#add-task-btn');

        const status = page.locator('.urgent');
        await expect(status).toContainText('Сьогодні!');
    });
});