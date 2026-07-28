const _prevTrigger4 = window.triggerStageLogic;
window.triggerStageLogic = function(stageIndex) {
    _prevTrigger4(stageIndex);
    if (stageIndex === 5) initStage5();
};

function initStage5() {
    const mapView = document.getElementById('map-view-5');
    const svg = document.getElementById('route-svg');
    const info = document.getElementById('truck-routes');
    
    // Clear previous if any
    svg.innerHTML = '';
    info.innerHTML = '';
    const oldMarkers = mapView.querySelectorAll('.bin-marker');
    oldMarkers.forEach(m => m.remove());
    
    const depot = { x: 50, y: 80, id: 'DEPOT' };
    
    // Draw depot
    const depotMarker = document.createElement('div');
    depotMarker.className = 'bin-marker safe';
    depotMarker.style.left = depot.x + '%';
    depotMarker.style.top = depot.y + '%';
    depotMarker.style.background = 'var(--accent)';
    depotMarker.style.color = '#000';
    depotMarker.innerHTML = '🚛 DEPOT';
    mapView.appendChild(depotMarker);

    // Draw bins again
    window.simState.bins.forEach(bin => {
        const marker = document.createElement('div');
        marker.className = 'bin-marker';
        marker.style.left = bin.x + '%';
        marker.style.top = bin.y + '%';
        if (bin.nextFill >= 80) marker.classList.add('crit');
        else marker.classList.add('safe');
        marker.innerHTML = bin.id;
        mapView.appendChild(marker);
    });

    // Mock Route logic: Depot -> BIN-04 -> BIN-02 -> Depot
    const routeBins = window.simState.bins.filter(b => b.nextFill >= 80); // Just the critical ones
    
    let pathCoordinates = [depot, ...routeBins, depot];
    
    // Draw SVG Lines
    let delay = 1000;
    for (let i = 0; i < pathCoordinates.length - 1; i++) {
        setTimeout(() => {
            const start = pathCoordinates[i];
            const end = pathCoordinates[i+1];
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', start.x + '%');
            line.setAttribute('y1', start.y + '%');
            line.setAttribute('x2', end.x + '%');
            line.setAttribute('y2', end.y + '%');
            
            // Animation trick
            line.style.strokeDasharray = "500";
            line.style.strokeDashoffset = "500";
            svg.appendChild(line);
            
            // Trigger reflow to animate
            line.getBoundingClientRect();
            line.style.strokeDashoffset = "0";
            
        }, delay);
        delay += 600;
    }
    
    setTimeout(() => {
        info.innerHTML = `
            <div class="truck-route">
                <h4>TRUCK 01</h4>
                <p>Path: Depot &rarr; BIN-04 &rarr; BIN-02 &rarr; Depot</p>
                <p>Load: 4,720 / 5,000 L</p>
                <p>Distance: 21.3 km</p>
            </div>
        `;
    }, delay + 500);
}
