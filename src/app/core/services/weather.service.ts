import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';

@Injectable()
export class WeatherService {

  constructor(private http: HttpClient) { }

  // got json from yahoo weather API
  public getWeather(zipcode): Observable<any>{
  return this.http.get(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${zipcode}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`);
  }

  // got json from yahoo weather API
  public getZip(lat,lng): Observable<any>{
  return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDreddPJLSQbrjQD9r4kTtmGlvdd0ZNsXA`);
  }

}
