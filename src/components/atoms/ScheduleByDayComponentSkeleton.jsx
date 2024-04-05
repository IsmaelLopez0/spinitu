import { compareDates, getIsValidDifference } from '@/libs/_utilsFunctions';

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

export default function ScheduleByDayComponentSkeleton({ day }) {
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
    return (
      <div class="border border-orchid-100 shadow rounded-md p-4 max-w-sm w-full mx-auto h-24">
        <div class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-6 py-1">
            <div class="space-y-3">
              <div class="grid grid-cols-1 gap-4">
                <div class="h-2 bg-orchid-300 rounded col-span-1"></div>
                <div class="h-2 bg-orchid-300 rounded col-span-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    // return (
    //   <div
    //     key={day + '-' + i}
    //     className={`animate-pulse text-cararra-100 w-full h-24 flex flex-col justify-center items-center rounded-md ${
    //       isDisable
    //         ? 'bg-orchid-200 cursor-not-allowed'
    //         : 'bg-orchid-400 cursor-pointer'
    //     }`}
    //     onClick={() => {
    //       !isDisable && onClick(new Date(dayWithHour), classExist);
    //     }}
    //   >
    //     <p className="text-sm">Availables: {totalCoaches}</p>
    //     {totalCoaches > 0 ? (
    //       <p className="text-xs">
    //         Assigned: {defaultCoach.name} {defaultCoach.lastname}
    //       </p>
    //     ) : null}
    //   </div>
    // );
  });
}
