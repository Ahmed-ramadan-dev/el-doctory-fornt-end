import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, RefreshCcw } from 'lucide-react';
import { getAllPrescriptions, searchPrescriptions, deletePrescription, API_BASE_URL } from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import SearchBar from '@/components/search/SearchBar';
import MedicalRecordCard from '@/components/records/MedicalRecordCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const PrescriptionsListPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => { if (patientId) fetchRecords(); }, [patientId]);

  const fetchRecords = async (keyword?: string, date?: string | null) => {
    setIsLoading(true);
    setIsSearching(!!(keyword?.trim() || date));
    try {
      const data = (keyword || date) ? await searchPrescriptions(patientId!, keyword, date || undefined) : await getAllPrescriptions(patientId!);
      const transformed = Array.isArray(data) ? data.map((item: any) => ({
        id: item.id,
        title: item.name || 'روشتة بدون عنوان',
        doctorName: item.doctorName || 'طبيب غير مسجل',
        specialty: item.doctorSpecialty || item.specialtyName || 'تخصص غير محدد',
        notes: item.note || '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        images: Array.isArray(item.fileUrls) ? item.fileUrls.map((url: string) => url.startsWith('http') ? url : `${API_BASE_URL}/uploads/${url}`) : [],
      })) : [];
      setRecords(transformed);
    } catch (error) { toast.error('فشل في تحميل الروشتات'); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الروشتة؟')) return;
    try {
      await deletePrescription(id);
      toast.success('تم حذف الروشتة بنجاح');
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) { toast.error('حدث خطأ أثناء الحذف'); }
  };

  return (
      <div className="min-h-screen bg-background pb-10 font-cairo" dir="rtl">
        <PageHeader title="الروشتات الطبية" />
        <SearchBar onSearch={(k, d) => fetchRecords(k, d)} placeholder="ابحث باسم الروشتة أو الطبيب..." />

        {isLoading ? (
            <div className="flex justify-center items-center h-64"><LoadingSpinner message="جاري التحميل..." /></div>
        ) : (
            <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
              {records.length === 0 ? (
                  <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border shadow-sm animate-in zoom-in duration-500 mx-2">
                    <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="text-primary/40 w-10 h-10" />
                    </div>
                    <h3 className="font-black text-slate-800 text-xl mb-2">{isSearching ? "لا توجد نتائج" : "لا توجد روشتات"}</h3>
                    <p className="text-slate-500 mb-8 px-6 text-sm">{isSearching ? "جرب كلمات بحث مختلفة" : "سجلك فارغ، ابدأ بإضافة أول روشتة طبية."}</p>
                    {isSearching ? (
                        <Button variant="outline" onClick={() => fetchRecords()} className="rounded-2xl border-primary text-primary px-8 h-12 font-bold"><RefreshCcw className="w-4 h-4 ml-2" /> عرض الكل</Button>
                    ) : (
                        <Button onClick={() => navigate(`/${patientId}/prescriptions/add`)} className="rounded-2xl bg-primary text-white shadow-lg px-8 h-12 font-bold"><Plus className="w-5 h-5 ml-2" /> إضافة أول روشتة</Button>
                    )}
                  </div>
              ) : (
                  <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    {records.map((record) => (
                        <MedicalRecordCard
                            key={record.id}
                            record={record}
                            onEdit={() => navigate(`/${patientId}/prescriptions/${record.id}/edit`)}
                            onDelete={() => handleDelete(record.id)}
                        />
                    ))}
                  </div>
              )}
            </div>
        )}
      </div>
  );
};

export default PrescriptionsListPage;
