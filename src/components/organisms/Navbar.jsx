import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SignOutButton from '../atoms/SignOutButton';
import Notifications from '../atoms/Notifications';

const outSessionMenu = [
  { href: '/auth/login', title: 'Login' },
  { href: '/auth/register', title: 'Register' },
];

const inSessionMenu = [
  { href: '/booking', title: 'Booking' },
  { href: '/profile', title: 'Profile' },
  { href: '/coaches/schedule', title: 'Coaches' },
  { href: '/dashboard', title: 'Dashboard' },
  { component: <SignOutButton /> },
  { component: <Notifications /> },
];

const MenuItems = ({ items }) =>
  items.map(
    (item, i) =>
      item.component ?? (
        <li key={i}>
          <Link href={item.href}>{item.title}</Link>
        </li>
      ),
  );

async function NavBar() {
  const session = await getServerSession(authOptions);
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between px-24 py-3 border-b bg-cararra-100 text-swirl-800 border-swirl-200">
      <div className="flex flex-row items-center">
        <h1 className="text-xl font-bold">SPINITU</h1>
      </div>
      <ul className="flex items-center gap-x-5">
        <MenuItems items={!session?.user ? outSessionMenu : inSessionMenu} />
      </ul>
    </nav>
  );
}

export default NavBar;
