const _prevTrigger2 = window.triggerStageLogic;
window.triggerStageLogic = function(stageIndex) {
    _prevTrigger2(stageIndex);
    if (stageIndex === 2) initStage2();
    if (stageIndex === 3) initStage3();
};

function initStage2() {
    const list = document.getElementById('prediction-list');
    list.innerHTML = '';
    
    let delay = 0;
    window.simState.bins.forEach(bin => {
        setTimeout(() => {
            const row = document.createElement('div');
            row.className = 'data-row';
            
            const isCrit = bin.nextFill >= 80;
            const critMarker = isCrit ? ' <span class="crit">⚠</span>' : '';
            
            row.innerHTML = `
                <span>${bin.id}</span>
                <span>${bin.fill}% &nbsp;&rarr;&nbsp; <span class="${isCrit ? 'crit' : 'safe'}">${bin.nextFill}%</span>${critMarker}</span>
            `;
            list.appendChild(row);
        }, delay);
        delay += 400;
    });
}

function initStage3() {
    const list = document.getElementById('critical-bins-list');
    list.innerHTML = '<h3>CRITICAL THRESHOLD: 80%</h3>';
    
    let delay = 0;
    window.simState.bins.forEach(bin => {
        if (bin.nextFill >= 80) {
            setTimeout(() => {
                const block = document.createElement('div');
                block.style.background = 'rgba(239, 68, 68, 0.1)';
                block.style.border = '1px solid var(--danger)';
                block.style.padding = '15px';
                block.style.marginBottom = '15px';
                block.style.borderRadius = '6px';
                
                block.innerHTML = `
                    <div style="font-weight:bold; font-size:20px; color:var(--danger); margin-bottom:10px;">${bin.id}</div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>Current:</span> <span>${bin.fill}%</span></div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>Predicted:</span> <span class="crit">${bin.nextFill}%</span></div>
                    <div style="display:flex; justify-content:space-between; font-weight:bold; color:var(--warn); margin-top:10px;"><span>Risk:</span> <span>CRITICAL ⚠</span></div>
                `;
                list.appendChild(block);
            }, delay);
            delay += 600;
        }
    });
}
