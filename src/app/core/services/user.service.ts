import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient
  ) {}

  public getUserProfile(userId): Observable<any> {
    return this.http.get(environment.ORCA_API + `user/${userId}`);
  }

  public updateProfile(profile, userId): Observable<any> {
    return this.http.patch(environment.ORCA_API + `user/${userId}`, profile);
  }

}
