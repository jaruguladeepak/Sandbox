const _prevTrigger3 = window.triggerStageLogic;
window.triggerStageLogic = function(stageIndex) {
    _prevTrigger3(stageIndex);
    if (stageIndex === 4) initStage4();
};

function initStage4() {
    const anim = document.getElementById('priority-animation');
    anim.innerHTML = '';
    
    // Pick the most critical bin to showcase (BIN-04 is 94%)
    const showcaseBin = window.simState.bins.find(b => b.id === 'BIN-04');
    
    const fillScore = showcaseBin.nextFill;
    const probScore = 91; // Mock probability 
    const areaScore = showcaseBin.area;
    
    const mathSteps = [
        `<div class="priority-line" style="color:var(--accent); font-weight:bold; font-size:28px;">${showcaseBin.id}</div>`,
        `<div class="priority-line">Predicted Fill<br><span style="color:#6B7280">${fillScore}% × 0.60 = ${(fillScore*0.6).toFixed(1)}</span></div>`,
        `<div class="priority-line">Overflow Risk<br><span style="color:#6B7280">${probScore}% × 0.20 = ${(probScore*0.2).toFixed(1)}</span></div>`,
        `<div class="priority-line">Area Priority<br><span style="color:#6B7280">${areaScore}% × 0.20 = ${(areaScore*0.2).toFixed(1)}</span></div>`,
        `<div class="priority-line crit">Priority = ${((fillScore*0.6) + (probScore*0.2) + (areaScore*0.2)).toFixed(1)}%<br>COLLECTION REQUIRED</div>`
    ];
    
    let delay = 500;
    mathSteps.forEach(html => {
        setTimeout(() => {
            anim.innerHTML += html;
        }, delay);
        delay += 800;
    });
}
