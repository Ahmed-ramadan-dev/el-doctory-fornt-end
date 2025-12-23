import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster as HotToaster } from 'react-hot-toast';
import { PatientProvider } from "@/contexts/PatientContext";
import Dashboard from "./pages/Dashboard";
import AnalysisListPage from "./pages/AnalysisListPage";
import AddAnalysisPage from "./pages/AddAnalysisPage";
import ScansListPage from "./pages/ScansListPage";
import AddScanPage from "./pages/AddScanPage";
import PrescriptionsListPage from "./pages/PrescriptionsListPage";
import AddPrescriptionPage from "./pages/AddPrescriptionPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PatientProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HotToaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'Cairo, sans-serif',
              direction: 'rtl',
            },
            success: {
              style: {
                background: 'hsl(158 60% 95%)',
                color: 'hsl(158 65% 25%)',
                border: '1px solid hsl(158 60% 85%)',
              },
            },
            error: {
              style: {
                background: 'hsl(0 84% 95%)',
                color: 'hsl(0 72% 40%)',
                border: '1px solid hsl(0 84% 85%)',
              },
            },
          }}
        />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to demo patient */}
            <Route path="/" element={<Navigate to="/PDG6U51W" replace />} />
            
            {/* Patient Dashboard */}
            <Route path="/:patientId" element={<Dashboard />} />
            
            {/* Analysis Routes */}
            <Route path="/:patientId/analysis" element={<AnalysisListPage />} />
            <Route path="/:patientId/analysis/add" element={<AddAnalysisPage />} />
            <Route path="/:patientId/analysis/:id/edit" element={<AddAnalysisPage />} />
            
            {/* Scan Routes */}
            <Route path="/:patientId/scans" element={<ScansListPage />} />
            <Route path="/:patientId/scans/add" element={<AddScanPage />} />
            <Route path="/:patientId/scans/:id/edit" element={<AddScanPage />} />
            
            {/* Prescription Routes */}
            <Route path="/:patientId/prescriptions" element={<PrescriptionsListPage />} />
            <Route path="/:patientId/prescriptions/add" element={<AddPrescriptionPage />} />
            <Route path="/:patientId/prescriptions/:id/edit" element={<AddPrescriptionPage />} />
            
            {/* Not Found */}
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PatientProvider>
  </QueryClientProvider>
);

export default App;
