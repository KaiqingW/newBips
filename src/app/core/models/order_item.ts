export class Order_Item {
  constructor(
    public id: number ,
    public product_id:number,
    public customer_item_number: string ,
    public sales_item_number: string ,
    public customer_id: number,
    public quantity: number ,
    public balance: number ,
    public description: string ,
    public requirement: string ,
    public unit_price: number,
    public shipping_method : string
  ){}

}
