'use client';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Tabs from '@/components/atoms/Tabs';
import Dialog from '@/components/atoms/Dialog';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ScheduleBooking from '@/components/organisms/ScheduleBooking';
import UserList from './UserList';
import AllUsersList from './AllUsersList';
import { setToast } from '@/libs/notificationsAPIs';
import { genericFetch } from '@/libs/externalAPIs';
import Autocomplete from '@/components/atoms/Autocomplete';
import { useUserConfig } from '@/stores/useUserConfig';

const inputsToAddUser = [
  { name: 'name', label: 'Name', placeholder: 'Name' },
  { name: 'lastname', label: 'Last Name', placeholder: 'Last Name' },
  { name: 'email', label: 'Email', placeholder: 'Email' },
  { name: 'phone', label: 'Phone', placeholder: 'Phone' },
];

export default function Booking() {
  const [showDialog, setShowDialog] = useState(false);
  const [memberships, setMemberships] = useState([]);
  const [membershipSelected, setMembershipSelected] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tabs, setTabs] = useState([
    { title: 'Today', content: <UserList /> },
    { title: 'Schedule', content: <ScheduleBooking /> },
    { title: 'All Users', content: <AllUsersList /> },
  ]);
  const { control, handleSubmit, reset } = useForm();
  const user = useUserConfig((state) => state.user);

  function setIsLoadingOnSubmit(isLoading) {
    setIsLoading(isLoading);
    const isCoach = user?.rol === 'COACH';
    if (isCoach) {
      setTabs([{ title: 'Schedule', content: <ScheduleBooking /> }]);
    } else {
      setTabs([
        { title: 'Today', content: <UserList isLoading={isLoading} /> },
        { title: 'Schedule', content: <ScheduleBooking /> },
        { title: 'All Users', content: <AllUsersList isLoading={isLoading} /> },
      ]);
    }
  }

  const resetForm = () => {
    reset();
    setMembershipSelected();
    setIsLoadingOnSubmit(false);
  };

  const actionButtons = [
    {
      text: 'New User',
      color: 'mindaro',
      onClick: () => setShowDialog(true),
    },
  ];

  async function onSubmit(data) {
    setIsLoadingOnSubmit(true);
    const someInpustInalid = Object.values(data).some((s) =>
      [null, undefined, ''].includes(s),
    );
    const invalidMembership = membershipSelected === undefined;
    if (someInpustInalid || invalidMembership) {
      setToast('Fill out all the fields', 'error', '/api/auth/register');
    } else {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          rol: 'USER',
          membershipTypeId: membershipSelected.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        setShowDialog(false);
        resetForm();
      } else {
        const data = await res.json();
        setToast(data.message, 'error', '/api/auth/register');
      }
    }
  }

  useEffect(() => {
    const params = { url: '/membership-types', method: 'GET' };
    genericFetch(params).then((res) => {
      if (res.statusCode === 200) {
        setMemberships(res.body);
      } else {
        setToast('Something went wrong', 'error', '/membership-types');
      }
      setIsLoadingOnSubmit(false);
    });
  }, []);

  return (
    <>
      <Tabs
        tabs={tabs}
        actionButtons={user?.rol === 'COACH' ? [] : actionButtons}
      />
      {showDialog ? (
        <Dialog title="Add new user">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              {inputsToAddUser.map((input) => (
                <Controller
                  control={control}
                  name={input.name}
                  render={({ field }) => (
                    <Input
                      label={input.label}
                      name={input.name}
                      placeholder={input.placeholder}
                      {...field}
                    />
                  )}
                />
              ))}
            </div>

            <Autocomplete
              label={<div className="mt-2">Membership Package</div>}
              list={memberships}
              selected={membershipSelected}
              setSelected={setMembershipSelected}
            />

            <div className="flex flex-row-reverse w-full gap-4 p-3">
              <Button color="mindaro" text="Add" isLoading={isLoading} />
              <Button
                color="orchid"
                type="outline"
                text="Cancel"
                onClick={() => {
                  resetForm();
                  setShowDialog(false);
                }}
              />
            </div>
          </form>
        </Dialog>
      ) : null}
    </>
  );
}
