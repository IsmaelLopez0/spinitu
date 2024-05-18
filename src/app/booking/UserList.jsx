import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Table from '@/components/atoms/Table';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { genericFetch } from '@/libs/externalAPIs';
import { sumDaysToDate, convertTZ } from '@/libs/_utilsFunctions';

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Emaīl', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: 'Hour', key: 'hour' },
  { title: 'Remaīnīng classes', key: 'days_to_access' },
];

export default function UserList(props) {
  const [data, setData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      search: '',
    },
  });

  function onSubmit(data) {
    getClients(data.search);
  }

  function formatDate(date) {
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  function getTime(date) {
    const hour = `${date.getHours()}`.padStart(2, '0');
    const minutes = date.getMinutes();
    return `${hour}:${minutes}`;
  }

  function getClients(emailOrName) {
    const dateStart = formatDate(new Date());
    const dateEnd = formatDate(sumDaysToDate(new Date(), 1));
    const query = { dateStart };
    if (emailOrName) query.emailOrName = emailOrName;
    const params = { url: '/user/clients', method: 'GET', query };
    setIsLoadingData(true);
    genericFetch(params).then((res) => {
      if (res.statusCode === 200) {
        const newData = res.body.map(({ memberships, ...item }) => ({
          ...item,
          name: `${item.name ?? ''} ${item.lastname ?? ''}`,
          phone: item.phone ?? '',
          hour: convertTZ(item.date_start),
          ...memberships[0],
        }));
        setData(newData);
      } else {
        setToast('Something went wrong', 'error', '/user/clients');
      }
      setIsLoadingData(false);
    });
  }

  useEffect(() => {
    getClients();
  }, [props.isloading]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center w-1/3 gap-3 pl-3"
      >
        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <Input placeholder="Search by name o email" ref={null} {...field} />
          )}
        />
        <Button text="Search" className="px-3 py-1 h-1/2" color="orchid" />
      </form>
      <Table
        title="Today"
        caption="The people who appear in the following list are those who have class today"
        headers={headers}
        data={data}
        isloading={isLoadingData || props.isloading}
      />
    </div>
  );
}
