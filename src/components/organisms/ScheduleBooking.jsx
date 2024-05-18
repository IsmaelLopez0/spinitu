import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import GenericLoading from '../atoms/GenericLoading';
import ScheduleByDayComponentBooking from '../atoms/ScheduleByDayComponentBooking';
import ScheduleByDayComponentSkeleton from '../atoms/ScheduleByDayComponentSkeleton';
import Dialog from '../atoms/Dialog';
import {
  getDay,
  obtenerNombreMes,
  getCurrentWeek,
  formatDate,
  convertTZ,
} from '@/libs/_utilsFunctions';
import Button from '../atoms/Button';
import Autocomplete from '../atoms/Autocomplete';
import { genericFetch } from '@/libs/externalAPIs';
import { setToast } from '@/libs/notificationsAPIs';
import { useUserConfig } from '@/stores/useUserConfig';
import { CYCLING, BARRE } from '@/libs/vars';
import SpinningIcon from '../../../public/images/icons/Icono_Spinitu_Spinning.svg';
import BarreIcon from '../../../public/images/icons/Icono_Spinitu_Barre.svg';

const dias = ['Time', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const currentWeek = getCurrentWeek();

const settingsClasses = {
  [CYCLING]: {
    totalPositions: 7,
    position: {
      class: [
        'col-span-3',
        'row-start-2',
        'row-start-2',
        'row-start-2',
        'row-start-3',
        'row-start-3',
        'row-start-3',
      ],
      preference: [
        null,
        'fitpass',
        null,
        'fitpass',
        'totalpass',
        'totalpass',
        'totalpass',
      ],
    },
  },
  [BARRE]: {
    totalPositions: 8,
    position: {
      class: [
        '',
        'col-start-3',
        'row-start-2',
        'row-start-2',
        'row-start-2',
        'row-start-3',
        'row-start-3',
        'row-start-3',
      ],
      preference: [
        'fitpass',
        'fitpass',
        null,
        null,
        null,
        'totalpass',
        'totalpass',
        'totalpass',
      ],
    },
  },
};

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

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

export default function ScheduleBooking() {
  const [data, setData] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [week, setWeek] = useState(currentWeek ?? 1);
  const [firstDayWeek, setFirstDayWeek] = useState();
  const [classesExist, setClassesExist] = useState({});
  const [classDetail, setClassDetail] = useState({ show: false });
  const [confirmReserve, setConfirmReserve] = useState({ show: false });
  const [userSelected, setUserSelected] = useState();
  const [isloading, setIsloading] = useState(false);
  const [isLoadingReservation, setIsLoadingReservation] = useState(false);
  const user = useUserConfig((state) => state.user);

  function getClients(isReload = false) {
    const params = { url: '/user/allClients', method: 'GET' };
    genericFetch(params).then((res) => {
      if (res.statusCode === 200) {
        const newData = res.body
          .filter((f) => f.days_to_access > 0)
          .map(({ memberships, ...item }) => ({
            id: item.id,
            name: `${item.name ?? ''} ${item.lastname ?? ''}`,
            description: (
              <>
                {item.days_to_access} remaining classes
                {item.membership_type_id === 9 && (
                  <IconByPreference
                    preference="totalpass"
                    display="inline"
                    position="relative"
                  />
                )}
                {item.membership_type_id === 10 && (
                  <IconByPreference
                    preference="fitpass"
                    display="inline"
                    position="relative"
                  />
                )}
              </>
            ),
          }));
        setData(newData);
        if (isReload) {
          setToast('Reserved class', 'success', '/api/reservation');
        }
      } else {
        setToast('Something went wrong', 'error', '/user/allClients');
      }
    });
  }

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
      getClients();
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, user]);

  useEffect(() => {
    if (firstDayWeek) {
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
      setIsLoadingReservation(false);
    });
  }

  function handleWeek(isNextWeek = true) {
    setWeek((state) => (isNextWeek ? state + 1 : state - 1));
  }

  function getInstructorName(data = {}) {
    const { instructor_id, couchesDisponibility } = data;
    if (!instructor_id || couchesDisponibility?.length === 0) return '';
    const { name, lastname } = couchesDisponibility.find(
      ({ id }) => id === instructor_id,
    );
    return `${name ?? ''} ${lastname ?? ''}`;
  }

  async function reservClass(payload) {
    setIsLoadingReservation(true);
    const { position, classExist } = payload;
    const res = await fetch('/api/reservation', {
      method: 'POST',
      body: JSON.stringify({
        position,
        userId: userSelected.id,
        classId: classExist.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      setConfirmReserve({ show: false });
      getClients(true);
      getClassExist();
      setUserSelected({});
    } else {
      const data = await res.json();
      setToast(data.message, 'error', '/api/reservation');
    }
  }

  return (
    <>
      <div className="grid grid-flow-col grid-cols-8 h-full grid-rows-11 gap-2.5 gap-y-0 text-center">
        {dias.map((day, i) => {
          const { currentDay, monthDay } = getDay(firstDayWeek, i - 1);
          const istoday = isToday(currentDay);
          return (
            <React.Fragment key={currentDay}>
              {i > 0 ? (
                <div className="sticky z-10 top-[66px] bg-cararra-100 flex items-center justify-center nm-10">
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
                  className="text-white sticky z-10 top-[66px] bg-cararra-100 flex flex-col gap-4 gap-y-2 py-2 px-5"
                  key={day + '-' + i}
                >
                  <span className="p-1 text-xs rounded bg-orchid-500/50">
                    Not available
                  </span>
                  <span className="p-1 text-xs rounded bg-orchid-500">
                    Available
                  </span>
                  <span className="h-full p-1 text-xs rounded bg-orchid-700">
                    Full house
                  </span>
                </div>
              )}
              {isloading ? (
                <ScheduleByDayComponentSkeleton day={i} />
              ) : (
                <ScheduleByDayComponentBooking
                  day={i}
                  currentDay={currentDay}
                  classesExist={classesExist}
                  onClick={(dateStart, classExist, isDisable, type) => {
                    setClassDetail({
                      show: true,
                      payload: { classExist, dateStart, isDisable, type },
                    });
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {classDetail.show ? (
        <Dialog title="Select the position" description="">
          {classDetail.payload?.classExist ? (
            <>
              <div className="grid grid-cols-2 grid-rows-2 gap-4">
                <p>Date: {convertTZ(classDetail.payload?.dateStart)}</p>
                <p>Hours: {convertTZ(classDetail.payload?.dateStart)}</p>
                <p>
                  Coach: {getInstructorName(classDetail.payload?.classExist)}
                </p>
                <div className="flex justify-between">
                  <p className="flex items-center">
                    <IconByType
                      type={classDetail.payload?.type}
                      color="swirl-950"
                      small
                    />
                    Available
                  </p>
                  <p className="flex items-center">
                    <IconByType
                      type={classDetail.payload?.type}
                      color="swirl-200"
                      small
                    />
                    Reserved
                  </p>
                </div>
              </div>
              <hr />
              <div className="grid grid-cols-3 grid-rows-3 gap-4 mt-3">
                {Array.from(
                  Array(
                    settingsClasses[classDetail.payload?.type].totalPositions,
                  ),
                ).map((e, i) => {
                  const currentReservations =
                    classDetail.payload.classExist.reservations;
                  const position =
                    settingsClasses[classDetail.payload?.type].totalPositions -
                    i;
                  const isReserved = currentReservations.find(
                    (f) => f.position === position,
                  );
                  return (
                    <div
                      key={i}
                      className={`relative text-center rounded-xl select-none hover:bg-cararra-50 ${!isReserved ? 'cursor-pointer' : 'cursor-not-allowed'} ${settingsClasses[classDetail.payload?.type].position.class[i]}`}
                      onClick={() => {
                        if (
                          user.rol !== 'COACH' &&
                          !isReserved &&
                          !classDetail.payload.isDisable
                        ) {
                          setConfirmReserve({
                            show: true,
                            payload: {
                              index: i,
                              ...classDetail.payload,
                              position: position,
                              usersInClass:
                                classDetail.payload.classExist.reservations.map(
                                  ({ user }) => user.id,
                                ),
                            },
                          });
                          setClassDetail({ show: false });
                        }
                      }}
                    >
                      <div className="has-tooltip">
                        <div className="flex justify-center">
                          <IconByType
                            type={classDetail.payload?.type}
                            className="w-16 h-16"
                            color={isReserved ? 'swirl-200' : 'swirl-950'}
                          />
                        </div>
                        <span className="absolute bottom-0 text-center bg-white border rounded-full left-2/3 w-7">
                          {position}
                        </span>
                        <IconByPreference
                          preference={
                            settingsClasses[classDetail.payload?.type].position
                              .preference[i]
                          }
                        />
                        {isReserved && (
                          <span className="p-1 rounded shadow-lg tooltip bg-cararra-100 -left-2 -bottom-2">
                            {isReserved?.user?.name}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="relative col-span-3 text-center cursor-default select-none rounded-xl">
                  <div className="flex justify-center">
                    <IconByType
                      type={classDetail.payload?.type}
                      className="w-14 h-14"
                      color="cararra-700"
                    />
                  </div>
                  <span className="absolute px-1 text-center bg-white rounded-full left-[45%]">
                    Coach
                  </span>
                </div>
              </div>
              <div>
                <Button
                  text="Cancel"
                  type="outline"
                  onClick={() => setClassDetail({ show: false })}
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl text-red-400">
                There is no coach assigned for this class
              </p>
              <Button
                type="outline"
                onClick={() => setClassDetail({ show: false })}
              >
                Continuar
              </Button>
            </>
          )}
        </Dialog>
      ) : null}
      {confirmReserve.show ? (
        <Dialog title="Select user">
          <div className="flex items-center justify-between gap-1">
            <p>
              Search and select a user to assign to the class
              <span className="underline decoration-solid">
                {convertTZ(confirmReserve.payload?.dateStart)}
              </span>
            </p>
            <div className="flex flex-col items-center justify-center gap-1 p-2 border rounded">
              {confirmReserve.payload?.position}
              <IconByType
                type={confirmReserve.payload?.type}
                color="wirl-950"
                small
              />
              <IconByPreference
                position="relative"
                preference={
                  settingsClasses[confirmReserve.payload?.type].position
                    .preference[confirmReserve.payload?.index]
                }
              />
            </div>
          </div>
          <div className="flex flex-col justify-between overflow-auto">
            <Autocomplete
              label={<div className="mt-2">Select user:</div>}
              list={data.filter(
                (f) => !confirmReserve.payload?.usersInClass.includes(f.id),
              )}
              selected={userSelected}
              setSelected={setUserSelected}
            />
            <div className="flex justify-between mt-2">
              <Button
                color="mindaro"
                onClick={() => setConfirmReserve({ show: false })}
              >
                Cancel
              </Button>
              <Button
                color="orchid"
                disabled={!userSelected}
                onClick={() => reservClass(confirmReserve.payload)}
                isloading={isLoadingReservation}
              >
                Add to class
              </Button>
            </div>
          </div>
        </Dialog>
      ) : null}
    </>
  );
}

const IconByType = ({ small = false, type, className, color }) => {
  const colorToFilter = {
    'swirl-950':
      'invert-[.05] sepia-[.59] saturate-[3.55] hue-rotate-[320deg] brightness-[.92] contrast-[.81]',
    'swirl-200':
      'invert-[.94] sepia-[.07] saturate-[2.26] hue-rotate-[348deg] brightness-[.88] contrast-[.93]',
    'cararra-700':
      'invert-[.4] sepia-[.34] saturate-[2.12] hue-rotate-[5deg] brightness-[.95] contrast-[.85]',
  };
  if (type === CYCLING) {
    return (
      <Image
        src={SpinningIcon}
        alt="Spinning"
        className={`${small ? 'h-4 w-fit' : 'h-16'} mr-2 ${colorToFilter[color]} ${className}`}
      />
    );
  }
  if (type === BARRE) {
    return (
      <Image
        src={BarreIcon}
        alt="Barré"
        className={`${small ? 'h-4 w-fit' : 'h-16'} mr-2 ${colorToFilter[color]} ${className}`}
      />
    );
  }
  return null;
};

const IconByPreference = ({
  preference,
  display = 'block',
  position = 'absolute',
}) => {
  if (preference === null) return null;
  return (
    <span className={`${position} bottom-0 left-[10%] w-7`}>
      <Image
        className={display}
        src={
          preference === 'fitpass'
            ? '/images/external/fitpass2.png'
            : '/images/external/totalpass.png'
        }
        alt="Preference"
        width="20"
        height="20"
      />
    </span>
  );
};
