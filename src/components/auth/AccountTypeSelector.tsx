import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type AccountType = 'private' | 'company' | 'brf';

interface AccountTypeSelectorProps {
  value: AccountType;
  onChange: (value: AccountType) => void;
  disabled?: boolean;
}

export function AccountTypeSelector({ value, onChange, disabled }: AccountTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Kontotyp</label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(newValue) => {
          if (newValue && newValue !== value) {
            onChange(newValue as AccountType);
          }
        }}
        disabled={disabled}
        className="grid grid-cols-3 gap-2 w-full"
      >
        <ToggleGroupItem
          value="private"
          className="
            h-9 rounded-xl border bg-card text-card-foreground
            data-[state=on]:bg-primary data-[state=on]:text-primary-foreground
            hover:bg-muted transition-colors
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          "
          onMouseDown={(e) => e.stopPropagation()}
        >
          Privat
        </ToggleGroupItem>
        <ToggleGroupItem
          value="company"
          className="
            h-9 rounded-xl border bg-card text-card-foreground
            data-[state=on]:bg-primary data-[state=on]:text-primary-foreground
            hover:bg-muted transition-colors
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          "
          onMouseDown={(e) => e.stopPropagation()}
        >
          Företag
        </ToggleGroupItem>
        <ToggleGroupItem
          value="brf"
          className="
            h-9 rounded-xl border bg-card text-card-foreground
            data-[state=on]:bg-primary data-[state=on]:text-primary-foreground
            hover:bg-muted transition-colors
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          "
          onMouseDown={(e) => e.stopPropagation()}
        >
          BRF
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}