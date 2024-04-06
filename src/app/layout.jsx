import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import NavBar from '@/components/organisms/Navbar';
import { Toaster } from 'sonner';
import './globals.css';
// import 'material-symbols';
import 'material-symbols/outlined.css';

const inter = Inter({ subsets: ['latin'] });

const theseasons = localFont({
  src: [
    {
      path: '../../public/fonts/Fontspring-DEMO-theseasons-reg.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Fontspring-DEMO-theseasons-bd.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Fontspring-DEMO-theseasons-it.otf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-theseasons',
});

const ttchocolates = localFont({
  src: [
    {
      path: '../../public/fonts/TT Chocolates Trial Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT Chocolates Trial Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT Chocolates Trial Italic.otf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-ttchocolates',
});
export const metadata = {
  title: 'SPĪNĪTU',
  description:
    'SPĪNĪTU es un ride a nuestro yo más auténtico. El más brillante. El más valiente. Rodamos con todo nuestro espíritu, cuerpo y alma.',
  icons: {
    icon: '/icon.png',
    shortcut: '/shortcut-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`bg-cararra-100 ${theseasons.variable} ${ttchocolates.variable} ${inter.className}`}
      >
        <NavBar />
        <div className="min-h-[calc(100vh-100px)] px-10 py-5 font-ttchocolates">
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  );
}
