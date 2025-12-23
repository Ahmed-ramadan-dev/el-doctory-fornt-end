import axios from 'axios';

// ✅ تم التعديل من localhost إلى رابط السيرفر الحقيقي على Koyeb
export const API_BASE_URL = 'https://common-candy-ahmedramadndev2000-892591ea.koyeb.app';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// --- Patient ---
export const getPatientInfo = async (patientId: string) => {
  const response = await api.get(`/api/patient/info/${patientId}`);
  return response.data;
};

// --- Doctors ---
export const getDoctorsForPatient = async (patientId: string, query?: string) => {
  const params = query ? { query } : {};
  const response = await api.get(`/api/doctors/patients/${patientId}/all`, { params });
  return response.data;
};

// --- Analysis (التحاليل) ---
export const getAllAnalysis = async (patientId: string) => {
  const response = await api.get(`/api/analysis/patient/${patientId}`);
  return response.data;
};

export const searchAnalysis = async (patientId: string, keyword?: string, date?: string) => {
  const response = await api.get(`/api/analysis/patient/${patientId}/search`, {
    params: { keyword, date }
  });
  return response.data;
};

export const getAnalysisById = async (id: number | string) => {
  const response = await api.get(`/api/analysis/${id}`);
  return response.data;
};

export const createAnalysis = async (patientId: string, formData: FormData) => {
  const response = await api.post(`/api/analysis/patient/${patientId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updateAnalysis = async (id: number | string, formData: FormData) => {
  const response = await api.put(`/api/analysis/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteAnalysis = async (id: number | string) => {
  const response = await api.delete(`/api/analysis/delete/${id}`);
  return response.data;
};

// --- Scans (الأشعة) ---
export const getAllScans = async (patientId: string) => {
  const response = await api.get(`/api/scan/patient/${patientId}`);
  return response.data;
};

export const searchScans = async (patientId: string, keyword?: string, date?: string) => {
  const response = await api.get(`/api/scan/patient/${patientId}/search`, {
    params: { keyword, date }
  });
  return response.data;
};

export const getScanById = async (id: number | string) => {
  const response = await api.get(`/api/scan/${id}`);
  return response.data;
};

export const createScan = async (patientId: string, formData: FormData) => {
  const response = await api.post(`/api/scan/patient/${patientId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updateScan = async (id: number | string, formData: FormData) => {
  const response = await api.put(`/api/scan/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteScan = async (id: number | string) => {
  const response = await api.delete(`/api/scan/delete/${id}`);
  return response.data;
};

// --- Prescriptions (الروشتات) ---
export const getAllPrescriptions = async (patientId: string) => {
  const response = await api.get(`/api/prescription/patient/${patientId}`);
  return response.data;
};

export const searchPrescriptions = async (patientId: string, keyword?: string, date?: string) => {
  const response = await api.get(`/api/prescription/patient/${patientId}/search`, {
    params: { keyword, date }
  });
  return response.data;
};

export const getPrescriptionById = async (id: number | string) => {
  const response = await api.get(`/api/prescription/${id}`);
  return response.data;
};

export const createPrescription = async (patientId: string, formData: FormData) => {
  const response = await api.post(`/api/prescription/patient/${patientId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updatePrescription = async (id: number | string, formData: FormData) => {
  const response = await api.put(`/api/prescription/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deletePrescription = async (id: number | string) => {
  const response = await api.delete(`/api/prescription/delete/${id}`);
  return response.data;
};

// --- Specialties Map ---
export const SPECIALTIES_MAP: Record<string, number> = {
  'باطنه': 1, 'قلب': 2, 'جراحة': 3, 'أطفال': 4, 'نساء وتوليد': 5,
  'عيون': 6, 'أنف وأذن وحنجرة': 7, 'جلدية': 8, 'عظام': 9,
  'مسالك بولية': 10, 'طب أعصاب': 11, 'طب نفسي': 12, 'غدد صماء': 13,
  'أورام': 14, 'جهاز هضمي': 15, 'تخدير': 16, 'طب طوارئ': 17,
  'رعاية مركزة': 18, 'طب أسنان': 19, 'أشعة': 20, 'مستشفي': 21, 'صيدليه': 22
};

export const SPECIALTIES = Object.keys(SPECIALTIES_MAP);

export default api;
