document.addEventListener('DOMContentLoaded', () => {
    const stages = document.querySelectorAll('.stage-view');
    const btnGuided = document.getElementById('btn-guided');
    const btnAuto = document.getElementById('btn-auto');
    const btnStart = document.getElementById('btn-start');
    const btnRestart = document.getElementById('btn-restart');
    const nextButtons = document.querySelectorAll('.btn-next');
    
    let currentStage = 0;
    let autoMode = false;
    let autoTimer = null;

    function showStage(index) {
        stages.forEach((stage, i) => {
            if (i === index) {
                stage.classList.add('active');
            } else {
                stage.classList.remove('active');
            }
        });
        currentStage = index;
        
        // Trigger specific stage logic if exists
        if (window.triggerStageLogic) {
            window.triggerStageLogic(currentStage);
        }

        if (autoMode) {
            scheduleNext();
        }
    }

    function scheduleNext() {
        clearTimeout(autoTimer);
        let delay = 3000;
        if (currentStage === 2 || currentStage === 4) delay = 4000; // ML and Priority take longer
        if (currentStage === 5) delay = 5000; // Routing takes longer

        if (currentStage > 0 && currentStage < 6) {
            autoTimer = setTimeout(() => {
                showStage(currentStage + 1);
            }, delay);
        }
    }

    btnGuided.addEventListener('click', () => {
        autoMode = false;
        btnGuided.classList.add('active');
        btnAuto.classList.remove('active');
        clearTimeout(autoTimer);
    });

    btnAuto.addEventListener('click', () => {
        autoMode = true;
        btnAuto.classList.add('active');
        btnGuided.classList.remove('active');
        if (currentStage > 0 && currentStage < 6) scheduleNext();
    });

    btnStart.addEventListener('click', () => {
        showStage(1);
    });

    btnRestart.addEventListener('click', () => {
        clearTimeout(autoTimer);
        showStage(0);
    });

    nextButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nextIdx = parseInt(e.target.getAttribute('data-next'));
            showStage(nextIdx);
        });
    });

    // Make state available to other scripts
    window.simState = {
        bins: [
            { id: 'BIN-01', x: 20, y: 30, fill: 54, nextFill: 67, area: 80 },
            { id: 'BIN-02', x: 70, y: 20, fill: 71, nextFill: 86, area: 90 },
            { id: 'BIN-03', x: 80, y: 70, fill: 32, nextFill: 40, area: 40 },
            { id: 'BIN-04', x: 30, y: 80, fill: 76, nextFill: 94, area: 80 },
            { id: 'BIN-05', x: 50, y: 50, fill: 48, nextFill: 58, area: 60 }
        ]
    };
});
