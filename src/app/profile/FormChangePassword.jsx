"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

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
    const res = await fetch(`/api/profile/warning`, {
      method: "PUT",
      body: JSON.stringify({
        newPassword,
        currentPassword,
        email: props.email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status !== 200) {
      setError(await res.json());
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
