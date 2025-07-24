import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  ArrowLeft, 
  Check,
  RefreshCw 
} from "lucide-react";

interface VoiceInputProps {
  language: string;
  onBack: () => void;
  onExpenseAdded: (expense: any) => void;
}

export const VoiceInput = ({ language, onBack, onExpenseAdded }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [parsedExpense, setParsedExpense] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getText = (hindi: string, english: string) => {
    return language === 'hi' ? hindi : english;
  };

  const startListening = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      const sampleTexts = [
        "आज 200 रुपये सब्जी में खर्च किया",
        "Today spent 150 rupees on groceries",
        "50 रुपये चाय में खर्च",
        "Paid 300 for mobile recharge"
      ];
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      setTranscriptText(randomText);
      setIsListening(false);
      parseExpense(randomText);
    }, 3000);
  };

  const parseExpense = (text: string) => {
    setIsProcessing(true);
    // Simulate AI parsing
    setTimeout(() => {
      const amount = text.match(/\d+/)?.[0] || "0";
      const categories = ['Essentials', 'Bills', 'Discretionary', 'Miscellaneous'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      setParsedExpense({
        amount: parseInt(amount),
        category: randomCategory,
        description: text,
        date: new Date().toLocaleDateString('en-IN')
      });
      setIsProcessing(false);
    }, 2000);
  };

  const confirmExpense = () => {
    if (parsedExpense) {
      onExpenseAdded(parsedExpense);
      // Reset state
      setTranscriptText("");
      setParsedExpense(null);
    }
  };

  const retryListening = () => {
    setTranscriptText("");
    setParsedExpense(null);
    startListening();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warning-light via-background to-secondary-light p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">
          {getText('आवाज़ से खर्च जोड़ें', 'Voice Expense Input')}
        </h1>
      </div>

      {/* Voice Input Card */}
      <Card className="shadow-card mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">
            {getText('बोलिए, हम सुन रहे हैं', 'Speak, we are listening')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Microphone Button */}
          <div className="flex justify-center">
            <Button
              variant={isListening ? "destructive" : "voice"}
              size="voice"
              onClick={isListening ? () => setIsListening(false) : startListening}
              disabled={isProcessing}
              className={`w-24 h-24 rounded-full ${isListening ? 'animate-pulse' : ''}`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>
          </div>

          {/* Status Text */}
          <div className="text-center">
            {isListening && (
              <p className="text-warning font-medium animate-pulse">
                {getText('सुन रहे हैं...', 'Listening...')}
              </p>
            )}
            {isProcessing && (
              <p className="text-primary font-medium">
                {getText('समझ रहे हैं...', 'Processing...')}
              </p>
            )}
            {!isListening && !isProcessing && !transcriptText && (
              <p className="text-muted-foreground">
                {getText(
                  'उदाहरण: "आज 200 रुपये सब्जी में खर्च किया"',
                  'Example: "Today spent 200 rupees on groceries"'
                )}
              </p>
            )}
          </div>

          {/* Transcript Display */}
          {transcriptText && (
            <Card className="bg-primary-light border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Volume2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <p className="text-primary font-medium">{transcriptText}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-primary">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{getText('विश्लेषण कर रहे हैं...', 'Analyzing...')}</span>
            </div>
          )}

          {/* Parsed Expense Display */}
          {parsedExpense && (
            <Card className="bg-success-light border-success/20">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-success">
                  {getText('खर्च की जानकारी', 'Expense Details')}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{getText('राशि', 'Amount')}:</Label>
                    <span className="font-medium">₹{parsedExpense.amount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <Label>{getText('श्रेणी', 'Category')}:</Label>
                    <span className="font-medium">
                      {getText(
                        parsedExpense.category === 'Essentials' ? 'जरूरी सामान' :
                        parsedExpense.category === 'Bills' ? 'बिल' :
                        parsedExpense.category === 'Discretionary' ? 'विकल्प' : 'विविध',
                        parsedExpense.category
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <Label>{getText('दिनांक', 'Date')}:</Label>
                    <span className="font-medium">{parsedExpense.date}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="success" 
                    onClick={confirmExpense}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {getText('पुष्टि करें', 'Confirm')}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={retryListening}
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {getText('दोबारा', 'Retry')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">
            {getText('सुझाव', 'Tips')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• {getText('स्पष्ट रूप से बोलें', 'Speak clearly')}</li>
            <li>• {getText('राशि और श्रेणी दोनों बताएं', 'Mention both amount and category')}</li>
            <li>• {getText('शोर रहित जगह का उपयोग करें', 'Use in a quiet environment')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};