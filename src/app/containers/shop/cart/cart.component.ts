import { Component, OnDestroy, OnInit, AfterViewChecked } from "@angular/core";
// import { CartItem } from "../../../core/models/cart_item";
// import { DeliveryOption } from "../../../core/models/delivery_option";
// import { ShoppingCart } from "../../../core/models/shopping-cart";
// import { DeliveryOptionsDataService } from "../../../core/services/delivery-options.service";
// import { ShoppingCartService } from "../../../core/services/shopping-cart.service";
import { CartService } from "../../../core/services/cart.service";
import { InventoryService } from "../../../core/services/inventory.service";
import { Router } from '@angular/router';
// import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

// declare var $:any; // want to use jQuery here
// declare var paypal:any;

// interface ICartItemWithProduct extends CartItem {
//   totalCost: number;
// }

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit
// , OnDestroy
// , AfterViewChecked 
{
  // public deliveryOptions: Observable<DeliveryOption[]>;
  // public cart: Observable<ShoppingCart>;
  // public cartItems: ICartItemWithProduct[];
  // public itemCount: number;
  // public code;
  // public show;
  // public invalidCode;
  // public Qty;

  // private cartSubscription: Subscription;


  vb_id;
  companies;
  isLoading: boolean = false;
  orderid;
  totalPrice;
  // compyTotal;
  updateItem;
  show = false;
  showDic = false;
  Qty;
  unitPrice;
  maxQty;
  minPrice;
  newQty;
  invalidCode;
  shopPriceLimit;
  compPriceLimitAlert: boolean = false;

  public constructor(
    //  private deliveryOptionService: DeliveryOptionsDataService,
    //  private shoppingCartService: ShoppingCartService,
    private cartService: CartService,
    private inventoryService: InventoryService,
    private router: Router

  ) {
    //  this.show = false;
    //  this.invalidCode = false;

  }

  // public emptyCart(): void {
  //   this.shoppingCartService.empty();
  // }

  // public setDeliveryOption(option: DeliveryOption): void {
  //   this.shoppingCartService.setDeliveryOption(option);
  // }

  // public ngOnInit(): void {
  // this.deliveryOptions = this.deliveryOptionService.all();
  // //console.log(this.deliveryOptions);
  // this.cart = this.shoppingCartService.get();
  // //console.log(this.cart);
  // this.cartSubscription = this.cart.subscribe((cart) => {
  //   this.itemCount = cart.items.map((x) => x.quantity).reduce((p, n) => p + n, 0);
  //     this.cartItems = cart.items
  //                        .map((item) => {
  //                           return {
  //                             ...item,
  //                             totalCost: item.price * item.quantity };
  //                        });
  // });
  // }

  // private didRenderPaypal: boolean = false;

  // ngAfterViewChecked() {
  //   this.configurePaypal();
  // }

  // configurePaypal() {
  //   if (!this.didRenderPaypal) {

  //     var userId = 2;

  //     this.loadPaypalScript().then(() => {
  //       paypal.Button.render({
  //           style: {
  //             size: 'responsive',
  //             color: 'gold',
  //             shape: 'rect',
  //             label: 'checkout',
  //             tagline: 'true'
  //           },
  //           env: 'sandbox', // sandbox | production
  //           // Create a PayPal app: https://developer.paypal.com/developer/applications/create
  //           client: {
  //             sandbox: 'AcTTeXfkIBtIuudZj2P0ttRb5SkYnOZy4YxQ5mvI_8I6SbEp3-jKuXejNLn4SmKV4m63kGTDy50Er8wy',
  //             // production: environment.services.paypal.clientId
  //           },
  //           // Show the buyer a 'Pay Now' button in the checkout flow
  //           commit: true,

  //           // payment() is called when the button is clicked
  //           payment: function(data, actions) {

  //             // Make a call to the REST api to create the payment
  //             return actions.payment.create({
  //               payment: {
  //                 transactions: [
  //                   {
  //                     amount: {
  //                       total: 12,
  //                       // document.getElementById('total').innerHTML,
  //                       currency: 'USD',
  //                     },
  //                   }
  //                 ]
  //               }
  //             });
  //           },

  //           // onAuthorize() is called when the buyer approves the payment
  //           onAuthorize: function(data, actions) {
  //             // Make a call to the REST api to execute the payment
  //             return actions.payment.execute().then(function() {
  //               //console.log(data);
  //               window.alert('Payment Complete!');
  //             });
  //           }

  //       }, '#paypal-button-container');
  //     });
  //   }
  // }

  // private loadPaypalScript(): Promise<any> {
  //     this.didRenderPaypal = true;
  //     return new Promise((resolve, reject) => {
  //         const scriptElement = document.createElement('script');
  //         scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js';
  //         scriptElement.onload = resolve;
  //         document.body.appendChild(scriptElement);
  //     });
  // }

  // onKey(event: any, item) {
  //   this.Qty = event.target.value - item.quantity;
  //   //console.log('!', this.Qty);
  //   this.shoppingCartService.editItem(item, this.Qty);
  // }

  // addProductToCart(item) {
  //   //console.log(item.productId);
  //   this.shoppingCartService.editItem(item, 1);
  //   // //console.log(typeof 'document.getElementById('total')');
  // }

  // removeProductFromCart(item) {
  //   //console.log(item.productId);
  //   this.shoppingCartService.editItem(item, -1);
  // }

  // deleteProductFromCart(item) {
  //   //console.log(item.productId);
  //   this.shoppingCartService.editItem(item, -1);
  // }

  check(code) {
    if (code == 'SAVE10') {
      this.showDic = true;
      this.invalidCode = false;
    } else {
      this.showDic = false;
      this.invalidCode = true;
    }
  }

  // public ngOnDestroy(): void {
  //   if (this.cartSubscription) {
  //     this.cartSubscription.unsubscribe();
  //   }
  // }

  ngOnInit() {
    this.getCartList();
  }

  getCartList() {
    this.shopPriceLimit = [];
    this.isLoading = true;

    this.cartService.getMe().subscribe(
      (res) => {
        for (let i = 0; i < res.user.employed_companies.length; i++) {
          if (res.user.employed_companies[i].type == 0) {
            this.vb_id = res.user.employed_companies[i].id;
            //console.log(this.vb_id);
            this.cartService.getCartList(171, this.vb_id).subscribe(
              (res) => {
                console.log(res);
                this.companies = res.shop_companies;
                // console.log(this.companies);
                let limitIndex = 0;
                this.isLoading = false;

                this.companies.forEach(comp => {
                  let compKey = (comp.company_id).toString();
                  console.log(compKey);
                  // shopPriceLimit[compKey] = comp.total_price;
                  this.isLoading = true;

                  this.cartService.getShopPriceLimit(compKey).subscribe(
                    (res) => {
                      console.log(res["shopping_min_limit"]);
                      console.log(+comp.total_price);
                      if (+res["shopping_min_limit"] > +comp.total_price) {
                        let obj = new Object();
                        obj["compName"] = comp.name;
                        obj["priceLimit"] = +res["shopping_min_limit"];
                        console.log(obj);
                        this.shopPriceLimit[limitIndex] = obj;
                        limitIndex = limitIndex + 1;
                        console.log(limitIndex);
                      }
                      if (limitIndex == 0) {
                        this.compPriceLimitAlert = false;
                      } else {
                        this.compPriceLimitAlert = true;
                      }
                      this.isLoading = false;
                    },
                    (err) => {
                      console.log(err);
                      this.isLoading = false;
                    }
                  )
                })
                console.log(this.shopPriceLimit);
                console.log(limitIndex);


                this.orderid = res.id;
                this.totalPrice = res.total_price;
                this.companies.forEach(company => {
                  // console.log(company.shop_order_warehouses);
                  company.shop_order_warehouses.forEach(warehouse => {
                    // console.log(warehouse.products);
                    warehouse.products.forEach(item => {
                      console.log(item.company_id,
                        item.company_product_id)
                      this.inventoryService.getRetailPriceTable(item.company_id, item.company_product_id).subscribe(
                        res => {
                          let maxPrice = res[0].price;
                          item.maxPrice = maxPrice;
                        })
                    })
                  })
                })
              }
            )
          }
        }
      }
    )
  }

  onNavToDetail(cid, pid) {
    this.router.navigateByUrl(`/shop/item/${cid}/${pid}`);
  }

  removeItemFromCart(compid, whsid, itemid) {
    this.cartService.deleteItemfromCart(this.orderid, compid, whsid, itemid).subscribe(
      res => {
        //console.log(res);
        this.getCartList();
      }
    )
  }

  emptyCart() {
    this.cartService.emptyCart(this.orderid).subscribe(
      res => {
        //console.log(res);
        this.getCartList();
      }
    )
  }

  updateCart(compid, compyTotal, whsid, item, orderi, compj, itemk) {
    this.show = false;
    //console.log(orderi);
    //console.log(item);
    let itemIndex = "input" + orderi + compj + itemk;
    this.newQty = (<HTMLInputElement>document.getElementById(itemIndex)).value;
    //console.log(this.newQty);

    if (this.newQty) {
      this.isLoading = true;
      this.inventoryService.getProductInfo(item.company_id, item.company_product_id).subscribe(
        res => {
          //console.log(res);
          this.inventoryService.getRetailPriceTable(item.company_id, item.company_product_id).subscribe(
            res => {
              //console.log(res);

              this.maxQty = res[res.length - 1].max_qty;
              this.minPrice = res[res.length - 1].price;
              if (this.newQty > this.maxQty) {
                this.newQty = this.maxQty;
                this.unitPrice = this.minPrice;
                this.show = true;
              }

              for (let i = 0; i < res.length; i++) {
                if (this.newQty <= res[i].max_qty) {
                  this.unitPrice = res[i].price;
                  //console.log("!", this.unitPrice);
                  break;
                }
              }

              // this.maxQty = res[res.length-1].max_qty;
              // this.minPrice = res[res.length-1].price;
              // if (this.newQty > this.maxQty) {
              //   this.newQty = this.maxQty;
              //   this.unitPrice = this.minPrice;
              //   this.show = true;
              // }

              //console.log('unit_price', item.unit_price);
              //console.log('item qty', item.quantity);
              //console.log('new item qty', this.newQty);
              this.totalPrice = this.totalPrice - item.unit_price * item.quantity + this.newQty * this.unitPrice;
              compyTotal = compyTotal - item.unit_price * item.quantity + this.newQty * this.unitPrice;

              this.updateItem = {
                "total_price": this.totalPrice,
                // "total_price": "3200",
                "shop_company":
                {
                  "id": compid,
                  // "total_price": "2000",
                  "total_price": compyTotal,
                  "shop_order_warehouse":
                  {
                    "id": whsid,
                    "shipping_fee": null,
                    "product": {
                      "id": item.id,
                      "quantity": this.newQty,
                      "unit_price": this.unitPrice
                    }
                  }
                }
              }
              //console.log(this.updateItem);

              this.cartService.updateCart(this.orderid, this.updateItem).subscribe(
                res => {
                  //console.log(res);
                  this.getCartList();
                },

                err => {
                  this.isLoading = false;
                }
              )

            }
          )
        }
      )
    }
  }
}
