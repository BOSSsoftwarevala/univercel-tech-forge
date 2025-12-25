import { cn } from '@/lib/utils';

interface MasterThroneIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'ghost';
  className?: string;
  showTooltip?: boolean;
}

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

const MasterThroneIcon = ({ 
  size = 'sm', 
  variant = 'default',
  className,
  showTooltip = false 
}: MasterThroneIconProps) => {
  const dimension = sizeMap[size];
  
  return (
    <div 
      className={cn(
        'relative inline-flex items-center justify-center group',
        className
      )}
      title={showTooltip ? (variant === 'ghost' ? 'Ghost Authority Active' : 'Master Admin') : undefined}
    >
      {/* Ghost mode shadow aura */}
      {variant === 'ghost' && (
        <div 
          className="absolute inset-0 rounded-full bg-amber-500/20 blur-md animate-pulse"
          style={{ width: dimension + 8, height: dimension + 8, margin: -4 }}
        />
      )}
      
      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-400/0 to-amber-600/0 
                   group-hover:from-amber-400/20 group-hover:to-amber-600/10 
                   transition-all duration-500 blur-sm"
        style={{ width: dimension, height: dimension }}
      />
      
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'relative z-10 transition-all duration-300',
          'group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]',
          variant === 'ghost' && 'drop-shadow-[0_0_6px_rgba(245,158,11,0.3)]'
        )}
      >
        {/* Crown on top - 3 pointed subtle crown */}
        <path
          d="M24 4L28 10H20L24 4Z"
          className="fill-amber-500 dark:fill-amber-400"
        />
        <path
          d="M18 6L21 10H15L18 6Z"
          className="fill-amber-500 dark:fill-amber-400"
        />
        <path
          d="M30 6L33 10H27L30 6Z"
          className="fill-amber-500 dark:fill-amber-400"
        />
        
        {/* Crown band */}
        <rect
          x="14"
          y="10"
          width="20"
          height="3"
          rx="1"
          className="fill-amber-600 dark:fill-amber-500"
        />
        
        {/* Throne backrest - tall and symmetrical */}
        <path
          d="M14 13H34V28C34 29.1046 33.1046 30 32 30H16C14.8954 30 14 29.1046 14 28V13Z"
          className="fill-zinc-800 dark:fill-zinc-200 dark:stroke-amber-500/50"
          strokeWidth="0.5"
        />
        
        {/* Inner backrest detail */}
        <rect
          x="17"
          y="16"
          width="14"
          height="11"
          rx="1"
          className="fill-zinc-700 dark:fill-zinc-300"
        />
        
        {/* Throne armrests */}
        <rect
          x="10"
          y="26"
          width="6"
          height="4"
          rx="1"
          className="fill-zinc-800 dark:fill-zinc-200"
        />
        <rect
          x="32"
          y="26"
          width="6"
          height="4"
          rx="1"
          className="fill-zinc-800 dark:fill-zinc-200"
        />
        
        {/* Armrest supports */}
        <rect
          x="10"
          y="30"
          width="3"
          height="8"
          rx="1"
          className="fill-zinc-700 dark:fill-zinc-300"
        />
        <rect
          x="35"
          y="30"
          width="3"
          height="8"
          rx="1"
          className="fill-zinc-700 dark:fill-zinc-300"
        />
        
        {/* Seat */}
        <rect
          x="14"
          y="30"
          width="20"
          height="5"
          rx="1"
          className="fill-zinc-700 dark:fill-zinc-300"
        />
        
        {/* Throne base - solid foundation */}
        <path
          d="M12 35H36V38C36 39.1046 35.1046 40 34 40H14C12.8954 40 12 39.1046 12 38V35Z"
          className="fill-zinc-800 dark:fill-zinc-200"
        />
        
        {/* Base pedestal */}
        <rect
          x="16"
          y="40"
          width="16"
          height="3"
          rx="1"
          className="fill-zinc-700 dark:fill-zinc-300"
        />
        
        {/* Ground base - widest part */}
        <rect
          x="14"
          y="43"
          width="20"
          height="2"
          rx="1"
          className="fill-zinc-800 dark:fill-zinc-200"
        />
        
        {/* Gold accent on throne center */}
        <circle
          cx="24"
          cy="23"
          r="2.5"
          className="fill-amber-500 dark:fill-amber-400"
        />
      </svg>
    </div>
  );
};

export default MasterThroneIcon;
