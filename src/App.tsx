
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SuperbillProvider } from "@/context/superbill-context";
import { PatientProvider } from "@/context/patient-context";
import { AuthProvider } from "@/context/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import NewSuperbill from "./pages/NewSuperbill";
import EditSuperbill from "./pages/EditSuperbill";
import ViewSuperbill from "./pages/ViewSuperbill";
import Settings from "./pages/Settings";
import Patients from "./pages/Patients";
import GroupedSubmission from "./pages/GroupedSubmission";
import Templates from "./pages/Templates";
import Reports from "./pages/Reports";
import Auth from "./pages/Auth";
import Unauthorized from "./pages/Unauthorized";
import Team from "./pages/Team";
import LetterBuilder from "./pages/LetterBuilder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <SuperbillProvider>
          <PatientProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                <Route path="/" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/new" element={
                  <ProtectedRoute requiredRoles={["admin", "editor"]}>
                    <AppLayout>
                      <NewSuperbill />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/edit/:id" element={
                  <ProtectedRoute requiredRoles={["admin", "editor"]}>
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
                <Route path="/settings" element={
                  <ProtectedRoute requiredRoles={["admin"]}>
                    <AppLayout>
                      <Settings />
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
                <Route path="/grouped-submission" element={
                  <ProtectedRoute requiredRoles={["admin", "editor"]}>
                    <AppLayout>
                      <GroupedSubmission />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/templates" element={
                  <ProtectedRoute requiredRoles={["admin", "editor"]}>
                    <AppLayout>
                      <Templates />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/letter-builder" element={
                  <ProtectedRoute requiredRoles={["admin", "editor"]}>
                    <AppLayout>
                      <LetterBuilder />
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
                  <ProtectedRoute requiredRoles={["admin"]}>
                    <AppLayout>
                      <Team />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </PatientProvider>
        </SuperbillProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
