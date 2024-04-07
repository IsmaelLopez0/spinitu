'use client';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { useUserConfig } from '@/stores/useUserConfig';

export default function LoginPage() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState();
  const user = useUserConfig((state) => state.user);

  async function onSubmit(data) {
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res.error) {
      setError(res.error);
    } else {
      router.push('/booking');
      router.refresh();
    }
  }

  if (user) {
    router.push('/booking');
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/3 p-5 border rounded border-swirl-200"
      >
        {error && (
          <p className="p-3 mb-2 text-lg text-center text-white bg-red-500 rounded">
            {error}
          </p>
        )}
        <h1 className="mb-4 text-4xl font-bold text-center text-swirl-800">
          Login
        </h1>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              label="Email"
              name="email"
              errors={errors}
              placeholder="email@domain.com"
              type="email"
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

        <Button color="mindaro" type="solid" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
