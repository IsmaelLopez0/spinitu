"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { genericFetch } from "@/libs/externalAPIs";
import { setToast } from "@/libs/notificationsAPIs";

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
    const params = {
      url: "/user",
      body: {
        newPassword,
        currentPassword,
        email: props.email,
      },
      method: "PUT",
    };
    const res = await genericFetch(params);
    if (res.statusCode !== 200) {
      setToast(res.body.error, "error", params.url + res.statusCode);
      setError(es.body.error);
    }

    setIsLoadingButton(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmitChangePassword)}>
      {error && (
        <p className="bg-red-500 text-lg text-center text-white p-3 mb-2 rounded">
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
            {...register("currentPassword", {
              required: {
                value: true,
                message: "Current Password is required",
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
            {...register("newPassword", {
              required: {
                value: true,
                message: "New Password is required",
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
            {...register("confirmPassword", {
              required: {
                value: true,
                message: "Confirm New Password is required",
              },
            })}
            {...field}
          />
        )}
      />

      <Button
        isLoading={isLoadingButton}
        color="mindaro"
        type="outline"
        className="w-full"
      >
        Change Password
      </Button>
    </form>
  );
}
