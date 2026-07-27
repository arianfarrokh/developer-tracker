import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SetupVerification } from "@/components/shared/setup-verification";
import { AppProviders } from "@/providers/app-providers";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <SetupVerification />
      <DashboardLayout>{children}</DashboardLayout>
    </AppProviders>
  );
}
