"use client";

import { ApolloWrapper } from "@/apollo-wrapper";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AlertProvider } from "@/providers/alert-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ApolloWrapper>
      <ThemeProvider>
        <QueryProvider>
          <AlertProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </AlertProvider>
        </QueryProvider>
      </ThemeProvider>
    </ApolloWrapper>
  );
}
