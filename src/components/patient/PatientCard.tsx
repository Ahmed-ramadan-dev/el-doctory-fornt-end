import { User, Calendar, MapPin, Phone } from 'lucide-react';
import { PatientInfo } from '@/contexts/PatientContext';

interface PatientCardProps {
  patient: PatientInfo;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  return (
      <div className="medical-card p-4 sm:p-6 mx-2 sm:mx-4 rounded-2xl bg-background/60 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer animate-fade-in border border-primary/5">
        {/* تحويل الـ flex ليكون عمودي في الموبايل وأفقي في الشاشات الأكبر */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 group text-center sm:text-right">

          {/* Avatar - تحسين الحجم للموبايل */}
          <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-medical-mint blur-xl opacity-40 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-background rounded-full shadow-soft ring-2 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
          </div>

          {/* معلومات المريض */}
          <div className="flex-1 min-w-0 w-full">
            {/* تصغير حجم الاسم قليلاً في الموبايل لمنع التداخل */}
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 font-cairo truncate px-2">
              {patient.name}
            </h2>

            {/* استخدام Grid عمودي واحد للموبايل لضمان عدم تداخل البيانات */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

              {/* العمر */}
              <div className="flex items-center justify-center sm:justify-start gap-3 bg-white/40 sm:bg-transparent p-2 rounded-xl border border-primary/5 sm:border-none">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-cairo font-bold text-slate-600">{patient.age} سنة</span>
              </div>

              {/* العنوان - التعديل الأساسي لسطرين وعدم تداخل */}
              <div className="flex items-start justify-center sm:justify-start gap-3 bg-white/40 sm:bg-transparent p-2 rounded-xl border border-primary/5 sm:border-none">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-cairo font-bold text-slate-600 leading-relaxed line-clamp-2 break-words">
                {patient.address}
              </span>
              </div>

              {/* رقم الهاتف */}
              <div className="flex items-center justify-center sm:justify-start gap-3 bg-white/40 sm:bg-transparent p-2 rounded-xl border border-primary/5 sm:border-none">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-cairo font-bold text-slate-600 tracking-wide" dir="ltr">
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
