export function getCurrentWeek() {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil(days / 7);
}

export function getDay(firstDayWeek, i) {
  const currentDay = new Date(firstDayWeek.getTime() + i * 24 * 60 * 60 * 1000);
  const monthDay = currentDay.getMonth();
  return { currentDay, monthDay };
}

export function compareDates(d1, d2) {
  const date1 = d1.getTime();
  if (date1 < d2) return 1; // d1 is less than d2
  if (date1 > d2) return 2; // d1 is greater than d2
  return 0; // Both dates are equal
}

export function getIsValidDifference(date2, diff) {
  const date1 = new Date();
  return date1.setDate(date1.getDate() + diff) >= new Date(date2);
}

export function sumDaysToDate(fecha, dias) {
  const calculado = new Date(fecha);
  const dateResul = fecha.getDate() + dias;
  calculado.setDate(dateResul);
  return calculado;
}

export function obtenerNombreMes(mes) {
  const meses = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return meses[mes];
}

export function formatDate(d) {
  let month = d.getMonth() + 1;
  let day = d.getDate();
  const year = d.getFullYear();

  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;

  return [year, month, day].join('-');
}
