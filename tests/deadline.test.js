import { expect, test, describe } from 'vitest';
import { getDeadlineInfo } from '../utilits/deadline.js';

describe('Unit Tests: Deadline Business Logic', () => {
    
    // Тест 1: Звичайний сценарій (Positive)
    test('повертає "Вчасно", якщо до дедлайну 10 днів', () => {
        const today = new Date('2026-03-10');
        const res = getDeadlineInfo('2026-03-20', today);
        expect(res.status).toBe('Вчасно'); // Assertion [cite: 230]
        expect(res.urgent).toBe(false);
    });

    // Тест 2: Граничне значення (Soon)
    test('повертає "Скоро", якщо залишилось 3 дні', () => {
        const today = new Date('2026-03-10');
        const res = getDeadlineInfo('2026-03-13', today);
        expect(res.status).toBe('Скоро');
        expect(res.urgent).toBe(true);
    });

    // Тест 3: Сьогоднішній дедлайн (State test)
    test('повертає "Сьогодні!", якщо дедлайн настав', () => {
        const today = new Date('2026-03-10');
        const res = getDeadlineInfo('2026-03-10', today);
        expect(res.status).toBe('Сьогодні!');
        expect(res.days).toBe(0);
    });

    // Тест 4: Прострочений дедлайн (Negative scenario)
    test('маркує як "Прострочено", якщо дата в минулому', () => {
        const today = new Date('2026-03-10');
        const res = getDeadlineInfo('2026-03-09', today);
        expect(res.status).toBe('Прострочено');
        expect(res.days).toBe(-1);
    });

    // Тест 5: Поведінка при помилці (Robustness)
    test('викидає помилку при передачі порожнього рядка', () => {
        expect(() => getDeadlineInfo('')).toThrow('Invalid date');
    });

    // Тест 6: Поведінка при некоректній даті
    test('викидає помилку при передачі тексту замість дати', () => {
        expect(() => getDeadlineInfo('not-a-date')).toThrow('Invalid date');
    });

    // Тест 7: Перевірка великого проміжку часу
    test('коректно рахує дні для дедлайну через місяць', () => {
        const today = new Date('2026-03-10');
        const res = getDeadlineInfo('2026-04-10', today);
        expect(res.days).toBeGreaterThan(25);
    });
});