// js/question-bank.js — Gyan Vruksh 3.1 (GitHub Multi-Subject data/catalog.json + Online Library + Filtered Subject Export + All Features)

(function() {
    // ==========================================
    // 🌐 1. DEFAULT INSTRUCTIONS, BOARD ORDER & EXTRA OBJECTIVE SUB-TYPES
    // ==========================================
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

    // GSEB બોર્ડ બ્લુપ્રિન્ટ મુજબ વિભાગ-A નો સત્તાવાર ક્રમ
    window.BOARD_SECTION_A_ORDER = [
        'MCQ',
        'ખાલી જગ્યા',
        'વિકલ્પ સાથે ખાલી જગ્યા',
        'ખરા-ખોટા',
        'જોડકા જોડો',
        'એક વાક્યમાં જવાબ આપો',
        'એક શબ્દમાં ઉત્તર',
        'વ્યાખ્યા આપો',
        'સૂત્ર / એકમ લખો',
        'પૂરું નામ લખો',
        'અસંગત પદ શોધો',
        'સંબંધ પૂર્ણ કરો',
        'આકૃતિ ઓળખો',
        'વિધાન અને કારણ',
        'સમાનાર્થી / વિરુદ્ધાર્થી',
        'જોડણી સુધારો',
        'રૂઢિપ્રયોગ',
        'Do as directed',
        'Identify the function'
    ];

    window.onlineCatalog = [];

    function getAllQuestions() {
        try { return JSON.parse(localStorage.getItem('gyanVruksh_questions')) || []; } catch (e) { return []; }
    }
    function saveAllQuestions(arr) {
        localStorage.setItem('gyanVruksh_questions', JSON.stringify(arr || []));
    }
    function getAllPapers() {
        try { return JSON.parse(localStorage.getItem('gyanVruksh_papers')) || []; } catch (e) { return []; }
    }
    function saveAllPapers(arr) {
        localStorage.setItem('gyanVruksh_papers', JSON.stringify(arr || []));
    }
    function getCustomBlueprints() {
        try { return JSON.parse(localStorage.getItem('gyanVruksh_customBlueprints')) || []; } catch (e) { return []; }
    }
    function saveCustomBlueprints(arr) {
        localStorage.setItem('gyanVruksh_customBlueprints', JSON.stringify(arr || []));
    }

    function escapeAttr(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function escapeJsArg(str) {
        return String(str || '')
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '&quot;')
            .replace(/\r?\n/g, ' ');
    }

    window.getCustomObjectiveSubtypes = function() {
        try { return JSON.parse(localStorage.getItem('gyanVruksh_customSubtypes')) || []; } catch (e) { return []; }
    };
    window.saveCustomObjectiveSubtypes = function(arr) {
        localStorage.setItem('gyanVruksh_customSubtypes', JSON.stringify(arr || []));
    };

    window.getCustomSectionAOrder = function() {
        try { return JSON.parse(localStorage.getItem('gyanVruksh_secAOrder')) || []; } catch (e) { return []; }
    };
    window.saveCustomSectionAOrder = function(arr) {
        localStorage.setItem('gyanVruksh_secAOrder', JSON.stringify(arr || []));
    };

    window.getObjectiveTypePriority = function(typeName) {
        const t = String(typeName || '').trim();
        const customOrder = window.getCustomSectionAOrder();
        if (customOrder.length > 0) {
            const cIdx = customOrder.indexOf(t);
            if (cIdx !== -1) return cIdx;
        }
        const bIdx = window.BOARD_SECTION_A_ORDER.indexOf(t);
        if (bIdx !== -1) return 100 + bIdx;
        const customSubs = window.getCustomObjectiveSubtypes();
        const csIdx = customSubs.findIndex(x => x.type === t);
        if (csIdx !== -1) return 300 + csIdx;
        return 500;
    };

    window.isObjectiveQuestion = function(q) {
        if (!q || q.type === 'instruction' || q.type === 'auto_instruction') return false;
        const m = Number(q.marks) || 1;
        const t = String(q.type || '').trim();
        if (m === 1) return true;
        if (t === 'જોડકા જોડો' || t.toLowerCase().includes('match')) return true;
        if (window.BOARD_SECTION_A_ORDER.includes(t)) return true;
        if (window.getCustomObjectiveSubtypes().some(x => x.type === t)) return true;
        return false;
    };

    window.getEffectiveInstruction = function(q) {
        if (!q) return '';
        if (q.instruction && String(q.instruction).trim() !== '') {
            return String(q.instruction).trim();
        }
        const customMatch = window.getCustomObjectiveSubtypes().find(x => x.type === q.type);
        if (customMatch && customMatch.instruction) return customMatch.instruction;
        return window.DEFAULT_INSTRUCTIONS[q.type] || (q.type ? `${q.type}:` : '');
    };

    window.sortSectionAQuestions = function(list) {
        return (list || []).slice().sort((a, b) => {
            const pa = window.getObjectiveTypePriority(a.type);
            const pb = window.getObjectiveTypePriority(b.type);
            if (pa !== pb) return pa - pb;
            const ia = window.getEffectiveInstruction(a);
            const ib = window.getEffectiveInstruction(b);
            return ia.localeCompare(ib);
        });
    };

    window.updateInstructionDatalist = function() {
        const dl = document.getElementById('gvInstructionSuggestions');
        if (!dl) return;
        const set = new Set(Object.values(window.DEFAULT_INSTRUCTIONS || {}));
        window.getCustomObjectiveSubtypes().forEach(x => {
            if (x && x.instruction) set.add(String(x.instruction).trim());
        });
        getAllQuestions().forEach(q => {
            const inst = window.getEffectiveInstruction(q);
            if (inst) set.add(inst);
        });
        dl.innerHTML = Array.from(set).filter(Boolean).map(i => `<option value="${escapeAttr(i)}"></option>`).join('');
    };
    window.updateInstructionDetail = window.updateInstructionDatalist;
    window.updateInstructionDetails = window.updateInstructionDatalist;
    window.updateDynamicFilters = window.updateInstructionDatalist;

    // ==========================================
    // 🖼️ IMAGE COMPRESSION HELPER (LocalStorage Safe)
    // ==========================================
    window.compressImageFileToDataURL = function(file, maxWidth = 760, quality = 0.82) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                return reject(new Error('કૃપા કરીને યોગ્ય ઈમેજ ફાઈલ (JPG/PNG/WebP) પસંદ કરો.'));
            }
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('ઈમેજ વાંચવામાં ભૂલ આવી.'));
            reader.onload = (ev) => {
                const img = new Image();
                img.onerror = () => reject(new Error('ઈમેજ લોડ થઈ શકી નહીં.'));
                img.onload = () => {
                    let w = img.width;
                    let h = img.height;
                    if (w > maxWidth) {
                        h = Math.round((h * maxWidth) / w);
                        w = maxWidth;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, w, h);
                    ctx.drawImage(img, 0, 0, w, h);
                    const outType = (file.type === 'image/png' && file.size < 180000) ? 'image/png' : 'image/jpeg';
                    resolve(canvas.toDataURL(outType, quality));
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

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
            .gv-preview-sheet .sec-instruction, .gv-preview-sheet .auto-inst-bar { font-size: 14px; font-weight: bold; margin: 10px 0 6px 0; padding: 3px 0; border-bottom: 1px dotted #94a3b8; display: flex; justify-content: space-between; gap: 8px; }
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

            /* Section Option Grid (Responsive) */
            .gv-sec-opt-row { background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; align-items: center; }

            /* Question & Solution Images */
            .gv-img-upload-box { background: #f8fafc; border: 1.5px dashed #94a3b8; border-radius: 8px; padding: 10px; margin-bottom: 10px; }
            .gv-img-preview-wrap { margin-top: 8px; padding: 8px; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; text-align: center; }
            .gv-img-preview-wrap img { max-height: 150px; max-width: 100%; border-radius: 4px; display: inline-block; }
            .gv-card-img { display: block; max-width: 100%; max-height: 180px; border: 1px solid #cbd5e1; border-radius: 6px; margin-top: 8px; padding: 3px; background: #fff; }
            .gv-preview-sheet .gv-paper-img-wrap { margin: 7px 0; }
            .gv-preview-sheet .gv-paper-img-wrap img { max-width: 100%; height: auto; border-radius: 3px; display: inline-block; }
            .gv-mixer-row { display: grid; grid-template-columns: 1.6fr 90px 100px auto; gap: 8px; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 10px; }
            @media (max-width: 600px) { .gv-mixer-row { grid-template-columns: 1fr 1fr; } }
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
    // 💾 4. GLOBAL STATE, NOTIFICATIONS & EFFECTIVE MARKS CALCULATORS
    // ==========================================
    window.activeTab = 'dashboard';
    window.draftPaperQuestions = [];
    window.draftPaperMeta = {};
    window.pmTitleVal = 'એકમ કસોટી';
    window.pmDateVal = new Date().toISOString().split('T')[0];
    window.pmSelectedStd = 'ALL';
    window.pmSelectedSub = 'ALL';
    window.pmSelectedChapters = [];
    window.pmChaptersInitializedKey = '';
    window.pmActiveMode = 'auto';
    window.pmManualTargetSec = 'A';
    window.pmManualType = 'ALL';
    window.pmManualInst = 'ALL';
    window.pmManualMarks = 'ALL';
    window.pmManualSearch = '';
    window.pmManualLimit = 50;

    window.currentStdFilter = 'ALL';
    window.currentSubFilter = 'ALL';
    window.currentChapFilter = 'ALL';
    window.currentTypeFilter = 'ALL';
    window.currentInstFilter = 'ALL';
    window.currentSearchQuery = '';
    window.hideAnswersMode = false;
    window.bankVisibleLimit = 60;
    window.editingQuestionId = null;

    window.showToast = function(msg, type = 'success') {
        let toast = document.getElementById('gvToastBar');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'gvToastBar';
            toast.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); padding:10px 18px; border-radius:8px; color:#fff; font-weight:700; font-size:13.5px; z-index:999999; box-shadow:0 6px 20px rgba(0,0,0,0.28); max-width:92vw; text-align:center; transition:opacity 0.25s;';
            document.body.appendChild(toast);
        }
        toast.style.background = type === 'error' ? '#dc2626' : '#15803d';
        toast.textContent = msg;
        toast.style.opacity = '1';
        toast.style.display = 'block';
        clearTimeout(window._gvToastTimer);
        window._gvToastTimer = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.style.display = 'none'; }, 260);
        }, 3200);
    };

    window.customConfirm = function(message, onConfirm) {
        const old = document.getElementById('gvConfirmModal');
        if (old) old.remove();
        const overlay = document.createElement('div');
        overlay.id = 'gvConfirmModal';
        overlay.className = 'gv-modal-overlay';
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="gv-modal-box" style="max-width:420px; text-align:center;">
                <h3 style="margin:0 0 10px 0; color:#b91c1c;">⚠️ પુષ્ટિ કરો</h3>
                <p style="font-size:14.5px; color:#334155; margin:0 0 18px 0; line-height:1.6;">${escapeAttr(message)}</p>
                <div style="display:flex; gap:10px; justify-content:center;">
                    <button type="button" id="gvConfNo" class="gv-btn gv-btn-dark">ના, રદ કરો</button>
                    <button type="button" id="gvConfYes" class="gv-btn gv-btn-red">હા, ખાતરી છે</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.querySelector('#gvConfNo').onclick = () => overlay.remove();
        overlay.querySelector('#gvConfYes').onclick = () => {
            overlay.remove();
            if (typeof onConfirm === 'function') onConfirm();
        };
    };

    window.calculateSectionEffectiveMarks = function(secQuestions, secMeta) {
        const realQs = (secQuestions || []).filter(q => q && q.type !== 'instruction' && q.type !== 'auto_instruction');
        if (realQs.length === 0) return 0;
        const attNum = secMeta && Number(secMeta.attemptCount) > 0 ? Number(secMeta.attemptCount) : 0;
        if (attNum > 0 && attNum < realQs.length) {
            return realQs.slice(0, attNum).reduce((s, q) => s + (Number(q.marks) || 0), 0);
        }
        return realQs.reduce((s, q) => s + (Number(q.marks) || 0), 0);
    };

    window.calculatePaperTotalMarks = function(questions, sectionsMetadata) {
        const sMeta = sectionsMetadata || {};
        const groups = {};
        (questions || []).forEach(q => {
            if (!q || q.type === 'instruction' || q.type === 'auto_instruction') return;
            const sec = q.section || 'None';
            if (!groups[sec]) groups[sec] = [];
            groups[sec].push(q);
        });
        return Object.keys(groups).reduce((total, sec) => {
            return total + window.calculateSectionEffectiveMarks(groups[sec], sMeta[sec]);
        }, 0);
    };

    window.updateDraftSectionMeta = function(sec, field, value, shouldReRender = false) {
        if (!window.draftPaperMeta) window.draftPaperMeta = {};
        if (!window.draftPaperMeta[sec]) window.draftPaperMeta[sec] = { instruction: '', attempt: '', attemptCount: 0 };

        if (field === 'attemptCount') {
            const n = parseInt(value, 10) || 0;
            const secCount = window.draftPaperQuestions.filter(q => (q.section || 'None') === sec && q.type !== 'instruction').length;
            if (n > 0 && n < secCount) {
                window.draftPaperMeta[sec].attemptCount = n;
                window.draftPaperMeta[sec].attempt = `કોઈ પણ ${n}`;
            } else {
                window.draftPaperMeta[sec].attemptCount = 0;
                window.draftPaperMeta[sec].attempt = '';
            }
        } else {
            window.draftPaperMeta[sec][field] = String(value || '').trim();
        }
        if (shouldReRender) window.renderPaperMaker();
    };

    window.gvAutoPaperCustom = function() {
        const inp = document.getElementById('pmCustomMarksInput');
        const val = inp ? parseInt(inp.value, 10) : 0;
        if (!val || val < 5 || val > 200) {
            return window.showToast('કૃપા કરીને 5 થી 200 વચ્ચેના યોગ્ય ગુણ દાખલ કરો!', 'error');
        }
        window.gvAutoPaper(val);
    };

    // ==========================================
    // 📥 5. JSON IMPORT, PASTE, FILTERED BACKUP, CLEAR & GITHUB MODULAR LIBRARY SYNC
    // ==========================================
    function normalizeQuestionItem(item, idx) {
        return {
            id: item.id || ('Q_IMP_' + Date.now() + '_' + idx),
            standard: String(item.standard || '10'),
            subject: String(item.subject || 'વિજ્ઞાન'),
            chapter: String(item.chapter || '1'),
            type: String(item.type || 'MCQ'),
            marks: Number(item.marks) || 1,
            lang: item.lang || 'gu',
            instruction: item.instruction || '',
            text: item.text || '',
            answer: item.answer || '',
            image: item.image || '',
            imageWidth: item.imageWidth || '220px',
            imageAlign: item.imageAlign || 'center',
            solutionImage: item.solutionImage || '',
            solutionImageWidth: item.solutionImageWidth || '240px',
            solutionImageAlign: item.solutionImageAlign || 'left'
        };
    }

    window.mergeQuestionsArray = function(parsed, replaceAll = false) {
        if (!Array.isArray(parsed)) return { added: 0, updated: 0, ok: false };
        const existing = replaceAll ? [] : getAllQuestions();
        const idIndexMap = new Map();
        existing.forEach((q, i) => { if (q && q.id) idIndexMap.set(q.id, i); });

        let added = 0, updated = 0;
        parsed.forEach((item, idx) => {
            if (!item || (!item.text && !item.image)) return;
            const norm = normalizeQuestionItem(item, idx);
            if (idIndexMap.has(norm.id)) {
                const pos = idIndexMap.get(norm.id);
                existing[pos] = { ...existing[pos], ...norm };
                updated++;
            } else {
                idIndexMap.set(norm.id, existing.length);
                existing.push(norm);
                added++;
            }
        });

        try {
            saveAllQuestions(existing);
            window.pmChaptersInitializedKey = '';
            return { added, updated, ok: true };
        } catch (storageErr) {
            window.showToast('⚠️ સ્ટોરેજ મર્યાદા પૂર્ણ થઈ છે! "ઓનલાઈન લાઈબ્રેરી" માંથી "🔄 ફક્ત આ વિષય લોડ કરો" વિકલ્પ વાપરો.', 'error');
            return { added: 0, updated: 0, ok: false };
        }
    };

    window.parseAndMergeQuestionsJSON = function(rawText) {
        if (!rawText || !String(rawText).trim()) {
            return window.showToast('JSON ડેટા ખાલી છે!', 'error');
        }
        let cleaned = String(rawText).trim()
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();

        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch (err) {
            return window.showToast('❌ JSON ફોર્મેટમાં ભૂલ છે: ' + err.message, 'error');
        }

        if (!Array.isArray(parsed)) {
            if (parsed && Array.isArray(parsed.questions)) parsed = parsed.questions;
            else return window.showToast('JSON ડેટા Array ([...]) સ્વરૂપમાં હોવો જોઈએ!', 'error');
        }

        const res = window.mergeQuestionsArray(parsed, false);
        if (!res.ok) return;
        window.showToast(`✅ સફળતાપૂર્વક ${res.added} નવા પ્રશ્નો ઉમેરાયા અને ${res.updated} અપડેટ થયા!`);
        window.refreshData();
    };

    window.triggerImport = function(e) {
        if (e) e.preventDefault();
        let fileInp = document.getElementById('gvHiddenJsonFileInput');
        if (!fileInp) {
            fileInp = document.createElement('input');
            fileInp.type = 'file';
            fileInp.id = 'gvHiddenJsonFileInput';
            fileInp.accept = '.json,application/json';
            fileInp.style.display = 'none';
            document.body.appendChild(fileInp);
        }
        fileInp.value = '';
        fileInp.onchange = (ev) => {
            const file = ev.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (re) => window.parseAndMergeQuestionsJSON(re.target.result);
            reader.onerror = () => window.showToast('ફાઈલ વાંચવામાં ભૂલ આવી.', 'error');
            reader.readAsText(file, 'UTF-8');
        };
        fileInp.click();
    };

    window.openPasteJSONModal = function(e) {
        if (e) e.preventDefault();
        const old = document.getElementById('gvPasteJsonModal');
        if (old) old.remove();
        const overlay = document.createElement('div');
        overlay.id = 'gvPasteJsonModal';
        overlay.className = 'gv-modal-overlay';
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="gv-modal-box">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:8px; margin-bottom:10px;">
                    <h3 style="margin:0; color:#5b21b6;">📋 JSON પ્રશ્ન બેંક પેસ્ટ કરો</h3>
                    <button type="button" id="gvPasteClose" style="border:none; background:#fee2e2; color:#b91c1c; font-weight:bold; padding:4px 10px; border-radius:6px; cursor:pointer;">✖</button>
                </div>
                <textarea id="gvPasteTextarea" rows="10" class="gv-input" placeholder='અહીં [{"id":"Q_1", ...}] JSON કોડ પેસ્ટ કરો...'></textarea>
                <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
                    <button type="button" id="gvPasteCancel" class="gv-btn gv-btn-dark">રદ કરો</button>
                    <button type="button" id="gvPasteImportBtn" class="gv-btn gv-btn-green">📥 ઈમ્પોર્ટ કરો</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        const close = () => overlay.remove();
        overlay.querySelector('#gvPasteClose').onclick = close;
        overlay.querySelector('#gvPasteCancel').onclick = close;
        overlay.querySelector('#gvPasteImportBtn').onclick = () => {
            const val = overlay.querySelector('#gvPasteTextarea').value;
            close();
            window.parseAndMergeQuestionsJSON(val);
        };
    };

    function getCleanSubjectSlug(subName) {
        const s = String(subName || '').trim().toLowerCase();
        if (s.includes('ગણિત') || s.includes('math')) return 'maths';
        if (s.includes('વિજ્ઞાન') || s.includes('sci')) return 'science';
        if (s.includes('સામાજિક') || s.includes('social')) return 'ss';
        if (s.includes('ગુજરાતી') || s.includes('guj')) return 'gujarati';
        if (s.includes('અંગ્રેજી') || s.includes('eng')) return 'english';
        if (s.includes('હિન્દી') || s.includes('hin')) return 'hindi';
        if (s.includes('સંસ્કૃત') || s.includes('sans')) return 'sanskrit';
        return s.replace(/[^a-z0-9]+/g, '_') || 'subject';
    }

    window.exportQuestionBank = function(onlyFiltered = false) {
        const allQ = getAllQuestions();
        let dataToExport = allQ;
        let fileName = `gyanvruksh_questions_backup_${new Date().toISOString().split('T')[0]}.json`;

        if (onlyFiltered) {
            dataToExport = allQ.filter(q => {
                const okStd = window.currentStdFilter === 'ALL' || String(q.standard) === window.currentStdFilter;
                const okSub = window.currentSubFilter === 'ALL' || String(q.subject) === window.currentSubFilter;
                const okChap = window.currentChapFilter === 'ALL' || String(q.chapter) === window.currentChapFilter;
                return okStd && okSub && okChap;
            });
            const stdPart = window.currentStdFilter !== 'ALL' ? `std${window.currentStdFilter}` : 'allstd';
            const subPart = window.currentSubFilter !== 'ALL' ? getCleanSubjectSlug(window.currentSubFilter) : 'allsub';
            const chapPart = window.currentChapFilter !== 'ALL' ? `_ch${window.currentChapFilter}` : '';
            fileName = `${stdPart}_${subPart}${chapPart}.json`;
        }

        if (dataToExport.length === 0) return window.showToast('બેકઅપ લેવા માટે કોઈ પ્રશ્ન ઉપલબ્ધ નથી!', 'error');
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        window.showToast(`💾 ${dataToExport.length} પ્રશ્નોની ફાઈલ (${fileName}) ડાઉનલોડ થઈ ગઈ!`);
    };

    window.clearQuestionBank = function() {
        window.customConfirm('શું તમે આખી પ્રશ્ન બેંક ખાલી કરવા માંગો છો? (પહેલા બેકઅપ લઈ લેજો!)', () => {
            saveAllQuestions([]);
            window.pmChaptersInitializedKey = '';
            window.showToast('🗑️ પ્રશ્ન બેંક ખાલી થઈ ગઈ.');
            window.refreshData();
        });
    };

    // ☁️ GitHub data/catalog.json & Legacy questions.json Auto-Sync
    window.fetchOnlineCatalog = async function() {
        try {
            const res = await fetch('./data/catalog.json?v=' + Date.now(), { cache: 'no-store' });
            if (!res.ok) return [];
            const data = await res.json();
            if (Array.isArray(data)) {
                window.onlineCatalog = data;
                return data;
            }
        } catch (err) {
            // ઓફલાઈન અથવા catalog.json ન હોય તો શાંતિથી અવગણવું
        }
        return window.onlineCatalog || [];
    };

    window.loadOnlineSubjectPack = async function(packId, replaceAll = false, silent = false) {
        const pack = (window.onlineCatalog || []).find(p => p.id === packId);
        if (!pack || !pack.file) {
            if (!silent) window.showToast('આ વિષયની ફાઈલ કેટલોગમાં મળી નથી.', 'error');
            return 0;
        }
        try {
            if (!silent) window.showToast(`⏳ ${pack.title || pack.subject} ડાઉનલોડ થઈ રહ્યું છે...`);
            const fileUrl = pack.file.startsWith('http') || pack.file.startsWith('./') ? pack.file : ('./' + pack.file);
            const res = await fetch(fileUrl + '?v=' + Date.now(), { cache: 'no-store' });
            if (!res.ok) {
                if (!silent) window.showToast(`❌ ફાઈલ મળી નથી: ${pack.file} (GitHub માં અપલોડ થયું છે કે નહીં તે ચકાસો)`, 'error');
                return 0;
            }
            const json = await res.json();
            const arr = Array.isArray(json) ? json : (json && Array.isArray(json.questions) ? json.questions : []);
            const result = window.mergeQuestionsArray(arr, replaceAll);
            if (!result.ok) return 0;

            if (!silent) {
                window.showToast(`☁️ ${pack.title || pack.subject}: ${result.added} નવા ઉમેરાયા, ${result.updated} અપડેટ થયા!`);
                window.refreshData();
                const libOverlay = document.getElementById('gvOnlineLibModal');
                if (libOverlay) window.openOnlineLibraryModal();
            }
            return result.added;
        } catch (err) {
            if (!silent) window.showToast('❌ ઓનલાઈન ફાઈલ લોડ કરવામાં ભૂલ આવી: ' + err.message, 'error');
            return 0;
        }
    };

    window.openOnlineLibraryModal = async function() {
        const old = document.getElementById('gvOnlineLibModal');
        if (old) old.remove();

        const overlay = document.createElement('div');
        overlay.id = 'gvOnlineLibModal';
        overlay.className = 'gv-modal-overlay';
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="gv-modal-box" style="max-width:740px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:10px; margin-bottom:12px;">
                    <h3 style="margin:0; color:#1e3a8a;">☁️ ઓનલાઈન વિષય લાઈબ્રેરી (GitHub data/ ફોલ્ડર)</h3>
                    <button type="button" id="olCloseBtn" style="border:none; background:#fee2e2; color:#b91c1c; font-weight:bold; padding:4px 10px; border-radius:6px; cursor:pointer;">✖</button>
                </div>
                <div id="olContentBox" style="text-align:center; padding:20px; color:#475569;">⏳ GitHub પરથી વિષયોની યાદી લોડ થઈ રહી છે...</div>
                <div style="display:flex; justify-content:flex-end; margin-top:12px;">
                    <button type="button" id="olCancelBtn" class="gv-btn gv-btn-dark">બંધ કરો</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        const close = () => overlay.remove();
        overlay.querySelector('#olCloseBtn').onclick = close;
        overlay.querySelector('#olCancelBtn').onclick = close;

        const catalog = await window.fetchOnlineCatalog();
        const contentBox = overlay.querySelector('#olContentBox');
        if (!catalog || catalog.length === 0) {
            contentBox.innerHTML = `
                <div style="background:#fefce8; border:1px solid #fde047; padding:14px; border-radius:8px; text-align:left; font-size:13.5px; color:#854d0e; line-height:1.7;">
                    <strong>📌 હજુ સુધી GitHub માં <code>data/catalog.json</code> અપલોડ થયેલ નથી.</strong><br>
                    1. GitHub માં <code>data/std10_maths.json</code> અને <code>data/catalog.json</code> અપલોડ કરો.<br>
                    2. ત્યારબાદ અહીં બધા જ ધોરણ અને વિષયોના પેક ૧ ક્લિકમાં ડાઉનલોડ કરવા માટે દેખાશે!
                </div>`;
            return;
        }

        const localQs = getAllQuestions();
        contentBox.style.textAlign = 'left';
        contentBox.style.padding = '0';
        contentBox.innerHTML = `
            <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:9px 12px; border-radius:8px; font-size:12.5px; color:#1e40af; margin-bottom:10px;">
                💡 <strong>ઉમેરો/અપડેટ:</strong> હાલના પ્રશ્નો સાથે નવો વિષય ઉમેરશે. &nbsp;|&nbsp; <strong>ફક્ત આ વિષય લોડ કરો:</strong> મેમરી બચાવવા જૂના વિષય હટાવી માત્ર આ વિષય લોડ કરશે.
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
                ${catalog.map(pack => {
                    const localCount = localQs.filter(q => String(q.standard) === String(pack.standard) && String(q.subject) === String(pack.subject)).length;
                    return `
                        <div style="border:1px solid #cbd5e1; border-left:4px solid ${localCount > 0 ? '#16a34a' : '#2563eb'}; border-radius:8px; padding:10px 12px; background:#f8fafc; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                            <div>
                                <div style="font-weight:700; font-size:14.5px; color:#0f172a;">📘 ${escapeAttr(pack.title || (`ધોરણ ${pack.standard} — ${pack.subject}`))}</div>
                                <div style="font-size:12px; color:#64748b; margin-top:2px;">
                                    ફાઈલ: <code>${escapeAttr(pack.file)}</code> &nbsp;|&nbsp;
                                    હાલમાં ફોનમાં: <strong style="color:${localCount > 0 ? '#15803d' : '#dc2626'};">${localCount} પ્રશ્નો</strong>
                                </div>
                            </div>
                            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                                <button type="button" class="gv-btn gv-btn-blue" style="padding:5px 10px; font-size:12px;" onclick="window.loadOnlineSubjectPack('${escapeJsArg(pack.id)}', false, false)">⬇️ ઉમેરો / અપડેટ</button>
                                <button type="button" class="gv-btn gv-btn-teal" style="padding:5px 10px; font-size:12px;" onclick="window.loadOnlineSubjectPack('${escapeJsArg(pack.id)}', true, false)">🔄 ફક્ત આ વિષય લોડ કરો</button>
                            </div>
                        </div>`;
                }).join('')}
            </div>`;
    };

    window.syncOnlineQuestions = async function() {
        let totalAdded = 0;

        // 1. નવી મલ્ટી-સબ્જેક્ટ સિસ્ટમ: data/catalog.json માંથી autoLoad: true હોય તેવા વિષયો સિંક કરો
        const catalog = await window.fetchOnlineCatalog();
        if (Array.isArray(catalog) && catalog.length > 0) {
            for (const pack of catalog) {
                if (pack && pack.autoLoad === true && pack.file) {
                    const added = await window.loadOnlineSubjectPack(pack.id, false, true);
                    totalAdded += added;
                }
            }
        }

        // 2. જૂની સિસ્ટમ (Backward Compatible): જો રૂટ ફોલ્ડરમાં questions.json હોય તો તે પણ સિંક કરો
        try {
            const res = await fetch('./questions.json?v=' + Date.now(), { cache: 'no-store' });
            if (res.ok) {
                const onlineData = await res.json();
                if (Array.isArray(onlineData) && onlineData.length > 0) {
                    const local = getAllQuestions();
                    const localIds = new Set(local.map(q => q.id));
                    let legacyAdded = 0;
                    onlineData.forEach(item => {
                        if (item && item.id && !localIds.has(item.id)) {
                            local.push(item);
                            localIds.add(item.id);
                            legacyAdded++;
                        }
                    });
                    if (legacyAdded > 0) {
                        saveAllQuestions(local);
                        totalAdded += legacyAdded;
                    }
                }
            }
        } catch (err) {
            // શાંતિથી અવગણવું
        }

        if (totalAdded > 0) {
            window.pmChaptersInitializedKey = '';
            window.refreshData();
            window.showToast(`☁️ GitHub સર્વરમાંથી ${totalAdded} નવા પ્રશ્નો સિંક થઈ ગયા!`);
        }
    };

    // ==========================================
    // ➕ 6. ADD / EDIT QUESTION MODAL (WITH QUESTION & SOLUTION IMAGE SUPPORT)
    // ==========================================
    function refreshTypeSuggestionsDatalist() {
        const dl = document.getElementById('gvTypeSuggestions');
        if (!dl) return;
        const set = new Set([...window.BOARD_SECTION_A_ORDER, 'ટૂંકમાં જવાબ આપો', 'માગ્યા મુજબ જવાબ આપો', 'સવિસ્તાર જવાબ આપો']);
        window.getCustomObjectiveSubtypes().forEach(x => { if (x && x.type) set.add(x.type); });
        getAllQuestions().forEach(q => { if (q && q.type) set.add(String(q.type)); });
        dl.innerHTML = Array.from(set).map(t => `<option value="${escapeAttr(t)}"></option>`).join('');
    }

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
                    <div><label style="font-size:12px; font-weight:bold;">પ્રશ્નનો પ્રકાર (કોઈપણ નવો પ્રકાર પણ લખી શકો):</label>
                        <input id="gvQType" list="gvTypeSuggestions" class="gv-input" placeholder="દા.ત. MCQ, વ્યાખ્યા આપો, આકૃતિ ઓળખો" value="MCQ">
                        <datalist id="gvTypeSuggestions"></datalist>
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

                <!-- 🖼️ પ્રશ્નની ઈમેજ બોક્સ -->
                <div class="gv-img-upload-box">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
                        <label style="font-size:12.5px; font-weight:bold; color:#1e40af;">🖼️ પ્રશ્નની આકૃતિ / ઈમેજ (પ્રશ્નપત્રમાં દેખાશે):</label>
                        <div style="display:flex; gap:5px; align-items:center;">
                            <select id="gvQImgWidth" style="padding:3px 6px; border:1px solid #cbd5e1; border-radius:4px; font-size:12px;">
                                <option value="140px">સાઈઝ: નાની (140px)</option>
                                <option value="220px" selected>સાઈઝ: મધ્યમ (220px)</option>
                                <option value="320px">સાઈઝ: મોટી (320px)</option>
                                <option value="440px">સાઈઝ: ખૂબ મોટી (440px)</option>
                                <option value="100%">સાઈઝ: પૂરી પહોળાઈ</option>
                            </select>
                            <select id="gvQImgAlign" style="padding:3px 6px; border:1px solid #cbd5e1; border-radius:4px; font-size:12px;">
                                <option value="left">ડાબે</option>
                                <option value="center" selected>વચ્ચે</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                        <input type="file" id="gvQImgFile" accept="image/*" style="font-size:12px; max-width:220px;">
                        <input type="text" id="gvQImgUrl" class="gv-input" style="flex:1; min-width:160px; padding:5px 8px; font-size:12px;" placeholder="અથવા ઈમેજ URL / Base64 પેસ્ટ કરો...">
                        <button type="button" id="gvQImgRemove" class="gv-btn gv-btn-red" style="padding:4px 8px; font-size:11.5px; display:none;">🗑️ હટાવો</button>
                    </div>
                    <div id="gvQImgPreviewWrap" class="gv-img-preview-wrap" style="display:none;">
                        <img id="gvQImgPreview" src="" alt="Question Diagram Preview">
                    </div>
                </div>

                <div style="margin-bottom:10px;">
                    <label style="font-size:12px; font-weight:bold;">જવાબ (Answer):</label>
                    <textarea id="gvQAns" rows="4" class="gv-input" placeholder="અહીં ઉત્તર લખો..."></textarea>
                </div>

                <!-- 🖼️ ઉત્તર / સોલ્યુશનની ઈમેજ બોક્સ -->
                <div class="gv-img-upload-box" style="border-color:#86efac; background:#f0fdf4;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
                        <label style="font-size:12.5px; font-weight:bold; color:#15803d;">🖼️ ઉત્તર / સોલ્યુશનની આકૃતિ / ઈમેજ (Answer Key માં દેખાશે):</label>
                        <div style="display:flex; gap:5px; align-items:center;">
                            <select id="gvSolImgWidth" style="padding:3px 6px; border:1px solid #cbd5e1; border-radius:4px; font-size:12px;">
                                <option value="150px">સાઈઝ: નાની (150px)</option>
                                <option value="240px" selected>સાઈઝ: મધ્યમ (240px)</option>
                                <option value="340px">સાઈઝ: મોટી (340px)</option>
                                <option value="460px">સાઈઝ: ખૂબ મોટી (460px)</option>
                                <option value="100%">સાઈઝ: પૂરી પહોળાઈ</option>
                            </select>
                            <select id="gvSolImgAlign" style="padding:3px 6px; border:1px solid #cbd5e1; border-radius:4px; font-size:12px;">
                                <option value="left" selected>ડાબે</option>
                                <option value="center">વચ્ચે</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                        <input type="file" id="gvSolImgFile" accept="image/*" style="font-size:12px; max-width:220px;">
                        <input type="text" id="gvSolImgUrl" class="gv-input" style="flex:1; min-width:160px; padding:5px 8px; font-size:12px;" placeholder="અથવા સોલ્યુશન ઈમેજ URL પેસ્ટ કરો...">
                        <button type="button" id="gvSolImgRemove" class="gv-btn gv-btn-red" style="padding:4px 8px; font-size:11.5px; display:none;">🗑️ હટાવો</button>
                    </div>
                    <div id="gvSolImgPreviewWrap" class="gv-img-preview-wrap" style="display:none;">
                        <img id="gvSolImgPreview" src="" alt="Solution Diagram Preview">
                    </div>
                </div>

                <div style="display:flex; gap:8px; justify-content:flex-end;">
                    <button type="button" id="gvQModalCancel" class="gv-btn gv-btn-dark">રદ કરો</button>
                    <button type="button" id="gvQModalSave" class="gv-btn gv-btn-green">💾 પ્રશ્ન સેવ કરો</button>
                </div>
            </div>`;
        document.body.appendChild(modal);

        let tempQImage = '';
        let tempSolImage = '';

        const syncImgUI = () => {
            const qWrap = modal.querySelector('#gvQImgPreviewWrap');
            const qImg = modal.querySelector('#gvQImgPreview');
            const qRem = modal.querySelector('#gvQImgRemove');
            if (tempQImage) {
                qImg.src = tempQImage;
                qWrap.style.display = 'block';
                qRem.style.display = 'inline-flex';
            } else {
                qImg.src = '';
                qWrap.style.display = 'none';
                qRem.style.display = 'none';
            }

            const sWrap = modal.querySelector('#gvSolImgPreviewWrap');
            const sImg = modal.querySelector('#gvSolImgPreview');
            const sRem = modal.querySelector('#gvSolImgRemove');
            if (tempSolImage) {
                sImg.src = tempSolImage;
                sWrap.style.display = 'block';
                sRem.style.display = 'inline-flex';
            } else {
                sImg.src = '';
                sWrap.style.display = 'none';
                sRem.style.display = 'none';
            }
        };

        modal._setImages = (qSrc, solSrc) => {
            tempQImage = qSrc || '';
            tempSolImage = solSrc || '';
            modal.querySelector('#gvQImgUrl').value = (tempQImage && !tempQImage.startsWith('data:')) ? tempQImage : '';
            modal.querySelector('#gvSolImgUrl').value = (tempSolImage && !tempSolImage.startsWith('data:')) ? tempSolImage : '';
            modal.querySelector('#gvQImgFile').value = '';
            modal.querySelector('#gvSolImgFile').value = '';
            syncImgUI();
        };

        modal.querySelector('#gvQImgFile').onchange = async (ev) => {
            const f = ev.target.files[0];
            if (!f) return;
            try {
                tempQImage = await window.compressImageFileToDataURL(f);
                modal.querySelector('#gvQImgUrl').value = '';
                syncImgUI();
                window.showToast('🖼️ પ્રશ્નની ઈમેજ લોડ થઈ ગઈ!');
            } catch (err) {
                window.showToast(err.message, 'error');
            }
        };

        modal.querySelector('#gvQImgUrl').oninput = (ev) => {
            tempQImage = ev.target.value.trim();
            syncImgUI();
        };
        modal.querySelector('#gvQImgRemove').onclick = () => {
            tempQImage = '';
            modal.querySelector('#gvQImgFile').value = '';
            modal.querySelector('#gvQImgUrl').value = '';
            syncImgUI();
        };

        modal.querySelector('#gvSolImgFile').onchange = async (ev) => {
            const f = ev.target.files[0];
            if (!f) return;
            try {
                tempSolImage = await window.compressImageFileToDataURL(f);
                modal.querySelector('#gvSolImgUrl').value = '';
                syncImgUI();
                window.showToast('🖼️ ઉત્તરની ઈમેજ લોડ થઈ ગઈ!');
            } catch (err) {
                window.showToast(err.message, 'error');
            }
        };

        modal.querySelector('#gvSolImgUrl').oninput = (ev) => {
            tempSolImage = ev.target.value.trim();
            syncImgUI();
        };
        modal.querySelector('#gvSolImgRemove').onclick = () => {
            tempSolImage = '';
            modal.querySelector('#gvSolImgFile').value = '';
            modal.querySelector('#gvSolImgUrl').value = '';
            syncImgUI();
        };

        const closeModal = () => { modal.style.display = 'none'; window.editingQuestionId = null; };
        modal.querySelector('#gvQModalClose').onclick = closeModal;
        modal.querySelector('#gvQModalCancel').onclick = closeModal;
        modal.querySelector('#gvQModalSave').onclick = () => {
            const text = modal.querySelector('#gvQText').value.trim();
            if (!text && !tempQImage) return window.showToast('કૃપા કરીને પ્રશ્નનું લખાણ અથવા ઈમેજ ઉમેરો!', 'error');

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
                answer: modal.querySelector('#gvQAns').value.trim(),
                image: tempQImage || '',
                imageWidth: modal.querySelector('#gvQImgWidth').value || '220px',
                imageAlign: modal.querySelector('#gvQImgAlign').value || 'center',
                solutionImage: tempSolImage || '',
                solutionImageWidth: modal.querySelector('#gvSolImgWidth').value || '240px',
                solutionImageAlign: modal.querySelector('#gvSolImgAlign').value || 'left'
            };

            let allQ = getAllQuestions();
            if (window.editingQuestionId) {
                const idx = allQ.findIndex(x => x.id === window.editingQuestionId);
                if (idx !== -1) allQ[idx] = { ...allQ[idx], ...qData };
                window.draftPaperQuestions = window.draftPaperQuestions.map(dq => dq.id === qData.id ? { ...dq, ...qData, section: dq.section } : dq);
                window.showToast('✅ પ્રશ્ન અને ઈમેજ અપડેટ થઈ ગયા!');
            } else {
                allQ.push(qData);
                window.showToast('✅ નવો પ્રશ્ન ઉમેરાઈ ગયો!');
            }
            try {
                saveAllQuestions(allQ);
            } catch (storageErr) {
                return window.showToast('⚠️ સ્ટોરેજ ફૂલ થઈ ગયું છે! કૃપા કરીને નાની ઈમેજ વાપરો અથવા બેકઅપ લો.', 'error');
            }
            window.pmChaptersInitializedKey = '';
            closeModal();
            window.refreshData();
        };
    }

    window.openAddModal = function(e, editQ = null) {
        if (e) e.preventDefault();
        ensureQuestionModal();
        refreshTypeSuggestionsDatalist();
        window.updateInstructionDatalist();
        const modal = document.getElementById('gvQuestionModal');
        if (!modal) return;

        if (editQ) {
            window.editingQuestionId = editQ.id;
            modal.querySelector('#gvQModalTitle').textContent = '✏️ પ્રશ્ન અને ઈમેજ એડિટ કરો';
            modal.querySelector('#gvQStd').value = editQ.standard || '10';
            modal.querySelector('#gvQSub').value = editQ.subject || 'વિજ્ઞાન';
            modal.querySelector('#gvQChap').value = editQ.chapter || '1';
            modal.querySelector('#gvQType').value = editQ.type || 'MCQ';
            modal.querySelector('#gvQMarks').value = editQ.marks || 1;
            modal.querySelector('#gvQLang').value = editQ.lang || 'gu';
            modal.querySelector('#gvQInst').value = editQ.instruction || '';
            modal.querySelector('#gvQText').value = editQ.text || '';
            modal.querySelector('#gvQAns').value = editQ.answer || '';
            modal.querySelector('#gvQImgWidth').value = editQ.imageWidth || '220px';
            modal.querySelector('#gvQImgAlign').value = editQ.imageAlign || 'center';
            modal.querySelector('#gvSolImgWidth').value = editQ.solutionImageWidth || '240px';
            modal.querySelector('#gvSolImgAlign').value = editQ.solutionImageAlign || 'left';
            modal._setImages(editQ.image || '', editQ.solutionImage || '');
        } else {
            window.editingQuestionId = null;
            modal.querySelector('#gvQModalTitle').textContent = '➕ નવો પ્રશ્ન ઉમેરો';
            modal.querySelector('#gvQInst').value = '';
            modal.querySelector('#gvQText').value = '';
            modal.querySelector('#gvQAns').value = '';
            modal.querySelector('#gvQImgWidth').value = '220px';
            modal.querySelector('#gvQImgAlign').value = 'center';
            modal.querySelector('#gvSolImgWidth').value = '240px';
            modal.querySelector('#gvSolImgAlign').value = 'left';
            modal._setImages('', '');
        }
        modal.style.display = 'flex';
    };

    window.openQuickDraftImageModal = function(draftIdx) {
        const dq = window.draftPaperQuestions[draftIdx];
        if (!dq) return;
        const bankQ = getAllQuestions().find(x => x.id === dq.id);
        window.openAddModal(null, bankQ ? { ...bankQ, ...dq } : dq);
    };

    // ==========================================
    // 👁️ 7. LIVE DRAFT / SAVED PAPER PREVIEW MODAL
    // ==========================================
    window.buildCurrentDraftPaperObj = function() {
        const totalDraftMarks = window.calculatePaperTotalMarks(window.draftPaperQuestions, window.draftPaperMeta);
        const firstRealQ = window.draftPaperQuestions.find(q => q.type !== 'instruction') || {};
        return {
            id: 'DRAFT_' + Date.now(),
            title: window.pmTitleVal || 'પ્રશ્નપત્ર',
            standard: window.pmSelectedStd === 'ALL' ? (firstRealQ.standard || '') : window.pmSelectedStd,
            subject: window.pmSelectedSub === 'ALL' ? (firstRealQ.subject || '') : window.pmSelectedSub,
            date: window.pmDateVal,
            totalMarks: totalDraftMarks,
            sectionsMetadata: JSON.parse(JSON.stringify(window.draftPaperMeta || {})),
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
    // 📝 8. AUTO-PAPER GENERATOR, GSEB BOARD BLUEPRINTS & CUSTOM BLUEPRINT BUILDER
    // ==========================================
    window.GSEB_BOARD_BLUEPRINTS = {
        gseb_unit_25: {
            label: '📋 એકમ કસોટી (25 ગુણ)',
            desc: 'A: 5×1 (બોર્ડ ક્રમ) | B: 4 માંથી 3×2 | C: 3 માંથી 2×3 | D: 3 માંથી 2×4',
            title: 'એકમ કસોટી (બોર્ડ પેટર્ન - 25 ગુણ)',
            targetMarks: 25,
            sections: [
                { sec: 'A', marks: 1, count: 5, attemptCount: 5, attempt: '', useBoardObjectiveMix: true, instruction: 'નીચે આપેલા હેતુલક્ષી પ્રશ્નોના ઉત્તર લખો. (દરેકનો 1 ગુણ)' },
                { sec: 'B', marks: 2, count: 4, attemptCount: 3, attempt: 'કોઈ પણ 3', instruction: 'નીચે આપેલા પ્રશ્નોમાંથી કોઈ પણ 3 પ્રશ્નોના ટૂંકમાં ઉત્તર લખો. (દરેકના 2 ગુણ)' },
                { sec: 'C', marks: 3, count: 3, attemptCount: 2, attempt: 'કોઈ પણ 2', instruction: 'નીચે આપેલા પ્રશ્નોમાંથી કોઈ પણ 2 પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો. (દરેકના 3 ગુણ)' },
                { sec: 'D', marks: 4, count: 3, attemptCount: 2, attempt: 'કોઈ પણ 2', instruction: 'નીચે આપેલા પ્રશ્નોમાંથી કોઈ પણ 2 પ્રશ્નોના સવિસ્તાર ઉત્તર લખો. (દરેકના 4 ગુણ)' }
            ]
        },
        gseb_mid_50: {
            label: '📋 પ્રથમ/દ્વિતીય પરીક્ષા (50 ગુણ)',
            desc: 'A: 10×1 (બોર્ડ ક્રમ) | B: 8 માંથી 6×2 | C: 6 માંથી 4×3 | D: 6 માંથી 4×4',
            title: 'પ્રથમ / દ્વિતીય પરીક્ષા (50 ગુણ)',
            targetMarks: 50,
            sections: [
                { sec: 'A', marks: 1, count: 10, attemptCount: 10, attempt: '', useBoardObjectiveMix: true, instruction: 'નીચે આપેલા હેતુલક્ષી પ્રશ્નોના ઉત્તર લખો. (દરેકનો 1 ગુણ)' },
                { sec: 'B', marks: 2, count: 8, attemptCount: 6, attempt: 'કોઈ પણ 6', instruction: 'નીચે આપેલા પ્રશ્નોમાંથી કોઈ પણ 6 પ્રશ્નોના ટૂંકમાં ઉત્તર લખો. (દરેકના 2 ગુણ)' },
                { sec: 'C', marks: 3, count: 6, attemptCount: 4, attempt: 'કોઈ પણ 4', instruction: 'નીચે આપેલા પ્રશ્નોમાંથી કોઈ પણ 4 પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો. (દરેકના 3 ગુણ)' },
                { sec: 'D', marks: 4, count: 6, attemptCount: 4, attempt: 'કોઈ પણ 4', instruction: 'નીચે આપેલા પ્રશ્નોમાંથી કોઈ પણ 4 પ્રશ્નોના સવિસ્તાર ઉત્તર લખો. (દરેકના 4 ગુણ)' }
            ]
        },
        gseb_10_80: {
            label: '🏆 ધો. 9-10 બોર્ડ સ્ટાઈલ (80 ગુણ)',
            desc: 'A: 24 ગુણ (MCQ->ખાલી જગ્યા->ખરા-ખોટા->જોડકા->એક વાક્ય) | B: 9×2 | C: 6×3 | D: 5×4',
            title: 'વાર્ષિક / બોર્ડ પરીક્ષા (80 ગુણ)',
            targetMarks: 80,
            sections: [
                { sec: 'A', marks: 1, count: 24, attemptCount: 24, attempt: '', useBoardObjectiveMix: true, includeMatchInSecA: true, instruction: 'નીચે આપેલા હેતુલક્ષી પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો.' },
                { sec: 'B', marks: 2, count: 12, attemptCount: 9, attempt: 'કોઈ પણ 9', instruction: 'નીચે આપેલા 12 પ્રશ્નોમાંથી કોઈ પણ 9 પ્રશ્નોના ટૂંકમાં ઉત્તર લખો. (દરેકના 2 ગુણ)' },
                { sec: 'C', marks: 3, count: 9, attemptCount: 6, attempt: 'કોઈ પણ 6', instruction: 'નીચે આપેલા 9 પ્રશ્નોમાંથી કોઈ પણ 6 પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો. (દરેકના 3 ગુણ)' },
                { sec: 'D', marks: 4, count: 8, attemptCount: 5, attempt: 'કોઈ પણ 5', instruction: 'નીચે આપેલા 8 પ્રશ્નોમાંથી કોઈ પણ 5 પ્રશ્નોના સવિસ્તાર ઉત્તર લખો. (દરેકના 4 ગુણ)' }
            ]
        },
        gseb_12_sci_100: {
            label: '🔬 ધો. 11-12 સાયન્સ બોર્ડ (100 ગુણ)',
            desc: 'Part-A: 50 MCQ | B: 12 માંથી 8×2 | C: 9 માંથી 6×3 | D: 6 માંથી 4×4',
            title: 'બોર્ડ પરીક્ષા — વિજ્ઞાન પ્રવાહ (100 ગુણ)',
            targetMarks: 100,
            sections: [
                { sec: 'A', marks: 1, count: 50, attemptCount: 50, attempt: '', preferTypes: ['MCQ'], instruction: 'Part-A: નીચે આપેલા 50 બહુવિકલ્પી પ્રશ્નો (MCQ) ના સાચા ઉત્તર પસંદ કરો. (દરેકનો 1 ગુણ)' },
                { sec: 'B', marks: 2, count: 12, attemptCount: 8, attempt: 'કોઈ પણ 8', instruction: 'Part-B (વિભાગ-A): નીચે આપેલા 12 પ્રશ્નોમાંથી કોઈ પણ 8 પ્રશ્નોના ટૂંકમાં ઉત્તર લખો. (દરેકના 2 ગુણ)' },
                { sec: 'C', marks: 3, count: 9, attemptCount: 6, attempt: 'કોઈ પણ 6', instruction: 'Part-B (વિભાગ-B): નીચે આપેલા 9 પ્રશ્નોમાંથી કોઈ પણ 6 પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો. (દરેકના 3 ગુણ)' },
                { sec: 'D', marks: 4, count: 6, attemptCount: 4, attempt: 'કોઈ પણ 4', instruction: 'Part-B (વિભાગ-C): નીચે આપેલા 6 પ્રશ્નોમાંથી કોઈ પણ 4 પ્રશ્નોના સવિસ્તાર ઉત્તર લખો. (દરેકના 4 ગુણ)' }
            ]
        },
        gseb_12_com_100: {
            label: '📊 ધો. 11-12 કોમર્સ/આર્ટ્સ (100 ગુણ)',
            desc: 'A: 20 MCQ | B: 10×1 | C: 14 માંથી 10×2 | D: 14 માંથી 10×3 | E: 7 માંથી 5×4',
            title: 'બોર્ડ પરીક્ષા — સામાન્ય પ્રવાહ (100 ગુણ)',
            targetMarks: 100,
            sections: [
                { sec: 'A', marks: 1, count: 20, attemptCount: 20, attempt: '', preferTypes: ['MCQ'], instruction: 'નીચે આપેલા 20 બહુવિકલ્પી પ્રશ્નો (MCQ) ના સાચા વિકલ્પ પસંદ કરો. (દરેકનો 1 ગુણ)' },
                { sec: 'B', marks: 1, count: 10, attemptCount: 10, attempt: '', excludeTypes: ['MCQ'], instruction: 'નીચે આપેલા પ્રશ્નોના એક વાક્યમાં ઉત્તર લખો. (દરેકનો 1 ગુણ)' },
                { sec: 'C', marks: 2, count: 14, attemptCount: 10, attempt: 'કોઈ પણ 10', instruction: 'નીચે આપેલા 14 પ્રશ્નોમાંથી કોઈ પણ 10 પ્રશ્નોના ટૂંકમાં ઉત્તર લખો. (દરેકના 2 ગુણ)' },
                { sec: 'D', marks: 3, count: 14, attemptCount: 10, attempt: 'કોઈ પણ 10', instruction: 'નીચે આપેલા 14 પ્રશ્નોમાંથી કોઈ પણ 10 પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો. (દરેકના 3 ગુણ)' },
                { sec: 'E', marks: 4, count: 7, attemptCount: 5, attempt: 'કોઈ પણ 5', instruction: 'નીચે આપેલા 7 પ્રશ્નોમાંથી કોઈ પણ 5 પ્રશ્નોના સવિસ્તાર ઉત્તર લખો. (દરેકના 4 ગુણ)' }
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

    window.pmToggleManualQuestion = function(qId) {
        const idx = window.draftPaperQuestions.findIndex(x => x.id === qId);
        if (idx !== -1) {
            window.draftPaperQuestions.splice(idx, 1);
            window.showToast('પ્રશ્ન ડ્રાફ્ટમાંથી દૂર થયો.');
        } else {
            const qObj = getAllQuestions().find(x => x.id === qId);
            if (!qObj) return;
            window.draftPaperQuestions.push({ ...qObj, section: window.pmManualTargetSec || 'A' });
            window.showToast(`✅ પ્રશ્ન વિભાગ ${window.pmManualTargetSec === 'None' ? 'સામાન્ય' : window.pmManualTargetSec} માં ઉમેરાયો!`);
        }
        window.renderPaperMaker();
    };

    window.pmRemoveDraftQuestion = function(idx) {
        if (idx < 0 || idx >= window.draftPaperQuestions.length) return;
        const removedSec = window.draftPaperQuestions[idx].section || 'None';
        window.draftPaperQuestions.splice(idx, 1);
        const remCount = window.draftPaperQuestions.filter(q => (q.section || 'None') === removedSec && q.type !== 'instruction').length;
        if (window.draftPaperMeta && window.draftPaperMeta[removedSec]) {
            const att = Number(window.draftPaperMeta[removedSec].attemptCount) || 0;
            if (att >= remCount) {
                window.draftPaperMeta[removedSec].attemptCount = 0;
                window.draftPaperMeta[removedSec].attempt = '';
            }
        }
        window.renderPaperMaker();
    };

    window.pmChangeDraftSection = function(idx, newSec) {
        if (!window.draftPaperQuestions[idx]) return;
        window.draftPaperQuestions[idx].section = newSec;
        window.renderPaperMaker();
    };

    window.pmMoveDraft = function(idx, dir) {
        const target = idx + dir;
        if (target < 0 || target >= window.draftPaperQuestions.length) return;
        const temp = window.draftPaperQuestions[idx];
        window.draftPaperQuestions[idx] = window.draftPaperQuestions[target];
        window.draftPaperQuestions[target] = temp;
        window.renderPaperMaker();
    };

    window.quickAddToDraftFromBank = function(qId) {
        const qObj = getAllQuestions().find(x => x.id === qId);
        if (!qObj) return;
        if (window.draftPaperQuestions.some(x => x.id === qId)) {
            return window.showToast('આ પ્રશ્ન પહેલેથી જ ડ્રાફ્ટ પેપરમાં ઉમેરેલો છે!', 'error');
        }
        const m = Number(qObj.marks) || 1;
        const autoSec = (m === 1 || qObj.type === 'જોડકા જોડો') ? 'A' : (m === 2 ? 'B' : (m === 3 ? 'C' : 'D'));
        window.draftPaperQuestions.push({ ...qObj, section: autoSec });
        window.showToast(`✅ પ્રશ્ન ડ્રાફ્ટ પેપર (વિભાગ ${autoSec}) માં ઉમેરાયો!`);
        if (window.activeTab === 'bank') window.renderQuestions();
    };

    function pickBalancedSectionA(pool, targetMarks, usedIds, includeMatch = true) {
        const availObj = pool.filter(q => {
            if (usedIds.has(q.id)) return false;
            const m = Number(q.marks) || 1;
            if (m === 1) return true;
            if (includeMatch && (q.type === 'જોડકા જોડો' || String(q.type || '').toLowerCase().includes('match')) && m <= 2) return true;
            return false;
        });

        const byType = new Map();
        availObj.forEach(q => {
            const t = String(q.type || 'MCQ').trim();
            if (!byType.has(t)) byType.set(t, []);
            byType.get(t).push(q);
        });

        const sortedTypes = Array.from(byType.keys()).sort((a, b) => window.getObjectiveTypePriority(a) - window.getObjectiveTypePriority(b));
        sortedTypes.forEach(t => byType.get(t).sort(() => Math.random() - 0.5));

        const picked = [];
        let currMarks = 0;

        const preferredWeights = {
            'MCQ': 0.25,
            'ખાલી જગ્યા': 0.17,
            'વિકલ્પ સાથે ખાલી જગ્યા': 0.12,
            'ખરા-ખોટા': 0.17,
            'જોડકા જોડો': 0.12,
            'એક વાક્યમાં જવાબ આપો': 0.17
        };

        sortedTypes.forEach(t => {
            const arr = byType.get(t);
            const wt = preferredWeights[t] || (1 / Math.max(sortedTypes.length, 4));
            let quotaMarks = Math.max(1, Math.round(targetMarks * wt));
            let typeMarks = 0;
            while (arr.length > 0 && typeMarks < quotaMarks && currMarks < targetMarks) {
                const candidate = arr[0];
                const cm = Number(candidate.marks) || 1;
                if (currMarks + cm <= targetMarks) {
                    arr.shift();
                    picked.push({ ...candidate, section: 'A' });
                    usedIds.add(candidate.id);
                    currMarks += cm;
                    typeMarks += cm;
                } else {
                    break;
                }
            }
        });

        let progress = true;
        while (currMarks < targetMarks && progress) {
            progress = false;
            for (let t of sortedTypes) {
                const arr = byType.get(t);
                while (arr.length > 0) {
                    const cand = arr[0];
                    const cm = Number(cand.marks) || 1;
                    if (currMarks + cm <= targetMarks) {
                        arr.shift();
                        picked.push({ ...cand, section: 'A' });
                        usedIds.add(cand.id);
                        currMarks += cm;
                        progress = true;
                        break;
                    } else {
                        arr.shift();
                    }
                }
                if (currMarks >= targetMarks) break;
            }
        }

        return window.sortSectionAQuestions(picked);
    }

    window.sortDraftSectionAByBoardOrder = function() {
        const secA = window.draftPaperQuestions.filter(q => (q.section || 'None') === 'A');
        if (secA.length === 0) return window.showToast('વિભાગ-A માં કોઈ પ્રશ્ન નથી.', 'error');
        const others = window.draftPaperQuestions.filter(q => (q.section || 'None') !== 'A');
        const sortedA = window.sortSectionAQuestions(secA);
        const secOrder = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, None: 8 };
        window.draftPaperQuestions = [...sortedA, ...others].sort((a, b) => (secOrder[a.section || 'None'] || 9) - (secOrder[b.section || 'None'] || 9));
        window.showToast('✅ વિભાગ-A બોર્ડના ક્રમમાં ગોઠવાઈ ગયો!');
        window.renderPaperMaker();
    };

    window.gvGenerateFromBlueprint = function(bp) {
        if (!bp || !Array.isArray(bp.sections)) return;
        const pool = getFilteredPaperPool();
        if (pool.length === 0) return window.showToast("કૃપા કરીને ઓછામાં ઓછું ૧ પ્રકરણ ટીક કરો (અથવા પ્રશ્નો ઉમેરો)!", "error");

        const usedIds = new Set();
        let selected = [];
        const sectionsMetadata = {};

        bp.sections.forEach(rule => {
            const marksNum = Number(rule.marks) || 1;
            const countNum = Number(rule.count) || 1;
            const rawAttempt = Number(rule.attemptCount) || 0;

            let pickedForSec = [];
            const shouldUseSecAMix = rule.sec === 'A' && (rule.useBoardObjectiveMix || (marksNum === 1 && (!rule.preferTypes || rule.preferTypes.length === 0 || rule.preferTypes[0] === 'ALL')));

            if (shouldUseSecAMix) {
                const targetSecMarks = countNum * marksNum;
                pickedForSec = pickBalancedSectionA(pool, targetSecMarks, usedIds, rule.includeMatchInSecA !== false);
                selected.push(...pickedForSec);
            } else {
                let candidates = pool.filter(q => {
                    if (usedIds.has(q.id)) return false;
                    if (rule.sec === 'B' && q.type === 'જોડકા જોડો' && (!rule.preferTypes || !rule.preferTypes.includes('જોડકા જોડો'))) {
                        return false;
                    }
                    return Number(q.marks) === marksNum;
                });

                let preferred = candidates;
                let fallback = [];
                if (rule.preferTypes && rule.preferTypes.length > 0 && rule.preferTypes[0] !== 'ALL') {
                    preferred = candidates.filter(q => rule.preferTypes.includes(q.type));
                    fallback = candidates.filter(q => !rule.preferTypes.includes(q.type));
                } else if (rule.excludeTypes && rule.excludeTypes.length > 0) {
                    preferred = candidates.filter(q => !rule.excludeTypes.includes(q.type));
                    fallback = candidates.filter(q => rule.excludeTypes.includes(q.type));
                }

                preferred.sort(() => Math.random() - 0.5);
                fallback.sort(() => Math.random() - 0.5);
                const ordered = [...preferred, ...fallback];

                for (let q of ordered) {
                    if (pickedForSec.length >= countNum) break;
                    pickedForSec.push({ ...q, section: rule.sec });
                    usedIds.add(q.id);
                }

                if (rule.sec === 'A') {
                    pickedForSec = window.sortSectionAQuestions(pickedForSec);
                }
                selected.push(...pickedForSec);
            }

            const pickedCount = pickedForSec.length;
            let effAttemptCount = 0;
            let effAttemptText = '';
            if (rawAttempt > 0 && pickedCount > rawAttempt) {
                effAttemptCount = rawAttempt;
                effAttemptText = (rule.attempt && rule.attempt.trim()) ? rule.attempt.trim() : `કોઈ પણ ${rawAttempt}`;
            }

            const defaultInst = effAttemptCount > 0
                ? `નીચે આપેલા પ્રશ્નોમાંથી કોઈ પણ ${effAttemptCount} પ્રશ્નોના ઉત્તર લખો. (દરેકના ${marksNum} ગુણ)`
                : `નીચે આપેલા પ્રશ્નોના ઉત્તર લખો. (દરેકના ${marksNum} ગુણ)`;

            sectionsMetadata[rule.sec] = {
                instruction: (rule.instruction && rule.instruction.trim()) ? rule.instruction.trim() : defaultInst,
                attempt: effAttemptText,
                attemptCount: effAttemptCount
            };
        });

        const targetMarks = Number(bp.targetMarks) || bp.sections.reduce((s, r) => {
            const c = Number(r.count) || 0;
            const a = (Number(r.attemptCount) > 0 && Number(r.attemptCount) < c) ? Number(r.attemptCount) : c;
            return s + (a * (Number(r.marks) || 1));
        }, 0);

        const currMarks = window.calculatePaperTotalMarks(selected, sectionsMetadata);
        window.draftPaperQuestions = selected;
        window.draftPaperMeta = sectionsMetadata;
        window.pmTitleVal = bp.title || bp.label || `પ્રશ્નપત્ર (${currMarks} ગુણ)`;

        if (currMarks === targetMarks) {
            window.showToast(`🏆 ${bp.label || bp.title} — સંપૂર્ણ ${currMarks} ગુણનું પેપર બોર્ડ ક્રમ અને ઓપ્શન સહિત તૈયાર થઈ ગયું! (${selected.length} પ્રશ્નો)`);
        } else {
            window.showToast(`⚠️ પસંદ કરેલા પ્રકરણોમાં પૂરતા પ્રશ્નો ન હોવાથી ${currMarks} / ${targetMarks} ગુણનું પેપર બન્યું છે (${selected.length} પ્રશ્નો).`);
        }
        window.renderPaperMaker();
    };

    window.gvGenerateBoardPaper = function(presetKey) {
        const bp = window.GSEB_BOARD_BLUEPRINTS[presetKey];
        if (bp) window.gvGenerateFromBlueprint(bp);
    };

    window.gvGenerateCustomBlueprint = function(bpId) {
        const bp = getCustomBlueprints().find(x => x.id === bpId);
        if (bp) window.gvGenerateFromBlueprint(bp);
    };

    window.deleteCustomBlueprint = function(bpId) {
        window.customConfirm('શું તમે આ કસ્ટમ બ્લુપ્રિન્ટ ડીલીટ કરવા માંગો છો?', () => {
            saveCustomBlueprints(getCustomBlueprints().filter(x => x.id !== bpId));
            window.showToast('🗑️ કસ્ટમ બ્લુપ્રિન્ટ ડીલીટ થઈ ગઈ.');
            window.renderPaperMaker();
        });
    };

    window.gvAutoPaper = function(targetMarks) {
        const marksNum = Number(targetMarks);
        if (!marksNum || marksNum < 1) return window.showToast("કૃપા કરીને યોગ્ય ગુણ દાખલ કરો!", "error");

        const pool = getFilteredPaperPool();
        if (pool.length === 0) return window.showToast("કૃપા કરીને ઓછામાં ઓછું ૧ પ્રકરણ ટીક કરો (અથવા પ્રશ્નો ઉમેરો)!", "error");

        const m4Count = Math.floor((marksNum * 0.20) / 4);
        const m3Count = Math.floor((marksNum * 0.25) / 3);
        const m2Count = Math.floor((marksNum * 0.25) / 2);
        const usedSoFar = (m4Count * 4) + (m3Count * 3) + (m2Count * 2);
        const m1Target = Math.max(0, marksNum - usedSoFar);

        const usedIds = new Set();
        let selected = [];
        let currMarks = 0;

        if (m1Target > 0) {
            const secAPicked = pickBalancedSectionA(pool, m1Target, usedIds, true);
            selected.push(...secAPicked);
            currMarks += secAPicked.reduce((s, q) => s + Number(q.marks || 1), 0);
        }

        const pickByMarks = (mVal, countNeeded, secName) => {
            const cands = pool.filter(q => !usedIds.has(q.id) && Number(q.marks) === mVal && !(secName === 'B' && q.type === 'જોડકા જોડો')).sort(() => Math.random() - 0.5);
            let picked = 0;
            for (let q of cands) {
                if (picked >= countNeeded || currMarks + mVal > marksNum) break;
                selected.push({ ...q, section: secName });
                usedIds.add(q.id);
                currMarks += mVal;
                picked++;
            }
        };

        if (m2Count > 0) pickByMarks(2, m2Count, 'B');
        if (m3Count > 0) pickByMarks(3, m3Count, 'C');
        if (m4Count > 0) pickByMarks(4, m4Count, 'D');

        if (currMarks < marksNum) {
            const remPool = pool.filter(q => !usedIds.has(q.id)).sort(() => Math.random() - 0.5);
            for (let q of remPool) {
                const qm = Number(q.marks) || 1;
                if (currMarks + qm <= marksNum) {
                    const sec = (qm === 1 || q.type === 'જોડકા જોડો') ? 'A' : (qm === 2 ? 'B' : (qm === 3 ? 'C' : 'D'));
                    selected.push({ ...q, section: sec });
                    usedIds.add(q.id);
                    currMarks += qm;
                }
                if (currMarks === marksNum) break;
            }
        }

        const secAOnly = window.sortSectionAQuestions(selected.filter(q => q.section === 'A'));
        const otherSecs = selected.filter(q => q.section !== 'A');
        const secOrder = { A: 1, B: 2, C: 3, D: 4, E: 5 };
        otherSecs.sort((a, b) => (secOrder[a.section] || 9) - (secOrder[b.section] || 9));
        selected = [...secAOnly, ...otherSecs];

        window.draftPaperQuestions = selected;
        window.draftPaperMeta = {};
        window.pmTitleVal = `કસોટી પ્રશ્નપત્ર (${currMarks} ગુણ)`;

        if (currMarks === marksNum) {
            window.showToast(`⚡ ${currMarks} ગુણનું ઓટો પેપર બોર્ડ ક્રમમાં તૈયાર થઈ ગયું! (${selected.length} પ્રશ્નો)`);
        } else {
            window.showToast(`⚠️ પસંદ કરેલા પ્રકરણોમાં ઉપલબ્ધ પ્રશ્નો મુજબ ${currMarks} / ${marksNum} ગુણનું પેપર બન્યું છે (${selected.length} પ્રશ્નો).`);
        }
        window.renderPaperMaker();
    };

    // ==========================================
    // 🎯 8B. SECTION-A OBJECTIVE SUB-TYPE MIXER & CUSTOM SUB-TYPE MANAGER
    // ==========================================
    window.openSectionAMixerModal = function() {
        const old = document.getElementById('gvSecAMixerModal');
        if (old) old.remove();

        const pool = getFilteredPaperPool();
        const typeStats = new Map();

        pool.forEach(q => {
            if (!window.isObjectiveQuestion(q)) return;
            const t = String(q.type || 'MCQ').trim();
            if (!typeStats.has(t)) {
                typeStats.set(t, { type: t, count: 0, marksPerQ: Number(q.marks) || 1, defaultInst: window.getEffectiveInstruction(q), desired: 0 });
            }
            typeStats.get(t).count++;
        });

        window.getCustomObjectiveSubtypes().forEach(cs => {
            if (!typeStats.has(cs.type)) {
                typeStats.set(cs.type, { type: cs.type, count: 0, marksPerQ: Number(cs.marks) || 1, defaultInst: cs.instruction || '', desired: 0, isCustom: true });
            } else {
                typeStats.get(cs.type).isCustom = true;
            }
        });

        let rows = Array.from(typeStats.values()).sort((a, b) => window.getObjectiveTypePriority(a.type) - window.getObjectiveTypePriority(b.type));

        const existingSecA = window.draftPaperQuestions.filter(q => (q.section || 'None') === 'A');
        if (existingSecA.length > 0) {
            rows.forEach(r => {
                r.desired = existingSecA.filter(q => String(q.type || '').trim() === r.type).length;
            });
        } else {
            rows.forEach(r => {
                if (r.count > 0) {
                    if (r.type === 'MCQ') r.desired = Math.min(6, r.count);
                    else if (r.type === 'ખાલી જગ્યા') r.desired = Math.min(4, r.count);
                    else if (r.type === 'વિકલ્પ સાથે ખાલી જગ્યા') r.desired = Math.min(2, r.count);
                    else if (r.type === 'ખરા-ખોટા') r.desired = Math.min(4, r.count);
                    else if (r.type === 'જોડકા જોડો') r.desired = Math.min(2, r.count);
                    else if (r.type === 'એક વાક્યમાં જવાબ આપો') r.desired = Math.min(4, r.count);
                    else r.desired = Math.min(2, r.count);
                }
            });
        }

        const overlay = document.createElement('div');
        overlay.id = 'gvSecAMixerModal';
        overlay.className = 'gv-modal-overlay';
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="gv-modal-box" style="max-width:780px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:10px; margin-bottom:12px;">
                    <h3 style="margin:0; color:#1e3a8a;">🎯 વિભાગ-A સ્માર્ટ હેતુલક્ષી પેટા-પ્રકાર મિક્સર (Board Order)</h3>
                    <button type="button" id="mxClose" style="border:none; background:#fee2e2; color:#b91c1c; font-weight:bold; padding:4px 10px; border-radius:6px; cursor:pointer;">✖</button>
                </div>

                <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:10px 12px; font-size:13px; color:#1e40af; margin-bottom:12px;">
                    💡 અહીં તમે <strong>વિભાગ-A</strong> ના દરેક પેટા-પ્રકાર (MCQ, ખાલી જગ્યા, ખરા-ખોટા, જોડકા, એક વાક્ય, તેમજ અન્ય કોઈપણ નવો પેટા-પ્રકાર) ની <strong>ચોક્કસ સંખ્યા અને ક્રમ (⬆️⬇️)</strong> નક્કી કરી શકો છો.
                </div>

                <div id="mxRowsBox" style="display:flex; flex-direction:column; gap:7px; max-height:330px; overflow-y:auto; margin-bottom:12px;"></div>

                <div style="background:#faf5ff; border:1px dashed #a78bfa; border-radius:8px; padding:10px 12px; margin-bottom:12px;">
                    <div style="font-weight:700; font-size:13px; color:#5b21b6; margin-bottom:6px;">➕ વિભાગ-A માટે નવો હેતુલક્ષી પેટા-પ્રકાર ઉમેરો (દા.ત. વ્યાખ્યા આપો, સંધિ જોડો, પૂરું નામ, Do as directed):</div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <input id="mxNewType" class="gv-input" style="flex:1; min-width:150px; padding:6px 8px; font-size:13px;" placeholder="પેટા-પ્રકારનું નામ (દા.ત. વ્યાખ્યા આપો)">
                        <input id="mxNewInst" class="gv-input" style="flex:2; min-width:200px; padding:6px 8px; font-size:13px;" placeholder="ડિફોલ્ટ સૂચના (દા.ત. નીચેના પદોની વ્યાખ્યા આપો.)">
                        <button type="button" id="mxAddCustomTypeBtn" class="gv-btn gv-btn-purple" style="padding:6px 12px; font-size:12.5px;">➕ ઉમેરો</button>
                    </div>
                </div>

                <div id="mxSummaryBar" style="background:#f0fdf4; border:1px solid #86efac; border-radius:8px; padding:9px 12px; font-size:13.5px; font-weight:700; color:#15803d; margin-bottom:12px;"></div>

                <div style="display:flex; gap:8px; justify-content:space-between; flex-wrap:wrap;">
                    <button type="button" id="mxResetBoardOrder" class="gv-btn gv-btn-outline" style="font-size:12.5px;">🔄 ડિફોલ્ટ બોર્ડ ક્રમ</button>
                    <div style="display:flex; gap:8px;">
                        <button type="button" id="mxCancel" class="gv-btn gv-btn-dark">રદ કરો</button>
                        <button type="button" id="mxApply" class="gv-btn gv-btn-green">⚡ વિભાગ-A માં ઉમેરો / અપડેટ કરો</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        const updateSummary = () => {
            let tQ = 0, tM = 0;
            rows.forEach(r => {
                const n = Math.max(0, Math.min(r.count, Number(r.desired) || 0));
                tQ += n;
                tM += n * r.marksPerQ;
            });
            overlay.querySelector('#mxSummaryBar').innerHTML = `🎯 પસંદ કરેલ વિભાગ-A: <strong>${tQ} પ્રશ્નો</strong> &nbsp;|&nbsp; કુલ <strong>${tM} ગુણ</strong>`;
        };

        const renderRows = () => {
            const box = overlay.querySelector('#mxRowsBox');
            if (rows.length === 0) {
                box.innerHTML = '<div style="text-align:center; padding:18px; color:#64748b;">પસંદ કરેલા પ્રકરણોમાં કોઈ હેતુલક્ષી પ્રશ્નો ઉપલબ્ધ નથી.</div>';
                updateSummary();
                return;
            }
            box.innerHTML = rows.map((r, idx) => `
                <div class="gv-mixer-row">
                    <div>
                        <div style="font-weight:700; font-size:13.5px; color:#0f172a;">${idx + 1}. ${escapeAttr(r.type)} ${r.isCustom ? '<span style="background:#f3e8ff; color:#6b21a8; font-size:10.5px; padding:1px 5px; border-radius:4px;">કસ્ટમ</span>' : ''}</div>
                        <div style="font-size:11.5px; color:#64748b;">${escapeAttr(r.defaultInst)}</div>
                    </div>
                    <div style="font-size:12px; color:#475569; font-weight:600;">
                        ઉપલબ્ધ: <strong style="color:${r.count > 0 ? '#15803d' : '#dc2626'};">${r.count}</strong><br>
                        <small>(${r.marksPerQ} ગુણ/પ્રશ્ન)</small>
                    </div>
                    <div>
                        <input type="number" min="0" max="${r.count}" value="${r.desired}" data-idx="${idx}" class="gv-input mx-cnt-inp" style="padding:5px 7px; font-weight:bold; text-align:center;" ${r.count === 0 ? 'disabled' : ''}>
                    </div>
                    <div style="display:flex; gap:4px; justify-content:flex-end;">
                        <button type="button" class="gv-btn gv-btn-outline mx-up" data-idx="${idx}" style="padding:4px 7px; font-size:11px;" title="ઉપર ખસેડો">⬆️</button>
                        <button type="button" class="gv-btn gv-btn-outline mx-dn" data-idx="${idx}" style="padding:4px 7px; font-size:11px;" title="નીચે ખસેડો">⬇️</button>
                        ${r.isCustom ? `<button type="button" class="gv-btn gv-btn-red mx-del-ct" data-type="${escapeAttr(r.type)}" style="padding:4px 7px; font-size:11px;" title="કસ્ટમ પેટા-પ્રકાર હટાવો">🗑️</button>` : ''}
                    </div>
                </div>`).join('');

            box.querySelectorAll('.mx-cnt-inp').forEach(inp => {
                inp.oninput = () => {
                    const idx = Number(inp.dataset.idx);
                    rows[idx].desired = Math.max(0, Math.min(rows[idx].count, parseInt(inp.value, 10) || 0));
                    updateSummary();
                };
            });
            box.querySelectorAll('.mx-up').forEach(b => b.onclick = () => {
                const idx = Number(b.dataset.idx);
                if (idx <= 0) return;
                [rows[idx - 1], rows[idx]] = [rows[idx], rows[idx - 1]];
                renderRows();
            });
            box.querySelectorAll('.mx-dn').forEach(b => b.onclick = () => {
                const idx = Number(b.dataset.idx);
                if (idx >= rows.length - 1) return;
                [rows[idx + 1], rows[idx]] = [rows[idx], rows[idx + 1]];
                renderRows();
            });
            box.querySelectorAll('.mx-del-ct').forEach(b => b.onclick = () => {
                const tName = b.dataset.type;
                window.saveCustomObjectiveSubtypes(window.getCustomObjectiveSubtypes().filter(x => x.type !== tName));
                rows = rows.filter(x => x.type !== tName || x.count > 0);
                rows.forEach(x => { if (x.type === tName) x.isCustom = false; });
                window.showToast(`🗑️ પેટા-પ્રકાર "${tName}" દૂર થયો.`);
                renderRows();
            });
            updateSummary();
        };

        renderRows();

        const closeModal = () => overlay.remove();
        overlay.querySelector('#mxClose').onclick = closeModal;
        overlay.querySelector('#mxCancel').onclick = closeModal;

        overlay.querySelector('#mxResetBoardOrder').onclick = () => {
            window.saveCustomSectionAOrder([]);
            rows.sort((a, b) => window.getObjectiveTypePriority(a.type) - window.getObjectiveTypePriority(b.type));
            window.showToast('🔄 ડિફોલ્ટ GSEB બોર્ડ ક્રમ લાગુ થઈ ગયો.');
            renderRows();
        };

        overlay.querySelector('#mxAddCustomTypeBtn').onclick = () => {
            const nt = overlay.querySelector('#mxNewType').value.trim();
            const ni = overlay.querySelector('#mxNewInst').value.trim();
            if (!nt) return window.showToast('કૃપા કરીને નવા પેટા-પ્રકારનું નામ લખો!', 'error');
            const list = window.getCustomObjectiveSubtypes();
            if (!list.some(x => x.type === nt)) {
                list.push({ type: nt, instruction: ni || `નીચે આપેલા પ્રશ્નોના ઉત્તર લખો (${nt}).`, marks: 1 });
                window.saveCustomObjectiveSubtypes(list);
            }
            if (!rows.some(r => r.type === nt)) {
                rows.push({ type: nt, count: 0, marksPerQ: 1, defaultInst: ni || `નીચે આપેલા પ્રશ્નોના ઉત્તર લખો (${nt}).`, desired: 0, isCustom: true });
            }
            overlay.querySelector('#mxNewType').value = '';
            overlay.querySelector('#mxNewInst').value = '';
            window.showToast(`✅ નવો પેટા-પ્રકાર "${nt}" સેવ થઈ ગયો!`);
            renderRows();
        };

        overlay.querySelector('#mxApply').onclick = () => {
            window.saveCustomSectionAOrder(rows.map(r => r.type));

            const otherSecs = window.draftPaperQuestions.filter(q => (q.section || 'None') !== 'A');
            const usedIds = new Set(otherSecs.map(q => q.id));
            const newSecA = [];

            rows.forEach(r => {
                const need = Math.max(0, Math.min(r.count, Number(r.desired) || 0));
                if (need <= 0) return;
                const cands = pool.filter(q => !usedIds.has(q.id) && String(q.type || '').trim() === r.type).sort(() => Math.random() - 0.5);
                for (let i = 0; i < Math.min(need, cands.length); i++) {
                    newSecA.push({ ...cands[i], section: 'A' });
                    usedIds.add(cands[i].id);
                }
            });

            window.draftPaperQuestions = [...newSecA, ...otherSecs];
            closeModal();
            window.showToast(`✅ વિભાગ-A માં ${newSecA.length} હેતુલક્ષી પ્રશ્નો બોર્ડ ક્રમમાં ઉમેરાઈ ગયા!`);
            window.renderPaperMaker();
        };
    };

    // 🛠️ કસ્ટમ બ્લુપ્રિન્ટ બિલ્ડર મોડલ
    window.openCustomBlueprintModal = function(editId = null) {
        const existingOverlay = document.getElementById('gvBlueprintModal');
        if (existingOverlay) existingOverlay.remove();

        const editBp = editId ? getCustomBlueprints().find(x => x.id === editId) : null;
        let rows = editBp && Array.isArray(editBp.sections)
            ? JSON.parse(JSON.stringify(editBp.sections))
            : [
                { sec: 'A', marks: 1, count: 10, attemptCount: 10, preferTypes: ['ALL'], instruction: 'નીચે આપેલા હેતુલક્ષી પ્રશ્નોના ઉત્તર લખો. (દરેકનો 1 ગુણ)' },
                { sec: 'B', marks: 2, count: 6, attemptCount: 4, preferTypes: ['ALL'], instruction: 'નીચે આપેલા પ્રશ્નોમાંથી કોઈ પણ 4 પ્રશ્નોના ટૂંકમાં ઉત્તર લખો. (દરેકના 2 ગુણ)' },
                { sec: 'C', marks: 3, count: 5, attemptCount: 3, preferTypes: ['ALL'], instruction: 'નીચે આપેલા પ્રશ્નોમાંથી કોઈ પણ 3 પ્રશ્નોના માગ્યા મુજબ ઉત્તર લખો. (દરેકના 3 ગુણ)' },
                { sec: 'D', marks: 4, count: 4, attemptCount: 2, preferTypes: ['ALL'], instruction: 'નીચે આપેલા પ્રશ્નોમાંથી કોઈ પણ 2 પ્રશ્નોના સવિસ્તાર ઉત્તર લખો. (દરેકના 4 ગુણ)' }
            ];

        const allQ = getAllQuestions();
        const typeSet = new Set([...window.BOARD_SECTION_A_ORDER, 'ટૂંકમાં જવાબ આપો', 'માગ્યા મુજબ જવાબ આપો', 'સવિસ્તાર જવાબ આપો']);
        window.getCustomObjectiveSubtypes().forEach(x => { if (x && x.type) typeSet.add(x.type); });
        allQ.forEach(q => { if (q && q.type) typeSet.add(String(q.type)); });
        const typeList = Array.from(typeSet);

        const overlay = document.createElement('div');
        overlay.id = 'gvBlueprintModal';
        overlay.className = 'gv-modal-overlay';
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div class="gv-modal-box" style="max-width:860px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:10px; margin-bottom:12px;">
                    <h3 style="margin:0; color:#5b21b6;">🛠️ ${editBp ? 'કસ્ટમ બ્લુપ્રિન્ટ એડિટ કરો' : 'નવી કસ્ટમ બ્લુપ્રિન્ટ બનાવો'}</h3>
                    <button type="button" id="bpCloseBtn" style="border:none; background:#fee2e2; color:#b91c1c; font-weight:bold; padding:4px 10px; border-radius:6px; cursor:pointer;">✖</button>
                </div>

                <div class="gv-grid-2" style="margin-bottom:12px;">
                    <div>
                        <label style="font-size:12px; font-weight:bold;">બ્લુપ્રિન્ટનું નામ:</label>
                        <input id="bpLabelInp" class="gv-input" placeholder="દા.ત. શાળા કસોટી (40 ગુણ)" value="${escapeAttr(editBp ? editBp.label : '')}">
                    </div>
                    <div>
                        <label style="font-size:12px; font-weight:bold;">પેપરનું શીર્ષક (PDF હેડિંગ):</label>
                        <input id="bpTitleInp" class="gv-input" placeholder="દા.ત. પ્રથમ સત્રાંત પરીક્ષા" value="${escapeAttr(editBp ? editBp.title : '')}">
                    </div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
                    <strong style="font-size:13.5px; color:#1e293b;">📋 વિભાગ વાઈઝ માળખું અને ઓપ્શન સેટ કરો:</strong>
                    <button type="button" id="bpAddSecBtn" class="gv-btn gv-btn-blue" style="padding:5px 10px; font-size:12px;">➕ નવો વિભાગ ઉમેરો</button>
                </div>

                <div id="bpRowsContainer" style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px;"></div>

                <div id="bpSummaryBar" style="background:#f5f3ff; border:1px solid #c4b5fd; border-radius:8px; padding:10px 14px; font-size:13.5px; font-weight:700; color:#4c1d95; margin-bottom:14px;"></div>

                <div style="display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap;">
                    <button type="button" id="bpCancelBtn" class="gv-btn gv-btn-dark">રદ કરો</button>
                    <button type="button" id="bpSaveOnlyBtn" class="gv-btn gv-btn-green">💾 બ્લુપ્રિન્ટ સેવ કરો</button>
                    <button type="button" id="bpSaveAndRunBtn" class="gv-btn gv-btn-purple">⚡ સેવ કરી સીધું પેપર બનાવો</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        const updateSummary = () => {
            let totalGiven = 0, totalAttempt = 0, totalMarks = 0;
            rows.forEach(r => {
                const m = Math.max(1, Number(r.marks) || 1);
                const c = Math.max(1, Number(r.count) || 1);
                const a = (Number(r.attemptCount) > 0 && Number(r.attemptCount) < c) ? Number(r.attemptCount) : c;
                totalGiven += c;
                totalAttempt += a;
                totalMarks += a * m;
            });
            overlay.querySelector('#bpSummaryBar').innerHTML = `🎯 અંદાજિત કુલ ગુણ: <span style="color:#15803d; font-size:16px;">${totalMarks} ગુણ</span> &nbsp;|&nbsp; કુલ પ્રશ્નો (ઓપ્શન સહિત): ${totalGiven} &nbsp;|&nbsp; વિદ્યાર્થીએ લખવાના: ${totalAttempt}`;
        };

        const renderRows = () => {
            const container = overlay.querySelector('#bpRowsContainer');
            container.innerHTML = rows.map((r, idx) => {
                const c = Math.max(1, Number(r.count) || 1);
                const a = Number(r.attemptCount) || 0;
                const m = Math.max(1, Number(r.marks) || 1);
                const hasOpt = a > 0 && a < c;
                const secMarks = (hasOpt ? a : c) * m;
                const prefType = (r.preferTypes && r.preferTypes[0]) ? r.preferTypes[0] : 'ALL';

                return `
                    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-left:4px solid #7c3aed; border-radius:8px; padding:10px;">
                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(115px, 1fr)); gap:8px; align-items:end; margin-bottom:8px;">
                            <div>
                                <label style="font-size:11.5px; font-weight:bold;">વિભાગ:</label>
                                <select data-idx="${idx}" data-field="sec" class="gv-input bp-inp" style="padding:5px;">
                                    ${['A','B','C','D','E','F','G'].map(s => `<option value="${s}" ${r.sec === s ? 'selected' : ''}>વિભાગ ${s}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label style="font-size:11.5px; font-weight:bold;">પ્રશ્ન દીઠ ગુણ:</label>
                                <input type="number" min="1" max="20" data-idx="${idx}" data-field="marks" class="gv-input bp-inp" style="padding:5px;" value="${m}">
                            </div>
                            <div>
                                <label style="font-size:11.5px; font-weight:bold;">કુલ પ્રશ્નો આપવા:</label>
                                <input type="number" min="1" max="100" data-idx="${idx}" data-field="count" class="gv-input bp-inp" style="padding:5px;" value="${c}">
                            </div>
                            <div>
                                <label style="font-size:11.5px; font-weight:bold; color:#6d28d9;">લખવાના (ઓપ્શન):</label>
                                <input type="number" min="1" max="100" data-idx="${idx}" data-field="attemptCount" class="gv-input bp-inp" style="padding:5px; border-color:#a78bfa;" value="${a || c}" title="કુલ પ્રશ્નો કરતાં ઓછા નાખશો તો 'કોઈ પણ X' ઓપ્શન આપોઆપ ઉમેરાશે">
                            </div>
                            <div>
                                <label style="font-size:11.5px; font-weight:bold;">પ્રશ્નનો પ્રકાર:</label>
                                <select data-idx="${idx}" data-field="preferType" class="gv-input bp-inp" style="padding:5px;">
                                    <option value="ALL">બધા પ્રકાર (બોર્ડ ક્રમ)</option>
                                    ${typeList.map(t => `<option value="${escapeAttr(t)}" ${prefType === t ? 'selected' : ''}>${escapeAttr(t)}</option>`).join('')}
                                </select>
                            </div>
                            <div style="display:flex; align-items:center; justify-content:space-between; gap:4px;">
                                <span style="font-size:12px; font-weight:bold; color:${hasOpt ? '#6d28d9' : '#15803d'};">
                                    ${hasOpt ? `કોઈ પણ ${a}` : 'ફરજિયાત'} (${secMarks} ગુણ)
                                </span>
                                ${rows.length > 1 ? `<button type="button" class="gv-btn gv-btn-red bp-del-row" data-idx="${idx}" style="padding:4px 8px; font-size:11px;">✖</button>` : ''}
                            </div>
                        </div>
                        <div>
                            <input type="text" data-idx="${idx}" data-field="instruction" class="gv-input bp-inp" style="padding:5px 8px; font-size:12.5px;" placeholder="વિભાગની સૂચના (વૈકલ્પિક — ખાલી રાખશો તો ઓટોમેટિક આવશે)" value="${escapeAttr(r.instruction || '')}">
                        </div>
                    </div>`;
            }).join('');

            container.querySelectorAll('.bp-inp').forEach(el => {
                el.onchange = () => {
                    const idx = Number(el.dataset.idx);
                    const f = el.dataset.field;
                    if (f === 'marks' || f === 'count' || f === 'attemptCount') {
                        rows[idx][f] = parseInt(el.value, 10) || 1;
                        renderRows();
                    } else if (f === 'preferType') {
                        rows[idx].preferTypes = el.value === 'ALL' ? [] : [el.value];
                    } else {
                        rows[idx][f] = el.value;
                    }
                    updateSummary();
                };
            });

            container.querySelectorAll('.bp-del-row').forEach(btn => {
                btn.onclick = () => {
                    rows.splice(Number(btn.dataset.idx), 1);
                    renderRows();
                    updateSummary();
                };
            });
            updateSummary();
        };

        renderRows();

        const closeModal = () => overlay.remove();
        overlay.querySelector('#bpCloseBtn').onclick = closeModal;
        overlay.querySelector('#bpCancelBtn').onclick = closeModal;

        overlay.querySelector('#bpAddSecBtn').onclick = () => {
            const nextLetters = ['A','B','C','D','E','F','G'];
            const usedSecs = new Set(rows.map(r => r.sec));
            const nextSec = nextLetters.find(l => !usedSecs.has(l)) || 'E';
            rows.push({ sec: nextSec, marks: 2, count: 5, attemptCount: 3, preferTypes: [], instruction: '' });
            renderRows();
        };

        const saveHandler = (runImmediately) => {
            const label = overlay.querySelector('#bpLabelInp').value.trim();
            if (!label) return window.showToast('કૃપા કરીને બ્લુપ્રિન્ટનું નામ લખો!', 'error');

            const cleanSections = rows.map(r => {
                const m = Math.max(1, Number(r.marks) || 1);
                const c = Math.max(1, Number(r.count) || 1);
                const a = (Number(r.attemptCount) > 0 && Number(r.attemptCount) < c) ? Number(r.attemptCount) : c;
                const cleanPref = Array.isArray(r.preferTypes) ? r.preferTypes.filter(t => t && t !== 'ALL') : [];
                return {
                    sec: r.sec || 'A',
                    marks: m,
                    count: c,
                    attemptCount: a,
                    attempt: a < c ? `કોઈ પણ ${a}` : '',
                    useBoardObjectiveMix: (r.sec === 'A' && m === 1 && cleanPref.length === 0),
                    preferTypes: cleanPref,
                    instruction: (r.instruction || '').trim()
                };
            });

            const targetMarks = cleanSections.reduce((s, r) => s + (r.attemptCount * r.marks), 0);
            const desc = cleanSections.map(r => r.attemptCount < r.count ? `${r.sec}: ${r.count} માંથી ${r.attemptCount}×${r.marks}` : `${r.sec}: ${r.count}×${r.marks}`).join(' | ');

            const bpObj = {
                id: editBp ? editBp.id : ('CBP_' + Date.now()),
                label: label,
                title: overlay.querySelector('#bpTitleInp').value.trim() || `${label} (${targetMarks} ગુણ)`,
                desc: desc,
                targetMarks: targetMarks,
                sections: cleanSections
            };

            let allBps = getCustomBlueprints();
            if (editBp) {
                const idx = allBps.findIndex(x => x.id === editBp.id);
                if (idx !== -1) allBps[idx] = bpObj;
            } else {
                allBps.push(bpObj);
            }
            saveCustomBlueprints(allBps);
            closeModal();
            window.showToast(`✅ કસ્ટમ બ્લુપ્રિન્ટ "${bpObj.label}" સેવ થઈ ગઈ!`);

            if (runImmediately) {
                window.gvGenerateFromBlueprint(bpObj);
            } else {
                window.renderPaperMaker();
            }
        };

        overlay.querySelector('#bpSaveOnlyBtn').onclick = () => saveHandler(false);
        overlay.querySelector('#bpSaveAndRunBtn').onclick = () => saveHandler(true);
    };

    // ==========================================
    // 📊 9. DASHBOARD RENDERER
    // ==========================================
    window.startMakerForSubject = function(std, sub) {
        window.pmSelectedStd = std || 'ALL';
        window.pmSelectedSub = sub || 'ALL';
        window.pmChaptersInitializedKey = '';
        window.switchTab('maker');
    };

    window.renderDashboard = function() {
        const box = document.getElementById('gvDashboardContainer');
        if (!box) return;
        const allQ = getAllQuestions();
        const papers = getAllPapers();
        const customBps = getCustomBlueprints();
        const school = JSON.parse(localStorage.getItem('gyanVruksh_schoolProfile')) || { name: 'જ્ઞાન વૃક્ષ વિદ્યાલય', address: '' };

        const uniqueSubs = new Set(allQ.map(q => `${q.standard || ''}-${q.subject || ''}`).filter(x => x !== '-'));
        const uniqueChaps = new Set(allQ.map(q => `${q.standard || ''}-${q.subject || ''}-${q.chapter || ''}`).filter(x => x !== '--'));

        const groupMap = new Map();
        allQ.forEach(q => {
            const std = String(q.standard || '-');
            const sub = String(q.subject || '-');
            const key = `${std}|||${sub}`;
            if (!groupMap.has(key)) groupMap.set(key, { std, sub, count: 0, chaps: new Set() });
            const g = groupMap.get(key);
            g.count++;
            if (q.chapter) g.chaps.add(String(q.chapter));
        });

        const groupRows = Array.from(groupMap.values())
            .sort((a, b) => Number(a.std) - Number(b.std) || a.sub.localeCompare(b.sub))
            .map(g => `
                <tr>
                    <td><strong>ધોરણ ${escapeAttr(g.std)}</strong></td>
                    <td>${escapeAttr(g.sub)}</td>
                    <td>${g.chaps.size} પ્રકરણ</td>
                    <td><strong>${g.count}</strong> પ્રશ્નો</td>
                    <td>
                        <button type="button" class="gv-btn gv-btn-blue" style="padding:5px 10px; font-size:12px;" onclick="window.startMakerForSubject('${escapeJsArg(g.std)}', '${escapeJsArg(g.sub)}')">📝 પેપર બનાવો</button>
                    </td>
                </tr>`).join('');

        box.innerHTML = `
            <div class="gv-card" style="background:linear-gradient(135deg, #eff6ff, #f5f3ff); border-color:#bfdbfe;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                    <div>
                        <h2 style="margin:0 0 4px 0; color:#1e3a8a; font-size:20px;">🏫 ${escapeAttr(school.name)}</h2>
                        <div style="font-size:13.5px; color:#475569;">${school.address ? escapeAttr(school.address) : 'સ્માર્ટ પ્રશ્નપત્ર અને Answer Key જનરેટર ડેશબોર્ડ'}</div>
                    </div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button type="button" class="gv-btn gv-btn-blue" onclick="window.switchTab('maker')">📝 નવું પેપર બનાવો</button>
                        <button type="button" class="gv-btn gv-btn-orange" onclick="window.openOnlineLibraryModal()">☁️ ઓનલાઈન લાઈબ્રેરી</button>
                        <button type="button" class="gv-btn gv-btn-green" onclick="window.openAddModal(event)">➕ નવો પ્રશ્ન</button>
                        <button type="button" class="gv-btn gv-btn-purple" onclick="window.openPasteJSONModal(event)">📋 JSON પેસ્ટ</button>
                        <button type="button" class="gv-btn gv-btn-teal" onclick="window.triggerImport(event)">📥 JSON ફાઈલ</button>
                    </div>
                </div>
            </div>

            <div class="gv-stat-grid">
                <div class="gv-stat-card" style="border-top:4px solid #2563eb;">
                    <div class="gv-stat-val" style="color:#1d4ed8;">${allQ.length}</div>
                    <div class="gv-stat-lbl">📚 કુલ પ્રશ્નો</div>
                </div>
                <div class="gv-stat-card" style="border-top:4px solid #16a34a;">
                    <div class="gv-stat-val" style="color:#15803d;">${uniqueSubs.size}</div>
                    <div class="gv-stat-lbl">📖 કુલ વિષયો</div>
                </div>
                <div class="gv-stat-card" style="border-top:4px solid #7c3aed;">
                    <div class="gv-stat-val" style="color:#6d28d9;">${uniqueChaps.size}</div>
                    <div class="gv-stat-lbl">📑 કુલ પ્રકરણો</div>
                </div>
                <div class="gv-stat-card" style="border-top:4px solid #ea580c;">
                    <div class="gv-stat-val" style="color:#c2410c;">${papers.length}</div>
                    <div class="gv-stat-lbl">📂 સેવ કરેલા પેપર</div>
                </div>
                <div class="gv-stat-card" style="border-top:4px solid #0d9488;">
                    <div class="gv-stat-val" style="color:#0f766e;">${customBps.length}</div>
                    <div class="gv-stat-lbl">🛠️ કસ્ટમ બ્લુપ્રિન્ટ</div>
                </div>
            </div>

            <div class="gv-card">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
                    <h3 style="margin:0; color:#1e293b;">📊 ધોરણ અને વિષય મુજબ પ્રશ્ન બેંક</h3>
                    <button type="button" class="gv-btn gv-btn-outline" style="padding:5px 10px; font-size:12px;" onclick="window.switchTab('bank')">📚 બધા પ્રશ્નો જુઓ</button>
                </div>
                ${groupRows ? `
                    <div style="overflow-x:auto;">
                        <table class="gv-dash-table">
                            <thead><tr><th>ધોરણ</th><th>વિષય</th><th>પ્રકરણો</th><th>કુલ પ્રશ્નો</th><th>ઝડપી કાર્ય</th></tr></thead>
                            <tbody>${groupRows}</tbody>
                        </table>
                    </div>` : `
                    <div style="text-align:center; padding:24px; color:#64748b;">
                        પ્રશ્ન બેંક હજુ ખાલી છે. ઉપરના <strong>☁️ ઓનલાઈન લાઈબ્રેરી</strong>, <strong>📋 JSON પેસ્ટ</strong> અથવા <strong>📥 JSON ફાઈલ</strong> બટનથી પ્રશ્નો ઉમેરો.
                    </div>`}
            </div>
        `;
    };

    // ==========================================
    // 📚 10. QUESTION BANK RENDERER (DYNAMIC FILTERS + FILTERED EXPORT + ONLINE LIBRARY)
    // ==========================================
    window.renderQuestions = function() {
        const container = document.getElementById('questionListContainer');
        if (!container) return;

        const allQ = getAllQuestions();
        const stds = Array.from(new Set(allQ.map(q => String(q.standard || '')))).filter(Boolean).sort((a,b) => Number(a) - Number(b));
        if (window.currentStdFilter !== 'ALL' && !stds.includes(window.currentStdFilter)) window.currentStdFilter = 'ALL';

        const qByStd = allQ.filter(q => window.currentStdFilter === 'ALL' || String(q.standard) === window.currentStdFilter);
        const subs = Array.from(new Set(qByStd.map(q => String(q.subject || '')))).filter(Boolean).sort();
        if (window.currentSubFilter !== 'ALL' && !subs.includes(window.currentSubFilter)) window.currentSubFilter = 'ALL';

        const qBySub = qByStd.filter(q => window.currentSubFilter === 'ALL' || String(q.subject) === window.currentSubFilter);
        const chaps = Array.from(new Set(qBySub.map(q => String(q.chapter || '')))).filter(Boolean).sort((a,b) => Number(a) - Number(b));
        if (window.currentChapFilter !== 'ALL' && !chaps.includes(window.currentChapFilter)) window.currentChapFilter = 'ALL';

        const types = Array.from(new Set(qBySub.map(q => String(q.type || '')))).filter(Boolean).sort();
        if (window.currentTypeFilter !== 'ALL' && !types.includes(window.currentTypeFilter)) window.currentTypeFilter = 'ALL';

        const insts = Array.from(new Set(qBySub.map(q => window.getEffectiveInstruction(q)))).filter(Boolean).sort();
        if (window.currentInstFilter !== 'ALL' && !insts.includes(window.currentInstFilter)) window.currentInstFilter = 'ALL';

        const filteredQ = qBySub.filter(q => {
            const okChap = window.currentChapFilter === 'ALL' || String(q.chapter) === window.currentChapFilter;
            const okType = window.currentTypeFilter === 'ALL' || String(q.type) === window.currentTypeFilter;
            const okInst = window.currentInstFilter === 'ALL' || window.getEffectiveInstruction(q) === window.currentInstFilter;
            const okSearch = !window.currentSearchQuery.trim() || `${q.text} ${q.answer} ${q.chapter} ${q.type} ${q.subject}`.toLowerCase().includes(window.currentSearchQuery.toLowerCase());
            return okChap && okType && okInst && okSearch;
        });

        const draftIdSet = new Set(window.draftPaperQuestions.map(x => x.id));
        const hasSubFilter = window.currentStdFilter !== 'ALL' || window.currentSubFilter !== 'ALL' || window.currentChapFilter !== 'ALL';

        container.innerHTML = `
            <div class="gv-card">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
                    <h3 style="margin:0; color:#1e3a8a;">📚 પ્રશ્ન બેંક (${filteredQ.length} / ${allQ.length} પ્રશ્નો)</h3>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button type="button" class="gv-btn gv-btn-orange" onclick="window.openOnlineLibraryModal()">☁️ ઓનલાઈન લાઈબ્રેરી</button>
                        <button type="button" class="gv-btn gv-btn-green" onclick="window.openAddModal(event)">➕ નવો પ્રશ્ન</button>
                        <button type="button" class="gv-btn gv-btn-purple" onclick="window.openPasteJSONModal(event)">📋 JSON પેસ્ટ</button>
                        <button type="button" class="gv-btn gv-btn-blue" onclick="window.triggerImport(event)">📥 JSON ફાઈલ</button>
                        ${hasSubFilter ? `<button type="button" class="gv-btn gv-btn-teal" onclick="window.exportQuestionBank(true)" title="માત્ર ફિલ્ટર કરેલા ધોરણ-વિષયની ફાઈલ ડાઉનલોડ કરો">💾 આ વિષયનો બેકઅપ</button>` : ''}
                        <button type="button" class="gv-btn gv-btn-dark" onclick="window.exportQuestionBank(false)">💾 ફૂલ બેકઅપ</button>
                        <button type="button" class="gv-btn gv-btn-outline" id="btnToggleAnsMode">${window.hideAnswersMode ? '👁️ જવાબ બતાવો' : '🙈 જવાબ છુપાવો'}</button>
                        <button type="button" class="gv-btn gv-btn-red" onclick="window.clearQuestionBank()">🗑️ ખાલી કરો</button>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:8px;">
                    <input type="text" id="qbSearchInp" class="gv-input" placeholder="🔍 પ્રશ્ન / જવાબ શોધો..." value="${escapeAttr(window.currentSearchQuery)}">
                    <select id="qbStdSel" class="gv-input"><option value="ALL">બધા ધોરણ</option>${stds.map(s => `<option value="${escapeAttr(s)}" ${window.currentStdFilter === s ? 'selected' : ''}>ધોરણ ${escapeAttr(s)}</option>`).join('')}</select>
                    <select id="qbSubSel" class="gv-input"><option value="ALL">બધા વિષયો</option>${subs.map(s => `<option value="${escapeAttr(s)}" ${window.currentSubFilter === s ? 'selected' : ''}>${escapeAttr(s)}</option>`).join('')}</select>
                    <select id="qbChapSel" class="gv-input"><option value="ALL">બધા પ્રકરણ</option>${chaps.map(c => `<option value="${escapeAttr(c)}" ${window.currentChapFilter === c ? 'selected' : ''}>પ્રકરણ ${escapeAttr(c)}</option>`).join('')}</select>
                    <select id="qbTypeSel" class="gv-input"><option value="ALL">બધા પ્રકાર</option>${types.map(t => `<option value="${escapeAttr(t)}" ${window.currentTypeFilter === t ? 'selected' : ''}>${escapeAttr(t)}</option>`).join('')}</select>
                    <select id="qbInstSel" class="gv-input" style="border-color:#7c3aed; background:#faf5ff;"><option value="ALL">📌 બધી સૂચનાઓ</option>${insts.map(i => `<option value="${escapeAttr(i)}" ${window.currentInstFilter === i ? 'selected' : ''}>${escapeAttr(i.length > 42 ? i.substring(0, 42) + '...' : i)}</option>`).join('')}</select>
                </div>
            </div>
            <div id="qbCardsList"></div>
        `;

        container.querySelector('#btnToggleAnsMode').onclick = () => { window.hideAnswersMode = !window.hideAnswersMode; window.renderQuestions(); };
        container.querySelector('#qbStdSel').onchange = (e) => { window.currentStdFilter = e.target.value; window.bankVisibleLimit = 60; window.renderQuestions(); };
        container.querySelector('#qbSubSel').onchange = (e) => { window.currentSubFilter = e.target.value; window.bankVisibleLimit = 60; window.renderQuestions(); };
        container.querySelector('#qbChapSel').onchange = (e) => { window.currentChapFilter = e.target.value; window.bankVisibleLimit = 60; window.renderQuestions(); };
        container.querySelector('#qbTypeSel').onchange = (e) => { window.currentTypeFilter = e.target.value; window.bankVisibleLimit = 60; window.renderQuestions(); };
        container.querySelector('#qbInstSel').onchange = (e) => { window.currentInstFilter = e.target.value; window.bankVisibleLimit = 60; window.renderQuestions(); };
        container.querySelector('#qbSearchInp').oninput = (e) => {
            window.currentSearchQuery = e.target.value;
            window.bankVisibleLimit = 60;
            window.renderQuestions();
            const inp = document.getElementById('qbSearchInp');
            if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
        };

        const listBox = container.querySelector('#qbCardsList');
        if (filteredQ.length === 0) {
            listBox.innerHTML = '<div class="gv-card" style="text-align:center; color:#64748b; padding:24px;">પસંદ કરેલા ફિલ્ટર મુજબ કોઈ પ્રશ્ન મળ્યો નથી.</div>';
            return;
        }

        const visibleItems = filteredQ.slice(0, window.bankVisibleLimit);
        visibleItems.forEach((q, idx) => {
            const card = document.createElement('div');
            card.className = 'gv-card';
            const inDraft = draftIdSet.has(q.id);
            const effInst = window.getEffectiveInstruction(q);
            let qText = window.formatScienceAndMath(q.text || '').replace(/\\n|\n/g, '<br>');
            if (q.type === 'MCQ') qText = qText.replace(/\(A\)/g, '<br>(A)').replace(/\(C\)/g, '&nbsp;&nbsp;&nbsp;&nbsp;(C)');
            let ansHTML = window.formatScienceAndMath(q.answer || '').replace(/\\n|\n/g, '<br>');

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom:8px; border-bottom:1px solid #f1f5f9; padding-bottom:6px;">
                    <div style="font-size:12px; font-weight:700; color:#475569; display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                        <span style="background:#eff6ff; color:#1d4ed8; padding:2px 7px; border-radius:4px;">#${idx + 1}</span>
                        <span>ધો. ${escapeAttr(q.standard || '-')}</span>
                        <span>• ${escapeAttr(q.subject || '-')}</span>
                        <span>• પ્રકરણ ${escapeAttr(q.chapter || '-')}</span>
                        <span style="background:#f5f3ff; color:#6d28d9; padding:2px 7px; border-radius:4px;">${escapeAttr(q.type || '-')}</span>
                        <span style="background:#f0fdf4; color:#15803d; padding:2px 7px; border-radius:4px;">${q.marks || 1} ગુણ</span>
                        ${q.image ? '<span style="background:#dbeafe; color:#1e40af; padding:2px 6px; border-radius:4px;">🖼️ પ્રશ્ન ઈમેજ</span>' : ''}
                        ${q.solutionImage ? '<span style="background:#dcfce7; color:#166534; padding:2px 6px; border-radius:4px;">🖼️ ઉત્તર ઈમેજ</span>' : ''}
                    </div>
                    <div style="display:flex; gap:5px; flex-wrap:wrap;">
                        <button type="button" class="gv-btn ${inDraft ? 'gv-btn-green' : 'gv-btn-blue'} btn-add-draft-q" data-id="${escapeAttr(q.id)}" style="padding:4px 9px; font-size:12px;">${inDraft ? '✅ ડ્રાફ્ટમાં છે' : '➕ ડ્રાફ્ટમાં ઉમેરો'}</button>
                        <button type="button" class="gv-btn gv-btn-outline btn-edit-q" data-id="${escapeAttr(q.id)}" style="padding:4px 8px; font-size:12px;" title="એડિટ / ઈમેજ ઉમેરો">✏️/🖼️</button>
                        <button type="button" class="gv-btn gv-btn-outline btn-copy-q" data-id="${escapeAttr(q.id)}" style="padding:4px 8px; font-size:12px;">📋</button>
                        <button type="button" class="gv-btn gv-btn-red btn-delete-q" data-id="${escapeAttr(q.id)}" style="padding:4px 8px; font-size:12px;">🗑️</button>
                    </div>
                </div>
                ${effInst ? `<div style="font-size:12px; color:#6d28d9; font-weight:600; margin-bottom:6px;">📌 ${escapeAttr(effInst)}</div>` : ''}
                <div style="font-size:14.5px; line-height:1.85; color:#0f172a;">${qText}</div>
                ${q.image ? `<img src="${q.image}" class="gv-card-img" alt="પ્રશ્ન આકૃતિ">` : ''}
                ${!window.hideAnswersMode && (q.answer || q.solutionImage) ? `<div style="margin-top:8px; padding:8px 12px; background:#f8fafc; border-left:3px solid #16a34a; border-radius:4px; font-size:14px; line-height:1.8;"><strong>ઉત્તર:</strong> ${ansHTML}${q.solutionImage ? `<img src="${q.solutionImage}" class="gv-card-img" alt="ઉત્તર આકૃતિ">` : ''}</div>` : ''}
            `;
            listBox.appendChild(card);
        });

        if (filteredQ.length > window.bankVisibleLimit) {
            const loadMoreDiv = document.createElement('div');
            loadMoreDiv.style.textAlign = 'center';
            loadMoreDiv.innerHTML = `<button type="button" class="gv-btn gv-btn-blue" onclick="window.bankVisibleLimit += 60; window.renderQuestions();">⬇️ વધુ પ્રશ્નો બતાવો (${filteredQ.length - window.bankVisibleLimit} બાકી)</button>`;
            listBox.appendChild(loadMoreDiv);
        }

        listBox.querySelectorAll('.btn-add-draft-q').forEach(b => b.onclick = () => window.quickAddToDraftFromBank(b.dataset.id));
        listBox.querySelectorAll('.btn-edit-q').forEach(b => b.onclick = () => {
            const qObj = allQ.find(x => x.id === b.dataset.id);
            if (qObj) window.openAddModal(null, qObj);
        });
        listBox.querySelectorAll('.btn-delete-q').forEach(b => b.onclick = () => {
            window.customConfirm("શું આ પ્રશ્ન ડીલીટ કરવો છે?", () => {
                saveAllQuestions(allQ.filter(x => x.id !== b.dataset.id));
                window.showToast("પ્રશ્ન ડીલીટ થઈ ગયો.");
                window.refreshData();
            });
        });
        listBox.querySelectorAll('.btn-copy-q').forEach(b => b.onclick = () => {
            const qObj = allQ.find(x => x.id === b.dataset.id);
            if (!qObj) return;
            const shareText = `*પ્રશ્ન (${qObj.marks} ગુણ):*\n${(qObj.text || '').replace(/<[^>]*>?/gm, '')}\n\n*ઉત્તર:*\n${(qObj.answer || '').replace(/<[^>]*>?/gm, '')}`;
            navigator.clipboard.writeText(shareText).then(() => window.showToast("📋 પ્રશ્ન કોપી થઈ ગયો!"));
        });
    };

    // ==========================================
    // 📝 11. PAPER MAKER RENDERER
    // ==========================================
    window.renderPaperMaker = function() {
        const box = document.getElementById('gvPaperMakerContainer');
        if (!box) return;
        const allQ = getAllQuestions();

        const stds = Array.from(new Set(allQ.map(q => String(q.standard || '')))).filter(Boolean).sort((a,b) => Number(a) - Number(b));
        if (window.pmSelectedStd !== 'ALL' && !stds.includes(window.pmSelectedStd)) window.pmSelectedStd = 'ALL';

        const subs = Array.from(new Set(allQ.filter(q => window.pmSelectedStd === 'ALL' || String(q.standard) === window.pmSelectedStd).map(q => String(q.subject || '')))).filter(Boolean).sort();
        if (window.pmSelectedSub !== 'ALL' && !subs.includes(window.pmSelectedSub)) window.pmSelectedSub = 'ALL';

        const availChaps = getAvailableChaptersForMaker(allQ);
        const initKey = `${window.pmSelectedStd}|||${window.pmSelectedSub}|||${availChaps.length}`;
        if (window.pmChaptersInitializedKey !== initKey) {
            window.pmSelectedChapters = availChaps.map(x => x[0]);
            window.pmChaptersInitializedKey = initKey;
        }

        const pool = getFilteredPaperPool();
        const totalDraftMarks = window.calculatePaperTotalMarks(window.draftPaperQuestions, window.draftPaperMeta);

        const secOrderList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'None'];
        const activeDraftSections = [];
        secOrderList.forEach(s => {
            const sQs = window.draftPaperQuestions.filter(q => (q.section || 'None') === s && q.type !== 'instruction');
            if (sQs.length > 0) {
                const meta = (window.draftPaperMeta && window.draftPaperMeta[s]) ? window.draftPaperMeta[s] : {};
                const effMarks = window.calculateSectionEffectiveMarks(sQs, meta);
                activeDraftSections.push({ sec: s, qs: sQs, meta, effMarks });
            }
        });

        const secSummaryBadges = activeDraftSections.map(item => {
            const optLbl = (item.meta.attempt && item.meta.attempt.trim()) ? ` • ${escapeAttr(item.meta.attempt.trim())}` : '';
            const secName = item.sec === 'None' ? 'સામાન્ય' : `વિભાગ ${item.sec}`;
            return `<span style="background:#f1f5f9; border:1px solid #cbd5e1; padding:2px 8px; border-radius:4px; font-size:12px;">${secName}: <strong>${item.effMarks} ગુણ</strong>${optLbl}</span>`;
        }).join(' ');

        const chapCheckboxesHTML = availChaps.length === 0
            ? '<span style="font-size:13px; color:#64748b;">કોઈ પ્રકરણ ઉપલબ્ધ નથી. પહેલા પ્રશ્નો ઉમેરો.</span>'
            : availChaps.map(([chap, cnt]) => {
                const isChecked = window.pmSelectedChapters.includes(chap);
                return `
                    <label class="gv-chap-chip ${isChecked ? 'checked' : ''}" onclick="event.preventDefault(); window.pmToggleChapter('${escapeJsArg(chap)}');">
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

        const customBps = getCustomBlueprints();
        const customBpButtonsHTML = customBps.length === 0
            ? `<div style="font-size:13px; color:#64748b; padding:6px 0;">હજુ કોઈ કસ્ટમ બ્લુપ્રિન્ટ બનાવેલ નથી. ઉપરના <strong>➕ નવી કસ્ટમ બ્લુપ્રિન્ટ બનાવો</strong> બટન પર ક્લિક કરીને તમારી શાળા મુજબની બ્લુપ્રિન્ટ અને વિભાગ વાઈઝ ઓપ્શન સેટ કરો.</div>`
            : `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(235px, 1fr)); gap:8px;">
                ${customBps.map(bp => `
                    <div style="background:#fff; border:1.5px solid #99f6e4; border-left:4px solid #0d9488; border-radius:8px; padding:10px 12px; display:flex; flex-direction:column; justify-content:space-between; gap:8px;">
                        <div style="cursor:pointer;" onclick="window.gvGenerateCustomBlueprint('${escapeJsArg(bp.id)}')">
                            <div style="font-weight:700; font-size:13.5px; color:#0f172a; margin-bottom:3px;">🛠️ ${escapeAttr(bp.label)} <span style="color:#0f766e;">(${bp.targetMarks} ગુણ)</span></div>
                            <div style="font-size:11.5px; color:#475569; font-weight:600;">${escapeAttr(bp.desc)}</div>
                        </div>
                        <div style="display:flex; gap:5px; justify-content:flex-end; border-top:1px dashed #e2e8f0; padding-top:6px;">
                            <button type="button" class="gv-btn gv-btn-teal" style="padding:4px 9px; font-size:11.5px;" onclick="window.gvGenerateCustomBlueprint('${escapeJsArg(bp.id)}')">⚡ પેપર બનાવો</button>
                            <button type="button" class="gv-btn gv-btn-outline" style="padding:4px 8px; font-size:11.5px;" onclick="window.openCustomBlueprintModal('${escapeJsArg(bp.id)}')">✏️</button>
                            <button type="button" class="gv-btn gv-btn-red" style="padding:4px 8px; font-size:11.5px;" onclick="window.deleteCustomBlueprint('${escapeJsArg(bp.id)}')">🗑️</button>
                        </div>
                    </div>`).join('')}
            </div>`;

        const draftSectionOptionsHTML = activeDraftSections.length === 0 ? '' : `
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:10px 12px; margin-bottom:12px;">
                <div style="font-weight:700; font-size:13.5px; color:#5b21b6; margin-bottom:8px;">⚙️ વિભાગ વાઈઝ ઓપ્શન (દા.ત. કોઈ પણ 3) અને સૂચના સેટ કરો:</div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    ${activeDraftSections.map(item => {
                        const s = item.sec;
                        const sLabel = s === 'None' ? 'વિભાગ વગર' : `વિભાગ - ${s}`;
                        const qCount = item.qs.length;
                        const attCount = Number(item.meta.attemptCount) > 0 && Number(item.meta.attemptCount) < qCount ? Number(item.meta.attemptCount) : '';
                        const attText = item.meta.attempt || '';
                        const instText = item.meta.instruction || '';
                        return `
                            <div class="gv-sec-opt-row">
                                <div style="font-size:13px;">
                                    <strong style="color:#1e3a8a;">${sLabel}</strong>
                                    <div style="font-size:11.5px; color:#64748b;">પ્રશ્નો: ${qCount} | <strong style="color:#15803d;">${item.effMarks} ગુણ</strong></div>
                                </div>
                                <div>
                                    <label style="font-size:11px; color:#6d28d9; font-weight:700; display:block;">કોઈ પણ કેટલા લખવાના?</label>
                                    <input type="number" min="1" max="${qCount}" value="${attCount}" placeholder="બધા (${qCount})" class="gv-input" style="padding:4px 7px; font-size:12.5px; border-color:#c4b5fd;" onchange="window.updateDraftSectionMeta('${s}', 'attemptCount', this.value, true)">
                                </div>
                                <div>
                                    <label style="font-size:11px; color:#475569; font-weight:700; display:block;">ઓપ્શન લખાણ (PDF માં):</label>
                                    <input type="text" value="${escapeAttr(attText)}" placeholder="દા.ત. કોઈ પણ 3" class="gv-input" style="padding:4px 7px; font-size:12.5px;" onchange="window.updateDraftSectionMeta('${s}', 'attempt', this.value, true)">
                                </div>
                                <div>
                                    <label style="font-size:11px; color:#475569; font-weight:700; display:block;">વિભાગની સૂચના (વૈકલ્પિક):</label>
                                    <input type="text" value="${escapeAttr(instText)}" placeholder="દા.ત. કોઈ પણ 3 પ્રશ્નોના ઉત્તર લખો." class="gv-input" style="padding:4px 7px; font-size:12.5px;" oninput="window.updateDraftSectionMeta('${s}', 'instruction', this.value, false)">
                                </div>
                            </div>`;
                    }).join('')}
                </div>
            </div>`;

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
                        <button type="button" onclick="window.pmToggleManualQuestion('${escapeJsArg(q.id)}')" class="gv-btn ${isAdded ? 'gv-btn-green' : 'gv-btn-outline'}" style="padding:5px 10px; font-size:12px; white-space:nowrap; margin-top:2px;">
                            ${isAdded ? '✅ ઉમેરેલ' : '➕ ઉમેરો'}
                        </button>
                        <div style="flex:1; font-size:14px; line-height:1.75;">
                            <div style="font-size:11.5px; color:#475569; font-weight:700; margin-bottom:3px;">
                                <span style="color:#1d4ed8;">પ્ર. ${escapeAttr(q.chapter || '-')}</span> • ${escapeAttr(q.type || '-')} • <span style="color:#15803d;">[${q.marks} ગુણ]</span>
                                ${q.image ? '<span style="color:#1e40af; margin-left:4px;">🖼️ પ્રશ્ન</span>' : ''}
                                ${q.solutionImage ? '<span style="color:#15803d; margin-left:4px;">🖼️ ઉત્તર</span>' : ''}
                            </div>
                            <div>${qText}</div>
                            ${q.image ? `<img src="${q.image}" style="max-height:90px; max-width:100%; border:1px solid #cbd5e1; border-radius:4px; margin-top:5px;">` : ''}
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
                                ${['A','B','C','D','E','F','G','None'].map(s => `<option value="${s}" ${window.pmManualTargetSec === s ? 'selected' : ''}>${s === 'None' ? 'વિભાગ વગર' : 'વિભાગ - ' + s}</option>`).join('')}
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
                <h3 style="margin:0 0 12px 0; color:#1e3a8a;">📝 નવું પ્રશ્નપત્ર બનાવો (ઓટો + બોર્ડ બ્લુપ્રિન્ટ + કસ્ટમ બ્લુપ્રિન્ટ + મેન્યુઅલ)</h3>
                <div class="gv-grid-2" style="margin-bottom:12px;">
                    <div><label style="font-size:12px; font-weight:bold;">પરીક્ષાનું નામ:</label><input id="pmTitle" class="gv-input" value="${escapeAttr(window.pmTitleVal)}"></div>
                    <div><label style="font-size:12px; font-weight:bold;">તારીખ:</label><input id="pmDate" type="date" class="gv-input" value="${window.pmDateVal}"></div>
                    <div><label style="font-size:12px; font-weight:bold;">ધોરણ:</label>
                        <select id="pmStd" class="gv-input"><option value="ALL">બધા ધોરણ</option>${stds.map(s => `<option value="${escapeAttr(s)}" ${window.pmSelectedStd === s ? 'selected' : ''}>${escapeAttr(s)}</option>`).join('')}</select>
                    </div>
                    <div><label style="font-size:12px; font-weight:bold;">વિષય:</label>
                        <select id="pmSub" class="gv-input"><option value="ALL">બધા વિષયો</option>${subs.map(s => `<option value="${escapeAttr(s)}" ${window.pmSelectedSub === s ? 'selected' : ''}>${escapeAttr(s)}</option>`).join('')}</select>
                    </div>
                </div>

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

                <div class="gv-subtab-bar">
                    <button type="button" class="gv-subtab-btn ${window.pmActiveMode === 'auto' ? 'active' : ''}" onclick="window.pmActiveMode='auto'; window.renderPaperMaker();">⚡ ઓટો જનરેટ / 🏆 બોર્ડ & કસ્ટમ બ્લુપ્રિન્ટ</button>
                    <button type="button" class="gv-subtab-btn ${window.pmActiveMode === 'manual' ? 'active' : ''}" onclick="window.pmActiveMode='manual'; window.renderPaperMaker();">✍️ મેન્યુઅલ પ્રશ્નો પસંદ કરો</button>
                    <button type="button" class="gv-btn gv-btn-purple" style="margin-left:auto;" onclick="window.openSectionAMixerModal()">🎯 વિભાગ-A હેતુલક્ષી મિક્સર (પેટા-પ્રકાર)</button>
                </div>

                ${window.pmActiveMode === 'auto' ? `
                    <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; padding:12px; background:#eff6ff; border-radius:8px; border:1px solid #bfdbfe; margin-bottom:12px;">
                        <strong style="font-size:13.5px; color:#1e40af;">⚡ ઓટો પેપર:</strong>
                        <button type="button" class="gv-btn gv-btn-blue" onclick="window.gvAutoPaper(25)">25 ગુણ</button>
                        <button type="button" class="gv-btn gv-btn-blue" onclick="window.gvAutoPaper(50)">50 ગુણ</button>
                        <button type="button" class="gv-btn gv-btn-blue" onclick="window.gvAutoPaper(80)">80 ગુણ</button>
                        <button type="button" class="gv-btn gv-btn-blue" onclick="window.gvAutoPaper(100)">100 ગુણ</button>
                        <div style="display:inline-flex; align-items:center; gap:5px; margin-left:6px;">
                            <input type="number" id="pmCustomMarksInput" min="5" max="200" placeholder="કસ્ટમ ગુણ" style="width:105px; padding:6px 8px; border:1.5px solid #2563eb; border-radius:6px; font-size:13px; font-weight:bold;">
                            <button type="button" class="gv-btn gv-btn-orange" onclick="window.gvAutoPaperCustom()">⚡ બનાવો</button>
                        </div>
                    </div>

                    <div style="padding:12px; background:#faf5ff; border-radius:8px; border:1px solid #ddd6fe; margin-bottom:12px;">
                        <div style="font-weight:bold; font-size:14px; color:#5b21b6; margin-bottom:8px;">🏆 GSEB બોર્ડની પેપર સ્ટાઈલ મુજબ ડાયરેક્ટ પેપર (ઓટો ઓપ્શન સહિત):</div>
                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(215px, 1fr)); gap:8px;">
                            ${boardButtonsHTML}
                        </div>
                    </div>

                    <div style="padding:12px; background:#f0fdfa; border-radius:8px; border:1px solid #99f6e4;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
                            <div style="font-weight:bold; font-size:14px; color:#115e59;">🛠️ તમારી કસ્ટમ બ્લુપ્રિન્ટ્સ (Custom Blueprints):</div>
                            <button type="button" class="gv-btn gv-btn-teal" style="padding:6px 12px; font-size:12.5px;" onclick="window.openCustomBlueprintModal(null)">➕ નવી કસ્ટમ બ્લુપ્રિન્ટ બનાવો</button>
                        </div>
                        ${customBpButtonsHTML}
                    </div>
                ` : manualPickerHTML}
            </div>

            <div class="gv-card" style="border-top:4px solid #16a34a;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                    <div>
                        <h4 style="margin:0 0 4px 0; color:#0f172a;">📄 ડ્રાફ્ટ પેપર (${window.draftPaperQuestions.length} પ્રશ્નો | કુલ <span style="color:#15803d;">${totalDraftMarks} ગુણ</span>)</h4>
                        <div style="display:flex; gap:6px; flex-wrap:wrap;">${secSummaryBadges}</div>
                    </div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button type="button" class="gv-btn gv-btn-outline" style="font-size:12px;" onclick="window.sortDraftSectionAByBoardOrder()" title="વિભાગ-A ના પ્રશ્નો બોર્ડ ક્રમમાં ગોઠવો">🔄 વિભાગ-A બોર્ડ ક્રમ</button>
                        <button type="button" class="gv-btn gv-btn-teal" onclick="window.previewDraftPaper('question')">👁️ ડ્રાફ્ટ પેપર પ્રિવ્યૂ</button>
                        <button type="button" class="gv-btn gv-btn-purple" onclick="window.previewDraftPaper('solution')">🔑 Answer Key પ્રિવ્યૂ</button>
                        <button type="button" class="gv-btn gv-btn-green" onclick="window.saveDraftPaper()">💾 પેપર સેવ કરો</button>
                        <button type="button" class="gv-btn gv-btn-red" id="btnClearDraft">🗑️ ખાલી કરો</button>
                    </div>
                </div>
                ${draftSectionOptionsHTML}
                <div id="draftListBox"></div>
            </div>
        `;

        box.querySelector('#pmTitle').oninput = (e) => { window.pmTitleVal = e.target.value; };
        box.querySelector('#pmDate').onchange = (e) => { window.pmDateVal = e.target.value; };
        box.querySelector('#pmStd').onchange = (e) => { window.pmSelectedStd = e.target.value; window.pmChaptersInitializedKey = ''; window.renderPaperMaker(); };
        box.querySelector('#pmSub').onchange = (e) => { window.pmSelectedSub = e.target.value; window.pmChaptersInitializedKey = ''; window.renderPaperMaker(); };

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

        const draftList = box.querySelector('#draftListBox');
        if (window.draftPaperQuestions.length === 0) {
            draftList.innerHTML = '<p style="color:#64748b; text-align:center; padding:14px 0;">હજુ કોઈ પ્રશ્ન પસંદ કર્યો નથી. ઉપરથી ઓટો પેપર, બોર્ડ સ્ટાઈલ, કસ્ટમ બ્લુપ્રિન્ટ અથવા મેન્યુઅલ ટેબમાંથી પ્રશ્નો ઉમેરો.</p>';
        } else {
            draftList.innerHTML = window.draftPaperQuestions.map((q, idx) => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 6px; border-bottom:1px solid #e2e8f0; gap:8px; flex-wrap:wrap;">
                    <div style="flex:1; min-width:220px; font-size:13.5px; line-height:1.6;">
                        <strong>${idx + 1}.</strong>
                        <span style="color:#1d4ed8; font-size:11.5px; font-weight:700;">[પ્ર.${escapeAttr(q.chapter || '-')}]</span>
                        <span style="color:#6d28d9; font-size:11.5px; font-weight:700;">[${escapeAttr(q.type || '-')}]</span>
                        ${window.formatScienceAndMath(q.text || '').substring(0, 110)}${(q.text || '').length > 110 ? '...' : ''}
                        <span style="color:#15803d; font-weight:bold;">[${q.marks} ગુણ]</span>
                        ${q.image ? '<span style="background:#dbeafe; color:#1e40af; font-size:11px; padding:1px 5px; border-radius:4px; margin-left:3px;">🖼️ પ્રશ્ન</span>' : ''}
                        ${q.solutionImage ? '<span style="background:#dcfce7; color:#166534; font-size:11px; padding:1px 5px; border-radius:4px; margin-left:3px;">🖼️ ઉત્તર</span>' : ''}
                    </div>
                    <div style="display:flex; gap:4px; align-items:center;">
                        <button type="button" class="gv-btn gv-btn-outline" style="padding:3px 6px; font-size:11px;" onclick="window.openQuickDraftImageModal(${idx})" title="ઈમેજ ઉમેરો / એડિટ કરો">🖼️</button>
                        <select onchange="window.pmChangeDraftSection(${idx}, this.value)" style="padding:3px 5px; border:1px solid #cbd5e1; border-radius:4px; font-size:12px; font-weight:bold; color:#5b21b6;">
                            ${['A','B','C','D','E','F','G','None'].map(s => `<option value="${s}" ${(q.section || 'A') === s ? 'selected' : ''}>${s === 'None' ? 'વિભાગ-' : 'વિભાગ ' + s}</option>`).join('')}
                        </select>
                        <button type="button" class="gv-btn gv-btn-outline" style="padding:3px 6px; font-size:11px;" onclick="window.pmMoveDraft(${idx}, -1)">⬆️</button>
                        <button type="button" class="gv-btn gv-btn-outline" style="padding:3px 6px; font-size:11px;" onclick="window.pmMoveDraft(${idx}, 1)">⬇️</button>
                        <button type="button" class="gv-btn gv-btn-red" style="padding:3px 7px; font-size:11px;" onclick="window.pmRemoveDraftQuestion(${idx})">✖</button>
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
    // 📂 12. SAVED PAPERS & SETTINGS RENDERERS
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
            box.innerHTML = '<div class="gv-card" style="text-align:center; color:#64748b; padding:24px;">હજુ સુધી કોઈ પેપર સેવ કરેલ નથી.</div>';
            return;
        }
        box.innerHTML = papers.map(p => `
            <div class="gv-card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <div>
                    <div style="font-weight:bold; font-size:16px; color:#1e3a8a;">${escapeAttr(p.title)}</div>
                    <div style="font-size:13px; color:#475569;">ધોરણ: ${escapeAttr(p.standard || '-')} | વિષય: ${escapeAttr(p.subject || '-')} | તારીખ: ${escapeAttr(p.date || '-')} | કુલ ગુણ: <strong>${p.totalMarks}</strong> | પ્રશ્નો: ${(p.questions || []).length}</div>
                </div>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <button type="button" class="gv-btn gv-btn-teal" onclick="window.previewSavedPaper('${escapeJsArg(p.id)}')">👁️ પ્રિવ્યૂ</button>
                    <button type="button" class="gv-btn gv-btn-orange" onclick="window.loadSavedPaperIntoDraft('${escapeJsArg(p.id)}')">✏️ એડિટ</button>
                    <button type="button" class="gv-btn gv-btn-blue" onclick="window.downloadPDF('${escapeJsArg(p.id)}', 'question')">📄 PDF</button>
                    <button type="button" class="gv-btn gv-btn-green" onclick="window.downloadPDF('${escapeJsArg(p.id)}', 'solution')">🔑 Answer Key</button>
                    <button type="button" class="gv-btn gv-btn-purple" onclick="window.downloadWord('${escapeJsArg(p.id)}', 'question')">📝 Word</button>
                    <button type="button" class="gv-btn gv-btn-red" onclick="window.deleteSavedPaper('${escapeJsArg(p.id)}')">🗑️</button>
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
                <button type="button" class="gv-btn gv-btn-green" id="btnSaveSettings">💾 સેટિંગ્સ સેવ કરો</button>
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
    // 🏗️ 13. NAVIGATION & APP BOOTSTRAPPER
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
                        <div style="font-size:13px; opacity:0.95;">ધોરણ 9 થી 12 • મલ્ટી-સબ્જેક્ટ • કસ્ટમ બ્લુપ્રિન્ટ & ઓટો પેપર</div>
                    </div>
                    <div class="gv-tabs">
                        <button type="button" id="gvTabBtn_dashboard" class="gv-tab-btn active" onclick="window.switchTab('dashboard')">📊 ડેશબોર્ડ</button>
                        <button type="button" id="gvTabBtn_bank" class="gv-tab-btn" onclick="window.switchTab('bank')">📚 પ્રશ્ન બેંક</button>
                        <button type="button" id="gvTabBtn_maker" class="gv-tab-btn" onclick="window.switchTab('maker')">📝 પેપર બનાવો</button>
                        <button type="button" id="gvTabBtn_papers" class="gv-tab-btn" onclick="window.switchTab('papers')">📂 સેવ કરેલા પેપર</button>
                        <button type="button" id="gvTabBtn_settings" class="gv-tab-btn" onclick="window.switchTab('settings')">🏫 શાળા પ્રોફાઈલ</button>
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

    window.refreshData = function() {
        if (typeof window.updateInstructionDatalist === 'function') {
            window.updateInstructionDatalist();
        }
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
