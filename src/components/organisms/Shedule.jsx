const HORARIOS_DISPONIBLES = [
  {
    value: '08:00',
    label: '8:00 AM',
  },
  {
    value: '09:00',
    label: '9:00 AM',
  },
  {
    value: '10:00',
    label: '10:00 AM',
  },
  // ... Más horarios
];

export default function Schedule(props) {
  return (
    <div className="grid grid-cols-7 grid-rows-10 gap-4">
      <div>Schedule</div>
    </div>
  );
}
