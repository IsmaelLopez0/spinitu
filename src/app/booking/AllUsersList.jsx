import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { PlusCircleIcon } from '@heroicons/react/16/solid';
import Table from '@/components/atoms/Table';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Autocomplete from '@/components/atoms/Autocomplete';
import Dialog from '@/components/atoms/Dialog';
import RadioGroup from '@/components/atoms/RadioGroup';
import { genericFetch } from '@/libs/externalAPIs';
import { setToast } from '@/libs/notificationsAPIs';
import { useUserConfig } from '@/stores/useUserConfig';

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Next class', key: 'next' },
  { title: 'Hour', key: 'hour' },
  { title: 'Remaining classes', key: 'days_to_access' },
  { title: 'End of membership', key: 'end_date' },
];

const paymentOptions = [
  { value: 'CASH', name: 'Cash' },
  { value: 'CREDIT_CARD', name: 'Credit Card' },
  { value: 'DEBIT', name: 'Debit' },
  { value: 'BANK_TRANSFERS', name: 'Bank Transfers' },
];

export default function AllUsersList(props) {
  const [data, setData] = useState([]);
  const [addClassDialog, setAddClassDialog] = useState({ show: false });
  const [memberships, setMemberships] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [isLoading, setIsLoading] = useState(false);
  const [membershipSelected, setMembershipSelected] = useState();
  const user = useUserConfig((state) => state.user);
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
        <span className="w-5">{props.days_to_access ?? 0}</span>
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
    if (!payload.id || !membershipSelected.id || !paymentMethod) {
      setToast(
        'You need to fill out some of the fields',
        'error',
        '/membership',
      );
      return;
    }
    setIsLoading(true);
    const body = {
      userId: payload.id,
      membershipTypeId: membershipSelected.id,
      receptionstId: user.id,
      method: paymentMethod,
    };
    const params = { url: '/membership', method: 'POST', body };
    genericFetch(params).then((res) => {
      setIsLoading(false);
      if (res.statusCode === 200) {
        getClients();
        setMembershipSelected();
        setToast('Membership updated', 'success', '/membership');
        setAddClassDialog({ show: false });
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
            label={<div className="mt-2">Select membership:</div>}
            list={memberships}
            selected={membershipSelected}
            setSelected={setMembershipSelected}
          />
          <RadioGroup
            groupName="Payment Method"
            type="column"
            defaultValue="CASH"
            options={paymentOptions}
            className="mt-2"
            setValue={setPaymentMethod}
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
              isLoading={isLoading}
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
