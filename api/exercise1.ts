export const dateFunction = (
  date: string | Date,
  status: boolean
): Date | undefined => {
  try {
    const inputDate: Date = new Date(date);

    const dateMilisec: number = new Date(date).getTime();

    if (status) {
      return new Date(
        dateMilisec + ((getMilisecInMonth(inputDate) as unknown) as number)
      );
    } else if (!status) {
      const fiveDaysMilisec: number = 1000 * 60 * 60 * 24 * 5;
      return new Date(dateMilisec + fiveDaysMilisec);
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

const input1 = "2022-10-03T08:12:59Z, true";
const input2 = `2022-10-03T08:12:59Z, false`;
const input3 = `2022-01-31T08:12:59Z, true`;

const inputDate1: string = "2022-10-03T08:12:59Z"; // true  -> 2022-11-03T08:12:59Z
const inputDate2: string = "2022-01-31T08:12:59Z"; // true  -> 2022-02-28T08:12:59Z
const inputDate3: string = "2022-10-03T08:12:59Z"; // false -> 2022-10-08T08:12:59Z
const inputDate4: string = "2022-05-31T08:12:59Z";

const dateInFuture = dateFunction("2022-03-01T08:12:59Z", true);
console.log(dateInFuture);
