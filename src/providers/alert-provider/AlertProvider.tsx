"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AlertContextType, AlertOptions } from "./types";

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within <AlertProvider>");
  return ctx;
};

const DEFAULT_DURATION = 4000;

function formatDescription(description?: string[]): ReactNode | undefined {
  if (!description?.length) return undefined;
  if (description.length === 1) return description[0];

  return (
    <ul className="mt-1 list-inside list-disc space-y-0.5">
      {description.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

function showToast(options: AlertOptions): string {
  const duration = options.duration ?? DEFAULT_DURATION;
  const toastOptions = {
    description: formatDescription(options.description),
    duration,
    action: options.action,
  };

  const title = options.title ?? "";
  const variant = options.variant ?? "default";

  let id: string | number;

  switch (variant) {
    case "success":
      id = toast.success(title, toastOptions);
      break;
    case "error":
      id = toast.error(title, toastOptions);
      break;
    case "warning":
      id = toast.warning(title, toastOptions);
      break;
    case "info":
      id = toast.info(title, toastOptions);
      break;
    default:
      id = toast(title, toastOptions);
  }

  return String(id);
}

export function AlertProvider({ children }: PropsWithChildren) {
  const show = useCallback((options: AlertOptions) => showToast(options), []);

  const success = useCallback(
    (title?: string, description?: string[]) =>
      show({ title, description, variant: "success" }),
    [show],
  );

  const error = useCallback(
    (title?: string, description?: string[]) =>
      show({ title, description, variant: "error" }),
    [show],
  );

  const warning = useCallback(
    (title?: string, description?: string[]) =>
      show({ title, description, variant: "warning" }),
    [show],
  );

  const info = useCallback(
    (title?: string, description?: string[]) =>
      show({ title, description, variant: "info" }),
    [show],
  );

  const dismiss = useCallback((id: string) => {
    toast.dismiss(id);
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  const ctx = useMemo<AlertContextType>(
    () => ({
      show,
      success,
      error,
      warning,
      info,
      dismiss,
      dismissAll,
    }),
    [show, success, error, warning, info, dismiss, dismissAll],
  );

  return (
    <AlertContext.Provider value={ctx}>
      {children}
      <Toaster closeButton position="bottom-left" visibleToasts={5} richColors />
    </AlertContext.Provider>
  );
}
