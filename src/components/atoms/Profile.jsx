'use client';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import { getSession } from 'next-auth/react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/20/solid';
import SignOutButton from './SignOutButton';
import { setToast } from '@/libs/notificationsAPIs';
import { genericFetch } from '@/libs/externalAPIs';
import { useUserConfig } from '@/stores/useUserConfig';

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const user = useUserConfig((state) => state.user);
  const setUser = useUserConfig((state) => state.setUser);

  useEffect(() => {
    if (!user?.name && !isLoading) {
      setIsLoading(true);
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
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium bg-transparent border rounded text-swirl-700 border-swirl-200 hover:bg-swirl-200">
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
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {() => (
                <div className="flex flex-col flex-wrap justify-center w-full overflow-hidden">
                  <p className="truncate max-w-[215px] text-center text-sm">
                    {user?.name ?? ''} {user?.lastname ?? ''}
                  </p>
                  <p className="truncate max-w-[215px] text-center text-sm">
                    {user?.email}
                  </p>
                </div>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${
                    active ? 'bg-swirl-400 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-5 h-5 mr-2 ${active ? 'text-white' : 'text-swirl-700'}`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>

                  <Link href="/profile">Profile</Link>
                </div>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${
                    active ? 'bg-orchid-500  text-cararra-50' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
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