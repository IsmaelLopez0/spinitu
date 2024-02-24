"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState();

  async function onSubmit(data) {
    console.log(data);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/4">
        <span>
          {error && (
            <p className="bg-red-500  text-lg text-white p3 rounded">{error}</p>
          )}
        </span>
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Login</h1>

        <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
          Email
        </label>
        <input
          type="text"
          name="email"
          placeholder="email@domain.com"
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          {...register("email", {
            required: {
              value: true,
              message: "Email is required",
            },
          })}
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}

        <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="********"
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          {...register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg">
          Register
        </button>
      </form>
    </div>
  );
}
