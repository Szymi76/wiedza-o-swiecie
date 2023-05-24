import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wiedza o świecie",
  description: "Gra oparta na danych i statystykach o miastach, krajach i kontynentach.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl-PL">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
