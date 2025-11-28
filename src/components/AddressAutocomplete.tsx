import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface PhotonFeature {
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

interface ParsedAddress {
  street: string;
  postalCode: string;
  city: string;
}

interface PhotonResponse {
  features: PhotonFeature[];
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: ParsedAddress) => void;
  placeholder?: string;
}

export const AddressAutocomplete = ({ 
  value, 
  onChange, 
  onSelect,
  placeholder = "Ex: Storgatan 12" 
}: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedValue = useDebounce(value, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedValue.length < 3) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?` +
          `q=${encodeURIComponent(debouncedValue + ', Sverige')}` +
          `&lang=sv` +
          `&lat=59.33&lon=18.06` +
          `&limit=5`
        );

        if (response.ok) {
          const data: PhotonResponse = await response.json();
          setSuggestions(data.features || []);
          setShowDropdown(data.features && data.features.length > 0);
          setSelectedIndex(-1);
        }
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const parseAddress = (feature: PhotonFeature): ParsedAddress => {
    const props = feature.properties;
    const street = props.street && props.housenumber
      ? `${props.street} ${props.housenumber}`
      : props.street || props.name || '';
    const postalCode = props.postcode || '';
    const city = props.city || props.state || '';

    return { street, postalCode, city };
  };

  const handleSelect = (feature: PhotonFeature) => {
    const parsed = parseAddress(feature);
    onChange(parsed.street);
    onSelect(parsed);
    setShowDropdown(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full p-3 pl-10 rounded-lg border border-border bg-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          placeholder={placeholder}
          autoComplete="off"
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-background border border-border rounded-lg shadow-elegant max-h-64 overflow-y-auto"
        >
          {suggestions.map((feature, index) => {
            const parsed = parseAddress(feature);
            return (
              <button
                key={index}
                onClick={() => handleSelect(feature)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-secondary/80 transition-colors border-b border-border last:border-b-0",
                  selectedIndex === index && "bg-secondary/80"
                )}
              >
                <div className="font-medium text-sm">{parsed.street}</div>
                <div className="text-xs text-muted-foreground">
                  {parsed.postalCode} {parsed.city}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* No results */}
      {showDropdown && !isLoading && debouncedValue.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-lg shadow-elegant p-4 text-center text-sm text-muted-foreground">
          Inga adresser hittades
        </div>
      )}
    </div>
  );
};
