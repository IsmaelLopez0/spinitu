'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavMenuItems({ items }) {
  const pathname = usePathname();
  return items.map((item, i) =>
    item.component ? (
      <div key={i} className="ml-5">
        {item.component}
      </div>
    ) : (
      <li key={i}>
        <Link
          className={`py-2 px-3 ${pathname === item.href ? 'border-b border-swirl-500' : ''}`}
          href={item.href}
        >
          {item.title}
        </Link>
      </li>
    ),
  );
}
