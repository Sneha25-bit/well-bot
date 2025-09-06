import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Heart, Shield, Calendar } from "lucide-react";

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    allergies: "",
    chronicIllness: "",
    enablePeriodTracker: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would save to localStorage or database
    console.log("Profile data:", formData);
  };

  return (
    <div className="min-h-screen soft-gradient p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto medical-card animate-fade-in-up">
        <CardHeader className="text-center pb-8">
          <div className="hero-gradient w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Set Up Your Health Profile</CardTitle>
          <CardDescription className="text-lg">
            Help us personalize your health companion experience
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="medical-card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="medical-card"
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger className="medical-card">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Health Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Health Information</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies" className="text-sm font-medium">Known Allergies</Label>
                <Input
                  id="allergies"
                  type="text"
                  placeholder="e.g., peanuts, shellfish, none"
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                  className="medical-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chronicIllness" className="text-sm font-medium">Chronic Conditions</Label>
                <Input
                  id="chronicIllness"
                  type="text"
                  placeholder="e.g., diabetes, hypertension, none"
                  value={formData.chronicIllness}
                  onChange={(e) => setFormData({...formData, chronicIllness: e.target.value})}
                  className="medical-card"
                />
              </div>
            </div>

            {/* Period Tracker Option */}
            {formData.gender === "female" && (
              <div className="medical-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <h3 className="font-semibold text-foreground">Period Tracking</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="periodTracker"
                    checked={formData.enablePeriodTracker}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, enablePeriodTracker: checked as boolean})
                    }
                  />
                  <Label htmlFor="periodTracker" className="text-sm">
                    Enable period tracker and cycle predictions
                  </Label>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={() => window.location.href = '/dashboard'}
            >
              Complete Setup
              <Heart className="ml-2 w-5 h-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;