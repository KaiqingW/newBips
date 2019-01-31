import { Component, OnInit, OnDestroy } from '@angular/core';
import { InventoryService } from '../../../../core/services/inventory.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'setting-service-category',
    templateUrl: './service-category-setting.component.html',
    styleUrls: ['./service-category-setting.component.scss']
})


export class ServiceCategorySettingComponent implements OnInit {
    categories = [];
    company_id: number;
    isLoading: boolean = false;
    selected_category;

    constructor(private inventoryService: InventoryService,
        private route: ActivatedRoute) {
        this.company_id = +this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit() {
        this.getAllCategory();
    }

    getAllCategory() {
        this.isLoading = true;

        this.inventoryService.getCategories(this.company_id, 'service').subscribe(
            (res) => {
                this.isLoading = false;
                this.categories = res;
            }
        )
    }

    onReceiveCate(obj) {
        this.isLoading = true;
        obj['type'] = 'service';

        if (obj.action == 'add') {
            this.inventoryService.addCategory(this.company_id, obj).subscribe(
                (res) => {
                    this.isLoading = false;
                    this.getAllCategory();
                }
            )
        } else if (obj.action == 'edit') {
            this.inventoryService.editCategory(this.company_id, obj.id, obj).subscribe(
                (res) => {
                    this.isLoading = false;
                    this.getAllCategory();
                }
            )
        } else if (obj.action == 'drop') {
            this.inventoryService.dropCategory(this.company_id, obj.id).subscribe(
                () => {
                    this.isLoading = false;
                    this.getAllCategory();
                }
            )
        }

    }

    onGetRadio(item) {
        let category_id = +item.id;
        this.selected_category = item.name;
        // this.addProductForm.patchValue({
        //     category_id: category_id
        // })
    }
}