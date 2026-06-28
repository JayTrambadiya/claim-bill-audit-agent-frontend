import "./globals.css";
import { Toaster } from "@/src/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:opsz@14..32&display=swap"
        />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}