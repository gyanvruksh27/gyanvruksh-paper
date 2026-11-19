// js/settings.js
document.addEventListener('DOMContentLoaded', () => {
    loadSchoolProfile(); loadPdfSettings();

    document.getElementById('schoolProfileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const schoolData = { name: document.getElementById('schoolName').value, code: document.getElementById('schoolCode').value, address: document.getElementById('schoolAddress').value };
        localStorage.setItem('gyanVruksh_schoolProfile', JSON.stringify(schoolData)); alert("શાળાની માહિતી સેવ થઈ ગઈ!");
    });

    function loadSchoolProfile() {
        const d = JSON.parse(localStorage.getItem('gyanVruksh_schoolProfile'));
        if(d) { document.getElementById('schoolName').value = d.name || ''; document.getElementById('schoolCode').value = d.code || ''; document.getElementById('schoolAddress').value = d.address || ''; }
    }

    function loadPdfSettings() {
        let pdfSet = JSON.parse(localStorage.getItem('gyanVruksh_pdfSettings')) || { examName: true, date: true, std: true, subject: true, marks: true, numbering: 'continuous', watermark: 'Gyan Vruksh' };
        document.getElementById('chkExamName').checked = pdfSet.examName; document.getElementById('chkDate').checked = pdfSet.date;
        document.getElementById('chkStd').checked = pdfSet.std !== false; document.getElementById('chkSubject').checked = pdfSet.subject;
        document.getElementById('chkTotalMarks').checked = pdfSet.marks; document.getElementById('pdfNumberingStyle').value = pdfSet.numbering;
        document.getElementById('pdfWatermark').value = pdfSet.watermark;
    }

    document.getElementById('btnSavePdfSettings').addEventListener('click', () => {
        const pdfSet = {
            examName: document.getElementById('chkExamName').checked, date: document.getElementById('chkDate').checked,
            std: document.getElementById('chkStd').checked, subject: document.getElementById('chkSubject').checked,
            marks: document.getElementById('chkTotalMarks').checked, numbering: document.getElementById('pdfNumberingStyle').value,
            watermark: document.getElementById('pdfWatermark').value
        };
        localStorage.setItem('gyanVruksh_pdfSettings', JSON.stringify(pdfSet)); alert("PDF સેટિંગ્સ સેવ થઈ ગયા!");
    });

    // 💾 Backup & Restore Logic
    document.getElementById('btnBackup').addEventListener('click', () => {
        const data = {
            questions: JSON.parse(localStorage.getItem('gyanVruksh_questions')),
            papers: JSON.parse(localStorage.getItem('gyanVruksh_papers')),
            school: JSON.parse(localStorage.getItem('gyanVruksh_schoolProfile')),
            settings: JSON.parse(localStorage.getItem('gyanVruksh_pdfSettings'))
        };
        const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `GyanVruksh_Backup_${new Date().toLocaleDateString().replace(/\//g,'-')}.json`; a.click();
    });

    document.getElementById('btnRestore').addEventListener('click', () => document.getElementById('fileRestore').click());
    document.getElementById('fileRestore').addEventListener('change', (e) => {
        if(e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const d = JSON.parse(ev.target.result);
                    if(d.questions) localStorage.setItem('gyanVruksh_questions', JSON.stringify(d.questions));
                    if(d.papers) localStorage.setItem('gyanVruksh_papers', JSON.stringify(d.papers));
                    if(d.school) localStorage.setItem('gyanVruksh_schoolProfile', JSON.stringify(d.school));
                    if(d.settings) localStorage.setItem('gyanVruksh_pdfSettings', JSON.stringify(d.settings));
                    alert("ડેટા સફળતાપૂર્વક રિસ્ટોર થઈ ગયો છે! 🎉"); location.reload();
                } catch(err) { alert("ભૂલ! યોગ્ય બેકઅપ ફાઈલ પસંદ કરો."); }
            }; reader.readAsText(e.target.files[0]);
        }
    });
});