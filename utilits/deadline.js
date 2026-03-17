/**
 * Розраховує кількість днів до дедлайну та визначає статус терміновості.
 */
export function getDeadlineInfo(deadlineDate, today = new Date()) {
    // Перевірка на валідність дати (важливо для Unit-тестів)
    if (!deadlineDate || isNaN(new Date(deadlineDate))) {
        throw new Error("Invalid date");
    }

    const target = new Date(deadlineDate);
    target.setHours(0, 0, 0, 0);
    const current = new Date(today);
    current.setHours(0, 0, 0, 0);

    const diffTime = target - current;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Різні стани для перевірки Branch Coverage [cite: 29]
    if (diffDays < 0) {
        return { days: diffDays, status: "Прострочено", urgent: true };
    } 
    
    if (diffDays === 0) {
        return { days: 0, status: "Сьогодні!", urgent: true };
    } 
    
    if (diffDays <= 3) {
        return { days: diffDays, status: "Скоро", urgent: true };
    }

    return { days: diffDays, status: "Вчасно", urgent: false };
}