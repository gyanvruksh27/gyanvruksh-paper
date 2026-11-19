// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle'), sidebar = document.getElementById('sidebar');
    if(menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
        document.addEventListener('click', (e) => { if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) sidebar.classList.remove('active'); });
    }

    const currentLocation = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('href') === currentLocation);
    });

    const statTotalQ = document.getElementById('statTotalQuestions'), statTotalP = document.getElementById('statTotalPapers');
    if(statTotalQ) statTotalQ.innerText = (JSON.parse(localStorage.getItem('gyanVruksh_questions')) || []).length;
    if(statTotalP) statTotalP.innerText = (JSON.parse(localStorage.getItem('gyanVruksh_papers')) || []).length;
});
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW failed')));

// ગ્લોબલ ફંક્શન: ધોરણ મુજબ વિષયો લાવવા
window.getSubjectsByStandard = function(std) {
    if(std === '9' || std === '10') return ["ગણિત", "વિજ્ઞાન", "સામાજિક વિજ્ઞાન", "ગુજરાતી", "हिंदी", "ENGLISH", "संस्कृत", "કમ્પ્યુટર", "યોગ સ્વાસ્થ્ય અને શારીરિક શિક્ષણ"];
    if(std === '11 (Science)' || std === '12 (Science)') return ["ગણિત", "જીવ વિજ્ઞાન", "રસાયણ વિજ્ઞાન", "ભૌતિક વિજ્ઞાન", "કમ્પ્યુટર", "English", "संस्कृत", "JEE", "NEET"];
    if(std === '11 (Arts)' || std === '12 (Arts)') return ["ઇતિહાસ", "ભૂગોળ", "મનો વિજ્ઞાન", "તત્વ જ્ઞાન", "સમાજશાસ્ત્ર", "રાજ્યશાસ્ત્ર", "हिंदी", "संस्कृत", "અર્થશાસ્ત્ર", "ગુજરાતી", "English", "કમ્પ્યુટર"];
    if(std === '11 (Commerce)' || std === '12 (Commerce)') return ["નામાનાં મૂળતત્ત્વો", "વાણિજ્ય વ્યવસ્થા અને સંચાલન", "અર્થશાસ્ત્ર", "આંકડાશાસ્ત્ર", "ENGLISH", "ગુજરાતી", "S.P. અને C.C.", "કમ્પ્યુટર", "યોગ સ્વાસ્થ્ય અને શારીરિક શિક્ષણ", "CHEMICAL TECHNOLOGY"];
    return [];
}