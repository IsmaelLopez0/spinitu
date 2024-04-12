import { compareDates, getIsValidDifference } from '@/libs/_utilsFunctions';
import { CheckBadgeIcon } from '@heroicons/react/16/solid';

const validSchedule = {
  1: { start: '6:15', end: '7:00' },
  2: { start: '7:15', end: '8:00' },
  3: { start: '8:15', end: '9:00' },
  4: { start: '9:15', end: '10:00' },
  5: { start: '10:15', end: '11:00' },
  6: { start: '18:15', end: '19:00' },
  7: { start: '19:15', end: '20:00' },
  8: { start: '20:15', end: '21:00' },
  9: { start: '21:15', end: '22:00' },
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

export default function ScheduleByDayComponent({
  day,
  currentDay,
  isCoach,
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
    const dayWithHour = currentDay.setHours(hour, 15);
    const isDisable = isCoach
      ? getIsValidDifference(currentDay.setHours(hour), 10)
      : compareDates(today, currentDay.setHours(hour - 1, 45)) !== 1;
    const classExist = classesExist[dayWithHour];
    const totalCoaches = classExist?.couchesDisponibility?.length ?? 0;
    const defaultCoach =
      classExist?.couchesDisponibility?.find(
        (f) => f.id === classExist.instructor_id,
      ) ?? '';
    return (
      <div
        key={day + '-' + i}
        className={`text-cararra-100 w-full h-24 flex flex-col justify-center items-center rounded-md ${
          isDisable
            ? 'bg-orchid-200 cursor-not-allowed'
            : `bg-orchid-${totalCoaches > 1 ? '700' : '400'} cursor-pointer`
        }`}
        onClick={() => {
          !isDisable && onClick(new Date(dayWithHour), classExist);
        }}
      >
        <div className="relative z-0 w-full h-full">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <p className="z-0 text-sm">Availables: {totalCoaches}</p>
            {totalCoaches > 0 ? (
              <p className="text-xs">
                Assigned: {defaultCoach.name} {defaultCoach.lastname}
              </p>
            ) : null}
          </div>
          {classExist?.verified ? (
            <CheckBadgeIcon className="absolute h-4 bottom-1 right-1" />
          ) : null}
        </div>
      </div>
    );
  });
}
