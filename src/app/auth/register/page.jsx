"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  async function onSubmit(data) {
    if (data.password !== data.confirmPassword) {
      return alert("Passwords do not match");
    }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        email: data.email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      router.push("/auth/login");
    }
    console.log(res);
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/4">
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Registrar</h1>

        <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
          Username
        </label>
        <input
          type="text"
          name="username"
          placeholder="Username123"
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          {...register("username", {
            required: {
              value: true,
              message: "Username is required",
            },
          })}
        />
        {errors.username && (
          <span className="text-red-500 text-xs">
            {errors.username.message}
          </span>
        )}

        <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
          Email
        </label>
        <input
          type="email"
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

        <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="********"
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          {...register("confirmPassword", {
            required: {
              value: true,
              message: "Confirm Password is required",
            },
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-xs">
            {errors.confirmPassword.message}
          </span>
        )}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg">
          Register
        </button>
      </form>
    </div>
  );
}
