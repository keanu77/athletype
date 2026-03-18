import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ff6b35",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "運動人格測驗 | Sports MBTI",
  description:
    "透過 28 道運動情境題目，發現你的運動人格類型，找到最適合你的訓練方式和運動項目",
  keywords: ["MBTI", "運動人格", "運動心理", "人格測驗", "訓練建議"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "運動人格測驗",
  },
  openGraph: {
    title: "運動人格測驗 | Sports MBTI",
    description: "透過 28 道運動情境題目，發現你的運動人格類型",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

// Phase 2d: JSON-LD for WebApplication
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "運動人格測驗",
  description:
    "透過 28 道運動情境題目，發現你的運動人格類型，找到最適合你的訓練方式和運動項目",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0" },
  author: { "@type": "Person", name: "吳易澄醫師" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Phase 6a: SW registration via next/script */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js')
                .then((reg) => {
                  console.log('SW registered');
                  // Phase 6c: SW update notification
                  reg.onupdatefound = () => {
                    const newWorker = reg.installing;
                    if (newWorker) {
                      newWorker.onstatechange = () => {
                        if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
                          if (confirm('有新版本可用，是否重新載入？')) {
                            window.location.reload();
                          }
                        }
                      };
                    }
                  };
                })
                .catch((err) => console.log('SW registration failed:', err));
            }
          `}
        </Script>
      </body>
    </html>
  );
}
