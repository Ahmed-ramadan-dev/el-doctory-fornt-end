import { useState, useMemo } from 'react';
import { Search, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface SearchBarProps {
  onSearch: (keyword: string, date: string | null) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = 'ابحث...' }: SearchBarProps) => {
  const [keyword, setKeyword] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSearch = () => {
    onSearch(keyword, date ? format(date, 'yyyy-MM-dd') : null);
  };

  const handleClear = () => {
    setKeyword('');
    setDate(undefined);
    onSearch('', null);
  };

  const hasFilters = keyword || date;

  return (
    <div className="sticky top-0 z-10 bg-background px-4 py-3 border-b border-border/50">
      <div className="flex gap-2">
        {/* Keyword Search */}
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pr-10 font-cairo"
          />
        </div>

        {/* Date Picker */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={date ? 'border-primary text-primary' : ''}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setIsCalendarOpen(false);
              }}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <Button onClick={handleSearch} className="font-cairo">
          بحث
        </Button>

        {/* Clear Button */}
        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {date && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground font-cairo">التاريخ:</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-cairo">
            {format(date, 'dd MMMM yyyy', { locale: ar })}
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
