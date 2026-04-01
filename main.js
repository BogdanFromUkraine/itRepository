import { getDeadlineInfo } from './utilits/deadline.js';

import posthog from 'posthog-js';

posthog.init('phc_tzskTcWRakSbaCiAuEHGjceP6SZoGZMJDjdBpMtz7yTU', {
    // Адреса сервера (API Host)
    api_host: 'https://app.posthog.com',

    person_profiles: 'always',
});


const form = document.getElementById('deadline-form');
const taskList = document.getElementById('task-list');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('task-name').value;
    const date = document.getElementById('deadline-date').value;

    try {
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
        alert("Помилка: " + error.message);
    }
});