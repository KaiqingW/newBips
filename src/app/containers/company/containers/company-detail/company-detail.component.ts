import { Component, OnInit, ViewChild } from  '@angular/core';
import { CompanyService } from 'app/core/services/company.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector:'company-detail',
    templateUrl:'company-detail.component.html',
    styleUrls:['company-detail.component.scss']
})

export class CompanyDetailComponent implements OnInit{
    companyInfo;
    currentLoginCompanyId;
    isLoading:boolean;
    isShowMap:boolean = false;
    companyAddresses = [];
    // for google map
    @ViewChild('crmgmap') gmapElement: any;
    map: google.maps.Map;
    infoWindows = [];
    markers : any[] = [];



    constructor(
        private companyService: CompanyService,
        private route: ActivatedRoute
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit(){
        this.getCompanyInfo();
    }

    getCompanyInfo(){
        this.companyService.getCompany(this.currentLoginCompanyId).subscribe(
            res=>{
                this.companyInfo = res;
                this.companyAddresses.push(res.address);
                this.isLoading = false;
                console.log(res);
            }
        )
    }

    showMap(){
        this.isShowMap = !this.isShowMap;
        setTimeout(()=>{
            if (this.isShowMap == true) {
              this.setGoogleMap();
            }else{
                this.isShowMap == false;
            }
          },100);
       
    }

    setGoogleMap(){
        this.markers = [];
        let lati, long, center;
        let defaultCenter = new google.maps.LatLng(37.6117784, -93.9646151);

        if(!this.companyAddresses || this.companyAddresses.length === 0){
            center = defaultCenter;
          } else {
            lati = this.companyAddresses[0].latitude;
            long = this.companyAddresses[0].longitude;
            center = new google.maps.LatLng(lati, long);
          }

        var mapProp = {
            center: center,
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
  
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        var bounds = new google.maps.LatLngBounds();

        if(this.companyAddresses && this.companyAddresses.length){
            for (var i = 0; i < this.companyAddresses.length; i++){
                if(this.companyAddresses[i] && this.companyAddresses[i].latitude && this.companyAddresses[i].longitude){
                    
                    
                    let tempPoint = new google.maps.LatLng(
                        this.companyAddresses[i].latitude,
                        this.companyAddresses[i].longitude
                    )
                    let tempMarker = new google.maps.Marker({
                        position: tempPoint,
                        animation: google.maps.Animation.DROP,
                    });

            //set each info window
            let infowindow = new google.maps.InfoWindow({
                content: `
                <div style="width:250px !important;">
                    ${this.companyAddresses[i].street1},
                    ${this.companyAddresses[i].city},
                    ${this.companyAddresses[i].state},
                    ${this.companyAddresses[i].zipcode}
                </div>
                `
            });
            this.infoWindows.push(infowindow);
            tempMarker.setMap(this.map);
            // this.markers.push(tempMarker);
            bounds.extend(tempMarker.getPosition());
        //   this.selectInMap(this.infoWindows, this.markers, i, this.warehouses);
            //   this.markers.push(tempMarker);
            //   this.infoWindows[i].open(this.map, this.markers[i]);
                }
            }
        }
        this.map.fitBounds(bounds);
    }
}