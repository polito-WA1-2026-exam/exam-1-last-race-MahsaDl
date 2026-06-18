function NetworkMap({
  network,
  showLines,
  onStartPlanning,
  selectedSegments = [],
  startStationName,
  destinationStationName
}) {
  const stationPos = {
    Centrale: { x: 120, y: 140 },
    'Porta Valeria': { x: 380, y: 140 },
    'Crocevia del Falco': { x: 640, y: 140 },
    'Piazza delle Lanterne': { x: 900, y: 140 },

    'Fontana Oscura': { x: 120, y: 340 },
    'Borgo Sereno': { x: 380, y: 340 },
    'Viale dei Mosaici': { x: 380, y: 540 },

    'Mercato Vecchio': { x: 640, y: 340 },
    'Torre Cinerea': { x: 640, y: 540 },
    "Campo dell'Eco": { x: 900, y: 540 },

    'Porto Sud': { x: 900, y: 340 },
    'Giardino Nord': { x: 640, y: 720 }
  };

  const interchanges = [
    'Centrale',
    'Porta Valeria',
    'Piazza delle Lanterne',
    'Torre Cinerea'
  ];

  const segmentColorByLine = {
    red: '#ff6b6b',
    blue: '#4da3ff',
    green: '#2ecc71',
    gold: '#f1c40f'
  };

  function getStationColor(name) {
    if (['Crocevia del Falco'].includes(name)) return '#ff6b6b';

    if (['Fontana Oscura', 'Borgo Sereno', 'Viale dei Mosaici'].includes(name)) {
      return '#4da3ff';
    }

    if (['Mercato Vecchio', "Campo dell'Eco"].includes(name)) {
      return '#2ecc71';
    }

    if (['Porto Sud', 'Giardino Nord'].includes(name)) {
      return '#f1c40f';
    }

    return 'white';
  }

  function getLineColor(lineId) {
    const line = network.lines.find((item) => item.id === lineId);

    return segmentColorByLine[line?.color] || '#5eead4';
  }

  function renderSegmentLine(segment, className = '') {
    const station1 = stationPos[segment.station1Name];
    const station2 = stationPos[segment.station2Name];

    if (!station1 || !station2) {
      return null;
    }

    return (
      <line
        key={segment.id}
        x1={station1.x}
        y1={station1.y}
        x2={station2.x}
        y2={station2.y}
        stroke={getLineColor(segment.lineId)}
        strokeWidth="10"
        strokeLinecap="round"
        className={className}
      />
    );
  }

  const selectedSegmentObjects = selectedSegments
    .map((id) => network.segments.find((segment) => segment.id === id))
    .filter(Boolean);

  if (!showLines) {
    return (
      <section className="game-map-card">
        <h2>Stations</h2>

        <svg className="network-svg planning-network-svg" viewBox="60 120 940 680">       {selectedSegmentObjects.map((segment) =>
          renderSegmentLine(segment, 'selected-route-line')
        )}

          {Object.entries(stationPos).map(([name, pos]) => {
            const isStart = name === startStationName;
            const isDestination = name === destinationStationName;

            return (
              <g key={name}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isStart || isDestination ? 26 : interchanges.includes(name) ? 22 : 18}
                  className={
                    isStart
                      ? 'station-start'
                      : isDestination
                        ? 'station-destination'
                        : interchanges.includes(name)
                          ? 'station-interchange planning-station-muted'
                          : 'station-node planning-station-muted'
                  }
                  style={
                    !isStart && !isDestination && !interchanges.includes(name)
                      ? { stroke: 'rgba(255, 255, 255, 0.35)' }
                      : {}
                  }
                />

                {(isStart || isDestination) && (
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    className="station-marker-text"
                  >
                    {isStart ? 'START' : 'END'}
                  </text>
                )}

                <text
                  x={pos.x}
                  y={pos.y - 34}
                  textAnchor="middle"
                  className="station-label"
                >
                  {name}
                </text>
              </g>
            );
          })}
        </svg>
      </section>
    );
  }

  return (
    <div className="setup-layout">
      <div className="network-panel">

        <div className="network-header">
          <h3>NETWORK MAP</h3>
        </div>

        <svg className="network-svg" viewBox="0 0 1000 800">
          {network.segments.map((segment) => renderSegmentLine(segment))}

          {Object.entries(stationPos).map(([name, pos]) => (
            <g key={name}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={interchanges.includes(name) ? 22 : 18}
                className={
                  interchanges.includes(name)
                    ? 'station-interchange'
                    : 'station-node'
                }
                style={
                  interchanges.includes(name)
                    ? {}
                    : { stroke: getStationColor(name) }
                }
              />

              <text
                x={pos.x}
                y={pos.y - 32}
                textAnchor="middle"
                className="station-label"
              >
                {name}
              </text>
            </g>
          ))}


        </svg>

      </div>

      <div className="legend-panel">

        <h4>LINES</h4>

        {network.lines.map((line) => (
          <div className="legend-row" key={line.id}>
            <span
              className="legend-color"
              style={{
                background: segmentColorByLine[line.color]
              }}
            />
            {line.name}
          </div>
        ))}

        <hr className="sidebar-divider" />

        <h4>STATIONS</h4>

        <div className="station-legend-row">
          <span className="legend-station-interchange"></span>
          Interchange
        </div>

        <div className="station-legend-row">
          <span className="legend-station-single"></span>
          Single Line Station
        </div>

        <hr className="sidebar-divider" />

        <div className="memorize-box">
          <h5>📋 MEMORIZE THIS</h5>

          <ul>
            <li>Study station connections</li>
            <li>Note interchange stations</li>
            <li>Lines won't show later</li>
            <li>You have 90 seconds</li>
          </ul>
        </div>
        <button
          className="sidebar-ready-button"
          type="button"
          onClick={onStartPlanning}
        >
          I'm Ready →
        </button>

        <p className="network-stats">
          12 Stations • 4 Lines • 4 Interchanges
        </p>
      </div>
    </div>
  );
}

export default NetworkMap;