'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { genericFetch } from '@/libs/externalAPIs';
import { setToast } from '@/libs/notificationsAPIs';

export default function FormProfile(props) {
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmitProfile(data) {
    setIsLoadingButton(true);
    const params = {
      url: '/user',
      body: { ...data, email: props.userData.email },
      method: 'PUT',
    };
    const res = await genericFetch(params);
    if (res.statusCode === 200) {
      props.setUserData(res.body);
      setToast('Saved Successfully', 'success', params.url);
    } else {
      setToast(res.body.error, 'error', params.url + res.statusCode);
    }

    setIsLoadingButton(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmitProfile)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            label="Name"
            name="name"
            placeholder="Jane"
            defaultValue={props.userData?.name}
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
            placeholder="Doe"
            defaultValue={props.userData?.lastname}
            {...field}
          />
        )}
      />

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
            {...field}
          />
        )}
      />
      <Controller
        name="biography"
        control={control}
        render={({ field }) => (
          <Input
            label="Biography"
            name="biography"
            placeholder="About me..."
            defaultValue={props.userData?.biography}
            {...field}
          />
        )}
      />

      <Button
        isLoading={isLoadingButton}
        color="mindaro"
        type="solid"
        className="w-full"
      >
        Update profile
      </Button>
    </form>
  );
}
