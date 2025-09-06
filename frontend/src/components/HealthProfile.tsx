import { useState } from "react";
import { User, Heart, Activity, Calendar, AlertCircle, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Header from "./Header";
import Footer from "./Footer";

interface HealthData {
  name: string;
  age: number;
  gender: string;
  height: string;
  weight: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    periodTracker: boolean;
    medicineReminders: boolean;
    healthInsights: boolean;
  };
}

const HealthProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [healthData, setHealthData] = useState<HealthData>({
    name: "Sarah Johnson",
    age: 28,
    gender: "Female",
    height: "5'6\"",
    weight: "130 lbs",
    bloodType: "O+",
    allergies: ["Peanuts", "Shellfish"],
    medications: ["Vitamin D", "Iron Supplement"],
    chronicConditions: ["Mild Anemia"],
    emergencyContact: {
      name: "John Johnson",
      phone: "+1 (555) 123-4567",
      relationship: "Spouse"
    },
    preferences: {
      periodTracker: true,
      medicineReminders: true,
      healthInsights: true
    }
  });

  const [editData, setEditData] = useState<HealthData>(healthData);

  const handleSave = () => {
    setHealthData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(healthData);
    setIsEditing(false);
  };

  const updatePreference = (key: keyof HealthData['preferences'], value: boolean) => {
    setEditData({
      ...editData,
      preferences: {
        ...editData.preferences,
        [key]: value
      }
    });
  };

  const healthMetrics = [
    { label: "BMI", value: "21.0", status: "Normal", color: "bg-green-100 text-green-800" },
    { label: "Last Checkup", value: "3 months ago", status: "Due Soon", color: "bg-yellow-100 text-yellow-800" },
    { label: "Vaccinations", value: "Up to date", status: "Current", color: "bg-green-100 text-green-800" },
    { label: "Blood Pressure", value: "120/80", status: "Normal", color: "bg-green-100 text-green-800" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <User className="w-10 h-10 text-primary animate-pulse-soft" />
            Health Profile
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your complete health summary and personal medical information.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="medical-card mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                    {healthData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{healthData.name}</CardTitle>
                    <CardDescription>
                      {healthData.age} years old • {healthData.gender} • Blood Type: {healthData.bloodType}
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Age</Label>
                        <Input
                          type="number"
                          value={editData.age}
                          onChange={(e) => setEditData({...editData, age: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <Select 
                          value={editData.gender}
                          onValueChange={(value) => setEditData({...editData, gender: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Height</Label>
                        <Input
                          value={editData.height}
                          onChange={(e) => setEditData({...editData, height: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Weight</Label>
                        <Input
                          value={editData.weight}
                          onChange={(e) => setEditData({...editData, weight: e.target.value})}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Age:</span>
                      <span>{healthData.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Gender:</span>
                      <span>{healthData.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Height:</span>
                      <span>{healthData.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Weight:</span>
                      <span>{healthData.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Blood Type:</span>
                      <span>{healthData.bloodType}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Metrics */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Health Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                      <div className="text-lg font-semibold">{metric.value}</div>
                      <Badge className={metric.color}>
                        {metric.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medical History */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Allergies</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {healthData.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current Medications</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {healthData.medications.map((medication, index) => (
                      <Badge key={index} variant="secondary">
                        {medication}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Chronic Conditions</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {healthData.chronicConditions.map((condition, index) => (
                      <Badge key={index} variant="outline">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{healthData.emergencyContact.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{healthData.emergencyContact.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Relationship:</span>
                  <span>{healthData.emergencyContact.relationship}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* App Preferences */}
          <Card className="medical-card mt-6">
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>
                Customize your Smart Health Companion experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Period Tracker</Label>
                  <p className="text-sm text-muted-foreground">Enable menstrual cycle tracking</p>
                </div>
                <Switch
                  checked={editData.preferences.periodTracker}
                  onCheckedChange={(checked) => updatePreference('periodTracker', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Medicine Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get notifications for medication times</p>
                </div>
                <Switch
                  checked={editData.preferences.medicineReminders}
                  onCheckedChange={(checked) => updatePreference('medicineReminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Health Insights</Label>
                  <p className="text-sm text-muted-foreground">Receive personalized health tips</p>
                </div>
                <Switch
                  checked={editData.preferences.healthInsights}
                  onCheckedChange={(checked) => updatePreference('healthInsights', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={handleSave} size="lg">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} size="lg">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HealthProfile;