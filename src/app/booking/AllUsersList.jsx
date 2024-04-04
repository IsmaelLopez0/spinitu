import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { PlusCircleIcon } from '@heroicons/react/16/solid';
import Table from '@/components/atoms/Table';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Autocomplete from '@/components/atoms/Autocomplete';
import Dialog from '@/components/atoms/Dialog';
import { genericFetch } from '@/libs/externalAPIs';
import { setToast } from '@/libs/notificationsAPIs';

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Next class', key: 'next' },
  { title: 'Hour', key: 'hour' },
  { title: 'Remaining classes', key: 'days_to_access' },
  { title: 'End of membership', key: 'end_date' },
];

export default function AllUsersList(props) {
  const [data, setData] = useState([]);
  const [addClassDialog, setAddClassDialog] = useState({ show: false });
  const [memberships, setMemberships] = useState([]);
  const [membershipSelected, setMembershipSelected] = useState();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      search: '',
    },
  });

  function onSubmit(data) {
    getClients(data.search);
  }

  function getTime(date) {
    const tempHour = date.getHours();
    const hour = tempHour < 10 ? `0${tempHour}` : tempHour;
    const minutes = date.getMinutes();
    return `${hour}:0${minutes}`;
  }

  function RemainingClases(props) {
    return (
      <div className="flex items-center justify-center w-full">
        <span className="w-5">{props.days_to_access}</span>
        <PlusCircleIcon
          onClick={() => setAddClassDialog({ show: true, payload: props })}
          className="h-5 ml-2 cursor-pointer text-mindaro-500"
        />
      </div>
    );
  }

  function getClients(emailOrName) {
    const query = {};
    if (emailOrName) query.emailOrName = emailOrName;
    const params = { url: '/user/allClients', method: 'GET', query };
    genericFetch(params).then((res) => {
      if (res.statusCode === 200) {
        const newData = res.body.map(({ memberships, ...item }) => {
          const dateStart = new Date(item.class?.date_start);
          return {
            ...item,
            next: item.class?.date_start ? dateStart.toDateString() : '',
            name: `${item.name ?? ''} ${item.lastname ?? ''}`,
            hour: item.class?.date_start ? getTime(dateStart) : '',
            end_date: item.end_date
              ? new Date(item.end_date).toDateString()
              : '',
            days_to_access: <RemainingClases {...item} />,
          };
        });
        setData(newData);
      } else {
        setToast('Something went wrong', 'error', '/user/allClients');
      }
    });
  }

  function createMembership(payload) {
    const body = {
      userId: payload.id,
      membershipTypeId: membershipSelected.id,
    };
    const params = { url: '/membership', method: 'POST', body };
    genericFetch(params).then((res) => {
      if (res.statusCode === 200) {
        setAddClassDialog({ show: false });
        setToast('Membership updated', 'success', '/membership');
        getClients();
      } else {
        setToast('Something went wrong', 'error', '/membership');
      }
    });
  }

  useEffect(() => {
    getClients();
    const params = { url: '/membership-types', method: 'GET' };
    genericFetch(params).then((res) => {
      if (res.statusCode === 200) {
        setMemberships(res.body);
      } else {
        setToast('Something went wrong', 'error', '/membership-types');
      }
    });
  }, []);

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
        <Button text="Search" className="px-3 py-1 h-1/2" color="mindaro" />
      </form>
      <Table title="All users" caption="" headers={headers} data={data} />
      {addClassDialog.show ? (
        <Dialog title="Add classes">
          <p>
            <span className="underline decoration-solid">User</span>:{' '}
            {addClassDialog.payload.name ?? ''}{' '}
            {addClassDialog.payload.lastname ?? ''}
          </p>
          <p>
            <span className="underline decoration-solid">
              Remaining classes
            </span>
            : {addClassDialog.payload.days_to_access ?? 0}
          </p>
          <Autocomplete
            list={memberships}
            selected={membershipSelected}
            setSelected={setMembershipSelected}
          />
          <div className="flex justify-end gap-3 mt-3">
            <Button
              color="orchid"
              type="outline"
              onClick={() => setAddClassDialog({ show: false })}
            >
              Cancel
            </Button>
            <Button
              color="mindaro"
              onClick={() => createMembership(addClassDialog.payload)}
            >
              Add
            </Button>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}
