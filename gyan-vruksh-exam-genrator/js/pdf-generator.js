// js/pdf-generator.js — Gyan Vruksh 2.5 (Clean JS + Auto-Instruction Grouping + Multi-Language)

window.GV_LANG_LABELS = {
    gu: { std: 'ધોરણ', sub: 'વિષય', date: 'તારીખ', marks: 'કુલ ગુણ', section: 'વિભાગ', ans: 'ઉત્તર', colA: 'વિભાગ A', colB: 'વિભાગ B', solTitle: '(Answer Key)' },
    en: { std: 'Std', sub: 'Subject', date: 'Date', marks: 'Total Marks', section: 'SECTION', ans: 'Answer', colA: 'Column A', colB: 'Column B', solTitle: '(Answer Key)' },
    hi: { std: 'कक्षा', sub: 'विषय', date: 'दिनांक', marks: 'कुल अंक', section: 'विभाग', ans: 'उत्तर', colA: 'विभाग अ', colB: 'विभाग ब', solTitle: '(उत्तर कुंजी)' },
    sa: { std: 'कक्षा', sub: 'विषयः', date: 'दिनाङ्कः', marks: 'कुल अङ्काः', section: 'विभागः', ans: 'उत्तरम्', colA: 'विभागः अ', colB: 'विभागः ब', solTitle: '(उत्तरमाला)' }
};

window.GV_PDF_DEFAULT_INST = {
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

window.detectPaperLanguage = function(paper) {
    if (paper && paper.lang && window.GV_LANG_LABELS[paper.lang]) return paper.lang;
    const sub = String((paper && paper.subject) || '').toLowerCase();
    if (sub.includes('english') || sub.includes('અંગ્રેજી')) return 'en';
    if (sub.includes('sanskrit') || sub.includes('સંસ્કૃત') || sub.includes('संस्कृत')) return 'sa';
    if (sub.includes('hindi') || sub.includes('હિન્દી') || sub.includes('हिन्दी') || sub.includes('हिंदी')) return 'hi';
    const firstQ = ((paper && paper.questions) || []).find(q => q && q.lang && window.GV_LANG_LABELS[q.lang]);
    return firstQ ? firstQ.lang : 'gu';
};

window.getPDFQuestionInstruction = function(q) {
    if (!q || q.type === 'instruction') return '';
    if (q.instruction && String(q.instruction).trim() !== '') return String(q.instruction).trim();
    if (window.DEFAULT_INSTRUCTIONS && window.DEFAULT_INSTRUCTIONS[q.type]) return window.DEFAULT_INSTRUCTIONS[q.type];
    return window.GV_PDF_DEFAULT_INST[q.type] || '';
};

function resolvePaperObj(paperOrId) {
    if (typeof paperOrId === 'object' && paperOrId !== null) return paperOrId;
    const papers = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || [];
    return papers.find(p => p.id === paperOrId);
}

window.downloadPDF = function(paperId, type) {
    window.openVectorPDFWindow(paperId, type, true);
};

window.printPaper = function(paperId, type) {
    window.openVectorPDFWindow(paperId, type, false);
};

window.openVectorPDFWindow = function(paperOrId, type, isDownloadMode) {
    const paper = resolvePaperObj(paperOrId);
    if (!paper) return;

    const paperLang = window.detectPaperLanguage(paper);
    const rawHTML = window.generatePaperHTML(paper, type, false);
    const fileName = `${paper.title || 'Paper'}_${type === 'solution' ? 'Answer_Key' : 'Question_Paper'}`;

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
                .gv-data-table { width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 13.5px; page-break-inside: avoid; }
                .gv-data-table th, .gv-data-table td { border: 1px solid #000; padding: 4px 7px; text-align: center; }
                .gv-data-table th { background: #f1f5f9; font-weight: bold; }
                .top-action-bar { position: sticky; top: 0; left: 0; width: 100%; background: #1e293b; color: #fff; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: sans-serif; }
                .action-btn { padding: 8px 16px; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer; color: white; }
                .btn-save-pdf { background: #16a34a; }
                .btn-close { background: #dc2626; }
                .paper-sheet { width: 210mm; min-height: 297mm; margin: 20px auto; padding: 12mm 14mm; background: #ffffff; box-shadow: 0 0 20px rgba(0,0,0,0.4); position: relative; text-align: left; }
                @media print {
                    body { background: #ffffff; }
                    .no-print { display: none !important; }
                    .paper-sheet { width: 100%; min-height: auto; margin: 0; padding: 0; box-shadow: none; }
                }
                .print-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8px; }
                .print-header h1 { font-size: 22px; margin: 0 0 3px 0; font-weight: 700; line-height: 1.3; }
                .print-header p { font-size: 13.5px; margin: 2px 0; color: #111; }
                .exam-meta { display: flex; justify-content: space-between; flex-wrap: wrap; font-size: 14.5px; font-weight: 600; margin-top: 6px; padding: 5px 0; border-top: 1px dashed #444; border-bottom: 1px dashed #444; text-align: left; }
                .sec-banner { text-align: center; font-weight: bold; font-size: 16px; margin: 14px 0 8px 0; border: 1.5px solid #000; padding: 3px; background: #f1f5f9; page-break-inside: avoid; }
                .sec-instruction, .auto-inst-bar { font-size: 14.5px; font-weight: bold; margin: 10px 0 6px 0; padding: 3px 0; border-bottom: 1px dotted #94a3b8; display: flex; justify-content: space-between; page-break-inside: avoid; break-after: avoid; }
                .q-row-table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-bottom: 10px; page-break-inside: avoid !important; text-align: left !important; }
                .q-cell-text { width: 89%; padding-right: 10px; vertical-align: top; font-size: 15px; word-wrap: break-word; overflow-wrap: break-word; text-align: left !important; line-height: 2.05; }
                .q-cell-marks { width: 11%; vertical-align: top; text-align: right !important; font-weight: bold; font-size: 14.5px; white-space: nowrap; }
                .p-ans-box { margin-top: 6px; padding: 8px 10px; background: #f8fafc; border-left: 3px solid #334155; font-size: 14.5px; page-break-inside: avoid !important; text-align: left !important; line-height: 2.1; }
                .mcq-table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 5px; text-align: left !important; }
                .mcq-table td { width: 50%; padding: 4px 8px 4px 0; vertical-align: middle; font-size: 14.5px; line-height: 1.95; }
                .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 65px; color: rgba(0, 0, 0, 0.05); z-index: 0; pointer-events: none; font-weight: bold; white-space: nowrap; }
            </style>
        </head>
        <body>
            <div class="top-action-bar no-print">
                <div style="font-size:14px;">💡 <strong>PDF ટિપ:</strong> Destination માં <strong>"Save as PDF"</strong> પસંદ કરી Save દબાવો.</div>
                <div style="display:flex; gap:10px;">
                    <button class="action-btn btn-save-pdf" onclick="window.print()">🖨️ Save as PDF / Print</button>
                    <button class="action-btn btn-close" onclick="window.close()">✖ બંધ કરો</button>
                </div>
            </div>
            <div class="paper-sheet" id="printableArea">${rawHTML}</div>
            <script>window.onload = function() { setTimeout(function() { window.print(); }, 450); };<\/script>
        </body>
        </html>
    `);
    printWin.document.close();
    printWin.focus();
};

window.downloadWord = function(paperOrId, type) {
    const paper = resolvePaperObj(paperOrId);
    if (!paper) return;
    const rawHTML = window.generatePaperHTML(paper, type, true);
    const fileName = `${paper.title || 'Paper'}_${type === 'solution' ? 'Answer_Key' : 'Question_Paper'}.doc`;
    const wordHTML = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset="utf-8"><title>${paper.title}</title>
            <style>
                @page { size: 21cm 29.7cm; margin: 1.5cm; }
                body { font-family: 'Shruti', 'Mangal', 'Calibri', sans-serif; font-size: 11.5pt; line-height: 1.6; color: #000; text-align: left; }
                .print-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 10px; }
                .print-header h1 { font-size: 16pt; margin: 0; font-weight: bold; }
                .exam-meta { border-top: 1px dashed #555; border-bottom: 1px dashed #555; padding: 5px 0; margin-bottom: 10px; font-weight: bold; }
                .sec-banner { text-align: center; font-weight: bold; font-size: 12.5pt; margin: 12px 0 6px 0; border: 1px solid #000; padding: 3px; background: #f2f2f2; }
                .sec-instruction, .auto-inst-bar { font-weight: bold; margin: 8px 0 4px 0; }
                .gv-passage-box { border: 1px solid #333; padding: 8px; margin: 6px 0; background: #f9f9f9; }
                .gv-data-table { width: 100%; border-collapse: collapse; margin: 6px 0; }
                .gv-data-table th, .gv-data-table td { border: 1px solid #000; padding: 4px; text-align: center; }
                table { width: 100%; border-collapse: collapse; text-align: left; }
                .q-cell-text { width: 88%; vertical-align: top; padding-right: 8px; }
                .q-cell-marks { width: 12%; vertical-align: top; text-align: right; font-weight: bold; }
                .p-ans-box { margin-top: 4px; padding: 6px; background: #f5f5f5; border-left: 3px solid #333; }
                .watermark { display: none; }
            </style>
        </head><body>${rawHTML}</body></html>`;
    const blob = new Blob(['\ufeff', wordHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = fileName;
    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
};

window.groupSectionQuestionsByInstruction = function(items) {
    const hasManualInst = items.some(q => q.type === 'instruction');
    if (hasManualInst) return items;
    const groups = [];
    const map = new Map();
    items.forEach(q => {
        const inst = window.getPDFQuestionInstruction(q);
        if (!map.has(inst)) {
            const grp = { instruction: inst, questions: [] };
            map.set(inst, grp);
            groups.push(grp);
        }
        map.get(inst).questions.push(q);
    });
    const result = [];
    groups.forEach(grp => {
        if (grp.instruction) {
            const grpMarks = grp.questions.reduce((sum, x) => sum + Number(x.marks || 0), 0);
            result.push({ type: 'auto_instruction', text: grp.instruction, groupMarks: grpMarks });
        }
        grp.questions.forEach(q => result.push(q));
    });
    return result;
};

window.generatePaperHTML = function(paper, type, forWord = false) {
    const schoolData = JSON.parse(localStorage.getItem('gyanVruksh_schoolProfile')) || { name: "જ્ઞાન વૃક્ષ વિદ્યાલય", address: "" };
    const pdfSet = JSON.parse(localStorage.getItem('gyanVruksh_pdfSettings')) || { examName: true, date: true, std: true, subject: true, marks: true, numbering: 'continuous', watermark: '' };
    const sMeta = paper.sectionsMetadata || {};
    const order = paper.sectionOrder || ['None', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

    const lang = window.detectPaperLanguage(paper);
    const L = window.GV_LANG_LABELS[lang] || window.GV_LANG_LABELS.gu;

    let html = `<div class="print-header"><h1>${schoolData.name}</h1>`;
    if (schoolData.address) html += `<p>${schoolData.address}</p>`;
    html += `</div>`;

    if (!forWord && pdfSet.watermark) html += `<div class="watermark">${pdfSet.watermark}</div>`;

    html += `<div class="exam-meta">`;
    if (pdfSet.examName) html += `<div style="width:100%; text-align:center; font-size:17.5px; font-weight:bold; text-decoration:underline; margin-bottom:6px;">${paper.title} ${type === 'solution' ? L.solTitle : ''}</div>`;
    if (pdfSet.std && paper.standard) html += `<span>${L.std}: ${paper.standard}</span>`;
    if (pdfSet.subject && paper.subject) html += `<span> &nbsp;|&nbsp; ${L.sub}: ${paper.subject}</span>`;
    if (pdfSet.date && paper.date) html += `<span> &nbsp;|&nbsp; ${L.date}: ${window.formatDateDDMMYYYY(paper.date)}</span>`;
    if (pdfSet.marks) html += `<span style="float:right;">${L.marks}: ${paper.totalMarks}</span>`;
    html += `</div><div class="print-questions" style="margin-top:10px; text-align:left;">`;

    const sData = { "None": [], A: [], B: [], C: [], D: [], E: [], F: [], G: [] };
    (paper.questions || []).forEach(q => {
        const secKey = (q.section && sData[q.section]) ? q.section : 'None';
        sData[secKey].push(q);
    });

    let gQNum = 1;
    order.forEach(sec => {
        if (sData[sec] && sData[sec].length > 0) {
            if (sec !== "None") html += `<div class="sec-banner">${L.section} - ${sec}</div>`;
            const secManualInst = (sMeta[sec] && sMeta[sec].instruction) ? sMeta[sec].instruction.trim() : '';
            if (sMeta[sec] && (secManualInst || sMeta[sec].attempt)) {
                html += `<div class="sec-instruction"><span>${secManualInst ? '• ' + secManualInst : ''}</span><span>${sMeta[sec].attempt ? '(' + sMeta[sec].attempt + ')' : ''}</span></div>`;
            }

            const groupedItems = window.groupSectionQuestionsByInstruction(sData[sec]);
            let sQNum = 1;
            groupedItems.forEach(q => {
                if (q.type === 'instruction') {
                    html += `<div class="sec-instruction"><span>${q.text ? '• ' + q.text : ''}</span><span>${q.attempt ? '(' + q.attempt + ')' : ''}</span></div>`;
                } else if (q.type === 'auto_instruction') {
                    if (q.text && q.text !== secManualInst) {
                        html += `<div class="auto-inst-bar"><span>&#9656; ${q.text}</span><span>[${q.groupMarks}]</span></div>`;
                    }
                } else {
                    const qNum = (pdfSet.numbering === 'continuous' || sec === "None") ? gQNum : sQNum;
                    html += `<table class="q-row-table"><tr>`;
                    html += `<td class="q-cell-text"><strong>${qNum}.</strong> ${window.formatForPDF(q, lang)}`;
                    if (q.image) html += `<br><img src="${q.image}" style="max-height:120px; max-width:95%; margin-top:5px;">`;
                    if (type === 'solution') {
                        html += `<div class="p-ans-box"><strong>${L.ans}:</strong><br><div style="margin-left:8px;">${window.formatAns(q.answer)}</div>`;
                        if (q.solutionImage) html += `<img src="${q.solutionImage}" style="max-height:140px; max-width:95%; margin-top:5px; display:block;">`;
                        html += `</div>`;
                    }
                    html += `</td><td class="q-cell-marks">[${q.marks}]</td></tr></table>`;
                    gQNum++; sQNum++;
                }
            });
        }
    });
    return html + `</div>`;
};

// જૂના કોડ સાથે ૧૦૦% સુસંગતતા માટે Alias
window.generatePaperHTMLStr = window.generatePaperHTML;

window.formatForPDF = function(q, paperLang = 'gu') {
    const fmt = window.formatScienceAndMath || ((x) => x);
    let t = fmt(q.text || '');
    if (q.type === 'MCQ') {
        const parts = t.split(/\(A\)|\(B\)|\(C\)|\(D\)/);
        if (parts.length === 5) {
            return `${parts[0].trim()}<table class="mcq-table"><tr><td>(A) ${parts[1].trim()}</td><td>(B) ${parts[2].trim()}</td></tr><tr><td>(C) ${parts[3].trim()}</td><td>(D) ${parts[4].trim()}</td></tr></table>`;
        }
    }
    if ((q.type === 'જોડકા જોડો' || String(q.type || '').toLowerCase().includes('match')) && window.parseMatchTextGlobal) {
        return window.parseMatchTextGlobal(t, q.lang || paperLang);
    }
    return t.replace(/\\n|\n/g, '<br>');
};

window.formatAns = function(ans) {
    const fmt = window.formatScienceAndMath || ((x) => x);
    let formattedAns = fmt(ans || '');
    let lines = formattedAns.split(/\\n|\n/);
    if (lines.length > 1) return lines.map(l => l.trim() ? `<div style="margin-bottom:5px;">&#8226; ${l.trim()}</div>` : '').join('');
    return formattedAns;
};

window.formatDateDDMMYYYY = function(dateStr) {
    if (!dateStr) return "";
    const p = dateStr.split('-');
    return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : dateStr;
};

window.parseMatchTextGlobal = function(text, lang = 'gu') {
    const L = window.GV_LANG_LABELS[lang] || window.GV_LANG_LABELS.gu;
    let lines = (text || '').split(/\\n|\n/);
    let colA = [], colB = [], otherLines = [];
    let html = '<table style="width:100%; table-layout:fixed; word-wrap:break-word; font-size:14.5px; margin-top:6px; margin-bottom:4px; border-collapse:collapse; page-break-inside:avoid; border:none; text-align:left;">';
    html += `<tr><td style="width:50%; font-weight:bold; padding-bottom:4px; border:none; text-align:left;">${L.colA}</td><td style="width:50%; font-weight:bold; padding-bottom:4px; border:none; text-align:left;">${L.colB}</td></tr>`;

    lines.forEach(l => {
        l = l.trim();
        if (!l || l.includes('વિભાગ A') || l.includes('વિભાગ B') || l.includes('Column A') || l.includes('Column B') || l.includes('યોગ્ય જોડકા જોડો')) return;
        let parts = l.split(/\s{2,}|\t+| - | – /);
        if (parts.length >= 2 && parts[1].trim() !== '') { colA.push(parts[0].trim()); colB.push(parts.slice(1).join(' ').trim()); return; }
        let fallbackRegex = /^(.*?\S)\s+(\([a-zA-Zઅ-જ]\)|[a-zA-Zઅ-જ][\.\)])\s*(.*)$/;
        let match = l.match(fallbackRegex);
        if (match) { colA.push(match[1].trim()); colB.push(`${match[2]} ${match[3].trim()}`); }
        else if (l.match(/^(\d+[\.\)]|\(\d+\))\s+/)) colA.push(l);
        else if (l.match(/^([a-zA-Zઅ-જ][\.\)]|\([a-zA-Zઅ-જ]\))\s+/)) colB.push(l);
        else otherLines.push(l);
    });

    let maxLen = Math.max(colA.length, colB.length);
    for (let i = 0; i < maxLen; i++) html += `<tr><td style="width:50%; padding-right:10px; vertical-align:middle; padding-bottom:6px; border:none;">${colA[i] || ''}</td><td style="width:50%; vertical-align:middle; padding-bottom:6px; border:none;">${colB[i] || ''}</td></tr>`;
    otherLines.forEach(l => {
        let mid = Math.floor(l.length / 2), splitIdx = l.indexOf(' ', mid - 5);
        if (splitIdx === -1) splitIdx = l.lastIndexOf(' ', mid + 5);
        if (splitIdx !== -1 && splitIdx > 0) html += `<tr><td style="width:50%; padding-right:10px; vertical-align:middle; padding-bottom:6px; border:none;">${l.substring(0, splitIdx).trim()}</td><td style="width:50%; vertical-align:middle; padding-bottom:6px; border:none;">${l.substring(splitIdx).trim()}</td></tr>`;
        else html += `<tr><td colspan="2" style="vertical-align:middle; padding-bottom:6px; border:none;">${l}</td></tr>`;
    });
    return html + '</table>';
};
