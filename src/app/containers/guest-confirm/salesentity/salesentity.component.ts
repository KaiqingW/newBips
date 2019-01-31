import {  Component, OnInit } from '@angular/core';
import { QuoteService } from 'app/core/services/quote.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector:'salesentity-confirm',
    templateUrl:'salesentity.component.html',
    styleUrls:['salesentity.component.scss']
})

export class SalesentityConfirmComponent implements OnInit {
    companyId;
    salesentityId;
    errorRoute = true;
    isLoading:boolean;
    salesentity;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private quoteService: QuoteService
    ){
        this.isLoading = true;
        this.companyId = this.route.snapshot.paramMap.get('cid');
        this.salesentityId = this.route.snapshot.paramMap.get('sid');
        console.log(this.companyId);
        console.log(this.salesentityId);
    }

    ngOnInit(){
        this.getSalesentityWithoutToken();
    }

    getSalesentityWithoutToken(){
        console.log("this function should get the salentity information, like('quote', 'salesorcder',...) ");
        this.quoteService.getSalesentityWithoutToken(this.companyId, this.salesentityId).subscribe(
            res=>{
                this.salesentity = res;
                console.log(this.salesentity);
                this.errorRoute = false;
                console.log(res);
                this.isLoading = false;
            },
            err=>{
                this.errorRoute = true;
                this.isLoading = false;
                console.log(err.error.error);
            }
        )
       
    }

    agreeWithQuote(comment){
        this.isLoading = true;
        console.log(comment);
        console.log('agree with the quote');
        let value = {
            "customer_approve":"Approved",
            "customer_comments": comment
        }
        this.quoteService.changeSalesentityWithoutToken(this.companyId, this.salesentityId, value).subscribe(
            res=>{
                this.salesentity = res;
                this.isLoading = false;
            }
        )
    }

    disagreeWithQuote(comment){
        console.log(comment);
        this.isLoading = true;
        let value = {
            "customer_approve":"Decline",
            "customer_comments": comment
        }
        this.quoteService.changeSalesentityWithoutToken(this.companyId, this.salesentityId, value).subscribe(
            res=>{
                this.salesentity = res;
                this.isLoading = false;
            }
        )
        console.log('disagree with the quote ');
    }

    fixNumberQty(value, number){
        return parseFloat(value).toFixed(number)
    }
}