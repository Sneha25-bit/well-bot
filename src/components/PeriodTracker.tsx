import { useState } from "react";
import { Calendar as CalendarIcon, Heart, Droplets, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "./Header";
import Footer from "./Footer";

const PeriodTracker = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [currentPeriodStart, setCurrentPeriodStart] = useState<Date>();
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<Date>();
  
  const flowIntensity = {
    light: { icon: "💧", color: "bg-blue-200 text-blue-800", label: "Light" },
    medium: { icon: "💧💧", color: "bg-blue-400 text-blue-900", label: "Medium" },
    heavy: { icon: "💧💧💧", color: "bg-blue-600 text-white", label: "Heavy" }
  };

  const symptoms = [
    { name: "Cramps", severity: "medium", tip: "Try a warm compress or gentle stretching" },
    { name: "Mood Swings", severity: "light", tip: "Practice deep breathing and stay hydrated" },
    { name: "Fatigue", severity: "medium", tip: "Get adequate rest and avoid strenuous activities" },
    { name: "Bloating", severity: "light", tip: "Avoid salty foods and drink plenty of water" }
  ];

  const tips = [
    "Drink warm water to ease cramps",
    "Light exercise can help reduce discomfort",
    "Iron-rich foods help combat fatigue",
    "Track your cycle to predict next period",
    "Stay hydrated throughout your cycle"
  ];

  const getPeriodDay = (date: Date) => {
    if (!currentPeriodStart || !currentPeriodEnd) return null;
    
    const daysDiff = Math.floor((date.getTime() - currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff >= 0 && date <= currentPeriodEnd) {
      return daysDiff + 1;
    }
    return null;
  };

  const getFlowForDay = (day: number) => {
    if (day <= 2) return flowIntensity.heavy;
    if (day <= 4) return flowIntensity.medium;
    return flowIntensity.light;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-pink-500 animate-pulse-soft" />
            Period Tracker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your menstrual cycle, symptoms, and get personalized health insights.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="calendar" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              <TabsTrigger value="insights">Insights & Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      Cycle Calendar
                    </CardTitle>
                    <CardDescription>
                      Select your period dates to track your cycle
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="multiple"
                      selected={selectedDates}
                      onSelect={setSelectedDates}
                      className="rounded-md border p-3 pointer-events-auto"
                      modifiers={{
                        period: selectedDates
                      }}
                      modifiersStyles={{
                        period: { backgroundColor: '#ec4899', color: 'white' }
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Current Period Input */}
                <div className="space-y-6">
                  <Card className="medical-card">
                    <CardHeader>
                      <CardTitle>Current Period</CardTitle>
                      <CardDescription>
                        Enter your current period dates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Period Start Date</Label>
                        <Input 
                          type="date"
                          onChange={(e) => setCurrentPeriodStart(new Date(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Period End Date</Label>
                        <Input 
                          type="date"
                          onChange={(e) => setCurrentPeriodEnd(new Date(e.target.value))}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Flow Intensity */}
                  {currentPeriodStart && currentPeriodEnd && (
                    <Card className="medical-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Droplets className="w-5 h-5 text-blue-500" />
                          Flow Intensity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Array.from({ length: Math.ceil((currentPeriodEnd.getTime() - currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1 }, (_, index) => {
                            const day = index + 1;
                            const flow = getFlowForDay(day);
                            return (
                              <div key={day} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <span className="font-medium">Day {day}</span>
                                <Badge className={flow.color}>
                                  {flow.icon} {flow.label}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="symptoms" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {symptoms.map((symptom, index) => (
                  <Card key={index} className="medical-card">
                    <CardHeader>
                      <CardTitle className="text-lg">{symptom.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={symptom.severity === 'heavy' ? 'destructive' : symptom.severity === 'medium' ? 'default' : 'secondary'}>
                          {symptom.severity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{symptom.tip}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cycle Insights */}
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle>Cycle Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Average Cycle Length</h4>
                      <p className="text-2xl font-bold text-primary">28 days</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Period Duration</h4>
                      <p className="text-2xl font-bold text-primary">5 days</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Next Period Prediction</h4>
                      <p className="text-lg font-semibold text-accent">Dec 15, 2024</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Health Tips */}
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle>Health Tips</CardTitle>
                    <CardDescription>
                      Personalized recommendations for your cycle
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <p className="text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PeriodTracker;