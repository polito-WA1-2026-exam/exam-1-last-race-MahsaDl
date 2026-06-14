import { useEffect, useRef, useState } from 'react';

function Timer({ initialSeconds, onTimeExpired, stopped }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (stopped || expiredRef.current) {
      return;
    }

    if (secondsLeft === 0) {
      expiredRef.current = true;
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

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div
      className={secondsLeft <= 10 ? 'timer-display danger' : 'timer-display'}
      style={{
        '--timer-progress': `${(secondsLeft / initialSeconds) * 360}deg`
      }}
    >
      <strong>
        {minutes}:{seconds}
      </strong>
    </div>
  );
}

export default Timer;