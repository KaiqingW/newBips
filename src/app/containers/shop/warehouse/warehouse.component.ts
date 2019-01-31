import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { InventoryService } from '../../../core/services/inventory.service';
import { UpsService } from '../../../core/services/ups.service';
import { CartService } from "../../../core/services/cart.service";
import { Product } from "../../../core/models/product.model";
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit, OnChanges {

  @Input() companyId;
  @Input() productId;
  @Input() itemQty;
  @Input() totalPrice;
  @Input() shopOrderId;
  @Input() shopCompany;
  @Input() shopWhsId;
  @Input() shopProductId;
  @Input() compTotalPrice;
  @Input() cartPrice;
  @Output() refreshCart = new EventEmitter<any>();
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
  isLoading: boolean = false;
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
  selectedWarehouse = null;
  selectedWarehouseIndex: number;
  selectedDestination;
  searchAddress: '';
  destinationArr;
  cartItems = [];
  vb_id;
  addrId;
  addrList;
  shipAddr;
  cart;
  shopCompanyId;
  warehouseId;
  warehouseName;
  chooseWhs = false;

  constructor(
    private inventoryService: InventoryService,
    private upsService: UpsService,
    private cartService: CartService,
    public dialog: MatDialog,
  ) {

  }

  ngOnChanges() {
    this.product_id = this.productId;
    //console.log(this.product_id);
    this.company_id = this.companyId;
    // this.itemQty;
  }

  ngOnInit() {
    this.getShipAddr();
    this.getProduct();
    this.addrId = localStorage.getItem("addrId");
    //console.log(this.addrId);
  }

  getDistance(warehouse) {
    return (warehouse.distance * 0.00062137).toFixed(1) + ' mile';
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

  getProduct() {
    this.isLoading = true;
    this.inventoryService.getProductInfo(this.company_id, this.product_id).subscribe(
      (res) => {
        this.product = res;
        //console.log(this.product.category);
        //console.log(this.product);
        this.warehouses = res.warehouses;
        this.selectedWarehouse = this.warehouses[0];
        //console.log(this.warehouses);
        this.product.company_defined_columns = this.changeDefineColumnFormat(this.product.company_defined_columns);
        this.setGoogleMap();
        for (let i = 0; i < this.warehouses.length; i++) {
          this.qtyArr.push(this.warehouses[i].amount);
          //console.log(this.qtyArr);
        }
        this.totalQty = this.qtyArr.reduce((a, b) => a + b, 0);
        this.isLoading = false;
      }
    )



    this.inventoryService.getRetailPriceTable(this.company_id, this.product_id).subscribe(
      (res) => {
        //console.log(res);
        this.priceRange = res;
        this.price = res[0].price;
        this.qtyRange = res[0].max_qty;
        //console.log(this.qtyRange);
        //console.log(this.priceRange.length);
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
            this.isLoading = false;
            if (res.user.employed_companies[i].default_shipping_address && res.user.employed_companies[i].default_shipping_address.id == this.addrId) {
              this.shipAddr = res.user.employed_companies[i].default_shipping_address;
              //console.log(this.shipAddr);
            } else {
              for (let i = 0; i < this.addrList.length; i++) {
                if (this.addrList[i].id == localStorage.getItem("addrId")) {
                  this.shipAddr = this.addrList[i];
                  //console.log(this.shipAddr);
                }
              }
            }
          }
        }
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
    if (+this.Qty > this.qtyRange) {
      this.price = this.priceRange[this.priceRange.length - 1].price;
    } else {
      this.price = this.priceRange[this.priceRange.length - 2].price;
    }

    //   //console.log(this.warehouses);

    // for(let i=0; i<this.warehouses.length; i++){
    //     if(+this.Qty > this.warehouses[i].amount ){
    //       this.qtyArr[i+1] = this.warehouses[i+1].amount-this.warehouses[i].amount;
    //     //console.log(this.totalQty);
    //   }
    // }

    if (+this.Qty > this.totalQty) {
      this.Qty = this.totalQty;
      //console.log(this.Qty);
    }
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
    this.onSearch();
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

  onSearch() {
    this.destinationArr = null;
    this.selectedDestination = '';
    let shipAddrStr = this.shipAddr.city + ' ' + this.shipAddr.state + ' ' + this.shipAddr.zipcode;
    //console.log(shipAddrStr);
    this.inventoryService.searchPathOnGoogleMap(shipAddrStr).subscribe(
      (res) => {
        //console.log(res);
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
    //console.log(destinationAddress);
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
      //console.log(this.warehouses);
      //console.log(this.itemQty);
      // this.reChooseWhs();
    });
  }


  calcShipping(fromState, fromZip, fromCoun, toState, toZip, toCoun, totalWgt) {
    this.upsbody = {
      "UPSSecurity": {
        "UsernameToken": {
          "Username": "upcpackaging",
          "Password": "Glopak888"
        },
        "ServiceAccessToken": {
          "AccessLicenseNumber": "7D4BEA781678E728"
        }
      },
      "RateRequest": {
        "Request": {
          "RequestOption": "Rate",
          "TransactionReference": {
            "CustomerContext": "Thank you"
          }
        },
        "Shipment": {
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
              "CountryCode": fromCoun
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
              "StateProvinceCode": toState,
              "PostalCode": toZip,
              "CountryCode": toCoun
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
              "CountryCode": fromCoun
            }
          },
          "Service": {
            "Code": "03",
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
              "Weight": totalWgt
            }
          },
          "ShipmentRatingOptions": {
            "NegotiatedRatesIndicator": "true"
          }
        }
      }
    }
    this.upsService.getShippingFee(this.upsbody)
      .subscribe(
        res => {
          // //console.log(res);
        }
      )
  }

  choseWhs(){
    this.chooseWhs= !this.chooseWhs;
    if(this.chooseWhs == false){
      this.showMap = false;
    }
  }

  reChooseWhs() {
    //console.log(this.shopCompany);
    if(this.shopCompany.shop_order_warehouses.length == 1 && this.shopCompany.shop_order_warehouses[0].products.length == 1){
      this.shopCompanyId = "";
    } else {
      this.shopCompanyId = this.shopCompany.id;
    }
    
    this.cartService.deleteItemfromCart(this.shopOrderId, this.shopCompany.id, this.shopWhsId, this.shopProductId).subscribe(
      res => {
        this.warehouseId = this.warehouses[0].address.id;
        this.warehouseName = this.warehouses[0].name;
        this.shopWhsId = "";
        this.shopProductId = "";
        //console.log(this.warehouses[0]);
        //console.log(this.warehouseId);
        for(let i = 0; i<this.shopCompany.shop_order_warehouses.length; i++){
          if(this.warehouseId == this.shopCompany.shop_order_warehouses[i].address.id && this.shopCompany.shop_order_warehouses.length > 1 && this.shopCompany.shop_order_warehouses[0].products.length > 1){
            this.shopWhsId = this.shopCompany.shop_order_warehouses[i].id;
          }
        }
        
        this.cart = {
          "shipping_address_id": localStorage.getItem('addrId'),
          "total_price": this.totalPrice,
          "shop_company":
          {
            "id": this.shopCompanyId,
            "name": this.shopCompany.name,
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
                "unit_weight": "1lb",
                "quantity": +this.itemQty,
                "unit_price": this.cartPrice
              }
            }
          }
        }

        //console.log(this.cart);

        this.cartService.addToCart(171, this.vb_id, this.cart)
          .subscribe(
            res => {
              //console.log(res);
              // this.refreshCart.emit();
              //console.log('!');
              this.cartService.getCartList(171, this.vb_id).subscribe(
                res => {
                  //console.log(res);
                }
              )
              this.isLoading = false;
            }
          )
      }
    )

  }

}
