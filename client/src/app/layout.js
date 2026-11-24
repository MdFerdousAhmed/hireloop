import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import AppShell from "../components/AppShell";

export const metadata = {
  title: "HireLoop | Job & Recruitment Platform",
  description: "Connecting top talent with high-growth companies. Browse jobs, apply with one click, and manage hiring.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased bg-[#fcfdff] text-gray-900 overflow-x-hidden">
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
