import React, { useState, useEffect } from "react";
import { Plus, Pill, Clock, Edit, Trash2, CheckCircle2, Circle, Loader2, Bot, AlertTriangle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import { Medicine } from "../types/medicine";
import Header from "./Header";
import Footer from "./Footer";

const MedicineReminder = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [symptomInput, setSymptomInput] = useState("");
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    frequency: "once_daily",
    times: [""]
  });

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await apiService.getMedicines({ isActive: true });
        if (response.success && response.data) {
          setMedicines((response.data as { medicines: Medicine[] }).medicines);
        }
      } catch (error) {
        console.error('Failed to fetch medicines:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const generateAIMedicineSuggestions = async () => {
    if (!symptomInput.trim()) return;

    setIsGeneratingSuggestions(true);
    try {
      // Create a chat session to get AI suggestions
      const response = await apiService.createChatSession({
        title: 'Medicine Suggestions',
        sessionType: 'medication'
      });

      if (response.success && (response as any).session) {
        // Send message to get AI suggestions
        const chatResponse = await apiService.addMessage((response as any).session._id, {
          text: `I have these symptoms: ${symptomInput}. Can you suggest some common over-the-counter medications that might help? Please list them with brief descriptions.`,
          sender: 'user',
          messageType: 'medication'
        });

        if (chatResponse.success && (chatResponse.data as any)?.botMessage) {
          // Parse the AI response to extract medicine suggestions
          const suggestions = (chatResponse.data as any).botMessage.text
            .split('\n')
            .filter((line: string) => line.trim() && (line.includes('•') || line.includes('-') || line.includes('*')))
            .map((line: string) => line.replace(/^[•\-*]\s*/, '').trim())
            .slice(0, 5); // Limit to 5 suggestions
          
          setAiSuggestions(suggestions);
        }
      }
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error);
      // Fallback suggestions
      setAiSuggestions([
        'Paracetamol - For pain relief and fever reduction',
        'Ibuprofen - Anti-inflammatory pain relief',
        'Antihistamines - For allergies and cold symptoms',
        'Antacids - For stomach discomfort',
        'Cough syrup - For cough relief'
      ]);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const addSuggestedMedicine = (suggestion: string) => {
    const [name, ...descriptionParts] = suggestion.split(' - ');
    setNewMedicine({
      ...newMedicine,
      name: name.trim(),
      dosage: "As directed",
      frequency: "once_daily",
      times: ["09:00"]
    });
    setShowAISuggestions(false);
    setShowForm(true);
  };

  const handleAddMedicine = async () => {
    if (newMedicine.name && newMedicine.dosage && newMedicine.frequency && newMedicine.times[0]) {
      try {
        const response = await apiService.createMedicine({
          name: newMedicine.name,
          dosage: newMedicine.dosage,
          frequency: newMedicine.frequency,
          times: newMedicine.times.filter(time => time.trim() !== ''),
          reminders: {
            enabled: true,
            times: newMedicine.times.filter(time => time.trim() !== ''),
            days: [0, 1, 2, 3, 4, 5, 6] // All days
          }
        });

                    if (response.success && (response as unknown as { medicine: Medicine }).medicine) {
                      setMedicines([...medicines, (response as unknown as { medicine: Medicine }).medicine]);
          setNewMedicine({ name: "", dosage: "", frequency: "once_daily", times: [""] });
          setShowForm(false);
        }
      } catch (error) {
        console.error('Failed to add medicine:', error);
      }
    }
  };

  const markMedicineTaken = async (id: string) => {
    try {
      await apiService.markMedicineTaken(id, {
        time: new Date().toTimeString().slice(0, 5),
        notes: 'Taken'
      });
      // Refresh medicines list
      const response = await apiService.getMedicines({ isActive: true });
      if (response.success && response.data) {
        setMedicines((response.data as { medicines: Medicine[] }).medicines);
      }
    } catch (error) {
      console.error('Failed to mark medicine as taken:', error);
    }
  };

  const deleteMedicine = async (id: string) => {
    try {
      await apiService.deleteMedicine(id);
      setMedicines(medicines.filter(med => med._id !== id));
    } catch (error) {
      console.error('Failed to delete medicine:', error);
    }
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
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowAISuggestions(!showAISuggestions)}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Suggestions
              </Button>
              <Button 
                onClick={() => setShowForm(!showForm)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
            </div>
          </div>

          {/* AI Medicine Suggestions */}
          {showAISuggestions && (
            <Card className="medical-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  AI Medicine Suggestions
                </CardTitle>
                <CardDescription>
                  Describe your symptoms and get AI-powered medication suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="symptoms">Describe your symptoms</Label>
                  <Input
                    id="symptoms"
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    placeholder="e.g., headache, fever, cough, stomach pain"
                    className="medical-card"
                  />
                </div>
                <Button 
                  onClick={generateAIMedicineSuggestions}
                  disabled={isGeneratingSuggestions || !symptomInput.trim()}
                  className="w-full"
                >
                  {isGeneratingSuggestions ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Suggestions...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Get AI Suggestions
                    </>
                  )}
                </Button>

                {aiSuggestions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Suggested Medications:</h4>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        These are general suggestions. Always consult with a healthcare professional before taking any medication.
                      </AlertDescription>
                    </Alert>
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{suggestion}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => addSuggestedMedicine(suggestion)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
                    <Label htmlFor="times">Time(s)</Label>
                    {newMedicine.times.map((time, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          type="time"
                          value={time}
                          onChange={(e) => {
                            const newTimes = [...newMedicine.times];
                            newTimes[index] = e.target.value;
                            setNewMedicine({...newMedicine, times: newTimes});
                          }}
                          className="medical-card"
                        />
                        {newMedicine.times.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newTimes = newMedicine.times.filter((_, i) => i !== index);
                              setNewMedicine({...newMedicine, times: newTimes});
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setNewMedicine({...newMedicine, times: [...newMedicine.times, ""]})}
                    >
                      Add Time
                    </Button>
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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {medicines.map((medicine) => (
                <Card key={medicine._id} className="medical-card transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markMedicineTaken(medicine._id)}
                          className="w-8 h-8 p-0"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">
                              {medicine.name}
                            </h3>
                            {medicine.isAISuggested && (
                              <Badge variant="secondary" className="text-xs">
                                AI Suggested
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p><strong>Dosage:</strong> {medicine.dosage}</p>
                            <p><strong>Frequency:</strong> {medicine.frequency.replace('_', ' ')}</p>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span><strong>Times:</strong> {medicine.times.join(', ')}</span>
                            </div>
                            {medicine.instructions && (
                              <p><strong>Instructions:</strong> {medicine.instructions}</p>
                            )}
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
                          onClick={() => deleteMedicine(medicine._id)}
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
          )}

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