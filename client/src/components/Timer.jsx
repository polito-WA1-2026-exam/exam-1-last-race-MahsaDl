import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

function Timer({ initialSeconds, onTimeExpired, stopped }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (stopped) {
      return;
    }

    if (secondsLeft === 0) {
      onTimeExpired();
      return;
    }

    const timerId = setTimeout(() => {
      setSecondsLeft((seconds) => seconds - 1);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [secondsLeft, onTimeExpired, stopped]);

  return (
    <Alert variant={secondsLeft <= 10 ? 'danger' : 'secondary'}>
      Time left: <strong>{secondsLeft}</strong> seconds
    </Alert>
  );
}

export default Timer;