import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddExpenseModal } from "./AddExpenseModal";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Mic,
  Star,
  MessageCircle,
  Plus,
  Eye,
  EyeOff,
  Globe,
  Calendar
} from "lucide-react";

interface DashboardProps {
  language: string;
  onVoiceInput: () => void;
  onChatbot: () => void;
  onRecommendations: () => void;
  onLanguageChange: (language: string) => void;
  onExpenseAdded: (expense: any) => void;
}

export const Dashboard = ({ language, onVoiceInput, onChatbot, onRecommendations, onLanguageChange, onExpenseAdded }: DashboardProps) => {
  const [showBalance, setShowBalance] = useState(true);
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [baseData, setBaseData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    savings: 0,
    categories: []
  });

  // Sample data - in real app this would come from backend
  const getFinancialData = () => {

    fetch('http://localhost:9090/expense/' + sessionStorage.getItem("userno"), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        response.json().then(data => {
          if (timeFilter === 'daily') {
            setBaseData(
              {
                totalIncome: data.totalIncome,
                totalExpenses: data.totalExpenses,
                savings: data.savings,
                categories: data.expenseResponses.map(cat => ({
                  ...cat,
                  amount: Math.round(cat.amount / 30)
                }))
              }
            )
          } else if (timeFilter === 'weekly') {
            setBaseData(
              {
                totalIncome: data.totalIncome,
                totalExpenses: data.totalExpenses,
                savings: data.savings,
                categories: data.expenseResponses.map(cat => ({
                  ...cat,
                  amount: Math.round(cat.amount / 4)
                }))
              }
            )
          } else if (timeFilter === 'monthly') {
            setBaseData(
              {
                totalIncome: data.totalIncome,
                totalExpenses: data.totalExpenses,
                savings: data.savings,
                categories: data.expenseResponses.map(cat => ({
                  ...cat,
                  amount: Math.round(cat.amount / 1)
                }))
              }
            )
          }
        });
      })
  };

  getFinancialData();

  // Calculate user rating based on expense reduction
  const calculateRating = () => {
    const currentExpenses = baseData.totalExpenses * (timeFilter === 'daily' ? 30 : timeFilter === 'weekly' ? 4 : 1);
    const previousExpenses = 16200; // Previous month data
    const improvement = ((previousExpenses - currentExpenses) / previousExpenses) * 100;

    if (improvement >= 15) return 5;
    if (improvement >= 10) return 4;
    if (improvement >= 5) return 3;
    if (improvement >= 0) return 2;
    return 1;
  };

  const rating = calculateRating();

  const getRatingText = () => {
    const improvements = {
      5: { hi: "बेहतरीन! आप बचत के चैंपियन हैं! 🏆", en: "Excellent! You're a savings champion! 🏆" },
      4: { hi: "बहुत अच्छा! आप सही दिशा में हैं! 🌟", en: "Great job! You're on the right track! 🌟" },
      3: { hi: "अच्छा प्रदर्शन! और भी बेहतर कर सकते हैं! 💪", en: "Good work! You can do even better! 💪" },
      2: { hi: "शुरुआत अच्छी है! कुछ और मेहनत करें! 📈", en: "Good start! Try a bit harder! 📈" },
      1: { hi: "चिंता न करें! छोटे कदम उठाएं! 🎯", en: "Don't worry! Take small steps! 🎯" }
    };
    return language === 'hi' ? improvements[rating as keyof typeof improvements].hi : improvements[rating as keyof typeof improvements].en;
  };

  const languages = [
    { code: 'hi', name: 'हिंदी' },
    { code: 'en', name: 'English' },
    { code: 'mr', name: 'मराठी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'gu', name: 'ગુજરાતી' },
  ];

  const getText = (hindi: string, english: string) => {
    return language === 'hi' ? hindi : english;
  };

  const formatAmount = (amount: number) => {
    return showBalance ? `₹${amount.toLocaleString('en-IN')}` : '••••••';
  };

  const getCategoryText = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Rent': 'किराया',
      'Groceries': 'किराना',
      'Bills': 'बिल',
      'Medical': 'चिकित्सा',
      'Transport': 'यातायात',
      'Miscellaneous': 'विविध'
    };
    return language === 'hi' ? categoryMap[category] || category : category;
  };

  const handleExpenseAdded = (expense: any) => {
    onExpenseAdded(expense);
    setShowAddExpense(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20 p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {getText('नमस्ते! 🙏', 'Hello! 👋')}
          </h1>
          <p className="text-muted-foreground">
            {getText('आपका वित्तीय साथी', 'Your Financial Companion')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-32">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* User Rating */}
      <Card className="shadow-card mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < rating ? 'fill-warning text-warning' : 'text-muted'}`}
                  />
                ))}
              </div>
              <div>
                <p className="font-semibold text-foreground">{getText('आपकी रेटिंग', 'Your Rating')}</p>
                <p className="text-sm text-muted-foreground">{getRatingText()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Filter */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">{getText('दैनिक', 'Daily')}</SelectItem>
            <SelectItem value="weekly">{getText('साप्ताहिक', 'Weekly')}</SelectItem>
            <SelectItem value="monthly">{getText('मासिक', 'Monthly')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {getText('कुल आय', 'Total Income')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatAmount(baseData.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {getText('इस महीने', 'This month')}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {getText('कुल खर्च', 'Total Expenses')}
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatAmount(baseData.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              {getText('इस महीने', 'This month')}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {getText('बचत', 'Savings')}
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatAmount(baseData.savings)}
            </div>
            <p className="text-xs text-muted-foreground">
              {getText('उपलब्ध राशि', 'Available amount')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Categories */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            {getText('खर्च विभाजन', 'Expense Breakdown')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {baseData.categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{getCategoryText(category.name)}</span>
                <span className="font-medium">{formatAmount(category.amount)}</span>
              </div>
              <Progress value={category.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="voice"
          size="voice"
          onClick={onVoiceInput}
          className="h-20 flex-col gap-2"
        >
          <Mic className="w-6 h-6" />
          <span className="text-sm font-medium">
            {getText('आवाज़ से जोड़ें', 'Voice Input')}
          </span>
        </Button>

        <Button
          variant="secondary"
          onClick={onChatbot}
          className="h-20 flex-col gap-2"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-sm font-medium">
            {getText('वित्त सहायक', 'Finance Assistant')}
          </span>
        </Button>
      </div>

      {/* AI Recommendations Button */}
      <Button
        variant="success"
        onClick={onRecommendations}
        className="w-full"
        size="lg"
      >
        <TrendingUp className="w-4 h-4 mr-2" />
        {getText('AI सुझाव देखें', 'View AI Recommendations')}
      </Button>

      {/* Quick Add Button */}
      <Button
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => setShowAddExpense(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        {getText('नया खर्च जोड़ें', 'Add New Expense')}
      </Button>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onExpenseAdded={handleExpenseAdded}
        language={language}
      />
    </div>
  );
};