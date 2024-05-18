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
import RadioGroup from '@/components/atoms/RadioGroup';
import { useUserConfig } from '@/stores/useUserConfig';

const inputsToAddUser = [
  { name: 'name', label: 'Name', placeholder: 'Name' },
  { name: 'lastname', label: 'Last Name', placeholder: 'Last Name' },
  { name: 'email', label: 'Email', placeholder: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone', placeholder: 'Phone', type: 'tel' },
];

const paymentOptions = [
  { value: 'CASH', name: 'Cash' },
  { value: 'CREDIT_CARD', name: 'Credit Card' },
  { value: 'DEBIT', name: 'Debit' },
  { value: 'BANK_TRANSFERS', name: 'Bank Transfers' },
];

export default function Booking() {
  const [showDialog, setShowDialog] = useState(false);
  const [memberships, setMemberships] = useState([]);
  const [membershipSelected, setMembershipSelected] = useState();
  const [isloading, setIsloading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [tabs, setTabs] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const { control, handleSubmit, reset } = useForm();
  const user = useUserConfig((state) => state.user);

  function setIsLoadingOnSubmit(isloading) {
    setIsloading(isloading);
    if (!user) return;
    const isCoach = user?.rol === 'COACH';
    if (isCoach) {
      setTabs([{ title: 'Schedule', content: <ScheduleBooking /> }]);
    } else {
      setTabs([
        { title: 'Today', content: <UserList isloading={isloading} /> },
        { title: 'Schedule', content: <ScheduleBooking /> },
        {
          title: 'All Users',
          content: (
            <AllUsersList
              paymentOptions={paymentOptions}
              isloading={isloading}
            />
          ),
        },
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
    if (someInpustInalid || invalidMembership || !paymentMethod) {
      setToast('Fill out all the fields', 'error', '/api/auth/register');
      setIsLoadingOnSubmit(false);
    } else {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          rol: 'USER',
          membershipTypeId: membershipSelected.id,
          paymentMethod,
          createdBy: user?.id,
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

  useEffect(() => {
    setIsLoadingOnSubmit(false);
  }, [user]);

  return (
    <>
      <Tabs
        tabs={tabs}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        actionButtons={!user || user?.rol === 'COACH' ? [] : actionButtons}
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
                      type={input.type ?? 'text'}
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

            <RadioGroup
              groupName="Payment Method"
              type="column"
              defaultValue="CASH"
              options={paymentOptions}
              className="mt-2"
              setValue={setPaymentMethod}
            />

            <div className="flex flex-row-reverse w-full gap-4 p-3">
              <Button color="orchid" text="Add" isloading={isloading} />
              <Button
                color="mindaro"
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
