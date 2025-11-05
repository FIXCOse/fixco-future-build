import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { AnalyticsFilters } from '@/lib/api/analytics';

interface AnalyticsFiltersProps {
  onFilterChange: (filters: AnalyticsFilters) => void;
}

const datePresets = [
  { label: '7 dagar', days: 7 },
  { label: '30 dagar', days: 30 },
  { label: '90 dagar', days: 90 },
  { label: '1 år', days: 365 },
];

export function AnalyticsFilters({ onFilterChange }: AnalyticsFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Initialize from URL params
  const [startDate, setStartDate] = useState<Date>(() => {
    const param = searchParams.get('start');
    return param ? new Date(param) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  });

  const [endDate, setEndDate] = useState<Date>(() => {
    const param = searchParams.get('end');
    return param ? new Date(param) : new Date();
  });

  const [customerTypes, setCustomerTypes] = useState<('company' | 'private' | 'brf')[]>(() => {
    const param = searchParams.get('types');
    return param ? param.split(',') as ('company' | 'private' | 'brf')[] : [];
  });

  // Update URL params and trigger filter change
  useEffect(() => {
    const filters: AnalyticsFilters = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      customerTypes: customerTypes.length > 0 ? customerTypes : undefined,
    };

    // Update URL
    const params = new URLSearchParams();
    params.set('start', startDate.toISOString().split('T')[0]);
    params.set('end', endDate.toISOString().split('T')[0]);
    if (customerTypes.length > 0) {
      params.set('types', customerTypes.join(','));
    }
    setSearchParams(params, { replace: true });

    onFilterChange(filters);
  }, [startDate, endDate, customerTypes]);

  const handlePresetClick = (days: number) => {
    setEndDate(new Date());
    setStartDate(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
  };

  const handleCustomerTypeChange = (type: 'company' | 'private' | 'brf', checked: boolean) => {
    if (checked) {
      setCustomerTypes([...customerTypes, type]);
    } else {
      setCustomerTypes(customerTypes.filter((t) => t !== type));
    }
  };

  const handleReset = () => {
    setStartDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    setEndDate(new Date());
    setCustomerTypes([]);
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Filter:</span>
        </div>

        {/* Date Presets */}
        <div className="flex gap-2">
          {datePresets.map((preset) => (
            <Button
              key={preset.days}
              variant="outline"
              size="sm"
              onClick={() => handlePresetClick(preset.days)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Custom Date Range */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(!startDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : 'Startdatum'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground">till</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(!endDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : 'Slutdatum'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Customer Type Filter */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Kundtyp
              {customerTypes.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {customerTypes.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-3">
              <h4 className="font-medium">Filtrera kundtyp</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="company"
                    checked={customerTypes.includes('company')}
                    onCheckedChange={(checked) =>
                      handleCustomerTypeChange('company', checked as boolean)
                    }
                  />
                  <Label htmlFor="company" className="cursor-pointer">
                    Företag
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="private"
                    checked={customerTypes.includes('private')}
                    onCheckedChange={(checked) =>
                      handleCustomerTypeChange('private', checked as boolean)
                    }
                  />
                  <Label htmlFor="private" className="cursor-pointer">
                    Privat
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="brf"
                    checked={customerTypes.includes('brf')}
                    onCheckedChange={(checked) =>
                      handleCustomerTypeChange('brf', checked as boolean)
                    }
                  />
                  <Label htmlFor="brf" className="cursor-pointer">
                    BRF
                  </Label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Reset Button */}
        {(customerTypes.length > 0 || 
          startDate.getTime() !== new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime()) && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <X className="h-4 w-4 mr-1" />
            Återställ
          </Button>
        )}
      </div>
    </Card>
  );
}
