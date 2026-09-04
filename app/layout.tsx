import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduSearch - Discover Your Perfect College",
  description:
    "Find, compare, and discover the perfect college for your future. Explore thousands of institutions, programs, and admission requirements all in one place.",
  keywords: [
    "college search",
    "university finder",
    "college comparison",
    "higher education",
    "admissions",
    "university rankings",
  ],
  authors: [{ name: "EduSearch" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edusearch.example.com",
    title: "EduSearch - Discover Your Perfect College",
    description:
      "Find, compare, and discover the perfect college for your future. Explore thousands of institutions, programs, and admission requirements all in one place.",
    siteName: "EduSearch",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduSearch - Discover Your Perfect College",
    description:
      "Find, compare, and discover the perfect college for your future.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
