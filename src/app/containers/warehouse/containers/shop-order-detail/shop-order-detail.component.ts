import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../../core/services/shop.service';
import { QuoteService } from '../../../../core/services/quote.service';
import { Location } from '@angular/common';
import { CartService } from '../../../../core/services/cart.service';
import { VrmBaBaService } from '../../../vrm/vrm.service';
import { DialogService } from '../../../../core/services/dialog.service';

@Component({
    selector: 'app-shop-order-detail',
    templateUrl: './shop-order-detail.component.html',
    styleUrls: ['./shop-order-detail.component.scss']
})

export class ShopOrderDetailComponent implements OnInit {
    order;
    order_id: number;
    company_id: number;
    warehouses;
    selectedWarehouse;
    isLoading: boolean = false;
    companies;
    total_shipping_fee;
    customer_id_in_orcashop: number;
    customer_company_id: number;
    invoice_total_price: number;
    shop_order_all_products;
    all_sended_products;

    constructor(private route: ActivatedRoute,
        private shopService: ShopService,
        private quoteService: QuoteService,
        private location: Location,
        private cartService: CartService,
        private vrmService: VrmBaBaService,
        private dialogService: DialogService) { }

    ngOnInit() {
        this.company_id = +this.route.snapshot.paramMap.get('cid');
        this.order_id = +this.route.snapshot.paramMap.get('oid');
        if (!this.company_id) {
            this.company_id = 171;
        }
        this.getOrder();
        setTimeout(() => {
            const buttonClick = document.getElementById("header-submit-edit");
            buttonClick.addEventListener("click", () => {
                // sometimes both noteForm.invalid and noteForm.valid are false;
                this.onSave();
            });
        }, 0);
    }

    getOrder() {
        this.shopService.getShopOrderDetail(this.company_id, this.order_id).subscribe(
            res => {
                this.order = res;
                this.companies = res.shop_companies;
                this.total_shipping_fee = this.order.shop_companies.map(x => x.total_shipping_fee).reduce((a, b) => +a + +b);
                this.customer_company_id = this.order.company_id;
                this.getAShopOrderAllInvoices();
                this.getCustomerCompanyInfoFromOrcaShop();
            }
        )
    }

    getCustomerCompanyInfoFromOrcaShop() {
        this.vrmService.getCustomerInfoByCompanyId(171, this.customer_company_id).subscribe(
            customers => {
                customers.forEach(customer => {
                    if (customer.type && customer.type == 8) {
                        this.customer_id_in_orcashop = customer.id;
                    }
                })
            }
        )
    }

    onSave() {
        let invoice_products = [];
        let invoiceProducts = this.processProduct(invoice_products);
        let invoice = {};
        invoice['customer_id'] = this.order.customer_id;
        invoice['billing_address_id'] = this.order.shipping_address.id;
        invoice['shipping_address_id'] = this.order.shipping_address.id;
        invoice['type'] = 20;
        invoice['po_number'] = this.order.order_number;
        invoice['shipping_method'] = "";
        invoice['description'] = "This is invoice.";
        invoice['total'] = this.invoice_total_price;
        invoice['shop_order_id'] = this.order.id;
        invoice['products'] = invoiceProducts;

        if (invoice.hasOwnProperty('products') && invoice['products'].length > 0) {

            // check product number before add new invoice;
            if (!this.checkProductNumber(invoice)) return;

            //add inovice to seller part
            this.quoteService.addQuote(this.company_id, this.order.customer_id, invoice).subscribe(
                res => {
                    //add invoice to orcasmart
                    invoice['customer_id'] = this.customer_id_in_orcashop;
                    this.quoteService.addQuoteToOrcaShop(171, this.company_id, this.customer_id_in_orcashop, invoice).subscribe(res => {
                        this.location.back();
                    })
                }
            )
        }
    }

    getAShopOrderAllInvoices() {
        this.quoteService.getAShopOrderAllInvoices(this.company_id, this.order.id).subscribe(
            invoices => {
                let all_products = [];
                let all_sended_products = [];
                invoices.forEach(invoice => {
                    if (invoice.type == 10) {
                        all_products = invoice.products;
                    } else if (invoice.type == 20) {
                        all_sended_products = all_sended_products.concat(invoice.products);
                    }
                });
                let map = new Map();
                for (var i = 0; i < all_sended_products.length; i++) {
                    let curt = all_sended_products[i];
                    if (!map.has(curt.product_id)) {
                        map.set(curt.product_id, i);
                    } else {
                        all_sended_products[map.get(curt.product_id)].quantity += +curt.quantity;
                        all_sended_products.splice(i, 1);
                        i--;
                    }
                }
                this.shop_order_all_products = all_products;
                this.all_sended_products = all_sended_products;
            }
        )
    }

    processProduct(invoiceProducts) {
        this.order.shop_companies[0].shop_order_warehouses.forEach(warehouse => {
            warehouse.products.forEach(product => {
                if (product.hasOwnProperty('send-qty') && product['send-qty']) {
                    let invoice_product = {};
                    invoice_product['description'] = product.description;
                    invoice_product['name'] = product.name;
                    invoice_product['product_id'] = product.id;
                    invoice_product['quantity'] = product['send-qty'];
                    invoice_product['rate'] = product.unit_price;
                    invoice_product['approved'] = 10;
                    invoiceProducts.push(invoice_product);
                    this.invoice_total_price += product['send-qty'] * product.unit_price;
                }
            })
        });
        return invoiceProducts;
    }

    checkProductNumber(invoice) {
        let res = true;
        let invoice_products = invoice.products;
        let final_products = invoice_products.concat(this.all_sended_products);
        let map = new Map();
        for (var i = 0; i < final_products.length; i++) {
            let curt = final_products[i];
            if (!map.has(curt.product_id)) {
                map.set(curt.product_id, i);
            } else {
                final_products[map.get(curt.product_id)].quantity += +curt.quantity;
                final_products.splice(i, 1);
                i--;
            }
        }

        for (var i = 0; i < final_products.length; i++) {
            for (var j = 0; j < this.shop_order_all_products.length; j++) {
                if (this.shop_order_all_products[j].product_id == final_products[i].product_id) {
                    if (this.shop_order_all_products[j].quantity < final_products[i].quantity) {
                        this.dialogService.openAlertDialog("You can\'t send more than required. Please select correct number.")
                        return false;
                    }
                }
            }
        }

        return res;
    }
}