import { useState } from "react";
import { AuthScreen } from "@/components/AuthScreen";
import { SMSPermissionScreen } from "@/components/SMSPermissionScreen";
import { Dashboard } from "@/components/Dashboard";
import { VoiceInput } from "@/components/VoiceInput";
import { Recommendations } from "@/components/Recommendations";
import { ChatBot } from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Star, Heart } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { toast } from "@/hooks/use-toast";

type AppState = 
  | 'welcome'
  | 'auth' 
  | 'sms-permission'
  | 'dashboard' 
  | 'voice-input' 
  | 'recommendations' 
  | 'chatbot';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('hi'); // Default to Hindi
  const [userPhone, setUserPhone] = useState('');
  const [smsPermissionGranted, setSmsPermissionGranted] = useState(false);

  const handleAuth = (phone: string, income: string) => {
    setUserPhone(phone);
    setCurrentState('sms-permission');
  };

  const handleSMSPermission = (granted: boolean) => {
    setSmsPermissionGranted(granted);
    setCurrentState('dashboard');
    toast({
      title: selectedLanguage === 'hi' ? "स्वागत है!" : "Welcome!",
      description: selectedLanguage === 'hi' ? "Nivi में आपका स्वागत है" : "Welcome to Nivi",
    });
  };

  const handleExpenseAdded = (expense: any) => {
    toast({
      title: selectedLanguage === 'hi' ? "खर्च जोड़ा गया!" : "Expense Added!",
      description: selectedLanguage === 'hi' ? `₹${expense.amount} का खर्च सफलतापूर्वक जोड़ा गया` : `₹${expense.amount} expense added successfully`,
    });
    setCurrentState('dashboard');
  };

  const renderWelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-secondary flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md mx-auto space-y-6">
        {/* Hero Image */}
        {/*<div className="w-48 h-28 mx-auto mb-6 rounded-xl overflow-hidden shadow-2xl">
          <img 
            src={heroImage} 
            alt="Nivi Financial App" 
            className="w-full h-full object-cover"
          />
        </div>*/}

        {/* App Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary-foreground">
            निवि • Nivi
          </h1>
          <p className="text-lg text-primary-foreground/90">
            आपका स्मार्ट वित्तीय साथी
          </p>
          <p className="text-sm text-primary-foreground/70">
            Your Smart Financial Companion
          </p>
        </div>

        {/* Features */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-sm">Voice-enabled expense tracking</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4" />
              </div>
              <span className="text-sm">AI-powered financial recommendations</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-sm">Multi-language support</span>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={() => setCurrentState('auth')}
          size="lg" 
          className="w-full bg-white text-primary hover:bg-white/90 shadow-lg"
        >
          शुरू करें • Get Started
        </Button>
      </div>
    </div>
  );

  // Render based on current state
  switch (currentState) {
    case 'welcome':
      return renderWelcomeScreen();
    
    case 'auth':
      return <AuthScreen onAuth={handleAuth} />;
      
    case 'sms-permission':
      return (
        <SMSPermissionScreen 
          onAllow={() => handleSMSPermission(true)}
          onDeny={() => handleSMSPermission(false)}
        />
      );
    
    case 'dashboard':
      return (
        <Dashboard 
          language={selectedLanguage} 
          onVoiceInput={() => setCurrentState('voice-input')}
          onChatbot={() => setCurrentState('chatbot')}
          onRecommendations={() => setCurrentState('recommendations')}
          onLanguageChange={setSelectedLanguage}
          onExpenseAdded={handleExpenseAdded}
        />
      );
    
    case 'voice-input':
      return (
        <VoiceInput 
          language={selectedLanguage}
          onBack={() => setCurrentState('dashboard')}
          onExpenseAdded={handleExpenseAdded}
        />
      );
    
    case 'recommendations':
      return (
        <Recommendations 
          language={selectedLanguage}
          userIncome="15000" // Default income for recommendations
          onBack={() => setCurrentState('dashboard')}
        />
      );
    
    case 'chatbot':
      return (
        <ChatBot 
          language={selectedLanguage}
          onBack={() => setCurrentState('dashboard')}
        />
      );
    
    default:
      return renderWelcomeScreen();
  }
};

export default Index;
