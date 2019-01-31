import { OnInit, Component } from '@angular/core';
import { WarehouseService } from 'app/core/services/warehouse.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-shippings',
    templateUrl: 'shippings.component.html',
    styleUrls: ['shippings.component.scss']
})


export class ShippingsComponent implements OnInit {
    isShowMap: boolean = false;
    shippingSelectedType = 'import';
    isImport: boolean = true;
    warehouse;
    isLoading: boolean = false;
    warehouse_id: number;
    company_id: number;
    showKeepers: boolean = false;

    constructor(
        private warehouseService: WarehouseService,
        private route: ActivatedRoute,
    ) {
        this.warehouse_id = +this.route.snapshot.paramMap.get('wId');
        this.company_id = +this.route.snapshot.paramMap.get('cid');
        this.getWarehouse();
    }


    ngOnInit() {

    }

    showMap() {

    }

    addOrderDialog() {

    }

    getWarehouse() {
        this.warehouseService.getOneWarehouse(this.company_id, this.warehouse_id).subscribe(
            res => {
                this.warehouse = res;
            }
        )
    }

    showImport() {
        this.shippingSelectedType = 'import';
        this.isImport = true;
    }

    showExport() {
        this.shippingSelectedType = 'export';
        this.isImport = false;
    }
}