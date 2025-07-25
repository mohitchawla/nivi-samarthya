import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Shield, ArrowRight } from "lucide-react";

interface AuthScreenProps {
  onAuth: (phone: string, income: string) => void;
}

export const AuthScreen = ({ onAuth }: AuthScreenProps) => {
  const [phone, setPhone] = useState("");
  const [income, setIncome] = useState("");
  const [step, setStep] = useState<'phone' | 'income' | 'otp'>('phone');
  const [otp, setOtp] = useState("");

  const handlePhoneSubmit = () => {
    if (phone.length === 10) {
      setStep('otp');
    }
  };

  const handleOtpSubmit = () => {
    onAuth(phone, income);
    fetch('http://localhost:9090/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber: phone, income: income })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        sessionStorage.setItem('userno', phone);
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        // Handle successful response
      });
  };

  const handleIncomeSubmit = () => {
  };

  const renderPhoneStep = () => (
    <>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center mb-4">
          <Smartphone className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold">नमस्ते! Nivi में आपका स्वागत है</CardTitle>
        <CardDescription>अपना मोबाइल नंबर डालें</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">मोबाइल नंबर / Mobile Number</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-lg text-sm">
              +91
            </span>
            <Input
              id="phone"
              type="tel"
              placeholder="10 अंकों का नंबर डालें"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="rounded-l-none"
            />
          </div>
        </div>
        <Button
          onClick={handlePhoneSubmit}
          disabled={phone.length !== 10}
          className="w-full"
          size="lg"
        >
          OTP भेजें <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </>
  );

  const renderOtpStep = () => (
    <>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-success-foreground" />
        </div>
        <CardTitle className="text-xl font-bold">OTP वेरिफिकेशन</CardTitle>
        <CardDescription>+91 {phone} पर भेजा गया OTP डालें</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">6 अंकों का OTP</Label>
          <Input
            id="otp"
            type="text"
            placeholder="______"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-lg tracking-widest"
          />
        </div>
        <Button
          onClick={handleOtpSubmit}
          disabled={otp.length !== 6}
          className="w-full"
          size="lg"
        >
          वेरिफाई करें <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setStep('phone')}
          className="w-full"
        >
          नंबर बदलें
        </Button>
      </CardContent>
    </>
  );

  const renderIncomeStep = () => (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">आय की जानकारी</CardTitle>
        <CardDescription>आपकी मासिक आय बताएं (गोपनीय)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {[
            { value: "10000-15000", label: "₹10,000 - ₹15,000" },
            { value: "15000-20000", label: "₹15,000 - ₹20,000" },
            { value: "20000-25000", label: "₹20,000 - ₹25,000" },
            { value: "25000+", label: "₹25,000 से अधिक" },
          ].map((option) => (
            <Button
              key={option.value}
              variant={income === option.value ? "success" : "outline"}
              onClick={() => setIncome(option.value)}
              className="w-full justify-start h-auto p-4"
            >
              {option.label}
            </Button>
          ))}
        </div>
        <Button
          onClick={handleIncomeSubmit}
          disabled={!income}
          className="w-full"
          size="lg"
        >
          शुरू करें <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        {step === 'phone' && renderPhoneStep()}
        {step === 'otp' && renderOtpStep()}
        {step === 'income' && renderIncomeStep()}
      </Card>
    </div>
  );
};