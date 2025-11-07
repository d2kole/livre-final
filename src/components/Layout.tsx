import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout component
 * Provides consistent page structure with navbar
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f8fbfc]">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
