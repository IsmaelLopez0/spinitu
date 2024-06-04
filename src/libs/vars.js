export const paymentOptions = {
  CASH: 'Cash',
  CREDIT_CARD: 'Credit Card',
  DEBIT: 'Debit',
  BANK_TRANSFERS: 'Bank Transfers',
};

export const validSchedule = {
  1: { start: '6:00', end: '7:50' },
  2: { start: '7:00', end: '8:50' },
  3: { start: '8:00', end: '9:50' },
  4: { start: '9:00', end: '10:50' },
  5: { start: '10:00', end: '11:50' },
  6: { start: '11:00', end: '12:50' },
  7: { start: '12:00', end: '13:50' }, // remover temporalmente
  8: { start: '18:00', end: '19:50' },
  9: { start: '19:00', end: '20:50' },
  10: { start: '20:00', end: '21:50' },
  11: { start: '21:00', end: '22:50' },
};

export const CYCLING = 'cycling';
export const BARRE = 'barre';

export const scheduleByDay = [
  [
    // Horario
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    // { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
  ],
  [
    // Lunes
    { id: 1, type: CYCLING },
    { id: 2, type: CYCLING },
    { id: 3, type: CYCLING },
    { id: 4, type: CYCLING },
    { id: 5, type: BARRE },
    { id: 6, type: BARRE },
    // { id: 7, type: BARRE },
    { id: 8, type: CYCLING },
    { id: 9, type: CYCLING },
    { id: 10, type: CYCLING },
    { id: 11, type: CYCLING },
  ],
  [
    // Martes
    { id: 1, type: CYCLING },
    { id: 2, type: CYCLING },
    { id: 3, type: CYCLING },
    { id: 4, type: CYCLING },
    { id: 5, type: BARRE },
    { id: 6, type: BARRE },
    // { id: 7, type: BARRE },
    { id: 8, type: CYCLING },
    { id: 9, type: CYCLING },
    { id: 10, type: CYCLING },
    { id: 11, type: CYCLING },
  ],
  [
    // Miercoles
    { id: 1, type: CYCLING },
    { id: 2, type: CYCLING },
    { id: 3, type: CYCLING },
    { id: 4, type: CYCLING },
    { id: 5, type: BARRE },
    { id: 6, type: BARRE },
    // { id: 7, type: BARRE },
    { id: 8, type: CYCLING },
    { id: 9, type: CYCLING },
    { id: 10, type: CYCLING },
    { id: 11, type: CYCLING },
  ],
  [
    // Jueves
    { id: 1, type: CYCLING },
    { id: 2, type: CYCLING },
    { id: 3, type: CYCLING },
    { id: 4, type: CYCLING },
    { id: 5, type: BARRE },
    { id: 6, type: BARRE },
    // { id: 7, type: BARRE },
    { id: 8, type: CYCLING },
    { id: 9, type: CYCLING },
    { id: 10, type: CYCLING },
    { id: 11, type: CYCLING },
  ],
  [
    // Viernes
    { id: 1, type: CYCLING },
    { id: 2, type: CYCLING },
    { id: 3, type: CYCLING },
    { id: 4, type: CYCLING },
    { id: 5, type: BARRE },
    { id: 6, type: BARRE },
    // { id: 7, type: BARRE },
    { id: 8, type: CYCLING },
    { id: 9, type: CYCLING },
    { id: 10, type: CYCLING },
    { id: 11, type: CYCLING },
  ],
  [
    // Sabado
    { id: null },
    { id: 2, type: BARRE },
    { id: 3, type: BARRE },
    { id: 4, type: BARRE },
    { id: 5, type: CYCLING },
    { id: 6, type: CYCLING },
    // { id: 7, type: CYCLING },
    { id: null },
    { id: null },
    { id: null },
    { id: null },
  ],
  [
    // Domingo
    { id: null },
    { id: 2, type: BARRE },
    { id: 3, type: BARRE },
    { id: 4, type: BARRE },
    { id: 5, type: CYCLING },
    { id: 6, type: CYCLING },
    // { id: 7, type: CYCLING },
    { id: null },
    { id: null },
    { id: null },
    { id: null },
  ],
];
