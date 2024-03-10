import React, { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@heroicons/react/16/solid";
import GenericLoading from "../atoms/GenericLoading";
import ScheduleByDayComponent from "../atoms/ScheduleByDayComponent";
import Dialog from "../atoms/Dialog";
import {
  getDay,
  obtenerNombreMes,
  getCurrentWeek,
} from "@/libs/_utilsFunctions";
import Button from "../atoms/Button";
import { createNotification } from "@/libs/notificationsAPIs";

const dias = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const currentWeek = getCurrentWeek();

async function createClass(dateStart, instructorId) {
  const res = await fetch(`/api/class`, {
    method: "POST",
    body: JSON.stringify({ dateStart, instructorId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resParsed = await res.json();
  return resParsed.id;
}

async function getWeekClasses(firstDayWeek) {
  if (!firstDayWeek) return {};
  const tempDate = new Date(firstDayWeek);
  const lastDayWeek = new Date(tempDate.setDate(tempDate.getDate() + 7));
  const URL = `/api/class?firstDayWeek=${firstDayWeek}&lastDayWeek=${lastDayWeek}`;
  const res = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "max-age=0",
  });
  const resParsed = await res.json();
  return resParsed;
}

async function createDisponibility(classId, userId) {
  const URL = `/api/class/disponibility`;
  const res = await fetch(URL, {
    method: "POST",
    body: JSON.stringify({ classId, userId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resParsed = await res.json();
  return resParsed;
}

async function updateClass(classId, instructorId, dateStart, oldInstructor) {
  const URL = `/api/class`;
  const res = await fetch(URL, {
    method: "PUT",
    body: JSON.stringify({ classId, instructorId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  createNotification(
    instructorId,
    "You were assigned a class",
    `You have been assigned the class of ${dateStart.toLocaleString()}`
  );
  createNotification(
    oldInstructor,
    "You will no longer teach the class",
    `An administrator assigned someone else to class for the day ${dateStart.toLocaleString()}`
  );
  const resParsed = await res.json();
  return resParsed;
}

function couchIncluded(couches = [], userId) {
  return couches.some((s) => s.id === userId);
}

export default function Schedule(props) {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isCoach, setIsCoach] = useState(false);
  const [week, setWeek] = useState(1);
  const [firstDayWeek, setFirstDayWeek] = useState();
  const [classesExist, setClassesExist] = useState({});
  const [classDetail, setClassDetail] = useState({ show: false });

  useEffect(() => {
    const añoActual = new Date().getFullYear();
    const firstDayYear = new Date(añoActual, 0, 1);
    if (isFirstLoad && props.user?.name) {
      const coach = Boolean(props.user?.coaches?.user_id);
      setIsCoach(coach);
      setWeek(coach ? currentWeek + 2 : currentWeek);
      setIsFirstLoad(false);
    }
    const firstDayWeek = new Date(
      firstDayYear.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000
    );
    setFirstDayWeek(firstDayWeek);
  }, [isFirstLoad, props.user, week]);

  useEffect(() => {
    getClassExist();
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

  async function setDisponibility(dateStart, classId) {
    let id = classId;
    if (!id) {
      id = await createClass(dateStart, props.user?.coaches.user_id);
      createNotification(
        props.user?.coaches.user_id,
        "Default asignation",
        `You have been assigned by default the class of ${dateStart.toLocaleString()}`
      );
    }
    await createDisponibility(id, props.user?.coaches.user_id);
    setClassDetail({ show: false });
    getClassExist();
  }

  return (
    <>
      <div className="grid grid-flow-col grid-cols-7 h-full grid-rows-10 gap-2.5 text-center">
        {dias.map((day, i) => {
          const { currentDay, monthDay } = getDay(firstDayWeek, i);
          return (
            <React.Fragment key={currentDay}>
              <div className="sticky top-[65px] bg-cararra-100 flex items-center justify-center nm-10">
                {i === 0 ? (
                  <ChevronLeftIcon
                    className="mr-2 cursor-pointer text-mindaro-700 h-7"
                    onClick={() => handleWeek(false)}
                  />
                ) : null}
                <div className="flex flex-col">
                  <p>
                    {currentDay.getDate()}/{obtenerNombreMes(monthDay)}
                  </p>
                  <span>{day}</span>
                </div>
                {i === 6 ? (
                  <ChevronRightIcon
                    className="ml-2 cursor-pointer text-mindaro-700 h-7"
                    onClick={() => handleWeek(true)}
                  />
                ) : null}
              </div>
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
            </React.Fragment>
          );
        })}
      </div>
      {classDetail.show ? (
        <Dialog
          title={`Class ${classDetail.payload?.dateStart?.toDateString()}`}
          description={`Class schedule ${classDetail.payload?.dateStart.toTimeString()}`}
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
                props.user?.coaches.user_id
              ) ? (
                <Button
                  text="I'm available"
                  className="text-sm"
                  color="mindaro"
                  onClick={() =>
                    setDisponibility(
                      classDetail.payload?.dateStart,
                      classDetail.payload?.classExist?.id
                    )
                  }
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
                        i % 2 === 0 ? "bg-cararra-100" : ""
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
                                couch.id
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
                  )
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
