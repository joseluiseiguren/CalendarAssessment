
export class CalendarDay {
  date: Date;
  aditionalInfo: string;
  isToday: boolean;

  constructor(date: Date, aditionalInfo: string, isToday: boolean) {
    this.date = date;
    this.aditionalInfo = aditionalInfo;
    this.isToday = isToday;
  }
}
