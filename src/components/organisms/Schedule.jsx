'use client';
import React, { useEffect, useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
} from '@heroicons/react/16/solid';
import GenericLoading from '../atoms/GenericLoading';
import ScheduleByDayComponent from '../atoms/ScheduleByDayComponent';
import ScheduleByDayComponentSkeleton from '../atoms/ScheduleByDayComponentSkeleton';
import Dialog from '../atoms/Dialog';
import {
  getDay,
  obtenerNombreMes,
  getCurrentWeek,
  formatDate,
} from '@/libs/_utilsFunctions';
import Button from '../atoms/Button';
import { createNotification } from '@/libs/notificationsAPIs';
import { genericFetch } from '@/libs/externalAPIs';
import { setToast } from '@/libs/notificationsAPIs';
import { useUserConfig } from '@/stores/useUserConfig';
import { convertTZ } from '@/libs/_utilsFunctions';

const dias = ['Time', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const currentWeek = getCurrentWeek();

async function createClass(dateStart, instructorId) {
  const params = {
    url: '/class',
    body: { dateStart, instructorId },
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
    query: {
      firstDayWeek: formatDate(firstDayWeek),
      lastDayWeek: formatDate(lastDayWeek),
    },
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

export default function Schedule() {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isCoach, setIsCoach] = useState(false);
  const [week, setWeek] = useState(currentWeek ?? 1);
  const [firstDayWeek, setFirstDayWeek] = useState();
  const [classesExist, setClassesExist] = useState({});
  const [classDetail, setClassDetail] = useState({ show: false });
  const [isloading, setIsloading] = useState(false);
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

  async function setDisponibility(dateStart, classId) {
    let id = classId;
    if (!id) {
      id = await createClass(dateStart, user?.coaches.user_id);
      createNotification(
        user?.coaches.user_id,
        'Default asignation',
        `You have been assigned by default the class of ${convertTZ(dateStart)}`,
      );
    }
    await createDisponibility(id, user?.coaches.user_id);
    setClassDetail({ show: false });
    getClassExist();
    setIsLoadingModalBtn(false);
  }

  return (
    <>
      <div className="grid grid-flow-col grid-cols-8 h-full grid-rows-12 gap-2.5 text-center">
        {dias.map((day, i) => {
          const { currentDay, monthDay } = getDay(firstDayWeek, i - 1);
          const istoday = isToday(currentDay);
          return (
            <React.Fragment key={currentDay}>
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
                  className="sticky top-[65px] bg-cararra-100 flex items-center justify-center nm-10"
                  key={day + '-' + i}
                />
              )}
              {isloading ? (
                <ScheduleByDayComponentSkeleton day={i} />
              ) : (
                <ScheduleByDayComponent
                  day={i}
                  currentDay={currentDay}
                  isCoach={isCoach}
                  classesExist={classesExist}
                  onClick={(dateStart, classExist) => {
                    setClassDetail({
                      show: true,
                      payload: { classExist, dateStart },
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
            <>
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
                    );
                  }}
                />
              ) : null}
            </>
          }
        >
          {classDetail.payload?.classExist?.couchesDisponibility.length > 0 ? (
            <>
              <h2 className="font-bold text-center">Coaches available</h2>
              <ul className="mt-3">
                {classDetail.payload?.classExist?.couchesDisponibility?.map(
                  (couch, i) => (
                    <li
                      key={couch.id}
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
                          <Button
                            text="Select"
                            className="text-sm bg-mindaro-600"
                            onClick={() =>
                              updateClass(
                                classDetail.payload?.classExist?.id,
                                couch.id,
                                classDetail.payload?.dateStart,
                              ).then((res) => {
                                getClassExist();
                                setClassDetail({ show: false });
                              })
                            }
                          />
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
