'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { setToast } from '@/libs/notificationsAPIs';

export default function RegisterPage({ data, rol, isUpdate, ...props }) {
  const [isloading, setIsloading] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data?.name ?? '',
      lastname: data?.lastname ?? '',
      email: data?.email ?? '',
      password: '',
      phone: data?.phone ?? '',
      specializations:
        JSON.parse(data?.specializations ?? '[]')?.join(', ') ?? '',
      rol,
    },
  });

  const resetForm = () => {
    reset();
    setIsloading(false);
  };

  async function onSubmit(data) {
    setIsloading(true);
    const res = await fetch('/api/auth/register', {
      method: isUpdate ? 'PUT' : 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      resetForm();
      if (props.saveData) props.saveData();
    } else {
      setToast(data.message, 'error', '/api/auth/register');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col p-5 rounded"
    >
      <div className="flex items-center gap-5 mb-3">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              label="Name"
              name="name"
              errors={errors}
              placeholder="Jane"
              {...register('name', {
                required: {
                  value: true,
                  message: 'Name is required',
                },
              })}
              {...field}
            />
          )}
        />

        <Controller
          name="lastname"
          control={control}
          render={({ field }) => (
            <Input
              label="Last Name"
              name="lastname"
              errors={errors}
              placeholder="Doe"
              {...register('lastname', {
                required: {
                  value: true,
                  message: 'Last Name is required',
                },
              })}
              {...field}
            />
          )}
        />
      </div>

      {!data ? (
        <div className="flex items-center gap-5 mb-3">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                label="Email"
                name="email"
                type="email"
                errors={errors}
                placeholder="email@domain.com"
                {...register('email', {
                  required: {
                    value: true,
                    message: 'Email is required',
                  },
                })}
                {...field}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                label="Password"
                name="password"
                errors={errors}
                placeholder="********"
                type="password"
                {...register('password', {
                  required: {
                    value: true,
                    message: 'Password is required',
                  },
                })}
                {...field}
              />
            )}
          />
        </div>
      ) : null}

      <div className="flex items-center gap-5 mb-3">
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input
              label="Phone"
              name="phone"
              errors={errors}
              placeholder="123-456-7890"
              type="tel"
              defaultValue={props.userData?.phone}
              {...register('phone', {
                required: {
                  value: true,
                  message: 'Phone is required',
                },
              })}
              {...field}
            />
          )}
        />
        {rol === 'COACH' ? (
          <Controller
            name="specializations"
            control={control}
            render={({ field }) => (
              <Input
                label="Specializations"
                name="specializations"
                errors={errors}
                placeholder="specialization1, specialization2, specialization3"
                {...register('specializations', {
                  required: {
                    value: true,
                    message: 'Specializations is required',
                  },
                })}
                {...field}
              />
            )}
          />
        ) : null}
      </div>

      <div className="flex gap-5">
        <Button
          color="mindaro"
          className="w-full"
          type="outline"
          onClick={() => {
            resetForm();
            props.closeDialog({ show: false });
          }}
        >
          Cancel
        </Button>
        <Button color="orchid" className="w-full" isloading={isloading}>
          {data ? 'Update' : 'Register'}
        </Button>
      </div>
    </form>
  );
}
