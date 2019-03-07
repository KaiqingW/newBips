import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs';
// import { attachEmbeddedView } from '@angular/core/src/view';

@Injectable()
export class InventoryService {
  wholesalePriceMode = new Subject<any>();

  constructor(private http: HttpClient) { }

  public setwholesalePriceMode(mode) {
    this.wholesalePriceMode.next(mode);
  }

  // get the product list by your company
  public getProductList(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/product`);
  }

  // get orcashop product list
  public getShopProductList(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/shop/product`);
  }

  public getPagingProducts(next): Observable<any> {
    return this.http.get(next);
  }

  public getProductByShowcase(company_id, showcase): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/product/showcase/${showcase}`);
  }

  public getProductsByVenderId(company_id, vender_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/product/vender/${vender_id}`);
  }

  public getProductsByCustomerId(company_id, customer_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/product/customer/${customer_id}`);
  }

  public searchPathOnGoogleMap(q) {
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?&address=${q}&key=AIzaSyDreddPJLSQbrjQD9r4kTtmGlvdd0ZNsXA`);
  }


  public searchProductExist(company_id, field, query): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/search_product?f=${field}&q=${query}`);
  }

  public searchProductFuzzy(company_id, field, query): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/search_product/fuzzy?f=${field}&q=${query}`);
  }
  
  public checkEditProductAuth(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/product/checkEditAuth`);
  }

  public addShopSalesSubject(company_id, product_id, obj): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/inventory/product/${product_id}/sale_pitch_subject`, obj);
  }
  
  public addRetailPrice(company_id, product_id, priceObj): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/inventory/product/${product_id}/retailprice`, priceObj);
  }

  public getRetailPriceTable(company_id, product_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/product/${product_id}/retailprice`);
  }

  public editRetailPriceTable(company_id, product_id, priceObj): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/inventory/product/${product_id}/retailprice`, priceObj);
  }

  public addCategory(company_id, category): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/inventory/category`, category);
  }

  public editCategory(company_id, category_id, category): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/inventory/category/${category_id}`, category);
  }

  public editProduct(company_id, product_id, productInfo): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/inventory/product/${product_id}`, productInfo);
  }

  public editProductAllInfo(company_id, product_id, productInfo): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/inventory/product/${product_id}/all_info`, productInfo);
  }

  public dropCategory(company_id, category_id): Observable<any> {
    return this.http.delete(environment.ORCA_API + `company/${company_id}/inventory/category/${category_id}`);
  }

  public deleteProduct(company_id, product_id): Observable<any> {
    return this.http.delete(environment.ORCA_API + `company/${company_id}/inventory/product/${product_id}`);
  }


  public getTransactions(company_id, warehouse_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/warehouse/${warehouse_id}/transaction`);
  }

  public uploadImage(company_id, formData): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/uploaded_images`, formData);
  }

  public readCategory(company_id, category_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `  company/${company_id}/inventory/category/${category_id}`);
  }

  public getProductategory(company_id, product_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/product/${product_id}/category`);
  }

  public getPagingTransactions(next): Observable<any> {
    return this.http.get(next);
  }

  public addProduct(company_id, product): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/inventory/product`, product);
  }

  public getAllProductsFromOneWarehouse(company_id, warehouse_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/warehouse/${warehouse_id}/product`)
  }

  public addMultipuleTransactions(company_id, warehouse_id, transaction) {
    return this.http.post(environment.ORCA_API + `company/${company_id}/inventory/warehouse/${warehouse_id}/multipule/transaction`, transaction);
  }

  public editInventories(company_id, warehouse_id, inventories) {
    console.log(inventories);
    return this.http.patch(environment.ORCA_API + `company/${company_id}/inventory/warehouse/${warehouse_id}/product`, inventories);
  }

  public addTransaction(company_id, warehouse_id, transaction) {
    return this.http.post(environment.ORCA_API + `company/${company_id}/inventory/warehouse/${warehouse_id}/transaction`, transaction);
  }

  public getProductInfo(company_id, product_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/product/${product_id}`);
  }

  public getCompanyDefinedColumn(company_id, model_name): Observable<any> {
    return this.http.get(environment.ORCA_API + `setting/company/${company_id}/${model_name}/company_defined_column`);
  }

  public addAttachment(company_id, product_id, attachment) {
    return this.http.post(environment.ORCA_API + `company/${company_id}/inventory/product/${product_id}/attachment`, attachment);
  }

  public getCategories(company_id, type): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/category/${type}`);
  }

  public getAllCotainers(company_id, customer_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/containers?customer_id=${customer_id}`);
  }

  public getOneWarehouseWholesalePrices(company, warehouse_id, product_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company}/inventory/warehouse/${warehouse_id}/product/${product_id}/wholesaleprice`);
  }

  public getAllWarehousesWholesalePrices(company, product_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company}/inventory/product/${product_id}/wholesaleprice`);
  }

  public addWholesalePrices(company, warehouse_id, product_id, obj): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company}/inventory/warehouse/${warehouse_id}/product/${product_id}/wholesaleprice`, obj);
  }
  // public getAllCotainersWithCustomerId(company_id, customer_id): Observable<any> {
  //   return this.http.get(environment.ORCA_API + `company/${company_id}/containers?customer_id=${customer_id}`);
  // }

  public getProductListByPage(url): Observable<any> {
    return this.http.get(url);
  }
}
