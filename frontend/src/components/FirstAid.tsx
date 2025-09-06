import { useState } from "react";
import { AlertTriangle, Heart, Phone, Scissors, Flame, Wind, Zap, Users, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "./Header";
import Footer from "./Footer";

const FirstAid = () => {
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [personalContacts, setPersonalContacts] = useState([
    { id: 1, name: "Mom", phone: "+91 98765 43210", relationship: "Parent" },
    { id: 2, name: "Dad", phone: "+91 98765 43211", relationship: "Parent" }
  ]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" });

  // India Emergency Numbers
  const indiaEmergencyNumbers = [
    { name: "Police", number: "100", description: "For any criminal activity or law enforcement" },
    { name: "Fire Service", number: "101", description: "For fire emergencies and rescue operations" },
    { name: "Ambulance", number: "102", description: "For medical emergencies and ambulance service" },
    { name: "Disaster Management", number: "108", description: "For natural disasters and major emergencies" },
    { name: "Women Helpline", number: "1091", description: "For women in distress" },
    { name: "Child Helpline", number: "1098", description: "For children in need of help" },
    { name: "Senior Citizen Helpline", number: "1090", description: "For senior citizens in distress" },
    { name: "Mental Health Helpline", number: "1800-599-0019", description: "For mental health support" }
  ];

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

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const addPersonalContact = () => {
    if (newContact.name && newContact.phone && newContact.relationship) {
      const contact = {
        id: Date.now(),
        name: newContact.name,
        phone: newContact.phone,
        relationship: newContact.relationship
      };
      setPersonalContacts([...personalContacts, contact]);
      setNewContact({ name: "", phone: "", relationship: "" });
      setIsAddingContact(false);
    }
  };

  const deletePersonalContact = (id: number) => {
    setPersonalContacts(personalContacts.filter(contact => contact.id !== id));
  };

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

        {!selectedEmergency && !showEmergencyContacts ? (
          <>
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

            {/* Emergency Contacts Section */}
            <div className="max-w-4xl mx-auto">
              <Card className="medical-card">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Users className="w-8 h-8 text-primary" />
                    <CardTitle className="text-2xl">Emergency Contacts</CardTitle>
                  </div>
                  <CardDescription>
                    Quick access to emergency services and your personal contacts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* India Emergency Numbers */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        India Emergency Numbers
                      </h3>
                      <div className="space-y-3">
                        {indiaEmergencyNumbers.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">{contact.description}</p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleCall(contact.number)}
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              {contact.number}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Personal Contacts */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Heart className="w-5 h-5 text-primary" />
                          Personal Contacts
                        </h3>
                        <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Plus className="w-4 h-4 mr-1" />
                              Add Contact
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Emergency Contact</DialogTitle>
                              <DialogDescription>
                                Add a personal contact for emergency situations
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="contactName">Name</Label>
                                <Input
                                  id="contactName"
                                  value={newContact.name}
                                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                                  placeholder="Enter contact name"
                                />
                              </div>
                              <div>
                                <Label htmlFor="contactPhone">Phone Number</Label>
                                <Input
                                  id="contactPhone"
                                  value={newContact.phone}
                                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                                  placeholder="Enter phone number"
                                />
                              </div>
                              <div>
                                <Label htmlFor="contactRelationship">Relationship</Label>
                                <Input
                                  id="contactRelationship"
                                  value={newContact.relationship}
                                  onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                                  placeholder="e.g., Parent, Spouse, Friend"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={addPersonalContact} className="flex-1">
                                  Add Contact
                                </Button>
                                <Button variant="outline" onClick={() => setIsAddingContact(false)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="space-y-3">
                        {personalContacts.map((contact) => (
                          <div key={contact.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleCall(contact.phone)}
                              >
                                <Phone className="w-4 h-4 mr-1" />
                                Call
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => deletePersonalContact(contact.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
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
        <div className="fixed bottom-6 right-6 flex flex-col gap-2">
          <Button 
            size="lg" 
            className="bg-destructive hover:bg-destructive/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-soft"
            onClick={() => handleCall("102")}
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Ambulance (102)
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-background/90 backdrop-blur-sm"
            onClick={() => handleCall("100")}
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Police (100)
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FirstAid;