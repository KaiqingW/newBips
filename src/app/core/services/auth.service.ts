import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { User } from 'app/core/models/user';
import { ObserveOnMessage } from 'rxjs/operators/observeOn';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,

  ) {
    
  }

  public getOrcaToken(): string {
    return localStorage.getItem('orcasmart_access_token');
  }

  public setOrcaToken(token): void {
    localStorage.setItem('orcasmart_access_token', token);
  }

  public removeOrcaToken(): void {
    localStorage.removeItem('orcasmart_access_token');
  }

  public login(credential): Observable<any> {
    return this.http.post(environment.ORCA_API + 'login', credential);
  }

  public signup(credential): Observable<any> {
    return this.http.post(environment.ORCA_API + 'signup', credential);
  }

  public getDigitsToResetPwd(email) :  Observable<any>{
    let obj = {
      email : email,
    };

    return this.http.post(environment.ORCA_API + 'digits', obj);
  }

  public getTokenAfterGetDigits(email, digits) : Observable<any>{
    
    let obj = {
      email : email,
      digits : digits
    };

    return this.http.post(environment.ORCA_API + 'login', obj);
  }

  public pwdReset(pwd, reset_token)  : Observable<any>{
    let obj = {
      new_password : pwd
    };
    return this.http.patch(environment.ORCA_API + 'password?token=' + reset_token, obj);
  }

  public getCurrentUser(): Observable<any> {
    return this.http.get(environment.ORCA_API + 'me');
  }

  public getCurrentUserBrief(): Observable<any> {
    return this.http.get(environment.ORCA_API + 'me/brief');
  }

}
