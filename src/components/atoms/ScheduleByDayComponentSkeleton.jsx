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
