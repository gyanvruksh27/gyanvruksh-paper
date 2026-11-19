// js/solutions.js
document.addEventListener('DOMContentLoaded', () => {
    const paperGrid = document.getElementById('paperGrid');
    
    function renderPapers() {
        let papers = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || [];
        // ડ્રાફ્ટ થયેલા પેપર અહીં ન બતાવો
        papers = papers.filter(p => !p.isDraft);
        
        paperGrid.innerHTML = '';
        if(papers.length === 0) {
            paperGrid.innerHTML = '<p style="padding:20px; color:#666;">હજુ સુધી કોઈ ફાઇનલ પ્રશ્નપત્ર સેવ કરેલ નથી. (જો ડ્રાફ્ટમાં સેવ કર્યું હોય તો પેપર બિલ્ડરમાં જોવા મળશે).</p>';
            return;
        }

        papers.slice().reverse().forEach(p => {
            const card = document.createElement('div');
            card.className = 'paper-card';
            card.style.border = "1px solid #ddd"; 
            card.style.borderRadius = "8px"; 
            card.style.padding = "15px"; 
            card.style.background = "#fff";
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <h3 style="margin:0; color:var(--primary-color);">${p.title}</h3>
                    <button onclick="deletePaper('${p.id}')" style="background:none; border:none; color:red; cursor:pointer;" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
                <p style="margin:5px 0; font-size:14px; color:#555;"><strong>વિષય:</strong> ${p.subject} (Std: ${p.standard})</p>
                <p style="margin:5px 0; font-size:14px; color:#555;"><strong>ગુણ:</strong> ${p.totalMarks} | <strong>તારીખ:</strong> ${p.date || '-'}</p>
                
                <div style="display:flex; gap:8px; margin-top:14px; flex-wrap:wrap;">
                    <button class="btn-primary" style="flex:1; padding:8px; font-size:13px; background:#1565c0;" onclick="downloadPDF('${p.id}', 'paper')">
                        <i class="fas fa-file-pdf"></i> PDF / પ્રિન્ટ પેપર
                    </button>
                    <button class="btn-secondary" style="flex:1; padding:8px; font-size:13px; background:#2e7d32; color:#fff; border:none; border-radius:4px; cursor:pointer;" onclick="downloadPDF('${p.id}', 'solution')">
                        <i class="fas fa-check-circle"></i> PDF Answer Key
                    </button>
                </div>

                <div style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap;">
                    <button class="btn-primary" style="flex:1; padding:8px; font-size:13px; background:#0277bd;" onclick="downloadWord('${p.id}', 'paper')">
                        <i class="fas fa-file-word"></i> Word (.doc) પેપર
                    </button>
                    <button class="btn-secondary" style="flex:1; padding:8px; font-size:13px; background:#00695c; color:#fff; border:none; border-radius:4px; cursor:pointer;" onclick="downloadWord('${p.id}', 'solution')">
                        <i class="fas fa-file-word"></i> Word Answer Key
                    </button>
                </div>
            `;
            paperGrid.appendChild(card);
        });
    }

    window.deletePaper = function(id) {
        if(confirm("શું તમે ખરેખર આ પેપર ડિલીટ કરવા માંગો છો?")) {
            let p = JSON.parse(localStorage.getItem('gyanVruksh_papers')) || [];
            localStorage.setItem('gyanVruksh_papers', JSON.stringify(p.filter(x => x.id !== id)));
            renderPapers();
        }
    };

    renderPapers();
});