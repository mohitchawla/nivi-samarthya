import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded: (expense: any) => void;
  language: string;
}

const categories = ['Rent', 'Groceries', 'Bills', 'Medical', 'Transport', 'Miscellaneous'];

export const AddExpenseModal = ({ isOpen, onClose, onExpenseAdded, language }: AddExpenseModalProps) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");

  const getText = (hindi: string, english: string) => {
    return language === 'hi' ? hindi : english;
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

  const handleSubmit = () => {
    if (!amount || !category) return;

    const expense = {
      amount: parseInt(amount),
      category,
      description: description || category,
      date: format(date, 'dd/MM/yyyy'),
      phoneNumber: sessionStorage.getItem('userno')
    };

    onExpenseAdded(expense);

    fetch('http://localhost:9090/expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expense)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })

    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {getText('नया खर्च जोड़ें', 'Add New Expense')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">{getText('राशि', 'Amount')} (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder={getText('राशि दर्ज करें', 'Enter amount')}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{getText('श्रेणी', 'Category')}</Label>
            <Select value={category} onValueChange={setCategory}>
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

          <div className="space-y-2">
            <Label>{getText('दिनांक', 'Date')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{getText('विवरण', 'Description')} ({getText('वैकल्पिक', 'Optional')})</Label>
            <Input
              id="description"
              placeholder={getText('विवरण दर्ज करें', 'Enter description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {getText('रद्द करें', 'Cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={!amount || !category}
            >
              {getText('जोड़ें', 'Add')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};