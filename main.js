import { getDeadlineInfo } from './utilits/deadline.js';
// 1. Імпортуємо Sentry SDK [cite: 75]
import * as Sentry from "@sentry/vue";

// 2. Ініціалізація Sentry [cite: 76, 86, 88]
Sentry.init({
    dsn: "https://cb63eb2c15bb5382951dc934d6537818@o4511383192272896.ingest.de.sentry.io/4511383202693200", // Встав сюди свій ключ з налаштувань
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    environment: "development",
});

// 3. Налаштування контексту користувача (Крок 3) 
// Оскільки це лабораторна, ми жорстко прописуємо твої дані для звіту
Sentry.setUser({
    id: "boyko-007",
    email: "boyko.bohdan@example.com",
    username: "BogdanFromUkraine"
});

const form = document.getElementById('deadline-form');
const taskList = document.getElementById('task-list');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('task-name').value;
    const date = document.getElementById('deadline-date').value;

    // 4. Додаємо Breadcrumb перед логікою (Крок 1.3)
    Sentry.addBreadcrumb({
        category: "ui.click",
        message: `Користувач намагається додати таску: ${name}`,
        level: "info",
    });

    try {
        // Симуляція помилки для звіту (Крок 2.1)
        if (name.toLowerCase() === "error") {
            throw new Error("Sentry Test Error: Критичний збій при додаванні завдання!");
        }

        const info = getDeadlineInfo(date);
        const taskHtml = `
            <div class="task-item">
                <strong>${name}</strong> — 
                <span class="${info.urgent ? 'urgent' : 'on-time'}">
                    ${info.status} (днів: ${info.days})
                </span>
            </div>
        `;
        taskList.insertAdjacentHTML('beforeend', taskHtml);
        form.reset();
    } catch (error) {
        // Відправляємо помилку в Sentry [cite: 143]
        Sentry.captureException(error);
        alert("Помилка зафіксована в Sentry: " + error.message);
    }
});