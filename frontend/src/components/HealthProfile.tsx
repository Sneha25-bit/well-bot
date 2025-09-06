import React, { useState, useEffect } from "react";
import { User, Heart, Activity, Calendar, AlertCircle, Edit, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import Header from "./Header";
import Footer from "./Footer";

const HealthProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    age: user?.age || 0,
    gender: user?.gender || "",
    height: user?.height || "",
    weight: user?.weight || "",
    bloodType: user?.bloodType || "",
    allergies: user?.allergies || [],
    medications: user?.medications || [],
    chronicConditions: user?.chronicConditions || [],
    emergencyContact: user?.emergencyContact || {
      name: "",
      phone: "",
      relationship: ""
    },
    preferences: user?.preferences || {
      periodTracker: false,
      medicineReminders: true,
      healthInsights: true,
      notifications: true
    }
  });

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || "",
        age: user.age || 0,
        gender: user.gender || "",
        height: user.height || "",
        weight: user.weight || "",
        bloodType: user.bloodType || "",
        allergies: user.allergies || [],
        medications: user.medications || [],
        chronicConditions: user.chronicConditions || [],
        emergencyContact: user.emergencyContact || {
          name: "",
          phone: "",
          relationship: ""
        },
        preferences: user.preferences || {
          periodTracker: false,
          medicineReminders: true,
          healthInsights: true,
          notifications: true
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditData({
        name: user.name || "",
        age: user.age || 0,
        gender: user.gender || "",
        height: user.height || "",
        weight: user.weight || "",
        bloodType: user.bloodType || "",
        allergies: user.allergies || [],
        medications: user.medications || [],
        chronicConditions: user.chronicConditions || [],
        emergencyContact: user.emergencyContact || {
          name: "",
          phone: "",
          relationship: ""
        },
        preferences: user.preferences || {
          periodTracker: false,
          medicineReminders: true,
          healthInsights: true,
          notifications: true
        }
      });
    }
    setIsEditing(false);
  };

  const updatePreference = (key: keyof typeof editData.preferences, value: boolean) => {
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
                    {(user?.name || 'User').split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{user?.name || 'User'}</CardTitle>
                    <CardDescription>
                      {user?.age || 0} years old • {user?.gender || 'Not specified'} • Blood Type: {user?.bloodType || 'Not specified'}
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
                      <span>{user?.age || 0} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Gender:</span>
                      <span>{user?.gender || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Height:</span>
                      <span>{user?.height || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Weight:</span>
                      <span>{user?.weight || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Blood Type:</span>
                      <span>{user?.bloodType || 'Not specified'}</span>
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
                    {user?.allergies?.map((allergy, index) => (
                      <Badge key={index} variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {allergy}
                      </Badge>
                    )) || <span className="text-muted-foreground">No allergies recorded</span>}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current Medications</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.medications?.map((medication, index) => (
                      <Badge key={index} variant="secondary">
                        {medication}
                      </Badge>
                    )) || <span className="text-muted-foreground">No medications recorded</span>}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Chronic Conditions</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.chronicConditions?.map((condition, index) => (
                      <Badge key={index} variant="outline">
                        {condition}
                      </Badge>
                    )) || <span className="text-muted-foreground">No chronic conditions recorded</span>}
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
                  <span>{user?.emergencyContact?.name || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{user?.emergencyContact?.phone || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Relationship:</span>
                  <span>{user?.emergencyContact?.relationship || 'Not specified'}</span>
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
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive app notifications</p>
                </div>
                <Switch
                  checked={editData.preferences.notifications}
                  onCheckedChange={(checked) => updatePreference('notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={handleSave} size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel} size="lg" disabled={isLoading}>
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