import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface Props {
  durationSec: number;
  onExpire: () => void;
}

const TimerBar = ({ durationSec, onExpire }: Props) => {
  const [remaining, setRemaining] = useState(durationSec);

  useEffect(() => {
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          onExpire();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const warn = remaining < 300;

  return (
    <div className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-mono font-semibold ${warn ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
      <Clock className="h-4 w-4" />
      {h > 0 ? `${h}:${String(m).padStart(2, '0')}` : m}:{String(s).padStart(2, '0')}
    </div>
  );
};

export default TimerBar;
