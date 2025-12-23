import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, RefreshCcw } from 'lucide-react';
import { getAllAnalysis, searchAnalysis, deleteAnalysis, API_BASE_URL } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import SearchBar from '@/components/search/SearchBar';
import MedicalRecordCard, { MedicalRecordData } from '@/components/records/MedicalRecordCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const AnalysisListPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [records, setRecords] = useState<MedicalRecordData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (patientId) {
      fetchRecords();
    }
  }, [patientId]);

  const fetchRecords = async (keyword?: string, date?: string | null) => {
    if (!patientId) return;

    setIsLoading(true);
    setIsSearching(!!(keyword?.trim() || date));

    try {
      let data;
      if (keyword || date) {
        data = await searchAnalysis(patientId, keyword, date || undefined);
      } else {
        data = await getAllAnalysis(patientId);
      }

      const transformed = Array.isArray(data) ? data.map((item: any) => ({
        id: item.id,
        title: item.name || 'تحليل غير مسمى',
        doctorName: item.doctorName || 'طبيب غير مسجل',
        specialty: item.doctorSpecialty || item.specialtyName || 'تخصص غير محدد',
        notes: item.note || '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        // معالجة الروابط للتأكد من أنها تفتح بشكل صحيح
        images: Array.isArray(item.fileUrls)
            ? item.fileUrls.map((url: string) =>
                url.startsWith('http') ? url : `${API_BASE_URL}/uploads/${url}`
            )
            : [],
      })) : [];

      setRecords(transformed);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      toast.error('فشل في تحميل قائمة التحاليل');
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (keyword: string, date: string | null) => {
    fetchRecords(keyword, date);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التحليل نهائياً؟')) return;
    try {
      await deleteAnalysis(id);
      toast.success('تم حذف التحليل بنجاح');
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      toast.error('حدث خطأ أثناء محاولة الحذف');
    }
  };

  return (
      <div className="min-h-screen bg-background pb-8 font-cairo" dir="rtl">
        <PageHeader title="التحاليل الطبية" />

        <SearchBar
            onSearch={handleSearch}
            placeholder="ابحث باسم التحليل أو اسم الطبيب..."
        />

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner message="جاري التحميل..." />
            </div>
        ) : (
            <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
              {records.length === 0 ? (
                  <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border mx-2 shadow-sm animate-in fade-in zoom-in duration-500">
                    <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="text-primary/40 w-10 h-10" />
                    </div>

                    <h3 className="font-black text-slate-800 text-xl mb-2">
                      {isSearching ? "لا توجد نتائج بحث" : "لا توجد سجلات"}
                    </h3>

                    <p className="text-slate-500 mb-8 px-6 text-sm leading-relaxed">
                      {isSearching
                          ? "لم نجد أي تحاليل تطابق ما تبحث عنه، حاول تغيير كلمات البحث أو التأكد من التاريخ."
                          : "سجلك الطبي فارغ حالياً. ابدأ بإضافة نتائج التحاليل لتتمكن من متابعة حالتك الصحية بسهولة."}
                    </p>

                    {isSearching ? (
                        <Button
                            variant="outline"
                            onClick={() => fetchRecords()}
                            className="rounded-2xl border-primary text-primary hover:bg-primary/5 px-8 h-12 font-bold transition-all active:scale-95"
                        >
                          <RefreshCcw className="w-4 h-4 ml-2" />
                          عرض كل التحاليل
                        </Button>
                    ) : (
                        <Button
                            onClick={() => navigate(`/${patientId}/analysis/add`)}
                            className="rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-8 h-12 font-bold transition-all active:scale-95"
                        >
                          <Plus className="w-5 h-5 ml-2" />
                          إضافة أول تحليل
                        </Button>
                    )}
                  </div>
              ) : (
                  <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    {records.map((record) => (
                        <MedicalRecordCard
                            key={record.id}
                            record={record}
                            onEdit={() => navigate(`/${patientId}/analysis/${record.id}/edit`)}
                            onDelete={() => handleDelete(record.id)}
                        />
                    ))}
                  </div>
              )
              }
            </div>
        )}
      </div>
  );
};

export default AnalysisListPage;
