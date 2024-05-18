'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useImage } from 'react-image';
import { getSession, signOut } from 'next-auth/react';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import Card from '@/components/organisms/Card';
import FormProfile from './FormProfile';
import FormChangePassword from './FormChangePassword';
import Button from '@/components/atoms/Button';
import Dialog from '@/components/atoms/Dialog';
import { genericFetch } from '@/libs/externalAPIs';
import { setToast } from '@/libs/notificationsAPIs';
import { resizeFile } from '@/libs/_utilsFunctions';
import { useUserConfig } from '@/stores/useUserConfig';

export default function ProfilePage() {
  const [userData, setUserData] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const { src } = useImage({
    srcList: [userData?.profileImageURL, 'images/userDefault.svg'],
  });
  const setUser = useUserConfig((state) => state.setUser);

  async function init() {
    const { user } = await getSession();
    const params = {
      url: '/user/user',
      query: { email: user.email },
      method: 'GET',
    };
    const data = await genericFetch(params);
    setUserData(data.body);
    setUser(data.body);
  }

  async function deleteAccount() {
    const params = {
      url: '/user',
      body: { email: userData.email },
      method: 'DELETE',
    };
    const data = await genericFetch(params);
    if (data.statusCode === 200) {
      await signOut();
    } else {
      setToast(data.body.error, 'error', params.url + data.statusCode);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <section className="grid grid-cols-2 grid-rows-1 gap-14">
        <div className="">
          <Card data={{}}>
            <div className="flex justify-between">
              <div>
                <h3 className="mb-2 text-lg font-medium">
                  {userData?.name ?? ''} {userData?.lastname ?? ''}
                </h3>
                <p className="mb-4 text-sm text-gr ay-500">
                  {userData.email ?? ''}
                </p>
              </div>
              <div className="relative">
                <Suspense>
                  <img
                    src={src}
                    alt={userData?.name ?? 'User image'}
                    style={{
                      borderRadius: '100%',
                      objectFit: 'cover',
                      width: '100px',
                      height: '100px',
                    }}
                  />
                </Suspense>
                <div className="absolute z-10 flex items-end -bottom-2 -left-2">
                  <label
                    htmlFor="addImage"
                    className="flex items-center justify-center w-10 h-10 px-1 border rounded-full cursor-pointer border-white/25 bg-swirl-700"
                  >
                    <PencilSquareIcon className="h-6 text-swirl-100" />
                  </label>
                  <input
                    type="file"
                    id="addImage"
                    name="profileImage"
                    className="invisible w-0"
                    accept="image/*"
                    onChange={(e) => {
                      const imageType = e.target.files[0].type;
                      resizeFile(e.target.files[0]).then((res) => {
                        setUserData((prev) => ({
                          ...prev,
                          profileImageURL: res,
                          imageType,
                        }));
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <FormProfile
              userData={userData}
              setUserData={setUserData}
              callback={() => init()}
            />
          </Card>
        </div>

        <div className="flex flex-col gap-10">
          <Card data={{ title: 'Change password' }}>
            <FormChangePassword email={userData.email} />
          </Card>
          <Card data={{ title: '⚠️ Deactivate account' }}>
            <p className="text-red-600">
              {"Once your account has been deactivate, it's gone for good."}
            </p>
            <Button
              color="mindaro"
              text="Deactivate account"
              className="w-full mt-2 bg-red-700"
              onClick={() => setShowDialog(true)}
            />
          </Card>
        </div>
      </section>
      {showDialog ? (
        <Dialog
          title="Deactivate account"
          description="Are you sure you want to deactivate your account? All of
                      your data will be permanently removed. This action cannot
                      be undone."
          footer={
            <>
              <Button
                color="mindaro"
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
    </>
  );
}
