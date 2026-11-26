// js/table-fix.js — Gyan Vruksh Non-Destructive Plug-and-Play Table Engine
// તમારા ઓરિજિનલ index.html અને question-bank.js ના એક પણ ફીચરને બદલ્યા વગર માત્ર કોષ્ટક (Table) 100% સાચા બતાવે છે.

(function () {
    'use strict';

    // 1. કોષ્ટક માટે જરૂરી CSS ઉમેરો (અન્ય UI ને અસર કર્યા વગર)
    function injectTableFixStyles() {
        if (document.getElementById('gvTableFixOnlyCSS')) return;
        const style = document.createElement('style');
        style.id = 'gvTableFixOnlyCSS';
        style.textContent = `
            .gv-table-scroll {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch;
                margin: 8px 0 !important;
            }
            table.gv-data-table {
                width: 100% !important;
                max-width: 100% !important;
                border-collapse: collapse !important;
                margin: 0 !important;
                background: #ffffff !important;
                border: 1.5px solid #334155 !important;
                font-size: 13px !important;
                line-height: 1.4 !important;
                table-layout: auto !important;
            }
            table.gv-data-table th,
            table.gv-data-table td {
                border: 1px solid #475569 !important;
                padding: 5px 6px !important;
                text-align: center !important;
                vertical-align: middle !important;
                color: #0f172a !important;
                word-break: keep-all !important;
            }
            table.gv-data-table th {
                background: #f1f5f9 !important;
                font-weight: 700 !important;
            }
            table.gv-data-table.gv-tbl-horiz th:first-child {
                text-align: left !important;
                min-width: 78px;
                max-width: 145px;
                white-space: normal !important;
            }
            table.gv-data-table.gv-tbl-compact { font-size: 11.5px !important; }
            table.gv-data-table.gv-tbl-compact th,
            table.gv-data-table.gv-tbl-compact td { padding: 3px 4px !important; }
            table.gv-data-table.gv-tbl-ultra { font-size: 10.5px !important; }
            table.gv-data-table.gv-tbl-ultra th,
            table.gv-data-table.gv-tbl-ultra td { padding: 2px 3px !important; }
            @media print {
                .gv-table-scroll { overflow: visible !important; }
                table.gv-data-table,
                table.gv-data-table th,
                table.gv-data-table td { border-color: #000000 !important; }
            }
        `;
        document.head.appendChild(style);
    }

    function idxToLetters(n) {
        let res = '';
        do {
            res = String.fromCharCode(97 + (n % 26)) + res;
            n = Math.floor(n / 26) - 1;
        } while (n >= 0);
        return res;
    }

    // 2. HTML, Escaped (&lt;table&gt;), [TABLE], અને Markdown |...| બધા ફોર્મેટને એકસમાન <table> માં ફેરવો
    function normalizeTables(rawStr) {
        if (!rawStr) return '';
        let s = String(rawStr);

        // પહેલાંથી જ રેપ થયેલ હોય તો અનરેપ કરો જેથી ડબલ રેપ ન થાય
        s = s.replace(/<div[^>]*class=["'][^"']*gv-table-scroll[^"']*["'][^>]*>\s*(<table\b[\s\S]*?<\/table\s*>)\s*<\/div>/gi, '$1');

        // ડબલ કે સિંગલ એસ્કેપ થયેલા ટેગ્સને અસલી HTML ટેગ્સ બનાવો
        s = s.replace(/&amp;lt;/gi, '&lt;').replace(/&amp;gt;/gi, '&gt;');
        s = s.replace(/&lt;(\/?(?:table|thead|tbody|tfoot|tr|th|td)\b[^&]*)&gt;/gi, '<$1>');

        // [TABLE]...[/TABLE] ફોર્મેટ સપોર્ટ
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

        // Markdown |...| કોષ્ટક સપોર્ટ
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
    }

    // 3. DOM વડે સુરક્ષિત રીતે કોષ્ટક અને તેના દરેક ખાનાનું ગણિત ફોર્મેટ કરો
    function buildCleanTableHTML(rawTableHtml, cellFormatterFn) {
        try {
            const cleaned = String(rawTableHtml || '')
                .replace(/\\n|\r?\n/g, ' ')
                .replace(/>(?:\s|<br\s*\/?>)+<(?=\/?(?:table|thead|tbody|tfoot|tr|th|td)\b)/gi, '><');

            const holder = document.createElement('div');
            holder.innerHTML = cleaned;
            const tbl = holder.querySelector('table');
            if (!tbl) return cleaned;

            const rows = Array.from(tbl.querySelectorAll('tr'));
            let maxCols = 0;
            rows.forEach(tr => {
                let cols = 0;
                Array.from(tr.children).forEach(cell => {
                    if (cell.tagName === 'TD' || cell.tagName === 'TH') {
                        cols += Number(cell.getAttribute('colspan')) || 1;
                    }
                });
                if (cols > maxCols) maxCols = cols;
            });

            const classes = ['gv-data-table'];
            let fontSize = '13px';
            let pad = '5px 6px';
            if (maxCols >= 10) {
                classes.push('gv-tbl-ultra');
                fontSize = '10.5px';
                pad = '2px 3px';
            } else if (maxCols >= 7) {
                classes.push('gv-tbl-compact');
                fontSize = '11.5px';
                pad = '3px 4px';
            }
            const isWideHoriz = (rows.length === 2 && maxCols >= 5);
            if (isWideHoriz) classes.push('gv-tbl-horiz');

            tbl.className = classes.join(' ');
            tbl.setAttribute('border', '1');
            tbl.setAttribute('cellspacing', '0');
            tbl.setAttribute('cellpadding', '4');
            tbl.setAttribute('style', 'width:100%; border-collapse:collapse; margin:0; background:#ffffff; border:1.5px solid #334155; font-size:' + fontSize + '; line-height:1.35;');

            rows.forEach(tr => {
                Array.from(tr.children).forEach((cell, cIdx) => {
                    if (cell.tagName !== 'TD' && cell.tagName !== 'TH') return;
                    const rawCell = cell.innerHTML;
                    const formattedCell = typeof cellFormatterFn === 'function' ? cellFormatterFn(rawCell) : rawCell;
                    cell.innerHTML = String(formattedCell || '').replace(/\\n|\r?\n/g, '<br>');

                    const isTh = cell.tagName === 'TH';
                    const align = (isWideHoriz && isTh && cIdx === 0) ? 'left' : 'center';
                    const bg = isTh ? 'background:#f1f5f9; font-weight:700;' : 'background:#ffffff;';
                    cell.setAttribute('style', 'border:1px solid #475569; padding:' + pad + '; text-align:' + align + '; vertical-align:middle; ' + bg + ' color:#0f172a;');
                });
            });

            const oneLine = tbl.outerHTML.replace(/\r?\n/g, '');
            return '<div class="gv-table-scroll" style="display:block; width:100%; max-width:100%; overflow-x:auto; margin:8px 0;">' + oneLine + '</div>';
        } catch (err) {
            return '<div class="gv-table-scroll">' + rawTableHtml + '</div>';
        }
    }

    // 4. તમારા ઓરિજિનલ formatScienceAndMath ફંક્શનને સુરક્ષિત રીતે Wrap કરો
    function patchFormatters() {
        if (typeof window.formatScienceAndMath === 'function' && !window.formatScienceAndMath.__gvTablePatched) {
            const origFormatter = window.formatScienceAndMath;
            const wrapped = function (text) {
                if (!text) return '';
                let s = normalizeTables(String(text));

                // જો કોઈ કોષ્ટક જ ન હોય તો સીધું ઓરિજિનલ ફંક્શન ચલાવો
                if (!/<table\b/i.test(s)) {
                    return origFormatter(s);
                }

                // કોષ્ટકને ગણિતના Regex પહેલાં અલગ કાઢો (નોંધ: ટોકનમાં _ કે અંકો નથી!)
                const tables = [];
                s = s.replace(/<table\b[^>]*>[\s\S]*?<\/table\s*>/gi, function (match) {
                    const token = '\uE020gvtbl' + idxToLetters(tables.length) + '\uE021';
                    tables.push(match);
                    return token;
                });

                s = origFormatter(s);

                tables.forEach((rawTbl, idx) => {
                    const cleanTbl = buildCleanTableHTML(rawTbl, origFormatter);
                    const token = '\uE020gvtbl' + idxToLetters(idx) + '\uE021';
                    s = s.split(token).join(cleanTbl);
                });

                return s;
            };
            wrapped.__gvTablePatched = true;
            window.formatScienceAndMath = wrapped;
        }
    }

    // 5. જો કોઈ જૂના કોડમાં escapeHtml થઈને સ્ક્રીન પર <table> ટેક્સ્ટ તરીકે દેખાઈ રહ્યું હોય તો તેને પણ ઓટો-રિપેર કરો
    function repairEscapedTablesInDOM() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);
        const candidates = [];
        let node;
        while ((node = walker.nextNode())) {
            const tag = node.tagName;
            if (tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE' || tag === 'PRE') continue;
            if (node.closest && node.closest('textarea, input, code, pre, .gv-table-scroll')) continue;
            if (node.children.length === 0 || (node.innerHTML && /&lt;table\b/i.test(node.innerHTML))) {
                if (node.innerHTML && /&lt;table\b[\s\S]*?&lt;\/table\s*&gt;/i.test(node.innerHTML)) {
                    candidates.push(node);
                }
            }
        }
        candidates.forEach(el => {
            if (el.querySelector && el.querySelector('textarea, input')) return;
            const origFn = window.formatScienceAndMath || ((x) => x);
            const normalized = normalizeTables(el.innerHTML);
            if (/<table\b/i.test(normalized)) {
                el.innerHTML = normalized.replace(/<table\b[^>]*>[\s\S]*?<\/table\s*>/gi, function (m) {
                    return buildCleanTableHTML(m, origFn);
                });
            }
        });
    }

    // 6. બૂટ અને મોનિટર
    function initTableFix() {
        injectTableFixStyles();
        patchFormatters();
        repairEscapedTablesInDOM();

        let timer = null;
        const obs = new MutationObserver(() => {
            patchFormatters();
            if (timer) clearTimeout(timer);
            timer = setTimeout(repairEscapedTablesInDOM, 120);
        });
        if (document.body) {
            obs.observe(document.body, { childList: true, subtree: true });
        }
    }

    // 7. કોષ્ટક ચેક કરવાનું હેલ્પર (Console માં checkTablesInBank() લખીને પણ ચેક કરી શકાય)
    window.checkTablesInBank = function () {
        const keys = ['gyanVruksh_questions', 'gyanVruksh_questionBank', 'questions'];
        let list = [];
        for (let k of keys) {
            try {
                const arr = JSON.parse(localStorage.getItem(k));
                if (Array.isArray(arr) && arr.length) { list = arr; break; }
            } catch (e) {}
        }
        const ch13 = list.filter(q => String(q.chapter) === '13');
        const withTbl = list.filter(q => /<table|&lt;table|\[TABLE\]/i.test((q.text || '') + ' ' + (q.answer || '')));
        console.log('કુલ પ્રશ્નો:', list.length, '| પ્રકરણ 13:', ch13.length, '| કોષ્ટકવાળા પ્રશ્નો:', withTbl.length);
        return { total: list.length, ch13: ch13.length, withTables: withTbl.length };
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTableFix);
    } else {
        initTableFix();
    }
})();
