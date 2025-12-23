import { User, Calendar, MapPin, Phone } from 'lucide-react';
import { PatientInfo } from '@/contexts/PatientContext';

interface PatientCardProps {
  patient: PatientInfo;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  return (
      <div className="medical-card p-5 sm:p-6 mx-2 sm:mx-4 rounded-3xl bg-white/70 backdrop-blur-lg shadow-xl border border-primary/10 animate-fade-in">
        <div className="flex flex-col items-center group text-center">

          {/* صورة المريض - كبرناها شوية للموبايل */}
          <div className="relative flex-shrink-0 w-24 h-24 rounded-full mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-medical-mint/30 blur-2xl opacity-60"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-white rounded-full shadow-inner ring-4 ring-primary/10">
              <User className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* اسم المريض - كبرنا الخط وخليناه أوضح */}
          <div className="w-full mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-cairo leading-tight">
              {patient.name}
            </h2>
          </div>

          {/* البيانات - كل واحدة في سطر مستقل بعرض الكارت */}
          <div className="w-full space-y-3">

            {/* العمر */}
            <div className="flex items-center gap-4 bg-primary/5 p-3 rounded-2xl border border-primary/5">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">العمر</span>
                <span className="text-base font-black text-slate-700 font-cairo">{patient.age} سنة</span>
              </div>
            </div>

            {/* العنوان - سطرين وواضح */}
            <div className="flex items-center gap-4 bg-primary/5 p-3 rounded-2xl border border-primary/5">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">العنوان</span>
                <span className="text-sm font-bold text-slate-700 font-cairo leading-relaxed line-clamp-2">
                {patient.address}
              </span>
              </div>
            </div>

            {/* التليفون - واضح وبخط مريح */}
            <div className="flex items-center gap-4 bg-primary/5 p-3 rounded-2xl border border-primary/5">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">رقم الهاتف</span>
                <span className="text-base font-black text-slate-700 tracking-widest" dir="ltr">
                {patient.phone}
              </span>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
};

export default PatientCard;
