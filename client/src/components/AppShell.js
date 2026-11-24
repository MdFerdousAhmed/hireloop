'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isDashboard = 
    pathname.startsWith('/candidate') || 
    pathname.startsWith('/employer') || 
    pathname.startsWith('/admin');

  if (isDashboard) {
    return <div className="flex-1 min-h-screen">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
