import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class TemplateService {
  constructor(private http: HttpClient) {}

  public addTemplate(company, category_id, obj): Observable<any> {
    return this.http.post(
      environment.ORCA_API + `company/${company}/${category_id}/template`,
      obj
    );
  }

  public getTemplate(company, category_id): Observable<any> {
    return this.http.get(
      environment.ORCA_API + `company/${company}/${category_id}/template`
    );
  }
}
