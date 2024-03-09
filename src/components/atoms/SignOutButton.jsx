"use client";
import { signOut } from "next-auth/react";
import Button from "./Button";

export default function SignOutButton() {
  return (
    <Button
      color="orchid"
      className="px-3 py-1 text-sm"
      onClick={() => signOut()}
    >
      Sign out
    </Button>
  );
}
