'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Schedule from '@/components/organisms/Schedule';
import AdminCoaches from '@/components/pages/AdminCoaches';
import { useUserConfig } from '@/stores/useUserConfig';
import { genericFetch } from '@/libs/externalAPIs';
import { setToast } from '@/libs/notificationsAPIs';

const ACTIVE_CLASS = 'text-swirl-900 bg-gray-100';

export default function CoachesPage(props) {
  const params = useParams();
  const [children, setChildren] = useState(null);
  const user = useUserConfig((state) => state.user);
  const setUser = useUserConfig((state) => state.setUser);

  function setActiveClass(tab) {
    return params.tab === tab ? ACTIVE_CLASS : '';
  }

  useEffect(() => {
    switch (params.tab) {
      case 'schedule':
        setChildren(<Schedule user={user} />);
        break;
      default:
        setChildren(<AdminCoaches />);
        break;
    }
  }, [params.tab, user]);

  useEffect(() => {
    if (!user?.name) {
      getSession().then(({ user }) => {
        const params = {
          url: '/user/user',
          query: { email: user.email },
          method: 'GET',
        };
        genericFetch(params).then((data) => {
          if (data.statusCode === 200) {
            setUser(data.body);
          } else {
            setToast(data.body.error, 'error', params.url + data.statusCode);
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full px-10 py-5">
      <div className="flex flex-wrap text-sm font-medium text-center border-b text-swirl-700 border-swirl-200">
        <Link href="/coaches/schedule">
          <span
            className={`me-2 inline-block p-4 rounded-t-lg active ${setActiveClass(
              'schedule',
            )}`}
          >
            Schedule
          </span>
        </Link>
        <Link href="/coaches/admin">
          <span
            className={`me-2 inline-block p-4 rounded-t-lg active ${setActiveClass(
              'admin',
            )}`}
          >
            Coaches
          </span>
        </Link>
      </div>

      <main className="min-h-full mt-2">{children}</main>
    </div>
  );
}
