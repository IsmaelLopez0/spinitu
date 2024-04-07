'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Tabs from '@/components/atoms/Tabs';
import Dialog from '@/components/atoms/Dialog';
import AddCoachForm from '@/components/pages/AddCoachForm';
import Table from '@/components/atoms/Table';
import { genericFetch } from '@/libs/externalAPIs';
import { XCircleIcon, PencilSquareIcon } from '@heroicons/react/16/solid';
import { setToast } from '@/libs/notificationsAPIs';

const AddBottonTitle = ['New Coach', 'New Receptionist', 'New Administrator'];
const TabsTitles = ['Coach', 'Receptionist', 'Administrator'];

async function getUsers() {
  const params = {
    url: '/user/users',
    method: 'GET',
  };
  const data = await genericFetch(params);
  if (data.statusCode !== 200) {
    setToast(data.body.error, 'error', params.url + data.statusCode);
    return {};
  }
  return data.body;
}

const headers = [
  { key: 'name', title: 'Name' },
  { key: 'lastname', title: 'Last Name' },
  { key: 'email', title: 'Email' },
  { key: 'phone', title: 'Phone' },
];

export default function UsersPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [dialog, setDialog] = useState({ show: false });
  const [tabs, setTabs] = useState([]);

  function saveData() {
    getUsersFunc();
    setDialog({ show: false });
  }

  function handleDialog(data) {
    let currTab = 'Coach';
    const tabRol = {
      COACH: 'Coach',
      RECEPTIONIST: 'Receptionist',
      ADMINISTRATOR: 'Administrator',
    };
    let currRol = 'COACH';
    if (TabsTitles[currentTab] === 'Receptionist') {
      currTab = 'Receptionist';
      currRol = 'RECEPTIONIST';
    }
    if (TabsTitles[currentTab] === 'Administrator') {
      currTab = 'Administrator';
      currRol = 'ADMINISTRATOR';
    }
    if (data?.rol) {
      currRol = data.rol;
      currTab = tabRol[data.rol];
    }
    setDialog({
      title: `${data ? 'Edit' : 'Add'} ${currTab}`,
      show: true,
      children: (
        <AddCoachForm
          saveData={saveData}
          closeDialog={setDialog}
          data={data}
          rol={currRol}
          isUpdate={data ? true : false}
        />
      ),
    });
  }

  async function deleteCoach(email) {
    const params = {
      url: '/user',
      body: { email },
      method: 'DELETE',
    };
    const res = await genericFetch(params);
    if (res.statusCode === 200) {
      getUsersFunc();
      setDialog({
        title: 'User deleted',
        show: true,
        children: (
          <Button
            color="mindaro"
            text="Ok"
            onClick={() => setDialog({ show: false })}
          />
        ),
      });
    } else {
      setToast(res.body.error, 'error', params.url + res.statusCode);
    }
  }

  function askForDelete(email) {
    setDialog({
      title: `Are you sure you want to delete ${email}?`,
      show: true,
      children: (
        <div className="flex gap-3">
          <Button
            color="swirl"
            type="outline"
            text="Cancel"
            onClick={() => setDialog({ show: false })}
          />
          <Button
            color="orchid"
            text="Delete"
            onClick={() => {
              setDialog({ show: false });
              deleteCoach(email);
            }}
          />
        </div>
      ),
    });
  }

  const specializationList = (specializations = '[]') => (
    <ul className="mx-3 text-left list-disc">
      {JSON.parse(specializations).map((e, i) => (
        <li key={i}>{e}</li>
      ))}
    </ul>
  );

  const Actions = ({ item }) => {
    return (
      <>
        <td className="flex justify-center gap-1 px-6 py-4">
          <PencilSquareIcon
            className="cursor-pointer text-mindaro-950 h-7"
            onClick={() => handleDialog(item)}
          />
          <XCircleIcon
            className="text-red-500 cursor-pointer h-7"
            onClick={() => askForDelete(item.email)}
          />
        </td>
      </>
    );
  };

  function getUsersFunc() {
    getUsers().then((res) => {
      const { ADMINISTRATOR, COACH, RECEPTIONIST } = res;
      const temp = headers.slice();
      temp.splice(2, 0, {
        key: 'specializationsParsed',
        title: 'Specializations',
      });
      const coachData = COACH.map((coach) => ({
        ...coach,
        specializationsParsed: specializationList(coach.specializations),
      }));
      const dataArray = [coachData, RECEPTIONIST, ADMINISTRATOR];
      setTabs(
        TabsTitles.map((title, i) => ({
          title,
          content: (
            <Table
              title={`${title} users`}
              caption=""
              headers={i === 0 ? temp : headers}
              data={dataArray[i]}
              Actions={Actions}
            />
          ),
        })),
      );
    });
  }

  useEffect(() => {
    getUsersFunc();
  }, []);

  return (
    <>
      <Tabs
        tabs={tabs}
        actionButtons={
          tabs.length > 0
            ? [
                {
                  text: AddBottonTitle[currentTab],
                  color: 'mindaro',
                  className: 'sticky bottom-0',
                  onClick: () => handleDialog(),
                },
              ]
            : []
        }
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      {dialog.show ? <Dialog {...dialog} /> : null}
    </>
  );
}
