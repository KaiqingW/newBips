import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';
import{ SomeSharedService } from './someShared.service';


@Injectable()
export class ZipCodeService{
    
    constructor(
        private http: HttpClient,
        private someSharedService:SomeSharedService
    ){}
    
    public getZipcodeList(q: string = ''): Observable<any>{
        return this.http.get(environment.ORCA_API + `search/zipcode?q=${q}`)
    }

    public getZipCodeAddress(q: string = ''): Observable<any> {
        this.someSharedService.useGoogleMap = true;
        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?&address=${q}&key=AIzaSyDreddPJLSQbrjQD9r4kTtmGlvdd0ZNsXA`)
    }

}