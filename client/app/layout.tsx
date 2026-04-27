import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MessageLike",
  description: "it's test message app ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
/**
 * APP LAYOUT
 * Route: /app/*
 *
 * TODO: Implement the following features:
 * - [ ] Authentication check (redirect to /login if not authenticated)
 * - [ ] Render main Header component
 * - [ ] Render Sidebar component with navigation
 * - [ ] Main content area with children
 * - [ ] Socket.IO connection (useSocket hook)
 * - [ ] Load user data on mount (useAuth hook)
 * - [ ] Two-column layout (sidebar + content)
 * - [ ] Mobile responsive (hamburger menu on mobile)
 * - [ ] Handle socket connection errors
 * - [ ] Show loading state while auth is loading
 * - [ ] Background color/styling from globals.css
 * - [ ] Tailwind responsive classes
 */
