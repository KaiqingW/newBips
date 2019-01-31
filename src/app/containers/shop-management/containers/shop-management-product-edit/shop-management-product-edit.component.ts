import { Component, OnInit, OnDestroy } from '@angular/core';
import { InventoryService } from '../../../../core/services/inventory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../../../core/services/shop.service';
import { ShopManagementService } from '../../../../core/services/shop-management.service';
import { Subscription, Subject } from 'rxjs';
import { DialogService } from '../../../../core/services/dialog.service';

@Component({
    selector: 'app-shop-management-product-edit',
    templateUrl: './shop-management-product-edit.component.html',
    styleUrls: ['./shop-management-product-edit.component.scss']
})

export class ShopManagementProductEditComponent implements OnInit, OnDestroy {
    product_id: number;
    company_id: number;
    modalOpen: boolean = false;
    selectedImg = '';
    show;
    selectedAttachment;
    isLoading;
    product;
    retailPrices;
    shopCategories;
    finishCount = 0;
    productSubscription: Subscription;

    constructor(private inventorySerivce: InventoryService,
        private route: ActivatedRoute,
        private shopService: ShopService,
        private router: Router,
        private inventoryService: InventoryService,
        private shopManagementService: ShopManagementService,
        private dialogService: DialogService) {

    }

    ngOnInit() {
        this.product_id = +this.route.snapshot.paramMap.get('pid');
        this.company_id = +this.route.snapshot.paramMap.get('cid');
        this.getProductDetail();
        this.getRetailPrices();
        this.getShopCatgory();

    }

    ngOnDestroy() {

    }

    getProductDetail() {
        this.isLoading = true;
        this.inventorySerivce.getProductInfo(this.company_id, this.product_id).subscribe(
            (res) => {
                this.isLoading = false;
                this.product = res;
            },
            (err) => {
            },
            () => {

            }
        )
    }

    onGetImg(obj) {
        let images = [];
        obj.forEach((img) => {
            images.push(img.id);
        })
        this.isLoading = true;
        let data = { image: obj[0].url, images: images };
        this.inventorySerivce.editProduct(this.company_id, this.product_id, data).subscribe(
            (res) => {
                this.getProductDetail();
            }
        )
    }

    getShopCatgory() {
        this.shopService.getShopCategory().subscribe(
            (res) => {
                this.shopCategories = res;
            }
        )
    }

    getRetailPrices() {
        this.inventorySerivce.getRetailPriceTable(this.company_id, this.product_id).subscribe(
            (res) => {

                res.forEach(
                    (priceObj) => {
                        priceObj.price /= 100;
                    }
                )
                this.retailPrices = res;
            }
        )
    }

    closeModal() {
        this.modalOpen = false;
        this.selectedImg = '';
        this.show = '';
        this.selectedAttachment = '';
    }

    openModal(url) {
        this.selectedImg = url;
        this.modalOpen = true;
    }

    onGetData(obj) {
        this.isLoading = true;
        this.shopService.updateShopProductCategory(this.company_id, this.product_id, obj).subscribe(
            (res) => {
                this.isLoading = false;
                this.getProductDetail();
            }
        )
    }

    onReceivePriceTable(priceTable) {
        this.isLoading = true;
        let priceFormLength = priceTable.prices.length;
        // console.log(priceFormLength);
        priceTable.prices.forEach(
            (priceObj) => {
                priceObj.price *= 100;
                this.inventoryService.addRetailPrice(this.company_id, this.product_id, priceObj).subscribe(
                    (res) => {
                        this.finishCount++;
                    },
                    () => { },
                    () => {
                        if (this.finishCount == priceFormLength) {
                            this.isLoading = false;
                            this.retailPrices = [];
                            this.getRetailPrices();
                        }
                    }
                )
            }
        )
    }

    changeToOnline() {
        this.checkProductBeforeChangeStatus();
        let obj = { shop_status: 3 };
        this.updateProductInfo(obj);
    }

    checkProductBeforeChangeStatus(){
        if (this.product && !this.product.description) {
            this.dialogService.openAlertDialog("Please add product description!")
            return;
        }
        if(this.product && this.product.warehouses && this.product.warehouses.length < 1){
            this.dialogService.openAlertDialog("The product is out of stock, please add product inventory in any warehouse!").subscribe(
                res => {
                    if(res){
                        this.router.navigateByUrl(`/company/${this.company_id}/inventory/product`);
                    }
                }
            )
            return;
        }
    }

    changeToOffline() {
        this.checkProductBeforeChangeStatus();
        let obj = { shop_status: 2 };
        this.updateProductInfo(obj);
    }

    onGetDes(description) {
        this.isLoading = true;
        this.inventorySerivce.editProductAllInfo(this.company_id, this.product_id, description).subscribe(
            res => {
                this.product = res;
                this.isLoading = false;
            },
            (err) => {
                this.isLoading = false;
            }
        )
    }

    checkProduct() {
        return (this.product && this.retailPrices && this.retailPrices.length > 0 && this.product.shop_first_category && this.product.images.length > 0);
    }

    updateProductInfo(obj) {
        this.isLoading = true;
        this.shopService.updateProduct(this.company_id, this.product_id, obj).subscribe(
            (res) => {
                this.isLoading = false;
            }
        )

        if (obj.shop_status == 3) {
            this.inventoryService.getProductInfo(this.company_id, this.product_id).subscribe(
                (res) => {
                    let product = res;
                    let price_table;
                    this.inventoryService.getRetailPriceTable(this.company_id, this.product_id).subscribe(
                        (res) => {
                            console.log(product, product.description);
                            product['price_table'] = res;
                            let obj = {
                                name: product.name,
                                description: product.description,
                                image: this.processImg(product['images']),
                                company_id: this.company_id,
                                company_product_id: this.product_id,
                                first_category: product.shop_first_category,
                                second_category: product.shop_second_category,
                                third_category: product.shop_third_category,
                                retail_prices: res,
                                warehouses: this.processWarehouseAddressId(product.warehouses)
                            }

                            this.shopService.addProductFromCompanyToOrcashop(171, obj).subscribe(
                                (res) => {
                                    this.router.navigateByUrl(`/company/${this.company_id}/shop-management/main`);
                                },
                                (err) => {
                                }
                            )
                        }
                    )


                }
            )
        } else {
            this.router.navigateByUrl(`/company/${this.company_id}/shop-management/main`);
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

}
