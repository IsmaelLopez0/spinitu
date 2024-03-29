import { compareDates } from '@/libs/_utilsFunctions';

const validSchedule = {
  1: { start: '6:00', end: '7:00' },
  2: { start: '7:00', end: '8:00' },
  3: { start: '8:00', end: '9:00' },
  4: { start: '9:00', end: '10:00' },
  5: { start: '10:00', end: '11:00' },
  6: { start: '18:00', end: '19:00' },
  7: { start: '19:00', end: '20:00' },
  8: { start: '20:00', end: '21:00' },
  9: { start: '21:00', end: '22:00' },
};

const shedulByDay = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, null, 6, 7, 8, 9],
  [1, 2, 3, 4, null, 6, 7, 8, 9],
  [1, 2, 3, 4, null, 6, 7, 8, 9],
  [1, 2, 3, 4, null, 6, 7, 8, 9],
  [1, 2, 3, 4, null, 6, 7, 8, 9],
  [null, 2, 3, 4, 5, null, null, null, null],
  [null, 2, 3, 4, 5, null, null, null, null],
];

export default function ScheduleByDayComponentBooking({
  day,
  currentDay,
  classesExist,
  onClick = () => {},
}) {
  return shedulByDay[day].map((currSchedule, i) => {
    if (currSchedule === null) {
      return (
        <div className="w-full bg-transparent h-100px" key={day + '-' + i} />
      );
    }
    if (day === 0) {
      return (
        <div
          className="flex items-center justify-center w-full bg-transparent h-100px"
          key={day + '-' + i}
        >
          <p>
            {validSchedule[currSchedule].start} -{' '}
            {validSchedule[currSchedule].end}
          </p>
        </div>
      );
    }
    const today = new Date();
    const hour = validSchedule[currSchedule].start.replace(/:.*/, '');
    const dayWithHour = currentDay.setHours(hour, 0);
    // const isDisable = compareDates(today, currentDay.setHours(hour - 1, 50)) !== 1;
    const classExist = classesExist[dayWithHour];
    const totalAssistants = classExist?.reservations?.length ?? 0;
    const defaultCoach =
      classExist?.couchesDisponibility?.find(
        (f) => f.id === classExist.instructor_id,
      ) ?? '';
    return (
      <div
        key={day + '-' + i}
        className={`text-cararra-100 w-full h-24 flex flex-col justify-center items-center rounded-md bg-orchid-400 cursor-pointer`}
        onClick={() => {
          // !isDisable &&
          onClick(new Date(dayWithHour), classExist);
        }}
      >
        <p className="text-sm">Assistants: {totalAssistants}</p>
        <p className="text-xs">
          Coach: {defaultCoach.name} {defaultCoach.lastname}
        </p>
      </div>
    );
  });
}
