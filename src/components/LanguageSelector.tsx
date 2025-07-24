import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Globe } from "lucide-react";

const languages = [
  { code: 'hi', name: 'हिंदी', nameEng: 'Hindi' },
  { code: 'en', name: 'English', nameEng: 'English' },
  { code: 'mr', name: 'मराठी', nameEng: 'Marathi' },
  { code: 'te', name: 'తెలుగు', nameEng: 'Telugu' },
  { code: 'ta', name: 'தமிழ்', nameEng: 'Tamil' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', nameEng: 'Punjabi' },
  { code: 'bn', name: 'বাংলা', nameEng: 'Bengali' },
  { code: 'gu', name: 'ગુજરાતી', nameEng: 'Gujarati' },
];

interface LanguageSelectorProps {
  onLanguageSelect: (language: string) => void;
  selectedLanguage?: string;
}

export const LanguageSelector = ({ onLanguageSelect, selectedLanguage }: LanguageSelectorProps) => {
  const [selected, setSelected] = useState(selectedLanguage || '');

  const handleSelect = (langCode: string) => {
    setSelected(langCode);
    onLanguageSelect(langCode);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center mb-2">
          <Globe className="w-6 h-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-xl font-semibold">भाषा चुनें / Choose Language</CardTitle>
        <CardDescription>अपनी पसंदीदा भाषा का चयन करें</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={selected === lang.code ? "success" : "outline"}
              onClick={() => handleSelect(lang.code)}
              className="h-auto p-4 flex flex-col items-center justify-center relative"
            >
              {selected === lang.code && (
                <Check className="absolute top-2 right-2 w-4 h-4" />
              )}
              <span className="font-medium text-base">{lang.name}</span>
              <span className="text-xs opacity-70">{lang.nameEng}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};