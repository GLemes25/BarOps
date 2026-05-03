import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from "@/components/providers";
import { TopHeader } from "@/components/top-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  JetBrains_Mono,
  Roboto_Slab,
} from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const robotoSlabHeading = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-heading",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BarOps",
  description: "Bar operations management",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        jetbrainsMono.variable,
        robotoSlabHeading.variable,
        "font-sans",
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <TopHeader />
              <main className="flex-1 overflow-y-auto bg-muted/20">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
