import { getLearningData } from './learningData.js';
import { showCode, revealActiveLine } from './codePanel.js';

let currentKey = null;
let currentJava = '';

function initLearningCenter() {
    document.querySelectorAll('.panel-tab').forEach(button => {
        button.addEventListener('click', () => activateTab(button.dataset.panelTab));
    });
    document.getElementById('code-language-select')?.addEventListener('change', renderSelectedCode);
}

function activateTab(tab) {
    document.querySelectorAll('.panel-tab').forEach(button => {
        const active = button.dataset.panelTab === tab;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.panel-view').forEach(view => {
        view.hidden = view.dataset.panelView !== tab;
    });
    const headerActions = document.querySelector('.code-panel-header-right');
    if (headerActions) headerActions.classList.toggle('code-panel-header-right--muted', tab !== 'code');
    if (tab === 'code') revealActiveLine();
}

function showLearning(key, javaSource) {
    currentKey = key;
    currentJava = javaSource;
    const data = getLearningData(key);
    if (!data) return;

    const info = document.getElementById('learning-info-view');
    if (info) {
        info.innerHTML = `
            <div class="learning-hero">
                <span class="section-kicker">Koncepti</span>
                <h4>${data.title}</h4>
                <p>${data.summary}</p>
            </div>
            <section class="learning-section">
                <h5>Kur përdoret?</h5>
                <p>${data.use}</p>
            </section>
            <section class="learning-section">
                <h5>Karakteristikat</h5>
                <div class="trait-list">${data.traits.map(trait => `<span>${trait}</span>`).join('')}</div>
            </section>
            <section class="quiz-card">
                <span class="section-kicker">Kontrollo njohuritë</span>
                <p>${data.quiz.question}</p>
                <div class="quiz-options">${data.quiz.options.map(option => `<button type="button" data-quiz-option="${option}">${option}</button>`).join('')}</div>
                <div class="quiz-feedback" aria-live="polite"></div>
            </section>`;
        info.querySelectorAll('[data-quiz-option]').forEach(button => {
            button.addEventListener('click', () => {
                const correct = button.dataset.quizOption === data.quiz.answer;
                info.querySelectorAll('[data-quiz-option]').forEach(item => item.classList.remove('correct', 'wrong'));
                button.classList.add(correct ? 'correct' : 'wrong');
                info.querySelector('.quiz-feedback').textContent = correct
                    ? 'Saktë. Ky është kompleksiteti mesatar.'
                    : `Jo ende. Përgjigjja është ${data.quiz.answer}.`;
            });
        });
    }

    const complexity = document.getElementById('learning-complexity-view');
    if (complexity) {
        const operationRows = data.operations
            ? `<h5>Operacionet</h5><div class="operation-table"><div><b>Operacioni</b><b>Mesatar</b><b>Worst</b></div>${data.operations.map(row => `<div><span>${row[0]}</span><code>${row[1]}</code><code>${row[2]}</code></div>`).join('')}</div>`
            : '';
        complexity.innerHTML = `
            <div class="learning-hero">
                <span class="section-kicker">Analiza</span>
                <h4>Kompleksiteti</h4>
                <p>Si ndryshon kostoja kur input-i rritet.</p>
            </div>
            <div class="complexity-grid">
                <article><span>Best</span><strong>${data.best}</strong></article>
                <article><span>Average</span><strong>${data.average}</strong></article>
                <article><span>Worst</span><strong>${data.worst}</strong></article>
                <article><span>Space</span><strong>${data.space}</strong></article>
            </div>
            ${operationRows}
            <section class="learning-section complexity-note">
                <h5>Si lexohet Big O?</h5>
                <p>Big O përshkruan ritmin e rritjes, jo kohën në sekonda. O(log n) rritet ngadalë, O(n) proporcionalisht, ndërsa O(n²) bëhet shpejt i kushtueshëm.</p>
            </section>`;
    }
    renderSelectedCode();
}

function renderSelectedCode() {
    const language = document.getElementById('code-language-select')?.value || 'java';
    const badge = document.querySelector('.code-lang-badge');
    if (badge) badge.textContent = language === 'java' ? 'Java' : 'Pseudo';
    if (language === 'java') {
        showCode(currentJava, 'java');
        return;
    }
    const data = getLearningData(currentKey);
    const pseudo = [
        `ALGORITHM ${data?.title || currentKey}`,
        `INPUT: të dhënat dhe parametrat`,
        `1. ${data?.summary || 'Përpuno input-in.'}`,
        `2. Përsërit hapat derisa kushti i përfundimit të plotësohet.`,
        `3. Kthe rezultatin.`,
        ``,
        `// Average: ${data?.average || '—'} | Space: ${data?.space || '—'}`,
    ].join('\n');
    showCode(pseudo, 'plaintext');
}

export { initLearningCenter, showLearning, activateTab };
