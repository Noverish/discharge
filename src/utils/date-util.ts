function cloneAndSet12AM(date: Date): Date {
  const clone = new Date(date);
  clone.setHours(0);
  clone.setMinutes(0);
  clone.setSeconds(0);
  clone.setMilliseconds(0);
  return clone;
}

export function dateToString(date: Date) {
  const year = date.getFullYear();
  const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
  const day: string = (date.getDate()).toString().padStart(2, '0');

  return `${year}/${month}/${day}`;
}

export function addMonth(date: Date, months: number): Date {
  date.setMonth(date.getMonth() + months);
  return date;
}

export function addDay(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}

export function addSecond(date: Date, seconds: number): Date {
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}

export function monthDiff(date2: Date, date1: Date): number {
  const yearDiff = date2.getFullYear() - date1.getFullYear();
  return (yearDiff * 12) + date2.getMonth() - date1.getMonth();
}

export function dayDiff(date2: Date, date1: Date): number {
  const date1Clone = cloneAndSet12AM(date1);
  const date2Clone = cloneAndSet12AM(date2);

  return Math.ceil((date2Clone.getTime() - date1Clone.getTime()) / 86400000);
}

export function secondDiff(date2: Date, date1: Date): number {
  return Math.floor((date2.getTime() - date1.getTime()) / 1000);
}

export function setDay1AndMidnight(date: Date): Date {
  date.setDate(1);
  date.setUTCHours(9);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date;
}

export function secondsToString(seconds: number): string {
  const sec = (seconds % 60).toString().padStart(2, '0');
  const minutes = Math.floor(seconds / 60);

  const min = (minutes % 60).toString().padStart(2, '0');
  const hours = Math.floor(minutes / 60);

  const hour = (hours % 24).toString().padStart(2, '0');
  const days = Math.floor(hours / 24);

  return `${days}일 ${hour}시간 ${min}분 ${sec}초`;
}
