import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ShopService } from '../../../core/services/shop.service';
import { SearchService } from '../../../core/services/search.service';

@Component({
    selector: 'shop-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})

export class ShopSearchBarComponent implements OnInit {
    searchCtrl: FormControl = new FormControl();
    showFilterModal: boolean = false;
    categoryForm: FormGroup;
    searchInfo = {};
    categories;
    showCategory = "All";
    productName;
    search_obj;

    @Output() sendTerm = new EventEmitter<String>();
    @Output() sendFilterObject = new EventEmitter<any>();
    @Output() sendClear = new EventEmitter<any>();
    carousel_categories = [
        {
          first: 'Outdoors',
          second: 'Cycling',
          title: 'Outdoors',
          img: 'assets/images/shop-cate/outdoors.png'
        },
        {
          first: 'Toys, Kids and Baby',
          second: '',
          title: 'Toys',
          img: 'assets/images/shop-cate/toys.png'
        },
        {
          first: 'Electronics',
          second: 'Cell Phones and Accessories',
          title: 'Phone Case',
          img: 'assets/images/shop-cate/phone-case.png'
        },
        {
          first: 'Electronics',
          second: '',
          title: 'Electronics',
          img: 'assets/images/shop-cate/electronic.png'
        },
        {
          first: 'Automotive and Industrial',
          second: '',
          title: 'Automotive',
          img: 'assets/images/shop-cate/automotive.png'
        },
        {
          first: 'Beauty, Health and Personal Care',
          second: '',
          title: 'Health',
          img: 'assets/images/shop-cate/health.png'
        },
        {
          first: 'Industrial and Scientific',
          second: '',
          title: 'Packaging',
          img: 'assets/images/shop-cate/packaging.png'
        },
        {
          first: 'Electronics',
          second: 'Drone',
          title: 'Drone',
          img: 'assets/images/shop-cate/1.png'
        },
        {
          first: 'Electronics',
          second: '',
          title: 'Toys',
          img: 'assets/images/shop-cate/2.png'
        },
        {
          first: 'Beauty, Health and Personal Care',
          second: 'Massage Chair',
          title: 'Massage Chair',
          img: 'assets/images/shop-cate/3.png'
        },
        {
          first: 'Electronics',
          second: 'Smart Watch',
          title: 'Smart Watch',
          img: 'assets/images/shop-cate/4.png'
        },
        {
          first: 'Electronics',
          second: 'Underwater Drone',
          title: 'Underwater Drone',
          img: 'assets/images/shop-cate/5.png'
        },
        {
          first: 'Electronics',
          second: 'Bluetooth Earbuds',
          title: 'Bluetooth Earbuds',
          img: 'assets/images/shop-cate/6.png'
        },
      ];

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private shopService: ShopService,
        private searchService: SearchService
    ) {

        this.getCategories();
        if (this.shopService.getSearchObj()) {
            console.log(this.shopService.getSearchObj());
            Object.keys(this.shopService.getSearchObj()).forEach(
                (each) => {
                    this.showCategory = this.shopService.getSearchObj()[each];
                    console.log(this.showCategory);
                }
            )
            // this.showCategory = this.shopService.getSearchObj();
            // console.log(this.search_obj);
            // this.searchProduct();
        }
    }

    ngOnInit() {
        this.initForm();
        // this.searchCtrl.valueChanges.subscribe(
        //     (term) => {
        //         console.log(term);
        //         this.sendTerm.emit(term);
        //     }
        // )
    }

    createCateogryForm() {
        this.categoryForm = this.fb.group({
            first_category: [],
            second_category: [],
            third_category: []
        })
    }

    initForm() {
        this.createCateogryForm();
        this.categoryForm.get('first_category').valueChanges.subscribe(val => {
            this.categoryForm.patchValue({
                second_category: "",
                third_category: ""
            });
            console.log(this.categoryForm.value);
            // if (this.categoryForm.value.first_category) {
            //     this.onSelectCategory({ first_category: this.categoryForm.value.first_category.name });
            // }
        });

        this.categoryForm.get('second_category').valueChanges.subscribe(val => {
            this.categoryForm.patchValue({
                third_category: ""
            });
            // if (this.categoryForm.value.second_category) {
            //     this.onSelectCategory({ second_category: this.categoryForm.value.second_category.name });
            // }
        });

        // this.categoryForm.get('third_category').valueChanges.subscribe(val => {
        //     if (this.categoryForm.value.third_category) {
        //         this.onSelectCategory({ third_category: this.categoryForm.value.third_category.name });
        //     }
        // });
    }


    onSelectCategory(category) {
        // this.searchInfo = {};
        Object.keys(category).forEach((each) => {
            this.searchInfo[each] = category[each];
        })
        console.log(this.searchInfo);
    }

    getCategories() {
        this.shopService.getShopCategory().subscribe(
            (res) => {
                console.log('category ', res);
                this.categories = res;
            }
        )
    }

    showFilter() {
        this.showFilterModal = !this.showFilterModal;
    }

    searchByProdName() {
        console.log(this.productName);
        // this.sendTerm.emit(this.productName);
        if (this.search_obj) {
            // console.log("?????????");
            Object.assign(this.search_obj, { name: this.productName });
            console.log(this.search_obj);
            this.setLocalCate(this.search_obj);
        } else {
            let search_obj = { name: this.productName };
            this.setLocalCate(search_obj);
        }
    }

    confirmCate() {
        this.showFilterModal = false;
        let search_obj = {};
        console.log(this.categoryForm.value);
        Object.keys(this.categoryForm.value).forEach((each) => {
            if (this.categoryForm.value[each]) {
                search_obj[each] = this.categoryForm.value[each].name;
                console.log(search_obj[each]);
                this.showCategory = search_obj[each];
                console.log(this.showCategory);
            }
        })
        console.log(search_obj);
        this.search_obj = search_obj;
        console.log(this.search_obj);
        // this.sendFilterObject.emit(search_obj);
        // this.setLocalCate(search_obj);
    }

    clear() {
        this.categoryForm.reset();
        console.log(this.categoryForm);
        // this.searchCtrl.reset();
        // this.showCategory = "All";
        // this.sendClear.emit(true);
        this.search_obj = {};
        this.showCategory = "All";
        console.log(this.search_obj);
        this.showFilterModal = !this.showFilterModal;
    }

    setFirstCategory(category) {
        console.log(category.first);
        //console.log(second);
        let search_obj = {};
        search_obj['name'] = "";
        search_obj['first_category'] = category.first;
        search_obj['second_category'] = category.second;
        console.log(search_obj);
        // this.sendFilterObject.emit(search_obj);
        // this.secondCategory = null;
        // this.showFirstCate = false;
        this.setLocalCate(search_obj);
    }

    setLocalCate(search_obj) {
        let category = JSON.stringify(search_obj);
        localStorage.setItem('category', category);
        this.router.navigateByUrl(`/shop/item/${category}`);
        this.categoryForm.reset();
    }

}