import { UserX } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <UserX className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-6xl font-bold text-foreground mb-2 font-cairo">404</h1>
        <p className="text-xl text-muted-foreground font-cairo mb-8">
          المريض غير موجود
        </p>
        <p className="text-muted-foreground font-cairo mb-8">
          عذراً، لم نتمكن من العثور على بيانات المريض المطلوب
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-cairo font-semibold hover:bg-primary/90 transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
