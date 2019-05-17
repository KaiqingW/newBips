import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { SearchService } from '../../../../../core/services/search.service';
import { ShopService } from '../../../../../core/services/shop.service';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { DeleteCurrentUser } from '../../../../../core/actions/auth.action';

@Component({
  selector: 'app-add-related-products',
  templateUrl: './add-related-products.component.html',
  styleUrls: ['./add-related-products.component.scss']
})

export class AddRelatedProductsComponent implements OnInit {
  searchPlaceholder = 'Search Products';
  products;
  company_id: number;
  term: string = '';
  selectedProductsMap = new Set();
  count: number = 0;
  editMode: boolean = false;
  @Input() selectedProducts = [];
  @Output() onSendRelatedProducts = new EventEmitter<any>();
  @Output() sendDeleteProduct = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();

  constructor(private shopService: ShopService,
      private route: ActivatedRoute,
      private router: Router,
      private inventoryService: InventoryService) {
      this.company_id = +this.route.snapshot.paramMap.get('cid');
  }

  ngOnInit() {
      this.getAllPublicProducts('');
  }

  onGetSearch(term) {
      this.term = term;
      this.getAllPublicProducts(this.term);
  }

  getAllPublicProducts(term) {
      this.shopService.searchPublicProduct(this.company_id, 2, this.term).subscribe(
          (res) => {
              this.products = res.data;
          }
      )
  }

  onSave() {
      let productIds = [];
      this.editMode = false;

      if (this.selectedProducts.length > 0) {
          // (<HTMLButtonElement>document.getElementById('header-submit-edit')).disabled = true;
          productIds = this.selectedProducts.map(product => {
              return product.id;
          });
          // let preProductIds = this.selectedProducts.map(product => {
          //     return product.id;
          // });
      }
      let obj = {
          'products': productIds
      };
      // console.log(obj);
      this.onSendRelatedProducts.emit(obj);

  }

  onGetSelectedProduct(product) {
      if (!this.selectedProductsMap.has(product.id)) {
          this.selectedProductsMap.add(product.id);
          this.selectedProducts.push(product);
      }
  }

  onGetDeleteProduct(deleteProduct) {
      if (this.selectedProducts && this.selectedProducts.length > 0) {
          this.selectedProducts = this.selectedProducts.filter((product, index) => {
              return product.id != deleteProduct.id;
          })
          this.selectedProductsMap.delete(deleteProduct.id);
      }
  }

  onClickCancel() {
      if (this.editMode) {
          this.refresh.emit();
      }
      this.editMode = !this.editMode;
  }
}

