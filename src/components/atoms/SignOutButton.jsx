"use client";
import { signOut } from "next-auth/react";
import Button from "./Button";

export default function SignOutButton() {
  return (
    <Button
      color="orchid"
      className="text-sm py-1 px-3"
      onClick={() => signOut()}
    >
      Sign out
    </Button>
  );
}
