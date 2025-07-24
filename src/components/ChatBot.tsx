import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Send, 
  Mic, 
  Volume2, 
  ArrowLeft,
  Bot,
  User
} from "lucide-react";

interface ChatBotProps {
  language: string;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatBot = ({ language, onBack }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'hi' 
        ? 'नमस्ते! मैं आपका वित्तीय सहायक हूँ। मैं आपकी पैसों की समस्याओं में मदद कर सकता हूँ।'
        : 'Hello! I am your financial assistant. I can help you with your money-related questions.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const getText = (hindi: string, english: string) => {
    return language === 'hi' ? hindi : english;
  };

  const faqs = [
    {
      question: getText('मैं कैसे पैसे बचा सकता हूँ?', 'How can I save money?'),
      answer: getText(
        'पैसे बचाने के लिए: 1) अपने खर्चों को ट्रैक करें 2) जरूरी और गैर-जरूरी चीजों में अंतर करें 3) महीने की शुरुआत में ही बचत अलग कर दें',
        'To save money: 1) Track your expenses 2) Differentiate between needs and wants 3) Save money at the beginning of the month'
      )
    },
    {
      question: getText('क्या मुझे निवेश करना चाहिए?', 'Should I invest?'),
      answer: getText(
        'हाँ, निवेश करना अच्छा है। कम राशि से शुरू करें जैसे ₹500/महीना SIP में। PPF और NSC भी सुरक्षित विकल्प हैं।',
        'Yes, investing is good. Start with small amounts like ₹500/month in SIP. PPF and NSC are also safe options.'
      )
    },
    {
      question: getText('इमरजेंसी फंड क्या है?', 'What is emergency fund?'),
      answer: getText(
        'इमरजेंसी फंड आपके 6 महीने के खर्च के बराबर होना चाहिए। यह अचानक आने वाली समस्याओं के लिए है।',
        'Emergency fund should be equal to 6 months of your expenses. It is for unexpected financial problems.'
      )
    }
  ];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const generateBotResponse = (userText: string) => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('save') || lowerText.includes('बचत')) {
      return getText(
        'बचत के लिए 50-30-20 रूल फॉलो करें: 50% जरूरी चीजों पर, 30% चाहतों पर, 20% बचत पर खर्च करें।',
        'Follow the 50-30-20 rule for savings: 50% on needs, 30% on wants, 20% on savings.'
      );
    }
    
    if (lowerText.includes('invest') || lowerText.includes('निवेश')) {
      return getText(
        'शुरुआत में SIP mutual funds अच्छे हैं। ₹500 से शुरू करके धीरे-धीरे बढ़ाएं।',
        'SIP mutual funds are good for beginners. Start with ₹500 and gradually increase.'
      );
    }
    
    if (lowerText.includes('emergency') || lowerText.includes('इमरजेंसी')) {
      return getText(
        'इमरजेंसी फंड बैंक सेविंग्स अकाउंट में रखें जहाँ आसानी से पैसे निकाल सकें।',
        'Keep emergency fund in bank savings account where you can easily withdraw money.'
      );
    }

    return getText(
      'मैं आपकी मदद करना चाहता हूँ। कृपया अपना सवाल और स्पष्ट रूप से पूछें।',
      'I want to help you. Please ask your question more clearly.'
    );
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      const voiceTexts = [
        getText('मुझे पैसे बचाने के तरीके बताएं', 'Tell me ways to save money'),
        getText('निवेश कैसे करें?', 'How to invest?'),
        getText('इमरजेंसी फंड कितना रखना चाहिए?', 'How much emergency fund should I keep?')
      ];
      const randomText = voiceTexts[Math.floor(Math.random() * voiceTexts.length)];
      setInputText(randomText);
      setIsListening(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary-light/20 p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">
          {getText('वित्त सहायक', 'Finance Assistant')}
        </h1>
      </div>

      {/* FAQ Chips */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">
          {getText('सामान्य प्रश्न:', 'Common Questions:')}
        </p>
        <div className="flex flex-wrap gap-2">
          {faqs.map((faq, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => sendMessage(faq.question)}
              className="text-xs h-auto py-2"
            >
              {faq.question}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 shadow-card mb-4">
        <CardContent className="p-4 h-full">
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Input Area */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={getText('अपना सवाल यहाँ टाइप करें...', 'Type your question here...')}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                className="flex-1"
              />
              <Button
                variant="voice"
                size="icon"
                onClick={handleVoiceInput}
                disabled={isListening}
                className={isListening ? 'animate-pulse' : ''}
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {isListening && (
            <p className="text-sm text-warning text-center mt-2 animate-pulse">
              {getText('सुन रहे हैं...', 'Listening...')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};