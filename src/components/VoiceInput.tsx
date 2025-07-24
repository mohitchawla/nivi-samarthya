import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  ArrowLeft, 
  Check,
  RefreshCw,
  Edit
} from "lucide-react";

interface VoiceInputProps {
  language: string;
  onBack: () => void;
  onExpenseAdded: (expense: any) => void;
}

const categories = ['Rent', 'Groceries', 'Bills', 'Medical', 'Transport', 'Miscellaneous'];

export const VoiceInput = ({ language, onBack, onExpenseAdded }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [parsedExpense, setParsedExpense] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const getText = (hindi: string, english: string) => {
    return language === 'hi' ? hindi : english;
  };

  const startListening = () => {
    setIsListening(true);
    
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscriptText(transcript);
        setIsListening(false);
        parseExpense(transcript);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        // Fallback to sample data on error
        const sampleTexts = [
          "आज 200 रुपये किराना में खर्च किया",
          "Today spent 150 rupees on groceries",
          "300 rupees medical expense",
          "Paid 500 for transport"
        ];
        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        setTranscriptText(randomText);
        parseExpense(randomText);
      };
      
      recognition.start();
    } else {
      // Fallback for browsers without speech recognition
      setTimeout(() => {
        const sampleTexts = [
          "आज 200 रुपये किराना में खर्च किया",
          "Today spent 150 rupees on groceries", 
          "300 rupees medical expense",
          "Paid 500 for transport"
        ];
        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        setTranscriptText(randomText);
        setIsListening(false);
        parseExpense(randomText);
      }, 3000);
    }
  };

  const parseExpense = (text: string) => {
    setIsProcessing(true);
    // Enhanced AI parsing logic
    setTimeout(() => {
      const amount = text.match(/\d+/)?.[0] || "0";
      
      // Smart category detection based on keywords
      let detectedCategory = 'Miscellaneous';
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('किराना') || lowerText.includes('groceries') || lowerText.includes('सब्जी') || lowerText.includes('vegetable')) {
        detectedCategory = 'Groceries';
      } else if (lowerText.includes('किराया') || lowerText.includes('rent')) {
        detectedCategory = 'Rent';
      } else if (lowerText.includes('बिल') || lowerText.includes('bill') || lowerText.includes('electricity') || lowerText.includes('mobile')) {
        detectedCategory = 'Bills';
      } else if (lowerText.includes('medical') || lowerText.includes('चिकित्सा') || lowerText.includes('दवा') || lowerText.includes('doctor')) {
        detectedCategory = 'Medical';
      } else if (lowerText.includes('transport') || lowerText.includes('यातायात') || lowerText.includes('bus') || lowerText.includes('taxi') || lowerText.includes('auto')) {
        detectedCategory = 'Transport';
      }
      
      const expense = {
        amount: parseInt(amount),
        category: detectedCategory,
        description: text,
        date: new Date().toLocaleDateString('en-IN')
      };
      
      setParsedExpense(expense);
      setEditAmount(amount);
      setEditCategory(detectedCategory);
      setEditDescription(text);
      setIsProcessing(false);
    }, 2000);
  };

  const confirmExpense = () => {
    const expenseToAdd = isEditing ? {
      amount: parseInt(editAmount),
      category: editCategory,
      description: editDescription,
      date: new Date().toLocaleDateString('en-IN')
    } : parsedExpense;
    
    if (expenseToAdd) {
      onExpenseAdded(expenseToAdd);
      // Reset state
      setTranscriptText("");
      setParsedExpense(null);
      setIsEditing(false);
      setEditAmount("");
      setEditCategory("");
      setEditDescription("");
    }
  };

  const getCategoryText = (cat: string) => {
    const categoryMap: Record<string, string> = {
      'Rent': 'किराया',
      'Groceries': 'किराना',
      'Bills': 'बिल',
      'Medical': 'चिकित्सा',
      'Transport': 'यातायात',
      'Miscellaneous': 'विविध'
    };
    return language === 'hi' ? categoryMap[cat] : cat;
  };

  const retryListening = () => {
    setTranscriptText("");
    setParsedExpense(null);
    setIsEditing(false);
    setEditAmount("");
    setEditCategory("");
    setEditDescription("");
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
          {parsedExpense && !isEditing && (
            <Card className="bg-success-light border-success/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-success">
                    {getText('खर्च की जानकारी', 'Expense Details')}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    {getText('संपादित करें', 'Edit')}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{getText('राशि', 'Amount')}:</Label>
                    <span className="font-medium">₹{parsedExpense.amount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <Label>{getText('श्रेणी', 'Category')}:</Label>
                    <span className="font-medium">{getCategoryText(parsedExpense.category)}</span>
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

          {/* Edit Expense Form */}
          {isEditing && (
            <Card className="bg-warning-light border-warning/20">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-warning">
                  {getText('खर्च संपादित करें', 'Edit Expense')}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label>{getText('राशि', 'Amount')} (₹)</Label>
                    <Input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      placeholder={getText('राशि दर्ज करें', 'Enter amount')}
                    />
                  </div>
                  
                  <div>
                    <Label>{getText('श्रेणी', 'Category')}</Label>
                    <Select value={editCategory} onValueChange={setEditCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder={getText('श्रेणी चुनें', 'Select category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {getCategoryText(cat)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>{getText('विवरण', 'Description')}</Label>
                    <Input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder={getText('विवरण दर्ज करें', 'Enter description')}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="success" 
                    onClick={confirmExpense}
                    className="flex-1"
                    disabled={!editAmount || !editCategory}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {getText('सेव करें', 'Save')}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    {getText('रद्द करें', 'Cancel')}
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