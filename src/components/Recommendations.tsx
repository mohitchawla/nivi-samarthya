import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Heart,
  Lightbulb,
  Target,
  ArrowLeft,
  ExternalLink
} from "lucide-react";

interface RecommendationsProps {
  language: string;
  onBack: () => void;
  userIncome: string;
}

export const Recommendations = ({ language, onBack, userIncome }: RecommendationsProps) => {
  const getText = (hindi: string, english: string) => {
    return language === 'hi' ? hindi : english;
  };

  const investmentSuggestions = [
    {
      title: getText('पब्लिक प्रोविडेंट फंड (PPF)', 'Public Provident Fund (PPF)'),
      description: getText('15 साल में टैक्स फ्री रिटर्न', '15-year tax-free returns'),
      amount: '₹500/month',
      returns: '7.1% annually',
      risk: 'Low',
      icon: <Shield className="w-5 h-5 text-success" />
    },
    {
      title: getText('SIP म्यूचुअल फंड', 'SIP Mutual Funds'),
      description: getText('मार्केट से जुड़े रिटर्न', 'Market-linked returns'),
      amount: '₹1000/month',
      returns: '12-15% annually',
      risk: 'Medium',
      icon: <TrendingUp className="w-5 h-5 text-primary" />
    },
    {
      title: getText('राष्ट्रीय पेंशन योजना (NPS)', 'National Pension System (NPS)'),
      description: getText('रिटायरमेंट के लिए बचत', 'Retirement savings'),
      amount: '₹500/month',
      returns: '8-10% annually',
      risk: 'Low-Medium',
      icon: <Target className="w-5 h-5 text-secondary" />
    }
  ];

  const savingsTips = [
    {
      tip: getText('कॉफी शॉप की बजाय घर की चाय पिएं', 'Drink homemade tea instead of coffee shop'),
      savings: '₹150/week',
      icon: <Lightbulb className="w-4 h-4 text-warning" />
    },
    {
      tip: getText('सब्जी सुबह जल्दी खरीदें', 'Buy vegetables early morning for better prices'),
      savings: '₹200/month',
      icon: <DollarSign className="w-4 h-4 text-success" />
    },
    {
      tip: getText('बिजली के बिल को कम करें', 'Reduce electricity bills'),
      savings: '₹300/month',
      icon: <Lightbulb className="w-4 h-4 text-warning" />
    }
  ];

  const currentInvestments = [
    {
      type: getText('बैंक सेविंग्स', 'Bank Savings'),
      amount: '₹25,000',
      returns: '3.5%',
      status: 'Active'
    },
    {
      type: getText('फिक्स्ड डिपॉजिट', 'Fixed Deposit'),
      amount: '₹50,000',
      returns: '5.5%',
      status: 'Active'
    }
  ];

  const emergencySupport = [
    {
      title: getText('आयुष्मान भारत योजना', 'Ayushman Bharat Scheme'),
      description: getText('₹5 लाख तक का फ्री इलाज', 'Free treatment up to ₹5 lakhs'),
      type: 'Government',
      icon: <Heart className="w-5 h-5 text-destructive" />
    },
    {
      title: getText('स्थानीय सरकारी अस्पताल', 'Local Government Hospital'),
      description: getText('कम कीमत में बेहतर इलाज', 'Quality treatment at low cost'),
      type: 'Hospital',
      icon: <Shield className="w-5 h-5 text-primary" />
    },
    {
      title: getText('हेल्थ इंश्योरेंस', 'Health Insurance'),
      description: getText('₹200/month में ₹2 लाख कवर', '₹2 lakh cover for ₹200/month'),
      type: 'Insurance',
      icon: <Heart className="w-5 h-5 text-success" />
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20 p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">
          {getText('वित्तीय सुझाव', 'Financial Recommendations')}
        </h1>
      </div>

      {/* Investment Suggestions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            {getText('निवेश के सुझाव', 'Investment Suggestions')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {investmentSuggestions.map((investment, index) => (
            <Card key={index} className="border border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {investment.icon}
                    <div>
                      <h3 className="font-semibold text-sm">{investment.title}</h3>
                      <p className="text-xs text-muted-foreground">{investment.description}</p>
                    </div>
                  </div>
                  <Badge className={getRiskColor(investment.risk)}>
                    {investment.risk}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">{investment.amount}</span>
                    <span className="text-muted-foreground"> • {investment.returns}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {getText('जानें', 'Learn')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Savings Tips */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-warning" />
            {getText('बचत के टिप्स', 'Savings Tips')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {savingsTips.map((tip, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              {tip.icon}
              <div className="flex-1">
                <p className="text-sm font-medium">{tip.tip}</p>
                <p className="text-xs text-success font-medium">
                  {getText('बचत:', 'Save:')} {tip.savings}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Current Investments */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            {getText('मौजूदा निवेश', 'Current Investments')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentInvestments.map((investment, index) => (
            <div key={index} className="flex justify-between items-center p-3 border border-border/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{investment.type}</p>
                <p className="text-xs text-muted-foreground">
                  {investment.returns} {getText('रिटर्न', 'returns')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{investment.amount}</p>
                <Badge variant="outline" className="text-xs">
                  {investment.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Emergency Medical Support */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-destructive" />
            {getText('इमरजेंसी मेडिकल सहायता', 'Emergency Medical Support')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {emergencySupport.map((support, index) => (
            <Card key={index} className="border border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  {support.icon}
                  <div>
                    <h3 className="font-semibold text-sm">{support.title}</h3>
                    <p className="text-xs text-muted-foreground">{support.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{support.type}</Badge>
                  <Button size="sm" variant="outline">
                    {getText('विवरण', 'Details')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};