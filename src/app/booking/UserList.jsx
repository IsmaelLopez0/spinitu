import { useForm, Controller } from 'react-hook-form';
import Table from '@/components/atoms/Table';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Time', key: 'time' },
  { title: 'Remaining classes', key: 'remaining' },
];

const data = [
  {
    name: 'Apple MacBook Pro 17"',
    color: 'Silver',
    category: 'Laptop',
    price: '$2999',
  },
  {
    name: 'Microsoft Surface Pro',
    color: 'White',
    category: 'Laptop PC',
    price: '$1999',
  },
  {
    name: 'Magic Mouse 2',
    color: 'Black',
    category: 'Accessories',
    price: '$99',
  },
];

export default function UserList(props) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      search: '',
    },
  });

  function onSubmit(data) {
    console.log(data);
  }

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
      <Table
        title="Today"
        caption="The people who appear in the following list are those who have class today"
        headers={headers}
        data={data}
        actions={<button>Action</button>}
      />
    </div>
  );
}
