import { Component } from '@angular/core';
import { Month, WeekDays } from './Month';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title: string = 'Cotecna Assessment';
  months: Month[];
  years: number[] = new Array<number>();
  days:number[][] = [];
  actualDate: Date = new Date();
  weekDays: string[] = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  constructor() { 
    // Fill calendar
    this.actualDate.setDate(1);
    this.days = this.fillMonthCalendar(new Date(this.actualDate.getFullYear(), this.actualDate.getMonth(), 1));    

    //fill years combobox
    for (let _i = this.actualDate.getFullYear()-10; _i <= this.actualDate.getFullYear()+10; _i++) {
      this.years.push(_i);
    } 

    //fill months combobox
    this.months = new Array<Month>();
    for (let _i = 0; _i < 12; _i++) {
      this.months.push(new Month(this.getMonthName(_i), _i+1));
    }
  }

  private getMonthName(value: number) : string {
    let date = new Date();
    date.setMonth(value);
    let monthName = date.toLocaleString(navigator.language.substring(0,2), { month: "long" });
    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
    return monthName;
  }

  private fillMonthCalendar(value: Date) : number[][] {
    var ret:number[][] = [];

    // Find previous monday for current date
    value.setDate(1);
    while(value.getDay() != WeekDays.MONDAY){
      value.setDate(value.getDate() - 1);      
    }

    // Fill matrix for current month
    for (let _i = 0; _i < 6; _i++) {
      ret[_i] = [];
      for (let _j = 0; _j < 7; _j++) {
        ret[_i][_j] = value.getDate();
        value.setDate(value.getDate() + 1);
      }
    }

    return ret;
  }

  changeMonth(value: number) {
    this.actualDate.setMonth(value-1);

    // Fill calendar
    this.days = this.fillMonthCalendar(new Date(this.actualDate.getFullYear(), this.actualDate.getMonth(), 1));
  }

  changeYear(value: number) {
    this.actualDate.setFullYear(value);
    
    // Fill calendar
    this.days = this.fillMonthCalendar(new Date(this.actualDate.getFullYear(), this.actualDate.getMonth(), 1));
  }


}



