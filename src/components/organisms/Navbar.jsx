import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignOutButton from "../atoms/SignOutButton";

async function NavBar() {
  const session = await getServerSession(authOptions);
  return (
    <nav className="sticky top-0 z-30 flex justify-between items-center bg-cararra-100 text-swirl-800 px-24 py-3 border-b border-swirl-200">
      <h1 className="text-xl font-bold">SPINITU</h1>
      <ul className="flex gap-x-5 items-center">
        {!session?.user ? (
          <>
            <li>
              <Link href="/auth/login">Login</Link>
            </li>
            <li>
              <Link href="/auth/register">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <Link href="/coaches/shedule">Coaches</Link>
            </li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <SignOutButton />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
