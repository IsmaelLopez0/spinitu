import Image from 'next/image';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Notifications from '../atoms/Notifications';
import Profile from '../atoms/Profile';
import NavMenuItems from '../atoms/NavMenuItems';

const outSessionMenu = [
  // { href: '/auth/login', title: 'Login' },
  // { href: '/auth/register', title: 'Register' },
];

const inSessionMenu = [
  {
    href: '/booking',
    title: 'Booking',
    roles: ['RECEPTIONIST', 'ADMINISTRATOR', 'COACH'],
  },
  {
    href: '/availability',
    title: 'Availability',
    roles: ['COACH', 'ADMINISTRATOR'],
  },
  // { href: '/dashboard', title: 'Dashboard' },
  { component: <Notifications /> },
  { component: <Profile /> },
];

async function NavBar() {
  const session = await getServerSession(authOptions);
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between px-24 py-3 border-b font-cormorant bg-cararra-100 text-swirl-800 border-swirl-200">
      <div className="flex flex-row items-center">
        <Image
          src="/images/icons/SPINITU.ico"
          alt="SPĪNĪTU Logo"
          width="85"
          height="55"
        />
      </div>
      <ul className="flex items-center">
        <NavMenuItems items={!session?.user ? outSessionMenu : inSessionMenu} />
      </ul>
    </nav>
  );
}

export default NavBar;
