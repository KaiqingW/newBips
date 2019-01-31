import { Injectable } from "@angular/core";
import { environment } from 'environments/environment';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';

@Injectable()
export class ShopManagementService {
  private product = new Subject<any>();

  constructor(private http: HttpClient) { }

  setProduct(product) {
    this.product.next(product);
  }

  getProduct(): Observable<any> {
    return this.product.asObservable();
  }
}
