import { Component } from "@angular/core";

@Component({
    selector: 'company-purchase-order',
    templateUrl:'company-purchase-order.component.html',
    styleUrls:['company-purchase-order.component.scss']
})

export class CompanyPurchaseOrderComponent{

    constructor() { }
    
      productList: any = [
        {
          "id": 1,
          "customer_order_number" : 98065,
          "sales_order_number": "VP3284627386", 
          "order_date": "11/11/2017",
          "request_date": "2017-11-28 17:15:32",
          "customer_info": "example",
          "deliver_address": "example",
          "destination": "example",
          "order_items": [
              {
                  "id": 1,
                  "customer_item_name": "example",
                  "sales_item_name": "example",
                  "quantity": 1000,
                  "balance": 10000,
                  "description": "example",
                  "request": "example",
                  "order_item_shipping": [
                      {
                          "id": 1,
                          "shipping_quantity": 1000,
                          "Container": "AP32878921",
                          "vessel_date": "2017-11-28 17:15:32",
                          "eta_date": "2017-11-28 17:15:32",
                          "arrive_date": "2017-11-28 17:15:32",
                          "glk_number": "0103-18",
                          "notes": "example"
                      },
                  ]
              },
          ]
        },
    
        {
          "id": 2,
          "customer_order_number" : 98065,
          "sales_order_number": "VP3284627386", 
          "order_date": "11/11/2017",
          "request_date": "2017-11-28 17:15:32",
          "customer_info": "example",
          "deliver_address": "example",
          "destination": "example",
          "order_items": [
              {
                  "id": 1,
                  "customer_item_name": "example",
                  "sales_item_name": "example",
                  "quantity": 1000,
                  "balance": 10000,
                  "description": "example",
                  "request": "example",
                  "order_item_shipping": [
                      {
                          "id": 1,
                          "shipping_quantity": 1000,
                          "Container": "AP32878921",
                          "vessel_date": "2017-11-28 17:15:32",
                          "eta_date": "2017-11-28 17:15:32",
                          "arrive_date": "2017-11-28 17:15:32",
                          "glk_number": "0103-18",
                          "notes": "example"
                      },
                  ]
              },
          ]
        },
    
        {
          "id": 3,
          "customer_order_number" : 98065,
          "sales_order_number": "VP3284627386", 
          "order_date": "11/11/2017",
          "request_date": "2017-11-28 17:15:32",
          "customer_info": "example",
          "deliver_address": "example",
          "destination": "example",
          "order_items": [
              {
                  "id": 1,
                  "customer_item_name": "example",
                  "sales_item_name": "example",
                  "quantity": 1000,
                  "balance": 10000,
                  "description": "example",
                  "request": "example",
                  "order_item_shipping": [
                      {
                          "id": 1,
                          "shipping_quantity": 1000,
                          "Container": "AP32878921",
                          "vessel_date": "2017-11-28 17:15:32",
                          "eta_date": "2017-11-28 17:15:32",
                          "arrive_date": "2017-11-28 17:15:32",
                          "glk_number": "0103-18",
                          "notes": "example"
                      },
                  ]
              },
          ]
        },
    
    
      ];
    
      selectedProduct: any = this.productList[0];
    
      ngOnInit() {
        
            let addScrollFunction = function(){
                let header = document.getElementById('orders-header');
                let sticky = header.offsetTop;
                if(window.pageYOffset >= sticky){
                    header.classList.add("sticky");
                    console.log('1');
                } else {
                    header.classList.remove("sticky");
                    console.log('2');
                }
            }
           
            window.onscroll = function(){
                addScrollFunction();
                console.log('here!');
            }

      }
      
      
      
      selectProduct(product) {
        this.selectedProduct = product;
      }
    
}