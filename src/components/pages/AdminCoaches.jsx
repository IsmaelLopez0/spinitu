"use client";
import { unstable_noStore as noStore } from "next/cache";
import React, { useEffect, useState } from "react";
import AddCoachForm from "./AddCoachForm";
import Button from "../atoms/Button";
import Dialog from "../atoms/Dialog";
import { XCircleIcon } from "@heroicons/react/16/solid";

export default function AdminCoaches() {
  const [coaches, setCoaches] = useState([]);
  const [dialog, setDialog] = useState({ show: false });

  async function getCoaches() {
    noStore();
    const res = await fetch(`/api/coaches/admin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      cache: "no-cache",
    });
    const data = await res.json();
    setCoaches(data);
  }

  function handleDialog() {
    setDialog({
      title: "Add Coach",
      show: true,
      children: <AddCoachForm saveData={saveData} closeDialog={setDialog} />,
    });
  }

  function saveData() {
    setDialog({ show: false });
    getCoaches();
  }

  async function deleteCoach(email) {
    const res = await fetch(`/api/profile/warning`, {
      method: "DELETE",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      getCoaches();
      setDialog({
        title: "Coach Deleted",
        show: true,
        children: (
          <Button
            color="mindaro"
            text="Ok"
            onClick={() => setDialog({ show: false })}
          />
        ),
      });
    }
  }

  function askForDelete(email) {
    setDialog({
      title: "Are you sure you want to delete it?",
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

  useEffect(() => {
    getCoaches();
  }, []);

  return (
    <div className="relative h-full overflow-x-auto">
      <header className="flex justify-between m-3">
        <h1>List coaches</h1>
        <Button
          color="mindaro"
          className="sticky bottom-0 z-10"
          onClick={() => handleDialog()}
        >
          New Coach
        </Button>
      </header>
      <table className="w-full text-sm text-left text-gray-500 rtl:text-right">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Last Name
            </th>
            <th scope="col" className="px-6 py-3">
              Specializations
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Phone
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {coaches.map((coach, i) => {
            const isLast = coaches.length - 1 === i;
            return (
              <tr
                key={coach.id}
                className={`bg-white ${!isLast ? "border-b" : ""}`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {coach.name}
                </th>
                <td className="px-6 py-4">{coach.lastname}</td>
                <td className="px-6 py-4">
                  <ul className="list-disc">
                    {JSON.parse(coach.specializations).map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4">{coach.email}</td>
                <td className="px-6 py-4">{coach.phone}</td>
                <td className="px-6 py-4">
                  <XCircleIcon
                    className="text-red-500 h-7"
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
