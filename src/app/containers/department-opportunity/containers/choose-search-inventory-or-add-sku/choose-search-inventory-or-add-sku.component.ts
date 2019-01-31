import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';

@Component({
  selector: 'choose-search-inventory-or-add-sku',
  templateUrl: './choose-search-inventory-or-add-sku.component.html',
  styleUrls: ['./choose-search-inventory-or-add-sku.component.scss']
})
export class ChooseSearchInventoryOrAddSKUComponent implements OnInit {

    // for opportunity, editted by yali    
    currentLoginCompanyId;
    crmOpportunityProjectId;
 
    links = [];

    constructor(
        private route: ActivatedRoute,
        
    ) {
        // for opportunity, editted by yali    
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
        this.crmOpportunityProjectId = this.route.snapshot.queryParams['crmOpportunityProjectId'];
        
    }

    ngOnInit() {
    this.links = [
        {
            name: 'Add New SKU',
            url: `/company/${this.currentLoginCompanyId}/inventory/product/chooseAddType`
        },
        {
            name: 'Choose from  Existing Products',
            url: 'search-inventory'
        },
    ];

    }

    choose(type) {

    }

}
