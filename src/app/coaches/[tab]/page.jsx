"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Schedule from "@/components/organisms/Schedule";
import AdminCoaches from "@/components/pages/AdminCoaches";
import { useUserConfig } from "@/stores/useUserConfig";

const ACTIVE_CLASS = "text-swirl-900 bg-gray-100";

export default function CoachesPage(props) {
  const params = useParams();
  const [children, setChildren] = useState(null);
  const user = useUserConfig((state) => state.user);
  const setUser = useUserConfig((state) => state.setUser);

  function setActiveClass(tab) {
    return params.tab === tab ? ACTIVE_CLASS : "";
  }

  useEffect(() => {
    switch (params.tab) {
      case "shedule":
        setChildren(<Schedule user={user} />);
        break;
      default:
        setChildren(<AdminCoaches />);
        break;
    }
  }, [params.tab, user]);

  useEffect(() => {
    if (!user?.name) {
      getSession().then(({ user }) =>
        fetch(`/api/profile?email=${user.email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          res.json().then((data) => setUser(data));
        })
      );
    }
  }, [setUser, user]);

  return (
    <div className="h-full px-10 py-5">
      <div className="flex flex-wrap text-sm font-medium text-center border-b text-swirl-700 border-swirl-200">
        <Link href="/coaches/shedule">
          <span
            className={`me-2 inline-block p-4 rounded-t-lg active ${setActiveClass(
              "shedule"
            )}`}
          >
            Shedule
          </span>
        </Link>
        <Link href="/coaches/admin">
          <span
            className={`me-2 inline-block p-4 rounded-t-lg active ${setActiveClass(
              "admin"
            )}`}
          >
            Coaches
          </span>
        </Link>
      </div>

      <main className="min-h-full mt-2">{children}</main>
    </div>
  );
}
