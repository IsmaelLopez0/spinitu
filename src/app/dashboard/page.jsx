'use client';
import React, { useEffect, useState } from 'react';
import { BarList, Card } from '@tremor/react';
import Select from '@/components/atoms/Select';
import { genericFetch } from '@/libs/externalAPIs';
import { obtenerNombreMes } from '@/libs/_utilsFunctions';

async function getData() {
  const params = {
    url: '/report/coaches-class',
    method: 'GET',
  };
  const response = await genericFetch(params);
  return response;
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

export default function DashboardPage() {
  const [data, setData] = useState([]);
  const [coaches, setCoaches] = useState({});
  const [optionSelected, setOptionSelected] = useState(0);
  const [dateOptions, setDateOptions] = useState([]);

  useEffect(() => {
    getData().then((res) => {
      if (res.statusCode === 200) {
        const { coaches, data } = res.body;
        setData(Object.values(data));
        setDateOptions(
          Object.values(data).map(({ fin }) => ({
            name: getHalfMonthDate(fin),
          })),
        );
        setCoaches(coaches);
      } else {
        setToast('Could not recover data', 'error', '/report/coaches-class');
      }
    });
  }, []);

  return (
    <section className="h-[calc(100vh-7rem)]">
      <Select options={dateOptions} onChange={setOptionSelected} />
      <Card
        decoration
        className="z-0 max-w-lg mt-3 border-0 tremor-border-transparent tremor-swirl-200 dark:bg-tremor-swirl-200"
      >
        <h3 className="font-medium">Classes by Coach</h3>
        <p className="flex items-center justify-between mt-4">
          <span>Name</span>
          <span>Classes</span>
        </p>
        <BarList
          data={Object.entries(data[optionSelected]?.classes ?? {}).map(
            ([couchId, count]) => ({
              name: coaches[couchId],
              value: count,
            }),
          )}
          showAnimation
          sortOrder="descending"
        />
      </Card>
    </section>
  );
}
