import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

const PageHeader = ({ title, showBack = true }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <h1 className="text-xl font-bold text-foreground font-cairo">{title}</h1>
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default PageHeader;
