import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UrlService } from './UrlService';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';

@Injectable()
export class WeatherService {

  constructor(private _http: HttpClient,
              private _urlService: UrlService) { }

  getForecastWeather(): Observable<any> {
    let url = this._urlService.urlGetWeather(6356055); //Barcelona

    return this._http.get<any>(url)
      //.delay(3000)
      .do(data => { } );
  }
  

}
