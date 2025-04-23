
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SuperbillProvider } from "@/context/superbill-context";
import { PatientProvider } from "@/context/patient-context";
import { AppLayout } from "@/components/layout/AppLayout";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SuperbillProvider>
        <PatientProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              } />
              <Route path="/new" element={
                <AppLayout>
                  <NewSuperbill />
                </AppLayout>
              } />
              <Route path="/edit/:id" element={
                <AppLayout>
                  <EditSuperbill />
                </AppLayout>
              } />
              <Route path="/view/:id" element={
                <AppLayout>
                  <ViewSuperbill />
                </AppLayout>
              } />
              <Route path="/settings" element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              } />
              <Route path="/patients" element={
                <AppLayout>
                  <Patients />
                </AppLayout>
              } />
              <Route path="/grouped-submission" element={
                <AppLayout>
                  <GroupedSubmission />
                </AppLayout>
              } />
              <Route path="/templates" element={
                <AppLayout>
                  <Templates />
                </AppLayout>
              } />
              <Route path="/reports" element={
                <AppLayout>
                  <Reports />
                </AppLayout>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PatientProvider>
      </SuperbillProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
