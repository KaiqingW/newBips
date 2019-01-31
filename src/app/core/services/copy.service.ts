import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs'
@Injectable()
export class CopyService {
    
    constructor(private http: HttpClient){}

   copy_product;

   setSelectedProduct(copy_product){
       this.copy_product = copy_product;
   }

   getSelectedProduct(){
        return this.copy_product;
   }

   clearSelectedProduct(){
    this.copy_product = null;
   }
}