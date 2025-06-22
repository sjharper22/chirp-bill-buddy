
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import { PatientProvider } from "@/context/patient/patient-provider";
import { SuperbillProvider } from "@/context/superbill-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import NewSuperbill from "@/pages/NewSuperbill";
import EditSuperbill from "@/pages/EditSuperbill";
import ViewSuperbill from "@/pages/ViewSuperbill";
import Patients from "@/pages/Patients";
import PatientProfile from "@/pages/PatientProfile";
import Appointments from "@/pages/Appointments";
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
                  
                  {/* Redirect /new to /new-superbill */}
                  <Route path="/new" element={<Navigate to="/new-superbill" replace />} />
                  
                  <Route path="/" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/new-superbill" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <NewSuperbill />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/edit/:id" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <EditSuperbill />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/view/:id" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ViewSuperbill />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/patients" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Patients />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/patients/:id" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <PatientProfile />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/appointments" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Appointments />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Settings />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Reports />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/team" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Team />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/templates" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Templates />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/grouped-submission" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <GroupedSubmission />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
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
