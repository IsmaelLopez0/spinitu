import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import GenericLoading from '../atoms/GenericLoading';
import ScheduleByDayComponentBooking from '../atoms/ScheduleByDayComponentBooking';
import Dialog from '../atoms/Dialog';
import {
  getDay,
  obtenerNombreMes,
  getCurrentWeek,
} from '@/libs/_utilsFunctions';
import Button from '../atoms/Button';
import Autocomplete from '../atoms/Autocomplete';
import { genericFetch } from '@/libs/externalAPIs';
import { setToast } from '@/libs/notificationsAPIs';
import { useUserConfig } from '@/stores/useUserConfig';

const dias = ['Time', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const currentWeek = getCurrentWeek();

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
  const [week, setWeek] = useState(1);
  const [firstDayWeek, setFirstDayWeek] = useState();
  const [classesExist, setClassesExist] = useState({});
  const [classDetail, setClassDetail] = useState({ show: false });
  const [confirmReserve, setConfirmReserve] = useState({ show: false });
  const [userSelected, setUserSelected] = useState();
  const user = useUserConfig((state) => state.user);
  const setUser = useUserConfig((state) => state.setUser);

  function getClients(isReload = false) {
    const params = { url: '/user/allClients', method: 'GET' };
    genericFetch(params).then((res) => {
      if (res.statusCode === 200) {
        const newData = res.body
          .filter((f) => f.days_to_access > 0)
          .map(({ memberships, ...item }) => ({
            id: item.id,
            name: `${item.name ?? ''} ${item.lastname ?? ''}`,
            description: `${item.days_to_access} remaining classes`,
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
    if (isFirstLoad && user?.name) {
      getClients();
      const coach = Boolean(user?.coaches?.user_id);
      setWeek(coach ? currentWeek + 2 : currentWeek);
      setIsFirstLoad(false);
    }
    const firstDayWeek = new Date(
      firstDayYear.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000,
    );
    setFirstDayWeek(firstDayWeek);
  }, [isFirstLoad, week]);

  useEffect(() => {
    if (!user?.name) {
      getSession().then(({ user }) => {
        const params = {
          url: '/user/user',
          query: { email: user.email },
          method: 'GET',
        };
        genericFetch(params).then((data) => {
          if (data.statusCode === 200) {
            setUser(data.body);
          } else {
            setToast(data.body.error, 'error', params.url + data.statusCode);
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    getWeekClasses(firstDayWeek).then((res) => setClassesExist(res));
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
    } else {
      const data = await res.json();
      setToast(data.message, 'error', '/api/reservation');
    }
  }

  return (
    <>
      <div className="grid grid-flow-col grid-cols-8 h-full grid-rows-10 gap-2.5 text-center">
        {dias.map((day, i) => {
          const { currentDay, monthDay } = getDay(firstDayWeek, i - 1);
          const istoday = isToday(currentDay);
          return (
            <React.Fragment key={currentDay}>
              {i > 0 ? (
                <div className="sticky top-[65px] bg-cararra-100 flex items-center justify-center nm-10">
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
              <ScheduleByDayComponentBooking
                day={i}
                currentDay={currentDay}
                classesExist={classesExist}
                onClick={(dateStart, classExist) => {
                  setClassDetail({
                    show: true,
                    payload: { classExist, dateStart },
                  });
                }}
              />
            </React.Fragment>
          );
        })}
      </div>
      {classDetail.show ? (
        <Dialog title="Select the position" description="">
          {classDetail.payload?.classExist ? (
            <>
              <div className="grid grid-cols-2 grid-rows-2 gap-4">
                <p>Date: {classDetail.payload?.dateStart?.toDateString()}</p>
                <p>
                  Hours:{' '}
                  {classDetail.payload?.dateStart.toLocaleTimeString('en-US')}
                </p>
                <p>
                  Coach: {getInstructorName(classDetail.payload?.classExist)}
                </p>
                <div className="flex justify-between">
                  <p className="flex items-center">
                    <span
                      className={`text-center material-symbols-outlined text-mindaro-400 mr-1 select-none`}
                    >
                      directions_bike
                    </span>
                    Available
                  </p>
                  <p className="flex items-center">
                    <span
                      className={`text-center material-symbols-outlined text-orchid-400 mr-1 select-none`}
                    >
                      directions_bike
                    </span>
                    Reserved
                  </p>
                </div>
              </div>
              <hr />
              <div className="grid grid-cols-4 grid-rows-4 gap-4 mt-3">
                {Array.from(Array(12)).map((e, i) => {
                  const currentReservations =
                    classDetail.payload.classExist.reservations;
                  const position = 12 - i;
                  const isReserved = currentReservations.find(
                    (f) => f.position === position,
                  );
                  return (
                    <div
                      key={i}
                      className={`relative text-center rounded-xl select-none hover:bg-cararra-50 ${!isReserved ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      onClick={() => {
                        if (!isReserved) {
                          setConfirmReserve({
                            show: true,
                            payload: {
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
                      <span
                        className={`text-center material-symbols-outlined ${!isReserved ? 'text-mindaro-400' : 'text-orchid-400'}`}
                        style={{ fontSize: '60px' }}
                      >
                        directions_bike
                      </span>
                      <span className="absolute bottom-0 text-center bg-white border rounded-full left-2/3 w-7">
                        {position}
                      </span>
                    </div>
                  );
                })}
                <div className="relative col-span-4 text-center cursor-default select-none rounded-xl">
                  <span
                    className="text-center text-cararra-700 material-symbols-outlined"
                    style={{ fontSize: '48px' }}
                  >
                    directions_bike
                  </span>
                  <span className="absolute px-1 text-center bg-white rounded-full bottom-[-2px] left-[45%]">
                    Coach
                  </span>
                </div>
              </div>
              <div>
                <Button
                  text="Cancelar"
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
          <div className="flex items-center gap-1">
            <p>
              Search and select a user to assign to the class{' '}
              <span className="underline decoration-solid">
                {confirmReserve.payload?.dateStart?.toDateString()}{' '}
              </span>
              <span className="underline decoration-solid">
                {confirmReserve.payload?.dateStart.toLocaleTimeString('en-US')}
              </span>
            </p>
            <div className="flex flex-col items-center justify-center p-2 border rounded">
              {confirmReserve.payload?.position}
              <span className="text-center material-symbols-outlined text-mindaro-400">
                directions_bike
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-between overflow-auto">
            <Autocomplete
              list={data.filter(
                (f) => !confirmReserve.payload?.usersInClass.includes(f.id),
              )}
              selected={userSelected}
              setSelected={setUserSelected}
            />
            <div className="flex justify-between mt-2">
              <Button
                color="orchid"
                onClick={() => setConfirmReserve({ show: false })}
              >
                Cancel
              </Button>
              <Button
                color="mindaro"
                disabled={!userSelected}
                onClick={() => reservClass(confirmReserve.payload)}
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
