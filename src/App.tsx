
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import { PatientProvider } from "@/context/patient/patient-provider";
import { SuperbillProvider } from "@/context/superbill-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import NewSuperbill from "@/pages/NewSuperbill";
import EditSuperbill from "@/pages/EditSuperbill";
import ViewSuperbill from "@/pages/ViewSuperbill";
import Patients from "@/pages/Patients";
import PatientProfile from "@/pages/PatientProfile";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";
import Team from "@/pages/Team";
import Templates from "@/pages/Templates";
import GroupedSubmission from "@/pages/GroupedSubmission";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SuperbillProvider>
          <PatientProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/new-superbill" element={<ProtectedRoute><NewSuperbill /></ProtectedRoute>} />
                  <Route path="/edit-superbill/:id" element={<ProtectedRoute><EditSuperbill /></ProtectedRoute>} />
                  <Route path="/view-superbill/:id" element={<ProtectedRoute><ViewSuperbill /></ProtectedRoute>} />
                  <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
                  <Route path="/patients/:id" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                  <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
                  <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
                  <Route path="/grouped-submission" element={<ProtectedRoute><GroupedSubmission /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
            </Router>
          </PatientProvider>
        </SuperbillProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
