import {Component, OnInit} from '@angular/core';
import { ShopService } from '../../../../core/services/shop.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'shop-add-product',
    templateUrl:'./add-shop-product.component.html',
    styleUrls:['./add-shop-product.component.scss']
})

export class AddShopProductComponent implements OnInit{
    searchPlaceholder = 'Search Products';
    products;
    company_id : number;
    term : string = '';
    selectedProducts = [];
    selectedProductsMap = new Set();
    count : number = 0;
    constructor(private shopService: ShopService,
                private route: ActivatedRoute,
                private router: Router){
        this.company_id = +this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit(){
        this.getAllPublicProducts('');
        setTimeout(() => {
            let buttonClick = document.getElementById('header-submit-edit');
            buttonClick.addEventListener('click', ()=> this.onSave());
        })
     
    }

    onGetSearch(term){
        this.term = term;
        this.getAllPublicProducts(this.term);
    }

    getAllPublicProducts(term){
        this.shopService.searchPublicProduct(this.company_id, 2, this.term).subscribe(
            (res) => {
                this.products = res.data;
            }
        )
    }

    onSave(){
        if(this.selectedProducts.length > 0){
            (<HTMLButtonElement>document.getElementById('header-submit-edit')).disabled = true;
            let obj = {shop_status : 1};
            this.selectedProducts.forEach((product) => {
                this.shopService.updateProduct(this.company_id, product.id, obj).subscribe(
                    (res) => {

                    },
                    (err) => {},
                    () => {
                        this.count++;
                        if(this.count == this.selectedProducts.length){
                            this.router.navigate([`/company/${this.company_id}/shop-management/main`]); 
                        }
                    }
                )
            })
        }
    }
    
    onGetSelectedProduct(product){
        if(!this.selectedProductsMap.has(product.id)){
            this.selectedProductsMap.add(product.id);
            this.selectedProducts.push(product);
        }
    }
}