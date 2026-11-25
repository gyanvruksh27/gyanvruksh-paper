// js/question-bank.js — Gyan Vruksh 3.3 (DOM-Isolated Smart Table Engine + Visual Table Builder + Transpose + All Features)

(function() {
// ... existing code ...
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
            .gv-dash-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
// ... existing code ...
    }

    // ==========================================
    // 🚀 3. DOM-ISOLATED SMART TABLE ENGINE & 2D MATH/SCIENCE PARSER
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

        let htmlTags = [];
        s = s.replace(/<\/?[a-zA-Z][^>]*>/g, function(match) {
            let code = `\uE000${idxToLetters(htmlTags.length)}\uE001`;
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
        // HTML, Escaped &lt;table&gt;, [TABLE]...[/TABLE], અને Markdown |...| ચારેય ફોર્મેટને એકસમાન <table> માં ફેરવે છે
        normalizeAllTableFormats: function(rawStr) {
            if (!rawStr) return '';
            let s = String(rawStr);

            // 1. અગાઉનું ડબલ રેપર હોય તો હટાવવું
            s = s.replace(/<div[^>]*class=["'][^"']*gv-table-scroll[^"']*["'][^>]*>\s*(<table\b[\s\S]*?<\/table\s*>)\s*<\/div>/gi, '$1');

            // 2. એસ્કેપ થયેલા ટેબલ ટેગ્સ (&lt;table&gt;) ને સાચા ટેગમાં ફેરવવા
            s = s.replace(/&amp;lt;/gi, '&lt;').replace(/&amp;gt;/gi, '&gt;');
            s = s.replace(/&lt;(\/?(?:table|thead|tbody|tfoot|tr|th|td)\b[^&]*)&gt;/gi, '<$1>');

            // 3. [TABLE]...[/TABLE] કસ્ટમ ફોર્મેટ સપોર્ટ
            s = s.replace(/\[TABLE\]([\s\S]*?)\[\/TABLE\]/gi, function(_, inner) {
                const rows = String(inner || '').trim().split(/\\n|\r?\n/).map(r => r.trim()).filter(Boolean);
                if (!rows.length) return '';
                let html = '<table>';
                rows.forEach((r, ri) => {
                    const cells = r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
                    html += '<tr>' + cells.map((c, ci) => (ri === 0 || ci === 0) ? `<th>${c}</th>` : `<td>${c}</td>`).join('') + '</tr>';
                });
                return html + '</table>';
            });

            // 4. Markdown Pipe Table સપોર્ટ (| વર્ગ | 0-10 | 10-20 |)
            s = s.replace(/(^|\n|\\n)(\|[^\n]+\|(?:(?:\n|\\n)\|[^\n]+\|)+)/g, function(full, prefix, block) {
                const lines = block.split(/\\n|\r?\n/).map(l => l.trim()).filter(Boolean);
                const dataLines = lines.filter(l => !/^\|[\s:|-]+\|$/.test(l));
                if (dataLines.length < 2) return full;
                let html = '<table>';
                dataLines.forEach((line, ri) => {
                    const cells = line.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
                    const tag = ri === 0 ? 'th' : 'td';
                    html += '<tr>' + cells.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>';
                });
                return prefix + html + '</table>';
            });

            return s;
        },

        // બ્રાઉઝરના અસલી DOM વડે દરેક ખાના (<td>/<th>) ને અલગથી સુરક્ષિત ફોર્મેટ કરીને ક્રિસ્પ બોર્ડરવાળું કોષ્ટક બનાવે છે
        renderCleanTableDOM: function(rawTableHtml, cellFormatter) {
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
                tbl.setAttribute('style', `width:100%; border-collapse:collapse; margin:0; background:#ffffff; border:1.5px solid #334155; font-size:${fontSize}; line-height:1.35;`);

                rows.forEach((tr) => {
                    Array.from(tr.children).forEach((cell, cIdx) => {
                        if (cell.tagName !== 'TD' && cell.tagName !== 'TH') return;
                        const innerFormatted = typeof cellFormatter === 'function' ? cellFormatter(cell.innerHTML) : cell.innerHTML;
                        cell.innerHTML = innerFormatted.replace(/\\n|\r?\n/g, '<br>');
                        const isTh = cell.tagName === 'TH';
                        const align = (isWideHoriz && isTh && cIdx === 0) ? 'left' : 'center';
                        const bg = isTh ? 'background:#f1f5f9; font-weight:700;' : 'background:#ffffff;';
                        cell.setAttribute('style', `border:1px solid #475569; padding:${cellPad}; text-align:${align}; vertical-align:middle; ${bg} color:#0f172a;`);
                    });
                });

                const singleLineTable = tbl.outerHTML.replace(/\r?\n/g, '');
                return `<div class="gv-table-scroll" style="display:block; width:100%; max-width:100%; overflow-x:auto; margin:8px 0;">${singleLineTable}</div>`;
            } catch (e) {
                return `<div class="gv-table-scroll">${rawTableHtml}</div>`;
            }
        },

        // 1-ક્લિકમાં આડા મોટા કોષ્ટકોને ઊભા (2-કોલમ) અથવા પાછા આડા ફેરવવા (પ્રિવ્યૂ અને PDF બંને માટે)
        toggleTransposeInContainer: function(containerEl) {
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
                        const isHead = (i === 0);
                        const tag = isHead ? 'th' : 'td';
                        const bg = isHead ? 'background:#f1f5f9; font-weight:700;' : 'background:#ffffff;';
                        newHtml += `<tr><${tag} style="border:1px solid #000; padding:4px 12px; text-align:center; ${bg}">${c0}</${tag}><${tag} style="border:1px solid #000; padding:4px 12px; text-align:center; ${bg}">${c1}</${tag}></tr>`;
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

    window.enhanceDataTables = function(rawStr) {
        return window.GVTableEngine.normalizeAllTableFormats(rawStr);
    };

    window.formatScienceAndMath = function(text) {
        if (!text) return '';
        let s = window.GVTableEngine.normalizeAllTableFormats(String(text));

        // <table>...</table> ને કોઈપણ Regex ચાલે તે પહેલાં સંપૂર્ણ અલગ સુરક્ષિત રાખવા (અક્ષરોવાળા ટોકનથી જેથી કોઈ સબસ્ક્રિપ્ટ Regex તેને અડે નહીં)
        const extractedTables = [];
        s = s.replace(/<table\b[^>]*>[\s\S]*?<\/table\s*>/gi, function(match) {
            const token = `\uE010tbl${idxToLetters(extractedTables.length)}\uE011`;
            extractedTables.push(match);
            return token;
        });

        s = formatMathCore(s);

        extractedTables.forEach((rawTbl, idx) => {
            const renderedTbl = window.GVTableEngine.renderCleanTableDOM(rawTbl, formatMathCore);
            const token = `\uE010tbl${idxToLetters(idx)}\uE011`;
            s = s.split(token).join(renderedTbl);
        });

        return s;
    };

    // ડ્રાફ્ટ લિસ્ટ માટે સુરક્ષિત પ્રિવ્યૂ સ્નિપેટ (જેથી કોષ્ટક કે HTML ટેગ અધવચ્ચે કપાઈને પેજ ન બગાડે)
    window.getSafeDraftSnippet = function(rawText) {
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

    // ==========================================
    // 📊 3B. VISUAL TABLE BUILDER MODAL (૧ ક્લિકમાં કોષ્ટક બનાવી પ્રશ્ન/જવાબમાં ઉમેરો)
    // ==========================================
    window.openTableBuilderModal = function(targetTextareaId) {
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
                    html += `<td style="padding:3px;"><input type="text" data-r="${r}" data-c="${c}" class="tb-cell-inp" value="${escapeAttr(gridData[r][c])}" style="width:100%; min-width:74px; padding:5px; border:1px solid ${isHead ? '#2563eb' : '#cbd5e1'}; background:${isHead ? '#eff6ff' : '#fff'}; font-weight:${isHead ? '700' : '400'}; border-radius:4px; font-size:12.5px;"></td>`;
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
                    tblHtml += `<${tag}>${String(gridData[r][c] || '').trim()}</${tag}>`;
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
// ... existing code ...
                <div style="margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; gap:6px; flex-wrap:wrap;">
                        <label style="font-size:12px; font-weight:bold;">પ્રશ્નનું લખાણ:</label>
                        <button type="button" class="gv-btn gv-btn-teal" style="padding:3px 9px; font-size:11.5px;" onclick="window.openTableBuilderModal('gvQText')">📊 કોષ્ટક બનાવો / ઉમેરો</button>
                    </div>
                    <textarea id="gvQText" rows="4" class="gv-input" placeholder="અહીં પ્રશ્ન લખો..."></textarea>
                </div>

                <!-- 🖼️ પ્રશ્નની ઈમેજ બોક્સ -->
// ... existing code ...
                <div style="margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; gap:6px; flex-wrap:wrap;">
                        <label style="font-size:12px; font-weight:bold;">જવાબ (Answer):</label>
                        <button type="button" class="gv-btn gv-btn-teal" style="padding:3px 9px; font-size:11.5px;" onclick="window.openTableBuilderModal('gvQAns')">📊 ઉત્તરમાં કોષ્ટક ઉમેરો</button>
                    </div>
                    <textarea id="gvQAns" rows="4" class="gv-input" placeholder="અહીં ઉત્તર લખો..."></textarea>
                </div>

                <!-- 👁️ લાઈવ પ્રશ્ન + કોષ્ટક પ્રિવ્યૂ -->
                <div id="gvModalLivePreviewBox" style="display:none; margin-bottom:10px; padding:10px 12px; background:#fffbeb; border:1.5px solid #f59e0b; border-radius:8px; font-size:14px; line-height:1.8;"></div>

                <!-- 🖼️ ઉત્તર / સોલ્યુશનની ઈમેજ બોક્સ -->
// ... existing code ...
                <div style="display:flex; gap:8px; justify-content:space-between; flex-wrap:wrap; align-items:center;">
                    <button type="button" id="gvQModalLivePreviewBtn" class="gv-btn gv-btn-orange" style="font-size:12.5px;">👁️ લાઈવ કોષ્ટક/ગણિત પ્રિવ્યૂ</button>
                    <div style="display:flex; gap:8px;">
                        <button type="button" id="gvQModalCancel" class="gv-btn gv-btn-dark">રદ કરો</button>
                        <button type="button" id="gvQModalSave" class="gv-btn gv-btn-green">💾 પ્રશ્ન સેવ કરો</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);

        const updateLiveModalPreview = () => {
            const pBox = modal.querySelector('#gvModalLivePreviewBox');
            if (!pBox || pBox.style.display === 'none') return;
            const qt = modal.querySelector('#gvQText').value;
            const qa = modal.querySelector('#gvQAns').value;
            pBox.innerHTML = `<div style="font-size:12px; font-weight:700; color:#b45309; margin-bottom:4px;">👁️ લાઈવ પ્રિવ્યૂ (આ રીતે પ્રશ્ન અને કોષ્ટક દેખાશે):</div>
                <div><strong>પ્રશ્ન:</strong> ${formatDisplayBlock(qt)}</div>
                ${qa ? `<div style="margin-top:8px; padding-top:6px; border-top:1px dashed #fbbf24;"><strong>ઉત્તર:</strong> ${formatDisplayBlock(qa)}</div>` : ''}`;
        };
        modal.querySelector('#gvQModalLivePreviewBtn').onclick = () => {
            const pBox = modal.querySelector('#gvModalLivePreviewBox');
            pBox.style.display = pBox.style.display === 'none' ? 'block' : 'none';
            updateLiveModalPreview();
        };
        modal.querySelector('#gvQText').addEventListener('input', updateLiveModalPreview);
        modal.querySelector('#gvQAns').addEventListener('input', updateLiveModalPreview);

        let tempQImage = '';
// ... existing code ...
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <strong style="font-size:15px;">👁️ પેપર પ્રિવ્યૂ</strong>
                        <button type="button" id="pvTabQ" class="gv-btn gv-btn-blue" style="padding:5px 11px; font-size:12.5px;">📄 પ્રશ્નપત્ર</button>
                        <button type="button" id="pvTabSol" class="gv-btn gv-btn-dark" style="padding:5px 11px; font-size:12.5px;">🔑 Answer Key</button>
                        <button type="button" id="pvTransposeTbl" class="gv-btn gv-btn-teal" style="padding:5px 11px; font-size:12.5px;" title="મોટા આડા કોષ્ટકને ઊભા 2-કોલમ કોષ્ટકમાં ફેરવો">🔄 કોષ્ટક: આડું / ઊભું</button>
                    </div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
// ... existing code ...
        overlay.querySelector('#pvTabQ').onclick = () => { currentPreviewType = 'question'; renderSheet(); };
        overlay.querySelector('#pvTabSol').onclick = () => { currentPreviewType = 'solution'; renderSheet(); };
        overlay.querySelector('#pvTransposeTbl').onclick = () => {
            const sheet = overlay.querySelector('#gvPreviewSheetContent');
            const cnt = window.GVTableEngine.toggleTransposeInContainer(sheet);
            if (cnt > 0) window.showToast(`🔄 ${cnt} મોટા કોષ્ટકનો લેઆઉટ બદલાયો!`);
            else window.showToast('આ પેપરમાં આડા મોટા કોષ્ટક નથી.', 'error');
        };
        overlay.querySelector('#pvPrintPDF').onclick = () => window.openVectorPDFWindow(paperObj, currentPreviewType, true);
// ... existing code ...
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootApp);
    } else {
        bootApp();
    }
})();
