import { Badge, Card, Col, Row } from 'react-bootstrap';

function NetworkMap({ network, showLines }) {
  const interchangeStations = network.stations.filter((station) => {
    const lineIds = new Set();

    for (const segment of network.segments) {
      if (
        segment.station1Id === station.id ||
        segment.station2Id === station.id
      ) {
        lineIds.add(segment.lineId);
      }
    }

    return lineIds.size > 1;
  });

  if (!showLines) {
    return (
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Stations</Card.Title>

          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {network.stations.map((station) => (
              <Badge bg="secondary" key={station.id}>
                {station.name}
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>
    );
  }

  const segmentsByLine = network.lines.map((line) => ({
    ...line,
    segments: network.segments.filter((segment) => segment.lineId === line.id)
  }));

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Underground Network</Card.Title>

        <Row className="mb-3 text-center">
          <Col>
            <strong>{network.stations.length}</strong>
            <br />
            Stations
          </Col>

          <Col>
            <strong>{network.lines.length}</strong>
            <br />
            Lines
          </Col>

          <Col>
            <strong>{interchangeStations.length}</strong>
            <br />
            Interchanges
          </Col>
        </Row>

        <p className="text-muted">
          Interchange stations:{' '}
          {interchangeStations.map((station) => station.name).join(', ')}
        </p>

        <Row xs={2} md={4}>
          {segmentsByLine.map((line) => (
            <Col md={6} key={line.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <Badge bg="secondary" style={{ color: line.color }}>
                      {line.name}
                    </Badge>
                  </Card.Title>

                  <ul className="mb-0">
                    {line.segments.map((segment) => (
                      <li key={segment.id}>
                        {segment.station1Name} ↔ {segment.station2Name}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
}

export default NetworkMap;