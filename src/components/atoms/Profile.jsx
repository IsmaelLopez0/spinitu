'use client';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/20/solid';
import {
  UserCircleIcon as UserCircleIconSM,
  UsersIcon,
  ChartBarIcon,
} from '@heroicons/react/16/solid';
import SignOutButton from './SignOutButton';
import { setToast } from '@/libs/notificationsAPIs';
import { genericFetch } from '@/libs/externalAPIs';
import { useUserConfig } from '@/stores/useUserConfig';

export default function Profile() {
  const [isloading, setIsloading] = useState(false);
  const user = useUserConfig((state) => state.user);
  const setUser = useUserConfig((state) => state.setUser);
  useEffect(() => {
    if (!user?.name && !isloading) {
      setIsloading(true);
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

  const capitalizeRol = (rol = '') =>
    `${rol.charAt(0)}${rol.substring(1, rol.length).toLowerCase()}`;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 font-medium bg-transparent border rounded text-swirl-700 border-swirl-200 hover:bg-swirl-200">
          {user?.name}
          <UserCircleIcon
            className="w-5 h-5 ml-2 -mr-1 text-swirl-700"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 py-2 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1 ">
            <div className="flex flex-col flex-wrap items-center justify-center w-full overflow-hidden">
              <p className="truncate max-w-[215px] text-center">
                {user?.name ?? ''} {user?.lastname ?? ''}
              </p>
              <p className="truncate max-w-[215px] text-center">
                {user?.email}
              </p>
              <span
                className={
                  'bg-swirl-300 px-2 rounded-md my-1 text-white w-fit capitalize'
                }
              >
                {capitalizeRol(user.rol)}
              </span>
            </div>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/profile"
                  className={`${
                    active ? 'bg-swirl-400 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2`}
                >
                  <UserCircleIconSM
                    className={`w-5 h-5 mr-2 ${active ? 'text-white' : 'text-swirl-700'}`}
                    aria-hidden="true"
                  />
                  Profile
                </Link>
              )}
            </Menu.Item>
            {user?.rol === 'ADMINISTRATOR' ? (
              <>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/users"
                      className={`${
                        active ? 'bg-swirl-400 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2`}
                    >
                      <UsersIcon
                        className={`w-5 h-5 mr-2 ${active ? 'text-white' : 'text-swirl-700'}`}
                        aria-hidden="true"
                      />
                      Users
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/dashboard"
                      className={`${
                        active ? 'bg-swirl-400 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2`}
                    >
                      <ChartBarIcon
                        className={`w-5 h-5 mr-2 ${active ? 'text-white' : 'text-swirl-700'}`}
                        aria-hidden="true"
                      />
                      Dashboard
                    </Link>
                  )}
                </Menu.Item>
              </>
            ) : null}
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${
                    active ? 'bg-orchid-500  text-cararra-50' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2`}
                >
                  <SignOutButton isMenu active={active} />
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
