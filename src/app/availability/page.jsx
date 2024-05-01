'use client';
import React, { useEffect, useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  CheckBadgeIcon,
} from '@heroicons/react/16/solid';
import GenericLoading from '@/components/atoms/GenericLoading';
import ScheduleByDayComponent from '@/components/atoms/ScheduleByDayComponent';
import ScheduleByDayComponentSkeleton from '@/components/atoms/ScheduleByDayComponentSkeleton';
import Dialog from '@/components/atoms/Dialog';
import {
  getDay,
  obtenerNombreMes,
  getCurrentWeek,
  convertTZ,
} from '@/libs/_utilsFunctions';
import Button from '@/components/atoms/Button';
import { genericFetch } from '@/libs/externalAPIs';
import { setToast, createNotification } from '@/libs/notificationsAPIs';
import { useUserConfig } from '@/stores/useUserConfig';

const dias = ['Time', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const currentWeek = getCurrentWeek();

async function createClass(dateStart, instructorId, type) {
  const params = {
    url: '/class',
    body: { dateStart, instructorId, type },
    method: 'POST',
  };
  const res = await genericFetch(params);
  if (res.statusCode === 200) {
    return res.body.id;
  }
  setToast(res.body.error, 'error', params.url + res.statusCode);
  return;
}

async function getWeekClasses(firstDayWeek) {
  if (!firstDayWeek) return {};
  const tempDate = new Date(firstDayWeek);
  const lastDayWeek = new Date(tempDate.setDate(tempDate.getDate() + 7));
  const params = {
    url: '/class',
    query: { firstDayWeek, lastDayWeek },
    method: 'GET',
  };
  const res = await genericFetch(params);
  if (res.statusCode === 200) {
    return res.body;
  }
  setToast(res.body.error, 'error', params.url + res.statusCode);
  return {};
}

async function createDisponibility(classId, userId) {
  const params = {
    url: '/class/disponibility',
    body: { classId, userId },
    method: 'POST',
  };
  const res = await genericFetch(params);
  if (res.statusCode !== 200) {
    setToast(res.body.error, 'error', params.url + res.statusCode);
  } else {
    setToast('Successfully applied', 'success', params.url + res.statusCode);
  }
}

async function updateClass(classId, instructorId, dateStart) {
  const params = {
    url: '/class',
    body: { classId, instructorId },
    method: 'PUT',
  };
  const res = await genericFetch(params);
  if (res.statusCode === 200) {
    createNotification(
      instructorId,
      'You were assigned a class',
      `You have been assigned the class of ${convertTZ(dateStart)}`,
    );
    return res.body;
  } else {
    setToast(res.body.error, 'error', params.url + res.statusCode);
  }
}

async function verifyClass(classId, user, instructorId, dateStart) {
  const { name, lastname, id } = user;
  const params = {
    url: '/class',
    body: { classId, verifiedBy: id },
    method: 'PUT',
  };
  const res = await genericFetch(params);
  if (res.statusCode === 200) {
    const res = await createNotification(
      instructorId,
      'An administrator approved your class',
      `The administrator ${name} ${lastname} confirmed that you will teach the class ${convertTZ(dateStart)}`,
    );
  } else {
    setToast(res.body.error, 'error', params.url + res.statusCode);
  }
}

function couchIncluded(couches = [], userId) {
  return couches.some((s) => s.id === userId);
}

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

export default function AvailabilityPage() {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isCoach, setIsCoach] = useState(false);
  const [week, setWeek] = useState(currentWeek ?? 1);
  const [firstDayWeek, setFirstDayWeek] = useState();
  const [classesExist, setClassesExist] = useState({});
  const [classDetail, setClassDetail] = useState({ show: false });
  const [isloading, setIsloading] = useState(false);
  const [isLoadingClassDetail, setIsLoadingClassDetail] = useState(false);
  const [isLoadingModalBtn, setIsLoadingModalBtn] = useState(false);
  const user = useUserConfig((state) => state.user);

  useEffect(() => {
    const añoActual = new Date().getFullYear();
    const firstDayYear = new Date(añoActual, 0, 1);
    const firstDayWeek = new Date(
      firstDayYear.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000,
    );
    if (isFirstLoad && new Date().getDay() === 1) {
      setWeek(currentWeek + 1);
    } else {
      setFirstDayWeek(firstDayWeek);
    }
  }, [week]);

  useEffect(() => {
    if (isFirstLoad && user?.name) {
      const coach = Boolean(user?.rol === 'COACH');
      setIsCoach(coach);
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, user]);

  useEffect(() => {
    if (firstDayWeek && isloading === false) {
      getClassExist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstDayWeek]);

  if (!firstDayWeek) {
    return <GenericLoading />;
  }

  function getClassExist() {
    setIsloading(true);
    getWeekClasses(firstDayWeek).then((res) => {
      setClassesExist(res);
      setIsloading(false);
    });
  }

  function handleWeek(isNextWeek = true) {
    setWeek((state) => (isNextWeek ? state + 1 : state - 1));
  }

  async function setDisponibility(dateStart, classId, type) {
    let id = classId;
    if (!id) {
      id = await createClass(dateStart, user?.coaches.user_id, type);
      createNotification(
        user?.coaches.user_id,
        'Default asignation',
        `You have been assigned by default the class of ${convertTZ(dateStart)}`,
      );
    }
    await createDisponibility(id, user?.coaches.user_id);
    setClassDetail({ show: false });
    setIsLoadingModalBtn(false);
    getClassExist();
  }

  return (
    <>
      <div className="grid grid-flow-col grid-cols-8 h-full grid-rows-12 gap-2.5 text-center">
        {dias.map((day, i) => {
          const { currentDay, monthDay } = getDay(firstDayWeek, i - 1);
          const istoday = isToday(currentDay);
          return (
            <React.Fragment key={`${currentDay}-${i}`}>
              {i > 0 ? (
                <div className="sticky top-[60px] bg-cararra-100 flex items-center justify-center nm-10">
                  {i === 1 ? (
                    <ChevronLeftIcon
                      className="mr-2 cursor-pointer text-mindaro-700 h-7"
                      onClick={() => handleWeek(false)}
                    />
                  ) : null}
                  <div
                    className={`flex flex-col ${istoday ? 'bg-mindaro-300 rounded-2xl p-2' : ''}`}
                  >
                    <p>
                      {currentDay.getDate()}/{obtenerNombreMes(monthDay)}
                    </p>
                    <span>{day}</span>
                  </div>
                  {i === 7 ? (
                    <ChevronRightIcon
                      className="ml-2 cursor-pointer text-mindaro-700 h-7"
                      onClick={() => handleWeek(true)}
                    />
                  ) : null}
                </div>
              ) : (
                <div
                  className="text-xs text-white sticky top-[60px] bg-cararra-100 flex flex-col gap-4 gap-y-2 py-2 px-5"
                  key={day + '-' + i}
                >
                  <span className="p-1 rounded bg-orchid-200">Past</span>
                  <span className="p-1 rounded bg-orchid-500/50">No coach</span>
                  <span className="h-full p-1 rounded bg-orchid-700">
                    With Coach
                  </span>
                </div>
              )}
              {isloading ? (
                <ScheduleByDayComponentSkeleton day={i} />
              ) : (
                <ScheduleByDayComponent
                  day={i}
                  currentDay={currentDay}
                  isCoach={isCoach}
                  classesExist={classesExist}
                  onClick={(dateStart, classExist, type) => {
                    setClassDetail({
                      show: true,
                      payload: { classExist, dateStart, type },
                    });
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {classDetail.show ? (
        <Dialog
          title={`Class ${convertTZ(classDetail.payload?.dateStart, { onlyDate: true })}`}
          description={`Class schedule ${convertTZ(classDetail.payload?.dateStart)}`}
          footer={
            <div className="flex justify-between w-full">
              <div>
                {classDetail.payload?.classExist?.verified === true ? (
                  <div className="flex gap-2 has-tooltip">
                    <CheckBadgeIcon className="h-5 text-swirl-800" />
                    <p>Verified class</p>
                    <span className="p-1 rounded shadow-lg tooltip bg-cararra-100 left-40">
                      By {classDetail.payload?.classExist?.admin_verified.name}{' '}
                      {classDetail.payload?.classExist?.admin_verified.lastname}
                    </span>
                  </div>
                ) : user && user.rol === 'ADMINISTRATOR' ? (
                  <Button
                    text="Check the class"
                    color="mindaro"
                    className="ml-3 text-sm"
                    onClick={() => {
                      verifyClass(
                        classDetail.payload?.classExist?.id,
                        user,
                        classDetail.payload?.classExist?.instructor_id,
                        classDetail.payload?.dateStart,
                      ).then(() => {
                        getClassExist();
                        setClassDetail({ show: false });
                      });
                    }}
                  />
                ) : null}
              </div>
              <Button
                text="Close"
                className="ml-3 text-sm"
                onClick={() => setClassDetail({ show: false })}
              />
              {isCoach &&
              !couchIncluded(
                classDetail.payload?.classExist?.couchesDisponibility,
                user?.coaches.user_id,
              ) ? (
                <Button
                  text="I'm available"
                  className="text-sm"
                  color="mindaro"
                  isloading={isLoadingModalBtn}
                  onClick={() => {
                    setIsLoadingModalBtn(true);
                    setDisponibility(
                      classDetail.payload?.dateStart,
                      classDetail.payload?.classExist?.id,
                      classDetail.payload?.type,
                    );
                  }}
                />
              ) : null}
            </div>
          }
        >
          {classDetail.payload?.classExist?.couchesDisponibility.length > 0 ? (
            <>
              <h2 className="font-bold text-center">Coaches available</h2>
              <ul className="mt-3">
                {classDetail.payload?.classExist?.couchesDisponibility?.map(
                  (couch, i) => (
                    <li
                      key={`${couch.id}-${classDetail.payload?.classExist?.id}`}
                      className={`border-b border-swirl-200 p-3 flex justify-between items-center ${
                        i % 2 === 0 ? 'bg-cararra-100' : ''
                      }`}
                    >
                      <span>
                        {couch.name} {couch.lastname}
                      </span>
                      <span>
                        {couch.id !==
                        classDetail.payload?.classExist?.instructor_id ? (
                          user.rol === 'ADMINISTRATOR' &&
                          classDetail.payload?.classExist?.verified ===
                            false ? (
                            <Button
                              text="Select"
                              className="text-sm bg-mindaro-600"
                              isloading={isLoadingClassDetail}
                              onClick={() => {
                                if (
                                  classDetail.payload?.classExist?.verified ===
                                  false
                                ) {
                                  setIsLoadingClassDetail(true);
                                  updateClass(
                                    classDetail.payload?.classExist?.id,
                                    couch.id,
                                    classDetail.payload?.dateStart,
                                  ).then((res) => {
                                    getClassExist();
                                    setClassDetail((prev) => ({
                                      ...prev,
                                      payload: {
                                        ...prev.payload,
                                        classExist: res,
                                      },
                                    }));
                                    setIsLoadingClassDetail(false);
                                  });
                                }
                              }}
                            />
                          ) : null
                        ) : (
                          <p className="flex flex-row items-center">
                            Selected
                            <CheckIcon className="h-8 ml-2 text-mindaro-700" />
                          </p>
                        )}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </>
          ) : (
            <h2 className="font-bold text-center">There are no coaches yet</h2>
          )}
        </Dialog>
      ) : null}
    </>
  );
}
