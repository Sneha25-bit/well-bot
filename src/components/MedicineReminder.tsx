import { useState } from "react";
import { Plus, Pill, Clock, Edit, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Header from "./Header";
import Footer from "./Footer";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  completed: boolean;
  aiSuggested: boolean;
}

const MedicineReminder = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: "1",
      name: "Paracetamol",
      dosage: "500mg",
      frequency: "Twice daily",
      time: "08:00, 20:00",
      completed: false,
      aiSuggested: true
    },
    {
      id: "2",
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "Once daily",
      time: "09:00",
      completed: true,
      aiSuggested: true
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: ""
  });

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.dosage && newMedicine.frequency && newMedicine.time) {
      const medicine: Medicine = {
        id: Date.now().toString(),
        ...newMedicine,
        completed: false,
        aiSuggested: false
      };
      setMedicines([...medicines, medicine]);
      setNewMedicine({ name: "", dosage: "", frequency: "", time: "" });
      setShowForm(false);
    }
  };

  const toggleCompletion = (id: string) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, completed: !med.completed } : med
    ));
  };

  const deleteMedicine = (id: string) => {
    setMedicines(medicines.filter(med => med.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Pill className="w-10 h-10 text-primary animate-pulse-soft" />
            Medicine Reminder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay on top of your medication schedule with AI-powered reminders and tracking.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Add Medicine Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Medicines</h2>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Medicine
            </Button>
          </div>

          {/* Add Medicine Form */}
          {showForm && (
            <Card className="medical-card mb-6">
              <CardHeader>
                <CardTitle>Add New Medicine</CardTitle>
                <CardDescription>Enter your medicine details below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Medicine Name</Label>
                    <Input
                      id="name"
                      value={newMedicine.name}
                      onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                      placeholder="e.g., Aspirin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      value={newMedicine.dosage}
                      onChange={(e) => setNewMedicine({...newMedicine, dosage: e.target.value})}
                      placeholder="e.g., 500mg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select onValueChange={(value) => setNewMedicine({...newMedicine, frequency: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Once daily">Once daily</SelectItem>
                        <SelectItem value="Twice daily">Twice daily</SelectItem>
                        <SelectItem value="Three times daily">Three times daily</SelectItem>
                        <SelectItem value="Four times daily">Four times daily</SelectItem>
                        <SelectItem value="As needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="time">Time(s)</Label>
                    <Input
                      id="time"
                      value={newMedicine.time}
                      onChange={(e) => setNewMedicine({...newMedicine, time: e.target.value})}
                      placeholder="e.g., 08:00, 20:00"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddMedicine}>Add Medicine</Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medicine List */}
          <div className="space-y-4">
            {medicines.map((medicine) => (
              <Card key={medicine.id} className={`medical-card transition-all duration-300 ${medicine.completed ? 'opacity-75' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={medicine.completed}
                        onCheckedChange={() => toggleCompletion(medicine.id)}
                        className="w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-lg font-semibold ${medicine.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {medicine.name}
                          </h3>
                          {medicine.aiSuggested && (
                            <Badge variant="secondary" className="text-xs">
                              AI Suggested
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Dosage:</strong> {medicine.dosage}</p>
                          <p><strong>Frequency:</strong> {medicine.frequency}</p>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span><strong>Time:</strong> {medicine.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteMedicine(medicine.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {medicines.length === 0 && (
            <Card className="medical-card text-center py-12">
              <CardContent>
                <Pill className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No medicines added yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first medicine or let our AI chatbot suggest medications based on your symptoms.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Medicine
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MedicineReminder;