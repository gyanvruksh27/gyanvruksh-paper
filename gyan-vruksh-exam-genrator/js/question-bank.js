// ============================================================================
// 🚀 GYAN VRUKSH MASTER V15.0
// Unified Math/Chem Parser, Section A Match & Grouping, Smart Marks,
// High-Contrast Ans PDF Button, Left '+' Button & Full Readable Manual List
// ============================================================================

(function() {
    let currentTab = 'dashboard';

    // 💾 DRAFT STATE MANAGEMENT (Auto-Save)
    let draftPaper = JSON.parse(localStorage.getItem('gv_draft_paper')) || [];
    let draftSections = JSON.parse(localStorage.getItem('gv_draft_sections')) || {};
    let sectionOrder = JSON.parse(localStorage.getItem('gv_draft_sec_order')) || [];
    let editingPaperId = localStorage.getItem('gv_editing_paper_id') || null;

    const saveDraftState = () => {
        localStorage.setItem('gv_draft_paper', JSON.stringify(draftPaper));
        localStorage.setItem('gv_draft_sections', JSON.stringify(draftSections));
        localStorage.setItem('gv_draft_sec_order', JSON.stringify(sectionOrder));
        if (editingPaperId) localStorage.setItem('gv_editing_paper_id', editingPaperId);
        else localStorage.removeItem('gv_editing_paper_id');
    };

    // 🌟 DEFAULT AUTO-INSTRUCTIONS MAP
    const autoInstMap = {
        'MCQ': 'નીચે આપેલા વિકલ્પોમાંથી યોગ્ય વિકલ્પ પસંદ કરો (દરેકનો 1 ગુણ)',
        'ખાલી જગ્યા': 'નીચે આપેલ વિધાન સાચું બને તે રીતે ખાલી જગ્યા પૂરો (દરેકનો 1 ગુણ)',
        'વિકલ્પ સાથે ખાલી જગ્યા': 'નીચે આપેલ વિધાન સાચું બને તે રીતે યોગ્ય વિકલ્પ પસંદ કરી ખાલી જગ્યા પૂરો (દરેકનો 1 ગુણ)',
        'ખરા-ખોટા': 'નીચે આપેલા વિધાન ખરા છે કે ખોટા તે લખો (દરેકનો 1 ગુણ)',
        'જોડકા જોડો': 'જોડકા જોડો (દરેકના 2 ગુણ)',
        'એક વાક્યમાં જવાબ આપો': 'એક વાક્યમાં જવાબ આપો (દરેકનો 1 ગુણ)',
        'ટૂંકમાં જવાબ આપો': 'નીચેના પ્રશ્નોના ટૂંકમાં જવાબ આપો (દરેકના 2 ગુણ)',
        'માગ્યા મુજબ જવાબ આપો': 'નીચેના પ્રશ્નોના માગ્યા મુજબ જવાબ આપો (દરેકના 3 ગુણ)',
        'સવિસ્તાર જવાબ આપો': 'નીચેના પ્રશ્નોના સવિસ્તાર જવાબ આપો (દરેકના 4 ગુણ)'
    };

    // Preferred type order inside sections (especially Section A)
    const typeSortOrder = [
        'MCQ',
        'ખાલી જગ્યા',
        'વિકલ્પ સાથે ખાલી જગ્યા',
        'ખરા-ખોટા',
        'એક વાક્યમાં જવાબ આપો',
        'જોડકા જોડો',
        'ટૂંકમાં જવાબ આપો',
        'માગ્યા મુજબ જવાબ આપો',
        'સવિસ્તાર જવાબ આપો'
    ];

    // 🎨 1. MASTER CSS
    const injectStyles = () => {
        if (document.getElementById('gvMasterStylesV15')) return;
        const style = document.createElement('style');
        style.id = 'gvMasterStylesV15';
        style.innerHTML = `
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Noto Sans Gujarati', sans-serif; color: #0f172a; }
            .gv-top-nav { background: #0f172a; color: #fff; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 1000; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            .gv-brand { font-size: 20px; font-weight: 900; color: #38bdf8; }
            .gv-nav-links { display: flex; gap: 8px; flex-wrap: wrap; }
            .gv-nav-btn { background: transparent; color: #cbd5e1; border: none; padding: 8px 14px; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer; transition: 0.2s; }
            .gv-nav-btn:hover { background: #334155; color: #fff; }
            .gv-nav-btn.active { background: #2563eb; color: #fff; }

            .gv-main-container { padding: 20px; max-width: 1550px; margin: 0 auto; width: 100%; }
            .gv-tab-content { display: none; animation: fadeIn 0.2s ease-in; }
            .gv-tab-content.active { display: block; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

            .gv-card { background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 20px; border: 1px solid #e2e8f0; }
            .gv-btn { padding: 8px 14px; border: none; border-radius: 5px; font-weight: bold; font-size: 13.5px; cursor: pointer; color: #ffffff; display: inline-flex; align-items: center; justify-content: center; gap: 5px; transition: 0.2s; }
            .gv-btn-blue { background: #2563eb; color: #ffffff; } .gv-btn-blue:hover { background: #1d4ed8; }
            .gv-btn-green { background: #16a34a; color: #ffffff; } .gv-btn-green:hover { background: #15803d; }
            .gv-btn-red { background: #dc2626; color: #ffffff; } .gv-btn-red:hover { background: #b91c1c; }
            .gv-btn-purple { background: #7c3aed; color: #ffffff; } .gv-btn-purple:hover { background: #6d28d9; }
            .gv-btn-dark { background: #334155; color: #ffffff; } .gv-btn-dark:hover { background: #1e293b; }

            /* Crisp, compact circular '+' button on the left */
            .gv-btn-add { background: #2563eb; color: #ffffff; border: none; border-radius: 50%; width: 26px; height: 26px; min-width: 26px; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; line-height: 1; cursor: pointer; transition: 0.15s; box-shadow: 0 2px 4px rgba(37,99,235,0.3); }
            .gv-btn-add:hover { background: #1d4ed8; transform: scale(1.1); }

            .gv-input { width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 5px; margin-bottom: 6px; font-family: inherit; font-size: 13.5px; }
            .gv-form-label { display: block; font-weight: bold; font-size: 13px; margin-bottom: 4px; color: #334155; }

            .gv-q-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 15px; }
            .gv-q-item { background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative; }

            .gv-mcq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 10px; margin-top: 6px; font-size: 13px; }
            .gv-match-table { width: 100%; border-collapse: collapse; margin-top: 6px; background: #fff; font-size: 13px; border: 1px solid #94a3b8; }
            .gv-match-table th, .gv-match-table td { padding: 5px 8px; border: 1px solid #94a3b8; text-align: left; }
            .gv-match-table th { background: #e2e8f0; font-weight: bold; }

            .gv-global-bar { background: #e2e8f0; padding: 10px 12px; border-radius: 6px; display: flex; gap: 12px; align-items: center; margin-bottom: 10px; border: 1px solid #cbd5e1; flex-wrap: wrap; justify-content: space-between; }
            .gv-badge { background: #1e40af; color: #fff; padding: 3px 9px; border-radius: 12px; font-size: 11.5px; font-weight: bold; }
            .gv-draft-sec { background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 12px; margin-bottom: 15px; }

            details.gv-collapse { background: #eff6ff; border: 2px solid #93c5fd; border-radius: 8px; padding: 10px 15px; margin-bottom: 20px; transition: 0.3s; }
            details.gv-collapse summary { font-size: 16px; font-weight: bold; color: #1e3a8a; cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; outline: none; }
            details.gv-collapse summary::-webkit-details-marker { display: none; }
            details.gv-collapse summary::after { content: "▼"; font-size: 12px; color: #1e3a8a; transition: transform 0.3s; }
            details.gv-collapse[open] summary::after { transform: rotate(180deg); }
            details.gv-collapse[open] summary { margin-bottom: 15px; border-bottom: 1px dashed #93c5fd; padding-bottom: 10px; }

            #gvPreviewModal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; justify-content: center; align-items: center; }
            #gvPreviewContent { background: #fff; width: 210mm; max-width: 95%; height: 90vh; overflow-y: auto; padding: 20px; border-radius: 8px; position: relative; }
        `;
        document.head.appendChild(style);
    };

    // 🧬 2. UNIFIED MATH & CHEMISTRY FORMULA PARSER
    window.gvParseText = function(text, type = '') {
        if (!text) return '';
        let s = String(text);

        // Clean legacy tags & chemical LaTeX
        s = s.replace(/_{1,2}htmltag[a-z0-9_]*_{1,2}/gi, '').replace(/@@@@/g, '');
        s = s.replace(/\\\\ce\{([^}]+)\}/g, '$1').replace(/\\ce\{([^}]+)\}/g, '$1');

        // Handle Match the Following FIRST before replacing \n
        if (type === 'જોડકા જોડો') {
            const lines = s.split('\n').filter(l => l.trim() !== '');
            let rowsHtml = '';
            lines.forEach(l => {
                if (l.includes('વિભાગ A') && l.includes('વિભાગ B')) return;
                const cols = l.split(/\s+(?=\([a-zA-Zઅ-જ]\))|\s+-\s+|\s+–\s+|\t{2,}/);
                if (cols.length >= 2) {
                    rowsHtml += `<tr><td>${window.gvParseText(cols[0].trim())}</td><td>${window.gvParseText(cols.slice(1).join(' ').trim())}</td></tr>`;
                }
            });
            if (rowsHtml) {
                return `<table class="gv-match-table"><tr><th width="50%">વિભાગ A</th><th width="50%">વિભાગ B</th></tr>${rowsHtml}</table>`;
            }
        }

        // Normalize double backslashes to single
        s = s.replace(/\\\\/g, '\\');

        // Strip $ ... $ delimiters
        s = s.replace(/\$([^$]+)\$/g, '$1');

        // LaTeX \text{...}
        s = s.replace(/\\text\{([^}]+)\}/g, '$1');

        // LaTeX Symbols
        s = s.replace(/\^\{\\circ\}/g, '°').replace(/\\circ/g, '°');
        s = s.replace(/\\pi/g, 'π')
             .replace(/\\theta/g, 'θ')
             .replace(/\\Delta/g, 'Δ')
             .replace(/\\times/g, '×')
             .replace(/\\div/g, '÷')
             .replace(/\\neq/g, '≠')
             .replace(/\\Rightarrow/g, '⇒')
             .replace(/\\rightarrow/g, ' → ')
             .replace(/\\pm/g, '±')
             .replace(/\\angle/g, '∠')
             .replace(/->/g, ' → ');

        // LaTeX Fractions \frac{a}{b}
        s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g,
            '<span style="display:inline-block; vertical-align:middle; text-align:center; font-size:0.88em; margin:0 3px; line-height:1.1;"><span style="border-bottom:1px solid #000; display:block; padding:0 2px;">$1</span><span style="display:block; padding:0 2px;">$2</span></span>');

        // LaTeX Square Roots \sqrt{x}
        s = s.replace(/\\sqrt\{([^}]+)\}/g, '√<span style="border-top:1px solid #000; padding-top:1px;">$1</span>');
        s = s.replace(/√\(([^)]+)\)/g, '√<span style="border-top:1px solid #000; padding-top:1px;">$1</span>');

        // Powers & Subscripts
        s = s.replace(/\^\(\s*([0-9a-zA-Z+\-]+)\s*\/\s*([0-9a-zA-Z+\-]+)\s*\)/g, '<sup>$1/$2</sup>');
        s = s.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
        s = s.replace(/\^([0-9a-zA-Z+\-]+)/g, '<sup>$1</sup>');
        s = s.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
        s = s.replace(/_([0-9a-zA-Z]+)/g, '<sub>$1</sub>');

        // Chemistry Formulas (H2O, Ca(OH)2, H2SO4, CuSO4, Fe2O3)
        s = s.replace(/\(([A-Za-z0-9]+)\)([2-9])/g, '($1)<sub>$2</sub>');
        s = s.replace(/([A-Z][a-z]?)([2-9])(?![a-zA-Z])/g, '$1<sub>$2</sub>');

        // MCQ 2-column Grid
        if (type === 'MCQ' && s.includes('(A)')) {
            const parts = s.split(/\(A\)/);
            if (parts.length > 1) {
                let opts = '(A)' + parts[1];
                opts = opts.replace(/\(A\)/g, '<div><b>(A)</b> ')
                           .replace(/\(B\)/g, '</div><div><b>(B)</b> ')
                           .replace(/\(C\)/g, '</div><div><b>(C)</b> ')
                           .replace(/\(D\)/g, '</div><div><b>(D)</b> ') + '</div>';
                return `<div style="font-weight:600; margin-bottom:4px;">${parts[0].trim()}</div><div class="gv-mcq-grid">${opts}</div>`;
            }
        }

        return s.replace(/\n/g, '<br>');
    };

    // 🧮 SMART MARKS CALCULATOR (Section A compulsory sum; B/C/D attempt * marksPerQ)
    const calculatePaperTotalMarks = (questions, order, secMeta) => {
        let total = 0;
        order.forEach(sec => {
            const qs = questions.filter(q => q.section === sec && q.type !== 'instruction');
            if (qs.length === 0) return;

            if (sec === 'A') {
                total += qs.reduce((sum, q) => sum + Number(q.marks || 0), 0);
            } else {
                const meta = secMeta[sec] || {};
                const attemptCount = Number(meta.attemptCount || 0);
                const markPerQ = Number(qs[0].marks || 0);
                if (attemptCount > 0 && attemptCount <= qs.length) {
                    total += (attemptCount * markPerQ);
                } else {
                    total += qs.reduce((sum, q) => sum + Number(q.marks || 0), 0);
                }
            }
        });
        return total;
    };

    // 🌐 3. MASTER UI RENDERER
    const renderApp = () => {
        injectStyles();
        let root = document.getElementById('gv-master-root');
        if (!root) {
            root = document.createElement('div');
            root.id = 'gv-master-root';
            document.body.appendChild(root);
        }

        root.innerHTML = `
            <nav class="gv-top-nav">
                <div class="gv-brand">🌳 જ્ઞાન વૃક્ષ (GSEB V15.0)</div>
                <div class="gv-nav-links">
                    <button class="gv-nav-btn active" id="nav-dashboard" onclick="window.switchTab('dashboard')">🏠 ડેશબોર્ડ</button>
                    <button class="gv-nav-btn" id="nav-qbank" onclick="window.switchTab('qbank')">📚 પ્રશ્ન બેંક</button>
                    <button class="gv-nav-btn" id="nav-builder" onclick="window.switchTab('builder')">📝 પ્રશ્નપત્ર બનાવો</button>
                    <button class="gv-nav-btn" id="nav-settings" onclick="window.switchTab('settings')">⚙️ સેટિંગ્સ & પ્રોફાઈલ</button>
                </div>
            </nav>

            <div class="gv-main-container">
                <!-- DASHBOARD -->
                <div id="tab-dashboard" class="gv-tab-content active">
                    <div class="gv-card" style="text-align:center; padding:30px;">
                        <h1 style="color:#1e293b; margin-top:0;">સ્વાગત છે, ડૉ. સંજય સાહેબ!</h1>
                        <div style="display:flex; justify-content:center; gap:20px; margin:20px 0; flex-wrap:wrap;">
                            <div style="background:#eff6ff; padding:20px 40px; border-radius:10px; border:2px solid #bfdbfe;">
                                <h1 style="margin:0; color:#1d4ed8; font-size:36px;" id="dashQCount">0</h1>
                                <p style="margin:5px 0 0 0; font-weight:bold;">કુલ પ્રશ્નો</p>
                            </div>
                            <div style="background:#f0fdf4; padding:20px 40px; border-radius:10px; border:2px solid #bbf7d0;">
                                <h1 style="margin:0; color:#15803d; font-size:36px;" id="dashPCount">0</h1>
                                <p style="margin:5px 0 0 0; font-weight:bold;">તૈયાર પેપર્સ</p>
                            </div>
                        </div>
                    </div>
                    <div class="gv-card">
                        <h2 style="margin-top:0;">🖨️ સેવ કરેલા પ્રશ્નપત્રો</h2>
                        <div id="saved-papers-list"></div>
                    </div>
                </div>

                <!-- QUESTION BANK -->
                <div id="tab-qbank" class="gv-tab-content">
                    <div class="gv-card">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap; gap:10px;">
                            <h2 style="margin:0;">📚 પ્રશ્ન બેંક</h2>
                            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                                <button class="gv-btn gv-btn-blue" onclick="document.getElementById('sysFileInp').click()">📥 ઈમ્પોર્ટ કરો (JSON)</button>
                                <button class="gv-btn gv-btn-dark" onclick="window.downloadBackup()">💾 બેકઅપ ડાઉનલોડ</button>
                                <button class="gv-btn gv-btn-green" onclick="window.openAddModal()">➕ નવો પ્રશ્ન ઉમેરો</button>
                            </div>
                        </div>
                        <div style="background:#f1f5f9; padding:12px; border-radius:8px; margin-bottom:15px; display:flex; gap:10px; flex-wrap:wrap; border:1px solid #cbd5e1;">
                            <select id="qbFilterStd" class="gv-input" style="width:auto; margin:0;" onchange="window.updateDynamicFilters('qb'); window.renderQBank()"></select>
                            <select id="qbFilterSub" class="gv-input" style="width:auto; margin:0;" onchange="window.updateDynamicFilters('qb'); window.renderQBank()"></select>
                            <select id="qbFilterChap" class="gv-input" style="width:auto; margin:0;" onchange="window.renderQBank()"></select>
                            <select id="qbFilterType" class="gv-input" style="width:auto; margin:0;" onchange="window.renderQBank()"></select>
                            <input type="text" id="qbSearch" class="gv-input" placeholder="🔍 પ્રશ્ન શોધો..." style="flex:1; margin:0; min-width:150px;" oninput="window.renderQBank()">
                        </div>
                        <div id="qbank-list" class="gv-q-grid"></div>
                    </div>
                </div>

                <!-- PAPER BUILDER -->
                <div id="tab-builder" class="gv-tab-content">
                    <!-- COLLAPSIBLE AUTO BUILDER -->
                    <details class="gv-collapse">
                        <summary>⚡ ઓટો પેપર જનરેટર (GSEB બોર્ડ મુજબ - Fair Picking & Grouping)</summary>
                        <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px; flex-wrap:wrap;">
                            <select id="autoFilterStd" class="gv-input" style="width:auto; margin:0;" onchange="window.updateDynamicFilters('auto'); window.updateAutoChaps()"></select>
                            <select id="autoFilterSub" class="gv-input" style="width:auto; margin:0;" onchange="window.updateAutoChaps()"></select>
                            <input type="date" id="autoDate" class="gv-input" style="width:auto; margin:0;" title="પેપરની તારીખ">
                        </div>
                        <div style="margin-bottom:8px; font-weight:bold; font-size:14px;">પ્રકરણ પસંદ કરો:</div>
                        <div id="autoChapContainer" style="display:flex; gap:10px; flex-wrap:wrap; background:#fff; padding:10px; border-radius:6px; border:1px solid #cbd5e1; margin-bottom:15px;"></div>

                        <div style="display:flex; gap:10px; flex-wrap:wrap;">
                            <button class="gv-btn gv-btn-blue" onclick="window.gvAutoPaper(25)">🎯 25 ગુણ</button>
                            <button class="gv-btn gv-btn-green" onclick="window.gvAutoPaper(50)">🎯 50 ગુણ</button>
                            <button class="gv-btn gv-btn-purple" onclick="window.gvAutoPaper(80)">🎯 80 ગુણ</button>
                        </div>
                    </details>

                    <div class="gv-card">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                            <h2 style="margin-top:0;">🛒 મેન્યુઅલ પેપર બિલ્ડર</h2>
                            <span style="background:#fef08a; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:bold; color:#854d0e;">💾 ડ્રાફ્ટ ઓટો-સેવ ચાલુ છે</span>
                        </div>

                        <div style="display:grid; grid-template-columns:1.15fr 1fr; gap:20px; align-items:start; margin-top:10px;">
                            <!-- LEFT PANE -->
                            <div style="border:1px solid #cbd5e1; border-radius:8px; padding:10px; background:#fff;">
                                <div style="display:flex; gap:5px; flex-wrap:wrap; margin-bottom:10px;">
                                    <select id="manFilterStd" class="gv-input" style="width:auto; margin:0; padding:4px;" onchange="window.updateDynamicFilters('man'); window.renderManualList()"></select>
                                    <select id="manFilterSub" class="gv-input" style="width:auto; margin:0; padding:4px;" onchange="window.updateDynamicFilters('man'); window.renderManualList()"></select>
                                    <select id="manFilterChap" class="gv-input" style="width:auto; margin:0; padding:4px;" onchange="window.renderManualList()"></select>
                                    <select id="manFilterType" class="gv-input" style="width:auto; margin:0; padding:4px;" onchange="window.renderManualList()"></select>
                                </div>

                                <div class="gv-global-bar">
                                    <div style="display:flex; align-items:center; gap:5px;">
                                        <b style="font-size:13px; color:#1e293b;">📌 વિભાગ:</b>
                                        <select id="globalTargetSec" class="gv-input" style="width:auto; margin:0; padding:4px; font-weight:bold;">
                                            <option value="A">Sec A</option><option value="B">Sec B</option>
                                            <option value="C">Sec C</option><option value="D">Sec D</option>
                                            <option value="E">Sec E</option>
                                        </select>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:5px;">
                                        <b style="font-size:13px; color:#1e293b;">🎯 ગુણ:</b>
                                        <select id="globalCustomMarks" class="gv-input" style="width:auto; margin:0; padding:4px; font-weight:bold;">
                                            <option value="DEFAULT">પ્રશ્ન મુજબ</option>
                                            <option value="1">1</option><option value="2">2</option>
                                            <option value="3">3</option><option value="4">4</option>
                                            <option value="5">5</option><option value="10">10</option>
                                        </select>
                                    </div>
                                    <span id="manAvailableCount" class="gv-badge" style="background:#16a34a;">ઉપલબ્ધ: 0</span>
                                </div>

                                <div style="max-height:580px; overflow-y:auto; border-top:1px solid #cbd5e1;">
                                    <table style="width:100%; border-collapse:collapse; font-size:13.5px;">
                                        <tbody id="manual-acc-list"></tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- RIGHT PANE (DRAFT) -->
                            <div style="border:2px solid #16a34a; border-radius:8px; padding:15px; background:#f0fdf4;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                    <h3 style="margin:0; color:#16a34a;">2️⃣ ડ્રાફ્ટ પેપર</h3>
                                    <h3 style="margin:0; background:#16a34a; color:#fff; padding:4px 12px; border-radius:20px;" id="draftTotalMarks">કુલ: 0 ગુણ</h3>
                                </div>
                                <div id="draft-sec-counters" style="display:flex; gap:5px; flex-wrap:wrap; margin-bottom:10px;"></div>

                                <div id="draft-cart-list" style="max-height:450px; overflow-y:auto; margin-bottom:15px;"></div>

                                <div style="display:flex; gap:10px; margin-bottom:10px;">
                                    <input type="text" id="draftPaperTitle" class="gv-input" placeholder="પેપરનું નામ (દા.ત. પ્રથમ કસોટી)" style="border:1px solid #16a34a; margin:0; flex:1;">
                                    <input type="date" id="draftPaperDate" class="gv-input" style="border:1px solid #16a34a; margin:0; width:135px;" title="પરીક્ષાની તારીખ">
                                </div>

                                <div style="display:flex; gap:10px;">
                                    <button class="gv-btn gv-btn-blue" style="flex:1;" onclick="window.previewPaper()">👁️ લાઈવ પ્રીવ્યુ</button>
                                    <button class="gv-btn gv-btn-green" style="flex:1;" onclick="window.saveManualPaper()">💾 પેપર સેવ કરો</button>
                                    <button class="gv-btn gv-btn-red" onclick="window.resetDraft()">🔄 રીસેટ</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SETTINGS -->
                <div id="tab-settings" class="gv-tab-content">
                    <div class="gv-card">
                        <h2 style="margin-top:0;">🏫 શાળાની પ્રોફાઈલ અને 🖨️ પ્રિન્ટ સેટિંગ્સ</h2>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                            <div>
                                <label class="gv-form-label">શાળાનું નામ</label><input type="text" id="setSchoolName" class="gv-input">
                                <label class="gv-form-label">સરનામું</label><input type="text" id="setSchoolAddress" class="gv-input">
                                <label class="gv-form-label">PDF વોટરમાર્ક</label><input type="text" id="setWatermark" class="gv-input">
                                <button class="gv-btn gv-btn-blue" style="margin-top:10px;" onclick="window.saveProfile()">💾 સેવ કરો</button>
                            </div>
                            <div style="background:#f1f5f9; padding:15px; border-radius:6px; border:1px solid #cbd5e1; display:flex; flex-direction:column; gap:10px;">
                                <label style="font-weight:bold; cursor:pointer;"><input type="checkbox" id="chkShowExam"> પરીક્ષાનું નામ</label>
                                <label style="font-weight:bold; cursor:pointer;"><input type="checkbox" id="chkShowStd"> ધોરણ</label>
                                <label style="font-weight:bold; cursor:pointer;"><input type="checkbox" id="chkShowSub"> વિષય</label>
                                <label style="font-weight:bold; cursor:pointer;"><input type="checkbox" id="chkShowDate"> તારીખ</label>
                                <label style="font-weight:bold; cursor:pointer;"><input type="checkbox" id="chkShowMarks"> કુલ ગુણ</label>
                            </div>
                        </div>
                    </div>
                    <div class="gv-card">
                        <h2 style="margin-top:0;">📥 ડેટા બેકઅપ સિસ્ટમ</h2>
                        <div style="display:flex; gap:10px; flex-wrap:wrap;">
                            <button class="gv-btn gv-btn-blue" onclick="window.downloadBackup()">💾 બેકઅપ ડાઉનલોડ (JSON)</button>
                            <button class="gv-btn gv-btn-green" onclick="document.getElementById('sysFileInp').click()">📂 ડેટા ઈમ્પોર્ટ / રિસ્ટોર કરો</button>
                            <button class="gv-btn gv-btn-red" style="margin-left:auto;" onclick="window.clearBank()">⚠️ બધા પ્રશ્નો ડીલીટ કરો</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- LIVE PREVIEW MODAL -->
            <div id="gvPreviewModal">
                <div id="gvPreviewContent">
                    <button class="gv-btn gv-btn-red" style="position:absolute; top:10px; right:20px;" onclick="document.getElementById('gvPreviewModal').style.display='none'">✖ બંધ કરો</button>
                    <div id="gvPreviewBody" style="margin-top:25px;"></div>
                </div>
            </div>

            <!-- ADD QUESTION MODAL (WITH IMAGE UPLOADS) -->
            <div id="addQModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999; justify-content:center; align-items:center;">
                <div style="background:#fff; width:90%; max-width:600px; padding:20px; border-radius:10px; box-shadow:0 10px 25px rgba(0,0,0,0.2); max-height:90vh; overflow-y:auto;">
                    <h2 style="margin-top:0; color:#1e293b;">➕ નવો પ્રશ્ન ઉમેરો</h2>
                    <div style="display:flex; gap:10px; margin-bottom:10px;">
                        <input id="mqStd" class="gv-input" placeholder="ધોરણ" value="10">
                        <input id="mqSub" class="gv-input" placeholder="વિષય" value="વિજ્ઞાન">
                        <input id="mqChap" class="gv-input" placeholder="પ્રકરણ નં">
                    </div>
                    <div style="display:flex; gap:10px; margin-bottom:10px;">
                        <select id="mqType" class="gv-input">
                            <option>MCQ</option><option>ખાલી જગ્યા</option><option>વિકલ્પ સાથે ખાલી જગ્યા</option>
                            <option>ખરા-ખોટા</option><option>જોડકા જોડો</option><option>એક વાક્યમાં જવાબ આપો</option>
                            <option>ટૂંકમાં જવાબ આપો</option><option>માગ્યા મુજબ જવાબ આપો</option><option>સવિસ્તાર જવાબ આપો</option>
                        </select>
                        <input id="mqMarks" type="number" class="gv-input" placeholder="ગુણ" value="1">
                    </div>

                    <label class="gv-form-label">પ્રશ્ન (ગણિત માટે $...$ વાપરો):</label>
                    <textarea id="mqText" class="gv-input" style="height:60px;"></textarea>

                    <label class="gv-form-label" style="color:#1d4ed8;">પ્રશ્નની આકૃતિ (જો હોય તો):</label>
                    <input type="file" id="mqImg" class="gv-input" accept="image/*" style="padding:4px;">

                    <label class="gv-form-label" style="margin-top:5px;">જવાબ:</label>
                    <textarea id="mqAns" class="gv-input" style="height:60px;"></textarea>

                    <label class="gv-form-label" style="color:#1d4ed8;">જવાબની આકૃતિ (જો હોય તો):</label>
                    <input type="file" id="mqAnsImg" class="gv-input" accept="image/*" style="padding:4px;">

                    <div style="text-align:right; margin-top:10px;">
                        <button class="gv-btn gv-btn-dark" onclick="document.getElementById('addQModal').style.display='none'">રદ કરો</button>
                        <button class="gv-btn gv-btn-green" onclick="window.saveManualAddQ()">💾 સેવ કરો</button>
                    </div>
                </div>
            </div>

            <input type="file" id="sysFileInp" accept=".json" style="display:none;" onchange="window.importJSON(event)">
        `;

        window.loadProfile();
        window.updateDynamicFilters('all');
        const today = new Date().toISOString().split('T')[0];
        if (document.getElementById('draftPaperDate')) document.getElementById('draftPaperDate').value = today;
        if (document.getElementById('autoDate')) document.getElementById('autoDate').value = today;
        window.refreshData();
    };

    // 🔄 4. DYNAMIC FILTERS & TABS
    window.updateDynamicFilters = function(target = 'all') {
        const allQ = JSON.parse(localStorage.getItem('gyanVruksh_questions')) || [];
        const fill = (id, items, prefix) => {
            const el = document.getElementById(id);
            if (!el) return;
            const currentVal = el.value;
            el.innerHTML = `<option value="ALL">${prefix}</option>` + items.map(i => `<option value="${i}">${i}</option>`).join('');
            if (items.includes(currentVal)) el.value = currentVal;
        };

        const stds = [...new Set(allQ.map(q => q.standard).filter(Boolean))].sort((a, b) => a - b);
        const types = [...new Set(allQ.map(q => q.type).filter(Boolean))];

        if (target === 'all' || target === 'qb') {
            fill('qbFilterStd', stds, 'બધા ધોરણ');
            const selStd = document.getElementById('qbFilterStd')?.value || 'ALL';
            const subs = [...new Set(allQ.filter(q => selStd === 'ALL' || String(q.standard) === selStd).map(q => q.subject).filter(Boolean))];
            fill('qbFilterSub', subs, 'બધા વિષય');
            const selSub = document.getElementById('qbFilterSub')?.value || 'ALL';
            const chaps = [...new Set(allQ.filter(q => (selStd === 'ALL' || String(q.standard) === selStd) && (selSub === 'ALL' || q.subject === selSub)).map(q => q.chapter).filter(Boolean))].sort((a, b) => a - b);
            fill('qbFilterChap', chaps, 'બધા પ્રકરણ');
            fill('qbFilterType', types, 'બધા પ્રકાર');
        }
        if (target === 'all' || target === 'auto') {
            fill('autoFilterStd', stds, 'બધા ધોરણ');
            const selStd = document.getElementById('autoFilterStd')?.value || 'ALL';
            const subs = [...new Set(allQ.filter(q => selStd === 'ALL' || String(q.standard) === selStd).map(q => q.subject).filter(Boolean))];
            fill('autoFilterSub', subs, 'બધા વિષય');
        }
        if (target === 'all' || target === 'man') {
            fill('manFilterStd', stds, 'બધા ધોરણ');
            const selStd = document.getElementById('manFilterStd')?.value || 'ALL';
            const subs = [...new Set(allQ.filter(q => selStd === 'ALL' || String(q.standard) === selStd).map(q => q.subject).filter(Boolean))];
            fill('manFilterSub', subs, 'બધા વિષય');
            const selSub = document.getElementById('manFilterSub')?.value || 'ALL';
            const chaps = [...new Set(allQ.filter(q => (selStd === 'ALL' || String(q.standard) === selStd) && (selSub === 'ALL' || q.subject === selSub)).map(q => q.chapter).filter(Boolean))].sort((a, b) => a - b);
            fill('manFilterChap', chaps, 'બધા પ્રકરણ');
            fill('manFilterType', types, 'બધા પ્રકાર');
        }
    };

    window.switchTab = function(tabId) {
        document.querySelectorAll('.gv-tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.gv-nav-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(`tab-${tabId}`).classList.add('active');
        document.getElementById(`nav-${tabId}`).classList.add('active');
        currentTab = tabId;
        window.refreshData();
    };

    window.refreshData = function() {
        const allQ = JSON.parse(localStorage.getItem('gyanVruksh_questions')) || [];
        const papers = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || [];
        if (document.getElementById('dashQCount')) document.getElementById('dashQCount').innerText = allQ.length;
        if (document.getElementById('dashPCount')) document.getElementById('dashPCount').innerText = papers.length;

        if (currentTab === 'dashboard') window.renderSavedPapersList();
        if (currentTab === 'qbank') window.renderQBank();
        if (currentTab === 'builder') {
            window.updateAutoChaps();
            window.renderManualList();
            window.renderDraftCart();
        }
    };

    // --- DASHBOARD ---
    window.renderSavedPapersList = function() {
        const listDiv = document.getElementById('saved-papers-list');
        const papers = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || [];
        if (papers.length === 0) {
            listDiv.innerHTML = '<p>કોઈ પેપર બનાવેલ નથી.</p>';
            return;
        }

        const formatD = (d) => {
            if (!d) return '-';
            const p = String(d).split('-');
            return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d;
        };

        listDiv.innerHTML = papers.slice().reverse().map(p => `
            <div style="background:#f1f5f9; padding:15px; border:1px solid #cbd5e1; border-radius:8px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <div>
                    <h3 style="margin:0; color:#1e293b;">${p.title}</h3>
                    <p style="margin:5px 0 0 0; font-size:13px; color:#475569;">તારીખ: ${formatD(p.date)} | ધોરણ: ${p.standard || '-'} | વિષય: ${p.subject || '-'} | ગુણ: ${p.totalMarks}</p>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button class="gv-btn" style="background:#ca8a04; color:#fff;" onclick="window.editPaper('${p.id}')">✏️ એડિટ</button>
                    ${window.downloadPDF ? `<button class="gv-btn gv-btn-red" onclick="window.downloadPDF('${p.id}', 'paper')">🖨️ પેપર PDF</button>` : ''}
                    ${window.downloadWord ? `<button class="gv-btn gv-btn-blue" onclick="window.downloadWord('${p.id}', 'paper')">📄 પેપર Word</button>` : ''}
                    ${window.downloadPDF ? `<button class="gv-btn gv-btn-purple" onclick="window.downloadPDF('${p.id}', 'solution')">🔑 Ans PDF</button>` : ''}
                    ${window.downloadWord ? `<button class="gv-btn gv-btn-dark" onclick="window.downloadWord('${p.id}', 'solution')">📄 Ans Word</button>` : ''}
                    <button class="gv-btn gv-btn-red" style="background:#991b1b;" onclick="window.deletePaper('${p.id}')">🗑️</button>
                </div>
            </div>
        `).join('');
    };

    window.editPaper = function(id) {
        const papers = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || [];
        const p = papers.find(x => x.id === id);
        if (!p) return;

        draftPaper = p.questions || [];
        sectionOrder = p.sectionOrder || ['A', 'B', 'C', 'D'];
        draftSections = p.sectionsMetadata || {};
        editingPaperId = p.id;

        Object.keys(draftSections).forEach(sec => {
            const att = draftSections[sec].attempt || '';
            const match = att.match(/\d+/);
            draftSections[sec].attemptCount = match ? Number(match[0]) : '';
        });

        saveDraftState();
        if (document.getElementById('draftPaperTitle')) document.getElementById('draftPaperTitle').value = p.title || '';
        if (document.getElementById('draftPaperDate')) document.getElementById('draftPaperDate').value = p.date || '';
        if (p.standard && document.getElementById('manFilterStd')) {
            document.getElementById('manFilterStd').value = p.standard;
            window.updateDynamicFilters('man');
        }
        if (p.subject && document.getElementById('manFilterSub')) {
            document.getElementById('manFilterSub').value = p.subject;
        }

        window.switchTab('builder');
        alert("પેપર એડિટ મોડમાં ખુલી ગયું છે!");
    };

    window.deletePaper = function(id) {
        if (!confirm("પેપર ડીલીટ કરવું છે?")) return;
        let papers = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || [];
        localStorage.setItem('gyanVruksh_papers', JSON.stringify(papers.filter(p => p.id !== id)));
        window.refreshData();
    };

    // --- QUESTION BANK ---
    window.renderQBank = function() {
        const qList = document.getElementById('qbank-list');
        const allQ = JSON.parse(localStorage.getItem('gyanVruksh_questions')) || [];
        const fStd = document.getElementById('qbFilterStd')?.value || 'ALL';
        const fSub = document.getElementById('qbFilterSub')?.value || 'ALL';
        const fChap = document.getElementById('qbFilterChap')?.value || 'ALL';
        const fType = document.getElementById('qbFilterType')?.value || 'ALL';
        const fSearch = (document.getElementById('qbSearch')?.value || '').toLowerCase().trim();

        const filtered = allQ.slice().reverse().filter(q =>
            (fStd === 'ALL' || String(q.standard) === fStd) &&
            (fSub === 'ALL' || String(q.subject) === fSub) &&
            (fChap === 'ALL' || String(q.chapter) === fChap) &&
            (fType === 'ALL' || String(q.type) === fType) &&
            (!fSearch || (q.text || '').toLowerCase().includes(fSearch))
        );

        if (filtered.length === 0) {
            qList.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:20px;">કોઈ પ્રશ્ન નથી.</div>`;
            return;
        }

        qList.innerHTML = filtered.map(q => {
            const imgHtml = q.image ? `<br><img src="${q.image}" style="max-height:100px; max-width:100%; margin-top:8px; border:1px solid #cbd5e1; border-radius:4px;">` : '';
            const ansImgHtml = q.solutionImage ? `<br><img src="${q.solutionImage}" style="max-height:100px; max-width:100%; margin-top:8px; border:1px solid #cbd5e1; border-radius:4px;">` : '';
            return `
            <div class="gv-q-item">
                <div style="font-size:12px; color:#2563eb; font-weight:bold; margin-bottom:8px;">ધો. ${q.standard} | પ્ર. ${q.chapter} | ${q.type} (${q.marks} ગુણ)</div>
                <div style="font-size:14px; font-weight:bold; margin-bottom:10px;">${window.gvParseText(q.text, q.type)} ${imgHtml}</div>
                <div style="font-size:13px; background:#f0fdf4; padding:8px; border-left:3px solid #16a34a;"><b>ઉત્તર:</b> ${window.gvParseText(q.answer)} ${ansImgHtml}</div>
                <button class="gv-btn gv-btn-red" style="position:absolute; top:10px; right:10px; padding:4px 8px; font-size:11px;" onclick="window.deleteQ('${q.id}')">🗑️</button>
            </div>`;
        }).join('');
    };

    // --- AUTO PAPER GENERATOR (SECTION A MATCH, TYPE GROUPING, SMART MARKS) ---
    window.updateAutoChaps = function() {
        const allQ = JSON.parse(localStorage.getItem('gyanVruksh_questions')) || [];
        const fStd = document.getElementById('autoFilterStd')?.value || 'ALL';
        const fSub = document.getElementById('autoFilterSub')?.value || 'ALL';
        const pool = allQ.filter(q => (fStd === 'ALL' || String(q.standard) === fStd) && (fSub === 'ALL' || String(q.subject) === fSub));
        const chaps = [...new Set(pool.map(q => q.chapter).filter(Boolean))].sort((a, b) => a - b);
        const cont = document.getElementById('autoChapContainer');
        if (cont) {
            cont.innerHTML = chaps.length
                ? chaps.map(c => `<label style="padding:4px 8px; border:1px solid #cbd5e1; border-radius:4px; background:#f8fafc; cursor:pointer;"><input type="checkbox" value="${c}" class="gv-auto-cb" checked> પ્ર. ${c}</label>`).join('')
                : 'કોઈ પ્રકરણ નથી';
        }
    };

    const pickFairly = (pool, count) => {
        if (count <= 0 || pool.length === 0) return [];
        const chaps = {};
        pool.forEach(q => {
            if (!chaps[q.chapter]) chaps[q.chapter] = [];
            chaps[q.chapter].push(q);
        });
        Object.keys(chaps).forEach(k => chaps[k].sort(() => 0.5 - Math.random()));

        const keys = Object.keys(chaps);
        const picked = [];
        let i = 0;
        while (picked.length < count && keys.length > 0) {
            const k = keys[i % keys.length];
            if (chaps[k].length > 0) {
                picked.push(chaps[k].shift());
            } else {
                keys.splice(keys.indexOf(k), 1);
                i--;
            }
            i++;
        }
        return picked;
    };

    window.gvAutoPaper = function(targetMarks) {
        const allQ = JSON.parse(localStorage.getItem('gyanVruksh_questions')) || [];
        const fStd = document.getElementById('autoFilterStd').value;
        const fSub = document.getElementById('autoFilterSub').value;
        const selectedChaps = Array.from(document.querySelectorAll('.gv-auto-cb:checked')).map(cb => cb.value);
        if (selectedChaps.length === 0) return alert("પ્રકરણ પસંદ કરો!");

        const pool = allQ.filter(q =>
            (fStd === 'ALL' || String(q.standard) === fStd) &&
            (fSub === 'ALL' || String(q.subject) === fSub) &&
            selectedChaps.includes(String(q.chapter))
        );

        // Separate pools: Match goes to Section A along with 1-mark questions
        const q1 = pool.filter(q => Number(q.marks) === 1 && q.type !== 'જોડકા જોડો');
        const qMatch = pool.filter(q => q.type === 'જોડકા જોડો');
        const q2 = pool.filter(q => Number(q.marks) === 2 && q.type !== 'જોડકા જોડો');
        const q3 = pool.filter(q => Number(q.marks) === 3);
        const q4 = pool.filter(q => Number(q.marks) === 4);

        let secA = [], secB = [], secC = [], secD = [];
        let sMeta = {};

        if (targetMarks === 25) {
            // Section A: 1 Match (2 marks) + 5 one-mark = 7 marks (or 7 one-mark if no match)
            const pickedMatch = pickFairly(qMatch, 1);
            const needQ1 = Math.max(0, 7 - pickedMatch.reduce((s, q) => s + Number(q.marks), 0));
            secA = [...pickFairly(q1, needQ1), ...pickedMatch];
            secB = pickFairly(q2, 6);
            secC = pickFairly(q3, 3);
            secD = pickFairly(q4, 2);
            sMeta = {
                A: { instruction: '', attempt: 'બધા પ્રશ્નો ફરજિયાત', attemptCount: '' },
                B: { instruction: '', attempt: `કોઈ પણ ${Math.min(4, secB.length)} લખો`, attemptCount: Math.min(4, secB.length) },
                C: { instruction: '', attempt: `કોઈ પણ ${Math.min(2, secC.length)} લખો`, attemptCount: Math.min(2, secC.length) },
                D: { instruction: '', attempt: `કોઈ પણ ${Math.min(1, secD.length)} લખો`, attemptCount: Math.min(1, secD.length) }
            };
        } else if (targetMarks === 50) {
            const pickedMatch = pickFairly(qMatch, 1);
            const needQ1 = Math.max(0, 10 - pickedMatch.reduce((s, q) => s + Number(q.marks), 0));
            secA = [...pickFairly(q1, needQ1), ...pickedMatch];
            secB = pickFairly(q2, 11);
            secC = pickFairly(q3, 6);
            secD = pickFairly(q4, 5);
            sMeta = {
                A: { instruction: '', attempt: 'બધા પ્રશ્નો ફરજિયાત', attemptCount: '' },
                B: { instruction: '', attempt: `કોઈ પણ ${Math.min(8, secB.length)} લખો`, attemptCount: Math.min(8, secB.length) },
                C: { instruction: '', attempt: `કોઈ પણ ${Math.min(4, secC.length)} લખો`, attemptCount: Math.min(4, secC.length) },
                D: { instruction: '', attempt: `કોઈ પણ ${Math.min(3, secD.length)} લખો`, attemptCount: Math.min(3, secD.length) }
            };
        } else {
            const pickedMatch = pickFairly(qMatch, 2);
            const needQ1 = Math.max(0, 24 - pickedMatch.reduce((s, q) => s + Number(q.marks), 0));
            secA = [...pickFairly(q1, needQ1), ...pickedMatch];
            secB = pickFairly(q2, 13);
            secC = pickFairly(q3, 9);
            secD = pickFairly(q4, 8);
            sMeta = {
                A: { instruction: '', attempt: 'બધા પ્રશ્નો ફરજિયાત', attemptCount: '' },
                B: { instruction: '', attempt: `કોઈ પણ ${Math.min(9, secB.length)} લખો`, attemptCount: Math.min(9, secB.length) },
                C: { instruction: '', attempt: `કોઈ પણ ${Math.min(6, secC.length)} લખો`, attemptCount: Math.min(6, secC.length) },
                D: { instruction: '', attempt: `કોઈ પણ ${Math.min(5, secD.length)} લખો`, attemptCount: Math.min(5, secD.length) }
            };
        }

        const sectionBuckets = { A: secA, B: secB, C: secC, D: secD };
        const finalQWithInst = [];

        ['A', 'B', 'C', 'D'].forEach(sec => {
            // Group same question types together using typeSortOrder
            const sortedQs = sectionBuckets[sec].sort((a, b) => {
                const idxA = typeSortOrder.indexOf(a.type);
                const idxB = typeSortOrder.indexOf(b.type);
                return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
            });

            let lastType = '';
            sortedQs.forEach(q => {
                if (q.type !== lastType) {
                    finalQWithInst.push({
                        id: 'I_' + Date.now() + Math.random(),
                        type: 'instruction',
                        text: autoInstMap[q.type] || `નીચેના પ્રશ્નોના ઉત્તર આપો (${q.type})`,
                        section: sec,
                        marks: 0
                    });
                    lastType = q.type;
                }
                finalQWithInst.push({ ...q, section: sec });
            });
        });

        const trueTotalMarks = calculatePaperTotalMarks(finalQWithInst, ['A', 'B', 'C', 'D'], sMeta);
        const date = document.getElementById('autoDate').value;
        const newP = {
            id: "P_" + Date.now(),
            title: `${trueTotalMarks} ગુણ પરીક્ષા`,
            date: date,
            standard: fStd,
            subject: fSub,
            totalMarks: trueTotalMarks,
            sectionOrder: ['A', 'B', 'C', 'D'],
            sectionsMetadata: sMeta,
            questions: finalQWithInst
        };

        const pArr = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || [];
        pArr.push(newP);
        localStorage.setItem('gyanVruksh_papers', JSON.stringify(pArr));
        alert(`✅ ${trueTotalMarks} ગુણનું પેપર તૈયાર છે! (વિભાગ A ગ્રુપિંગ અને પ્રકરણ ન્યાય સાથે)`);
        window.switchTab('dashboard');
    };

    // --- MANUAL CART BUILDER (LEFT '+' BUTTON & FULL READABLE QUESTIONS) ---
    window.renderManualList = function() {
        const allQ = JSON.parse(localStorage.getItem('gyanVruksh_questions')) || [];
        const fStd = document.getElementById('manFilterStd')?.value || 'ALL';
        const fSub = document.getElementById('manFilterSub')?.value || 'ALL';
        const fChap = document.getElementById('manFilterChap')?.value || 'ALL';
        const fType = document.getElementById('manFilterType')?.value || 'ALL';
        const draftIds = draftPaper.filter(q => q.type !== 'instruction').map(q => q.id);

        const pool = allQ.filter(q =>
            !draftIds.includes(q.id) &&
            (fStd === 'ALL' || String(q.standard) === fStd) &&
            (fSub === 'ALL' || String(q.subject) === fSub) &&
            (fChap === 'ALL' || String(q.chapter) === fChap) &&
            (fType === 'ALL' || String(q.type) === fType)
        );

        const countBadge = document.getElementById('manAvailableCount');
        if (countBadge) countBadge.innerText = `ઉપલબ્ધ: ${pool.length}`;

        const list = document.getElementById('manual-acc-list');
        if (!list) return;

        if (pool.length === 0) {
            list.innerHTML = `<tr><td style="padding:20px; text-align:center; color:#64748b;">કોઈ પ્રશ્ન ઉપલબ્ધ નથી.</td></tr>`;
            return;
        }

        // Render FULL formatted question without .substring() truncation; '+' button on the LEFT
        list.innerHTML = pool.map(q => `
            <tr style="border-bottom:1px solid #cbd5e1;">
                <td style="padding:10px 6px; width:36px; vertical-align:top; text-align:center;">
                    <button class="gv-btn-add" title="પેપરમાં ઉમેરો" onclick="window.addToDraft('${q.id}')">+</button>
                </td>
                <td style="padding:10px 6px; font-size:13.5px; vertical-align:top;">
                    <div style="font-weight:bold; color:#2563eb; font-size:11.5px; margin-bottom:4px;">[પ્ર. ${q.chapter}] ${q.type} (${q.marks} ગુણ)</div>
                    <div style="line-height:1.45;">${window.gvParseText(q.text, q.type)}</div>
                </td>
            </tr>
        `).join('');
    };

    window.addToDraft = function(qId) {
        const allQ = JSON.parse(localStorage.getItem('gyanVruksh_questions')) || [];
        const q = allQ.find(x => x.id === qId);
        if (!q) return;

        const targetSec = document.getElementById('globalTargetSec').value || 'A';
        const customMarkStr = document.getElementById('globalCustomMarks').value;
        const finalMarks = (customMarkStr === 'DEFAULT') ? Number(q.marks) : Number(customMarkStr);

        if (!sectionOrder.includes(targetSec)) {
            sectionOrder.push(targetSec);
            sectionOrder.sort();
            draftSections[targetSec] = { instruction: '', attemptCount: '' };
        }

        const secQs = draftPaper.filter(x => x.section === targetSec && x.type !== 'instruction');
        const lastQ = secQs[secQs.length - 1];
        if (!lastQ || lastQ.type !== q.type) {
            draftPaper.push({
                id: 'Inst_' + Date.now(),
                type: 'instruction',
                text: autoInstMap[q.type] || `નીચેના પ્રશ્નોના ઉત્તર આપો:`,
                section: targetSec,
                marks: 0
            });
        }

        draftPaper.push({ ...q, marks: finalMarks, section: targetSec });
        saveDraftState();
        window.renderDraftCart();
        window.renderManualList();
    };

    window.addInlineInstruction = function(sec) {
        const text = prompt("આ વિભાગમાં કઈ સૂચના મૂકવી છે? (દા.ત. 'નીચેના દાખલા ગણો')");
        if (text && text.trim()) {
            draftPaper.push({ id: 'Inst_' + Date.now(), type: 'instruction', text: text.trim(), section: sec, marks: 0 });
            saveDraftState();
            window.renderDraftCart();
        }
    };

    window.renderDraftCart = function() {
        const list = document.getElementById('draft-cart-list');
        const totalEl = document.getElementById('draftTotalMarks');
        const countersEl = document.getElementById('draft-sec-counters');
        if (!list) return;

        const total = calculatePaperTotalMarks(draftPaper, sectionOrder, draftSections);
        totalEl.innerText = `કુલ ગુણ: ${total}`;

        if (countersEl) {
            countersEl.innerHTML = sectionOrder.map(s => {
                const count = draftPaper.filter(q => q.section === s && q.type !== 'instruction').length;
                return `<span class="gv-badge">વિભાગ ${s}: ${count} પ્રશ્નો</span>`;
            }).join('');
        }

        let html = '';
        sectionOrder.forEach(sec => {
            const secData = draftSections[sec] || { instruction: '', attemptCount: '' };
            const secQs = draftPaper.filter(q => q.section === sec);
            if (secQs.length === 0 && !secData.instruction) return;

            html += `<div class="gv-draft-sec">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed #16a34a; padding-bottom:8px; margin-bottom:10px;">
                    <div style="font-weight:bold; color:#166534; font-size:15.5px;">વિભાગ ${sec} (${secQs.filter(q => q.type !== 'instruction').length} પ્રશ્નો)</div>
                    <div style="display:flex; gap:5px;">
                        <button class="gv-btn" style="background:#ca8a04; padding:2px 8px; font-size:11px;" onclick="window.addInlineInstruction('${sec}')">➕ સૂચના</button>
                        <button class="gv-btn gv-btn-red" style="padding:2px 8px; font-size:11px;" onclick="window.deleteSection('${sec}')">🗑️</button>
                    </div>
                </div>
                ${sec === 'A'
                    ? `<div style="font-size:11.5px; color:#166534; font-weight:bold; margin-bottom:8px;">📌 બધા પ્રશ્નો ફરજિયાત</div>`
                    : `<div style="display:flex; align-items:center; gap:5px; margin-bottom:10px;">
                        <span style="font-size:11.5px; font-weight:bold;">કોઈપણ:</span>
                        <input type="number" class="gv-input" style="font-size:12px; margin:0; width:65px; padding:4px;" value="${secData.attemptCount || ''}" onchange="window.updateSecMeta('${sec}', 'attemptCount', this.value)" title="જેટલા પ્રશ્ન લખવાના હોય તે સંખ્યા નાખો">
                        <span style="font-size:11px; color:#64748b;">(ખાલી = બધા ફરજિયાત)</span>
                    </div>`
                }
            `;

            secQs.forEach(q => {
                const globalIdx = draftPaper.findIndex(x => x === q);
                if (q.type === 'instruction') {
                    html += `<div style="background:#fef9c3; border:1px dashed #eab308; padding:6px 10px; border-radius:6px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
                        <div style="font-size:12.5px; font-weight:bold; color:#854d0e;">✏️ ${q.text}</div>
                        <div style="display:flex; gap:4px;">
                            <button class="gv-btn" style="background:#ca8a04; padding:2px 6px; font-size:10px;" onclick="window.moveQuestion(${globalIdx}, -1)">▲</button>
                            <button class="gv-btn" style="background:#ca8a04; padding:2px 6px; font-size:10px;" onclick="window.moveQuestion(${globalIdx}, 1)">▼</button>
                            <button class="gv-btn gv-btn-red" style="padding:2px 6px; font-size:10px;" onclick="window.removeFromDraft(${globalIdx})">✖</button>
                        </div>
                    </div>`;
                } else {
                    html += `<div style="background:#fff; border:1px solid #cbd5e1; padding:8px; border-radius:6px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
                        <div style="font-size:12px; width:75%;"><b>[${q.marks} ગુણ]</b> ${q.type} - પ્ર.${q.chapter}</div>
                        <div style="display:flex; gap:4px; width:25%; justify-content:flex-end;">
                            <button class="gv-btn" style="background:#94a3b8; padding:2px 6px; font-size:10px;" onclick="window.moveQuestion(${globalIdx}, -1)">▲</button>
                            <button class="gv-btn" style="background:#94a3b8; padding:2px 6px; font-size:10px;" onclick="window.moveQuestion(${globalIdx}, 1)">▼</button>
                            <button class="gv-btn gv-btn-red" style="padding:2px 6px; font-size:10px;" onclick="window.removeFromDraft(${globalIdx})">✖</button>
                        </div>
                    </div>`;
                }
            });
            html += `</div>`;
        });

        list.innerHTML = html || '<i>પેપરમાં કોઈ પ્રશ્ન નથી.</i>';
    };

    window.moveQuestion = function(index, direction) {
        if (index + direction < 0 || index + direction >= draftPaper.length) return;
        const q = draftPaper[index];
        const swapQ = draftPaper[index + direction];
        if (q.section !== swapQ.section) return;
        const temp = draftPaper[index];
        draftPaper[index] = draftPaper[index + direction];
        draftPaper[index + direction] = temp;
        saveDraftState();
        window.renderDraftCart();
    };

    window.removeFromDraft = function(index) {
        draftPaper.splice(index, 1);
        saveDraftState();
        window.renderDraftCart();
        window.renderManualList();
    };

    window.deleteSection = function(sec) {
        if (!confirm(`વિભાગ ${sec} અને તેના બધા પ્રશ્નો કાઢી નાખવા છે?`)) return;
        draftPaper = draftPaper.filter(q => q.section !== sec);
        sectionOrder = sectionOrder.filter(s => s !== sec);
        delete draftSections[sec];
        saveDraftState();
        window.renderDraftCart();
        window.renderManualList();
    };

    window.updateSecMeta = function(sec, field, val) {
        if (!draftSections[sec]) draftSections[sec] = {};
        draftSections[sec][field] = val;
        saveDraftState();
        window.renderDraftCart();
    };

    window.resetDraft = function() {
        if (!confirm("ડ્રાફ્ટ ખાલી કરવો છે?")) return;
        draftPaper = [];
        sectionOrder = [];
        draftSections = {};
        editingPaperId = null;
        saveDraftState();
        window.renderDraftCart();
        window.renderManualList();
        if (document.getElementById('draftPaperTitle')) document.getElementById('draftPaperTitle').value = '';
    };

    const buildFinalMeta = () => {
        const finalMeta = {};
        sectionOrder.forEach(s => {
            if (s === 'A') {
                finalMeta[s] = { instruction: '', attempt: 'બધા પ્રશ્નો ફરજિયાત', attemptCount: '' };
            } else {
                const att = Number(draftSections[s]?.attemptCount || 0);
                finalMeta[s] = {
                    instruction: '',
                    attempt: att > 0 ? `કોઈ પણ ${att} લખો` : 'બધા પ્રશ્નો ફરજિયાત',
                    attemptCount: att > 0 ? att : ''
                };
            }
        });
        return finalMeta;
    };

    window.previewPaper = function() {
        if (draftPaper.length === 0) return alert("પેપરમાં પ્રશ્નો ઉમેરો!");
        const finalMeta = buildFinalMeta();
        const total = calculatePaperTotalMarks(draftPaper, sectionOrder, draftSections);
        const dummyP = {
            title: document.getElementById('draftPaperTitle').value || 'મેન્યુઅલ પ્રશ્નપત્ર',
            date: document.getElementById('draftPaperDate').value,
            totalMarks: total,
            sectionOrder: sectionOrder,
            sectionsMetadata: finalMeta,
            questions: [...draftPaper],
            standard: document.getElementById('manFilterStd').value,
            subject: document.getElementById('manFilterSub').value
        };

        if (window.generatePaperHTMLStr) {
            document.getElementById('gvPreviewBody').innerHTML = window.generatePaperHTMLStr(dummyP, 'paper', false);
            document.getElementById('gvPreviewModal').style.display = 'flex';
        } else {
            alert("પ્રિવ્યૂ એન્જિન મળ્યું નથી (pdf-generator.js જરૂરી).");
        }
    };

    window.saveManualPaper = function() {
        if (draftPaper.length === 0) return alert("પેપરમાં પ્રશ્નો ઉમેરો!");
        const title = document.getElementById('draftPaperTitle').value || 'મેન્યુઅલ પ્રશ્નપત્ર';
        const date = document.getElementById('draftPaperDate').value;
        const total = calculatePaperTotalMarks(draftPaper, sectionOrder, draftSections);
        const finalMeta = buildFinalMeta();

        const newP = {
            id: editingPaperId || ("P_" + Date.now()),
            title: title,
            date: date,
            totalMarks: total,
            sectionOrder: sectionOrder,
            sectionsMetadata: finalMeta,
            questions: [...draftPaper],
            standard: document.getElementById('manFilterStd').value,
            subject: document.getElementById('manFilterSub').value
        };

        const pArr = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || [];
        if (editingPaperId) {
            const idx = pArr.findIndex(x => x.id === editingPaperId);
            if (idx > -1) pArr[idx] = newP;
            else pArr.push(newP);
        } else {
            pArr.push(newP);
        }

        localStorage.setItem('gyanVruksh_papers', JSON.stringify(pArr));
        alert(editingPaperId ? "✅ પેપર સુધારાઈ ગયું!" : "✅ મેન્યુઅલ પેપર સેવ થઈ ગયું!");

        draftPaper = [];
        sectionOrder = [];
        draftSections = {};
        editingPaperId = null;
        saveDraftState();
        document.getElementById('draftPaperTitle').value = '';
        window.switchTab('dashboard');
    };

    // ⚙️ 5. PROFILE, BACKUP, IMPORT & ADD QUESTION
    window.loadProfile = function() {
        const prof = JSON.parse(localStorage.getItem('gyanVruksh_schoolProfile')) || { name: 'શ્રી દિગ્વિજયસિંહજી ન્યુ સરકારી હાઈસ્કૂલ', address: 'જામનગર' };
        const pdfSet = JSON.parse(localStorage.getItem('gyanVruksh_pdfSettings')) || { watermark: '', examName: true, date: true, std: true, subject: true, marks: true };
        if (document.getElementById('setSchoolName')) document.getElementById('setSchoolName').value = prof.name;
        if (document.getElementById('setSchoolAddress')) document.getElementById('setSchoolAddress').value = prof.address;
        if (document.getElementById('setWatermark')) document.getElementById('setWatermark').value = pdfSet.watermark || '';
        ['Exam', 'Std', 'Sub', 'Date', 'Marks'].forEach(k => {
            const el = document.getElementById(`chkShow${k}`);
            if (el) el.checked = pdfSet[k.toLowerCase()] !== false;
        });
    };

    window.saveProfile = function() {
        localStorage.setItem('gyanVruksh_schoolProfile', JSON.stringify({
            name: document.getElementById('setSchoolName').value,
            address: document.getElementById('setSchoolAddress').value
        }));
        localStorage.setItem('gyanVruksh_pdfSettings', JSON.stringify({
            watermark: document.getElementById('setWatermark').value,
            examName: document.getElementById('chkShowExam').checked,
            std: document.getElementById('chkShowStd').checked,
            subject: document.getElementById('chkShowSub').checked,
            date: document.getElementById('chkShowDate').checked,
            marks: document.getElementById('chkShowMarks').checked,
            numbering: 'continuous'
        }));
        alert("✅ સેટિંગ્સ સેવ થઈ ગયા!");
    };

    window.downloadBackup = function() {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([localStorage.getItem('gyanVruksh_questions') || '[]'], { type: 'application/json' }));
        a.download = `GyanVruksh_Backup.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    window.clearBank = function() {
        if (confirm("બધા પ્રશ્નો ડીલીટ કરવા છે?")) {
            localStorage.removeItem('gyanVruksh_questions');
            window.updateDynamicFilters('all');
            window.refreshData();
        }
    };

    window.deleteQ = function(id) {
        if (confirm("પ્રશ્ન ડીલીટ કરવો છે?")) {
            const allQ = JSON.parse(localStorage.getItem('gyanVruksh_questions')) || [];
            localStorage.setItem('gyanVruksh_questions', JSON.stringify(allQ.filter(q => q.id !== id)));
            window.updateDynamicFilters('all');
            window.renderQBank();
        }
    };

    window.importJSON = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                let txt = evt.target.result.trim();
                if (txt.startsWith('```json')) txt = txt.replace(/^```json/i, '').replace(/```$/i, '').trim();
                else if (txt.startsWith('```')) txt = txt.replace(/^```/i, '').replace(/```$/i, '').trim();

                let newQs;
                try {
                    newQs = JSON.parse(txt);
                } catch (err1) {
                    const safeTxt = txt.replace(/\\/g, "\\\\").replace(/\\\\"/g, '\\"').replace(/\\\\n/g, '\\n');
                    newQs = JSON.parse(safeTxt);
                }

                const existing = JSON.parse(localStorage.getItem('gyanVruksh_questions')) || [];
                newQs.forEach(q => existing.push(q));
                localStorage.setItem('gyanVruksh_questions', JSON.stringify(existing));
                alert(`✅ ${newQs.length} પ્રશ્નો સફળતાપૂર્વક ઈમ્પોર્ટ થયા!`);
                window.updateDynamicFilters('all');
                window.refreshData();
            } catch (err) {
                alert("ઈમ્પોર્ટ એરર (તમારી JSON ફાઈલનું ફોર્મેટ ખોટું છે): " + err.message);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    window.openAddModal = function() {
        const modal = document.getElementById('addQModal');
        if (modal) modal.style.display = 'flex';
    };

    window.saveManualAddQ = async function() {
        const t = document.getElementById('mqText').value;
        const a = document.getElementById('mqAns').value;
        if (!t) return alert("પ્રશ્ન લખવો જરૂરી છે!");

        const toBase64 = file => new Promise((res, rej) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => res(reader.result);
            reader.onerror = err => rej(err);
        });

        const qImgFile = document.getElementById('mqImg').files[0];
        const aImgFile = document.getElementById('mqAnsImg').files[0];
        const qImg = qImgFile ? await toBase64(qImgFile) : null;
        const aImg = aImgFile ? await toBase64(aImgFile) : null;

        const allQ = JSON.parse(localStorage.getItem('gyanVruksh_questions')) || [];
        allQ.push({
            id: "Q_" + Date.now(),
            standard: document.getElementById('mqStd').value,
            subject: document.getElementById('mqSub').value,
            chapter: document.getElementById('mqChap').value,
            type: document.getElementById('mqType').value,
            marks: Number(document.getElementById('mqMarks').value) || 1,
            text: t,
            answer: a,
            image: qImg,
            solutionImage: aImg
        });

        localStorage.setItem('gyanVruksh_questions', JSON.stringify(allQ));
        document.getElementById('addQModal').style.display = 'none';
        document.getElementById('mqText').value = '';
        document.getElementById('mqAns').value = '';
        document.getElementById('mqImg').value = '';
        document.getElementById('mqAnsImg').value = '';

        window.updateDynamicFilters('all');
        window.refreshData();
        alert("✅ નવો પ્રશ્ન સફળતાપૂર્વક ઉમેરાઈ ગયો!");
    };

    document.addEventListener('DOMContentLoaded', renderApp);
})();