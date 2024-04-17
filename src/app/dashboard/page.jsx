'use client';
import React, { useEffect, useState } from 'react';
import { BarList, Card } from '@tremor/react';
import Select from '@/components/atoms/Select';
import { genericFetch } from '@/libs/externalAPIs';
import { obtenerNombreMes } from '@/libs/_utilsFunctions';
import { paymentOptions } from '@/libs/vars';
import Table from '@/components/atoms/Table';

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

const getHalfMonthDate = (dateEnd) => {
  const endDate = new Date(dateEnd);
  const month = endDate.getMonth();
  const dayEnd = endDate.getDate();
  const endText = `half of ${obtenerNombreMes(month)}`;
  if (dayEnd <= 15) {
    return `First ${endText}`;
  }
  return `Second ${endText}`;
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
      console.log(resPurchases);
      if (resPurchases.statusCode === 200) {
        const { data } = resPurchases.body;
        setPurchases(
          data.map((e) =>
            e.map((item) => ({
              client: `${item.client.name} ${item.client.lastname}`,
              date: new Date(item.date).toDateString(),
              membership: item.membership.name,
              amount: item.amount,
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
    <section className="h-[calc(100vh-7rem)] grid grid-cols-2 grid-rows-[40px_minmax(0,_1fr)] gap-4">
      <div className="flex justify-center w-full col-span-2">
        <Select options={dateOptions} onChange={setOptionSelected} />
      </div>
      <Card
        decoration
        className="z-0 w-full border-0 tremor-border-transparent tremor-swirl-200 dark:bg-tremor-swirl-200"
      >
        <h3 className="font-semibold text-left text-gray-90">
          Classes by Coach
        </h3>
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
      <Table
        title="Packages purchased"
        caption=""
        headers={purchasedHeaders}
        data={purshases[optionSelected] ?? []}
      />
    </section>
  );
}
