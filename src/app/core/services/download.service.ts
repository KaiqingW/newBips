import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DownloadService {
    constructor(private http: HttpClient) { }

    public download(company_id, file_id): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/file/${file_id}/downloads`);
    }
}