"use client";
import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import Card from "@/components/organisms/Card";
import FormProfile from "./FormProfile";
import FormChangePassword from "./FormChangePassword";
import Button from "@/components/atoms/Button";
import Dialog from "@/components/atoms/Dialog";
import { genericFetch } from "@/libs/externalAPIs";
import { setToast } from "@/libs/notificationsAPIs";

export default function ProfilePage() {
  const [userData, setUserData] = useState({});
  const [showDialog, setShowDialog] = useState(false);

  async function init() {
    const { user } = await getSession();
    const params = {
      url: "/user/user",
      query: { email: user.email },
      method: "GET",
    };
    const data = await genericFetch(params);
    setUserData(data);
  }

  async function deleteAccount() {
    const params = {
      url: "/user",
      query: { email: userData.email },
      method: "DELETE",
    };
    const data = await genericFetch(params);
    if (data.statusCode === 200) {
      await signOut();
    } else {
      setToast(data.body.error, "error", params.url + data.statusCode);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <section className="flex items-center justify-center h-full px-5 py-3 gap-x-5">
      <div className="grid grid-cols-2 grid-rows-2 gap-10">
        <div className="row-span-2">
          <Card
            data={{
              title: `${userData?.name ?? ""} ${userData?.lastname ?? ""}`,
              description: userData.email ?? "",
            }}
          >
            <FormProfile userData={userData} setUserData={setUserData} />
          </Card>
        </div>

        <Card data={{ title: "Change password" }}>
          <FormChangePassword email={userData.email} />
        </Card>
        <div className="col-start-2">
          <Card data={{ title: "⚠️ Deactivate account" }}>
            <p className="text-red-600">
              {"Once your account has been deactivate, it's gone for good."}
            </p>
            <Button
              color="orchid"
              text="Deactivate account"
              className="w-full mt-2 bg-red-700"
              onClick={() => setShowDialog(true)}
            />
          </Card>
        </div>
      </div>
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
                className="ml-3 text-sm bg-red-700"
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
    </section>
  );
}
