import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "TechStore Ecuador — Tu tienda de electrónica",
    template: "%s | TechStore",
  },
  description: "Smartphones, laptops, audio, gaming y más. Productos electrónicos originales con garantía oficial en Ecuador.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#0d1b3e",
                color: "#f8fafc",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
                border: "1px solid rgba(255,255,255,0.1)",
              },
              success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
