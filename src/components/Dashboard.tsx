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
  ShieldAlert
} from "lucide-react";

const Dashboard = () => {
  const features = [
    {
      title: "Chat with AI Doctor",
      description: "Get instant health advice and symptom checking",
      icon: MessageCircle,
      gradient: "hero-gradient",
      action: () => window.location.href = '/chat'
    },
    {
      title: "First Aid Coach",
      description: "Emergency guidance for critical situations",
      icon: ShieldAlert,
      gradient: "bg-destructive",
      action: () => console.log("Navigate to first aid")
    },
    {
      title: "Medicine Reminder",
      description: "Never miss your medications again",
      icon: Pill,
      gradient: "wellness-gradient",
      action: () => console.log("Navigate to medicine")
    },
    {
      title: "Period Tracker",
      description: "Track your cycle and get health insights",
      icon: Calendar,
      gradient: "bg-accent",
      action: () => console.log("Navigate to period tracker")
    },
    {
      title: "3-Day Health Plan",
      description: "Get personalized health action plans",
      icon: ShieldCheck,
      gradient: "hero-gradient",
      action: () => console.log("Navigate to health plan")
    },
    {
      title: "Health Profile",
      description: "Manage your health information and settings",
      icon: UserCircle,
      gradient: "bg-secondary",
      action: () => console.log("Navigate to profile")
    }
  ];

  return (
    <div className="min-h-screen soft-gradient p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="hero-gradient w-12 h-12 rounded-2xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Health Dashboard</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Welcome back! How can I help you stay healthy today?
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
              <p className="text-2xl font-bold text-primary">85%</p>
            </CardContent>
          </Card>
          
          <Card className="medical-card text-center">
            <CardContent className="pt-6">
              <div className="wellness-gradient w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">Medications</h3>
              <p className="text-2xl font-bold text-secondary">3 Active</p>
            </CardContent>
          </Card>
          
          <Card className="medical-card text-center">
            <CardContent className="pt-6">
              <div className="bg-accent w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">Chat Sessions</h3>
              <p className="text-2xl font-bold text-accent">12 Today</p>
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
    </div>
  );
};

export default Dashboard;