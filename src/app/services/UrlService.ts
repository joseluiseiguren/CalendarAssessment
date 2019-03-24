import { Injectable } from '@angular/core';

@Injectable()
export class UrlService {
  private _host: string = "http://api.openweathermap.org/data/2.5/forecast?";
  private _appId: string = "APPID=2d97b86394d8a4ab8380f527f58599c0";

  urlGetWeather(cityId: number): string {
    return this._host + "id=" + cityId.toString() + "&" + this._appId;

  }
}
