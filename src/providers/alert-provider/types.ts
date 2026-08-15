export type AlertVariant = "success" | "error" | "warning" | "info" | "default";

export interface AlertOptions {
  title?: string;
  description?: string[];
  variant?: AlertVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface AlertItem extends AlertOptions {
  id: string;
}

export interface AlertContextType {
  show: (options: AlertOptions) => string;
  success: (title?: string, description?: string[]) => string;
  error: (title?: string, description?: string[]) => string;
  warning: (title?: string, description?: string[]) => string;
  info: (title?: string, description?: string[]) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}
