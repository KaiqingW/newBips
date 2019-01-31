import { OnInit, Component, ViewChild } from '@angular/core';
import { Shipping } from 'app/core/models/shipping';
import { ShopService } from '../../../../../../core/services/shop.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-export-shipping',
    templateUrl: 'export.component.html',
    styleUrls: ['export.component.scss']
})


export class ExportShippingsComponent implements OnInit {
    shippings = [
        new Shipping('2018-02-11', '#33123', 1000, 1200),
        new Shipping('2018-02-24', '#222123', 1000, 1200),
        new Shipping('2018-03-06', '#12432423', 1000, 1200),
        new Shipping('2018-04-05', '#121433', 1000, 1200),
        new Shipping('2018-05-05', '#12124323', 1000, 1200),
        new Shipping('2018-06-05', '#1212342', 1000, 1200),
        new Shipping('2018-02-25', '#12123432', 1000, 1200),
        new Shipping('2018-11-15', '#12123', 1000, 1200),
        new Shipping('2018-02-05', '#12123', 1000, 1200),
    ];
    isLoading: boolean = false;
    pending_orders;
    company_id: number;
    selectedImg;
    modalOpen: boolean = false;
    orderType: string = 'pending';
    constructor(
        private shopService: ShopService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.company_id = + this.route.snapshot.paramMap.get('cid');
        let now = this.getToday();
    }

    ngOnInit() {
        this.getPendingOrders();
    }

    getToday() {
        let now = new Date();
        return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    }

    onChangeMonth(month) {
        // this.getAllContainerInfos(month);
    }

    getPendingOrders() {
        this.isLoading = true;
        this.shopService.getSellOrders(this.company_id).subscribe(
            res => {
                this.isLoading = false;
                this.pending_orders = res.data;
                console.log(res);
            }
        )
    }

    onGetImg(img) {
        this.selectedImg = img;
        this.modalOpen = true;
    }

    onGetNav(id) {
        console.log(id);
        this.router.navigate(['pending-order', id], { relativeTo: this.route });
    }

    closeModal() {
        this.modalOpen = false;
    }
}