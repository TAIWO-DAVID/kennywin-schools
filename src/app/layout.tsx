import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/styles/globals.css";
import "@/styles/animations.css";
import "@/styles/custom.css";
import PageLoader from "@/components/PageLoader";
import { PageReadyProvider } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "KennyWin Schools",
  description: "Building future leaders through quality education"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />

        <meta name="apple-mobile-web-app-title" content="KennyWin Schools" />

        <link rel="icon" type="image/png" sizes="32x32" href="/school_logo_32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/school_logo_192.png" />

        <link rel="apple-touch-icon" sizes="180x180" href="/school_logo_apple.png" />

        <meta name="msapplication-TileImage" content="/school_logo_192.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
      </head>

      <body className={poppins.className}>
        <PageReadyProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
            }}
          />
          <PageLoader/>
          <AuthProvider>{children}</AuthProvider>
        </PageReadyProvider>
      </body>
    </html>
  );
}
