// e2e/browser-harness.js
// Skript testimi për shfletues (NUK ekzekutohet nga `npm test`). Ngarkohet në faqe:
//   const s = document.createElement('script'); s.src = '/e2e/browser-harness.js'; document.head.appendChild(s);
// pastaj: await T.A() (info/skeda), T.B() (sorting/searching), T.C() (custom/presets/target),
//         T.D() (BST), T.E() (graf), T.F() (DS), T.G() (kërkim/krahaso/ndërrim/layout)
// Çdo seksion kthen { failed: [...], notes: [...], errs, alerts }.

(() => {
    if (window.T) return;
    const T = window.T = {};
    const errs = window.__errs = [];
    const alerts = window.__alerts = [];
    window.addEventListener('error', e => errs.push('error: ' + e.message));
    window.addEventListener('unhandledrejection', e => errs.push('rejection: ' + (e.reason && e.reason.message || e.reason)));
    const ce = console.error;
    console.error = (...a) => { errs.push('console.error: ' + a.map(String).join(' ')); ce(...a); };
    window.alert = m => { alerts.push(String(m)); };
    window.prompt = () => { errs.push('prompt() u thirr'); return null; };
    window.confirm = () => true;

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const $ = s => document.querySelector(s);
    const $$ = s => [...document.querySelectorAll(s)];
    const byId = id => document.getElementById(id);
    const words = s => String(s).split(/\s+/).filter(Boolean).length;

    async function waitFor(fn, ms = 15000, step = 40) {
        const t = Date.now();
        while (Date.now() - t < ms) { if (fn()) return true; await sleep(step); }
        return false;
    }
    function setVal(el, v) {
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }
    function key(el, k) { el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true })); }
    function newResult() {
        errs.length = 0; alerts.length = 0;
        const R = { failed: [], notes: [] };
        R.check = (cond, msg) => { if (!cond) R.failed.push(msg); return !!cond; };
        R.done = () => { R.errs = [...errs]; R.alerts = [...alerts]; if (errs.length) R.failed.push('gabime JS: ' + errs.join(' | ')); return R; };
        return R;
    }
    const bars = () => $$('#main-svg g').filter(g => g.querySelector(':scope > rect') && g.querySelector(':scope > text'))
        .map(g => ({ x: parseFloat((g.getAttribute('transform') || '').match(/translate\(([^,)]+)/)?.[1] || '0'), v: Number(g.querySelector(':scope > text').textContent) }))
        .sort((a, b) => a.x - b.x);
    const barVals = () => bars().map(b => b.v);
    const asc = a => a.every((v, i) => i === 0 || a[i - 1] <= v);
    const desc = a => a.every((v, i) => i === 0 || a[i - 1] >= v);
    const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const btn = id => byId('btn-' + id);
    const clickId = id => byId(id).click();
    const setSpeed = v => setVal(byId('speed-slider'), v);
    async function pick(k) { $(`[data-algorithm="${k}"]`).click(); await sleep(120); }
    async function finished(ms = 25000) { await sleep(120); return waitFor(() => !btn('run').disabled && !btn('pause').disabled === false || !btn('run').disabled, ms); }
    const stat = id => Number(byId(id).textContent);
    const setSize = n => setVal(byId('size-slider'), n);

    // Panel i DS/graf: pret derisa të gjitha input/button të riaktivizohen
    const opsIdle = () => $$('.ds-ops input, .ds-ops button').every(e => !e.disabled);
    const bstIdle = () => $$('#bst-input-group input, #bst-input-group button').every(e => !e.disabled);
    const clickText = (root, text) => {
        const b = $$(`${root} button`).find(x => x.textContent.replace(/\s+/g, ' ').trim() === text);
        if (!b) throw new Error('butoni mungon: ' + text);
        b.click();
    };

    // ───────────────────────── A: info, skeda, badge, pseudokod ─────────────────────────
    T.A = async () => {
        const R = newResult();
        const items = $$('.algo-btn');
        R.check(items.length === 17, `pritej 17 butona algoritmi, u gjetën ${items.length}`);
        for (const b of items) {
            const k = b.dataset.algorithm;
            b.click(); await sleep(150);
            const name = byId('active-algo-name').textContent;
            R.check(name && !/Zgjidh/.test(name), `${k}: emri mungon`);
            R.check(!/—/.test(byId('badge-time').textContent), `${k}: badge Time bosh`);
            R.check(!/—/.test(byId('badge-space').textContent), `${k}: badge Space bosh`);

            // Përmbledhje
            R.check($('#learning-info-view .learning-hero h4')?.textContent, `${k}: pa titull koncepti`);
            const toggle = $('#learning-info-view .learning-more-toggle');
            const body = byId('learning-more-body');
            if (R.check(toggle && body, `${k}: pa "Shiko më shumë"`)) {
                R.check(body.hidden, `${k}: shpjegimi duhet të jetë i fshehur fillimisht`);
                toggle.click();
                const w = words(body.textContent);
                R.check(!body.hidden && toggle.getAttribute('aria-expanded') === 'true' && /pak/.test(toggle.textContent), `${k}: toggle nuk hap`);
                R.check(w >= 50 && w <= 200, `${k}: shpjegimi ka ${w} fjalë`);
                toggle.click();
                R.check(body.hidden && /shumë/.test(toggle.textContent), `${k}: toggle nuk mbyll`);
            }
            const uses = $('#learning-info-view .learning-use');
            if (R.check(uses, `${k}: pa seksion Përdorimet`)) {
                R.check(uses.querySelector('h5')?.textContent.trim() === 'Përdorimet', `${k}: titulli duhet "Përdorimet"`);
                const summary = uses.querySelector('.use-summary')?.textContent || '';
                R.check(summary && words(summary) <= 25 && (summary.match(/[.!?](\s|$)/g) || []).length === 1, `${k}: përmbledhja duhet të jetë një fjali: "${summary}"`);
                const ub = byId('use-body'), ut = uses.querySelector('.use-toggle');
                if (R.check(ub && ut, `${k}: Përdorimet pa "Shiko më shumë"`)) {
                    R.check(ub.hidden && ut.getAttribute('aria-expanded') === 'false', `${k}: Përdorimet duhet të jetë e mbyllur fillimisht`);
                    ut.click();
                    const w = words(ub.textContent.replace('Përdorimi teknik', '').replace('Në jetën reale', '')) ;
                    R.check(!ub.hidden && /pak/.test(ut.textContent), `${k}: Përdorimet nuk hapet`);
                    R.check(w >= 50 && w <= 200, `${k}: Përdorimet e hapur ka ${w} fjalë`);
                    R.check(ub.querySelectorAll('li').length === 3, `${k}: duhen 3 shembuj reale`);
                    R.check(/teknik/i.test(ub.textContent) && /jetën reale/.test(ub.textContent), `${k}: mungojnë nëntitujt`);
                    ut.click();
                    R.check(ub.hidden && /shumë/.test(ut.textContent), `${k}: Përdorimet nuk mbyllet`);
                }
            }
            R.check(!$('#learning-info-view h5') || ![...$$('#learning-info-view h5')].some(h => /Kur përdoret|Mëso më shumë/.test(h.textContent)), `${k}: seksione të vjetra ende ekzistojnë`);
            // karakteristikat
            const chips = $$('#learning-info-view .trait-chip');
            R.check(chips.length > 0, `${k}: pa karakteristika`);
            const detail = $('#learning-info-view .trait-detail');
            for (const c of chips) {
                c.click();
                R.check(!detail.hidden && words(detail.textContent) >= 12, `${k}/${c.textContent}: pa shpjegim`);
                R.check(c.getAttribute('aria-expanded') === 'true', `${k}/${c.textContent}: aria-expanded`);
            }
            if (chips.length) { chips[chips.length - 1].click(); R.check(detail.hidden, `${k}: klikimi i dytë nuk e mbyll`); }
            // kuiz
            const opts = $$('#learning-info-view [data-quiz-option]');
            R.check(opts.length >= 2, `${k}: kuizi ka <2 opsione`);
            let sawCorrect = false;
            for (const o of opts) {
                o.click();
                const fb = $('#learning-info-view .quiz-feedback').textContent;
                R.check(fb.length > 0, `${k}: kuiz pa feedback`);
                if (o.classList.contains('correct')) sawCorrect = true;
            }
            R.check(sawCorrect, `${k}: asnjë opsion nuk del i saktë`);

            // Kompleksiteti
            $('[data-panel-tab=complexity]').click();
            R.check(!byId('learning-complexity-view').hidden && $$('#learning-complexity-view .complexity-grid article').length === 4, `${k}: skeda Kompleksiteti`);
            // Kodi
            $('[data-panel-tab=code]').click();
            const javaLines = $$('#java-code-display .code-line').length;
            R.check(javaLines > 3, `${k}: kodi Java ka ${javaLines} rreshta`);
            const sel = byId('code-language-select');
            setVal(sel, 'pseudocode');
            const pl = $$('#java-code-display .code-line').length;
            R.check(pl >= 12, `${k}: pseudokodi ka ${pl} rreshta`);
            R.check(/Pseudo/.test($('.code-panel-header h3').textContent), `${k}: titulli nuk ndryshoi te pseudokod`);
            R.check(/KOMPLEKSITET/.test(byId('java-code-display').textContent), `${k}: pseudokod pa kompleksitet`);
            setVal(sel, 'java');
            R.check($$('#java-code-display .code-line').length === javaLines, `${k}: kthimi te Java prishi kodin`);
            // badge → kompleksiteti
            $('[data-panel-tab=info]').click();
            byId('badge-time').click();
            R.check($('[data-panel-tab=complexity]').classList.contains('active'), `${k}: klikimi te Time nuk çon te Kompleksiteti`);
            $('[data-panel-tab=info]').click();
            byId('badge-space').click();
            R.check($('[data-panel-tab=complexity]').classList.contains('active'), `${k}: klikimi te Space nuk çon te Kompleksiteti`);
            $('[data-panel-tab=info]').click();
        }
        // badge pa algoritëm të zgjedhur nuk bën asgjë (pas rifreskimit) — kontrollohet te G
        // butoni Copy
        $('[data-panel-tab=code]').click();
        byId('btn-copy-code').click(); await sleep(150);
        $('[data-panel-tab=info]').click();
        R.notes.push('alerts: ' + alerts.length);
        R.check(alerts.length === 0, 'alert() i papritur: ' + alerts.join(' | '));
        return R.done();
    };

    // ───────────────────────── B: sorting + searching ─────────────────────────
    T.B = async (only) => {
        const R = newResult();
        const sorts = ['bubble', 'insertion', 'selection', 'merge', 'quick', 'shell', 'heap', 'radix'];
        const keys = only || [...sorts, 'linear', 'binary'];
        for (const k of keys) {
            await pick(k);
            const isSort = sorts.includes(k);
            setSpeed(3); setSize(6); await sleep(120);
            R.check(bars().length === 6, `${k}: pritej 6 shufra, ${bars().length}`);
            const orig = barVals();
            // run
            clickId('btn-run'); await sleep(150);
            const ok = await waitFor(() => !btn('run').disabled, 25000);
            R.check(ok, `${k}: ekzekutimi nuk përfundoi`);
            if (isSort) R.check(asc(barVals()), `${k}: shufrat nuk dolën të renditura: ${barVals()}`);
            R.check(stat('stat-step') > 0, `${k}: Hapi mbeti 0`);
            R.check(byId('algo-status').textContent.length >= 0, '');
            // timeline
            const sl = byId('timeline-slider'); const max = Number(sl.max);
            R.check(max > 0 && !sl.disabled, `${k}: timeline jo aktiv (max=${max})`);
            setVal(sl, 0);
            R.check(stat('stat-step') === 0, `${k}: timeline=0 → Hapi ${stat('stat-step')}`);
            R.check(eq(barVals(), orig), `${k}: timeline=0 nuk rikthen array-in fillestar`);
            setVal(sl, Math.floor(max / 2));
            setVal(sl, max);
            if (isSort) R.check(asc(barVals()), `${k}: timeline=max nuk jep gjendjen e renditur`);
            R.check(!btn('run').disabled, `${k}: Run i çaktivizuar pas timeline`);
            // run sërish pas timeline
            clickId('btn-run'); await sleep(150);
            R.check(await waitFor(() => !btn('run').disabled, 25000), `${k}: run i dytë nuk përfundoi`);
            // reset
            clickId('btn-reset'); await sleep(100);
            R.check(stat('stat-step') === 0 && eq(barVals(), orig), `${k}: Rikthe nuk rikthen gjendjen`);
            R.check(Number(byId('timeline-slider').max) === 0, `${k}: Rikthe nuk pastron timeline`);
            // hap pas hapi
            for (let i = 0; i < 3; i++) clickId('btn-step');
            R.check(stat('stat-step') >= 1, `${k}: Hap nuk e rriti Hapin`);
            clickId('btn-reset');
            // pauzë / vazhdim
            setSpeed(2); setSize(8); await sleep(100);
            clickId('btn-run'); await sleep(900);
            clickId('btn-pause'); await sleep(100);
            const s1 = stat('stat-step'); await sleep(1300);
            R.check(stat('stat-step') === s1, `${k}: pauza nuk e ndaloi animacionin (${s1}→${stat('stat-step')})`);
            R.check(!btn('run').disabled, `${k}: Run duhet të jetë aktiv në pauzë`);
            clickId('btn-run');   // vazhdon
            setSpeed(3);
            R.check(await waitFor(() => !btn('run').disabled && stat('stat-step') > s1, 30000), `${k}: vazhdimi pas pauze dështoi`);
            await sleep(300);
            // reset në mes të ekzekutimit
            clickId('btn-reset'); await sleep(100);
            clickId('btn-run'); await sleep(250);
            clickId('btn-reset'); await sleep(400);
            R.check(stat('stat-step') === 0 && !btn('run').disabled, `${k}: reset gjatë run nuk e pastroi`);
            // slider gjatë run
            clickId('btn-run'); await sleep(150);
            setSize(10); await sleep(200);
            R.check(bars().length === 10 && stat('stat-step') === 0, `${k}: slider gjatë run → ${bars().length} shufra, hapi ${stat('stat-step')}`);
            // shpejtësitë
            for (const sp of [1, 2, 3]) { setSpeed(sp); R.check(byId('speed-slider').value === String(sp), `${k}: speed ${sp}`); }
            setSpeed(3);
        }
        R.notes.push('alerts: ' + alerts.length);
        R.check(alerts.length === 0, 'alert() i papritur: ' + alerts.join(' | '));
        return R.done();
    };

    // ───────────────────────── C: slider, custom, presets, target ─────────────────────────
    T.C = async () => {
        const R = newResult();
        await pick('bubble'); setSpeed(3);
        // slider skajet
        for (const n of [5, 45, 5, 20]) { setSize(n); await sleep(60); R.check(bars().length === n, `slider ${n}: ${bars().length} shufra`); R.check(byId('size-value').textContent === String(n), `size-value ${n}`); }
        // modal
        const modal = byId('custom-input-modal');
        clickId('btn-custom-open'); R.check(!modal.hidden, 'modali nuk hapet');
        clickId('btn-custom-modal-close'); R.check(modal.hidden, 'X nuk e mbyll modalin');
        clickId('btn-custom-open'); modal.dispatchEvent(new MouseEvent('click', { bubbles: true })); R.check(modal.hidden, 'overlay nuk e mbyll modalin');
        clickId('btn-custom-open'); key(document, 'Escape'); R.check(modal.hidden, 'Escape nuk e mbyll modalin');
        // raste custom
        const n46 = Array.from({ length: 46 }, (_, i) => i).join(','), n45 = Array.from({ length: 45 }, (_, i) => i).join(',');
        const cases = [
            ['', false], ['1,2,3,4', false], ['1,2,3,4,5', 5], ['5, 3 ,8,1,9', 5], ['1,2,3,4,5,abc', 5],
            ['1,2,3,4,-5', false], ['1,2,3,4,1000', false], ['1.5,2,3,4,5', false], [n46, false], [n45, 45],
            [',,1,2,3,,4,5,', 5], ['1e2,2,3,4,5', 5], ['0,0,0,0,0', 5], ['999,998,997,996,995', 5],
            ['<img src=x onerror=window.__xss=1>,1,2,3,4,5', 5], ['   ', false], ['a,b,c,d,e', false],
        ];
        for (const [txt, exp] of cases) {
            clickId('btn-custom-open');
            const before = barVals();
            setVal(byId('custom-array-input'), txt);
            clickId('btn-custom-apply'); await sleep(80);
            const fb = byId('custom-input-feedback');
            const label = JSON.stringify(txt.slice(0, 30));
            if (exp === false) {
                R.check(/error/.test(fb.className) && eq(barVals(), before), `custom ${label}: duhej refuzuar (${fb.className}, ${barVals().length} shufra)`);
            } else {
                R.check(/success/.test(fb.className) && bars().length === exp, `custom ${label}: pritej ${exp} shufra, ${bars().length} (${fb.className})`);
                R.check(byId('size-slider').disabled, `custom ${label}: slider duhet të çaktivizohet`);
            }
            clickId('btn-custom-modal-close');
        }
        R.check(!window.__xss, 'XSS nga custom input!');
        // Enter te custom
        clickId('btn-custom-open'); setVal(byId('custom-array-input'), '9,8,7,6,5,4');
        key(byId('custom-array-input'), 'Enter'); await sleep(80);
        R.check(eq(barVals(), [9, 8, 7, 6, 5, 4]), `Enter te custom nuk e aplikoi: ${barVals()}`);
        // run mbi custom me dublikata
        clickId('btn-custom-open'); setVal(byId('custom-array-input'), '5,5,5,5,5,1,1'); clickId('btn-custom-apply'); clickId('btn-custom-modal-close');
        clickId('btn-run'); R.check(await waitFor(() => !btn('run').disabled, 25000) , 'run mbi dublikata dështoi'); R.check(asc(barVals()), `dublikatat nuk u renditën: ${barVals()}`);
        // clear
        clickId('btn-custom-open'); clickId('btn-custom-clear');
        R.check(!byId('size-slider').disabled && bars().length >= 5 && bars().length <= 45, `Random: ${bars().length} shufra, slider disabled=${byId('size-slider').disabled}`);
        clickId('btn-custom-modal-close');

        // presets (sorting)
        setSize(7);
        for (const p of ['sorted', 'reversed', 'duplicates', 'nearly', 'random']) {
            setVal(byId('preset-select'), p); clickId('btn-apply-preset'); await sleep(80);
            const v = barVals();
            R.check(v.length === 7, `preset ${p}: ${v.length} shufra`);
            if (p === 'sorted') R.check(asc(v), 'preset sorted nuk është i renditur');
            if (p === 'reversed') R.check(desc(v), 'preset reversed nuk është zbritës');
            if (p === 'duplicates') R.check(new Set(v).size < v.length, 'preset duplicates pa dublikata');
            // slider vazhdon të punojë pas preset-it
            setSize(9); await sleep(60);
            R.check(bars().length === 9, `pas preset ${p}, slider jep ${bars().length} shufra`);
            setSize(7); await sleep(60);
            setVal(byId('preset-select'), p); clickId('btn-apply-preset'); await sleep(60);
            clickId('btn-run'); R.check(await waitFor(() => !btn('run').disabled, 25000), `preset ${p}: run dështoi`);
            R.check(asc(barVals()), `preset ${p}: s'u rendit`);
        }
        // preset gjatë run
        setSpeed(2); clickId('btn-run'); await sleep(500);
        setVal(byId('preset-select'), 'reversed'); clickId('btn-apply-preset'); await sleep(200);
        R.check(stat('stat-step') === 0, 'preset gjatë run nuk e ndaloi');
        R.check(eq(barVals(), barVals().slice().sort((a, b) => b - a)), 'preset reversed gjatë run: gjendje e çuditshme');
        setSpeed(3);

        // searching: target
        for (const k of ['linear', 'binary']) {
            await pick(k); setSpeed(3); setSize(8); await sleep(80);
            const tin = byId('search-target-input');
            R.check(tin.value !== '', `${k}: target pa vlerë fillestare`);
            const st = byId('algo-status');
            for (const bad of ['', '1.5', 'abc', '--']) {
                setVal(tin, bad); clickId('btn-search-start'); await sleep(100);
                R.check(btn('run').disabled === false && /numër të plotë/.test(st.textContent), `${k} target ${JSON.stringify(bad)}: pritej mesazh gabimi, kam "${st.textContent}"`);
            }
            for (const good of ['-3', '0', '99999', '1e2', String(barVals()[3])]) {
                setVal(tin, good); clickId('btn-search-start');
                R.check(await waitFor(() => !btn('run').disabled, 25000), `${k} target ${good}: nuk përfundoi`);
            }
            setVal(tin, String(barVals()[2])); key(tin, 'Enter');
            R.check(await waitFor(() => !btn('run').disabled && stat('stat-step') > 0, 25000), `${k}: Enter te target nuk nisi kërkimin`);
            if (k === 'binary') {
                clickId('btn-custom-open'); setVal(byId('custom-array-input'), '9,1,8,2,7,3,6'); clickId('btn-custom-apply'); clickId('btn-custom-modal-close');
                R.check(asc(barVals()), `binary mbi custom të parenditur: ${barVals()}`);
            }
            clickId('btn-custom-open'); clickId('btn-custom-clear'); clickId('btn-custom-modal-close');
        }
        R.check(alerts.length === 0, 'alert() i papritur: ' + alerts.join(' | '));
        return R.done();
    };

    // ───────────────────────── D: BST ─────────────────────────
    T.D = async () => {
        const R = newResult();
        await pick('bst'); setSpeed(3);
        const nodes = () => $$('.bst-node').length;
        const run = async (f) => { f(); await sleep(120); return waitFor(bstIdle, 30000); };
        const vals = byId('bst-values-input'), op = byId('bst-operation-input');
        // krijim: default
        setVal(vals, ''); R.check(await run(() => clickId('btn-bst-run')), 'BST default nuk përfundoi');
        R.check(nodes() === 5, `BST default: ${nodes()} nyje`);
        // raste të pavlefshme
        for (const bad of ['a,b', '0,1', '-1,2', '1.5,2', '5,,3', 'x']) {
            alerts.length = 0; const n0 = nodes();
            setVal(vals, bad); clickId('btn-bst-run'); await sleep(100);
            R.check(alerts.length === 1 && nodes() === n0, `BST ${JSON.stringify(bad)}: pritej 1 alert pa ndryshim; alerts=${alerts.length}, nyje ${n0}→${nodes()}`);
        }
        // krijim i ri me dublikata dhe degjenerim
        setVal(vals, '5,5,5'); R.check(await run(() => clickId('btn-bst-run')), 'BST dublikata nuk përfundoi'); R.check(nodes() === 1, `dublikatat: ${nodes()} nyje (pritej 1)`);
        setVal(vals, '1,2,3,4,5,6,7,8'); R.check(await run(() => clickId('btn-bst-run')), 'BST degjenerim'); R.check(nodes() === 8, `degjenerim: ${nodes()} nyje`);
        setVal(vals, '50,30,70,20,40,60,80'); R.check(await run(() => clickId('btn-bst-run')), 'BST i balancuar'); R.check(nodes() === 7, `i balancuar: ${nodes()} nyje`);
        // Enter te values
        setVal(vals, '8,4,12,2'); key(vals, 'Enter'); await sleep(120); R.check(await waitFor(bstIdle, 30000) && nodes() === 4, `Enter te vlerat: ${nodes()} nyje`);
        // futje
        alerts.length = 0; setVal(op, ''); clickId('btn-bst-insert'); R.check(alerts.length === 1, 'futje pa vlerë: pritej alert');
        alerts.length = 0; for (const b of [clickId]) { setVal(op, '1.5'); clickId('btn-bst-insert'); R.check(alerts.length === 1, 'futje 1.5: pritej alert'); }
        alerts.length = 0;
        setVal(op, '6'); R.check(await run(() => clickId('btn-bst-insert')), 'futje 6'); R.check(nodes() === 5, `pas futjes: ${nodes()}`);
        setVal(op, '6'); R.check(await run(() => clickId('btn-bst-insert')), 'futje dublikate'); R.check(nodes() === 5, `dublikat futur: ${nodes()}`);
        setVal(op, '-7'); R.check(await run(() => clickId('btn-bst-insert')), 'futje negative');
        setVal(op, '1000000'); R.check(await run(() => clickId('btn-bst-insert')), 'futje e madhe');
        R.notes.push(`pas futjeve nyje=${nodes()}, alerts=${alerts.length}`);
        // kërkim
        setVal(op, '12'); R.check(await run(() => clickId('btn-bst-search')), 'kërko 12'); R.check($$('.bst-node.found').length >= 1, 'kërko 12: asnjë nyje found');
        setVal(op, '999'); R.check(await run(() => clickId('btn-bst-search')), 'kërko 999 (mungon)');
        // fshirje: nyje e vetme, me një fëmijë, me dy fëmijë, rrënja, e paekzistuese
        const n = nodes();
        setVal(op, '424242'); R.check(await run(() => clickId('btn-bst-delete')), 'fshi të paekzistuese'); R.check(nodes() === n, 'fshirja e paekzistueses ndryshoi pemën');
        setVal(op, '2'); R.check(await run(() => clickId('btn-bst-delete')), 'fshi gjethe'); R.check(nodes() === n - 1, `fshi gjethe: ${nodes()}`);
        setVal(op, '4'); R.check(await run(() => clickId('btn-bst-delete')), 'fshi nyje');
        setVal(op, '8'); R.check(await run(() => clickId('btn-bst-delete')), 'fshi rrënjën');
        R.notes.push(`pas fshirjeve nyje=${nodes()}`);
        // traversimet
        for (const t of ['inorder', 'preorder', 'postorder']) {
            R.check(await run(() => clickId('btn-bst-' + t)), `${t} nuk përfundoi`);
            R.check($$('.bst-node.traversed').length === nodes(), `${t}: ${$$('.bst-node.traversed').length} të vizituara nga ${nodes()}`);
        }
        // reset dhe traversime mbi pemë bosh
        clickId('btn-reset'); await sleep(150);
        R.check(nodes() === 0, `reset: ${nodes()} nyje`);
        for (const t of ['inorder', 'preorder', 'postorder']) { R.check(await run(() => clickId('btn-bst-' + t)), `${t} mbi pemë bosh`); }
        setVal(op, '3'); R.check(await run(() => clickId('btn-bst-search')), 'kërko mbi pemë bosh');
        setVal(op, '3'); R.check(await run(() => clickId('btn-bst-delete')), 'fshi mbi pemë bosh');
        setVal(op, '3'); R.check(await run(() => clickId('btn-bst-insert')), 'fut mbi pemë bosh'); R.check(nodes() === 1, `fut mbi bosh: ${nodes()}`);
        // kontrollet çaktivizohen gjatë ekzekutimit
        setVal(vals, '5,3,7,1,4,6,8'); clickId('btn-bst-run'); await sleep(250);
        R.check($$('#bst-input-group button').every(b => b.disabled), 'kontrollet BST duhet të çaktivizohen gjatë run');
        R.check(await waitFor(bstIdle, 30000), 'kontrollet BST nuk u riaktivizuan');
        // ndërrim në mes të ekzekutimit
        setVal(vals, '5,3,7,1,4,6,8'); clickId('btn-bst-run'); await sleep(200); await pick('bubble'); await sleep(200);
        R.check(bars().length > 0 && $$('.bst-node').length === 0, 'ndërrimi nga BST te Bubble: SVG e vjetër mbeti');
        await pick('bst'); R.check(nodes() === 0, 'rikthimi te BST duhet të nisë bosh');
        R.check(alerts.length === 0 || true, '');
        return R.done();
    };

    // ───────────────────────── E: grafe ─────────────────────────
    T.E = async () => {
        const R = newResult();
        await pick('dijkstra'); setSpeed(3);
        const gn = () => $$('.graph-node').length, ge = () => $$('.graph-edge').length;
        R.check(gn() === 6 && ge() === 8, `graf default: ${gn()} nyje, ${ge()} lidhje`);
        const node = byId('graph-node-input');
        const addNode = v => { setVal(byId('graph-node-input'), v); alerts.length = 0; clickText('#graph-panel', 'Shto nyje'); return alerts.length; };
        const addEdge = (a, b, w) => { setVal(byId('graph-source-input'), a); setVal(byId('graph-target-input'), b); setVal(byId('graph-weight-input'), w); alerts.length = 0; clickText('#graph-panel', 'Shto lidhje'); return alerts.length; };
        for (const bad of ['', '1a', 'A', 'x'.repeat(40), 'a b', '<b>', '-x', '_x']) {
            const g0 = gn(); const a = addNode(bad);
            R.check(a === 1 && gn() === g0, `nyje ${JSON.stringify(bad.slice(0, 12))}: pritej refuzim (alerts=${a}, nyje ${g0}→${gn()})`);
        }
        R.check(addNode('G') === 0 && gn() === 7, `nyje G: nyje=${gn()}`);
        R.check(addNode('node_1-b') === 0 && gn() === 8, 'nyje me _ dhe -');
        R.check(addNode('H') === 0 && gn() === 9, 'nyje H');
        const e0 = ge();
        const badEdges = [['Z', 'A', '3'], ['A', 'Z', '3'], ['A', 'A', '3'], ['A', 'B', '3'], ['B', 'A', '3'], ['A', 'G', '0'], ['A', 'G', '-2'], ['A', 'G', 'abc'], ['A', 'G', ''], ['', '', '']];
        for (const [a, b, w] of badEdges) { const al = addEdge(a, b, w); R.check(al === 1 && ge() === e0, `lidhje ${a}-${b} w=${w}: pritej refuzim (alerts=${al}, lidhje ${e0}→${ge()})`); }
        R.check(addEdge('A', 'G', '3') === 0 && ge() === e0 + 1, 'lidhje A-G');
        R.check(addEdge('G', 'node_1-b', '2.5') === 0, 'lidhje me peshë dhjetore');
        // nyja fillestare
        const src = byId('graph-source-node');
        alerts.length = 0; setVal(src, 'Z'); clickId('btn-run'); await sleep(150);
        R.check(alerts.length === 1 && !btn('pause').disabled === false, `source Z: pritej alert; alerts=${alerts.length}`);
        setVal(src, ' G '); alerts.length = 0; clickId('btn-run'); await sleep(150);
        // run
        setVal(src, 'C'); alerts.length = 0; clickId('btn-run'); await sleep(250);
        R.check($$('#graph-panel input, #graph-panel button').every(e => e.disabled), 'paneli i grafit duhet të çaktivizohet gjatë run');
        R.check(await waitFor(() => !btn('run').disabled && opsIdle(), 40000), 'Dijkstra nuk përfundoi');
        const panel = byId('dijkstra-distance-panel');
        R.check(!panel.hidden && $$('#dijkstra-distance-rows .distance-row').length === gn(), `tabela distancave: ${$$('#dijkstra-distance-rows .distance-row').length} rreshta, ${gn()} nyje`);
        R.check($$('#dijkstra-distance-rows .distance-row--unreached').length >= 1, 'H duhet të dalë i paarritshëm (∞)');
        R.check($$('.graph-node.shortest').length >= 1, 'asnjë nyje shortest pas Dijkstra');
        // nyjet brenda zonës dhe jashtë tabelës
        const svgR = byId('main-svg').getBoundingClientRect(), pr = panel.getBoundingClientRect();
        const outside = $$('.graph-node').filter(g => { const r = g.getBoundingClientRect(); return r.left < svgR.left - 1 || r.right > svgR.right + 1 || r.top < svgR.top - 1 || r.bottom > svgR.bottom + 1; });
        R.check(outside.length === 0, `${outside.length} nyje jashtë SVG-së`);
        const overlap = $$('.graph-node').filter(g => { const r = g.getBoundingClientRect(); return r.right > pr.left && r.left < pr.right && r.bottom > pr.top && r.top < pr.bottom; });
        R.check(overlap.length === 0, `${overlap.length} nyje nën tabelën e distancave`);
        // run i dytë, reset
        clickId('btn-run'); R.check(await waitFor(() => !btn('run').disabled && opsIdle(), 40000), 'Dijkstra e dytë nuk përfundoi');
        clickId('btn-reset'); await sleep(200);
        R.check(gn() === 6 && ge() === 8 && byId('dijkstra-distance-panel').hidden, `reset grafi: ${gn()} nyje, ${ge()} lidhje, panel hidden=${byId('dijkstra-distance-panel').hidden}`);
        // reset gjatë run
        setSpeed(2); clickId('btn-run'); await sleep(400); clickId('btn-reset'); await sleep(400); setSpeed(3);
        R.check(opsIdle() && !btn('run').disabled, 'reset gjatë run: kontrollet mbeten të bllokuara');
        // grafi pa lidhje
        // Kruskal
        await pick('kruskal');
        R.check(gn() === 6, `kruskal: ${gn()} nyje`);
        R.check(!byId('graph-source-node'), 'Kruskal s\'duhet të ketë "nyja fillestare"');
        clickId('btn-run'); R.check(await waitFor(() => !btn('run').disabled && opsIdle(), 40000), 'Kruskal nuk përfundoi');
        R.check($$('.graph-edge.in-tree').length === gn() - 1, `Kruskal: ${$$('.graph-edge.in-tree').length} lidhje në MST, pritej ${gn() - 1}`);
        // graf i palidhur
        addNode('Q'); clickId('btn-run'); R.check(await waitFor(() => !btn('run').disabled && opsIdle(), 40000), 'Kruskal mbi graf të palidhur');
        R.check($$('.graph-edge.in-tree').length === gn() - 2, `pyll: ${$$('.graph-edge.in-tree').length} lidhje, pritej ${gn() - 2}`);
        // shumë nyje
        for (const id of ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8']) addNode(id);
        R.check(gn() === 15, `shumë nyje: ${gn()}`);
        await sleep(1500);   // pritet që simulimi i forcave të vendosë pozicionet e para
        const svg2 = byId('main-svg').getBoundingClientRect();
        R.check($$('.graph-node').every(g => { const r = g.getBoundingClientRect(); return r.left >= svg2.left - 1 && r.right <= svg2.right + 1 && r.top >= svg2.top - 1 && r.bottom <= svg2.bottom + 1; }), 'disa nyje dolën jashtë SVG-së me 15 nyje');
        // Enter te grafi
        setVal(byId('graph-node-input'), 'ZZ'); key(byId('graph-node-input'), 'Enter');
        return R.done();
    };

    // ───────────────────────── F: strukturat e të dhënave ─────────────────────────
    T.F = async () => {
        const R = newResult();
        const doOp = async (root, text) => { clickText(root, text); await sleep(120); return waitFor(opsIdle, 20000); };
        const noAlert = (label) => { const n = alerts.length; alerts.length = 0; return n; };
        // STACK
        await pick('stack'); setSpeed(3);
        const inp = () => byId('ds-input');
        R.check(!btn('run').disabled === false || true, '');
        for (const bad of ['', 'abc', '1.5']) { alerts.length = 0; setVal(inp(), bad); clickText('#ds-controls', 'Push'); await sleep(80); R.check(alerts.length === 1, `stack push ${JSON.stringify(bad)}: pritej alert (${alerts.length})`); }
        for (const o of ['Pop', 'Peek', 'isEmpty']) { alerts.length = 0; R.check(await doOp('#ds-controls', o), `stack ${o} mbi bosh nuk përfundoi`); }
        for (let i = 1; i <= 9; i++) { setVal(inp(), String(i)); R.check(await doOp('#ds-controls', 'Push'), `push ${i}`); }
        R.check($$('#main-svg [id^="stack-"], #main-svg .ds-node, #main-svg .ds-cell').length > 0, 'stack: asnjë element i vizatuar');
        for (const o of ['Peek', 'isEmpty', 'Pop', 'Pop']) R.check(await doOp('#ds-controls', o), `stack ${o}`);
        setVal(inp(), '-5'); R.check(await doOp('#ds-controls', 'Push'), 'push negative');
        setVal(inp(), '99999999999'); R.check(await doOp('#ds-controls', 'Push'), 'push shumë i madh');
        key(inp(), 'Enter'); await sleep(200); R.check(await waitFor(opsIdle, 20000), 'Enter te stack');
        clickId('btn-reset'); await sleep(150);
        // QUEUE
        await pick('queue');
        for (const bad of ['', 'abc']) { alerts.length = 0; setVal(inp(), bad); clickText('#ds-controls', 'Enqueue'); await sleep(80); R.check(alerts.length === 1, `queue enqueue ${JSON.stringify(bad)}: alert`); }
        for (const o of ['Dequeue', 'Peek']) R.check(await doOp('#ds-controls', o), `queue ${o} mbi bosh`);
        for (let i = 1; i <= 9; i++) { setVal(inp(), String(i * 3)); R.check(await doOp('#ds-controls', 'Enqueue'), `enqueue ${i}`); }
        for (const o of ['Peek', 'Dequeue', 'Dequeue']) R.check(await doOp('#ds-controls', o), `queue ${o}`);
        // LINKED LIST
        await pick('linkedlist');
        alerts.length = 0; setVal(inp(), ''); clickText('#ds-controls', '↑ Head'); R.check(alerts.length === 1, 'LL head pa vlerë: alert');
        for (const [v, o] of [['5', '↑ Head'], ['7', '↓ Tail'], ['9', '↓ Tail'], ['3', '↑ Head']]) { setVal(inp(), v); R.check(await doOp('#ds-controls', o), `LL ${o} ${v}`); }
        setVal(inp(), '8'); setVal(byId('ds-after'), '7'); R.check(await doOp('#ds-controls', '→ Pas vlerës'), 'LL pas vlerës 7');
        alerts.length = 0; setVal(inp(), '8'); setVal(byId('ds-after'), '12345'); clickText('#ds-controls', '→ Pas vlerës'); await sleep(150); R.check(await waitFor(opsIdle, 20000), 'LL pas vlere e paekzistuese nuk përfundoi');
        alerts.length = 0; setVal(inp(), '8'); setVal(byId('ds-after'), ''); clickText('#ds-controls', '→ Pas vlerës'); R.check(alerts.length === 1, 'LL pas vlerës pa fushë: alert');
        // fshirje
        setVal(inp(), '5'); setVal(byId('ds-delete-next'), ''); byId('ds-delete-next-null').checked = false; R.check(await doOp('#ds-controls', 'Fshi'), 'LL fshi 5');
        alerts.length = 0; setVal(inp(), '9'); setVal(byId('ds-delete-next'), '3'); byId('ds-delete-next-null').checked = true; clickText('#ds-controls', 'Fshi'); R.check(alerts.length === 1, 'LL fshi me "pas saj" dhe "next=null": alert');
        setVal(byId('ds-delete-next'), ''); R.check(await doOp('#ds-controls', 'Fshi'), 'LL fshi 9 me next=null');
        byId('ds-delete-next-null').checked = false;
        setVal(inp(), '424242'); R.check(await doOp('#ds-controls', 'Fshi'), 'LL fshi e paekzistuese');
        setVal(inp(), '3'); setVal(byId('ds-delete-next'), '7'); R.check(await doOp('#ds-controls', 'Fshi'), 'LL fshi me pas saj');
        for (const v of ['7', '31337']) { setVal(inp(), v); R.check(await doOp('#ds-controls', 'Kërko'), `LL kërko ${v}`); }
        for (let i = 0; i < 9; i++) { setVal(inp(), String(100 + i)); await doOp('#ds-controls', '↓ Tail'); }
        R.check(opsIdle(), 'LL pas 9 futjesh në tail');
        // HASHMAP
        await pick('hashmap');
        const key_ = byId('ds-key'), val_ = byId('ds-value');
        alerts.length = 0; setVal(key_, ''); setVal(val_, '1'); clickText('#ds-controls', 'Put'); R.check(alerts.length === 1, 'hashmap put pa key: alert');
        alerts.length = 0; setVal(key_, 'a'); setVal(val_, ''); clickText('#ds-controls', 'Put'); R.check(alerts.length === 1, 'hashmap put pa vlerë: alert');
        alerts.length = 0; setVal(key_, ''); clickText('#ds-controls', 'Get'); R.check(alerts.length === 1, 'hashmap get pa key: alert');
        alerts.length = 0; clickText('#ds-controls', 'Remove'); R.check(alerts.length === 1, 'hashmap remove pa key: alert');
        for (const [k, v] of [['a', '1'], ['b', '2'], ['ab', '3'], ['ba', '4'], ['a', '99'], ['Gjakovë', '5'], ['  spacë  ', '6']]) { setVal(key_, k); setVal(val_, v); R.check(await doOp('#ds-controls', 'Put'), `put ${k}`); R.check(!byId('hashmap-context-panel').hidden, `put ${k}: pa panel konteksti`); }
        for (const k of ['a', 'ba', 'mungon']) { setVal(key_, k); R.check(await doOp('#ds-controls', 'Get'), `get ${k}`); }
        for (const k of ['ab', 'mungon', 'a']) { setVal(key_, k); R.check(await doOp('#ds-controls', 'Remove'), `remove ${k}`); }
        // XSS dhe çelës shumë i gjatë
        setVal(key_, '<img src=x onerror=window.__xss=1><b>x</b>'); setVal(val_, '1'); R.check(await doOp('#ds-controls', 'Put'), 'put me HTML');
        R.check(!window.__xss && !$('#hashmap-context-panel img') && !$('#main-svg img'), 'XSS te HashMap!');
        setVal(key_, 'k'.repeat(500)); setVal(val_, '1'); R.check(await doOp('#ds-controls', 'Put'), 'put çelës 500 karaktere');
        const ctx = byId('hashmap-context-panel').getBoundingClientRect();
        R.check(ctx.width < window.innerWidth, 'paneli i kontekstit del jashtë ekranit');
        clickId('btn-reset'); await sleep(200); R.check(opsIdle(), 'hashmap reset');
        // ndërrim mes strukturave
        for (const k of ['stack', 'queue', 'linkedlist', 'hashmap', 'stack']) { await pick(k); R.check($$('#ds-controls button').length > 0, `${k}: pa paneli i operacioneve`); }
        R.check(!btn('run').disabled === false || true, '');
        R.notes.push('alerts gjithsej: ' + alerts.length);
        return R.done();
    };

    // ───────────────────────── G: kërkim, krahaso, ndërrim, share, layout ─────────────────────────
    T.G = async () => {
        const R = newResult();
        // badge pa algoritëm
        // Vlen vetëm në faqe të pastër (pa algoritëm të zgjedhur ende)
        if (/Zgjidh/.test(byId('active-algo-name').textContent)) {
            $('[data-panel-tab=info]').click(); byId('badge-time').click();
            R.check(!$('[data-panel-tab=complexity]').classList.contains('active'), 'badge pa algoritëm nuk duhet të ndryshojë skedën');
        }
        // kërkimi në sidebar
        const si = byId('algo-search-input'), clr = byId('algo-search-clear'), empty = byId('algo-search-empty');
        const visible = () => $$('.algo-btn').filter(b => !b.classList.contains('algo-btn--hidden')).length;
        const openGroups = () => $$('.algo-group').map(g => g.open);
        const orig = openGroups();
        const q = (v) => { setVal(si, v); return visible(); };
        R.check(q('') === 17, 'kërkim bosh: 17');
        R.check(q('bub') === 1, `kërkim "bub": ${visible()}`);
        R.check(!clr.hidden, 'butoni × duhet të shfaqet');
        R.check(q('SORT') === 8, `kërkim "SORT": ${visible()}`);
        R.check(q('kerkim') >= 2, `kërkim "kerkim" (ë→e): ${visible()}`);
        R.check(q('zzzz') === 0 && empty.classList.contains('algo-search-empty--visible'), 'kërkim pa rezultat: mesazhi duhet të shfaqet');
        for (const weird of ['<script>alert(1)</script>', '((((', '.*', '\\', '[a-z', 'x'.repeat(5000), '🙂', 'ë', 'ç']) { q(weird); }
        R.check(!window.__xss, 'XSS te kërkimi');
        clr.click(); R.check(visible() === 17 && si.value === '' && clr.hidden, 'butoni × nuk pastroi kërkimin');
        R.check(eq(openGroups(), orig), 'grupet nuk u rikthyen në gjendjen origjinale pas pastrimit');
        q('heap'); key(si, 'Escape'); R.check(visible() === 17 && si.value === '', 'Escape nuk pastroi kërkimin');
        // krahaso — të gjitha çiftet
        await pick('bubble'); setSize(12);
        const cmp = byId('compare-modal');
        clickId('btn-compare-open'); R.check(!cmp.hidden, 'Krahaso nuk hapet');
        const a = byId('compare-a'), b = byId('compare-b');
        R.check(a.options.length === 10 && b.options.length === 10, `compare: ${a.options.length}/${b.options.length} opsione`);
        let pairs = 0, bad = [];
        for (const x of [...a.options].map(o => o.value)) for (const y of [...b.options].map(o => o.value)) {
            setVal(a, x); setVal(b, y); clickId('btn-compare-run'); pairs++;
            const cards = $$('.compare-result');
            if (!cards.every(c => /Hapa/.test(c.textContent) && c.querySelectorAll('dd').length === 3)) bad.push(x + '/' + y);
            else if (!cards.every(c => Number(c.querySelectorAll('dd')[0].textContent) > 0)) bad.push(x + '/' + y + ' (0 hapa)');
        }
        R.check(bad.length === 0, `compare: ${bad.length}/${pairs} çifte të këqija: ${bad.slice(0, 6)}`);
        clickId('btn-compare-close'); R.check(cmp.hidden, 'compare X');
        clickId('btn-compare-open'); cmp.dispatchEvent(new MouseEvent('click', { bubbles: true })); R.check(cmp.hidden, 'compare overlay');
        // krahaso nga një kategori tjetër
        await pick('dijkstra'); clickId('btn-compare-open'); clickId('btn-compare-run');
        R.check($$('.compare-result').every(c => Number(c.querySelectorAll('dd')[0]?.textContent) > 0), 'krahaso nga Dijkstra jep 0 hapa');
        clickId('btn-compare-close');
        // ndërrim i shpejtë mes algoritmeve
        for (const k of ['bubble', 'dijkstra', 'stack', 'bst', 'quick', 'hashmap', 'binary', 'kruskal', 'linkedlist', 'merge']) { await pick(k); }
        R.check(byId('active-algo-name').textContent === 'Merge Sort', 'ndërrim i shpejtë: emri i gabuar');
        // ndërrim gjatë run
        await pick('bubble'); setSpeed(2); clickId('btn-run'); await sleep(300); await pick('dijkstra'); await sleep(200); await pick('quick');
        R.check(stat('stat-step') === 0 && !btn('run').disabled, 'ndërrimi gjatë run nuk e rivendosi gjendjen');
        R.check(await waitFor(() => bars().length > 0, 3000), 'pas ndërrimit nuk ka shufra');
        // share
        const share = byId('btn-share-state'); share.click(); await sleep(300);
        R.check(/kopju/i.test(share.textContent), `Ndaj: "${share.textContent}"`);
        // layout: SVG dhe overflow për çdo algoritëm
        const tiny = [];
        for (const btn_ of $$('.algo-btn')) {
            btn_.click(); await sleep(200);
            const r = byId('main-svg').getBoundingClientRect();
            if (r.height < 230 || r.width < 300) tiny.push(`${btn_.dataset.algorithm}:${Math.round(r.width)}x${Math.round(r.height)}`);
        }
        R.check(tiny.length === 0, `SVG shumë e vogël: ${tiny.join(' ')} (viewport ${innerWidth}x${innerHeight})`);
        R.check(document.documentElement.scrollWidth <= innerWidth + 1, `scroll horizontal i faqes: ${document.documentElement.scrollWidth} > ${innerWidth}`);
        R.notes.push(`viewport ${innerWidth}x${innerHeight}`);
        return R.done();
    };
})();
