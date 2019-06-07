import { Component, OnInit, OnDestroy } from '@angular/core';
import { InventoryService } from '../../../../core/services/inventory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from '../../../../core/services/setting.service';

@Component({
    selector: 'setting-product-category',
    templateUrl: './product-category-setting.component.html',
    styleUrls: ['./product-category-setting.component.scss']
})


export class ProdcutCategorySettingComponent implements OnInit {
    categories = [];
    company_id: number;
    isLoading: boolean = false;
    selected_category;
    category_type: string = "product";

    constructor(private inventoryService: InventoryService,
        private route: ActivatedRoute,
        private router: Router,
        private settingService: SettingService) {
        this.company_id = +this.route.snapshot.paramMap.get('cid');

        if (this.router.url.includes('shop-department-setting')) {
            this.category_type = "shopDept";
        } else if (this.router.url.includes('shop-useCase-setting')) {
            this.category_type = "useCase";
        }
        this.getAllCategory();
    }

    ngOnInit() {


    }

    getAllCategory() {
        this.isLoading = true;

        this.inventoryService.getCategories(this.company_id, this.category_type).subscribe(
            (res) => {
                this.isLoading = false;
                this.categories = res;
            }
        )
    }

    onReceiveCate(obj) {
        obj["type"] = this.category_type;
        this.isLoading = true;
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