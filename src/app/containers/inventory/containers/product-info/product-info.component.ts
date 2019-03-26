let note = 0;
import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
// import { } from '@types/googlemaps';

import { Product } from './../../../../core/models/index';
import { Warehouse } from 'app/core/models/warehouse';
// transfer parameter id from product-list to product-info usign router
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { InventoryService } from '../../../../core/services/inventory.service';
import { WarehouseService } from 'app/core/services/warehouse.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddAttachmentComponent } from './add-attachments/add-attachments.component';
import { ProductEditComponent } from '../../containers/product-edit/product-edit.component';
import { Subscription } from 'rxjs';
import { CopyService } from '../../../../core/services/copy.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { OrdersService } from '../../../../core/services/orders.service';
import { from } from 'rxjs/observable/from';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent implements OnInit, OnDestroy {
  @Input() product_id: number;
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  warehouses: Warehouse[] = [];
  markers: any[];
  infoWindows = [];
  ifFullScreen = false;
  addressArr = [];
  selectedImg = '';
  selectedWarehouse: Warehouse = null;
  selectedWarehouseIndex: number;
  modalOpen: boolean = false;
  // @Input() product_id: number;
  company_id: number;
  product;
  showMap: boolean = false;
  multiPictures = ["assets/images/icons/no-img.jpg"];
  selectedAttachmentIndex: number;
  show;
  attachmentUrl = '';
  searchAddress: '';
  destinationArr;
  selectedDestination;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  showFolder: boolean = true;
  attachmentMap = new Map();
  selectAttachmentArr = [];
  selectFolderName: string = '';
  nonCategoryAttachArr = [];
  isLoading: boolean = false;
  category: string = '';
  selectedAttachment;
  showNum: number = 5;
  finishCount: number = 0;
  categories;
  wholesalePrices = [];
  wholesaleMode;
  END_ZEROS = 100000;
  mode;
  sub: Subscription;
  copy_sub: Subscription;
  selected_copy_product;
  showEditButton: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private warehouseService: WarehouseService,
    private dialog: MatDialog,
    private copyService: CopyService,
    private dialogService: DialogService,
    private ordersService: OrdersService
  ) {

    // this.product_id = +this.route.snapshot.paramMap.get('pid');
    this.company_id = +this.route.snapshot.paramMap.get('cid');
    console.log(this.product_id);
    console.log(this.company_id);
    this.selected_copy_product = this.copyService.getSelectedProduct();
  }


  ngOnInit() {
    this.init();
  }
  init() {
    this.getProduct();
    this.getProductAllCateogories();
    this.getWholesalePrices();
    this.sub = this.inventoryService.wholesalePriceMode.subscribe((mode) => {
      console.log(mode);
      this.mode = mode;
    })
    this.checkEditAuth();
  }
  ngOnChanges(changes) {
    // console.log(changes.product_id.currentValue);
    this.product_id = changes.product_id.currentValue;
    this.init();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getPath(address) {
    this.setDestinationOnMap(address);
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
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

  getDistance(warehouse) {
    return (warehouse.distance * 0.00062137).toFixed(1) + ' mile';
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

  switchShowMap() {
    this.showMap = (!this.showMap);
  }

  onNavToEdit() {
    // this.router.navigate([`../product/editProduct/${this.product_id}`], { relativeTo: this.route });
    const dialogRef = this.dialog.open(ProductEditComponent, {
      width: '700px',
      data: {
        company_id: this.company_id,
        product_id: this.product_id,
      }
    });
  }

  checkEditAuth() {
    this.inventoryService.checkEditProductAuth(this.company_id).subscribe(
      res => {
        this.showEditButton = res.auth;
      }
    )
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

  onReceivedFormData(fd) {
    this.inventoryService.addAttachment(this.company_id, this.product_id, fd).subscribe(
      (res) => {
        this.isLoading = false;
        this.getProduct();
      }
    )
  }

  onReceivePriceTable(priceTable) {
    this.isLoading = true;
    let priceFormLength = priceTable.prices.length;
    // console.log(priceFormLength);
    priceTable.prices.forEach(
      (priceObj) => {
        priceObj.price *= 100;
        this.inventoryService.addRetailPrice(this.company_id, this.product_id, priceObj).subscribe(
          (res) => {
            this.finishCount++;
          },
          () => { },
          () => {
            if (this.finishCount == priceFormLength) {
              this.isLoading = false;
            }
          }
        )
      }
    )
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

  addAttachementDialog() {
    const dialogRef = this.dialog.open(AddAttachmentComponent, {
      width: '700px',
      data: {
        company_id: this.company_id,
        product_id: this.product_id,
        selectFolderName: this.selectFolderName
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.getProduct();
      });
  }

  getProduct() {
    this.isLoading = true;
    this.inventoryService.getProductInfo(this.company_id, this.product_id).subscribe(
      (res) => {
        this.isLoading = false;
        this.product = res;
        this.warehouses = this.product.warehouses;
        this.product.company_defined_columns = this.changeDefineColumnFormat(this.product.company_defined_columns);
        this.setGoogleMap();
      }
    )
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

  onGetProduct(product) {
    this.inventoryService.editProduct(this.company_id, this.product_id, product).subscribe(
      (res) => {
        this.getProduct();
      }
    )
  }

  getProductAllCateogories() {
    this.inventoryService.getProductategory(this.company_id, this.product_id).subscribe(
      (res) => {
        this.categories = res;
      }
    )
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

  deleteProduct() {
    this.dialogService.openCustomizedSureDialog('Do you want to delete this product?').subscribe(
      res => {
        if (res) {
          this.isLoading = true;
          this.inventoryService.deleteProduct(this.company_id, this.product_id).subscribe(
            res => {
              this.isLoading = false;
              this.router.navigate(['../'], { relativeTo: this.route });
            }
          )
        }
      }
    )

  }

  selectWarehouse(warehouse, i) {
    this.selectedWarehouse = warehouse;
    this.getOneWarehouseWholesalePrices();
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
      // this.getPath(this.selectedDestination);	
    }
  }

  selectInMap(infoWindows, markers, i, warehouses) {
    google.maps.event.clearListeners(markers[i], 'click');
    markers[i].addListener('click', () => {
      this.map.setZoom(12);
      this.map.setCenter(markers[i].getPosition());
      infoWindows[i].open(markers[i].get('map'), markers[i]);
      this.selectedWarehouse = warehouses[i];

      var element_to_scroll_to = document.getElementById(i);
      element_to_scroll_to.scrollIntoView();

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
      document.getElementById(i).focus();

      if (this.selectWarehouse && this.selectedDestination) {
        this.getPath(this.selectedDestination);
      }
    });

  }

  closeModal() {
    this.modalOpen = false;
    this.selectedImg = '';
    this.show = '';
    this.selectedAttachment = '';
  }

  openModal(url) {
    if (!url) return;
    this.selectedImg = url;
    this.modalOpen = true;
  }

  reset() {
    this.markers = [];
    this.setGoogleMap();
  }

  getIconImg(attachment) {
    if (attachment.description) {
      let type = attachment.description;
      if (type.includes('jpg') || type.includes('jpeg') || type.includes('png' || type.includes('image/'))) {
        return attachment.url;
      } else if (type.includes('pdf')) {
        return 'assets/images/icons/pdf.png';
      } else if (type.includes('word')) {
        return 'assets/images/icons/word.png';
      } else if (type.includes('xml')) {
        return 'assets/images/icons/excel.png';
      }
    }
    return 'assets/images/icons/unknow.png';
  }

  onClickAttachment(attachment, index) {
    this.selectedAttachment = attachment;
    this.selectedAttachmentIndex = index;
    if ((!attachment.description) || attachment.description.includes('image')) {
      this.show = 'image';
      this.openModal(attachment.url);
    } else {
      this.show = 'other';
      this.attachmentUrl = attachment.url;
      window.open(this.attachmentUrl, '_blank');
    }
  }

  showFiles(category) {
    if (category) {
      this.showFolder = false;
    }
    this.category = category;
    this.selectAttachmentArr = [];
    this.selectAttachmentArr = this.attachmentMap.get(category);
    this.selectFolderName = category;
  }

  backToLocation() {
    // second step, add id="content" at html at the location where the onMouseWheel function is called, editted by yali
    let content = document.getElementById('content');
    let content2 = document.getElementById('content2');
    if (!content) {
      content = content2;
    }
    let scroll_position = +localStorage.getItem("scroll_position");
    if (content) {
      content.scrollTo({ top: scroll_position, left: 0, behavior: 'auto' });
    }
  }

  backToFolder() {
    this.showFolder = true;
    this.selectAttachmentArr = [];
    this.selectFolderName = '';
    this.category = '';
  }

  getType(showcase) {
    switch (showcase) {
      case 0:
        return "Private";
      case 1:
        return "Company";
      case 2:
        return "Public";
      case 3:
        return "Showcase";
      case 4:
        return "Shop";
    }
  }
  // sortAttachment(){
  //   if(this.product && this.product.attachments && this.product.attachments.length > 0){
  //     let attachments = this.product.attachments;
  //     attachments.forEach((attach) => {
  //       let cate = attach.category;
  //       if(!this.attachmentMap.has(cate)){
  //         this.attachmentMap.set(cate, [attach]);
  //       } else {
  //         let arr = this.attachmentMap.get(cate);
  //         arr.push(attach);
  //         this.attachmentMap.set(cate, arr);
  //       }
  //     })
  //     this.product.attachments = Array.from(this.attachmentMap);
  //     this.nonCategoryAttachArr = this.attachmentMap.get(null);

  //   }
  //   if(this.category){
  //     this.showFiles(this.category);
  //   }
  // }

  switchShowBtn() {
    if (this.showNum == 5) {
      this.showNum = 0;
    } else {
      this.showNum = 5;
    }
  }

  getWholesalePrices() {
    this.inventoryService.getAllWarehousesWholesalePrices(this.company_id, this.product_id).subscribe(
      res => {
        this.wholesalePrices = res;
        this.wholesalePrices.forEach(wholesalePrice => {
          this.addMaxPriceRow(wholesalePrice.prices);
        })
      }
    )
  }

  getOneWarehouseWholesalePrices() {
    this.inventoryService.getOneWarehouseWholesalePrices(this.company_id, this.selectedWarehouse.id, this.product_id).subscribe(
      res => {

        this.wholesalePrices = res;
        this.wholesalePrices.forEach(wholesalePrice => {
          this.addMaxPriceRow(wholesalePrice.prices);
        })
      }
    )
  }

  addMaxPriceRow(prices) {
    let last_price = JSON.parse(JSON.stringify(prices[prices.length - 1]));
    last_price['min_qty'] = last_price['max_qty'];
    last_price['max_qty'] = '';
    prices.push(last_price);
  }

  onGetWholesalePrice(priceObj) {
    priceObj['prices'].forEach(price => {
      price['warehouse_id'] = priceObj.warehouse_id;
      price['unit'] = priceObj.unit;
      price['price'] = price['price'] * this.END_ZEROS;
    })
    this.inventoryService.addWholesalePrices(this.company_id, priceObj.warehouse_id, this.product_id, priceObj).subscribe(
      res => {
        this.inventoryService.wholesalePriceMode.next('');
        this.getWholesalePrices();
      }
    )
  }

  copyProductInfo() {
    this.selected_copy_product = this.product;
    this.copyService.setSelectedProduct(this.product);
    this.dialogService.openCustomizedSureDialog('You have copied this product information into clipboard. Do you want to add new product now?').subscribe(
      res => {
        if (res) {
          if (this.product.type == 1) {
            this.router.navigate([`/company/${this.company_id}/inventory/product/addProduct`]);
          } else if (this.product.type == 2) {
            this.router.navigate([`/company/${this.company_id}/inventory/product/addService`]);
          }
        }
      }
    )
  }
}
