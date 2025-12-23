import { User, Calendar, MapPin, Phone } from 'lucide-react';
import { PatientInfo } from '@/contexts/PatientContext';

interface PatientCardProps {
  patient: PatientInfo;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  return (
      <div className="medical-card p-6 mx-4 rounded-2xl bg-background/60 backdrop-blur-md shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer animate-fade-in">
        <div className="flex items-start gap-5 group">
          {/* Avatar */}
          <div className="relative flex-shrink-0 w-20 h-20 rounded-full">
            {/* Glow خلفي */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-medical-mint blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex items-center justify-center w-full h-full bg-background rounded-full shadow-soft ring-2 ring-primary/30 transition-transform duration-300 group-hover:scale-110 group-hover:ring-4">
              <User className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* معلومات المريض */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-foreground mb-3 font-cairo truncate">
              {patient.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-muted-foreground">
              {/* العمر */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-cairo font-medium">{patient.age} سنة</span>
              </div>

              {/* العنوان - تم التعديل هنا ليظهر في سطرين */}
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-cairo font-medium leading-relaxed line-clamp-2 break-words">
                  {patient.address}
                </span>
              </div>

              {/* رقم الهاتف */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-cairo font-medium" dir="ltr">{patient.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PatientCard;
