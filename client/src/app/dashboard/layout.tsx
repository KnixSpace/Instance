import Navigation from "@/components/dashboard/Navigation";
import { ReactFlowProvider } from "@xyflow/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactFlowProvider>
      <section className="h-dvh w-full flex divide-x divide-darkSecondary overflow-hidden">
        <Navigation />
        <main className="flex-1 w-full">{children}</main>
      </section>
    </ReactFlowProvider>
  );
}
