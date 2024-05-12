import Image from 'next/image';
import { compareDates, getIsValidDifference } from '@/libs/_utilsFunctions';
import { CheckBadgeIcon } from '@heroicons/react/16/solid';
import { validSchedule, scheduleByDay, CYCLING, BARRE } from '@/libs/vars';
import SpinningIcon from '../../../public/images/icons/Icono_Spinitu_Spinning.svg';
import BarreIcon from '../../../public/images/icons/Icono_Spinitu_Barre.svg';

export default function ScheduleByDayComponent({
  day,
  currentDay,
  isCoach,
  classesExist,
  onClick = () => {},
}) {
  return scheduleByDay[day].map(({ id, type }, i) => {
    if (id === null) {
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
            {validSchedule[id].start} - {validSchedule[id].end}
          </p>
        </div>
      );
    }
    const today = new Date();
    const hour = validSchedule[id].start.replace(/:.*/, '');
    const dayWithHour = currentDay.setHours(hour, 15);
    // const isDisable = isCoach
    //   ? getIsValidDifference(currentDay.setHours(hour), 10)
    //   : compareDates(today, currentDay.setHours(hour - 1, 45)) !== 1;
    const isDisable =
      compareDates(today, currentDay.setHours(hour - 1, 45)) !== 1;
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
            : `bg-orchid-${totalCoaches > 0 ? '700' : '500'} cursor-pointer`
        }`}
        onClick={() => {
          !isDisable && onClick(new Date(dayWithHour), classExist, type);
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
          {type === CYCLING ? (
            <Image
              src={SpinningIcon}
              alt="Spinning"
              className={`absolute h-4 bottom-1 left-3 w-fit ${isDisable ? 'opacity-50' : ''}`}
            />
          ) : null}
          {type === BARRE ? (
            <Image
              src={BarreIcon}
              alt="Barré"
              className={`absolute h-4 bottom-1 left-3 w-fit ${isDisable ? 'opacity-50' : ''}`}
            />
          ) : null}
          {classExist?.verified ? (
            <CheckBadgeIcon className="absolute h-4 bottom-1 right-1" />
          ) : null}
        </div>
      </div>
    );
  });
}
