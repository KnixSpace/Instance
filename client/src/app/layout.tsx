import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/Layout/NavbarWrapper";
import StoreProvider from "./StoreProvider";

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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <StoreProvider>
        <body className={`${dm_sans.className} antialiased`}>
          <NavbarWrapper />
          {children}
        </body>
      </StoreProvider>
    </html>
  );
}
