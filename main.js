import { getDeadlineInfo } from './utilits/deadline.js';

import posthog from 'posthog-js';

posthog.init('phc_tzskTcWRakSbaCiAuEHGjceP6SZoGZMJDjdBpMtz7yTU', {
    // Адреса сервера (API Host)
    api_host: window.location.origin + '/ingest',
    person_profiles: 'always',
});


posthog.onFeatureFlags(() => {
    const dateInput = document.getElementById('deadline-date');
    const dateLabel = document.querySelector('label[for="deadline-date"]');

    if (posthog.isFeatureEnabled('show-date-picker')) {
        dateInput.style.setProperty('display', 'block', 'important');
        if (dateLabel) dateLabel.style.setProperty('display', 'block', 'important');
    } else {
        // Додаємо !important, щоб точно приховати
        dateInput.style.setProperty('display', 'none', 'important');
        if (dateLabel) dateLabel.style.setProperty('display', 'none', 'important');
    }
});

const form = document.getElementById('deadline-form');
const taskList = document.getElementById('task-list');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('task-name').value;
    const date = document.getElementById('deadline-date').value;

    try {
        const info = getDeadlineInfo(date);

        posthog.capture('task_created', {
            task_name: name,
            status: info.status,
            days_left: info.days,
            is_urgent: info.urgent
        });

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
        alert("Помилка: " + error.message);
    }
});