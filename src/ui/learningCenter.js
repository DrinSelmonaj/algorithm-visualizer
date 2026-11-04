import { getLearningData } from './learningData.js';
import { getTraitInfo } from './learningTraits.js';
import { getPseudocode } from './pseudocode.js';
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

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function showLearning(key, javaSource) {
    currentKey = key;
    currentJava = javaSource;
    const data = getLearningData(key);
    if (!data) return;

    const info = document.getElementById('learning-info-view');
    if (info) {
        info.innerHTML = `
            <div class="learning-hero learning-more">
                <span class="section-kicker">Koncepti</span>
                <h4>${data.title}</h4>
                <p>${data.summary}</p>
                <div class="learning-more-body" id="learning-more-body" hidden></div>
                <button type="button" class="learning-more-toggle" aria-expanded="false" aria-controls="learning-more-body">Shiko më shumë…</button>
            </div>
            <section class="learning-section learning-use">
                <h5>Përdorimet</h5>
                <p class="use-summary">${escapeHtml(data.use)}</p>
                <div class="use-body" id="use-body" hidden>
                    <h6 class="use-subhead">Përdorimi teknik</h6>
                    <p>${escapeHtml(data.technical)}</p>
                    <h6 class="use-subhead">Në jetën reale</h6>
                    <ul class="real-list">${data.real.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
                </div>
                <button type="button" class="learning-more-toggle use-toggle" aria-expanded="false" aria-controls="use-body">Shiko më shumë…</button>
            </section>
            <section class="learning-section">
                <h5>Karakteristikat <span class="trait-hint">(kliko për shpjegim)</span></h5>
                <div class="trait-list">${data.traits.map(trait => `<button type="button" class="trait-chip" data-trait="${escapeHtml(trait)}" aria-expanded="false">${escapeHtml(trait)}</button>`).join('')}</div>
                <div class="trait-detail" aria-live="polite" hidden></div>
            </section>
            <section class="quiz-card">
                <span class="section-kicker">Kontrollo njohuritë</span>
                <p>${data.quiz.question}</p>
                <div class="quiz-options">${data.quiz.options.map(option => `<button type="button" data-quiz-option="${option}">${option}</button>`).join('')}</div>
                <div class="quiz-feedback" aria-live="polite"></div>
            </section>`;
        setupSeeMore(info, data.more);
        bindToggle(info.querySelector('.use-toggle'), info.querySelector('#use-body'));
        setupTraits(info);
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

// Klikimi mbi një karakteristikë (Stable, In-place, …) shfaq shpjegimin e saj;
// klikimi i përsëritur, ose mbi një tjetër, e mbyll/ndërron.
function setupTraits(root) {
    const detail = root.querySelector('.trait-detail');
    const chips = [...root.querySelectorAll('.trait-chip')];
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const wasOpen = chip.getAttribute('aria-expanded') === 'true';
            chips.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-expanded', 'false'); });
            if (wasOpen || !detail) {
                if (detail) detail.hidden = true;
                return;
            }
            chip.classList.add('active');
            chip.setAttribute('aria-expanded', 'true');
            detail.replaceChildren();
            const title = document.createElement('strong');
            title.textContent = chip.dataset.trait;
            const text = document.createElement('p');
            text.textContent = getTraitInfo(chip.dataset.trait) || 'Shpjegim i pashtuar për këtë karakteristikë.';
            detail.append(title, text);
            detail.hidden = false;
        });
    });
}

// Shpjegimi i zgjeruar futet me textContent (pa HTML) dhe hapet/mbyllet me buton.
function setupSeeMore(root, paragraphs) {
    const section = root.querySelector('.learning-more');
    const body = root.querySelector('#learning-more-body');
    const toggle = root.querySelector('.learning-more-toggle');
    if (!section || !body || !toggle) return;
    if (!paragraphs || paragraphs.length === 0) {
        section.hidden = true;
        return;
    }
    paragraphs.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        body.appendChild(p);
    });
    bindToggle(toggle, body);
}

// Butoni "Shiko më shumë…" / "Shiko më pak": hap dhe mbyll një bllok teksti.
function bindToggle(toggle, body) {
    if (!toggle || !body) return;
    toggle.addEventListener('click', () => {
        const open = body.hidden;
        body.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? 'Shiko më pak' : 'Shiko më shumë…';
    });
}

function renderSelectedCode() {
    const language = document.getElementById('code-language-select')?.value || 'java';
    const badge = document.querySelector('.code-lang-badge');
    if (badge) badge.textContent = language === 'java' ? 'Java' : 'Pseudo';
    const heading = document.querySelector('.code-panel-header h3');
    if (heading) heading.textContent = language === 'java' ? 'Kodi Java' : 'Pseudokod';
    if (language === 'java') {
        showCode(currentJava, 'java');
        return;
    }
    const data = getLearningData(currentKey);
    const pseudo = getPseudocode(currentKey) || [
        `ALGORITHM ${data?.title || currentKey}`,
        `// Pseudokodi i detajuar nuk është i disponueshëm për këtë element.`,
        `// Average: ${data?.average || '—'} | Space: ${data?.space || '—'}`,
    ].join('\n');
    showCode(pseudo, 'plaintext');
}

export { initLearningCenter, showLearning, activateTab };
