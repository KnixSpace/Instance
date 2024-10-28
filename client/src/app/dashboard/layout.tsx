import Navigation from "@/components/dashboard/Navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full flex divide-x divide-secondary">
      <Navigation />
      <div className="flex-1">
        <main className="p-4">{children}</main>
      </div>
    </section>
  );
}
