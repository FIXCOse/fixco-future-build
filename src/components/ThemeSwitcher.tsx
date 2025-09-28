import React from 'react';
import { useTheme, ThemeId } from '@/theme/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const THEMES: { id: ThemeId; label: string; icon: React.ReactNode }[] = [
  { id: 'dark', label: 'Dark', icon: <span>🌙</span> },
  { id: 'light', label: 'Light', icon: <span>☀️</span> },
  { id: 'ocean', label: 'Ocean', icon: <span>🌊</span> },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const current = THEMES.find(t => t.id === theme)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2 bg-card hover:bg-muted border border-border"
          aria-label="Change theme"
        >
          {current.icon}
          <span className="hidden sm:inline text-sm">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-card border-border shadow-card"
        sideOffset={5}
      >
        {THEMES.map(t => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className="flex items-center gap-3 cursor-pointer hover:bg-muted text-foreground"
            role="menuitemradio"
            aria-checked={theme === t.id}
          >
            <span className="flex items-center justify-center w-4 h-4">
              {t.icon}
            </span>
            <span className="flex-1">{t.label}</span>
            {theme === t.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}