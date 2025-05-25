import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PropsWithChildren } from "react";
import { AdvocatesProvider } from "./AdvocatesProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solace Candidate Assignment",
  description: "Show us what you got",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={`antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 ${inter.className}`}
      >
        <main style={{ margin: "24px" }}>
          <AdvocatesProvider>{children}</AdvocatesProvider>
        </main>
      </body>
    </html>
  );
}
