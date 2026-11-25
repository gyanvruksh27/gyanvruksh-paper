// js/question-bank.js — Gyan Vruksh 3.3 (Clean Error-Free JS + DOM-Isolated Smart Table Engine + Online Library + Visual Table Builder)

(function () {
    'use strict';

    // Global Safety Error Banner (so screen never stays silently blank if anything ever breaks)
    window.addEventListener('error', function (ev) {
        if (!ev || !ev.message) return;
        let errBar = document.getElementById('gvRuntimeErrBar');
        if (!errBar && document.body) {
            errBar = document.createElement('div');
            errBar.id = 'gvRuntimeErrBar';
            errBar.style.cssText = 'position:fixed; bottom:10px; left:10px; right:10px; background:#fef2f2; color:#991b1b; border:2px solid #dc2626; padding:10px 14px; border-radius:8px; font-size:13px; z-index:9999999; font-family:sans-serif;';
            document.body.appendChild(errBar);
        }
        if (errBar) {
            errBar.innerHTML = '<strong>⚠️ ટેકનિકલ ભૂલ:</strong> ' + String(ev.message) + ' <button onclick="this.parentNode.remove()" style="float:right; background:#dc2626; color:#fff; border:none; border-radius:4px; padding:2px 8px; cursor:pointer;">✖</button>';
        }
    });

    // ==========================================
    // 1. CONSTANTS, STORAGE KEYS & DEFAULTS
    // ==========================================
    const LS_QUESTIONS = 'gyanVruksh_questions';
    const LS_PAPERS = 'gyanVruksh_papers';
    const LS_PROFILE = 'gyanVruksh_schoolProfile';
    const LS_PDF_SET = 'gyanVruksh_pdfSettings';
    const LS_CATALOG_LOADED = 'gyanVruksh_catalogAutoLoaded';

    window.DEFAULT_INSTRUCTIONS = {
        'MCQ': 'નીચે આપેલા પ્રશ્નોના સાચા વિકલ્પ પસંદ કરી ઉત્તર લખો.',
        'ખાલી જગ્યા': 'યોગ્ય શબ્દ વડે ખાલી જગ્યા પૂરો.',
        'વિકલ્પ સાથે ખાલી જગ્યા': 'કૌંસમાં આપેલા વિકલ્પોમાંથી યોગ્ય વિકલ્પ પસંદ કરી ખાલી જગ્યા પૂરો.',
        'ખરા-ખોટા': 'નીચેના વિધાનો ખરાં છે કે ખોટાં તે જણાવો.',
        'જોડકા જોડો': 'યોગ્ય જોડકાં જોડો.',
        'એક વાક્યમાં જવાબ આપો': 'નીચેના પ્રશ્નોના એક વાક્યમાં ઉત્તર લખો.',
        'એક શબ્દમાં ઉત્તર': 'નીચેના પ્રશ્નોના એક શબ્દમાં ઉત્તર લખો.',
        'વ્યાખ્યા આપો': 'નીચે આપેલા પદોની વ્યાખ્યા આપો.',
        'સૂત્ર / એકમ લખો': 'નીચે આપેલાના સૂત્ર અથવા વ્યાખ્યા લખો.',
        'પૂરું નામ લખો': 'નીચે આપેલા સંક્ષિપ્ત નામોના પૂરા નામ લખો.',
        'અસંગત પદ શોધો': 'નીચે આપેલામાંથી અસંગત પદ શોધીને લખો.',
        'સંબંધ પૂર્ણ કરો': 'પ્રથમ જોડીનો સંબંધ સમજી બીજી જોડી પૂર્ણ કરો.',
        'આકૃતિ ઓળખો': 'આપેલ આકૃતિ ઓળખી તેના નામ અથવા ભાગો જણાવો.',
        'વિધાન અને કારણ': 'નીચે આપેલા વિધાન (A) અને કારણ (R) વાંચી સાચો વિકલ્પ પસંદ કરો.',
        'સમાનાર્થી / વિરુદ્ધાર્થી': 'માગ્યા મુજબ સમાનાર્થી કે વિરુદ્ધાર્થી શબ્દ લખો.',
        'જોડણી સુધારો': 'નીચે આપેલા શબ્દોની સાચી જોડણી લખો.',
        'રૂઢિપ્રયોગ': 'નીચે આપેલા રૂઢિપ્રયોગનો અર્થ આપી વાક્યમાં પ્રયોગ કરો.',
        'Do as directed': 'Do as directed.',
        'Identify the function': 'Identify the language function used in the following sentences.',
        'ટૂંકમાં જવાબ આપો': 'નીચેના પ્રશ્નોના ટૂંકમાં ઉત્તર લખો.',
        'માગ્યા મુજબ જવાબ આપો': 'નીચેના પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો.',
        'સવિસ્તાર જવાબ આપો': 'નીચેના પ્રશ્નોના સવિસ્તાર ઉત્તર લખો.'
    };

    const SECTION_A_TYPE_ORDER = [
        'MCQ',
        'ખાલી જગ્યા',
        'વિકલ્પ સાથે ખાલી જગ્યા',
        'ખરા-ખોટા',
        'એક વાક્યમાં જવાબ આપો',
        'એક શબ્દમાં ઉત્તર',
        'વ્યાખ્યા આપો',
        'સૂત્ર / એકમ લખો',
        'પૂરું નામ લખો',
        'અસંગત પદ શોધો',
        'સંબંધ પૂર્ણ કરો',
        'આકૃતિ ઓળખો',
        'વિધાન અને કારણ',
        'જોડકા જોડો'
    ];

    const ALL_SECTIONS = ['None', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

    let appState = {
        activeTab: 'dashboard',
        questions: [],
        papers: [],
        profile: { name: 'જ્ઞાન વૃક્ષ વિદ્યાલય', address: '' },
        pdfSettings: { examName: true, date: true, std: true, subject: true, marks: true, numbering: 'continuous', watermark: '' },
        filters: { std: '', subject: '', chapter: '', type: '', instruction: '', marks: '', search: '', page: 1 },
        draft: createEmptyDraft(),
        deferredInstallPrompt: null
    };

    function createEmptyDraft() {
        return {
            id: '',
            title: 'એકમ કસોટી / પ્રશ્નપત્ર',
            standard: '',
            subject: '',
            lang: 'gu',
            date: new Date().toISOString().slice(0, 10),
            sectionOrder: ['None', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
            sectionsMetadata: {
                A: { instruction: '', attemptCount: 0, attempt: '' },
                B: { instruction: '', attemptCount: 0, attempt: '' },
                C: { instruction: '', attemptCount: 0, attempt: '' },
                D: { instruction: '', attemptCount: 0, attempt: '' }
            },
            questions: [],
            selectedChapters: []
        };
    }

    // ==========================================
    // 2. SAFE STORAGE & UTILITIES
    // ==========================================
    function safeParse(str, fallback) {
        try {
            const parsed = JSON.parse(str);
            return parsed !== null && parsed !== undefined ? parsed : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function loadAllFromStorage() {
        let qs = safeParse(localStorage.getItem(LS_QUESTIONS), null);
        if (!Array.isArray(qs)) {
            const legacy1 = safeParse(localStorage.getItem('gyanVruksh_questionBank'), null);
            const legacy2 = safeParse(localStorage.getItem('questions'), null);
            qs = Array.isArray(legacy1) ? legacy1 : (Array.isArray(legacy2) ? legacy2 : []);
            if (qs.length > 0) saveQuestionsToStorage(qs);
        }
        appState.questions = qs;

        const papers = safeParse(localStorage.getItem(LS_PAPERS), []);
        appState.papers = Array.isArray(papers) ? papers : [];

        const profile = safeParse(localStorage.getItem(LS_PROFILE), null);
        if (profile && typeof profile === 'object') appState.profile = Object.assign({ name: 'જ્ઞાન વૃક્ષ વિદ્યાલય', address: '' }, profile);

        const pdfSet = safeParse(localStorage.getItem(LS_PDF_SET), null);
        if (pdfSet && typeof pdfSet === 'object') {
            appState.pdfSettings = Object.assign({ examName: true, date: true, std: true, subject: true, marks: true, numbering: 'continuous', watermark: '' }, pdfSet);
        }
    }

    function saveQuestionsToStorage(list) {
        appState.questions = list || appState.questions;
        try {
            localStorage.setItem(LS_QUESTIONS, JSON.stringify(appState.questions));
            return true;
        } catch (e) {
            window.showToast('⚠️ બ્રાઉઝર મેમરી (localStorage) ફૂલ થઈ ગઈ છે! કૃપા કરીને બિનજરૂરી ઈમેજ/પ્રશ્નો ઘટાડો અથવા વિષયવાર બેકઅપ રાખો.', 'error');
            return false;
        }
    }

    function savePapersToStorage() {
        try {
            localStorage.setItem(LS_PAPERS, JSON.stringify(appState.papers));
        } catch (e) {
            window.showToast('⚠️ પેપર સેવ કરવામાં મેમરીની સમસ્યા આવી.', 'error');
        }
    }

    function saveProfileAndSettings() {
        localStorage.setItem(LS_PROFILE, JSON.stringify(appState.profile));
        localStorage.setItem(LS_PDF_SET, JSON.stringify(appState.pdfSettings));
    }

    function escapeHtml(str) {
        return String(str === null || str === undefined ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function escapeAttr(str) {
        return escapeHtml(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function sortAlphaNum(a, b) {
        return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
    }

    window.showToast = function (msg, type) {
        let holder = document.getElementById('gvToastHolder');
        if (!holder) {
            holder = document.createElement('div');
            holder.id = 'gvToastHolder';
            holder.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:999999; display:flex; flex-direction:column; gap:8px; max-width:340px;';
            document.body.appendChild(holder);
        }
        const t = document.createElement('div');
        const bg = type === 'error' ? '#dc2626' : (type === 'info' ? '#2563eb' : '#16a34a');
        t.style.cssText = 'background:' + bg + '; color:#fff; padding:10px 16px; border-radius:8px; font-size:13.5px; font-weight:600; box-shadow:0 6px 18px rgba(0,0,0,0.22); transition:opacity 0.3s; line-height:1.5;';
        t.textContent = msg;
        holder.appendChild(t);
        setTimeout(() => {
            t.style.opacity = '0';
            setTimeout(() => t.remove(), 320);
        }, 3200);
    };

    window.getEffectiveInstruction = function (q) {
        if (!q || q.type === 'instruction') return '';
        if (q.instruction && String(q.instruction).trim() !== '') return String(q.instruction).trim();
        return window.DEFAULT_INSTRUCTIONS[q.type] || '';
    };

    window.sortSectionAQuestions = function (items) {
        return (items || []).slice().sort((a, b) => {
            const ia = SECTION_A_TYPE_ORDER.indexOf(a.type);
            const ib = SECTION_A_TYPE_ORDER.indexOf(b.type);
            const oa = ia === -1 ? 999 : ia;
            const ob = ib === -1 ? 999 : ib;
            return oa - ob;
        });
    };

    window.calculateSectionEffectiveMarks = function (secQuestions, secMeta) {
        const realQs = (secQuestions || []).filter(q => q && q.type !== 'instruction' && q.type !== 'auto_instruction');
        const attNum = secMeta && Number(secMeta.attemptCount) > 0 ? Number(secMeta.attemptCount) : 0;
        if (attNum > 0 && attNum < realQs.length) {
            return realQs.slice(0, attNum).reduce((s, q) => s + Number(q.marks || 0), 0);
        }
        return realQs.reduce((s, q) => s + Number(q.marks || 0), 0);
    };

    // ==========================================
    // 3. INJECT COMPLETE UI + TABLE + MATH CSS
    // ==========================================
    function injectGlobalStyles() {
        if (document.getElementById('gvAppGlobalStyles')) return;
        const style = document.createElement('style');
        style.id = 'gvAppGlobalStyles';
        style.textContent = `
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; font-family: 'Noto Sans Gujarati', 'Inter', 'Mukta Vaani', 'Shruti', sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.65; }
            .gv-shell { min-height: 100vh; display: flex; flex-direction: column; }
            .gv-topbar { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #fff; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; box-shadow: 0 3px 10px rgba(15,23,42,0.2); position: sticky; top: 0; z-index: 900; }
            .gv-brand { display: flex; align-items: center; gap: 10px; }
            .gv-brand h1 { margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 0.2px; }
            .gv-brand small { display: block; font-size: 11.5px; color: #bfdbfe; font-weight: 500; }
            .gv-nav { background: #ffffff; border-bottom: 1.5px solid #e2e8f0; display: flex; gap: 6px; padding: 8px 14px; overflow-x: auto; -webkit-overflow-scrolling: touch; position: sticky; top: 56px; z-index: 850; }
            .gv-tab-btn { border: 1.5px solid #e2e8f0; background: #f8fafc; color: #334155; padding: 8px 14px; border-radius: 8px; font-size: 13.5px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.15s; font-family: inherit; }
            .gv-tab-btn:hover { background: #eff6ff; border-color: #93c5fd; color: #1e40af; }
            .gv-tab-btn.active { background: #1d4ed8; color: #fff; border-color: #1d4ed8; box-shadow: 0 2px 6px rgba(29,78,216,0.3); }
            .gv-main { max-width: 1280px; width: 100%; margin: 16px auto 40px auto; padding: 0 14px; flex: 1; }
            .gv-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(15,23,42,0.04); }
            .gv-card h2, .gv-card h3 { margin: 0 0 12px 0; color: #1e293b; }
            .gv-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(175px, 1fr)); gap: 12px; margin-bottom: 16px; }
            .gv-kpi { background: #fff; border: 1px solid #e2e8f0; border-left: 5px solid #2563eb; border-radius: 10px; padding: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.03); }
            .gv-kpi .num { font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.2; }
            .gv-kpi .lbl { font-size: 12.5px; color: #64748b; font-weight: 600; margin-top: 3px; }
            .gv-btn { border: none; border-radius: 7px; padding: 8px 13px; font-size: 13px; font-weight: 700; cursor: pointer; color: #fff; background: #2563eb; display: inline-flex; align-items: center; gap: 5px; font-family: inherit; transition: opacity 0.15s; white-space: nowrap; }
            .gv-btn:hover { opacity: 0.9; }
            .gv-btn-blue { background: #2563eb; }
            .gv-btn-green { background: #16a34a; }
            .gv-btn-teal { background: #0d9488; }
            .gv-btn-purple { background: #7c3aed; }
            .gv-btn-orange { background: #d97706; }
            .gv-btn-red { background: #dc2626; }
            .gv-btn-dark { background: #334155; }
            .gv-btn-outline { background: #fff; color: #1e293b; border: 1.5px solid #cbd5e1; }
            .gv-input, .gv-select { width: 100%; padding: 8px 10px; border: 1.5px solid #cbd5e1; border-radius: 7px; font-size: 13.5px; font-family: inherit; background: #fff; color: #0f172a; }
            .gv-input:focus, .gv-select:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
            .gv-filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 12px; }
            .gv-badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11.5px; font-weight: 700; background: #e2e8f0; color: #1e293b; }
            .gv-badge-blue { background: #dbeafe; color: #1e40af; }
            .gv-badge-green { background: #dcfce7; color: #166534; }
            .gv-badge-amber { background: #fef3c7; color: #92400e; }
            .gv-badge-purple { background: #ede9fe; color: #5b21b6; }
            .gv-q-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 13px 15px; margin-bottom: 12px; }
            .gv-q-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; padding-bottom: 8px; border-bottom: 1px dashed #cbd5e1; margin-bottom: 8px; }
            .gv-q-body { font-size: 15px; line-height: 1.95; color: #0f172a; word-wrap: break-word; }
            .gv-q-ans { margin-top: 8px; padding: 9px 12px; background: #f8fafc; border-left: 3.5px solid #16a34a; border-radius: 6px; font-size: 14px; line-height: 1.9; color: #1e293b; }
            .gv-dash-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
            .gv-dash-table th, .gv-dash-table td { border-bottom: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; }
            .gv-dash-table th { background: #f8fafc; font-weight: 700; color: #334155; }
            .gv-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.65); z-index: 10000; display: none; justify-content: center; align-items: flex-start; padding: 20px 12px; overflow-y: auto; }
            .gv-modal-box { background: #fff; border-radius: 12px; width: 100%; max-width: 720px; padding: 18px; box-shadow: 0 20px 50px rgba(0,0,0,0.35); margin: auto; }
            .gv-preview-sheet { background: #fff; max-width: 210mm; margin: 0 auto; padding: 20px 26px; border: 1px solid #cbd5e1; box-shadow: 0 4px 16px rgba(0,0,0,0.12); color: #000; font-size: 14.5px; line-height: 1.9; }
            .gv-preview-sheet .print-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8px; }
            .gv-preview-sheet .print-header h1 { font-size: 21px; margin: 0 0 3px 0; }
            .gv-preview-sheet .exam-meta { display: flex; justify-content: space-between; flex-wrap: wrap; font-weight: 600; border-top: 1px dashed #444; border-bottom: 1px dashed #444; padding: 5px 0; margin-bottom: 8px; }
            .gv-preview-sheet .sec-banner { text-align: center; font-weight: 700; font-size: 15.5px; border: 1.5px solid #000; background: #f1f5f9; padding: 3px; margin: 12px 0 6px 0; }
            .gv-preview-sheet .sec-instruction, .gv-preview-sheet .auto-inst-bar { display: flex; justify-content: space-between; font-weight: 700; border-bottom: 1px dotted #94a3b8; margin: 8px 0 5px 0; padding: 2px 0; }
            .gv-preview-sheet .q-row-table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-bottom: 8px; }
            .gv-preview-sheet .q-cell-text { width: 89%; vertical-align: top; padding-right: 8px; }
            .gv-preview-sheet .q-cell-full { width: 100%; vertical-align: top; padding: 2px 0 4px 18px; }
            .gv-preview-sheet .q-cell-marks { width: 11%; vertical-align: top; text-align: right; font-weight: 700; }
            .gv-preview-sheet .mcq-table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 4px; }
            .gv-preview-sheet .mcq-table td { width: 50%; padding: 3px 6px 3px 0; }
            .gv-preview-sheet .p-ans-box { margin-top: 6px; padding: 7px 10px; background: #f8fafc; border-left: 3px solid #334155; }

            /* 2D Math & Chemistry */
            .m-frac { display: inline-flex; flex-direction: column; vertical-align: middle; text-align: center; padding: 1px 4px; margin: 1px 2px; font-size: 0.95em; line-height: 1.25; font-weight: 600; }
            .m-num { border-bottom: 1.5px solid #0f172a; padding: 0 3px 1px 3px; display: block; }
            .m-den { padding: 1px 3px 0 3px; display: block; min-height: 1.1em; }
            sup .m-frac { font-size: 0.8em; line-height: 1.05; padding: 0 2px; }
            .m-sqrt { display: inline-flex; align-items: stretch; vertical-align: middle; padding-top: 2px; margin: 1px 2px; line-height: 1.2; }
            .m-sqrt-sym { font-size: 1.15em; line-height: 1; margin-right: -1px; font-weight: bold; }
            .m-sqrt-body { border-top: 1.5px solid #0f172a; padding: 1px 4px 0 3px; display: inline-block; }
            sup { font-size: 0.78em; vertical-align: super; line-height: 0; font-weight: 600; }
            sub { font-size: 0.78em; vertical-align: sub; line-height: 0; font-weight: 600; }

            /* Passage & Statistics Tables */
            .gv-passage-box { background: #f8fafc; border: 1.5px solid #94a3b8; border-left: 4px solid #334155; border-radius: 6px; padding: 10px 14px; margin: 6px 0 10px 0; font-weight: 400; line-height: 1.85; color: #1e293b; }
            .gv-table-scroll { display: block; width: 100%; max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 8px 0; }
            .gv-data-table { width: 100% !important; table-layout: auto !important; border-collapse: collapse !important; margin: 0 !important; font-size: 13px; line-height: 1.4 !important; background: #fff !important; border: 1.5px solid #334155 !important; }
            .gv-data-table th, .gv-data-table td { border: 1px solid #475569 !important; padding: 5px 6px !important; text-align: center !important; vertical-align: middle !important; line-height: 1.35 !important; word-break: keep-all !important; overflow-wrap: normal !important; white-space: nowrap; color: #0f172a; }
            .gv-data-table th { background: #f1f5f9 !important; font-weight: 700 !important; color: #0f172a !important; white-space: normal !important; }
            .gv-data-table.gv-tbl-horiz th:first-child { text-align: left !important; min-width: 82px; max-width: 150px; white-space: normal !important; padding: 4px 6px !important; }
            .gv-data-table.gv-tbl-compact { font-size: 11.5px; }
            .gv-data-table.gv-tbl-compact th, .gv-data-table.gv-tbl-compact td { padding: 4px 4px !important; }
            .gv-data-table.gv-tbl-ultra { font-size: 10.5px; }
            .gv-data-table.gv-tbl-ultra th, .gv-data-table.gv-tbl-ultra td { padding: 3px 3px !important; }
            .gv-data-table.gv-tbl-transposed { width: auto !important; min-width: 55% !important; max-width: 100% !important; margin: 4px auto !important; font-size: 13px !important; }
            .gv-data-table.gv-tbl-transposed th, .gv-data-table.gv-tbl-transposed td { padding: 4px 12px !important; white-space: normal !important; }
            .gv-data-table .m-frac { font-size: 0.9em; padding: 1px 2px; margin: 1px; line-height: 1.15; }
            .gv-preview-sheet .gv-data-table, .gv-preview-sheet .gv-data-table th, .gv-preview-sheet .gv-data-table td { border-color: #000 !important; }
            .gv-preview-sheet .gv-data-table.gv-tbl-horiz td { white-space: normal !important; }
            .gv-mcq-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px 16px; margin-top: 6px; }
            @media (max-width: 640px) {
                .gv-mcq-grid { grid-template-columns: 1fr; }
                .gv-topbar h1 { font-size: 16px; }
                .gv-nav { top: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // 4. DOM-ISOLATED SMART TABLE ENGINE & 2D MATH/SCIENCE PARSER
    // ==========================================
    function idxToLetters(n) {
        let res = '';
        do {
            res = String.fromCharCode(97 + (n % 26)) + res;
            n = Math.floor(n / 26) - 1;
        } while (n >= 0);
        return res;
    }

    function formatMathCore(raw) {
        if (!raw) return '';
        let s = String(raw);

        s = s.replace(/@@TA?G?(?:<sub>)?\d*(?:<\/sub>)?@@/g, '');
        s = s.replace(/@@@@+/g, '');
        s = s.replace(/\[PASSAGE\]([\s\S]*?)\[\/PASSAGE\]/gi, '<div class="gv-passage-box">$1</div>');

        const htmlTags = [];
        s = s.replace(/<\/?[a-zA-Z][^>]*>/g, function (match) {
            const code = '\uE000' + idxToLetters(htmlTags.length) + '\uE001';
            htmlTags.push({ code: code, tag: match });
            return code;
        });

        s = s.replace(/\\+ce\{([^}]+)\}/g, '$1');
        s = s.replace(/\$([^$]+)\$/g, '$1');
        s = s.replace(/\\+overline\{([^}]+)\}/g, '<span style="text-decoration:overline;">$1</span>');
        s = s.replace(/\\+rightarrow|->/g, ' → ');
        s = s.replace(/\\+leftarrow|<-/g, ' ← ');
        s = s.replace(/\\+Delta/g, 'Δ');
        s = s.replace(/\\+pi/g, 'π');
        s = s.replace(/\\+theta/g, 'θ');
        s = s.replace(/\\+angle/g, '∠');
        s = s.replace(/\\+times/g, '×');
        s = s.replace(/\\+div/g, '÷');
        s = s.replace(/\\+pm/g, '±');
        s = s.replace(/\\+neq/g, '≠');
        s = s.replace(/\\+cdot/g, '·');

        s = s.replace(/\\+frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="m-frac"><span class="m-num">$1</span><span class="m-den">$2</span></span>');
        s = s.replace(/\(((?:[^()]|\([^()]*\))+)\)\s*\/\s*\(((?:[^()]|\([^()]*\))+)\)/g, '<span class="m-frac"><span class="m-num">$1</span><span class="m-den">$2</span></span>');
        s = s.replace(/([0-9a-zA-Z]+)\s*\/\s*\(((?:[^()]|\([^()]*\))+)\)/g, '<span class="m-frac"><span class="m-num">$1</span><span class="m-den">$2</span></span>');
        s = s.replace(/\(((?:[^()]|\([^()]*\))+)\)\s*\/\s*([0-9a-zA-Z]+)/g, '<span class="m-frac"><span class="m-num">$1</span><span class="m-den">$2</span></span>');

        s = s.replace(/\\+sqrt\{([^}]+)\}/g, '<span class="m-sqrt"><span class="m-sqrt-sym">√</span><span class="m-sqrt-body">$1</span></span>');
        s = s.replace(/√\(([^)]+)\)/g, '<span class="m-sqrt"><span class="m-sqrt-sym">√</span><span class="m-sqrt-body">$1</span></span>');
        s = s.replace(/√([0-9a-zA-Z]+)/g, '<span class="m-sqrt"><span class="m-sqrt-sym">√</span><span class="m-sqrt-body">$1</span></span>');

        s = s.replace(/\^\(\s*([0-9a-zA-Z]+)\s*\/\s*([0-9a-zA-Z]+)\s*\)/g, '<sup><span class="m-frac"><span class="m-num">$1</span><span class="m-den">$2</span></span></sup>');
        s = s.replace(/\^([0-9a-zA-Z]+)\/([0-9a-zA-Z]+)/g, '<sup><span class="m-frac"><span class="m-num">$1</span><span class="m-den">$2</span></span></sup>');
        s = s.replace(/\^\{\s*([0-9a-zA-Z]+)\s*\/\s*([0-9a-zA-Z]+)\s*\}/g, '<sup><span class="m-frac"><span class="m-num">$1</span><span class="m-den">$2</span></span></sup>');
        s = s.replace(/\^\(([^)]+)\)/g, '<sup>$1</sup>');
        s = s.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
        s = s.replace(/\^([+\-]?[0-9a-zA-Z]+)/g, '<sup>$1</sup>');

        s = s.replace(/(^|[\s(=+\-,:\uE001])(\d+|[a-zA-Z])\s*\/\s*(\d+|[a-zA-Z])(?=$|[\s)=+\-,.;:\uE000])/g, '$1<span class="m-frac"><span class="m-num">$2</span><span class="m-den">$3</span></span>');

        s = s.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
        s = s.replace(/_([0-9]+)/g, '<sub>$1</sub>');
        s = s.replace(/([A-Za-z\)])(\d+)([+\-])/g, '$1<sub>$2</sub><sup>$3</sup>');
        s = s.replace(/([A-Z][a-z]?|\))(\d+)/g, '$1<sub>$2</sub>');

        for (let i = 0; i < htmlTags.length; i++) {
            s = s.split(htmlTags[i].code).join(htmlTags[i].tag);
        }
        return s;
    }

    window.GVTableEngine = {
        normalizeAllTableFormats: function (rawStr) {
            if (!rawStr) return '';
            let s = String(rawStr);

            s = s.replace(/<div[^>]*class=["'][^"']*gv-table-scroll[^"']*["'][^>]*>\s*(<table\b[\s\S]*?<\/table\s*>)\s*<\/div>/gi, '$1');
            s = s.replace(/&amp;lt;/gi, '&lt;').replace(/&amp;gt;/gi, '&gt;');
            s = s.replace(/&lt;(\/?(?:table|thead|tbody|tfoot|tr|th|td)\b[^&]*)&gt;/gi, '<$1>');

            s = s.replace(/\[TABLE\]([\s\S]*?)\[\/TABLE\]/gi, function (_, inner) {
                const rows = String(inner || '').trim().split(/\\n|\r?\n/).map(r => r.trim()).filter(Boolean);
                if (!rows.length) return '';
                let html = '<table>';
                rows.forEach((r, ri) => {
                    const cells = r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
                    html += '<tr>' + cells.map((c, ci) => (ri === 0 || ci === 0) ? ('<th>' + c + '</th>') : ('<td>' + c + '</td>')).join('') + '</tr>';
                });
                return html + '</table>';
            });

            s = s.replace(/(^|\n|\\n)(\|[^\n]+\|(?:(?:\n|\\n)\|[^\n]+\|)+)/g, function (full, prefix, block) {
                const lines = block.split(/\\n|\r?\n/).map(l => l.trim()).filter(Boolean);
                const dataLines = lines.filter(l => !/^\|[\s:|-]+\|$/.test(l));
                if (dataLines.length < 2) return full;
                let html = '<table>';
                dataLines.forEach((line, ri) => {
                    const cells = line.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
                    const tag = ri === 0 ? 'th' : 'td';
                    html += '<tr>' + cells.map(c => '<' + tag + '>' + c + '</' + tag + '>').join('') + '</tr>';
                });
                return prefix + html + '</table>';
            });

            return s;
        },

        renderCleanTableDOM: function (rawTableHtml, cellFormatter) {
            try {
                const cleanInput = String(rawTableHtml || '')
                    .replace(/\\n|\r?\n/g, ' ')
                    .replace(/>(?:\s|<br\s*\/?>)+<(?=\/?(?:table|thead|tbody|tfoot|tr|th|td)\b)/gi, '><');

                const holder = document.createElement('div');
                holder.innerHTML = cleanInput;
                const tbl = holder.querySelector('table');
                if (!tbl) return cleanInput;

                const rows = Array.from(tbl.querySelectorAll('tr'));
                const trCount = rows.length;
                let maxCols = 0;
                rows.forEach(tr => {
                    let colSum = 0;
                    Array.from(tr.children).forEach(cell => {
                        if (cell.tagName === 'TD' || cell.tagName === 'TH') {
                            colSum += Number(cell.getAttribute('colspan')) || 1;
                        }
                    });
                    if (colSum > maxCols) maxCols = colSum;
                });

                const classes = ['gv-data-table'];
                let fontSize = '13px';
                let cellPad = '5px 6px';
                if (maxCols >= 10) {
                    classes.push('gv-tbl-ultra');
                    fontSize = '10.5px';
                    cellPad = '3px 2px';
                } else if (maxCols >= 7) {
                    classes.push('gv-tbl-compact');
                    fontSize = '11.5px';
                    cellPad = '4px 4px';
                }
                const isWideHoriz = (trCount === 2 && maxCols >= 5);
                if (isWideHoriz) {
                    classes.push('gv-tbl-horiz');
                    tbl.setAttribute('data-gv-transposable', '1');
                }

                tbl.className = classes.join(' ');
                tbl.setAttribute('border', '1');
                tbl.setAttribute('cellspacing', '0');
                tbl.setAttribute('cellpadding', '4');
                tbl.setAttribute('style', 'width:100%; border-collapse:collapse; margin:0; background:#ffffff; border:1.5px solid #334155; font-size:' + fontSize + '; line-height:1.35;');

                rows.forEach((tr) => {
                    Array.from(tr.children).forEach((cell, cIdx) => {
                        if (cell.tagName !== 'TD' && cell.tagName !== 'TH') return;
                        const innerFormatted = typeof cellFormatter === 'function' ? cellFormatter(cell.innerHTML) : cell.innerHTML;
                        cell.innerHTML = innerFormatted.replace(/\\n|\r?\n/g, '<br>');
                        const isTh = cell.tagName === 'TH';
                        const align = (isWideHoriz && isTh && cIdx === 0) ? 'left' : 'center';
                        const bg = isTh ? 'background:#f1f5f9; font-weight:700;' : 'background:#ffffff;';
                        cell.setAttribute('style', 'border:1px solid #475569; padding:' + cellPad + '; text-align:' + align + '; vertical-align:middle; ' + bg + ' color:#0f172a;');
                    });
                });

                const singleLineTable = tbl.outerHTML.replace(/\r?\n/g, '');
                return '<div class="gv-table-scroll" style="display:block; width:100%; max-width:100%; overflow-x:auto; margin:8px 0;">' + singleLineTable + '</div>';
            } catch (e) {
                return '<div class="gv-table-scroll">' + rawTableHtml + '</div>';
            }
        },

        toggleTransposeInContainer: function (containerEl) {
            if (!containerEl) return 0;
            const tables = Array.from(containerEl.querySelectorAll('table[data-gv-transposable="1"]'));
            let toggled = 0;
            tables.forEach(tbl => {
                if (!tbl.dataset.origHtml) {
                    tbl.dataset.origHtml = tbl.innerHTML;
                    tbl.dataset.origClass = tbl.className;
                    tbl.dataset.origStyle = tbl.getAttribute('style') || '';
                }
                if (tbl.dataset.isTransposed === '1') {
                    tbl.innerHTML = tbl.dataset.origHtml;
                    tbl.className = tbl.dataset.origClass;
                    tbl.setAttribute('style', tbl.dataset.origStyle);
                    tbl.dataset.isTransposed = '0';
                } else {
                    const rows = Array.from(tbl.querySelectorAll('tr'));
                    if (rows.length !== 2) return;
                    const r0 = Array.from(rows[0].children).filter(c => c.tagName === 'TH' || c.tagName === 'TD');
                    const r1 = Array.from(rows[1].children).filter(c => c.tagName === 'TH' || c.tagName === 'TD');
                    const maxLen = Math.max(r0.length, r1.length);
                    let newHtml = '<tbody>';
                    for (let i = 0; i < maxLen; i++) {
                        const c0 = r0[i] ? r0[i].innerHTML : '';
                        const c1 = r1[i] ? r1[i].innerHTML : '';
                        const tag = i === 0 ? 'th' : 'td';
                        const bg = i === 0 ? 'background:#f1f5f9; font-weight:700;' : 'background:#ffffff;';
                        newHtml += '<tr><' + tag + ' style="border:1px solid #000; padding:4px 12px; text-align:center; ' + bg + '">' + c0 + '</' + tag + '><' + tag + ' style="border:1px solid #000; padding:4px 12px; text-align:center; ' + bg + '">' + c1 + '</' + tag + '></tr>';
                    }
                    newHtml += '</tbody>';
                    tbl.innerHTML = newHtml;
                    tbl.className = 'gv-data-table gv-tbl-transposed';
                    tbl.setAttribute('style', 'width:auto; min-width:55%; max-width:100%; border-collapse:collapse; margin:4px auto; background:#ffffff; border:1.5px solid #000; font-size:13px;');
                    tbl.dataset.isTransposed = '1';
                }
                toggled++;
            });
            return toggled;
        }
    };

    window.enhanceDataTables = function (rawStr) {
        return window.GVTableEngine.normalizeAllTableFormats(rawStr);
    };

    window.formatScienceAndMath = function (text) {
        if (!text) return '';
        let s = window.GVTableEngine.normalizeAllTableFormats(String(text));

        const extractedTables = [];
        s = s.replace(/<table\b[^>]*>[\s\S]*?<\/table\s*>/gi, function (match) {
            const token = '\uE010tbl' + idxToLetters(extractedTables.length) + '\uE011';
            extractedTables.push(match);
            return token;
        });

        s = formatMathCore(s);

        extractedTables.forEach((rawTbl, idx) => {
            const renderedTbl = window.GVTableEngine.renderCleanTableDOM(rawTbl, formatMathCore);
            const token = '\uE010tbl' + idxToLetters(idx) + '\uE011';
            s = s.split(token).join(renderedTbl);
        });

        return s;
    };

    window.getSafeDraftSnippet = function (rawText) {
        if (!rawText) return '';
        const normalized = window.GVTableEngine.normalizeAllTableFormats(rawText);
        const hasTable = /<table\b/i.test(normalized);
        const clean = String(normalized)
            .replace(/<table\b[\s\S]*?<\/table>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\\n|\r?\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        const shortText = clean.length > 105 ? (clean.substring(0, 105) + '...') : clean;
        return window.formatScienceAndMath(shortText) + (hasTable ? ' <span style="background:#e0f2fe; color:#0369a1; font-size:11px; padding:1px 6px; border-radius:4px; font-weight:700;">📊 કોષ્ટક</span>' : '');
    };

    function formatDisplayBlock(rawText) {
        return window.formatScienceAndMath(rawText || '')
            .replace(/\\n|\n/g, '<br>')
            .replace(/(?:<br>\s*)+(<div class="gv-table-scroll")/g, '$1')
            .replace(/(<\/table><\/div>)(?:\s*<br>)+/g, '$1');
    }

    function formatQuestionCardHTML(q) {
        const formatted = window.formatScienceAndMath(q.text || '');
        if (q.type === 'MCQ') {
            const parts = formatted.split(/\(A\)|\(B\)|\(C\)|\(D\)/);
            if (parts.length === 5) {
                const stem = parts[0].trim()
                    .replace(/\\n|\n/g, '<br>')
                    .replace(/(?:<br>\s*)+(<div class="gv-table-scroll")/g, '$1')
                    .replace(/(<\/table><\/div>)(?:\s*<br>)+/g, '$1');
                return '<div>' + stem + '</div><div class="gv-mcq-grid"><div><strong>(A)</strong> ' + parts[1].trim() + '</div><div><strong>(B)</strong> ' + parts[2].trim() + '</div><div><strong>(C)</strong> ' + parts[3].trim() + '</div><div><strong>(D)</strong> ' + parts[4].trim() + '</div></div>';
            }
        }
        if ((q.type === 'જોડકા જોડો' || String(q.type || '').toLowerCase().includes('match')) && typeof window.parseMatchTextGlobal === 'function') {
            return window.parseMatchTextGlobal(formatted, q.lang || 'gu');
        }
        return formatDisplayBlock(q.text || '');
    }

    function formatAnswerCardHTML(ans) {
        if (!ans) return '';
        if (typeof window.formatAns === 'function') return window.formatAns(ans);
        return formatDisplayBlock(ans);
    }

    // ==========================================
    // 5. VISUAL TABLE BUILDER MODAL
    // ==========================================
    window.openTableBuilderModal = function (targetTextareaId) {
        const old = document.getElementById('gvTableBuilderModal');
        if (old) old.remove();

        let rowsCount = 2;
        let colsCount = 6;
        let firstRowHeader = false;
        let firstColHeader = true;
        let gridData = [
            ['વર્ગ', '0-10', '10-20', '20-30', '30-40', '40-50'],
            ['આવૃત્તિ', '5', '8', '12', '10', '5']
        ];

        const overlay = document.createElement('div');
        overlay.id = 'gvTableBuilderModal';
        overlay.className = 'gv-modal-overlay';
        overlay.style.display = 'flex';
        overlay.style.zIndex = '100005';
        overlay.innerHTML = `
            <div class="gv-modal-box" style="max-width:800px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:8px; margin-bottom:10px;">
                    <h3 style="margin:0; color:#1e3a8a;">📊 વિઝ્યુઅલ કોષ્ટક બિલ્ડર (આંકડાશાસ્ત્ર / સંભાવના / વિજ્ઞાન)</h3>
                    <button type="button" id="tbClose" style="border:none; background:#fee2e2; color:#b91c1c; font-weight:bold; padding:4px 10px; border-radius:6px; cursor:pointer;">✖</button>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:10px; background:#eff6ff; padding:8px 10px; border-radius:8px;">
                    <strong style="font-size:12.5px; color:#1e40af;">ઝડપી ટેમ્પલેટ:</strong>
                    <button type="button" id="tbPresetHoriz" class="gv-btn gv-btn-blue" style="padding:4px 9px; font-size:12px;">આડું વર્ગ-આવૃત્તિ (2×6)</button>
                    <button type="button" id="tbPresetVert" class="gv-btn gv-btn-teal" style="padding:4px 9px; font-size:12px;">ઊભું ગણતરી કોષ્ટક (5×4)</button>
                    <button type="button" id="tbPresetProb" class="gv-btn gv-btn-purple" style="padding:4px 9px; font-size:12px;">સંભાવના કોષ્ટક (2×7)</button>
                </div>
                <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:10px; font-size:13px;">
                    <label>હરોળ (Rows): <input type="number" id="tbRows" min="2" max="14" value="2" style="width:58px; padding:4px; border:1px solid #cbd5e1; border-radius:4px;"></label>
                    <label>સ્તંભ (Cols): <input type="number" id="tbCols" min="2" max="12" value="6" style="width:58px; padding:4px; border:1px solid #cbd5e1; border-radius:4px;"></label>
                    <label><input type="checkbox" id="tbRowHead"> પહેલી હરોળ હેડર (Bold)</label>
                    <label><input type="checkbox" id="tbColHead" checked> પહેલો સ્તંભ હેડર (Bold)</label>
                </div>
                <div id="tbGridWrap" style="overflow-x:auto; border:1px solid #cbd5e1; border-radius:6px; padding:8px; background:#f8fafc; max-height:300px; overflow-y:auto;"></div>
                <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
                    <button type="button" id="tbCancel" class="gv-btn gv-btn-dark">રદ કરો</button>
                    <button type="button" id="tbInsert" class="gv-btn gv-btn-green">✅ કોષ્ટક ઉમેરો</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        const syncGrid = () => {
            while (gridData.length < rowsCount) gridData.push(new Array(colsCount).fill(''));
            gridData = gridData.slice(0, rowsCount).map(r => {
                const copy = r.slice(0, colsCount);
                while (copy.length < colsCount) copy.push('');
                return copy;
            });

            let html = '<table style="width:100%; border-collapse:collapse;">';
            for (let r = 0; r < rowsCount; r++) {
                html += '<tr>';
                for (let c = 0; c < colsCount; c++) {
                    const isHead = (firstRowHeader && r === 0) || (firstColHeader && c === 0);
                    html += '<td style="padding:3px;"><input type="text" data-r="' + r + '" data-c="' + c + '" class="tb-cell-inp" value="' + escapeAttr(gridData[r][c]) + '" style="width:100%; min-width:74px; padding:5px; border:1px solid ' + (isHead ? '#2563eb' : '#cbd5e1') + '; background:' + (isHead ? '#eff6ff' : '#fff') + '; font-weight:' + (isHead ? '700' : '400') + '; border-radius:4px; font-size:12.5px;"></td>';
                }
                html += '</tr>';
            }
            html += '</table>';
            const wrap = overlay.querySelector('#tbGridWrap');
            wrap.innerHTML = html;
            wrap.querySelectorAll('.tb-cell-inp').forEach(inp => {
                inp.oninput = () => { gridData[Number(inp.dataset.r)][Number(inp.dataset.c)] = inp.value; };
            });
        };

        syncGrid();

        const close = () => overlay.remove();
        overlay.querySelector('#tbClose').onclick = close;
        overlay.querySelector('#tbCancel').onclick = close;
        overlay.querySelector('#tbRows').onchange = (e) => { rowsCount = Math.max(2, Math.min(14, parseInt(e.target.value, 10) || 2)); syncGrid(); };
        overlay.querySelector('#tbCols').onchange = (e) => { colsCount = Math.max(2, Math.min(12, parseInt(e.target.value, 10) || 2)); syncGrid(); };
        overlay.querySelector('#tbRowHead').onchange = (e) => { firstRowHeader = e.target.checked; syncGrid(); };
        overlay.querySelector('#tbColHead').onchange = (e) => { firstColHeader = e.target.checked; syncGrid(); };

        overlay.querySelector('#tbPresetHoriz').onclick = () => {
            rowsCount = 2; colsCount = 6; firstRowHeader = false; firstColHeader = true;
            overlay.querySelector('#tbRows').value = 2; overlay.querySelector('#tbCols').value = 6;
            overlay.querySelector('#tbRowHead').checked = false; overlay.querySelector('#tbColHead').checked = true;
            gridData = [['વર્ગ', '0-10', '10-20', '20-30', '30-40', '40-50'], ['આવૃત્તિ', '5', '8', '12', '10', '5']];
            syncGrid();
        };
        overlay.querySelector('#tbPresetVert').onclick = () => {
            rowsCount = 5; colsCount = 4; firstRowHeader = true; firstColHeader = false;
            overlay.querySelector('#tbRows').value = 5; overlay.querySelector('#tbCols').value = 4;
            overlay.querySelector('#tbRowHead').checked = true; overlay.querySelector('#tbColHead').checked = false;
            gridData = [
                ['વર્ગ', 'આવૃત્તિ (f_{i})', 'મધ્યકિંમત (x_{i})', 'f_{i}x_{i}'],
                ['0-10', '5', '5', '25'],
                ['10-20', '8', '15', '120'],
                ['20-30', '7', '25', '175'],
                ['કુલ', 'Σf_{i} = 20', '—', 'Σf_{i}x_{i} = 320']
            ];
            syncGrid();
        };
        overlay.querySelector('#tbPresetProb').onclick = () => {
            rowsCount = 2; colsCount = 7; firstRowHeader = false; firstColHeader = true;
            overlay.querySelector('#tbRows').value = 2; overlay.querySelector('#tbCols').value = 7;
            overlay.querySelector('#tbRowHead').checked = false; overlay.querySelector('#tbColHead').checked = true;
            gridData = [['સરવાળો', '2', '3', '4', '5', '6', '7'], ['સંભાવના', '(1)/(36)', '(2)/(36)', '(3)/(36)', '(4)/(36)', '(5)/(36)', '(6)/(36)']];
            syncGrid();
        };

        overlay.querySelector('#tbInsert').onclick = () => {
            let tblHtml = '<table>';
            for (let r = 0; r < rowsCount; r++) {
                tblHtml += '<tr>';
                for (let c = 0; c < colsCount; c++) {
                    const isHead = (firstRowHeader && r === 0) || (firstColHeader && c === 0);
                    const tag = isHead ? 'th' : 'td';
                    tblHtml += '<' + tag + '>' + String(gridData[r][c] || '').trim() + '</' + tag + '>';
                }
                tblHtml += '</tr>';
            }
            tblHtml += '</table>';

            const ta = document.getElementById(targetTextareaId);
            if (ta) {
                const sep = ta.value.trim() ? '\n' : '';
                ta.value = ta.value + sep + tblHtml;
                ta.dispatchEvent(new Event('input'));
                window.showToast('✅ કોષ્ટક સફળતાપૂર્વક ઉમેરાઈ ગયું!');
            }
            close();
        };
    };

    // ==========================================
    // 6. GITHUB ONLINE SUBJECT LIBRARY & MERGING
    // ==========================================
    function mergeQuestionsIntoBank(incomingList) {
        if (!Array.isArray(incomingList)) return { added: 0, updated: 0 };
        const map = new Map();
        appState.questions.forEach(q => { if (q && q.id) map.set(String(q.id), q); });
        let added = 0, updated = 0;
        incomingList.forEach((raw, idx) => {
            if (!raw || typeof raw !== 'object') return;
            const id = raw.id ? String(raw.id) : ('Q_' + Date.now() + '_' + idx);
            const cleanQ = {
                id: id,
                standard: String(raw.standard || ''),
                subject: String(raw.subject || ''),
                chapter: String(raw.chapter || ''),
                type: String(raw.type || 'MCQ'),
                marks: Number(raw.marks || 1),
                lang: String(raw.lang || 'gu'),
                instruction: String(raw.instruction || ''),
                text: String(raw.text || ''),
                answer: String(raw.answer || ''),
                image: String(raw.image || ''),
                imageWidth: String(raw.imageWidth || '220px'),
                imageAlign: String(raw.imageAlign || 'center'),
                solutionImage: String(raw.solutionImage || ''),
                solutionImageWidth: String(raw.solutionImageWidth || '240px'),
                solutionImageAlign: String(raw.solutionImageAlign || 'left')
            };
            if (map.has(id)) updated++; else added++;
            map.set(id, cleanQ);
        });
        saveQuestionsToStorage(Array.from(map.values()));
        return { added, updated };
    }

    async function fetchJSONNoCache(url) {
        const sep = url.includes('?') ? '&' : '?';
        const res = await fetch(url + sep + 't=' + Date.now(), { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
    }

    async function autoLoadCatalogOnBoot() {
        if (appState.questions.length > 0) return;
        try {
            const catalog = await fetchJSONNoCache('data/catalog.json');
            if (Array.isArray(catalog)) {
                let totalLoaded = 0;
                for (const item of catalog) {
                    if (item && item.autoLoad && item.file) {
                        try {
                            const data = await fetchJSONNoCache(item.file);
                            const arr = Array.isArray(data) ? data : (Array.isArray(data.questions) ? data.questions : []);
                            const res = mergeQuestionsIntoBank(arr);
                            totalLoaded += (res.added + res.updated);
                        } catch (e) { /* skip individual file error */ }
                    }
                }
                if (totalLoaded > 0) {
                    localStorage.setItem(LS_CATALOG_LOADED, '1');
                    window.showToast('☁️ ઓનલાઈન લાઈબ્રેરીમાંથી ' + totalLoaded + ' પ્રશ્નો લોડ થઈ ગયા!');
                    renderCurrentView();
                    return;
                }
            }
        } catch (e) {
            try {
                const fallbackData = await fetchJSONNoCache('questions.json');
                const arr = Array.isArray(fallbackData) ? fallbackData : (Array.isArray(fallbackData.questions) ? fallbackData.questions : []);
                if (arr.length > 0) {
                    mergeQuestionsIntoBank(arr);
                    window.showToast('☁️ ' + arr.length + ' પ્રશ્નો ઓટો-લોડ થઈ ગયા!');
                    renderCurrentView();
                }
            } catch (e2) { /* offline or no initial json */ }
        }
    }

    window.openOnlineLibraryModal = async function () {
        const old = document.getElementById('gvOnlineLibModal');
        if (old) old.remove();

        const overlay = document.createElement('div');
        overlay.id = 'gvOnlineLibModal';
        overlay.className = 'gv-modal-overlay';
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="gv-modal-box" style="max-width:680px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:10px; margin-bottom:14px;">
                    <h3 style="margin:0; color:#1e3a8a;">☁️ ઓનલાઈન વિષય લાઈબ્રેરી (GitHub data/ ફોલ્ડર)</h3>
                    <button type="button" id="olCloseX" style="border:none; background:#fee2e2; color:#b91c1c; font-weight:bold; padding:4px 10px; border-radius:6px; cursor:pointer;">✖</button>
                </div>
                <div id="olContent" style="min-height:100px; font-size:14px; color:#334155;">⏳ ઓનલાઈન કેટલોગ લોડ થઈ રહ્યું છે...</div>
                <div style="display:flex; justify-content:flex-end; margin-top:14px; border-top:1px solid #e2e8f0; padding-top:10px;">
                    <button type="button" id="olCloseBtn" class="gv-btn gv-btn-dark">બંધ કરો</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        const close = () => overlay.remove();
        overlay.querySelector('#olCloseX').onclick = close;
        overlay.querySelector('#olCloseBtn').onclick = close;

        const box = overlay.querySelector('#olContent');
        try {
            const catalog = await fetchJSONNoCache('data/catalog.json');
            if (!Array.isArray(catalog) || catalog.length === 0) {
                box.innerHTML = '<div style="padding:14px; background:#fefce8; border:1px solid #fde047; border-radius:8px;">📌 <strong>data/catalog.json</strong> ખાલી છે. તેમાં તમારા વિષયોની વિગત ઉમેરો.</div>';
                return;
            }
            let html = '<div style="display:flex; flex-direction:column; gap:10px;">';
            catalog.forEach((item, idx) => {
                const existingCount = appState.questions.filter(q => String(q.standard) === String(item.standard) && String(q.subject) === String(item.subject)).length;
                html += `
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding:12px; border:1.5px solid #e2e8f0; border-radius:10px; background:#f8fafc;">
                        <div>
                            <div style="font-weight:700; font-size:15px; color:#0f172a;">${escapeHtml(item.title || ('ધોરણ ' + item.standard + ' — ' + item.subject))}</div>
                            <div style="font-size:12.5px; color:#64748b; margin-top:2px;">ફાઈલ: <code>${escapeHtml(item.file)}</code> &nbsp;|&nbsp; તમારા ડિવાઈસમાં: <strong>${existingCount} પ્રશ્નો</strong></div>
                        </div>
                        <button type="button" class="gv-btn ${existingCount > 0 ? 'gv-btn-teal' : 'gv-btn-blue'} ol-dl-btn" data-idx="${idx}">
                            ${existingCount > 0 ? '🔄 અપડેટ કરો' : '⬇️ ડાઉનલોડ કરો'}
                        </button>
                    </div>`;
            });
            html += '</div>';
            box.innerHTML = html;

            box.querySelectorAll('.ol-dl-btn').forEach(btn => {
                btn.onclick = async () => {
                    const item = catalog[Number(btn.dataset.idx)];
                    btn.disabled = true;
                    const prevText = btn.textContent;
                    btn.textContent = '⏳ લોડ થાય છે...';
                    try {
                        const data = await fetchJSONNoCache(item.file);
                        const arr = Array.isArray(data) ? data : (Array.isArray(data.questions) ? data.questions : []);
                        const res = mergeQuestionsIntoBank(arr);
                        window.showToast('✅ ' + (item.title || item.subject) + ': ' + res.added + ' નવા + ' + res.updated + ' અપડેટ થયા!');
                        renderCurrentView();
                        window.openOnlineLibraryModal();
                    } catch (err) {
                        window.showToast('❌ ફાઈલ (' + item.file + ') લોડ ન થઈ શકી: ' + err.message, 'error');
                        btn.disabled = false;
                        btn.textContent = prevText;
                    }
                };
            });
        } catch (err) {
            box.innerHTML = `
                <div style="padding:14px; background:#fff7ed; border:1.5px solid #fdba74; border-radius:8px; line-height:1.8;">
                    <div style="font-weight:700; color:#9a3412; margin-bottom:4px;">📌 હજુ સુધી GitHub માં <code>data/catalog.json</code> મળ્યું નથી.</div>
                    <div>1. GitHub માં <code>data/std10_maths.json</code> અને <code>data/catalog.json</code> અપલોડ કરો.</div>
                    <div>2. ત્યારબાદ અહીં બધા જ ધોરણ અને વિષયોના પેક 1 ક્લિકમાં ડાઉનલોડ કરવા માટે દેખાશે!</div>
                </div>`;
        }
    };

    // ==========================================
    // 7. ADD / EDIT QUESTION MODAL
    // ==========================================
    function readImageFileAsDataURL(file, callback) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (ev) { callback(ev.target.result); };
        reader.readAsDataURL(file);
    }

    function openQuestionModal(editId) {
        const old = document.getElementById('gvQuestionModal');
        if (old) old.remove();

        const existing = editId ? appState.questions.find(q => String(q.id) === String(editId)) : null;
        const qObj = existing ? Object.assign({}, existing) : {
            id: 'Q_' + Date.now(),
            standard: appState.filters.std || '10',
            subject: appState.filters.subject || 'ગણિત',
            chapter: appState.filters.chapter || '1',
            type: appState.filters.type || 'MCQ',
            marks: 1,
            lang: 'gu',
            instruction: '',
            text: '',
            answer: '',
            image: '',
            imageWidth: '220px',
            imageAlign: 'center',
            solutionImage: '',
            solutionImageWidth: '240px',
            solutionImageAlign: 'left'
        };

        const typeList = Array.from(new Set([...Object.keys(window.DEFAULT_INSTRUCTIONS), ...appState.questions.map(x => x.type).filter(Boolean)]));

        const modal = document.createElement('div');
        modal.id = 'gvQuestionModal';
        modal.className = 'gv-modal-overlay';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="gv-modal-box" style="max-width:780px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:8px; margin-bottom:12px;">
                    <h3 style="margin:0; color:#1e3a8a;">${existing ? '✏️ પ્રશ્ન સુધારો (Edit)' : '➕ નવો પ્રશ્ન ઉમેરો'}</h3>
                    <button type="button" id="gvQModalCloseX" style="border:none; background:#fee2e2; color:#b91c1c; font-weight:bold; padding:4px 10px; border-radius:6px; cursor:pointer;">✖</button>
                </div>

                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:8px; margin-bottom:10px;">
                    <div><label style="font-size:12px; font-weight:bold;">ધોરણ:</label><input id="gvQStd" class="gv-input" value="${escapeAttr(qObj.standard)}" placeholder="10"></div>
                    <div><label style="font-size:12px; font-weight:bold;">વિષય:</label><input id="gvQSub" class="gv-input" value="${escapeAttr(qObj.subject)}" placeholder="ગણિત"></div>
                    <div><label style="font-size:12px; font-weight:bold;">પ્રકરણ નં.:</label><input id="gvQCh" class="gv-input" value="${escapeAttr(qObj.chapter)}" placeholder="1"></div>
                    <div><label style="font-size:12px; font-weight:bold;">ગુણ:</label><input id="gvQMarks" type="number" min="1" max="20" class="gv-input" value="${escapeAttr(qObj.marks)}"></div>
                    <div><label style="font-size:12px; font-weight:bold;">ભાષા:</label>
                        <select id="gvQLang" class="gv-select">
                            <option value="gu" ${qObj.lang === 'gu' ? 'selected' : ''}>ગુજરાતી</option>
                            <option value="en" ${qObj.lang === 'en' ? 'selected' : ''}>English</option>
                            <option value="hi" ${qObj.lang === 'hi' ? 'selected' : ''}>हिन्दी</option>
                            <option value="sa" ${qObj.lang === 'sa' ? 'selected' : ''}>संस्कृत</option>
                        </select>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 2fr; gap:8px; margin-bottom:10px;">
                    <div>
                        <label style="font-size:12px; font-weight:bold;">પ્રશ્નનો પ્રકાર:</label>
                        <input id="gvQType" list="gvTypeDatalist" class="gv-input" value="${escapeAttr(qObj.type)}">
                        <datalist id="gvTypeDatalist">${typeList.map(t => '<option value="' + escapeAttr(t) + '">').join('')}</datalist>
                    </div>
                    <div>
                        <label style="font-size:12px; font-weight:bold;">સૂચના (ખાલી રાખશો તો પ્રકાર મુજબ ઓટો આવશે):</label>
                        <input id="gvQInst" class="gv-input" value="${escapeAttr(qObj.instruction)}" placeholder="દા.ત. નીચે આપેલા પ્રશ્નોના સાચા વિકલ્પ પસંદ કરી ઉત્તર લખો.">
                    </div>
                </div>

                <div style="margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; gap:6px; flex-wrap:wrap;">
                        <label style="font-size:12px; font-weight:bold;">પ્રશ્નનું લખાણ:</label>
                        <button type="button" class="gv-btn gv-btn-teal" style="padding:3px 9px; font-size:11.5px;" onclick="window.openTableBuilderModal('gvQText')">📊 કોષ્ટક બનાવો / ઉમેરો</button>
                    </div>
                    <textarea id="gvQText" rows="4" class="gv-input" placeholder="અહીં પ્રશ્ન લખો...">${escapeHtml(qObj.text)}</textarea>
                </div>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:8px 10px; margin-bottom:10px;">
                    <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; font-size:12.5px;">
                        <strong>🖼️ પ્રશ્નની આકૃતિ:</strong>
                        <input type="file" id="gvQImgFile" accept="image/*" style="font-size:12px;">
                        <select id="gvQImgW" class="gv-select" style="width:auto; padding:4px 8px; font-size:12px;">
                            <option value="160px" ${qObj.imageWidth === '160px' ? 'selected' : ''}>નાની (160px)</option>
                            <option value="220px" ${qObj.imageWidth === '220px' ? 'selected' : ''}>મધ્યમ (220px)</option>
                            <option value="320px" ${qObj.imageWidth === '320px' ? 'selected' : ''}>મોટી (320px)</option>
                            <option value="100%" ${qObj.imageWidth === '100%' ? 'selected' : ''}>ફૂલ (100%)</option>
                        </select>
                        <select id="gvQImgAlign" class="gv-select" style="width:auto; padding:4px 8px; font-size:12px;">
                            <option value="center" ${qObj.imageAlign === 'center' ? 'selected' : ''}>વચ્ચે</option>
                            <option value="left" ${qObj.imageAlign === 'left' ? 'selected' : ''}>ડાબે</option>
                            <option value="right" ${qObj.imageAlign === 'right' ? 'selected' : ''}>જમણે</option>
                        </select>
                        <button type="button" id="gvQImgClear" class="gv-btn gv-btn-red" style="padding:3px 8px; font-size:11.5px;">હટાવો</button>
                    </div>
                    <div id="gvQImgPrev" style="margin-top:6px;">${qObj.image ? '<img src="' + qObj.image + '" style="max-height:90px; border:1px solid #cbd5e1; border-radius:4px;">' : ''}</div>
                </div>

                <div style="margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; gap:6px; flex-wrap:wrap;">
                        <label style="font-size:12px; font-weight:bold;">જવાબ (Answer):</label>
                        <button type="button" class="gv-btn gv-btn-teal" style="padding:3px 9px; font-size:11.5px;" onclick="window.openTableBuilderModal('gvQAns')">📊 ઉત્તરમાં કોષ્ટક ઉમેરો</button>
                    </div>
                    <textarea id="gvQAns" rows="4" class="gv-input" placeholder="અહીં ઉત્તર લખો...">${escapeHtml(qObj.answer)}</textarea>
                </div>

                <div id="gvModalLivePreviewBox" style="display:none; margin-bottom:10px; padding:10px 12px; background:#fffbeb; border:1.5px solid #f59e0b; border-radius:8px; font-size:14px; line-height:1.8;"></div>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:8px 10px; margin-bottom:12px;">
                    <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; font-size:12.5px;">
                        <strong>🖼️ ઉત્તરની આકૃતિ:</strong>
                        <input type="file" id="gvSImgFile" accept="image/*" style="font-size:12px;">
                        <select id="gvSImgW" class="gv-select" style="width:auto; padding:4px 8px; font-size:12px;">
                            <option value="180px" ${qObj.solutionImageWidth === '180px' ? 'selected' : ''}>નાની (180px)</option>
                            <option value="240px" ${qObj.solutionImageWidth === '240px' ? 'selected' : ''}>મધ્યમ (240px)</option>
                            <option value="340px" ${qObj.solutionImageWidth === '340px' ? 'selected' : ''}>મોટી (340px)</option>
                            <option value="100%" ${qObj.solutionImageWidth === '100%' ? 'selected' : ''}>ફૂલ (100%)</option>
                        </select>
                        <select id="gvSImgAlign" class="gv-select" style="width:auto; padding:4px 8px; font-size:12px;">
                            <option value="left" ${qObj.solutionImageAlign === 'left' ? 'selected' : ''}>ડાબે</option>
                            <option value="center" ${qObj.solutionImageAlign === 'center' ? 'selected' : ''}>વચ્ચે</option>
                            <option value="right" ${qObj.solutionImageAlign === 'right' ? 'selected' : ''}>જમણે</option>
                        </select>
                        <button type="button" id="gvSImgClear" class="gv-btn gv-btn-red" style="padding:3px 8px; font-size:11.5px;">હટાવો</button>
                    </div>
                    <div id="gvSImgPrev" style="margin-top:6px;">${qObj.solutionImage ? '<img src="' + qObj.solutionImage + '" style="max-height:90px; border:1px solid #cbd5e1; border-radius:4px;">' : ''}</div>
                </div>

                <div style="display:flex; gap:8px; justify-content:space-between; flex-wrap:wrap; align-items:center;">
                    <button type="button" id="gvQModalLivePreviewBtn" class="gv-btn gv-btn-orange" style="font-size:12.5px;">👁️ લાઈવ કોષ્ટક/ગણિત પ્રિવ્યૂ</button>
                    <div style="display:flex; gap:8px;">
                        <button type="button" id="gvQModalCancel" class="gv-btn gv-btn-dark">રદ કરો</button>
                        <button type="button" id="gvQModalSave" class="gv-btn gv-btn-green">💾 પ્રશ્ન સેવ કરો</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);

        let tempQImage = qObj.image || '';
        let tempSImage = qObj.solutionImage || '';

        const updateLiveModalPreview = () => {
            const pBox = modal.querySelector('#gvModalLivePreviewBox');
            if (!pBox || pBox.style.display === 'none') return;
            const qt = modal.querySelector('#gvQText').value;
            const qa = modal.querySelector('#gvQAns').value;
            pBox.innerHTML = '<div style="font-size:12px; font-weight:700; color:#b45309; margin-bottom:4px;">👁️ લાઈવ પ્રિવ્યૂ (આ રીતે પ્રશ્ન અને કોષ્ટક દેખાશે):</div>' +
                '<div><strong>પ્રશ્ન:</strong> ' + formatDisplayBlock(qt) + '</div>' +
                (qa ? '<div style="margin-top:8px; padding-top:6px; border-top:1px dashed #fbbf24;"><strong>ઉત્તર:</strong> ' + formatAnswerCardHTML(qa) + '</div>' : '');
        };

        modal.querySelector('#gvQModalLivePreviewBtn').onclick = () => {
            const pBox = modal.querySelector('#gvModalLivePreviewBox');
            pBox.style.display = pBox.style.display === 'none' ? 'block' : 'none';
            updateLiveModalPreview();
        };
        modal.querySelector('#gvQText').addEventListener('input', updateLiveModalPreview);
        modal.querySelector('#gvQAns').addEventListener('input', updateLiveModalPreview);

        modal.querySelector('#gvQImgFile').onchange = (e) => {
            readImageFileAsDataURL(e.target.files[0], (dataUrl) => {
                tempQImage = dataUrl;
                modal.querySelector('#gvQImgPrev').innerHTML = '<img src="' + dataUrl + '" style="max-height:90px; border:1px solid #cbd5e1; border-radius:4px;">';
            });
        };
        modal.querySelector('#gvQImgClear').onclick = () => { tempQImage = ''; modal.querySelector('#gvQImgPrev').innerHTML = ''; };

        modal.querySelector('#gvSImgFile').onchange = (e) => {
            readImageFileAsDataURL(e.target.files[0], (dataUrl) => {
                tempSImage = dataUrl;
                modal.querySelector('#gvSImgPrev').innerHTML = '<img src="' + dataUrl + '" style="max-height:90px; border:1px solid #cbd5e1; border-radius:4px;">';
            });
        };
        modal.querySelector('#gvSImgClear').onclick = () => { tempSImage = ''; modal.querySelector('#gvSImgPrev').innerHTML = ''; };

        const close = () => modal.remove();
        modal.querySelector('#gvQModalCloseX').onclick = close;
        modal.querySelector('#gvQModalCancel').onclick = close;

        modal.querySelector('#gvQModalSave').onclick = () => {
            const textVal = modal.querySelector('#gvQText').value.trim();
            if (!textVal) {
                window.showToast('કૃપા કરીને પ્રશ્નનું લખાણ લખો.', 'error');
                return;
            }
            const updatedQ = {
                id: qObj.id,
                standard: modal.querySelector('#gvQStd').value.trim(),
                subject: modal.querySelector('#gvQSub').value.trim(),
                chapter: modal.querySelector('#gvQCh').value.trim(),
                type: modal.querySelector('#gvQType').value.trim() || 'MCQ',
                marks: Number(modal.querySelector('#gvQMarks').value) || 1,
                lang: modal.querySelector('#gvQLang').value || 'gu',
                instruction: modal.querySelector('#gvQInst').value.trim(),
                text: textVal,
                answer: modal.querySelector('#gvQAns').value.trim(),
                image: tempQImage,
                imageWidth: modal.querySelector('#gvQImgW').value,
                imageAlign: modal.querySelector('#gvQImgAlign').value,
                solutionImage: tempSImage,
                solutionImageWidth: modal.querySelector('#gvSImgW').value,
                solutionImageAlign: modal.querySelector('#gvSImgAlign').value
            };
            mergeQuestionsIntoBank([updatedQ]);
            window.showToast(existing ? '✅ પ્રશ્ન અપડેટ થઈ ગયો!' : '✅ નવો પ્રશ્ન સેવ થઈ ગયો!');
            close();
            renderCurrentView();
        };
    }

    // ==========================================
    // 8. BULK JSON IMPORT & BACKUP / EXPORT
    // ==========================================
    function openBulkImportModal() {
        const old = document.getElementById('gvBulkModal');
        if (old) old.remove();

        const overlay = document.createElement('div');
        overlay.id = 'gvBulkModal';
        overlay.className = 'gv-modal-overlay';
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="gv-modal-box" style="max-width:700px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:8px; margin-bottom:12px;">
                    <h3 style="margin:0; color:#1e3a8a;">📥 બલ્ક JSON ઈમ્પોર્ટ (Paste અથવા .json ફાઈલ)</h3>
                    <button type="button" id="biCloseX" style="border:none; background:#fee2e2; color:#b91c1c; font-weight:bold; padding:4px 10px; border-radius:6px; cursor:pointer;">✖</button>
                </div>
                <div style="margin-bottom:10px;">
                    <label style="font-size:13px; font-weight:bold; display:block; margin-bottom:4px;">📁 અથવા કમ્પ્યુટર/ફોનમાંથી .json ફાઈલ પસંદ કરો:</label>
                    <input type="file" id="biFile" accept=".json,application/json">
                </div>
                <div style="margin-bottom:10px;">
                    <label style="font-size:13px; font-weight:bold; display:block; margin-bottom:4px;">📋 અથવા JSON Array અહીં પેસ્ટ કરો:</label>
                    <textarea id="biText" rows="9" class="gv-input" placeholder='[ { "id": "Q_STD10_...", "standard": "10", ... } ]'></textarea>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:8px;">
                    <button type="button" id="biCancel" class="gv-btn gv-btn-dark">રદ કરો</button>
                    <button type="button" id="biImportBtn" class="gv-btn gv-btn-green">📥 ઈમ્પોર્ટ કરો</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        const close = () => overlay.remove();
        overlay.querySelector('#biCloseX').onclick = close;
        overlay.querySelector('#biCancel').onclick = close;

        overlay.querySelector('#biFile').onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => { overlay.querySelector('#biText').value = ev.target.result; };
            reader.readAsText(file);
        };

        overlay.querySelector('#biImportBtn').onclick = () => {
            let raw = overlay.querySelector('#biText').value.trim();
            if (!raw) { window.showToast('કૃપા કરીને JSON પેસ્ટ કરો અથવા ફાઈલ પસંદ કરો.', 'error'); return; }
            raw = raw.replace(/^\x60\x60\x60(?:json)?\s*/i, '').replace(/\x60\x60\x60\s*$/i, '').trim();
            try {
                const parsed = JSON.parse(raw);
                const arr = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.questions) ? parsed.questions : null);
                if (!arr) throw new Error('JSON માં પ્રશ્નોની યાદી (Array) મળી નથી.');
                const res = mergeQuestionsIntoBank(arr);
                window.showToast('✅ ઈમ્પોર્ટ સફળ! ' + res.added + ' નવા ઉમેરાયા, ' + res.updated + ' અપડેટ થયા.');
                close();
                renderCurrentView();
            } catch (err) {
                window.showToast('❌ JSON ભૂલ: ' + err.message, 'error');
            }
        };
    }

    function downloadJSONFile(dataObj, fileName) {
        const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ==========================================
    // 9. PAPER PREVIEW MODAL (WITH 1-CLICK TRANSPOSE)
    // ==========================================
    window.openPaperPreviewModal = function (paperObj, initialType) {
        const old = document.getElementById('gvPreviewModal');
        if (old) old.remove();

        let currentPreviewType = initialType || 'question';
        const overlay = document.createElement('div');
        overlay.id = 'gvPreviewModal';
        overlay.className = 'gv-modal-overlay';
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="gv-modal-box" style="max-width:960px; padding:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; background:#1e293b; color:#fff; padding:10px 14px; border-radius:8px; margin-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <strong style="font-size:15px;">👁️ પેપર પ્રિવ્યૂ</strong>
                        <button type="button" id="pvTabQ" class="gv-btn gv-btn-blue" style="padding:5px 11px; font-size:12.5px;">📄 પ્રશ્નપત્ર</button>
                        <button type="button" id="pvTabSol" class="gv-btn gv-btn-dark" style="padding:5px 11px; font-size:12.5px;">🔑 Answer Key</button>
                        <button type="button" id="pvTransposeTbl" class="gv-btn gv-btn-teal" style="padding:5px 11px; font-size:12.5px;" title="મોટા આડા કોષ્ટકને ઊભા 2-કોલમ કોષ્ટકમાં ફેરવો">🔄 કોષ્ટક: આડું / ઊભું</button>
                    </div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button type="button" id="pvPrintPDF" class="gv-btn gv-btn-green" style="padding:5px 11px; font-size:12.5px;">🖨️ PDF / Print</button>
                        <button type="button" id="pvWord" class="gv-btn gv-btn-purple" style="padding:5px 11px; font-size:12.5px;">📝 Word (.doc)</button>
                        <button type="button" id="pvClose" class="gv-btn gv-btn-red" style="padding:5px 11px; font-size:12.5px;">✖ બંધ કરો</button>
                    </div>
                </div>
                <div id="gvPreviewSheetContent" class="gv-preview-sheet"></div>
            </div>`;
        document.body.appendChild(overlay);

        const renderSheet = () => {
            const sheet = overlay.querySelector('#gvPreviewSheetContent');
            if (typeof window.generatePaperHTML === 'function') {
                sheet.innerHTML = window.generatePaperHTML(paperObj, currentPreviewType, false);
            } else {
                sheet.innerHTML = '<p style="color:red;">pdf-generator.js લોડ થયેલ નથી.</p>';
            }
            overlay.querySelector('#pvTabQ').className = 'gv-btn ' + (currentPreviewType === 'question' ? 'gv-btn-blue' : 'gv-btn-dark');
            overlay.querySelector('#pvTabSol').className = 'gv-btn ' + (currentPreviewType === 'solution' ? 'gv-btn-blue' : 'gv-btn-dark');
        };
        renderSheet();

        overlay.querySelector('#pvTabQ').onclick = () => { currentPreviewType = 'question'; renderSheet(); };
        overlay.querySelector('#pvTabSol').onclick = () => { currentPreviewType = 'solution'; renderSheet(); };
        overlay.querySelector('#pvTransposeTbl').onclick = () => {
            const sheet = overlay.querySelector('#gvPreviewSheetContent');
            const cnt = window.GVTableEngine.toggleTransposeInContainer(sheet);
            if (cnt > 0) window.showToast('🔄 ' + cnt + ' મોટા કોષ્ટકનો લેઆઉટ બદલાયો!');
            else window.showToast('આ પેપરમાં આડા મોટા કોષ્ટક નથી.', 'error');
        };
        overlay.querySelector('#pvPrintPDF').onclick = () => window.openVectorPDFWindow(paperObj, currentPreviewType, true);
        overlay.querySelector('#pvWord').onclick = () => window.downloadWord(paperObj, currentPreviewType);
        overlay.querySelector('#pvClose').onclick = () => overlay.remove();
    };

    // ==========================================
    // 10. MANUAL QUESTION PICKER MODAL FOR PAPER MAKER
    // ==========================================
    function openManualPickerModal() {
        const old = document.getElementById('gvPickerModal');
        if (old) old.remove();

        let pState = {
            std: appState.draft.standard || '',
            subject: appState.draft.subject || '',
            chapter: '',
            type: '',
            marks: '',
            search: '',
            targetSec: 'A'
        };

        const overlay = document.createElement('div');
        overlay.id = 'gvPickerModal';
        overlay.className = 'gv-modal-overlay';
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="gv-modal-box" style="max-width:920px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:8px; margin-bottom:10px;">
                    <h3 style="margin:0; color:#1e3a8a;">✋ મેન્યુઅલ પ્રશ્ન પસંદગી (પેપરમાં ઉમેરો)</h3>
                    <button type="button" id="pkCloseX" style="border:none; background:#fee2e2; color:#b91c1c; font-weight:bold; padding:4px 10px; border-radius:6px; cursor:pointer;">✖</button>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(125px, 1fr)); gap:8px; margin-bottom:10px; background:#f8fafc; padding:10px; border-radius:8px;">
                    <select id="pkStd" class="gv-select"></select>
                    <select id="pkSub" class="gv-select"></select>
                    <select id="pkCh" class="gv-select"></select>
                    <select id="pkType" class="gv-select"></select>
                    <select id="pkMarks" class="gv-select">
                        <option value="">બધા ગુણ</option>
                        <option value="1">1 ગુણ</option><option value="2">2 ગુણ</option><option value="3">3 ગુણ</option><option value="4">4 ગુણ</option><option value="5">5 ગુણ</option>
                    </select>
                    <select id="pkTargetSec" class="gv-select" style="border-color:#16a34a; font-weight:700;">
                        <option value="A">વિભાગ A માં ઉમેરો</option>
                        <option value="B">વિભાગ B માં ઉમેરો</option>
                        <option value="C">વિભાગ C માં ઉમેરો</option>
                        <option value="D">વિભાગ D માં ઉમેરો</option>
                        <option value="None">વિભાગ વગર (None)</option>
                    </select>
                </div>
                <div style="margin-bottom:10px;"><input id="pkSearch" class="gv-input" placeholder="🔍 પ્રશ્ન શોધો..."></div>
                <div id="pkList" style="max-height:420px; overflow-y:auto; padding-right:4px;"></div>
                <div style="display:flex; justify-content:flex-end; margin-top:10px;">
                    <button type="button" id="pkDone" class="gv-btn gv-btn-green">✅ પસંદગી પૂર્ણ કરો</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        const fillDropdowns = () => {
            const stds = Array.from(new Set(appState.questions.map(q => q.standard).filter(Boolean))).sort(sortAlphaNum);
            overlay.querySelector('#pkStd').innerHTML = '<option value="">બધા ધોરણ</option>' + stds.map(s => '<option value="' + escapeAttr(s) + '" ' + (pState.std === s ? 'selected' : '') + '>ધોરણ ' + escapeHtml(s) + '</option>').join('');

            const subPool = appState.questions.filter(q => !pState.std || String(q.standard) === pState.std);
            const subs = Array.from(new Set(subPool.map(q => q.subject).filter(Boolean))).sort(sortAlphaNum);
            overlay.querySelector('#pkSub').innerHTML = '<option value="">બધા વિષય</option>' + subs.map(s => '<option value="' + escapeAttr(s) + '" ' + (pState.subject === s ? 'selected' : '') + '>' + escapeHtml(s) + '</option>').join('');

            const chPool = subPool.filter(q => !pState.subject || String(q.subject) === pState.subject);
            const chs = Array.from(new Set(chPool.map(q => q.chapter).filter(Boolean))).sort(sortAlphaNum);
            overlay.querySelector('#pkCh').innerHTML = '<option value="">બધા પ્રકરણ</option>' + chs.map(c => '<option value="' + escapeAttr(c) + '" ' + (pState.chapter === c ? 'selected' : '') + '>પ્રકરણ ' + escapeHtml(c) + '</option>').join('');

            const types = Array.from(new Set(chPool.map(q => q.type).filter(Boolean)));
            overlay.querySelector('#pkType').innerHTML = '<option value="">બધા પ્રકાર</option>' + types.map(t => '<option value="' + escapeAttr(t) + '" ' + (pState.type === t ? 'selected' : '') + '>' + escapeHtml(t) + '</option>').join('');
        };

        const renderList = () => {
            const draftIds = new Set(appState.draft.questions.map(x => String(x.id)));
            const filtered = appState.questions.filter(q => {
                if (pState.std && String(q.standard) !== pState.std) return false;
                if (pState.subject && String(q.subject) !== pState.subject) return false;
                if (pState.chapter && String(q.chapter) !== pState.chapter) return false;
                if (pState.type && String(q.type) !== pState.type) return false;
                if (pState.marks && String(q.marks) !== pState.marks) return false;
                if (pState.search && !String(q.text || '').toLowerCase().includes(pState.search.toLowerCase())) return false;
                return true;
            });

            const listEl = overlay.querySelector('#pkList');
            if (!filtered.length) {
                listEl.innerHTML = '<div style="padding:20px; text-align:center; color:#64748b;">કોઈ પ્રશ્ન મળ્યો નથી.</div>';
                return;
            }
            const shown = filtered.slice(0, 80);
            listEl.innerHTML = '<div style="font-size:12px; color:#64748b; margin-bottom:6px;">કુલ ' + filtered.length + ' પ્રશ્નો મળ્યા (પ્રથમ ' + shown.length + ' દર્શાવ્યા છે)</div>' +
                shown.map(q => {
                    const added = draftIds.has(String(q.id));
                    return `
                        <div style="border:1px solid ${added ? '#16a34a' : '#e2e8f0'}; background:${added ? '#f0fdf4' : '#fff'}; border-radius:8px; padding:10px; margin-bottom:8px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:6px; flex-wrap:wrap;">
                                <div style="display:flex; gap:5px; flex-wrap:wrap;">
                                    <span class="gv-badge gv-badge-blue">પ્ર.${escapeHtml(q.chapter)}</span>
                                    <span class="gv-badge gv-badge-purple">${escapeHtml(q.type)}</span>
                                    <span class="gv-badge gv-badge-amber">${q.marks} ગુણ</span>
                                </div>
                                <button type="button" class="gv-btn ${added ? 'gv-btn-red' : 'gv-btn-green'} pk-toggle-btn" data-id="${escapeAttr(q.id)}" style="padding:4px 10px; font-size:12px;">
                                    ${added ? '➖ દૂર કરો' : ('➕ વિભાગ ' + pState.targetSec)}
                                </button>
                            </div>
                            <div style="font-size:14px; line-height:1.8;">${formatQuestionCardHTML(q)}</div>
                        </div>`;
                }).join('');

            listEl.querySelectorAll('.pk-toggle-btn').forEach(btn => {
                btn.onclick = () => {
                    const qid = btn.dataset.id;
                    const idx = appState.draft.questions.findIndex(x => String(x.id) === qid);
                    if (idx !== -1) {
                        appState.draft.questions.splice(idx, 1);
                    } else {
                        const orig = appState.questions.find(x => String(x.id) === qid);
                        if (orig) {
                            appState.draft.questions.push(Object.assign({}, orig, { section: pState.targetSec }));
                            if (!appState.draft.standard) appState.draft.standard = orig.standard;
                            if (!appState.draft.subject) appState.draft.subject = orig.subject;
                        }
                    }
                    renderList();
                };
            });
        };

        fillDropdowns();
        renderList();

        overlay.querySelector('#pkStd').onchange = (e) => { pState.std = e.target.value; pState.subject = ''; pState.chapter = ''; fillDropdowns(); renderList(); };
        overlay.querySelector('#pkSub').onchange = (e) => { pState.subject = e.target.value; pState.chapter = ''; fillDropdowns(); renderList(); };
        overlay.querySelector('#pkCh').onchange = (e) => { pState.chapter = e.target.value; renderList(); };
        overlay.querySelector('#pkType').onchange = (e) => { pState.type = e.target.value; renderList(); };
        overlay.querySelector('#pkMarks').onchange = (e) => { pState.marks = e.target.value; renderList(); };
        overlay.querySelector('#pkTargetSec').onchange = (e) => { pState.targetSec = e.target.value; renderList(); };
        overlay.querySelector('#pkSearch').oninput = (e) => { pState.search = e.target.value; renderList(); };

        const done = () => { overlay.remove(); renderCurrentView(); };
        overlay.querySelector('#pkCloseX').onclick = done;
        overlay.querySelector('#pkDone').onclick = done;
    }

    // ==========================================
    // 11. VIEWS: DASHBOARD, QUESTION BANK, PAPER MAKER, SAVED PAPERS, SETTINGS
    // ==========================================
    function renderDashboard(container) {
        const subjectGroups = {};
        appState.questions.forEach(q => {
            const key = (q.standard || '?') + '|||' + (q.subject || 'અન્ય');
            if (!subjectGroups[key]) subjectGroups[key] = { std: q.standard || '?', subject: q.subject || 'અન્ય', chapters: new Set(), count: 0 };
            if (q.chapter) subjectGroups[key].chapters.add(String(q.chapter));
            subjectGroups[key].count++;
        });
        const rows = Object.values(subjectGroups).sort((a, b) => sortAlphaNum(a.std, b.std) || sortAlphaNum(a.subject, b.subject));

        container.innerHTML = `
            <div class="gv-kpi-grid">
                <div class="gv-kpi" style="border-left-color:#2563eb;"><div class="num">${appState.questions.length}</div><div class="lbl">📚 કુલ પ્રશ્નો</div></div>
                <div class="gv-kpi" style="border-left-color:#0d9488;"><div class="num">${rows.length}</div><div class="lbl">📘 કુલ વિષયો</div></div>
                <div class="gv-kpi" style="border-left-color:#7c3aed;"><div class="num">${appState.papers.length}</div><div class="lbl">🗂️ સેવ કરેલા પેપર્સ</div></div>
                <div class="gv-kpi" style="border-left-color:#16a34a;"><div class="num">${appState.draft.questions.length}</div><div class="lbl">📝 ડ્રાફ્ટમાં પ્રશ્નો</div></div>
            </div>

            <div class="gv-card">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
                    <h2 style="margin:0; font-size:17px;">📘 ઉપલબ્ધ ધોરણ અને વિષય મુજબ પ્રશ્ન બેંક</h2>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button type="button" id="dashOpenLib" class="gv-btn gv-btn-teal">☁️ ઓનલાઈન લાઈબ્રેરી</button>
                        <button type="button" id="dashBulkImp" class="gv-btn gv-btn-purple">📥 JSON ઈમ્પોર્ટ</button>
                        <button type="button" id="dashAddQ" class="gv-btn gv-btn-green">➕ નવો પ્રશ્ન</button>
                    </div>
                </div>
                ${rows.length === 0 ? `
                    <div style="padding:26px; text-align:center; background:#f8fafc; border-radius:8px; color:#475569;">
                        <div style="font-size:16px; font-weight:700; margin-bottom:8px;">હજુ સુધી કોઈ પ્રશ્ન ઉમેરેલ નથી.</div>
                        <p style="margin:0 0 14px 0; font-size:13.5px;">ઉપરના <strong>☁️ ઓનલાઈન લાઈબ્રેરી</strong> બટનથી GitHub પરથી પ્રશ્ન બેંક ડાઉનલોડ કરો અથવા <strong>📥 JSON ઈમ્પોર્ટ</strong> કરો.</p>
                    </div>
                ` : `
                    <div style="overflow-x:auto;">
                        <table class="gv-dash-table">
                            <thead><tr><th>ધોરણ</th><th>વિષય</th><th>પ્રકરણો</th><th>કુલ પ્રશ્નો</th><th>કાર્યવાહી</th></tr></thead>
                            <tbody>
                                ${rows.map(r => `
                                    <tr>
                                        <td><strong>ધોરણ ${escapeHtml(r.std)}</strong></td>
                                        <td><strong>${escapeHtml(r.subject)}</strong></td>
                                        <td>${r.chapters.size} પ્રકરણ</td>
                                        <td><strong>${r.count} પ્રશ્નો</strong></td>
                                        <td style="display:flex; gap:6px; flex-wrap:wrap;">
                                            <button type="button" class="gv-btn gv-btn-blue dash-mk-paper" data-std="${escapeAttr(r.std)}" data-sub="${escapeAttr(r.subject)}" style="padding:5px 10px; font-size:12px;">📄 પેપર બનાવો</button>
                                            <button type="button" class="gv-btn gv-btn-outline dash-view-qb" data-std="${escapeAttr(r.std)}" data-sub="${escapeAttr(r.subject)}" style="padding:5px 10px; font-size:12px;">📚 પ્રશ્નો જુઓ</button>
                                            <button type="button" class="gv-btn gv-btn-dark dash-exp-sub" data-std="${escapeAttr(r.std)}" data-sub="${escapeAttr(r.subject)}" style="padding:5px 10px; font-size:12px;">💾 બેકઅપ</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;

        container.querySelector('#dashOpenLib').onclick = () => window.openOnlineLibraryModal();
        container.querySelector('#dashBulkImp').onclick = () => openBulkImportModal();
        container.querySelector('#dashAddQ').onclick = () => openQuestionModal(null);

        container.querySelectorAll('.dash-mk-paper').forEach(btn => {
            btn.onclick = () => {
                appState.draft.standard = btn.dataset.std;
                appState.draft.subject = btn.dataset.sub;
                appState.draft.selectedChapters = [];
                appState.activeTab = 'papermaker';
                renderCurrentView();
            };
        });
        container.querySelectorAll('.dash-view-qb').forEach(btn => {
            btn.onclick = () => {
                appState.filters.std = btn.dataset.std;
                appState.filters.subject = btn.dataset.sub;
                appState.filters.chapter = '';
                appState.filters.page = 1;
                appState.activeTab = 'bank';
                renderCurrentView();
            };
        });
        container.querySelectorAll('.dash-exp-sub').forEach(btn => {
            btn.onclick = () => {
                const subQs = appState.questions.filter(q => String(q.standard) === btn.dataset.std && String(q.subject) === btn.dataset.sub);
                downloadJSONFile(subQs, 'std' + btn.dataset.std + '_' + btn.dataset.sub + '.json');
                window.showToast('💾 ' + subQs.length + ' પ્રશ્નોનો બેકઅપ ડાઉનલોડ થયો!');
            };
        });
    }

    function renderQuestionBank(container) {
        const f = appState.filters;
        const stds = Array.from(new Set(appState.questions.map(q => q.standard).filter(Boolean))).sort(sortAlphaNum);
        const byStd = appState.questions.filter(q => !f.std || String(q.standard) === f.std);
        const subs = Array.from(new Set(byStd.map(q => q.subject).filter(Boolean))).sort(sortAlphaNum);
        const bySub = byStd.filter(q => !f.subject || String(q.subject) === f.subject);
        const chs = Array.from(new Set(bySub.map(q => q.chapter).filter(Boolean))).sort(sortAlphaNum);
        const types = Array.from(new Set(bySub.map(q => q.type).filter(Boolean)));
        const insts = Array.from(new Set(bySub.map(q => window.getEffectiveInstruction(q)).filter(Boolean)));
        const marksList = Array.from(new Set(bySub.map(q => String(q.marks)).filter(Boolean))).sort(sortAlphaNum);

        const filtered = bySub.filter(q => {
            if (f.chapter && String(q.chapter) !== f.chapter) return false;
            if (f.type && String(q.type) !== f.type) return false;
            if (f.instruction && window.getEffectiveInstruction(q) !== f.instruction) return false;
            if (f.marks && String(q.marks) !== f.marks) return false;
            if (f.search) {
                const needle = f.search.toLowerCase();
                if (!String(q.text || '').toLowerCase().includes(needle) && !String(q.answer || '').toLowerCase().includes(needle) && !String(q.id || '').toLowerCase().includes(needle)) return false;
            }
            return true;
        });

        const perPage = 30;
        const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
        if (f.page > totalPages) f.page = totalPages;
        const startIdx = (f.page - 1) * perPage;
        const pageItems = filtered.slice(startIdx, startIdx + perPage);

        container.innerHTML = `
            <div class="gv-card">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
                    <h2 style="margin:0; font-size:17px;">📚 પ્રશ્ન બેંક (${filtered.length} / ${appState.questions.length})</h2>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button type="button" id="qbAddBtn" class="gv-btn gv-btn-green">➕ નવો પ્રશ્ન</button>
                        <button type="button" id="qbBulkBtn" class="gv-btn gv-btn-purple">📥 JSON ઈમ્પોર્ટ</button>
                        <button type="button" id="qbLibBtn" class="gv-btn gv-btn-teal">☁️ ઓનલાઈન લાઈબ્રેરી</button>
                        <button type="button" id="qbSubBackup" class="gv-btn gv-btn-blue">💾 આ વિષયનો બેકઅપ</button>
                        <button type="button" id="qbFullBackup" class="gv-btn gv-btn-dark">💾 સંપૂર્ણ બેકઅપ</button>
                        <button type="button" id="qbDelFiltered" class="gv-btn gv-btn-red">🗑️ ફિલ્ટર કરેલા ડિલીટ</button>
                    </div>
                </div>

                <div class="gv-filter-grid">
                    <select id="fStd" class="gv-select"><option value="">બધા ધોરણ</option>${stds.map(s => '<option value="' + escapeAttr(s) + '" ' + (f.std === s ? 'selected' : '') + '>ધોરણ ' + escapeHtml(s) + '</option>').join('')}</select>
                    <select id="fSub" class="gv-select"><option value="">બધા વિષય</option>${subs.map(s => '<option value="' + escapeAttr(s) + '" ' + (f.subject === s ? 'selected' : '') + '>' + escapeHtml(s) + '</option>').join('')}</select>
                    <select id="fCh" class="gv-select"><option value="">બધા પ્રકરણ</option>${chs.map(c => '<option value="' + escapeAttr(c) + '" ' + (f.chapter === c ? 'selected' : '') + '>પ્રકરણ ' + escapeHtml(c) + '</option>').join('')}</select>
                    <select id="fType" class="gv-select"><option value="">બધા પ્રકાર</option>${types.map(t => '<option value="' + escapeAttr(t) + '" ' + (f.type === t ? 'selected' : '') + '>' + escapeHtml(t) + '</option>').join('')}</select>
                    <select id="fMarks" class="gv-select"><option value="">બધા ગુણ</option>${marksList.map(m => '<option value="' + escapeAttr(m) + '" ' + (f.marks === m ? 'selected' : '') + '>' + escapeHtml(m) + ' ગુણ</option>').join('')}</select>
                    <select id="fInst" class="gv-select"><option value="">બધી સૂચનાઓ</option>${insts.map(i => '<option value="' + escapeAttr(i) + '" ' + (f.instruction === i ? 'selected' : '') + '>' + escapeHtml(i.slice(0, 48)) + '</option>').join('')}</select>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                    <input id="fSearch" class="gv-input" style="flex:1; min-width:200px;" value="${escapeAttr(f.search)}" placeholder="🔍 પ્રશ્ન, ઉત્તર કે ID શોધો...">
                    <button type="button" id="fReset" class="gv-btn gv-btn-outline">🔄 ફિલ્ટર રીસેટ</button>
                </div>
            </div>

            <div id="qbCardsWrap">
                ${pageItems.length === 0 ? '<div class="gv-card" style="text-align:center; color:#64748b; padding:30px;">કોઈ પ્રશ્ન મળ્યો નથી.</div>' : pageItems.map((q, idx) => `
                    <div class="gv-q-card">
                        <div class="gv-q-head">
                            <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                                <span class="gv-badge" style="background:#0f172a; color:#fff;">#${startIdx + idx + 1}</span>
                                <span class="gv-badge gv-badge-blue">ધો.${escapeHtml(q.standard)} | ${escapeHtml(q.subject)}</span>
                                <span class="gv-badge gv-badge-green">પ્રકરણ ${escapeHtml(q.chapter)}</span>
                                <span class="gv-badge gv-badge-purple">${escapeHtml(q.type)}</span>
                                <span class="gv-badge gv-badge-amber">${q.marks} ગુણ</span>
                                <span style="font-size:11px; color:#94a3b8;">${escapeHtml(q.id)}</span>
                            </div>
                            <div style="display:flex; gap:5px;">
                                <button type="button" class="gv-btn gv-btn-blue qb-edit-btn" data-id="${escapeAttr(q.id)}" style="padding:4px 9px; font-size:12px;">✏️ સુધારો</button>
                                <button type="button" class="gv-btn gv-btn-red qb-del-btn" data-id="${escapeAttr(q.id)}" style="padding:4px 9px; font-size:12px;">🗑️</button>
                            </div>
                        </div>
                        <div class="gv-q-body">${formatQuestionCardHTML(q)}</div>
                        ${q.image ? '<div style="margin:6px 0; text-align:' + (q.imageAlign || 'center') + ';"><img src="' + q.image + '" style="width:' + (q.imageWidth || '220px') + '; max-width:100%; border:1px solid #e2e8f0; border-radius:4px;"></div>' : ''}
                        ${(q.answer || q.solutionImage) ? `
                            <div class="gv-q-ans">
                                <strong style="color:#15803d;">ઉત્તર:</strong>
                                <div style="margin-top:3px;">${formatAnswerCardHTML(q.answer)}</div>
                                ${q.solutionImage ? '<div style="margin-top:6px; text-align:' + (q.solutionImageAlign || 'left') + ';"><img src="' + q.solutionImage + '" style="width:' + (q.solutionImageWidth || '240px') + '; max-width:100%; border:1px solid #cbd5e1; border-radius:4px;"></div>' : ''}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>

            ${totalPages > 1 ? `
                <div style="display:flex; justify-content:center; align-items:center; gap:10px; margin-top:14px;">
                    <button type="button" id="pgPrev" class="gv-btn gv-btn-outline" ${f.page <= 1 ? 'disabled' : ''}>◀ પાછલું</button>
                    <strong style="font-size:14px;">પેજ ${f.page} / ${totalPages}</strong>
                    <button type="button" id="pgNext" class="gv-btn gv-btn-outline" ${f.page >= totalPages ? 'disabled' : ''}>આગળનું ▶</button>
                </div>
            ` : ''}
        `;

        container.querySelector('#qbAddBtn').onclick = () => openQuestionModal(null);
        container.querySelector('#qbBulkBtn').onclick = () => openBulkImportModal();
        container.querySelector('#qbLibBtn').onclick = () => window.openOnlineLibraryModal();
        container.querySelector('#qbSubBackup').onclick = () => {
            if (!filtered.length) { window.showToast('બેકઅપ માટે કોઈ પ્રશ્ન નથી.', 'error'); return; }
            const fn = 'std' + (f.std || 'all') + '_' + (f.subject || 'subject') + '_backup.json';
            downloadJSONFile(filtered, fn);
            window.showToast('💾 ' + filtered.length + ' પ્રશ્નોનો બેકઅપ ડાઉનલોડ થયો!');
        };
        container.querySelector('#qbFullBackup').onclick = () => {
            downloadJSONFile(appState.questions, 'gyanvruksh_full_backup_' + new Date().toISOString().slice(0, 10) + '.json');
            window.showToast('💾 કુલ ' + appState.questions.length + ' પ્રશ્નોનો સંપૂર્ણ બેકઅપ ડાઉનલોડ થયો!');
        };
        container.querySelector('#qbDelFiltered').onclick = () => {
            if (!filtered.length) return;
            if (!confirm('શું તમે ફિલ્ટર થયેલા કુલ ' + filtered.length + ' પ્રશ્નો ડિલીટ કરવા માંગો છો?')) return;
            const delSet = new Set(filtered.map(x => String(x.id)));
            saveQuestionsToStorage(appState.questions.filter(x => !delSet.has(String(x.id))));
            window.showToast('🗑️ ' + filtered.length + ' પ્રશ્નો ડિલીટ થયા.');
            renderCurrentView();
        };

        container.querySelector('#fStd').onchange = (e) => { f.std = e.target.value; f.subject = ''; f.chapter = ''; f.page = 1; renderCurrentView(); };
        container.querySelector('#fSub').onchange = (e) => { f.subject = e.target.value; f.chapter = ''; f.page = 1; renderCurrentView(); };
        container.querySelector('#fCh').onchange = (e) => { f.chapter = e.target.value; f.page = 1; renderCurrentView(); };
        container.querySelector('#fType').onchange = (e) => { f.type = e.target.value; f.page = 1; renderCurrentView(); };
        container.querySelector('#fMarks').onchange = (e) => { f.marks = e.target.value; f.page = 1; renderCurrentView(); };
        container.querySelector('#fInst').onchange = (e) => { f.instruction = e.target.value; f.page = 1; renderCurrentView(); };
        container.querySelector('#fSearch').oninput = (e) => { f.search = e.target.value; f.page = 1; renderCurrentView(); };
        container.querySelector('#fReset').onclick = () => {
            appState.filters = { std: '', subject: '', chapter: '', type: '', instruction: '', marks: '', search: '', page: 1 };
            renderCurrentView();
        };

        container.querySelectorAll('.qb-edit-btn').forEach(btn => { btn.onclick = () => openQuestionModal(btn.dataset.id); });
        container.querySelectorAll('.qb-del-btn').forEach(btn => {
            btn.onclick = () => {
                if (!confirm('આ પ્રશ્ન ડિલીટ કરવો છે?')) return;
                saveQuestionsToStorage(appState.questions.filter(x => String(x.id) !== btn.dataset.id));
                window.showToast('🗑️ પ્રશ્ન ડિલીટ થયો.');
                renderCurrentView();
            };
        });

        const prevBtn = container.querySelector('#pgPrev');
        const nextBtn = container.querySelector('#pgNext');
        if (prevBtn) prevBtn.onclick = () => { f.page = Math.max(1, f.page - 1); renderCurrentView(); window.scrollTo(0, 0); };
        if (nextBtn) nextBtn.onclick = () => { f.page = Math.min(totalPages, f.page + 1); renderCurrentView(); window.scrollTo(0, 0); };
    }

    function computeDraftTotalMarks() {
        const d = appState.draft;
        const sMeta = d.sectionsMetadata || {};
        let total = 0;
        ALL_SECTIONS.forEach(sec => {
            const qs = d.questions.filter(q => (q.section || 'None') === sec);
            total += window.calculateSectionEffectiveMarks(qs, sMeta[sec]);
        });
        return total;
    }

    function autoGeneratePaper(blueprint) {
        const d = appState.draft;
        if (!d.standard || !d.subject) {
            window.showToast('કૃપા કરીને પહેલા ધોરણ અને વિષય પસંદ કરો.', 'error');
            return;
        }
        const pool = appState.questions.filter(q => {
            if (String(q.standard) !== String(d.standard)) return false;
            if (String(q.subject) !== String(d.subject)) return false;
            if (d.selectedChapters && d.selectedChapters.length > 0 && !d.selectedChapters.includes(String(q.chapter))) return false;
            return true;
        });

        if (!pool.length) {
            window.showToast('પસંદ કરેલ ધોરણ/વિષય/પ્રકરણમાં કોઈ પ્રશ્નો નથી.', 'error');
            return;
        }

        const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);
        const usedIds = new Set();
        const picked = [];

        const pickN = (filterFn, count, sectionName) => {
            const avail = shuffle(pool.filter(q => !usedIds.has(q.id) && filterFn(q)));
            avail.slice(0, count).forEach(q => {
                usedIds.add(q.id);
                picked.push(Object.assign({}, q, { section: sectionName }));
            });
        };

        blueprint.forEach(rule => {
            pickN(q => {
                if (rule.types && rule.types.length > 0 && !rule.types.includes(q.type)) return false;
                if (rule.marks && Number(q.marks) !== Number(rule.marks)) return false;
                return true;
            }, rule.count, rule.section);
        });

        d.questions = picked;
        if (blueprint.meta) {
            d.sectionsMetadata = JSON.parse(JSON.stringify(blueprint.meta));
        }
        window.showToast('⚡ ' + picked.length + ' પ્રશ્નોનું પેપર ઓટો-જનરેટ થઈ ગયું! (કુલ ગુણ: ' + computeDraftTotalMarks() + ')');
        renderCurrentView();
    }

    function renderPaperMaker(container) {
        const d = appState.draft;
        const stds = Array.from(new Set(appState.questions.map(q => q.standard).filter(Boolean))).sort(sortAlphaNum);
        const byStd = appState.questions.filter(q => !d.standard || String(q.standard) === String(d.standard));
        const subs = Array.from(new Set(byStd.map(q => q.subject).filter(Boolean))).sort(sortAlphaNum);
        const bySub = byStd.filter(q => !d.subject || String(q.subject) === String(d.subject));
        const chs = Array.from(new Set(bySub.map(q => q.chapter).filter(Boolean))).sort(sortAlphaNum);
        const totalMarks = computeDraftTotalMarks();

        container.innerHTML = `
            <div class="gv-card">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
                    <h2 style="margin:0; font-size:17px;">📝 પેપર મેકર (કુલ ગુણ: <span style="color:#16a34a;">${totalMarks}</span> | પ્રશ્નો: ${d.questions.length})</h2>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button type="button" id="pmPreview" class="gv-btn gv-btn-teal">👁️ પ્રિવ્યૂ જુઓ</button>
                        <button type="button" id="pmPdfQ" class="gv-btn gv-btn-green">🖨️ પ્રશ્નપત્ર PDF</button>
                        <button type="button" id="pmPdfSol" class="gv-btn gv-btn-orange">🔑 Answer Key PDF</button>
                        <button type="button" id="pmWord" class="gv-btn gv-btn-purple">📝 Word (.doc)</button>
                        <button type="button" id="pmSave" class="gv-btn gv-btn-blue">💾 પેપર સેવ કરો</button>
                        <button type="button" id="pmClear" class="gv-btn gv-btn-red">🗑️ ખાલી કરો</button>
                    </div>
                </div>

                <div class="gv-filter-grid">
                    <div><label style="font-size:12px; font-weight:bold;">પેપરનું નામ:</label><input id="pmTitle" class="gv-input" value="${escapeAttr(d.title)}"></div>
                    <div><label style="font-size:12px; font-weight:bold;">ધોરણ:</label>
                        <select id="pmStd" class="gv-select"><option value="">પસંદ કરો</option>${stds.map(s => '<option value="' + escapeAttr(s) + '" ' + (String(d.standard) === String(s) ? 'selected' : '') + '>ધોરણ ' + escapeHtml(s) + '</option>').join('')}</select>
                    </div>
                    <div><label style="font-size:12px; font-weight:bold;">વિષય:</label>
                        <select id="pmSub" class="gv-select"><option value="">પસંદ કરો</option>${subs.map(s => '<option value="' + escapeAttr(s) + '" ' + (String(d.subject) === String(s) ? 'selected' : '') + '>' + escapeHtml(s) + '</option>').join('')}</select>
                    </div>
                    <div><label style="font-size:12px; font-weight:bold;">તારીખ:</label><input id="pmDate" type="date" class="gv-input" value="${escapeAttr(d.date)}"></div>
                    <div><label style="font-size:12px; font-weight:bold;">ભાષા:</label>
                        <select id="pmLang" class="gv-select">
                            <option value="gu" ${d.lang === 'gu' ? 'selected' : ''}>ગુજરાતી</option>
                            <option value="en" ${d.lang === 'en' ? 'selected' : ''}>English</option>
                            <option value="hi" ${d.lang === 'hi' ? 'selected' : ''}>हिन्दी</option>
                            <option value="sa" ${d.lang === 'sa' ? 'selected' : ''}>संस्कृत</option>
                        </select>
                    </div>
                </div>

                ${chs.length > 0 ? `
                    <div style="margin-top:8px; padding:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
                            <strong style="font-size:13px;">📌 પ્રકરણ પસંદ કરો (ઓટો જનરેટર માટે — ખાલી રાખો તો બધા પ્રકરણ):</strong>
                            <div style="display:flex; gap:6px;">
                                <button type="button" id="pmChAll" class="gv-btn gv-btn-outline" style="padding:3px 8px; font-size:11.5px;">બધા પસંદ કરો</button>
                                <button type="button" id="pmChNone" class="gv-btn gv-btn-outline" style="padding:3px 8px; font-size:11.5px;">બધા કાઢો</button>
                            </div>
                        </div>
                        <div style="display:flex; gap:8px; flex-wrap:wrap;">
                            ${chs.map(c => `
                                <label style="display:inline-flex; align-items:center; gap:4px; background:#fff; border:1px solid #cbd5e1; padding:3px 8px; border-radius:6px; font-size:12.5px; cursor:pointer;">
                                    <input type="checkbox" class="pm-ch-cb" value="${escapeAttr(c)}" ${(d.selectedChapters || []).includes(String(c)) ? 'checked' : ''}> પ્ર.${escapeHtml(c)}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap; align-items:center; padding:10px; background:#eff6ff; border-radius:8px;">
                    <strong style="font-size:13px; color:#1e40af;">⚡ ઝડપી પેપર બનાવો:</strong>
                    <button type="button" id="pmAuto25" class="gv-btn gv-btn-blue" style="padding:6px 11px; font-size:12.5px;">⚡ એકમ કસોટી (25 ગુણ)</button>
                    <button type="button" id="pmAuto50" class="gv-btn gv-btn-teal" style="padding:6px 11px; font-size:12.5px;">⚡ સત્રાંત (50 ગુણ)</button>
                    <button type="button" id="pmAuto80" class="gv-btn gv-btn-purple" style="padding:6px 11px; font-size:12.5px;">⚡ GSEB બોર્ડ (80 ગુણ)</button>
                    <button type="button" id="pmManualPick" class="gv-btn gv-btn-green" style="padding:6px 12px; font-size:12.5px;">✋ મેન્યુઅલ પ્રશ્નો પસંદ કરો</button>
                </div>
            </div>

            <div class="gv-card">
                <h3 style="margin:0 0 10px 0; font-size:16px;">📋 પસંદ કરેલા પ્રશ્નો (વિભાગ મુજબ ગોઠવણી)</h3>
                ${d.questions.length === 0 ? `
                    <div style="padding:24px; text-align:center; color:#64748b; background:#f8fafc; border-radius:8px;">
                        પેપરમાં હજુ કોઈ પ્રશ્ન ઉમેરાયો નથી. ઉપરથી <strong>⚡ ઓટો જનરેટ</strong> અથવા <strong>✋ મેન્યુઅલ પ્રશ્નો પસંદ કરો</strong> પર ક્લિક કરો.
                    </div>
                ` : ALL_SECTIONS.map(sec => {
                    const secItems = d.questions.map((q, idx) => ({ q, idx })).filter(x => (x.q.section || 'None') === sec);
                    if (!secItems.length) return '';
                    const meta = (d.sectionsMetadata && d.sectionsMetadata[sec]) ? d.sectionsMetadata[sec] : { instruction: '', attemptCount: 0, attempt: '' };
                    const effMarks = window.calculateSectionEffectiveMarks(secItems.map(x => x.q), meta);
                    return `
                        <div style="border:1.5px solid #cbd5e1; border-radius:10px; padding:12px; margin-bottom:14px; background:#f8fafc;">
                            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
                                <strong style="font-size:15px; color:#1e3a8a;">${sec === 'None' ? 'વિભાગ વગર (None)' : ('વિભાગ - ' + sec)} (${secItems.length} પ્રશ્નો | અસરકારક ગુણ: ${effMarks})</strong>
                                ${sec !== 'None' ? `
                                    <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                                        <input type="number" min="0" max="${secItems.length}" class="gv-input pm-sec-att" data-sec="${sec}" value="${meta.attemptCount || 0}" style="width:130px; padding:4px 7px; font-size:12px;" title="કેટલા પ્રશ્નો લખવાના (0 = બધા)" placeholder="લખવાના પ્રશ્નો (0=બધા)">
                                        <input type="text" class="gv-input pm-sec-inst" data-sec="${sec}" value="${escapeAttr(meta.instruction || '')}" style="width:240px; padding:4px 7px; font-size:12px;" placeholder="વિભાગની ખાસ સૂચના (વૈકલ્પિક)">
                                    </div>
                                ` : ''}
                            </div>
                            ${secItems.map((item, sIdx) => `
                                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:7px; padding:8px 10px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
                                    <div style="flex:1; font-size:13.5px; line-height:1.5;">
                                        <strong>${sIdx + 1}.</strong>
                                        <span class="gv-badge gv-badge-purple" style="font-size:11px;">${escapeHtml(item.q.type)}</span>
                                        <span class="gv-badge gv-badge-amber" style="font-size:11px;">${item.q.marks} ગુણ</span>
                                        <span style="margin-left:4px;">${window.getSafeDraftSnippet(item.q.text)}</span>
                                    </div>
                                    <div style="display:flex; gap:4px; align-items:center;">
                                        <button type="button" class="gv-btn gv-btn-outline pm-mv-up" data-idx="${item.idx}" style="padding:3px 7px; font-size:11px;">▲</button>
                                        <button type="button" class="gv-btn gv-btn-outline pm-mv-dn" data-idx="${item.idx}" style="padding:3px 7px; font-size:11px;">▼</button>
                                        <button type="button" class="gv-btn gv-btn-red pm-rm-q" data-idx="${item.idx}" style="padding:3px 8px; font-size:11px;">✖</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>`;
                }).join('')}
            </div>
        `;

        container.querySelector('#pmTitle').oninput = (e) => { d.title = e.target.value; };
        container.querySelector('#pmStd').onchange = (e) => { d.standard = e.target.value; d.subject = ''; d.selectedChapters = []; renderCurrentView(); };
        container.querySelector('#pmSub').onchange = (e) => { d.subject = e.target.value; d.selectedChapters = []; renderCurrentView(); };
        container.querySelector('#pmDate').onchange = (e) => { d.date = e.target.value; };
        container.querySelector('#pmLang').onchange = (e) => { d.lang = e.target.value; };

        container.querySelectorAll('.pm-ch-cb').forEach(cb => {
            cb.onchange = () => {
                const set = new Set(d.selectedChapters || []);
                if (cb.checked) set.add(cb.value); else set.delete(cb.value);
                d.selectedChapters = Array.from(set);
            };
        });
        const chAll = container.querySelector('#pmChAll');
        const chNone = container.querySelector('#pmChNone');
        if (chAll) chAll.onclick = () => { d.selectedChapters = chs.map(String); renderCurrentView(); };
        if (chNone) chNone.onclick = () => { d.selectedChapters = []; renderCurrentView(); };

        container.querySelector('#pmManualPick').onclick = () => openManualPickerModal();

        container.querySelector('#pmAuto25').onclick = () => {
            const bp = [
                { section: 'A', marks: 1, count: 6 },
                { section: 'B', marks: 2, count: 4 },
                { section: 'C', marks: 3, count: 2 },
                { section: 'D', marks: 4, count: 1 }
            ];
            bp.meta = { A: { attemptCount: 0, instruction: '' }, B: { attemptCount: 3, instruction: '' }, C: { attemptCount: 0, instruction: '' }, D: { attemptCount: 0, instruction: '' } };
            autoGeneratePaper(bp);
        };
        container.querySelector('#pmAuto50').onclick = () => {
            const bp = [
                { section: 'A', marks: 1, count: 14 },
                { section: 'B', marks: 2, count: 8 },
                { section: 'C', marks: 3, count: 5 },
                { section: 'D', marks: 4, count: 3 }
            ];
            bp.meta = { A: { attemptCount: 0, instruction: '' }, B: { attemptCount: 6, instruction: '' }, C: { attemptCount: 4, instruction: '' }, D: { attemptCount: 3, instruction: '' } };
            autoGeneratePaper(bp);
        };
        container.querySelector('#pmAuto80').onclick = () => {
            const bp = [
                { section: 'A', types: ['MCQ'], marks: 1, count: 6 },
                { section: 'A', types: ['વિકલ્પ સાથે ખાલી જગ્યા', 'ખાલી જગ્યા'], marks: 1, count: 6 },
                { section: 'A', types: ['ખરા-ખોટા'], marks: 1, count: 4 },
                { section: 'A', types: ['એક વાક્યમાં જવાબ આપો', 'સૂત્ર / એકમ લખો'], marks: 1, count: 4 },
                { section: 'A', types: ['જોડકા જોડો'], marks: 2, count: 2 },
                { section: 'B', marks: 2, count: 13 },
                { section: 'C', marks: 3, count: 9 },
                { section: 'D', marks: 4, count: 8 }
            ];
            bp.meta = { A: { attemptCount: 0, instruction: '' }, B: { attemptCount: 9, instruction: '' }, C: { attemptCount: 6, instruction: '' }, D: { attemptCount: 5, instruction: '' } };
            autoGeneratePaper(bp);
        };

        container.querySelectorAll('.pm-sec-att').forEach(inp => {
            inp.onchange = () => {
                const sec = inp.dataset.sec;
                if (!d.sectionsMetadata[sec]) d.sectionsMetadata[sec] = {};
                d.sectionsMetadata[sec].attemptCount = parseInt(inp.value, 10) || 0;
                renderCurrentView();
            };
        });
        container.querySelectorAll('.pm-sec-inst').forEach(inp => {
            inp.oninput = () => {
                const sec = inp.dataset.sec;
                if (!d.sectionsMetadata[sec]) d.sectionsMetadata[sec] = {};
                d.sectionsMetadata[sec].instruction = inp.value;
            };
        });
        container.querySelectorAll('.pm-mv-up').forEach(btn => {
            btn.onclick = () => {
                const i = Number(btn.dataset.idx);
                if (i > 0) { const tmp = d.questions[i - 1]; d.questions[i - 1] = d.questions[i]; d.questions[i] = tmp; renderCurrentView(); }
            };
        });
        container.querySelectorAll('.pm-mv-dn').forEach(btn => {
            btn.onclick = () => {
                const i = Number(btn.dataset.idx);
                if (i < d.questions.length - 1) { const tmp = d.questions[i + 1]; d.questions[i + 1] = d.questions[i]; d.questions[i] = tmp; renderCurrentView(); }
            };
        });
        container.querySelectorAll('.pm-rm-q').forEach(btn => {
            btn.onclick = () => { d.questions.splice(Number(btn.dataset.idx), 1); renderCurrentView(); };
        });

        const getPaperPayload = () => Object.assign({}, d, { totalMarks: computeDraftTotalMarks() });

        container.querySelector('#pmPreview').onclick = () => {
            if (!d.questions.length) { window.showToast('પહેલા પેપરમાં પ્રશ્નો ઉમેરો.', 'error'); return; }
            window.openPaperPreviewModal(getPaperPayload(), 'question');
        };
        container.querySelector('#pmPdfQ').onclick = () => {
            if (!d.questions.length) { window.showToast('પહેલા પેપરમાં પ્રશ્નો ઉમેરો.', 'error'); return; }
            window.openVectorPDFWindow(getPaperPayload(), 'question', true);
        };
        container.querySelector('#pmPdfSol').onclick = () => {
            if (!d.questions.length) { window.showToast('પહેલા પેપરમાં પ્રશ્નો ઉમેરો.', 'error'); return; }
            window.openVectorPDFWindow(getPaperPayload(), 'solution', true);
        };
        container.querySelector('#pmWord').onclick = () => {
            if (!d.questions.length) { window.showToast('પહેલા પેપરમાં પ્રશ્નો ઉમેરો.', 'error'); return; }
            window.downloadWord(getPaperPayload(), 'question');
        };
        container.querySelector('#pmSave').onclick = () => {
            if (!d.questions.length) { window.showToast('સેવ કરવા માટે પેપરમાં ઓછામાં ઓછો 1 પ્રશ્ન હોવો જોઈએ.', 'error'); return; }
            const payload = JSON.parse(JSON.stringify(getPaperPayload()));
            if (!payload.id) payload.id = 'PAPER_' + Date.now();
            const existingIdx = appState.papers.findIndex(p => p.id === payload.id);
            if (existingIdx !== -1) appState.papers[existingIdx] = payload;
            else appState.papers.unshift(payload);
            d.id = payload.id;
            savePapersToStorage();
            window.showToast('✅ પેપર સફળતાપૂર્વક સેવ થઈ ગયું!');
        };
        container.querySelector('#pmClear').onclick = () => {
            if (d.questions.length && !confirm('શું તમે વર્તમાન ડ્રાફ્ટ ખાલી કરવા માંગો છો?')) return;
            appState.draft = createEmptyDraft();
            renderCurrentView();
        };
    }

    function renderSavedPapers(container) {
        container.innerHTML = `
            <div class="gv-card">
                <h2 style="margin:0 0 12px 0; font-size:17px;">🗂️ સેવ કરેલા પેપર્સ (${appState.papers.length})</h2>
                ${appState.papers.length === 0 ? `
                    <div style="padding:26px; text-align:center; color:#64748b; background:#f8fafc; border-radius:8px;">હજુ સુધી કોઈ પેપર સેવ કરેલ નથી.</div>
                ` : appState.papers.map(p => `
                    <div class="gv-q-card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                        <div>
                            <div style="font-size:15.5px; font-weight:700; color:#0f172a;">${escapeHtml(p.title || 'પ્રશ્નપત્ર')}</div>
                            <div style="font-size:12.5px; color:#64748b; margin-top:2px;">
                                ધોરણ: <strong>${escapeHtml(p.standard || '-')}</strong> &nbsp;|&nbsp;
                                વિષય: <strong>${escapeHtml(p.subject || '-')}</strong> &nbsp;|&nbsp;
                                તારીખ: <strong>${escapeHtml(p.date || '-')}</strong> &nbsp;|&nbsp;
                                ગુણ: <strong>${p.totalMarks || 0}</strong> (${(p.questions || []).length} પ્રશ્નો)
                            </div>
                        </div>
                        <div style="display:flex; gap:6px; flex-wrap:wrap;">
                            <button type="button" class="gv-btn gv-btn-teal sp-prev" data-id="${escapeAttr(p.id)}" style="padding:5px 10px; font-size:12px;">👁️ પ્રિવ્યૂ</button>
                            <button type="button" class="gv-btn gv-btn-green sp-pdfq" data-id="${escapeAttr(p.id)}" style="padding:5px 10px; font-size:12px;">📄 PDF</button>
                            <button type="button" class="gv-btn gv-btn-orange sp-pdfs" data-id="${escapeAttr(p.id)}" style="padding:5px 10px; font-size:12px;">🔑 Key</button>
                            <button type="button" class="gv-btn gv-btn-purple sp-word" data-id="${escapeAttr(p.id)}" style="padding:5px 10px; font-size:12px;">📝 Word</button>
                            <button type="button" class="gv-btn gv-btn-blue sp-edit" data-id="${escapeAttr(p.id)}" style="padding:5px 10px; font-size:12px;">✏️ એડિટ</button>
                            <button type="button" class="gv-btn gv-btn-red sp-del" data-id="${escapeAttr(p.id)}" style="padding:5px 10px; font-size:12px;">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>`;

        const findP = (id) => appState.papers.find(x => x.id === id);
        container.querySelectorAll('.sp-prev').forEach(b => { b.onclick = () => window.openPaperPreviewModal(findP(b.dataset.id), 'question'); });
        container.querySelectorAll('.sp-pdfq').forEach(b => { b.onclick = () => window.openVectorPDFWindow(findP(b.dataset.id), 'question', true); });
        container.querySelectorAll('.sp-pdfs').forEach(b => { b.onclick = () => window.openVectorPDFWindow(findP(b.dataset.id), 'solution', true); });
        container.querySelectorAll('.sp-word').forEach(b => { b.onclick = () => window.downloadWord(findP(b.dataset.id), 'question'); });
        container.querySelectorAll('.sp-edit').forEach(b => {
            b.onclick = () => {
                const found = findP(b.dataset.id);
                if (found) {
                    appState.draft = JSON.parse(JSON.stringify(found));
                    appState.activeTab = 'papermaker';
                    renderCurrentView();
                }
            };
        });
        container.querySelectorAll('.sp-del').forEach(b => {
            b.onclick = () => {
                if (!confirm('આ સેવ કરેલું પેપર ડિલીટ કરવું છે?')) return;
                appState.papers = appState.papers.filter(x => x.id !== b.dataset.id);
                savePapersToStorage();
                renderCurrentView();
            };
        });
    }

    function renderSettings(container) {
        const p = appState.profile;
        const s = appState.pdfSettings;
        container.innerHTML = `
            <div class="gv-card" style="max-width:740px;">
                <h2 style="margin:0 0 12px 0; font-size:17px;">🏫 શાળા / સંસ્થાની પ્રોફાઈલ અને PDF સેટિંગ્સ</h2>
                <div style="margin-bottom:10px;">
                    <label style="font-size:13px; font-weight:bold;">શાળા / ક્લાસીસનું નામ (પેપર હેડર):</label>
                    <input id="setSchoolName" class="gv-input" value="${escapeAttr(p.name)}">
                </div>
                <div style="margin-bottom:10px;">
                    <label style="font-size:13px; font-weight:bold;">સરનામું / પેટા-શીર્ષક (વૈકલ્પિક):</label>
                    <input id="setSchoolAddr" class="gv-input" value="${escapeAttr(p.address)}">
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-size:13px; font-weight:bold;">વોટરમાર્ક (Watermark Text):</label>
                    <input id="setWatermark" class="gv-input" value="${escapeAttr(s.watermark || '')}" placeholder="દા.ત. જ્ઞાન વૃક્ષ વિદ્યાલય">
                </div>
                <div style="display:flex; gap:14px; flex-wrap:wrap; margin-bottom:12px; font-size:13.5px;">
                    <label><input type="checkbox" id="setExamName" ${s.examName ? 'checked' : ''}> પરીક્ષાનું નામ</label>
                    <label><input type="checkbox" id="setStd" ${s.std ? 'checked' : ''}> ધોરણ</label>
                    <label><input type="checkbox" id="setSub" ${s.subject ? 'checked' : ''}> વિષય</label>
                    <label><input type="checkbox" id="setDate" ${s.date ? 'checked' : ''}> તારીખ</label>
                    <label><input type="checkbox" id="setMarks" ${s.marks ? 'checked' : ''}> કુલ ગુણ</label>
                </div>
                <div style="margin-bottom:14px;">
                    <label style="font-size:13px; font-weight:bold;">પ્રશ્ન ક્રમાંક (Numbering):</label>
                    <select id="setNum" class="gv-select" style="max-width:260px;">
                        <option value="continuous" ${s.numbering === 'continuous' ? 'selected' : ''}>સળંગ (1, 2, 3, ... 54)</option>
                        <option value="section" ${s.numbering === 'section' ? 'selected' : ''}>દરેક વિભાગમાં નવેસરથી (1, 2, ...)</option>
                    </select>
                </div>
                <button type="button" id="setSaveBtn" class="gv-btn gv-btn-green">💾 સેટિંગ્સ સેવ કરો</button>
            </div>
        `;

        container.querySelector('#setSaveBtn').onclick = () => {
            appState.profile.name = container.querySelector('#setSchoolName').value.trim() || 'જ્ઞાન વૃક્ષ વિદ્યાલય';
            appState.profile.address = container.querySelector('#setSchoolAddr').value.trim();
            appState.pdfSettings.watermark = container.querySelector('#setWatermark').value.trim();
            appState.pdfSettings.examName = container.querySelector('#setExamName').checked;
            appState.pdfSettings.std = container.querySelector('#setStd').checked;
            appState.pdfSettings.subject = container.querySelector('#setSub').checked;
            appState.pdfSettings.date = container.querySelector('#setDate').checked;
            appState.pdfSettings.marks = container.querySelector('#setMarks').checked;
            appState.pdfSettings.numbering = container.querySelector('#setNum').value;
            saveProfileAndSettings();
            window.showToast('✅ શાળા પ્રોફાઈલ અને PDF સેટિંગ્સ સેવ થઈ ગયા!');
            renderCurrentView();
        };
    }

    // ==========================================
    // 12. MAIN APP SHELL RENDER & BOOTSTRAP
    // ==========================================
    function getAppRoot() {
        document.body.style.display = 'block';
        document.body.style.visibility = 'visible';
        let root = document.getElementById('gv-app-root') || document.getElementById('app') || document.getElementById('root');
        if (!root) {
            document.body.innerHTML = '';
            root = document.createElement('div');
            root.id = 'gv-app-root';
            document.body.appendChild(root);
        }
        root.style.display = 'block';
        root.style.visibility = 'visible';
        root.style.opacity = '1';
        return root;
    }

    function renderCurrentView() {
        const root = getAppRoot();
        root.innerHTML = `
            <div class="gv-shell">
                <header class="gv-topbar">
                    <div class="gv-brand">
                        <span style="font-size:26px;">🌳</span>
                        <div>
                            <h1>Gyan Vruksh 3.3 — Smart Paper Generator</h1>
                            <small>${escapeHtml(appState.profile.name)} &nbsp;|&nbsp; કુલ પ્રશ્નો: ${appState.questions.length}</small>
                        </div>
                    </div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button type="button" id="topLibBtn" class="gv-btn gv-btn-teal" style="padding:6px 12px; font-size:12.5px;">☁️ ઓનલાઈન લાઈબ્રેરી</button>
                        ${appState.deferredInstallPrompt ? '<button type="button" id="topInstallBtn" class="gv-btn gv-btn-green" style="padding:6px 12px; font-size:12.5px;">📲 એપ ઇન્સ્ટોલ કરો</button>' : ''}
                    </div>
                </header>
                <nav class="gv-nav">
                    <button type="button" class="gv-tab-btn ${appState.activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">📊 ડેશબોર્ડ</button>
                    <button type="button" class="gv-tab-btn ${appState.activeTab === 'bank' ? 'active' : ''}" data-tab="bank">📚 પ્રશ્ન બેંક</button>
                    <button type="button" class="gv-tab-btn ${appState.activeTab === 'papermaker' ? 'active' : ''}" data-tab="papermaker">📝 પેપર બનાવો</button>
                    <button type="button" class="gv-tab-btn ${appState.activeTab === 'saved' ? 'active' : ''}" data-tab="saved">🗂️ સેવ કરેલા પેપર્સ</button>
                    <button type="button" class="gv-tab-btn ${appState.activeTab === 'settings' ? 'active' : ''}" data-tab="settings">⚙️ સેટિંગ્સ</button>
                </nav>
                <main class="gv-main" id="gvMainView"></main>
            </div>`;

        root.querySelector('#topLibBtn').onclick = () => window.openOnlineLibraryModal();
        const instBtn = root.querySelector('#topInstallBtn');
        if (instBtn) {
            instBtn.onclick = async () => {
                if (!appState.deferredInstallPrompt) return;
                appState.deferredInstallPrompt.prompt();
                await appState.deferredInstallPrompt.userChoice;
                appState.deferredInstallPrompt = null;
                renderCurrentView();
            };
        }

        root.querySelectorAll('.gv-tab-btn').forEach(btn => {
            btn.onclick = () => {
                appState.activeTab = btn.dataset.tab;
                renderCurrentView();
            };
        });

        const main = root.querySelector('#gvMainView');
        if (appState.activeTab === 'dashboard') renderDashboard(main);
        else if (appState.activeTab === 'bank') renderQuestionBank(main);
        else if (appState.activeTab === 'papermaker') renderPaperMaker(main);
        else if (appState.activeTab === 'saved') renderSavedPapers(main);
        else if (appState.activeTab === 'settings') renderSettings(main);
    }

    function bootApp() {
        injectGlobalStyles();
        loadAllFromStorage();
        renderCurrentView();
        autoLoadCatalogOnBoot();
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        appState.deferredInstallPrompt = e;
        renderCurrentView();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootApp);
    } else {
        bootApp();
    }
})();
