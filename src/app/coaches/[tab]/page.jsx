"use client";
import Shedule from "@/components/organisms/Shedule";
import AdminCoaches from "@/components/pages/AdminCoaches";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ACTIVE_CLASS = "text-swirl-900 bg-gray-100";

export default function CoachesPage(props) {
  const params = useParams();
  const [children, setChildren] = useState(null);

  function setActiveClass(tab) {
    return params.tab === tab ? ACTIVE_CLASS : "";
  }

  useEffect(() => {
    switch (params.tab) {
      case "shedule":
        setChildren(<Shedule />);
        break;
      default:
        setChildren(<AdminCoaches />);
        break;
    }
  }, [params.tab]);

  return (
    <div className="h-full py-5 px-10">
      <ul className="flex flex-wrap text-sm font-medium text-center text-swirl-700 border-b border-swirl-200">
        <Link href="/coaches/shedule">
          <li
            className={`me-2 inline-block p-4 rounded-t-lg active ${setActiveClass(
              "shedule"
            )}`}
          >
            Shedule
          </li>
        </Link>
        <Link href="/coaches/admin">
          <li
            className={`me-2 inline-block p-4 rounded-t-lg active ${setActiveClass(
              "admin"
            )}`}
          >
            Coaches
          </li>
        </Link>
      </ul>

      <main className="mt-2 min-h-full">{children}</main>
    </div>
  );
}
