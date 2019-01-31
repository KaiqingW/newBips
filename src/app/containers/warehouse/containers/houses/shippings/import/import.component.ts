import { OnInit, Component, ViewChild  } from '@angular/core';
import { Shipping } from 'app/core/models/shipping';
import { WarehouseService } from 'app/core/services/warehouse.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-import-shipping',
    templateUrl:'import.component.html',
    styleUrls:['import.component.scss']
})


export class ImportShippingComponent implements OnInit{
    selected_day_shippings;
    this_month_shipping;
    warehouse_id;
    selected_day;
    company_id : number;
    
    constructor(private warehouseService: WarehouseService,
                private route : ActivatedRoute){

        this.company_id = +this.route.snapshot.paramMap.get('cid');
        this.warehouse_id = +this.route.snapshot.paramMap.get('wId');
        let now = this.getToday();
        this.getAllContainerInfos(now);

    }

    ngOnInit(){
       
    }

    getToday(){
        let now = new Date();
        return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(); 
    }

    getAllContainerInfos(date){
        this.warehouseService.getMonthlyContainers(this.company_id, this.warehouse_id, date).subscribe(
            (res) => {
                this.this_month_shipping = res.data;
                // this.this_month_shipping.sort(this.sortByEtaDate);
                this.getSelectedDayShipping(new Date());
            }
        )
    }
    
    sortByEtaDate(a, b){
        if(a.eta_date && b.eta_date){
            let arrA = a.eta_date.split(/[- :]/);
            let dateA = new Date(arrA[0], arrA[1]-1, arrA[2], arrA[3], arrA[4], arrA[5]);

            let arrB = b.eta_date.split(/[- :]/);
            let dateB = new Date(arrB[0], arrB[1]-1, arrB[2], arrB[3], arrB[4], arrB[5]);
            if(new Date(dateA).getTime() > new Date(dateB).getTime()){
                return 1;
            } else if(new Date(dateA).getTime() < new Date(dateB).getTime()){
                return -1;
            } else {
                return 0;
            }
        }
    }

    getSelectedDayShipping(date){
        this.selected_day_shippings = [];
        let target_day = new Date(date).getDate();
        // alert(target_day);
        for(var i =0; i < this.this_month_shipping.length; i++){
            let arr = this.this_month_shipping[i].eta_date.split(/[- :]/);
            let date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
            let ship_day = new Date(date).getDate();
            // let ship_day = arr[2];
            if(target_day == ship_day){
                this.selected_day_shippings.push(this.this_month_shipping[i]);
            } else if(target_day > ship_day){
                continue;
            } else {
                break;
            }
        }
    }

 

    onGetDate(date){
        
        this.selected_day = date;
        
        alert(date);
        this.getSelectedDayShipping(this.selected_day);
    }
    
    onChangeMonth(month){
        this.getAllContainerInfos(month);
    }

}