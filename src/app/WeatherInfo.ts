export class WeatherInfo {
  date: Date;
  description: string;
  maxTemperature: number;

  constructor(date: Date, description: string, maxTemprature: number) {
    this.date = date;
    this.description = description;
    this.maxTemperature = maxTemprature;
  }
}