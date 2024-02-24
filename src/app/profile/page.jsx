"use client";
import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import Card from "@/components/organisms/Card";
import FormProfile from "./FormProfile";
import FormChangePassword from "./FormChangePassword";
import Button from "@/components/atoms/Button";
import Dialog from "@/components/atoms/Dialog";

export default function ProfilePage() {
  const [userData, setUserData] = useState({});
  const [showDialog, setShowDialog] = useState(false);

  async function init() {
    const { user } = await getSession();
    const res = await fetch(`/api/profile?email=${user.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setUserData(await res.json());
  }

  async function deleteAccount() {
    const res = await fetch(`/api/profile/warning`, {
      method: "DELETE",
      body: JSON.stringify({ email: userData.email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      await signOut();
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <section className="h-full py-3 px-5 flex justify-center items-center gap-x-5">
      <div className="w-1/2 flex flex-col gap-y-4 ">
        <Card
          data={{
            title: `${userData?.name ?? ""} ${userData?.lastname ?? ""}`,
            description: userData.email ?? "",
          }}
        >
          <FormProfile userData={userData} setUserData={setUserData} />
        </Card>

        <Card data={{ title: "Change password" }}>
          <FormChangePassword email={userData.email} />
        </Card>
        <Card data={{ title: "⚠️ Deactivate account" }}>
          <p className="text-red-600">
            {"Once your account has been deactivate, it's gone for good."}
          </p>
          <Button
            color="orchid"
            text="Deactivate account"
            className="mt-2 w-full bg-red-700"
            onClick={() => setShowDialog(true)}
          />
        </Card>
        {showDialog ? (
          <Dialog
            title="Deactivate account"
            description="Are you sure you want to deactivate your account? All of
                      your data will be permanently removed. This action cannot
                      be undone."
            footer={
              <>
                <Button
                  color="orchid"
                  text="Deactivate account"
                  className="text-sm ml-3 bg-red-700"
                  onClick={() => {
                    deleteAccount();
                    setShowDialog(false);
                  }}
                >
                  Deactivate
                </Button>
                <Button
                  type="outline"
                  className="text-sm"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </Button>
              </>
            }
          />
        ) : null}
      </div>
    </section>
  );
}
