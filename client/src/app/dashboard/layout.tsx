import Navigation from "@/components/dashboard/Navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full flex divide-x divide-secondary">
      <Navigation />
      <main className="flex-1 w-full">{children}</main>
      {/* <div className="flex-1 w-full">
      </div> */}
    </section>
  );
}
