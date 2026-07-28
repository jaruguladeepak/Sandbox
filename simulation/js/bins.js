window.triggerStageLogic = window.triggerStageLogic || function() {};
const _originalTrigger = window.triggerStageLogic;

window.triggerStageLogic = function(stageIndex) {
    _originalTrigger(stageIndex);
    if (stageIndex === 1) {
        initStage1();
    }
};

function initStage1() {
    const mapView = document.getElementById('map-view-1');
    const eventStream = document.getElementById('iot-events');
    
    if (mapView.innerHTML.trim() === "") {
        // Draw bins
        window.simState.bins.forEach(bin => {
            const marker = document.createElement('div');
            marker.className = 'bin-marker';
            marker.style.left = bin.x + '%';
            marker.style.top = bin.y + '%';
            marker.id = 'marker-1-' + bin.id;
            marker.innerHTML = `${bin.id}<br><span id="fill-1-${bin.id}">0%</span>`;
            mapView.appendChild(marker);
        });
    }

    // Animate IoT readings
    eventStream.innerHTML = '<h3>Sensor Stream</h3>';
    
    let delay = 0;
    window.simState.bins.forEach((bin, idx) => {
        setTimeout(() => {
            // Update marker
            const fillSpan = document.getElementById(`fill-1-${bin.id}`);
            const marker = document.getElementById(`marker-1-${bin.id}`);
            if (fillSpan) fillSpan.innerText = bin.fill + '%';
            
            if (bin.fill < 50) marker.className = 'bin-marker safe';
            else if (bin.fill < 80) marker.className = 'bin-marker warn';
            else marker.className = 'bin-marker crit';

            // Log event
            const ev = document.createElement('div');
            ev.className = 'event-item';
            ev.innerText = `${bin.id} → Sensor reading received → ${bin.fill}%`;
            eventStream.appendChild(ev);

        }, delay);
        delay += 600;
    });
}
