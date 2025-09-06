import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  CheckCircle, 
  Circle, 
  Clock, 
  Plus, 
  Trash2, 
  Bot, 
  Loader2,
  Target,
  Activity,
  Heart,
  Pill,
  Sun,
  Moon,
  Coffee
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import Header from "./Header";
import Footer from "./Footer";

interface HealthPlanTask {
  task: string;
  priority: 'high' | 'medium' | 'low';
  timeOfDay: 'morning' | 'afternoon' | 'night';
  category: 'medication' | 'exercise' | 'diet' | 'rest' | 'monitoring' | 'other';
  completed?: boolean;
  notes?: string;
}

interface HealthPlan {
  _id: string;
  title: string;
  description: string;
  planType: string;
  duration: number;
  startDate: string;
  endDate: string;
  symptoms: string[];
  tasks: HealthPlanTask[];
  status: 'active' | 'completed' | 'paused';
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

const HealthPlan = () => {
  const { user } = useAuth();
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    symptoms: '',
    planType: 'recovery',
    duration: 3
  });

  useEffect(() => {
    fetchHealthPlans();
  }, []);

  const fetchHealthPlans = async () => {
    try {
      const response = await apiService.getHealthPlans();
      if (response.success && response.data) {
        setHealthPlans(response.data.healthPlans || []);
      }
    } catch (error) {
      console.error('Failed to fetch health plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIHealthPlan = async () => {
    if (!newPlan.symptoms.trim()) return;

    setIsGenerating(true);
    try {
      const symptoms = newPlan.symptoms.split(',').map(s => s.trim()).filter(s => s);
      const response = await apiService.generateAIHealthPlan({
        symptoms,
        planType: newPlan.planType,
        duration: newPlan.duration
      });

      if (response.success && response.healthPlan) {
        setHealthPlans(prev => [response.healthPlan, ...prev]);
        setNewPlan({ symptoms: '', planType: 'recovery', duration: 3 });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Failed to generate health plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTaskCompletion = async (planId: string, taskIndex: number) => {
    try {
      const plan = healthPlans.find(p => p._id === planId);
      if (!plan) return;

      const updatedTasks = [...plan.tasks];
      updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;

      const response = await apiService.toggleTaskCompletion(planId, taskIndex.toString(), {
        completed: updatedTasks[taskIndex].completed
      });

      if (response.success) {
        setHealthPlans(prev => prev.map(p => 
          p._id === planId 
            ? { ...p, tasks: updatedTasks }
            : p
        ));
      }
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    }
  };

  const getTimeIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning': return <Sun className="w-4 h-4" />;
      case 'afternoon': return <Coffee className="w-4 h-4" />;
      case 'night': return <Moon className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication': return <Pill className="w-4 h-4" />;
      case 'exercise': return <Activity className="w-4 h-4" />;
      case 'diet': return <Heart className="w-4 h-4" />;
      case 'rest': return <Moon className="w-4 h-4" />;
      case 'monitoring': return <Target className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressPercentage = (plan: HealthPlan) => {
    const completedTasks = plan.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / plan.tasks.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Target className="w-10 h-10 text-primary" />
            Health Plans
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered personalized health plans to help you recover and maintain wellness
          </p>
        </div>

        {/* Create New Plan Button */}
        <div className="mb-8 text-center">
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-primary hover:bg-primary/90"
            size="lg"
          >
            <Bot className="w-5 h-5 mr-2" />
            Generate AI Health Plan
          </Button>
        </div>

        {/* Create Plan Form */}
        {showCreateForm && (
          <Card className="mb-8 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Generate AI Health Plan</CardTitle>
              <CardDescription>
                Describe your symptoms and let AI create a personalized health plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="symptoms">Symptoms (comma-separated)</Label>
                <Textarea
                  id="symptoms"
                  placeholder="e.g., headache, fatigue, fever"
                  value={newPlan.symptoms}
                  onChange={(e) => setNewPlan({...newPlan, symptoms: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="planType">Plan Type</Label>
                  <select
                    id="planType"
                    value={newPlan.planType}
                    onChange={(e) => setNewPlan({...newPlan, planType: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="recovery">Recovery</option>
                    <option value="wellness">Wellness</option>
                    <option value="prevention">Prevention</option>
                    <option value="management">Management</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="14"
                    value={newPlan.duration}
                    onChange={(e) => setNewPlan({...newPlan, duration: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={generateAIHealthPlan}
                  disabled={isGenerating || !newPlan.symptoms.trim()}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Generate Plan
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Plans List */}
        <div className="space-y-6">
          {healthPlans.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Health Plans Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate your first AI-powered health plan to get started
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Bot className="w-4 h-4 mr-2" />
                  Create Health Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            healthPlans.map((plan) => (
              <Card key={plan._id} className="medical-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {plan.aiGenerated && <Bot className="w-5 h-5 text-primary" />}
                        {plan.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">
                        {plan.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {plan.duration} days • {getProgressPercentage(plan)}% complete
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-2 mt-4">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(plan)}%` }}
                    ></div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Symptoms */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Symptoms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="secondary">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tasks */}
                  <div>
                    <h4 className="font-semibold mb-3">Tasks:</h4>
                    <div className="space-y-3">
                      {plan.tasks.map((task, index) => (
                        <div 
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            task.completed ? 'bg-green-50 border-green-200' : 'bg-muted/50'
                          }`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTaskCompletion(plan._id, index)}
                            className="p-1 h-auto"
                          >
                            {task.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground" />
                            )}
                          </Button>
                          
                          <div className="flex-1">
                            <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.task}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {getTimeIcon(task.timeOfDay)}
                                {task.timeOfDay}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {getCategoryIcon(task.category)}
                                {task.category}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HealthPlan;
