import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Stethoscope } from "lucide-react";

const WelcomePage = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  return (
    <div className="min-h-screen soft-gradient flex items-center justify-center p-4">
      <div className={`text-center max-w-lg mx-auto transition-all duration-1000 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo/Icon Area */}
        <div className="relative mb-8">
          <div className="hero-gradient w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-[var(--shadow-glow)] animate-float">
            <Stethoscope className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center animate-pulse-soft">
              <Heart className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
          Smart Health
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Companion</span>
        </h1>

        {/* Slogan */}
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Your Health Buddy, Anytime, Anywhere
        </p>

        {/* Features Preview */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="medical-card p-4 text-center">
            <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
            <span className="text-sm text-muted-foreground">AI Health Chat</span>
          </div>
          <div className="medical-card p-4 text-center">
            <Heart className="w-6 h-6 text-secondary mx-auto mb-2" />
            <span className="text-sm text-muted-foreground">Smart Tracking</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          variant="hero" 
          size="lg" 
          className="w-full max-w-sm mx-auto"
          onClick={() => window.location.href = '/setup'}
        >
          Get Started
          <Heart className="ml-2 w-5 h-5" />
        </Button>

        {/* Trust Indicator */}
        <p className="text-sm text-muted-foreground mt-6 opacity-75">
          Trusted by healthcare professionals worldwide
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;