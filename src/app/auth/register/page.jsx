"use client";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

export default function RegisterPage() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  async function onSubmit(data) {
    if (data.password !== data.confirmPassword) {
      return alert("Passwords do not match");
    }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      router.push("/auth/login");
    }
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/3 p-5 border rounded border-swirl-200"
      >
        <h1 className="mb-4 text-4xl font-bold text-center text-swirl-800">
          Registrar
        </h1>

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              label="Name"
              name="name"
              errors={errors}
              placeholder="Jane"
              {...register("name", {
                required: {
                  value: true,
                  message: "Name is required",
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
              {...register("lastname", {
                required: {
                  value: true,
                  message: "Last Name is required",
                },
              })}
              {...field}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              label="Email"
              name="email"
              errors={errors}
              type="email"
              placeholder="email@domain.com"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
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
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required",
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
              label="Confirm Password"
              name="confirmPassword"
              errors={errors}
              placeholder="********"
              type="password"
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "Confirm Password is required",
                },
              })}
              {...field}
            />
          )}
        />

        <Button color="mindaro" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
}
