'use client';
import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import Button from '@/components/atoms/Button';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Tabs({
  tabs,
  actionButtons = [],
  currentTab = 0,
  setCurrentTab,
}) {
  const [selectedTab, setSelectedTab] = useState(currentTab);

  function setTab(index) {
    setSelectedTab(index);
    if (setCurrentTab) {
      setCurrentTab(index);
    }
  }

  return (
    <div className="flex flex-col">
      <Tab.Group>
        <Tab.List className="flex justify-between p-4 space-x-4 rounded-md bg-cararra-200">
          <div className="flex gap-2">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.title}
                className={({ selected }) =>
                  classNames(
                    'rounded-lg p-2 text-sm font-medium leading-5',
                    'ring-white/60 ring-offset-2 ring-offset-cararra-100 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-cararra-100 shadow'
                      : 'hover:bg-cararra-100/[0.4]',
                  )
                }
                onClick={() => setTab(index)}
              >
                {tab.title}
              </Tab>
            ))}
          </div>
          <div className="flex flex-row ml-auto">
            {actionButtons.map((button, index) => (
              <Button key={index} {...button} />
            ))}
          </div>
        </Tab.List>
        <Tab.Panels className="mt-4">
          {tabs.map((tab, index) => (
            <Tab.Panel
              key={tab.title}
              className={`${index === selectedTab ? 'block' : 'hidden'}`}
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
