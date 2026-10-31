import type { Metadata } from "next";
import { Nunito, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Media Model Quality Tracker",
  description: "Daily snapshots of AI media model quality from Artificial Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-bg-surface border-b border-border-default px-4 py-2 text-center text-sm text-text-secondary">
            Link to Artificial Analysis leaderboards here:{" "}
            <a
              href="https://huggingface.co/ArtificialAnalysis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:underline"
            >
              https://huggingface.co/ArtificialAnalysis
            </a>
          </div>
        <header className="border-b border-border-default bg-bg-header">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-xl font-bold text-text-primary hover:text-accent-blue transition-colors">
              AI Media Model Quality Tracker
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
