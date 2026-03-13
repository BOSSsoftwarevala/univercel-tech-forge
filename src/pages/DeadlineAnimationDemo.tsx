import { useState } from 'react';
import DeadlineReaperAnimation, { DeadlineStage } from '@/components/animations/DeadlineReaperAnimation';

const stages: { stage: DeadlineStage; label: string; desc: string; hours: number }[] = [
  { stage: 'calm', label: 'Calm', desc: 'Deadline > 24h away', hours: 48 },
  { stage: 'rush', label: 'Rush', desc: 'Deadline < 6h away', hours: 4 },
  { stage: 'reaper', label: 'Reaper', desc: 'Deadline < 1h away', hours: 0.5 },
  { stage: 'overdue', label: 'Overdue', desc: 'Deadline passed!', hours: -2 },
];

export default function DeadlineAnimationDemo() {
  const [activeStage, setActiveStage] = useState<DeadlineStage>('calm');

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 p-6">
      <h1 className="text-2xl font-bold text-foreground">Deadline Warning Animation</h1>
      <p className="text-muted-foreground text-sm">Click a stage to preview</p>

      <DeadlineReaperAnimation stage={activeStage} width={460} height={340} />

      <div className="flex gap-3 flex-wrap justify-center">
        {stages.map(s => (
          <button
            key={s.stage}
            onClick={() => setActiveStage(s.stage)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border
              ${activeStage === s.stage 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-secondary text-secondary-foreground border-border hover:bg-accent'
              }`}
          >
            <div>{s.label}</div>
            <div className="text-xs opacity-70">{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
