import { Providers } from "./providers"; // 💡 Jo file abhi banayi use import kiya
import "./globals.css";

export const metadata = {
  title: "Restaurant POS",
  description: "Advanced Restaurant Point of Sale System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning lagaya taaki extensions tang na karein */}
      <body suppressHydrationWarning={true} className="min-h-full flex flex-col">
        {/* 💡 Poori app ko Providers ke andar wrap kar diya */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}