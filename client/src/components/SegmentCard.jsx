import { Button, Card } from 'react-bootstrap';

function SegmentCard({ segment, selected, onToggle }) {
  return (
    <Card className="mb-2">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <strong>{segment.station1Name}</strong>
          {' ↔ '}
          <strong>{segment.station2Name}</strong>
        </div>

        <Button
          variant={selected ? 'danger' : 'primary'}
          onClick={() => onToggle(segment.id)}
        >
          {selected ? 'Remove' : 'Add'}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default SegmentCard;