"use client";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  return (
    <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <div>
        <h1 className="text-5xl text-swirl-500">Dashboard</h1>
        <button
          className="px-4 py-2 mt-4 text-black bg-white rounded-md"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </section>
  );
}
