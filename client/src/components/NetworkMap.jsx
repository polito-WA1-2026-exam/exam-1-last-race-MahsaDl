import { Card, Badge } from 'react-bootstrap';

function NetworkMap({ network }) {
  const segmentsByLine = network.lines.map((line) => ({
    ...line,
    segments: network.segments.filter((segment) => segment.lineId === line.id)
  }));

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Underground Network</Card.Title>

        {segmentsByLine.map((line) => (
          <div key={line.id} className="mb-3">
            <h5>
              <Badge bg="secondary" style={{ color: line.color }}>
                {line.name}
              </Badge>
            </h5>

            <ul className="mb-0">
              {line.segments.map((segment) => (
                <li key={segment.id}>
                  {segment.station1Name} ↔ {segment.station2Name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
}

export default NetworkMap;