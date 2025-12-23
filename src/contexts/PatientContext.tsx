import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  bloodType?: string;
}

interface PatientContextType {
  patientId: string | null;
  setPatientId: (id: string) => void;
  patientInfo: PatientInfo | null;
  setPatientInfo: (info: PatientInfo | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};

interface PatientProviderProps {
  children: ReactNode;
}

export const PatientProvider: React.FC<PatientProviderProps> = ({ children }) => {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <PatientContext.Provider
      value={{
        patientId,
        setPatientId,
        patientInfo,
        setPatientInfo,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};
