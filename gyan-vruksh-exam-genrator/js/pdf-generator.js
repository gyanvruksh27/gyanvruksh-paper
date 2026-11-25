// js/pdf-generator.js — Gyan Vruksh 3.3 (Clean Error-Free JS + Bulletproof DOM Tables + 1-Click Horizontal/Vertical Print Toggle)

window.GV_LANG_LABELS = {
    gu: { std: 'ધોરણ', sub: 'વિષય', date: 'તારીખ', marks: 'કુલ ગુણ', section: 'વિભાગ', ans: 'ઉત્તર', colA: 'વિભાગ A', colB: 'વિભાગ B', solTitle: '(Answer Key)', anyOf: 'કોઈ પણ' },
    en: { std: 'Std', sub: 'Subject', date: 'Date', marks: 'Total Marks', section: 'SECTION', ans: 'Answer', colA: 'Column A', colB: 'Column B', solTitle: '(Answer Key)', anyOf: 'Attempt any' },
    hi: { std: 'कक्षा', sub: 'विषय', date: 'दिनांक', marks: 'कुल अंक', section: 'विभाग', ans: 'उत्तर', colA: 'विभाग अ', colB: 'विभाग ब', solTitle: '(उत्तर कुंजी)', anyOf: 'कोई भी' },
    sa: { std: 'कक्षा', sub: 'विषयः', date: 'दिनाङ्कः', marks: 'कुल अङ्काः', section: 'विभागः', ans: 'उत्तरम्', colA: 'विभागः अ', colB: 'विभागः ब', solTitle: '(उत्तरमाला)', anyOf: 'केचन' }
};

window.GV_PDF_DEFAULT_INST = {
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

window.detectPaperLanguage = function (paper) {
    if (paper && paper.lang && window.GV_LANG_LABELS[paper.lang]) return paper.lang;
    const sub = String((paper && paper.subject) || '').toLowerCase();
    if (sub.includes('english') || sub.includes('અંગ્રેજી')) return 'en';
    if (sub.includes('sanskrit') || sub.includes('સંસ્કૃત') || sub.includes('संस्कृत')) return 'sa';
    if (sub.includes('hindi') || sub.includes('હિન્દી') || sub.includes('हिन्दी') || sub.includes('हिंदी')) return 'hi';
    const firstQ = ((paper && paper.questions) || []).find(q => q && q.lang && window.GV_LANG_LABELS[q.lang]);
    return firstQ ? firstQ.lang : 'gu';
};

window.getPDFQuestionInstruction = function (q) {
    if (!q || q.type === 'instruction') return '';
    if (q.instruction && String(q.instruction).trim() !== '') return String(q.instruction).trim();
    if (typeof window.getEffectiveInstruction === 'function') return window.getEffectiveInstruction(q);
    if (window.DEFAULT_INSTRUCTIONS && window.DEFAULT_INSTRUCTIONS[q.type]) return window.DEFAULT_INSTRUCTIONS[q.type];
    return window.GV_PDF_DEFAULT_INST[q.type] || '';
};

function resolvePaperObj(paperOrId) {
    if (typeof paperOrId === 'object' && paperOrId !== null) return paperOrId;
    try {
        const papers = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || [];
        return papers.find(p => p.id === paperOrId);
    } catch (e) {
        return null;
    }
}

window.downloadPDF = function (paperId, type) {
    window.openVectorPDFWindow(paperId, type, true);
};

window.printPaper = function (paperId, type) {
    window.openVectorPDFWindow(paperId, type, false);
};

window.openVectorPDFWindow = function (paperOrId, type, isDownloadMode) {
    const paper = resolvePaperObj(paperOrId);
    if (!paper) return;

    const paperLang = window.detectPaperLanguage(paper);
    const rawHTML = window.generatePaperHTML(paper, type, false);
    const fileName = (paper.title || 'Paper') + '_' + (type === 'solution' ? 'Answer_Key' : 'Question_Paper');

    const printWin = window.open('', '_blank');
    if (!printWin) {
        if (typeof window.showToast === 'function') {
            window.showToast('કૃપા કરીને બ્રાઉઝરમાં Pop-up ની પરવાનગી આપો.', 'error');
        }
        return;
    }

    printWin.document.write(`
        <!DOCTYPE html>
        <html lang="${paperLang}">
        <head>
            <meta charset="UTF-8">
            <title>${fileName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Mukta+Vaani:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Gujarati:wght@400;600;700&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 portrait; margin: 12mm 14mm 12mm 14mm; }
                * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                body { font-family: 'Noto Sans Gujarati', 'Noto Sans Devanagari', 'Inter', 'Mukta Vaani', 'Shruti', sans-serif; background: #525659; color: #000; margin: 0; padding: 0; font-size: 14.5px; line-height: 1.9; }
                .m-frac { display: inline-flex; flex-direction: column; vertical-align: middle; text-align: center; padding: 2px 4px; margin: 2px 3px; font-size: 0.96em; line-height: 1.3; font-weight: 600; }
                .m-num { border-bottom: 1.5px solid #000; padding: 0 4px 2px 4px; display: block; color: #000; }
                .m-den { padding: 2px 4px 1px 4px; display: block; color: #000; min-height: 1.15em; }
                sup .m-frac { font-size: 0.82em; line-height: 1.1; padding: 0 2px; margin: 0 1px; }
                sup .m-num { border-bottom-width: 1.2px; padding: 0 2px 1px 2px; }
                sup .m-den { padding: 1px 2px 0 2px; }
                .m-sqrt { display: inline-flex; align-items: stretch; vertical-align: middle; padding-top: 3px; margin: 1px 2px; line-height: 1.25; }
                .m-sqrt-sym { font-size: 1.18em; line-height: 1; margin-right: -1px; display: inline-block; transform: translateY(1px); font-weight: bold; }
                .m-sqrt-body { border-top: 1.5px solid #000; padding: 2px 4px 0 3px; display: inline-block; }
                sup { font-size: 0.8em; vertical-align: super; line-height: 0; font-weight: 600; }
                sub { font-size: 0.8em; vertical-align: sub; line-height: 0; font-weight: 600; }
                .gv-passage-box { background: #f8fafc; border: 1.2px solid #333; border-left: 3.5px solid #000; padding: 8px 12px; margin: 6px 0 8px 0; font-weight: 400; line-height: 1.75; page-break-inside: avoid; }
                .gv-table-scroll { display: block; width: 100%; max-width: 100%; overflow-x: auto; margin: 6px 0; page-break-inside: avoid; }
                .gv-data-table { width: 100% !important; max-width: 100% !important; table-layout: auto !important; border-collapse: collapse !important; margin: 0 !important; font-size: 12.5px; line-height: 1.35 !important; page-break-inside: avoid; background: #fff !important; }
                .gv-data-table tr { page-break-inside: avoid !important; }
                .gv-data-table th, .gv-data-table td { border: 1px solid #000 !important; padding: 4px 5px !important; text-align: center !important; vertical-align: middle !important; line-height: 1.35 !important; word-break: keep-all !important; overflow-wrap: normal !important; white-space: normal !important; }
                .gv-data-table th { background: #f1f5f9 !important; font-weight: bold !important; color: #000 !important; }
                .gv-data-table.gv-tbl-horiz th:first-child { text-align: left !important; min-width: 72px; max-width: 125px; padding: 3px 5px !important; font-size: 11px !important; }
                .gv-data-table.gv-tbl-compact { font-size: 11px !important; }
                .gv-data-table.gv-tbl-compact th, .gv-data-table.gv-tbl-compact td { padding: 3px 3px !important; }
                .gv-data-table.gv-tbl-ultra { font-size: 10px !important; }
                .gv-data-table.gv-tbl-ultra th, .gv-data-table.gv-tbl-ultra td { padding: 2px 2px !important; }
                .gv-data-table.gv-tbl-transposed { width: auto !important; min-width: 55% !important; max-width: 100% !important; margin: 4px auto !important; font-size: 12.5px !important; }
                .gv-data-table.gv-tbl-transposed th, .gv-data-table.gv-tbl-transposed td { padding: 4px 12px !important; white-space: normal !important; }
                .gv-data-table .m-frac { font-size: 0.88em; padding: 1px 2px; margin: 1px; line-height: 1.15; }
                .top-action-bar { position: sticky; top: 0; left: 0; width: 100%; background: #1e293b; color: #fff; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: sans-serif; }
                .action-btn { padding: 8px 14px; border: none; border-radius: 6px; font-size: 13.5px; font-weight: bold; cursor: pointer; color: white; }
                .btn-transpose { background: #0d9488; }
                .btn-save-pdf { background: #16a34a; }
                .btn-close { background: #dc2626; }
                .paper-sheet { width: 210mm; min-height: 297mm; margin: 20px auto; padding: 12mm 14mm; background: #ffffff; box-shadow: 0 0 20px rgba(0,0,0,0.4); position: relative; text-align: left; }
                @media print {
                    body { background: #ffffff; }
                    .no-print { display: none !important; }
                    .paper-sheet { width: 100%; min-height: auto; margin: 0; padding: 0; box-shadow: none; }
                    .gv-table-scroll { overflow: visible !important; }
                }
                .print-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8px; }
                .print-header h1 { font-size: 22px; margin: 0 0 3px 0; font-weight: 700; line-height: 1.3; }
                .print-header p { font-size: 13.5px; margin: 2px 0; color: #111; }
                .exam-meta { display: flex; justify-content: space-between; flex-wrap: wrap; font-size: 14.5px; font-weight: 600; margin-top: 6px; padding: 5px 0; border-top: 1px dashed #444; border-bottom: 1px dashed #444; text-align: left; }
                .sec-banner { text-align: center; font-weight: bold; font-size: 16px; margin: 14px 0 8px 0; border: 1.5px solid #000; padding: 3px; background: #f1f5f9; page-break-inside: avoid; }
                .sec-instruction, .auto-inst-bar { font-size: 14.5px; font-weight: bold; margin: 10px 0 6px 0; padding: 3px 0; border-bottom: 1px dotted #94a3b8; display: flex; justify-content: space-between; gap: 8px; page-break-inside: avoid; break-after: avoid; }
                .q-row-table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-bottom: 10px; page-break-inside: avoid !important; text-align: left !important; }
                .q-row-table.has-data-table { page-break-inside: auto !important; }
                .q-cell-text { width: 89%; padding-right: 10px; vertical-align: top; font-size: 15px; word-wrap: break-word; overflow-wrap: break-word; text-align: left !important; line-height: 2.05; }
                .q-cell-full { width: 100%; padding: 2px 0 4px 18px; vertical-align: top; font-size: 15px; word-wrap: break-word; text-align: left !important; line-height: 1.95; }
                .q-cell-marks { width: 11%; vertical-align: top; text-align: right !important; font-weight: bold; font-size: 14.5px; white-space: nowrap; }
                .p-ans-box { margin-top: 6px; padding: 8px 10px; background: #f8fafc; border-left: 3px solid #334155; font-size: 14.5px; page-break-inside: avoid !important; text-align: left !important; line-height: 2.1; }
                .p-ans-box.has-data-table { page-break-inside: auto !important; }
                .mcq-table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 5px; text-align: left !important; }
                .mcq-table td { width: 50%; padding: 4px 8px 4px 0; vertical-align: middle; font-size: 14.5px; line-height: 1.95; }
                .gv-paper-img-wrap { margin: 7px 0; page-break-inside: avoid !important; }
                .gv-paper-img-wrap img { max-width: 100%; height: auto; display: inline-block; border-radius: 3px; }
                .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 65px; color: rgba(0, 0, 0, 0.05); z-index: 0; pointer-events: none; font-weight: bold; white-space: nowrap; }
            </style>
        </head>
        <body>
            <div class="top-action-bar no-print">
                <div style="font-size:14px;">💡 <strong>PDF ટિપ:</strong> Destination માં <strong>"Save as PDF"</strong> પસંદ કરી Save દબાવો.</div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button class="action-btn btn-transpose" onclick="toggleWideTablesOrientation()">🔄 કોષ્ટક: આડું / ઊભું</button>
                    <button class="action-btn btn-save-pdf" onclick="window.print()">🖨️ Save as PDF / Print</button>
                    <button class="action-btn btn-close" onclick="window.close()">✖ બંધ કરો</button>
                </div>
            </div>
            <div class="paper-sheet" id="printableArea">${rawHTML}</div>
            <script>
                function toggleWideTablesOrientation() {
                    var tables = document.querySelectorAll('table[data-gv-transposable="1"]');
                    tables.forEach(function(tbl) {
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
                            var rows = tbl.querySelectorAll('tr');
                            if (rows.length !== 2) return;
                            var r0 = Array.from(rows[0].children).filter(function(c){ return c.tagName === 'TH' || c.tagName === 'TD'; });
                            var r1 = Array.from(rows[1].children).filter(function(c){ return c.tagName === 'TH' || c.tagName === 'TD'; });
                            var maxLen = Math.max(r0.length, r1.length);
                            var out = '<tbody>';
                            for (var i = 0; i < maxLen; i++) {
                                var c0 = r0[i] ? r0[i].innerHTML : '';
                                var c1 = r1[i] ? r1[i].innerHTML : '';
                                var tag = i === 0 ? 'th' : 'td';
                                var bg = i === 0 ? 'background:#f1f5f9; font-weight:700;' : 'background:#ffffff;';
                                out += '<tr><' + tag + ' style="border:1px solid #000; padding:4px 12px; text-align:center; ' + bg + '">' + c0 + '</' + tag + '><' + tag + ' style="border:1px solid #000; padding:4px 12px; text-align:center; ' + bg + '">' + c1 + '</' + tag + '></tr>';
                            }
                            out += '</tbody>';
                            tbl.innerHTML = out;
                            tbl.className = 'gv-data-table gv-tbl-transposed';
                            tbl.setAttribute('style', 'width:auto; min-width:55%; max-width:100%; border-collapse:collapse; margin:4px auto; background:#ffffff; border:1.5px solid #000; font-size:12.5px;');
                            tbl.dataset.isTransposed = '1';
                        }
                    });
                }
                window.onload = function() {
                    var triggerPrint = function() { setTimeout(function() { window.print(); }, 450); };
                    if (document.fonts && document.fonts.ready) {
                        document.fonts.ready.then(triggerPrint).catch(triggerPrint);
                    } else {
                        triggerPrint();
                    }
                };
            <\/script>
        </body>
        </html>
    `);
    printWin.document.close();
    printWin.focus();
};

window.downloadWord = function (paperOrId, type) {
    const paper = resolvePaperObj(paperOrId);
    if (!paper) return;

    const rawHTML = window.generatePaperHTML(paper, type, true);
    const wordDoc = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>${paper.title || 'Paper'}</title>
            <style>
                body { font-family: 'Shruti', 'Noto Sans Gujarati', 'Mangal', Arial, sans-serif; font-size: 11.5pt; color: #000; line-height: 1.6; }
                .print-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8px; }
                .print-header h1 { font-size: 16pt; margin: 0 0 3px 0; }
                .exam-meta { font-weight: bold; border-top: 1px dashed #444; border-bottom: 1px dashed #444; padding: 5px 0; margin-bottom: 10px; }
                .sec-banner { text-align: center; font-weight: bold; border: 1px solid #000; background: #f1f5f9; padding: 4px; margin: 12px 0 6px 0; }
                .sec-instruction, .auto-inst-bar { font-weight: bold; margin: 8px 0 5px 0; border-bottom: 1px dotted #94a3b8; padding-bottom: 2px; }
                .q-row-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
                .q-cell-text { width: 88%; vertical-align: top; }
                .q-cell-full { width: 100%; padding: 2px 0 4px 14px; vertical-align: top; }
                .q-cell-marks { width: 12%; vertical-align: top; text-align: right; font-weight: bold; }
                .mcq-table { width: 100%; border-collapse: collapse; margin-top: 4px; }
                .mcq-table td { width: 50%; padding: 2px 6px 2px 0; }
                .p-ans-box { margin-top: 4px; padding: 6px; background: #f8fafc; border-left: 3px solid #334155; }
                .gv-table-scroll { width: 100%; margin: 6px 0; }
                .gv-data-table { width: 100%; border-collapse: collapse; margin: 0; font-size: 10pt; }
                .gv-data-table th, .gv-data-table td { border: 1px solid #000; padding: 3px 4px; text-align: center; vertical-align: middle; }
                .gv-data-table th { background: #f1f5f9; font-weight: bold; }
                .gv-data-table.gv-tbl-compact { font-size: 9pt; }
                .gv-data-table.gv-tbl-ultra { font-size: 8.5pt; }
                .gv-data-table.gv-tbl-ultra th, .gv-data-table.gv-tbl-ultra td { padding: 2px 2px; }
                .gv-passage-box { border: 1px solid #333; padding: 8px; background: #f8fafc; margin: 6px 0; }
                .gv-paper-img-wrap { margin: 6px 0; }
            </style>
        </head>
        <body>${rawHTML}</body>
        </html>`;

    const blob = new Blob(['\ufeff', wordDoc], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (paper.title || 'Paper') + '_' + (type === 'solution' ? 'Answer_Key' : 'Question_Paper') + '.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof window.showToast === 'function') {
        window.showToast('📝 Word ફાઈલ (.doc) ડાઉનલોડ થઈ ગઈ!');
    }
};

window.renderImageBlockForPDF = function (src, widthSetting, alignSetting, forWord) {
    if (!src || !String(src).trim()) return '';
    const wVal = widthSetting || '220px';
    const alignVal = alignSetting || 'center';
    const numericPx = wVal.endsWith('px') ? parseInt(wVal, 10) : (wVal === '100%' ? 460 : 220);
    if (forWord) {
        return '<div class="gv-paper-img-wrap" align="' + alignVal + '" style="text-align:' + alignVal + '; margin:6px 0;"><img src="' + src + '" width="' + numericPx + '" style="width:' + wVal + '; max-width:100%; height:auto;"></div>';
    }
    return '<div class="gv-paper-img-wrap" style="text-align:' + alignVal + '; margin:7px 0;"><img src="' + src + '" style="width:' + wVal + '; max-width:100%; height:auto; border:1px solid #e2e8f0; padding:2px; background:#fff;"></div>';
};

window.groupSectionQuestionsByInstruction = function (items, hasSecOption, secName) {
    const hasManualInst = items.some(q => q.type === 'instruction');
    if (hasManualInst) return items;

    let orderedItems = items.slice();
    if (secName === 'A' && typeof window.sortSectionAQuestions === 'function') {
        orderedItems = window.sortSectionAQuestions(orderedItems);
    }

    const groups = [];
    const map = new Map();
    orderedItems.forEach(q => {
        const inst = window.getPDFQuestionInstruction(q);
        const typeKey = secName === 'A' ? (String(q.type || '') + '|||' + inst) : inst;
        if (!map.has(typeKey)) {
            const grp = { instruction: inst, type: q.type, questions: [] };
            map.set(typeKey, grp);
            groups.push(grp);
        }
        map.get(typeKey).questions.push(q);
    });
    const result = [];
    groups.forEach(grp => {
        if (grp.instruction) {
            const grpMarks = grp.questions.reduce((sum, x) => sum + Number(x.marks || 0), 0);
            result.push({ type: 'auto_instruction', text: grp.instruction, groupMarks: hasSecOption ? null : grpMarks });
        }
        grp.questions.forEach(q => result.push(q));
    });
    return result;
};

window.getSectionEffectiveMarksForPDF = function (secQuestions, secMeta) {
    if (typeof window.calculateSectionEffectiveMarks === 'function') {
        return window.calculateSectionEffectiveMarks(secQuestions, secMeta);
    }
    const realQs = (secQuestions || []).filter(q => q && q.type !== 'instruction' && q.type !== 'auto_instruction');
    const attNum = secMeta && Number(secMeta.attemptCount) > 0 ? Number(secMeta.attemptCount) : 0;
    if (attNum > 0 && attNum < realQs.length) {
        return realQs.slice(0, attNum).reduce((s, q) => s + Number(q.marks || 0), 0);
    }
    return realQs.reduce((s, q) => s + Number(q.marks || 0), 0);
};

function renderInstructionRowHTML(leftText, rightText, className, forWord) {
    if (forWord) {
        return '<table style="width:100%; border-collapse:collapse; margin:8px 0 5px 0; border-bottom:1px dotted #94a3b8;"><tr><td style="font-weight:bold; text-align:left; padding:2px 0;">' + leftText + '</td><td style="font-weight:bold; text-align:right; padding:2px 0; white-space:nowrap;">' + rightText + '</td></tr></table>';
    }
    return '<div class="' + className + '"><span>' + leftText + '</span><span>' + rightText + '</span></div>';
}

window.generatePaperHTML = function (paper, type, forWord) {
    const schoolData = JSON.parse(localStorage.getItem('gyanVruksh_schoolProfile')) || { name: 'જ્ઞાન વૃક્ષ વિદ્યાલય', address: '' };
    const pdfSet = JSON.parse(localStorage.getItem('gyanVruksh_pdfSettings')) || { examName: true, date: true, std: true, subject: true, marks: true, numbering: 'continuous', watermark: '' };
    const sMeta = paper.sectionsMetadata || {};
    const order = paper.sectionOrder || ['None', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

    const lang = window.detectPaperLanguage(paper);
    const L = window.GV_LANG_LABELS[lang] || window.GV_LANG_LABELS.gu;

    const sData = { None: [], A: [], B: [], C: [], D: [], E: [], F: [], G: [] };
    (paper.questions || []).forEach(q => {
        const secKey = (q.section && sData[q.section]) ? q.section : 'None';
        sData[secKey].push(q);
    });

    const computedTotalMarks = order.reduce((sum, sec) => sum + window.getSectionEffectiveMarksForPDF(sData[sec], sMeta[sec]), 0);
    const displayTotalMarks = computedTotalMarks > 0 ? computedTotalMarks : (paper.totalMarks || 0);

    let html = '<div class="print-header"><h1>' + schoolData.name + '</h1>';
    if (schoolData.address) html += '<p>' + schoolData.address + '</p>';
    html += '</div>';

    if (!forWord && pdfSet.watermark) html += '<div class="watermark">' + pdfSet.watermark + '</div>';

    html += '<div class="exam-meta">';
    if (pdfSet.examName) html += '<div style="width:100%; text-align:center; font-size:17.5px; font-weight:bold; text-decoration:underline; margin-bottom:6px;">' + paper.title + ' ' + (type === 'solution' ? L.solTitle : '') + '</div>';
    if (pdfSet.std && paper.standard) html += '<span>' + L.std + ': ' + paper.standard + '</span>';
    if (pdfSet.subject && paper.subject) html += '<span> &nbsp;|&nbsp; ' + L.sub + ': ' + paper.subject + '</span>';
    if (pdfSet.date && paper.date) html += '<span> &nbsp;|&nbsp; ' + L.date + ': ' + window.formatDateDDMMYYYY(paper.date) + '</span>';
    if (pdfSet.marks) html += '<span style="float:right;">' + L.marks + ': ' + displayTotalMarks + '</span>';
    html += '</div><div class="print-questions" style="margin-top:10px; text-align:left;">';

    let gQNum = 1;
    order.forEach(sec => {
        if (sData[sec] && sData[sec].length > 0) {
            const realQs = sData[sec].filter(q => q.type !== 'instruction');
            const metaObj = sMeta[sec] || {};
            const secEffMarks = window.getSectionEffectiveMarksForPDF(sData[sec], metaObj);
            const attNum = Number(metaObj.attemptCount) > 0 && Number(metaObj.attemptCount) < realQs.length ? Number(metaObj.attemptCount) : 0;
            const secOptText = (metaObj.attempt && metaObj.attempt.trim())
                ? metaObj.attempt.trim()
                : (attNum > 0 ? (L.anyOf + ' ' + attNum) : '');
            const hasSecOption = !!(secOptText || attNum > 0);
            const secManualInst = (metaObj.instruction && metaObj.instruction.trim()) ? metaObj.instruction.trim() : '';

            if (sec !== 'None') {
                html += '<div class="sec-banner">' + L.section + ' - ' + sec + (secOptText ? (' (' + secOptText + ')') : '') + ' &nbsp;[' + secEffMarks + ']</div>';
            }
            if (secManualInst) {
                html += renderInstructionRowHTML('• ' + secManualInst, secOptText ? ('(' + secOptText + ')') : '', 'sec-instruction', forWord);
            }

            const groupedItems = window.groupSectionQuestionsByInstruction(sData[sec], hasSecOption, sec);
            let sQNum = 1;
            groupedItems.forEach(q => {
                if (q.type === 'instruction') {
                    html += renderInstructionRowHTML(q.text ? ('• ' + q.text) : '', q.attempt ? ('(' + q.attempt + ')') : '', 'sec-instruction', forWord);
                } else if (q.type === 'auto_instruction') {
                    if (q.text && q.text !== secManualInst) {
                        const marksBadge = (q.groupMarks !== null && q.groupMarks !== undefined) ? ('[' + q.groupMarks + ']') : '';
                        html += renderInstructionRowHTML('&#9656; ' + q.text, marksBadge, 'auto-inst-bar', forWord);
                    }
                } else {
                    const qNum = (pdfSet.numbering === 'continuous' || sec === 'None') ? gQNum : sQNum;
                    const formattedQ = window.formatForPDF(q, lang, forWord);
                    const tblSplitMatch = formattedQ.match(/<div\s+class="gv-table-scroll"/i);
                    const tblSplitIdx = tblSplitMatch ? tblSplitMatch.index : -1;
                    const hasQTable = tblSplitIdx !== -1;
                    const qImgHTML = (q.image && !formattedQ.includes('gv-mcq-img-placed'))
                        ? window.renderImageBlockForPDF(q.image, q.imageWidth || '220px', q.imageAlign || 'center', forWord)
                        : '';

                    let ansBoxHTML = '';
                    let hasAnsTable = false;
                    if (type === 'solution') {
                        const hasAnsText = q.answer && String(q.answer).trim() !== '';
                        const hasSolImg = q.solutionImage && String(q.solutionImage).trim() !== '';
                        const formattedAnsBody = hasAnsText ? window.formatAns(q.answer) : '';
                        hasAnsTable = formattedAnsBody.includes('gv-data-table');
                        ansBoxHTML = '<div class="p-ans-box' + (hasAnsTable ? ' has-data-table' : '') + '"><strong>' + L.ans + ':</strong>';
                        if (hasAnsText) {
                            ansBoxHTML += '<br><div style="margin-left:8px;">' + formattedAnsBody + '</div>';
                        }
                        if (hasSolImg) {
                            ansBoxHTML += window.renderImageBlockForPDF(q.solutionImage, q.solutionImageWidth || '240px', q.solutionImageAlign || 'left', forWord);
                        }
                        ansBoxHTML += '</div>';
                    }

                    const hasAnyTable = hasQTable || hasAnsTable;
                    html += '<table class="q-row-table' + (hasAnyTable ? ' has-data-table' : '') + '">';

                    if (hasQTable) {
                        const beforeTbl = formattedQ.slice(0, tblSplitIdx).replace(/(?:<br\s*\/?>|\s)+$/gi, '').trim();
                        const fromTbl = formattedQ.slice(tblSplitIdx).trim();
                        if (beforeTbl) {
                            html += '<tr><td class="q-cell-text"><strong>' + qNum + '.</strong> ' + beforeTbl + '</td><td class="q-cell-marks">[' + q.marks + ']</td></tr>';
                            html += '<tr><td colspan="2" class="q-cell-full">' + fromTbl + qImgHTML + '</td></tr>';
                        } else {
                            html += '<tr><td class="q-cell-text"><strong>' + qNum + '.</strong> ' + formattedQ + qImgHTML + '</td><td class="q-cell-marks">[' + q.marks + ']</td></tr>';
                        }
                    } else {
                        html += '<tr><td class="q-cell-text"><strong>' + qNum + '.</strong> ' + formattedQ + qImgHTML + ((!hasAnyTable && ansBoxHTML) ? ansBoxHTML : '') + '</td><td class="q-cell-marks">[' + q.marks + ']</td></tr>';
                    }

                    if (hasAnyTable && ansBoxHTML) {
                        html += '<tr><td colspan="2" class="q-cell-full">' + ansBoxHTML + '</td></tr>';
                    }

                    html += '</table>';
                    gQNum++; sQNum++;
                }
            });
        }
    });
    return html + '</div>';
};

window.generatePaperHTMLStr = window.generatePaperHTML;

window.formatForPDF = function (q, paperLang, forWord) {
    const fmt = window.formatScienceAndMath || ((x) => x);
    const t = fmt(q.text || '');
    if (q.type === 'MCQ') {
        const parts = t.split(/\(A\)|\(B\)|\(C\)|\(D\)/);
        if (parts.length === 5) {
            const imgMid = q.image
                ? '<div class="gv-mcq-img-placed">' + window.renderImageBlockForPDF(q.image, q.imageWidth || '220px', q.imageAlign || 'center', forWord) + '</div>'
                : '';
            const stemHTML = parts[0].trim()
                .replace(/\\n|\n/g, '<br>')
                .replace(/(?:<br>\s*)+(<div class="gv-table-scroll")/g, '$1')
                .replace(/(<\/table><\/div>)(?:\s*<br>)+/g, '$1');
            return stemHTML + imgMid + '<table class="mcq-table"><tr><td>(A) ' + parts[1].trim() + '</td><td>(B) ' + parts[2].trim() + '</td></tr><tr><td>(C) ' + parts[3].trim() + '</td><td>(D) ' + parts[4].trim() + '</td></tr></table>';
        }
    }
    if ((q.type === 'જોડકા જોડો' || String(q.type || '').toLowerCase().includes('match')) && window.parseMatchTextGlobal) {
        return window.parseMatchTextGlobal(t, q.lang || paperLang || 'gu');
    }
    return t
        .replace(/\\n|\n/g, '<br>')
        .replace(/(?:<br>\s*)+(<div class="gv-table-scroll")/g, '$1')
        .replace(/(<\/table><\/div>)(?:\s*<br>)+/g, '$1');
};

window.formatAns = function (ans) {
    const fmt = window.formatScienceAndMath || ((x) => x);
    const formattedAns = fmt(ans || '');
    const lines = formattedAns.split(/\\n|\n/);
    if (lines.length > 1) {
        return lines.map(l => {
            const tr = l.trim();
            if (!tr) return '';
            const tblIdx = tr.search(/<div\s+class="gv-table-scroll"|<table\b/i);
            if (tblIdx === 0) {
                return '<div style="margin:6px 0;">' + tr + '</div>';
            }
            if (tblIdx > 0) {
                const preText = tr.slice(0, tblIdx).trim();
                const tblPart = tr.slice(tblIdx).trim();
                return '<div style="margin-bottom:4px;">&#8226; ' + preText + '</div><div style="margin:6px 0;">' + tblPart + '</div>';
            }
            return '<div style="margin-bottom:5px;">&#8226; ' + tr + '</div>';
        }).join('');
    }
    return formattedAns;
};

window.formatDateDDMMYYYY = function (dateStr) {
    if (!dateStr) return '';
    const p = dateStr.split('-');
    return p.length === 3 ? (p[2] + '/' + p[1] + '/' + p[0]) : dateStr;
};

window.parseMatchTextGlobal = function (text, lang) {
    const L = window.GV_LANG_LABELS[lang || 'gu'] || window.GV_LANG_LABELS.gu;
    const lines = (text || '').split(/\\n|\n/);
    const colA = [], colB = [], otherLines = [];
    let html = '<table style="width:100%; table-layout:fixed; word-wrap:break-word; font-size:14.5px; margin-top:6px; margin-bottom:4px; border-collapse:collapse; page-break-inside:avoid; border:none; text-align:left;">';
    html += '<tr><td style="width:50%; font-weight:bold; padding-bottom:4px; border:none; text-align:left;">' + L.colA + '</td><td style="width:50%; font-weight:bold; padding-bottom:4px; border:none; text-align:left;">' + L.colB + '</td></tr>';

    lines.forEach(l => {
        l = l.trim();
        if (!l || l.includes('વિભાગ A') || l.includes('વિભાગ B') || l.includes('Column A') || l.includes('Column B') || l.includes('યોગ્ય જોડકા જોડો')) return;
        const parts = l.split(/\s{2,}|\t+| - | – /);
        if (parts.length >= 2 && parts[1].trim() !== '') { colA.push(parts[0].trim()); colB.push(parts.slice(1).join(' ').trim()); return; }
        const fallbackRegex = /^(.*?\S)\s+(\([a-zA-Zઅ-જ]\)|[a-zA-Zઅ-જ][\.\)])\s*(.*)$/;
        const match = l.match(fallbackRegex);
        if (match) { colA.push(match[1].trim()); colB.push(match[2] + ' ' + match[3].trim()); }
        else if (l.match(/^(\d+[\.\)]|\(\d+\))\s+/)) colA.push(l);
        else if (l.match(/^([a-zA-Zઅ-જ][\.\)]|\([a-zA-Zઅ-જ]\))\s+/)) colB.push(l);
        else otherLines.push(l);
    });

    const maxLen = Math.max(colA.length, colB.length);
    for (let i = 0; i < maxLen; i++) html += '<tr><td style="width:50%; padding-right:10px; vertical-align:middle; padding-bottom:6px; border:none;">' + (colA[i] || '') + '</td><td style="width:50%; vertical-align:middle; padding-bottom:6px; border:none;">' + (colB[i] || '') + '</td></tr>';
    otherLines.forEach(l => {
        const mid = Math.floor(l.length / 2);
        let splitIdx = l.indexOf(' ', mid - 5);
        if (splitIdx === -1) splitIdx = l.lastIndexOf(' ', mid + 5);
        if (splitIdx !== -1 && splitIdx > 0) html += '<tr><td style="width:50%; padding-right:10px; vertical-align:middle; padding-bottom:6px; border:none;">' + l.substring(0, splitIdx).trim() + '</td><td style="width:50%; vertical-align:middle; padding-bottom:6px; border:none;">' + l.substring(splitIdx).trim() + '</td></tr>';
        else html += '<tr><td colspan="2" style="vertical-align:middle; padding-bottom:6px; border:none;">' + l + '</td></tr>';
    });
    return html + '</table>';
};
