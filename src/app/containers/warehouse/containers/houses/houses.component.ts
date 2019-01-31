
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { WarehouseService } from 'app/core/services/warehouse.service';

import { environment } from 'environments/environment';
import { Address } from 'app/core/models/address';
import { Warehouse } from '../../../../core/models';

@Component({
  selector: 'app-houses',
  templateUrl: 'houses.component.html',
  styleUrls: ['houses.component.scss']
})

export class HousesComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  warehouses: Warehouse[] = [];
  company_id: number;
  isLoading: boolean = false;
  selectedWarehouse: Warehouse = null;
  markers: any[];
  selectedWarehouseIndex: number;
  previousMaker: any;
  infoWindows = [];
  descriptionTextLengthArr = [];
  AddressTextLengthArr = [];
  addressArr = [];
  ifFullScreen = false;
  next;
  total: number;
  //set maximum refresh height;
  refreshHeight = 800;
  // count mouse wheel
  countMouseWheel = 0;
  showWarehousePlan: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private warehouseService: WarehouseService
  ) {
    this.company_id = + this.route.snapshot.paramMap.get('cid');
    this.getWarehouses();
  }

  ngOnInit() {

  }

  onNav(event, warehouse) {
    event.stopPropagation();
    if (warehouse && warehouse.id) {
      let id = +warehouse.id;
      this.router.navigateByUrl(`/company/${this.company_id}/warehouse/houses/${id}`);
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
        this.descriptionTextLengthArr.push(30);
        this.AddressTextLengthArr.push(60);
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
              <div>
              Warehouse Name: ${this.warehouses[i].name}.
              </div>
              <div style="width:250px !important;">
                ${this.warehouses[i].address.street1},
                ${this.warehouses[i].address.city},
                ${this.warehouses[i].address.state},
                ${this.warehouses[i].address.zipcode}
              </div>
              <div>
              Tel : ${this.warehouses[i].phone_number}
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

  selectInMap(infoWindows, markers, i, warehouses) {
    markers[i].addListener('click', () => {
      this.map.setZoom(8);
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
    });

  }

  selectWarehouse(warehouse, i) {
    this.descriptionTextLengthArr.forEach((each, j) => {
      if (i == j) {
        this.descriptionTextLengthArr[i] = null;
        this.AddressTextLengthArr[i] = null;
      } else {
        this.descriptionTextLengthArr[j] = 30;
        this.AddressTextLengthArr[j] = 60;
      }
    });
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
    //console.log(this.warehouses[i].address.longitude,);

    //this.map.setCenter(this.markers[i].getPosition());
    //let lat = parseInt(this.warehouses[i].address.latitude) + 0.5;
    // let latString = lat.toString();

    this.map.setCenter(new google.maps.LatLng(this.warehouses[i].address.latitude, this.warehouses[i].address.longitude));
    this.map.setZoom(8);
  }


  getWarehouses() {
    this.isLoading = true;
    this.warehouseService.getWarehouseCollection(this.company_id).subscribe(
      (res) => {
        this.isLoading = false;
        this.warehouses = res.data;
        this.total = res.paging.total;

        if (res.paging.next) {
          this.next = res.paging.next;
          // this.getPagingWarehouses();
        }
        this.setGoogleMap();

      },
      (err) => {
        this.isLoading = false;

      }
    )
  }

  getPagingWarehouses() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.warehouseService.getNextWarehouses(this.next).subscribe(
        (res) => {
          this.isLoading = false;
          this.warehouses = this.warehouses.concat(res.data);
          this.next = res.paging.next;
          if (!this.next) {
            this.setGoogleMap();
          }
        },
        (err) => {

        },
        () => {
          if (!this.next) {
            this.setGoogleMap();
          }
        }
      )
    }
  }

  goFullScreen() {
    var goFS = document.getElementById("goFS");
    goFS.style.height = '97.5%';
    this.ifFullScreen = true;
  }

  miniMap() {
    var goFS = document.getElementById("goFS");
    goFS.style.height = '45%';
    this.ifFullScreen = false;
  }

  reset() {
    this.markers = [];
    this.setGoogleMap();
  }

  onMouseWheel(evt) {
    if (evt.target.scrollTop > this.refreshHeight) {
      if (this.next) {
        this.refreshHeight += 400;
        this.getPagingWarehouses();
      }
    }

  }

  openWarehousePlan() {
    this.showWarehousePlan = true;
  }

  closeModal() {
    this.showWarehousePlan = false;
  }

  getPlanImg() {
    return "assets/images/warehouse_plan.png";
  }

  toDetail() {
    this.router.navigateByUrl('shippings');
  }
}
