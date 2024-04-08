'use client';
import { signOut } from 'next-auth/react';
import Button from './Button';

export default function SignOutButton({ isMenu, active }) {
  const signOutFunc = () => signOut();
  if (isMenu) {
    return (
      <button
        className="flex items-center w-full text-sm rounded-md"
        onClick={signOutFunc}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-5 h-5 mr-2 ${active ? 'text-white' : 'text-swirl-700'}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
          />
        </svg>
        Sign out
      </button>
    );
  }

  return (
    <Button color="orchid" className="px-3 py-1 text-sm" onClick={signOutFunc}>
      Sign out
    </Button>
  );
}
