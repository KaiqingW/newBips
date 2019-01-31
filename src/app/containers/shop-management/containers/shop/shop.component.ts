import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LeadDetail } from 'app/core/models/index';
import { InventoryService } from '../../../../core/services/inventory.service';
import { Product } from 'app/core/models/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CompanyService } from 'app/core/services/company.service';
import { CommonService } from '../../../../core/services/common.service';
import { ShopService } from '../../../../core/services/shop.service';
import { UpsService } from '../../../../core/services/ups.service';
import { Http, Headers } from '@angular/http';
import { SearchService } from '../../../../core/services/search.service';

@Component({
    selector: "app-shop",
    templateUrl: "./shop.component.html",
    styleUrls: ["./shop.component.scss"],
    encapsulation: ViewEncapsulation.None
})

export class ShopComponent implements OnInit {
    isLoading = false;
    productList;
    onlineProductList;
    offlineProductList;
    needEditProductList;
    companyId: number;
    company;
    selects = ['Online', 'Offline', 'Need Edit'];
    btnPlaceholder = "Switch Status";
    prodcutSelectedType = 'manage';
    purchase_orders;
    sell_orders;
    selectedImg;
    modalOpen: boolean = false;

    constructor(private inventoryService: InventoryService,
        private route: ActivatedRoute,
        private companyService: CompanyService,
        private commonService: CommonService,
        private router: Router,
        private shopservice: ShopService,
        private upsService: UpsService,
        private searchService: SearchService,
        private http: Http) {
        this.companyId = +this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit() {
        this.init();
        // this.getTry();
        // this.calcShipping()
    }

    init() {
        // this.getAllProductList();
        this.getPostandUnpostProductList();
        this.getCompany();
        this.getSellOrders();
        this.getPurcahseOrders();
    }

    // getAllProductList() {
    //     this.isLoading = true;
    //     this.commonService.searchFieldOfTable(this.companyId, 'inventory', 'product', 'as_showcase', 4, 'desc').subscribe(
    //         (res) => {
    //             this.isLoading = false;
    //             this.productList = res.data;
    //         }
    //     )
    // }

    getSellOrders() {
        this.isLoading = true;
        this.shopservice.getSellOrders(this.companyId).subscribe(
            res => {
                this.isLoading = false;
                this.sell_orders = res.data;
                console.log(this.sell_orders);
            }
        )
    }

    getPurcahseOrders() {
        this.isLoading = true;
        this.shopservice.getShopPurchaseOrders(171, this.companyId).subscribe(
            (res) => {
                this.isLoading = false;

                this.purchase_orders = res.data;
                console.log(res);
            }
        )
    }

    onGetImg(img) {
        this.selectedImg = img;
        this.modalOpen = true;
    }

    viewHistory() {
        this.prodcutSelectedType = 'history';
    }

    viewManage() {
        this.prodcutSelectedType = 'manage';
    }

    onReceiveNav(product) {
        this.router.navigate([`/company/${this.companyId}/inventory/product/${product.id}`]);
    }

    closeModal() {
        this.modalOpen = false;
    }

    onGetSelect(selectData) {
        let status = selectData.data.status.toLowerCase();
        let obj;
        let product_id = +selectData.product_id;
        if (status == 'need edit') {
            obj = { shop_status: 1 };
        } else if (status == 'offline') {
            obj = { shop_status: 2 };
        } else if (status == 'online') {
            obj = { shop_status: 3 };
        }
        if (obj && obj.shop_status) {
            this.updateShopStatus(obj, product_id);
        }
    }

    updateShopStatus(obj, product_id) {
        this.isLoading = true;
        this.shopservice.updateProduct(this.companyId, product_id, obj).subscribe(
            (res) => {
                this.isLoading = false;
            },
            () => {

            },
            () => {
                this.isLoading = true;
                if (obj.shop_status != 3) {

                    let search_obj = {
                        company_id: this.companyId,
                        company_product_id: product_id
                    };

                    this.searchService.searchShopProduct(171, search_obj).subscribe(
                        (res) => {
                            console.log(res);
                            if (res.paging.total > 0) {
                                this.shopservice.deleteShopProduct(this.companyId, product_id).subscribe(
                                    () => {
                                        console.log('delet!');
                                        this.isLoading = false;
                                        this.init();
                                    }
                                )
                            } else {
                                this.init();
                            }
                        }
                    )

                }
            }
        )

        if (obj.shop_status == 3) {
            this.isLoading = true;
            this.inventoryService.getProductInfo(this.companyId, product_id).subscribe(
                (res) => {
                    let product = res;
                    let price_table;
                    this.inventoryService.getRetailPriceTable(this.companyId, product_id).subscribe(
                        (res) => {
                            product['price_table'] = res;
                            let obj = {
                                name: product.name,
                                description: product.description,
                                image: this.processImg(product['images']),
                                company_id: this.companyId,
                                company_product_id: product_id,
                                first_category: product.shop_first_category,
                                second_catagory: product.shop_second_category,
                                third_category: product.shop_third_category,
                                retail_prices: res,
                                warehouses: this.processWarehouseAddressId(product.warehouses)
                            }
                            console.log(obj);
                            this.shopservice.addProductFromCompanyToOrcashop(171, obj).subscribe(
                                (res) => {
                                    this.init();

                                },
                                (err) => {
                                }
                            )
                        }
                    )


                }
            )
        }

    }

    onGetScroll($event) {
        // console.log($event);
    }

    processWarehouseAddressId(warehouses) {
        warehouses.forEach((warehouse) => {
            warehouse['address_id'] = warehouse.address.id;
            warehouse['vender_warehouse_id'] = warehouse.id;
        })
        return warehouses;
    }

    processImg(images) {
        if (images == null || images.length == 0) {
            return 'no image';
        }
        return images[0].url;
    }

    getCompany() {
        this.isLoading = true;
        this.companyService.getCompany(this.companyId).subscribe(
            (res) => {
                this.company = res;
                let address = this.company.address;
                if (address && address.length > 0) {
                    this.company.address.location = address.street1 + ', ' + address.city + ', ' + address.state;
                }
                this.isLoading = false;
            }
        )
    }

    onGetNavToEdit(id) {
        this.router.navigate(['product', id, 'edit'], { relativeTo: this.route });
    }

    onGetNav(id) {
        console.log(id);
        this.router.navigate(['order', id], { relativeTo: this.route });
    }

    getPostandUnpostProductList() {
        // shop_status
        // 0 - not in shop
        // 1 - need edit;  not assign price, category, 
        // 2 - offline; 
        // 3 - on line
        this.isLoading = true;
        for (var shop_status = 1; shop_status <= 3; shop_status++) {
            this.getProductListByShopStatus(shop_status);
        }
        // this.commonService.searchFieldOfTable(this.companyId, 'inventory', 'product', 'shop_status', 1, 'desc').subscribe(
        //     (res) => {
        //         this.isLoading = false;
        //         this.needEditProductList = res.data;
        //     }
        // )
        // this.isLoading = true;

        // this.commonService.searchFieldOfTable(this.companyId, 'inventory', 'product', 'shop_status', 2, 'desc').subscribe(
        //     (res) => {
        //         this.isLoading = false;
        //         this.offlineProductList = res.data;
        //     }
        // )
        // this.isLoading = true;

        // this.commonService.searchFieldOfTable(this.companyId, 'inventory', 'product', 'shop_status', 3, 'desc').subscribe(
        //     (res) => {
        //         this.isLoading = false;
        //         this.onlineProductList = res.data;
        //     }
        // )
    }

    getProductListByShopStatus(shop_status) {
        let queryString = "shop_status=" + shop_status;
        this.searchService.getProductsForShopManagement(this.companyId, queryString).subscribe(
            (res) => {
                switch (shop_status) {
                    case 1:
                        this.needEditProductList = res.data;
                        break;
                    case 2:
                        this.offlineProductList = res.data;
                        break;
                    case 3:
                        this.onlineProductList = res.data;
                        break;

                }
            },
            err => {
                console.log(err);
            },
            () => {
                this.isLoading = false;
            }
        )
    }
}