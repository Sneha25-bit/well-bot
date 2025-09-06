import { Heart, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-bold">Smart Health Companion</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted healthcare partner, providing personalized health guidance and support 24/7.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/chat" className="hover:text-white transition-colors">AI Chat</a></li>
              <li><a href="/first-aid" className="hover:text-white transition-colors">First Aid</a></li>
              <li><a href="/medicine" className="hover:text-white transition-colors">Medicine Tracker</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Symptom Checker</li>
              <li>Medicine Reminders</li>
              <li>Period Tracking</li>
              <li>Personalized Plans</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@smarthealthcompanion.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Healthcare District, Medical City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-4 text-center text-sm text-gray-400">
          <p>&copy; 2024 Smart Health Companion. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;