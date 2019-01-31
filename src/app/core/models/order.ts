import { Order_Item } from './index';


export class Order {
  constructor(
     public id: number,
     public purchase_order_number: string,
     public sales_order_number: string,
     public customer_name: string,
     public order_date: string,
     public destination: string,
     public request_date: string,
     public status: string,
     public created: any,
     public updated: any,
     public order_items: Order_Item
  ) { }
}

