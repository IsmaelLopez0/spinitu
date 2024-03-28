'use client';
import React, { useState } from 'react';
import Tabs from '@/components/atoms/Tabs';
import Dialog from '@/components/atoms/Dialog';
import Schedule from '@/components/organisms/Schedule';
import AdminCoaches from '@/components/pages/AdminCoaches';
import AddCoachForm from '@/components/pages/AddCoachForm';

export default function CoachesPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [dialog, setDialog] = useState({ show: false });
  const [callbackAddCoach, setCallbackAddCoach] = useState(() => {});
  const tabs = [
    { title: 'Schedule', content: <Schedule /> },
    {
      title: 'Coaches',
      content: <AdminCoaches setCallbackAddCoach={setCallbackAddCoach} />,
    },
  ];

  function saveData() {
    setDialog({ show: false });
    callbackAddCoach();
  }

  function handleDialog() {
    setDialog({
      title: 'Add Coach',
      show: true,
      children: <AddCoachForm saveData={saveData} closeDialog={setDialog} />,
    });
  }

  return (
    <>
      <Tabs
        tabs={tabs}
        actionButtons={
          currentTab === 1
            ? [
                {
                  text: 'New Coach',
                  color: 'mindaro',
                  className: 'sticky bottom-0 z-10',
                  onClick: () => handleDialog(),
                },
              ]
            : []
        }
        currentTab={setCurrentTab}
      />
      {dialog.show ? <Dialog {...dialog} /> : null}
    </>
  );
}
