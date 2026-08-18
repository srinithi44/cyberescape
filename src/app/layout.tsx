import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CYBER ESCAPE — Round 3 | 3D Interactive World',
  description: 'Immersive real-time 3D interactive world experience for Cyber Escape Round 3.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#020d08] text-white antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
