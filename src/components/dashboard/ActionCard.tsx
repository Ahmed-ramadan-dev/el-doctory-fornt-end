import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActionCardProps {
    title: string;
    icon: LucideIcon;
    to: string;
    variant?: 'view' | 'add';
    delay?: number;
}

const ActionCard = ({
                        title,
                        icon: Icon,
                        to,
                        variant = 'view',
                        delay = 0,
                    }: ActionCardProps) => {
    const isAdd = variant === 'add';

    return (
        <Link
            to={to}
            style={{ animationDelay: `${delay}ms` }}
            className={`
        group relative overflow-hidden
        flex flex-col items-center justify-center gap-2
        min-h-[150px] p-6 rounded-3xl
        bg-background/80 backdrop-blur
        border border-border/60
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl
        hover:border-primary/40
        medical-card-action
        ${isAdd ? 'medical-card-add' : ''}
      `}
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
        bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />

            {/* Icon */}
            <div
                className={`
          relative z-10
          w-14 h-14 rounded-2xl
          flex items-center justify-center
          transition-all duration-300
          group-hover:scale-110 group-hover:rotate-1
          ${isAdd
                    ? 'bg-gradient-to-br from-accent-foreground/20 to-accent-foreground/5 text-accent-foreground shadow-md'
                    : 'bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-md'
                }
        `}
            >
                <Icon className="w-7 h-7" strokeWidth={1.6} />
            </div>

            {/* Title */}
            <span
                className={`
          relative z-10
          text-[15px] font-semibold font-cairo
          text-center leading-snug
          transition-colors duration-300
          ${isAdd
                    ? 'text-accent-foreground'
                    : 'text-foreground group-hover:text-primary'
                }
        `}
            >
        {title}
      </span>
        </Link>
    );
};

export default ActionCard;
