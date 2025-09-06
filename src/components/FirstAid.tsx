import { useState } from "react";
import { AlertTriangle, Heart, Phone, Scissors, Flame, Wind, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "./Header";
import Footer from "./Footer";

const FirstAid = () => {
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);

  const emergencyTypes = [
    {
      id: "cuts",
      title: "Cuts & Wounds",
      icon: Scissors,
      color: "text-red-500",
      steps: [
        "Wash your hands thoroughly",
        "Stop the bleeding by applying direct pressure",
        "Clean the wound gently with clean water",
        "Apply antibiotic ointment if available",
        "Cover with a sterile bandage",
        "Seek medical attention if deep or won't stop bleeding"
      ]
    },
    {
      id: "burns",
      title: "Burns",
      icon: Flame,
      color: "text-orange-500",
      steps: [
        "Remove from heat source immediately",
        "Cool the burn with cold running water for 10-20 minutes",
        "Remove jewelry/clothing from burned area",
        "Do not break blisters",
        "Cover with sterile gauze loosely",
        "Seek immediate medical attention for severe burns"
      ]
    },
    {
      id: "choking",
      title: "Choking",
      icon: Wind,
      color: "text-blue-500",
      steps: [
        "Encourage coughing if person can speak",
        "Stand behind the person",
        "Place arms around waist",
        "Make a fist above navel",
        "Give quick upward thrusts (Heimlich maneuver)",
        "Call emergency services if object doesn't dislodge"
      ]
    },
    {
      id: "fainting",
      title: "Fainting",
      icon: Zap,
      color: "text-purple-500",
      steps: [
        "Check if person is conscious and breathing",
        "Lay person flat on their back",
        "Elevate legs 8-12 inches",
        "Loosen tight clothing",
        "Check for injuries from falling",
        "Seek medical attention if doesn't regain consciousness"
      ]
    }
  ];

  const selectedType = emergencyTypes.find(type => type.id === selectedEmergency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <AlertTriangle className="w-10 h-10 text-destructive animate-pulse" />
            First Aid Coach
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get step-by-step emergency guidance when you need it most. Select an emergency type below.
          </p>
        </div>

        {!selectedEmergency ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {emergencyTypes.map((emergency) => {
              const Icon = emergency.icon;
              return (
                <Card 
                  key={emergency.id}
                  className="feature-tile hover:shadow-lg cursor-pointer"
                  onClick={() => setSelectedEmergency(emergency.id)}
                >
                  <CardHeader className="text-center">
                    <Icon className={`w-12 h-12 mx-auto mb-2 ${emergency.color}`} />
                    <CardTitle className="text-lg">{emergency.title}</CardTitle>
                    <CardDescription>
                      Click for emergency guidance
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="outline" 
              className="mb-6"
              onClick={() => setSelectedEmergency(null)}
            >
              ← Back to Emergency Types
            </Button>

            <Card className="medical-card">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  {selectedType && <selectedType.icon className={`w-8 h-8 ${selectedType.color}`} />}
                  <CardTitle className="text-2xl">{selectedType?.title} - Step by Step Guide</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedType?.steps.map((step, index) => (
                    <Alert key={index} className="border-l-4 border-l-primary">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <AlertDescription className="text-base font-medium">
                          {step}
                        </AlertDescription>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Emergency Call Button */}
        <div className="fixed bottom-6 right-6">
          <Button 
            size="lg" 
            className="bg-destructive hover:bg-destructive/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-soft"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Emergency
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FirstAid;