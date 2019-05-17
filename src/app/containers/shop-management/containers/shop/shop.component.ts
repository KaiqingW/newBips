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
// import { timingSafeEqual } from 'crypto';

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
    needEditProductListNextUrl: string = "";
    offlineProductListNextUrl: string = "";
    onlineProductListNextUrl: string = "";
    onlineLabel: string = "Online";
    offlineLabel: string = "Offline";
    IncompleteLabel: string = "Incomplete";
    selectedEditProductId;
    product_id;
    isAddProduct: boolean;
    isOpenDetail: boolean;
    isEdit: boolean;
    isSaveEdit: boolean;

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
            }
        )
    }

    getPurcahseOrders() {
        this.isLoading = true;
        this.shopservice.getShopPurchaseOrders(171, this.companyId).subscribe(
            (res) => {
                this.isLoading = false;

                this.purchase_orders = res.data;
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
    clearAll() {
        this.isAddProduct = false;
        this.isOpenDetail = false;
        this.isEdit = false;
        this.isSaveEdit = false;
        this.selectedEditProductId = "";
        this.product_id = "";
    }
    openEdit() {
        this.isEdit = true;
        console.log(this.isEdit);
        this.isOpenDetail = false;
        this.isAddProduct = false;
    }
    saveEdit(saved: boolean) {
        console.log(this.isEdit);
        console.log(saved);
        this.clearAll();
    }
    onReceiveNav(product) {
        console.log(product);
        this.product_id = product.id;
        console.log(this.product_id);
        this.selectedEditProductId = "";
        this.isAddProduct = false;
        this.isOpenDetail = true;
        // this.router.navigate([`/company/${this.companyId}/inventory/product/${product.id}`]);
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
                            if (res.paging.total > 0) {
                                this.shopservice.deleteShopProduct(this.companyId, product_id).subscribe(
                                    () => {
                                        this.isLoading = false;
                                        this.getPostandUnpostProductList();
                                    }
                                )
                            } else {
                                this.getPostandUnpostProductList();
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
                                headline: product.headline,
                                description: product.description,
                                image: this.processImg(product['images']),
                                company_id: this.companyId,
                                company_product_id: product_id,
                                first_category: product.shop_first_category,
                                second_catagory: product.shop_second_category,
                                third_category: product.shop_third_category,
                                brand: product.brand,
                                retail_prices: res,
                                free_shipping: product.free_shipping,
                                warehouses: this.processWarehouseAddressId(product.warehouses)
                            }
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

    onGetScroll(evt, status) {
        let container = document.getElementById('container');
        console.log(container);
        if (container.scrollTop >= (container.scrollHeight - container.offsetHeight) && !this.isLoading) {
            switch (status) {
                case 'online':
                    if (!this.onlineProductListNextUrl) return;
                    this.isLoading = true;
                    this.inventoryService.getProductListByPage(this.onlineProductListNextUrl).subscribe(
                        (res) => {
                            this.onlineProductList = this.onlineProductList.concat(res.data);
                            this.onlineProductListNextUrl = res.paging.next;
                            this.isLoading = false;
                        }, (err) => {
                            this.isLoading = false;
                        }
                    )
                    break;
                case 'offline':
                    if (!this.offlineProductListNextUrl) return;
                    this.isLoading = true;
                    this.inventoryService.getProductListByPage(this.offlineProductListNextUrl).subscribe(
                        (res) => {
                            this.offlineProductList = this.offlineProductList.concat(res.data);
                            this.offlineProductListNextUrl = res.paging.next;
                            this.isLoading = false;
                        }, (err) => {
                            this.isLoading = false;
                        }
                    )
                    break;
                case 'incomplete':
                    if (!this.needEditProductListNextUrl) return;
                    this.isLoading = true;
                    this.inventoryService.getProductListByPage(this.needEditProductListNextUrl).subscribe(
                        (res) => {
                            this.needEditProductList = this.needEditProductList.concat(res.data);
                            this.needEditProductListNextUrl = res.paging.next;
                            this.isLoading = false;
                        }, (err) => {
                            this.isLoading = false;
                        }
                    )
                    break;
            }
        }
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
        console.log(id);
        this.selectedEditProductId = id;
        this.product_id = "";
        this.isAddProduct = false;
        this.isOpenDetail = false;
        // this.router.navigate(['product', id, 'edit'], { relativeTo: this.route });
    }

    onGetNav(id) {
        this.router.navigate(['order', id], { relativeTo: this.route });
    }
    isAdd() {
        this.isAddProduct = true;
        this.selectedEditProductId = "";
        this.product_id = "";
        this.isOpenDetail = false;
    }
    onsave() {
        this.selectedEditProductId = " ";
        this.product_id = "";
        this.isAddProduct = false;
        this.isOpenDetail = false;
        this.init();
    }
    onCancel() {
        this.selectedEditProductId = "";
        this.product_id = "";
        this.isAddProduct = false;
        this.clearAll();
        this.init();
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
                        this.needEditProductListNextUrl = res.paging.next;
                        this.IncompleteLabel = "Need Edit" + "(" + res.paging.total + ")";
                        break;
                    case 2:
                        this.offlineProductList = res.data;
                        this.offlineProductListNextUrl = res.paging.next;
                        this.offlineLabel = "Offline" + "(" + res.paging.total + ")";
                        break;
                    case 3:
                        this.onlineProductList = res.data;
                        this.onlineProductListNextUrl = res.paging.next;
                        this.onlineLabel = "Online" + "(" + res.paging.total + ")";
                        break;
                }
            },
            err => {
            },
            () => {
                this.isLoading = false;
            }
        )
    }
}