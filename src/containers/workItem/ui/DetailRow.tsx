import { ReactNode } from "react";

type DetailRowProps = {
    icon: ReactNode;
    label: string;
    value: ReactNode;
  };

export default function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/15 px-4 py-3">
      <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>
      <div className="min-w-0 space-y-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}