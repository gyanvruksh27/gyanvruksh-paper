// ============================================================================
// 📄 GYAN VRUKSH PDF & WORD ENGINE (V15.0)
// Unified Math/Chem Parser, Section Attempt Rules, Images, Watermark & Word Export
// ============================================================================

window.pdfEngineReady = true;

window.cleanMath = function(str) {
    if (!str) return '';
    let s = String(str);

    // 1. Clean legacy artifacts
    s = s.replace(/_{1,2}htmltag[a-z0-9_]*_{1,2}/gi, '').replace(/@@@@/g, '');
    s = s.replace(/\\\\ce\{([^}]+)\}/g, '$1').replace(/\\ce\{([^}]+)\}/g, '$1');

    // 2. Normalize double backslashes to single for LaTeX parsing
    s = s.replace(/\\\\/g, '\\');

    // 3. Strip $ delimiters while preserving inner math
    s = s.replace(/\$([^$]+)\$/g, '$1');

    // 4. LaTeX \text{...}
    s = s.replace(/\\text\{([^}]+)\}/g, '$1');

    // 5. LaTeX Symbols
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

    // 6. LaTeX Fractions \frac{a}{b}
    s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g,
        '<span style="display:inline-block; vertical-align:middle; text-align:center; font-size:0.88em; margin:0 3px; line-height:1.1;"><span style="border-bottom:1px solid #000; display:block; padding:0 2px;">$1</span><span style="display:block; padding:0 2px;">$2</span></span>');

    // 7. LaTeX Square Roots \sqrt{x}
    s = s.replace(/\\sqrt\{([^}]+)\}/g, '√<span style="border-top:1px solid #000; padding-top:1px;">$1</span>');
    s = s.replace(/√\(([^)]+)\)/g, '√<span style="border-top:1px solid #000; padding-top:1px;">$1</span>');

    // 8. Powers & Subscripts (LaTeX style)
    s = s.replace(/\^\(\s*([0-9a-zA-Z+\-]+)\s*\/\s*([0-9a-zA-Z+\-]+)\s*\)/g, '<sup style="font-size:0.75em;">$1/$2</sup>');
    s = s.replace(/\^\{([^}]+)\}/g, '<sup style="font-size:0.75em;">$1</sup>');
    s = s.replace(/\^([0-9a-zA-Z+\-]+)/g, '<sup style="font-size:0.75em;">$1</sup>');
    s = s.replace(/_\{([^}]+)\}/g, '<sub style="font-size:0.75em;">$1</sub>');
    s = s.replace(/_([0-9a-zA-Z]+)/g, '<sub style="font-size:0.75em;">$1</sub>');

    // 9. Chemistry Formulas (Auto-subscript numbers in formulas like H2O, Ca(OH)2, H2SO4, Fe2O3)
    s = s.replace(/\(([A-Za-z0-9]+)\)([2-9])/g, '($1)<sub style="font-size:0.75em;">$2</sub>');
    s = s.replace(/([A-Z][a-z]?)([2-9])(?![a-zA-Z])/g, '$1<sub style="font-size:0.75em;">$2</sub>');

    return s;
};

window.formatDateStr = function(d) {
    if (!d) return '';
    const parts = String(d).split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : d;
};

window.formatMatchTableHTML = function(rawText) {
    const lines = String(rawText).split('\n').filter(l => l.trim() !== '');
    let rowsHtml = '';
    lines.forEach(line => {
        if (line.includes('વિભાગ A') && line.includes('વિભાગ B')) return;
        const cols = line.split(/\s+(?=\([a-zA-Zઅ-જ]\))|\s+-\s+|\s+–\s+|\t{2,}/);
        if (cols.length >= 2) {
            rowsHtml += `<tr>
                <td style="border:1px solid #000; padding:5px 8px; width:50%;">${window.cleanMath(cols[0].trim())}</td>
                <td style="border:1px solid #000; padding:5px 8px; width:50%;">${window.cleanMath(cols.slice(1).join(' ').trim())}</td>
            </tr>`;
        }
    });
    if (!rowsHtml) return window.cleanMath(rawText).replace(/\n/g, '<br>');
    return `<table style="width:100%; border-collapse:collapse; margin-top:6px; border:1px solid #000; page-break-inside:avoid;">
        <tr>
            <th style="border:1px solid #000; padding:5px 8px; text-align:left; background:#f1f5f9; width:50%;">વિભાગ A</th>
            <th style="border:1px solid #000; padding:5px 8px; text-align:left; background:#f1f5f9; width:50%;">વિભાગ B</th>
        </tr>
        ${rowsHtml}
    </table>`;
};

window.generatePaperHTMLStr = function(paper, type = 'paper', forWord = false) {
    const prof = JSON.parse(localStorage.getItem('gyanVruksh_schoolProfile')) || { name: 'શાળાનું નામ', address: '' };
    const pdfSet = JSON.parse(localStorage.getItem('gyanVruksh_pdfSettings')) || {
        watermark: '', examName: true, date: true, std: true, subject: true, marks: true
    };

    const watermarkHTML = (!forWord && pdfSet.watermark)
        ? `<div style="position:fixed; top:45%; left:50%; transform:translate(-50%,-50%) rotate(-35deg); font-size:56pt; font-weight:bold; color:rgba(0,0,0,0.06); z-index:-1; pointer-events:none; white-space:nowrap;">${pdfSet.watermark}</div>`
        : '';

    const stdSubParts = [];
    if (pdfSet.std !== false) stdSubParts.push(`ધોરણ: ${paper.standard || '-'}`);
    if (pdfSet.subject !== false) stdSubParts.push(`વિષય: ${paper.subject || '-'}`);

    let html = `${watermarkHTML}
    <div style="text-align:center; margin-bottom:12px; border-bottom:2px solid #000; padding-bottom:8px; font-family:'Noto Sans Gujarati', sans-serif;">
        <h1 style="margin:0; font-size:19pt; font-weight:bold;">${prof.name || 'શાળાનું નામ'}</h1>
        ${prof.address ? `<p style="margin:3px 0; font-size:11.5pt;">${prof.address}</p>` : ''}
        ${pdfSet.examName !== false ? `<h3 style="margin:6px 0; font-size:15pt; text-decoration:underline;">${paper.title || 'પ્રશ્નપત્ર'} ${type === 'solution' ? '(Answer Key)' : ''}</h3>` : ''}
        <table style="width:100%; font-weight:bold; font-size:11.5pt; margin-top:8px; border-collapse:collapse;">
            <tr>
                <td style="text-align:left; width:40%;">${stdSubParts.join(' | ')}</td>
                <td style="text-align:center; width:30%;">${(pdfSet.date !== false && paper.date) ? `તારીખ: ${window.formatDateStr(paper.date)}` : ''}</td>
                <td style="text-align:right; width:30%;">${pdfSet.marks !== false ? `કુલ ગુણ: ${paper.totalMarks || 0}` : ''}</td>
            </tr>
        </table>
    </div>`;

    const sData = {};
    const order = (paper.sectionOrder && paper.sectionOrder.length) ? paper.sectionOrder : ['A', 'B', 'C', 'D', 'E', 'F'];
    order.forEach(sec => sData[sec] = []);
    (paper.questions || []).forEach(q => {
        const sec = q.section || 'A';
        if (!sData[sec]) sData[sec] = [];
        sData[sec].push(q);
    });

    let qNum = 1;
    Object.keys(sData).forEach(sec => {
        if (sData[sec].length === 0) return;

        const meta = (paper.sectionsMetadata && paper.sectionsMetadata[sec]) ? paper.sectionsMetadata[sec] : {};
        const attemptText = meta.attempt || (sec === 'A' ? 'બધા પ્રશ્નો ફરજિયાત' : '');
        const secInstText = meta.instruction || '';

        html += `<div style="text-align:center; font-weight:bold; background:#e2e8f0; padding:6px 10px; margin:16px 0 8px 0; border:1px solid #000; font-size:13.5pt;">વિભાગ - ${sec}</div>`;

        if (secInstText || attemptText) {
            html += `<table style="width:100%; font-weight:bold; font-size:11.5pt; margin-bottom:8px; border-collapse:collapse;">
                <tr>
                    <td style="text-align:left;">${secInstText}</td>
                    <td style="text-align:right; color:#1e293b;">${attemptText ? `(${attemptText})` : ''}</td>
                </tr>
            </table>`;
        }

        sData[sec].forEach(q => {
            if (q.type === 'instruction') {
                html += `<div style="font-weight:bold; font-size:11.5pt; margin:12px 0 6px 0; text-align:left; text-decoration:underline;">${window.cleanMath(q.text)}</div>`;
                return;
            }

            let qText = '';
            if (q.type === 'જોડકા જોડો') {
                qText = window.formatMatchTableHTML(q.text);
            } else if (q.type === 'MCQ' && String(q.text).includes('(A)')) {
                const parsed = window.cleanMath(String(q.text).replace(/\n/g, '<br>'));
                const parts = parsed.split(/\(A\)/);
                if (parts.length > 1) {
                    let opts = '(A)' + parts[1];
                    opts = opts.replace(/\(A\)/g, '<td style="width:50%; padding:3px 10px 3px 0; vertical-align:top;"><b>(A)</b> ')
                               .replace(/\(B\)/g, '</td><td style="width:50%; padding:3px 0; vertical-align:top;"><b>(B)</b> ')
                               .replace(/\(C\)/g, '</td></tr><tr><td style="width:50%; padding:3px 10px 3px 0; vertical-align:top;"><b>(C)</b> ')
                               .replace(/\(D\)/g, '</td><td style="width:50%; padding:3px 0; vertical-align:top;"><b>(D)</b> ') + '</td>';
                    qText = `${parts[0].trim()}<br><table style="width:100%; margin-top:4px; border-collapse:collapse; page-break-inside:avoid;"><tr>${opts}</tr></table>`;
                } else {
                    qText = parsed;
                }
            } else {
                qText = window.cleanMath(String(q.text || '').replace(/\n/g, '<br>'));
            }

            const qImgHTML = q.image ? `<div style="margin-top:6px;"><img src="${q.image}" style="max-height:140px; max-width:90%; border:1px solid #cbd5e1;"></div>` : '';

            html += `<table style="width:100%; margin-bottom:10px; border-collapse:collapse; page-break-inside:avoid;">
                <tr>
                    <td style="width:92%; vertical-align:top; font-size:11.5pt; text-align:left;"><b>${qNum}.</b> ${qText}${qImgHTML}</td>
                    <td style="width:8%; vertical-align:top; text-align:right; font-size:11.5pt; font-weight:bold;">[${q.marks}]</td>
                </tr>
            </table>`;

            if (type === 'solution') {
                const ansText = window.cleanMath(String(q.answer || '').replace(/\n/g, '<br>'));
                const ansImgHTML = q.solutionImage ? `<div style="margin-top:6px;"><img src="${q.solutionImage}" style="max-height:140px; max-width:90%; border:1px solid #cbd5e1;"></div>` : '';
                html += `<div style="background:#f0fdf4; border-left:3px solid #16a34a; padding:6px 10px; margin-bottom:14px; margin-left:22px; page-break-inside:avoid; font-size:11pt;"><b>ઉત્તર:</b><br>${ansText}${ansImgHTML}</div>`;
            }

            qNum++;
        });
    });

    return html;
};

window.downloadPDF = function(paperId, type = 'paper') {
    try {
        const papers = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || [];
        const paper = papers.find(p => p.id === paperId) || papers[papers.length - 1];
        if (!paper) return alert("પેપર મળ્યું નથી!");

        const rawHTML = window.generatePaperHTMLStr(paper, type, false);
        const win = window.open('', '_blank');
        win.document.write(`<!DOCTYPE html>
        <html lang="gu">
        <head>
            <meta charset="utf-8">
            <title>${paper.title || 'Paper'}</title>
            <style>
                body { font-family: 'Noto Sans Gujarati', 'Shruti', sans-serif; color: #000; line-height: 1.5; margin: 20px; }
                @media print { .no-print { display: none !important; } body { margin: 10mm; } }
            </style>
        </head>
        <body>
            <div class="no-print" style="background:#1e293b; color:#fff; padding:10px; text-align:center; margin-bottom:15px; border-radius:6px;">
                <button onclick="window.print()" style="padding:8px 18px; font-weight:bold; background:#16a34a; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:14px;">🖨️ PDF પ્રિન્ટ / સેવ કરો</button>
            </div>
            ${rawHTML}
        </body>
        </html>`);
        win.document.close();
        setTimeout(() => win.print(), 500);
    } catch (e) {
        alert("PDF Error: " + e.message);
    }
};

window.downloadWord = function(paperId, type = 'paper') {
    try {
        const papers = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || [];
        const paper = papers.find(p => p.id === paperId) || papers[papers.length - 1];
        if (!paper) return alert("પેપર મળ્યું નથી!");

        const rawHTML = window.generatePaperHTMLStr(paper, type, true);
        const wordDoc = `<html xmlns:w='urn:schemas-microsoft-com:office:word'>
            <head><meta charset='utf-8'><title>${paper.title || 'Paper'}</title>
            <style>body { font-family: 'Shruti', 'Noto Sans Gujarati', sans-serif; font-size: 12pt; line-height: 1.5; }</style>
            </head><body>${rawHTML}</body></html>`;

        const blob = new Blob(['\ufeff', wordDoc], { type: 'application/msword;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${paper.title || 'Paper'}_${type === 'solution' ? 'Answer_Key' : 'Paper'}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        alert("Word Error: " + e.message);
    }
};