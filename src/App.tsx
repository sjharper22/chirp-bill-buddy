
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SuperbillProvider>
        <PatientProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/new" element={<NewSuperbill />} />
                <Route path="/edit/:id" element={<EditSuperbill />} />
                <Route path="/view/:id" element={<ViewSuperbill />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/grouped-submission" element={<GroupedSubmission />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </PatientProvider>
      </SuperbillProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
