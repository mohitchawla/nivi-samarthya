import { useState, useEffect } from "react";
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
  User,
  MicOff
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: language === 'hi'
        ? 'नमस्ते! मैं आपका वित्तीय सहायक हूँ। मैं आपकी पैसों की समस्याओं में मदद कर सकता हूँ।'
        : 'Hello! I am your financial assistant. I can help you with your money-related questions.',
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [language]);

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
      generateBotResponse(text);
    }, 1000);
  };

  const generateBotResponse = (userText: string) => {
    fetch('http://localhost:9090/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question: userText })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        response.text().then(resp => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: resp,
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);

          // Speak the response
          speakResponse(resp)
        });
      })
  };

  const handleVoiceInput = () => {
    setIsListening(true);

    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        // Fallback to sample data on error
        const voiceTexts = [
          getText('मुझे पैसे बचाने के तरीके बताएं', 'Tell me ways to save money'),
          getText('निवेश कैसे करें?', 'How to invest?'),
          getText('इमरजेंसी फंड कितना रखना चाहिए?', 'How much emergency fund should I keep?')
        ];
        const randomText = voiceTexts[Math.floor(Math.random() * voiceTexts.length)];
        setInputText(randomText);
      };

      recognition.start();
    } else {
      // Fallback for browsers without speech recognition
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
    }
  };

  const speakResponse = (text: string) => {
    setIsSpeaking(true);

    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.8;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    } else {
      // Fallback - just simulate speaking
      setTimeout(() => {
        setIsSpeaking(false);
      }, 3000);
    }
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
                    className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'user'
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
                variant={isListening ? "destructive" : "voice"}
                size="icon"
                onClick={isListening ? () => setIsListening(false) : handleVoiceInput}
                disabled={isSpeaking}
                className={isListening ? 'animate-pulse' : ''}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
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

          {isSpeaking && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Volume2 className="w-4 h-4 text-primary animate-pulse" />
              <p className="text-sm text-primary animate-pulse">
                {getText('बोल रहे हैं...', 'Speaking...')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};