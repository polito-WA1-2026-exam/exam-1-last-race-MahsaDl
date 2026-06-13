function NetworkMap({ network, showLines, onStartPlanning }) {

  if (!showLines) {
    return (
      <section className="game-map-card">
        <h2>Stations</h2>

        <div className="planning-stations">
          {network.stations.map((station) => (
            <span key={station.id}>{station.name}</span>
          ))}
        </div>
      </section>
    );
  }

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


  return (
    <div className="setup-layout">
      <div className="network-panel">

        <div className="network-header">
          <h3>NETWORK MAP</h3>
        </div>

        <svg
          className="network-svg"
          viewBox="0 0 1000 800"
        >
          {/* RED */}
          <line x1="120" y1="140" x2="380" y2="140" stroke="#ff6b6b" strokeWidth="10" strokeLinecap="round" />
          <line x1="380" y1="140" x2="640" y2="140" stroke="#ff6b6b" strokeWidth="10" strokeLinecap="round" />
          <line x1="640" y1="140" x2="900" y2="140" stroke="#ff6b6b" strokeWidth="10" strokeLinecap="round" />

          {/* BLUE */}
          <line x1="120" y1="140" x2="120" y2="340" stroke="#4da3ff" strokeWidth="10" strokeLinecap="round" />
          <line x1="120" y1="340" x2="380" y2="340" stroke="#4da3ff" strokeWidth="10" strokeLinecap="round" />
          <line x1="380" y1="340" x2="380" y2="540" stroke="#4da3ff" strokeWidth="10" strokeLinecap="round" />

          {/* GREEN */}
          <line x1="380" y1="140" x2="640" y2="340" stroke="#2ecc71" strokeWidth="10" strokeLinecap="round" />
          <line x1="640" y1="340" x2="640" y2="540" stroke="#2ecc71" strokeWidth="10" strokeLinecap="round" />
          <line x1="640" y1="540" x2="900" y2="540" stroke="#2ecc71" strokeWidth="10" strokeLinecap="round" />

          {/* YELLOW */}
          <line x1="900" y1="140" x2="900" y2="340" stroke="#f1c40f" strokeWidth="10" strokeLinecap="round" />
          <line x1="900" y1="340" x2="640" y2="540" stroke="#f1c40f" strokeWidth="10" strokeLinecap="round" />
          <line x1="640" y1="540" x2="640" y2="720" stroke="#f1c40f" strokeWidth="10" strokeLinecap="round" />

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
                background: {
                  red: '#ff6b6b',
                  blue: '#4da3ff',
                  green: '#2ecc71',
                  gold: '#f1c40f'
                }[line.color]
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