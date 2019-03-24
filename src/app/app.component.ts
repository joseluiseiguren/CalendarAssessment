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
  private title: string = 'Cotecna Assessment - Calendar App';
  private months: Month[];
  private years: number[] = new Array<number>();
  private monthDays: CalendarDay[][] = [];
  private selectedDate: Date = new Date();
  private weekDays: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  /**
  * Class Constructor
  * @param _weatherService To query webapi  
  */
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
  }

  /**
  * Get the month name related to browser locale
  * @param value  month number
  * @returns month name
  */
  private getMonthName(value: number): string {
    let date = new Date();
    date.setMonth(value);
    let monthName = date.toLocaleString(navigator.language.substring(0, 2), { month: "long" });
    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
    return monthName;
  }

  /**
  * Populate matrix calendar for a specific date
  * @param value date to mark as today
  * @returns matrix with dates filled
  */
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

  /**
  * Event fired by the browser, when month dropdown changes
  * @param value month selected  
  */
  private changeMonth(value: number) {
    this.selectedDate.setMonth(value - 1);

    // Fill calendar
    this.monthDays = this.fillMonthCalendar(new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1, 0, 0, 0, 0));
    this.fillCalendarWeatherInfo();
  }

  /**
  * Event fired by the browser, when year dropdown changes
  * @param value year selected  
  */
  private changeYear(value: number) {
    this.selectedDate.setFullYear(value);

    // Fill calendar
    this.monthDays = this.fillMonthCalendar(new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1, 0, 0, 0, 0));
    this.fillCalendarWeatherInfo();
  }

  /**
  * Verify for a specific date, if this is the current month
  * @param dateToVerify date to verify if this is the current month
  * @returns true: actual month / false: is not eh actual month
  */
  private isActualMonth(dateToVerify: Date): boolean {
    let today = new Date();
    return dateToVerify.getFullYear() == today.getFullYear() && dateToVerify.getMonth() == today.getMonth();
  }

  /**
  * Query web api for forecast weather, and update matrix info
  */
  private fillCalendarWeatherInfo() {
    if (this.isActualMonth(this.selectedDate)) {
      //get weather info from external webapi
      this._weatherService.getForecastWeather()
        .subscribe(
        data => {

          let winfo = this.convertWeatherInfo(data.list);

          for (let _i = 0; _i < this.monthDays.length; _i++) {
            for (let _j = 0; _j < this.monthDays[_i].length; _j++) {
              for (let _k = 0; _k < winfo.length; _k++) {
                //set weather info for date
                if (winfo[_k].date.valueOf() == this.monthDays[_i][_j].date.valueOf()) {
                  this.monthDays[_i][_j].aditionalInfo = this.formatWeatherInfo(winfo[_k]);
                }

              }
            }
          }
        },
        error => {
          console.log(error);
        });
    }
  }

  /**
  * Format weather info to display on matrix grid
  * @param winfo weather info to format
  * @returns weather info formated
  */
  private formatWeatherInfo(winfo: WeatherInfo): string {
    return winfo.description + " (" + winfo.maxTemperature.toString() + "º)";
  }

  /**
  * Convert webapi json response,m to weather info object for N days
  * @param data json response from webapi
  * @returns weather info array
  */
  private convertWeatherInfo(data: any): WeatherInfo[] {
    let wi = new Array<WeatherInfo>();

    console.log(data);

    let actualDate: Date = new Date();
    let tmpDate: Date;
    for (let _i = 0; _i < data.length; _i++) {
      tmpDate = new Date(data[_i].dt_txt);
      tmpDate.setHours(0, 0, 0, 0);
      if (actualDate.valueOf() != tmpDate.valueOf()) {
        wi.push(new WeatherInfo(
                        new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate(), 0, 0, 0, 0),
                        data[_i].weather[0].description,
                        this.convertToCelsius(data[_i].main.temp_max)));

        actualDate.setFullYear(tmpDate.getFullYear());
        actualDate.setMonth(tmpDate.getMonth());
        actualDate.setDate(tmpDate.getDate());
        actualDate.setHours(0, 0, 0, 0);
      }
      
    }

    return wi;
  }

  /**
  * convert Kelvin degrees to celsius
  * @param degree kelvin degree to convert
  * @returns degree on celsius format
  */
  private convertToCelsius(degree: string): number {
    return Number((Number(degree) - 273.15).toFixed(0));
  }


}
