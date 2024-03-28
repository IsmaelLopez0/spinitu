'use client';
import { useReducer, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Tabs from '@/components/atoms/Tabs';
import Dialog from '@/components/atoms/Dialog';
import Input from '@/components/atoms/Input';
import UserList from './UserList';
import Button from '@/components/atoms/Button';
import ScheduleBooking from '@/components/organisms/ScheduleBooking';

function tabsReducer(state = [], action) {
  const tempState = state.slice();
  if (action.type === 'updateToday') {
    tempState[0].content = action.payload;
  }
  if (action.type === 'updateSchedule') {
    tempState[1].content = action.payload;
  }
  return tempState;
}

const inputsToAddUser = [
  { name: 'name', label: 'Name', placeholder: 'Name' },
  { name: 'lastname', label: 'Last Name', placeholder: 'Last Name' },
  { name: 'email', label: 'Email', placeholder: 'Email' },
  { name: 'phone', label: 'Phone', placeholder: 'Phone' },
];

export default function Booking() {
  const [showDialog, setShowDialog] = useState(false);
  const [tabs] = useReducer(tabsReducer, [
    { title: 'Today', content: <UserList /> },
    { title: 'Schedule', content: <ScheduleBooking /> },
  ]);
  const { control, handleSubmit } = useForm();

  const actionButtons = [
    {
      text: 'New User',
      color: 'mindaro',
      onClick: () => setShowDialog(true),
    },
  ];

  function onSubmit(data) {
    console.log({ ...data, rol: 'USER' });
  }

  return (
    <>
      <Tabs tabs={tabs} actionButtons={actionButtons} />
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

            <div className="flex flex-row-reverse w-full gap-4 p-3">
              <Button color="mindaro" text="Add" />
              <Button
                color="orchid"
                type="outline"
                text="Cancel"
                onClick={() => setShowDialog(false)}
              />
            </div>
          </form>
        </Dialog>
      ) : null}
    </>
  );
}
