import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Order_Item, Order } from "../models/index";
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subject} from 'rxjs/Subject';

@Injectable()
export class OrdersService {
  token: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) { }
  orders: Order[] = [];
  localOrderItems = [];
  localSharedContacts = [];
  orderFormInfo;
  currentNote;
  Account$;
  selectedOrderCustomerId: number;
  product_id: number;
  public containe_number_msg = new Subject<String>();

  setContainerNumberMsg(container_number){
    this.containe_number_msg.next(container_number);
  }

  public getCompanyDefinedColumn(company_id, model_name): Observable<any> {
    return this.http.get(environment.ORCA_API + `setting/company/${company_id}/${model_name}/company_defined_column`);
  }

  // if there is customer_is, get orders by customer_id; if not, get all orders
  public getOrders(id, customer_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${id}/order?customer_id=${customer_id}`);
  }

  public deleteUnread(company_id, order_id, order_item_id, info): Observable<any> {
    return this.http.delete(environment.ORCA_API + `company/${company_id}/order/${order_id}/order_item/${order_item_id}/read`, info);
  }

  public markUnread(company_id , info) : Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/order/destroy_unread`, info);
  }

  public getProdcutionSubject(company_id, order_item_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/order_item/${order_item_id}/production`);
  }

  public addProdcutionSubject(company_id, order_item_id, production_subject_obj): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/order_item/${order_item_id}/production`, production_subject_obj);
  }
  
  public addProdcutionSchedule(company_id, subject_id, obj): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/production/subject/${subject_id}/schedule`, obj);
  }

  public editProdcutionSchedule(company_id, schedule_id, obj): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/production/schedule/${schedule_id}`, obj);
  }

  public addOrder(order, id): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${id}/order`, order);
  }

  public getStatusInfo(company, order_id, order_item_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company}/order/${order_id}/order_item/${order_item_id}`);
  }

  public addOrderItem(orderItem, company_id, order_id): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/order/${order_id}/order_item`, orderItem);
  }

  public shareOrder(companyId, orderId, sharedEmail): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${companyId}/order/${orderId}/shared_user`, sharedEmail);
  }

  public getSharedOrder(vendorCompanyId, selfCompanyId): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${vendorCompanyId}/sharing/order/${selfCompanyId}`);
  }
  
  public checkEditOrderStatusAuth(company_id, order_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/checkEditAuth/${order_id}`);
  }

  public searchOrderItemShipping(company_id, container_number): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/order_item_shipping/search?container_number=${container_number}`);
  }

  public getOrderSharedUser(companyId, orderId): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${companyId}/order/${orderId}/shared_user`);
  }

  public getOrderDetail(companyId, orderId): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${companyId}/order/${orderId}`);
  }

  public getOrderItems(company_id, order_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/order/${order_id}/order_item`)
  }

  public getOrderItemAttachments(company_id, order_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/order_item/${order_id}/attachments`)
  }

  public getOrderItemShipping(company_id, container_number): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/order_item_shipping/container_number/${container_number}`)
  }
  
  public getContainerItems(company, container_number): Observable<any> {
    var container_num = encodeURIComponent(container_number);
    return this.http.get(environment.ORCA_API + `company/${company}/containers/${container_num}/items`)
  }

  public getOrderItem(companyId, itemId): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${companyId}/order_item/${itemId}`)
  }

  public getNextOrders(next): Observable<any> {
    return this.http.get(next);
  }

  public getNext(next): Observable<any> {
    return this.http.get(next);
  }

  public addAttachment(company_id, order_item_id, attachment): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/order_item/${order_item_id}/attachment`, attachment);
  }

  public updateOrderItem(company_id, order_item_id, info): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/order_item/${order_item_id}`, info);
  }

  public updateOrder(company_id, order_id, info): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/order/${order_id}`, info);
  }
  
  public updateOrderPriority(company_id, order_id): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/order/${order_id}/priority`, 'null');
  }

  public asignShippingWarehouse(company_id, order_item_shipping_id, data): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/order_item_shipping/${order_item_shipping_id}/warehouse`, data);
  }

  public getOrderItemALLShipping(company_id, order_item_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/order_item/${order_item_id}/order_item_shipping/all`);
  } 

  public getLocalOrderItems() {
    return this.localOrderItems;
  }

  public addLocalOrderItems(orderItem) {
    this.localOrderItems.push(orderItem);
  }

  public removeLocalOrderItem(index) {
    this.localOrderItems.splice(index, 1);
  }

  public resetLocalOrderItems() {
    this.localOrderItems = [];
  }

  // save localSharedContacts on global service
  public getLocalSharedContacts() {
    return this.localSharedContacts;
  }

  public addLocalSharedContacts(contact) {
    this.localSharedContacts.push(contact);
  }

  public removeLocalSharedContacts(index) {
    this.localSharedContacts.splice(index, 1);
  }

  public resetLocalSharedContacts() {
    this.localSharedContacts = [];
  }

  // save order form on global service
  public saveOrderFormInfo(info) {
    this.orderFormInfo = info;
  }

  public saveCustomerAccount(account) {
    this.Account$ = account;
  }

  public resetOrderFormInfo() {
    this.orderFormInfo = '';
  }

  public getOrderFormInfo() {
    return this.orderFormInfo;
  }
  //

  public getSelectedNote() {
    return this.currentNote;
  }

  public setNote(note) {
    this.currentNote = note;
  }

  public getCustomerAccount() {
    return this.Account$;
  }

  public resetCustomerAccount() {
    this.Account$ = null;
  }

  public setSelectOrderCustomer(cust) {
    if (cust) {
      this.selectedOrderCustomerId = cust.id;
    } else {
      this.selectedOrderCustomerId = 0;
    }
  }

  public getSelectOrderCustomer() {
    return this.selectedOrderCustomerId;
  }

  public setPdId(id) {
    this.product_id = id;
  }

  public getPdId() {
    return this.product_id;
  }
}
