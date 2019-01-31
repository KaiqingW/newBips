import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../../../../core/services/orders.service';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
    selector: 'app-container-info',
    templateUrl: './container-info.component.html',
    styleUrls: ['./container-info.component.scss']
})


export class ContainerInfoComponent implements OnInit, OnChanges {
    selectedContainer;
    @Input() status;
    @Input() containers;
    @Output() toGetItems = new EventEmitter<any>();
    @Output() toWheel = new EventEmitter<any>();
    @Output() onSendOrder = new EventEmitter<any>();
    @Input() currentPage;
    @Input() lastPageNumber;
    company_id: number;
    venderCopanyId: number;
    @Input() nextPageUrl;
    @Input() lastPageUrl;
    @Output() toPrevPage = new EventEmitter<any>();
    @Output() toNextPage = new EventEmitter<any>();
    container_status = ['Oversea', 'Clearance', 'Ground', 'Arrived', 'Finished'];
    clickedContainer;
    pre_view_container_number;
    user_id: number;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private ordersService: OrdersService,
        private inventoryService: InventoryService,
        private authService: AuthService) {
        this.company_id = +this.route.snapshot.paramMap.get('cid');
        this.venderCopanyId = + this.route.snapshot.paramMap.get('vendor_company_id');
        if (this.venderCopanyId) {
            this.company_id = this.venderCopanyId;
        }
    }

    ngOnInit() {
        console.log(localStorage.getItem('user_pre_view_container'));
        if (this.containers && this.containers.length > 0 && localStorage.getItem('user_pre_view_container')) {
            let user_container_info = JSON.parse(localStorage['user_pre_view_container']);
            console.log(user_container_info);
            if (user_container_info.user.id == this.user_id) {
                this.pre_view_container_number = user_container_info.container_num;
                console.log(this.pre_view_container_number);
            }
        }
    }

    getUserInfo() {
        this.authService.getCurrentUserBrief().subscribe(
            res => {
                this.user_id = res.id;
            }
        )
    }

    ngOnChanges() {
    }

    onNavToDetail(event, item) {
        this.router.navigateByUrl('company/${}/purchase-order/orders/76/item/63')
    }

    navToDetail() {

    }

    previousPage() {
        this.toPrevPage.emit();
    }

    nextPage() {
        this.toNextPage.emit();
    }

    onMouseWheel($event) {
        this.toWheel.emit($event);
    }

    isExpand(container) {
        // console.log(container.container_number, this.pre_view_container_number);
        return (this.clickedContainer == container || container.container_number == this.pre_view_container_number);
    }

    selectContainer(container) {
        this.selectedContainer = container;
    }

    navToStatus(item) {
        this.router.navigate([item.order_id, 'item', item.id], { relativeTo: this.route });
    }

    open(event, container) {
        if (this.clickedContainer == container) {
            this.clickedContainer = '';
        } else {
            this.clickedContainer = container;
            if (this.clickedContainer && (!this.clickedContainer.items || this.clickedContainer.items.length == 0)) {
                this.toGetItems.emit(this.clickedContainer);
            }
        }
    }

    onGetOrder(order_number) {
        this.onSendOrder.emit(order_number);
    }
}