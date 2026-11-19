// js/builder.js

document.addEventListener('DOMContentLoaded', () => {
    
    // 🚀 MATHJAX ENGINE INITIALIZATION (For Live Preview & UI)
    if (!window.MathJax) {
        window.MathJax = {
            tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], packages: {'[+]': ['mhchem']} },
            loader: { load: ['[tex]/mhchem'] }
        };
        let script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
        script.async = true;
        document.head.appendChild(script);
    }

    // 1. DOM Elements
    const bankList = document.getElementById('bankList');
    const sectionsWrapper = document.getElementById('sectionsWrapper');
    const fStd = document.getElementById('filterStd');
    const fSub = document.getElementById('filterSub');
    const fChap = document.getElementById('filterChap');
    const fType = document.getElementById('filterType');
    const fMarks = document.getElementById('filterMarks');
    const inputTotalMarks = document.getElementById('paperTotalMarks');
    const marksCounter = document.getElementById('marksCounter');
    
    let allQuestions = JSON.parse(localStorage.getItem('gyanVruksh_questions')) || [];
    let selectedPaperQuestions = [];
    let currentTotalMarks = 0;
    let currentSectionOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'None']; 
    let paperSectionsMetadata = { A:{}, B:{}, C:{}, D:{}, E:{}, F:{}, G:{}, None:{} };
    let editingPaperId = null;

    const defInst = [
        "નીચે આપેલા પ્રશ્નોનાં જવાબ માટે સાચો વિકલ્પ પસંદ કરો", "નીચેનાં વિધાનો સાચા બને તે પ્રમાણે ખાલી જગ્યા પૂરો",
        "નીચેનાં વિધાનો ખરાં છે કે ખોટાં તે જણાવો", "એક વાક્ય કે શબ્દમાં જવાબ આપો",
        "નીચે આપેલ પ્રશ્નોના યોગ્ય જોડકા જોડો", "નીચે આપેલા પ્રશ્નોનો ટૂંકમાં જવાબ આપો",
        "નીચે આપેલા પ્રશ્નોનો માગ્યા મુજબ જવાબ આપો", "સવિસ્તાર જવાબ આપો"
    ];

    let searchInput = document.getElementById('filterSearch');
    let filterCountBadge = document.getElementById('filterCountBadge');
    if (fStd && fStd.parentElement && !searchInput) {
        const extraToolbar = document.createElement('div');
        extraToolbar.style.cssText = 'display:flex; gap:6px; width:100%; margin-top:8px; align-items:center; flex-wrap:wrap;';
        extraToolbar.innerHTML = `
            <input type="text" id="filterSearch" placeholder="🔍 પ્રશ્ન કે શબ્દ શોધો..." style="flex:1; min-width:140px; padding:6px 10px; border:1px solid #bbb; border-radius:4px; font-size:13.5px;">
            <button type="button" id="btnSelectAllBank" style="padding:6px 10px; background:#e3f2fd; color:#1565c0; border:1px solid #90caf9; border-radius:4px; cursor:pointer; font-size:12.5px; font-weight:bold;">☑️ બધા</button>
            <button type="button" id="btnResetFilters" style="padding:6px 10px; background:#ffebee; color:#c62828; border:1px solid #ef9a9a; border-radius:4px; cursor:pointer; font-size:12.5px; font-weight:bold;">🔄 રીસેટ</button>
            <span id="filterCountBadge" style="font-size:12.5px; font-weight:bold; color:#2e7d32; background:#e8f5e9; padding:5px 8px; border-radius:4px; border:1px solid #a5d6a7;">મળેલ: 0</span>
        `;
        fStd.parentElement.parentElement.insertBefore(extraToolbar, fStd.parentElement.nextSibling);
        searchInput = document.getElementById('filterSearch');
        filterCountBadge = document.getElementById('filterCountBadge');

        document.getElementById('btnSelectAllBank').addEventListener('click', () => {
            const cbs = document.querySelectorAll('.q-checkbox');
            const allChecked = Array.from(cbs).every(cb => cb.checked);
            cbs.forEach(cb => cb.checked = !allChecked);
        });

        document.getElementById('btnResetFilters').addEventListener('click', () => {
            if(fStd) fStd.value = 'All'; updateSubjects();
            if(fSub) fSub.value = 'All'; updateChapters();
            if(fChap) fChap.value = 'All'; if(fType) fType.value = 'All'; if(fMarks) fMarks.value = 'All';
            if(searchInput) searchInput.value = '';
            renderBank();
        });
    }

    // 🔄 2. AUTO-SAVE DRAFT LOGIC
    function checkAutoDraft() {
        const draftStr = localStorage.getItem('gyanVruksh_autoDraft');
        if(draftStr && !editingPaperId && selectedPaperQuestions.length === 0) {
            try {
                const draft = JSON.parse(draftStr);
                if(draft && draft.questions && draft.questions.length > 0) {
                    if(confirm("તમારું છેલ્લે બનાવતા અધૂરું રહેલું પેપર (Auto-Save) મળ્યું છે. શું તમે તેને પાછું લાવવા માંગો છો?")) {
                        selectedPaperQuestions = draft.questions;
                        paperSectionsMetadata = draft.sectionsMetadata || { A:{}, B:{}, C:{}, D:{}, E:{}, F:{}, G:{}, None:{} };
                        currentSectionOrder = draft.sectionOrder || ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'None'];
                        if(document.getElementById('paperTitle')) document.getElementById('paperTitle').value = draft.title || '';
                        if(document.getElementById('paperSubject')) document.getElementById('paperSubject').value = draft.subject || '';
                        if(inputTotalMarks) inputTotalMarks.value = draft.targetMarks || 50;
                        updatePaperUI(); renderBank();
                    } else { localStorage.removeItem('gyanVruksh_autoDraft'); }
                }
            } catch(e) { console.error(e); }
        }
    }

    setInterval(() => {
        if(selectedPaperQuestions.length > 0) {
            const draftState = {
                title: document.getElementById('paperTitle') ? document.getElementById('paperTitle').value : '',
                subject: document.getElementById('paperSubject') ? document.getElementById('paperSubject').value : '',
                targetMarks: inputTotalMarks ? inputTotalMarks.value : 50,
                questions: selectedPaperQuestions,
                sectionsMetadata: paperSectionsMetadata,
                sectionOrder: currentSectionOrder
            };
            localStorage.setItem('gyanVruksh_autoDraft', JSON.stringify(draftState));
        }
    }, 30000);
    setTimeout(checkAutoDraft, 800);

    // 3. જૂના પેપર્સ ડ્રોપડાઉનમાં લોડ કરો
    function populateSavedPapers() {
        try {
            let p = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || [];
            let sel = document.getElementById('loadSavedPaper');
            if(!sel) return;
            sel.innerHTML = '<option value="">+ નવું પ્રશ્નપત્ર બનાવો (અથવા જૂનું પેપર પસંદ કરો)</option>';
            p.forEach(paper => { 
                let draftText = paper.isDraft ? ' [Draft 💾]' : '';
                sel.innerHTML += `<option value="${paper.id}">${paper.title} (${paper.date || ''})${draftText}</option>`; 
            });
        } catch(e) {}
    }
    populateSavedPapers();

    if(document.getElementById('loadSavedPaper')) {
        document.getElementById('loadSavedPaper').addEventListener('change', (e) => {
            let id = e.target.value;
            if(!id) {
                editingPaperId = null; selectedPaperQuestions = [];
                paperSectionsMetadata = { A:{}, B:{}, C:{}, D:{}, E:{}, F:{}, G:{}, None:{} };
                currentSectionOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'None'];
                if(document.getElementById('paperTitle')) document.getElementById('paperTitle').value = ''; 
                if(inputTotalMarks) inputTotalMarks.value = 50;
                updatePaperUI(); renderBank(); return;
            }
            let paper = (JSON.parse(localStorage.getItem('gyanVruksh_papers')) || []).find(x => x.id === id);
            if(paper) {
                editingPaperId = paper.id; selectedPaperQuestions = paper.questions || [];
                paperSectionsMetadata = paper.sectionsMetadata || { A:{}, B:{}, C:{}, D:{}, E:{}, F:{}, G:{}, None:{} };
                currentSectionOrder = paper.sectionOrder || ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'None'];
                if(document.getElementById('paperTitle')) document.getElementById('paperTitle').value = paper.title || '';
                if(document.getElementById('paperStd')) document.getElementById('paperStd').value = paper.standard || '10';
                if(document.getElementById('paperSubject')) document.getElementById('paperSubject').value = paper.subject || '';
                if(document.getElementById('paperDate')) document.getElementById('paperDate').value = paper.date || '';
                if(inputTotalMarks) inputTotalMarks.value = paper.targetMarks || 50;
                updatePaperUI(); renderBank();
            }
        });
    }

    if(document.getElementById('btnDuplicatePaper')) {
        document.getElementById('btnDuplicatePaper').addEventListener('click', () => {
            if(!editingPaperId) return alert("કૃપા કરીને ડ્રોપડાઉનમાંથી કોઈ એક જૂનું પેપર લોડ કરો, પછી કોપી બનાવો.");
            editingPaperId = null; document.getElementById('paperTitle').value += " - Copy"; document.getElementById('loadSavedPaper').value = ""; 
            alert("પેપરની કોપી તૈયાર છે! હવે તમે પ્રશ્નો બદલીને નવું 'સેવ' કરી શકો છો.");
        });
    }

    // 🎯 5. ફિલ્ટર એન્જિન
    function cleanStr(val) { return String(val === undefined || val === null ? '' : val).trim(); }

    function updateSubjects() {
        if(!fSub) return;
        const currentSub = fSub.value, stdVal = fStd ? cleanStr(fStd.value) : 'All';
        let subSet = new Set();
        if(stdVal !== 'All' && typeof window.getSubjectsByStandard === 'function') { (window.getSubjectsByStandard(stdVal) || []).forEach(s => { if(cleanStr(s)) subSet.add(cleanStr(s)); }); }
        allQuestions.forEach(q => { if((stdVal === 'All' || cleanStr(q.standard) === stdVal) && cleanStr(q.subject)) subSet.add(cleanStr(q.subject)); });
        const sortedSubs = Array.from(subSet).sort();
        fSub.innerHTML = '<option value="All">બધા વિષય</option>' + sortedSubs.map(s => `<option value="${s}">${s}</option>`).join('');
        if(sortedSubs.includes(currentSub)) fSub.value = currentSub; else fSub.value = 'All';
    }

    function updateChapters() { 
        if(!fChap) return;
        const currentChap = fChap.value, stdVal = fStd ? cleanStr(fStd.value) : 'All', subVal = fSub ? cleanStr(fSub.value) : 'All';
        let chapSet = new Set(); 
        allQuestions.forEach(q => { 
            if((stdVal === 'All' || cleanStr(q.standard) === stdVal) && (subVal === 'All' || cleanStr(q.subject) === subVal) && cleanStr(q.chapter)) chapSet.add(cleanStr(q.chapter)); 
        }); 
        const sortedChaps = Array.from(chapSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
        fChap.innerHTML = '<option value="All">બધા પ્રકરણ</option>' + sortedChaps.map(c => `<option value="${c}">પ્રકરણ - ${c}</option>`).join(''); 
        if(sortedChaps.includes(currentChap)) fChap.value = currentChap; else fChap.value = 'All';
    }

    if(fStd) fStd.addEventListener('change', () => { updateSubjects(); updateChapters(); renderBank(); });
    if(fSub) fSub.addEventListener('change', () => { updateChapters(); renderBank(); });
    if(fChap) fChap.addEventListener('change', renderBank);
    if(fType) fType.addEventListener('change', renderBank);
    if(fMarks) fMarks.addEventListener('change', renderBank);
    if(searchInput) searchInput.addEventListener('input', renderBank);

    function triggerMathJax() {
        setTimeout(() => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise().catch(err => console.log('MathJax Error:', err));
            }
        }, 100);
    }

    function renderBank() {
        if(!bankList) return;
        allQuestions = JSON.parse(localStorage.getItem('gyanVruksh_questions')) || [];
        bankList.innerHTML = '';

        const stdVal = fStd ? cleanStr(fStd.value) : 'All', subVal = fSub ? cleanStr(fSub.value) : 'All', chapVal = fChap ? cleanStr(fChap.value) : 'All', typeVal = fType ? cleanStr(fType.value) : 'All', marksVal = fMarks ? cleanStr(fMarks.value) : 'All', searchVal = searchInput ? cleanStr(searchInput.value).toLowerCase() : '';

        let filteredQuestions = allQuestions.filter(q => {
            if (selectedPaperQuestions.some(pq => pq.id === q.id)) return false;
            const qStd = cleanStr(q.standard), qSub = cleanStr(q.subject), qChap = cleanStr(q.chapter), qType = cleanStr(q.type), qMarks = cleanStr(q.marks), qText = cleanStr(q.text).toLowerCase(), qAns = cleanStr(q.answer).toLowerCase();
            return (stdVal === 'All' || qStd === stdVal) && (subVal === 'All' || qSub === subVal) && (chapVal === 'All' || qChap === chapVal) && (typeVal === 'All' || qType === typeVal || qType.includes(typeVal)) && (marksVal === 'All' || Number(qMarks) === Number(marksVal)) && (!searchVal || qText.includes(searchVal) || qAns.includes(searchVal) || qChap.toLowerCase().includes(searchVal));
        });

        if(filterCountBadge) filterCountBadge.innerText = `મળેલ: ${filteredQuestions.length}`;
        if(filteredQuestions.length === 0) {
            bankList.innerHTML = `<div style="padding:25px 15px; text-align:center; color:#666; background:#fafafa; border:1px dashed #ccc; border-radius:6px; margin:10px;"><strong>આ ફિલ્ટર મુજબ કોઈ પ્રશ્ન મળ્યો નથી.</strong></div>`;
            return;
        }
        
        filteredQuestions.forEach(q => {
            let uiText = q.text || '';
            if(q.type === 'MCQ') uiText = uiText.replace(/\(A\)/g, '<br>(A)').replace(/\(C\)/g, '&nbsp;&nbsp;&nbsp;&nbsp;(C)'); 
            else if (q.type === 'જોડકા જોડો' && window.parseMatchTextGlobal) uiText = window.parseMatchTextGlobal(uiText);
            if(uiText.length > 220 && q.type !== 'જોડકા જોડો') uiText = uiText.substring(0, 220) + '...';

            bankList.innerHTML += `<div class="q-item" style="display:flex; gap:10px; padding:10px; border-bottom:1px solid #eee; cursor:pointer; align-items:flex-start;">
                <input type="checkbox" class="q-checkbox" value="${q.id}" style="width:18px; height:18px; margin-top:3px;">
                <div style="flex:1;" onclick="this.previousElementSibling.click()">
                    <div style="font-size:0.8rem; color:#1565c0; font-weight:600; margin-bottom:3px;"><span style="background:#e3f2fd; padding:1px 6px; border-radius:3px;">ધો.${q.standard || '-'} | ${q.subject || '-'}</span> • Ch-${q.chapter} • ${q.type} • <strong style="color:#2e7d32;">[${q.marks} ગુણ]</strong></div>
                    <div style="font-size:0.95rem; color:#222;">${uiText}</div>
                </div></div>`;
        });
        triggerMathJax(); // 🚀 UI અપડેટ થયા પછી સમીકરણો પ્રિન્ટ કરો
    }

    if(document.getElementById('btnAddSelected')) {
        document.getElementById('btnAddSelected').addEventListener('click', () => {
            const checkedBoxes = document.querySelectorAll('.q-checkbox:checked');
            if(checkedBoxes.length === 0) return alert("કૃપા કરીને પહેલા પ્રશ્નો ટીક કરો.");
            checkedBoxes.forEach(cb => { const q = allQuestions.find(x => x.id === cb.value); if(q) selectedPaperQuestions.push({ ...q, section: document.getElementById('selectSection').value }); }); 
            updatePaperUI(); renderBank();
        });
    }

    window.removeQuestionFromPaper = function(id) { selectedPaperQuestions = selectedPaperQuestions.filter(q => q.id !== id); updatePaperUI(); renderBank(); }
    window.moveQuestion = function(id, dir) {
        const q = selectedPaperQuestions.find(x => x.id === id), secQ = selectedPaperQuestions.filter(sq => sq.section === q.section), idx = secQ.findIndex(sq => sq.id === id);
        if (dir === -1 && idx > 0) swap(id, secQ[idx-1].id); else if (dir === 1 && idx < secQ.length - 1) swap(id, secQ[idx+1].id);
        updatePaperUI();
    }
    function swap(id1, id2) { const i1 = selectedPaperQuestions.findIndex(q=>q.id===id1), i2 = selectedPaperQuestions.findIndex(q=>q.id===id2); const t = selectedPaperQuestions[i1]; selectedPaperQuestions[i1] = selectedPaperQuestions[i2]; selectedPaperQuestions[i2] = t; }

    window.moveSection = function(sec, dir) {
        const idx = currentSectionOrder.indexOf(sec);
        if(dir === -1 && idx > 0) { let temp = currentSectionOrder[idx]; currentSectionOrder[idx] = currentSectionOrder[idx-1]; currentSectionOrder[idx-1] = temp; } 
        else if (dir === 1 && idx < currentSectionOrder.length - 1) { let temp = currentSectionOrder[idx]; currentSectionOrder[idx] = currentSectionOrder[idx+1]; currentSectionOrder[idx+1] = temp; }
        updatePaperUI();
    }

    window.addSubInstruction = function(sec) { selectedPaperQuestions.push({ id: 'INST_' + Date.now(), type: 'instruction', text: '', attempt: '', section: sec, marks: 0 }); updatePaperUI(); }
    window.updateMeta = function(sec, field, val) { paperSectionsMetadata[sec][field] = val; }
    window.updateInlineInst = function(id, field, val) { const q = selectedPaperQuestions.find(x => x.id === id); if(q) q[field] = val; }

    window.handleInstSelect = function(sel, sec) { const input = sel.nextElementSibling; if (sel.value === 'custom') { input.style.display = 'block'; input.focus(); updateMeta(sec, 'instruction', input.value); } else { input.style.display = 'none'; updateMeta(sec, 'instruction', sel.value); input.value = sel.value; } }
    window.handleInlineInstSelect = function(sel, qId) { const input = sel.nextElementSibling; if (sel.value === 'custom') { input.style.display = 'block'; input.focus(); updateInlineInst(qId, 'text', input.value); } else { input.style.display = 'none'; updateInlineInst(qId, 'text', sel.value); input.value = sel.value; } }

    function generateInstDropdownHTML(val, onChangeCode) {
        let isCustom = val && !defInst.includes(val), selHtml = `<select class="inst-select" onchange="${onChangeCode}" style="padding:6px; border:1px solid #ccc; border-radius:4px; font-weight:bold; color:#333;"><option value="">-- સૂચના પસંદ કરો --</option>`;
        defInst.forEach(i => { selHtml += `<option value="${i}" ${val === i ? 'selected' : ''}>${i}</option>`; });
        selHtml += `<option value="custom" ${isCustom ? 'selected' : ''}>+ અન્ય (જાતે લખો)</option></select><input type="text" placeholder="સૂચના ટાઈપ કરો..." value="${isCustom ? val : ''}" onchange="this.previousElementSibling.value='custom'; ${onChangeCode.replace('this', 'this.previousElementSibling')}; this.previousElementSibling.onchange();" style="display:${isCustom ? 'block' : 'none'}; padding:6px; border:1px solid #ccc; border-radius:4px; margin-top:5px; width:100%;">`;
        return selHtml;
    }

    function updatePaperUI() {
        if(!sectionsWrapper) return;
        sectionsWrapper.innerHTML = ''; currentTotalMarks = 0;
        const sectionsData = { None:[], A:[], B:[], C:[], D:[], E:[], F:[], G:[] };
        selectedPaperQuestions.forEach(q => { currentTotalMarks += parseInt(q.marks || 0); const secKey = (q.section && sectionsData[q.section]) ? q.section : 'None'; sectionsData[secKey].push(q); });

        currentSectionOrder.forEach(sec => {
            if(sectionsData[sec] && sectionsData[sec].length > 0) {
                const secDiv = document.createElement('div'); secDiv.style.marginBottom = '20px';
                let html = `<div style="background:${(sec !== "None") ? 'var(--primary-color)' : '#546e7a'}; color:white; padding:6px 12px; display:flex; justify-content:space-between; align-items:center; font-weight:bold; border-radius:4px 4px 0 0;">
                    <div style="display:flex; gap:10px;"><button type="button" onclick="moveSection('${sec}', -1)" style="background:rgba(255,255,255,0.2); border:none; color:white; padding:4px 10px; cursor:pointer; border-radius:3px;"><i class="fas fa-arrow-up"></i></button><button type="button" onclick="moveSection('${sec}', 1)" style="background:rgba(255,255,255,0.2); border:none; color:white; padding:4px 10px; cursor:pointer; border-radius:3px;"><i class="fas fa-arrow-down"></i></button></div>
                    <span>${(sec !== "None") ? `વિભાગ - ${sec}` : `સામાન્ય પ્રશ્નો (વિભાગ વગર)`}</span>
                    <button type="button" onclick="addSubInstruction('${sec}')" style="background:#ffca28; color:#000; border:none; padding:4px 10px; border-radius:3px; cursor:pointer; font-size:13px; font-weight:bold;"><i class="fas fa-plus"></i> પેટા-સૂચના ઉમેરો</button>
                </div>`;
                
                let mainInstVal = (paperSectionsMetadata[sec] && paperSectionsMetadata[sec].instruction) ? paperSectionsMetadata[sec].instruction : "";
                let mainAttemptVal = (paperSectionsMetadata[sec] && paperSectionsMetadata[sec].attempt) ? paperSectionsMetadata[sec].attempt : "";
                html += `<div style="background:#f9f9f9; padding:10px; border:1px solid #ddd; border-top:none; display:flex; gap:10px; align-items:flex-start;">
                            <div style="flex:3;">${generateInstDropdownHTML(mainInstVal, `handleInstSelect(this, '${sec}')`)}</div>
                            <input type="text" placeholder="દા.ત. કોઈ પણ: 3" value="${mainAttemptVal}" onchange="updateMeta('${sec}', 'attempt', this.value)" style="flex:1; padding:6px; border:1px solid #ccc; border-radius:4px;">
                         </div><ul style="list-style:none; padding:0; border:1px solid #ddd; border-top:none;">`;
                
                sectionsData[sec].forEach((q) => {
                    if (q.type === 'instruction') {
                        html += `<li style="padding:10px; border-bottom:1px solid #eee; background:#fff9c4; display:flex; flex-direction:column; gap:8px;">
                            <div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-weight:bold; color:#f57f17;"><i class="fas fa-info-circle"></i> પેટા-સૂચના</span><div style="display:flex; gap:5px;"><button type="button" onclick="moveQuestion('${q.id}', -1)" style="cursor:pointer; background:none; border:none; color:#555;"><i class="fas fa-arrow-up"></i></button><button type="button" onclick="moveQuestion('${q.id}', 1)" style="cursor:pointer; background:none; border:none; color:#555;"><i class="fas fa-arrow-down"></i></button><button type="button" onclick="removeQuestionFromPaper('${q.id}')" style="cursor:pointer; background:none; border:none; color:red;"><i class="fas fa-times-circle"></i></button></div></div>
                            <div style="display:flex; gap:10px; align-items:flex-start;"><div style="flex:3;">${generateInstDropdownHTML(q.text, `handleInlineInstSelect(this, '${q.id}')`)}</div><input type="text" placeholder="દા.ત. કોઈ પણ: 3" value="${q.attempt||''}" onchange="updateInlineInst('${q.id}', 'attempt', this.value)" style="flex:1; padding:6px; border:1px solid #ccc; border-radius:4px;"></div></li>`;
                    } else {
                        let uiText = q.text || '';
                        if(q.type === 'MCQ') uiText = uiText.replace(/\(A\)/g, '<br>(A)').replace(/\(C\)/g, '&nbsp;&nbsp;&nbsp;&nbsp;(C)'); 
                        else if (q.type === 'જોડકા જોડો' && window.parseMatchTextGlobal) uiText = window.parseMatchTextGlobal(uiText);
                        
                        html += `<li style="padding:8px; border-bottom:1px solid #eee; display:flex;">
                            <div style="flex:1;">${uiText} <span style="color:var(--primary-color); font-weight:bold;">[${q.marks}]</span></div>
                            <div style="display:flex; gap:5px;"><button type="button" onclick="moveQuestion('${q.id}', -1)" style="cursor:pointer; background:none; border:none; color:#555;"><i class="fas fa-arrow-up"></i></button><button type="button" onclick="moveQuestion('${q.id}', 1)" style="cursor:pointer; background:none; border:none; color:#555;"><i class="fas fa-arrow-down"></i></button><button type="button" onclick="removeQuestionFromPaper('${q.id}')" style="cursor:pointer; background:none; border:none; color:red;"><i class="fas fa-times-circle"></i></button></div></li>`;
                    }
                });
                secDiv.innerHTML = html + `</ul>`; sectionsWrapper.appendChild(secDiv);
            }
        });
        
        if(marksCounter) {
            let limit = inputTotalMarks ? inputTotalMarks.value : 50;
            marksCounter.innerText = `પ્રશ્નો: ${selectedPaperQuestions.filter(q=>q.type!=='instruction').length} | કુલ ગુણ: ${currentTotalMarks} / ${limit}`;
            marksCounter.style.color = (currentTotalMarks > limit) ? 'red' : '#1565c0';
        }
        triggerMathJax(); // 🚀 UI અપડેટ થયા પછી સમીકરણો પ્રિન્ટ કરો
    }

    if(inputTotalMarks) inputTotalMarks.addEventListener('input', updatePaperUI);

    function savePaperData(isDraft) {
        try {
            const title = document.getElementById('paperTitle') ? document.getElementById('paperTitle').value : '';
            if(!title) return alert('કૃપા કરીને પરીક્ષાનું નામ લખો.');
            if(selectedPaperQuestions.length === 0) return alert('કૃપા કરીને પેપરમાં પ્રશ્નો ઉમેરો.');
            
            const paperData = {
                id: editingPaperId || ('P' + Date.now()), title: title, 
                standard: document.getElementById('paperStd') ? document.getElementById('paperStd').value : '',
                subject: document.getElementById('paperSubject') ? document.getElementById('paperSubject').value : '', 
                date: document.getElementById('paperDate') ? document.getElementById('paperDate').value : '', 
                targetMarks: document.getElementById('paperTotalMarks') ? document.getElementById('paperTotalMarks').value : '', 
                totalMarks: currentTotalMarks, questions: selectedPaperQuestions, sectionsMetadata: paperSectionsMetadata, sectionOrder: currentSectionOrder,
                isDraft: isDraft 
            };
            
            let p = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || []; 
            if(editingPaperId) { const idx = p.findIndex(x => x.id === editingPaperId); if(idx > -1) p[idx] = paperData; } else p.push(paperData);
            localStorage.setItem('gyanVruksh_papers', JSON.stringify(p));
            localStorage.removeItem('gyanVruksh_autoDraft');
            
            if(isDraft) { alert('પેપર ડ્રાફ્ટ (Draft) તરીકે સેવ થઈ ગયું છે!'); populateSavedPapers(); } 
            else { alert('પ્રશ્નપત્ર સેવ થઈ ગયું છે! હવે ડાઉનલોડ પેજ પર લઈ જવામાં આવશે.'); selectedPaperQuestions = []; window.location.href = 'solutions.html'; }
        } catch(error) { alert("ભૂલ: " + error.message); }
    }

    if(document.getElementById('btnSavePaper')) document.getElementById('btnSavePaper').addEventListener('click', (e) => { e.preventDefault(); savePaperData(false); });
    if(document.getElementById('btnSaveDraft')) document.getElementById('btnSaveDraft').addEventListener('click', (e) => { e.preventDefault(); savePaperData(true); });

    // 👁️ 11. લાઈવ પ્રિવ્યૂ લોજિક
    if(document.getElementById('btnPreviewPaper')) {
        document.getElementById('btnPreviewPaper').addEventListener('click', () => {
            if(selectedPaperQuestions.length === 0) return alert('પેપરમાં કોઈ પ્રશ્ન નથી.');
            const tempPaper = {
                title: document.getElementById('paperTitle').value || 'નમૂનાનું પ્રશ્નપત્ર', 
                standard: document.getElementById('paperStd') ? document.getElementById('paperStd').value : '',
                subject: document.getElementById('paperSubject') ? document.getElementById('paperSubject').value : '', 
                date: document.getElementById('paperDate') ? document.getElementById('paperDate').value : '', 
                totalMarks: currentTotalMarks, questions: selectedPaperQuestions, sectionsMetadata: paperSectionsMetadata, sectionOrder: currentSectionOrder
            };
            const previewCanvas = document.getElementById('previewCanvas'), previewModal = document.getElementById('previewModal');
            if(previewCanvas && previewModal && typeof window.generatePaperHTML === 'function') {
                previewCanvas.innerHTML = window.generatePaperHTML(tempPaper, 'paper');
                previewModal.style.display = 'flex';
                triggerMathJax(); // 🚀 પ્રિવ્યૂમાં પણ સમીકરણો પ્રિન્ટ કરો
            } else { alert("પ્રિવ્યૂ જનરેટ કરવામાં ભૂલ આવી રહી છે. કૃપા કરીને પેજ રિફ્રેશ કરો."); }
        });
    }

    if(document.getElementById('btnClosePreview')) { document.getElementById('btnClosePreview').addEventListener('click', () => { document.getElementById('previewModal').style.display = 'none'; }); }

    updateSubjects(); updateChapters(); renderBank();
});
// js/pdf-generator.js - ZERO-PLACEHOLDER PUBLISHER PDF ENGINE

window.downloadPDF = function(paperId, type) {
    window.openVectorPDFWindow(paperId, type, true);
};

window.printPaper = function(paperId, type) {
    window.openVectorPDFWindow(paperId, type, false);
};

// 🧹 Clean any legacy _htmltag_ or @@@@ artifacts
window.cleanPDFCorruptedText = function(str) {
    if (!str || typeof str !== 'string') return '';
    return str
        .replace(/_{1,2}htmltag[a-z0-9_]*_{1,2}/gi, '')
        .replace(/_htmltag-[a-z0-9_-]*/gi, '')
        .replace(/@@TAG\d*@@/gi, '')
        .replace(/@@TA<sub>G\d+<\/sub>@@/gi, '')
        .replace(/@@@@/g, '')
        .replace(/\\\\ce\{([^}]+)\}/g, '$1')
        .replace(/\\ce\{([^}]+)\}/g, '$1');
};

// 🧮 Pure Text-Node Math & Science Parser (Zero Placeholders = Zero _htmltag_ Bugs!)
window.transformPDFMathSegment = function(text) {
    if (!text) return '';
    let s = window.cleanPDFCorruptedText(text);

    s = s.replace(/\$([^$]+)\$/g, '$1');
    s = s.replace(/\\\\/g, '\\');

    // Symbols
    s = s.replace(/\\pi\b/g, 'π')
         .replace(/\\theta\b/g, 'θ')
         .replace(/\\alpha\b/g, 'α')
         .replace(/\\beta\b/g, 'β')
         .replace(/\\gamma\b/g, 'γ')
         .replace(/\\Delta\b/g, 'Δ')
         .replace(/\\angle\b/g, '∠')
         .replace(/\\times\b/g, '×')
         .replace(/\\div\b/g, '÷')
         .replace(/\\pm\b/g, '±')
         .replace(/\\neq\b/g, '≠')
         .replace(/\\leq\b/g, '≤')
         .replace(/\\geq\b/g, '≥')
         .replace(/\\rightarrow\b/g, ' → ')
         .replace(/\\leftarrow\b/g, ' ← ')
         .replace(/<->/g, ' ⇌ ')
         .replace(/->/g, ' → ');

    // Overline
    s = s.replace(/\\overline\{([^}]+)\}/g, '<span style="border-top:1.4px solid #000; padding-top:1px;">$1</span>');

    // Fractional Exponents first: 11^(1/2), 11^1/2
    s = s.replace(/\^\(\s*([0-9a-zA-Z+\-]+)\s*\/\s*([0-9a-zA-Z+\-]+)\s*\)/g, '<sup class="pdf-sup">$1/$2</sup>');
    s = s.replace(/\^\{\s*([0-9a-zA-Z+\-]+)\s*\/\s*([0-9a-zA-Z+\-]+)\s*\}/g, '<sup class="pdf-sup">$1/$2</sup>');
    s = s.replace(/\^([0-9]+\/[0-9]+)/g, '<sup class="pdf-sup">$1</sup>');

    // Standard Exponents: ^2, ^-3, ^(a+b), ^{n}
    s = s.replace(/\^\(([^)]+)\)/g, '<sup class="pdf-sup">$1</sup>');
    s = s.replace(/\^\{([^}]+)\}/g, '<sup class="pdf-sup">$1</sup>');
    s = s.replace(/\^([+\-]?[0-9a-zA-Z]+)/g, '<sup class="pdf-sup">$1</sup>');

    // Subscripts
    s = s.replace(/_\(([^)]+)\)/g, '<sub class="pdf-sub">$1</sub>');
    s = s.replace(/_\{([^}]+)\}/g, '<sub class="pdf-sub">$1</sub>');
    s = s.replace(/_([0-9a-zA-Z]+)/g, '<sub class="pdf-sub">$1</sub>');

    // Square Roots with crisp top bar
    s = s.replace(/\\sqrt\{([^}]+)\}/g, '<span class="pdf-sqrt"><span class="pdf-sqrt-sym">√</span><span class="pdf-sqrt-body">$1</span></span>');
    s = s.replace(/√\(([^)]+)\)/g, '<span class="pdf-sqrt"><span class="pdf-sqrt-sym">√</span><span class="pdf-sqrt-body">$1</span></span>');
    s = s.replace(/√([0-9a-zA-Z]+)/g, '<span class="pdf-sqrt"><span class="pdf-sqrt-sym">√</span><span class="pdf-sqrt-body">$1</span></span>');

    // Fractions
    s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="pdf-frac"><span class="pdf-num">$1</span><span class="pdf-den">$2</span></span>');
    s = s.replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g, '<span class="pdf-frac"><span class="pdf-num">$1</span><span class="pdf-den">$2</span></span>');
    s = s.replace(/([0-9a-zA-Z]+)\s*\/\s*\(([^()]+)\)/g, '<span class="pdf-frac"><span class="pdf-num">$1</span><span class="pdf-den">$2</span></span>');
    s = s.replace(/\(([^()]+)\)\s*\/\s*([0-9a-zA-Z]+)/g, '<span class="pdf-frac"><span class="pdf-num">$1</span><span class="pdf-den">$2</span></span>');

    s = s.replace(/(?<!\/|\d\/)\b([0-9]{1,4}|[pPqQaAbBxXyYzZ])\s*\/\s*([0-9]{1,4}|[pPqQaAbBxXyYzZ])\b(?!\/)/g, (match, num, den, offset, fullStr) => {
        const before = fullStr.substring(Math.max(0, offset - 22), offset);
        if (before.includes('pdf-sup')) return `${num}/${den}`;
        return `<span class="pdf-frac"><span class="pdf-num">${num}</span><span class="pdf-den">${den}</span></span>`;
    });

    // Chemistry Formulas
    s = s.replace(/\b([A-Z][a-z]?)([2-9])\b/g, '$1<sub class="pdf-sub">$2</sub>');
    s = s.replace(/([A-Z][a-z]?)([2-9])(?=[A-Z(])/g, '$1<sub class="pdf-sub">$2</sub>');
    s = s.replace(/\(([A-Za-z0-9]+)\)([2-9])/g, '($1)<sub class="pdf-sub">$2</sub>');

    return s;
};

window.renderPDFScienceMath = function(htmlStr) {
    if (!htmlStr) return '';
    let cleaned = window.cleanPDFCorruptedText(String(htmlStr));
    const parts = cleaned.split(/(<\/?[a-zA-Z][^>]*>)/g);
    for (let i = 0; i < parts.length; i++) {
        if (!parts[i].startsWith('<')) {
            parts[i] = window.transformPDFMathSegment(parts[i]);
        }
    }
    return parts.join('');
};

window.openVectorPDFWindow = function(paperId, type, isDownloadMode) {
    const paper = (JSON.parse(localStorage.getItem('gyanVruksh_papers')) || []).find(p => p.id === paperId);
    if (!paper) return alert("પેપર મળ્યું નથી!");

    const rawHTML = window.generatePaperHTML(paper, type);
    const fileName = `${paper.title}_${type === 'solution' ? 'Answer_Key' : 'Question_Paper'}`;

    const printWin = window.open('', '_blank');
    if (!printWin) return alert("કૃપા કરીને બ્રાઉઝરમાં Pop-up ને Allow કરો.");

    printWin.document.write(`
        <!DOCTYPE html>
        <html lang="gu">
        <head>
            <meta charset="UTF-8">
            <title>${fileName}</title>
            <link href="[https://fonts.googleapis.com/css2?family=Mukta+Vaani:wght@400;600;700&family=Noto+Sans+Gujarati:wght@400;600;700&display=swap](https://fonts.googleapis.com/css2?family=Mukta+Vaani:wght@400;600;700&family=Noto+Sans+Gujarati:wght@400;600;700&display=swap)" rel="stylesheet">
            <style>
                @page { size: A4 portrait; margin: 12mm 14mm 12mm 14mm; }
                * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                body { font-family: 'Noto Sans Gujarati', 'Mukta Vaani', 'Shruti', sans-serif; background: #525659; color: #000; margin: 0; padding: 0; font-size: 14.5px; line-height: 1.7; }
                
                /* ➗ Publisher-Grade Math CSS for PDF */
                .pdf-frac {
                    display: inline-flex;
                    flex-direction: column;
                    vertical-align: middle;
                    text-align: center;
                    padding: 0 3px;
                    margin: 0 2px;
                    font-size: 0.96em;
                    line-height: 1.15;
                }
                .pdf-num {
                    border-bottom: 1.4px solid #000;
                    padding: 0 4px 2px 4px;
                    display: block;
                    font-weight: 600;
                }
                .pdf-den {
                    padding: 2px 4px 0 4px;
                    display: block;
                    font-weight: 600;
                }
                .pdf-sqrt {
                    display: inline-flex;
                    align-items: stretch;
                    vertical-align: middle;
                    margin: 2px 2px;
                    line-height: 1.2;
                }
                .pdf-sqrt-sym {
                    font-size: 1.15em;
                    font-weight: bold;
                    line-height: 1;
                    padding-top: 2px;
                    margin-right: 1px;
                }
                .pdf-sqrt-body {
                    border-top: 1.4px solid #000;
                    padding: 1px 3px 0 2px;
                    display: inline-block;
                }
                sup.pdf-sup { font-size: 0.78em; vertical-align: super; line-height: 0; font-weight: 600; }
                sub.pdf-sub { font-size: 0.78em; vertical-align: sub; line-height: 0; font-weight: 600; }

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
                .sec-instruction { font-size: 14.5px; font-weight: bold; margin: 8px 0 6px 0; display: flex; justify-content: space-between; page-break-inside: avoid; text-align: left; }
                .q-row-table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-bottom: 8px; page-break-inside: avoid !important; text-align: left !important; }
                .q-cell-text { width: 89%; padding-right: 10px; vertical-align: top; font-size: 15px; word-wrap: break-word; text-align: left !important; }
                .q-cell-marks { width: 11%; vertical-align: top; text-align: right !important; font-weight: bold; font-size: 14.5px; white-space: nowrap; }
                .p-ans-box { margin-top: 5px; padding: 6px 10px; background: #f8fafc; border-left: 3px solid #16a34a; font-size: 14px; page-break-inside: avoid !important; text-align: left !important; }
                .mcq-table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 4px; text-align: left !important; }
                .mcq-table td { width: 50%; padding: 3px 8px 3px 0; vertical-align: middle; font-size: 14.5px; }
                .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 65px; color: rgba(0, 0, 0, 0.05); z-index: 0; pointer-events: none; font-weight: bold; white-space: nowrap; }
            </style>
        </head>
        <body>
            <div class="top-action-bar no-print">
                <div>💡 <strong>100% પરફેક્ટ PDF:</strong> પ્રિન્ટ વિન્ડોમાં Destination માં <strong>"Save as PDF"</strong> પસંદ કરો.</div>
                <div style="display:flex; gap:10px;">
                    <button class="action-btn btn-save-pdf" onclick="window.print()">🖨️ Save as PDF / Print</button>
                    <button class="action-btn btn-close" onclick="window.close()">✖ બંધ કરો</button>
                </div>
            </div>
            <div class="paper-sheet" id="printableArea">${rawHTML}</div>
            <script>
                window.onload = function() { setTimeout(function() { window.print(); }, 350); };
            </script>
        </body>
        </html>
    `);
    printWin.document.close();
    printWin.focus();
};

window.generatePaperHTML = function(paper, type) {
    const schoolData = JSON.parse(localStorage.getItem('gyanVruksh_schoolProfile')) || { name: "શાળા", address: "", contact: "", code: "" };
    const pdfSet = JSON.parse(localStorage.getItem('gyanVruksh_pdfSettings')) || { examName: true, date: true, std: true, subject: true, marks: true, numbering: 'continuous', watermark: '' };
    const sMeta = paper.sectionsMetadata || {};
    const order = paper.sectionOrder || ['None', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

    let html = `<div class="print-header"><h1>${schoolData.name}</h1>`;
    if (schoolData.address) html += `<p>${schoolData.address}</p>`;
    html += `</div>`;

    if (pdfSet.watermark) html += `<div class="watermark">${pdfSet.watermark}</div>`;

    html += `<div class="exam-meta">`;
    if (pdfSet.examName) html += `<div style="width:100%; text-align:center; font-size:17.5px; font-weight:bold; text-decoration:underline; margin-bottom:6px;">${paper.title} ${type === 'solution' ? '(Answer Key)' : ''}</div>`;
    if (pdfSet.std && paper.standard) html += `<span>ધોરણ: ${paper.standard}</span>`;
    if (pdfSet.subject && paper.subject) html += `<span> &nbsp;|&nbsp; વિષય: ${paper.subject}</span>`;
    if (pdfSet.date && paper.date) html += `<span> &nbsp;|&nbsp; તારીખ: ${window.formatDateDDMMYYYY(paper.date)}</span>`;
    if (pdfSet.marks) html += `<span style="float:right;">કુલ ગુણ: ${paper.totalMarks}</span>`;
    html += `</div><div class="print-questions" style="margin-top:10px; text-align:left;">`;

    const sData = { "None": [], A: [], B: [], C: [], D: [], E: [], F: [], G: [] };
    (paper.questions || []).forEach(q => {
        const secKey = (q.section && sData[q.section]) ? q.section : 'None';
        sData[secKey].push(q);
    });

    let gQNum = 1;
    order.forEach(sec => {
        if (sData[sec] && sData[sec].length > 0) {
            if (sec !== "None") html += `<div class="sec-banner">વિભાગ - ${sec}</div>`;
            if (sMeta[sec] && (sMeta[sec].instruction || sMeta[sec].attempt)) {
                html += `<div class="sec-instruction"><span>${sMeta[sec].instruction ? '• ' + sMeta[sec].instruction : ''}</span><span>${sMeta[sec].attempt ? '(' + sMeta[sec].attempt + ')' : ''}</span></div>`;
            }
            let sQNum = 1;
            sData[sec].forEach(q => {
                if (q.type === 'instruction') {
                    html += `<div class="sec-instruction" style="margin-top:10px;"><span>${q.text ? '• ' + window.renderPDFScienceMath(q.text) : ''}</span><span>${q.attempt ? '(' + q.attempt + ')' : ''}</span></div>`;
                } else {
                    const qNum = (pdfSet.numbering === 'continuous' || sec === "None") ? gQNum : sQNum;
                    html += `<table class="q-row-table"><tr>`;
                    html += `<td class="q-cell-text"><strong>${qNum}.</strong> ${window.formatForPDF(q)}`;
                    if (q.image) html += `<br><img src="${q.image}" style="max-height:120px; max-width:95%; margin-top:5px;">`;
                    if (type === 'solution') {
                        html += `<div class="p-ans-box"><strong>ઉત્તર:</strong><br><div style="margin-left:8px;">${window.formatAns(q.answer)}</div>`;
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

window.formatForPDF = function(q) {
    let t = window.cleanPDFCorruptedText(q.text || '');
    if (q.type === 'MCQ') {
        const parts = t.split(/\(A\)|\(B\)|\(C\)|\(D\)/);
        if (parts.length === 5) {
            return `${window.renderPDFScienceMath(parts[0].trim())}
                <table class="mcq-table">
                    <tr><td>(A) ${window.renderPDFScienceMath(parts[1].trim())}</td><td>(B) ${window.renderPDFScienceMath(parts[2].trim())}</td></tr>
                    <tr><td>(C) ${window.renderPDFScienceMath(parts[3].trim())}</td><td>(D) ${window.renderPDFScienceMath(parts[4].trim())}</td></tr>
                </table>`;
        }
    }
    if (q.type === 'જોડકા જોડો' && window.parseMatchTextGlobal) return window.parseMatchTextGlobal(t);
    return window.renderPDFScienceMath(t.replace(/\n/g, '<br>'));
};

window.formatAns = function(ans) {
    let cleaned = window.cleanPDFCorruptedText(ans || '');
    let lines = cleaned.split('\n');
    if (lines.length > 1) {
        return lines.map(l => l.trim() ? `<div style="margin-bottom:4px;">&#8226; ${window.renderPDFScienceMath(l.trim())}</div>` : '').join('');
    }
    return window.renderPDFScienceMath(cleaned);
};

window.formatDateDDMMYYYY = function(dateStr) {
    if (!dateStr) return "";
    const p = dateStr.split('-');
    return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : dateStr;
};

window.parseMatchTextGlobal = function(text) {
    let lines = window.cleanPDFCorruptedText(text || '').split('\n');
    let colA = [], colB = [];
    let html = '<table style="width:100%; table-layout:fixed; font-size:14.5px; margin-top:6px; border-collapse:collapse; text-align:left;">';
    html += '<tr><td style="width:50%; font-weight:bold; padding-bottom:4px;">વિભાગ A</td><td style="width:50%; font-weight:bold; padding-bottom:4px;">વિભાગ B</td></tr>';

    lines.forEach(l => {
        l = l.trim();
        if (!l || l.includes('વિભાગ A') || l.includes('વિભાગ B')) return;
        let parts = l.split(/\s{2,}|\t+| - | – /);
        if (parts.length >= 2) {
            colA.push(window.renderPDFScienceMath(parts[0].trim()));
            colB.push(window.renderPDFScienceMath(parts.slice(1).join(' ').trim()));
        } else {
            let match = l.match(/^(.*?\S)\s+(\([a-zA-Zઅ-જ]\)|[a-zA-Zઅ-જ][\.\)])\s*(.*)$/);
            if (match) {
                colA.push(window.renderPDFScienceMath(match[1].trim()));
                colB.push(window.renderPDFScienceMath(`${match[2]} ${match[3].trim()}`));
            }
        }
    });

    let maxLen = Math.max(colA.length, colB.length);
    for (let i = 0; i < maxLen; i++) {
        html += `<tr><td style="width:50%; padding:2px 10px 2px 0; vertical-align:middle;">${colA[i] || ''}</td><td style="width:50%; padding:2px 0; vertical-align:middle;">${colB[i] || ''}</td></tr>`;
    }
    return html + '</table>';
};