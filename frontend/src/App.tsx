import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomePage from "./components/WelcomePage";
import Login from "./components/Login";
import Register from "./components/Register";
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
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatBot /></ProtectedRoute>} />
            <Route path="/first-aid" element={<ProtectedRoute><FirstAid /></ProtectedRoute>} />
            <Route path="/medicine" element={<ProtectedRoute><MedicineReminder /></ProtectedRoute>} />
            <Route path="/plan" element={<ProtectedRoute><PersonalizedPlan /></ProtectedRoute>} />
            <Route path="/period-tracker" element={<ProtectedRoute><PeriodTracker /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><HealthProfile /></ProtectedRoute>} />
            <Route path="*" element={<WelcomePage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
