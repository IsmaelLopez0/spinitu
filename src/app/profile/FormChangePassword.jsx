'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { setToast } from '@/libs/notificationsAPIs';

export default function FormProfile(props) {
  const [error, setError] = useState();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmitChangePassword(data) {
    setError();
    setIsLoadingButton(true);
    const { currentPassword, newPassword, confirmPassword } = data;
    if (newPassword !== confirmPassword) {
      setError("New password don't match");
      setIsLoadingButton(false);
      return;
    }
    const response = await fetch(`/api/profile/warning`, {
      method: 'PUT',
      body: JSON.stringify({
        newPassword,
        currentPassword,
        email: props.email,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const res = await response.json();
    if (res.statusCode !== 200) {
      setToast(
        res.body.error,
        'error',
        '/api/profile/warning' + res.statusCode,
      );
      setError(res.body.error);
    } else {
      setToast('Password saved correctly', 'success', '/api/profile/warning');
    }

    setIsLoadingButton(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmitChangePassword)}>
      {error && (
        <p className="p-3 mb-2 text-lg text-center text-white bg-red-500 rounded">
          {error}
        </p>
      )}
      <Controller
        name="currentPassword"
        control={control}
        render={({ field }) => (
          <Input
            label="Current Password"
            name="currentPassword"
            placeholder="*******"
            type="password"
            errors={errors}
            {...register('currentPassword', {
              required: {
                value: true,
                message: 'Current Password is required',
              },
            })}
            {...field}
          />
        )}
      />
      <Controller
        name="newPassword"
        control={control}
        render={({ field }) => (
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="********"
            errors={errors}
            {...register('newPassword', {
              required: {
                value: true,
                message: 'New Password is required',
              },
            })}
            {...field}
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            errors={errors}
            placeholder="********"
            type="password"
            {...register('confirmPassword', {
              required: {
                value: true,
                message: 'Confirm New Password is required',
              },
            })}
            {...field}
          />
        )}
      />

      <Button
        isloading={isLoadingButton}
        color="orchid"
        type="outline"
        className="w-full"
      >
        Change Password
      </Button>
    </form>
  );
}
