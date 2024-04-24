'use client';
import React, { useEffect, useState } from 'react';
import { BarList, Card } from '@tremor/react';
import Select from '@/components/atoms/Select';
import Tabs from '@/components/atoms/Tabs';
import { genericFetch } from '@/libs/externalAPIs';
import { obtenerNombreMes } from '@/libs/_utilsFunctions';
import { paymentOptions } from '@/libs/vars';
import Table from '@/components/atoms/Table';
import { setToast } from '@/libs/notificationsAPIs';

async function getData() {
  const [coachesClass, purchases] = await Promise.all([
    genericFetch({
      url: '/report/coaches-class',
      method: 'GET',
    }),
    genericFetch({
      url: '/report/purchases',
      method: 'GET',
    }),
  ]);
  return [coachesClass, purchases];
}

function getLastDayOfMonth(year, month) {
  let date = new Date(year, month + 1, 0);
  return date.getDate();
}

const getHalfMonthDate = (dateEnd) => {
  const endDate = new Date(dateEnd);
  const month = endDate.getMonth();
  const dayEnd = endDate.getDate();
  if (dayEnd <= 15) {
    return `1-15 of ${obtenerNombreMes(month)}`;
  }
  return `16-${getLastDayOfMonth(endDate.getFullYear(), month)} of ${obtenerNombreMes(month)}`;
};

const purchasedHeaders = [
  { title: 'Client', key: 'client', class: 'min-w-48' },
  { title: 'Date', key: 'date', class: 'min-w-44' },
  { title: 'Package', key: 'membership' },
  { title: 'Total', key: 'amount' },
  { title: 'Method', key: 'method', class: 'min-w-36' },
  { title: 'Seller', key: 'seller', class: 'min-w-48' },
];

export default function DashboardPage() {
  const [coachesClass, setCoachesClass] = useState([]);
  const [purshases, setPurchases] = useState([]);
  const [coaches, setCoaches] = useState({});
  const [optionSelected, setOptionSelected] = useState(0);
  const [dateOptions, setDateOptions] = useState([]);
  const [tabs, setTabs] = useState([
    {
      title: 'Classes by Coach',
      content: null,
    },
    {
      title: 'Packages purchased',
      content: null,
    },
  ]);

  function updateTabs() {
    setTabs([
      {
        title: 'Classes by Coach',
        content: (
          <ClassesByCoach
            coaches={coaches}
            coachesClass={coachesClass}
            optionSelected={optionSelected}
          />
        ),
      },
      {
        title: 'Packages purchased',
        content: (
          <Table
            title="Packages purchased"
            caption=""
            headers={purchasedHeaders}
            data={purshases[optionSelected] ?? []}
          />
        ),
      },
    ]);
  }

  useEffect(() => {
    updateTabs();
  }, [coachesClass, optionSelected, purchasedHeaders, purshases]);

  useEffect(() => {
    getData().then(([resCoachesClass, resPurchases]) => {
      if (resCoachesClass.statusCode === 200) {
        const { coaches, data } = resCoachesClass.body;
        setCoachesClass(Object.values(data));
        setDateOptions(
          Object.values(data).map(({ fin }) => ({
            name: getHalfMonthDate(fin),
          })),
        );
        setCoaches(coaches);
      } else {
        setToast('Could not recover data', 'error', '/report/coaches-class');
      }
      if (resPurchases.statusCode === 200) {
        const numberFormat = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        });
        const { data } = resPurchases.body;
        setPurchases(
          data.map((e) =>
            e.map((item) => ({
              client: `${item.client.name} ${item.client.lastname}`,
              date: new Date(item.date).toDateString(),
              membership: item.membership.name,
              amount: numberFormat.format(item.amount),
              method: paymentOptions[item.method],
              seller: `${item.receptionst.name} ${item.receptionst.lastname}`,
            })),
          ),
        );
      } else {
        setToast('Could not recover data', 'error', '/purchases');
      }
    });
  }, []);

  return (
    <Tabs
      tabs={tabs}
      customLeft={<Select options={dateOptions} onChange={setOptionSelected} />}
    />
  );
}

export function ClassesByCoach({ coaches, coachesClass, optionSelected }) {
  return (
    <Card
      decoration
      className="z-0 w-full border-0 tremor-border-transparent tremor-swirl-200 dark:bg-tremor-swirl-200"
    >
      <h3 className="font-semibold text-left text-gray-90">Classes by Coach</h3>
      <p className="flex items-center justify-between mt-4">
        <span>Name</span>
        <span>Classes</span>
      </p>
      <BarList
        data={Object.entries(coachesClass[optionSelected]?.classes ?? {}).map(
          ([couchId, count]) => ({
            name: coaches[couchId],
            value: count,
          }),
        )}
        showAnimation
        sortOrder="descending"
      />
    </Card>
  );
}
