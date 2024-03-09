import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignOutButton from "../atoms/SignOutButton";
import Notifications from "../atoms/Notifications";

async function NavBar() {
  const session = await getServerSession(authOptions);
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between px-24 py-3 border-b bg-cararra-100 text-swirl-800 border-swirl-200">
      <div className="flex flex-row items-center">
        <h1 className="text-xl font-bold">SPINITU</h1>
      </div>
      <ul className="flex items-center gap-x-5">
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
            <Notifications />
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
