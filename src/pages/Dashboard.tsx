import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Activity, Scan, FileText, PlusCircle,
  ClipboardList, User, Stethoscope
} from 'lucide-react';
import { usePatient } from '@/contexts/PatientContext';
import { getPatientInfo, getAllAnalysis, getAllScans, getAllPrescriptions } from '@/lib/api';
import Header from '@/components/layout/Header';
import PatientCard from '@/components/patient/PatientCard';
import ActionCard from '@/components/dashboard/ActionCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ analysis: 0, scans: 0, prescriptions: 0 });
  const [lastVisit, setLastVisit] = useState<{name: string, specialty: string, date: string} | null>(null);

  const {
    setPatientId,
    patientInfo,
    setPatientInfo,
    isLoading,
    setIsLoading,
    setError
  } = usePatient();

  useEffect(() => {
    if (!patientId) {
      navigate('/not-found');
      return;
    }
    setPatientId(patientId);
    fetchData();
  }, [patientId]);

  const fetchData = async () => {
    if (!patientId) return;
    setIsLoading(true);
    try {
      const [pInfo, analysis, scans, prescriptions] = await Promise.all([
        getPatientInfo(patientId),
        getAllAnalysis(patientId),
        getAllScans(patientId),
        getAllPrescriptions(patientId)
      ]);

      setPatientInfo({
        id: patientId,
        name: pInfo.name || 'غير معروف',
        age: pInfo.age || 0,
        phone: pInfo.phoneNumber,
        address: pInfo.address || '',
      });

      setStats({
        analysis: Array.isArray(analysis) ? analysis.length : 0,
        scans: Array.isArray(scans) ? scans.length : 0,
        prescriptions: Array.isArray(prescriptions) ? prescriptions.length : 0
      });

      if (Array.isArray(prescriptions) && prescriptions.length > 0) {
        const sorted = [...prescriptions].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const last = sorted[0];
        setLastVisit({
          name: last.doctorName || 'طبيب غير مسجل',
          specialty: last.doctorSpecialty || last.specialtyName || 'تخصص عام',
          date: last.createdAt
        });
      }

      setError(null);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('تعذر تحديث بعض البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ الحماية الأولى: لو الصفحة بتحمل، اعرض السبينر ومتحاولش ترندر أي كروت
  if (isLoading || !patientInfo) {
    return (
        <div className="min-h-screen bg-medical-pattern flex items-center justify-center font-cairo">
          <LoadingSpinner message="جاري تحميل لوحة التحكم..." />
        </div>
    );
  }

  const basePath = `/${patientId}`;

  return (
      <div className="min-h-screen bg-medical-pattern pb-12 relative overflow-hidden font-cairo text-right" dir="rtl">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
        <Header />

        <div className="max-w-4xl mx-auto px-4">
          {/* ✅ الحماية الثانية: التأكد من وجود patientInfo قبل رندرة PatientCard */}
          <div className="mb-6 transform transition-all duration-500">
            {patientInfo && <PatientCard patient={patientInfo} />}
          </div>

          {/* آخر زيارة طبيب */}
          {lastVisit && (
              <div className="mb-8 bg-white/80 backdrop-blur-md rounded-2xl border border-primary/20 p-4 shadow-sm animate-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    آخر زيارة طبيب
                  </h3>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">
                    {new Date(lastVisit.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-slate-800 text-base">د. {lastVisit.name}</div>
                    <div className="text-xs text-muted-foreground font-bold">{lastVisit.specialty}</div>
                  </div>
                  <button
                      onClick={() => navigate(`${basePath}/prescriptions`)}
                      className="mr-auto text-xs font-bold text-primary hover:underline"
                  >
                    التفاصيل
                  </button>
                </div>
              </div>
          )}

          {/* الإحصائيات */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: 'تحاليل', count: stats.analysis, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'أشعة', count: stats.scans, icon: Scan, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'روشتات', count: stats.prescriptions, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((item, i) => (
                <div key={i} className={`${item.bg} p-4 rounded-2xl border border-white shadow-sm text-center`}>
                  <item.icon className={`w-5 h-5 mx-auto mb-1 ${item.color}`} />
                  <div className="text-xl font-black text-slate-800">{item.count}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{item.label}</div>
                </div>
            ))}
          </div>

          {/* السجلات الطبية */}
          <h3 className="text-md font-black text-slate-700 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            السجلات الطبية
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            <ActionCard title="عرض التحاليل" icon={Activity} to={`${basePath}/analysis`} variant="view" delay={100} />
            <ActionCard title="عرض الأشعة" icon={Scan} to={`${basePath}/scans`} variant="view" delay={150} />
            <ActionCard title="عرض الروشتات" icon={FileText} to={`${basePath}/prescriptions`} variant="view" delay={200} />
          </div>

          {/* إضافة جديد */}
          <h3 className="text-md font-black text-slate-700 mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-medical-mint" />
            إضافة جديد
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <ActionCard title="إضافة تحليل" icon={Activity} to={`${basePath}/analysis/add`} variant="add" delay={250} />
            <ActionCard title="إضافة أشعة" icon={Scan} to={`${basePath}/scans/add`} variant="add" delay={300} />
            <ActionCard title="إضافة روشتة" icon={FileText} to={`${basePath}/prescriptions/add`} variant="add" delay={350} />
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
