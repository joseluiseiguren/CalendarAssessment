import { Component } from '@angular/core';
import { Month, WeekDays } from './Month';
import { CalendarDay } from './CalendarDay';
import { WeatherService } from './services/WeatherService';
import { WeatherInfo } from './WeatherInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  private title: string = 'Cotecna Assessment';
  private months: Month[];
  private years: number[] = new Array<number>();
  private monthDays: CalendarDay[][] = [];
  private selectedDate: Date = new Date();
  private weekDays: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  constructor(private _weatherService: WeatherService) {
    // Fill calendar
    this.selectedDate.setDate(1);
    this.monthDays = this.fillMonthCalendar(new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1, 0, 0, 0, 0));
    this.fillCalendarWeatherInfo();

    //fill years combobox
    for (let _i = this.selectedDate.getFullYear() - 10; _i <= this.selectedDate.getFullYear() + 10; _i++) {
      this.years.push(_i);
    }

    //fill months combobox
    this.months = new Array<Month>();
    for (let _i = 0; _i < 12; _i++) {
      this.months.push(new Month(this.getMonthName(_i), _i + 1));
    }

    /*if (this.isActualMonth(this.selectedDate)) {
      this._weatherService.getForecastWeather()
        .subscribe(
        data => {
          console.log(data.list);
        },
        error => {
          console.log(error);
        });
    } */
  }

  private getMonthName(value: number): string {
    let date = new Date();
    date.setMonth(value);
    let monthName = date.toLocaleString(navigator.language.substring(0, 2), { month: "long" });
    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
    return monthName;
  }

  private fillMonthCalendar(value: Date): CalendarDay[][] {
    var ret: CalendarDay[][] = [];

    // Find previous monday for current date
    value.setDate(1);
    while (value.getDay() != WeekDays.MONDAY) {
      value.setDate(value.getDate() - 1);
    }

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fill matrix for current month
    for (let _i = 0; _i < 6; _i++) {
      ret[_i] = [];
      for (let _j = 0; _j < 7; _j++) {
        ret[_i][_j] = new CalendarDay(
          new Date(value),
          null,
          value.valueOf() == today.valueOf());
        value.setDate(value.getDate() + 1);
        value.setHours(0, 0, 0, 0);        
      }
    }

    return ret;
  }

  private changeMonth(value: number) {
    this.selectedDate.setMonth(value - 1);

    // Fill calendar
    this.monthDays = this.fillMonthCalendar(new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1, 0, 0, 0, 0));
    this.fillCalendarWeatherInfo();
  }

  private changeYear(value: number) {
    this.selectedDate.setFullYear(value);

    // Fill calendar
    this.monthDays = this.fillMonthCalendar(new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1, 0, 0, 0, 0));
    this.fillCalendarWeatherInfo();
  }

  private isActualMonth(dateToVerify: Date): boolean {
    let today = new Date();
    return dateToVerify.getFullYear() == today.getFullYear() && dateToVerify.getMonth() == today.getMonth();
  }

  private getWeatherInfo(): WeatherInfo[] {
    let wi = new Array<WeatherInfo>();

    wi.push(new WeatherInfo(new Date(2019, 2, 24, 0, 0, 0, 0), "Cloudy", 15));
    wi.push(new WeatherInfo(new Date(2019, 2, 25, 0, 0, 0, 0), "Rain", 10));
    wi.push(new WeatherInfo(new Date(2019, 2, 26, 0, 0, 0, 0), "Sunny", 5));
    wi.push(new WeatherInfo(new Date(2019, 2, 27, 0, 0, 0, 0), "Cloudy", 20));
    wi.push(new WeatherInfo(new Date(2019, 2, 28, 0, 0, 0, 0), "Rain", 41));

    return wi;
  }

  private fillCalendarWeatherInfo() {
    if (this.isActualMonth(this.selectedDate)) {
      let winfo = this.getWeatherInfo();

      for (let _i = 0; _i < this.monthDays.length; _i++) {
        for (let _j = 0; _j < this.monthDays[_i].length; _j++) {
          for (let _k = 0; _k < winfo.length; _k++) {

            if (winfo[_k].date.valueOf() == this.monthDays[_i][_j].date.valueOf()) {
              this.monthDays[_i][_j].aditionalInfo = this.formatWeatherInfo(winfo[_k]);
            }
            
          }
        }
      }

    }
  }

  private formatWeatherInfo(winfo: WeatherInfo): string {
    return winfo.description + " (" + winfo.maxTemperature.toString() + "º)";
  }


}
