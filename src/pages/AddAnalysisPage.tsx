import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, Save, Image as ImageIcon, Camera, FolderOpen } from 'lucide-react';
import {
  getDoctorsForPatient,
  createAnalysis,
  updateAnalysis,
  getAnalysisById,
  SPECIALTIES,
  SPECIALTIES_MAP,
  API_BASE_URL
} from '@/lib/api';
import PageHeader from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface Doctor {
  id: number;
  name: string;
  specialtyName: string;
}

const AddAnalysisPage = () => {
  const { patientId, id } = useParams<{ patientId: string; id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [notes, setNotes] = useState('');

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isExistingDoctor, setIsExistingDoctor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  useEffect(() => {
    const fetchExistingAnalysis = async () => {
      if (isEditMode && id) {
        setIsLoadingData(true);
        try {
          const data = await getAnalysisById(Number(id));
          setTitle(data.name || '');
          setDoctorName(data.doctorName || '');
          const rawSpec = data.doctorSpecialty || data.specialtyName || '';
          const matched = SPECIALTIES.find(s =>
              s.trim().replace(/ة$/, 'ه') === rawSpec.trim().replace(/ة$/, 'ه')
          );
          setSpecialty(matched || rawSpec);
          setNotes(data.note || '');
          setExistingImages(data.fileUrls || []);
          if (data.doctorName) setIsExistingDoctor(true);
        } catch (error) {
          toast.error('فشل في تحميل بيانات التحليل');
        } finally {
          setIsLoadingData(false);
        }
      }
    };
    fetchExistingAnalysis();
  }, [id, isEditMode]);

  useEffect(() => {
    if (patientId) fetchDoctors();
  }, [patientId]);

  const fetchDoctors = async (query?: string) => {
    if (!patientId) return;
    try {
      const data = await getDoctorsForPatient(patientId, query);
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      setDoctors([]);
    }
  };

  const handleDoctorInputChange = (value: string) => {
    setDoctorName(value);
    setShowDoctorDropdown(true);
    setIsExistingDoctor(false);
    fetchDoctors(value);
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setDoctorName(doctor.name);
    setShowDoctorDropdown(false);
    setIsExistingDoctor(true);
    const matched = SPECIALTIES.find(s =>
        s.trim().replace(/ة$/, 'ه') === doctor.specialtyName?.trim().replace(/ة$/, 'ه')
    );
    setSpecialty(matched || doctor.specialtyName || "");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setFiles((prev) => [...prev, ...selectedFiles]);
    selectedFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => [...prev, url]);
    });
    e.target.value = "";
  };

  const removeNewFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDeleteExistingImage = (imageUrl: string) => {
    setImagesToDelete(prev =>
        prev.includes(imageUrl) ? prev.filter(img => img !== imageUrl) : [...prev, imageUrl]
    );
  };

  const triggerPicker = (accept: string, capture?: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      if (capture) fileInputRef.current.capture = capture;
      else fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !doctorName.trim() || !specialty) {
      toast.error('يرجى ملء كافة البيانات الأساسية');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', title.trim());
      formData.append('doctorName', doctorName.trim());
      formData.append('note', notes.trim());
      formData.append('specialtyId', (SPECIALTIES_MAP[specialty] || 1).toString());

      files.forEach((file) => formData.append('files', file));

      if (isEditMode && id) {
        imagesToDelete.forEach(imgName => formData.append('imagesToDelete', imgName));
        await updateAnalysis(Number(id), formData);
        toast.success('تم تحديث التحليل بنجاح');
        navigate(-1);
      } else {
        await createAnalysis(patientId!, formData);
        toast.success('تم اضافه تحليل بنجاح');
        navigate(`/${patientId}`, { replace: true });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'حدث خطأ في الحفظ');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) return <div className="h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  return (
      <div className="min-h-screen bg-background pb-10 font-cairo text-right" dir="rtl">
        <PageHeader title={isEditMode ? "تعديل تحليل" : "إضافة تحليل جديد"} />
        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-6 max-w-2xl mx-auto">

          {/* معلومات التحليل */}
          <div className="space-y-4 bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="space-y-2">
              <Label className="font-bold text-primary text-sm">اسم التحليل</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثلاً: صورة دم كاملة" className="font-cairo rounded-xl" />
            </div>

            <div className="space-y-2 relative">
              <Label className="font-bold text-primary text-sm">اسم الدكتور</Label>
              <Input value={doctorName} onChange={(e) => handleDoctorInputChange(e.target.value)} onFocus={() => setShowDoctorDropdown(true)} placeholder="اكتب اسم الدكتور" className="font-cairo rounded-xl" />
              {showDoctorDropdown && doctors.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-card border rounded-xl shadow-xl max-h-48 overflow-y-auto font-cairo">
                    {doctors.map((d) => (
                        <button key={d.id} type="button" onClick={() => handleSelectDoctor(d)} className="w-full px-4 py-3 text-right hover:bg-muted border-b last:border-0 transition-colors font-cairo">
                          <div className="font-bold">{d.name}</div>
                          <div className="text-xs text-muted-foreground">{d.specialtyName}</div>
                        </button>
                    ))}
                  </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <Label className="font-bold text-primary text-sm">التخصص</Label>
              <Select value={specialty} onValueChange={setSpecialty} disabled={isExistingDoctor}>
                <SelectTrigger className="rounded-xl font-cairo text-sm"><SelectValue placeholder="اختر التخصص" /></SelectTrigger>
                <SelectContent className="font-cairo">{SPECIALTIES.map((spec) => (<SelectItem key={spec} value={spec}>{spec}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-sm">الملاحظات</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[100px] font-cairo rounded-xl" />
          </div>

          {/* الصور الحالية */}
          {isEditMode && existingImages.length > 0 && (
              <div className="space-y-3 p-4 bg-muted/30 rounded-2xl border border-dashed border-border">
                <Label className="font-bold flex items-center gap-2 text-sm text-primary"><ImageIcon className="w-4 h-4" /> الصور الحالية</Label>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img, idx) => (
                      <div key={idx} onClick={() => toggleDeleteExistingImage(img)} className={`relative cursor-pointer transition-opacity ${imagesToDelete.includes(img) ? 'opacity-30' : 'opacity-100'}`}>
                        <img src={img.startsWith('http') ? img : `${API_BASE_URL}/uploads/${img}`} className="w-20 h-20 object-cover rounded-lg border border-border shadow-sm" />
                        {imagesToDelete.includes(img) && <X className="absolute inset-0 m-auto text-destructive w-8 h-8" />}
                      </div>
                  ))}
                </div>
              </div>
          )}

          {/* قسم الرفع (كاميرا ومعرض فقط) */}
          <div className="space-y-4">
            <Label className="font-bold text-primary text-sm">إضافة مرفقات التحليل (صور)</Label>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => triggerPicker('image/*', 'environment')} className="flex flex-col items-center gap-3 p-6 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl hover:bg-blue-100 transition-all active:scale-95">
                <Camera className="w-8 h-8 text-blue-600" />
                <span className="text-xs font-black text-blue-700">التقاط صورة</span>
              </button>

              <button type="button" onClick={() => triggerPicker('image/*')} className="flex flex-col items-center gap-3 p-6 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-2xl hover:bg-emerald-100 transition-all active:scale-95">
                <FolderOpen className="w-8 h-8 text-emerald-600" />
                <span className="text-xs font-black text-emerald-700">فتح المعرض</span>
              </button>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*" />

            {/* معاينة الصور المختارة */}
            {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-3 p-2 bg-slate-50/50 rounded-2xl border border-slate-100">
                  {previewUrls.map((url, idx) => (
                      <div key={idx} className="relative animate-in zoom-in-50 duration-300">
                        <img src={url} className="w-24 h-24 object-cover rounded-xl border-2 border-primary shadow-sm" />
                        <button type="button" onClick={() => removeNewFile(idx)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform"><X size={12}/></button>
                      </div>
                  ))}
                </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="flex-1 h-12 font-black rounded-xl border-2 border-slate-100 text-slate-500">إلغاء</Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 gap-2 shadow-lg font-black rounded-xl bg-primary hover:bg-primary/90 text-white shadow-primary/20">
              {isSubmitting ? <LoadingSpinner size="sm" /> : <><Save size={20} /> {isEditMode ? 'حفظ التحليل' : 'حفظ التحليل'}</>}
            </Button>
          </div>
        </form>
      </div>
  );
};

export default AddAnalysisPage;
