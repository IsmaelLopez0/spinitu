import { Cormorant, Cormorant_Upright } from 'next/font/google';
import NavBar from '@/components/organisms/Navbar';
import { Toaster } from 'sonner';
import './globals.css';

const cormorant = Cormorant({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
});
const cormorant_upright = Cormorant_Upright({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant_upright',
});

export const metadata = {
  title: 'SPĪNĪTU',
  description: 'Unleash your SPĪNĪTU and scream WHAT A RĪDE!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`bg-cararra-100 ${cormorant.variable} ${cormorant_upright.variable} cormorant`}
      >
        <NavBar />
        <main className="min-h-[calc(100vh-100px)] px-10 py-5 font-cormorant">
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
