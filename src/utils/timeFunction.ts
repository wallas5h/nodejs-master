export const dateFunction = (
  date: string | Date,
  status: boolean
): string | undefined => {
  try {
    const inputDate: Date = new Date(date);

    const dateMilisec: number = new Date(date).getTime();

    if (status) {
      return new Date(
        dateMilisec + ((getMilisecInMonth(inputDate) as unknown) as number)
      ).toISOString();
    } else if (!status) {
      const fiveDaysMilisec: number = 1000 * 60 * 60 * 24 * 5;
      return new Date(dateMilisec + fiveDaysMilisec).toISOString();
    }
  } catch (error) {
    console.log(error);
  }
};

const isLeapYear = (date: Date): boolean => {
  const year: number = date.getFullYear();
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const getDaysInMonth = (date: Date, next = 0): number => {
  const month = date.getMonth() + next;
  return [
    31,
    isLeapYear(date) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][month];
};

const getMilisecInMonth = (date: Date) => {
  const currentDayInMonth: number = date.getDate();
  const daysInCurrentMonth: number = getDaysInMonth(date);
  const daysInNextMonth: number = getDaysInMonth(date, 1);

  const milisecInDay: number = 1000 * 60 * 60 * 24;

  if (daysInNextMonth >= daysInCurrentMonth) {
    return milisecInDay * daysInCurrentMonth;
  } else if (daysInNextMonth < daysInCurrentMonth) {
    if (currentDayInMonth > daysInNextMonth) {
      return (
        milisecInDay *
        (daysInCurrentMonth - (currentDayInMonth - daysInNextMonth))
      );
    } else {
      return milisecInDay * daysInCurrentMonth;
    }
  }
};
