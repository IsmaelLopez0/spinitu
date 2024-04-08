'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserConfig } from '@/stores/useUserConfig';

export default function NavMenuItems({ items }) {
  const pathname = usePathname();
  const user = useUserConfig((state) => state.user);
  return items.map((item, i) =>
    item.component ? (
      <div key={i} className="ml-5">
        {item.component}
      </div>
    ) : item.roles?.includes(user?.rol) ? (
      <li key={i}>
        <Link
          className={`py-2 px-3 ${pathname === item.href ? 'border-b border-swirl-500' : ''}`}
          href={item.href}
        >
          {item.title}
        </Link>
      </li>
    ) : null,
  );
}
