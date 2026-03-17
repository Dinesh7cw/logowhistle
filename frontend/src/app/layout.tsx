import type { Metadata } from "next";
import { Work_Sans, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const workSans = Work_Sans({ subsets: ["latin"], variable: '--font-work-sans' });
const lora = Lora({ subsets: ["latin"], variable: '--font-lora' });

export const metadata: Metadata = {
  title: "LogoWhistle | Professional Logo Design Agency",
  description: "Tailored logo design services that listen and build your brand identity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${workSans.variable} ${lora.variable} font-sans min-h-screen flex flex-col bg-white text-black`}>
        <Navbar />
        <main className="flex-grow pt-[100px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
