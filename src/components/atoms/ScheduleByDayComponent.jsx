import { compareDates, getIsValidDifference } from "@/libs/_utilsFunctions";

const validSchedule = {
  1: { start: "6:00 am", end: "7:00 am" },
  2: { start: "7:00 am", end: "8:00 am" },
  3: { start: "8:00 am", end: "9:00 am" },
  4: { start: "9:00 am", end: "10:00 am" },
  5: { start: "10:00 am", end: "11:00 am" },
  6: { start: "18:00 am", end: "19:00 am" },
  7: { start: "19:00 am", end: "20:00 am" },
  8: { start: "20:00 am", end: "21:00 am" },
  9: { start: "21:00 am", end: "22:00 am" },
};

const shedulByDay = [
  [1, 2, 3, 4, null, 6, 7, 8, 9],
  [1, 2, 3, 4, null, 6, 7, 8, 9],
  [1, 2, 3, 4, null, 6, 7, 8, 9],
  [1, 2, 3, 4, null, 6, 7, 8, 9],
  [1, 2, 3, 4, null, 6, 7, 8, 9],
  [null, 2, 3, 4, 5, null, null, null, null],
  [null, 2, 3, 4, 5, null, null, null, null],
];

export default function ScheduleByDayComponent({
  day,
  currentDay,
  isCoach,
  classesExist,
  onClick = () => {},
}) {
  return shedulByDay[day].map((currShedule, i) => {
    if (currShedule === null) {
      return (
        <div className="w-full bg-transparent h-100px" key={day + "-" + i} />
      );
    }
    const today = new Date();
    const hour = validSchedule[currShedule].start.replace(/:.*/, "");
    const dayWithHour = currentDay.setHours(hour, 0);
    const isDisable = isCoach
      ? getIsValidDifference(currentDay.setHours(hour, 50), 14)
      : compareDates(today, currentDay.setHours(hour - 1, 50)) !== 1;
    const classExist = classesExist[dayWithHour];
    const totalCoaches = classExist?.couchesDisponibility?.length ?? 0;
    const defaultCoach =
      classExist?.couchesDisponibility?.find(
        (f) => f.id === classExist.instructor_id
      ) ?? "";
    return (
      <div
        key={day + "-" + i}
        className={`text-cararra-100 w-full h-24 flex flex-col justify-center items-center rounded-md ${
          isDisable
            ? "bg-orchid-200 cursor-not-allowed"
            : "bg-orchid-400 cursor-pointer"
        }`}
        onClick={() => {
          !isDisable && onClick(new Date(dayWithHour), classExist);
        }}
      >
        <p>
          {validSchedule[currShedule].start} - {validSchedule[currShedule].end}
        </p>
        <p className="text-sm">Availables: {totalCoaches}</p>
        {totalCoaches > 0 ? (
          <p className="text-xs">
            Assigned: {defaultCoach.name} {defaultCoach.lastname}
          </p>
        ) : null}
      </div>
    );
  });
}
