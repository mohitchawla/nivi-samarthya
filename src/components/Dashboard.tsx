import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  EyeOff
} from "lucide-react";

interface DashboardProps {
  language: string;
  userIncome: string;
  onVoiceInput: () => void;
  onChatbot: () => void;
  onRecommendations: () => void;
}

export const Dashboard = ({ language, userIncome, onVoiceInput, onChatbot, onRecommendations }: DashboardProps) => {
  const [showBalance, setShowBalance] = useState(true);
  
  // Sample data - in real app this would come from backend
  const financialData = {
    totalIncome: 18000,
    totalExpenses: 14500,
    savings: 3500,
    rating: 4,
    categories: [
      { name: 'Essentials', amount: 8000, color: 'bg-destructive', percentage: 55 },
      { name: 'Bills', amount: 3500, color: 'bg-warning', percentage: 24 },
      { name: 'Discretionary', amount: 2000, color: 'bg-primary', percentage: 14 },
      { name: 'Miscellaneous', amount: 1000, color: 'bg-secondary', percentage: 7 },
    ]
  };

  const getText = (hindi: string, english: string) => {
    return language === 'hi' ? hindi : english;
  };

  const formatAmount = (amount: number) => {
    return showBalance ? `₹${amount.toLocaleString('en-IN')}` : '••••••';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20 p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {getText('नमस्ते! 🙏', 'Hello! 👋')}
          </h1>
          <p className="text-muted-foreground">
            {getText('आपका वित्तीय साथी', 'Your Financial Companion')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </Button>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < financialData.rating ? 'fill-secondary text-secondary' : 'text-muted'}`} 
              />
            ))}
          </div>
        </div>
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
              {formatAmount(financialData.totalIncome)}
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
              {formatAmount(financialData.totalExpenses)}
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
              {formatAmount(financialData.savings)}
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
          {financialData.categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{getText(
                  category.name === 'Essentials' ? 'जरूरी सामान' :
                  category.name === 'Bills' ? 'बिल' :
                  category.name === 'Discretionary' ? 'विकल्प' : 'विविध',
                  category.name
                )}</span>
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
      >
        <Plus className="w-4 h-4 mr-2" />
        {getText('नया खर्च जोड़ें', 'Add New Expense')}
      </Button>
    </div>
  );
};