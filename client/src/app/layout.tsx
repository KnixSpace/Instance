import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/Layout/NavbarWrapper";

export const metadata: Metadata = {
  title: "Instance",
  description: "Automation Workflow Builder",
};

const dm_sans = DM_Sans({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dm_sans.className} antialiased`}>
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}
