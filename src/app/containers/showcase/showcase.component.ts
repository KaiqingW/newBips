
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LeadDetail } from 'app/core/models/index';
import { Product } from './../../../app/core/models/index';
import { InventoryService } from './../../../app/core/services/inventory.service';
import { VrmBaBaService } from 'app/containers/vrm/vrm.service';
import { SearchService } from 'app/core/services/search.service';
import { CompanyService } from 'app/core/services/company.service';

@Component({
    selector: 'showcase',
    templateUrl: 'showcase.component.html',
    styleUrls: ['showcase.component.scss']
})

export class ShowcaseComponent implements OnInit {
    // Lead$: Observable<Lead>;
    currentLoginCompanyId;
    productList: Product[];
    companyInfo;
    companyAddresses = [];
    descriptionLength;
    moreOrLess: boolean = false;
    showMore: boolean = true;
    showAboutUs: boolean = false;

    /********** begin edit by Simon let the other company can access the showcase  */
    currentWholeUrl;
    currentVenderId;
    currentVenderName;
    currentVenderCompanyId;
    isLoading: boolean;
    /**********end edit by Simon **************************************************/
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private inventoryService: InventoryService,
        private vrmBaBaService: VrmBaBaService,
        private searchService: SearchService,
        private companyService: CompanyService,

    ) {
        this.isLoading = true;
        this.currentWholeUrl = document.URL;
        console.log(this.currentWholeUrl);
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.currentVenderId = this.route.snapshot.paramMap.get('ven_id');
        // this.getCompanyInfo();

    }

    lead: LeadDetail =
        {
            id: 1,
            name: "orcasmart",
            industry: "Tech",
            possibility: "20%",
            usage: "20,000",
            logo_url: "assets/images/testimg/company-logo.png",
            telephone: "5169747088",
            fax: "123-123-1234",
            email: "test@gmial.com",
            website: "www.orcasmart.com",
            address: "35 Engel street, Hicksville, NY 11801",
            description: "Whats the reason behind 127.0.0.1 this is just unnecessary most people probably want to test their apps on mobile too. And accessing the dev environment over lan is the easiest way to do so. Can we make the 0.0.0.0 to be the default please? ",
            contacts: [
                { id: 1, name: "Tom", avatar_url: "assets/images/testimg/useravatar2.png" },
                { id: 2, name: "Jack", avatar_url: "assets/images/testimg/useravatar2.png" }
            ],

            showcases:
                [

                    { id: 1, name: "Sprite Can", img_url: "assets/images/testimg/sprite.png" },
                    { id: 2, name: "Beer Bottle", img_url: "assets/images/testimg/glass-bottle.jpg" },
                    { id: 3, name: "Sprite Can", img_url: "assets/images/testimg/sprite.png" },
                    { id: 4, name: "Beer Bottle", img_url: "assets/images/testimg/brandy-bottle.png" },
                    { id: 5, name: "Mount", img_url: "assets/images/testimg/pepsi.png" },
                    { id: 6, name: "cup", img_url: "assets/images/testimg/coffee.png" },
                    { id: 7, name: "Mount", img_url: "assets/images/testimg/coffee.png" },
                    { id: 8, name: "cup", img_url: "assets/images/testimg/glass-bottle.jpg" },
                ]

        };


    ngOnInit() {
        /********** begin edit by Simon  if come from vrm  ******************/
        if (this.currentWholeUrl.toLowerCase().includes('vrm')) {
            // console.log("!!!!!!!");
            this.vrmBaBaService.getVendor(this.currentLoginCompanyId, this.currentVenderId).subscribe(
                res => {
                    this.currentVenderName = res.name;
                    this.searchService.searchCompany(this.currentVenderName).subscribe(
                        res => {
                            if (res.data.length == 0) {
                                // console.log('no data');
                                this.isLoading = false;
                            } else {
                                // console.log('123');
                                this.currentVenderCompanyId = res.data[0].id;
                                this.getCompanyInfo(this.currentVenderCompanyId);
                                console.log(this.currentVenderCompanyId);
                                this.inventoryService.getProductByShowcase(this.currentVenderCompanyId, 5).subscribe(
                                    (res) => {
                                        this.productList = res.data;
                                        console.log(this.productList);
                                        this.isLoading = false;
                                    })
                            }
                        }
                    )
                }
            )
            /********** end edit by Simon  if come from vrm  ******************/
        } else {
            this.getCompanyInfo(this.currentLoginCompanyId);
            this.getShowcaseList();
        }
    }

    getShowcaseList() {
        this.inventoryService.getProductByShowcase(this.currentLoginCompanyId, 5).subscribe(
            (res) => {
                this.productList = res.data;
                this.isLoading = false;
            })
    }

    getCompanyInfo(id) {
        this.companyService.getCompany(id).subscribe(
            res => {
                this.companyInfo = res;
                if (this.companyInfo.description) {
                    console.log(this.companyInfo.description.length);
                    this.descriptionLength = this.companyInfo.description.length;
                    if (this.descriptionLength > 170) {
                        this.moreOrLess = true;
                    }
                }
                this.companyAddresses.push(res.address);
                this.isLoading = false;
                console.log(res);
            }
        )
    }

    aboutUs() {
        this.showAboutUs = !this.showAboutUs;
    }

}
