import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import ProfileSetup from "./components/ProfileSetup";
import Dashboard from "./components/Dashboard";
import ChatBot from "./components/ChatBot";
import FirstAid from "./components/FirstAid";
import MedicineReminder from "./components/MedicineReminder";
import PersonalizedPlan from "./components/PersonalizedPlan";
import PeriodTracker from "./components/PeriodTracker";
import HealthProfile from "./components/HealthProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<ChatBot />} />
          <Route path="/first-aid" element={<FirstAid />} />
          <Route path="/medicine" element={<MedicineReminder />} />
          <Route path="/plan" element={<PersonalizedPlan />} />
          <Route path="/period-tracker" element={<PeriodTracker />} />
          <Route path="/profile" element={<HealthProfile />} />
          <Route path="*" element={<WelcomePage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
