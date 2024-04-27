'use client';
import { Fragment, useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, BellIcon } from '@heroicons/react/16/solid';
import { readNotification, updateNotification } from '@/libs/notificationsAPIs';
import { useUserConfig } from '@/stores/useUserConfig';
import Card from '../organisms/Card';
import { genericFetch } from '@/libs/externalAPIs';
import { setToast } from '@/libs/notificationsAPIs';
import { convertTZ } from '@/libs/_utilsFunctions';

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const user = useUserConfig((state) => state.user);
  const setUser = useUserConfig((state) => state.setUser);

  useEffect(() => {
    if (!user?.name) {
      getSession().then(({ user }) => {
        const params = {
          url: '/user/user',
          query: { email: user.email },
          method: 'GET',
        };
        genericFetch(params).then((res) => {
          if (res.statusCode === 200) {
            setUser(res.body);
          } else {
            setToast(res.body.error, 'error', params.url);
          }
        });
      });
    }
  }, [setUser, user]);

  async function getNotifications() {
    if (!user?.id) return;
    const data = await readNotification(user.id);
    setNotifications(data);
  }

  async function putNotifications(id) {
    updateNotification(user.id, id).then((res) => {
      getNotifications();
    });
  }

  useEffect(() => {
    getNotifications();
  }, [user]);

  return (
    <>
      <BellIcon
        className={`h-6 cursor-pointer ${notifications.find((f) => !f.leido) ? 'animate-bounce' : ''}`}
        onClick={() => {
          setOpen(true);
          getNotifications();
        }}
      />
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="relative w-screen max-w-md pointer-events-auto">
                    <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
                      <div className="flex items-center justify-between px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Notifications
                        </Dialog.Title>
                        <Transition.Child
                          as={Fragment}
                          enter="ease-in-out duration-500"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in-out duration-500"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="flex items-center">
                            <button
                              type="button"
                              className="text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="w-6 h-6 text-black"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </Transition.Child>
                      </div>
                      <div className="relative flex flex-col flex-1 gap-2 px-4 mt-6 sm:px-6">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`border rounded-md shadow-2xl ${n.leido ? 'border-swirl-200 shadow-swirl-200' : 'border-mindaro-500 shadow-mindaro-500'}`}
                          >
                            <Card
                              data={{
                                title: n.title,
                                description: convertTZ(n.fecha),
                              }}
                            >
                              <p>{n.body}</p>
                              {n.leido === false ? (
                                <p
                                  className="w-full text-xs text-right cursor-pointer text-mindaro-700 hover:font-semibold"
                                  onClick={() => putNotifications(n.id)}
                                >
                                  Mark as read
                                </p>
                              ) : null}
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
