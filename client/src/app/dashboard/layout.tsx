import Navigation from "@/components/dashboard/Navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-dvh w-full flex divide-x divide-darkSecondary overflow-hidden">
      <Navigation />
      <main className="flex-1 w-full">{children}</main>
    </section>
  );
}
