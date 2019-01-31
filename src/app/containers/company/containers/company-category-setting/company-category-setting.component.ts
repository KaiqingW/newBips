import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HrService } from '../../../../core/services/hr.service';

@Component({
    selector: 'setting-company-category',
    templateUrl: './company-category-setting.component.html',
    styleUrls: ['./company-category-setting.component.scss']
})


export class CompanyCategorySettingComponent implements OnInit {
    categories = [];
    company_id: number;
    isLoading: boolean = false;
    selected_category;

    constructor(private hrSevice: HrService,
        private route: ActivatedRoute) {
        this.company_id = +this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit() {
        this.getCompanyCategories();
    }

    getCompanyCategories() {
        this.isLoading = true;

        this.hrSevice.browseCompanyCategory(this.company_id).subscribe(
            (res) => {
                this.isLoading = false;
                this.categories = res;
            }
        )
    }


    onReceiveCate(obj) {
        this.isLoading = true;
        if (obj.action == 'add') {
            obj['type'] = "company_structure";
            this.hrSevice.addCompanyCategory(this.company_id, obj).subscribe(
                (res) => {
                    this.isLoading = false;
                    this.getCompanyCategories();
                }
            )
        } else if (obj.action == 'edit') {
            this.hrSevice.editCompanyCategory(this.company_id, obj.id, obj).subscribe(
                (res) => {
                    this.isLoading = false;
                    this.getCompanyCategories();
                }
            )
        } else if (obj.action == 'drop') {
            this.hrSevice.dropCategory(this.company_id, obj.id).subscribe(
                () => {
                    this.isLoading = false;
                    this.getCompanyCategories();
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