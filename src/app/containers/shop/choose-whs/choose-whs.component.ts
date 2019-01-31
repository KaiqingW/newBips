import { Component, OnInit, ViewChild } from '@angular/core';
// transfer parameter id from product-list to product-info usign router
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../../core/services/inventory.service';
import { UpsService } from '../../../core/services/ups.service';
import { CartService } from "../../../core/services/cart.service";
import { Product } from "../../../core/models/product.model";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Warehouse } from 'app/core/models/warehouse';
import { ShopService } from 'app/core/services/shop.service';
import { CommonService } from 'app/core/services/common.service';
import { AuthService } from 'app/core/services/auth.service';

declare var $: any; // want to use jQuery here
declare var paypal: any;

@Component({
  selector: 'choose-whs',
  templateUrl: './choose-whs.component.html',
  styleUrls: ['./choose-whs.component.scss']
})
export class ChooseWhsComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  markers: any[];
  infoWindows = [];
  ifFullScreen = false;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer; addressArr = [];
  selectedImg = '';
  modalOpen: boolean = false;
  product_id: number;
  company_id: number;
  product;
  priceRange;
  price;
  qtyRange;
  cartproduct: Product;
  multiPictures = ["assets/images/bottle.png"];
  selectedAttachmentIndex: number;
  show;
  nonCategoryAttachArr = [];
  isLoading: boolean = true;
  category: string = '';
  selectedAttachment;
  showNum: number = 2;
  qtyArr = [];
  Qty: string = "1";
  Qty1: string = "2";
  Qty0: string = "1";
  totalQty;
  success = false;
  warehouses;
  upsbody;
  showMap: boolean = false;
  selectedWarehouse: Warehouse = null;
  selectedWarehouseIndex: number;
  selectedDestination;
  searchAddress: '';
  destinationArr;
  cartItems = [];
  vb_id;
  addrId;
  addrList;
  shipAddr;
  toState;
  toZip;
  toCoun;
  companies;
  orderid;
  totalPrice;
  itemsTotalPrice;
  paypaltotalprice;
  unitPrice;
  maxQty;
  minPrice;
  newQty;
  updateItem;
  showDic = false;
  invalidCode = false;
  compTotalPriceArr = [];
  discountArr = [];
  discountPrice;
  totaldiscountPrice;
  discount;
  discCompArr;
  constPaypaltotalprice;
  totalShipFee;
  pkgNumb;
  userInfo;
  orderInformation;//define by yadong to tansfer data

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private upsService: UpsService,
    private cartService: CartService,
    public dialog: MatDialog,
    private shopService: ShopService,
    private commonService : CommonService,
    private authService: AuthService
  ) {

    // this.product_id = +this.route.snapshot.paramMap.get('pid');
    this.product_id = 2;
    //console.log(this.product_id);
    // this.company_id = +this.route.snapshot.paramMap.get('cid');
    this.company_id = 6;
  }

  ngOnInit() {
    this.getShipAddr();
    this.getCartList();
    this.getUser();
    this.addrId = localStorage.getItem("addrId");
    //console.log(this.addrId);

  }
// to get customer email add by simon 1/10/2019
  getUser(){
    this.authService.getCurrentUser().subscribe(
      res=>{
        this.userInfo = res.user;
      }
    )
  }

  private didRenderPaypal: boolean = false;

  ngAfterViewChecked() {
    if (this.paypaltotalprice) { this.configurePaypal(); }
  }

  configurePaypal() {
    if (!this.didRenderPaypal) {
      //console.log('paypal', value);
      var userId = 2;

      this.loadPaypalScript().then(() => {
        paypal.Button.render({
          style: {
            size: 'responsive',
            color: 'gold',
            shape: 'rect',
            label: 'checkout',
            tagline: 'true'
          },
          env: 'sandbox', // sandbox | production
          // Create a PayPal app: https://developer.paypal.com/developer/applications/create
          client: {
            sandbox: 'AcTTeXfkIBtIuudZj2P0ttRb5SkYnOZy4YxQ5mvI_8I6SbEp3-jKuXejNLn4SmKV4m63kGTDy50Er8wy',
            // production: environment.services.paypal.clientId
          },
          // Show the buyer a 'Pay Now' button in the checkout flow
          commit: true,

          // payment() is called when the button is clicked
          payment: (data, actions) => {

            // Make a call to the REST api to create the payment
            return actions.payment.create({
              payment: {
                transactions: [
                  {
                    amount: {
                      total:
                        // value,
                        // 12.98,
                        this.paypaltotalprice,
                      // document.getElementById('total').innerHTML,
                      currency: 'USD',
                    },
                  }
                ],
                redirect_urls: {
                  return_url: 'https://example.com',
                }
              }
            });
          },

          // onAuthorize() is called when the buyer approves the payment
          onAuthorize: (data, actions) => {
            // Make a call to the REST api to execute the payment
            return actions.payment.execute().then(
              () => {
                //console.log(data);
                window.alert('Payment Complete!');
                this.placeOrder();
              });
          }

        }, '#paypal-button-container');
      });
    }
  }

  private loadPaypalScript(): Promise<any> {
    this.didRenderPaypal = true;
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }

  onRereshCart($event) {
    this.getCartList();
  }

  check(code) {
    //console.log(this.discountArr);
    this.discountPrice = 0;
    loop: for (let i = 0; i < this.discountArr.length; i++) {
      for (let discObj of this.discountArr[i]) {
        if (code == discObj.key) {
          this.showDic = true;
          this.invalidCode = false;
          this.discount = (this.compTotalPriceArr[i].total_price * discObj.value).toFixed(0);
          this.compTotalPriceArr[i].discount = discObj.key;
          this.compTotalPriceArr[i].discount_total_product_price = this.discount;
          console.log(this.compTotalPriceArr);
          break loop;
        } else {
          //console.log('err');
          // this.showDic = false;
          this.invalidCode = true;
        }
      }
    }
    for (let compDisc of this.compTotalPriceArr) {
      if (compDisc.discount) {
        this.discountPrice = +this.discountPrice + +compDisc.discount_total_product_price;
        // this.paypaltotalprice = (this.constPaypaltotalprice - (compDisc.discount_total_product_price / 100)).toFixed(2);
      }
      console.log(this.discountPrice);
    }
    this.totaldiscountPrice = (this.itemsTotalPrice - (this.discountPrice / 100)).toFixed(2);
    if (this.totalShipFee) {
      this.paypaltotalprice = (+this.totaldiscountPrice + +this.totalShipFee / 100).toFixed(2);
    }
  }

  getCartList() {
    this.cartService.getMe().subscribe(
      (res) => {

        for (let i = 0; i < res.user.employed_companies.length; i++) {
          if (res.user.employed_companies[i].type == 0) {
            this.vb_id = res.user.employed_companies[i].id;
            //console.log(this.vb_id);
            this.cartService.getCartList(171, this.vb_id).subscribe(
              (res) => {
                //console.log(res);
                this.isLoading = false;
                console.log(res);
                this.companies = res.shop_companies;
                //console.log(this.companies);
                for (let i = 0; i < this.companies.length; i++) {
                  //console.log(this.compTotalPriceArr);
                  this.compTotalPriceArr[i] = new Object();
                  //console.log(this.compTotalPriceArr);
                  this.compTotalPriceArr[i].id = this.companies[i].id;
                  this.compTotalPriceArr[i].company_id = this.companies[i].company_id;
                  this.compTotalPriceArr[i].name = this.companies[i].name;
                  this.compTotalPriceArr[i].total_price = this.companies[i].total_price;
                  this.compTotalPriceArr[i].total_shipping_fee = this.companies[i].total_shipping_fee;
                  this.compTotalPriceArr[i].shop_order_warehouses = this.companies[i].shop_order_warehouses;
                  this.compTotalPriceArr[i].discount = null;
                  this.compTotalPriceArr[i].discount_total_product_price = null;
                  console.log(this.compTotalPriceArr);
                  this.cartService.getDiscount(this.companies[i].company_id).subscribe(
                    (res) => {
                      console.log(res);
                      this.discountArr[i] = res;
                      //console.log(this.discountArr);
                    }
                  )
                }
                this.orderid = res.id;
                this.totalPrice = res.total_price;
                //console.log(+this.totalPrice);
                this.itemsTotalPrice = (+this.totalPrice / 100).toFixed(2);
                // this.constPaypaltotalprice = this.paypaltotalprice;
                //console.log(+this.paypaltotalprice);
                // 
                let totalNumb = 0;
                for (let i = 0; i < res.shop_companies.length; i++) {
                  for (let j = 0; j < res.shop_companies[i].shop_order_warehouses.length; j++) {
                    return totalNumb = totalNumb + res.shop_companies[i].shop_order_warehouses[j].products.length
                  }
                }

                //console.log(totalNumb);
                // 
              }
            )
          }
        }
      }
    )
  }

  getShipAddr() {
    this.cartService.getMe().subscribe(
      (res) => {
        for (let i = 0; i < res.user.employed_companies.length; i++) {
          if (res.user.employed_companies[i].type == 0) {
            this.vb_id = res.user.employed_companies[i].id;
            //console.log(this.vb_id);
            this.addrList = res.user.employed_companies[i].shipping_addresses;
            //console.log(this.addrList);
            if (res.user.employed_companies[i].default_shipping_address && res.user.employed_companies[i].default_shipping_address.id == this.addrId) {
              this.shipAddr = res.user.employed_companies[i].default_shipping_address;
              //console.log(this.shipAddr);
            } else {
              for (let i = 0; i < this.addrList.length; i++) {
                if (this.addrList[i].id == this.addrId) {
                  this.shipAddr = this.addrList[i];
                  //console.log(this.shipAddr);
                }
              }
            }
            console.log(this.shipAddr);
            this.toState = this.shipAddr.state;
            this.toZip = this.shipAddr.zipcode;
            this.toCoun = this.shipAddr.country;
          }
        }
      }
    )
  }

  placeOrder() {
    //console.log("paypal complete!");
    // let shopComp = new Array();
    // for (let compDisc of this.compTotalPriceArr) {
    //   if (compDisc.discount) {
    //     shopComp.push(compDisc);
    //   }
    // }
    // console.log(shopComp);

    // console.log(this.compTotalPriceArr);
  
    let value = {
      "id": this.orderid,
      "billing_address_id": 1,
      // "total_price": this.totalPrice,
      "total_price": this.paypaltotalprice * 100,
      "discount_total_price": this.paypaltotalprice * 100,
      // "shop_companies": shopComp
      "shop_companies": this.compTotalPriceArr
    };



    this.cartService.placeOrder(value).subscribe(
      (res) => {
        console.log('return data');
        this.sendConfirmOrderInfo();// add by simon 1/10/2019
        this.router.navigateByUrl(`/shop-order/orders`);
      }
    )

  }
  // to get order infomation, send emial to customer and vendor add by simon 1/10/2019

  sendConfirmOrderInfo(){
    console.log('-----------begin------------------------------');
    this.shopService.getShopOrderDetail(171, this.orderid).subscribe(
      res=>{
        this.orderInformation = res;
        console.log(res);
        // get customer email
        let emailList =["info@orcasmart.com"];
        console.log(this.userInfo.email);
        emailList.push(this.userInfo.email)
        let value = {
          "emails":emailList,
          "content":"Thank you for shopping with us. You ordered" + this.orderInformation.total_products_count +   "items, We'll send a confirmation when your items ship.",
          "subject":"Order Confirmation",
          "items" : this.orderInformation
          }
        
        console.log(value);
        this.commonService.sendConfirmEmailToCustomer(value).subscribe(
          res=>{
            console.log('email send successful');
          },
          eer=>{
            console.log('email deliver failed');
          }
        )
        console.log('--------------end------------------------------');
      }
    )
  }

  updateCart(compid, compyTotal, warehouse, item, orderi, compj, itemk) {
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
                    "id": warehouse.id,
                    "shipping_fee": null,
                    "product": {
                      "id": item.id,
                      "quantity": this.newQty,
                      "unit_price": this.unitPrice
                    }
                  }
                }
              }

              // item.quantity = this.newQty;
              // item.unit_price = this.unitPrice;
              // warehouse.total_price = compyTotal;
              // this.companies.total_price = this.totalPrice;
              // this.isLoading = false;

              //console.log(this.updateItem);

              this.cartService.updateCart(this.orderid, this.updateItem).subscribe(
                res => {
                  console.log(res);
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

  calcShipping(id, warehouse, fromState, fromZip, fromCoun) {
    let unitWgt: number, itemWgt: number, totalWgt: number = 0, upsWgt: number, upsbody150, onePkgPrice;
    this.pkgNumb = 0;
    upsbody150 = {
      // "UPSSecurity": {
      //   "UsernameToken": {
      //     "Username": "upcpackaging",
      //     "Password": "Glopak888"
      //   },
      //   "ServiceAccessToken": {
      //     "AccessLicenseNumber": "8D4FDA42D19ED848"
      //   }
      // },
      // "RateRequest": {
      //   "Request": {
      //     "RequestOption": "Rate",
      //     "TransactionReference": {
      //       "CustomerContext": "Thank you"
      //     }
      //   },
      //   "Shipment": {
      "Shipper": {
        "Name": "UPS",
        "ShipperNumber": "X9X028",
        "Address": {
          "AddressLine": [
            "Address Line",
            "Address Line ",
            "Address Line "
          ],
          "City": "",
          "StateProvinceCode": "",
          "PostalCode": fromZip,
          // "CountryCode": fromCoun
          "CountryCode": "US"
        }
      },
      "ShipTo": {
        "Name": "",
        "Address": {
          "AddressLine": [
            "Address Line ",
            "Address Line ",
            "Address Line "
          ],
          "City": "",
          "StateProvinceCode": this.toState,
          "PostalCode": this.toZip,
          // "CountryCode": this.toCoun
          "CountryCode": "US"
        }
      },
      "ShipFrom": {
        "Name": "UPS",
        "Address": {
          "AddressLine": [
            "Address Line ",
            "Address Line ",
            "Address Line "
          ],
          "City": "",
          "StateProvinceCode": fromState,
          "PostalCode": fromZip,
          // "CountryCode": fromCoun
          "CountryCode": "US"
        }
      },
      "Service": {
        "Code": id,
        "Description": "Service Code Description"
      },
      "Package": {
        "PackagingType": {
          "Code": "02",
          "Description": "Rate"
        },
        "Dimensions": {
          "UnitOfMeasurement": {
            "Code": "IN",
            "Description": "inches"
          },
          "Length": "0",
          "Width": "0",
          "Height": "0"
        },
        "PackageWeight": {
          "UnitOfMeasurement": {
            "Code": "Lbs",
            "Description": "pounds"
          },
          "Weight": "150"
        }
      },
      "ShipmentRatingOptions": {
        "NegotiatedRatesIndicator": "true"
      }
      //   }
      // }
    }

    console.log(upsbody150);

    this.upsService.getShippingFee(upsbody150)
      .subscribe(
        res => {
          console.log(res.RatedShipment);
          // onePkgPrice = +res.RateResponse.RatedShipment.TotalCharges.MonetaryValue;
          onePkgPrice = +res.RatedShipment.TotalCharges.MonetaryValue;
          console.log(onePkgPrice);

          console.log(warehouse);
          warehouse.shippCodeId = id;
          warehouse.products.forEach(item => {
            // console.log(item.unit_weight.split('').slice(-2).join(''));
            if (item.unit_weight.split('').slice(-2).join('') == "oz") {
              unitWgt = +(item.unit_weight.split('').slice(0, -2).join('')) * 0.0625;
            } else {
              unitWgt = +(item.unit_weight.split('').slice(0, -2).join(''));
            }
            // console.log(unitWgt);
            itemWgt = unitWgt * +item.quantity;
            // console.log(itemWgt);
            totalWgt = totalWgt + itemWgt;
            // console.log(totalWgt);
          });
          // console.log(totalWgt);
          if (totalWgt > 150) {
            this.pkgNumb = Math.floor(totalWgt / 150);
            console.log(this.pkgNumb);
            warehouse.pkgNumb = this.pkgNumb;
            console.log(warehouse);
            upsWgt = totalWgt % 150;
            console.log(upsWgt);
          } else {
            upsWgt = totalWgt;
          }

          console.log(this.companies);

          this.upsbody = {
            // "UPSSecurity": {
            //   "UsernameToken": {
            //     "Username": "upcpackaging",
            //     "Password": "Glopak888"
            //   },
            //   "ServiceAccessToken": {
            //     "AccessLicenseNumber": "8D4FDA42D19ED848"
            //   }
            // },
            // "RateRequest": {
            //   "Request": {
            //     "RequestOption": "Rate",
            //     "TransactionReference": {
            //       "CustomerContext": "Thank you"
            //     }
            //   },
            //   "Shipment": {
            "Shipper": {
              "Name": "UPS",
              "ShipperNumber": "X9X028",
              "Address": {
                "AddressLine": [
                  "Address Line",
                  "Address Line ",
                  "Address Line "
                ],
                "City": "",
                "StateProvinceCode": "",
                "PostalCode": fromZip,
                // "CountryCode": fromCoun
                "CountryCode": "US"
              }
            },
            "ShipTo": {
              "Name": "",
              "Address": {
                "AddressLine": [
                  "Address Line ",
                  "Address Line ",
                  "Address Line "
                ],
                "City": "",
                "StateProvinceCode": this.toState,
                "PostalCode": this.toZip,
                // "CountryCode": this.toCoun
                "CountryCode": "US"
              }
            },
            "ShipFrom": {
              "Name": "UPS",
              "Address": {
                "AddressLine": [
                  "Address Line ",
                  "Address Line ",
                  "Address Line "
                ],
                "City": "",
                "StateProvinceCode": fromState,
                "PostalCode": fromZip,
                // "CountryCode": fromCoun
                "CountryCode": "US"
              }
            },
            "Service": {
              "Code": id,
              "Description": "Service Code Description"
            },
            "Package": {
              "PackagingType": {
                "Code": "02",
                "Description": "Rate"
              },
              "Dimensions": {
                "UnitOfMeasurement": {
                  "Code": "IN",
                  "Description": "inches"
                },
                "Length": "0",
                "Width": "0",
                "Height": "0"
              },
              "PackageWeight": {
                "UnitOfMeasurement": {
                  "Code": "Lbs",
                  "Description": "pounds"
                },
                "Weight": upsWgt.toString()
              }
            },
            "ShipmentRatingOptions": {
              "NegotiatedRatesIndicator": "true"
            }
            //   }
            // }
          }

          console.log(this.upsbody);

          this.upsService.getShippingFee(this.upsbody)
            .subscribe(
              res => {
                let eachShippFee = 0, unitPkgFee = 0;
                let i = 0;
                let j = 0;
                let n = 0;
                // console.log(res.RateResponse.RatedShipment.TotalCharges.MonetaryValue);
                console.log(res.RatedShipment);

                if (this.pkgNumb) {
                  unitPkgFee = +onePkgPrice * +this.pkgNumb;
                  // console.log(unitPkgFee);
                }

                // warehouse.shipping_fee = ((+res.RateResponse.RatedShipment.TotalCharges.MonetaryValue + unitPkgFee) * 100).toFixed(0);
                warehouse.shipping_fee = ((+res.RatedShipment.TotalCharges.MonetaryValue + unitPkgFee) * 100).toFixed(0);
                // console.log(warehouse.shipping_fee);
                this.companies.forEach(company => {
                  let compTotalShippingFee = 0;
                  company.shop_order_warehouses.forEach(warehouse => {
                    i = i + 1;
                    // console.log(i);
                    if (warehouse.shipping_fee) {
                      eachShippFee = eachShippFee + +warehouse.shipping_fee;
                      compTotalShippingFee = +compTotalShippingFee + +warehouse.shipping_fee;
                      j = j + 1;
                      // console.log(j);
                    }
                  })
                  if (i == j) {
                    this.compTotalPriceArr[n].total_shipping_fee = compTotalShippingFee;
                    console.log(this.compTotalPriceArr);
                    n++;
                  }
                });
                if (i == j) {
                  this.totalShipFee = eachShippFee.toFixed(2);
                  // console.log(this.totalShipFee);
                  if (this.totaldiscountPrice) {
                    this.paypaltotalprice = (+this.totaldiscountPrice + +this.totalShipFee / 100).toFixed(2);
                  } else {
                    this.paypaltotalprice = (+this.itemsTotalPrice + +this.totalShipFee / 100).toFixed(2);
                  }
                }
              }
            )

        })


  }



  // reChooseWhs(shopCompany) {
  //   //console.log(shopCompany);
  //   let shopCompanyId = "";
  //   if(shopCompany.shop_order_warehouses.length == 1 && shopCompany.shop_order_warehouses[0].products.length == 1){
  //     shopCompanyId = "";
  //   } else {
  //     shopCompanyId = shopCompany.id;
  //   }
  //   let warehouseId, warehouseName, shopWhsId, shopProductId, cart;
  //   this.cartService.deleteItemfromCart(this.orderid, shopCompany.id, shopCompany.warehouse.id, shopCompany.item.id).subscribe(
  //     res => {
  //       warehouseId = this.warehouses[0].address.id;
  //       warehouseName = this.warehouses[0].name;
  //       shopWhsId = "";
  //       shopProductId = "";
  //       //console.log(this.warehouses[0]);
  //       //console.log(this.warehouseId);
  //       for(let i = 0; i<shopCompany.shop_order_warehouses.length; i++){
  //         if(warehouseId == shopCompany.shop_order_warehouses[i].address.id && shopCompany.shop_order_warehouses.length > 1 && shopCompany.shop_order_warehouses[0].products.length > 1){
  //           shopWhsId = shopCompany.shop_order_warehouses[i].id;
  //         }
  //       }

  //       cart = {
  //         "shipping_address_id": localStorage.getItem('addrId'),
  //         "total_price": this.totalPrice,
  //         "shop_company":
  //         {
  //           "id": shopCompanyId,
  //           "name": shopCompany.name,
  //           "total_price": shopCompany.company.total_price,
  //           "company_id": this.company_id,
  //           "shop_order_warehouse":
  //           {
  //             "id": shopWhsId,
  //             "name": warehouseName,
  //             "shipping_fee": "60",
  //             "address_id": warehouseId,
  //             "product": {
  //               "id": shopProductId,
  //               "company_id": this.company_id,
  //               "company_product_id": this.product_id,
  //               "unit_weight": "1lb",
  //               "quantity": +shopCompany.warehouse.products.item.quantity,
  //               "unit_price": shopCompany.warehouse.products.item.unit_price
  //             }
  //           }
  //         }
  //       }

  //       //console.log(cart);

  //       this.cartService.addToCart(92, this.vb_id, cart)
  //         .subscribe(
  //           res => {
  //             //console.log(res);
  //             // this.refreshCart.emit();
  //             //console.log('!');
  //             this.cartService.getCartList(92, this.vb_id).subscribe(
  //               res => {
  //                 //console.log(res);
  //               }
  //             )
  //             this.isLoading = false;
  //           }
  //         )
  //     }
  //   )

  // }


}
