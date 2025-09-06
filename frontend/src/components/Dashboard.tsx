import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageCircle, 
  Heart, 
  Pill, 
  Calendar, 
  ShieldCheck, 
  UserCircle,
  Bot,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import { DashboardStats } from "../types/dashboard";
import Header from "./Header";
import Footer from "./Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMedicines: 5,
    activeMedicines: 3,
    medicinesTakenToday: 2,
    upcomingReminders: 1,
    healthScore: 85,
    activeHealthPlans: 1,
    completedTasks: 8,
    totalTasks: 12
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiService.getDashboardData();
        if (response.success && response.data) {
          setStats((response.data as { stats: DashboardStats }).stats);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  const features = [
    {
      title: "Chat with AI Doctor",
      description: "Get instant health advice and symptom checking",
      icon: MessageCircle,
      gradient: "hero-gradient",
      action: () => navigate('/chat')
    },
    {
      title: "First Aid Coach",
      description: "Emergency guidance for critical situations",
      icon: ShieldAlert,
      gradient: "bg-destructive",
      action: () => navigate('/first-aid')
    },
    {
      title: "Medicine Reminder",
      description: "Never miss your medications again",
      icon: Pill,
      gradient: "wellness-gradient",
      action: () => navigate('/medicine')
    },
    {
      title: "Period Tracker",
      description: "Track your cycle and get health insights",
      icon: Calendar,
      gradient: "bg-accent",
      action: () => navigate('/period-tracker')
    },
    {
      title: "3-Day Health Plan",
      description: "Get personalized health action plans",
      icon: ShieldCheck,
      gradient: "hero-gradient",
      action: () => navigate('/plan')
    },
    {
      title: "Health Profile",
      description: "Manage your health information and settings",
      icon: UserCircle,
      gradient: "bg-secondary",
      action: () => navigate('/profile')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-primary animate-pulse-soft" />
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your personal health assistant, ready to help you stay healthy and informed.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="medical-card text-center">
            <CardContent className="pt-6">
              <div className="hero-gradient w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">Health Score</h3>
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto mt-2" />
              ) : (
                <p className="text-2xl font-bold text-primary">{stats.healthScore}%</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="medical-card text-center">
            <CardContent className="pt-6">
              <div className="wellness-gradient w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">Medications</h3>
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto mt-2" />
              ) : (
                <p className="text-2xl font-bold text-secondary">{stats.activeMedicines} Active</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="medical-card text-center">
            <CardContent className="pt-6">
              <div className="bg-accent w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">Tasks Completed</h3>
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto mt-2" />
              ) : (
                <p className="text-2xl font-bold text-accent">{stats.completedTasks} Completed</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="feature-tile group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={feature.action}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`${feature.gradient} w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-muted-foreground mb-4">
                    {feature.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" className="w-full">
                    Open
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Emergency Button */}
        <div className="text-center mt-8">
          <Button variant="destructive" size="lg" className="animate-pulse-soft">
            <ShieldAlert className="mr-2 w-5 h-5" />
            Emergency Call
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;