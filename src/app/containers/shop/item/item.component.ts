// import { } from '@types/googlemaps';
import { Component, OnInit, ViewChild, OnDestroy, OnChanges } from '@angular/core';
// transfer parameter id from product-list to product-info usign router
import { ActivatedRoute, Router, NavigationStart, RoutesRecognized } from '@angular/router';
import { InventoryService } from '../../../core/services/inventory.service';
import { UpsService } from '../../../core/services/ups.service';
import { ShoppingCartService } from "../../../core/services/shopping-cart.service";
import { CartService } from "../../../core/services/cart.service";
import { Product } from "../../../core/models/product.model";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Warehouse } from 'app/core/models/warehouse';
import { Subscription } from 'rxjs';
import { PARAMETERS } from '@angular/core/src/util/decorators';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  markers: any[];
  infoWindows = [];
  ifFullScreen = false;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  addressArr = [];
  selectedImg = '';
  modalOpen: boolean = false;
  product_id: number;
  company_id: number;
  product;
  priceRange;
  price;
  cartPrice;
  qtyRange;
  cartproduct: Product;
  multiPictures = ["assets/images/bottle.png"];
  selectedAttachmentIndex: number;
  show;
  nonCategoryAttachArr = [];
  isLoading: boolean = false;
  category: string = '';
  selectedAttachment;
  showNum: number = 2;
  qtyArr = [];
  itemTotal;
  totalPrice;
  Qty: string = "1";
  Qty1: string = "2";
  Qty0: string = "1";
  totalQty;
  success = false;
  warehouses;
  warehouseName = "";
  warehouseId;
  upsbody;
  showMap: boolean = false;
  selectedWarehouse: Warehouse = null;
  selectedWarehouseIndex: number;
  selectedDestination;
  searchAddress: '';
  destinationArr;
  vb_id;
  cart;
  shipAddrId = "";
  companyName;
  shopProductId = "";
  shopWhsId = "";
  shopCompanyId = "";
  initPrice = 0;
  initQty = 0;
  maxQty;
  qtyTotal;
  compTotalPrice = 0;
  qtyAlert = false;
  unitWeight;
  subscription: Subscription;
  cartNum;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private upsService: UpsService,
    private shoppingCartService: ShoppingCartService,
    private cartService: CartService,
    public dialog: MatDialog,
  ) {

    
    this.route.params.subscribe(params => {
      this.product_id = +this.route.snapshot.paramMap.get('pid');
      this.company_id = +this.route.snapshot.paramMap.get('cid');
      this.init();
      console.log(this.product_id, this.company_id);
    });

    // this.router.events.subscribe((data: any) => {
    //     console.log(data.snapshot.data);
    //     this.needCart = data.snapshot.data.needCart;
    //     console.log(this.needCart);
    //     // if(data.snapshot.data.needCart != null) {
    //     //   this.needCart = data.snapshot.data.needCart;
    //     // }
    //     // console.log(this.needCart);
    //     //
    // })

  }

  ngOnInit() {
      
  }

  init() {
    this.getProduct();
    this.getCartList();
    this.getCompany();
  }

  getProduct() {
    this.isLoading = true;
    this.inventoryService.getProductInfo(this.company_id, this.product_id).subscribe(
      (res) => {
        this.isLoading = false;
        this.product = res;
        //console.log(this.product.category);
        console.log(this.product);
        this.unitWeight = this.product.unit_weight;
        // console.log(this.unitWeight);

        if (res.warehouses.length > 0) {
          this.warehouses = res.warehouses;
          this.warehouseName = this.warehouses[0].name
          this.warehouseId = this.warehouses[0].address.id
          //console.log(this.warehouses);
        }

        this.product.company_defined_columns = this.changeDefineColumnFormat(this.product.company_defined_columns);
        // this.setGoogleMap();
        if (this.warehouses) {
          for (let i = 0; i < this.warehouses.length; i++) {
            this.qtyArr.push(this.warehouses[i].amount);
            //console.log(this.qtyArr);
          }
          this.totalQty = this.qtyArr.reduce((a, b) => a + b, 0);
        }
      }
    )

    this.inventoryService.getRetailPriceTable(this.company_id, this.product_id).subscribe(
      (res) => {
        this.priceRange = res;
        this.price = res[0].price;
        this.qtyRange = res[0].max_qty;
        // console.log(res);
        //console.log(this.qtyRange);
        //console.log(this.priceRange.length);
      }
    )
    // console.log("vb_id " + this.vb_id);
  }

  getRange(range, i) {
    if (i == 0) {
      return 'Under ' + range.max_qty;
    }
    return range.min_qty + '-' + range.max_qty;
  }

  getCartList() {
    this.cartService.getMe().subscribe(
      (res) => {
        //console.log(res);
        for (let i = 0; i < res.user.employed_companies.length; i++) {
          if (res.user.employed_companies[i].type == 0) {
            this.vb_id = res.user.employed_companies[i].id;
            //console.log(this.vb_id);
            this.cartService.getCartList(171, this.vb_id).subscribe(
              (res) => {
                //console.log(res);
                // if(res.total_price){
                this.totalPrice = res.total_price;
                this.cartService.getCartNumber(this.vb_id).subscribe(
                  res => {
                      this.cartNum = res;
                      console.log(this.cartNum);
                      return res;
                  }
                );
                //console.log(this.totalPrice);
                // }
                // for(let i=0; i<res.shop_companies.length;i++){
                //   for(let j=0; j<res.shop_companies[i].shop_order_warehouses.length; j++){
                //     for(let m=0; m<res.shop_companies[i].shop_order_warehouses[j].products.length; m++){
                //       if(res.shop_companies[i].shop_order_warehouses[j].products[m].company_id == this.company_id && res.shop_companies[i].shop_order_warehouses[j].products[m].company_product_id == this.product_id){
                //         this.shopProductId = res.shop_companies[i].shop_order_warehouses[j].products[m].id;
                //         this.shopWhsId = res.shop_companies[i].shop_order_warehouses[j].id;
                //         this.shopCompanyId = res.shop_companies[i].id;
                //         this.initPrice = res.shop_companies[i].total_price;
                //         //console.log(this.initPrice);
                //         this.initQty = res.shop_companies[i].shop_order_warehouses[j].products[m].quantity;
                //         //console.log(this.initQty);
                //       }
                //     }
                //   }
                // }
              }
            );

          }
        }
      }
    )
  }

  getCompany() {
    this.cartService.getCompany(this.company_id).subscribe(
      res => {
        console.log(res);
        this.companyName = res.name;
      }
    )
  }

  switchShowMap() {
    this.showMap = (!this.showMap);
  }

  onKey(event) {
    this.Qty = event.target.value;
    // this.Qty1 = event.target.value;
    // this.Qty2 = event.target.value;
    //console.log('!', this.Qty);

    // for (let i = this.priceRange.length-1; 0 < i < this.priceRange.length; i--) {
    //     //console.log('!');
    //     if (+this.Qty >= this.priceRange[i].min_qty) {
    //     this.price = this.priceRange[i].price;
    //     //console.log('!',this.price);
    //   }
    // }

    // if (+this.Qty > this.qtyRange) {
    //   this.price = this.priceRange[this.priceRange.length - 1].price;
    // } else {
    //   this.price = this.priceRange[this.priceRange.length - 2].price;
    // }

    for (let i = 0; i < this.priceRange.length; i++) {
      if (+this.Qty <= this.priceRange[i].max_qty) {
        this.price = this.priceRange[i].price;
        //console.log("!", this.unitPrice);
        break;
      }
    }

    //   //console.log(this.warehouses);

    // for(let i=0; i<this.warehouses.length; i++){
    //     if(+this.Qty > this.warehouses[i].amount ){
    //       this.qtyArr[i+1] = this.warehouses[i+1].amount-this.warehouses[i].amount;
    //     //console.log(this.totalQty);
    //   }
    // }

    this.maxQty = this.priceRange[this.priceRange.length - 1].max_qty;
    if (+this.Qty > this.maxQty) {
      this.Qty = this.maxQty;
      this.qtyAlert = true;
      //console.log(this.Qty);
    }
  }

  addProductToCart() {
    this.cartproduct = new Product();
    this.cartproduct.id = this.company_id.toString() + "/" + this.product_id.toString();
    this.cartproduct.name = this.product.name;
    //console.log(this.cartproduct.id);
    this.cartproduct.description = this.product.images[0].url;
    this.cartproduct.price = +this.price;
    // this.cartproduct.ingredients = this.product.category.name;
    this.cartproduct.ingredients = [];
    //console.log('!', this.cartproduct);
    //console.log('!', typeof (+this.Qty));
    this.shoppingCartService.addItem(this.cartproduct, +this.Qty);
    this.success = true;
    this.dialog.open(AddToCartDialog);
  }

  changeDefineColumnFormat(obj) {
    let res = [];
    for (var prop in obj) {
      res.push({
        name: prop,
        value: obj[prop]
      })
    }
    return res;
  }


  closeModal() {
    this.modalOpen = false;
    this.selectedImg = '';
    this.show = '';
    this.selectedAttachment = '';
  }

  openModal(url) {
    this.selectedImg = url;
    this.modalOpen = true;
  }


  switchShowBtn() {
    if (this.showNum == 2) {
      this.showNum = 0;
    } else {
      this.showNum = 2;
    }
  }

  getDistance(warehouse) {
    return (warehouse.distance * 0.00062137).toFixed(1) + ' mile';
  }

  setGoogleMap() {
    this.markers = [];
    let lati, long, center;
    let defaultCenter = new google.maps.LatLng(40.7128, 74.0060);

    if (!this.warehouses || this.warehouses.length === 0) {
      center = defaultCenter;
    } else {
      lati = this.warehouses[0].address.latitude;
      long = this.warehouses[0].address.longitude;
      center = new google.maps.LatLng(lati, long);
    }

    var mapProp = {
      center: center,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < this.warehouses.length; i++) {

      if (this.warehouses[i].address && this.warehouses[i].address.latitude && this.warehouses[i].address.longitude) {
        this.addressArr.push(
          `${this.warehouses[i].address.street1},
          ${this.warehouses[i].address.city},
          ${this.warehouses[i].address.state},
          ${this.warehouses[i].address.zipcode}`);
        let tempPoint = new google.maps.LatLng(
          this.warehouses[i].address.latitude,
          this.warehouses[i].address.longitude
        );
        let index = (i + 1).toString();
        let tempMarker = new google.maps.Marker({
          position: tempPoint,
          // label:index,
          animation: google.maps.Animation.DROP,
        });



        //set each info window
        let infowindow = new google.maps.InfoWindow({
          content: `
            <div style="width:250px !important;">
              ${this.warehouses[i].address.street1},
              ${this.warehouses[i].address.city},
              ${this.warehouses[i].address.state},
              ${this.warehouses[i].address.zipcode}
            </div>
            <div>
            Tel : ${this.warehouses[i].phone_number}
            </div>
            <div>
            <b>In Stock : ${this.warehouses[i].amount}</b>
            </div>
          `
        });

        this.infoWindows.push(infowindow);

        tempMarker.setMap(this.map);
        this.markers.push(tempMarker);
        this.selectInMap(this.infoWindows, this.markers, i, this.warehouses);


        // tempMarker.
        bounds.extend(tempMarker.getPosition());
      }
    }

    this.map.fitBounds(bounds);
  }

  selectWarehouse(warehouse, i) {
    this.selectedWarehouse = warehouse;
    this.selectedWarehouseIndex = i;
    var icon = {
      url: 'assets/images/icons/arrow_marker.png', // url
      //scaledSize: new google.maps.Size(32, 32), // scaled size
      origin: new google.maps.Point(-8, 0),
    };

    this.markers[i].setIcon(icon);

    //reset previous marker
    this.markers.forEach((marker, index) => {
      if (index !== this.selectedWarehouseIndex) {
        marker.setIcon();
        this.infoWindows[index].close();
      }
    })

    //set content in infowindow for marker
    this.infoWindows[i].open(this.map, this.markers[i]);
    this.map.setCenter(new google.maps.LatLng(this.warehouses[i].address.latitude, this.warehouses[i].address.longitude));
    this.map.setZoom(8);
    if (this.selectWarehouse && this.selectedDestination) {
      this.getPath(this.selectedDestination);
    }
  }

  selectInMap(infoWindows, markers, i, warehouses) {
    google.maps.event.clearListeners(markers[i], 'click');
    markers[i].addListener('click', () => {
      this.map.setZoom(12);
      this.map.setCenter(markers[i].getPosition());
      infoWindows[i].open(markers[i].get('map'), markers[i]);
      this.selectedWarehouse = warehouses[i];

      // var element_to_scroll_to = document.getElementById(i);
      // element_to_scroll_to.scrollIntoView();

      var icon = {
        url: 'assets/images/icons/arrow_marker.png', // url
        //scaledSize: new google.maps.Size(32, 32), // scaled size
        origin: new google.maps.Point(-8, 0),
      };

      this.markers[i].setIcon(icon);
      //  reset previous marker
      markers.forEach((eachmarker, index) => {
        if (index !== i) {
          eachmarker.setIcon();
          infoWindows[index].close();
        }
      })
      // document.getElementById(i).focus();

      if (this.selectWarehouse && this.selectedDestination) {
        this.getPath(this.selectedDestination);
      }
    });
  }

  reset() {
    this.markers = [];
    this.setGoogleMap();
  }

  getPath(address) {
    // this.setDestinationOnMap(address);
    // let directionsService = new google.maps.DirectionsService;
    // let directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.set('directions', null);
    this.directionsDisplay.setMap(this.map);
    if (this.selectedWarehouse) {
      let start = new google.maps.LatLng(
        this.selectedWarehouse.address.latitude,
        this.selectedWarehouse.address.longitude
      );
      this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay, start, address.formatted_address);
    }
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay, start, end) {
    directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  onSearch() {
    this.destinationArr = null;
    this.selectedDestination = '';
    this.inventoryService.searchPathOnGoogleMap(this.searchAddress).subscribe(
      (res) => {
        this.destinationArr = res;
        if (this.destinationArr.results.length == 1) {
          this.selectedDestination = this.destinationArr.results[0];
          this.setDestinationOnMap(this.selectedDestination);
          if (this.selectWarehouse && this.selectedDestination) {
            this.getPath(this.selectedDestination);
          }
        }
      }
    )
  }

  setDestinationOnMap(address) {
    // this.reset();
    this.selectedDestination = address;
    let lat = address.geometry.location.lat;
    let lng = address.geometry.location.lng;
    let tempPoint = new google.maps.LatLng(
      lat,
      lng
    );
    let tempMarker = new google.maps.Marker({
      position: tempPoint,
      // label:index,
      animation: google.maps.Animation.DROP,
    });

    let infowindow = new google.maps.InfoWindow({
      content: `
        <div style="width:250px !important;">
          Your Destination: ${address.formatted_address}
        </div>
      `
    });

    var icon = {
      url: 'assets/images/icons/arrow_marker.png', // url
      //scaledSize: new google.maps.Size(32, 32), // scaled size
      origin: new google.maps.Point(-8, 0),
    };
    tempMarker.setIcon(icon);
    tempMarker.setMap(this.map);
    // this.markers.push(tempMarker);
    this.selectedDestination = address;
    var geocoder = new google.maps.Geocoder;
    var service = new google.maps.DistanceMatrixService;
    if (!this.selectedWarehouse) {
      this.map.setCenter(new google.maps.LatLng(lat, lng));
      this.map.setZoom(8);
    }
    this.calculateDistance(address, geocoder, service);
  }

  calculateDistance(destination, geocoder, service) {
    let destAddress = destination.formatted_address;

    let warehouseLocations = this.warehouses.map((warehouse) => {
      return new google.maps.LatLng(
        warehouse.address.latitude,
        warehouse.address.longitude
      )
    });
    let destinationAddress = destination.formatted_address;

    service.getDistanceMatrix({
      origins: warehouseLocations,
      destinations: [destinationAddress],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, (response, status) => {
      if (status !== 'OK') {
        alert('Error was: ' + status);
      } else {
        var originList = response.originAddresses;
        var destinationList = response.destinationAddresses;
        //console.log(response);
        for (var i = 0; i < originList.length; i++) {
          var results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++) {
            this.warehouses[i]['distance'] = results[j].distance.value;
            this.markers[i]['distance'] = results[j].distance.value;
            this.infoWindows[i]['distance'] = results[j].distance.value;
            this.warehouses[i]['duration'] = results[j].duration.text;
          }
        }

        this.warehouses.sort((a, b) => {
          return a['distance'] - b['distance'];
        });

        this.markers.sort((a, b) => {
          return a['distance'] - b['distance'];
        });
        this.infoWindows.sort((a, b) => {
          return a['distance'] - b['distance'];
        })

        for (var i = 0; i < this.warehouses.length; i++) {
          this.selectInMap(this.infoWindows, this.markers, i, this.warehouses);
        }
      }

    });
  }

  addToCart() {
    this.isLoading = true;
    //console.log(this.shopProductId);
    this.initPrice = 0;
    this.initQty = 0;
    this.cartService.getMe().subscribe(
      (res) => {
        //console.log(res);
        for (let i = 0; i < res.user.employed_companies.length; i++) {
          if (res.user.employed_companies[i].type == 0) {
            this.vb_id = res.user.employed_companies[i].id;
            //console.log(this.vb_id);
            this.cartService.getCartList(171, this.vb_id).subscribe(
              (res) => {
                //console.log(res);
                // if(res.total_price){
                this.totalPrice = res.total_price;
                //console.log(this.totalPrice);
                // }
                for (let i = 0; i < res.shop_companies.length; i++) {
                  if (res.shop_companies[i].company_id == this.company_id) {
                    for (let j = 0; j < res.shop_companies[i].shop_order_warehouses.length; j++) {
                      for (let m = 0; m < this.warehouses.length; m++) {
                        // for (let n = 0; n < 2; n++){
                        if (res.shop_companies[i].shop_order_warehouses[j].address.id !== this.warehouses[m].address.id) {
                          this.shopCompanyId = res.shop_companies[i].id;
                          //console.log(this.shopCompanyId);
                          this.compTotalPrice = res.shop_companies[i].total_price;
                          //console.log(this.compTotalPrice);
                        } else {
                          for (let k = 0; k < res.shop_companies[i].shop_order_warehouses[j].products.length; k++) {
                            if (res.shop_companies[i].shop_order_warehouses[j].products[k].company_id == this.company_id && res.shop_companies[i].shop_order_warehouses[j].products[k].company_product_id == this.product_id) {
                              this.shopCompanyId = res.shop_companies[i].id;
                              this.shopWhsId = res.shop_companies[i].shop_order_warehouses[j].id;
                              this.shopProductId = res.shop_companies[i].shop_order_warehouses[j].products[k].id;
                              this.initPrice = res.shop_companies[i].shop_order_warehouses[j].products[k].quantity * res.shop_companies[i].shop_order_warehouses[j].products[k].unit_price;
                              //console.log(this.initPrice);
                              this.initQty = res.shop_companies[i].shop_order_warehouses[j].products[k].quantity;
                              //console.log(this.initQty);
                              this.compTotalPrice = res.shop_companies[i].total_price;
                              console.log(this.compTotalPrice);
                            } else {
                              this.shopCompanyId = res.shop_companies[i].id;
                              this.shopWhsId = res.shop_companies[i].shop_order_warehouses[j].id;
                              this.compTotalPrice = res.shop_companies[i].total_price;
                              //console.log(this.compTotalPrice);
                            }
                          }
                        }
                        // }
                      }
                    }
                  }
                }
                this.qtyTotal = +this.Qty + +this.initQty;

                if (this.qtyTotal > this.priceRange[this.priceRange.length - 1].max_qty) {
                  this.qtyTotal = this.priceRange[this.priceRange.length - 1].max_qty;
                  this.cartPrice = this.priceRange[this.priceRange.length - 1].price;
                }

                for (let i = 0; i < this.priceRange.length; i++) {
                  if (this.qtyTotal <= this.priceRange[i].max_qty) {
                    this.cartPrice = this.priceRange[i].price;
                    //console.log("!", this.unitPrice);
                    break;
                  }
                }

                this.itemTotal = +this.qtyTotal * +this.cartPrice;
                this.totalPrice = +this.totalPrice - +this.initPrice + +this.itemTotal;
                this.compTotalPrice = +this.compTotalPrice - +this.initPrice + +this.itemTotal;
                this.cart = {
                  "shipping_address_id": this.shipAddrId,
                  "total_price": this.totalPrice,
                  "shop_company":
                    {
                      "id": this.shopCompanyId,
                      "name": this.companyName,
                      "total_price": this.compTotalPrice,
                      "company_id": this.company_id,
                      "shop_order_warehouse":
                        {
                          "id": this.shopWhsId,
                          "name": this.warehouseName,
                          "shipping_fee": null,
                          "address_id": this.warehouseId,
                          "product": {
                            "id": this.shopProductId,
                            "company_id": this.company_id,
                            "company_product_id": this.product_id,
                            "unit_weight": this.unitWeight,
                            "quantity": +this.qtyTotal,
                            "unit_price": this.cartPrice
                          }
                        }

                    }
                }
                this.cartService.addToCart(171, this.vb_id, this.cart)
                  .subscribe(
                    res => {
                      //console.log(res);
                      this.isLoading = false;
                      this.success = true;
                      this.dialog.open(AddToCartDialog);
                      this.cartService.getCartNumber(this.vb_id).subscribe(
                        res => {
                          console.log(res);
                          document.getElementById('cart_number').innerHTML = res;
                        }
                      );
                    }
                  )

              }
            )
          }
        }
      }
    )


  }


}

@Component({
  selector: 'addedToCartDialog',
  templateUrl: 'added-to-cart-dialog.html',
})
export class AddToCartDialog {

  constructor(
    public dialogRef: MatDialogRef<AddToCartDialog>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}