'use client';
import React, { useEffect, useState } from 'react';
import Button from '../atoms/Button';
import Dialog from '../atoms/Dialog';
import { XCircleIcon, PencilSquareIcon } from '@heroicons/react/16/solid';
import { genericFetch } from '@/libs/externalAPIs';
import { setToast } from '@/libs/notificationsAPIs';

async function getCoaches() {
  const params = {
    url: '/user/coaches',
    method: 'GET',
  };
  const data = await genericFetch(params);
  if (data.statusCode !== 200) {
    setToast(data.body.error, 'error', params.url + data.statusCode);
    return [];
  }
  return data.body;
}

export default function AdminCoaches({ setCallbackAddCoach, handleDialog }) {
  const [coaches, setCoaches] = useState([]);
  const [dialog, setDialog] = useState({ show: false });

  function getCoachesFunc() {
    getCoaches().then((res) => setCoaches(res));
  }

  async function deleteCoach(email) {
    const params = {
      url: '/user',
      body: { email },
      method: 'DELETE',
    };
    const res = await genericFetch(params);
    if (res.statusCode === 200) {
      getCoachesFunc();
      setDialog({
        title: 'Coach Deleted',
        show: true,
        children: (
          <Button
            color="orchid"
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
      title: 'Are you sure you want to delete it?',
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
            color="mindaro"
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

  useEffect(() => {
    getCoachesFunc();
    setCallbackAddCoach(() => getCoachesFunc);
  }, []);

  return (
    <div className="relative h-full overflow-x-auto">
      <table className="w-full text-left text-gray-500 rtl:text-right">
        <thead className="text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Last Name
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Specīalīzatīons
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Emaīl
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Phone
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Actīons
            </th>
          </tr>
        </thead>
        <tbody>
          {coaches.map((coach, i) => {
            const isLast = coaches.length - 1 === i;
            return (
              <tr
                key={coach.id}
                className={`bg-white ${!isLast ? 'border-b' : ''}`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap"
                >
                  {coach.name}
                </th>
                <td className="px-6 py-4 text-center">{coach.lastname}</td>
                <td className="px-6 py-4">
                  <ul className="list-disc">
                    {JSON.parse(coach.specializations).map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 text-center">{coach.email}</td>
                <td className="px-6 py-4 text-center">{coach.phone}</td>
                <td className="flex justify-center gap-1 px-6 py-4">
                  <PencilSquareIcon
                    className="cursor-pointer text-mindaro-950 h-7"
                    onClick={() => handleDialog(coach)}
                  />
                  <XCircleIcon
                    className="text-red-500 cursor-pointer h-7"
                    onClick={() => askForDelete(coach.email)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {dialog.show ? <Dialog {...dialog} /> : null}
    </div>
  );
}
