import { useState } from "react";
import { Calendar, Download, CheckCircle2, Clock, Sunrise, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "./Header";
import Footer from "./Footer";

interface Task {
  id: string;
  task: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

interface DayPlan {
  day: number;
  date: string;
  morning: Task[];
  afternoon: Task[];
  night: Task[];
}

const PersonalizedPlan = () => {
  const [planData, setPlanData] = useState<DayPlan[]>([
    {
      day: 1,
      date: "Today",
      morning: [
        { id: "1", task: "Take prescribed medication (Paracetamol 500mg)", completed: true, priority: "high" },
        { id: "2", task: "Drink warm water with lemon", completed: false, priority: "medium" },
        { id: "3", task: "Light stretching exercises (10 mins)", completed: false, priority: "low" }
      ],
      afternoon: [
        { id: "4", task: "Rest and avoid strenuous activities", completed: false, priority: "high" },
        { id: "5", task: "Eat nutritious lunch with protein", completed: false, priority: "medium" }
      ],
      night: [
        { id: "6", task: "Take evening medication", completed: false, priority: "high" },
        { id: "7", task: "Early bedtime (before 10 PM)", completed: false, priority: "medium" }
      ]
    },
    {
      day: 2,
      date: "Tomorrow",
      morning: [
        { id: "8", task: "Continue medication as prescribed", completed: false, priority: "high" },
        { id: "9", task: "Gentle morning walk (15 mins)", completed: false, priority: "medium" },
        { id: "10", task: "Healthy breakfast with fruits", completed: false, priority: "medium" }
      ],
      afternoon: [
        { id: "11", task: "Monitor symptoms and track progress", completed: false, priority: "high" },
        { id: "12", task: "Stay hydrated (8 glasses of water)", completed: false, priority: "medium" }
      ],
      night: [
        { id: "13", task: "Evening medication", completed: false, priority: "high" },
        { id: "14", task: "Relaxation techniques before bed", completed: false, priority: "low" }
      ]
    },
    {
      day: 3,
      date: "Day After Tomorrow",
      morning: [
        { id: "15", task: "Final dose of prescribed medication", completed: false, priority: "high" },
        { id: "16", task: "Resume normal physical activities", completed: false, priority: "medium" },
        { id: "17", task: "Nutritious breakfast", completed: false, priority: "medium" }
      ],
      afternoon: [
        { id: "18", task: "Follow-up health assessment", completed: false, priority: "high" },
        { id: "19", task: "Schedule doctor visit if symptoms persist", completed: false, priority: "high" }
      ],
      night: [
        { id: "20", task: "Normal bedtime routine", completed: false, priority: "low" },
        { id: "21", task: "Prepare healthy meal plan for next week", completed: false, priority: "low" }
      ]
    }
  ]);

  const toggleTaskCompletion = (taskId: string) => {
    setPlanData(planData.map(day => ({
      ...day,
      morning: day.morning.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
      afternoon: day.afternoon.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
      night: day.night.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    })));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-accent text-accent-foreground";
      case "low": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTimeIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case "morning": return <Sunrise className="w-5 h-5 text-yellow-500" />;
      case "afternoon": return <Sun className="w-5 h-5 text-orange-500" />;
      case "night": return <Moon className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Calendar className="w-10 h-10 text-primary animate-pulse-soft" />
            Your 3-Day Health Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-generated personalized health plan based on your symptoms and consultation.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Plan Header */}
          <Card className="medical-card mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Personalized Recovery Plan</CardTitle>
                  <CardDescription>
                    Generated based on your symptoms: Headache, Fever, Fatigue
                  </CardDescription>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Plan
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Tabular Format Plan */}
          <div className="space-y-6">
            {planData.map((day) => (
              <Card key={day.day} className="medical-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Day {day.day} - {day.date}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Time</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead className="w-[100px]">Priority</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Morning Tasks */}
                      {day.morning.map((task, index) => (
                        <TableRow key={task.id}>
                          {index === 0 && (
                            <TableCell rowSpan={day.morning.length} className="align-top">
                              <div className="flex items-center gap-2 font-medium">
                                {getTimeIcon("morning")}
                                Morning
                              </div>
                            </TableCell>
                          )}
                          <TableCell className={task.completed ? "line-through text-muted-foreground" : ""}>
                            {task.task}
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTaskCompletion(task.id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Afternoon Tasks */}
                      {day.afternoon.map((task, index) => (
                        <TableRow key={task.id}>
                          {index === 0 && (
                            <TableCell rowSpan={day.afternoon.length} className="align-top">
                              <div className="flex items-center gap-2 font-medium">
                                {getTimeIcon("afternoon")}
                                Afternoon
                              </div>
                            </TableCell>
                          )}
                          <TableCell className={task.completed ? "line-through text-muted-foreground" : ""}>
                            {task.task}
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTaskCompletion(task.id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Night Tasks */}
                      {day.night.map((task, index) => (
                        <TableRow key={task.id}>
                          {index === 0 && (
                            <TableCell rowSpan={day.night.length} className="align-top">
                              <div className="flex items-center gap-2 font-medium">
                                {getTimeIcon("night")}
                                Night
                              </div>
                            </TableCell>
                          )}
                          <TableCell className={task.completed ? "line-through text-muted-foreground" : ""}>
                            {task.task}
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTaskCompletion(task.id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Summary */}
          <Card className="medical-card mt-6">
            <CardHeader>
              <CardTitle>Progress Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {planData.map((day) => {
                  const allTasks = [...day.morning, ...day.afternoon, ...day.night];
                  const completedTasks = allTasks.filter(task => task.completed).length;
                  const totalTasks = allTasks.length;
                  const percentage = Math.round((completedTasks / totalTasks) * 100);
                  
                  return (
                    <div key={day.day} className="text-center p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold">Day {day.day}</h3>
                      <div className="text-2xl font-bold text-primary">{percentage}%</div>
                      <p className="text-sm text-muted-foreground">
                        {completedTasks} of {totalTasks} tasks completed
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PersonalizedPlan;