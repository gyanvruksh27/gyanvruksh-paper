// js/question-bank.js — Gyan Vruksh 2.5 (Dashboard + Multi-Chapter Checkboxes + Manual & Auto Paper Maker + Live Draft Preview + Board Blueprints)

(function() {
    // ==========================================
    // 🌐 1. DEFAULT INSTRUCTIONS MAP
    // ==========================================
    window.DEFAULT_INSTRUCTIONS = {
        'MCQ': 'નીચે આપેલા પ્રશ્નોના સાચા વિકલ્પ પસંદ કરી ઉત્તર લખો.',
        'ખાલી જગ્યા': 'યોગ્ય શબ્દ વડે ખાલી જગ્યા પૂરો.',
        'વિકલ્પ સાથે ખાલી જગ્યા': 'કૌંસમાં આપેલા વિકલ્પોમાંથી યોગ્ય વિકલ્પ પસંદ કરી ખાલી જગ્યા પૂરો.',
        'ખરા-ખોટા': 'નીચેના વિધાનો ખરાં છે કે ખોટાં તે જણાવો.',
        'જોડકા જોડો': 'યોગ્ય જોડકાં જોડો.',
        'એક વાક્યમાં જવાબ આપો': 'નીચેના પ્રશ્નોના એક વાક્યમાં ઉત્તર લખો.',
        'ટૂંકમાં જવાબ આપો': 'નીચેના પ્રશ્નોના ટૂંકમાં ઉત્તર લખો.',
        'માગ્યા મુજબ જવાબ આપો': 'નીચેના પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો.',
        'સવિસ્તાર જવાબ આપો': 'નીચેના પ્રશ્નોના સવિસ્તાર ઉત્તર લખો.'
    };

    window.getEffectiveInstruction = function(q) {
        if (!q) return '';
        if (q.instruction && String(q.instruction).trim() !== '') {
            return String(q.instruction).trim();
        }
        return window.DEFAULT_INSTRUCTIONS[q.type] || (q.type ? `${q.type}:` : '');
    };

    function escapeAttr(str) {
        return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ==========================================
    // 🎨 2. INJECT MASTER UI, MATH, PASSAGE, TABLE & PREVIEW CSS
    // ==========================================
    function injectStyles() {
        let style = document.getElementById('gvMasterStyles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'gvMasterStyles';
            document.head.appendChild(style);
        }
        style.innerHTML = `
            * { box-sizing: border-box; }
            body { margin: 0; font-family: 'Noto Sans Gujarati', 'Noto Sans Devanagari', 'Inter', sans-serif; background: #f1f5f9; color: #0f172a; }
            .gv-header { background: linear-gradient(135deg, #1e3a8a, #2563eb); color: #fff; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
            .gv-header h1 { margin: 0; font-size: 20px; font-weight: 700; }
            .gv-tabs { display: flex; gap: 6px; background: #fff; padding: 10px 14px; border-bottom: 1px solid #cbd5e1; overflow-x: auto; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
            .gv-tab-btn { padding: 8px 14px; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 13.5px; white-space: nowrap; transition: 0.15s; }
            .gv-tab-btn.active { background: #2563eb; color: #fff; border-color: #1d4ed8; box-shadow: 0 2px 6px rgba(37,99,235,0.25); }
            .gv-container { max-width: 1140px; margin: 16px auto; padding: 0 12px 48px 12px; }
            .gv-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
            .gv-btn { padding: 7px 13px; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 13px; color: #fff; display: inline-flex; align-items: center; gap: 5px; transition: opacity 0.15s; }
            .gv-btn:hover { opacity: 0.92; }
            .gv-btn-blue { background: #2563eb; }
            .gv-btn-green { background: #16a34a; }
            .gv-btn-purple { background: #7c3aed; }
            .gv-btn-orange { background: #ea580c; }
            .gv-btn-red { background: #dc2626; }
            .gv-btn-dark { background: #334155; }
            .gv-btn-teal { background: #0d9488; }
            .gv-btn-outline { background: #fff; color: #334155; border: 1px solid #cbd5e1; }
            .gv-input { width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; font-family: inherit; background: #fff; }
            .gv-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; }
            .gv-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-bottom: 14px; }
            .gv-stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
            .gv-stat-val { font-size: 26px; font-weight: 800; line-height: 1.2; }
            .gv-stat-lbl { font-size: 13px; color: #64748b; font-weight: 600; margin-top: 4px; }
            .gv-chap-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 6px; border: 1.5px solid #cbd5e1; background: #fff; cursor: pointer; font-size: 13px; font-weight: 600; user-select: none; transition: 0.15s; }
            .gv-chap-chip.checked { border-color: #2563eb; background: #eff6ff; color: #1d4ed8; }
            .gv-subtab-bar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
            .gv-subtab-btn { padding: 8px 16px; border: 1.5px solid #cbd5e1; background: #f8fafc; color: #334155; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 13.5px; }
            .gv-subtab-btn.active { background: #1e3a8a; color: #fff; border-color: #1e3a8a; }
            .gv-modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15,23,42,0.7); z-index: 99999; align-items: center; justify-content: center; padding: 12px; }
            .gv-modal-box { background: #fff; width: 100%; max-width: 720px; max-height: 92vh; overflow-y: auto; border-radius: 10px; padding: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.35); }
            .gv-preview-box { background: #e2e8f0; width: 100%; max-width: 920px; height: 92vh; border-radius: 10px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.45); }
            .gv-preview-sheet { background: #fff; max-width: 210mm; width: 100%; margin: 16px auto; padding: 24px 28px; box-shadow: 0 4px 18px rgba(0,0,0,0.18); border-radius: 4px; color: #000; font-size: 14.5px; line-height: 1.85; position: relative; }
            .gv-preview-sheet .print-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8px; }
            .gv-preview-sheet .print-header h1 { font-size: 21px; margin: 0 0 3px 0; font-weight: 700; color: #000; }
            .gv-preview-sheet .print-header p { font-size: 13px; margin: 2px 0; color: #222; }
            .gv-preview-sheet .exam-meta { display: flex; justify-content: space-between; flex-wrap: wrap; font-size: 14px; font-weight: 600; margin-top: 6px; padding: 5px 0; border-top: 1px dashed #444; border-bottom: 1px dashed #444; }
            .gv-preview-sheet .sec-banner { text-align: center; font-weight: bold; font-size: 15.5px; margin: 14px 0 8px 0; border: 1.5px solid #000; padding: 3px; background: #f1f5f9; }
            .gv-preview-sheet .sec-instruction, .gv-preview-sheet .auto-inst-bar { font-size: 14px; font-weight: bold; margin: 10px 0 6px 0; padding: 3px 0; border-bottom: 1px dotted #94a3b8; display: flex; justify-content: space-between; }
            .gv-preview-sheet .q-row-table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-bottom: 10px; }
            .gv-preview-sheet .q-cell-text { width: 89%; padding-right: 10px; vertical-align: top; font-size: 14.5px; word-wrap: break-word; line-height: 1.95; }
            .gv-preview-sheet .q-cell-marks { width: 11%; vertical-align: top; text-align: right; font-weight: bold; font-size: 14px; white-space: nowrap; }
            .gv-preview-sheet .p-ans-box { margin-top: 6px; padding: 8px 10px; background: #f8fafc; border-left: 3px solid #334155; font-size: 14px; line-height: 1.95; }
            .gv-preview-sheet .mcq-table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 4px; }
            .gv-preview-sheet .mcq-table td { width: 50%; padding: 3px 8px 3px 0; vertical-align: middle; font-size: 14px; }
            .gv-preview-sheet .watermark { position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); font-size: 52px; color: rgba(0,0,0,0.06); pointer-events: none; font-weight: bold; white-space: nowrap; }

            /* 2D Math Typesetting */
            .m-frac { display: inline-flex; flex-direction: column; vertical-align: middle; text-align: center; padding: 2px 5px; margin: 2px 3px; font-size: 0.98em; line-height: 1.35; font-weight: 600; }
            .m-num { border-bottom: 1.6px solid #0f172a; padding: 0 5px 3px 5px; display: block; color: #0f172a; }
            .m-den { padding: 3px 5px 1px 5px; display: block; color: #0f172a; min-height: 1.2em; }
            sup .m-frac { font-size: 0.85em; line-height: 1.15; padding: 0 2px; margin: 0 1px; }
            sup .m-num { border-bottom: 1.2px solid currentColor; padding: 0 2px 1px 2px; }
            sup .m-den { padding: 1px 2px 0 2px; }
            .m-sqrt { display: inline-flex; align-items: stretch; vertical-align: middle; padding-top: 3px; margin: 1px 2px; line-height: 1.3; }
            .m-sqrt-sym { font-size: 1.2em; line-height: 1; margin-right: -1px; display: inline-block; transform: translateY(1px); font-weight: bold; }
            .m-sqrt-body { border-top: 1.6px solid currentColor; padding: 2px 4px 0 3px; display: inline-block; }
            sup { font-size: 0.82em; vertical-align: super; line-height: 0; font-weight: 600; }
            sub { font-size: 0.82em; vertical-align: sub; line-height: 0; font-weight: 600; }

            /* Passage & Statistics Tables */
            .gv-passage-box { background: #f8fafc; border: 1.5px solid #94a3b8; border-left: 4px solid #334155; border-radius: 6px; padding: 10px 14px; margin: 6px 0 10px 0; font-weight: 400; line-height: 1.85; color: #1e293b; }
            .gv-data-table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 0.94em; }
            .gv-data-table th, .gv-data-table td { border: 1px solid #475569; padding: 5px 8px; text-align: center; }
            .gv-data-table th { background: #f1f5f9; font-weight: 700; }
            .gv-dash-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
            .gv-dash-table th, .gv-dash-table td { border-bottom: 1px solid #e2e8f0; padding: 9px 10px; text-align: left; }
            .gv-dash-table th { background: #f8fafc; color: #475569; font-weight: 700; }
        `;
    }

    // ==========================================
    // 🚀 3. 2D MATH, SCIENCE, PASSAGE & TABLE PARSER
    // ==========================================
    window.formatScienceAndMath = function(text) {
        if (!text) return '';
        let s = String(text);

        s = s.replace(/@@TA?G?(?:<sub>)?\d*(?:<\/sub>)?@@/g, '');
        s = s.replace(/@@@@+/g, '');
        s = s.replace(/\[PASSAGE\]([\s\S]*?)\[\/PASSAGE\]/gi, '<div class="gv-passage-box">$1</div>');

        let htmlTags = [];
        const idxToLetters = (n) => {
            let res = '';
            do {
                res = String.fromCharCode(97 + (n % 26)) + res;
                n = Math.floor(n / 26) - 1;
            } while (n >= 0);
            return res;
        };

        s = s.replace(/<\/?[a-zA-Z][^>]*>/g, function(match) {
            let tag = match;
            if (/^<table\b/i.test(tag) && !/class=/i.test(tag)) {
                tag = tag.replace(/^<table/i, '<table class="gv-data-table"');
            }
            let code = `__htmltag_${idxToLetters(htmlTags.length)}__`;
            htmlTags.push({ code: code, tag: tag });
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

        s = s.replace(/(^|[\s(=+\-,:])(\d+|[a-zA-Z])\s*\/\s*(\d+|[a-zA-Z])(?=$|[\s)=+\-,.;:])/g, '$1<span class="m-frac"><span class="m-num">$2</span><span class="m-den">$3</span></span>');

        s = s.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
        s = s.replace(/_([0-9]+)/g, '<sub>$1</sub>');
        s = s.replace(/([A-Za-z\)])(\d+)([+\-])/g, '$1<sub>$2</sub><sup>$3</sup>');
        s = s.replace(/([A-Z][a-z]?|\))(\d+)/g, '$1<sub>$2</sub>');

        for (let i = 0; i < htmlTags.length; i++) {
            s = s.split(htmlTags[i].code).join(htmlTags[i].tag);
        }
        return s;
    };

    // ==========================================
    // 🛡️ 4. JSON SANITIZER & TOAST / CONFIRM MODALS
    // ==========================================
    window.sanitizeAndParseJSON = function(rawText) {
        let clean = String(rawText).trim();
        clean = clean.replace(/^```(?:json)?/im, '').replace(/```$/im, '').trim();
        const firstBracket = clean.indexOf('[');
        const lastBracket = clean.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1) {
            clean = clean.substring(firstBracket, lastBracket + 1);
        }
        try {
            return JSON.parse(clean);
        } catch (e1) {
            let healed = clean.replace(/\\{3,}/g, '\\\\');
            healed = healed.replace(/([^\\])\\(frac|sqrt|overline|neq|times|div|pi|cdot|Delta|theta|angle|pm|ce|rightarrow|leftarrow)/g, '$1\\\\$2');
            healed = healed.replace(/([^\\])\\(?![/\"\\bfnrtu])/g, '$1\\\\');
            healed = healed.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/gs, function(match) {
                return match.replace(/\r?\n/g, '\\n');
            });
            return JSON.parse(healed);
        }
    };

    window.showToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.innerHTML = message;
        toast.style.cssText = `position:fixed; bottom:20px; right:20px; background:${type === 'success' ? '#1e293b' : '#dc2626'}; border-left:5px solid ${type === 'success' ? '#22c55e' : '#fca5a5'}; color:#fff; padding:12px 20px; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.25); z-index:999999; font-weight:600; font-size:14px; max-width:90vw;`;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3200);
    };

    window.customConfirm = function(msg, onConfirm) {
        let overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; z-index:999999;';
        overlay.innerHTML = `
            <div style="background:#fff; padding:22px; border-radius:10px; max-width:400px; width:90%; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
                <h3 style="margin:0 0 10px 0; color:#1e293b;">ખાતરી કરો</h3>
                <p style="color:#475569; font-size:15px; margin-bottom:20px;">${msg}</p>
                <div style="display:flex; gap:10px; justify-content:center;">
                    <button id="cCancel" style="padding:8px 18px; border:1px solid #cbd5e1; background:#f8fafc; border-radius:6px; cursor:pointer; font-weight:bold;">રદ કરો</button>
                    <button id="cOk" style="padding:8px 18px; border:none; background:#dc2626; color:#fff; border-radius:6px; cursor:pointer; font-weight:bold;">હા, આગળ વધો</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.querySelector('#cCancel').onclick = () => overlay.remove();
        overlay.querySelector('#cOk').onclick = () => { overlay.remove(); onConfirm(); };
    };

    // ==========================================
    // 📦 5. STATE & STORAGE HELPERS
    // ==========================================
    window.editingQuestionId = null;
    window.hideAnswersMode = false;
    window.currentSearchQuery = '';
    window.currentStdFilter = 'ALL';
    window.currentSubFilter = 'ALL';
    window.currentChapFilter = 'ALL';
    window.currentTypeFilter = 'ALL';
    window.currentInstFilter = 'ALL';
    window.bankVisibleLimit = 60;

    // Active Tab: Default to Dashboard!
    window.activeTab = 'dashboard';

    // Paper Maker State
    window.draftPaperQuestions = [];
    window.draftPaperMeta = {};
    window.pmSelectedStd = 'ALL';
    window.pmSelectedSub = 'ALL';
    window.pmSelectedChapters = []; // Array of ticked chapters (empty = none ticked, or auto-init to all)
    window.pmChaptersInitializedKey = '';
    window.pmTitleVal = 'એકમ કસોટી / પ્રથમ પરીક્ષા';
    window.pmDateVal = new Date().toISOString().split('T')[0];
    window.pmActiveMode = 'auto'; // 'auto' or 'manual'

    // Manual Picker Filter State
    window.pmManualSearch = '';
    window.pmManualType = 'ALL';
    window.pmManualInst = 'ALL';
    window.pmManualMarks = 'ALL';
    window.pmManualTargetSec = 'A';
    window.pmManualLimit = 50;

    function getAllQuestions() {
        try { return JSON.parse(localStorage.getItem('gyanVruksh_questions')) || []; } catch(e) { return []; }
    }
    function saveAllQuestions(arr) {
        localStorage.setItem('gyanVruksh_questions', JSON.stringify(arr));
    }
    function getAllPapers() {
        try { return JSON.parse(localStorage.getItem('gyanVruksh_papers')) || []; } catch(e) { return []; }
    }
    function saveAllPapers(arr) {
        localStorage.setItem('gyanVruksh_papers', JSON.stringify(arr));
    }

    window.updateInstructionDatalist = function() {
        const dl = document.getElementById('gvInstructionSuggestions');
        if (!dl) return;
        const allQ = getAllQuestions();
        const instSet = new Set(Object.values(window.DEFAULT_INSTRUCTIONS));
        allQ.forEach(q => { if (q.instruction && q.instruction.trim()) instSet.add(q.instruction.trim()); });
        dl.innerHTML = Array.from(instSet).map(i => `<option value="${escapeAttr(i)}"></option>`).join('');
    };

    window.processImportedArray = function(importedData) {
        if (!Array.isArray(importedData)) throw new Error("માળખું Array સ્વરૂપે નથી.");
        let existingData = getAllQuestions();
        let addedCount = 0, duplicateCount = 0;
        importedData.forEach(newQ => {
            if (!newQ || !newQ.text) return;
            const exists = existingData.find(q => (newQ.id && q.id === newQ.id) || (q.text === newQ.text && q.subject === newQ.subject));
            if (!exists) {
                if (!newQ.id) newQ.id = 'Q_IMP_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
                existingData.push(newQ);
                addedCount++;
            } else {
                duplicateCount++;
            }
        });
        saveAllQuestions(existingData);
        window.pmChaptersInitializedKey = '';
        window.showToast(`🚀 સફળતાપૂર્વક ${addedCount} નવા પ્રશ્નો ઉમેરાયા! (ડુપ્લીકેટ: ${duplicateCount})`);
        window.refreshData();
    };

    window.syncOnlineQuestions = async function() {
        try {
            const res = await fetch('./questions.json?t=' + Date.now());
            if (!res.ok) return;
            const onlineQs = await res.json();
            if (!Array.isArray(onlineQs)) return;
            const localQs = getAllQuestions();
            const localIds = new Set(localQs.map(q => q.id));
            let addedCount = 0;
            onlineQs.forEach(q => {
                if (q && q.id && !localIds.has(q.id)) {
                    localQs.push(q);
                    localIds.add(q.id);
                    addedCount++;
                }
            });
            if (addedCount > 0) {
                saveAllQuestions(localQs);
                window.pmChaptersInitializedKey = '';
                window.refreshData();
            }
        } catch (err) {
            console.log('Online sync skipped:', err);
        }
    };

    window.triggerImport = function(e) {
        if (e) e.preventDefault();
        let hiddenInput = document.getElementById('masterHiddenImport');
        if (!hiddenInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.type = 'file';
            hiddenInput.accept = '.json,.txt';
            hiddenInput.style.display = 'none';
            hiddenInput.id = 'masterHiddenImport';
            document.body.appendChild(hiddenInput);
            hiddenInput.onchange = (ev) => {
                const file = ev.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = function(evt) {
                    try {
                        const data = window.sanitizeAndParseJSON(evt.target.result);
                        window.processImportedArray(data);
                    } catch (err) {
                        window.showToast("ફાઈલમાં ભૂલ છે: " + err.message, 'error');
                    }
                    ev.target.value = '';
                };
                reader.readAsText(file);
            };
        }
        hiddenInput.click();
    };

    window.openPasteJSONModal = function(e) {
        if (e) e.preventDefault();
        let overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:999999; padding:12px;';
        overlay.innerHTML = `
            <div style="background:#fff; padding:22px; border-radius:10px; max-width:600px; width:100%; box-shadow:0 10px 30px rgba(0,0,0,0.3); text-align:left;">
                <h3 style="margin:0 0 8px 0; color:#0f172a;">📋 ડાયરેક્ટ JSON કોડ પેસ્ટ કરો</h3>
                <p style="color:#475569; font-size:13.5px; margin-bottom:10px;">AI પાસેથી કોપી કરેલો JSON કોડ અહીં પેસ્ટ કરી દો:</p>
                <textarea id="rawJsonPasteArea" rows="8" placeholder='[ { "id": "Q_1", ... } ]' style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; font-family:monospace; font-size:13px; margin-bottom:14px;"></textarea>
                <div style="display:flex; gap:10px; justify-content:flex-end;">
                    <button id="pCancel" class="gv-btn gv-btn-dark">બંધ કરો</button>
                    <button id="pImport" class="gv-btn gv-btn-blue">🚀 પ્રશ્નો ઉમેરો</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.querySelector('#pCancel').onclick = () => overlay.remove();
        overlay.querySelector('#pImport').onclick = () => {
            const val = overlay.querySelector('#rawJsonPasteArea').value;
            if (!val.trim()) return window.showToast("કૃપા કરીને પહેલા કોડ પેસ્ટ કરો!", "error");
            try {
                window.processImportedArray(window.sanitizeAndParseJSON(val));
                overlay.remove();
            } catch (err) {
                window.showToast("કોડમાં ભૂલ છે: " + err.message, "error");
            }
        };
    };

    window.exportQuestionBank = function() {
        const data = localStorage.getItem('gyanVruksh_questions') || '[]';
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'GyanVruksh_Backup.json';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        window.showToast("💾 પ્રશ્ન બેંક બેકઅપ ડાઉનલોડ થઈ ગયું!");
    };

    window.clearQuestionBank = function() {
        window.customConfirm('શું તમે ખરેખર પ્રશ્ન બેંકના તમામ પ્રશ્નો ડીલીટ કરવા માંગો છો?', () => {
            localStorage.removeItem('gyanVruksh_questions');
            window.pmChaptersInitializedKey = '';
            window.showToast('પ્રશ્ન બેંક ખાલી થઈ ગઈ છે!');
            window.refreshData();
        });
    };

    // ==========================================
    // ➕ 6. ADD / EDIT QUESTION MODAL
    // ==========================================
    function ensureQuestionModal() {
        if (document.getElementById('gvQuestionModal')) return;
        const modal = document.createElement('div');
        modal.id = 'gvQuestionModal';
        modal.className = 'gv-modal-overlay';
        modal.innerHTML = `
            <div class="gv-modal-box">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
                    <h3 id="gvQModalTitle" style="margin:0; color:#1e3a8a;">➕ નવો પ્રશ્ન ઉમેરો</h3>
                    <button type="button" id="gvQModalClose" style="border:none; background:#fee2e2; color:#b91c1c; font-weight:bold; padding:4px 10px; border-radius:6px; cursor:pointer;">✖</button>
                </div>
                <div class="gv-grid-2" style="margin-bottom:10px;">
                    <div><label style="font-size:12px; font-weight:bold;">ધોરણ:</label><input id="gvQStd" class="gv-input" placeholder="દા.ત. 10" value="10"></div>
                    <div><label style="font-size:12px; font-weight:bold;">વિષય:</label><input id="gvQSub" class="gv-input" placeholder="દા.ત. વિજ્ઞાન, ગણિત, English" value="વિજ્ઞાન"></div>
                    <div><label style="font-size:12px; font-weight:bold;">પ્રકરણ:</label><input id="gvQChap" class="gv-input" placeholder="દા.ત. 1" value="1"></div>
                    <div><label style="font-size:12px; font-weight:bold;">પ્રશ્નનો પ્રકાર:</label>
                        <input id="gvQType" list="gvTypeSuggestions" class="gv-input" placeholder="દા.ત. MCQ, ટૂંકમાં જવાબ આપો" value="MCQ">
                        <datalist id="gvTypeSuggestions">
                            <option value="MCQ"></option>
                            <option value="ખાલી જગ્યા"></option>
                            <option value="વિકલ્પ સાથે ખાલી જગ્યા"></option>
                            <option value="ખરા-ખોટા"></option>
                            <option value="જોડકા જોડો"></option>
                            <option value="એક વાક્યમાં જવાબ આપો"></option>
                            <option value="ટૂંકમાં જવાબ આપો"></option>
                            <option value="માગ્યા મુજબ જવાબ આપો"></option>
                            <option value="સવિસ્તાર જવાબ આપો"></option>
                        </datalist>
                    </div>
                    <div><label style="font-size:12px; font-weight:bold;">ગુણ (Marks):</label><input id="gvQMarks" type="number" min="1" max="20" class="gv-input" value="1"></div>
                    <div><label style="font-size:12px; font-weight:bold;">ભાષા (Language):</label>
                        <select id="gvQLang" class="gv-input">
                            <option value="gu">ગુજરાતી (gu)</option>
                            <option value="en">English (en)</option>
                            <option value="hi">हिन्दी (hi)</option>
                            <option value="sa">संस्कृतम् (sa)</option>
                        </select>
                    </div>
                </div>
                <div style="margin-bottom:10px;">
                    <label style="font-size:12px; font-weight:bold;">📌 સૂચના (વૈકલ્પિક — ઓટો પેપરમાં આપોઆપ આવશે):</label>
                    <input id="gvQInst" list="gvInstructionSuggestions" class="gv-input" placeholder="ખાલી રાખશો તો પ્રકાર મુજબ ડિફોલ્ટ સૂચના આવશે...">
                    <datalist id="gvInstructionSuggestions"></datalist>
                </div>
                <div style="margin-bottom:10px;">
                    <label style="font-size:12px; font-weight:bold;">પ્રશ્નનું લખાણ:</label>
                    <textarea id="gvQText" rows="4" class="gv-input" placeholder="અહીં પ્રશ્ન લખો..."></textarea>
                </div>
                <div style="margin-bottom:14px;">
                    <label style="font-size:12px; font-weight:bold;">જવાબ (Answer):</label>
                    <textarea id="gvQAns" rows="4" class="gv-input" placeholder="અહીં ઉત્તર લખો..."></textarea>
                </div>
                <div style="display:flex; gap:8px; justify-content:flex-end;">
                    <button type="button" id="gvQModalCancel" class="gv-btn gv-btn-dark">રદ કરો</button>
                    <button type="button" id="gvQModalSave" class="gv-btn gv-btn-green">💾 પ્રશ્ન સેવ કરો</button>
                </div>
            </div>`;
        document.body.appendChild(modal);

        const closeModal = () => { modal.style.display = 'none'; window.editingQuestionId = null; };
        modal.querySelector('#gvQModalClose').onclick = closeModal;
        modal.querySelector('#gvQModalCancel').onclick = closeModal;
        modal.querySelector('#gvQModalSave').onclick = () => {
            const text = modal.querySelector('#gvQText').value.trim();
            if (!text) return window.showToast('કૃપા કરીને પ્રશ્નનું લખાણ લખો!', 'error');

            const qData = {
                id: window.editingQuestionId || ('Q_MAN_' + Date.now()),
                standard: modal.querySelector('#gvQStd').value.trim() || '10',
                subject: modal.querySelector('#gvQSub').value.trim() || 'વિજ્ઞાન',
                chapter: modal.querySelector('#gvQChap').value.trim() || '1',
                type: modal.querySelector('#gvQType').value.trim() || 'MCQ',
                marks: Number(modal.querySelector('#gvQMarks').value) || 1,
                lang: modal.querySelector('#gvQLang').value || 'gu',
                instruction: modal.querySelector('#gvQInst').value.trim(),
                text: text,
                answer: modal.querySelector('#gvQAns').value.trim()
            };

            let allQ = getAllQuestions();
            if (window.editingQuestionId) {
                const idx = allQ.findIndex(x => x.id === window.editingQuestionId);
                if (idx !== -1) allQ[idx] = { ...allQ[idx], ...qData };
                window.showToast('✅ પ્રશ્ન અપડેટ થઈ ગયો!');
            } else {
                allQ.push(qData);
                window.showToast('✅ નવો પ્રશ્ન ઉમેરાઈ ગયો!');
            }
            saveAllQuestions(allQ);
            window.pmChaptersInitializedKey = '';
            closeModal();
            window.refreshData();
        };
    }

    window.openAddModal = function(e, editQ = null) {
        if (e) e.preventDefault();
        ensureQuestionModal();
        window.updateInstructionDatalist();
        const modal = document.getElementById('gvQuestionModal');
        if (!modal) return;

        if (editQ) {
            window.editingQuestionId = editQ.id;
            modal.querySelector('#gvQModalTitle').textContent = '✏️ પ્રશ્ન એડિટ કરો';
            modal.querySelector('#gvQStd').value = editQ.standard || '10';
            modal.querySelector('#gvQSub').value = editQ.subject || 'વિજ્ઞાન';
            modal.querySelector('#gvQChap').value = editQ.chapter || '1';
            modal.querySelector('#gvQType').value = editQ.type || 'MCQ';
            modal.querySelector('#gvQMarks').value = editQ.marks || 1;
            modal.querySelector('#gvQLang').value = editQ.lang || 'gu';
            modal.querySelector('#gvQInst').value = editQ.instruction || '';
            modal.querySelector('#gvQText').value = editQ.text || '';
            modal.querySelector('#gvQAns').value = editQ.answer || '';
        } else {
            window.editingQuestionId = null;
            modal.querySelector('#gvQModalTitle').textContent = '➕ નવો પ્રશ્ન ઉમેરો';
            modal.querySelector('#gvQInst').value = '';
            modal.querySelector('#gvQText').value = '';
            modal.querySelector('#gvQAns').value = '';
        }
        modal.style.display = 'flex';
    };

    // ==========================================
    // 👁️ 7. LIVE DRAFT / SAVED PAPER PREVIEW MODAL
    // ==========================================
    window.buildCurrentDraftPaperObj = function() {
        const totalDraftMarks = window.draftPaperQuestions.reduce((s, q) => s + Number(q.marks || 0), 0);
        const firstRealQ = window.draftPaperQuestions.find(q => q.type !== 'instruction') || {};
        return {
            id: 'DRAFT_' + Date.now(),
            title: window.pmTitleVal || 'પ્રશ્નપત્ર',
            standard: window.pmSelectedStd === 'ALL' ? (firstRealQ.standard || '') : window.pmSelectedStd,
            subject: window.pmSelectedSub === 'ALL' ? (firstRealQ.subject || '') : window.pmSelectedSub,
            date: window.pmDateVal,
            totalMarks: totalDraftMarks,
            sectionsMetadata: window.draftPaperMeta || {},
            questions: window.draftPaperQuestions
        };
    };

    window.openPaperPreviewModal = function(paperObj, initialType = 'question', isDraft = true) {
        if (!paperObj || !paperObj.questions || paperObj.questions.length === 0) {
            return window.showToast('પ્રિવ્યૂ જોવા માટે પહેલા ઓછામાં ઓછો ૧ પ્રશ્ન પસંદ કરો!', 'error');
        }
        if (typeof window.generatePaperHTML !== 'function') {
            return window.showToast('PDF જનરેટર ફાઈલ લોડ થઈ નથી. પેજ રિફ્રેશ કરો.', 'error');
        }

        let existing = document.getElementById('gvPreviewModalOverlay');
        if (existing) existing.remove();

        let currentPreviewType = initialType;
        const overlay = document.createElement('div');
        overlay.id = 'gvPreviewModalOverlay';
        overlay.className = 'gv-modal-overlay';
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="gv-preview-box">
                <div style="background:#1e293b; color:#fff; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <strong style="font-size:15px;">👁️ પેપર પ્રિવ્યૂ</strong>
                        <button type="button" id="pvTabQ" class="gv-btn gv-btn-blue" style="padding:5px 11px; font-size:12.5px;">📄 પ્રશ્નપત્ર</button>
                        <button type="button" id="pvTabSol" class="gv-btn gv-btn-dark" style="padding:5px 11px; font-size:12.5px;">🔑 Answer Key</button>
                    </div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button type="button" id="pvPrintPDF" class="gv-btn gv-btn-green" style="padding:6px 12px; font-size:12.5px;">🖨️ PDF / Print</button>
                        <button type="button" id="pvWord" class="gv-btn gv-btn-purple" style="padding:6px 12px; font-size:12.5px;">📝 Word</button>
                        ${isDraft ? '<button type="button" id="pvSaveDraft" class="gv-btn gv-btn-orange" style="padding:6px 12px; font-size:12.5px;">💾 સેવ કરો</button>' : ''}
                        <button type="button" id="pvClose" class="gv-btn gv-btn-red" style="padding:6px 12px; font-size:12.5px;">✖ બંધ કરો</button>
                    </div>
                </div>
                <div style="flex:1; overflow-y:auto; padding:12px;">
                    <div class="gv-preview-sheet" id="gvPreviewSheetContent"></div>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        const renderSheet = () => {
            overlay.querySelector('#gvPreviewSheetContent').innerHTML = window.generatePaperHTML(paperObj, currentPreviewType, false);
            overlay.querySelector('#pvTabQ').className = 'gv-btn ' + (currentPreviewType === 'question' ? 'gv-btn-blue' : 'gv-btn-dark');
            overlay.querySelector('#pvTabSol').className = 'gv-btn ' + (currentPreviewType === 'solution' ? 'gv-btn-green' : 'gv-btn-dark');
        };
        renderSheet();

        overlay.querySelector('#pvTabQ').onclick = () => { currentPreviewType = 'question'; renderSheet(); };
        overlay.querySelector('#pvTabSol').onclick = () => { currentPreviewType = 'solution'; renderSheet(); };
        overlay.querySelector('#pvPrintPDF').onclick = () => window.openVectorPDFWindow(paperObj, currentPreviewType, true);
        overlay.querySelector('#pvWord').onclick = () => window.downloadWord(paperObj, currentPreviewType);
        overlay.querySelector('#pvClose').onclick = () => overlay.remove();

        const saveBtn = overlay.querySelector('#pvSaveDraft');
        if (saveBtn) {
            saveBtn.onclick = () => {
                window.saveDraftPaper();
                overlay.remove();
            };
        }
    };

    window.previewDraftPaper = function(type = 'question') {
        const draftObj = window.buildCurrentDraftPaperObj();
        window.openPaperPreviewModal(draftObj, type, true);
    };

    window.saveDraftPaper = function() {
        if (window.draftPaperQuestions.length === 0) return window.showToast("પહેલા પ્રશ્નો પસંદ કરો!", "error");
        const papers = getAllPapers();
        const newPaper = window.buildCurrentDraftPaperObj();
        newPaper.id = 'PAPER_' + Date.now();
        papers.unshift(newPaper);
        saveAllPapers(papers);
        window.showToast("✅ પેપર સેવ થઈ ગયું! હવે PDF / Print અથવા Word ડાઉનલોડ કરો.");
        window.switchTab('papers');
    };

    // ==========================================
    // 📝 8. AUTO-PAPER GENERATOR & GSEB BOARD BLUEPRINTS
    // ==========================================
    window.GSEB_BOARD_BLUEPRINTS = {
        gseb_unit_25: {
            label: '📋 એકમ કસોટી (25 ગુણ)',
            desc: 'A: 5×1 | B: 3×2 | C: 2×3 | D: 2×4',
            title: 'એકમ કસોટી (બોર્ડ પેટર્ન - 25 ગુણ)',
            targetMarks: 25,
            sections: [
                { sec: 'A', marks: 1, count: 5, instruction: 'નીચે આપેલા હેતુલક્ષી પ્રશ્નોના ઉત્તર લખો. (દરેકનો 1 ગુણ)' },
                { sec: 'B', marks: 2, count: 3, instruction: 'નીચે આપેલા પ્રશ્નોના ટૂંકમાં ઉત્તર લખો. (દરેકના 2 ગુણ)' },
                { sec: 'C', marks: 3, count: 2, instruction: 'નીચે આપેલા પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો. (દરેકના 3 ગુણ)' },
                { sec: 'D', marks: 4, count: 2, instruction: 'નીચે આપેલા પ્રશ્નોના સવિસ્તાર ઉત્તર લખો. (દરેકના 4 ગુણ)' }
            ]
        },
        gseb_mid_50: {
            label: '📋 પ્રથમ/દ્વિતીય પરીક્ષા (50 ગુણ)',
            desc: 'A: 10×1 | B: 6×2 | C: 4×3 | D: 4×4',
            title: 'પ્રથમ / દ્વિતીય પરીક્ષા (50 ગુણ)',
            targetMarks: 50,
            sections: [
                { sec: 'A', marks: 1, count: 10, instruction: 'નીચે આપેલા હેતુલક્ષી પ્રશ્નોના ઉત્તર લખો. (દરેકનો 1 ગુણ)' },
                { sec: 'B', marks: 2, count: 6, instruction: 'નીચે આપેલા પ્રશ્નોના ટૂંકમાં ઉત્તર લખો. (દરેકના 2 ગુણ)' },
                { sec: 'C', marks: 3, count: 4, instruction: 'નીચે આપેલા પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો. (દરેકના 3 ગુણ)' },
                { sec: 'D', marks: 4, count: 4, instruction: 'નીચે આપેલા પ્રશ્નોના સવિસ્તાર ઉત્તર લખો. (દરેકના 4 ગુણ)' }
            ]
        },
        gseb_10_80: {
            label: '🏆 ધો. 9-10 બોર્ડ સ્ટાઈલ (80 ગુણ)',
            desc: 'A: 24×1 | B: 9×2 | C: 6×3 | D: 5×4',
            title: 'વાર્ષિક / બોર્ડ પરીક્ષા (80 ગુણ)',
            targetMarks: 80,
            sections: [
                { sec: 'A', marks: 1, count: 24, instruction: 'નીચે આપેલા 24 હેતુલક્ષી પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો. (દરેકનો 1 ગુણ)' },
                { sec: 'B', marks: 2, count: 9, instruction: 'નીચે આપેલા પ્રશ્નોના ટૂંકમાં ઉત્તર લખો. (દરેકના 2 ગુણ)' },
                { sec: 'C', marks: 3, count: 6, instruction: 'નીચે આપેલા પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો. (દરેકના 3 ગુણ)' },
                { sec: 'D', marks: 4, count: 5, instruction: 'નીચે આપેલા પ્રશ્નોના સવિસ્તાર ઉત્તર લખો. (દરેકના 4 ગુણ)' }
            ]
        },
        gseb_12_sci_100: {
            label: '🔬 ધો. 11-12 સાયન્સ બોર્ડ (100 ગુણ)',
            desc: 'Part-A: 50 MCQ | B: 8×2 | C: 6×3 | D: 4×4',
            title: 'બોર્ડ પરીક્ષા — વિજ્ઞાન પ્રવાહ (100 ગુણ)',
            targetMarks: 100,
            sections: [
                { sec: 'A', marks: 1, count: 50, preferTypes: ['MCQ'], instruction: 'Part-A: નીચે આપેલા 50 બહુવિકલ્પી પ્રશ્નો (MCQ) ના સાચા ઉત્તર પસંદ કરો. (દરેકનો 1 ગુણ)' },
                { sec: 'B', marks: 2, count: 8, instruction: 'Part-B (વિભાગ-A): નીચે આપેલા પ્રશ્નોના ટૂંકમાં ઉત્તર લખો. (દરેકના 2 ગુણ)' },
                { sec: 'C', marks: 3, count: 6, instruction: 'Part-B (વિભાગ-B): નીચે આપેલા પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો. (દરેકના 3 ગુણ)' },
                { sec: 'D', marks: 4, count: 4, instruction: 'Part-B (વિભાગ-C): નીચે આપેલા પ્રશ્નોના સવિસ્તાર ઉત્તર લખો. (દરેકના 4 ગુણ)' }
            ]
        },
        gseb_12_com_100: {
            label: '📊 ધો. 11-12 કોમર્સ/આર્ટ્સ (100 ગુણ)',
            desc: 'A: 20 MCQ | B: 10×1 | C: 10×2 | D: 10×3 | E: 5×4',
            title: 'બોર્ડ પરીક્ષા — સામાન્ય પ્રવાહ (100 ગુણ)',
            targetMarks: 100,
            sections: [
                { sec: 'A', marks: 1, count: 20, preferTypes: ['MCQ'], instruction: 'નીચે આપેલા 20 બહુવિકલ્પી પ્રશ્નો (MCQ) ના સાચા વિકલ્પ પસંદ કરો. (દરેકનો 1 ગુણ)' },
                { sec: 'B', marks: 1, count: 10, excludeTypes: ['MCQ'], instruction: 'નીચે આપેલા પ્રશ્નોના એક વાક્યમાં ઉત્તર લખો. (દરેકનો 1 ગુણ)' },
                { sec: 'C', marks: 2, count: 10, instruction: 'નીચે આપેલા પ્રશ્નોના ટૂંકમાં ઉત્તર લખો. (દરેકના 2 ગુણ)' },
                { sec: 'D', marks: 3, count: 10, instruction: 'નીચે આપેલા પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો. (દરેકના 3 ગુણ)' },
                { sec: 'E', marks: 4, count: 5, instruction: 'નીચે આપેલા પ્રશ્નોના સવિસ્તાર ઉત્તર લખો. (દરેકના 4 ગુણ)' }
            ]
        }
    };

    function getAvailableChaptersForMaker(allQ) {
        const chapMap = new Map();
        allQ.forEach(q => {
            const okStd = window.pmSelectedStd === 'ALL' || String(q.standard) === window.pmSelectedStd;
            const okSub = window.pmSelectedSub === 'ALL' || String(q.subject) === window.pmSelectedSub;
            if (okStd && okSub && q.chapter !== undefined && String(q.chapter).trim() !== '') {
                const cKey = String(q.chapter).trim();
                chapMap.set(cKey, (chapMap.get(cKey) || 0) + 1);
            }
        });
        return Array.from(chapMap.entries()).sort((a, b) => {
            const na = Number(a[0]), nb = Number(b[0]);
            if (!isNaN(na) && !isNaN(nb)) return na - nb;
            return a[0].localeCompare(b[0]);
        });
    }

    function getFilteredPaperPool() {
        const allQ = getAllQuestions();
        const availChaps = getAvailableChaptersForMaker(allQ).map(x => x[0]);
        const tickedSet = new Set(window.pmSelectedChapters);
        return allQ.filter(q => {
            const okStd = window.pmSelectedStd === 'ALL' || String(q.standard) === window.pmSelectedStd;
            const okSub = window.pmSelectedSub === 'ALL' || String(q.subject) === window.pmSelectedSub;
            if (!okStd || !okSub) return false;
            if (availChaps.length > 0) {
                return tickedSet.has(String(q.chapter || '').trim());
            }
            return true;
        });
    }

    window.pmToggleChapter = function(chapVal) {
        const key = String(chapVal);
        const idx = window.pmSelectedChapters.indexOf(key);
        if (idx === -1) window.pmSelectedChapters.push(key);
        else window.pmSelectedChapters.splice(idx, 1);
        window.renderPaperMaker();
    };

    window.pmSelectAllChapters = function(selectAll) {
        const avail = getAvailableChaptersForMaker(getAllQuestions()).map(x => x[0]);
        window.pmSelectedChapters = selectAll ? avail.slice() : [];
        window.renderPaperMaker();
    };

    window.gvGenerateBoardPaper = function(presetKey) {
        const bp = window.GSEB_BOARD_BLUEPRINTS[presetKey];
        if (!bp) return;
        const pool = getFilteredPaperPool();
        if (pool.length === 0) return window.showToast("કૃપા કરીને ઓછામાં ઓછું ૧ પ્રકરણ ટીક કરો (અથવા પ્રશ્નો ઉમેરો)!", "error");

        const usedIds = new Set();
        let selected = [];
        const sectionsMetadata = {};

        bp.sections.forEach(rule => {
            sectionsMetadata[rule.sec] = { instruction: rule.instruction, attempt: '' };
            let candidates = pool.filter(q => !usedIds.has(q.id) && Number(q.marks) === rule.marks);

            let preferred = candidates;
            let fallback = [];
            if (rule.preferTypes && rule.preferTypes.length > 0) {
                preferred = candidates.filter(q => rule.preferTypes.includes(q.type));
                fallback = candidates.filter(q => !rule.preferTypes.includes(q.type));
            } else if (rule.excludeTypes && rule.excludeTypes.length > 0) {
                preferred = candidates.filter(q => !rule.excludeTypes.includes(q.type));
                fallback = candidates.filter(q => rule.excludeTypes.includes(q.type));
            }

            preferred.sort(() => Math.random() - 0.5);
            fallback.sort(() => Math.random() - 0.5);
            const ordered = [...preferred, ...fallback];

            let pickedCount = 0;
            for (let q of ordered) {
                if (pickedCount >= rule.count) break;
                selected.push({ ...q, section: rule.sec });
                usedIds.add(q.id);
                pickedCount++;
            }
        });

        let currMarks = selected.reduce((s, x) => s + Number(x.marks || 0), 0);
        window.draftPaperQuestions = selected;
        window.draftPaperMeta = sectionsMetadata;
        window.pmTitleVal = bp.title;

        if (currMarks === bp.targetMarks) {
            window.showToast(`🏆 ${bp.label} સંપૂર્ણ ${currMarks} ગુણનું પેપર તૈયાર થઈ ગયું! (${selected.length} પ્રશ્નો)`);
        } else {
            window.showToast(`⚠️ પસંદ કરેલા પ્રકરણોમાં પૂરતા પ્રશ્નો ન હોવાથી ${currMarks} / ${bp.targetMarks} ગુણનું પેપર બન્યું છે (${selected.length} પ્રશ્નો).`);
        }
        window.renderPaperMaker();
    };

    window.gvAutoPaper = function(targetMarks) {
        const marksNum = Number(targetMarks);
        if (!marksNum || marksNum < 1) return window.showToast("કૃપા કરીને યોગ્ય ગુણ દાખલ કરો!", "error");

        const pool = getFilteredPaperPool();
        if (pool.length === 0) return window.showToast("કૃપા કરીને ઓછામાં ઓછું ૧ પ્રકરણ ટીક કરો (અથવા પ્રશ્નો ઉમેરો)!", "error");

        const usedIds = new Set();
        const pick = (marks, count, sec) => {
            let candidates = pool.filter(q => !usedIds.has(q.id) && Number(q.marks) === marks).sort(() => Math.random() - 0.5);
            const chosen = candidates.slice(0, count);
            chosen.forEach(q => usedIds.add(q.id));
            return chosen.map(q => ({ ...q, section: sec }));
        };

        let selected = [];
        if (marksNum === 25) {
            selected = [...pick(1, 5, 'A'), ...pick(2, 3, 'B'), ...pick(3, 2, 'C'), ...pick(4, 2, 'D')];
        } else if (marksNum === 50) {
            selected = [...pick(1, 10, 'A'), ...pick(2, 6, 'B'), ...pick(3, 4, 'C'), ...pick(4, 4, 'D')];
        } else if (marksNum === 80) {
            selected = [...pick(1, 24, 'A'), ...pick(2, 9, 'B'), ...pick(3, 6, 'C'), ...pick(4, 5, 'D')];
        } else if (marksNum === 100) {
            selected = [...pick(1, 30, 'A'), ...pick(2, 10, 'B'), ...pick(3, 10, 'C'), ...pick(4, 5, 'D')];
        } else {
            const c4 = Math.floor((marksNum * 0.25) / 4);
            const c3 = Math.floor((marksNum * 0.25) / 3);
            const c2 = Math.floor((marksNum * 0.25) / 2);
            const remFor1 = Math.max(0, marksNum - (c4 * 4 + c3 * 3 + c2 * 2));
            selected = [...pick(1, remFor1, 'A'), ...pick(2, c2, 'B'), ...pick(3, c3, 'C'), ...pick(4, c4, 'D')];
        }

        let currMarks = selected.reduce((s, x) => s + Number(x.marks || 0), 0);
        if (currMarks < marksNum) {
            const remaining = pool.filter(q => !usedIds.has(q.id)).sort(() => Math.random() - 0.5);
            for (let q of remaining) {
                const m = Number(q.marks || 1);
                if (currMarks + m <= marksNum) {
                    const sec = m === 1 ? 'A' : (m === 2 ? 'B' : (m === 3 ? 'C' : 'D'));
                    selected.push({ ...q, section: sec });
                    usedIds.add(q.id);
                    currMarks += m;
                }
                if (currMarks >= marksNum) break;
            }
        }

        const secRank = { A: 1, B: 2, C: 3, D: 4, E: 5, None: 6 };
        selected.sort((a, b) => (secRank[a.section] || 9) - (secRank[b.section] || 9));

        window.draftPaperQuestions = selected;
        window.draftPaperMeta = {};
        window.pmTitleVal = `ઓટો પ્રશ્નપત્ર (${currMarks} ગુણ)`;
        window.showToast(`⚡ ${currMarks} ગુણનું ઓટો પેપર તૈયાર થઈ ગયું! (${selected.length} પ્રશ્નો)`);
        window.renderPaperMaker();
    };

    window.gvAutoPaperCustom = function() {
        const inp = document.getElementById('pmCustomMarks');
        const val = inp ? parseInt(inp.value, 10) : 0;
        if (!val || val < 5 || val > 300) {
            return window.showToast("કૃપા કરીને 5 થી 300 ની વચ્ચે કસ્ટમ ગુણ દાખલ કરો!", "error");
        }
        window.gvAutoPaper(val);
    };

    // ==========================================
    // ✍️ 9. MANUAL QUESTION SELECTION HELPERS
    // ==========================================
    window.pmToggleManualQuestion = function(qId) {
        const existingIdx = window.draftPaperQuestions.findIndex(x => x.id === qId);
        if (existingIdx !== -1) {
            window.draftPaperQuestions.splice(existingIdx, 1);
        } else {
            const qObj = getAllQuestions().find(x => x.id === qId);
            if (!qObj) return;
            const sec = window.pmManualTargetSec || 'A';
            window.draftPaperQuestions.push({ ...qObj, section: sec });
        }
        window.renderPaperMaker();
    };

    window.pmMoveDraft = function(idx, dir) {
        const newIdx = idx + dir;
        if (newIdx < 0 || newIdx >= window.draftPaperQuestions.length) return;
        const temp = window.draftPaperQuestions[idx];
        window.draftPaperQuestions[idx] = window.draftPaperQuestions[newIdx];
        window.draftPaperQuestions[newIdx] = temp;
        window.renderPaperMaker();
    };

    window.pmChangeDraftSection = function(idx, newSec) {
        if (!window.draftPaperQuestions[idx]) return;
        window.draftPaperQuestions[idx].section = newSec;
        window.renderPaperMaker();
    };

    window.quickAddToDraftFromBank = function(qId) {
        const exists = window.draftPaperQuestions.some(x => x.id === qId);
        if (exists) return window.showToast('આ પ્રશ્ન પહેલેથી ડ્રાફ્ટ પેપરમાં ઉમેરેલ છે!', 'error');
        const qObj = getAllQuestions().find(x => x.id === qId);
        if (!qObj) return;
        const m = Number(qObj.marks || 1);
        const autoSec = m === 1 ? 'A' : (m === 2 ? 'B' : (m === 3 ? 'C' : 'D'));
        window.draftPaperQuestions.push({ ...qObj, section: autoSec });
        window.showToast(`✅ પ્રશ્ન ડ્રાફ્ટ પેપર (વિભાગ ${autoSec}) માં ઉમેરાયો! (કુલ: ${window.draftPaperQuestions.length})`);
    };

    window.jumpToPaperMakerFor = function(std, sub) {
        window.pmSelectedStd = std;
        window.pmSelectedSub = sub;
        window.pmChaptersInitializedKey = '';
        window.switchTab('maker');
    };

    // ==========================================
    // 📊 10. DASHBOARD RENDERER
    // ==========================================
    window.renderDashboard = function() {
        const box = document.getElementById('gvDashboardContainer');
        if (!box) return;

        const allQ = getAllQuestions();
        const allPapers = getAllPapers();
        const school = JSON.parse(localStorage.getItem('gyanVruksh_schoolProfile')) || { name: 'જ્ઞાન વૃક્ષ વિદ્યાલય', address: '' };

        const subSet = new Set();
        const chapKeySet = new Set();
        const breakdownMap = new Map();

        allQ.forEach(q => {
            const std = String(q.standard || '-');
            const sub = String(q.subject || '-');
            const chap = String(q.chapter || '-');
            if (sub !== '-') subSet.add(sub);
            chapKeySet.add(`${std}|${sub}|${chap}`);

            const k = `${std}|||${sub}`;
            if (!breakdownMap.has(k)) {
                breakdownMap.set(k, { std, sub, chaps: new Set(), m1: 0, m2: 0, m3: 0, m4: 0, total: 0 });
            }
            const row = breakdownMap.get(k);
            row.chaps.add(chap);
            row.total++;
            const m = Number(q.marks || 1);
            if (m === 1) row.m1++;
            else if (m === 2) row.m2++;
            else if (m === 3) row.m3++;
            else row.m4++;
        });

        const breakdownRows = Array.from(breakdownMap.values()).sort((a, b) => Number(a.std) - Number(b.std) || a.sub.localeCompare(b.sub));

        box.innerHTML = `
            <div class="gv-card" style="background:linear-gradient(135deg, #eff6ff, #f5f3ff); border-color:#c7d2fe;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                    <div>
                        <div style="font-size:12.5px; color:#4f46e5; font-weight:700;">🙏 સુસ્વાગતમ્ — Gyan Vruksh Dashboard</div>
                        <h2 style="margin:4px 0; color:#1e3a8a; font-size:21px;">🏫 ${escapeAttr(school.name)}</h2>
                        <div style="font-size:13px; color:#475569;">${school.address ? escapeAttr(school.address) : 'ઓટોમેટિક સૂચના, બોર્ડ બ્લુપ્રિન્ટ અને મેન્યુઅલ પેપર જનરેટર'}</div>
                    </div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="gv-btn gv-btn-blue" onclick="window.switchTab('maker')">📝 નવું પેપર બનાવો</button>
                        <button class="gv-btn gv-btn-green" onclick="window.openAddModal(event)">➕ નવો પ્રશ્ન</button>
                        <button class="gv-btn gv-btn-purple" onclick="window.openPasteJSONModal(event)">📋 JSON પેસ્ટ</button>
                        <button class="gv-btn gv-btn-dark" onclick="window.triggerImport(event)">📥 ફાઈલ ઈમ્પોર્ટ</button>
                    </div>
                </div>
            </div>

            <div class="gv-stat-grid">
                <div class="gv-stat-card" style="border-left:4px solid #2563eb;">
                    <div class="gv-stat-val" style="color:#1d4ed8;">${allQ.length}</div>
                    <div class="gv-stat-lbl">📚 કુલ પ્રશ્નો</div>
                </div>
                <div class="gv-stat-card" style="border-left:4px solid #16a34a;">
                    <div class="gv-stat-val" style="color:#15803d;">${subSet.size}</div>
                    <div class="gv-stat-lbl">📖 કુલ વિષયો</div>
                </div>
                <div class="gv-stat-card" style="border-left:4px solid #7c3aed;">
                    <div class="gv-stat-val" style="color:#6d28d9;">${chapKeySet.size}</div>
                    <div class="gv-stat-lbl">📑 કુલ પ્રકરણો</div>
                </div>
                <div class="gv-stat-card" style="border-left:4px solid #ea580c;">
                    <div class="gv-stat-val" style="color:#c2410c;">${allPapers.length}</div>
                    <div class="gv-stat-lbl">📂 સેવ કરેલા પેપર</div>
                </div>
            </div>

            <div class="gv-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                    <h3 style="margin:0; color:#1e3a8a; font-size:16px;">📊 ધોરણ અને વિષય મુજબ પ્રશ્ન બેંક</h3>
                    <button class="gv-btn gv-btn-outline" style="font-size:12px;" onclick="window.switchTab('bank')">બધા પ્રશ્નો જુઓ →</button>
                </div>
                ${breakdownRows.length === 0
                    ? `<div style="text-align:center; padding:20px; color:#64748b;">હજુ પ્રશ્ન બેંક ખાલી છે. ઉપરના <strong>📥 ફાઈલ ઈમ્પોર્ટ</strong> અથવા <strong>📋 JSON પેસ્ટ</strong> બટનથી પ્રશ્નો ઉમેરો.</div>`
                    : `<div style="overflow-x:auto;">
                        <table class="gv-dash-table">
                            <thead>
                                <tr>
                                    <th>ધોરણ</th>
                                    <th>વિષય</th>
                                    <th>પ્રકરણો</th>
                                    <th>1 ગુણ</th>
                                    <th>2 ગુણ</th>
                                    <th>3 ગુણ</th>
                                    <th>4+ ગુણ</th>
                                    <th>કુલ પ્રશ્નો</th>
                                    <th>એક્શન</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${breakdownRows.map(r => `
                                    <tr>
                                        <td><strong>ધો. ${escapeAttr(r.std)}</strong></td>
                                        <td><strong>${escapeAttr(r.sub)}</strong></td>
                                        <td>${r.chaps.size}</td>
                                        <td>${r.m1}</td>
                                        <td>${r.m2}</td>
                                        <td>${r.m3}</td>
                                        <td>${r.m4}</td>
                                        <td><strong style="color:#15803d;">${r.total}</strong></td>
                                        <td>
                                            <button class="gv-btn gv-btn-blue" style="padding:4px 10px; font-size:12px;" onclick="window.jumpToPaperMakerFor('${escapeAttr(r.std)}', '${escapeAttr(r.sub)}')">📝 પેપર બનાવો</button>
                                        </td>
                                    </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>`
                }
            </div>

            <div class="gv-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                    <h3 style="margin:0; color:#1e3a8a; font-size:16px;">🕒 તાજેતરના સેવ કરેલા પેપર</h3>
                    <button class="gv-btn gv-btn-outline" style="font-size:12px;" onclick="window.switchTab('papers')">બધા પેપર જુઓ →</button>
                </div>
                ${allPapers.length === 0
                    ? `<div style="text-align:center; padding:14px; color:#64748b;">હજુ કોઈ પેપર સેવ કરેલ નથી.</div>`
                    : allPapers.slice(0, 3).map(p => `
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding:10px 0; border-bottom:1px solid #e2e8f0;">
                            <div>
                                <div style="font-weight:700; color:#0f172a;">${escapeAttr(p.title)}</div>
                                <div style="font-size:12.5px; color:#64748b;">ધોરણ: ${escapeAttr(p.standard || '-')} | વિષય: ${escapeAttr(p.subject || '-')} | કુલ ગુણ: <strong>${p.totalMarks}</strong></div>
                            </div>
                            <div style="display:flex; gap:5px; flex-wrap:wrap;">
                                <button class="gv-btn gv-btn-teal" style="padding:5px 9px; font-size:12px;" onclick="window.previewSavedPaper('${p.id}')">👁️ પ્રિવ્યૂ</button>
                                <button class="gv-btn gv-btn-blue" style="padding:5px 9px; font-size:12px;" onclick="window.downloadPDF('${p.id}', 'question')">📄 PDF</button>
                                <button class="gv-btn gv-btn-green" style="padding:5px 9px; font-size:12px;" onclick="window.downloadPDF('${p.id}', 'solution')">🔑 Key</button>
                            </div>
                        </div>`).join('')
                }
            </div>
        `;
    };

    // ==========================================
    // 📚 11. QUESTION BANK RENDERER (DYNAMIC FILTERS)
    // ==========================================
    window.renderQuestions = function() {
        const container = document.getElementById('questionListContainer');
        if (!container) return;
        const allQ = getAllQuestions();
        container.innerHTML = '';

        const stdSet = new Set(), subSet = new Set(), chapSet = new Set(), typeSet = new Set(), instSet = new Set();
        allQ.forEach(q => { if (q.standard) stdSet.add(String(q.standard)); });
        if (window.currentStdFilter !== 'ALL' && !stdSet.has(window.currentStdFilter)) window.currentStdFilter = 'ALL';

        allQ.forEach(q => {
            if ((window.currentStdFilter === 'ALL' || String(q.standard) === window.currentStdFilter) && q.subject) {
                subSet.add(String(q.subject));
            }
        });
        if (window.currentSubFilter !== 'ALL' && !subSet.has(window.currentSubFilter)) window.currentSubFilter = 'ALL';

        allQ.forEach(q => {
            const okStd = window.currentStdFilter === 'ALL' || String(q.standard) === window.currentStdFilter;
            const okSub = window.currentSubFilter === 'ALL' || String(q.subject) === window.currentSubFilter;
            if (okStd && okSub) {
                if (q.chapter) chapSet.add(String(q.chapter));
                if (q.type) typeSet.add(String(q.type));
                const effInst = window.getEffectiveInstruction(q);
                if (effInst) instSet.add(effInst);
            }
        });
        if (window.currentChapFilter !== 'ALL' && !chapSet.has(window.currentChapFilter)) window.currentChapFilter = 'ALL';
        if (window.currentTypeFilter !== 'ALL' && !typeSet.has(window.currentTypeFilter)) window.currentTypeFilter = 'ALL';
        if (window.currentInstFilter !== 'ALL' && !instSet.has(window.currentInstFilter)) window.currentInstFilter = 'ALL';

        const filteredQ = allQ.slice().reverse().filter(q => {
            const okStd = window.currentStdFilter === 'ALL' || String(q.standard) === window.currentStdFilter;
            const okSub = window.currentSubFilter === 'ALL' || String(q.subject) === window.currentSubFilter;
            const okChap = window.currentChapFilter === 'ALL' || String(q.chapter) === window.currentChapFilter;
            const okType = window.currentTypeFilter === 'ALL' || String(q.type) === window.currentTypeFilter;
            const okInst = window.currentInstFilter === 'ALL' || window.getEffectiveInstruction(q) === window.currentInstFilter;
            const qStr = `${q.text} ${q.answer} ${q.subject} ${q.chapter} ${q.standard} ${q.instruction || ''} ${q.type || ''}`.toLowerCase();
            const okSearch = !window.currentSearchQuery.trim() || qStr.includes(window.currentSearchQuery.toLowerCase());
            return okStd && okSub && okChap && okType && okInst && okSearch;
        });

        const totalMarks = filteredQ.reduce((sum, q) => sum + Number(q.marks || 0), 0);
        const buildOpts = (setObj, allLabel, numSort = false) => {
            let arr = Array.from(setObj);
            if (numSort) arr.sort((a, b) => Number(a) - Number(b)); else arr.sort();
            return `<option value="ALL">${allLabel}</option>` + arr.map(v => {
                const lbl = v.length > 52 ? v.substring(0, 52) + '...' : v;
                return `<option value="${escapeAttr(v)}">${escapeAttr(lbl)}</option>`;
            }).join('');
        };

        const controlBar = document.createElement('div');
        controlBar.className = 'gv-card';
        controlBar.style.background = '#f8fafc';
        controlBar.innerHTML = `
            <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="font-weight:bold; font-size:14px;">
                    📚 પ્રશ્નો: <span style="color:#15803d;">${filteredQ.length}</span> / ${allQ.length} &nbsp;|&nbsp; 🎯 ગુણ: <span style="color:#1d4ed8;">${totalMarks}</span>
                </div>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <button type="button" class="gv-btn gv-btn-green" onclick="window.openAddModal(event)">➕ નવો પ્રશ્ન</button>
                    <button type="button" class="gv-btn gv-btn-blue" onclick="window.triggerImport(event)">📥 JSON ઈમ્પોર્ટ</button>
                    <button type="button" class="gv-btn gv-btn-purple" onclick="window.openPasteJSONModal(event)">📋 કોડ પેસ્ટ</button>
                    <button type="button" class="gv-btn gv-btn-dark" onclick="window.exportQuestionBank()">💾 બેકઅપ</button>
                    <button type="button" class="gv-btn gv-btn-red" onclick="window.clearQuestionBank()">🗑️</button>
                </div>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center; padding-top:8px; border-top:1px dashed #cbd5e1;">
                <input type="text" id="qSearchInput" placeholder="🔍 શોધો..." value="${escapeAttr(window.currentSearchQuery)}" style="padding:5px 8px; border:1px solid #94a3b8; border-radius:5px; font-size:13px; width:150px;">
                <select id="qFilterStd" style="padding:5px 7px; border:1px solid #94a3b8; border-radius:5px; font-size:13px; background:#fff;">${buildOpts(stdSet, 'બધા ધોરણ', true)}</select>
                <select id="qFilterSub" style="padding:5px 7px; border:1px solid #94a3b8; border-radius:5px; font-size:13px; background:#fff;">${buildOpts(subSet, 'બધા વિષયો')}</select>
                <select id="qFilterChap" style="padding:5px 7px; border:1px solid #94a3b8; border-radius:5px; font-size:13px; background:#fff;">${buildOpts(chapSet, 'બધા પ્રકરણ', true)}</select>
                <select id="qFilterType" style="padding:5px 7px; border:1px solid #94a3b8; border-radius:5px; font-size:13px; background:#fff;">${buildOpts(typeSet, 'બધા પ્રકાર')}</select>
                <select id="qFilterInst" style="padding:5px 7px; border:1px solid #7c3aed; border-radius:5px; font-size:13px; background:#faf5ff; color:#4c1d95; font-weight:600; max-width:250px;">${buildOpts(instSet, '📌 બધી સૂચનાઓ')}</select>
                <button type="button" id="btnToggleAns" style="padding:5px 9px; background:${window.hideAnswersMode ? '#0284c7' : '#e2e8f0'}; color:${window.hideAnswersMode ? '#fff' : '#0f172a'}; border:1px solid #cbd5e1; border-radius:5px; cursor:pointer; font-weight:bold; font-size:12px;">${window.hideAnswersMode ? '👁️ જવાબ' : '🙈 છુપાવો'}</button>
                <button type="button" id="btnResetFilters" style="padding:5px 9px; background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; border-radius:5px; cursor:pointer; font-size:12px; font-weight:bold;">↺ રીસેટ</button>
            </div>
        `;
        container.appendChild(controlBar);

        const bindSel = (id, key) => {
            const el = controlBar.querySelector('#' + id);
            el.value = window[key];
            el.onchange = (e) => { window[key] = e.target.value; window.bankVisibleLimit = 60; window.renderQuestions(); };
        };
        bindSel('qFilterStd', 'currentStdFilter');
        bindSel('qFilterSub', 'currentSubFilter');
        bindSel('qFilterChap', 'currentChapFilter');
        bindSel('qFilterType', 'currentTypeFilter');
        bindSel('qFilterInst', 'currentInstFilter');

        controlBar.querySelector('#btnToggleAns').onclick = () => { window.hideAnswersMode = !window.hideAnswersMode; window.renderQuestions(); };
        controlBar.querySelector('#btnResetFilters').onclick = () => {
            window.currentSearchQuery = ''; window.currentStdFilter = 'ALL'; window.currentSubFilter = 'ALL';
            window.currentChapFilter = 'ALL'; window.currentTypeFilter = 'ALL'; window.currentInstFilter = 'ALL';
            window.bankVisibleLimit = 60;
            window.renderQuestions();
        };
        controlBar.querySelector('#qSearchInput').oninput = (e) => {
            window.currentSearchQuery = e.target.value;
            window.bankVisibleLimit = 60;
            window.renderQuestions();
            const inp = document.getElementById('qSearchInput');
            if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
        };

        if (filteredQ.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'gv-card';
            empty.style.textAlign = 'center';
            empty.innerHTML = allQ.length === 0
                ? 'પ્રશ્ન બેંક ખાલી છે. ઉપરના <strong>📥 JSON ઈમ્પોર્ટ</strong> અથવા <strong>📋 કોડ પેસ્ટ</strong> બટનથી પ્રશ્નો ઉમેરો.'
                : 'પસંદ કરેલા ફિલ્ટર મુજબ કોઈ પ્રશ્ન મળ્યો નથી.';
            container.appendChild(empty);
            return;
        }

        const sliceQ = filteredQ.slice(0, window.bankVisibleLimit);
        sliceQ.forEach(q => {
            let uiText = window.formatScienceAndMath(q.text || '').replace(/\\n|\n/g, '<br>');
            if (q.type === 'MCQ') uiText = uiText.replace(/\(A\)/g, '<br>(A)').replace(/\(C\)/g, '&nbsp;&nbsp;&nbsp;&nbsp;(C)');
            else if (q.type === 'જોડકા જોડો' && window.parseMatchTextGlobal) uiText = window.parseMatchTextGlobal(window.formatScienceAndMath(q.text || ''), q.lang);
            let uiAns = window.formatScienceAndMath(q.answer || '').replace(/\\n|\n/g, '<br>');
            let effInst = window.getEffectiveInstruction(q);

            const card = document.createElement('div');
            card.className = 'gv-card';
            card.style.position = 'relative';
            card.innerHTML = `
                <div style="font-size:12px; color:#1d4ed8; font-weight:bold; margin-bottom:6px; padding-right:215px;">
                    <span style="background:#eff6ff; padding:2px 8px; border-radius:4px; border:1px solid #bfdbfe;">ધો. ${q.standard || '-'} | ${q.subject || '-'} | પ્ર. ${q.chapter || '-'}</span>
                    &nbsp;•&nbsp; ${q.type || '-'} &nbsp;•&nbsp; <span style="color:#15803d;">[${q.marks} ગુણ]</span>
                </div>
                ${effInst ? `<div style="font-size:12px; color:#6d28d9; background:#f5f3ff; padding:3px 8px; border-radius:4px; margin-bottom:6px; display:inline-block; border:1px solid #ddd6fe;">📌 ${effInst}</div>` : ''}
                <div style="font-size:15.5px; font-weight:600; margin-bottom:10px; line-height:2.0;">${uiText}</div>
                <div style="display:${window.hideAnswersMode ? 'none' : 'block'}; font-size:14.5px; background:#f8fafc; padding:10px; border-left:3.5px solid #22c55e; border-radius:0 4px 4px 0; line-height:1.95;">
                    <strong>જવાબ:</strong><br>${uiAns}
                </div>
                <div style="position:absolute; top:12px; right:12px; display:flex; gap:4px;">
                    <button class="btn-add-draft-q" data-id="${q.id}" title="ડ્રાફ્ટ પેપરમાં ઉમેરો" style="background:#dcfce7; border:1px solid #86efac; color:#166534; border-radius:4px; padding:4px 7px; cursor:pointer; font-size:11.5px; font-weight:bold;">➕ પેપરમાં</button>
                    <button class="btn-edit-q" data-id="${q.id}" style="background:#fef9c3; border:1px solid #fde047; color:#854d0e; border-radius:4px; padding:4px 7px; cursor:pointer; font-size:11.5px; font-weight:bold;">✏️</button>
                    <button class="btn-copy-q" data-id="${q.id}" style="background:#e0f2fe; border:1px solid #bae6fd; color:#0369a1; border-radius:4px; padding:4px 7px; cursor:pointer; font-size:11.5px; font-weight:bold;">📋</button>
                    <button class="btn-delete-q" data-id="${q.id}" style="background:#fee2e2; border:1px solid #fecaca; color:#b91c1c; border-radius:4px; padding:4px 7px; cursor:pointer; font-size:11.5px; font-weight:bold;">🗑️</button>
                </div>`;
            container.appendChild(card);
        });

        if (filteredQ.length > window.bankVisibleLimit) {
            const loadMoreBtn = document.createElement('div');
            loadMoreBtn.style.textAlign = 'center';
            loadMoreBtn.innerHTML = `<button class="gv-btn gv-btn-blue" onclick="window.bankVisibleLimit += 60; window.renderQuestions();">⬇️ વધુ પ્રશ્નો બતાવો (${filteredQ.length - window.bankVisibleLimit} બાકી)</button>`;
            container.appendChild(loadMoreBtn);
        }

        container.querySelectorAll('.btn-add-draft-q').forEach(b => b.onclick = () => window.quickAddToDraftFromBank(b.dataset.id));
        container.querySelectorAll('.btn-edit-q').forEach(b => b.onclick = () => {
            const qObj = allQ.find(x => x.id === b.dataset.id);
            if (qObj) window.openAddModal(null, qObj);
        });
        container.querySelectorAll('.btn-delete-q').forEach(b => b.onclick = () => {
            window.customConfirm("શું આ પ્રશ્ન ડીલીટ કરવો છે?", () => {
                saveAllQuestions(allQ.filter(x => x.id !== b.dataset.id));
                window.showToast("પ્રશ્ન ડીલીટ થઈ ગયો.");
                window.refreshData();
            });
        });
        container.querySelectorAll('.btn-copy-q').forEach(b => b.onclick = () => {
            const qObj = allQ.find(x => x.id === b.dataset.id);
            if (!qObj) return;
            const shareText = `*પ્રશ્ન (${qObj.marks} ગુણ):*\n${qObj.text.replace(/<[^>]*>?/gm, '')}\n\n*ઉત્તર:*\n${qObj.answer.replace(/<[^>]*>?/gm, '')}`;
            navigator.clipboard.writeText(shareText).then(() => window.showToast("📋 પ્રશ્ન કોપી થઈ ગયો!"));
        });
    };

    // ==========================================
    // 📝 12. PAPER MAKER RENDERER (MULTI-CHAPTER + AUTO + MANUAL + PREVIEW)
    // ==========================================
    window.renderPaperMaker = function() {
        const box = document.getElementById('gvPaperMakerContainer');
        if (!box) return;
        const allQ = getAllQuestions();

        const stds = Array.from(new Set(allQ.map(q => String(q.standard || '')))).filter(Boolean).sort((a,b)=>Number(a)-Number(b));
        if (window.pmSelectedStd !== 'ALL' && !stds.includes(window.pmSelectedStd)) window.pmSelectedStd = 'ALL';

        const subs = Array.from(new Set(allQ.filter(q => window.pmSelectedStd === 'ALL' || String(q.standard) === window.pmSelectedStd).map(q => String(q.subject || '')))).filter(Boolean).sort();
        if (window.pmSelectedSub !== 'ALL' && !subs.includes(window.pmSelectedSub)) window.pmSelectedSub = 'ALL';

        const availChaps = getAvailableChaptersForMaker(allQ); // [[chap, count], ...]
        const initKey = `${window.pmSelectedStd}|||${window.pmSelectedSub}|||${availChaps.length}`;
        if (window.pmChaptersInitializedKey !== initKey) {
            window.pmSelectedChapters = availChaps.map(x => x[0]); // Default: all chapters ticked
            window.pmChaptersInitializedKey = initKey;
        }

        const pool = getFilteredPaperPool();
        const totalDraftMarks = window.draftPaperQuestions.reduce((s, q) => s + Number(q.marks || 0), 0);

        // Section-wise marks summary
        const secSums = { A: 0, B: 0, C: 0, D: 0, E: 0, None: 0 };
        window.draftPaperQuestions.forEach(q => {
            const sk = secSums[q.section] !== undefined ? q.section : 'None';
            secSums[sk] += Number(q.marks || 0);
        });
        const secSummaryBadges = ['A', 'B', 'C', 'D', 'E'].filter(s => secSums[s] > 0)
            .map(s => `<span style="background:#f1f5f9; border:1px solid #cbd5e1; padding:2px 8px; border-radius:4px; font-size:12px;">વિભાગ ${s}: <strong>${secSums[s]}</strong></span>`).join(' ');

        const chapCheckboxesHTML = availChaps.length === 0
            ? '<span style="font-size:13px; color:#64748b;">કોઈ પ્રકરણ ઉપલબ્ધ નથી. પહેલા પ્રશ્નો ઉમેરો.</span>'
            : availChaps.map(([chap, cnt]) => {
                const isChecked = window.pmSelectedChapters.includes(chap);
                return `
                    <label class="gv-chap-chip ${isChecked ? 'checked' : ''}" onclick="event.preventDefault(); window.pmToggleChapter('${escapeAttr(chap)}');">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} style="pointer-events:none; accent-color:#2563eb;">
                        <span>પ્રકરણ ${escapeAttr(chap)} <small style="opacity:0.75;">(${cnt})</small></span>
                    </label>`;
            }).join('');

        const boardButtonsHTML = Object.keys(window.GSEB_BOARD_BLUEPRINTS).map(key => {
            const bp = window.GSEB_BOARD_BLUEPRINTS[key];
            return `
                <button type="button" onclick="window.gvGenerateBoardPaper('${key}')" style="text-align:left; padding:10px 12px; background:#fff; border:1.5px solid #cbd5e1; border-left:4px solid #7c3aed; border-radius:8px; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.04);">
                    <div style="font-weight:700; font-size:13.5px; color:#1e293b; margin-bottom:3px;">${bp.label}</div>
                    <div style="font-size:11.5px; color:#64748b; font-weight:600;">${bp.desc}</div>
                </button>`;
        }).join('');

        // Manual Picker HTML
        let manualPickerHTML = '';
        if (window.pmActiveMode === 'manual') {
            const typeSet = new Set(), instSet = new Set();
            pool.forEach(q => {
                if (q.type) typeSet.add(String(q.type));
                const ei = window.getEffectiveInstruction(q);
                if (ei) instSet.add(ei);
            });
            if (window.pmManualType !== 'ALL' && !typeSet.has(window.pmManualType)) window.pmManualType = 'ALL';
            if (window.pmManualInst !== 'ALL' && !instSet.has(window.pmManualInst)) window.pmManualInst = 'ALL';

            const manualFiltered = pool.filter(q => {
                const okType = window.pmManualType === 'ALL' || String(q.type) === window.pmManualType;
                const okInst = window.pmManualInst === 'ALL' || window.getEffectiveInstruction(q) === window.pmManualInst;
                const okMarks = window.pmManualMarks === 'ALL' || String(q.marks) === window.pmManualMarks;
                const okSearch = !window.pmManualSearch.trim() || `${q.text} ${q.answer} ${q.chapter} ${q.type}`.toLowerCase().includes(window.pmManualSearch.toLowerCase());
                return okType && okInst && okMarks && okSearch;
            });

            const draftIdSet = new Set(window.draftPaperQuestions.map(x => x.id));
            const manualRows = manualFiltered.slice(0, window.pmManualLimit).map(q => {
                const isAdded = draftIdSet.has(q.id);
                let qText = window.formatScienceAndMath(q.text || '').replace(/\\n|\n/g, '<br>');
                if (q.type === 'MCQ') qText = qText.replace(/\(A\)/g, '<br>(A)').replace(/\(C\)/g, '&nbsp;&nbsp;&nbsp;&nbsp;(C)');
                return `
                    <div style="display:flex; gap:10px; align-items:flex-start; padding:10px; border-bottom:1px solid #e2e8f0; background:${isAdded ? '#f0fdf4' : '#fff'};">
                        <button type="button" onclick="window.pmToggleManualQuestion('${q.id}')" class="gv-btn ${isAdded ? 'gv-btn-green' : 'gv-btn-outline'}" style="padding:5px 10px; font-size:12px; white-space:nowrap; margin-top:2px;">
                            ${isAdded ? '✅ ઉમેરેલ' : '➕ ઉમેરો'}
                        </button>
                        <div style="flex:1; font-size:14px; line-height:1.75;">
                            <div style="font-size:11.5px; color:#475569; font-weight:700; margin-bottom:3px;">
                                <span style="color:#1d4ed8;">પ્ર. ${escapeAttr(q.chapter || '-')}</span> • ${escapeAttr(q.type || '-')} • <span style="color:#15803d;">[${q.marks} ગુણ]</span>
                            </div>
                            <div>${qText}</div>
                        </div>
                    </div>`;
            }).join('');

            manualPickerHTML = `
                <div style="padding:12px; background:#f8fafc; border-radius:8px; border:1px solid #cbd5e1;">
                    <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:10px;">
                        <strong style="font-size:13.5px; color:#0f172a;">✍️ મેન્યુઅલ પ્રશ્નો પસંદ કરો (${manualFiltered.length} ઉપલબ્ધ):</strong>
                        <div style="margin-left:auto; display:flex; align-items:center; gap:6px;">
                            <label style="font-size:12.5px; font-weight:bold; color:#6d28d9;">કયા વિભાગમાં ઉમેરવું?</label>
                            <select id="pmManualSecSel" style="padding:5px 8px; border:1.5px solid #7c3aed; border-radius:6px; font-weight:bold; background:#faf5ff; color:#4c1d95;">
                                ${['A','B','C','D','E','None'].map(s => `<option value="${s}" ${window.pmManualTargetSec === s ? 'selected' : ''}>${s === 'None' ? 'વિભાગ વગર' : 'વિભાગ - ' + s}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px;">
                        <input type="text" id="pmManualSearchInp" placeholder="🔍 પ્રશ્ન શોધો..." value="${escapeAttr(window.pmManualSearch)}" style="padding:6px 8px; border:1px solid #94a3b8; border-radius:5px; font-size:13px; width:160px;">
                        <select id="pmManualMarksSel" style="padding:6px 8px; border:1px solid #94a3b8; border-radius:5px; font-size:13px; background:#fff;">
                            <option value="ALL">બધા ગુણ</option>
                            ${['1','2','3','4','5'].map(m => `<option value="${m}" ${window.pmManualMarks === m ? 'selected' : ''}>${m} ગુણ</option>`).join('')}
                        </select>
                        <select id="pmManualTypeSel" style="padding:6px 8px; border:1px solid #94a3b8; border-radius:5px; font-size:13px; background:#fff;">
                            <option value="ALL">બધા પ્રકાર</option>
                            ${Array.from(typeSet).sort().map(t => `<option value="${escapeAttr(t)}" ${window.pmManualType === t ? 'selected' : ''}>${escapeAttr(t)}</option>`).join('')}
                        </select>
                        <select id="pmManualInstSel" style="padding:6px 8px; border:1px solid #7c3aed; border-radius:5px; font-size:13px; background:#faf5ff; max-width:250px;">
                            <option value="ALL">📌 બધી સૂચનાઓ</option>
                            ${Array.from(instSet).sort().map(i => `<option value="${escapeAttr(i)}" ${window.pmManualInst === i ? 'selected' : ''}>${escapeAttr(i.length > 48 ? i.substring(0, 48) + '...' : i)}</option>`).join('')}
                        </select>
                    </div>
                    <div style="max-height:420px; overflow-y:auto; border:1px solid #cbd5e1; border-radius:6px; background:#fff;">
                        ${manualRows || '<div style="padding:20px; text-align:center; color:#64748b;">પસંદ કરેલા પ્રકરણો / ફિલ્ટર મુજબ કોઈ પ્રશ્ન મળ્યો નથી.</div>'}
                    </div>
                    ${manualFiltered.length > window.pmManualLimit ? `<div style="text-align:center; margin-top:8px;"><button type="button" class="gv-btn gv-btn-outline" onclick="window.pmManualLimit += 50; window.renderPaperMaker();">⬇️ વધુ પ્રશ્નો બતાવો</button></div>` : ''}
                </div>`;
        }

        box.innerHTML = `
            <div class="gv-card">
                <h3 style="margin:0 0 12px 0; color:#1e3a8a;">📝 નવું પ્રશ્નપત્ર બનાવો (ઓટો + બોર્ડ બ્લુપ્રિન્ટ + મેન્યુઅલ)</h3>
                <div class="gv-grid-2" style="margin-bottom:12px;">
                    <div><label style="font-size:12px; font-weight:bold;">પરીક્ષાનું નામ:</label><input id="pmTitle" class="gv-input" value="${escapeAttr(window.pmTitleVal)}"></div>
                    <div><label style="font-size:12px; font-weight:bold;">તારીખ:</label><input id="pmDate" type="date" class="gv-input" value="${window.pmDateVal}"></div>
                    <div><label style="font-size:12px; font-weight:bold;">ધોરણ:</label>
                        <select id="pmStd" class="gv-input"><option value="ALL">બધા ધોરણ</option>${stds.map(s=>`<option value="${escapeAttr(s)}" ${window.pmSelectedStd === s ? 'selected' : ''}>${escapeAttr(s)}</option>`).join('')}</select>
                    </div>
                    <div><label style="font-size:12px; font-weight:bold;">વિષય:</label>
                        <select id="pmSub" class="gv-input"><option value="ALL">બધા વિષયો</option>${subs.map(s=>`<option value="${escapeAttr(s)}" ${window.pmSelectedSub === s ? 'selected' : ''}>${escapeAttr(s)}</option>`).join('')}</select>
                    </div>
                </div>

                <!-- ✅ અલગ-અલગ પ્રકરણ ટીક કરવાનું બોક્સ -->
                <div style="padding:12px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; margin-bottom:14px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
                        <div style="font-size:13.5px; font-weight:700; color:#1e293b;">
                            📑 પ્રકરણો પસંદ કરો (ટીક કરો): <span style="color:#2563eb;">${window.pmSelectedChapters.length} / ${availChaps.length} પ્રકરણ</span> &nbsp;|&nbsp; <span style="color:#15803d;">${pool.length} પ્રશ્નો ઉપલબ્ધ</span>
                        </div>
                        <div style="display:flex; gap:6px;">
                            <button type="button" class="gv-btn gv-btn-outline" style="padding:4px 10px; font-size:12px;" onclick="window.pmSelectAllChapters(true)">☑️ બધા પસંદ કરો</button>
                            <button type="button" class="gv-btn gv-btn-outline" style="padding:4px 10px; font-size:12px;" onclick="window.pmSelectAllChapters(false)">☐ બધા હટાવો</button>
                        </div>
                    </div>
                    <div style="display:flex; flex-wrap:wrap; gap:7px;">
                        ${chapCheckboxesHTML}
                    </div>
                </div>

                <!-- મોડ સ્વિચર: ઓટો vs મેન્યુઅલ -->
                <div class="gv-subtab-bar">
                    <button type="button" class="gv-subtab-btn ${window.pmActiveMode === 'auto' ? 'active' : ''}" onclick="window.pmActiveMode='auto'; window.renderPaperMaker();">⚡ ઓટો જનરેટ / 🏆 બોર્ડ સ્ટાઈલ</button>
                    <button type="button" class="gv-subtab-btn ${window.pmActiveMode === 'manual' ? 'active' : ''}" onclick="window.pmActiveMode='manual'; window.renderPaperMaker();">✍️ મેન્યુઅલ પ્રશ્નો પસંદ કરો</button>
                </div>

                ${window.pmActiveMode === 'auto' ? `
                    <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; padding:12px; background:#eff6ff; border-radius:8px; border:1px solid #bfdbfe; margin-bottom:12px;">
                        <strong style="font-size:13.5px; color:#1e40af;">⚡ ઓટો પેપર:</strong>
                        <button type="button" class="gv-btn gv-btn-blue" onclick="window.gvAutoPaper(25)">25 ગુણ</button>
                        <button type="button" class="gv-btn gv-btn-purple" onclick="window.gvAutoPaper(50)">50 ગુણ</button>
                        <button type="button" class="gv-btn gv-btn-orange" onclick="window.gvAutoPaper(80)">80 ગુણ</button>
                        <button type="button" class="gv-btn gv-btn-dark" onclick="window.gvAutoPaper(100)">100 ગુણ</button>
                        <div style="display:inline-flex; gap:4px; align-items:center; background:#fff; padding:3px 5px; border-radius:6px; border:1px solid #93c5fd;">
                            <input type="number" id="pmCustomMarks" min="5" max="300" placeholder="કસ્ટમ ગુણ" style="width:92px; padding:5px 6px; border:none; outline:none; font-size:13px; font-weight:bold;">
                            <button type="button" class="gv-btn gv-btn-blue" style="padding:5px 10px; font-size:12px;" onclick="window.gvAutoPaperCustom()">⚡ બનાવો</button>
                        </div>
                    </div>

                    <div style="padding:12px; background:#faf5ff; border-radius:8px; border:1px solid #ddd6fe;">
                        <div style="font-weight:bold; font-size:14px; color:#5b21b6; margin-bottom:8px;">🏆 GSEB બોર્ડની પેપર સ્ટાઈલ મુજબ ડાયરેક્ટ પેપર (ટીક કરેલા પ્રકરણોમાંથી):</div>
                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(215px, 1fr)); gap:8px;">
                            ${boardButtonsHTML}
                        </div>
                    </div>
                ` : manualPickerHTML}
            </div>

            <!-- 📄 ડ્રાફ્ટ પેપર કાર્ડ + લાઈવ પ્રિવ્યૂ -->
            <div class="gv-card" style="border-top:4px solid #16a34a;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                    <div>
                        <h4 style="margin:0 0 4px 0; color:#0f172a;">📄 ડ્રાફ્ટ પેપર (${window.draftPaperQuestions.length} પ્રશ્નો | કુલ <span style="color:#15803d;">${totalDraftMarks} ગુણ</span>)</h4>
                        <div style="display:flex; gap:6px; flex-wrap:wrap;">${secSummaryBadges}</div>
                    </div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button type="button" class="gv-btn gv-btn-teal" onclick="window.previewDraftPaper('question')">👁️ ડ્રાફ્ટ પેપર પ્રિવ્યૂ</button>
                        <button type="button" class="gv-btn gv-btn-purple" onclick="window.previewDraftPaper('solution')">🔑 Answer Key પ્રિવ્યૂ</button>
                        <button type="button" class="gv-btn gv-btn-green" onclick="window.saveDraftPaper()">💾 પેપર સેવ કરો</button>
                        <button type="button" class="gv-btn gv-btn-red" id="btnClearDraft">🗑️ ખાલી કરો</button>
                    </div>
                </div>
                <div id="draftListBox"></div>
            </div>
        `;

        // Bind Paper Details
        box.querySelector('#pmTitle').oninput = (e) => { window.pmTitleVal = e.target.value; };
        box.querySelector('#pmDate').onchange = (e) => { window.pmDateVal = e.target.value; };
        box.querySelector('#pmStd').onchange = (e) => { window.pmSelectedStd = e.target.value; window.pmChaptersInitializedKey = ''; window.renderPaperMaker(); };
        box.querySelector('#pmSub').onchange = (e) => { window.pmSelectedSub = e.target.value; window.pmChaptersInitializedKey = ''; window.renderPaperMaker(); };

        // Bind Manual Picker filters
        if (window.pmActiveMode === 'manual') {
            box.querySelector('#pmManualSecSel').onchange = (e) => { window.pmManualTargetSec = e.target.value; };
            box.querySelector('#pmManualMarksSel').onchange = (e) => { window.pmManualMarks = e.target.value; window.pmManualLimit = 50; window.renderPaperMaker(); };
            box.querySelector('#pmManualTypeSel').onchange = (e) => { window.pmManualType = e.target.value; window.pmManualLimit = 50; window.renderPaperMaker(); };
            box.querySelector('#pmManualInstSel').onchange = (e) => { window.pmManualInst = e.target.value; window.pmManualLimit = 50; window.renderPaperMaker(); };
            box.querySelector('#pmManualSearchInp').oninput = (e) => {
                window.pmManualSearch = e.target.value;
                window.pmManualLimit = 50;
                window.renderPaperMaker();
                const inp = document.getElementById('pmManualSearchInp');
                if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
            };
        }

        // Render Draft List
        const draftList = box.querySelector('#draftListBox');
        if (window.draftPaperQuestions.length === 0) {
            draftList.innerHTML = '<p style="color:#64748b; text-align:center; padding:14px 0;">હજુ કોઈ પ્રશ્ન પસંદ કર્યો નથી. ઉપરથી ઓટો પેપર, બોર્ડ સ્ટાઈલ અથવા મેન્યુઅલ ટેબમાંથી પ્રશ્નો ઉમેરો.</p>';
        } else {
            draftList.innerHTML = window.draftPaperQuestions.map((q, idx) => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 6px; border-bottom:1px solid #e2e8f0; gap:8px; flex-wrap:wrap;">
                    <div style="flex:1; min-width:220px; font-size:13.5px; line-height:1.6;">
                        <strong>${idx + 1}.</strong>
                        <span style="color:#1d4ed8; font-size:11.5px; font-weight:700;">[પ્ર.${escapeAttr(q.chapter || '-')}]</span>
                        ${window.formatScienceAndMath(q.text || '').substring(0, 115)}${(q.text || '').length > 115 ? '...' : ''}
                        <span style="color:#15803d; font-weight:bold;">[${q.marks} ગુણ]</span>
                    </div>
                    <div style="display:flex; gap:4px; align-items:center;">
                        <select onchange="window.pmChangeDraftSection(${idx}, this.value)" style="padding:3px 5px; border:1px solid #cbd5e1; border-radius:4px; font-size:12px; font-weight:bold; color:#5b21b6;">
                            ${['A','B','C','D','E','None'].map(s => `<option value="${s}" ${(q.section || 'A') === s ? 'selected' : ''}>${s === 'None' ? 'વિભાગ-' : 'વિભાગ ' + s}</option>`).join('')}
                        </select>
                        <button type="button" class="gv-btn gv-btn-outline" style="padding:3px 6px; font-size:11px;" onclick="window.pmMoveDraft(${idx}, -1)">⬆️</button>
                        <button type="button" class="gv-btn gv-btn-outline" style="padding:3px 6px; font-size:11px;" onclick="window.pmMoveDraft(${idx}, 1)">⬇️</button>
                        <button type="button" class="gv-btn gv-btn-red" style="padding:3px 7px; font-size:11px;" onclick="window.draftPaperQuestions.splice(${idx},1); window.renderPaperMaker();">✖</button>
                    </div>
                </div>`).join('');
        }

        box.querySelector('#btnClearDraft').onclick = () => {
            if (window.draftPaperQuestions.length === 0) return;
            window.customConfirm('શું ડ્રાફ્ટ પેપરના બધા પ્રશ્નો હટાવવા છે?', () => {
                window.draftPaperQuestions = [];
                window.draftPaperMeta = {};
                window.renderPaperMaker();
            });
        };
    };

    // ==========================================
    // 📂 13. SAVED PAPERS & SETTINGS RENDERERS
    // ==========================================
    window.previewSavedPaper = function(pid) {
        const p = getAllPapers().find(x => x.id === pid);
        if (p) window.openPaperPreviewModal(p, 'question', false);
    };

    window.loadSavedPaperIntoDraft = function(pid) {
        const p = getAllPapers().find(x => x.id === pid);
        if (!p) return;
        window.draftPaperQuestions = JSON.parse(JSON.stringify(p.questions || []));
        window.draftPaperMeta = JSON.parse(JSON.stringify(p.sectionsMetadata || {}));
        window.pmTitleVal = p.title || 'પ્રશ્નપત્ર';
        window.pmDateVal = p.date || new Date().toISOString().split('T')[0];
        window.showToast('✏️ પેપર એડિટ કરવા માટે ડ્રાફ્ટમાં લોડ થઈ ગયું!');
        window.switchTab('maker');
    };

    window.renderSavedPapers = function() {
        const box = document.getElementById('gvSavedPapersContainer');
        if (!box) return;
        const papers = getAllPapers();
        if (papers.length === 0) {
            box.innerHTML = '<div class="gv-card" style="text-align:center; color:#64748b;">હજુ સુધી કોઈ પેપર સેવ કરેલ નથી.</div>';
            return;
        }
        box.innerHTML = papers.map(p => `
            <div class="gv-card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <div>
                    <div style="font-weight:bold; font-size:16px; color:#1e3a8a;">${escapeAttr(p.title)}</div>
                    <div style="font-size:13px; color:#475569;">ધોરણ: ${escapeAttr(p.standard || '-')} | વિષય: ${escapeAttr(p.subject || '-')} | તારીખ: ${escapeAttr(p.date || '-')} | કુલ ગુણ: <strong>${p.totalMarks}</strong> | પ્રશ્નો: ${(p.questions || []).length}</div>
                </div>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <button class="gv-btn gv-btn-teal" onclick="window.previewSavedPaper('${p.id}')">👁️ પ્રિવ્યૂ</button>
                    <button class="gv-btn gv-btn-orange" onclick="window.loadSavedPaperIntoDraft('${p.id}')">✏️ એડિટ</button>
                    <button class="gv-btn gv-btn-blue" onclick="window.downloadPDF('${p.id}', 'question')">📄 PDF</button>
                    <button class="gv-btn gv-btn-green" onclick="window.downloadPDF('${p.id}', 'solution')">🔑 Answer Key</button>
                    <button class="gv-btn gv-btn-purple" onclick="window.downloadWord('${p.id}', 'question')">📝 Word</button>
                    <button class="gv-btn gv-btn-red" onclick="window.deleteSavedPaper('${p.id}')">🗑️</button>
                </div>
            </div>`).join('');
    };

    window.deleteSavedPaper = function(pid) {
        window.customConfirm("શું આ સેવ કરેલું પેપર ડીલીટ કરવું છે?", () => {
            saveAllPapers(getAllPapers().filter(p => p.id !== pid));
            window.renderSavedPapers();
            window.renderDashboard();
        });
    };

    window.renderSettings = function() {
        const box = document.getElementById('gvSettingsContainer');
        if (!box) return;
        const school = JSON.parse(localStorage.getItem('gyanVruksh_schoolProfile')) || { name: 'જ્ઞાન વૃક્ષ વિદ્યાલય', address: '' };
        const pdfSet = JSON.parse(localStorage.getItem('gyanVruksh_pdfSettings')) || { examName: true, date: true, std: true, subject: true, marks: true, numbering: 'continuous', watermark: '' };

        box.innerHTML = `
            <div class="gv-card">
                <h3 style="margin:0 0 12px 0; color:#1e3a8a;">🏫 શાળા પ્રોફાઈલ અને PDF સેટિંગ્સ</h3>
                <div class="gv-grid-2" style="margin-bottom:12px;">
                    <div><label style="font-size:12px; font-weight:bold;">શાળા / ક્લાસીસનું નામ:</label><input id="setSchoolName" class="gv-input" value="${escapeAttr(school.name)}"></div>
                    <div><label style="font-size:12px; font-weight:bold;">સરનામું:</label><input id="setSchoolAddr" class="gv-input" value="${escapeAttr(school.address)}"></div>
                    <div><label style="font-size:12px; font-weight:bold;">વોટરમાર્ક (Watermark):</label><input id="setWatermark" class="gv-input" value="${escapeAttr(pdfSet.watermark)}" placeholder="દા.ત. GYAN VRUKSH"></div>
                    <div><label style="font-size:12px; font-weight:bold;">પ્રશ્ન ક્રમાંક:</label>
                        <select id="setNumbering" class="gv-input">
                            <option value="continuous" ${pdfSet.numbering === 'continuous' ? 'selected' : ''}>સળંગ (1, 2, 3...)</option>
                            <option value="section" ${pdfSet.numbering === 'section' ? 'selected' : ''}>વિભાગ મુજબ (દરેક વિભાગમાં 1 થી)</option>
                        </select>
                    </div>
                </div>
                <div style="display:flex; gap:14px; flex-wrap:wrap; margin-bottom:14px; font-size:13.5px; font-weight:600; color:#334155;">
                    <label><input type="checkbox" id="chkExamName" ${pdfSet.examName !== false ? 'checked' : ''}> પરીક્ષાનું નામ</label>
                    <label><input type="checkbox" id="chkStd" ${pdfSet.std !== false ? 'checked' : ''}> ધોરણ</label>
                    <label><input type="checkbox" id="chkSub" ${pdfSet.subject !== false ? 'checked' : ''}> વિષય</label>
                    <label><input type="checkbox" id="chkDate" ${pdfSet.date !== false ? 'checked' : ''}> તારીખ</label>
                    <label><input type="checkbox" id="chkMarks" ${pdfSet.marks !== false ? 'checked' : ''}> કુલ ગુણ</label>
                </div>
                <button class="gv-btn gv-btn-green" id="btnSaveSettings">💾 સેટિંગ્સ સેવ કરો</button>
            </div>`;
        box.querySelector('#btnSaveSettings').onclick = () => {
            localStorage.setItem('gyanVruksh_schoolProfile', JSON.stringify({
                name: box.querySelector('#setSchoolName').value.trim() || 'શાળા',
                address: box.querySelector('#setSchoolAddr').value.trim()
            }));
            localStorage.setItem('gyanVruksh_pdfSettings', JSON.stringify({
                examName: box.querySelector('#chkExamName').checked,
                std: box.querySelector('#chkStd').checked,
                subject: box.querySelector('#chkSub').checked,
                date: box.querySelector('#chkDate').checked,
                marks: box.querySelector('#chkMarks').checked,
                watermark: box.querySelector('#setWatermark').value.trim(),
                numbering: box.querySelector('#setNumbering').value
            }));
            window.showToast("✅ શાળા પ્રોફાઈલ અને સેટિંગ્સ સેવ થઈ ગયા!");
            window.renderDashboard();
        };
    };

    // ==========================================
    // 🏗️ 14. NAVIGATION & APP BOOTSTRAPPER
    // ==========================================
    window.switchTab = function(tabName) {
        window.activeTab = tabName;
        ['dashboard', 'bank', 'maker', 'papers', 'settings'].forEach(t => {
            const sec = document.getElementById('gvTab_' + t);
            const btn = document.getElementById('gvTabBtn_' + t);
            if (sec) sec.style.display = (t === tabName) ? 'block' : 'none';
            if (btn) btn.classList.toggle('active', t === tabName);
        });
        if (tabName === 'dashboard') window.renderDashboard();
        if (tabName === 'bank') window.renderQuestions();
        if (tabName === 'maker') window.renderPaperMaker();
        if (tabName === 'papers') window.renderSavedPapers();
        if (tabName === 'settings') window.renderSettings();
    };

    window.renderApp = function() {
        try {
            injectStyles();
            ensureQuestionModal();

            if (!document.getElementById('gvDashboardContainer')) {
                const root = document.getElementById('app') || document.getElementById('root') || document.getElementById('gvApp') || document.body;
                root.innerHTML = `
                    <div class="gv-header">
                        <h1>🌳 Gyan Vruksh — Smart Paper Generator</h1>
                        <div style="font-size:13px; opacity:0.95;">ધોરણ 9 થી 12 • મલ્ટી-સબ્જેક્ટ • ઓટો & મેન્યુઅલ પેપર</div>
                    </div>
                    <div class="gv-tabs">
                        <button id="gvTabBtn_dashboard" class="gv-tab-btn active" onclick="window.switchTab('dashboard')">📊 ડેશબોર્ડ</button>
                        <button id="gvTabBtn_bank" class="gv-tab-btn" onclick="window.switchTab('bank')">📚 પ્રશ્ન બેંક</button>
                        <button id="gvTabBtn_maker" class="gv-tab-btn" onclick="window.switchTab('maker')">📝 પેપર બનાવો</button>
                        <button id="gvTabBtn_papers" class="gv-tab-btn" onclick="window.switchTab('papers')">📂 સેવ કરેલા પેપર</button>
                        <button id="gvTabBtn_settings" class="gv-tab-btn" onclick="window.switchTab('settings')">🏫 શાળા પ્રોફાઈલ</button>
                    </div>
                    <div class="gv-container">
                        <div id="gvTab_dashboard"><div id="gvDashboardContainer"></div></div>
                        <div id="gvTab_bank" style="display:none;"><div id="questionListContainer"></div></div>
                        <div id="gvTab_maker" style="display:none;"><div id="gvPaperMakerContainer"></div></div>
                        <div id="gvTab_papers" style="display:none;"><div id="gvSavedPapersContainer"></div></div>
                        <div id="gvTab_settings" style="display:none;"><div id="gvSettingsContainer"></div></div>
                    </div>`;
            }

            window.refreshData();
        } catch (err) {
            console.error('Gyan Vruksh Boot Error:', err);
            const errDiv = document.createElement('div');
            errDiv.style.cssText = 'margin:20px; padding:16px; background:#fee2e2; border:2px solid #dc2626; color:#991b1b; border-radius:8px; font-family:sans-serif;';
            errDiv.innerHTML = `<strong>⚠️ એપ લોડ કરવામાં ભૂલ આવી:</strong><br>${err.message}`;
            document.body.prepend(errDiv);
        }
    };

    window.updateDynamicFilters = function() {
        window.updateInstructionDatalist();
    };

    window.refreshData = function() {
        window.updateInstructionDatalist();
        if (window.activeTab === 'dashboard') window.renderDashboard();
        if (window.activeTab === 'bank') window.renderQuestions();
        if (window.activeTab === 'maker') window.renderPaperMaker();
        if (window.activeTab === 'papers') window.renderSavedPapers();
        if (window.activeTab === 'settings') window.renderSettings();
    };

    function bootApp() {
        window.renderApp();
        window.syncOnlineQuestions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootApp);
    } else {
        bootApp();
    }
})();
