import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield, CheckCircle } from "lucide-react";

interface SMSPermissionScreenProps {
  onAllow: () => void;
  onDeny: () => void;
}

export const SMSPermissionScreen = ({ onAllow, onDeny }: SMSPermissionScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl font-semibold">SMS Permission Required</CardTitle>
          <p className="text-muted-foreground mt-2">
            We need access to your SMS messages to automatically track your expenses from bank and UPI notifications.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 text-success" />
              <span>Your privacy is protected - we only read transaction messages</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Automatic expense tracking from banks and wallets</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>No personal messages are accessed or stored</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={onAllow}
              className="w-full"
              size="lg"
            >
              Allow SMS Access
            </Button>
            
            <Button 
              variant="outline"
              onClick={onDeny}
              className="w-full"
            >
              Deny (Manual entry only)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};