import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QUERYLAB — Think in Queries. Crack Real Interviews.",
  description:
    "A comprehensive interview preparation platform for aspiring Data Analysts, Data Scientists, Business Analysts, and Analytics Engineers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0B0D10] text-[#F4F5F7] selection:bg-[#A3E635]/20 selection:text-[#A3E635]">
        {children}
      </body>
    </html>
  );
}
