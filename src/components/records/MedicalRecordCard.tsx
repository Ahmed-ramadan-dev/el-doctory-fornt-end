import { useState } from 'react';
import { Calendar, User, Trash2, Pencil, X, ZoomIn, RefreshCw, Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export interface MedicalRecordData {
  id: number;
  title: string;
  doctorName: string;
  specialty: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  images?: string[];
}

interface MedicalRecordCardProps {
  record: MedicalRecordData;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const MedicalRecordCard = ({ record, onEdit, onDelete }: MedicalRecordCardProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'yyyy/MM/dd', { locale: ar });
    } catch {
      return dateStr;
    }
  };

  const hasBeenUpdated = () => {
    if (!record.updatedAt || !record.createdAt) return false;
    const created = new Date(record.createdAt).getTime();
    const updated = new Date(record.updatedAt).getTime();
    return Math.abs(updated - created) > 10000;
  };

  // ✅ دالة التحميل الإجباري
  const handleDownload = async (imgUrl: string) => {
    try {
      setIsDownloading(true);
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // تسمية الملف باسم التحليل
      link.download = `تحليل_${record.title || 'طبي'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      // حل احتياطي في حال فشل التحميل البرمجي
      window.open(imgUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4 animate-fade-in relative transition-all hover:border-primary/30">

        {/* Header with actions */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <h3 className="text-lg font-bold text-foreground font-cairo flex-1 leading-tight text-right">
            {record.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => onEdit(record.id)} className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(record.id)} className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-sm">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-col gap-2.5 mb-4">
          <div className="flex flex-wrap items-center gap-2 text-[13px] justify-start" dir="rtl">
            <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-lg text-muted-foreground border border-border/40">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span className="font-cairo text-xs font-bold">أُضيف في: {formatDate(record.createdAt)}</span>
            </div>
            {hasBeenUpdated() && (
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-100 shadow-sm animate-in zoom-in duration-300">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                  <span className="font-cairo font-semibold text-xs">تعديل: {formatDate(record.updatedAt)}</span>
                </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-foreground/80 bg-accent/20 p-2 rounded-xl" dir="rtl">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="font-cairo font-medium">
              د. {record.doctorName} • <span className="text-primary font-bold">{record.specialty}</span>
            </span>
          </div>
        </div>

        {/* Notes */}
        {record.notes && (
            <div className="bg-primary/5 rounded-xl p-3 mb-4 border-r-4 border-primary/40 text-right">
              <p className="text-sm text-foreground font-cairo leading-relaxed">
                <span className="font-bold text-primary/80 ml-1">الملاحظات:</span>
                {record.notes}
              </p>
            </div>
        )}

        {/* Images Section */}
        {record.images && record.images.length > 0 && (
            <div className="border-t border-border/30 pt-3 text-right">
              <p className="text-sm font-bold text-foreground font-cairo mb-2">مرفقات التحليل</p>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide" dir="rtl">
                {record.images.map((img, idx) => (
                    <div key={idx} className="relative group cursor-pointer flex-shrink-0" onClick={() => { setSelectedImage(img); setIsZoomed(false); }}>
                      <img src={img} alt={`صورة ${idx + 1}`} className="w-24 h-24 object-cover rounded-xl border border-border shadow-sm transition-all group-hover:scale-[0.98]" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <ZoomIn className="text-white w-6 h-6" />
                      </div>
                    </div>
                ))}
              </div>
            </div>
        )}

        {/* Full Screen Image Modal */}
        {selectedImage && (
            <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300">

              {/* Top Controls */}
              <div className="absolute top-0 w-full p-4 flex justify-between items-center z-[1001]">
                <button onClick={() => setSelectedImage(null)} className="text-white bg-white/10 p-2 rounded-full hover:bg-destructive transition-all">
                  <X size={28} />
                </button>

                <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(selectedImage);
                    }}
                    disabled={isDownloading}
                    className="text-white bg-primary flex items-center gap-2 px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all font-cairo text-sm font-bold shadow-lg disabled:opacity-50"
                >
                  {isDownloading ? (
                      <Loader2 size={20} className="animate-spin" />
                  ) : (
                      <Download size={20} />
                  )}
                  {isDownloading ? 'جاري الحفظ...' : 'تحميل الصورة'}
                </button>
              </div>

              {/* Image Container */}
              <div
                  className={`w-full h-full flex items-center justify-center overflow-auto p-4 transition-all ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                  onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                    src={selectedImage}
                    alt="معاينة"
                    className={`transition-transform duration-300 rounded-lg shadow-2xl ${isZoomed ? 'scale-[1.8] origin-center' : 'max-w-full max-h-[85vh] object-contain'}`}
                    onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="absolute bottom-6 bg-white/5 px-4 py-2 rounded-full pointer-events-none">
                <p className="text-white/40 font-cairo text-xs tracking-wide">اضغط على الصورة للتكبير / التصغير</p>
              </div>
            </div>
        )}
      </div>
  );
};

export default MedicalRecordCard;
