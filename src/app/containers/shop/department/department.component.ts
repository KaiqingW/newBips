import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { InventoryService } from 'app/core/services/inventory.service';
import { ShopService } from 'app/core/services/shop.service';
import { SearchService } from '../../../core/services/search.service';
import { CartService } from 'app/core/services/cart.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit, OnDestroy {
  vb_id;
  cate;
  currentLoginCompanyId;
  isLoading : boolean = false;
  search_obj = {};
  productList;
  firstCate;
  secondCate;
  thirdCate;
  previous;
  current;
  next;
  last;
  pageUrl;
  nextPageUrl;
  lastPageUrl;
  // @HostListener('window:scroll', ['$event']) onScrollEvent($event){
  //   console.log($event);
  //   console.log("scrolling");
  // } 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private shopService: ShopService,
    private cartService: CartService,
    private searchService: SearchService,
  ) {
    this.currentLoginCompanyId = 171;
    // this.getServiceProducts();
    this.route.params.subscribe(params => {
      this.cate = this.route.snapshot.paramMap.get('category');
      // this.init();
      this.searchProduct();
      this.getVbId();
    })

  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  getServiceProducts() {
    if (this.shopService.getProductName()) {
      this.onGetTerm(this.shopService.getProductName())
    } else if (this.shopService.getSearchObj()) {
      this.search_obj = this.shopService.getSearchObj();
      this.searchProduct();
    } else {
      this.searchProduct();
    }
  }

  onScroll(evt) {
    let container = document.getElementById('container');
    if ((container.offsetHeight + container.scrollTop + 10) >= container.scrollHeight) {
      if (this.next && !this.isLoading) {
        this.isLoading = true;
        this.searchService.getSearchProductsByUrl(this.next).subscribe(
          (res) => {
            this.productList = this.productList.concat(res.data);
            this.current = res.paging.current_page;
            this.previous = res.paging.previous;
            this.next = res.paging.next;
            this.isLoading = false;
          },
          (err) => {
            this.isLoading = false;

          }
        )
      }
    }
  }

  getProducts() {
    this.inventoryService.getShopProductList(this.currentLoginCompanyId).subscribe(
      (res) => {
        this.productList = res.data;
        this.isLoading = false;
      }
    )
  }

  getVbId() {
    if (localStorage.getItem("orcasmart_access_token")) {
      this.cartService.getMe().subscribe(
        (res) => {
          for (let i = 0; i < res.user.employed_companies.length; i++) {
            if (res.user.employed_companies[i].type == 0) {
              this.vb_id = res.user.employed_companies[i].id;
            }
          }
        }
      )
    }
  }

  onGetTerm(term) {
    Object.assign(this.search_obj, { name: term });
    this.searchProduct();
  }

  searchProduct() {
    this.isLoading = true;
    // this.search_obj = this.shopService.getSearchObj();
    this.search_obj = JSON.parse(this.cate);
    if (this.search_obj['first_category']) {
      this.firstCate = this.search_obj['first_category'];
      if (this.search_obj['second_category']) {
        this.secondCate = this.search_obj['second_category'];
        if (this.search_obj['third_category']) {
          this.thirdCate = this.search_obj['third_category'];
        } else {
          this.thirdCate = null;
        }
      } else {
        this.secondCate = null;
        this.thirdCate = null;
      }
    } else {
      this.firstCate = null;
      this.secondCate = null;
      this.thirdCate = null;
    }

    this.searchService.searchShopProduct(this.currentLoginCompanyId, this.search_obj).subscribe(
      (res) => {
        this.isLoading = false;
        this.productList = res.data;
        this.current = res.paging.current_page;
        this.last = res.paging.last_page;
        if (res.paging.next) {
          this.nextPageUrl = true;
          this.lastPageUrl = true;
          this.next = res.paging.next;
          this.pageUrl = res.paging.next.split('page')[0];
        } else {
          this.nextPageUrl = false;
          this.lastPageUrl = false;
        }
      }
    )
  }

  nextPage() {
    this.searchService.getSearchProductsByUrl(this.next).subscribe(
      (res) => {
        this.productList = res.data;
        this.current = res.paging.current_page;
        this.previous = res.paging.previous;
        if (res.paging.next) {
          this.nextPageUrl = true;
          this.lastPageUrl = true;
          this.next = res.paging.next;
        } else {
          this.nextPageUrl = false;
          this.lastPageUrl = false;
        }

      },
      (err) => {

      }
    )
  }

  previousPage() {
    let content = document.getElementById('content');
    content.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    this.nextPageUrl = true;
    this.lastPageUrl = true;
    this.searchService.getSearchProductsByUrl(this.previous).subscribe(
      (res) => {
        this.productList = res.data;
        this.current = res.paging.current_page;
        this.next = res.paging.next;
        this.nextPageUrl = true;
        if (res.paging.previous) {
          this.previous = res.paging.previous;
        } else {
        }

      },
      (err) => {

      }
    )
  }

  firstPage() {
    let firstpageurl;
    firstpageurl = this.pageUrl + 'page=1';
    this.searchService.getSearchProductsByUrl(firstpageurl).subscribe(
      (res) => {
        this.productList = res.data;
        this.current = res.paging.current_page;
        this.next = this.pageUrl + 'page=2';
        this.nextPageUrl = true;
        this.lastPageUrl = true;
        window.scrollTo(0, 0);
      },
      (err) => {

      }
    )
  }

  lastPage() {
    let lastpageurl;
    lastpageurl = this.pageUrl + 'page=' + this.last;
    this.searchService.getSearchProductsByUrl(lastpageurl).subscribe(
      (res) => {
        this.productList = res.data;
        this.current = res.paging.current_page;
        this.previous = this.pageUrl + 'page=' + (+this.last - 1);
        this.nextPageUrl = false;
        this.lastPageUrl = false;
      },
      (err) => {

      }
    )
  }

  onNavToDetail($event, prodid, shopcid, shoppid) {
    this.isLoading = true;
    let cid = +shopcid;
    let pid = +shoppid;
    $event.stopPropagation();

    if (cid && pid) {
      let obj = new Object;
      obj['product_id'] = prodid;
      if (this.vb_id) {
        this.shopService.addShopViewedProduct(this.vb_id, obj).subscribe(
          (res) => {
            this.router.navigateByUrl(`/shop/item/${cid}/${pid}`);
            // document.location.href = environment.ORCA_SHOP_API + 'shop/item/' + cid + '/' + pid;
          }
        )
      } else {
        this.router.navigateByUrl(`/shop/item/${cid}/${pid}`);
      }
    }
  }

  setAllCategory() {
    let search_obj = {};
    search_obj['name'] = "";
    search_obj['first_category'] = null;
    this.setLocalCate(search_obj);
  }

  setLocalCate(search_obj) {
    let category = JSON.stringify(search_obj);
    localStorage.setItem('category', category);
    this.router.navigateByUrl(`/shop/item/${category}`);
  }

  searchByNav(level) {
    if (level == 'first') {
      this.search_obj['second_category'] = null;
      this.search_obj['third_category'] = null;
    }
    if (level == 'second') {
      this.search_obj['third_category'] = null;
    }
    if (level == 'third') {

    }
    this.cate = JSON.stringify(this.search_obj);
    this.searchProduct();
  }

  onGetFilterObj(obj) {
    this.search_obj = {
      name: this.search_obj['name']
    }
    Object.assign(this.search_obj, obj);
    this.searchProduct();
  }

  onGetClear(clear) {
    if (clear) {
      this.search_obj = {};
      this.getProducts();
    }
  }

}