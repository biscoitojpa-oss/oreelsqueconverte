import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioCardProps {
  value: string;
  label: string;
  selected: boolean;
  onSelect: (value: string) => void;
  icon?: React.ReactNode;
}

export function RadioCard({ value, label, selected, onSelect, icon }: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "relative flex items-center gap-3 w-full p-4 rounded-lg border transition-all duration-200 text-left",
        "hover:border-primary/50 hover:bg-secondary/50",
        selected
          ? "border-primary bg-primary/10 glow-sm"
          : "border-border bg-card"
      )}
    >
      <div
        className={cn(
          "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
          selected ? "border-primary bg-primary" : "border-muted-foreground"
        )}
      >
        {selected && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
      </div>
      {icon && <span className="text-primary">{icon}</span>}
      <span className={cn("text-sm font-medium", selected ? "text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
    </button>
  );
}

interface RadioCardGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  className?: string;
}

export function RadioCardGroup({ value, onValueChange, options, className }: RadioCardGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {options.map((option) => (
        <RadioCard
          key={option.value}
          value={option.value}
          label={option.label}
          icon={option.icon}
          selected={value === option.value}
          onSelect={onValueChange}
        />
      ))}
    </div>
  );
}
