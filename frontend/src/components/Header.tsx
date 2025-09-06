import { Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <Heart className="w-8 h-8 text-primary animate-pulse-soft" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Smart Health Companion
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>Dashboard</Button>
          <Button variant="ghost" onClick={() => navigate("/chat")}>Chat Bot</Button>
          <Button variant="ghost" onClick={() => navigate("/first-aid")}>First Aid</Button>
          <Button variant="ghost" onClick={() => navigate("/medicine")}>Medicine</Button>
          <Button variant="ghost" onClick={() => navigate("/plan")}>My Plan</Button>
          <Button variant="ghost" onClick={() => navigate("/profile")}>Profile</Button>
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;