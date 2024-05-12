import { validSchedule, scheduleByDay } from '@/libs/vars';

export default function ScheduleByDayComponentSkeleton({ day }) {
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
    return (
      <div
        key={day + '-' + i}
        className="w-full h-24 max-w-sm p-4 mx-auto border rounded-md shadow border-orchid-100"
      >
        <div className="flex space-x-4 animate-pulse">
          <div className="flex-1 py-1 space-y-6">
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-4">
                <div className="h-2 col-span-1 rounded bg-orchid-300"></div>
                <div className="h-2 col-span-1 rounded bg-orchid-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
}
