import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CommonService{
    searhTerm = new Subject<string>();

    constructor(private http: HttpClient) { }

    addAttachment(company_id, customer_id, attachment){
        return this.http.post(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/attachment`, attachment);
    }

    addAttachmentForProduct(company_id, customer_id, attachment){
        return this.http.post(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/product_attachment`, attachment);
    }
    
    searchFieldOfTable(company_id, category, table, field, query, order) : Observable<any>{
        // category : inventory
        // table  : table name
        // filed  : field name
        // query  : search term
        // order  : 'asc' or 'desc'
        return this.http.get(environment.ORCA_API + `company/${company_id}/search/${category}?t=${table}&f=${field}&q=${query}&o=${order}`);
    }

    sendMessage(message: string) {
        this.searhTerm.next(message);
    }
 
    clearMessage() {
        this.searhTerm.next();
    }
 
    getMessage(): Observable<any> {
        return this.searhTerm.asObservable();
    }
    //if you want use the message system, just copy this api and change the content
    sendQuoteMessageToUSer():Observable<any>{
        return this.http.post(environment.ORCA_API + 'sms',{"phones":["6463619789",],"content":"You get new Quote from Glopak USA Crop, Please login this link bips.orcasmart.us to check you quote"})
    }
    sendMeetingNoticeToUSer():Observable<any>{
        return this.http.post(environment.ORCA_API + 'sms',{"phones":["6463619789"],"content":"You get new Meeting Notices from Glopak USA Crop, Please login this link bips.orcasmart.us to check you Meeting"})
    }

    sendInviteNoticeToUSer(value):Observable<any>{
        return this.http.post(environment.ORCA_API + 'sms',value);
    }

    sendQuoteEmailToUSer():Observable<any>{
        return this.http.post(environment.ORCA_API + 'email',{"emails":["jack@orcasmart.com"],"content":"You get new Quote from Glopak USA Crop, Please login this link bips.orcasmart.us to check you quote", "subject":"test"})
    }

    sendMettingEmailToUSer():Observable<any>{
        return this.http.post(environment.ORCA_API + 'email',{"emails":["jack@orcasmart.com"],"content":"You get new Quote from Glopak USA Crop, Please login this link bips.orcasmart.us to check you quote", "subject":"test"})
    }

    sendBroadcastToCustomer(emails):Observable<any>{
        return this.http.post(environment.ORCA_API + 'email',emails)
    }

    sendEmialtoNoticeEmployee(value):Observable<any>{
        return this.http.post(environment.ORCA_API + 'email', value)
    }

    sendEmailWithItems(value):Observable<any>{
        return this.http.post(environment.ORCA_API + 'email/withitems', value);
    }

    sendEmailWithItemstemplate(value):Observable<any>{
        return this.http.post(environment.ORCA_API + 'email/withitemsTemplate?template=1', value);
    }

    sendEmailWithoutToken(value):Observable<any>{
        return this.http.post(environment.ORCA_API + 'email/withoutToken', value);
    }

    checkResetCodeAndPassword(value):Observable<any>{
        return this.http.post(environment.ORCA_API + 'check', value);
    }

    sendConfirmEmailToCustomer(value):Observable<any>{
        return this.http.post(environment.ORCA_API + 'emial/withitemsfromshop', value);
    }
}